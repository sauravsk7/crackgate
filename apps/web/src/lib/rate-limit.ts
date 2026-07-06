/** Simple in-memory rate limiter using a sliding-window counter.
 *  NOT shared across process restarts — suitable for single-server deploys.
 *  For multi-instance, replace with Redis-backed limiter. */
import { NextResponse } from "next/server";

interface Entry {
  count: number;
  resetAt: number;
}

const stores = new Map<string, Map<string, Entry>>();

// Periodic cleanup every 60s to prevent memory leaks from abandoned keys.
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [, entries] of stores) {
      for (const [id, e] of entries) {
        if (now > e.resetAt) entries.delete(id);
      }
    }
  }, 60_000).unref();
}

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  label: string;
}

const limiters = new Map<string, ReturnType<typeof createLimiter>>();

function createLimiter(cfg: RateLimitConfig) {
  const key = `${cfg.windowMs}:${cfg.max}`;
  let entries = stores.get(key);
  if (!entries) {
    entries = new Map();
    stores.set(key, entries);
  }
  return {
    check: (id: string): { allowed: boolean; remaining: number; resetAt: number } => {
      const now = Date.now();
      const e = entries!.get(id);
      if (!e || now > e.resetAt) {
        entries!.set(id, { count: 1, resetAt: now + cfg.windowMs });
        return { allowed: true, remaining: cfg.max - 1, resetAt: now + cfg.windowMs };
      }
      if (e.count >= cfg.max) {
        return { allowed: false, remaining: 0, resetAt: e.resetAt };
      }
      e.count++;
      return { allowed: true, remaining: cfg.max - e.count, resetAt: e.resetAt };
    },
    reset: (id: string) => { entries!.delete(id); },
  };
}

export function getLimiter(cfg: RateLimitConfig) {
  const k = `${cfg.windowMs}:${cfg.max}:${cfg.label}`;
  let inst = limiters.get(k);
  if (!inst) {
    inst = createLimiter(cfg);
    limiters.set(k, inst);
  }
  return inst;
}

export function rateLimitResponse(retryAfterSec: number) {
  return NextResponse.json(
    { error: "rate_limited", retryAfterSec },
    { status: 429, headers: { "Retry-After": String(retryAfterSec) } },
  );
}

/** Convenience — build an IP-based key from the request headers. */
export function ipFromRequest(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? req.headers.get("x-real-ip")
    ?? "unknown";
}

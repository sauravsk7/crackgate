import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@crackgate/database";
import { getLimiter, ipFromRequest, rateLimitResponse } from "@/lib/rate-limit";
import { getPostHogClient } from "@/lib/posthog";

const subscribeLimiter = getLimiter({ windowMs: 60 * 60 * 1000, max: 5, label: "newsletter:post" });

const bodySchema = z.object({
  email: z.string().trim().email(),
  source: z.string().max(50).optional().default("landing"),
});

export async function POST(request: Request) {
  const ip = ipFromRequest(request);
  const { allowed, resetAt } = subscribeLimiter.check(ip);
  if (!allowed) return rateLimitResponse(Math.ceil((resetAt - Date.now()) / 1000));

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const { email, source } = parsed.data;

  try {
    await db.newsletterSubscriber.create({
      data: { email, source, ip },
    });
    getPostHogClient()?.capture({
      distinctId: email,
      event: "newsletter_subscribed",
      properties: { source },
    });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    // P2002 = unique constraint violation — already subscribed
    if (typeof err === "object" && err !== null && "code" in err && (err as { code: string }).code === "P2002") {
      return NextResponse.json({ ok: true, existing: true });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

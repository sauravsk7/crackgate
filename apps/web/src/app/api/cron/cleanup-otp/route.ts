/** GET /api/cron/cleanup-otp
 *  Removes expired OTP codes and codes older than 7 days.
 *  Runs weekly via Vercel cron / EventBridge.
 *
 *  Auth: requires header `x-cron-secret: $CRON_SECRET`.
 */
import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (process.env.NODE_ENV === "production") {
    const want = process.env.CRON_SECRET;
    if (!want) return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
    const got = req.headers.get("x-cron-secret") ?? "";
    const wantBuf = Buffer.from(want);
    const gotBuf = Buffer.from(got);
    const ok = gotBuf.length === wantBuf.length && timingSafeEqual(gotBuf, wantBuf);
    if (!ok) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const cutoff = new Date(Date.now() - 7 * 86400_000);

  const { count } = await db.otpCode.deleteMany({
    where: { OR: [{ expiresAt: { lt: new Date() } }, { createdAt: { lt: cutoff } }] },
  });

  return NextResponse.json({ deleted: count });
}

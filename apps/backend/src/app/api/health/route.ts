/** GET /api/health — liveness probe.
 *  Also pings the database via the shared @crackgate/database client
 *  so we know the workspace wiring is correct. */
import { NextResponse } from "next/server";
import { db } from "@crackgate/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  let dbOk = false;
  let dbError: string | null = null;
  try {
    await db.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch (e) {
    dbError = (e as Error).message;
  }
  return NextResponse.json({
    service: "@crackgate/backend",
    ok: true,
    db: { ok: dbOk, error: dbError },
    ts: new Date().toISOString(),
  });
}

/** Admin: reject a pending UPI claim with a reason. */
import { getAdminSession } from "@/lib/admin";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const Body = z.object({
  reason: z.string().trim().min(3, "Reason too short").max(280),
});

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { id } = await ctx.params;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const claim = await db.upiPayment.findUnique({ where: { id } });
  if (!claim) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (claim.status !== "pending") {
    return NextResponse.json(
      { error: "already_reviewed", status: claim.status },
      { status: 409 },
    );
  }

  await db.upiPayment.update({
    where: { id },
    data: {
      status: "rejected",
      adminNote: parsed.data.reason,
      reviewedById: admin.userId || undefined,
      reviewedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}

/** Admin: approve a pending UPI claim and flip the user's plan. */
import { getAdminSession } from "@/lib/admin";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { sendPaymentReceipt } from "@/lib/whatsapp";

export const runtime = "nodejs";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { id } = await ctx.params;

  const claim = await db.upiPayment.findUnique({ where: { id } });
  if (!claim) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (claim.status !== "pending") {
    return NextResponse.json(
      { error: "already_reviewed", status: claim.status },
      { status: 409 },
    );
  }

  // Tier 0 policy: planExpiry = now + periodMonths (no compounding).
  const now = new Date();
  const expiry = new Date(now);
  expiry.setMonth(expiry.getMonth() + claim.periodMonths);

  // Synthetic Payment row keeps the admin/payments view + revenue math unified
  // with Razorpay captures. razorpayOrderId is namespaced "upi-<claim.id>" so
  // it can never collide with a real Razorpay order id.
  await db.$transaction([
    db.upiPayment.update({
      where: { id: claim.id },
      data: {
        status: "approved",
        reviewedById: admin.userId || undefined,
        reviewedAt: now,
      },
    }),
    db.user.update({
      where: { id: claim.userId },
      data: { plan: claim.plan, planExpiry: expiry },
    }),
    db.payment.create({
      data: {
        userId: claim.userId,
        razorpayOrderId: `upi-${claim.id}`,
        razorpayPaymentId: `upi-${claim.upiTxnRef}`,
        amount: claim.amountPaise,
        currency: "INR",
        plan: claim.plan,
        periodMonths: claim.periodMonths,
        status: "captured",
        capturedAt: now,
        raw: {
          source: "upi_manual",
          upiTxnRef: claim.upiTxnRef,
          upiApp: claim.upiApp,
          approvedBy: admin.email,
        },
      },
    }),
    db.activity.create({
      data: {
        userId: claim.userId,
        type: "plan_upgrade",
        payload: {
          source: "upi_manual",
          plan: claim.plan,
          months: claim.periodMonths,
          amountPaise: claim.amountPaise,
          upiTxnRef: claim.upiTxnRef,
          approvedBy: admin.email,
        },
      },
    }),
  ]);

  // Fire-and-forget WhatsApp receipt.
  try {
    const u = await db.user.findUnique({
      where: { id: claim.userId },
      select: { phone: true, name: true },
    });
    if (u?.phone) {
      await sendPaymentReceipt(u.phone, {
        name: u.name ?? "there",
        plan: claim.plan,
        amountRupees: Math.round(claim.amountPaise / 100),
        months: claim.periodMonths,
      });
    }
  } catch (e) {
    console.warn("[upi/approve] receipt failed:", (e as Error).message);
  }

  return NextResponse.json({ ok: true });
}

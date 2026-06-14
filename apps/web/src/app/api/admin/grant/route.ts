/** Admin: manually grant a plan to a user by email or phone.
 *  Mirrors the UPI-approve transaction (plan flip + synthetic Payment + Activity)
 *  so revenue/KPI views stay unified. Use for off-platform payments, comps,
 *  support fixes, etc. */
import { getAdminSession } from "@/lib/admin";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizePhone } from "@/lib/whatsapp";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

// Plan price in paise — kept in sync with /pay pricing.
const PLAN_PAISE = { pro: 49900, premium: 89900 } as const;

const Body = z.object({
  identifier: z.string().trim().min(3, "Enter an email or phone number"),
  plan: z.enum(["pro", "premium"]),
  months: z.coerce.number().int().min(1).max(60).default(18),
});

export async function POST(req: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { identifier, plan, months } = parsed.data;
  const isEmail = identifier.includes("@");

  const user = isEmail
    ? await db.user.findFirst({
        where: { email: { equals: identifier, mode: "insensitive" } },
        select: { id: true, email: true, name: true },
      })
    : await db.user.findUnique({
        where: { phone: normalizePhone(identifier) },
        select: { id: true, email: true, name: true },
      });

  if (!user) {
    return NextResponse.json(
      {
        error: "user_not_found",
        message: isEmail
          ? "No account with that email. They must sign in once first."
          : "No account with that phone. They must sign in once first.",
      },
      { status: 404 },
    );
  }

  const now = new Date();
  const expiry = new Date(now);
  expiry.setMonth(expiry.getMonth() + months);

  const amountPaise = PLAN_PAISE[plan];
  // Namespaced + random so it can never collide with Razorpay/UPI ids.
  const ref = `grant-${randomUUID()}`;

  await db.$transaction([
    db.user.update({
      where: { id: user.id },
      data: { plan, planExpiry: expiry },
    }),
    db.payment.create({
      data: {
        userId: user.id,
        razorpayOrderId: ref,
        razorpayPaymentId: `${ref}-pay`,
        amount: amountPaise,
        currency: "INR",
        plan,
        periodMonths: months,
        status: "captured",
        capturedAt: now,
        raw: { source: "manual_grant", grantedBy: admin.email },
      },
    }),
    db.activity.create({
      data: {
        userId: user.id,
        type: "plan_upgrade",
        payload: {
          source: "manual_grant",
          plan,
          months,
          amountPaise,
          grantedBy: admin.email,
        },
      },
    }),
  ]);

  return NextResponse.json({
    ok: true,
    user: { email: user.email, name: user.name },
    plan,
    months,
    expiry: expiry.toISOString().slice(0, 10),
  });
}

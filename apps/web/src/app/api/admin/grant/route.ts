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
import {
  DEFAULT_EXAM,
  DEFAULT_SUBJECT,
  getSubject,
  subjectPrice,
} from "@/data/catalog";

export const runtime = "nodejs";

const Body = z.object({
  identifier: z.string().trim().min(3, "Enter an email or phone number"),
  plan: z.enum(["pro", "premium"]),
  months: z.coerce.number().int().min(1).max(60).default(18),
  exam: z.string().trim().min(2).default(DEFAULT_EXAM),
  subject: z.string().trim().min(1).default(DEFAULT_SUBJECT),
});

export async function POST(req: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { identifier, plan, months, exam, subject } = parsed.data;
  const isEmail = identifier.includes("@");

  // Validate exam+subject against the catalog so attribution stays clean.
  const cat = getSubject(exam, subject);
  if (!cat) {
    return NextResponse.json(
      { error: "invalid_subject", message: "Unknown exam or subject." },
      { status: 400 },
    );
  }

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

  const amountPaise = subjectPrice(exam, subject)[
    plan === "premium" ? "premiumPaise" : "proPaise"
  ];
  // Namespaced + random so it can never collide with Razorpay/UPI ids.
  const ref = `grant-${randomUUID()}`;

  // Only the currently-live GATE Mining track drives the global User.plan so
  // existing mock/practice gating keeps working. Other tracks are recorded as
  // entitlements (attribution + future gating) without flipping the plan.
  const syncsGlobalPlan =
    exam === DEFAULT_EXAM && subject === DEFAULT_SUBJECT;

  await db.$transaction([
    ...(syncsGlobalPlan
      ? [
          db.user.update({
            where: { id: user.id },
            data: { plan, planExpiry: expiry },
          }),
        ]
      : []),
    db.entitlement.upsert({
      where: { userId_exam_subject: { userId: user.id, exam, subject } },
      create: {
        userId: user.id,
        exam,
        subject,
        tier: plan,
        source: "grant",
        expiry,
      },
      update: { tier: plan, source: "grant", expiry },
    }),
    db.payment.create({
      data: {
        userId: user.id,
        razorpayOrderId: ref,
        razorpayPaymentId: `${ref}-pay`,
        amount: amountPaise,
        currency: "INR",
        plan,
        exam,
        subject,
        periodMonths: months,
        status: "captured",
        capturedAt: now,
        raw: { source: "manual_grant", grantedBy: admin.email, exam, subject },
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
          exam,
          subject,
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
    exam,
    subject,
    expiry: expiry.toISOString().slice(0, 10),
  });
}

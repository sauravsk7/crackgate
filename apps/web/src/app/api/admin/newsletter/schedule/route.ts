import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin";
import { db } from "@/lib/db";
import { newsletterQueue } from "@/lib/queue";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  subject: z.string().min(1).max(200),
  html: z.string().min(1),
  scheduledAt: z.string().datetime(),
});

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const { subject, html, scheduledAt } = parsed.data;
  const scheduledDate = new Date(scheduledAt);
  const now = Date.now();
  const delay = Math.max(0, scheduledDate.getTime() - now);

  const subscriberCount = await db.newsletterSubscriber.count({
    where: { unsubscribed: false },
  });

  if (subscriberCount === 0) {
    return NextResponse.json({ recipients: 0, scheduled: false });
  }

  await newsletterQueue.add(
    "send",
    { subject, html },
    { delay },
  );

  return NextResponse.json({
    recipients: subscriberCount,
    scheduled: true,
    scheduledFor: scheduledDate.toISOString(),
  });
}

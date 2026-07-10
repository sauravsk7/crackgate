import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getLimiter, rateLimitResponse } from "@/lib/rate-limit";
import { getPostHogClient } from "@/lib/posthog";

export const runtime = "nodejs";

const reportLimiter = getLimiter({ windowMs: 60 * 60 * 1000, max: 20, label: "reports:post" });

const ReportSchema = z.object({
  mockRefId: z.string().min(1).max(50),
  questionKey: z.string().min(1).max(100),
  issueType: z.enum(["factual_error", "typo", "unclear_explanation", "wrong_answer", "other"]),
  description: z.string().min(10).max(2000),
});

/** Derive exam and subject from the mockRefId string. */
function parseRefId(refId: string): { exam: string; subject: string } {
  if (refId.startsWith("cil-")) {
    // cil-01-mining, cil-02-civil, etc.
    const parts = refId.split("-");
    const subject = parts.slice(2).join("-") || "mining";
    return { exam: "PSU", subject };
  }
  if (refId.startsWith("ce-mock-")) return { exam: "GATE", subject: "civil" };
  if (refId.startsWith("es-mock-")) return { exam: "GATE", subject: "environment" };
  if (refId.startsWith("gg-mock-")) return { exam: "GATE", subject: "geology" };
  if (refId.startsWith("mock-")) return { exam: "GATE", subject: "mining" };
  if (refId.startsWith("state-")) return { exam: "STATE", subject: "general" };
  if (refId.startsWith("diploma-")) return { exam: "DIPLOMA", subject: "general" };
  if (refId.startsWith("pyq-")) return { exam: "PYQ", subject: "general" };
  return { exam: "OTHER", subject: "general" };
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }

    const { allowed, resetAt } = reportLimiter.check(session.user.id);
    if (!allowed) return rateLimitResponse(Math.ceil((resetAt - Date.now()) / 1000));

    const parsed = ReportSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { exam, subject } = parseRefId(parsed.data.mockRefId);

    await db.questionReport.create({
      data: {
        userId: session.user.id,
        mockRefId: parsed.data.mockRefId,
        questionKey: parsed.data.questionKey,
        exam,
        subject,
        issueType: parsed.data.issueType,
        description: parsed.data.description,
      },
    });

    getPostHogClient()?.capture({
      distinctId: session.user.id,
      event: "question_reported",
      properties: {
        mock_ref_id: parsed.data.mockRefId,
        question_key: parsed.data.questionKey,
        issue_type: parsed.data.issueType,
        exam,
        subject,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/reports:", error);
    if (error instanceof Error) {
      getPostHogClient()?.captureException(error);
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin";
import { db } from "@/lib/db";
import { z } from "zod";

export const runtime = "nodejs";

const UpdateSchema = z.object({
  status: z.enum(["pending", "reviewed", "resolved", "dismissed"]),
  adminNote: z.string().max(2000).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const parsed = UpdateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const report = await db.questionReport.findUnique({ where: { id } });
    if (!report) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { status: parsed.data.status };

    // Set audit fields when status changes from pending
    if (report.status === "pending" && parsed.data.status !== "pending") {
      updateData.reviewedAt = new Date();
      updateData.reviewedBy = admin.email;
    }

    // Always update adminNote if provided
    if (parsed.data.adminNote !== undefined) {
      updateData.adminNote = parsed.data.adminNote || null;
    }

    await db.questionReport.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PATCH /api/admin/reports/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

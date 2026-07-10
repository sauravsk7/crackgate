import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin";
import { db } from "@/lib/db";
import { z } from "zod";

export const runtime = "nodejs";

const BatchUpdateSchema = z.object({
  ids: z.array(z.string()).min(1).max(100),
  status: z.enum(["pending", "reviewed", "resolved", "dismissed"]),
});

export async function PATCH(req: Request) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const parsed = BatchUpdateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { ids, status } = parsed.data;
    const now = new Date();

    // Set audit fields when moving from pending
    await db.questionReport.updateMany({
      where: { id: { in: ids }, status: "pending" },
      data: { status, reviewedAt: now, reviewedBy: admin.email },
    });

    // Update remaining (already reviewed) reports without audit fields
    await db.questionReport.updateMany({
      where: { id: { in: ids }, status: { not: "pending" } },
      data: { status },
    });

    return NextResponse.json({ ok: true, updated: ids.length });
  } catch (error) {
    console.error("PATCH /api/admin/reports:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

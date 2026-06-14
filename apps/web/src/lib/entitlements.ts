// CrackGate — entitlement access layer.
//
// An Entitlement records that a user has paid/granted access to a specific
// exam+subject at a given tier (pro | premium). This is the per-track access
// model that complements the legacy global `User.plan` (which only the live
// GATE → Mining track flips, for backward-compatible content gating).
//
// Use these helpers to read a user's granted access and present it in the UI.

import { db } from "@/lib/db";
import { subjectLabel } from "@/data/catalog";

export type Tier = "pro" | "premium";

export type UserEntitlement = {
  exam: string;
  subject: string;
  /** Human label, e.g. "GATE · Mining (MN)". */
  label: string;
  tier: Tier;
  source: string;
  expiry: Date | null;
  /** True when expiry is set and in the past. */
  expired: boolean;
};

/** An entitlement is active when it has no expiry or its expiry is in the future. */
function isActive(expiry: Date | null, now: Date): boolean {
  return expiry == null || expiry.getTime() > now.getTime();
}

/**
 * All entitlements for a user, newest first, decorated with a display label and
 * an `expired` flag. Returns an empty array when the user has none.
 */
export async function getUserEntitlements(
  userId: string,
  now: Date = new Date(),
): Promise<UserEntitlement[]> {
  if (!userId) return [];
  const rows = await db.entitlement.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    exam: r.exam,
    subject: r.subject,
    label: subjectLabel(r.exam, r.subject),
    tier: r.tier as Tier,
    source: r.source,
    expiry: r.expiry,
    expired: !isActive(r.expiry, now),
  }));
}

/**
 * Whether a user holds an active entitlement for the given exam+subject that
 * meets the required tier. Premium satisfies a pro requirement; pro does not
 * satisfy a premium requirement.
 */
export async function hasEntitlement(
  userId: string,
  exam: string,
  subject: string,
  requiredTier: Tier = "pro",
  now: Date = new Date(),
): Promise<boolean> {
  if (!userId) return false;
  const row = await db.entitlement.findUnique({
    where: { userId_exam_subject: { userId, exam, subject } },
  });
  if (!row) return false;
  if (!isActive(row.expiry, now)) return false;
  if (requiredTier === "premium") return row.tier === "premium";
  return row.tier === "pro" || row.tier === "premium";
}

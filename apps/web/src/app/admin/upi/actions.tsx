"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UpiReviewActions({ claimId }: { claimId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<null | "approve" | "reject">(null);

  async function approve() {
    if (!confirm("Approve this UPI claim and flip the user's plan?")) return;
    setBusy("approve");
    try {
      const r = await fetch(`/api/admin/pay/upi/${claimId}/approve`, {
        method: "POST",
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error ?? `HTTP ${r.status}`);
      router.refresh();
    } catch (e) {
      alert(`Approve failed: ${(e as Error).message}`);
    } finally {
      setBusy(null);
    }
  }

  async function reject() {
    const reason = prompt("Reason for rejection (visible to user):");
    if (!reason || reason.trim().length < 3) return;
    setBusy("reject");
    try {
      const r = await fetch(`/api/admin/pay/upi/${claimId}/reject`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reason: reason.trim() }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error ?? `HTTP ${r.status}`);
      router.refresh();
    } catch (e) {
      alert(`Reject failed: ${(e as Error).message}`);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={approve}
        disabled={busy !== null}
        className="btn btn-primary text-xs px-3 py-1"
      >
        {busy === "approve" ? "…" : "Approve"}
      </button>
      <button
        type="button"
        onClick={reject}
        disabled={busy !== null}
        className="btn text-xs px-3 py-1 border border-err text-err hover:bg-err/10"
      >
        {busy === "reject" ? "…" : "Reject"}
      </button>
    </div>
  );
}

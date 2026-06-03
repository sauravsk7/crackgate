"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  plan: "pro" | "premium";
  amountRupees: number;
};

const APPS = ["PhonePe", "GPay", "Paytm", "BHIM", "Other"] as const;

export default function UpiClaimForm({ plan, amountRupees }: Props) {
  const router = useRouter();
  const [upiTxnRef, setUpiTxnRef] = useState("");
  const [upiApp, setUpiApp] = useState<(typeof APPS)[number]>("PhonePe");
  const [payerNote, setPayerNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const r = await fetch("/api/pay/upi/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          plan,
          upiTxnRef: upiTxnRef.trim(),
          upiApp,
          payerNote: payerNote.trim() || undefined,
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (r.status === 401) {
        router.push(`/login?next=/pay/upi?plan=${plan}`);
        return;
      }
      if (!r.ok) {
        throw new Error(data?.message ?? data?.error ?? `HTTP ${r.status}`);
      }
      setDone(true);
      // Refresh to show the new pending claim in the table below.
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="text-sm">
        <p className="text-ok font-semibold">
          ✓ Got it — claim received.
        </p>
        <p className="mt-2 text-muted">
          We&apos;ll verify against our UPI app and unlock your{" "}
          <b>{plan}</b> access within a few hours (usually faster). You&apos;ll
          see the status update below, and we&apos;ll send a WhatsApp receipt
          when it&apos;s done.
        </p>
        <button
          className="btn btn-primary mt-4"
          onClick={() => router.push("/dashboard")}
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-2 space-y-4 text-sm">
      <div>
        <label htmlFor="utr" className="block text-xs font-semibold text-muted">
          UPI Reference Number (UTR / RRN)
        </label>
        <input
          id="utr"
          name="utr"
          required
          autoComplete="off"
          inputMode="numeric"
          pattern="[A-Za-z0-9]{10,32}"
          minLength={10}
          maxLength={32}
          value={upiTxnRef}
          onChange={(e) => setUpiTxnRef(e.target.value)}
          placeholder="e.g. 412345678912"
          className="input w-full mt-1 font-mono"
        />
        <p className="text-[11px] text-muted mt-1">
          Open your UPI app → transaction history → tap the ₹{amountRupees}{" "}
          payment → copy the 12-digit reference number.
        </p>
      </div>

      <div>
        <label htmlFor="app" className="block text-xs font-semibold text-muted">
          Which app did you pay from?
        </label>
        <select
          id="app"
          value={upiApp}
          onChange={(e) => setUpiApp(e.target.value as (typeof APPS)[number])}
          className="input w-full mt-1"
        >
          {APPS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="note" className="block text-xs font-semibold text-muted">
          Note (optional)
        </label>
        <textarea
          id="note"
          rows={2}
          maxLength={280}
          value={payerNote}
          onChange={(e) => setPayerNote(e.target.value)}
          placeholder="Anything we should know — e.g. paid from a different UPI ID"
          className="input w-full mt-1"
        />
      </div>

      {error && (
        <div className="text-xs text-err bg-err/10 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || upiTxnRef.trim().length < 10}
        className="btn btn-primary w-full"
      >
        {loading ? "Submitting…" : `Submit claim for ${plan}`}
      </button>
    </form>
  );
}

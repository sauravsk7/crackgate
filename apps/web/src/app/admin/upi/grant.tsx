"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CATALOG } from "@/data/catalog";

const PLANS = [
  { value: "pro", label: "Pro · ₹499" },
  { value: "premium", label: "Premium · ₹899" },
] as const;

type Result = {
  user: { email: string; name: string | null };
  plan: string;
  months: number;
  exam: string;
  subject: string;
  expiry: string;
};

export default function GrantAccessForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [plan, setPlan] = useState<"pro" | "premium">("pro");
  const [months, setMonths] = useState(18);
  const [exam, setExam] = useState<string>(CATALOG[0].exam);
  const subjects = useMemo(
    () => CATALOG.find((e) => e.exam === exam)?.subjects ?? [],
    [exam],
  );
  const [subject, setSubject] = useState<string>(CATALOG[0].subjects[0].slug);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const selectedSubject = subjects.find((s) => s.slug === subject);

  function onExamChange(nextExam: string) {
    setExam(nextExam);
    const first = CATALOG.find((e) => e.exam === nextExam)?.subjects[0];
    if (first) setSubject(first.slug);
  }

  async function submit() {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          plan,
          months,
          exam,
          subject,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data?.message ??
            (typeof data?.error === "string"
              ? data.error
              : "Could not grant access."),
        );
        return;
      }
      setResult(data as Result);
      setIdentifier("");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-5">
      <h2 className="font-bold text-lg">Grant access manually</h2>
      <p className="text-sm text-muted mt-1">
        Flip access for any account by email or phone — for off-platform
        payments, comps or support fixes. Pick the exam &amp; subject the
        access applies to. The user must have signed in once.
      </p>

      {/* Exam + subject */}
      <div className="grid sm:grid-cols-2 gap-3 mt-4">
        <label className="block">
          <span className="text-xs text-muted">Exam</span>
          <select
            value={exam}
            onChange={(e) => onExamChange(e.target.value)}
            className="input mt-1 w-full"
          >
            {CATALOG.map((e) => (
              <option key={e.exam} value={e.exam}>
                {e.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs text-muted">Subject</span>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input mt-1 w-full"
          >
            {subjects.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.label}
                {s.live ? "" : " · soon"}
              </option>
            ))}
          </select>
        </label>
      </div>

      {selectedSubject && !selectedSubject.live && (
        <p className="text-xs text-accent mt-2">
          Heads up: <strong>{selectedSubject.label}</strong> isn’t live yet.
          The entitlement will be recorded but content stays locked until the
          track launches.
        </p>
      )}

      <div className="grid sm:grid-cols-[1fr_auto_auto_auto] gap-3 mt-4 items-end">
        <label className="block">
          <span className="text-xs text-muted">Email or phone</span>
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="name@email.com or 9876543210"
            className="input mt-1 w-full"
          />
        </label>
        <div className="block">
          <span className="text-xs text-muted">Plan</span>
          <div className="mt-1 inline-flex rounded-lg border border-line p-0.5 bg-surface">
            {PLANS.map((p) => {
              const active = plan === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setPlan(p.value)}
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition ${
                    active
                      ? "bg-ok text-white shadow-sm"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
        <label className="block">
          <span className="text-xs text-muted">Months</span>
          <input
            type="number"
            min={1}
            max={60}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value) || 1)}
            className="input mt-1 w-20"
          />
        </label>
        <button
          onClick={submit}
          disabled={loading || identifier.trim().length < 3}
          className="btn btn-primary"
        >
          {loading ? "Granting…" : "Grant"}
        </button>
      </div>

      {error && <p className="text-sm text-err mt-3">{error}</p>}
      {result && (
        <p className="text-sm text-ok mt-3">
          ✓ Granted <strong>{result.plan}</strong> ({result.exam} ·{" "}
          {result.subject}) to {result.user.name ?? result.user.email} for{" "}
          {result.months} months (until {result.expiry}).
        </p>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";

type SendMode = "instant" | "schedule";

export default function NewsletterComposer({ subscriberCount }: { subscriberCount: number }) {
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [mode, setMode] = useState<SendMode>("instant");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function minSchedule() {
    const d = new Date(Date.now() + 3600_000);
    return d.toISOString().slice(0, 16);
  }

  async function send() {
    setError(null);
    setResult(null);

    if (!subject.trim()) { setError("Subject is required."); return; }
    if (!html.trim()) { setError("Content is required."); return; }
    if (mode === "schedule" && !scheduledAt) { setError("Pick a date & time to schedule."); return; }

    setLoading(true);
    try {
      const endpoint = mode === "instant" ? "/api/admin/newsletter/send" : "/api/admin/newsletter/schedule";
      const body: Record<string, string> = { subject: subject.trim(), html: html.trim() };
      if (mode === "schedule") body.scheduledAt = new Date(scheduledAt).toISOString();

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? `HTTP ${res.status}`);
        return;
      }

      if (mode === "instant") {
        setResult(`Sent to ${data.recipients} subscribers · ${data.sent} delivered, ${data.failed} failed.`);
      } else {
        setResult(`Scheduled for ${new Date(data.scheduledFor).toLocaleString()} · ${data.recipients} recipients.`);
      }

      if (mode === "instant") {
        setSubject("");
        setHtml("");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">Compose newsletter</h2>
          <span className="text-sm text-muted">{subscriberCount} subscribers</span>
        </div>

        <div className="mt-4 space-y-4">
          <label className="block">
            <span className="text-xs text-muted">Subject</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Newsletter subject"
              className="input mt-1 w-full"
            />
          </label>

          <label className="block">
            <span className="text-xs text-muted">Content (HTML)</span>
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              placeholder="<h1>Hello!</h1><p>Your newsletter content here...</p>"
              rows={12}
              className="input mt-1 w-full font-mono text-sm"
            />
          </label>

          <details className="text-sm text-muted">
            <summary className="cursor-pointer hover:text-ink">Preview (snippet)</summary>
            <div
              className="mt-2 rounded-lg border border-line bg-surface p-4 text-sm prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: html.slice(0, 1000) }}
            />
          </details>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setMode("instant")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === "instant" ? "bg-brand text-white" : "bg-surface text-muted hover:text-ink"}`}
            >
              Send now
            </button>
            <button
              type="button"
              onClick={() => setMode("schedule")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === "schedule" ? "bg-brand text-white" : "bg-surface text-muted hover:text-ink"}`}
            >
              Schedule
            </button>
            {mode === "schedule" && (
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                min={minSchedule()}
                className="input text-sm"
              />
            )}
            <button
              onClick={send}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading
                ? "Sending…"
                : mode === "instant"
                  ? "Send newsletter"
                  : "Schedule"}
            </button>
          </div>

          {error && <p className="text-sm text-bad mt-2">{error}</p>}
          {result && <p className="text-sm text-ok mt-2">{result}</p>}
        </div>
      </div>
    </div>
  );
}

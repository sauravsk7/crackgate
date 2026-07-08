"use client";

import { useState } from "react";

type SendMode = "instant" | "schedule";

export default function NewsletterComposer({
  subscriberCount,
  selectedEmails,
  subscriberSelectedCount = 0,
  userSelectedCount = 0,
}: {
  subscriberCount: number;
  selectedEmails: Set<string>;
  subscriberSelectedCount?: number;
  userSelectedCount?: number;
}) {
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
      const body: Record<string, unknown> = { subject: subject.trim(), html: html.trim() };
      if (selectedEmails.size > 0) {
        body.recipients = Array.from(selectedEmails);
      }
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
          <span className="text-sm text-muted">
            {selectedEmails.size > 0
              ? [
                  subscriberSelectedCount > 0 && `${subscriberSelectedCount} subscriber${subscriberSelectedCount === 1 ? "" : "s"}`,
                  userSelectedCount > 0 && `${userSelectedCount} user${userSelectedCount === 1 ? "" : "s"}`,
                ]
                  .filter(Boolean)
                  .join(" + ") + " selected"
              : `${subscriberCount} subscribers`}
          </span>
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

          <div className="border-t border-line pt-4">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <span className="text-xs text-muted font-medium">Mode</span>
                <div className="mt-1 flex rounded-lg border border-line p-0.5 bg-canvas">
                  <button
                    type="button"
                    onClick={() => setMode("instant")}
                    className={`px-4 py-1.5 rounded-md text-sm font-semibold transition ${mode === "instant" ? "bg-brand text-white shadow-sm" : "text-muted hover:text-ink border border-transparent"}`}
                  >
                    Instant
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("schedule")}
                    className={`px-4 py-1.5 rounded-md text-sm font-semibold transition ${mode === "schedule" ? "bg-brand text-white shadow-sm" : "text-muted hover:text-ink border border-transparent"}`}
                  >
                    Scheduled
                  </button>
                </div>
              </div>
              {mode === "schedule" && (
                <div>
                  <span className="text-xs text-muted font-medium">Send at</span>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    min={minSchedule()}
                    className="input mt-1 text-sm"
                  />
                </div>
              )}
              <div className="flex-1 flex justify-end">
                <button
                  onClick={send}
                  disabled={loading}
                  className="btn btn-primary px-6"
                >
                  {loading
                    ? "Sending…"
                    : mode === "instant"
                      ? selectedEmails.size > 0
                        ? `Send to ${selectedEmails.size} selected`
                        : "Send to all"
                      : selectedEmails.size > 0
                        ? `Schedule for ${selectedEmails.size} selected`
                        : "Schedule for all"}
                </button>
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-bad mt-2">{error}</p>}
          {result && <p className="text-sm text-ok mt-2">{result}</p>}
        </div>
      </div>
    </div>
  );
}

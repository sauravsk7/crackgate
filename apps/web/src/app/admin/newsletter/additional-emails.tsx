"use client";

import { useState, useMemo } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  additionalEmails: Set<string>;
  onChange: (emails: Set<string>) => void;
}

function parseEmails(text: string): { valid: string[]; invalid: string[] } {
  const parts = text.split(/[,;\n]+/);
  const valid: string[] = [];
  const invalid: string[] = [];

  for (let part of parts) {
    part = part.trim();
    if (!part) continue;

    const angleMatch = part.match(/<([^>]+)>/);
    if (angleMatch) part = angleMatch[1].trim();

    part = part.replace(/^["']|["']$/g, "").trim();
    if (!part) continue;

    const lower = part.toLowerCase();
    if (EMAIL_RE.test(lower)) {
      valid.push(lower);
    } else {
      invalid.push(part);
    }
  }

  return {
    valid: [...new Set(valid)],
    invalid: [...new Set(invalid)],
  };
}

export default function AdditionalEmails({ additionalEmails, onChange }: Props) {
  const [input, setInput] = useState("");
  const parsed = useMemo(() => parseEmails(input), [input]);

  const alreadyAdded = parsed.valid.filter((e) => additionalEmails.has(e));
  const newValid = parsed.valid.filter((e) => !additionalEmails.has(e));

  function addAll() {
    if (newValid.length === 0) return;
    const next = new Set(additionalEmails);
    newValid.forEach((e) => next.add(e));
    onChange(next);
    setInput("");
  }

  function remove(email: string) {
    const next = new Set(additionalEmails);
    next.delete(email);
    onChange(next);
  }

  function clearAll() {
    onChange(new Set());
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-lg">Additional emails</h2>
        {additionalEmails.size > 0 && (
          <button type="button" onClick={clearAll} className="text-xs text-muted underline">
            Clear all
          </button>
        )}
      </div>

      <p className="text-xs text-muted mb-3">
        Paste emails in any format: CSV, one per line, semicolons, or{" "}
        <code className="text-ink">Name &lt;email&gt;</code>. No backend changes
        needed — these are merged with your subscriber/user selection.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={"user@example.com, another@example.org\ncolleague@example.com"}
        rows={3}
        className="input w-full text-sm font-mono"
      />

      {input.trim() && (
        <div className="mt-2 flex items-center gap-3 text-xs">
          {parsed.valid.length > 0 && (
            <span className="text-emerald-600 font-medium">
              {parsed.valid.length} valid
              {alreadyAdded.length > 0 && ` (${alreadyAdded.length} already added)`}
            </span>
          )}
          {parsed.invalid.length > 0 && (
            <span className="text-bad font-medium">
              {parsed.invalid.length} invalid
            </span>
          )}
          {newValid.length > 0 && (
            <button
              type="button"
              onClick={addAll}
              className="btn btn-primary text-xs py-1 px-3 ml-auto"
            >
              Add {newValid.length} email{newValid.length === 1 ? "" : "s"}
            </button>
          )}
        </div>
      )}

      {parsed.invalid.length > 0 && (
        <p className="mt-1 text-xs text-bad">
          {parsed.invalid.slice(0, 3).join(", ")}
          {parsed.invalid.length > 3 && ` +${parsed.invalid.length - 3} more`}
        </p>
      )}

      {additionalEmails.size > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {[...additionalEmails].map((email) => (
            <span
              key={email}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-brand/10 text-brand border border-brand/20"
            >
              {email}
              <button
                type="button"
                onClick={() => remove(email)}
                className="hover:text-bad transition-colors"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

import { cn } from "@/lib/utils";
import type { CilResultData } from "@/lib/cil-analytics";

function fmtMin(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s ? `${m}m ${s}s` : `${m}m`;
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg bg-canvas p-3">
      <div className="text-xl font-extrabold tabular-nums">{value}</div>
      <div className="text-[11px] text-muted mt-0.5">
        {label}
        {sub ? ` · ${sub}` : ""}
      </div>
    </div>
  );
}

/**
 * CIL-specific post-test analytics shown on the result page: cut-off
 * projection, peer leaderboard, per-section accuracy and time pacing.
 */
export function CilResultAnalytics({ data }: { data: CilResultData }) {
  const { cutoff, leaderboard, sections, time } = data;

  return (
    <div className="mt-8 space-y-6 text-left">
      {/* Cut-off projection */}
      <section className="bg-surface rounded-xl border border-line p-5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="font-bold text-lg">Cut-off projection</h3>
          <span
            className={cn(
              "badge font-bold",
              cutoff.bestQualified
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200"
                : "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200",
            )}
          >
            {cutoff.bestQualified ? `Clears ${cutoff.bestQualified}` : "Below all bands"}
          </span>
        </div>
        <p className="text-xs text-muted mt-1">
          Indicative bands based on previous CIL MT trends — not official cut-offs.
        </p>
        <div className="mt-3 grid sm:grid-cols-2 gap-2">
          {cutoff.bands.map((b) => (
            <div
              key={b.category}
              className={cn(
                "flex items-center justify-between rounded-lg border p-3 text-sm",
                b.qualifies ? "border-ok bg-emerald-50 dark:bg-emerald-500/10" : "border-line",
              )}
            >
              <span className="font-semibold">{b.label}</span>
              <span className="tabular-nums">
                <span className="text-muted">cut-off {b.cutoff}</span>
                <span className={cn("ml-2 font-bold", b.qualifies ? "text-ok" : "text-bad")}>
                  {b.qualifies ? "Qualifies ✓" : `${data.score - b.cutoff}`}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="bg-surface rounded-xl border border-line p-5">
        <h3 className="font-bold text-lg">Where you stand</h3>
        {leaderboard.peerCount > 1 ? (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <Stat label="Rank" value={`#${leaderboard.rank}`} sub={`of ${leaderboard.peerCount}`} />
            <Stat
              label="Percentile"
              value={leaderboard.percentile != null ? `${leaderboard.percentile}` : "—"}
              sub="vs peers"
            />
            <Stat label="Top score" value={`${leaderboard.topScore}`} sub={`/ ${data.total}`} />
            <Stat label="Avg score" value={`${leaderboard.avgScore}`} sub={`/ ${data.total}`} />
          </div>
        ) : (
          <p className="text-sm text-muted mt-2">
            You’re among the first to attempt this set — rank and percentile unlock once more
            candidates finish.
          </p>
        )}
      </section>

      {/* Section + time analytics */}
      <section className="bg-surface rounded-xl border border-line p-5">
        <h3 className="font-bold text-lg">Section &amp; time analysis</h3>
        <div className="mt-3 space-y-2">
          {sections.map((s) => (
            <div key={s.name}>
              <div className="flex justify-between text-sm mb-1">
                <span>{s.name}</span>
                <span className="font-semibold tabular-nums">
                  {s.scored} / {s.total} · {s.pct}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: `${Math.max(2, s.pct)}%`,
                    background: s.pct >= 70 ? "var(--ok)" : s.pct >= 40 ? "var(--accent)" : "var(--bad)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
          <Stat label="Time taken" value={fmtMin(time.spentSec)} sub={`ideal ~${fmtMin(time.idealSec)}`} />
          <Stat label="Attempted" value={`${time.attempted}`} sub="questions" />
          <Stat
            label="Avg / question"
            value={`${time.avgSecPerQ}s`}
            sub={time.spentSec <= time.idealSec ? "good pace" : "slower than ideal"}
          />
        </div>
      </section>
    </div>
  );
}

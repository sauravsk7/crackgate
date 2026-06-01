import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { fmtDate } from "@/lib/utils";
import { SubjectMasteryPanel } from "@/components/subject-mastery-panel";
import { ScoreTrendChart } from "@/components/score-trend-chart";
import { PercentilePanel } from "@/components/percentile-panel";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null; // middleware already redirected

  const [attempts, activityCount, latest] = await Promise.all([
    db.attempt.findMany({
      where: { userId: session.user.id },
      orderBy: { takenAt: "desc" },
      take: 20,
    }),
    db.activity.count({ where: { userId: session.user.id } }),
    db.user.findUnique({ where: { id: session.user.id } }),
  ]);

  const totalAttempts = attempts.length;
  const avgScore = totalAttempts
    ? Math.round((attempts.reduce((s, a) => s + (a.score / a.total) * 100, 0) / totalAttempts))
    : 0;
  const bestScore = totalAttempts
    ? Math.round(Math.max(...attempts.map((a) => (a.score / a.total) * 100)))
    : 0;

  // Per-subject roll-up (SWOT)
  const subjMap: Record<string, { scored: number; total: number }> = {};
  for (const a of attempts) {
    const b = (a.breakdown as Record<string, { scored: number; total: number }>) ?? {};
    for (const [k, v] of Object.entries(b)) {
      subjMap[k] ??= { scored: 0, total: 0 };
      subjMap[k].scored += v.scored;
      subjMap[k].total += v.total;
    }
  }
  const subjects = Object.entries(subjMap)
    .map(([k, v]) => ({ name: k, pct: v.total ? Math.round((v.scored / v.total) * 100) : 0 }))
    .sort((a, b) => b.pct - a.pct);

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Welcome back, {latest?.name?.split(" ")[0] ?? "Aspirant"} 👋</h1>
          <p className="text-muted mt-1">Your GATE MN progress at a glance.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href="/mocks" className="btn btn-primary">📝 Take a Mock</Link>
          <Link href="/practice" className="btn btn-accent">🎯 Practice (906 Qs)</Link>
          <Link href="/pyq" className="btn btn-ghost">📚 PYQs</Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <StatCard label="Attempts" value={totalAttempts} icon="🧪" />
        <StatCard label="Avg Score" value={`${avgScore}%`} icon="📈" />
        <StatCard label="Best Score" value={`${bestScore}%`} icon="🏆" />
        <StatCard label="Plan" value={(latest?.plan ?? "free").toUpperCase()} icon="💎" cta={latest?.plan === "free" ? { href: "/pricing", text: "Upgrade" } : undefined} />
      </div>

      {/* SWOT */}
      <section className="mt-10 grid lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-bold text-lg">Subject SWOT</h2>
          <p className="text-sm text-muted">Higher bars = stronger. Use to plan next practice.</p>
          <div className="mt-5 space-y-3">
            {subjects.length === 0 ? (
              <Empty>Submit one mock or PYQ to see your subject-wise SWOT.</Empty>
            ) : (
              subjects.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{s.name}</span>
                    <span className="font-semibold">{s.pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${Math.max(2, s.pct)}%`,
                        background: s.pct >= 70 ? "var(--ok)" : s.pct >= 40 ? "var(--accent)" : "var(--bad)",
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-lg">Activity</h2>
          <p className="text-sm text-muted mb-3">{activityCount} events logged.</p>
          <ul className="space-y-3 text-sm">
            {attempts.slice(0, 5).map((a) => (
              <li key={a.id} className="flex justify-between">
                <span className="truncate pr-2">{a.refTitle}</span>
                <span className="font-semibold text-brand">{a.score}/{a.total}</span>
              </li>
            ))}
            {attempts.length === 0 && <Empty>No attempts yet.</Empty>}
          </ul>
        </div>
      </section>

      {/* Score Trend */}
      <section className="mt-10 card p-6">
        <div className="flex justify-between items-end flex-wrap gap-2">
          <div>
            <h2 className="font-bold text-lg">Score Trend</h2>
            <p className="text-sm text-muted">Mock + PYQ accuracy over time, with running average.</p>
          </div>
          <span className="text-xs text-muted">Last {Math.min(attempts.length, 20)} attempts</span>
        </div>
        <div className="mt-4">
          <ScoreTrendChart data={[...attempts].reverse().map((a) => ({
            date: fmtDate(a.takenAt),
            pct: a.total ? Math.round((a.score / a.total) * 100) : 0,
            score: a.score,
            total: a.total,
            title: a.refTitle,
          }))} />
        </div>
      </section>

      {/* Subject Mastery (live from practice attempts) */}
      <SubjectMasteryPanel />

      {/* Percentile vs peers */}
      <section className="mt-10">
        <PercentilePanel />
      </section>

      {/* Recent attempts table */}
      <section className="mt-10 card p-6 overflow-x-auto">
        <h2 className="font-bold text-lg">Recent attempts</h2>
        <table className="w-full text-sm mt-4">
          <thead className="text-muted text-left border-b border-line">
            <tr>
              <th className="py-2">Paper</th>
              <th className="py-2">Type</th>
              <th className="py-2">Score</th>
              <th className="py-2">Accuracy</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((a) => {
              const pct = a.total ? Math.round((a.score / a.total) * 100) : 0;
              return (
                <tr key={a.id} className="border-b border-line/60">
                  <td className="py-2.5 font-medium">{a.refTitle}</td>
                  <td className="py-2.5"><span className="badge">{a.kind.toUpperCase()}</span></td>
                  <td className="py-2.5">{a.score} / {a.total}</td>
                  <td className="py-2.5">
                    <span className={pct >= 60 ? "text-ok" : pct >= 40 ? "text-accent" : "text-bad"}>{pct}%</span>
                  </td>
                  <td className="py-2.5 text-muted">{fmtDate(a.takenAt)}</td>
                </tr>
              );
            })}
            {attempts.length === 0 && (
              <tr><td colSpan={5}><Empty>You haven't taken any attempts yet.</Empty></td></tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function StatCard({ label, value, icon, cta }: { label: string; value: string | number; icon: string; cta?: { href: string; text: string } }) {
  return (
    <div className="card p-5">
      <div className="text-2xl">{icon}</div>
      <div className="text-3xl font-extrabold mt-2">{value}</div>
      <div className="text-sm text-muted mt-0.5">{label}</div>
      {cta && (
        <Link href={cta.href} className="btn btn-accent text-xs mt-3 inline-flex">{cta.text}</Link>
      )}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="text-center text-sm text-muted py-6">{children}</div>;
}

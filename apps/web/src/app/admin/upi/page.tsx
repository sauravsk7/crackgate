import { getAdminSession } from "@/lib/admin";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import UpiReviewActions from "./actions";
import GrantAccessForm from "./grant";

export const dynamic = "force-dynamic";

function inr(paise: number): string {
  return "₹" + Math.round(paise / 100).toLocaleString("en-IN");
}

export default async function AdminUpiPage() {
  const admin = await getAdminSession();
  if (!admin) redirect("/login?next=/admin/upi");

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [pending, recentReviewed, approvedAgg, monthAgg, statusGroups] =
    await Promise.all([
      db.upiPayment.findMany({
        where: { status: "pending" },
        orderBy: { createdAt: "asc" },
        include: { user: { select: { email: true } } },
      }),
      db.upiPayment.findMany({
        where: { status: { in: ["approved", "rejected"] } },
        orderBy: { reviewedAt: "desc" },
        take: 30,
        include: { user: { select: { email: true } } },
      }),
      db.upiPayment.aggregate({
        where: { status: "approved" },
        _sum: { amountPaise: true },
        _count: { _all: true },
      }),
      db.upiPayment.aggregate({
        where: { status: "approved", reviewedAt: { gte: monthStart } },
        _sum: { amountPaise: true },
        _count: { _all: true },
      }),
      db.upiPayment.groupBy({ by: ["status"], _count: { _all: true } }),
    ]);

  const counts: Record<string, number> = {
    pending: 0,
    approved: 0,
    rejected: 0,
  };
  for (const g of statusGroups) counts[g.status] = g._count._all;

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-extrabold">UPI Payments</h1>
        <a href="/admin" className="text-sm text-muted underline">
          ← Admin
        </a>
      </div>

      {/* Totals */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Kpi
          label="Collected (lifetime)"
          value={inr(approvedAgg._sum.amountPaise ?? 0)}
          sub={`${approvedAgg._count._all} approved payments`}
          tone="ok"
        />
        <Kpi
          label="Collected this month"
          value={inr(monthAgg._sum.amountPaise ?? 0)}
          sub={`${monthAgg._count._all} approved`}
          tone="ok"
        />
        <Kpi
          label="Pending review"
          value={counts.pending}
          sub="awaiting verification"
          tone={counts.pending > 0 ? "accent" : undefined}
        />
        <Kpi
          label="Rejected"
          value={counts.rejected}
          sub={`${counts.approved} approved total`}
        />
      </div>

      {/* Manual grant */}
      <section className="mt-8">
        <GrantAccessForm />
      </section>

      <section className="mt-10">
        <h2 className="font-bold text-lg">
          Pending review{" "}
          <span className="text-muted text-sm">({pending.length})</span>
        </h2>

        {pending.length === 0 ? (
          <p className="text-muted text-sm mt-3">
            All caught up. New claims will appear here.
          </p>
        ) : (
          <div className="card p-0 overflow-x-auto mt-3">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted bg-bg-2">
                <tr className="text-left">
                  <th className="p-3">Submitted</th>
                  <th className="p-3">Payer</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">App</th>
                  <th className="p-3">Note</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((c) => (
                  <tr key={c.id} className="border-t border-border/60 align-top">
                    <td className="p-3 whitespace-nowrap">
                      {c.createdAt
                        .toISOString()
                        .slice(0, 16)
                        .replace("T", " ")}
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{c.payerName ?? "—"}</div>
                      {c.payerPhone && (
                        <div className="text-xs text-muted select-all">
                          {c.payerPhone}
                        </div>
                      )}
                      {c.payerEmail && (
                        <div className="text-xs text-muted select-all">
                          {c.payerEmail}
                        </div>
                      )}
                      {c.user.email && c.user.email !== c.payerEmail && (
                        <div className="text-[10px] text-muted/70">
                          acct: {c.user.email}
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-semibold">{c.plan}</td>
                    <td className="p-3 font-semibold">
                      ₹{Math.round(c.amountPaise / 100)}
                    </td>
                    <td className="p-3 text-xs">{c.upiApp ?? "—"}</td>
                    <td className="p-3 text-xs max-w-[16ch]">
                      {c.payerNote ?? "—"}
                    </td>
                    <td className="p-3">
                      <UpiReviewActions claimId={c.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-bold text-lg">Recently reviewed</h2>
        {recentReviewed.length === 0 ? (
          <p className="text-muted text-sm mt-3">Nothing reviewed yet.</p>
        ) : (
          <div className="card p-0 overflow-x-auto mt-3">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted bg-bg-2">
                <tr className="text-left">
                  <th className="p-3">Reviewed</th>
                  <th className="p-3">Payer</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Admin note</th>
                </tr>
              </thead>
              <tbody>
                {recentReviewed.map((c) => (
                  <tr key={c.id} className="border-t border-border/60">
                    <td className="p-3 whitespace-nowrap text-xs">
                      {c.reviewedAt
                        ?.toISOString()
                        .slice(0, 16)
                        .replace("T", " ") ?? "—"}
                    </td>
                    <td className="p-3 text-xs">
                      <div>{c.payerName ?? c.user.email}</div>
                      {c.payerPhone && (
                        <div className="text-muted">{c.payerPhone}</div>
                      )}
                    </td>
                    <td className="p-3 text-xs">{c.plan}</td>
                    <td className="p-3 text-xs">
                      ₹{Math.round(c.amountPaise / 100)}
                    </td>
                    <td className="p-3 text-xs">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          c.status === "approved"
                            ? "bg-ok/15 text-ok"
                            : "bg-err/15 text-err"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-xs max-w-[24ch]">
                      {c.adminNote ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Kpi({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string | number;
  sub?: string;
  tone?: "ok" | "accent";
}) {
  const toneClass =
    tone === "ok" ? "text-ok" : tone === "accent" ? "text-accent" : "";
  return (
    <div className="card p-5">
      <div className={`text-2xl font-extrabold ${toneClass}`}>{value}</div>
      <div className="text-sm text-muted mt-0.5">{label}</div>
      {sub && <div className="text-xs text-muted mt-1">{sub}</div>}
    </div>
  );
}

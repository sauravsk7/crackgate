import { getAdminSession } from "@/lib/admin";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import UpiReviewActions from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminUpiPage() {
  const admin = await getAdminSession();
  if (!admin) redirect("/login?next=/admin/upi");

  const [pending, recentReviewed] = await Promise.all([
    db.upiPayment.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "asc" },
      include: {
        user: { select: { email: true, name: true, phone: true } },
      },
    }),
    db.upiPayment.findMany({
      where: { status: { in: ["approved", "rejected"] } },
      orderBy: { reviewedAt: "desc" },
      take: 30,
      include: {
        user: { select: { email: true, name: true } },
      },
    }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-extrabold">UPI Claims</h1>
        <a href="/admin" className="text-sm text-muted underline">
          ← Admin
        </a>
      </div>

      <section className="mt-8">
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
                  <th className="p-3">User</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">UTR</th>
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
                      <div className="font-medium">{c.user.name ?? "—"}</div>
                      <div className="text-xs text-muted">{c.user.email}</div>
                      {c.user.phone && (
                        <div className="text-xs text-muted">
                          {c.user.phone}
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-semibold">{c.plan}</td>
                    <td className="p-3 font-semibold">
                      ₹{Math.round(c.amountPaise / 100)}
                    </td>
                    <td className="p-3 font-mono text-xs select-all">
                      {c.upiTxnRef}
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
                  <th className="p-3">User</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">UTR</th>
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
                    <td className="p-3 text-xs">{c.user.email}</td>
                    <td className="p-3 text-xs">{c.plan}</td>
                    <td className="p-3 text-xs">
                      ₹{Math.round(c.amountPaise / 100)}
                    </td>
                    <td className="p-3 font-mono text-xs">{c.upiTxnRef}</td>
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

import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin";
import { db } from "@/lib/db";
import NewsletterComposer from "./newsletter-composer";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const admin = await getAdminSession();
  if (!admin) {
    redirect("/login?next=/admin/newsletter");
  }

  const subscribers = await db.newsletterSubscriber.findMany({
    where: { unsubscribed: false },
    orderBy: { subscribedAt: "desc" },
    select: { email: true, source: true, subscribedAt: true },
  });

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-extrabold">Newsletter</h1>
        <Link href="/admin" className="text-sm text-muted underline">
          ← Admin
        </Link>
      </div>

      <p className="text-sm text-muted mt-2">
        Logged in as <b>{admin.email}</b>
      </p>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="text-3xl font-extrabold">{subscribers.length}</div>
          <div className="text-sm text-muted mt-0.5">Active subscribers</div>
        </div>
      </div>

      <div className="mt-8 card p-5 overflow-x-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">Subscribers</h2>
          <span className="text-sm text-muted">{subscribers.length} total</span>
        </div>
        <table className="w-full text-sm">
          <thead className="text-muted text-left border-b border-line">
            <tr>
              <th className="py-2 font-medium">Email</th>
              <th className="py-2 font-medium">Source</th>
              <th className="py-2 font-medium">Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s.email} className="border-b border-line/60">
                <td className="py-2.5 font-medium">{s.email}</td>
                <td className="py-2.5 text-muted">{s.source}</td>
                <td className="py-2.5 text-muted">
                  {s.subscribedAt.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr><td colSpan={3} className="py-6 text-center text-muted">No subscribers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <NewsletterComposer subscriberCount={subscribers.length} />
      </div>
    </div>
  );
}

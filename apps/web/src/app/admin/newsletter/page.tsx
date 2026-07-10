import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin";
import { db } from "@/lib/db";
import NewsletterPageClient from "./newsletter-page-client";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const admin = await getAdminSession();
  if (!admin) {
    redirect("/login?next=/admin/newsletter");
  }

  const [subRows, userRows] = await Promise.all([
    db.newsletterSubscriber.findMany({
      where: { unsubscribed: false },
      orderBy: { subscribedAt: "desc" },
      select: { email: true, source: true, subscribedAt: true },
    }),
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { email: true, name: true, plan: true, createdAt: true },
    }),
  ]);

  const userEmailSet = new Map(userRows.map((u) => [u.email, u.plan]));

  const subscribers = subRows.map((r) => ({
    email: r.email,
    source: r.source,
    subscribedAt: r.subscribedAt.toISOString(),
    plan: userEmailSet.get(r.email) ?? null,
  }));

  const users = userRows.map((r) => ({
    email: r.email,
    name: r.name,
    plan: r.plan,
    joinedAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-extrabold">Newsletter</h1>
        <Link href="/admin" className="text-sm text-muted underline">
          ← Admin
        </Link>
      </div>

      <p className="text-sm text-muted mt-2">
        Logged in as <b>{admin.email}</b>
      </p>

      <NewsletterPageClient
        subscribers={subscribers}
        subscriberCount={subscribers.length}
        users={users}
        userCount={users.length}
        shareholderEmails={
          process.env.NEWSLETTER_ALWAYS_BCC
            ? process.env.NEWSLETTER_ALWAYS_BCC.split(",").map((e) => e.trim()).filter(Boolean)
            : []
        }
      />
    </div>
  );
}

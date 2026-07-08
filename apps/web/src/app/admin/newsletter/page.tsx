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

  const rows = await db.newsletterSubscriber.findMany({
    where: { unsubscribed: false },
    orderBy: { subscribedAt: "desc" },
    select: { email: true, source: true, subscribedAt: true },
  });

  const subscribers = rows.map((r) => ({
    email: r.email,
    source: r.source,
    subscribedAt: r.subscribedAt.toISOString(),
  }));

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

      <NewsletterPageClient
        subscribers={subscribers}
        subscriberCount={subscribers.length}
      />
    </div>
  );
}

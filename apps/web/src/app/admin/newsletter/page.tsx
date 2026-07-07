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

  const subscriberCount = await db.newsletterSubscriber.count({
    where: { unsubscribed: false },
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
          <div className="text-3xl font-extrabold">{subscriberCount}</div>
          <div className="text-sm text-muted mt-0.5">Active subscribers</div>
        </div>
      </div>

      <div className="mt-8">
        <NewsletterComposer subscriberCount={subscriberCount} />
      </div>
    </div>
  );
}

import Link from "next/link";
import { getAdminSession } from "@/lib/admin";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminSession();
  if (!admin) redirect("/login?next=/admin");

  return (
    <div className="min-h-screen bg-canvas">
      <AdminSidebar admin={admin}>{children}</AdminSidebar>
    </div>
  );
}

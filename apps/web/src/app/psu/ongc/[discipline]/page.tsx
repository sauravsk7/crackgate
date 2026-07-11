import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ONGC_ROWS, getOngcDiscipline, ONGC_RECRUITMENT_URL } from "@/data/ongc";
import { OngcMockPlan } from "@/components/ongc-mock-plan";
import { Breadcrumb } from "@/components/breadcrumb";
import { ShareOnWhatsApp } from "@/components/share-on-whatsapp";
import { NewsletterForm } from "@/components/newsletter-form";
import { auth } from "@/lib/auth";
import { hasEntitlement } from "@/lib/entitlements";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return ONGC_ROWS.map((r) => ({ discipline: r.slug }));
}

export async function generateMetadata(props: { params: Promise<{ discipline: string }> }) {
  const { discipline } = await props.params;
  const row = getOngcDiscipline(discipline);
  if (!row) {
    return { title: "ONGC · CrackGate", description: "ONGC CBT recruitment exam preparation with discipline-specific mock tests." };
  }
  return {
    title: `ONGC ${row.discipline} · Mock Series · CrackGate`,
    openGraph: { images: [{ url: "/api/og?subject=" + encodeURIComponent("ONGC " + row.discipline) + "&title=" + encodeURIComponent("CBT Exam Prep"), alt: `ONGC ${row.discipline} CBT Exam Prep` }] },
    description: `Crack ONGC ${row.discipline} CBT exam. ${row.qualification}. Practice with mock tests tailored to the ONGC exam pattern.`,
    alternates: { canonical: "/psu/ongc/" + discipline },
  };
}

export default async function OngcDisciplinePage(props: { params: Promise<{ discipline: string }> }) {
  const { discipline } = await props.params;
  const row = getOngcDiscipline(discipline);
  if (!row) notFound();

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin";
  const unlocked = isAdmin || (await hasEntitlement(userId ?? "", "PSU", row.slug));

  return (
    <>
      <section className="relative overflow-hidden bg-[#003580] text-white">
        {/* Background image — oil rig */}
        <div className="absolute inset-0">
          <Image
            src="/images/ongc/oil-rig-bg.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-20"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#003580] via-[#003580]/90 to-[#003580]/60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 py-14 lg:py-16">
          <div className="flex items-start justify-between">
            <Breadcrumb crumbs={[
              { label: "Home", href: "/" },
              { label: "PSU", href: "/psu" },
              { label: "ONGC", href: "/psu/ongc" },
              { label: row.discipline },
            ]} />
            <ShareOnWhatsApp />
          </div>
          <div className="flex items-center gap-3 mt-4">
            <Image
              src="/images/ongc/ongc-logo.png"
              alt="ONGC logo"
              width={48}
              height={48}
              className="rounded-lg"
              priority
            />
            <span className="badge border border-blue-300/30 bg-blue-300/10 text-blue-300">
              ONGC CBT
            </span>
          </div>
          <h1 className="mt-3 text-4xl lg:text-5xl font-extrabold leading-tight">
            ONGC {row.discipline}
          </h1>
          <p className="mt-4 max-w-2xl text-white/80">{row.qualification}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={ONGC_RECRUITMENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cg-neon inline-flex items-center gap-2 rounded-lg border border-blue-300/70 bg-blue-300/10 px-5 py-3 text-sm font-semibold text-blue-100 transition hover:bg-blue-300/20"
            >
              Official Notification <span aria-hidden>↗</span>
            </a>
            <Link
              href="/psu/ongc"
              className="btn bg-white/10 text-white border border-white/30 hover:bg-white/20"
            >
              All disciplines
            </Link>
          </div>
        </div>
      </section>

      <OngcMockPlan discipline={row.discipline} slug={row.slug} unlocked={unlocked} />

      <section className="border-t border-line bg-paper/40">
        <div className="max-w-3xl mx-auto px-5 py-12 text-center">
          <h3 className="text-lg font-bold text-ink">Get ONGC {row.discipline} exam updates</h3>
          <p className="mt-1 text-sm text-muted">
            New mock releases, ONGC notification alerts, and prep tips — once a week.
          </p>
          <div className="mt-4 flex justify-center">
            <NewsletterForm source="psu-ongc-discipline" />
          </div>
        </div>
      </section>
    </>
  );
}

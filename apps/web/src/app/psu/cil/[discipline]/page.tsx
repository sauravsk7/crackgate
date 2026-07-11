import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CIL_ROWS, getCilDiscipline, CIL_RECRUITMENT_URL } from "@/data/cil";
import { CilMockPlan } from "@/components/cil-mock-plan";
import { Breadcrumb } from "@/components/breadcrumb";
import { ShareOnWhatsApp } from "@/components/share-on-whatsapp";
import { NewsletterForm } from "@/components/newsletter-form";
import { auth } from "@/lib/auth";
import { hasEntitlement } from "@/lib/entitlements";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return CIL_ROWS.map((r) => ({ discipline: r.slug }));
}

export async function generateMetadata(props: { params: Promise<{ discipline: string }> }) {
  const { discipline } = await props.params;
  const row = getCilDiscipline(discipline);
  if (!row) {
    return { title: "CIL · CrackGate", description: "Coal India Limited Management Trainee exam preparation with discipline-specific mock tests." };
  }
  return {
    title: `CIL ${row.discipline} · Mock Series · CrackGate`,
    openGraph: { images: [{ url: "/api/og?subject=" + encodeURIComponent("CIL " + row.discipline) + "&title=" + encodeURIComponent("Management Trainee Exam Prep"), alt: `CIL ${row.discipline} Management Trainee Exam Prep` }] },
    description: `Crack Coal India Management Trainee ${row.discipline} exam. ${row.qualification}. Practice with mock tests tailored to the CIL exam pattern.`,
    alternates: { canonical: "/psu/cil/" + discipline },
  };
}

export default async function CilDisciplinePage(props: { params: Promise<{ discipline: string }> }) {
  const { discipline } = await props.params;
  const row = getCilDiscipline(discipline);
  if (!row) notFound();

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin";
  const unlocked = isAdmin || (await hasEntitlement(userId ?? "", "PSU", row.slug));

  return (
    <>
      <section className="relative overflow-hidden bg-[#0055A4] text-white">
        {/* Background image — coal mine */}
        <div className="absolute inset-0">
          <Image
            src="/images/cil/coal-mine-bg.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-20"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0055A4] via-[#0055A4]/90 to-[#0055A4]/60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 py-14 lg:py-16">
          <div className="flex items-start justify-between">
            <Breadcrumb className="text-white/60 [&_a]:hover:text-white [&_span]:text-white" crumbs={[
              { label: "Home", href: "/" },
              { label: "PSU", href: "/psu" },
              { label: "CIL", href: "/psu/cil" },
              { label: row.discipline },
            ]} />
            <ShareOnWhatsApp />
          </div>
          <div className="flex items-center gap-3 mt-4">
            <Image
              src="/images/cil/cil-logo.png"
              alt="CIL logo"
              width={48}
              height={48}
              className="rounded-lg"
              priority
            />
            <span className="badge border border-cyan-300/30 bg-cyan-300/10 text-cyan-300">
              Post Code {row.code}
            </span>
          </div>
          <h1 className="mt-3 text-4xl lg:text-5xl font-extrabold leading-tight">
            CIL {row.discipline} — Management Trainee
          </h1>
          <p className="mt-4 max-w-2xl text-white/80">{row.qualification}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={CIL_RECRUITMENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cg-neon inline-flex items-center gap-2 rounded-lg border border-cyan-400/70 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
            >
              Official Notification <span aria-hidden>↗</span>
            </a>
            <Link
              href="/psu/cil"
              className="btn bg-white/10 text-white border border-white/30 hover:bg-white/20"
            >
              All disciplines
            </Link>
          </div>
        </div>
      </section>

      <CilMockPlan discipline={row.discipline} slug={row.slug} unlocked={unlocked} />

      <section className="border-t border-line bg-paper/40">
        <div className="max-w-3xl mx-auto px-5 py-12 text-center">
          <h3 className="text-lg font-bold text-ink">Get CIL {row.discipline} exam updates</h3>
          <p className="mt-1 text-sm text-muted">
            New mock releases, CIL notification alerts, and prep tips — once a week.
          </p>
          <div className="mt-4 flex justify-center">
            <NewsletterForm source="psu-cil-discipline" />
          </div>
        </div>
      </section>
    </>
  );
}

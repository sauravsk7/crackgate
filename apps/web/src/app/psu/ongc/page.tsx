import Link from "next/link";
import { ONGC_ROWS } from "@/data/ongc";
import { ONGC_PATTERN } from "@/data/ongc-mocks";
import { NewsletterForm } from "@/components/newsletter-form";

export const metadata = {
  title: "PSU · ONGC CBT · CrackGate",
  description:
    "Crack ONGC CBT recruitment exam. Tailored mock tests for Mechanical, Petroleum, Chemical, Electrical, Geology, Geophysics, and Physics with official exam pattern.",
  alternates: { canonical: "/psu/ongc" },
};

export default function PsuOngcPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-r from-amber-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-5 py-14 lg:py-20">
          <span className="badge border border-amber-300/30 bg-amber-300/10 text-amber-300">ONGC CBT</span>
          <h1 className="mt-4 text-4xl lg:text-5xl font-extrabold leading-tight">
            Oil and Natural Gas Corporation
          </h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Prepare for ONGC&apos;s Computer-Based Test with discipline-specific mock tests.
            {ONGC_PATTERN.questions} MCQs · {ONGC_PATTERN.durationMin / 60} hours · No negative marking.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/60">
            <span>Domain Knowledge · {ONGC_PATTERN.sections[0].count} Q</span>
            <span>·</span>
            <span>Aptitude · {ONGC_PATTERN.sections[1].count} Q</span>
            <span>·</span>
            <span>General Awareness · {ONGC_PATTERN.sections[2].count} Q</span>
            <span>·</span>
            <span>English · {ONGC_PATTERN.sections[3].count} Q</span>
          </div>
        </div>
      </section>

      {/* DISCIPLINE CARDS */}
      <section id="disciplines" className="max-w-7xl mx-auto px-5 py-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-ink">Mock series by discipline</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Pick your discipline to open its dedicated <b>15-mock ONGC series</b> in the official{" "}
              {ONGC_PATTERN.questions} Q · {ONGC_PATTERN.durationMin / 60} hr CBT pattern.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ONGC_ROWS.map((r) => (
            <Link
              key={r.slug}
              href={`/psu/ongc/${r.slug}`}
              className="card group flex flex-col p-6 transition hover:-translate-y-1 hover:shadow-pop"
            >
              <div className="flex items-center justify-between">
                <span className="badge bg-amber-400/15 text-amber-700 dark:text-amber-300">CBT</span>
                <span className="badge badge-pro">15 mocks</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink">{r.discipline}</h3>
              <p className="mt-2 flex-1 text-sm text-muted leading-snug">{r.qualification}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                Open mock series <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="border-t border-line bg-paper/40">
        <div className="max-w-3xl mx-auto px-5 py-16 text-center">
          <h3 className="text-xl font-bold text-ink">Get ONGC CBT exam updates</h3>
          <p className="mt-2 text-sm text-muted">
            New mock releases, notification alerts, and prep tips for ONGC recruitment — once a week.
          </p>
          <div className="mt-5 flex justify-center">
            <NewsletterForm source="psu-ongc" />
          </div>
        </div>
      </section>
    </>
  );
}

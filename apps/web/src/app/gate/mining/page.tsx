import { MOCKS } from "@/data/mocks";
import { PRACTICE } from "@/data/practice";
import dynamicImport from "next/dynamic";

const GateWindow = dynamicImport(() => import("@/components/hero-carousel").then((m) => m.GateWindow));

export const metadata = {
  title: "GATE Mining (MN) · CrackGate",
  description:
    "Complete GATE Mining Engineering preparation — 20 full-length mocks, 2000+ practice questions, IIT-authored learn modules, SWOT analytics, and NTA-style exam portal.",
  alternates: { canonical: "/gate/mining" },
};
export const dynamic = "force-dynamic";

export default async function GateMiningPage() {
  const practiceQs = PRACTICE.reduce((s, sub) => s + sub.questions.length, 0);
  const subjectsCount = PRACTICE.length;
  const mocksCount = MOCKS.length;

  return (
    <>
      {/* ---------- HERO (GATE MN 2027 banner) ---------- */}
      <section className="relative bg-slate-950 text-white">
        <div className="relative min-h-[680px] lg:min-h-[720px]">
          <GateWindow practiceQs={practiceQs} mocksCount={mocksCount} subjectsCount={subjectsCount} />
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section className="max-w-7xl mx-auto px-5 py-20">
        <h2 className="text-3xl font-extrabold text-center">Everything you need to crack GATE MN.</h2>
        <p className="mt-3 text-muted text-center max-w-2xl mx-auto">
          Hyper-focused on mining. No generic content, no padding — every question is graded automatically with detailed solutions.
        </p>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Feature icon="🧪" title={`${mocksCount} Full-length Mocks`} desc="Exam-pattern papers with section-wise analysis and subject SWOT. First mock free." />
          <Feature icon="📚" title={`${practiceQs}+ Practice Questions`} desc="Topic-wise practice across all subjects, each with worked solutions and instant grading." />
          <Feature icon="📊" title="SWOT Analytics" desc="Subject-wise strengths/weaknesses graphs. Time spent per question. Accuracy trend." />
          <Feature icon="🎯" title="NTA-style Live Portal" desc="Identical look to the real CBT — palette, mark-for-review, timer, auto-submit." />
          <Feature icon="🛡️" title="Server-side Grading" desc="Scores are computed on our servers — tamper-proof. Detailed report after every attempt." />
          <Feature icon="📱" title="Mobile-first" desc="Practice on phone or laptop — your progress syncs across devices." />
        </div>
      </section>

    </>
  );
}

function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="card p-6">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 font-bold">{title}</h3>
      <p className="mt-2 text-sm text-muted">{desc}</p>
    </div>
  );
}

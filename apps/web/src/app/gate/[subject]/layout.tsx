import { notFound } from "next/navigation";
import { getGateSubject, liveGateSubjects, KNOWN_COMING_SOON } from "@/data/gate/registry";
import { SubjectHeader } from "@/components/subject-header";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [...liveGateSubjects(), ...KNOWN_COMING_SOON].map((subject) => ({ subject }));
}

export default async function GateSubjectLayout(
  props: { children: React.ReactNode; params: Promise<{ subject: string }> },
) {
  const { subject } = await props.params;
  const meta = getGateSubject(subject);

  // Unknown slug that is neither live nor a known "coming soon" subject → 404.
  if (!meta && !KNOWN_COMING_SOON.has(subject)) notFound();

  // Mining has its own MiningHeader via the root layout's ShowOnMiningSite —
  // skip SubjectHeader to avoid a duplicate nav.
  if (!meta || subject === "mining") return <>{props.children}</>;

  return (
    <>
      <SubjectHeader subject={subject} />
      {props.children}
    </>
  );
}

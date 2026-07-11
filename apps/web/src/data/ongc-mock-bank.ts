// ONGC CBT question-bank registry.
//
// Each shipped set is a JSON file under `questions/ongc/<slug>/ongc-<slug>-NN.json`
// in the full ONGC CBT pattern (85 MCQ · 2 h · no negative marking). Register a
// new set by importing it and adding it to {@link ONGC_SETS}; the discipline
// page and the exam portal pick it up automatically.

import type { Question } from "@/lib/grading";

import geologySet01 from "./questions/ongc/geology/ongc-geology-01.json";
import geologySet02 from "./questions/ongc/geology/ongc-geology-02.json";
import geologySet03 from "./questions/ongc/geology/ongc-geology-03.json";
import geologySet04 from "./questions/ongc/geology/ongc-geology-04.json";
import geologySet05 from "./questions/ongc/geology/ongc-geology-05.json";
import geologySet06 from "./questions/ongc/geology/ongc-geology-06.json";
import geologySet07 from "./questions/ongc/geology/ongc-geology-07.json";
import geologySet08 from "./questions/ongc/geology/ongc-geology-08.json";

export type OngcSet = {
  /** Stable mock id, e.g. "ongc-geology-01". Drives the runner route /mocks/<id>. */
  id: string;
  /** Discipline slug (matches ONGC_ROWS slug + the PSU entitlement subject). */
  slug: string;
  /** Set number 1–15 within the discipline series (11–15 = Advanced tier). */
  no: number;
  title: string;
  discipline: string;
  durationMin: number;
  totalMarks: number;
  negativeMarking: boolean;
  questions: Question[];
};

// ── Registered sets ──────────────────────────────────────────────────────────
// Add `import geologySetNN from "./questions/ongc/geology/ongc-geology-NN.json";`
// and push `geologySetNN as unknown as OngcSet` below as each set ships.
const ONGC_SETS: OngcSet[] = [
  geologySet01 as unknown as OngcSet,
  geologySet02 as unknown as OngcSet,
  geologySet03 as unknown as OngcSet,
  geologySet04 as unknown as OngcSet,
  geologySet05 as unknown as OngcSet,
  geologySet06 as unknown as OngcSet,
  geologySet07 as unknown as OngcSet,
  geologySet08 as unknown as OngcSet,
];

export const ONGC_MOCK_BANK: ReadonlyMap<string, OngcSet> = new Map(
  ONGC_SETS.map((s) => [s.id, s]),
);

/** Live (shipped) set numbers for a discipline — used to flip plan cards live. */
export function ongcLiveSetNos(slug: string): ReadonlySet<number> {
  return new Set(ONGC_SETS.filter((s) => s.slug === slug).map((s) => s.no));
}

/** All registered ONGC mock ids (for static params / id enumeration). */
export function ongcMockIds(): string[] {
  return ONGC_SETS.map((s) => s.id);
}

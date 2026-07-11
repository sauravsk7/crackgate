// ONGC CBT mock-test plan.
//
// ONGC CBT is a 2-hour CBT of 85 MCQs with NO negative marking:
//   • Domain Knowledge (40 Q) — discipline-specific technical paper
//   • Aptitude (25 Q) — quantitative, reasoning, data interpretation
//   • General Awareness (10 Q) — current affairs, static GK
//   • English Language (10 Q) — grammar, comprehension, vocabulary
//
// We model a 15 full-length mock series per discipline: 10 standard sets plus
// 5 Advanced "Conceptual" sets (11–15) that run the same official pattern at a
// higher difficulty. Cards are "coming-soon" until the question bank for that
// set is wired in.

export const ONGC_PATTERN = {
  questions: 85,
  durationMin: 120,
  marks: 85,
  negativeMarking: false,
  sections: [
    { name: "Domain Knowledge", count: 40 },
    { name: "Aptitude", count: 25 },
    { name: "General Awareness", count: 10 },
    { name: "English Language", count: 10 },
  ],
} as const;

export type OngcMockStatus = "coming-soon" | "live";

export type OngcMockSection = { name: string; count: number };

export type OngcMock = {
  no: number;
  title: string;
  questions: number;
  durationMin: number;
  sections: OngcMockSection[];
  status: OngcMockStatus;
};

/** Section layout shared by every full-length ONGC CBT set. */
export const ONGC_FULL_SECTIONS: OngcMockSection[] = [
  { name: "Domain Knowledge", count: 40 },
  { name: "Aptitude", count: 25 },
  { name: "General Awareness", count: 10 },
  { name: "English Language", count: 10 },
];

/**
 * Build the full-length plan for a discipline (10 standard sets + 5 Advanced
 * "Conceptual" sets, 11–15). Statuses are overlaid from whichever set numbers
 * have actually shipped (see the ONGC mock bank).
 */
export function buildOngcMockPlan(liveSetNos: ReadonlySet<number> = new Set()): OngcMock[] {
  return Array.from({ length: 15 }, (_, i) => {
    const no = i + 1;
    const title =
      no === 15
        ? "Advanced Mock 15 — Final Challenge"
        : no >= 11
          ? `Advanced Mock ${no} — Conceptual`
          : no === 10
            ? "Full-length Mock 10 — Grand Finale"
            : `Full-length Mock ${String(no).padStart(2, "0")}`;
    return {
      no,
      title,
      questions: ONGC_PATTERN.questions,
      durationMin: ONGC_PATTERN.durationMin,
      sections: ONGC_FULL_SECTIONS,
      status: liveSetNos.has(no) ? "live" : "coming-soon",
    };
  });
}

/** Default plan with no sets live yet (used where discipline is unknown). */
export const ONGC_MOCK_PLAN: OngcMock[] = buildOngcMockPlan();

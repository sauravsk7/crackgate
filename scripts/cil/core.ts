/**
 * CrackGate — CIL Management Trainee shared mock-build core.
 *
 * Every CIL discipline shares an identical Paper-I (General Awareness,
 * Numerical Ability, Reasoning, General English = 100 Q) and the same
 * deterministic RNG, validation and per-question metadata. The discipline-
 * specific part is only Paper-II (Professional Knowledge = 100 Q), supplied by
 * each `scripts/cil/<slug>.ts` as a `genProfessional` function.
 *
 * The shared Paper-I + helpers live in `scripts/build_cil_civil.ts` (which
 * doubles as the Civil generator); this module re-uses them and adds a generic
 * driver so a new discipline is a thin file:
 *
 *   import { runDiscipline } from "./core";
 *   runDiscipline({ slug, discipline, seedBase, genProfessional });
 *
 * Output: apps/web/src/data/questions/cil/<slug>/cil-<slug>-NN.json
 * Pattern: 200 MCQ · 2 papers · 1 mark each · 3 h · NO negative marking.
 * Sets 1–10 are standard; sets 11–15 are the Advanced (Conceptual) tier
 * (higher hard quota + a slice of tricky conceptual items).
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

import {
  rng,
  attachMeta,
  validate,
  SUBJ,
  genNumerical,
  genReasoning,
  genGeneralAwareness,
  genGeneralEnglish,
} from "../build_cil_civil";
import type { Q } from "../build_cil_civil";

/** Per-discipline configuration consumed by the shared driver. */
export interface DisciplineConfig {
  /** URL slug (matches CIL_ROWS slug + the PSU entitlement subject), e.g. "electrical". */
  slug: string;
  /** Human label used in titles, e.g. "Electrical". */
  discipline: string;
  /** Base RNG seed; each set uses `seedBase + setNo * 7919`. Vary per discipline. */
  seedBase: number;
  /** Paper-II generator: returns exactly 100 questions (ids startId..startId+99). */
  genProfessional: (
    rand: () => number,
    startId: number,
    setNo: number,
    tough: boolean,
  ) => Q[];
}

/**
 * Build one full-length set for a discipline. Paper-I is identical across
 * disciplines; Paper-II comes from `cfg.genProfessional`. Sets ≥ 11 are the
 * Advanced (Conceptual) tier (the `tough` flag raises hard quotas).
 */
export function buildDisciplineSet(cfg: DisciplineConfig, setNo: number) {
  const seed = cfg.seedBase + setNo * 7919; // distinct per set
  const rand = rng(seed);
  const nn = String(setNo).padStart(2, "0");
  const tough = setNo >= 11;

  const questions: Q[] = [
    ...genGeneralAwareness(rand, 1, setNo), // 1..25
    ...genNumerical(rand, 26, tough), // 26..50
    ...genReasoning(rand, 51, tough), // 51..75
    ...genGeneralEnglish(rand, 76, setNo), // 76..100
    ...cfg.genProfessional(rand, 101, setNo, tough), // 101..200
  ];
  questions.forEach(attachMeta);

  return {
    id: `cil-${cfg.slug}-${nn}`,
    slug: cfg.slug,
    no: setNo,
    title: tough
      ? `CIL ${cfg.discipline} — Advanced Mock ${nn} (Conceptual)`
      : `CIL ${cfg.discipline} — Full-length Mock ${nn}`,
    discipline: cfg.discipline,
    durationMin: 180,
    totalMarks: 200,
    negativeMarking: false,
    pattern: "CIL MT — 200 MCQ · 2 papers · 1 mark each · no negative marking",
    sections: [
      { name: SUBJ.ga, count: 25, marks: 25 },
      { name: SUBJ.num, count: 25, marks: 25 },
      { name: SUBJ.reas, count: 25, marks: 25 },
      { name: SUBJ.eng, count: 25, marks: 25 },
      { name: SUBJ.prof, count: 100, marks: 100 },
    ],
    questions,
  };
}

/**
 * CLI driver: parse `--only` / `--from` / `--to`, build the requested sets,
 * validate each (200 Q · 25/25/25/25/100), and write the JSON files. Defaults
 * to the full series (sets 1–15) since, unlike Civil, the other disciplines
 * have no hand-authored Set 1.
 */
export function runDiscipline(cfg: DisciplineConfig) {
  const args = new Map(
    process.argv.slice(2).map((a) => {
      const [k, v] = a.replace(/^--/, "").split("=");
      return [k, v ?? "true"] as const;
    }),
  );
  const only = (args.get("only") ?? "").split(",").filter(Boolean).map(Number);
  const from = Number(args.get("from") ?? 1);
  const to = Number(args.get("to") ?? 15);
  const targets = only.length ? only : Array.from({ length: to - from + 1 }, (_, i) => from + i);

  const outDir = resolve(process.cwd(), `apps/web/src/data/questions/cil/${cfg.slug}`);
  mkdirSync(outDir, { recursive: true });

  let failed = false;
  for (const n of targets) {
    if (n < 1 || n > 15) {
      console.warn(`skip set ${n}: only sets 1–15 are defined`);
      continue;
    }
    const set = buildDisciplineSet(cfg, n);
    const errs = validate(set as unknown as Parameters<typeof validate>[0]);
    if (errs.length) {
      failed = true;
      console.error(`✗ ${cfg.slug} set ${n} FAILED validation:`);
      errs.forEach((e) => console.error(`   - ${e}`));
      continue;
    }
    const file = resolve(outDir, `${set.id}.json`);
    writeFileSync(file, `${JSON.stringify(set, null, 2)}\n`, "utf8");
    console.log(`✓ ${set.id}.json — 200 Q (25/25/25/25/100)`);
  }

  if (failed) process.exitCode = 1;
}

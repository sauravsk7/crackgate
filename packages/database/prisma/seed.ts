/* Idempotent dev seed: an admin user + one demo learner with two attempts. */
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  const admin = await db.user.upsert({
    where: { email: "admin@crackgate.in" },
    create: {
      email: "admin@crackgate.in",
      name: "CrackGate Admin",
      role: "admin",
      plan: "premium",
    },
    update: {},
  });

  const demo = await db.user.upsert({
    where: { email: "demo@crackgate.in" },
    create: {
      email: "demo@crackgate.in",
      name: "Demo Learner",
      plan: "free",
      targetYear: "GATE 2026",
    },
    update: {},
  });

  await db.attempt.createMany({
    data: [
      {
        userId: demo.id,
        kind: "mock",
        refId: "mock-01",
        refTitle: "Mock 01 — Full Length",
        score: 62,
        total: 100,
        correct: 32,
        wrong: 12,
        skipped: 21,
        breakdown: { "Mine Ventilation": 12, "Rock Mechanics": 9 },
        answersJson: {},
        durationSec: 6800,
      },
      {
        userId: demo.id,
        kind: "pyq",
        refId: "pyq-2023",
        refTitle: "GATE 2023 — Full Paper",
        score: 71,
        total: 100,
        correct: 38,
        wrong: 10,
        skipped: 17,
        breakdown: { "Surface Mining": 14, "Drilling & Blasting": 11 },
        answersJson: {},
        durationSec: 9100,
      },
    ],
  });

  console.log("seeded:", { admin: admin.email, demo: demo.email });
}

main().finally(() => db.$disconnect());

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DIR = "apps/web/src/data/questions/ongc/physics";

function loadMock(no) {
  const path = join(DIR, `ongc-physics-${String(no).padStart(2, "0")}.json`);
  return { path, data: JSON.parse(readFileSync(path, "utf-8")) };
}

function saveMock(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  console.log(`  ✓ Saved ${path}`);
}

// ── Fix 1: Wrap raw SVG strings in figure field ──
function wrapFigureSVGs(mock) {
  let fixed = 0;
  for (const q of mock.data.questions) {
    if (typeof q.figure === "string" && q.figure.trim().startsWith("<svg")) {
      q.figure = { kind: "svg", markup: q.figure, caption: "" };
      fixed++;
    }
  }
  return fixed;
}

// ── Fix 2: Remove stray top-level svg fields ──
function removeStraySVGFields(mock) {
  let removed = 0;
  for (const q of mock.data.questions) {
    if (q.svg !== undefined) {
      delete q.svg;
      removed++;
    }
  }
  return removed;
}

// ── GA questions for mock 07 ──
const GA_QUESTIONS_MOCK07 = [
  {
    id: 76,
    subject: "General Awareness",
    topic: "Current Affairs · Energy & PSU",
    section: "GA",
    type: "MCQ",
    marks: 1,
    difficulty: "easy",
    stem: "Which Indian space agency successfully landed Chandrayaan-3 on the Moon's south pole in August 2023?",
    options: ["ISRO", "NASA", "ESA", "JAXA"],
    answer: 0,
    solution: "ISRO (Indian Space Research Organisation) successfully soft-landed Chandrayaan-3's Vikram lander near the Moon's south pole on August 23, 2023, making India the fourth country to achieve a soft lunar landing.",
    estSec: 15,
    topicWeight: 0.1,
    source: "curated",
  },
  {
    id: 77,
    subject: "General Awareness",
    topic: "Current Affairs · Economy",
    section: "GA",
    type: "MCQ",
    marks: 1,
    difficulty: "medium",
    stem: "The Reserve Bank of India (RBI) maintains a policy repo rate. As of early 2024, the repo rate stood at:",
    options: ["6.50%", "6.00%", "7.00%", "5.75%"],
    answer: 0,
    solution: "The RBI maintained the repo rate at 6.50% through its February 2024 policy review, having paused rate hikes since February 2023 after a series of increases from 4.00% in early 2022.",
    estSec: 25,
    topicWeight: 0.1,
    source: "curated",
  },
  {
    id: 78,
    subject: "General Awareness",
    topic: "Current Affairs · Science & Defense",
    section: "GA",
    type: "MCQ",
    marks: 1,
    difficulty: "medium",
    stem: "India's first indigenous aircraft carrier, commissioned in 2022, is named:",
    options: ["INS Vikrant", "INS Vikramaditya", "INS Arihant", "INS Kolkata"],
    answer: 0,
    solution: "INS Vikrant (R11) was commissioned on September 2, 2022. It is India's first indigenous aircraft carrier and the first warship to be designed and built in India, displacing approximately 45,000 tonnes.",
    estSec: 20,
    topicWeight: 0.1,
    source: "curated",
  },
  {
    id: 79,
    subject: "General Awareness",
    topic: "Static GK · Geography",
    section: "GA",
    type: "MCQ",
    marks: 1,
    difficulty: "easy",
    stem: "Which of the following is the longest river in peninsular India?",
    options: ["Godavari", "Krishna", "Narmada", "Mahanadi"],
    answer: 0,
    solution: "The Godavari River, at approximately 1,465 km, is the longest river in peninsular India. It rises in Maharashtra and flows through Telangana and Andhra Pradesh before draining into the Bay of Bengal.",
    estSec: 15,
    topicWeight: 0.1,
    source: "curated",
  },
  {
    id: 80,
    subject: "General Awareness",
    topic: "Static GK · Polity",
    section: "GA",
    type: "MCQ",
    marks: 1,
    difficulty: "medium",
    stem: "The 73rd Constitutional Amendment Act deals with:",
    options: [
      "Panchayati Raj Institutions",
      "Municipalities",
      "Cooperative societies",
      "Right to Education",
    ],
    answer: 0,
    solution: "The 73rd Amendment (1992) constitutionalized Panchayati Raj Institutions (PRIs), establishing a three-tier local self-government system in rural India with provisions for reservations and regular elections.",
    estSec: 20,
    topicWeight: 0.1,
    source: "curated",
  },
  {
    id: 81,
    subject: "General Awareness",
    topic: "Current Affairs · Economy",
    section: "GA",
    type: "MCQ",
    marks: 1,
    difficulty: "easy",
    stem: "The GST (Goods and Services Tax) in India was implemented from:",
    options: ["July 1, 2017", "April 1, 2017", "October 1, 2017", "January 1, 2018"],
    answer: 0,
    solution: "India's GST was implemented on July 1, 2017, replacing multiple indirect taxes with a unified tax structure. The Constitutional 101st Amendment Act enabled this reform.",
    estSec: 15,
    topicWeight: 0.1,
    source: "curated",
  },
  {
    id: 82,
    subject: "General Awareness",
    topic: "Current Affairs · International Bodies",
    section: "GA",
    type: "MCQ",
    marks: 1,
    difficulty: "medium",
    stem: "The G20 summit held in India in September 2023 took place in which city?",
    options: ["New Delhi", "Mumbai", "Kolkata", "Bengaluru"],
    answer: 0,
    solution: "The 18th G20 Leaders' Summit was held on September 9–10, 2023, at the Bharat Mandapam in New Delhi. Under India's presidency, the African Union was admitted as a permanent member of the G20.",
    estSec: 15,
    topicWeight: 0.1,
    source: "curated",
  },
  {
    id: 83,
    subject: "General Awareness",
    topic: "Current Affairs · Science & Defense",
    section: "GA",
    type: "MCQ",
    marks: 1,
    difficulty: "medium",
    stem: "Which Indian mission was launched to study the Sun's corona and solar wind?",
    options: ["Aditya-L1", "Chandrayaan-3", "Mangalyaan-2", "Gaganyaan"],
    answer: 0,
    solution: "Aditya-L1 was launched by ISRO on September 2, 2023, and placed at the Sun-Earth Lagrange point L1 on January 6, 2024. It carries seven scientific payloads to study the Sun's corona, chromosphere, and solar wind.",
    estSec: 20,
    topicWeight: 0.1,
    source: "curated",
  },
  {
    id: 84,
    subject: "General Awareness",
    topic: "Static GK · Geography",
    section: "GA",
    type: "MCQ",
    marks: 1,
    difficulty: "easy",
    stem: "Which Indian state has the longest coastline?",
    options: ["Gujarat", "Maharashtra", "Andhra Pradesh", "Tamil Nadu"],
    answer: 0,
    solution: "Gujarat has the longest coastline among Indian states at approximately 1,600 km, including the Gulf of Kutch and Gulf of Khambhat. Andhra Pradesh is second with about 974 km.",
    estSec: 15,
    topicWeight: 0.1,
    source: "curated",
  },
  {
    id: 85,
    subject: "General Awareness",
    topic: "Current Affairs · Economy",
    section: "GA",
    type: "MCQ",
    marks: 1,
    difficulty: "medium",
    stem: "The UPI (Unified Payments Interface) system was developed by:",
    options: ["NPCI", "RBI", "SEBI", "TRAI"],
    answer: 0,
    solution: "UPI was developed by the National Payments Corporation of India (NPCI), which operates under the guidance of the RBI. Launched in April 2016, UPI has revolutionized digital payments in India.",
    estSec: 20,
    topicWeight: 0.1,
    source: "curated",
  },
];

// ── Aptitude questions for mock 10 (missing 5) ──
const APT_QUESTIONS_MOCK10 = [
  {
    id: 76,
    subject: "Aptitude",
    topic: "Quantitative · Percentage",
    section: "Aptitude",
    type: "MCQ",
    marks: 1,
    difficulty: "easy",
    stem: "A student scored 45% in an exam with 200 maximum marks. How many marks did the student score?",
    options: ["90", "100", "110", "80"],
    answer: 0,
    solution: "45% of 200 = 0.45 × 200 = 90 marks.",
    estSec: 15,
    topicWeight: 0.1,
    source: "curated",
  },
  {
    id: 77,
    subject: "Aptitude",
    topic: "Quantitative · Time & Work",
    section: "Aptitude",
    type: "MCQ",
    marks: 1,
    difficulty: "medium",
    stem: "A can do a piece of work in 15 days and B can do it in 20 days. Working together, they finish the work. B's share of the payment is Rs.1,200. Total payment is:",
    options: ["Rs.2,800", "Rs.3,000", "Rs.2,600", "Rs.2,400"],
    answer: 0,
    solution: "A's rate = 1/15, B's rate = 1/20. Ratio of work = 4:3. Total parts = 7. B's share = 3/7 of total. If 3/7 = Rs.1,200, total = Rs.2,800.",
    estSec: 30,
    topicWeight: 0.1,
    source: "curated",
  },
  {
    id: 78,
    subject: "Aptitude",
    topic: "Reasoning · Coding-Decoding",
    section: "Aptitude",
    type: "MCQ",
    marks: 1,
    difficulty: "medium",
    stem: "In a certain code language, COMPUTER is written as DNPQVUFS. How is SCIENCE written in that code?",
    options: ["TDJFODF", "TDJFODG", "SEJHPGE", "TDJFOEE"],
    answer: 0,
    solution: "Each letter is shifted by +1 in the alphabet: C→D, O→P, M→N, P→Q, U→V, T→U, E→F, R→S. So COMPUTER→DNPQVUFS. Similarly S(+1)=T, C(+1)=D, I(+1)=J, E(+1)=F, N(+1)=O, C(+1)=D, E(+1)=F. SCIENCE→TDJFODF.",
    estSec: 25,
    topicWeight: 0.1,
    source: "curated",
  },
  {
    id: 79,
    subject: "Aptitude",
    topic: "Quantitative · SI & CI",
    section: "Aptitude",
    type: "MCQ",
    marks: 1,
    difficulty: "medium",
    stem: "The compound interest on Rs.16,000 at 10% per annum for 2 years compounded annually is:",
    options: ["Rs.3,360", "Rs.3,200", "Rs.3,400", "Rs.3,600"],
    answer: 0,
    solution: "CI = P(1+r)ⁿ − P = 16000(1.10)² − 16000 = 16000(1.21) − 16000 = 19360 − 16000 = Rs.3,360.",
    estSec: 20,
    topicWeight: 0.1,
    source: "curated",
  },
  {
    id: 80,
    subject: "Aptitude",
    topic: "Quantitative · Ratio & Proportion",
    section: "Aptitude",
    type: "MCQ",
    marks: 1,
    difficulty: "easy",
    stem: "The ratio of boys to girls in a class is 3:2. If there are 30 girls, the total number of students is:",
    options: ["75", "50", "55", "60"],
    answer: 0,
    solution: "Boys:Girls = 3:2. Girls = 30, so 2 parts = 30, 1 part = 15. Boys = 45. Total = 45 + 30 = 75.",
    estSec: 15,
    topicWeight: 0.1,
    source: "curated",
  },
];

// ── Aptitude questions for mock 11 (missing 6) ──
const APT_QUESTIONS_MOCK11 = [
  {
    id: 74,
    subject: "Aptitude",
    topic: "Quantitative · Percentage",
    section: "Aptitude",
    type: "MCQ",
    marks: 1,
    difficulty: "easy",
    stem: "If a number is increased by 20% and then decreased by 20%, the net change is:",
    options: ["4% decrease", "No change", "4% increase", "2% decrease"],
    answer: 0,
    solution: "Let the number be 100. After 20% increase: 120. After 20% decrease: 120 × 0.8 = 96. Net change = 4% decrease.",
    estSec: 15,
    topicWeight: 0.1,
    source: "curated",
  },
  {
    id: 75,
    subject: "Aptitude",
    topic: "Quantitative · Time & Work",
    section: "Aptitude",
    type: "MCQ",
    marks: 1,
    difficulty: "medium",
    stem: "5 workers can build a wall in 10 days. How many workers are needed to build it in 5 days?",
    options: ["10", "8", "12", "15"],
    answer: 0,
    solution: "Work = 5 workers × 10 days = 50 worker-days. For 5 days: 50/5 = 10 workers needed.",
    estSec: 20,
    topicWeight: 0.1,
    source: "curated",
  },
  {
    id: 76,
    subject: "Aptitude",
    topic: "Quantitative · Profit & Loss",
    section: "Aptitude",
    type: "MCQ",
    marks: 1,
    difficulty: "easy",
    stem: "A man buys a toy for Rs.50 and sells it for Rs.65. His profit percentage is:",
    options: ["30%", "25%", "20%", "15%"],
    answer: 0,
    solution: "Profit = 65 − 50 = Rs.15. Profit% = (15/50) × 100 = 30%.",
    estSec: 15,
    topicWeight: 0.1,
    source: "curated",
  },
  {
    id: 77,
    subject: "Aptitude",
    topic: "Reasoning · Series",
    section: "Aptitude",
    type: "MCQ",
    marks: 1,
    difficulty: "medium",
    stem: "Find the next number: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "36", "44"],
    answer: 1,
    solution: "Differences: 4, 6, 8, 10, 12. Next number = 30 + 12 = 42. Alternatively, n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42.",
    estSec: 25,
    topicWeight: 0.1,
    source: "curated",
  },
  {
    id: 78,
    subject: "Aptitude",
    topic: "Quantitative · Speed, Distance & Time",
    section: "Aptitude",
    type: "MCQ",
    marks: 1,
    difficulty: "medium",
    stem: "A train 200 m long passes a pole in 20 seconds. The speed of the train is:",
    options: ["36 km/h", "40 km/h", "30 km/h", "45 km/h"],
    answer: 0,
    solution: "Speed = 200/20 = 10 m/s = 10 × 18/5 = 36 km/h.",
    estSec: 15,
    topicWeight: 0.1,
    source: "curated",
  },
  {
    id: 79,
    subject: "Aptitude",
    topic: "Quantitative · Averages",
    section: "Aptitude",
    type: "MCQ",
    marks: 1,
    difficulty: "easy",
    stem: "The average of 5 numbers is 20. If one number is removed, the average becomes 18. The removed number is:",
    options: ["28", "30", "25", "32"],
    answer: 0,
    solution: "Total of 5 = 100. Total of 4 = 72. Removed number = 100 − 72 = 28.",
    estSec: 20,
    topicWeight: 0.1,
    source: "curated",
  },
];

// ── Main execution ──
console.log("=== Fixing Physics Mocks ===\n");

// Fix Mock 03
console.log("Mock 03: Wrapping raw SVG figures...");
let m = loadMock(3);
const f3 = wrapFigureSVGs(m);
saveMock(m.path, m.data);
console.log(`  Fixed ${f3} figures\n`);

// Fix Mock 04
console.log("Mock 04: Wrapping raw SVG figures...");
m = loadMock(4);
const f4 = wrapFigureSVGs(m);
saveMock(m.path, m.data);
console.log(`  Fixed ${f4} figures\n`);

// Fix Mock 07
console.log("Mock 07: Wrapping raw SVG figures + adding 10 GA questions...");
m = loadMock(7);
const f7 = wrapFigureSVGs(m);
const gaCount = m.data.questions.filter(
  (q) => q.section === "GA" || q.subject === "General Awareness"
).length;
if (gaCount === 0) {
  m.data.questions.push(...GA_QUESTIONS_MOCK07);
  console.log(`  Added 10 GA questions (was ${m.data.questions.length - 10}, now ${m.data.questions.length})`);
} else {
  console.log(`  GA section already has ${gaCount} questions, skipping`);
}
saveMock(m.path, m.data);
console.log(`  Fixed ${f7} figures\n`);

// Fix Mock 10
console.log("Mock 10: Removing stray svg fields + adding 5 Aptitude questions...");
m = loadMock(10);
const r10 = removeStraySVGFields(m);
const apt10 = m.data.questions.filter(
  (q) => q.section === "Aptitude" || q.subject === "Aptitude"
).length;
console.log(`  Current Aptitude count: ${apt10}`);
if (apt10 < 25) {
  m.data.questions.push(...APT_QUESTIONS_MOCK10);
  console.log(`  Added ${APT_QUESTIONS_MOCK10.length} Aptitude questions (now ${m.data.questions.length} total)`);
}
saveMock(m.path, m.data);
console.log(`  Removed ${r10} stray svg fields\n`);

// Fix Mock 06
console.log("Mock 06: Removing stray svg fields...");
m = loadMock(6);
const r6 = removeStraySVGFields(m);
saveMock(m.path, m.data);
console.log(`  Removed ${r6} stray svg fields\n`);

// Fix Mock 11
console.log("Mock 11: Removing stray svg fields + adding 6 Aptitude questions...");
m = loadMock(11);
const r11 = removeStraySVGFields(m);
const apt11 = m.data.questions.filter(
  (q) => q.section === "Aptitude" || q.subject === "Aptitude"
).length;
console.log(`  Current Aptitude count: ${apt11}`);
if (apt11 < 25) {
  m.data.questions.push(...APT_QUESTIONS_MOCK11);
  console.log(`  Added ${APT_QUESTIONS_MOCK11.length} Aptitude questions (now ${m.data.questions.length} total)`);
}
saveMock(m.path, m.data);
console.log(`  Removed ${r11} stray svg fields\n`);

// Fix Mock 12
console.log("Mock 12: Removing stray svg fields...");
m = loadMock(12);
const r12 = removeStraySVGFields(m);
saveMock(m.path, m.data);
console.log(`  Removed ${r12} stray svg fields\n`);

// ── Validation ──
console.log("=== Validating All Mocks ===\n");
for (let i = 1; i <= 15; i++) {
  const { data } = loadMock(i);
  const total = data.questions.length;
  const domain = data.questions.filter((q) => q.section === "Domain").length;
  const apt = data.questions.filter((q) => q.section === "Aptitude").length;
  const ga = data.questions.filter((q) => q.section === "GA").length;
  const eng = data.questions.filter((q) => q.section === "English").length;

  // Check for raw SVG figures
  const rawSVGs = data.questions.filter(
    (q) => typeof q.figure === "string"
  ).length;

  // Check for stray svg fields
  const straySVGs = data.questions.filter((q) => q.svg !== undefined).length;

  const status =
    total === 85 &&
    domain === 40 &&
    apt === 25 &&
    ga === 10 &&
    eng === 10 &&
    rawSVGs === 0 &&
    straySVGs === 0
      ? "✓"
      : "✗";

  console.log(
    `Mock ${String(i).padStart(2, "0")}: ${status} total=${total} D=${domain} A=${apt} GA=${ga} E=${eng} rawSVG=${rawSVGs} stray=${straySVGs}`
  );
}

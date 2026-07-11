// ONGC CBT recruitment disciplines.
// Pattern: 85 MCQ · 120 min · No negative marking.
// Sections: Domain Knowledge (40), Aptitude (25), General Awareness (10), English (10).

export type OngcRow = {
  slug: string;
  discipline: string;
  qualification: string;
};

export const ONGC_ROWS: OngcRow[] = [
  { slug: "mechanical", discipline: "Mechanical Engineering", qualification: "Degree in Mechanical Engineering with minimum 60% marks" },
  { slug: "petroleum", discipline: "Petroleum Engineering", qualification: "Degree in Petroleum Engineering with minimum 60% marks" },
  { slug: "chemical", discipline: "Chemical Engineering", qualification: "Degree in Chemical Engineering with minimum 60% marks" },
  { slug: "electrical", discipline: "Electrical Engineering", qualification: "Degree in Electrical Engineering with minimum 60% marks" },
  { slug: "geology", discipline: "Geology", qualification: "M.Sc. in Geology / Applied Geology with minimum 60% marks" },
  { slug: "geophysics", discipline: "Geophysics", qualification: "M.Sc. in Geophysics / Applied Geophysics with minimum 60% marks" },
  { slug: "physics", discipline: "Physics", qualification: "M.Sc. in Physics with minimum 60% marks" },
];

/** Price to unlock a single ONGC discipline's 15-mock series, in paise (₹499). */
export const ONGC_PRICE_PAISE = 49900;
export const ONGC_PRICE_RUPEES = Math.round(ONGC_PRICE_PAISE / 100);

/** Look up an ONGC discipline by its URL slug. */
export function getOngcDiscipline(slug: string): OngcRow | undefined {
  return ONGC_ROWS.find((r) => r.slug === slug);
}

// Official ONGC recruitment notification (Advt. No. 1/2025 R&P).
export const ONGC_RECRUITMENT_URL =
  "https://www.ongcindia.com/web/eng/detail?assetEntry=84777603&assetClassPK=84777498";

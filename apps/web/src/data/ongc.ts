// ONGC CBT recruitment disciplines.
// Pattern: 85 MCQ · 120 min · No negative marking.
// Sections: Domain Knowledge (40), Aptitude (25), General Awareness (10), English (10).

export type OngcRow = {
  slug: string;
  discipline: string;
  qualification: string;
};

export const ONGC_ROWS: OngcRow[] = [
  { slug: "ongc-mechanical", discipline: "Mechanical Engineering", qualification: "Degree in Mechanical Engineering with minimum 60% marks" },
  { slug: "ongc-petroleum", discipline: "Petroleum Engineering", qualification: "Degree in Petroleum Engineering with minimum 60% marks" },
  { slug: "ongc-chemical", discipline: "Chemical Engineering", qualification: "Degree in Chemical Engineering with minimum 60% marks" },
  { slug: "ongc-electrical", discipline: "Electrical Engineering", qualification: "Degree in Electrical Engineering with minimum 60% marks" },
  { slug: "ongc-geology", discipline: "Geology", qualification: "M.Sc. in Geology / Applied Geology with minimum 60% marks" },
  { slug: "ongc-geophysics", discipline: "Geophysics", qualification: "M.Sc. in Geophysics / Applied Geophysics with minimum 60% marks" },
  { slug: "ongc-physics", discipline: "Physics", qualification: "M.Sc. in Physics with minimum 60% marks" },
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

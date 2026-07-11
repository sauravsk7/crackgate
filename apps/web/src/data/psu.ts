// PSU recruitment tracks — the public-sector companies CrackGate prepares for.
// Today only Coal India Limited (CIL) is live; the others are announced so
// aspirants can see the roadmap. Disciplines live one level deeper, on each
// company's page (e.g. /psu/cil lists CIL's Management Trainee disciplines).

export type PsuCompany = {
  /** Short code, used as the URL segment under /psu (e.g. "cil"). */
  slug: string;
  /** Abbreviation shown as the primary label. */
  short: string;
  /** Full company name. */
  name: string;
  /** Whether the track has live content / a dedicated page. */
  live: boolean;
  /** Optional sub-items (e.g. CIL MT and CIL DGMS under CIL). */
  children?: PsuCompany[];
};

export const PSU_COMPANIES: PsuCompany[] = [
  {
    slug: "cil",
    short: "CIL",
    name: "Coal India Limited",
    live: false,
    children: [
      { slug: "cil", short: "CIL MT", name: "Management Trainee", live: true },
      { slug: "cil-dgms", short: "CIL DGMS", name: "DGMS", live: false },
    ],
  },
  { slug: "ongc", short: "ONGC", name: "Oil and Natural Gas Corporation", live: true },
  { slug: "nmdc", short: "NMDC", name: "National Mineral Development Corporation", live: false },
  { slug: "moil", short: "MOIL", name: "Manganese Ore India Limited", live: false },
  { slug: "ntpc", short: "NTPC", name: "National Thermal Power Corporation", live: false },
];

/** Path to a company's landing page when it is live, else undefined. */
export function psuCompanyHref(c: PsuCompany): string | undefined {
  return c.live ? `/psu/${c.slug}` : undefined;
}

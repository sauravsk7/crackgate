"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PSU_COMPANIES } from "@/data/psu";

type Leaf = { href: string; label: string; soon?: boolean };

// Top-level destinations for the always-visible pill strip.
const SECTION_PILLS: Leaf[] = [
  { href: "/gate", label: "GATE" },
  { href: "/psu", label: "PSU" },
  { href: "/state", label: "State" },
  { href: "/diploma", label: "Diploma" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About" },
];


/**
 * Always-visible, horizontally-scrollable strip of section pills.
 * Shown only on mobile (md:hidden) directly under the header row so the
 * primary sections are discoverable without opening the drawer.
 */
export function MobileSectionBar() {
  const pathname = usePathname();
  const [psuOpen, setPsuOpen] = useState(false);

  const isPsuActive = pathname?.startsWith("/psu");

  return (
    <div className="md:hidden border-t border-line">
      <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar px-3 py-2">
        {SECTION_PILLS.map((l) => {
          if (l.href === "/psu") {
            const active = isPsuActive || psuOpen;
            return (
              <div key="psu" className="relative">
                <button
                  type="button"
                  onClick={() => setPsuOpen(!psuOpen)}
                  className={cn(
                    "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition inline-flex items-center gap-1",
                    active ? "bg-brand text-white" : "bg-canvas text-ink hover:bg-brand/10",
                  )}
                >
                  PSU
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={cn("transition-transform", psuOpen && "rotate-180")}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* PSU dropdown panel */}
                {psuOpen && (
                  <>
                    <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setPsuOpen(false)} />
                    <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[70dvh] overflow-y-auto rounded-t-2xl border-t border-line bg-surface p-4 pb-8 shadow-lg">
                      <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" />
                      <p className="text-[11px] font-bold uppercase tracking-wide text-muted mb-3">
                        Recruitment by company
                      </p>
                      <div className="space-y-1">
                        {PSU_COMPANIES.map((c) =>
                          c.children ? (
                            <div key={c.slug}>
                              <div className="px-3 py-2.5 rounded-lg bg-canvas/50">
                                <span className="text-sm font-bold text-ink">{c.short}</span>
                                <span className="text-xs text-muted ml-2">{c.name}</span>
                              </div>
                              <div className="ml-3 mt-1 space-y-0.5">
                                {c.children.map((child) =>
                                  child.live ? (
                                    <Link
                                      key={child.slug}
                                      href={`/psu/${child.slug}`}
                                      onClick={() => setPsuOpen(false)}
                                      className={cn(
                                        "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5",
                                        pathname === `/psu/${child.slug}` || pathname.startsWith(`/psu/${child.slug}/`)
                                          ? "bg-brand/10 text-brand"
                                          : "hover:bg-canvas",
                                      )}
                                    >
                                      <span className="text-sm font-medium text-ink">{child.short}</span>
                                      <span className="text-xs text-muted">{child.name}</span>
                                    </Link>
                                  ) : (
                                    <div
                                      key={child.slug}
                                      className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 opacity-60"
                                    >
                                      <span className="text-sm font-medium text-ink/70">{child.short}</span>
                                      <span className="badge badge-pro text-[10px]">Soon</span>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          ) : c.live ? (
                            <Link
                              key={c.slug}
                              href={`/psu/${c.slug}`}
                              onClick={() => setPsuOpen(false)}
                              className={cn(
                                "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5",
                                pathname === `/psu/${c.slug}` || pathname.startsWith(`/psu/${c.slug}/`)
                                  ? "bg-brand/10 text-brand"
                                  : "hover:bg-canvas",
                              )}
                            >
                              <span className="text-sm font-bold text-ink">{c.short}</span>
                              <span className="text-xs text-muted">{c.name}</span>
                            </Link>
                          ) : (
                            <div
                              key={c.slug}
                              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 opacity-60"
                            >
                              <span className="text-sm font-bold text-ink/70">{c.short}</span>
                              <span className="badge badge-pro text-[10px]">Soon</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          }

          const active = pathname === l.href || pathname.startsWith(l.href + "/");
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition",
                active ? "bg-brand text-white" : "bg-canvas text-ink hover:bg-brand/10",
              )}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

/**
 * The self-contained GATE Mining mini-site spans these route prefixes. On
 * these paths the global header is hidden and the Mining header is shown.
 */
const MINING_SITE_PREFIXES = ["/gate/mining", "/learn", "/practice", "/mocks", "/aits", "/pricing"];

/**
 * Newer GATE subjects live under /gate/<slug>/* with their own SubjectHeader
 * (rendered by the subject layout). On these paths the global header is hidden
 * but the Mining header is NOT shown. Keep in sync with liveGateSubjects().
 */
const LIVE_SUBJECT_PREFIXES = ["/gate/civil", "/gate/geology", "/gate/environment"];

function isMiningSite(pathname: string | null): boolean {
  if (!pathname) return false;
  // Mocks for non-Mining tracks use the shared runner but belong to their own
  // track, so they keep the global header (PSU / subject nav) rather than the
  // Mining header. Only Mining mocks (/mocks/mn-*) are part of the Mining
  // mini-site. Exclude every other known mock-id prefix here.
  if (/^\/mocks\/(cil-|ce-mock-|gg-mock-|es-mock-|state-|diploma-)/.test(pathname)) return false;
  return MINING_SITE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

/** True on a live per-subject mini-site (e.g. /gate/civil/*). */
function isLiveSubjectSite(pathname: string | null): boolean {
  if (!pathname) return false;
  return LIVE_SUBJECT_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

/** Renders children only OUTSIDE the Mining mini-site (i.e. the global header). */
export function HideOnMiningSite({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return isMiningSite(pathname) || isLiveSubjectSite(pathname) ? null : <>{children}</>;
}

/** Renders children only INSIDE the Mining mini-site (i.e. the Mining header). */
export function ShowOnMiningSite({ children }: { children: React.ReactNode }) {
  return isMiningSite(usePathname()) ? <>{children}</> : null;
}

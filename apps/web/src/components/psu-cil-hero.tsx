"use client";

import Link from "next/link";
import Image from "next/image";
import { CIL_RECRUITMENT_URL, CIL_TOTAL_SEATS } from "@/data/cil";
import { CIL_PATTERN } from "@/data/cil-mocks";

export function PsuCilHero() {
  return (
    <section className="relative overflow-hidden bg-[#0055A4] text-white">
      {/* Background image — coal mine */}
      <div className="absolute inset-0">
        <Image
          src="/images/cil/coal-mine-bg.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0055A4] via-[#0055A4]/90 to-[#0055A4]/60" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 lg:py-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left — text */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <Image
                src="/images/cil/cil-logo.png"
                alt="CIL logo"
                width={56}
                height={56}
                className="rounded-lg"
                priority
              />
              <span className="badge border border-cyan-300/30 bg-cyan-300/10 text-cyan-300">
                PSU Recruitment · Coal India Limited
              </span>
            </div>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] lg:text-6xl">
              Coal India Limited
              <span className="block text-cyan-300">Management Trainee</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              Discipline-wise mock series targeting mining legislation,
              DGMS safety guidelines and historical PSU weightage matrices.
            </p>

            {/* Stats strip */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Stat value={`${CIL_TOTAL_SEATS}`} label="Total seats" />
              <Stat value={`${CIL_PATTERN.questions}`} label="MCQs" />
              <Stat value={`${CIL_PATTERN.durationMin / 60} hrs`} label="Duration" />
              <Stat value="2" label="Papers" />
              <Stat value="7" label="Disciplines" />
              <Stat value="15" label="Mocks / discipline" />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={CIL_RECRUITMENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="cg-neon inline-flex items-center gap-2 rounded-lg border border-cyan-400/70 bg-cyan-400/10 px-6 py-3.5 text-base font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
              >
                View Official Notification <span aria-hidden>↗</span>
              </a>
              <a href="#disciplines" className="btn bg-white/10 text-white border border-white/25 hover:bg-white/20 btn-lg">
                Choose your discipline
              </a>
            </div>
          </div>

          {/* Right — logo card (desktop) */}
          <div className="hidden lg:block">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <Image
                src="/images/cil/cil-logo.png"
                alt="CIL"
                width={160}
                height={160}
                className="rounded-xl"
                priority
              />
              <div className="mt-4 space-y-1 text-sm text-white/70">
                <p className="font-semibold text-white">Advt. No. CIL/2025</p>
                <p>Mining · Civil · Electrical · Mechanical</p>
                <p>System · E&T · Geology · Industrial Engg.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
      <div className="text-2xl font-extrabold text-white">{value}</div>
      <div className="text-xs text-white/60">{label}</div>
    </div>
  );
}

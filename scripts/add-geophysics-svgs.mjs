#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const BASE = join(
  import.meta.dirname,
  "../apps/web/src/data/questions/ongc/geophysics"
);

const S = (s) => s.replace(/\n\s*/g, "");

function svgEarthInterior() {
  return {
    kind: "svg",
    caption: "Cross-section of Earth's interior showing crust, mantle, outer core, and inner core with P-wave velocity profile",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Earth's Interior Layers</text>
      <rect x="30" y="35" width="180" height="175" rx="4" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/>
      <rect x="30" y="35" width="180" height="14" rx="4" fill="#94a3b8"/><text x="120" y="46" text-anchor="middle" fill="#fff" font-size="9" font-family="sans-serif">Crust (0-70 km)</text>
      <rect x="30" y="49" width="180" height="50" fill="#f59e0b" opacity="0.7"/><text x="120" y="78" text-anchor="middle" fill="#fff" font-size="9" font-family="sans-serif">Upper Mantle (410 km)</text>
      <rect x="30" y="99" width="180" height="50" fill="#f97316" opacity="0.7"/><text x="120" y="128" text-anchor="middle" fill="#fff" font-size="9" font-family="sans-serif">Lower Mantle (2900 km)</text>
      <rect x="30" y="149" width="180" height="35" fill="#ef4444" opacity="0.7"/><text x="120" y="170" text-anchor="middle" fill="#fff" font-size="9" font-family="sans-serif">Outer Core (5150 km)</text>
      <rect x="30" y="184" width="180" height="26" fill="#1e3a5f" opacity="0.8"/><text x="120" y="200" text-anchor="middle" fill="#fff" font-size="9" font-family="sans-serif">Inner Core (6371 km)</text>
      <text x="230" y="208" fill="#64748b" font-size="10" font-family="sans-serif">Discontinuities: Moho, 410, 660, Gutenberg (2900), Lehmann (5150)</text>
      <line x1="320" y1="35" x2="320" y2="210" stroke="#94a3b8" stroke-width="1"/>
      <text x="400" y="35" text-anchor="middle" fill="#64748b" font-size="10" font-family="sans-serif">P-wave vel. (km/s)</text>
      <text x="335" y="50" fill="#3b82f6" font-size="9" font-family="sans-serif">6.0</text>
      <text x="335" y="82" fill="#3b82f6" font-size="9" font-family="sans-serif">8.1</text>
      <text x="335" y="130" fill="#3b82f6" font-size="9" font-family="sans-serif">13.7</text>
      <text x="335" y="165" fill="#3b82f6" font-size="9" font-family="sans-serif">8.0</text>
      <text x="335" y="200" fill="#3b82f6" font-size="9" font-family="sans-serif">11.2</text>
      <polyline points="360,48 380,80 380,130 340,163 370,198" fill="none" stroke="#3b82f6" stroke-width="2"/>
    </svg>`),
  };
}

function svgIsostasy() {
  return {
    kind: "svg",
    caption: "Airy isostasy model showing crustal roots compensating surface topography",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Airy Isostasy — Crustal Roots</text>
      <line x1="20" y1="120" x2="460" y2="120" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4,3"/>
      <text x="465" y="124" fill="#64748b" font-size="9" font-family="sans-serif">Sea level</text>
      <rect x="100" y="50" width="120" height="70" fill="#f59e0b" opacity="0.6" rx="2"/>
      <text x="160" y="90" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif">Mountain</text>
      <rect x="100" y="120" width="120" height="60" fill="#3b82f6" opacity="0.5" rx="2"/>
      <text x="160" y="155" text-anchor="middle" fill="#fff" font-size="9" font-family="sans-serif">Crustal root</text>
      <rect x="300" y="100" width="120" height="20" fill="#f59e0b" opacity="0.6" rx="2"/>
      <text x="360" y="114" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif">Plain</text>
      <rect x="300" y="120" width="120" height="25" fill="#3b82f6" opacity="0.5" rx="2"/>
      <text x="360" y="138" text-anchor="middle" fill="#fff" font-size="9" font-family="sans-serif">Normal crust</text>
      <text x="240" y="208" text-anchor="middle" fill="#64748b" font-size="10" font-family="sans-serif">r = h × ρ_m / (ρ_m − ρ_c) → 1 km elevation ≈ 5.2 km root</text>
    </svg>`),
  };
}

function svgPlateBoundary() {
  return {
    kind: "svg",
    caption: "Three types of plate boundaries: convergent, divergent, and transform",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="18" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Plate Boundary Types</text>
      <text x="80" y="38" text-anchor="middle" fill="#4f46e5" font-size="11" font-family="sans-serif">Convergent</text>
      <polygon points="30,160 80,60 130,160" fill="#f59e0b" opacity="0.6" stroke="#f59e0b" stroke-width="1"/>
      <polygon points="70,160 130,80 190,160" fill="#3b82f6" opacity="0.5" stroke="#3b82f6" stroke-width="1"/>
      <text x="80" y="185" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Subduction</text>
      <defs><marker id="pba" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#ef4444"/></marker></defs>
      <line x1="55" y1="130" x2="105" y2="90" stroke="#ef4444" stroke-width="2" marker-end="url(#pba)"/>
      <text x="240" y="38" text-anchor="middle" fill="#4f46e5" font-size="11" font-family="sans-serif">Divergent</text>
      <rect x="195" y="60" width="40" height="100" fill="#f59e0b" opacity="0.6" rx="2"/>
      <rect x="245" y="60" width="40" height="100" fill="#3b82f6" opacity="0.5" rx="2"/>
      <line x1="215" y1="110" x2="195" y2="110" stroke="#ef4444" stroke-width="2"/>
      <line x1="265" y1="110" x2="285" y2="110" stroke="#ef4444" stroke-width="2"/>
      <text x="240" y="185" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Ridge / Rift</text>
      <text x="400" y="38" text-anchor="middle" fill="#4f46e5" font-size="11" font-family="sans-serif">Transform</text>
      <rect x="350" y="55" width="100" height="45" fill="#f59e0b" opacity="0.6" rx="2"/>
      <rect x="350" y="110" width="100" height="45" fill="#3b82f6" opacity="0.5" rx="2"/>
      <line x1="350" y1="100" x2="450" y2="100" stroke="#ef4444" stroke-width="2"/>
      <polygon points="340,97 350,100 340,103" fill="#ef4444"/>
      <polygon points="460,97 450,100 460,103" fill="#ef4444"/>
      <text x="400" y="185" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Strike-slip</text>
    </svg>`),
  };
}

function svgFocalMechanism() {
  return {
    kind: "svg",
    caption: "Focal mechanism beach ball diagram showing first-motion polarity and nodal planes",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Focal Mechanism (Beach Ball)</text>
      <circle cx="130" cy="125" r="75" fill="#fff" stroke="#1e293b" stroke-width="2"/>
      <path d="M130,50 A75,75 0 0,1 195,125 L130,125 Z" fill="#4f46e5"/>
      <path d="M130,200 A75,75 0 0,1 65,125 L130,125 Z" fill="#4f46e5"/>
      <line x1="80" y1="72" x2="180" y2="178" stroke="#1e293b" stroke-width="1.5"/>
      <line x1="180" y1="72" x2="80" y2="178" stroke="#1e293b" stroke-width="1.5"/>
      <text x="130" y="15" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">T-axis</text>
      <text x="130" y="218" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">P-axis</text>
      <text x="340" y="55" fill="#4f46e5" font-size="10" font-family="sans-serif">■ Compressional quadrant (P)</text>
      <text x="340" y="78" fill="#fff" font-size="10" font-family="sans-serif" stroke="#1e293b">□ Dilatational quadrant (T)</text>
      <text x="340" y="105" fill="#64748b" font-size="10" font-family="sans-serif">Nodal planes separate P and T</text>
      <text x="340" y="128" fill="#64748b" font-size="10" font-family="sans-serif">Strike, dip, rake from 2 planes</text>
      <text x="340" y="155" fill="#f59e0b" font-size="10" font-family="sans-serif">• Blue = first motion UP</text>
      <text x="340" y="178" fill="#64748b" font-size="10" font-family="sans-serif">• White = first motion DOWN</text>
    </svg>`),
  };
}

function svgWavePropagation() {
  return {
    kind: "svg",
    caption: "P-wave (compressional) and S-wave (shear) particle motion comparison",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">P-Wave vs S-Wave Particle Motion</text>
      <text x="120" y="42" text-anchor="middle" fill="#4f46e5" font-size="11" font-family="sans-serif">P-Wave (Longitudinal)</text>
      <line x1="20" y1="90" x2="220" y2="90" stroke="#94a3b8" stroke-width="1"/>
      <g fill="#3b82f6">
        <rect x="35" y="82" width="8" height="16" rx="2" opacity="0.8"/>
        <rect x="55" y="85" width="8" height="10" rx="2" opacity="0.6"/>
        <rect x="75" y="82" width="8" height="16" rx="2" opacity="0.8"/>
        <rect x="95" y="85" width="8" height="10" rx="2" opacity="0.6"/>
        <rect x="115" y="82" width="8" height="16" rx="2" opacity="0.8"/>
        <rect x="135" y="85" width="8" height="10" rx="2" opacity="0.6"/>
        <rect x="155" y="82" width="8" height="16" rx="2" opacity="0.8"/>
        <rect x="175" y="85" width="8" height="10" rx="2" opacity="0.6"/>
        <rect x="195" y="82" width="8" height="16" rx="2" opacity="0.8"/>
      </g>
      <text x="120" y="130" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">↕ Parallel to propagation</text>
      <text x="360" y="42" text-anchor="middle" fill="#4f46e5" font-size="11" font-family="sans-serif">S-Wave (Transverse)</text>
      <line x1="260" y1="90" x2="460" y2="90" stroke="#94a3b8" stroke-width="1"/>
      <path d="M270,90 Q290,60 310,90 Q330,120 350,90 Q370,60 390,90 Q410,120 430,90" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
      <text x="360" y="130" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">↕ Perpendicular to propagation</text>
      <text x="240" y="210" text-anchor="middle" fill="#64748b" font-size="10" font-family="sans-serif">Vp ≈ 1.7 × Vs | P-waves arrive first</text>
    </svg>`),
  };
}

function svgBouguerAnomaly() {
  return {
    kind: "svg",
    caption: "Bouguer gravity anomaly profile over a sedimentary basin",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Bouguer Anomaly Profile over Basin</text>
      <line x1="50" y1="190" x2="440" y2="190" stroke="#94a3b8" stroke-width="1"/>
      <line x1="50" y1="30" x2="50" y2="190" stroke="#94a3b8" stroke-width="1"/>
      <text x="25" y="115" fill="#64748b" font-size="9" font-family="sans-serif" transform="rotate(-90,25,115)">Gravity (mGal)</text>
      <text x="240" y="208" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Distance (km)</text>
      <text x="48" y="42" fill="#64748b" font-size="8" font-family="sans-serif">+20</text>
      <text x="48" y="100" fill="#64748b" font-size="8" font-family="sans-serif">0</text>
      <text x="42" y="185" fill="#64748b" font-size="8" font-family="sans-serif">-40</text>
      <path d="M60,65 Q120,60 180,90 Q240,160 300,150 Q360,80 420,70" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
      <path d="M60,70 Q120,68 180,95 Q240,155 300,148 Q360,85 420,75" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6,3"/>
      <rect x="160" y="135" width="120" height="55" fill="#94a3b8" opacity="0.3" rx="2"/>
      <text x="220" y="168" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Sedimentary basin</text>
      <line x1="330" y1="38" x2="330" y2="50" stroke="#3b82f6" stroke-width="2"/>
      <text x="345" y="46" fill="#3b82f6" font-size="9" font-family="sans-serif">Free-air</text>
      <line x1="330" y1="56" x2="330" y2="68" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,2"/>
      <text x="345" y="64" fill="#f59e0b" font-size="9" font-family="sans-serif">Bouguer</text>
    </svg>`),
  };
}

function svgGravityTensor() {
  return {
    kind: "svg",
    caption: "Gravity gradient tensor components showing the symmetric matrix of second-order derivatives",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Gravity Gradient Tensor (GGT)</text>
      <g transform="translate(60,40)">
        <text x="80" y="0" text-anchor="middle" fill="#64748b" font-size="10" font-family="sans-serif">T = ∇(∇V)</text>
        <rect x="0" y="12" width="55" height="28" fill="#3b82f6" opacity="0.7" rx="3"/><text x="27" y="30" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif">Txx</text>
        <rect x="60" y="12" width="55" height="28" fill="#f59e0b" opacity="0.7" rx="3"/><text x="87" y="30" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif">Txy</text>
        <rect x="120" y="12" width="55" height="28" fill="#f59e0b" opacity="0.7" rx="3"/><text x="147" y="30" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif">Txz</text>
        <rect x="0" y="45" width="55" height="28" fill="#f59e0b" opacity="0.7" rx="3"/><text x="27" y="63" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif">Tyx</text>
        <rect x="60" y="45" width="55" height="28" fill="#3b82f6" opacity="0.7" rx="3"/><text x="87" y="63" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif">Tyy</text>
        <rect x="120" y="45" width="55" height="28" fill="#f59e0b" opacity="0.7" rx="3"/><text x="147" y="63" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif">Tyz</text>
        <rect x="0" y="78" width="55" height="28" fill="#f59e0b" opacity="0.7" rx="3"/><text x="27" y="96" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif">Tzx</text>
        <rect x="60" y="78" width="55" height="28" fill="#f59e0b" opacity="0.7" rx="3"/><text x="87" y="96" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif">Tzy</text>
        <rect x="120" y="78" width="55" height="28" fill="#3b82f6" opacity="0.7" rx="3"/><text x="147" y="96" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif">Tzz</text>
      </g>
      <g transform="translate(290,45)">
        <text x="0" y="0" fill="#3b82f6" font-size="10" font-family="sans-serif">■ Diagonal (Txx, Tyy, Tzz)</text>
        <text x="0" y="20" fill="#f59e0b" font-size="10" font-family="sans-serif">■ Off-diagonal (symmetric)</text>
        <text x="0" y="45" fill="#64748b" font-size="10" font-family="sans-serif">Trace = Txx + Tyy + Tzz = 0</text>
        <text x="0" y="65" fill="#64748b" font-size="10" font-family="sans-serif">(Laplace's equation)</text>
        <text x="0" y="90" fill="#64748b" font-size="10" font-family="sans-serif">5 independent components</text>
        <text x="0" y="110" fill="#64748b" font-size="10" font-family="sans-serif">Units: Eötvös (10⁻⁹ s⁻²)</text>
        <text x="0" y="135" fill="#f59e0b" font-size="10" font-family="sans-serif">→ Resolves edges &amp; corners</text>
      </g>
    </svg>`),
  };
}

function svgMagneticAnomalyDike() {
  return {
    kind: "svg",
    caption: "Magnetic anomaly profile over a vertical dike body showing total field anomaly",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Magnetic Anomaly over Dike Body</text>
      <line x1="50" y1="150" x2="440" y2="150" stroke="#94a3b8" stroke-width="1"/>
      <line x1="240" y1="35" x2="240" y2="195" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="3,3"/>
      <polygon points="220,150 260,150 270,195 210,195" fill="#ef4444" opacity="0.5" stroke="#ef4444" stroke-width="1"/>
      <text x="240" y="178" text-anchor="middle" fill="#fff" font-size="9" font-family="sans-serif">Dike</text>
      <path d="M60,110 Q120,108 160,100 Q200,60 230,50 Q240,48 250,50 Q280,60 320,100 Q360,108 420,110" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
      <path d="M60,110 Q120,108 160,100 Q200,60 230,50 Q240,48 250,50 Q280,60 320,100 Q360,108 420,110 L420,150 L60,150 Z" fill="#f59e0b" opacity="0.15"/>
      <text x="48" y="42" fill="#64748b" font-size="8" font-family="sans-serif">+ΔT</text>
      <text x="48" y="150" fill="#64748b" font-size="8" font-family="sans-serif">0</text>
      <text x="240" y="212" text-anchor="middle" fill="#64748b" font-size="10" font-family="sans-serif">Peak offset depends on inclination of Earth's field</text>
    </svg>`),
  };
}

function svgPaleomagneticReversals() {
  return {
    kind: "svg",
    caption: "Geomagnetic polarity timescale showing normal and reversed polarity chrons",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Paleomagnetic Polarity Reversals</text>
      <line x1="80" y1="35" x2="80" y2="195" stroke="#94a3b8" stroke-width="1"/>
      <text x="75" y="42" text-anchor="end" fill="#64748b" font-size="9" font-family="sans-serif">0 Ma</text>
      <rect x="80" y="38" width="300" height="14" fill="#4f46e5" rx="2"/><text x="230" y="49" text-anchor="middle" fill="#fff" font-size="8" font-family="sans-serif">Brunhes Normal</text>
      <rect x="80" y="52" width="80" height="14" fill="#e2e8f0" rx="2"/><text x="120" y="63" text-anchor="middle" fill="#64748b" font-size="8" font-family="sans-serif">Matuyama Reversed</text>
      <rect x="160" y="52" width="10" height="14" fill="#4f46e5" rx="1"/>
      <rect x="170" y="52" width="40" height="14" fill="#e2e8f0" rx="1"/>
      <rect x="210" y="52" width="8" height="14" fill="#4f46e5" rx="1"/>
      <rect x="218" y="52" width="62" height="14" fill="#e2e8f0" rx="1"/>
      <rect x="80" y="66" width="200" height="14" fill="#4f46e5" rx="2"/><text x="180" y="77" text-anchor="middle" fill="#fff" font-size="8" font-family="sans-serif">Gauss Normal</text>
      <rect x="280" y="66" width="100" height="14" fill="#e2e8f0" rx="2"/><text x="330" y="77" text-anchor="middle" fill="#64748b" font-size="8" font-family="sans-serif">Gilbert Reversed</text>
      <text x="75" y="50" text-anchor="end" fill="#64748b" font-size="9" font-family="sans-serif">0.78</text>
      <text x="75" y="70" text-anchor="end" fill="#64748b" font-size="9" font-family="sans-serif">2.58</text>
      <text x="75" y="195" text-anchor="end" fill="#64748b" font-size="9" font-family="sans-serif">5 Ma</text>
      <text x="340" y="120" fill="#4f46e5" font-size="10" font-family="sans-serif">■ Normal polarity</text>
      <text x="340" y="138" fill="#94a3b8" font-size="10" font-family="sans-serif">□ Reversed polarity</text>
      <text x="340" y="160" fill="#64748b" font-size="10" font-family="sans-serif">Vine-Matthews: symmetric</text>
      <text x="340" y="178" fill="#64748b" font-size="10" font-family="sans-serif">striping on ocean floor</text>
      <text x="340" y="198" fill="#f59e0b" font-size="10" font-family="sans-serif">→ Magnetic tape recorder</text>
    </svg>`),
  };
}

function svgWennerArray() {
  return {
    kind: "svg",
    caption: "Wenner electrode array configuration for DC resistivity surveying",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Wenner Electrode Array</text>
      <line x1="30" y1="110" x2="450" y2="110" stroke="#94a3b8" stroke-width="1"/>
      <rect x="30" y="105" width="420" height="40" fill="#f59e0b" opacity="0.15" rx="3"/>
      <text x="240" y="155" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Ground surface</text>
      <circle cx="90" cy="110" r="8" fill="#3b82f6" stroke="#1e293b" stroke-width="1.5"/>
      <text x="90" y="135" text-anchor="middle" fill="#3b82f6" font-size="10" font-weight="bold" font-family="sans-serif">C₁</text>
      <circle cx="190" cy="110" r="8" fill="#f59e0b" stroke="#1e293b" stroke-width="1.5"/>
      <text x="190" y="135" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="bold" font-family="sans-serif">P₁</text>
      <circle cx="290" cy="110" r="8" fill="#f59e0b" stroke="#1e293b" stroke-width="1.5"/>
      <text x="290" y="135" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="bold" font-family="sans-serif">P₂</text>
      <circle cx="390" cy="110" r="8" fill="#3b82f6" stroke="#1e293b" stroke-width="1.5"/>
      <text x="390" y="135" text-anchor="middle" fill="#3b82f6" font-size="10" font-weight="bold" font-family="sans-serif">C₂</text>
      <text x="140" y="80" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">a</text>
      <text x="240" y="80" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">a</text>
      <text x="340" y="80" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">a</text>
      <line x1="90" y1="85" x2="190" y2="85" stroke="#94a3b8" stroke-width="1"/>
      <line x1="190" y1="85" x2="290" y2="85" stroke="#94a3b8" stroke-width="1"/>
      <line x1="290" y1="85" x2="390" y2="85" stroke="#94a3b8" stroke-width="1"/>
      <text x="240" y="180" text-anchor="middle" fill="#64748b" font-size="10" font-family="sans-serif">ρ_a = 2πa × (ΔV / I) | Equal spacing = a</text>
      <text x="240" y="200" text-anchor="middle" fill="#f59e0b" font-size="10" font-family="sans-serif">C₁,C₂ = current | P₁,P₂ = potential</text>
    </svg>`),
  };
}

function svgResistivitySounding() {
  return {
    kind: "svg",
    caption: "Three types of resistivity sounding curves: H-type, K-type, and A-type",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Resistivity Sounding Curves (H / K / A)</text>
      <line x1="60" y1="190" x2="440" y2="190" stroke="#94a3b8" stroke-width="1"/>
      <line x1="60" y1="35" x2="60" y2="190" stroke="#94a3b8" stroke-width="1"/>
      <text x="250" y="210" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">AB/2 (electrode spacing)</text>
      <text x="50" y="115" fill="#64748b" font-size="9" font-family="sans-serif" transform="rotate(-90,50,115)">ρ_a (Ω·m)</text>
      <path d="M70,60 Q120,140 180,130 Q240,70 300,55 Q380,50 430,52" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
      <path d="M70,55 Q120,120 180,160 Q240,110 300,50 Q380,45 430,48" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="6,3"/>
      <path d="M70,140 Q120,130 180,110 Q240,80 300,55 Q380,48 430,45" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="3,3"/>
      <text x="350" y="45" fill="#3b82f6" font-size="10" font-family="sans-serif">H-type (low→high→low)</text>
      <text x="350" y="62" fill="#f59e0b" font-size="10" font-family="sans-serif">K-type (high→low→high)</text>
      <text x="350" y="79" fill="#ef4444" font-size="10" font-family="sans-serif">A-type (monotonic rise)</text>
      <text x="240" y="175" fill="#64748b" font-size="10" font-family="sans-serif">Layer parameters: ρ₁, ρ₂, ρ₃ and thicknesses h₁, h₂</text>
    </svg>`),
  };
}

function svgEMSkinDepth() {
  return {
    kind: "svg",
    caption: "Electromagnetic skin depth showing exponential field attenuation in conductive media",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">EM Skin Depth Penetration</text>
      <line x1="60" y1="40" x2="60" y2="195" stroke="#94a3b8" stroke-width="1"/>
      <line x1="60" y1="40" x2="250" y2="40" stroke="#94a3b8" stroke-width="1"/>
      <text x="55" y="50" text-anchor="end" fill="#64748b" font-size="9" font-family="sans-serif">0</text>
      <text x="55" y="100" text-anchor="end" fill="#64748b" font-size="9" font-family="sans-serif">δ</text>
      <text x="55" y="145" text-anchor="end" fill="#64748b" font-size="9" font-family="sans-serif">2δ</text>
      <text x="55" y="190" text-anchor="end" fill="#64748b" font-size="9" font-family="sans-serif">3δ</text>
      <path d="M60,40 Q100,42 140,55 Q180,80 200,110 Q220,150 230,190" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
      <rect x="270" y="42" width="180" height="150" fill="#f59e0b" opacity="0.1" rx="4"/>
      <text x="360" y="62" text-anchor="middle" fill="#4f46e5" font-size="10" font-family="sans-serif">δ = √(2ρ / ωμ)</text>
      <text x="360" y="85" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">δ = skin depth</text>
      <text x="360" y="102" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">ρ = resistivity</text>
      <text x="360" y="119" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">ω = angular frequency</text>
      <text x="360" y="136" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">μ = permeability</text>
      <text x="360" y="158" text-anchor="middle" fill="#f59e0b" font-size="10" font-family="sans-serif">Field ∝ e^(−z/δ)</text>
      <text x="360" y="178" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">At z = δ, amplitude = 37%</text>
    </svg>`),
  };
}

function svgMagnetotelluric() {
  return {
    kind: "svg",
    caption: "Magnetotelluric impedance phase and apparent resistivity sounding curve",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Magnetotelluric Impedance Phase</text>
      <line x1="60" y1="190" x2="440" y2="190" stroke="#94a3b8" stroke-width="1"/>
      <line x1="60" y1="35" x2="60" y2="190" stroke="#94a3b8" stroke-width="1"/>
      <text x="250" y="210" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Period T (s) — log scale</text>
      <line x1="60" y1="110" x2="440" y2="110" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="3,3"/>
      <text x="55" y="45" text-anchor="end" fill="#64748b" font-size="8" font-family="sans-serif">90°</text>
      <text x="55" y="80" text-anchor="end" fill="#64748b" font-size="8" font-family="sans-serif">60°</text>
      <text x="55" y="115" text-anchor="end" fill="#64748b" font-size="8" font-family="sans-serif">45°</text>
      <text x="55" y="150" text-anchor="end" fill="#64748b" font-size="8" font-family="sans-serif">30°</text>
      <text x="55" y="188" text-anchor="end" fill="#64748b" font-size="8" font-family="sans-serif">0°</text>
      <path d="M70,110 Q120,108 170,100 Q220,70 270,50 Q320,55 370,90 Q420,108 435,110" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
      <path d="M70,110 Q120,112 170,120 Q220,150 270,165 Q320,160 370,135 Q420,112 435,110" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="6,3"/>
      <text x="280" y="45" fill="#3b82f6" font-size="10" font-family="sans-serif">φ (phase)</text>
      <text x="280" y="175" fill="#f59e0b" font-size="10" font-family="sans-serif">|Z| (impedance)</text>
      <text x="350" y="198" fill="#64748b" font-size="10" font-family="sans-serif">Phase = 45° → half-space</text>
    </svg>`),
  };
}

function svgSeismicTrace() {
  return {
    kind: "svg",
    caption: "Seismic trace display showing wiggle traces with variable area fill",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Seismic Trace / Wiggle Display</text>
      <line x1="80" y1="35" x2="80" y2="200" stroke="#94a3b8" stroke-width="1"/>
      <line x1="80" y1="115" x2="440" y2="115" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="3,3"/>
      <text x="75" y="42" text-anchor="end" fill="#64748b" font-size="8" font-family="sans-serif">0 s</text>
      <text x="75" y="200" text-anchor="end" fill="#64748b" font-size="8" font-family="sans-serif">2.0 s</text>
      <text x="40" y="120" fill="#64748b" font-size="9" font-family="sans-serif">TWT</text>
      <g transform="translate(120,35)">
        <path d="M0,0 Q5,10 0,20 Q-5,35 0,50 Q8,65 0,80 Q-10,95 0,110 Q6,125 0,140 Q-4,155 0,165" fill="none" stroke="#1e293b" stroke-width="1.5"/>
        <path d="M0,50 Q8,65 0,80 L0,50 Z" fill="#4f46e5"/>
        <path d="M0,110 Q6,125 0,140 L0,110 Z" fill="#4f46e5"/>
      </g>
      <g transform="translate(180,35)">
        <path d="M0,0 Q-4,12 0,25 Q6,40 0,55 Q-8,70 0,85 Q10,100 0,115 Q-5,130 0,145 Q4,155 0,165" fill="none" stroke="#1e293b" stroke-width="1.5"/>
        <path d="M0,55 Q-8,70 0,85 L0,55 Z" fill="#4f46e5"/>
        <path d="M0,115 Q-5,130 0,145 L0,115 Z" fill="#4f46e5"/>
      </g>
      <g transform="translate(240,35)">
        <path d="M0,0 Q6,15 0,30 Q-6,45 0,60 Q8,75 0,90 Q-10,105 0,120 Q5,135 0,150 Q-3,160 0,165" fill="none" stroke="#1e293b" stroke-width="1.5"/>
        <path d="M0,60 Q8,75 0,90 L0,60 Z" fill="#4f46e5"/>
        <path d="M0,120 Q5,135 0,150 L0,120 Z" fill="#4f46e5"/>
      </g>
      <g transform="translate(300,35)">
        <path d="M0,0 Q-5,10 0,22 Q7,38 0,52 Q-9,68 0,82 Q8,98 0,112 Q-6,128 0,142 Q4,155 0,165" fill="none" stroke="#1e293b" stroke-width="1.5"/>
        <path d="M0,52 Q-9,68 0,82 L0,52 Z" fill="#4f46e5"/>
        <path d="M0,112 Q-6,128 0,142 L0,112 Z" fill="#4f46e5"/>
      </g>
      <g transform="translate(360,35)">
        <path d="M0,0 Q4,12 0,28 Q-7,42 0,58 Q9,72 0,88 Q-8,102 0,118 Q6,132 0,148 Q-4,158 0,165" fill="none" stroke="#1e293b" stroke-width="1.5"/>
        <path d="M0,58 Q9,72 0,88 L0,58 Z" fill="#4f46e5"/>
        <path d="M0,118 Q6,132 0,148 L0,118 Z" fill="#4f46e5"/>
      </g>
      <text x="240" y="215" text-anchor="middle" fill="#64748b" font-size="10" font-family="sans-serif">Variable area: positive amplitudes filled | Multiple traces</text>
    </svg>`),
  };
}

function svgCMPNMO() {
  return {
    kind: "svg",
    caption: "CMP gather before and after NMO correction showing hyperbolic moveout removal",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="18" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">CMP Gather &amp; NMO Correction</text>
      <text x="110" y="38" text-anchor="middle" fill="#4f46e5" font-size="11" font-family="sans-serif">Before NMO</text>
      <line x1="30" y1="48" x2="30" y2="195" stroke="#94a3b8" stroke-width="1"/>
      <line x1="30" y1="48" x2="210" y2="48" stroke="#94a3b8" stroke-width="1"/>
      <path d="M40,70 Q80,65 120,60 Q160,55 200,50" fill="none" stroke="#3b82f6" stroke-width="1.5"/>
      <path d="M40,100 Q80,95 120,85 Q160,72 200,65" fill="none" stroke="#3b82f6" stroke-width="1.5"/>
      <path d="M40,140 Q80,138 120,130 Q160,118 200,105" fill="none" stroke="#3b82f6" stroke-width="1.5"/>
      <path d="M40,170 Q80,170 120,165 Q160,155 200,145" fill="none" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="25" y="52" fill="#64748b" font-size="7" font-family="sans-serif">t₀</text>
      <text x="115" y="205" fill="#64748b" font-size="9" font-family="sans-serif">Offset →</text>
      <text x="370" y="38" text-anchor="middle" fill="#4f46e5" font-size="11" font-family="sans-serif">After NMO</text>
      <line x1="280" y1="48" x2="280" y2="195" stroke="#94a3b8" stroke-width="1"/>
      <line x1="280" y1="48" x2="460" y2="48" stroke="#94a3b8" stroke-width="1"/>
      <line x1="290" y1="65" x2="450" y2="65" stroke="#f59e0b" stroke-width="1.5"/>
      <line x1="290" y1="100" x2="450" y2="100" stroke="#f59e0b" stroke-width="1.5"/>
      <line x1="290" y1="135" x2="450" y2="135" stroke="#f59e0b" stroke-width="1.5"/>
      <line x1="290" y1="170" x2="450" y2="170" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="375" y="205" fill="#64748b" font-size="9" font-family="sans-serif">Offset →</text>
      <text x="240" y="218" text-anchor="middle" fill="#64748b" font-size="10" font-family="sans-serif">NMO flattens hyperbolas → stack enhances signal</text>
    </svg>`),
  };
}

function svgAVO() {
  return {
    kind: "svg",
    caption: "AVO response curves showing reflection coefficient variation with incidence angle",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">AVO Response Curves</text>
      <line x1="60" y1="110" x2="440" y2="110" stroke="#94a3b8" stroke-width="1"/>
      <line x1="60" y1="35" x2="60" y2="195" stroke="#94a3b8" stroke-width="1"/>
      <text x="250" y="212" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Incidence angle θ (degrees)</text>
      <text x="55" y="42" text-anchor="end" fill="#64748b" font-size="8" font-family="sans-serif">+0.3</text>
      <text x="55" y="115" text-anchor="end" fill="#64748b" font-size="8" font-family="sans-serif">0</text>
      <text x="55" y="190" text-anchor="end" fill="#64748b" font-size="8" font-family="sans-serif">-0.3</text>
      <text x="250" y="42" text-anchor="middle" fill="#64748b" font-size="8" font-family="sans-serif">RC</text>
      <path d="M70,95 Q130,90 190,80 Q250,65 310,50 Q370,42 430,38" fill="none" stroke="#3b82f6" stroke-width="2"/>
      <path d="M70,120 Q130,122 190,128 Q250,138 310,148 Q370,158 430,165" fill="none" stroke="#ef4444" stroke-width="2"/>
      <path d="M70,105 Q130,106 190,108 Q250,110 310,112 Q370,114 430,115" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6,3"/>
      <path d="M70,85 Q130,82 190,78 Q250,70 310,62 Q370,55 430,50" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="3,3"/>
      <text x="300" y="35" fill="#3b82f6" font-size="9" font-family="sans-serif">Class III (gas sand)</text>
      <text x="300" y="175" fill="#ef4444" font-size="9" font-family="sans-serif">Class I (tight sand)</text>
      <text x="300" y="50" fill="#f59e0b" font-size="9" font-family="sans-serif">Class II (near-zero)</text>
      <text x="300" y="65" fill="#10b981" font-size="9" font-family="sans-serif">Class IV</text>
    </svg>`),
  };
}

function svgWellLog() {
  return {
    kind: "svg",
    caption: "Well log composite track showing resistivity, gamma ray, sonic, and density logs",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Well Log Composite Track</text>
      <rect x="30" y="30" width="90" height="175" fill="#fff" stroke="#94a3b8" stroke-width="1" rx="2"/>
      <rect x="125" y="30" width="90" height="175" fill="#fff" stroke="#94a3b8" stroke-width="1" rx="2"/>
      <rect x="220" y="30" width="90" height="175" fill="#fff" stroke="#94a3b8" stroke-width="1" rx="2"/>
      <rect x="315" y="30" width="90" height="175" fill="#fff" stroke="#94a3b8" stroke-width="1" rx="2"/>
      <text x="75" y="26" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">GR (API)</text>
      <text x="170" y="26" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Resistivity</text>
      <text x="265" y="26" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Sonic</text>
      <text x="360" y="26" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Density</text>
      <path d="M45,40 Q55,55 50,70 Q42,85 55,100 Q65,115 48,130 Q38,145 52,160 Q62,175 45,195" fill="none" stroke="#10b981" stroke-width="1.5"/>
      <path d="M140,40 Q160,50 155,70 Q145,85 170,100 Q185,115 160,130 Q145,150 165,170 Q175,185 155,195" fill="none" stroke="#ef4444" stroke-width="1.5"/>
      <path d="M235,40 Q250,55 245,75 Q238,90 255,105 Q265,120 250,135 Q240,150 255,170 Q262,185 248,195" fill="none" stroke="#3b82f6" stroke-width="1.5"/>
      <path d="M330,40 Q345,52 340,70 Q332,88 350,102 Q360,118 345,132 Q335,148 348,165 Q355,180 342,195" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
      <line x1="30" y1="80" x2="410" y2="80" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="3,3"/>
      <line x1="30" y1="140" x2="410" y2="140" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="3,3"/>
      <text x="420" y="83" fill="#64748b" font-size="8" font-family="sans-serif">Formation A</text>
      <text x="420" y="143" fill="#64748b" font-size="8" font-family="sans-serif">Formation B</text>
      <text x="240" y="218" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">GR→shale | Resistivity→hydrocarbon | Sonic/Density→porosity</text>
    </svg>`),
  };
}

function svgSeismicMigration() {
  return {
    kind: "svg",
    caption: "Seismic migration: unmigrated vs migrated section showing correct reflector positioning",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="18" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Seismic Migration: Before vs After</text>
      <text x="120" y="36" text-anchor="middle" fill="#4f46e5" font-size="11" font-family="sans-serif">Unmigrated</text>
      <rect x="30" y="42" width="180" height="155" fill="#fff" stroke="#94a3b8" stroke-width="1" rx="3"/>
      <path d="M50,80 Q120,60 200,80" fill="none" stroke="#3b82f6" stroke-width="1.5"/>
      <path d="M40,120 Q70,100 120,105 Q170,110 210,125" fill="none" stroke="#3b82f6" stroke-width="1.5"/>
      <path d="M60,155 Q120,140 190,160" fill="none" stroke="#3b82f6" stroke-width="1.5"/>
      <path d="M90,70 Q120,55 150,70" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,2"/>
      <text x="120" y="210" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Diffractions, misplaced reflectors</text>
      <text x="360" y="36" text-anchor="middle" fill="#4f46e5" font-size="11" font-family="sans-serif">Migrated</text>
      <rect x="270" y="42" width="180" height="155" fill="#fff" stroke="#94a3b8" stroke-width="1" rx="3"/>
      <path d="M290,90 Q360,85 430,90" fill="none" stroke="#f59e0b" stroke-width="2"/>
      <path d="M280,130 Q310,120 360,125 Q410,130 440,135" fill="none" stroke="#f59e0b" stroke-width="2"/>
      <path d="M300,165 Q360,158 420,170" fill="none" stroke="#f59e0b" stroke-width="2"/>
      <text x="360" y="210" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Corrected positions, collapsed diffractions</text>
      <text x="240" y="220" text-anchor="middle" fill="#f59e0b" font-size="10" font-family="sans-serif">Migration moves reflectors to true subsurface positions</text>
    </svg>`),
  };
}

function svgVelocityPorosity() {
  return {
    kind: "svg",
    caption: "Velocity-porosity relationship (Wyllie time-average equation) for different lithologies",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Velocity–Porosity (Wyllie Equation)</text>
      <line x1="60" y1="190" x2="440" y2="190" stroke="#94a3b8" stroke-width="1"/>
      <line x1="60" y1="35" x2="60" y2="190" stroke="#94a3b8" stroke-width="1"/>
      <text x="250" y="210" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Porosity φ (fraction)</text>
      <text x="50" y="115" fill="#64748b" font-size="9" font-family="sans-serif" transform="rotate(-90,50,115)">Vp (km/s)</text>
      <text x="55" y="42" text-anchor="end" fill="#64748b" font-size="8" font-family="sans-serif">6.0</text>
      <text x="55" y="115" text-anchor="end" fill="#64748b" font-size="8" font-family="sans-serif">3.0</text>
      <text x="55" y="188" text-anchor="end" fill="#64748b" font-size="8" font-family="sans-serif">0</text>
      <line x1="70" y1="40" x2="430" y2="180" stroke="#3b82f6" stroke-width="2"/>
      <text x="435" y="178" fill="#3b82f6" font-size="9" font-family="sans-serif">Sandstone</text>
      <line x1="70" y1="55" x2="430" y2="170" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6,3"/>
      <text x="435" y="168" fill="#f59e0b" font-size="9" font-family="sans-serif">Limestone</text>
      <line x1="70" y1="75" x2="430" y2="165" stroke="#ef4444" stroke-width="2" stroke-dasharray="3,3"/>
      <text x="435" y="163" fill="#ef4444" font-size="9" font-family="sans-serif">Dolomite</text>
      <circle cx="120" cy="80" r="3" fill="#10b981"/>
      <circle cx="180" cy="100" r="3" fill="#10b981"/>
      <circle cx="250" cy="125" r="3" fill="#10b981"/>
      <text x="280" y="55" fill="#64748b" font-size="10" font-family="sans-serif">1/V = (1−φ)/V_ma + φ/V_fl</text>
      <text x="280" y="75" fill="#64748b" font-size="10" font-family="sans-serif">V_ma = matrix velocity</text>
      <text x="280" y="95" fill="#64748b" font-size="10" font-family="sans-serif">V_fl = fluid velocity</text>
      <text x="280" y="115" fill="#f59e0b" font-size="10" font-family="sans-serif">→ Higher porosity = lower velocity</text>
    </svg>`),
  };
}

function svgGassmann() {
  return {
    kind: "svg",
    caption: "Gassmann fluid substitution: effect of pore fluid on bulk modulus and seismic velocities",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Gassmann Fluid Substitution</text>
      <rect x="40" y="40" width="150" height="160" fill="#fff" stroke="#94a3b8" stroke-width="1" rx="4"/>
      <text x="115" y="58" text-anchor="middle" fill="#4f46e5" font-size="10" font-weight="bold" font-family="sans-serif">Dry Frame</text>
      <circle cx="75" cy="100" r="20" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/>
      <circle cx="120" cy="90" r="18" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/>
      <circle cx="100" cy="130" r="15" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/>
      <text x="115" y="175" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">K_dry, μ_dry</text>
      <line x1="195" y1="120" x2="235" y2="120" stroke="#f59e0b" stroke-width="2"/>
      <polygon points="230,117 240,120 230,123" fill="#f59e0b"/>
      <text x="215" y="112" text-anchor="middle" fill="#f59e0b" font-size="9" font-family="sans-serif">+ Fluid</text>
      <rect x="240" y="40" width="150" height="160" fill="#fff" stroke="#94a3b8" stroke-width="1" rx="4"/>
      <text x="315" y="58" text-anchor="middle" fill="#4f46e5" font-size="10" font-weight="bold" font-family="sans-serif">Saturated Rock</text>
      <circle cx="275" cy="100" r="20" fill="#3b82f6" opacity="0.3" stroke="#3b82f6" stroke-width="1"/>
      <circle cx="320" cy="90" r="18" fill="#3b82f6" opacity="0.3" stroke="#3b82f6" stroke-width="1"/>
      <circle cx="300" cy="130" r="15" fill="#3b82f6" opacity="0.3" stroke="#3b82f6" stroke-width="1"/>
      <text x="315" y="175" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">K_sat, μ_sat = μ_dry</text>
      <text x="240" y="215" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">K_sat = K_dry + (1−K_dry/K₀)² / (φ/K_fl + (1−φ)/K₀ − K_dry/K₀²)</text>
    </svg>`),
  };
}

function svgDCResistivity() {
  return {
    kind: "svg",
    caption: "DC resistivity electrode arrays: Wenner, Schlumberger, and dipole-dipole configurations",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="18" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">DC Resistivity Electrode Arrays</text>
      <line x1="30" y1="70" x2="200" y2="70" stroke="#94a3b8" stroke-width="1"/>
      <circle cx="50" cy="70" r="6" fill="#3b82f6"/><text x="50" y="62" text-anchor="middle" fill="#3b82f6" font-size="8" font-family="sans-serif">C₁</text>
      <circle cx="90" cy="70" r="6" fill="#f59e0b"/><text x="90" y="62" text-anchor="middle" fill="#f59e0b" font-size="8" font-family="sans-serif">P₁</text>
      <circle cx="130" cy="70" r="6" fill="#f59e0b"/><text x="130" y="62" text-anchor="middle" fill="#f59e0b" font-size="8" font-family="sans-serif">P₂</text>
      <circle cx="170" cy="70" r="6" fill="#3b82f6"/><text x="170" y="62" text-anchor="middle" fill="#3b82f6" font-size="8" font-family="sans-serif">C₂</text>
      <text x="115" y="92" text-anchor="middle" fill="#4f46e5" font-size="10" font-weight="bold" font-family="sans-serif">Wenner</text>
      <line x1="240" y1="70" x2="460" y2="70" stroke="#94a3b8" stroke-width="1"/>
      <circle cx="260" cy="70" r="6" fill="#3b82f6"/><text x="260" y="62" text-anchor="middle" fill="#3b82f6" font-size="8" font-family="sans-serif">C₁</text>
      <circle cx="310" cy="70" r="6" fill="#f59e0b"/><text x="310" y="62" text-anchor="middle" fill="#f59e0b" font-size="8" font-family="sans-serif">P₁</text>
      <circle cx="370" cy="70" r="6" fill="#f59e0b"/><text x="370" y="62" text-anchor="middle" fill="#f59e0b" font-size="8" font-family="sans-serif">P₂</text>
      <circle cx="440" cy="70" r="6" fill="#3b82f6"/><text x="440" y="62" text-anchor="middle" fill="#3b82f6" font-size="8" font-family="sans-serif">C₂</text>
      <text x="350" y="92" text-anchor="middle" fill="#4f46e5" font-size="10" font-weight="bold" font-family="sans-serif">Schlumberger</text>
      <line x1="30" y1="145" x2="200" y2="145" stroke="#94a3b8" stroke-width="1"/>
      <circle cx="50" cy="145" r="6" fill="#3b82f6"/><text x="50" y="137" text-anchor="middle" fill="#3b82f6" font-size="8" font-family="sans-serif">C₁</text>
      <circle cx="80" cy="145" r="6" fill="#f59e0b"/><text x="80" y="137" text-anchor="middle" fill="#f59e0b" font-size="8" font-family="sans-serif">P₁</text>
      <circle cx="150" cy="145" r="6" fill="#f59e0b"/><text x="150" y="137" text-anchor="middle" fill="#f59e0b" font-size="8" font-family="sans-serif">P₂</text>
      <circle cx="180" cy="145" r="6" fill="#3b82f6"/><text x="180" y="137" text-anchor="middle" fill="#3b82f6" font-size="8" font-family="sans-serif">C₂</text>
      <text x="115" y="168" text-anchor="middle" fill="#4f46e5" font-size="10" font-weight="bold" font-family="sans-serif">Dipole-Dipole</text>
      <text x="350" y="130" fill="#64748b" font-size="10" font-family="sans-serif">Blue = current (C) electrodes</text>
      <text x="350" y="150" fill="#64748b" font-size="10" font-family="sans-serif">Amber = potential (P) electrodes</text>
      <text x="350" y="175" fill="#f59e0b" font-size="10" font-family="sans-serif">ρ_a = K × ΔV / I</text>
      <text x="350" y="195" fill="#64748b" font-size="10" font-family="sans-serif">K = geometric factor</text>
    </svg>`),
  };
}

function svgSeismicReflection() {
  return {
    kind: "svg",
    caption: "Seismic reflection coefficient versus incidence angle showing AVO class responses",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Reflection Coefficient vs Angle</text>
      <line x1="60" y1="110" x2="440" y2="110" stroke="#94a3b8" stroke-width="1"/>
      <line x1="60" y1="35" x2="60" y2="195" stroke="#94a3b8" stroke-width="1"/>
      <text x="250" y="212" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Angle of incidence θ (degrees)</text>
      <text x="55" y="42" text-anchor="end" fill="#64748b" font-size="8" font-family="sans-serif">R(0)</text>
      <text x="55" y="115" text-anchor="end" fill="#64748b" font-size="8" font-family="sans-serif">0</text>
      <path d="M70,80 Q150,75 250,65 Q350,50 430,40" fill="none" stroke="#3b82f6" stroke-width="2"/>
      <path d="M70,130 Q150,132 250,140 Q350,150 430,165" fill="none" stroke="#ef4444" stroke-width="2"/>
      <path d="M70,105 Q150,104 250,102 Q350,100 430,98" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6,3"/>
      <text x="330" y="38" fill="#3b82f6" font-size="9" font-family="sans-serif">Bright spot (gas)</text>
      <text x="330" y="175" fill="#ef4444" font-size="9" font-family="sans-serif">Dim spot (tight)</text>
      <text x="330" y="95" fill="#f59e0b" font-size="9" font-family="sans-serif">Flat (shale-shale)</text>
      <text x="240" y="198" text-anchor="middle" fill="#64748b" font-size="10" font-family="sans-serif">R(θ) ≈ R(0) + G·sin²θ + F·sin²θ·tan²θ</text>
    </svg>`),
  };
}

function svgPaleomagneticPole() {
  return {
    kind: "svg",
    caption: "Paleomagnetic pole determination from remanent magnetization directions",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Paleomagnetic Pole Determination</text>
      <circle cx="140" cy="120" r="80" fill="none" stroke="#94a3b8" stroke-width="1"/>
      <ellipse cx="140" cy="120" rx="80" ry="30" fill="none" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="3,3"/>
      <ellipse cx="140" cy="120" rx="30" ry="80" fill="none" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="3,3"/>
      <circle cx="140" cy="40" r="4" fill="#3b82f6"/><text x="155" y="44" fill="#3b82f6" font-size="9" font-family="sans-serif">N pole</text>
      <circle cx="140" cy="200" r="4" fill="#ef4444"/><text x="155" y="204" fill="#ef4444" font-size="9" font-family="sans-serif">S pole</text>
      <g fill="#f59e0b" opacity="0.8">
        <circle cx="165" cy="85" r="3"/><circle cx="175" cy="95" r="3"/>
        <circle cx="155" cy="90" r="3"/><circle cx="170" cy="80" r="3"/>
        <circle cx="160" cy="100" r="3"/><circle cx="180" cy="88" r="3"/>
      </g>
      <circle cx="170" cy="90" r="15" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,2"/>
      <text x="170" y="125" text-anchor="middle" fill="#f59e0b" font-size="9" font-family="sans-serif">VGP cluster</text>
      <text x="340" y="55" fill="#4f46e5" font-size="10" font-family="sans-serif">1. Collect oriented samples</text>
      <text x="340" y="78" fill="#4f46e5" font-size="10" font-family="sans-serif">2. Measure D and I</text>
      <text x="340" y="101" fill="#4f46e5" font-size="10" font-family="sans-serif">3. Calculate VGP position</text>
      <text x="340" y="124" fill="#f59e0b" font-size="10" font-family="sans-serif">4. Mean pole = paleopole</text>
      <text x="340" y="150" fill="#64748b" font-size="10" font-family="sans-serif">→ Apparent Polar Wander Path</text>
    </svg>`),
  };
}

function svgReductionToPole() {
  return {
    kind: "svg",
    caption: "Reduction-to-pole transformation converting anomaly to zero-latitudinal position",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Reduction to Pole (RTP)</text>
      <text x="120" y="40" text-anchor="middle" fill="#4f46e5" font-size="11" font-family="sans-serif">Observed (I = 60°)</text>
      <line x1="30" y1="55" x2="210" y2="55" stroke="#94a3b8" stroke-width="1"/>
      <path d="M40,55 Q80,30 120,55 Q160,80 200,55" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
      <path d="M40,55 Q80,30 120,55 Q160,80 200,55 L200,55 L40,55 Z" fill="#3b82f6" opacity="0.15"/>
      <text x="120" y="90" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Asymmetric, shifted</text>
      <line x1="115" y1="55" x2="125" y2="55" stroke="#ef4444" stroke-width="1.5"/>
      <polygon points="118,50 115,55 118,60" fill="#ef4444"/>
      <text x="240" y="55" fill="#f59e0b" font-size="20" font-family="sans-serif">→</text>
      <text x="360" y="40" text-anchor="middle" fill="#4f46e5" font-size="11" font-family="sans-serif">After RTP (I = 90°)</text>
      <line x1="270" y1="55" x2="450" y2="55" stroke="#94a3b8" stroke-width="1"/>
      <path d="M280,55 Q330,25 380,55 Q430,85 440,55" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
      <path d="M280,55 Q330,25 380,55 Q430,85 440,55 L440,55 L280,55 Z" fill="#f59e0b" opacity="0.15"/>
      <text x="360" y="90" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Symmetric, centered on source</text>
      <line x1="375" y1="55" x2="385" y2="55" stroke="#ef4444" stroke-width="1.5"/>
      <polygon points="378,50 375,55 378,60" fill="#ef4444"/>
      <text x="240" y="130" fill="#64748b" font-size="10" font-family="sans-serif">RTP applies inverse filter in frequency domain:</text>
      <text x="240" y="150" fill="#3b82f6" font-size="10" font-family="sans-serif">F_RTP = F_obs × (1 / (sin I₀ + i cos I₀ cos D₀)²)</text>
      <text x="240" y="175" fill="#64748b" font-size="10" font-family="sans-serif">Removes latitude-dependent skewness</text>
      <text x="240" y="198" fill="#f59e0b" font-size="10" font-family="sans-serif">→ Peak aligns directly above source body</text>
    </svg>`),
  };
}

function svgMantleConvection() {
  return {
    kind: "svg",
    caption: "Mantle convection cell showing upwelling and downwelling flow patterns",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Mantle Convection Cell</text>
      <rect x="40" y="35" width="400" height="170" fill="#fff" stroke="#94a3b8" stroke-width="1" rx="4"/>
      <rect x="40" y="35" width="400" height="25" fill="#94a3b8" opacity="0.3" rx="4"/>
      <text x="240" y="52" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Lithosphere (rigid)</text>
      <rect x="40" y="180" width="400" height="25" fill="#ef4444" opacity="0.3" rx="4"/>
      <text x="240" y="197" text-anchor="middle" fill="#ef4444" font-size="9" font-family="sans-serif">D'' Layer (CMB)</text>
      <line x1="140" y1="60" x2="140" y2="175" stroke="#f59e0b" stroke-width="2"/>
      <polygon points="137,170 140,180 143,170" fill="#f59e0b"/>
      <line x1="240" y1="175" x2="240" y2="60" stroke="#3b82f6" stroke-width="2"/>
      <polygon points="237,65 240,55 243,65" fill="#3b82f6"/>
      <line x1="340" y1="60" x2="340" y2="175" stroke="#f59e0b" stroke-width="2"/>
      <polygon points="337,170 340,180 343,170" fill="#f59e0b"/>
      <path d="M140,175 Q190,175 240,175" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
      <path d="M240,60 Q290,60 340,60" fill="none" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="90" y="120" fill="#64748b" font-size="9" font-family="sans-serif">↓ Down</text>
      <text x="240" y="120" fill="#3b82f6" font-size="9" font-family="sans-serif">↑ Plume</text>
      <text x="380" y="120" fill="#64748b" font-size="9" font-family="sans-serif">↓ Down</text>
      <text x="190" y="218" text-anchor="middle" fill="#64748b" font-size="10" font-family="sans-serif">Convection drives plate tectonics and heat loss</text>
    </svg>`),
  };
}

function svgGeoidAnomaly() {
  return {
    kind: "svg",
    caption: "Geoid anomaly map showing positive and negative undulations from mantle density variations",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Geoid Anomalies</text>
      <rect x="40" y="35" width="280" height="170" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1" rx="4"/>
      <ellipse cx="120" cy="90" rx="45" ry="30" fill="#3b82f6" opacity="0.5"/>
      <text x="120" y="95" text-anchor="middle" fill="#fff" font-size="9" font-family="sans-serif">+80 m</text>
      <ellipse cx="220" cy="150" rx="55" ry="25" fill="#ef4444" opacity="0.5"/>
      <text x="220" y="155" text-anchor="middle" fill="#fff" font-size="9" font-family="sans-serif">-60 m</text>
      <ellipse cx="170" cy="70" rx="30" ry="20" fill="#3b82f6" opacity="0.3"/>
      <text x="170" y="75" text-anchor="middle" fill="#fff" font-size="8" font-family="sans-serif">+40 m</text>
      <text x="180" y="218" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Geoid height N(θ,λ) in metres</text>
      <text x="370" y="55" fill="#3b82f6" font-size="10" font-family="sans-serif">■ Positive = dense material</text>
      <text x="370" y="78" fill="#ef4444" font-size="10" font-family="sans-serif">■ Negative = less dense</text>
      <text x="370" y="105" fill="#64748b" font-size="10" font-family="sans-serif">N = Σ Jₙ(cos θ)</text>
      <text x="370" y="128" fill="#64748b" font-size="10" font-family="sans-serif">Spherical harmonics</text>
      <text x="370" y="155" fill="#64748b" font-size="10" font-family="sans-serif">GOCE/GRACE measure</text>
      <text x="370" y="200" fill="#f59e0b" font-size="10" font-family="sans-serif">→ Constrained by mantle flow</text>
    </svg>`),
  };
}

function svgPostGlacialRebound() {
  return {
    kind: "svg",
    caption: "Post-glacial rebound (glacial isostatic adjustment) showing crustal depression and relaxation",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Post-Glacial Rebound (GIA)</text>
      <line x1="40" y1="120" x2="440" y2="120" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4,3"/>
      <text x="445" y="124" fill="#64748b" font-size="9" font-family="sans-serif">Equilibrium</text>
      <rect x="100" y="60" width="100" height="40" fill="#93c5fd" opacity="0.6" rx="3"/>
      <text x="150" y="85" text-anchor="middle" fill="#1e3a5f" font-size="9" font-family="sans-serif">Ice sheet</text>
      <path d="M60,120 Q100,160 150,155 Q200,150 250,120" fill="none" stroke="#ef4444" stroke-width="2.5"/>
      <text x="150" y="175" text-anchor="middle" fill="#ef4444" font-size="9" font-family="sans-serif">Depressed crust (loaded)</text>
      <path d="M300,120 Q340,130 380,125 Q420,122 440,120" fill="none" stroke="#10b981" stroke-width="2.5" stroke-dasharray="6,3"/>
      <text x="370" y="140" text-anchor="middle" fill="#10b981" font-size="9" font-family="sans-serif">Rebounding crust</text>
      <text x="240" y="205" text-anchor="middle" fill="#64748b" font-size="10" font-family="sans-serif">Relaxation time τ ∝ η / (Δρ × g)</text>
      <text x="240" y="218" text-anchor="middle" fill="#f59e0b" font-size="10" font-family="sans-serif">Scandinavia still rebounding ~1 cm/yr</text>
    </svg>`),
  };
}

function svgInternalStructure() {
  return {
    kind: "svg",
    caption: "Earth's density and velocity structure (PREM model) with major discontinuities",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">PREM: Density &amp; Velocity Structure</text>
      <line x1="60" y1="195" x2="440" y2="195" stroke="#94a3b8" stroke-width="1"/>
      <line x1="60" y1="35" x2="60" y2="195" stroke="#94a3b8" stroke-width="1"/>
      <text x="250" y="212" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Depth (km)</text>
      <text x="55" y="42" text-anchor="end" fill="#64748b" font-size="8" font-family="sans-serif">0</text>
      <text x="55" y="75" text-anchor="end" fill="#64748b" font-size="8" font-family="sans-serif">2900</text>
      <text x="55" y="110" text-anchor="end" fill="#64748b" font-size="8" font-family="sans-serif">4000</text>
      <text x="55" y="145" text-anchor="end" fill="#64748b" font-size="8" font-family="sans-serif">5150</text>
      <text x="55" y="192" text-anchor="end" fill="#64748b" font-size="8" font-family="sans-serif">6371</text>
      <line x1="60" y1="75" x2="440" y2="75" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="3,3"/>
      <line x1="60" y1="145" x2="440" y2="145" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="3,3"/>
      <path d="M80,42 Q100,55 110,70 Q130,75 140,95 Q150,115 160,140 Q170,145 175,155 Q180,170 185,190" fill="none" stroke="#3b82f6" stroke-width="2"/>
      <path d="M200,42 Q230,55 250,70 Q280,75 300,95 Q320,115 340,140 Q350,145 355,155 Q360,170 365,190" fill="none" stroke="#f59e0b" stroke-width="2"/>
      <text x="380" y="55" fill="#3b82f6" font-size="10" font-family="sans-serif">Vp (P-wave)</text>
      <text x="380" y="75" fill="#f59e0b" font-size="10" font-family="sans-serif">Vs (S-wave)</text>
      <text x="380" y="100" fill="#64748b" font-size="9" font-family="sans-serif">Vs = 0 in outer core</text>
      <text x="380" y="118" fill="#64748b" font-size="9" font-family="sans-serif">(liquid iron)</text>
      <text x="380" y="140" fill="#ef4444" font-size="9" font-family="sans-serif">Gutenberg at 2900 km</text>
      <text x="380" y="158" fill="#ef4444" font-size="9" font-family="sans-serif">Lehmann at 5150 km</text>
    </svg>`),
  };
}

function svgRayTheory() {
  return {
    kind: "svg",
    caption: "Seismic ray paths through Earth's curved layers following Snell's law",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Seismic Ray Paths (Snell's Law)</text>
      <circle cx="150" cy="120" r="85" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/>
      <circle cx="150" cy="120" r="60" fill="#f59e0b" opacity="0.2" stroke="#f59e0b" stroke-width="0.5"/>
      <circle cx="150" cy="120" r="30" fill="#ef4444" opacity="0.2" stroke="#ef4444" stroke-width="0.5"/>
      <path d="M60,40 Q90,80 120,100 Q145,115 150,120" fill="none" stroke="#3b82f6" stroke-width="1.5"/>
      <path d="M150,120 Q155,125 180,140 Q210,160 240,200" fill="none" stroke="#3b82f6" stroke-width="1.5"/>
      <path d="M80,45 Q110,85 140,105 Q160,118 170,125" fill="none" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,2"/>
      <path d="M170,125 Q180,132 200,150 Q230,175 260,210" fill="none" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,2"/>
      <text x="260" y="60" fill="#3b82f6" font-size="10" font-family="sans-serif">P-wave ray</text>
      <text x="260" y="80" fill="#10b981" font-size="10" font-family="sans-serif">Refracted at boundaries</text>
      <text x="260" y="105" fill="#64748b" font-size="10" font-family="sans-serif">sin θ₁ / v₁ = sin θ₂ / v₂</text>
      <text x="260" y="130" fill="#64748b" font-size="10" font-family="sans-serif">Ray bending at velocity gradients</text>
      <text x="260" y="155" fill="#f59e0b" font-size="10" font-family="sans-serif">Critical refraction →</text>
      <text x="260" y="173" fill="#f59e0b" font-size="10" font-family="sans-serif">head waves along layers</text>
      <text x="260" y="198" fill="#64748b" font-size="9" font-family="sans-serif">Travel time: t = ∫ ds / v(s)</text>
    </svg>`),
  };
}

function svgMomentTensor() {
  return {
    kind: "svg",
    caption: "Seismic moment tensor representation showing six independent components",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Moment Tensor (6 components)</text>
      <g transform="translate(50,35)">
        <text x="80" y="0" text-anchor="middle" fill="#64748b" font-size="10" font-family="sans-serif">M =</text>
        <rect x="100" y="-10" width="50" height="30" fill="#3b82f6" opacity="0.7" rx="3"/><text x="125" y="10" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif">Mxx</text>
        <rect x="155" y="-10" width="50" height="30" fill="#f59e0b" opacity="0.7" rx="3"/><text x="180" y="10" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif">Mxy</text>
        <rect x="210" y="-10" width="50" height="30" fill="#f59e0b" opacity="0.7" rx="3"/><text x="235" y="10" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif">Mxz</text>
        <rect x="100" y="25" width="50" height="30" fill="#f59e0b" opacity="0.7" rx="3"/><text x="125" y="45" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif">Myx</text>
        <rect x="155" y="25" width="50" height="30" fill="#3b82f6" opacity="0.7" rx="3"/><text x="180" y="45" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif">Myy</text>
        <rect x="210" y="25" width="50" height="30" fill="#f59e0b" opacity="0.7" rx="3"/><text x="235" y="45" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif">Myz</text>
        <rect x="100" y="60" width="50" height="30" fill="#f59e0b" opacity="0.7" rx="3"/><text x="125" y="80" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif">Mzx</text>
        <rect x="155" y="60" width="50" height="30" fill="#f59e0b" opacity="0.7" rx="3"/><text x="180" y="80" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif">Mzy</text>
        <rect x="210" y="60" width="50" height="30" fill="#3b82f6" opacity="0.7" rx="3"/><text x="235" y="80" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif">Mzz</text>
      </g>
      <text x="340" y="55" fill="#3b82f6" font-size="10" font-family="sans-serif">■ Diagonal (3)</text>
      <text x="340" y="78" fill="#f59e0b" font-size="10" font-family="sans-serif">■ Off-diagonal (3)</text>
      <text x="340" y="105" fill="#64748b" font-size="10" font-family="sans-serif">M₀ = seismic moment</text>
      <text x="340" y="128" fill="#64748b" font-size="10" font-family="sans-serif">Mw = (2/3) log₁₀ M₀ − 10.7</text>
      <text x="340" y="155" fill="#64748b" font-size="10" font-family="sans-serif">Inverted from waveforms</text>
      <text x="340" y="178" fill="#f59e0b" font-size="10" font-family="sans-serif">→ Full radiation pattern</text>
    </svg>`),
  };
}

function svgSphericalHarmonics() {
  return {
    kind: "svg",
    caption: "Spherical harmonic expansion of the geomagnetic field showing dipole components",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Spherical Harmonics — Geomagnetic Field</text>
      <circle cx="120" cy="120" r="70" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/>
      <line x1="120" y1="50" x2="120" y2="190" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="3,3"/>
      <path d="M100,80 Q120,60 140,80" fill="none" stroke="#3b82f6" stroke-width="2"/>
      <path d="M100,160 Q120,180 140,160" fill="none" stroke="#ef4444" stroke-width="2"/>
      <text x="155" y="75" fill="#3b82f6" font-size="9" font-family="sans-serif">N pole</text>
      <text x="155" y="170" fill="#ef4444" font-size="9" font-family="sans-serif">S pole</text>
      <text x="280" y="55" fill="#4f46e5" font-size="10" font-family="sans-serif">B(r,θ,λ) = Σ gₙᵐ cos(mλ)</text>
      <text x="280" y="75" fill="#4f46e5" font-size="10" font-family="sans-serif">         + hₙᵐ sin(mλ)) Pₙᵐ(cos θ)</text>
      <text x="280" y="105" fill="#3b82f6" font-size="10" font-family="sans-serif">n=1: Dipole (80% of field)</text>
      <text x="280" y="128" fill="#f59e0b" font-size="10" font-family="sans-serif">n=2-13: Non-dipole features</text>
      <text x="280" y="155" fill="#64748b" font-size="10" font-family="sans-serif">g₁⁰ = -29,404 nT</text>
      <text x="280" y="178" fill="#64748b" font-size="10" font-family="sans-serif">IGRF: degree 13 → 195 coefficients</text>
      <text x="280" y="200" fill="#f59e0b" font-size="10" font-family="sans-serif">→ Secular variation: ~100 nT/yr</text>
    </svg>`),
  };
}

function svgEMInduction() {
  return {
    kind: "svg",
    caption: "Electromagnetic induction: time-varying field induces eddy currents in conductive ground",
    markup: S(`<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="220" fill="#f8fafc" rx="8"/>
      <text x="240" y="20" text-anchor="middle" fill="#4f46e5" font-weight="bold" font-size="13" font-family="sans-serif">Electromagnetic Induction in Ground</text>
      <rect x="40" y="100" width="400" height="110" fill="#f59e0b" opacity="0.15" rx="4"/>
      <line x1="40" y1="100" x2="440" y2="100" stroke="#94a3b8" stroke-width="1"/>
      <text x="240" y="115" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Conductive ground (ρ)</text>
      <text x="120" y="50" fill="#3b82f6" font-size="10" font-family="sans-serif">H(t) = H₀ sin(ωt)</text>
      <text x="120" y="70" fill="#3b82f6" font-size="10" font-family="sans-serif">↑ Time-varying primary field</text>
      <path d="M100,85 Q130,70 160,85 Q190,100 220,85 Q250,70 280,85" fill="none" stroke="#3b82f6" stroke-width="2"/>
      <ellipse cx="180" cy="155" rx="60" ry="30" fill="none" stroke="#ef4444" stroke-width="2"/>
      <text x="180" y="160" text-anchor="middle" fill="#ef4444" font-size="9" font-family="sans-serif">Eddy currents</text>
      <ellipse cx="180" cy="155" rx="40" ry="20" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,2"/>
      <text x="350" y="135" fill="#64748b" font-size="10" font-family="sans-serif">∇×E = −∂B/∂t</text>
      <text x="350" y="155" fill="#64748b" font-size="10" font-family="sans-serif">∇×H = J + ∂D/∂t</text>
      <text x="350" y="180" fill="#f59e0b" font-size="10" font-family="sans-serif">→ Secondary field carries</text>
      <text x="350" y="198" fill="#f59e0b" font-size="10" font-family="sans-serif">   conductivity information</text>
    </svg>`),
  };
}

// ── Topic → SVG mapping ───────────────────────────────────────────────────

const topicMap = [
  { test: /earth.*(interior|internal|structure|layers|density.*velocity|mantle.*convec)/i, fn: svgInternalStructure },
  { test: /earth.*energy/i, fn: svgInternalStructure },
  { test: /mantle.*convec|mantle.*viscos|mantle.*rheol/i, fn: svgMantleConvection },
  { test: /isostas|post.*glacial|glacial.*isost/i, fn: svgIsostasy },
  { test: /plate.*tecton|plate.*boundar|convergent|divergent|transform.*fault/i, fn: svgPlateBoundary },
  { test: /focal.*mechan|beach.*ball|first.*motion/i, fn: svgFocalMechanism },
  { test: /wave.*propag|wave.*equat|p.*wave|s.*wave|elasticit/i, fn: svgWavePropagation },
  { test: /ray.*theor|eikonal|ray.*path|snell/i, fn: svgRayTheory },
  { test: /bouguer|gravity.*anomal|free.*air|isostatic.*analy/i, fn: svgBouguerAnomaly },
  { test: /tensor.*gravity|gravity.*gradient|full.*tensor|tensor.*interpret/i, fn: svgGravityTensor },
  { test: /gravity.*forward|depth.*estimation|equivalent.*stratum|sediment.*thickness|moho.*depth|thermal.*gravity|lithospheric.*flexure|effective.*elastic/i, fn: svgBouguerAnomaly },
  { test: /gravity.*joint|magnetic.*property|survey.*design|level.*error|igrf|crustal.*field|aeromagnetic|microlevel|curie.*depth/i, fn: svgMagneticAnomalyDike },
  { test: /magnetic.*anomal|anomal.*dike|remanent.*magnet|reduction.*pole|magnetic.*model|remnant/i, fn: svgMagneticAnomalyDike },
  { test: /paleomagnet|paleopole|apparent.*polar|vog.*paleomag/i, fn: svgPaleomagneticPole },
  { test: /polarity.*revers|reversal|revers.*chron|geomagnetic.*polarity/i, fn: svgPaleomagneticReversals },
  { test: /reduction.*pole|rtp/i, fn: svgReductionToPole },
  { test: /wenner|dc.*resistiv|electrode.*array|resistivity.*survey|vertical.*electrical|apparent.*resistiv|forward.*problem/i, fn: svgDCResistivity },
  { test: /schlumberger/i, fn: svgDCResistivity },
  { test: /resistiv.*sounding|sounding.*curve|h.*type|k.*type|a.*type|equivalence/i, fn: svgResistivitySounding },
  { test: /skin.*depth|em.*penetrat|electromagnetic.*induct|em.*wave.*propag|csem|csamt|controlled.*source.*em|marine.*em|airwave|near.*field.*correc|tem|transient.*em|smoke.*ring|time.*domain.*em|conducting.*overburden/i, fn: svgEMSkinDepth },
  { test: /magnetotelluric|mt.*impedan|impedance.*phase|phase.*tensor|induction.*vector/i, fn: svgMagnetotelluric },
  { test: /em.*induct|electromagnetic.*induct|eddy/i, fn: svgEMInduction },
  { test: /seismic.*trace|wiggle|trace.*display|variable.*area/i, fn: svgSeismicTrace },
  { test: /cmp.*gather|nmo|moveout|common.*midpoint/i, fn: svgCMPNMO },
  { test: /seismic.*migrat|migration.*concept|pre.*stack.*depth|reverse.*time.*migrat|least.*squares.*migrat/i, fn: svgSeismicMigration },
  { test: /avo|amplitude.*offset|reflection.*coeff|bright.*spot|dim.*spot/i, fn: svgAVO },
  { test: /well.*log|resistivity.*log|nuclear.*log|sonic.*log|porosity.*log|nmr.*log|logging|archie|dual.*water|saturation|clay.*quantif|dielectric|image.*log|formation.*test|formation.*eval|through.*casing|multilateral/i, fn: svgWellLog },
  { test: /velocity.*porosit|wyllie|time.*average/i, fn: svgVelocityPorosity },
  { test: /gassmann|fluid.*substitut/i, fn: svgGassmann },
  { test: /moment.*tensor|source.*character|moment.*invers|rupture.*mechan|stress.*drop|brune.*model|source.*scal/i, fn: svgMomentTensor },
  { test: /spherical.*harmon|gauss.*coeff|dynamo.*theor|geomagnetic.*jerks|gad|geocentric.*axial/i, fn: svgSphericalHarmonics },
  { test: /geoid.*undul|geoid.*comput|geoid.*model|stokes.*formula|geoid.*anomal|goce|gradiom|satellite.*gravity|3d.*density/i, fn: svgGeoidAnomaly },
  { test: /seismic.*anisotrop|seismic.*tomograph|full.*waveform.*invers|adjoint|ambient.*noise|surface.*wave.*dispers|free.*oscillat|modal.*analy|attenuation.*q|waveform.*model/i, fn: svgRayTheory },
  { test: /forward.*invers|linear.*invers|stochastic.*method|swarm.*intelligence|machine.*learn|global.*optim|bayesian|cross.*valid|jackknife|null.*space|model.*resol|condition.*number|occams.*razor|svd|l.*curve|regulariz|trans.*dimension|hierarchical|model.*select/i, fn: svgBouguerAnomaly },
  { test: /signal.*process|fourier|deconvol|hilbert|wavelet|autocorrel|cross.*correl|power.*spectrum|digital.*filter|fk.*analy|tau.*p|radon|median.*filter|beamform|music|matching.*pursuit|compress.*sens|stationary.*wavelet|sparse.*invert|dictionary.*learn|deep.*learn.*denois|sampling.*alias/i, fn: svgSeismicTrace },
  { test: /reservoir.*geophys|rock.*physic|petrophysic|porosity.*permeab|pore.*pressure|poroelastic|biot.*coef|effective.*medium|critical.*angle|time.*lapse|4d.*seismic|pore.*scale|upscal|digital.*rock|geomechan|seismic.*amplit|cross.*plot|impedance/i, fn: svgVelocityPorosity },
  { test: /nuclear.*physic|detection.*instrument|radioactiv|decay|half.*life|gamma.*ray.*spectr|neutron.*activ|gamma.*gamma|neutron.*porosity|natural.*gamma|environment.*correct|positron|cosmic.*ray|muon/i, fn: svgWellLog },
  { test: /reference.*ellipsoid|geoid.*undul|coordinate.*system|gps.*error|gnss|datum.*transform|geoid.*comput|stokes|reference.*frame|itrf|earth.*rotation|polar.*motion|satellite.*geodesy|grace|temporal.*gravity|very.*long.*baseline|satellite.*laser|satellite.*altimetry|gps.*correct/i, fn: svgGeoidAnomaly },
  { test: /sp.*origin|self.*potenti|streaming.*potent|sp.*noise/i, fn: svgDCResistivity },
  { test: /2d.*resistiv.*imag|ert|3d.*resistiv|tomograph.*invers|borehole.*resistiv|laterolog/i, fn: svgDCResistivity },
  { test: /induced.*polariz|complex.*resistiv|spectral.*ip/i, fn: svgDCResistivity },
  { test: /thermal.*boundar|inner.*core.*anisotrop|cmb.*dynamics|d″|plume.*dynam|core.*mantle|adiabatic.*gradient|mantle.*viscos|mantle.*convect|true.*polar.*wander/i, fn: svgMantleConvection },
  { test: /seismic.*attribut|seismic.*stratigraph|seismic.*acquisit|digital.*format|static.*correct|coherence.*cube|velocity.*analy|semblance|residual.*static|spectral.*decompos|multi.*component.*seism|seismic.*interferom|anisotrop.*hti|shear.*wave.*split|multicomponent.*process|bright.*dim|seism.*stratig/i, fn: svgSeismicTrace },
  { test: /dynamic.*rupture|brune.*model|spectral.*analy|rupture.*mechan|attenuation.*q/i, fn: svgMomentTensor },
  { test: /telluric|magnetotelluric.*method|faraday.*law.*geomag|geomagnetic.*induct/i, fn: svgMagnetotelluric },
  { test: /paleointensity|thellier|vine.*matthew|magnetic.*reversal|magnetic.*suscept|earth.*magnetic.*field|magnetic.*map|magnetic.*anomal|koenigsberg|reman.*induced|magnetic.*process|magnetic.*interpret|analytic.*signal|euler.*solution|image.*process/i, fn: svgPaleomagneticReversals },
  { test: /potential.*theor|gauss.*law|faraday.*law|maxwell|helmholtz|green.*function|laplace|poisson|upward.*continu|spectral.*method|equival.*source|polynomial.*fitt|boundary.*value|integral.*equat|laplace.*layer/i, fn: svgSphericalHarmonics },
  { test: /decay.*chain|radiometric|semiconductor.*detect|detector.*physic|gamma.*spectromet|neutron.*gamma|environment.*correct/i, fn: svgWellLog },
  { test: /cmm|lithosphere.*asthenosphere|earth.*interior.*structur|mantle.*convec/i, fn: svgMantleConvection },
  { test: /nmr|cpmg|nuclear.*magnetic|relaxation.*t[12]/i, fn: svgWellLog },
];

function pickSvg(question) {
  const topic = question.topic || "";
  for (const { test, fn } of topicMap) {
    if (test.test(topic)) return fn();
  }
  return null;
}

// ── Main ───────────────────────────────────────────────────────────────────

const TARGET_FIGURES = [6, 7, 8, 9];

function main() {
  const results = [];

  for (let i = 6; i <= 15; i++) {
    const file = join(BASE, `ongc-geophysics-${String(i).padStart(2, "0")}.json`);
    const data = JSON.parse(readFileSync(file, "utf-8"));

    const domainQs = data.questions.filter((q) => q.section === "Domain");
    const alreadyHasFigure = domainQs.filter((q) => q.figure);

    if (alreadyHasFigure.length > 0) {
      results.push({
        mock: i,
        status: "SKIP",
        reason: `${alreadyHasFigure.length} questions already have figures`,
      });
      continue;
    }

    const targetCount =
      TARGET_FIGURES[Math.floor(Math.random() * TARGET_FIGURES.length)];

    // Score each domain question for figure candidacy
    const candidates = [];
    for (const q of domainQs) {
      const svg = pickSvg(q);
      if (svg) {
        candidates.push({ question: q, svg });
      }
    }

    // Shuffle candidates and pick target count
    for (let j = candidates.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [candidates[j], candidates[k]] = [candidates[k], candidates[j]];
    }

    const selected = candidates.slice(0, Math.min(targetCount, candidates.length));

    for (const { question, svg } of selected) {
      question.figure = svg;
    }

    writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf-8");

    const figureIds = selected.map((s) => s.question.id);
    results.push({
      mock: i,
      status: "OK",
      figuresAdded: selected.length,
      questionIds: figureIds,
    });
  }

  // Validation
  console.log("\n═══ SUMMARY ═══\n");
  let allValid = true;
  for (const r of results) {
    if (r.status === "SKIP") {
      console.log(`Mock ${r.mock}: ${r.status} — ${r.reason}`);
      continue;
    }
    const file = join(BASE, `ongc-geophysics-${String(r.mock).padStart(2, "0")}.json`);
    const data = JSON.parse(readFileSync(file, "utf-8"));
    const total = data.questions.length;
    const domain = data.questions.filter((q) => q.section === "Domain");
    const withFig = domain.filter(
      (q) => q.figure && q.figure.kind === "svg"
    );
    const valid = total === 85 && withFig.length >= 6 && withFig.length <= 9;
    const mark = valid ? "✓" : "✗";
    console.log(
      `${mark} Mock ${r.mock}: ${total} questions, ${withFig.length} figures (IDs: ${r.questionIds.join(", ")})`
    );
    if (!valid) allValid = false;
  }

  console.log(`\n${allValid ? "✓ All mocks valid!" : "✗ Some mocks failed validation"}`);
}

main();

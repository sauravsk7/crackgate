import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DIR = "apps/web/src/data/questions/ongc/physics";

function loadMock(no) {
  const path = join(DIR, `ongc-physics-${String(no).padStart(2, "0")}.json`);
  return { path, data: JSON.parse(readFileSync(path, "utf-8")) };
}

function saveMock(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
}

function svgWrap(inner, caption) {
  return {
    kind: "svg",
    caption,
    markup: `<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="220" fill="#f8fafc" rx="8"/>${inner}</svg>`,
  };
}

function title(text, y = 24) {
  return `<text x="240" y="${y}" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#4f46e5" font-weight="bold">${text}</text>`;
}

function label(text, x, y, opts = {}) {
  const size = opts.size || 10;
  const fill = opts.fill || "#64748b";
  return `<text x="${x}" y="${y}" font-family="sans-serif" font-size="${size}" fill="${fill}"${opts.anchor ? ' text-anchor="middle"' : ""}${opts.bold ? ' font-weight="bold"' : ""}>${text}</text>`;
}

function line(x1, y1, x2, y2, opts = {}) {
  const stroke = opts.stroke || "#94a3b8";
  const w = opts.width || 1.5;
  const dash = opts.dash ? ` stroke-dasharray="${opts.dash}"` : "";
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}"${dash}/>`;
}

function circle(cx, cy, r, opts = {}) {
  const fill = opts.fill || "none";
  const stroke = opts.stroke || "#3b82f6";
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${opts.width || 2}"/>`;
}

function path(d, opts = {}) {
  const stroke = opts.stroke || "#3b82f6";
  const w = opts.width || 2;
  const dash = opts.dash ? ` stroke-dasharray="${opts.dash}"` : "";
  return `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}"${dash}/>`;
}

function rect(x, y, w, h, opts = {}) {
  const fill = opts.fill || "none";
  const stroke = opts.stroke || "#94a3b8";
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${opts.width || 1.5}" rx="${opts.rx || 0}"/>`;
}

// ── SVG Generators by Topic Keyword ──

const generators = {
  // Classical Mechanics
  "Lagrangian Mechanics": () =>
    svgWrap(
      title("Generalized Coordinates · Lagrangian") +
        line(60, 180, 60, 40) +
        line(60, 180, 420, 180) +
        label("q", 425, 184) +
        label("L", 50, 38) +
        path("M80,160 Q160,60 240,140 Q320,180 400,80", { stroke: "#3b82f6" }) +
        label("L = T − V(q, q̇)", 240, 210, { anchor: true, size: 11 }),
      "Generalized coordinate trajectory minimizing action"
    ),

  "Central Force Motion": () =>
    svgWrap(
      title("Kepler Orbit · Ellipse") +
        `<ellipse cx="200" cy="110" rx="150" ry="70" fill="none" stroke="#3b82f6" stroke-width="2"/>` +
        circle(120, 110, 5, { fill: "#f59e0b", stroke: "#f59e0b" }) +
        label("Focus (Sun)", 120, 130, { anchor: true, fill: "#f59e0b" }) +
        label("a (semi-major)", 280, 100, { fill: "#3b82f6" }) +
        label("r", 200, 80, { fill: "#64748b" }) +
        line(120, 110, 320, 70, { stroke: "#64748b", dash: "4" }),
      "Elliptical orbit in inverse-square force field"
    ),

  "Hamiltonian Mechanics": () =>
    svgWrap(
      title("Phase Space Trajectory") +
        line(60, 180, 60, 40) +
        line(60, 180, 420, 180) +
        label("q", 425, 184) +
        label("p", 50, 38) +
        path("M120,140 Q200,50 300,140 Q380,200 400,100", { stroke: "#4f46e5" }) +
        circle(200, 100, 3, { fill: "#f59e0b", stroke: "#f59e0b" }) +
        label("H(q,p) = const", 240, 210, { anchor: true, size: 11 }),
      "Phase space orbit for constant Hamiltonian"
    ),

  "Liouville's Theorem": () =>
    svgWrap(
      title("Liouville's Theorem · Phase Space") +
        rect(80, 60, 60, 80, { fill: "#dbeafe", stroke: "#3b82f6" }) +
        label("t₀", 110, 140, { anchor: true }) +
        rect(280, 50, 80, 60, { fill: "#fef3c7", stroke: "#f59e0b" }) +
        label("t₁", 320, 120, { anchor: true }) +
        line(145, 95, 275, 80, { stroke: "#64748b", dash: "5", width: 1 }) +
        label("Phase volume preserved", 240, 210, { anchor: true, size: 11 }),
      "Phase space volume element conserved under Hamiltonian flow"
    ),

  "Canonical Transformations": () =>
    svgWrap(
      title("Canonical Transformation (Q,P) ← (q,p)") +
        rect(40, 60, 160, 100, { fill: "#dbeafe", stroke: "#3b82f6" }) +
        label("(q, p)", 120, 120, { anchor: true, size: 12, fill: "#3b82f6" }) +
        rect(280, 60, 160, 100, { fill: "#dcfce7", stroke: "#22c55e" }) +
        label("(Q, P)", 360, 120, { anchor: true, size: 12, fill: "#22c55e" }) +
        line(205, 110, 275, 110, { stroke: "#f59e0b", width: 2 }) +
        label("K(q,p,Q,P,t)", 240, 100, { anchor: true, fill: "#f59e0b" }),
      "Generating function K maps old to new canonical variables"
    ),

  "Hamilton-Jacobi": () =>
    svgWrap(
      title("Hamilton-Jacobi Equation") +
        label("∂S/∂t + H(q, ∂S/∂q, t) = 0", 240, 80, { anchor: true, size: 13, fill: "#4f46e5", bold: true }) +
        line(60, 120, 420, 120, { stroke: "#e2e8f0" }) +
        label("S(q, α, t) = generating function", 240, 150, { anchor: true, size: 11 }) +
        label("Action along classical path", 240, 175, { anchor: true, size: 11, fill: "#64748b" }),
      "Hamilton-Jacobi equation for generating function S"
    ),

  "Gyroscopic Motion": () =>
    svgWrap(
      title("Gyroscopic Precession") +
        circle(240, 120, 60, { stroke: "#3b82f6" }) +
        line(240, 60, 240, 180, { stroke: "#3b82f6", width: 2.5 }) +
        `<polygon points="240,55 235,65 245,65" fill="#3b82f6"/>` +
        path("M200,120 A40,40 0 1,1 280,120", { stroke: "#f59e0b", width: 1.5, dash: "4" }) +
        label("L⃗ = Iω⃗", 310, 80, { fill: "#3b82f6" }) +
        label("τ⃗ = dL⃗/dt", 310, 140, { fill: "#f59e0b" }),
      "Angular momentum precession under external torque"
    ),

  "Relativistic Collisions": () =>
    svgWrap(
      title("Relativistic Collision · Center of Mass") +
        line(60, 110, 180, 110, { stroke: "#3b82f6", width: 2 }) +
        `<polygon points="180,107 180,113 190,110" fill="#3b82f6"/>` +
        label("m₁", 120, 100, { fill: "#3b82f6" }) +
        line(420, 110, 300, 110, { stroke: "#ef4444", width: 2 }) +
        `<polygon points="300,107 300,113 290,110" fill="#ef4444"/>` +
        label("m₂", 350, 100, { fill: "#ef4444" }) +
        label("√s = total CM energy", 240, 170, { anchor: true, size: 11 }),
      "Relativistic two-body collision in CM frame"
    ),

  "Torque-Free Precession": () =>
    svgWrap(
      title("Torque-Free Precession · Free Top") +
        `<ellipse cx="240" cy="120" rx="120" ry="50" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="5"/>` +
        line(240, 50, 240, 190, { stroke: "#64748b", width: 1, dash: "3" }) +
        line(240, 120, 320, 80, { stroke: "#f59e0b", width: 2.5 }) +
        label("ω⃗", 330, 78, { fill: "#f59e0b", bold: true }) +
        line(240, 120, 240, 60, { stroke: "#ef4444", width: 2 }) +
        label("L⃗", 250, 55, { fill: "#ef4444", bold: true }) +
        label("ω precesses about L", 240, 210, { anchor: true, size: 10 }),
      "Angular velocity precesses around fixed angular momentum"
    ),

  "Coupled Oscillations": () =>
    svgWrap(
      title("Normal Modes · Coupled Oscillators") +
        rect(80, 80, 30, 30, { fill: "#3b82f6", stroke: "#3b82f6" }) +
        rect(170, 80, 30, 30, { fill: "#ef4444", stroke: "#ef4444" }) +
        rect(260, 80, 30, 30, { fill: "#22c55e", stroke: "#22c55e" }) +
        line(50, 95, 80, 95, { stroke: "#64748b", width: 1.5 }) +
        line(110, 95, 170, 95, { stroke: "#64748b", width: 1.5, dash: "3" }) +
        line(200, 95, 260, 95, { stroke: "#64748b", width: 1.5, dash: "3" }) +
        line(290, 95, 350, 95, { stroke: "#64748b", width: 1.5 }) +
        label("k", 140, 88, { fill: "#22c55e" }) +
        label("k", 230, 88, { fill: "#22c55e" }) +
        label("Symmetric: ω₁ = √(k/m)", 160, 160, { fill: "#3b82f6" }) +
        label("Antisymmetric: ω₂ = √(3k/m)", 160, 180, { fill: "#ef4444" }),
      "Normal mode frequencies of coupled oscillator system"
    ),

  "Rolling Motion": () =>
    svgWrap(
      title("Rolling Without Slipping") +
        line(60, 170, 420, 170, { stroke: "#64748b", width: 2 }) +
        `<polygon points="60,170 420,170 60,100" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5"/>` +
        circle(200, 140, 25, { fill: "#dbeafe", stroke: "#3b82f6" }) +
        circle(200, 140, 2, { fill: "#ef4444" }) +
        line(200, 140, 200, 115, { stroke: "#f59e0b", width: 1.5 }) +
        label("a = g sin θ / (1 + I/mR²)", 240, 80, { anchor: true, size: 11 }),
      "Rolling acceleration depends on moment of inertia"
    ),

  "Kaluza-Klein": () =>
    svgWrap(
      title("Kaluza-Klein · 5D Spacetime") +
        rect(80, 50, 200, 120, { fill: "#f0f9ff", stroke: "#3b82f6" }) +
        label("4D Spacetime", 180, 115, { anchor: true, size: 11, fill: "#3b82f6" }) +
        `<ellipse cx="370" cy="110" rx="40" ry="70" fill="none" stroke="#f59e0b" stroke-width="2"/>` +
        label("S¹ (compact)", 370, 195, { anchor: true, size: 10, fill: "#f59e0b" }) +
        label("5D metric → 4D gravity + EM", 240, 210, { anchor: true, size: 10 }),
      "Extra compact dimension unifies gravity and electromagnetism"
    ),

  "Action-Angle Variables": () =>
    svgWrap(
      title("Action-Angle Variables (J, θ)") +
        line(60, 180, 60, 40) +
        line(60, 180, 420, 180) +
        label("θ (mod 2π)", 420, 184, { size: 10 }) +
        label("J", 50, 38) +
        path("M80,150 Q150,50 220,150 Q290,200 360,100 Q400,60 420,120", { stroke: "#4f46e5" }) +
        label("J = const (action)", 240, 210, { anchor: true, size: 11 }),
      "Phase portrait in action-angle coordinates"
    ),

  // Mathematical Physics
  "Complex Analysis": () =>
    svgWrap(
      title("Contour Integral in Complex Plane") +
        line(60, 110, 420, 110, { stroke: "#e2e8f0" }) +
        line(240, 30, 240, 190, { stroke: "#e2e8f0" }) +
        label("Re", 425, 114) +
        label("Im", 245, 35) +
        `<path d="M160,140 A80,60 0 1,1 320,140" fill="none" stroke="#3b82f6" stroke-width="2"/>` +
        `<polygon points="320,140 312,134 312,146" fill="#3b82f6"/>` +
        circle(200, 110, 3, { fill: "#ef4444", stroke: "#ef4444" }) +
        label("z₀ (pole)", 210, 105, { fill: "#ef4444" }) +
        label("∮ f(z)dz = 2πi Res(f, z₀)", 240, 210, { anchor: true, size: 11 }),
      "Contour integration picking up residue at pole z₀"
    ),

  "Legendre Polynomials": () =>
    svgWrap(
      title("Legendre Polynomials Pₙ(x)") +
        line(60, 120, 420, 120, { stroke: "#94a3b8" }) +
        line(240, 40, 240, 200, { stroke: "#94a3b8" }) +
        label("x", 425, 124) +
        label("Pₙ", 245, 38) +
        line(60, 100, 420, 100, { stroke: "#22c55e", width: 1.5 }) +
        label("P₀=1", 430, 100, { fill: "#22c55e", size: 9 }) +
        line(60, 155, 420, 85, { stroke: "#3b82f6", width: 1.5 }) +
        label("P₁=x", 430, 85, { fill: "#3b82f6", size: 9 }) +
        path("M60,150 Q150,50 240,120 Q330,180 420,90", { stroke: "#ef4444" }) +
        label("P₂=(3x²−1)/2", 430, 145, { fill: "#ef4444", size: 9 }),
      "First three Legendre polynomials on [−1, 1]"
    ),

  "Bessel Functions": () =>
    svgWrap(
      title("Bessel Functions Jₙ(x)") +
        line(60, 120, 420, 120, { stroke: "#94a3b8" }) +
        line(60, 40, 60, 200, { stroke: "#94a3b8" }) +
        label("x", 425, 124) +
        label("Jₙ", 50, 38) +
        path("M60,50 Q100,80 140,70 Q200,50 260,130 Q320,160 380,110 Q410,90 420,100", { stroke: "#3b82f6" }) +
        label("J₀", 430, 100, { fill: "#3b82f6", size: 9 }) +
        path("M60,150 Q120,100 180,130 Q240,150 300,120 Q360,90 420,110", { stroke: "#ef4444" }) +
        label("J₁", 430, 110, { fill: "#ef4444", size: 9 }) +
        label("Jₙ(x) → 0 as x → ∞", 240, 210, { anchor: true, size: 10 }),
      "Bessel functions oscillate with decaying amplitude"
    ),

  "Complex Integration": () =>
    svgWrap(
      title("Residue Theorem · Poles") +
        line(60, 110, 420, 110, { stroke: "#e2e8f0" }) +
        line(240, 30, 240, 190, { stroke: "#e2e8f0" }) +
        circle(180, 90, 3, { fill: "#ef4444", stroke: "#ef4444" }) +
        label("z₁", 190, 88, { fill: "#ef4444", size: 9 }) +
        circle(300, 130, 3, { fill: "#f59e0b", stroke: "#f59e0b" }) +
        label("z₂", 310, 128, { fill: "#f59e0b", size: 9 }) +
        `<path d="M120,110 Q120,50 240,50 Q370,50 370,110 Q370,180 240,180 Q120,180 120,110" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="5"/>` +
        label("∮ f(z)dz = 2πi Σ Res", 240, 210, { anchor: true, size: 11 }),
      "Closed contour enclosing two poles"
    ),

  "Orthogonal Functions": () =>
    svgWrap(
      title("Orthogonality · Function Space") +
        label("⟨φₘ|φₙ⟩ = δₘₙ", 240, 60, { anchor: true, size: 13, fill: "#4f46e5", bold: true }) +
        line(60, 100, 420, 100, { stroke: "#e2e8f0" }) +
        path("M80,140 Q140,60 200,140 Q260,180 320,100 Q380,50 420,120", { stroke: "#3b82f6" }) +
        label("φ₁(x)", 430, 120, { fill: "#3b82f6", size: 9 }) +
        path("M80,160 Q140,80 200,160 Q260,190 320,120 Q380,70 420,140", { stroke: "#ef4444", dash: "4" }) +
        label("φ₂(x)", 430, 140, { fill: "#ef4444", size: 9 }),
      "Orthogonal basis functions in Hilbert space"
    ),

  "Boundary Value Problems": () =>
    svgWrap(
      title("Boundary Value Problem") +
        rect(80, 50, 320, 120, { fill: "#f0f9ff", stroke: "#3b82f6" }) +
        label("∇²u = f(x)", 240, 80, { anchor: true, size: 12, fill: "#3b82f6" }) +
        label("u(0) = α, u(L) = β", 240, 110, { anchor: true, size: 11 }) +
        line(80, 175, 400, 175, { stroke: "#64748b", width: 2 }) +
        label("0", 80, 190, { anchor: true }) +
        label("L", 400, 190, { anchor: true }),
      "Boundary conditions on a 1D domain"
    ),

  "Hilbert Spaces": () =>
    svgWrap(
      title("Hilbert Space · Orthonormal Basis") +
        label("|ψ⟩ = Σₙ cₙ|n⟩", 240, 60, { anchor: true, size: 12, fill: "#4f46e5", bold: true }) +
        line(60, 100, 420, 100, { stroke: "#e2e8f0" }) +
        label("|1⟩", 100, 130, { anchor: true, size: 11, fill: "#3b82f6" }) +
        label("|2⟩", 180, 130, { anchor: true, size: 11, fill: "#ef4444" }) +
        label("|3⟩", 260, 130, { anchor: true, size: 11, fill: "#22c55e" }) +
        label("...", 340, 130, { anchor: true, size: 11 }) +
        label("|n⟩", 400, 130, { anchor: true, size: 11, fill: "#f59e0b" }) +
        label("⟨m|n⟩ = δₘₙ", 240, 180, { anchor: true, size: 11 }),
      "Expansion in orthonormal basis of Hilbert space"
    ),

  "Group Theory Basics": () =>
    svgWrap(
      title("Group Axioms · Closure Diagram") +
        circle(150, 110, 50, { fill: "#dbeafe", stroke: "#3b82f6" }) +
        circle(330, 110, 50, { fill: "#dcfce7", stroke: "#22c55e" }) +
        label("G", 150, 114, { anchor: true, size: 14, fill: "#3b82f6", bold: true }) +
        label("G", 330, 114, { anchor: true, size: 14, fill: "#22c55e", bold: true }) +
        label("a", 120, 90, { fill: "#3b82f6" }) +
        label("b", 350, 90, { fill: "#22c55e" }) +
        label("a · b ∈ G", 240, 50, { anchor: true, size: 11, fill: "#f59e0b", bold: true }),
      "Closure property: product of group elements stays in G"
    ),

  "Integral Equations": () =>
    svgWrap(
      title("Fredholm Integral Equation") +
        label("φ(x) = f(x) + λ ∫ K(x,t) φ(t) dt", 240, 70, { anchor: true, size: 12, fill: "#4f46e5" }) +
        line(60, 110, 420, 110, { stroke: "#e2e8f0" }) +
        label("K(x,t) = kernel function", 240, 140, { anchor: true, size: 11 }) +
        label("λ = eigenvalue parameter", 240, 165, { anchor: true, size: 11 }) +
        label("φ(x) = unknown solution", 240, 190, { anchor: true, size: 11 }),
      "Fredholm equation of the second kind"
    ),

  "Asymptotic Expansions": () =>
    svgWrap(
      title("Asymptotic Series · Stirling's Approx") +
        line(60, 180, 60, 40) +
        line(60, 180, 420, 180) +
        label("n", 425, 184) +
        label("n!", 50, 38) +
        path("M80,170 Q150,140 220,100 Q290,60 360,40", { stroke: "#3b82f6" }) +
        label("exact", 370, 38, { fill: "#3b82f6", size: 9 }) +
        path("M80,172 Q150,142 220,102 Q290,62 360,42", { stroke: "#ef4444", dash: "4" }) +
        label("Stirling", 370, 52, { fill: "#ef4444", size: 9 }),
      "Stirling approximation converges to exact factorial"
    ),

  // Electromagnetic Theory
  "Waveguides": () =>
    svgWrap(
      title("Rectangular Waveguide · TE₁₀ Mode") +
        rect(80, 50, 320, 120, { fill: "#f0f9ff", stroke: "#3b82f6" }) +
        path("M80,110 Q160,60 240,110 Q320,160 400,110", { stroke: "#ef4444", width: 2 }) +
        label("a", 240, 185, { anchor: true }) +
        label("E-field (TE₁₀)", 240, 40, { anchor: true, size: 10, fill: "#ef4444" }) +
        label("cutoff: f_c = c/(2a)", 240, 210, { anchor: true, size: 11 }),
      "Dominant TE₁₀ mode in rectangular waveguide"
    ),

  "Antenna Theory": () =>
    svgWrap(
      title("Antenna Radiation Pattern") +
        `<ellipse cx="240" cy="110" rx="150" ry="60" fill="none" stroke="#3b82f6" stroke-width="2"/>` +
        `<ellipse cx="240" cy="110" rx="40" ry="15" fill="none" stroke="#ef4444" stroke-width="1.5"/>` +
        circle(240, 110, 4, { fill: "#f59e0b", stroke: "#f59e0b" }) +
        label("Main lobe", 240, 50, { anchor: true, fill: "#3b82f6" }) +
        label("Back lobe", 240, 145, { anchor: true, fill: "#ef4444", size: 9 }) +
        label("Gain = 4πU_max/P_rad", 240, 210, { anchor: true, size: 10 }),
      "Radiation pattern of a directional antenna"
    ),

  "Maxwell's Equations": () =>
    svgWrap(
      title("Maxwell's Equations · Free Space") +
        label("∇·E = ρ/ε₀", 120, 70, { anchor: true, size: 12, fill: "#3b82f6" }) +
        label("∇·B = 0", 360, 70, { anchor: true, size: 12, fill: "#ef4444" }) +
        label("∇×E = −∂B/∂t", 120, 140, { anchor: true, size: 12, fill: "#22c55e" }) +
        label("∇×B = μ₀ε₀ ∂E/∂t", 360, 140, { anchor: true, size: 12, fill: "#f59e0b" }) +
        line(60, 100, 420, 100, { stroke: "#e2e8f0" }) +
        line(240, 40, 240, 180, { stroke: "#e2e8f0" }),
      "The four Maxwell equations governing EM fields"
    ),

  "Skin Effect": () =>
    svgWrap(
      title("Skin Depth · EM Penetration") +
        rect(240, 40, 200, 140, { fill: "#e2e8f0", stroke: "#64748b" }) +
        label("Conductor", 340, 60, { anchor: true, size: 11 }) +
        path("M40,110 Q100,50 160,110 Q200,150 240,110", { stroke: "#3b82f6", width: 2.5 }) +
        path("M240,110 Q280,80 320,110 Q350,130 370,110", { stroke: "#f59e0b", width: 2 }) +
        path("M370,110 Q390,95 410,110", { stroke: "#f59e0b", width: 1.5 }) +
        label("δ = √(2/(ωμσ))", 120, 180, { anchor: true, size: 11, fill: "#4f46e5" }) +
        label("E(x) = E₀ e^(−x/δ)", 340, 180, { anchor: true, size: 10 }),
      "EM wave decays exponentially in conductor with skin depth δ"
    ),

  // Quantum Mechanics
  "Path Integral Quantization": () =>
    svgWrap(
      title("Feynman Path Integral") +
        label("K(b,a) = ∫ 𝒟[x(t)] e^(iS[x]/ℏ)", 240, 60, { anchor: true, size: 12, fill: "#4f46e5", bold: true }) +
        circle(80, 140, 5, { fill: "#3b82f6", stroke: "#3b82f6" }) +
        label("a", 80, 165, { anchor: true, fill: "#3b82f6" }) +
        circle(400, 140, 5, { fill: "#ef4444", stroke: "#ef4444" }) +
        label("b", 400, 165, { anchor: true, fill: "#ef4444" }) +
        path("M85,140 Q150,80 200,120 Q250,160 300,100 Q350,60 395,140", { stroke: "#22c55e", dash: "4" }) +
        path("M85,140 Q140,170 200,130 Q280,70 340,150 Q380,170 395,140", { stroke: "#f59e0b", dash: "4" }) +
        label("Sum over ALL paths", 240, 210, { anchor: true, size: 10 }),
      "Path integral sums over all trajectories from a to b"
    ),

  "Angular Momentum": () =>
    svgWrap(
      title("Angular Momentum · Quantization") +
        label("L²|l,m⟩ = ℏ²l(l+1)|l,m⟩", 240, 50, { anchor: true, size: 11, fill: "#4f46e5" }) +
        label("Lz|l,m⟩ = mℏ|l,m⟩", 240, 75, { anchor: true, size: 11, fill: "#4f46e5" }) +
        line(60, 110, 420, 110, { stroke: "#e2e8f0" }) +
        label("m = −l, −l+1, ..., l−1, l", 240, 140, { anchor: true, size: 11 }) +
        label("l = 0, 1, 2, ...", 240, 165, { anchor: true, size: 11 }),
      "Quantized angular momentum eigenvalues"
    ),

  // Thermodynamics
  "Black Hole Thermodynamics": () =>
    svgWrap(
      title("Black Hole · Event Horizon") +
        circle(240, 110, 60, { fill: "#1e293b", stroke: "#475569" }) +
        label("Event Horizon", 240, 114, { anchor: true, size: 10, fill: "#f8fafc" }) +
        label("r_s = 2GM/c²", 240, 80, { anchor: true, size: 10, fill: "#f59e0b" }) +
        label("S = kA/(4ℓ²_P)", 240, 195, { anchor: true, size: 11, fill: "#3b82f6" }) +
        label("A = area", 370, 110, { fill: "#64748b" }),
      "Bekenstein-Hawking entropy proportional to horizon area"
    ),

  // Nuclear / Particle Physics
  "Quark-Gluon Plasma": () =>
    svgWrap(
      title("QGP · Deconfinement Phase Transition") +
        rect(60, 50, 160, 120, { fill: "#fef3c7", stroke: "#f59e0b" }) +
        circle(100, 100, 4, { fill: "#3b82f6" }) +
        circle(140, 90, 4, { fill: "#ef4444" }) +
        circle(180, 110, 4, { fill: "#22c55e" }) +
        label("Hadron (confined)", 140, 185, { anchor: true, size: 10, fill: "#f59e0b" }) +
        rect(260, 50, 160, 120, { fill: "#fee2e2", stroke: "#ef4444" }) +
        circle(290, 80, 3, { fill: "#3b82f6" }) +
        circle(310, 100, 3, { fill: "#ef4444" }) +
        circle(340, 75, 3, { fill: "#22c55e" }) +
        circle(370, 110, 3, { fill: "#f59e0b" }) +
        circle(390, 85, 3, { fill: "#3b82f6" }) +
        label("QGP (deconfined)", 340, 185, { anchor: true, size: 10, fill: "#ef4444" }) +
        label("T > T_c ≈ 170 MeV", 240, 210, { anchor: true, size: 10 }),
      "Deconfinement transition from hadronic matter to QGP"
    ),

  "CP Violation": () =>
    svgWrap(
      title("CP Violation · Kaon System") +
        label("|K⁰⟩ and |K̄⁰⟩ mix via box diagram", 240, 50, { anchor: true, size: 11 }) +
        rect(80, 70, 130, 80, { fill: "#dbeafe", stroke: "#3b82f6" }) +
        label("K⁰ (ds̄)", 145, 115, { anchor: true, size: 12, fill: "#3b82f6" }) +
        rect(270, 70, 130, 80, { fill: "#fee2e2", stroke: "#ef4444" }) +
        label("K̄⁰ (d̄s)", 335, 115, { anchor: true, size: 12, fill: "#ef4444" }) +
        line(215, 95, 265, 95, { stroke: "#f59e0b", width: 2 }) +
        line(265, 125, 215, 125, { stroke: "#f59e0b", width: 2 }) +
        label("ε ≈ 2.2×10⁻³ (CP violation parameter)", 240, 195, { anchor: true, size: 10 }),
      "CP violation in neutral kaon mixing"
    ),
};

// ── Main ──
console.log("=== Adding Missing SVGs to Physics Mocks ===\n");

const mockTargets = {
  1: 1, 2: 1, 5: 6, 6: 1, 8: 1, 9: 6, 10: 1, 11: 1, 12: 1, 13: 1, 14: 1, 15: 1,
};

for (const [mockNo, needed] of Object.entries(mockTargets)) {
  const i = parseInt(mockNo);
  const m = loadMock(i);
  const domain = m.data.questions.filter((q) => q.section === "Domain");
  const noFig = domain.filter((q) => !q.figure || q.figure.kind !== "svg");

  let added = 0;
  for (const q of noFig) {
    if (added >= needed) break;

    // Find matching generator
    let gen = null;
    for (const [keyword, generator] of Object.entries(generators)) {
      if (q.topic.includes(keyword)) {
        gen = generator;
        break;
      }
    }

    if (gen) {
      q.figure = gen();
      added++;
    }
  }

  if (added > 0) {
    saveMock(m.path, m.data);
    console.log(`ph-${String(i).padStart(2, "0")}: added ${added} SVGs`);
  } else {
    console.log(`ph-${String(i).padStart(2, "0")}: no matching generators found for remaining topics`);
  }
}

// Validate
console.log("\n=== Validation ===\n");
for (let i = 1; i <= 15; i++) {
  const { data } = loadMock(i);
  const domain = data.questions.filter((q) => q.section === "Domain");
  const withFig = domain.filter((q) => q.figure && q.figure.kind === "svg").length;
  const status = withFig >= 6 && withFig <= 9 ? "✓" : withFig > 9 ? "EXTRA" : "LOW";
  console.log(
    `ph-${String(i).padStart(2, "0")}: ${status} total=${data.questions.length} domainSVGs=${withFig}`
  );
}

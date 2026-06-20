/**
 * GATE Civil (CE) — Topic-Wise Learn & Solve content.
 *
 * Reuses the exact LearnTopic / LearnModule / LearnSyllabus model from the
 * mining Learn engine (`@/data/learn`) so the runner, gating and syllabus
 * dashboard work unchanged. Live sub-topics resolve to an authored LearnTopic;
 * the rest render as a "coming soon" roadmap mirroring the full GATE CE
 * syllabus.
 */
import type {
  LearnTopic,
  LearnReference,
  LearnSyllabusSection,
  LearnSyllabusSubtopic,
} from "@/data/learn";

/* ════════════════════════════════════════════════════════════════════ */
/*  SECTION 1 — Engineering Mathematics                                   */
/* ════════════════════════════════════════════════════════════════════ */

const ceLinearAlgebra: LearnTopic = {
  slug: "ce-em-linear-algebra",
  subject: "Engineering Mathematics",
  title: "Linear Algebra",
  tier: "free",
  blurb:
    "Determinants, rank, systems of equations and eigenvalues — the matrix toolkit GATE CE leans on for structural systems and numerical methods.",
  module: {
    principle:
      "A matrix stores a **linear system** or a **linear transformation**. The **determinant** measures volume scaling — a zero determinant means the matrix is **singular** (non-invertible; the system has no unique solution). **Eigenvalues** $\\lambda$ satisfy $A\\mathbf{x}=\\lambda\\mathbf{x}$: special directions the transformation only stretches. For a 2×2 matrix the eigenvalues **sum to the trace** and **multiply to the determinant**.",
    formulaMatrix: [
      "**Determinant (2×2)**: $\\det\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}=ad-bc$",
      "",
      "**Trace / determinant shortcuts**: $\\lambda_1+\\lambda_2=a+d,\\quad \\lambda_1\\lambda_2=\\det A$",
      "",
      "**Characteristic equation**: $\\det(A-\\lambda I)=0$",
      "",
      "**Rank–consistency**: a system $A\\mathbf{x}=\\mathbf{b}$ is consistent iff $\\text{rank}(A)=\\text{rank}([A|\\mathbf{b}])$; unique solution needs that rank $=$ number of unknowns.",
    ].join("\n"),
    traps: [
      "**Sum vs product of eigenvalues.** $\\lambda_1+\\lambda_2=\\text{trace}$ and $\\lambda_1\\lambda_2=\\det$ — never swap these.",
      "**Singular ⇒ no unique solution.** If $\\det A=0$ the system is either inconsistent or has infinitely many solutions.",
      "**$AB\\neq BA$.** Matrix multiplication is not commutative.",
    ],
  },
  questions: [
    {
      id: "ce-la-q1", difficulty: "basic", marks: 1, type: "MCQ",
      stem: "The determinant of $\\begin{bmatrix}4 & 2\\\\ 1 & 3\\end{bmatrix}$ is:",
      options: ["$10$", "$14$", "$2$", "$-10$"], answer: 0,
      solution: { given: "$a=4,b=2,c=1,d=3$.", derivation: "$$\\det=ad-bc=(4)(3)-(2)(1)=12-2=10$$", target: "Correct option: $10$." },
    },
    {
      id: "ce-la-q2", difficulty: "medium", marks: 1, type: "NAT",
      stem: "A $2\\times2$ matrix has trace $7$ and determinant $12$. Its larger eigenvalue is _____.",
      natAnswer: 4, acceptedRange: [3.99, 4.01],
      solution: { given: "$\\lambda_1+\\lambda_2=7,\\ \\lambda_1\\lambda_2=12$.", derivation: "$$\\lambda^2-7\\lambda+12=0\\Rightarrow(\\lambda-3)(\\lambda-4)=0\\Rightarrow\\lambda=3,4$$", target: "Larger eigenvalue $=4$." },
    },
    {
      id: "ce-la-q3", difficulty: "hard", marks: 2, type: "MCQ",
      stem: "For what value of $k$ does the system $2x+ky=4,\\ 3x+6y=9$ have no unique solution?",
      options: ["$k=4$", "$k=2$", "$k=6$", "$k=3$"], answer: 0,
      solution: { given: "No unique solution ⇒ coefficient determinant $=0$.", derivation: "$$\\det\\begin{bmatrix}2&k\\\\3&6\\end{bmatrix}=12-3k=0\\Rightarrow k=4$$", target: "Correct option: $k=4$." },
    },
  ],
};

const ceProbability: LearnTopic = {
  slug: "ce-em-probability-statistics",
  subject: "Engineering Mathematics",
  title: "Probability & Statistics",
  tier: "free",
  blurb:
    "Mean, variance, distributions and conditional probability — recurring 1- and 2-mark scorers in every GATE CE paper.",
  module: {
    principle:
      "Probability quantifies uncertainty on a $[0,1]$ scale. For **independent** events the joint probability multiplies; for **mutually exclusive** events it adds. The **mean** locates the centre of a distribution and the **variance** its spread. The **normal** distribution is symmetric about its mean; the **Poisson** models rare counts.",
    formulaMatrix: [
      "**Addition**: $P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$",
      "",
      "**Independent**: $P(A\\cap B)=P(A)P(B)$",
      "",
      "**Conditional**: $P(A|B)=\\dfrac{P(A\\cap B)}{P(B)}$",
      "",
      "**Mean / variance (discrete)**: $\\mu=\\sum x_ip_i,\\quad \\sigma^2=\\sum p_i(x_i-\\mu)^2$",
      "",
      "**Binomial**: $P(X=r)=\\binom{n}{r}p^r(1-p)^{n-r}$",
    ].join("\n"),
    traps: [
      "**Independent ≠ mutually exclusive.** Independent events multiply; mutually exclusive events cannot both occur ($P(A\\cap B)=0$).",
      "**Variance units are squared.** Standard deviation $\\sigma=\\sqrt{\\sigma^2}$ shares the data's units.",
      "**With vs without replacement** changes probabilities for the second draw.",
    ],
  },
  questions: [
    {
      id: "ce-pr-q1", difficulty: "basic", marks: 1, type: "NAT",
      stem: "A fair die is rolled once. The probability of getting a number greater than $4$ is _____.",
      natAnswer: 0.3333, acceptedRange: [0.33, 0.34],
      solution: { given: "Favourable: $\\{5,6\\}$; total $=6$.", derivation: "$$P=\\dfrac{2}{6}=0.333$$", target: "$P\\approx0.333$." },
    },
    {
      id: "ce-pr-q2", difficulty: "medium", marks: 2, type: "NAT",
      stem: "Two independent events have $P(A)=0.4$ and $P(B)=0.5$. The probability that at least one occurs is _____.",
      natAnswer: 0.7, acceptedRange: [0.69, 0.71],
      solution: { given: "$P(A)=0.4,P(B)=0.5$, independent.", derivation: "$$P(A\\cup B)=0.4+0.5-(0.4)(0.5)=0.9-0.2=0.7$$", target: "$0.7$." },
    },
    {
      id: "ce-pr-q3", difficulty: "hard", marks: 2, type: "MCQ",
      stem: "A random variable takes values $0,1,2$ with probabilities $0.2,0.5,0.3$. Its mean is:",
      options: ["$1.1$", "$1.0$", "$1.5$", "$0.9$"], answer: 0,
      solution: { given: "$x=0,1,2$; $p=0.2,0.5,0.3$.", derivation: "$$\\mu=0(0.2)+1(0.5)+2(0.3)=0.5+0.6=1.1$$", target: "Correct option: $1.1$." },
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════ */
/*  SECTION 2 — Structural Engineering                                    */
/* ════════════════════════════════════════════════════════════════════ */

const ceEngMechanics: LearnTopic = {
  slug: "ce-se-engineering-mechanics",
  subject: "Structural Engineering",
  title: "Engineering Mechanics",
  tier: "free",
  blurb:
    "Equilibrium, resultants, trusses and friction — the statics foundation for every structural analysis question.",
  module: {
    principle:
      "A body is in **static equilibrium** when the net force and net moment vanish: $\\sum F_x=\\sum F_y=\\sum M=0$. These three planar equations solve any **statically determinate** structure. In a **pin-jointed truss**, members carry only axial force; the method of joints applies $\\sum F_x=\\sum F_y=0$ at each pin.",
    formulaMatrix: [
      "**Equilibrium (planar)**: $\\sum F_x=0,\\ \\sum F_y=0,\\ \\sum M=0$",
      "",
      "**Resultant of two perpendicular forces**: $R=\\sqrt{F_1^2+F_2^2}$",
      "",
      "**Moment**: $M=F\\times d$ (force × perpendicular distance)",
      "",
      "**Limiting friction**: $F=\\mu N$",
      "",
      "**Truss determinacy**: $m+r=2j$ (perfect truss), $m$=members, $r$=reactions, $j$=joints.",
    ].join("\n"),
    traps: [
      "**Perpendicular distance only.** A moment uses the perpendicular distance from the pivot to the line of action — not the slant distance.",
      "**Zero-force members.** Identify them first to simplify truss analysis; they still exist physically (stability).",
      "**Sign convention.** Fix a consistent sense (e.g. CCW moment positive) before summing.",
    ],
  },
  questions: [
    {
      id: "ce-mech-q1", difficulty: "basic", marks: 1, type: "NAT",
      stem: "Two forces $6\\,\\text{kN}$ and $8\\,\\text{kN}$ act at right angles at a point. Their resultant is _____ kN.",
      natAnswer: 10, acceptedRange: [9.99, 10.01],
      solution: { given: "$F_1=6,F_2=8$, perpendicular.", derivation: "$$R=\\sqrt{6^2+8^2}=\\sqrt{100}=10$$", target: "$10\\,\\text{kN}$." },
    },
    {
      id: "ce-mech-q2", difficulty: "medium", marks: 1, type: "NAT",
      stem: "A simply supported beam of span $6\\,\\text{m}$ carries a UDL of $20\\,\\text{kN/m}$. Each support reaction is _____ kN.",
      natAnswer: 60, acceptedRange: [59.9, 60.1],
      solution: { given: "$w=20,L=6$.", derivation: "$$R=\\dfrac{wL}{2}=\\dfrac{20\\times6}{2}=60$$", target: "$60\\,\\text{kN}$." },
    },
    {
      id: "ce-mech-q3", difficulty: "hard", marks: 2, type: "MCQ",
      stem: "A perfect plane truss has $7$ joints. The number of members required is:",
      options: ["$11$", "$14$", "$7$", "$9$"], answer: 0,
      solution: { given: "$j=7$, planar, $r=3$.", derivation: "$$m=2j-r=2(7)-3=11$$", target: "Correct option: $11$ members." },
    },
  ],
};

const ceSimpleStress: LearnTopic = {
  slug: "ce-se-simple-stresses",
  subject: "Structural Engineering",
  title: "Simple Stresses & Strains",
  tier: "free",
  blurb:
    "Axial stress, Hooke's law, elongation and the elastic constants — the bedrock of solid mechanics.",
  module: {
    principle:
      "**Normal stress** is internal force per unit area, $\\sigma=P/A$. Within the elastic limit **Hooke's law** gives $\\sigma=E\\varepsilon$, so an axial member elongates by $\\delta=PL/AE$. The three elastic constants are linked by $E=2G(1+\\nu)=3K(1-2\\nu)$.",
    formulaMatrix: [
      "**Axial stress**: $\\sigma=\\dfrac{P}{A}$",
      "",
      "**Strain & Hooke's law**: $\\varepsilon=\\dfrac{\\delta}{L},\\quad \\sigma=E\\varepsilon$",
      "",
      "**Elongation**: $\\delta=\\dfrac{PL}{AE}$",
      "",
      "**Elastic constants**: $E=2G(1+\\nu)=3K(1-2\\nu)$",
      "",
      "**Factor of safety**: $\\text{FoS}=\\dfrac{\\text{yield (or ultimate) stress}}{\\text{working stress}}$",
    ].join("\n"),
    traps: [
      "**Unit consistency.** With $P$ in N and $A$ in mm², $\\sigma$ is in MPa. Mixing kN and m introduces factors of $10^3$.",
      "**$\\nu$ range.** Poisson's ratio lies between $0$ and $0.5$ for common materials.",
      "**Series vs parallel bars.** In series the load is common and elongations add; in parallel the elongation is common and loads share by stiffness.",
    ],
  },
  questions: [
    {
      id: "ce-ss-q1", difficulty: "basic", marks: 1, type: "NAT",
      stem: "A bar of area $500\\,\\text{mm}^2$ carries an axial tensile load of $100\\,\\text{kN}$. The normal stress is _____ MPa.",
      natAnswer: 200, acceptedRange: [199.5, 200.5],
      solution: { given: "$P=100\\,\\text{kN},A=500\\,\\text{mm}^2$.", derivation: "$$\\sigma=\\dfrac{100\\times10^3}{500}=200\\,\\text{MPa}$$", target: "$200\\,\\text{MPa}$." },
    },
    {
      id: "ce-ss-q2", difficulty: "medium", marks: 2, type: "NAT",
      stem: "A steel bar ($E=200\\,\\text{GPa}$), area $400\\,\\text{mm}^2$, length $2000\\,\\text{mm}$, carries $80\\,\\text{kN}$. Its elongation is _____ mm.",
      natAnswer: 2.0, acceptedRange: [1.98, 2.02],
      solution: { given: "$P=80\\,\\text{kN},A=400,L=2000,E=2\\times10^5$.", derivation: "$$\\delta=\\dfrac{PL}{AE}=\\dfrac{80\\times10^3\\times2000}{400\\times2\\times10^5}=2.0$$", target: "$2.0\\,\\text{mm}$." },
    },
    {
      id: "ce-ss-q3", difficulty: "hard", marks: 2, type: "MCQ",
      stem: "For a material with $E=200\\,\\text{GPa}$ and $G=80\\,\\text{GPa}$, Poisson's ratio is:",
      options: ["$0.25$", "$0.30$", "$0.20$", "$0.33$"], answer: 0,
      solution: { given: "$E=2G(1+\\nu)$.", derivation: "$$200=2(80)(1+\\nu)\\Rightarrow1+\\nu=1.25\\Rightarrow\\nu=0.25$$", target: "Correct option: $0.25$." },
    },
  ],
};

const ceStructuralAnalysis: LearnTopic = {
  slug: "ce-se-structural-analysis",
  subject: "Structural Engineering",
  title: "Determinacy & Beam Forces",
  tier: "subject",
  blurb:
    "Static & kinematic indeterminacy, SF/BM diagrams and standard beam results — the analysis core of GATE CE.",
  module: {
    principle:
      "A structure is **statically determinate** when equilibrium alone fixes all reactions and internal forces. The **degree of static indeterminacy** counts the redundant restraints. **Shear force** is the algebraic sum of transverse forces on one side of a section; **bending moment** is the algebraic sum of their moments. BM is maximum where SF crosses zero.",
    formulaMatrix: [
      "**Static indeterminacy (beam/frame)**: $D_s=(3m+r)-3n-r_r$ (general); simple beam $\\Rightarrow D_s=0$.",
      "",
      "**SSB, central point load $W$**: $M_{max}=\\dfrac{WL}{4}$ at midspan.",
      "",
      "**SSB, full UDL $w$**: $M_{max}=\\dfrac{wL^2}{8}$, reactions $\\dfrac{wL}{2}$.",
      "",
      "**Fixed beam, central load**: end moment $=\\dfrac{WL}{8}$.",
      "",
      "**Fixed beam, UDL**: support moment $=\\dfrac{wL^2}{12}$, midspan $=\\dfrac{wL^2}{24}$.",
    ].join("\n"),
    traps: [
      "**BM at a free end / simple support is zero** (no applied moment there).",
      "**Maximum BM at zero shear.** Locate the point where SF changes sign.",
      "**Fixed-end vs simply-supported moments differ.** UDL gives $wL^2/8$ (SS) but $wL^2/12$ (fixed support).",
    ],
  },
  questions: [
    {
      id: "ce-sa-q1", difficulty: "basic", marks: 1, type: "NAT",
      stem: "A simply supported beam of span $4\\,\\text{m}$ carries a central point load of $60\\,\\text{kN}$. The maximum bending moment is _____ kN·m.",
      natAnswer: 60, acceptedRange: [59.5, 60.5],
      solution: { given: "$W=60,L=4$.", derivation: "$$M_{max}=\\dfrac{WL}{4}=\\dfrac{60\\times4}{4}=60$$", target: "$60\\,\\text{kN·m}$." },
    },
    {
      id: "ce-sa-q2", difficulty: "medium", marks: 2, type: "NAT",
      stem: "A fixed beam of span $6\\,\\text{m}$ carries a UDL of $18\\,\\text{kN/m}$. The magnitude of the support moment is _____ kN·m.",
      natAnswer: 54, acceptedRange: [53.5, 54.5],
      solution: { given: "$w=18,L=6$.", derivation: "$$M=\\dfrac{wL^2}{12}=\\dfrac{18\\times36}{12}=54$$", target: "$54\\,\\text{kN·m}$." },
    },
    {
      id: "ce-sa-q3", difficulty: "hard", marks: 2, type: "MCQ",
      stem: "A single-bay single-storey portal frame with both column bases fixed is statically indeterminate to degree:",
      options: ["$3$", "$1$", "$2$", "$6$"], answer: 0,
      solution: { given: "Closed single-storey portal, fixed bases.", derivation: "Three redundant restraints remain after equilibrium ⇒ $D_s=3$.", target: "Correct option: $3$." },
    },
  ],
};

const ceRcc: LearnTopic = {
  slug: "ce-se-rcc-limit-state",
  subject: "Structural Engineering",
  title: "RCC — Limit State Design",
  tier: "subject",
  blurb:
    "IS 456 limit-state design of singly-reinforced sections: stress block, neutral axis and moment capacity.",
  module: {
    principle:
      "In **limit state of collapse (flexure)**, concrete carries compression through a rectangular stress block of intensity $0.36f_{ck}$ over depth $x_u$, and steel yields in tension at $0.87f_y$. Force equilibrium fixes $x_u$; the lever arm gives the moment of resistance. A **balanced** section reaches both limits together at $x_{u,max}$.",
    formulaMatrix: [
      "**Tensile force**: $T=0.87f_yA_{st}$",
      "",
      "**Compressive force**: $C=0.36f_{ck}b\\,x_u$",
      "",
      "**Depth of NA**: $x_u=\\dfrac{0.87f_yA_{st}}{0.36f_{ck}b}$",
      "",
      "**Limiting $x_u/d$**: Fe250 → $0.53$, Fe415 → $0.48$, Fe500 → $0.46$.",
      "",
      "**Moment of resistance**: $M_u=0.87f_yA_{st}\\,(d-0.42x_u)$",
    ].join("\n"),
    traps: [
      "**Stress-block factors.** $0.36f_{ck}$ for the force and $0.42x_u$ for the centroid depth — memorise both.",
      "**Over- vs under-reinforced.** If $x_u>x_{u,max}$ the section is over-reinforced (brittle); IS 456 disallows it for design.",
      "**Use $0.87f_y$, not $f_y$** for the design strength of steel.",
    ],
  },
  questions: [
    {
      id: "ce-rcc-q1", difficulty: "basic", marks: 1, type: "MCQ",
      stem: "As per IS 456, the limiting neutral-axis depth ratio $x_{u,max}/d$ for Fe415 steel is:",
      options: ["$0.48$", "$0.53$", "$0.46$", "$0.36$"], answer: 0,
      solution: { given: "Fe415 grade.", derivation: "IS 456 limiting values: Fe250→0.53, Fe415→0.48, Fe500→0.46.", target: "Correct option: $0.48$." },
    },
    {
      id: "ce-rcc-q2", difficulty: "medium", marks: 2, type: "NAT",
      stem: "A singly-reinforced beam has $b=300\\,\\text{mm}$, $A_{st}=1000\\,\\text{mm}^2$, Fe415, M20. The depth of the stress block $x_u$ is _____ mm.",
      natAnswer: 167.1, acceptedRange: [165, 169],
      solution: { given: "$f_y=415,A_{st}=1000,f_{ck}=20,b=300$.", derivation: "$$x_u=\\dfrac{0.87(415)(1000)}{0.36(20)(300)}=\\dfrac{361050}{2160}=167.1$$", target: "$\\approx167\\,\\text{mm}$." },
    },
    {
      id: "ce-rcc-q3", difficulty: "hard", marks: 2, type: "NAT",
      stem: "For $A_{st}=1200\\,\\text{mm}^2$ of Fe500 steel, the design tensile force $0.87f_yA_{st}$ is _____ kN.",
      natAnswer: 522, acceptedRange: [520, 524],
      solution: { given: "$f_y=500,A_{st}=1200$.", derivation: "$$T=0.87(500)(1200)/1000=522$$", target: "$522\\,\\text{kN}$." },
    },
  ],
};

const ceSteel: LearnTopic = {
  slug: "ce-se-steel-members",
  subject: "Structural Engineering",
  title: "Steel — Tension & Compression Members",
  tier: "subject",
  blurb:
    "IS 800 limit-state design: gross-section yielding, slenderness and the fundamentals of member capacity.",
  module: {
    principle:
      "A **tension member** can fail by gross-section yielding, net-section rupture or block shear; the design strength is the least of these. A **compression member**'s capacity falls as its **slenderness ratio** $\\lambda=L_e/r_{min}$ rises (Euler buckling). Effective length depends on end conditions.",
    formulaMatrix: [
      "**Gross-section yielding**: $T_{dg}=\\dfrac{A_gf_y}{\\gamma_{m0}}$, $\\gamma_{m0}=1.10$.",
      "",
      "**Slenderness ratio**: $\\lambda=\\dfrac{L_e}{r_{min}}$",
      "",
      "**Euler critical load**: $P_{cr}=\\dfrac{\\pi^2EI}{L_e^2}$",
      "",
      "**Effective length factors**: both fixed → $0.65L$, both pinned → $1.0L$, fixed-free → $2.0L$.",
      "",
      "**Fillet weld throat**: $t=0.707s$.",
    ].join("\n"),
    traps: [
      "**Least of three limit states.** Tension design uses the minimum of yielding, rupture and block shear.",
      "**$r_{min}$, not $r_{max}$.** Buckling occurs about the weakest axis.",
      "**Effective length ≠ actual length.** Apply the end-condition factor.",
    ],
  },
  questions: [
    {
      id: "ce-st-q1", difficulty: "basic", marks: 1, type: "NAT",
      stem: "A column has effective length $4000\\,\\text{mm}$ and minimum radius of gyration $40\\,\\text{mm}$. Its slenderness ratio is _____.",
      natAnswer: 100, acceptedRange: [99.5, 100.5],
      solution: { given: "$L_e=4000,r_{min}=40$.", derivation: "$$\\lambda=\\dfrac{4000}{40}=100$$", target: "$100$." },
    },
    {
      id: "ce-st-q2", difficulty: "medium", marks: 2, type: "NAT",
      stem: "A tension member of gross area $1500\\,\\text{mm}^2$ (Fe250, $\\gamma_{m0}=1.1$) has gross-yielding strength _____ kN.",
      natAnswer: 340.9, acceptedRange: [339, 343],
      solution: { given: "$A_g=1500,f_y=250$.", derivation: "$$T_{dg}=\\dfrac{1500\\times250}{1.1\\times1000}=340.9$$", target: "$\\approx341\\,\\text{kN}$." },
    },
    {
      id: "ce-st-q3", difficulty: "hard", marks: 1, type: "MCQ",
      stem: "For a column with both ends fixed (no sway), the theoretical effective length factor is:",
      options: ["$0.5$", "$1.0$", "$2.0$", "$0.7$"], answer: 0,
      solution: { given: "Both ends fixed.", derivation: "Theoretical $L_e=0.5L$ (IS 800 design value $0.65L$).", target: "Correct option: $0.5$." },
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════ */
/*  SECTION 3 — Geotechnical Engineering                                  */
/* ════════════════════════════════════════════════════════════════════ */

const ceSoilPhase: LearnTopic = {
  slug: "ce-ge-soil-phase-relations",
  subject: "Geotechnical Engineering",
  title: "Soil Phase Relations & Index Properties",
  tier: "free",
  blurb:
    "Void ratio, porosity, water content, unit weights and Atterberg limits — the descriptive vocabulary of soil.",
  module: {
    principle:
      "Soil is a **three-phase** system (solids, water, air). The **void ratio** $e$ (voids ÷ solids) and **porosity** $n$ (voids ÷ total) describe packing; the basic identity is $Se=wG_s$. **Atterberg limits** mark the water contents separating the solid, plastic and liquid states of fine soils.",
    formulaMatrix: [
      "**Void ratio / porosity**: $e=\\dfrac{n}{1-n},\\quad n=\\dfrac{e}{1+e}$",
      "",
      "**Basic relation**: $Se=wG_s$",
      "",
      "**Dry unit weight**: $\\gamma_d=\\dfrac{\\gamma}{1+w}=\\dfrac{G_s\\gamma_w}{1+e}$",
      "",
      "**Plasticity index**: $PI=LL-PL$",
    ].join("\n"),
    traps: [
      "**$e$ vs $n$.** Void ratio is voids/solids (can exceed 1); porosity is voids/total (always $<1$).",
      "**Water content can exceed 100%** for soft clays — it is mass of water per mass of solids.",
      "**Bulk vs dry unit weight.** Divide by $(1+w)$ to convert bulk to dry.",
    ],
  },
  questions: [
    {
      id: "ce-soil-q1", difficulty: "basic", marks: 1, type: "NAT",
      stem: "A soil has porosity $40\\%$. Its void ratio is _____.",
      natAnswer: 0.667, acceptedRange: [0.66, 0.67],
      solution: { given: "$n=0.40$.", derivation: "$$e=\\dfrac{n}{1-n}=\\dfrac{0.40}{0.60}=0.667$$", target: "$\\approx0.667$." },
    },
    {
      id: "ce-soil-q2", difficulty: "medium", marks: 2, type: "NAT",
      stem: "A soil has bulk unit weight $20\\,\\text{kN/m}^3$ and water content $25\\%$. Its dry unit weight is _____ kN/m³.",
      natAnswer: 16, acceptedRange: [15.9, 16.1],
      solution: { given: "$\\gamma=20,w=0.25$.", derivation: "$$\\gamma_d=\\dfrac{20}{1+0.25}=16$$", target: "$16\\,\\text{kN/m}^3$." },
    },
    {
      id: "ce-soil-q3", difficulty: "hard", marks: 2, type: "NAT",
      stem: "A soil has $w=20\\%$, $G_s=2.70$ and void ratio $0.6$. Its degree of saturation is _____ %.",
      natAnswer: 90, acceptedRange: [89, 91],
      solution: { given: "$Se=wG_s$.", derivation: "$$S=\\dfrac{wG_s}{e}=\\dfrac{0.20\\times2.70}{0.6}=0.90=90\\%$$", target: "$90\\%$." },
    },
  ],
};

const ceBearingCapacity: LearnTopic = {
  slug: "ce-ge-bearing-capacity",
  subject: "Geotechnical Engineering",
  title: "Shear Strength & Bearing Capacity",
  tier: "subject",
  blurb:
    "Mohr–Coulomb strength, Rankine earth pressure and Terzaghi bearing capacity — the design heart of foundations.",
  module: {
    principle:
      "Soil shear strength follows **Mohr–Coulomb**: $\\tau_f=c+\\sigma'\\tan\\phi$. A footing fails when the applied pressure reaches the **ultimate bearing capacity**; Terzaghi superposes cohesion, surcharge and self-weight terms. Lateral earth pressure on retaining walls uses Rankine's coefficients.",
    formulaMatrix: [
      "**Mohr–Coulomb**: $\\tau_f=c+\\sigma'\\tan\\phi$",
      "",
      "**Rankine active / passive**: $K_a=\\dfrac{1-\\sin\\phi}{1+\\sin\\phi},\\quad K_p=\\dfrac1{K_a}$",
      "",
      "**Terzaghi (strip)**: $q_u=cN_c+\\gamma D_fN_q+0.5\\gamma BN_\\gamma$",
      "",
      "**Clay, $\\phi=0$**: $N_c=5.7,N_q=1,N_\\gamma=0$.",
      "",
      "**Net safe bearing capacity**: $q_{safe}=\\dfrac{q_u}{\\text{FoS}}$ (FoS usually $3$).",
    ].join("\n"),
    traps: [
      "**Effective stress controls strength.** Use $\\sigma'$ (not total $\\sigma$) in Mohr–Coulomb.",
      "**$K_p=1/K_a$** only for a smooth vertical wall with horizontal backfill.",
      "**Net vs gross capacity.** Subtract the surcharge $\\gamma D_f$ for net values.",
    ],
  },
  questions: [
    {
      id: "ce-bc-q1", difficulty: "basic", marks: 1, type: "NAT",
      stem: "For a cohesionless backfill with $\\phi=30^\\circ$, the Rankine active earth pressure coefficient $K_a$ is _____.",
      natAnswer: 0.333, acceptedRange: [0.33, 0.34],
      solution: { given: "$\\phi=30^\\circ$, $\\sin30^\\circ=0.5$.", derivation: "$$K_a=\\dfrac{1-0.5}{1+0.5}=\\dfrac{0.5}{1.5}=0.333$$", target: "$\\approx0.333$." },
    },
    {
      id: "ce-bc-q2", difficulty: "medium", marks: 2, type: "NAT",
      stem: "A strip footing at $1\\,\\text{m}$ depth rests on clay ($c=30\\,\\text{kPa}$, $\\phi=0$, $\\gamma=18\\,\\text{kN/m}^3$). Using Terzaghi ($N_c=5.7,N_q=1,N_\\gamma=0$), $q_u$ is _____ kPa.",
      natAnswer: 189, acceptedRange: [188, 190],
      solution: { given: "$c=30,\\gamma=18,D_f=1$.", derivation: "$$q_u=30(5.7)+18(1)(1)=171+18=189$$", target: "$189\\,\\text{kPa}$." },
    },
    {
      id: "ce-bc-q3", difficulty: "hard", marks: 1, type: "NAT",
      stem: "The ultimate bearing capacity is $450\\,\\text{kPa}$. With a factor of safety of $3$, the safe bearing capacity is _____ kPa.",
      natAnswer: 150, acceptedRange: [149, 151],
      solution: { given: "$q_u=450$, FoS $=3$.", derivation: "$$q_{safe}=\\dfrac{450}{3}=150$$", target: "$150\\,\\text{kPa}$." },
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════ */
/*  SECTION 4 — Water Resources Engineering                               */
/* ════════════════════════════════════════════════════════════════════ */

const ceFluidMechanics: LearnTopic = {
  slug: "ce-wr-fluid-mechanics",
  subject: "Water Resources Engineering",
  title: "Fluid Mechanics & Flow",
  tier: "free",
  blurb:
    "Continuity, Bernoulli, hydrostatics and Manning's open-channel flow — the hydraulics fundamentals.",
  module: {
    principle:
      "**Continuity** conserves mass: $Q=Av$ is constant along a streamtube. **Bernoulli** conserves energy along a streamline. **Hydrostatic pressure** rises linearly with depth, $p=\\gamma_w h$. In open channels, **Manning's equation** relates velocity to slope and hydraulic radius.",
    formulaMatrix: [
      "**Continuity**: $Q=A_1v_1=A_2v_2$",
      "",
      "**Bernoulli**: $\\dfrac{p}{\\gamma}+\\dfrac{v^2}{2g}+z=\\text{const}$",
      "",
      "**Hydrostatic pressure**: $p=\\gamma_wh$",
      "",
      "**Manning**: $v=\\dfrac1n R^{2/3}S^{1/2}$",
      "",
      "**Reynolds number**: $Re=\\dfrac{vD}{\\nu}$ ($<2000$ laminar, $>4000$ turbulent).",
    ].join("\n"),
    traps: [
      "**Bernoulli = energy conservation**, not momentum. It needs steady, incompressible, inviscid flow along a streamline.",
      "**Hydraulic radius $R=A/P$**, not the geometric radius.",
      "**Gauge vs absolute pressure.** $p=\\gamma_wh$ gives gauge pressure.",
    ],
  },
  questions: [
    {
      id: "ce-fm-q1", difficulty: "basic", marks: 1, type: "NAT",
      stem: "Water flows through a pipe of area $0.5\\,\\text{m}^2$ at $2\\,\\text{m/s}$. The discharge is _____ m³/s.",
      natAnswer: 1.0, acceptedRange: [0.99, 1.01],
      solution: { given: "$A=0.5,v=2$.", derivation: "$$Q=Av=0.5\\times2=1.0$$", target: "$1.0\\,\\text{m}^3/\\text{s}$." },
    },
    {
      id: "ce-fm-q2", difficulty: "medium", marks: 1, type: "NAT",
      stem: "The gauge pressure at $5\\,\\text{m}$ depth below a free water surface ($\\gamma_w=9.81\\,\\text{kN/m}^3$) is _____ kPa.",
      natAnswer: 49.05, acceptedRange: [48.9, 49.2],
      solution: { given: "$h=5,\\gamma_w=9.81$.", derivation: "$$p=9.81\\times5=49.05$$", target: "$49.05\\,\\text{kPa}$." },
    },
    {
      id: "ce-fm-q3", difficulty: "hard", marks: 2, type: "NAT",
      stem: "Using Manning's equation with $n=0.013$, $R=0.5\\,\\text{m}$ and $S=0.001$, the mean velocity is _____ m/s.",
      natAnswer: 1.53, acceptedRange: [1.5, 1.56],
      solution: { given: "$n=0.013,R=0.5,S=0.001$.", derivation: "$$v=\\dfrac1{0.013}(0.5)^{2/3}(0.001)^{1/2}=76.9\\times0.63\\times0.0316=1.53$$", target: "$\\approx1.53\\,\\text{m/s}$." },
    },
  ],
};

const ceHydrology: LearnTopic = {
  slug: "ce-wr-hydrology-irrigation",
  subject: "Water Resources Engineering",
  title: "Hydrology & Irrigation",
  tier: "subject",
  blurb:
    "Rational-method runoff, the unit hydrograph concept and the duty–delta relationship of irrigation.",
  module: {
    principle:
      "The **rational method** estimates peak runoff from rainfall intensity, catchment area and a runoff coefficient. A **unit hydrograph** is the direct-runoff response to $1\\,\\text{cm}$ of effective rain in unit time. In irrigation, **duty**, **delta** and **base period** are linked by a single relation.",
    formulaMatrix: [
      "**Rational method**: $Q=\\dfrac{CIA}{360}$ ($A$ in ha, $I$ in mm/hr, $Q$ in m³/s).",
      "",
      "**Duty–delta**: $\\Delta=\\dfrac{8.64\\,B}{D}$ (m), $B$=base period (days), $D$=duty (ha/cumec).",
      "",
      "**Runoff depth**: runoff $=$ rainfall $-$ losses.",
    ].join("\n"),
    traps: [
      "**Unit care in the rational method.** The $360$ factor pairs hectares, mm/hr and m³/s.",
      "**Delta is a depth (m)**, duty is an area per unit discharge — keep them distinct.",
      "**Effective rainfall ≠ total rainfall** for a unit hydrograph; subtract abstractions.",
    ],
  },
  questions: [
    {
      id: "ce-hy-q1", difficulty: "basic", marks: 1, type: "NAT",
      stem: "A storm produces $80\\,\\text{mm}$ of rainfall with abstractions of $30\\,\\text{mm}$. The direct runoff depth is _____ mm.",
      natAnswer: 50, acceptedRange: [49.5, 50.5],
      solution: { given: "Rainfall $80$, losses $30$.", derivation: "$$\\text{runoff}=80-30=50$$", target: "$50\\,\\text{mm}$." },
    },
    {
      id: "ce-hy-q2", difficulty: "medium", marks: 2, type: "NAT",
      stem: "For a catchment of $20\\,\\text{ha}$, $C=0.6$ and intensity $50\\,\\text{mm/hr}$, the peak runoff (rational method) is _____ m³/s.",
      natAnswer: 1.667, acceptedRange: [1.64, 1.69],
      solution: { given: "$C=0.6,I=50,A=20$.", derivation: "$$Q=\\dfrac{0.6\\times50\\times20}{360}=\\dfrac{600}{360}=1.667$$", target: "$\\approx1.667\\,\\text{m}^3/\\text{s}$." },
    },
    {
      id: "ce-hy-q3", difficulty: "hard", marks: 2, type: "NAT",
      stem: "For a base period of $120\\,\\text{days}$ and a duty of $800\\,\\text{ha/cumec}$, the delta is _____ m.",
      natAnswer: 1.296, acceptedRange: [1.28, 1.31],
      solution: { given: "$B=120,D=800$.", derivation: "$$\\Delta=\\dfrac{8.64\\times120}{800}=\\dfrac{1036.8}{800}=1.296$$", target: "$\\approx1.296\\,\\text{m}$." },
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════ */
/*  SECTION 5 — Environmental Engineering                                 */
/* ════════════════════════════════════════════════════════════════════ */

const ceEnvironmental: LearnTopic = {
  slug: "ce-en-water-wastewater",
  subject: "Environmental Engineering",
  title: "Water Demand, Treatment & BOD",
  tier: "subject",
  blurb:
    "Per-capita demand, sedimentation, disinfection and the first-order BOD equation — the public-health core.",
  module: {
    principle:
      "Town water demand scales with population and per-capita rate. In a **sedimentation tank**, a particle is removed if its settling velocity exceeds the **surface overflow rate**. **BOD** measures biodegradable organic load and decays first-order with time. **Chlorine demand** is the dose consumed before a residual remains.",
    formulaMatrix: [
      "**Average demand**: $Q=\\dfrac{\\text{population}\\times\\text{lpcd}}{10^6}\\ \\text{MLD}$",
      "",
      "**BOD exerted**: $y_t=L_0(1-10^{-kt})$ (base-10 rate $k$).",
      "",
      "**Chlorine demand**: applied $-$ residual.",
      "",
      "**Surface overflow rate**: $v_0=\\dfrac{Q}{A_{\\text{plan}}}$; removal if $v_s\\ge v_0$.",
    ].join("\n"),
    traps: [
      "**Base-10 vs base-e BOD.** $k$ values differ by a factor of $2.303$; match the equation form.",
      "**Overflow rate depends on plan area only**, not tank depth.",
      "**Hardness is reported as CaCO₃ equivalent.**",
    ],
  },
  questions: [
    {
      id: "ce-env-q1", difficulty: "basic", marks: 1, type: "NAT",
      stem: "A town of population $100{,}000$ has a per-capita demand of $135\\,\\text{lpcd}$. The average daily demand is _____ MLD.",
      natAnswer: 13.5, acceptedRange: [13.4, 13.6],
      solution: { given: "pop $=10^5$, lpcd $=135$.", derivation: "$$Q=\\dfrac{10^5\\times135}{10^6}=13.5$$", target: "$13.5\\,\\text{MLD}$." },
    },
    {
      id: "ce-env-q2", difficulty: "medium", marks: 1, type: "NAT",
      stem: "If $5\\,\\text{mg/L}$ of chlorine is applied and the residual is $0.5\\,\\text{mg/L}$, the chlorine demand is _____ mg/L.",
      natAnswer: 4.5, acceptedRange: [4.45, 4.55],
      solution: { given: "applied $5$, residual $0.5$.", derivation: "$$\\text{demand}=5-0.5=4.5$$", target: "$4.5\\,\\text{mg/L}$." },
    },
    {
      id: "ce-env-q3", difficulty: "hard", marks: 2, type: "NAT",
      stem: "The ultimate BOD of a waste is $300\\,\\text{mg/L}$ with $k=0.1\\,\\text{day}^{-1}$ (base 10). The BOD exerted in $5$ days is _____ mg/L.",
      natAnswer: 205.1, acceptedRange: [202, 208],
      solution: { given: "$L_0=300,k=0.1,t=5$.", derivation: "$$y_5=300(1-10^{-0.5})=300(1-0.3162)=300(0.6838)=205.1$$", target: "$\\approx205\\,\\text{mg/L}$." },
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════ */
/*  SECTION 6 — Transportation Engineering                                */
/* ════════════════════════════════════════════════════════════════════ */

const ceTransportation: LearnTopic = {
  slug: "ce-tr-geometric-design",
  subject: "Transportation Engineering",
  title: "Highway Geometric Design",
  tier: "subject",
  blurb:
    "Sight distance, superelevation and the fundamental traffic-flow relation — the geometry of safe roads.",
  module: {
    principle:
      "**Stopping sight distance** is the lag (reaction) distance plus the braking distance. On a horizontal curve, **superelevation** plus side friction counter the centrifugal force; the no-friction value balances it fully. The **fundamental traffic relation** links flow, density and speed.",
    formulaMatrix: [
      "**Lag distance**: $d=0.278Vt$ ($V$ in km/h, $t$ in s).",
      "",
      "**Braking distance**: $d_b=\\dfrac{V^2}{254f}$.",
      "",
      "**Superelevation (no friction)**: $e=\\dfrac{V^2}{127R}$.",
      "",
      "**Traffic flow**: $q=k\\,v$ (flow = density × speed).",
    ].join("\n"),
    traps: [
      "**Speed-unit factors.** The $0.278$ and $127$ constants embed the km/h → m/s conversion.",
      "**SSD = lag + braking**, both terms; on gradients add $\\pm g$ to friction.",
      "**Superelevation is dimensionless** (a slope, e.g. $0.07$).",
    ],
  },
  questions: [
    {
      id: "ce-tr-q1", difficulty: "basic", marks: 1, type: "NAT",
      stem: "A traffic stream has density $40\\,\\text{veh/km}$ and space-mean speed $60\\,\\text{km/h}$. The flow is _____ veh/h.",
      natAnswer: 2400, acceptedRange: [2399, 2401],
      solution: { given: "$k=40,v=60$.", derivation: "$$q=kv=40\\times60=2400$$", target: "$2400\\,\\text{veh/h}$." },
    },
    {
      id: "ce-tr-q2", difficulty: "medium", marks: 2, type: "NAT",
      stem: "For a design speed of $60\\,\\text{km/h}$ and reaction time $2.5\\,\\text{s}$, the lag distance is _____ m.",
      natAnswer: 41.7, acceptedRange: [41.5, 41.9],
      solution: { given: "$V=60,t=2.5$.", derivation: "$$d=0.278\\times60\\times2.5=41.7$$", target: "$\\approx41.7\\,\\text{m}$." },
    },
    {
      id: "ce-tr-q3", difficulty: "hard", marks: 2, type: "NAT",
      stem: "For a design speed of $80\\,\\text{km/h}$ on a curve of radius $200\\,\\text{m}$, the superelevation to fully counteract centrifugal force (no friction) is _____.",
      natAnswer: 0.252, acceptedRange: [0.24, 0.26],
      solution: { given: "$V=80,R=200$.", derivation: "$$e=\\dfrac{80^2}{127\\times200}=\\dfrac{6400}{25400}=0.252$$", target: "$\\approx0.252$." },
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════ */
/*  SECTION 7 — Geomatics Engineering                                     */
/* ════════════════════════════════════════════════════════════════════ */

const ceSurveying: LearnTopic = {
  slug: "ce-gm-levelling-tacheometry",
  subject: "Geomatics Engineering",
  title: "Levelling & Tacheometry",
  tier: "free",
  blurb:
    "Height-of-instrument levelling, stadia tacheometry and curve geometry — the measurement backbone of surveying.",
  module: {
    principle:
      "In **levelling**, the height of instrument equals the known RL plus a backsight; any point's RL is HI minus its foresight. **Tacheometry** finds horizontal distance from a staff intercept via the multiplying constant. A **circular curve**'s length follows from its radius and central angle.",
    formulaMatrix: [
      "**Height of instrument**: $\\text{HI}=\\text{RL}_{BM}+\\text{BS}$",
      "",
      "**Reduced level**: $\\text{RL}=\\text{HI}-\\text{FS}$",
      "",
      "**Tacheometry (horizontal sight)**: $D=KS+C$ ($K=100,C=0$ typical).",
      "",
      "**Curve length**: $L=\\dfrac{\\pi R\\Delta}{180}$ ($\\Delta$ in degrees).",
    ].join("\n"),
    traps: [
      "**Backsight adds, foresight subtracts.** HI rises by BS; RL of a point falls by FS.",
      "**Tacheometry constant.** $K=100$ multiplies the staff intercept; the additive $C$ is usually zero.",
      "**Radians vs degrees.** Convert $\\Delta$ when using $L=R\\Delta$.",
    ],
  },
  questions: [
    {
      id: "ce-sv-q1", difficulty: "basic", marks: 1, type: "NAT",
      stem: "The RL of a benchmark is $100.000\\,\\text{m}$ and the backsight on it is $1.250\\,\\text{m}$. The height of instrument is _____ m.",
      natAnswer: 101.25, acceptedRange: [101.24, 101.26],
      solution: { given: "$\\text{RL}=100.000,\\text{BS}=1.250$.", derivation: "$$\\text{HI}=100.000+1.250=101.250$$", target: "$101.250\\,\\text{m}$." },
    },
    {
      id: "ce-sv-q2", difficulty: "medium", marks: 1, type: "NAT",
      stem: "A tacheometer ($K=100,C=0$) reads a staff intercept of $1.2\\,\\text{m}$ on a horizontal sight. The horizontal distance is _____ m.",
      natAnswer: 120, acceptedRange: [119.5, 120.5],
      solution: { given: "$K=100,S=1.2,C=0$.", derivation: "$$D=100\\times1.2=120$$", target: "$120\\,\\text{m}$." },
    },
    {
      id: "ce-sv-q3", difficulty: "hard", marks: 2, type: "NAT",
      stem: "A circular curve of radius $300\\,\\text{m}$ has a central angle of $40^\\circ$. Its length is _____ m.",
      natAnswer: 209.4, acceptedRange: [208, 211],
      solution: { given: "$R=300,\\Delta=40^\\circ$.", derivation: "$$L=\\dfrac{\\pi\\times300\\times40}{180}=\\dfrac{37699}{180}=209.4$$", target: "$\\approx209.4\\,\\text{m}$." },
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════ */
/*  TOPIC REGISTRY                                                        */
/* ════════════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════════════ */
/*  EXTENDED TOPICS — broader, tougher syllabus coverage                  */
/* ════════════════════════════════════════════════════════════════════ */

const ceBendingShear: LearnTopic = {
  slug: "ce-se-bending-shear",
  subject: "Structural Engineering",
  title: "Bending & Shear Stresses",
  tier: "subject",
  blurb:
    "Flexure formula, transverse shear distribution and torsion — converting beam moments and shears into the fibre stresses that govern design.",
  module: {
    principle:
      "When a beam bends, fibres above the **neutral axis** (which passes through the centroid) shorten and those below lengthen, producing a **linear bending-stress** distribution $\\sigma=My/I$ — maximum at the extreme fibre. The transverse shear force is carried by a **parabolic shear-stress** distribution $\\tau=VQ/Ib$ that is **maximum at the neutral axis** and zero at the top/bottom. In circular shafts a torque produces shear $\\tau=Tr/J$.",
    formulaMatrix: [
      "**Flexure formula**: $\\dfrac{\\sigma}{y}=\\dfrac{M}{I}=\\dfrac{E}{R}\\ \\Rightarrow\\ \\sigma=\\dfrac{My}{I}$",
      "",
      "**Rectangle**: $I=\\dfrac{bd^3}{12},\\ Z=\\dfrac{bd^2}{6},\\ \\sigma_{max}=\\dfrac{M}{Z}$",
      "",
      "**Transverse shear**: $\\tau=\\dfrac{VQ}{Ib}$; max (rectangle) $\\tau_{max}=1.5\\dfrac{V}{A}$, (circle) $\\dfrac{4}{3}\\dfrac{V}{A}$",
      "",
      "**Torsion**: $\\dfrac{\\tau}{r}=\\dfrac{T}{J}=\\dfrac{G\\theta}{L},\\ J=\\dfrac{\\pi d^4}{32}$",
    ].join("\n"),
    traps: [
      "**Bending max at extreme fibre, shear max at the neutral axis.** They occur at different points of the section — never the same fibre.",
      "**Section modulus uses $d^2$, second moment uses $d^3$.** Mixing $Z=bd^2/6$ with $I=bd^3/12$ is a frequent slip.",
      "**Shear factor.** Average shear $V/A$ must be multiplied by $1.5$ (rectangle) or $4/3$ (circle) to get the peak.",
    ],
  },
  questions: [
    {
      id: "ce-bs-q1", difficulty: "basic", marks: 1, type: "NAT",
      stem: "A rectangular beam $200\\,\\text{mm}\\times400\\,\\text{mm}$ (b×d) carries a bending moment of $80\\,\\text{kN·m}$. The maximum bending stress is _____ MPa.",
      natAnswer: 15, acceptedRange: [14.8, 15.2],
      solution: { given: "$Z=bd^2/6=200\\times400^2/6=5.333\\times10^6\\,\\text{mm}^3$.", derivation: "$$\\sigma=\\dfrac{M}{Z}=\\dfrac{80\\times10^6}{5.333\\times10^6}=15$$", target: "$15\\,\\text{MPa}$." },
    },
    {
      id: "ce-bs-q2", difficulty: "medium", marks: 2, type: "NAT",
      stem: "A rectangular beam $200\\,\\text{mm}\\times300\\,\\text{mm}$ carries a shear force of $90\\,\\text{kN}$. The maximum transverse shear stress is _____ MPa.",
      natAnswer: 2.25, acceptedRange: [2.2, 2.3],
      solution: { given: "$A=200\\times300=60000\\,\\text{mm}^2$.", derivation: "$$\\tau_{max}=1.5\\dfrac{V}{A}=1.5\\times\\dfrac{90\\times10^3}{60000}=2.25$$", target: "$2.25\\,\\text{MPa}$." },
    },
    {
      id: "ce-bs-q3", difficulty: "hard", marks: 2, type: "MCQ",
      stem: "For a solid circular section under transverse shear, the ratio of maximum to average shear stress is:",
      options: ["$4/3$", "$3/2$", "$2$", "$1$"], answer: 0,
      solution: { given: "Parabolic shear over a circle.", derivation: "$$\\tau_{max}=\\dfrac{4}{3}\\,\\tau_{avg}$$", target: "Correct option: $4/3$." },
    },
  ],
};

const ceDeflection: LearnTopic = {
  slug: "ce-se-deflection",
  subject: "Structural Engineering",
  title: "Deflection of Beams",
  tier: "subject",
  blurb:
    "Double-integration, moment-area and unit-load methods plus the standard deflection results examiners expect you to recall instantly.",
  module: {
    principle:
      "Beam deflection follows from $EI\\dfrac{d^2y}{dx^2}=M(x)$: integrate the bending-moment expression twice and apply boundary conditions for slope and deflection. For exams the **standard cases** (cantilever and simply-supported under point load or UDL) should be memorised, while the **unit-load (virtual-work)** method handles deflection at any point of any determinate structure.",
    formulaMatrix: [
      "**Governing equation**: $EI\\,y''=M(x)$",
      "",
      "**Cantilever, end load $P$**: $\\delta=\\dfrac{PL^3}{3EI},\\ \\theta=\\dfrac{PL^2}{2EI}$",
      "",
      "**Cantilever, UDL $w$**: $\\delta=\\dfrac{wL^4}{8EI}$",
      "",
      "**SS beam, central load $P$**: $\\delta=\\dfrac{PL^3}{48EI}$",
      "",
      "**SS beam, UDL $w$**: $\\delta=\\dfrac{5wL^4}{384EI}$",
      "",
      "**Unit-load method**: $\\delta=\\displaystyle\\int\\dfrac{Mm}{EI}\\,dx$",
    ].join("\n"),
    traps: [
      "**Unit consistency.** Working in $\\text{kN}$ and $\\text{m}$ gives $\\delta$ in metres — convert to mm at the end, not midway.",
      "**Right formula for the load.** $PL^3/48EI$ is a central point load; $5wL^4/384EI$ is a UDL — don't interchange.",
      "**Cantilever vs simply supported.** A cantilever is far more flexible ($L^3/3EI$ vs $L^3/48EI$) for the same span and load.",
    ],
  },
  questions: [
    {
      id: "ce-df-q1", difficulty: "basic", marks: 1, type: "NAT",
      stem: "A cantilever of span $3\\,\\text{m}$ ($EI=8000\\,\\text{kN·m}^2$) carries an end point load of $10\\,\\text{kN}$. The free-end deflection is _____ mm.",
      natAnswer: 11.25, acceptedRange: [11.1, 11.4],
      solution: { given: "$P=10,L=3,EI=8000$.", derivation: "$$\\delta=\\dfrac{PL^3}{3EI}=\\dfrac{10\\times27}{3\\times8000}=0.01125\\,\\text{m}$$", target: "$11.25\\,\\text{mm}$." },
    },
    {
      id: "ce-df-q2", difficulty: "medium", marks: 2, type: "NAT",
      stem: "A simply supported beam of span $4\\,\\text{m}$ ($EI=10000\\,\\text{kN·m}^2$) carries a central point load of $20\\,\\text{kN}$. The mid-span deflection is _____ mm.",
      natAnswer: 2.667, acceptedRange: [2.6, 2.73],
      solution: { given: "$P=20,L=4,EI=10000$.", derivation: "$$\\delta=\\dfrac{PL^3}{48EI}=\\dfrac{20\\times64}{48\\times10000}=0.002667\\,\\text{m}$$", target: "$\\approx2.67\\,\\text{mm}$." },
    },
    {
      id: "ce-df-q3", difficulty: "hard", marks: 2, type: "MCQ",
      stem: "Which method is most directly suited to finding the deflection at a single specified point of a determinate truss?",
      options: ["Unit-load (virtual work) method", "Double integration", "Moment-distribution", "Slope-deflection"], answer: 0,
      solution: { given: "Trusses carry axial forces only.", derivation: "$$\\delta=\\sum\\dfrac{Pn L}{AE}$$ (unit-load form for trusses).", target: "Unit-load / virtual-work method." },
    },
  ],
};

const ceEffectiveStress: LearnTopic = {
  slug: "ce-ge-effective-stress",
  subject: "Geotechnical Engineering",
  title: "Effective Stress & Seepage",
  tier: "subject",
  blurb:
    "Terzaghi's effective-stress principle, pore pressure, flow nets and the quick (boiling) condition — the backbone of all soil behaviour.",
  module: {
    principle:
      "Terzaghi's principle states that soil strength and deformation are governed not by total stress but by **effective stress** $\\sigma'=\\sigma-u$ — the part carried by the soil skeleton. Below a static water table the pore pressure is $u=\\gamma_w h_w$. Under **seepage**, flow nets give the discharge, and when the upward seepage gradient reaches the **critical gradient** the effective stress vanishes and the soil 'boils' (quick condition).",
    formulaMatrix: [
      "**Effective stress**: $\\sigma'=\\sigma-u$",
      "",
      "**Saturated soil, WT at surface**: $\\sigma'=\\gamma' z,\\quad \\gamma'=\\gamma_{sat}-\\gamma_w$",
      "",
      "**Seepage discharge (flow net)**: $q=kH\\dfrac{N_f}{N_d}$",
      "",
      "**Critical hydraulic gradient**: $i_c=\\dfrac{\\gamma'}{\\gamma_w}=\\dfrac{G-1}{1+e}$",
    ].join("\n"),
    traps: [
      "**Use head, not depth, for pore pressure under seepage.** Hydrostatic $u=\\gamma_w h_w$ only holds for no flow.",
      "**Submerged unit weight.** Below the water table use $\\gamma'=\\gamma_{sat}-\\gamma_w$ for effective stress, not $\\gamma_{sat}$.",
      "**Quick condition is a gradient, not a stress.** Boiling occurs when $i\\to i_c$, independent of particle size for the critical value.",
    ],
  },
  questions: [
    {
      id: "ce-es-q1", difficulty: "basic", marks: 1, type: "NAT",
      stem: "A saturated sand ($\\gamma_{sat}=20\\,\\text{kN/m}^3$) has the water table at the surface. The effective vertical stress at $5\\,\\text{m}$ depth is _____ kPa.",
      natAnswer: 50.95, acceptedRange: [50.5, 51.4],
      solution: { given: "$\\gamma'=20-9.81=10.19\\,\\text{kN/m}^3$.", derivation: "$$\\sigma'=\\gamma' z=10.19\\times5=50.95$$", target: "$\\approx50.95\\,\\text{kPa}$." },
    },
    {
      id: "ce-es-q2", difficulty: "medium", marks: 2, type: "NAT",
      stem: "A soil has $G=2.65$ and void ratio $e=0.65$. Its critical hydraulic gradient is _____.",
      natAnswer: 1.0, acceptedRange: [0.98, 1.02],
      solution: { given: "$G=2.65,e=0.65$.", derivation: "$$i_c=\\dfrac{G-1}{1+e}=\\dfrac{1.65}{1.65}=1.0$$", target: "$i_c=1.0$." },
    },
    {
      id: "ce-es-q3", difficulty: "hard", marks: 2, type: "NAT",
      stem: "A flow net beneath a dam has $4$ flow channels and $12$ potential drops; head loss $6\\,\\text{m}$, $k=2\\times10^{-5}\\,\\text{m/s}$. The seepage per metre length is _____ ×10⁻⁵ m³/s/m.",
      natAnswer: 4, acceptedRange: [3.9, 4.1],
      solution: { given: "$N_f=4,N_d=12,H=6,k=2\\times10^{-5}$.", derivation: "$$q=kH\\dfrac{N_f}{N_d}=2\\times10^{-5}\\times6\\times\\dfrac{4}{12}=4\\times10^{-5}$$", target: "$4\\times10^{-5}\\,\\text{m}^3/\\text{s/m}$." },
    },
  ],
};

const ceConsolidation: LearnTopic = {
  slug: "ce-ge-consolidation",
  subject: "Geotechnical Engineering",
  title: "Consolidation",
  tier: "subject",
  blurb:
    "Primary consolidation settlement, the compression index, time factor and coefficient of consolidation — predicting how clays settle and how long it takes.",
  module: {
    principle:
      "Saturated clays settle slowly as excess pore water is squeezed out — **primary consolidation**. The magnitude depends on the **compression index** $C_c$ and the stress increment (on a semi-log $e$–$\\log\\sigma'$ plot); the rate is governed by **Terzaghi's 1-D theory** through the dimensionless **time factor** $T_v$ and the **coefficient of consolidation** $c_v$. The drainage path $H$ is the full layer thickness for single drainage but **half** for double drainage.",
    formulaMatrix: [
      "**Settlement**: $S_c=\\dfrac{C_c H}{1+e_0}\\log_{10}\\dfrac{\\sigma_0'+\\Delta\\sigma}{\\sigma_0'}$",
      "",
      "**Compression index (Terzaghi–Peck, undisturbed)**: $C_c=0.009(LL-10)$",
      "",
      "**Time factor**: $T_v=\\dfrac{c_v\\,t}{H^2}$; $U=50\\%\\Rightarrow T_v=0.197$, $U=90\\%\\Rightarrow T_v=0.848$",
      "",
      "**Coefficient of consolidation**: $c_v=\\dfrac{T_v H^2}{t}$",
    ].join("\n"),
    traps: [
      "**Drainage path.** For a clay layer drained top and bottom, $H$ = half the thickness — squaring the wrong $H$ quarters the time.",
      "**Logarithm base.** The settlement equation uses $\\log_{10}$, not natural log.",
      "**$T_v$ values.** $0.197$ for $50\\%$ and $0.848$ for $90\\%$ are standard recall — don't interpolate linearly.",
    ],
  },
  questions: [
    {
      id: "ce-cons-q1", difficulty: "basic", marks: 1, type: "NAT",
      stem: "A normally-consolidated clay has liquid limit $40\\%$. By the Terzaghi–Peck relation, its compression index $C_c$ is _____.",
      natAnswer: 0.27, acceptedRange: [0.265, 0.275],
      solution: { given: "$LL=40\\%$.", derivation: "$$C_c=0.009(LL-10)=0.009\\times30=0.27$$", target: "$C_c=0.27$." },
    },
    {
      id: "ce-cons-q2", difficulty: "medium", marks: 2, type: "NAT",
      stem: "A $3\\,\\text{m}$ thick clay layer ($C_c=0.25$, $e_0=0.8$) has its effective stress raised from $100$ to $200\\,\\text{kPa}$. The primary consolidation settlement is _____ mm.",
      natAnswer: 125.4, acceptedRange: [123, 128],
      solution: { given: "$H=3000\\,\\text{mm}$, $\\sigma_0'=100$, $\\Delta\\sigma=100$.", derivation: "$$S_c=\\dfrac{0.25\\times3000}{1.8}\\log_{10}\\dfrac{200}{100}=416.7\\times0.301=125.4$$", target: "$\\approx125\\,\\text{mm}$." },
    },
    {
      id: "ce-cons-q3", difficulty: "hard", marks: 2, type: "NAT",
      stem: "A $4\\,\\text{m}$ clay layer, drained on both faces, reaches $50\\%$ consolidation in $1.5\\,\\text{years}$. Its coefficient of consolidation is _____ m²/yr.",
      natAnswer: 0.525, acceptedRange: [0.5, 0.55],
      solution: { given: "Double drainage ⇒ $H=2\\,\\text{m}$; $T_v=0.197$ at $50\\%$.", derivation: "$$c_v=\\dfrac{T_v H^2}{t}=\\dfrac{0.197\\times2^2}{1.5}=0.525$$", target: "$\\approx0.525\\,\\text{m}^2/\\text{yr}$." },
    },
  ],
};

const ceOpenChannel: LearnTopic = {
  slug: "ce-wr-open-channel",
  subject: "Water Resources Engineering",
  title: "Open Channel Flow",
  tier: "subject",
  blurb:
    "Specific energy, critical depth, the Froude number and the hydraulic jump — the gravity-driven free-surface flows that dominate hydraulics questions.",
  module: {
    principle:
      "In an open channel the flow has a free surface, so gravity and depth control behaviour. **Specific energy** $E=y+v^2/2g$ is minimum at the **critical depth**, where the **Froude number** $Fr=1$. Flow is **subcritical** ($Fr<1$, deep/slow) or **supercritical** ($Fr>1$, shallow/fast). A transition from super- to subcritical occurs abruptly through a **hydraulic jump**, dissipating energy.",
    formulaMatrix: [
      "**Specific energy**: $E=y+\\dfrac{v^2}{2g}=y+\\dfrac{q^2}{2gy^2}$",
      "",
      "**Critical depth (rectangular)**: $y_c=\\left(\\dfrac{q^2}{g}\\right)^{1/3},\\ q=\\dfrac{Q}{b}$",
      "",
      "**Froude number**: $Fr=\\dfrac{v}{\\sqrt{gy}}$; $Fr=1$ critical",
      "",
      "**Hydraulic jump (sequent depth)**: $y_2=\\dfrac{y_1}{2}\\left(\\sqrt{1+8Fr_1^2}-1\\right)$",
      "",
      "**Energy loss in jump**: $\\Delta E=\\dfrac{(y_2-y_1)^3}{4y_1y_2}$",
    ].join("\n"),
    traps: [
      "**Critical depth is independent of slope.** It depends only on discharge per unit width $q$ (rectangular channel).",
      "**Use unit discharge $q=Q/b$** in the critical-depth formula, not total $Q$.",
      "**Jump only forms super→subcritical.** Upstream must be supercritical ($Fr_1>1$).",
    ],
  },
  questions: [
    {
      id: "ce-oc-q1", difficulty: "basic", marks: 1, type: "NAT",
      stem: "A rectangular channel $2\\,\\text{m}$ wide carries $8\\,\\text{m}^3/\\text{s}$. The critical depth is _____ m.",
      natAnswer: 1.177, acceptedRange: [1.15, 1.2],
      solution: { given: "$q=Q/b=8/2=4\\,\\text{m}^2/\\text{s}$.", derivation: "$$y_c=\\left(\\dfrac{q^2}{g}\\right)^{1/3}=\\left(\\dfrac{16}{9.81}\\right)^{1/3}=1.177$$", target: "$\\approx1.18\\,\\text{m}$." },
    },
    {
      id: "ce-oc-q2", difficulty: "medium", marks: 1, type: "NAT",
      stem: "Water flows $1\\,\\text{m}$ deep at $3\\,\\text{m/s}$ in a wide channel. The Froude number is _____.",
      natAnswer: 0.958, acceptedRange: [0.94, 0.97],
      solution: { given: "$v=3,y=1$.", derivation: "$$Fr=\\dfrac{v}{\\sqrt{gy}}=\\dfrac{3}{\\sqrt{9.81\\times1}}=0.958$$", target: "$\\approx0.96$ (subcritical)." },
    },
    {
      id: "ce-oc-q3", difficulty: "hard", marks: 2, type: "NAT",
      stem: "A hydraulic jump has upstream depth $0.4\\,\\text{m}$ and upstream Froude number $2.5$. The sequent (downstream) depth is _____ m.",
      natAnswer: 1.228, acceptedRange: [1.2, 1.26],
      solution: { given: "$y_1=0.4,Fr_1=2.5$.", derivation: "$$y_2=\\dfrac{0.4}{2}\\left(\\sqrt{1+8\\times2.5^2}-1\\right)=0.2(7.141-1)=1.228$$", target: "$\\approx1.23\\,\\text{m}$." },
    },
  ],
};

const cePavement: LearnTopic = {
  slug: "ce-tr-pavement",
  subject: "Transportation Engineering",
  title: "Pavement Design",
  tier: "subject",
  blurb:
    "Flexible (CBR, layered elastic) versus rigid (Westergaard slab on subgrade) pavements — the two design philosophies and the stresses they control.",
  module: {
    principle:
      "**Flexible pavements** transmit wheel loads to the subgrade through successive layers in compression; their thickness is governed by the **CBR** of the subgrade and traffic repetitions. **Rigid pavements** are concrete slabs whose flexural stiffness spreads the load, resting on a subgrade characterised by the **modulus of subgrade reaction** $k$; Westergaard's analysis gives the critical edge/corner/interior stresses through the **radius of relative stiffness** $l$.",
    formulaMatrix: [
      "**Tyre contact area**: $A=\\dfrac{P}{p}$ (wheel load ÷ tyre pressure)",
      "",
      "**Radius of relative stiffness**: $l=\\left[\\dfrac{Eh^3}{12(1-\\mu^2)k}\\right]^{1/4}$",
      "",
      "**Flexible design**: CBR method ⇒ total thickness above subgrade for a design traffic.",
      "",
      "**Rigid design**: Westergaard interior/edge/corner stresses depend on $l$, slab thickness $h$ and $k$.",
    ].join("\n"),
    traps: [
      "**$k$ for rigid, CBR for flexible.** The modulus of subgrade reaction governs slabs; the CBR governs layered flexible pavements.",
      "**Radius of relative stiffness rises with slab thickness** ($l\\propto h^{3/4}$) and falls with stiffer subgrade $k$.",
      "**Contact area, not contact pressure**, is load ÷ tyre pressure — keep the ratio the right way up.",
    ],
  },
  questions: [
    {
      id: "ce-pv-q1", difficulty: "basic", marks: 1, type: "MCQ",
      stem: "The CBR method of design directly yields the:",
      options: ["total thickness of a flexible pavement", "concrete grade of a rigid slab", "joint spacing", "camber"], answer: 0,
      solution: { given: "CBR = California Bearing Ratio of subgrade.", derivation: "CBR → required thickness above the subgrade for the design traffic.", target: "Total flexible-pavement thickness." },
    },
    {
      id: "ce-pv-q2", difficulty: "medium", marks: 2, type: "NAT",
      stem: "A wheel load of $40\\,\\text{kN}$ acts at a tyre pressure of $0.7\\,\\text{MPa}$. The tyre contact area is _____ mm².",
      natAnswer: 57143, acceptedRange: [56500, 57800],
      solution: { given: "$P=40\\,\\text{kN}=40000\\,\\text{N}$, $p=0.7\\,\\text{MPa}=0.7\\,\\text{N/mm}^2$.", derivation: "$$A=\\dfrac{P}{p}=\\dfrac{40000}{0.7}=57143$$", target: "$\\approx57{,}143\\,\\text{mm}^2$." },
    },
    {
      id: "ce-pv-q3", difficulty: "hard", marks: 2, type: "MCQ",
      stem: "In Westergaard's rigid-pavement analysis, the radius of relative stiffness $l$ increases when:",
      options: ["the slab thickness increases", "the modulus of subgrade reaction increases", "the slab modulus decreases", "Poisson's ratio increases only"], answer: 0,
      solution: { given: "$l=[Eh^3/(12(1-\\mu^2)k)]^{1/4}$.", derivation: "$$l\\propto h^{3/4},\\quad l\\propto k^{-1/4}$$", target: "Increases with slab thickness $h$." },
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════ */
/*  PER-TOPIC STANDARD REFERENCES                                         */
/* ════════════════════════════════════════════════════════════════════ */

const CE_TOPIC_REFERENCES: Record<string, LearnReference[]> = {
  "ce-em-linear-algebra": [
    { book: "Advanced Engineering Mathematics", author: "Erwin Kreyszig", chapter: "Linear Algebra: Matrices & Eigenvalue Problems" },
    { book: "Higher Engineering Mathematics", author: "B.S. Grewal" },
  ],
  "ce-em-probability-statistics": [
    { book: "Higher Engineering Mathematics", author: "B.S. Grewal", chapter: "Probability & Statistics" },
    { book: "Advanced Engineering Mathematics", author: "Erwin Kreyszig" },
  ],
  "ce-se-engineering-mechanics": [
    { book: "Mechanics of Structures", author: "B.C. Punmia" },
    { book: "Vector Mechanics for Engineers: Statics", author: "Beer & Johnston" },
  ],
  "ce-se-simple-stresses": [
    { book: "Strength of Materials (Mechanics of Materials)", author: "B.C. Punmia" },
    { book: "Strength of Materials", author: "S.S. Rattan" },
  ],
  "ce-se-structural-analysis": [
    { book: "Elementary Structural Analysis", author: "Wilbur & Norris" },
    { book: "Basic Structural Analysis", author: "C.S. Reddy" },
  ],
  "ce-se-rcc-limit-state": [
    { book: "Reinforced Concrete Design (RCC Designs)", author: "B.C. Punmia, A.K. Jain & A.K. Jain" },
    { book: "IS 456:2000 — Plain & Reinforced Concrete Code of Practice", author: "Bureau of Indian Standards" },
  ],
  "ce-se-steel-members": [
    { book: "Limit State Design of Steel Structures", author: "S.K. Duggal" },
    { book: "IS 800:2007 — General Construction in Steel", author: "Bureau of Indian Standards" },
  ],
  "ce-ge-soil-phase-relations": [
    { book: "Basic and Applied Soil Mechanics", author: "Gopal Ranjan & A.S.R. Rao" },
  ],
  "ce-ge-bearing-capacity": [
    { book: "Basic and Applied Soil Mechanics", author: "Gopal Ranjan & A.S.R. Rao", chapter: "Shear Strength & Bearing Capacity" },
  ],
  "ce-wr-fluid-mechanics": [
    { book: "Hydraulics and Fluid Mechanics (including Hydraulic Machines)", author: "P.N. Modi & S.M. Seth" },
  ],
  "ce-wr-hydrology-irrigation": [
    { book: "Engineering Hydrology", author: "K. Subramanya" },
    { book: "Irrigation Engineering and Hydraulic Structures", author: "S.K. Garg" },
  ],
  "ce-en-water-wastewater": [
    { book: "Environmental Engineering Vol. I (Water Supply) & Vol. II (Wastewater)", author: "S.K. Garg" },
  ],
  "ce-tr-geometric-design": [
    { book: "Highway Engineering", author: "S.K. Khanna & C.E.G. Justo" },
  ],
  "ce-gm-levelling-tacheometry": [
    { book: "Surveying Vol. I & II", author: "B.C. Punmia, A.K. Jain & A.K. Jain" },
  ],
  "ce-se-bending-shear": [
    { book: "Strength of Materials (Mechanics of Materials)", author: "B.C. Punmia" },
    { book: "Mechanics of Materials", author: "Gere & Timoshenko" },
  ],
  "ce-se-deflection": [
    { book: "Elementary Structural Analysis", author: "Wilbur & Norris" },
    { book: "Basic Structural Analysis", author: "C.S. Reddy" },
  ],
  "ce-ge-effective-stress": [
    { book: "Basic and Applied Soil Mechanics", author: "Gopal Ranjan & A.S.R. Rao", chapter: "Effective Stress & Seepage" },
  ],
  "ce-ge-consolidation": [
    { book: "Basic and Applied Soil Mechanics", author: "Gopal Ranjan & A.S.R. Rao", chapter: "Consolidation" },
  ],
  "ce-wr-open-channel": [
    { book: "Flow in Open Channels", author: "K. Subramanya" },
    { book: "Hydraulics and Fluid Mechanics", author: "P.N. Modi & S.M. Seth" },
  ],
  "ce-tr-pavement": [
    { book: "Highway Engineering", author: "S.K. Khanna & C.E.G. Justo", chapter: "Pavement Design" },
  ],
};

/* ════════════════════════════════════════════════════════════════════ */
/*  RECOMMENDED BOOKS & RESOURCES (Learn index panel)                     */
/* ════════════════════════════════════════════════════════════════════ */

export type CeResourceGroup = { subject: string; books: LearnReference[] };

export const CE_RESOURCES: CeResourceGroup[] = [
  {
    subject: "Engineering Mathematics",
    books: [
      { book: "Advanced Engineering Mathematics", author: "Erwin Kreyszig" },
      { book: "Higher Engineering Mathematics", author: "B.S. Grewal" },
    ],
  },
  {
    subject: "Structural Engineering",
    books: [
      { book: "Elementary Structural Analysis", author: "Wilbur & Norris" },
      { book: "Basic Structural Analysis", author: "C.S. Reddy" },
      { book: "RCC Designs (Reinforced Concrete)", author: "B.C. Punmia" },
      { book: "Limit State Design of Steel Structures", author: "S.K. Duggal" },
    ],
  },
  {
    subject: "Geotechnical Engineering",
    books: [
      { book: "Basic and Applied Soil Mechanics", author: "Gopal Ranjan & A.S.R. Rao" },
    ],
  },
  {
    subject: "Water Resources Engineering",
    books: [
      { book: "Hydraulics and Fluid Mechanics", author: "P.N. Modi & S.M. Seth" },
      { book: "Engineering Hydrology / Flow in Open Channels", author: "K. Subramanya" },
    ],
  },
  {
    subject: "Environmental Engineering",
    books: [
      { book: "Environmental Engineering Vol. I & II", author: "S.K. Garg" },
    ],
  },
  {
    subject: "Transportation Engineering",
    books: [
      { book: "Highway Engineering", author: "S.K. Khanna & C.E.G. Justo" },
    ],
  },
  {
    subject: "Geomatics Engineering",
    books: [
      { book: "Surveying Vol. I & II", author: "B.C. Punmia" },
    ],
  },
];

export const CE_RESOURCE_LINKS: { label: string; href: string; note: string }[] = [
  { label: "NPTEL–GATE PYQ portal", href: "https://gate.nptel.ac.in", note: "Subject-wise previous-year questions (2007–2022) with solutions and full-length mock tests." },
  { label: "NPTEL Civil lectures", href: "https://nptel.ac.in", note: "Video courses by IIT/IISc faculty mapped to every GATE CE subject." },
];

export const CE_LEARN_TOPICS: LearnTopic[] = [
  ceLinearAlgebra,
  ceProbability,
  ceEngMechanics,
  ceSimpleStress,
  ceBendingShear,
  ceStructuralAnalysis,
  ceDeflection,
  ceRcc,
  ceSteel,
  ceSoilPhase,
  ceEffectiveStress,
  ceConsolidation,
  ceBearingCapacity,
  ceFluidMechanics,
  ceOpenChannel,
  ceHydrology,
  ceEnvironmental,
  ceTransportation,
  cePavement,
  ceSurveying,
].map((t) => ({ ...t, references: t.references ?? CE_TOPIC_REFERENCES[t.slug] }));

export function getCivilLearnTopic(slug: string): LearnTopic | undefined {
  return CE_LEARN_TOPICS.find((t) => t.slug === slug);
}

/* ════════════════════════════════════════════════════════════════════ */
/*  GATE CE SYLLABUS MAP                                                  */
/* ════════════════════════════════════════════════════════════════════ */

export const CE_LEARN_SYLLABUS: LearnSyllabusSection[] = [
  {
    id: 1,
    title: "Engineering Mathematics",
    summary: "The mathematical toolkit underpinning every quantitative question on the paper.",
    subtopics: [
      { title: "Linear Algebra", slug: "ce-em-linear-algebra", highlight: "Matrices, rank, systems of equations, eigenvalues & eigenvectors" },
      { title: "Calculus", highlight: "Limits, derivatives, maxima/minima, definite & multiple integrals" },
      { title: "Ordinary Differential Equations", highlight: "First-order, higher-order linear, Euler–Cauchy equations" },
      { title: "Partial Differential Equations", highlight: "Laplace, heat & wave equations; method of separation" },
      { title: "Probability & Statistics", slug: "ce-em-probability-statistics", highlight: "Mean, variance, distributions, conditional probability" },
      { title: "Numerical Methods", highlight: "Root finding, interpolation, numerical integration & ODEs" },
    ],
  },
  {
    id: 2,
    title: "Structural Engineering",
    summary: "Mechanics, analysis and the design of concrete and steel structures.",
    subtopics: [
      { title: "Engineering Mechanics", slug: "ce-se-engineering-mechanics", highlight: "Equilibrium, resultants, trusses, friction" },
      { title: "Simple Stresses & Strains", slug: "ce-se-simple-stresses", highlight: "Axial stress, Hooke's law, elongation, elastic constants" },
      { title: "Bending & Shear Stresses", slug: "ce-se-bending-shear", highlight: "Flexure formula σ=My/I, transverse shear, torsion" },
      { title: "Structural Analysis", slug: "ce-se-structural-analysis", highlight: "Determinacy, SF & BM diagrams, standard beam results" },
      { title: "Deflection of Beams", slug: "ce-se-deflection", highlight: "Double integration, moment-area, unit-load methods" },
      { title: "Construction Materials & Management", highlight: "Concrete, PERT/CPM, EOQ, work study" },
      { title: "Concrete Structures (RCC)", slug: "ce-se-rcc-limit-state", highlight: "Limit state, stress block, neutral axis, moment capacity" },
      { title: "Steel Structures", slug: "ce-se-steel-members", highlight: "Tension & compression members, slenderness, connections" },
    ],
  },
  {
    id: 3,
    title: "Geotechnical Engineering",
    summary: "Soil behaviour and the design of foundations and earth structures.",
    subtopics: [
      { title: "Soil Phase Relations & Index Properties", slug: "ce-ge-soil-phase-relations", highlight: "Void ratio, unit weights, Atterberg limits, classification" },
      { title: "Effective Stress & Seepage", slug: "ce-ge-effective-stress", highlight: "Terzaghi principle, flow nets, quick condition" },
      { title: "Consolidation", slug: "ce-ge-consolidation", highlight: "Coefficient of consolidation, settlement, time factor" },
      { title: "Shear Strength & Bearing Capacity", slug: "ce-ge-bearing-capacity", highlight: "Mohr–Coulomb, Rankine, Terzaghi bearing capacity" },
      { title: "Foundation Engineering", highlight: "Shallow & deep foundations, pile groups, settlement" },
    ],
  },
  {
    id: 4,
    title: "Water Resources Engineering",
    summary: "Fluid mechanics, hydrology and the engineering of irrigation systems.",
    subtopics: [
      { title: "Fluid Mechanics & Flow", slug: "ce-wr-fluid-mechanics", highlight: "Continuity, Bernoulli, hydrostatics, Manning flow" },
      { title: "Flow Through Pipes", highlight: "Darcy–Weisbach, major & minor losses, networks" },
      { title: "Open Channel Flow", slug: "ce-wr-open-channel", highlight: "Specific energy, critical flow, hydraulic jump" },
      { title: "Hydrology & Irrigation", slug: "ce-wr-hydrology-irrigation", highlight: "Rational method, unit hydrograph, duty–delta" },
    ],
  },
  {
    id: 5,
    title: "Environmental Engineering",
    summary: "Water supply, wastewater, air and noise — protecting public health.",
    subtopics: [
      { title: "Water Demand, Treatment & BOD", slug: "ce-en-water-wastewater", highlight: "Per-capita demand, sedimentation, disinfection, BOD kinetics" },
      { title: "Wastewater Treatment", highlight: "Primary, secondary & tertiary processes; sludge" },
      { title: "Air Pollution", highlight: "Primary & secondary pollutants, control, standards" },
      { title: "Solid Waste & Noise", highlight: "MSW management, decibel addition, exposure limits" },
    ],
  },
  {
    id: 6,
    title: "Transportation Engineering",
    summary: "Geometric design, traffic flow and pavement engineering.",
    subtopics: [
      { title: "Highway Geometric Design", slug: "ce-tr-geometric-design", highlight: "Sight distance, superelevation, traffic flow relation" },
      { title: "Traffic Engineering", highlight: "Speed studies, capacity, signal design, PCU" },
      { title: "Pavement Design", slug: "ce-tr-pavement", highlight: "Flexible & rigid pavements, CBR, Westergaard" },
      { title: "Highway Materials", highlight: "Aggregates, bitumen tests, mix design" },
    ],
  },
  {
    id: 7,
    title: "Geomatics Engineering",
    summary: "Surveying, levelling and modern positioning systems.",
    subtopics: [
      { title: "Levelling & Tacheometry", slug: "ce-gm-levelling-tacheometry", highlight: "HI method, stadia distance, curve geometry" },
      { title: "Theodolite & Traverse", highlight: "Angles, bearings, latitude & departure, closing error" },
      { title: "Curves", highlight: "Simple, compound, transition & vertical curves" },
      { title: "Modern Surveying", highlight: "Total station, GPS/GNSS, GIS & remote sensing" },
    ],
  },
];

/** A syllabus sub-topic resolved against the authored CE LearnTopic bank. */
export type CeResolvedSubtopic = LearnSyllabusSubtopic & { topic?: LearnTopic };

/** The full CE syllabus with each sub-topic's authored LearnTopic attached. */
export function getCivilLearnSyllabus(): (Omit<LearnSyllabusSection, "subtopics"> & {
  subtopics: CeResolvedSubtopic[];
  liveCount: number;
})[] {
  return CE_LEARN_SYLLABUS.map((sec) => {
    const subtopics: CeResolvedSubtopic[] = sec.subtopics.map((st) => ({
      ...st,
      topic: st.slug ? getCivilLearnTopic(st.slug) : undefined,
    }));
    return {
      id: sec.id,
      title: sec.title,
      summary: sec.summary,
      subtopics,
      liveCount: subtopics.filter((s) => s.topic).length,
    };
  });
}

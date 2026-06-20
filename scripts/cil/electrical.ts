/**
 * CrackGate — CIL Management Trainee (Electrical) Paper-II generator.
 *
 *   npx tsx scripts/cil/electrical.ts                 # sets 1..15
 *   npx tsx scripts/cil/electrical.ts --only=11,12
 *   npx tsx scripts/cil/electrical.ts --from=1 --to=10
 *
 * Paper-I (100 Q) is the shared CIL core. This file supplies only Paper-II
 * (Professional Knowledge, 100 Q = ~60 theory + ~40 numerical) for Electrical
 * Engineering, authored to be conceptual and fundamentals-first: many items use
 * "which statement is INCORRECT", compare-two-cases and limiting-case framing,
 * and a block of questions carry SVG figures (circuits, waveforms, phasors,
 * resonance curves) rendered by the app's QuestionFigure engine.
 */
import {
  mcqFrom,
  fillSpecs,
  rotateSlice,
  drawDistinct,
  shuffleInPlace,
  SUBJ,
  r2,
  r1,
  pick,
} from "../build_cil_civil";
import type { FactQ, Q, SpecGen } from "../build_cil_civil";
import { runDiscipline } from "./core";

// ─── Curated Electrical theory pool (base: easy / medium) ────────────────────
const ELEC_THEORY_POOL: FactQ[] = [
  // Circuit fundamentals
  { topic: "DC Circuits", difficulty: "easy", stem: "Ohm's law states that, at constant temperature, the current through a conductor is:", correct: "Directly proportional to the voltage across it", distractors: ["Inversely proportional to the voltage", "Independent of the voltage", "Proportional to the square of the voltage"], solution: "V = IR, so for constant R the current rises in direct proportion to the applied voltage." },
  { topic: "DC Circuits", difficulty: "easy", stem: "Kirchhoff's Current Law (KCL) is a statement of the conservation of:", correct: "Charge", distractors: ["Energy", "Momentum", "Magnetic flux"], solution: "KCL says the algebraic sum of currents at a node is zero — charge is neither created nor destroyed." },
  { topic: "DC Circuits", difficulty: "easy", stem: "Kirchhoff's Voltage Law (KVL) is a statement of the conservation of:", correct: "Energy", distractors: ["Charge", "Power", "Flux linkage"], solution: "The sum of voltage drops around a closed loop equals zero — energy supplied equals energy absorbed." },
  { topic: "DC Circuits", difficulty: "easy", stem: "Two resistors of 4 Ω and 6 Ω in series give a total resistance of:", correct: "10 Ω", distractors: ["2.4 Ω", "24 Ω", "5 Ω"], solution: "Series resistances simply add: 4 + 6 = 10 Ω." },
  { topic: "DC Circuits", difficulty: "easy", stem: "The equivalent resistance of two equal resistors R in parallel is:", correct: "R/2", distractors: ["2R", "R", "R/4"], solution: "For two equal parallel resistors, Req = R·R/(R+R) = R/2." },
  { topic: "DC Circuits", difficulty: "easy", stem: "Electrical power dissipated in a resistor can be written as:", correct: "I²R", distractors: ["I/R", "IR²", "R/I²"], solution: "P = VI = I²R = V²/R for a resistor." },
  { topic: "Electrostatics", difficulty: "medium", stem: "The energy stored in a capacitor of capacitance C charged to voltage V is:", correct: "½CV²", distractors: ["CV", "½CV", "C²V"], solution: "Energy = ½CV², stored in the electric field between the plates." },
  { topic: "Magnetics", difficulty: "medium", stem: "The energy stored in an inductor carrying current I is:", correct: "½LI²", distractors: ["LI", "½LI", "L²I"], solution: "Energy = ½LI², stored in the magnetic field of the coil." },
  { topic: "Transients", difficulty: "medium", stem: "The time constant of a series RC circuit is:", correct: "RC", distractors: ["R/C", "C/R", "1/RC"], solution: "τ = RC; after one time constant the capacitor charges to ~63% of the final voltage." },
  { topic: "Transients", difficulty: "medium", stem: "The time constant of a series RL circuit is:", correct: "L/R", distractors: ["RL", "R/L", "1/RL"], solution: "τ = L/R; the current reaches ~63% of its final value in one time constant." },
  // AC fundamentals
  { topic: "AC Fundamentals", difficulty: "easy", stem: "The RMS value of a sinusoidal voltage of peak value Vm is:", correct: "Vm/√2", distractors: ["Vm", "Vm/2", "√2·Vm"], solution: "For a sine wave, RMS = Vm/√2 ≈ 0.707 Vm." },
  { topic: "AC Fundamentals", difficulty: "medium", stem: "The average value of a sinusoidal current over one complete cycle is:", correct: "Zero", distractors: ["Im/√2", "0.637 Im", "Im"], solution: "Over a full cycle the positive and negative halves cancel, giving zero average." },
  { topic: "AC Fundamentals", difficulty: "medium", stem: "The form factor of a sinusoidal waveform is:", correct: "1.11", distractors: ["1.0", "1.41", "0.707"], solution: "Form factor = RMS/average (half cycle) = 0.707/0.637 ≈ 1.11." },
  { topic: "AC Fundamentals", difficulty: "easy", stem: "Power factor is defined as the cosine of the angle between:", correct: "Voltage and current", distractors: ["Two currents", "Power and current", "Resistance and reactance"], solution: "Power factor = cos φ, where φ is the phase angle between voltage and current." },
  { topic: "AC Circuits", difficulty: "medium", stem: "In a purely inductive AC circuit, the current:", correct: "Lags the voltage by 90°", distractors: ["Leads the voltage by 90°", "Is in phase with the voltage", "Lags by 45°"], solution: "An ideal inductor makes current lag voltage by 90°." },
  { topic: "AC Circuits", difficulty: "medium", stem: "In a purely capacitive AC circuit, the current:", correct: "Leads the voltage by 90°", distractors: ["Lags the voltage by 90°", "Is in phase with the voltage", "Leads by 45°"], solution: "An ideal capacitor makes current lead voltage by 90°." },
  { topic: "Resonance", difficulty: "medium", stem: "The resonant frequency of a series RLC circuit is given by:", correct: "1/(2π√(LC))", distractors: ["2π√(LC)", "1/(2πLC)", "√(LC)/2π"], solution: "At resonance XL = XC, giving f₀ = 1/(2π√(LC))." },
  { topic: "Resonance", difficulty: "medium", stem: "At series resonance, the impedance of an RLC circuit is:", correct: "Minimum and purely resistive", distractors: ["Maximum and purely resistive", "Zero", "Purely reactive"], solution: "XL and XC cancel, leaving only R, so impedance is minimum and resistive (current maximum)." },
  // Network theorems
  { topic: "Network Theorems", difficulty: "medium", stem: "Thevenin's theorem replaces a linear network by:", correct: "A voltage source in series with a resistance", distractors: ["A current source in parallel with a resistance", "A pure voltage source", "A pure resistance"], solution: "Thevenin: an equivalent EMF Vth in series with Rth seen from the terminals." },
  { topic: "Network Theorems", difficulty: "medium", stem: "Norton's theorem replaces a linear network by:", correct: "A current source in parallel with a resistance", distractors: ["A voltage source in series with a resistance", "A pure current source", "A pure inductance"], solution: "Norton: a current source IN in parallel with RN (= Rth)." },
  { topic: "Network Theorems", difficulty: "medium", stem: "For maximum power transfer to a resistive load from a DC source, the load resistance should equal:", correct: "The source (Thevenin) resistance", distractors: ["Twice the source resistance", "Half the source resistance", "Zero"], solution: "Maximum power is transferred when RL = Rth." },
  { topic: "Network Theorems", difficulty: "medium", stem: "The superposition theorem is applicable only to:", correct: "Linear circuits", distractors: ["Non-linear circuits", "Only DC circuits", "Only AC circuits"], solution: "Superposition holds for linear, bilateral networks; responses of independent sources add." },
  // Transformers
  { topic: "Transformers", difficulty: "easy", stem: "A transformer operates on the principle of:", correct: "Mutual electromagnetic induction", distractors: ["Self-induction only", "Electrostatic induction", "Hall effect"], solution: "Changing flux from the primary links the secondary, inducing an EMF (mutual induction)." },
  { topic: "Transformers", difficulty: "medium", stem: "The EMF equation of a transformer is E =", correct: "4.44 f N Φm", distractors: ["2.22 f N Φm", "4.44 N Φm", "f N Φm"], solution: "E = 4.44 f N Φm, from the rate of change of sinusoidal flux." },
  { topic: "Transformers", difficulty: "easy", stem: "A step-up transformer has:", correct: "More secondary turns than primary turns", distractors: ["Fewer secondary turns", "Equal turns", "No iron core"], solution: "Step-up means N₂ > N₁, so V₂ > V₁." },
  { topic: "Transformers", difficulty: "medium", stem: "The efficiency of a transformer is maximum when:", correct: "Copper loss equals iron loss", distractors: ["Copper loss is zero", "Iron loss is maximum", "Load is zero"], solution: "Maximum efficiency occurs at the load where variable copper loss = constant iron loss." },
  { topic: "Transformers", difficulty: "medium", stem: "Transformers are rated in kVA rather than kW because:", correct: "Their losses depend on voltage and current, not on the load power factor", distractors: ["They only carry reactive power", "kW cannot be measured", "The core saturates"], solution: "Iron loss depends on voltage and copper loss on current; both are independent of the load power factor, so apparent power (kVA) is the rating." },
  // Rotating machines
  { topic: "DC Machines", difficulty: "medium", stem: "The back EMF of a DC motor is:", correct: "Proportional to speed and flux", distractors: ["Independent of speed", "Proportional to armature resistance", "Zero at full load"], solution: "Eb = (PφZN)/(60A); it rises with speed and flux and opposes the supply." },
  { topic: "DC Machines", difficulty: "medium", stem: "A DC series motor should never be started:", correct: "On no load", distractors: ["On full load", "With a starter", "With field weakening"], solution: "On no load a series motor races to dangerously high speed because flux falls with the small current." },
  { topic: "DC Machines", difficulty: "medium", stem: "The commutator in a DC machine acts as a:", correct: "Mechanical rectifier/inverter", distractors: ["Voltage regulator", "Frequency changer", "Capacitor"], solution: "It mechanically reverses armature connections so the external current/EMF stays unidirectional." },
  { topic: "Induction Motors", difficulty: "easy", stem: "The synchronous speed of an AC machine with P poles at frequency f is:", correct: "120f/P", distractors: ["60f/P", "Pf/120", "120P/f"], solution: "Ns = 120f/P rpm." },
  { topic: "Induction Motors", difficulty: "medium", stem: "The slip of an induction motor running at synchronous speed would be:", correct: "Zero", distractors: ["One", "0.5", "Infinite"], solution: "Slip s = (Ns − N)/Ns; at N = Ns, s = 0 (and torque would be zero)." },
  { topic: "Induction Motors", difficulty: "medium", stem: "A 3-phase induction motor at standstill has a slip of:", correct: "1", distractors: ["0", "0.5", "Infinity"], solution: "At start N = 0, so s = (Ns − 0)/Ns = 1." },
  { topic: "Synchronous Machines", difficulty: "medium", stem: "A 3-phase synchronous motor is:", correct: "Not self-starting", distractors: ["Always self-starting", "Self-starting only on load", "A constant-slip machine"], solution: "It produces no average starting torque and needs auxiliary (e.g. damper-winding) starting." },
  { topic: "Synchronous Machines", difficulty: "medium", stem: "An over-excited synchronous motor draws a current that is:", correct: "Leading (it behaves like a capacitor)", distractors: ["Lagging", "In phase", "Zero"], solution: "Over-excitation makes it draw leading current — used for power-factor correction (synchronous condenser)." },
  // Three-phase
  { topic: "Three-Phase Systems", difficulty: "medium", stem: "In a balanced star connection, the line voltage is related to the phase voltage by:", correct: "VL = √3 Vph", distractors: ["VL = Vph", "VL = Vph/√3", "VL = 3 Vph"], solution: "In star, line voltage leads phase voltage and VL = √3·Vph; line and phase currents are equal." },
  { topic: "Three-Phase Systems", difficulty: "medium", stem: "In a balanced delta connection, the line current is related to the phase current by:", correct: "IL = √3 Iph", distractors: ["IL = Iph", "IL = Iph/√3", "IL = 3 Iph"], solution: "In delta, line and phase voltages are equal and IL = √3·Iph." },
  { topic: "Three-Phase Systems", difficulty: "medium", stem: "Total power in a balanced 3-phase load is:", correct: "√3 VL IL cos φ", distractors: ["VL IL cos φ", "3 VL IL cos φ", "√3 VL IL"], solution: "P = √3·VL·IL·cos φ in terms of line quantities." },
  // Power systems
  { topic: "Power Systems", difficulty: "easy", stem: "Electrical power is transmitted at high voltage mainly to:", correct: "Reduce I²R line losses", distractors: ["Increase the current", "Make insulation cheaper", "Raise the frequency"], solution: "For a given power, higher voltage means lower current, so I²R losses fall." },
  { topic: "Power Systems", difficulty: "medium", stem: "The skin effect in an AC conductor causes:", correct: "Current to crowd toward the surface, raising effective resistance", distractors: ["Current to crowd at the centre", "Resistance to fall with frequency", "No change with frequency"], solution: "At higher frequency current concentrates near the surface, increasing the effective AC resistance." },
  { topic: "Power Systems", difficulty: "medium", stem: "Power-factor improvement of an inductive load is usually done by connecting:", correct: "A capacitor in parallel", distractors: ["An inductor in series", "A resistor in parallel", "A diode in series"], solution: "A shunt capacitor supplies leading reactive power, raising the lagging power factor." },
  { topic: "Power Systems", difficulty: "medium", stem: "Corona discharge on a transmission line increases with:", correct: "Higher voltage and rough/thin conductors", distractors: ["Lower voltage", "Smoother fat conductors", "Lower humidity only"], solution: "Corona worsens as surface gradient rises (higher voltage, thinner or rough conductors, bad weather)." },
  // Measurements & electronics
  { topic: "Measurements", difficulty: "medium", stem: "A PMMC (permanent-magnet moving-coil) instrument can directly measure:", correct: "DC quantities only", distractors: ["AC quantities only", "Both AC and DC directly", "Only frequency"], solution: "PMMC responds to average value; on AC the average is zero, so it reads DC directly (needs a rectifier for AC)." },
  { topic: "Measurements", difficulty: "medium", stem: "A moving-iron instrument can measure:", correct: "Both AC and DC", distractors: ["DC only", "AC only", "Neither"], solution: "Deflection depends on the square of current, so it works on both AC and DC." },
  { topic: "Measurements", difficulty: "medium", stem: "A current transformer (CT) secondary should never be:", correct: "Left open-circuited while energised", distractors: ["Short-circuited", "Earthed", "Connected to an ammeter"], solution: "An open CT secondary produces a dangerously high voltage and core saturation; it must be shorted if the meter is removed." },
  { topic: "Power Electronics", difficulty: "easy", stem: "A diode conducts when it is:", correct: "Forward biased", distractors: ["Reverse biased", "Unbiased", "At zero current"], solution: "A diode conducts in forward bias and blocks in reverse bias (ideally)." },
  { topic: "Power Electronics", difficulty: "medium", stem: "A thyristor (SCR) is turned ON by:", correct: "A gate pulse while forward biased", distractors: ["Removing the gate signal", "Reverse biasing it", "Cooling it"], solution: "A gate current triggers the SCR into conduction when the anode is positive; it then latches." },
  { topic: "Control Systems", difficulty: "medium", stem: "Negative feedback in an amplifier generally:", correct: "Reduces gain but increases bandwidth and stability", distractors: ["Increases gain and reduces bandwidth", "Has no effect on bandwidth", "Always causes oscillation"], solution: "Negative feedback trades gain for stability, lower distortion and wider bandwidth (gain–bandwidth product is roughly constant)." },
  { topic: "Control Systems", difficulty: "medium", stem: "The type of a control system is the number of:", correct: "Poles at the origin of the open-loop transfer function", distractors: ["Zeros at the origin", "Finite poles", "Right-half-plane poles"], solution: "System 'type' = number of integrators (s-factors) in the denominator at s = 0." },
  { topic: "Electromagnetics", difficulty: "medium", stem: "Increasing the air gap in a magnetic circuit (other things equal):", correct: "Increases reluctance and reduces flux", distractors: ["Reduces reluctance", "Increases flux", "Has no effect"], solution: "The air gap adds large reluctance (low permeability), so for the same MMF the flux falls." },
  { topic: "Materials", difficulty: "easy", stem: "The most widely used semiconductor material for power devices is:", correct: "Silicon", distractors: ["Copper", "Germanium", "Aluminium"], solution: "Silicon dominates because of its stable oxide, temperature tolerance and cost." },
  { topic: "Illumination", difficulty: "easy", stem: "The SI unit of luminous flux is the:", correct: "Lumen", distractors: ["Lux", "Candela", "Watt"], solution: "Luminous flux is measured in lumens; illuminance (lumen/m²) is the lux." },
  // Hard base/medium boundary extras
  { topic: "Earthing", difficulty: "easy", stem: "The main purpose of earthing the metal body of an appliance is:", correct: "Safety of personnel against electric shock", distractors: ["To improve efficiency", "To increase voltage", "To reduce frequency"], solution: "Earthing gives fault current a low-resistance path and keeps exposed metal near earth potential, protecting users." },
  { topic: "Batteries", difficulty: "easy", stem: "The EMF of a single lead-acid cell is about:", correct: "2 V", distractors: ["1.2 V", "1.5 V", "12 V"], solution: "A lead-acid cell gives ~2 V; a 12 V battery uses six cells in series." },
  { topic: "Tariff", difficulty: "medium", stem: "The 'maximum demand' charge in a two-part tariff is based on:", correct: "The peak kVA/kW the consumer draws", distractors: ["Total energy consumed", "The power factor only", "The number of appliances"], solution: "A two-part tariff has a fixed charge tied to maximum demand plus an energy charge per kWh." },
];

// ─── Hard Electrical theory (conceptual, multi-idea) ─────────────────────────
const ELEC_HARD_THEORY: FactQ[] = [
  { topic: "AC Power", difficulty: "hard", stem: "In the two-wattmeter method on a balanced 3-phase load, the two readings are equal when the power factor is:", correct: "Unity", distractors: ["Zero", "0.5", "0.866"], solution: "At unity pf the phase angle is zero and both wattmeters read equal positive power; at pf 0.5 one reads zero." },
  { topic: "AC Power", difficulty: "hard", stem: "If one wattmeter in the two-wattmeter method reads zero, the load power factor is:", correct: "0.5", distractors: ["1.0", "0", "0.866"], solution: "W₂ = VLIL cos(30°+φ) = 0 when 30°+φ = 90°, i.e. φ = 60°, pf = cos60° = 0.5." },
  { topic: "Network Theorems", difficulty: "hard", stem: "For maximum power transfer to a complex load ZL from a source of impedance Zth, ZL must equal:", correct: "The complex conjugate Zth*", distractors: ["Zth", "−Zth", "|Zth|"], solution: "With a reactive source, maximum power needs ZL = Zth* so the reactances cancel and resistances match." },
  { topic: "Network Theorems", difficulty: "hard", stem: "Tellegen's theorem is based fundamentally on:", correct: "Kirchhoff's laws (topology) alone", distractors: ["Only linear elements", "Only resistive elements", "Energy storage elements"], solution: "Tellegen's theorem holds for any lumped network satisfying KVL/KCL, regardless of element nature." },
  { topic: "Transmission Lines", difficulty: "hard", stem: "The Ferranti effect on a long, lightly loaded transmission line means:", correct: "Receiving-end voltage exceeds sending-end voltage", distractors: ["Sending-end voltage exceeds receiving-end voltage", "Voltage is uniform", "Current is zero everywhere"], solution: "Line capacitance draws leading current that raises the receiving-end voltage above the sending end under light load." },
  { topic: "Fault Analysis", difficulty: "hard", stem: "For a single line-to-ground fault, the three sequence networks are connected in:", correct: "Series", distractors: ["Parallel", "Series-parallel", "Not connected"], solution: "An LG fault connects positive, negative and zero sequence networks in series." },
  { topic: "Two-Port Networks", difficulty: "hard", stem: "For a reciprocal two-port described by ABCD parameters, the condition satisfied is:", correct: "AD − BC = 1", distractors: ["AD − BC = 0", "A + D = 1", "AB − CD = 1"], solution: "Reciprocity of a passive two-port gives the determinant AD − BC = 1." },
  { topic: "Induction Motors", difficulty: "hard", stem: "An induction motor develops maximum torque when the rotor resistance per phase equals:", correct: "The standstill rotor reactance times the slip (R₂ = sX₂)", distractors: ["The stator resistance", "Zero", "The magnetizing reactance"], solution: "Maximum torque occurs at the slip where R₂ = sX₂; the peak torque itself is independent of R₂." },
  { topic: "Induction Motors", difficulty: "hard", stem: "In an induction motor, the rotor copper loss equals:", correct: "Slip × air-gap power", distractors: ["(1 − slip) × air-gap power", "Air-gap power", "Slip × mechanical power"], solution: "Of the air-gap power Pag, a fraction s is dissipated as rotor copper loss and (1 − s) becomes mechanical power." },
  { topic: "Synchronous Machines", difficulty: "hard", stem: "The V-curve of a synchronous motor is a plot of:", correct: "Armature current versus field current at constant load", distractors: ["Torque versus speed", "Voltage versus current", "Power versus slip"], solution: "Varying field excitation at fixed load traces a V-shaped armature-current curve, minimum at unity pf." },
  { topic: "Control Systems", difficulty: "hard", stem: "Adding a pole to the open-loop transfer function generally:", correct: "Reduces stability and makes the response more oscillatory", distractors: ["Improves stability", "Has no effect on stability", "Removes steady-state error"], solution: "An extra pole adds phase lag, pushing the root locus toward the right half-plane and reducing stability margins." },
  { topic: "Control Systems", difficulty: "hard", stem: "The Routh–Hurwitz criterion is used to determine:", correct: "The number of closed-loop poles in the right half-plane", distractors: ["The exact pole locations", "The steady-state error", "The bandwidth"], solution: "Sign changes in the first column of the Routh array count the RHP poles (unstable roots)." },
  { topic: "Power Electronics", difficulty: "hard", stem: "For an ideal buck (step-down) DC–DC converter in continuous conduction, the output voltage is:", correct: "D × Vs (D = duty ratio)", distractors: ["Vs/D", "Vs/(1−D)", "(1−D)Vs"], solution: "A buck converter gives Vo = D·Vs; the boost converter gives Vs/(1−D)." },
  { topic: "Power Electronics", difficulty: "hard", stem: "The holding current of a thyristor is:", correct: "The minimum anode current to keep it conducting after the gate is removed", distractors: ["The current needed to latch it on", "The reverse leakage current", "The gate trigger current"], solution: "Holding current keeps an already-on SCR conducting; latching current (larger) is needed to turn it on." },
  { topic: "Measurements", difficulty: "hard", stem: "A wattmeter reads zero on a purely reactive (inductive or capacitive) load because:", correct: "The average of v·i over a cycle is zero", distractors: ["The current is zero", "The voltage is zero", "The meter is faulty"], solution: "Pure reactance gives a 90° phase shift; instantaneous power averages to zero over a cycle, so real power is zero." },
  { topic: "Transformers", difficulty: "hard", stem: "An auto-transformer is more economical than a two-winding transformer mainly because:", correct: "Part of the power is transferred conductively, saving copper", distractors: ["It has no losses", "It needs no core", "It only works on DC"], solution: "In an auto-transformer only part of the power is transformed inductively; the conductive path reduces copper and size, best for ratios near 1." },
  { topic: "Electromagnetics", difficulty: "hard", stem: "Eddy-current loss in a magnetic core varies with frequency f and flux density Bm as:", correct: "Proportional to f²Bm²", distractors: ["Proportional to fBm", "Proportional to f Bm^1.6", "Independent of frequency"], solution: "Eddy loss ∝ f²Bm²t² (lamination thickness t); hysteresis loss ∝ f·Bm^1.6 (Steinmetz)." },
];

// ─── Tricky / conceptual Electrical pool (Advanced sets 11–15) ───────────────
const ELEC_TRICKY_POOL: FactQ[] = [
  { topic: "AC Circuits", difficulty: "hard", stem: "If the supply frequency to a fixed RL series circuit is doubled, which statement is INCORRECT?", correct: "The resistance R doubles.", distractors: ["The inductive reactance doubles.", "The impedance increases.", "The power factor becomes more lagging."], solution: "Resistance is independent of frequency; only XL = 2πfL changes, so 'R doubles' is false." },
  { topic: "Resonance", difficulty: "hard", stem: "Comparing series and parallel RLC resonance, which statement is correct?", correct: "Series resonance gives minimum impedance; parallel (anti-)resonance gives maximum impedance.", distractors: ["Both give minimum impedance.", "Series gives maximum impedance.", "Parallel gives zero impedance."], solution: "Series resonance → minimum Z (max current); ideal parallel resonance → maximum Z (min line current)." },
  { topic: "Power Factor", difficulty: "hard", stem: "When a capacitor is added to correct the power factor of an inductive load, which statement is INCORRECT?", correct: "The real power (kW) drawn by the load increases.", distractors: ["The line current decreases.", "The reactive power drawn from the supply decreases.", "The apparent power (kVA) decreases."], solution: "Power-factor correction leaves the load's real power unchanged; it only reduces reactive power, current and kVA." },
  { topic: "Transformers", difficulty: "hard", stem: "Why can a transformer not step up a DC voltage?", correct: "Steady DC produces no changing flux, so no EMF is induced in the secondary.", distractors: ["DC has too high a frequency.", "The core saturates instantly for all DC.", "DC cannot flow through copper windings."], solution: "Transformer action needs dΦ/dt; constant DC gives zero rate of change and hence zero secondary EMF." },
  { topic: "DC Machines", difficulty: "hard", stem: "Two identical resistors are connected first in series and then in parallel across the same battery. Which is correct?", correct: "The parallel combination dissipates four times the power of the series combination.", distractors: ["The series combination dissipates more power.", "Both dissipate equal power.", "Power cannot be compared."], solution: "Series R_eq = 2R (P = V²/2R); parallel R_eq = R/2 (P = 2V²/R) — four times greater for the same voltage." },
  { topic: "Synchronous Machines", difficulty: "hard", stem: "Regarding a synchronous motor, which statement is INCORRECT?", correct: "It is inherently self-starting from rest.", distractors: ["Over-excitation makes it draw leading current.", "It runs at exactly synchronous speed in steady state.", "It can be used to improve system power factor."], solution: "A synchronous motor produces no net starting torque at standstill, so it is not self-starting." },
  { topic: "Induction Motors", difficulty: "hard", stem: "As the slip of an induction motor increases beyond the value at maximum torque, the developed torque:", correct: "Decreases", distractors: ["Keeps increasing", "Stays constant", "Becomes zero immediately"], solution: "Torque rises with slip up to the breakdown point, then falls as slip increases further (the unstable region)." },
  { topic: "Network Theorems", difficulty: "hard", stem: "Under maximum power transfer conditions, the efficiency of power transfer is:", correct: "50%", distractors: ["100%", "75%", "25%"], solution: "With RL = Rth, equal power is lost in Rth and delivered to RL, so efficiency is only 50%." },
  { topic: "Sources", difficulty: "hard", stem: "Which statement about ideal sources is INCORRECT?", correct: "An ideal current source has zero internal resistance.", distractors: ["An ideal voltage source has zero internal resistance.", "An ideal current source has infinite internal resistance.", "An ideal voltage source maintains its voltage for any load current."], solution: "An ideal current source has infinite internal resistance; zero internal resistance describes an ideal voltage source." },
  { topic: "Op-Amps", difficulty: "hard", stem: "Which property does an ideal operational amplifier NOT have?", correct: "Zero open-loop gain", distractors: ["Infinite input impedance", "Zero output impedance", "Infinite open-loop gain"], solution: "An ideal op-amp has infinite (not zero) open-loop gain, infinite input impedance and zero output impedance." },
  { topic: "Feedback", difficulty: "hard", stem: "Applying negative feedback to an amplifier, which statement is INCORRECT?", correct: "It increases the closed-loop gain.", distractors: ["It increases bandwidth.", "It reduces distortion.", "It stabilises the gain against parameter changes."], solution: "Negative feedback reduces gain (trading it for bandwidth, lower distortion and stability)." },
  { topic: "Filters", difficulty: "hard", stem: "For a first-order RC low-pass filter, which statement is correct?", correct: "Above the cutoff frequency the gain rolls off at 20 dB/decade.", distractors: ["It passes high frequencies and blocks low ones.", "The cutoff is at 1/(RC) hertz.", "The roll-off is 40 dB/decade."], solution: "A first-order low-pass passes low frequencies; cutoff fc = 1/(2πRC) and roll-off is 20 dB/decade (single pole)." },
  { topic: "Three-Phase Systems", difficulty: "hard", stem: "In a balanced 3-phase star system, which statement is INCORRECT?", correct: "The line current is √3 times the phase current.", distractors: ["The line voltage is √3 times the phase voltage.", "Line and phase currents are equal.", "Line voltage leads its nearest phase voltage by 30°."], solution: "In star, line and phase currents are equal; the √3 factor applies to voltages, not currents." },
  { topic: "Transmission Lines", difficulty: "hard", stem: "A long transmission line is operated on no load. Which is correct?", correct: "The receiving-end voltage rises above the sending-end voltage (Ferranti effect).", distractors: ["The receiving-end voltage falls to zero.", "Both ends have equal voltage.", "The sending-end voltage rises above the receiving end."], solution: "Charging current through the line inductance raises the open-end voltage above the sending end (Ferranti effect)." },
  { topic: "Reactive Power", difficulty: "hard", stem: "Over one complete cycle, the average power absorbed by a pure inductor is:", correct: "Zero", distractors: ["Maximum", "½LI²", "Equal to I²R"], solution: "An inductor stores and returns energy; net real power over a cycle is zero (it only exchanges reactive power)." },
  { topic: "Magnetic Circuits", difficulty: "hard", stem: "Introducing a small air gap into an iron-cored magnetic circuit, which statement is INCORRECT?", correct: "The total reluctance decreases.", distractors: ["The total reluctance increases.", "The flux decreases for the same MMF.", "The inductance of a coil on it decreases."], solution: "An air gap adds large reluctance (low permeability), so total reluctance rises and flux/inductance fall." },
  { topic: "Skin Effect", difficulty: "hard", stem: "Which statement about skin effect is correct?", correct: "Effective AC resistance of a conductor increases with frequency.", distractors: ["It reduces resistance at high frequency.", "It occurs only in DC.", "It makes current flow at the conductor centre."], solution: "Skin effect crowds AC current toward the surface, reducing the effective area and raising AC resistance with frequency." },
  { topic: "Diodes", difficulty: "hard", stem: "Comparing an ideal and a real silicon diode in reverse bias, which is correct?", correct: "The real diode carries a small reverse leakage current while the ideal one carries none.", distractors: ["Both carry large reverse current.", "The ideal diode carries more reverse current.", "Neither blocks reverse voltage."], solution: "An ideal diode blocks perfectly in reverse; a real diode has a small temperature-dependent leakage (saturation) current." },
  { topic: "Transformers", difficulty: "hard", stem: "The no-load current of a transformer is small and highly reactive because:", correct: "It mainly supplies the magnetizing reactive power, with little core loss component", distractors: ["It supplies the full load power", "The primary is open", "The core has no reluctance"], solution: "No-load current is the magnetizing current plus a small loss component, so it is small and lags by nearly 90°." },
  { topic: "DC Machines", difficulty: "hard", stem: "When the field flux of a separately excited DC motor is weakened (armature voltage constant), the speed:", correct: "Increases", distractors: ["Decreases", "Stays the same", "Becomes zero"], solution: "Since N ∝ (V − IaRa)/φ, reducing flux φ raises the speed (the basis of field-weakening control)." },
  { topic: "Per-Unit System", difficulty: "hard", stem: "A key advantage of the per-unit system in power analysis is that:", correct: "Transformer turns ratios disappear when a common base is chosen", distractors: ["It removes all losses", "It eliminates reactive power", "Voltages become zero"], solution: "With consistent bases, per-unit impedances are the same on both sides of a transformer, simplifying calculations." },
  { topic: "Earthing", difficulty: "hard", stem: "Which statement about system earthing is INCORRECT?", correct: "Earthing increases the touch voltage on equipment during a fault.", distractors: ["It provides a low-impedance path for fault current.", "It helps protective devices operate quickly.", "It keeps exposed metal near earth potential."], solution: "Proper earthing reduces (not increases) touch voltage by holding metalwork near earth potential and clearing faults fast." },
  { topic: "Power Quality", difficulty: "hard", stem: "Harmonics in a power system are primarily produced by:", correct: "Non-linear loads such as rectifiers and arc furnaces", distractors: ["Purely resistive heaters", "Ideal transformers", "Balanced linear loads"], solution: "Non-linear loads draw non-sinusoidal current, injecting harmonic frequencies into the supply." },
  { topic: "Energy", difficulty: "hard", stem: "A 100 W bulb and a 60 W bulb (rated 230 V) are connected in series across 230 V. Which glows brighter?", correct: "The 60 W bulb", distractors: ["The 100 W bulb", "Both equally", "Neither glows"], solution: "The 60 W bulb has higher resistance, so in series it drops more voltage and dissipates more power — it glows brighter." },
];

// ─── Parametric Electrical numerical generators (computed answers) ───────────
const ELEC_NUM_GENERATORS: SpecGen[] = [
  // Series resistance
  (rand) => {
    const a = pick(rand, [3, 4, 5, 6, 8]);
    const b = pick(rand, [2, 7, 9, 10, 12]);
    return {
      topic: "DC Circuits", difficulty: "easy",
      stem: `Two resistors of ${a} Ω and ${b} Ω are connected in series. The equivalent resistance is:`,
      correct: `${a + b} Ω`, distractors: [`${r2((a * b) / (a + b))} Ω`, `${Math.abs(a - b)} Ω`, `${a + b + 2} Ω`],
      solution: `Series adds: ${a} + ${b} = ${a + b} Ω.`,
    };
  },
  // Parallel resistance
  (rand) => {
    const a = pick(rand, [4, 6, 8, 10, 12]);
    const b = pick(rand, [4, 6, 12, 20, 24]);
    const p = r2((a * b) / (a + b));
    return {
      topic: "DC Circuits", difficulty: "medium",
      stem: `Two resistors of ${a} Ω and ${b} Ω are connected in parallel. The equivalent resistance is:`,
      correct: `${p} Ω`, distractors: [`${a + b} Ω`, `${r2((a + b) / 2)} Ω`, `${r2(p + 1)} Ω`],
      solution: `Parallel = ${a}×${b}/(${a}+${b}) = ${p} Ω.`,
    };
  },
  // Ohm's law current
  (rand) => {
    const v = pick(rand, [12, 24, 48, 60, 100]);
    const r = pick(rand, [4, 6, 8, 10, 12]);
    const i = r2(v / r);
    return {
      topic: "DC Circuits", difficulty: "easy",
      stem: `A ${v} V source drives a ${r} Ω resistor. The current is:`,
      correct: `${i} A`, distractors: [`${r2(v * r)} A`, `${r2(r / v)} A`, `${r2(i + 1)} A`],
      solution: `I = V/R = ${v}/${r} = ${i} A.`,
    };
  },
  // Power I²R
  (rand) => {
    const i = pick(rand, [2, 3, 4, 5]);
    const r = pick(rand, [5, 8, 10, 12]);
    const p = i * i * r;
    return {
      topic: "DC Circuits", difficulty: "medium",
      stem: `A current of ${i} A flows through a ${r} Ω resistor. The power dissipated is:`,
      correct: `${p} W`, distractors: [`${i * r} W`, `${r2(i * i * r * 0.5)} W`, `${p + r} W`],
      solution: `P = I²R = ${i}²×${r} = ${p} W.`,
    };
  },
  // Inductive reactance
  (rand) => {
    const f = pick(rand, [50, 60]);
    const L = pick(rand, [0.01, 0.02, 0.05, 0.1]);
    const xl = r2(2 * Math.PI * f * L);
    return {
      topic: "AC Circuits", difficulty: "medium",
      stem: `The inductive reactance of a ${L} H inductor at ${f} Hz is about:`,
      correct: `${xl} Ω`, distractors: [`${r2(xl / 2)} Ω`, `${r2(xl * 2)} Ω`, `${r2(f * L)} Ω`],
      solution: `XL = 2πfL = 2π×${f}×${L} ≈ ${xl} Ω.`,
    };
  },
  // Capacitive reactance
  (rand) => {
    const f = pick(rand, [50, 60]);
    const C = pick(rand, [50, 100, 200]); // µF
    const xc = r2(1 / (2 * Math.PI * f * C * 1e-6));
    return {
      topic: "AC Circuits", difficulty: "medium",
      stem: `The capacitive reactance of a ${C} µF capacitor at ${f} Hz is about:`,
      correct: `${xc} Ω`, distractors: [`${r2(xc * 2)} Ω`, `${r2(xc / 2)} Ω`, `${r2(xc + 10)} Ω`],
      solution: `XC = 1/(2πfC) = 1/(2π×${f}×${C}µF) ≈ ${xc} Ω.`,
    };
  },
  // Impedance of RL
  (rand) => {
    const r = pick(rand, [3, 6, 8, 9]);
    const x = pick(rand, [4, 8, 6, 12]);
    const z = r2(Math.sqrt(r * r + x * x));
    return {
      topic: "AC Circuits", difficulty: "medium",
      stem: `A coil has resistance ${r} Ω and reactance ${x} Ω. Its impedance magnitude is:`,
      correct: `${z} Ω`, distractors: [`${r + x} Ω`, `${r2((r + x) / 2)} Ω`, `${r2(z + 1)} Ω`],
      solution: `Z = √(R² + X²) = √(${r}² + ${x}²) = ${z} Ω.`,
    };
  },
  // Power factor from R/Z
  (rand) => {
    const r = pick(rand, [3, 6, 8, 9]);
    const x = pick(rand, [4, 8, 6, 12]);
    const z = Math.sqrt(r * r + x * x);
    const pf = r2(r / z);
    return {
      topic: "AC Circuits", difficulty: "medium",
      stem: `For a load with R = ${r} Ω and reactance X = ${x} Ω, the power factor is:`,
      correct: `${pf}`, distractors: [`${r2(x / z)}`, `${r2(r / x)}`, `${r2(pf + 0.1)}`],
      solution: `pf = cos φ = R/Z = ${r}/${r2(z)} = ${pf}.`,
    };
  },
  // RMS from peak
  (rand) => {
    const vm = pick(rand, [100, 141, 200, 311, 325]);
    const rms = r1(vm / Math.SQRT2);
    return {
      topic: "AC Fundamentals", difficulty: "easy",
      stem: `A sinusoidal voltage has a peak value of ${vm} V. Its RMS value is about:`,
      correct: `${rms} V`, distractors: [`${r1(vm * Math.SQRT2)} V`, `${r1(vm / 2)} V`, `${r1(vm * 0.637)} V`],
      solution: `RMS = Vm/√2 = ${vm}/1.414 ≈ ${rms} V.`,
    };
  },
  // Synchronous speed
  (rand) => {
    const f = pick(rand, [50, 60]);
    const P = pick(rand, [2, 4, 6, 8]);
    const ns = (120 * f) / P;
    return {
      topic: "Induction Motors", difficulty: "easy",
      stem: `The synchronous speed of a ${P}-pole machine on a ${f} Hz supply is:`,
      correct: `${ns} rpm`, distractors: [`${(60 * f) / P} rpm`, `${(120 * P) / f} rpm`, `${ns + 100} rpm`],
      solution: `Ns = 120f/P = 120×${f}/${P} = ${ns} rpm.`,
    };
  },
  // Slip
  (rand) => {
    const f = pick(rand, [50, 60]);
    const P = pick(rand, [4, 6]);
    const ns = (120 * f) / P;
    const N = ns - pick(rand, [30, 45, 60, 75]);
    const s = r2(((ns - N) / ns) * 100);
    return {
      topic: "Induction Motors", difficulty: "medium",
      stem: `A ${P}-pole, ${f} Hz induction motor runs at ${N} rpm. Its slip is about:`,
      correct: `${s}%`, distractors: [`${r2(s + 1)}%`, `${r2(s * 2)}%`, `${r2(s / 2)}%`],
      solution: `Ns = ${ns} rpm; s = (Ns − N)/Ns = (${ns} − ${N})/${ns} = ${s}%.`,
    };
  },
  // Transformer secondary voltage
  (rand) => {
    const v1 = pick(rand, [230, 400, 1100]);
    const n1 = pick(rand, [100, 200, 500]);
    const n2 = pick(rand, [50, 400, 1000]);
    const v2 = r1((v1 * n2) / n1);
    return {
      topic: "Transformers", difficulty: "easy",
      stem: `A transformer with ${n1} primary and ${n2} secondary turns is fed ${v1} V. The secondary voltage is:`,
      correct: `${v2} V`, distractors: [`${r1((v1 * n1) / n2)} V`, `${r1(v1)} V`, `${r1(v2 + 10)} V`],
      solution: `V₂ = V₁·N₂/N₁ = ${v1}×${n2}/${n1} = ${v2} V.`,
    };
  },
  // Three-phase power
  (rand) => {
    const vl = pick(rand, [400, 415, 440]);
    const il = pick(rand, [10, 15, 20, 25]);
    const pf = pick(rand, [0.8, 0.85, 0.9]);
    const p = r1(Math.sqrt(3) * vl * il * pf / 1000);
    return {
      topic: "Three-Phase Systems", difficulty: "medium",
      stem: `A balanced 3-phase load draws ${il} A at ${vl} V line, pf ${pf}. The total power is about:`,
      correct: `${p} kW`, distractors: [`${r1((vl * il * pf) / 1000)} kW`, `${r1((3 * vl * il * pf) / 1000)} kW`, `${r1(p + 2)} kW`],
      solution: `P = √3·VL·IL·cosφ = 1.732×${vl}×${il}×${pf} ≈ ${p} kW.`,
    };
  },
  // Resonant frequency
  (rand) => {
    const L = pick(rand, [0.1, 0.2, 0.5]); // H
    const C = pick(rand, [10, 40, 100]); // µF
    const f0 = r1(1 / (2 * Math.PI * Math.sqrt(L * C * 1e-6)));
    return {
      topic: "Resonance", difficulty: "medium",
      stem: `A series circuit has L = ${L} H and C = ${C} µF. Its resonant frequency is about:`,
      correct: `${f0} Hz`, distractors: [`${r1(f0 * 2)} Hz`, `${r1(f0 / 2)} Hz`, `${r1(f0 + 20)} Hz`],
      solution: `f₀ = 1/(2π√(LC)) = 1/(2π√(${L}×${C}µF)) ≈ ${f0} Hz.`,
    };
  },
  // Energy in capacitor
  (rand) => {
    const C = pick(rand, [100, 200, 470, 1000]); // µF
    const V = pick(rand, [10, 20, 50, 100]);
    const E = r2(0.5 * C * 1e-6 * V * V);
    return {
      topic: "Electrostatics", difficulty: "medium",
      stem: `The energy stored in a ${C} µF capacitor charged to ${V} V is:`,
      correct: `${E} J`, distractors: [`${r2(E * 2)} J`, `${r2(C * 1e-6 * V)} J`, `${r2(E / 2)} J`],
      solution: `E = ½CV² = 0.5×${C}µF×${V}² = ${E} J.`,
    };
  },
  // Resistivity / resistance of wire
  (rand) => {
    const rho = 1.7e-8; // copper
    const L = pick(rand, [100, 200, 500]); // m
    const A = pick(rand, [1, 2, 4]); // mm²
    const R = r2((rho * L) / (A * 1e-6));
    return {
      topic: "DC Circuits", difficulty: "medium",
      stem: `A copper wire (ρ = 1.7×10⁻⁸ Ω·m) is ${L} m long with ${A} mm² cross-section. Its resistance is about:`,
      correct: `${R} Ω`, distractors: [`${r2(R * 2)} Ω`, `${r2(R / 2)} Ω`, `${r2(R + 0.5)} Ω`],
      solution: `R = ρL/A = 1.7e-8×${L}/(${A}×10⁻⁶) ≈ ${R} Ω.`,
    };
  },
];

// ─── Hard Electrical numerical generators (multi-step) ───────────────────────
const ELEC_HARD_NUM: SpecGen[] = [
  // Two-wattmeter power
  (rand) => {
    const w1 = pick(rand, [800, 1000, 1200]);
    const w2 = pick(rand, [200, 300, 400]);
    const total = w1 + w2;
    return {
      topic: "AC Power", difficulty: "hard",
      stem: `In the two-wattmeter method the readings are W₁ = ${w1} W and W₂ = ${w2} W. The total 3-phase power is:`,
      correct: `${total} W`, distractors: [`${w1 - w2} W`, `${r2(total / 2)} W`, `${r2(Math.sqrt(3) * (w1 - w2))} W`],
      solution: `Total power = W₁ + W₂ = ${w1} + ${w2} = ${total} W (the difference relates to reactive power).`,
    };
  },
  // Series RLC current at given Z
  (rand) => {
    const r = pick(rand, [6, 8, 10]);
    const xl = pick(rand, [12, 16, 20]);
    const xc = pick(rand, [4, 8, 12]);
    const z = r2(Math.sqrt(r * r + (xl - xc) ** 2));
    const v = pick(rand, [100, 200, 240]);
    const i = r2(v / z);
    return {
      topic: "AC Circuits", difficulty: "hard",
      stem: `A series circuit has R = ${r} Ω, XL = ${xl} Ω, XC = ${xc} Ω across ${v} V. The current is about:`,
      correct: `${i} A`, distractors: [`${r2(v / (r + xl + xc))} A`, `${r2(v / r)} A`, `${r2(i + 1)} A`],
      solution: `Z = √(R² + (XL−XC)²) = √(${r}² + ${xl - xc}²) = ${z} Ω; I = V/Z = ${v}/${z} = ${i} A.`,
    };
  },
  // Max power transfer
  (rand) => {
    const vth = pick(rand, [12, 20, 24, 40]);
    const rth = pick(rand, [2, 4, 5, 8]);
    const pmax = r2((vth * vth) / (4 * rth));
    return {
      topic: "Network Theorems", difficulty: "hard",
      stem: `A source has Vth = ${vth} V and Rth = ${rth} Ω. The maximum power deliverable to a matched load is:`,
      correct: `${pmax} W`, distractors: [`${r2((vth * vth) / rth)} W`, `${r2((vth * vth) / (2 * rth))} W`, `${r2(pmax + 2)} W`],
      solution: `Pmax = Vth²/(4Rth) = ${vth}²/(4×${rth}) = ${pmax} W (load = Rth, efficiency 50%).`,
    };
  },
  // Transformer efficiency
  (rand) => {
    const out = pick(rand, [10, 20, 50]); // kW
    const iron = pick(rand, [0.2, 0.3, 0.5]);
    const cu = pick(rand, [0.3, 0.4, 0.6]);
    const eff = r2((out / (out + iron + cu)) * 100);
    return {
      topic: "Transformers", difficulty: "hard",
      stem: `A transformer delivers ${out} kW with iron loss ${iron} kW and copper loss ${cu} kW. Its efficiency is about:`,
      correct: `${eff}%`, distractors: [`${r2(eff - 2)}%`, `${r2(eff + 1.5)}%`, `${r2((out / (out + iron)) * 100)}%`],
      solution: `η = output/(output + losses) = ${out}/(${out}+${iron}+${cu}) = ${eff}%.`,
    };
  },
  // Rotor copper loss = s × airgap power
  (rand) => {
    const pag = pick(rand, [10, 20, 30]); // kW
    const s = pick(rand, [0.03, 0.04, 0.05]);
    const rcl = r2(s * pag * 1000);
    return {
      topic: "Induction Motors", difficulty: "hard",
      stem: `An induction motor has air-gap power ${pag} kW and slip ${s}. The rotor copper loss is:`,
      correct: `${rcl} W`, distractors: [`${r2((1 - s) * pag * 1000)} W`, `${r2(pag * 1000)} W`, `${r2(rcl * 2)} W`],
      solution: `Rotor copper loss = s × Pag = ${s} × ${pag} kW = ${rcl} W.`,
    };
  },
  // Voltage divider
  (rand) => {
    const v = pick(rand, [12, 24, 48]);
    const r1v = pick(rand, [2, 4, 6]);
    const r2v = pick(rand, [4, 8, 6]);
    const vout = r2((v * r2v) / (r1v + r2v));
    return {
      topic: "DC Circuits", difficulty: "hard",
      stem: `In a divider, ${v} V is applied across ${r1v} Ω and ${r2v} Ω in series. The voltage across the ${r2v} Ω resistor is:`,
      correct: `${vout} V`, distractors: [`${r2((v * r1v) / (r1v + r2v))} V`, `${r2(v / 2)} V`, `${r2(vout + 1)} V`],
      solution: `Vout = V·R₂/(R₁+R₂) = ${v}×${r2v}/(${r1v}+${r2v}) = ${vout} V.`,
    };
  },
  // Quality factor of series RLC
  (rand) => {
    const r = pick(rand, [5, 10, 20]);
    const L = pick(rand, [0.1, 0.2]);
    const C = pick(rand, [10, 40, 100]); // µF
    const Q = r2((1 / r) * Math.sqrt(L / (C * 1e-6)));
    return {
      topic: "Resonance", difficulty: "hard",
      stem: `A series RLC circuit has R = ${r} Ω, L = ${L} H, C = ${C} µF. Its quality factor Q is about:`,
      correct: `${Q}`, distractors: [`${r2(Q * 2)}`, `${r2(Q / 2)}`, `${r2(Q + 1)}`],
      solution: `Q = (1/R)·√(L/C) = (1/${r})·√(${L}/${C}µF) ≈ ${Q}.`,
    };
  },
  // DC motor back EMF
  (rand) => {
    const v = pick(rand, [220, 230, 240]);
    const ia = pick(rand, [10, 15, 20]);
    const ra = pick(rand, [0.5, 0.8, 1.0]);
    const eb = r2(v - ia * ra);
    return {
      topic: "DC Machines", difficulty: "hard",
      stem: `A DC motor on ${v} V draws ${ia} A with armature resistance ${ra} Ω. The back EMF is:`,
      correct: `${eb} V`, distractors: [`${r2(v + ia * ra)} V`, `${r2(v)} V`, `${r2(eb - 5)} V`],
      solution: `Eb = V − Ia·Ra = ${v} − ${ia}×${ra} = ${eb} V.`,
    };
  },
];

// ─── Graphical (SVG) Electrical figure generators ────────────────────────────
const svg = (markup: string): { kind: "svg"; markup: string } => ({ kind: "svg", markup });

const ELEC_FIGURE_GENERATORS: ((rand: () => number) => FactQ)[] = [
  // Series RLC schematic → resonant frequency
  (rand) => {
    const L = pick(rand, [0.1, 0.2, 0.5]);
    const C = pick(rand, [10, 40, 100]);
    const f0 = r1(1 / (2 * Math.PI * Math.sqrt(L * C * 1e-6)));
    const markup = `<svg viewBox="0 0 300 90" width="300" height="90"><line x1="10" y1="45" x2="40" y2="45" stroke="#1e293b" stroke-width="2"/><rect x="40" y="37" width="34" height="16" fill="none" stroke="#2563eb" stroke-width="2"/><text x="57" y="32" font-size="10" text-anchor="middle" fill="#2563eb">R</text><path d="M74 45 q8 -12 16 0 q8 -12 16 0 q8 -12 16 0" fill="none" stroke="#16a34a" stroke-width="2"/><text x="98" y="30" font-size="10" text-anchor="middle" fill="#16a34a">L=${L}H</text><line x1="122" y1="45" x2="150" y2="45" stroke="#1e293b" stroke-width="2"/><line x1="150" y1="35" x2="150" y2="55" stroke="#dc2626" stroke-width="2"/><line x1="158" y1="35" x2="158" y2="55" stroke="#dc2626" stroke-width="2"/><text x="154" y="30" font-size="10" text-anchor="middle" fill="#dc2626">C=${C}µF</text><line x1="158" y1="45" x2="290" y2="45" stroke="#1e293b" stroke-width="2"/><line x1="290" y1="45" x2="290" y2="75" stroke="#1e293b" stroke-width="2"/><line x1="10" y1="45" x2="10" y2="75" stroke="#1e293b" stroke-width="2"/><line x1="10" y1="75" x2="290" y2="75" stroke="#1e293b" stroke-width="2"/><circle cx="150" cy="75" r="3" fill="#1e293b"/><text x="150" y="88" font-size="9" text-anchor="middle" fill="#475569">~ AC source</text></svg>`;
    return {
      topic: "Resonance", difficulty: "hard",
      stem: `For the series RLC circuit shown (L = ${L} H, C = ${C} µF), the resonant frequency is about:`,
      correct: `${f0} Hz`, distractors: [`${r1(f0 * 2)} Hz`, `${r1(f0 / 2)} Hz`, `${r1(f0 + 25)} Hz`],
      solution: `At resonance XL = XC, so f₀ = 1/(2π√(LC)) = 1/(2π√(${L}×${C}µF)) ≈ ${f0} Hz.`,
      figure: { ...svg(markup), caption: "Series RLC circuit" },
    };
  },
  // Resistive voltage divider → Vout
  (rand) => {
    const v = pick(rand, [12, 24, 36]);
    const r1v = pick(rand, [2, 3, 4]);
    const r2v = pick(rand, [4, 6, 8]);
    const vout = r2((v * r2v) / (r1v + r2v));
    const markup = `<svg viewBox="0 0 220 150" width="220" height="150"><line x1="30" y1="20" x2="30" y2="50" stroke="#1e293b" stroke-width="2"/><rect x="22" y="50" width="16" height="34" fill="none" stroke="#2563eb" stroke-width="2"/><text x="50" y="70" font-size="10" fill="#2563eb">R1=${r1v}Ω</text><line x1="30" y1="84" x2="30" y2="100" stroke="#1e293b" stroke-width="2"/><rect x="22" y="100" width="16" height="34" fill="none" stroke="#16a34a" stroke-width="2"/><text x="50" y="120" font-size="10" fill="#16a34a">R2=${r2v}Ω</text><line x1="30" y1="134" x2="30" y2="145" stroke="#1e293b" stroke-width="2"/><circle cx="30" cy="92" r="3" fill="#dc2626"/><text x="40" y="96" font-size="10" fill="#dc2626">Vout</text><text x="35" y="16" font-size="10" fill="#475569">${v}V</text></svg>`;
    return {
      topic: "DC Circuits", difficulty: "medium",
      stem: `In the divider shown (${v} V applied), the output voltage Vout across R2 is:`,
      correct: `${vout} V`, distractors: [`${r2((v * r1v) / (r1v + r2v))} V`, `${r2(v / 2)} V`, `${r2(vout + 1)} V`],
      solution: `Vout = V·R₂/(R₁+R₂) = ${v}×${r2v}/(${r1v}+${r2v}) = ${vout} V.`,
      figure: { ...svg(markup), caption: "Resistive voltage divider" },
    };
  },
  // Sine waveform → RMS
  (rand) => {
    const vm = pick(rand, [100, 200, 311, 325]);
    const rms = r1(vm / Math.SQRT2);
    const markup = `<svg viewBox="0 0 300 120" width="300" height="120"><line x1="10" y1="60" x2="290" y2="60" stroke="#94a3b8" stroke-width="1"/><line x1="20" y1="10" x2="20" y2="110" stroke="#94a3b8" stroke-width="1"/><path d="M20 60 Q 55 0 90 60 T 160 60 T 230 60 T 300 60" fill="none" stroke="#2563eb" stroke-width="2"/><line x1="55" y1="60" x2="55" y2="10" stroke="#dc2626" stroke-width="1" stroke-dasharray="3 2"/><text x="60" y="14" font-size="10" fill="#dc2626">Vm=${vm}V</text><text x="270" y="74" font-size="10" fill="#475569">t</text></svg>`;
    return {
      topic: "AC Fundamentals", difficulty: "easy",
      stem: `The sinusoidal voltage shown has a peak of ${vm} V (marked). Its RMS value is about:`,
      correct: `${rms} V`, distractors: [`${r1(vm)} V`, `${r1(vm / 2)} V`, `${r1(vm * 0.637)} V`],
      solution: `RMS = Vm/√2 = ${vm}/1.414 ≈ ${rms} V.`,
      figure: { ...svg(markup), caption: "Sinusoidal voltage waveform" },
    };
  },
  // Phasor diagram R-L → impedance angle
  (rand) => {
    const r = pick(rand, [3, 4, 6, 8]);
    const x = pick(rand, [4, 3, 8, 6]);
    const ang = r1((Math.atan2(x, r) * 180) / Math.PI);
    const markup = `<svg viewBox="0 0 200 140" width="200" height="140"><line x1="20" y1="120" x2="180" y2="120" stroke="#94a3b8" stroke-width="1"/><line x1="20" y1="120" x2="20" y2="10" stroke="#94a3b8" stroke-width="1"/><line x1="20" y1="120" x2="140" y2="120" stroke="#16a34a" stroke-width="2.5"/><text x="90" y="134" font-size="10" fill="#16a34a">R=${r}Ω</text><line x1="140" y1="120" x2="140" y2="50" stroke="#dc2626" stroke-width="2.5"/><text x="145" y="85" font-size="10" fill="#dc2626">X=${x}Ω</text><line x1="20" y1="120" x2="140" y2="50" stroke="#2563eb" stroke-width="2.5"/><text x="70" y="78" font-size="10" fill="#2563eb">Z</text></svg>`;
    return {
      topic: "AC Circuits", difficulty: "medium",
      stem: `The impedance triangle shown has R = ${r} Ω and X = ${x} Ω. The impedance phase angle is about:`,
      correct: `${ang}°`, distractors: [`${r1(90 - ang)}°`, `${r1(ang + 10)}°`, `${r1(ang / 2)}°`],
      solution: `φ = tan⁻¹(X/R) = tan⁻¹(${x}/${r}) ≈ ${ang}°.`,
      figure: { ...svg(markup), caption: "Impedance triangle (R–X)" },
    };
  },
  // Wheatstone bridge → unknown R at balance
  (rand) => {
    const p = pick(rand, [10, 20, 100]);
    const q = pick(rand, [10, 50, 200]);
    const s = pick(rand, [30, 40, 60]);
    const rx = r2((p * s) / q);
    const markup = `<svg viewBox="0 0 200 160" width="200" height="160"><polygon points="100,20 180,80 100,140 20,80" fill="none" stroke="#475569" stroke-width="1.5"/><text x="55" y="45" font-size="10" fill="#2563eb">P=${p}Ω</text><text x="140" y="45" font-size="10" fill="#2563eb">Q=${q}Ω</text><text x="55" y="120" font-size="10" fill="#16a34a">R=?</text><text x="135" y="120" font-size="10" fill="#16a34a">S=${s}Ω</text><circle cx="100" cy="80" r="9" fill="none" stroke="#dc2626" stroke-width="1.5"/><text x="100" y="84" font-size="9" text-anchor="middle" fill="#dc2626">G</text></svg>`;
    return {
      topic: "Measurements", difficulty: "hard",
      stem: `The balanced Wheatstone bridge shown has P = ${p} Ω, Q = ${q} Ω and S = ${s} Ω (galvanometer reads zero). The unknown resistance R is:`,
      correct: `${rx} Ω`, distractors: [`${r2((q * s) / p)} Ω`, `${r2((p * q) / s)} Ω`, `${r2(rx + 5)} Ω`],
      solution: `At balance P/Q = R/S, so R = P·S/Q = ${p}×${s}/${q} = ${rx} Ω.`,
      figure: { ...svg(markup), caption: "Wheatstone bridge" },
    };
  },
  // Resonance curve (current vs frequency) → resonant frequency
  (rand) => {
    const f0 = pick(rand, [50, 60, 100, 159]);
    const markup = `<svg viewBox="0 0 300 130" width="300" height="130"><line x1="20" y1="110" x2="290" y2="110" stroke="#94a3b8" stroke-width="1"/><line x1="20" y1="15" x2="20" y2="110" stroke="#94a3b8" stroke-width="1"/><path d="M20 108 C 110 105 140 20 160 20 C 180 20 210 105 290 108" fill="none" stroke="#2563eb" stroke-width="2"/><line x1="160" y1="20" x2="160" y2="110" stroke="#dc2626" stroke-width="1" stroke-dasharray="3 2"/><text x="160" y="124" font-size="10" text-anchor="middle" fill="#dc2626">f₀</text><text x="26" y="20" font-size="10" fill="#475569">I</text><text x="278" y="124" font-size="10" fill="#475569">f</text></svg>`;
    return {
      topic: "Resonance", difficulty: "medium",
      stem: `The current-versus-frequency curve of a series RLC circuit peaks at the marked frequency f₀ ≈ ${f0} Hz. At this resonant frequency the power factor is:`,
      correct: `Unity`, distractors: [`Zero`, `0.5 lagging`, `0.707 leading`],
      solution: `At series resonance XL = XC, the impedance is purely resistive and current peaks, so the power factor is unity. (Here f₀ ≈ ${f0} Hz.)`,
      figure: { ...svg(markup), caption: "Series-resonance current curve" },
    };
  },
];

// ─── Paper-II assembly (60 theory + 40 numerical, 3:2 interleave) ────────────
function genProfessional(rand: () => number, startId: number, setNo: number, tough: boolean): Q[] {
  const out: Q[] = [];
  const hardTheory = ELEC_HARD_THEORY;
  const baseTheory = ELEC_THEORY_POOL;
  const theorySlice: FactQ[] = tough
    ? [
        ...rotateSlice(ELEC_TRICKY_POOL, setNo, 8, 7),
        ...rotateSlice(hardTheory, setNo, 12, 11),
        ...rotateSlice(baseTheory, setNo, 40, 44),
      ]
    : [
        ...rotateSlice(hardTheory, setNo, 16, 11),
        ...rotateSlice(baseTheory, setNo, 44, 44),
      ];
  shuffleInPlace(rand, theorySlice);

  const figItems = drawDistinct(rand, ELEC_FIGURE_GENERATORS, 12);
  const numItems: FactQ[] = [
    ...figItems,
    ...fillSpecs(rand, ELEC_HARD_NUM, ELEC_NUM_GENERATORS, 28, tough ? 10 : 6),
  ];
  shuffleInPlace(rand, numItems);

  const merged: FactQ[] = [];
  let ti = 0;
  let ni = 0;
  for (let k = 0; k < 100; k++) {
    const wantNum = k % 5 === 2 || k % 5 === 4;
    if (wantNum && ni < numItems.length) merged.push(numItems[ni++]);
    else if (ti < theorySlice.length) merged.push(theorySlice[ti++]);
    else if (ni < numItems.length) merged.push(numItems[ni++]);
  }
  merged.forEach((f, i) => {
    const { options, answer } = mcqFrom(rand, f.correct, f.distractors);
    out.push({
      id: startId + i,
      subject: SUBJ.prof,
      topic: f.topic,
      section: "Paper-II",
      type: "MCQ",
      marks: 1,
      difficulty: f.difficulty,
      stem: f.stem,
      options,
      answer,
      solution: f.solution,
      figure: f.figure,
    });
  });
  return out;
}

runDiscipline({
  slug: "electrical",
  discipline: "Electrical",
  seedBase: 0x1e1e000,
  genProfessional,
});

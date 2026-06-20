/**
 * CrackGate — CIL Management Trainee (Electronics & Telecom) Paper-II generator.
 *
 *   npx tsx scripts/cil/e-and-t.ts                 # sets 1..15
 *   npx tsx scripts/cil/e-and-t.ts --only=11,12
 *   npx tsx scripts/cil/e-and-t.ts --from=1 --to=10
 *
 * Paper-I (100 Q) is the shared CIL core. This file supplies only Paper-II
 * (Professional Knowledge, 100 Q = ~60 theory + ~40 numerical) for Electronics
 * & Telecommunication, authored to be conceptual and fundamentals-first, with
 * SVG figures (op-amp circuits, rectifier and AM waveforms, logic circuits,
 * filter responses) rendered by the app's QuestionFigure engine.
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

// ─── Curated E&T theory pool (base: easy / medium) ───────────────────────────
const ENT_THEORY_POOL: FactQ[] = [
  // Semiconductors / devices
  { topic: "Semiconductors", difficulty: "easy", stem: "An n-type semiconductor is produced by doping silicon with a:", correct: "Pentavalent (donor) impurity", distractors: ["Trivalent (acceptor) impurity", "Noble gas", "Tetravalent element"], solution: "Pentavalent atoms (e.g. phosphorus) donate free electrons, giving n-type material." },
  { topic: "Semiconductors", difficulty: "easy", stem: "A p-type semiconductor is produced by doping silicon with a:", correct: "Trivalent (acceptor) impurity", distractors: ["Pentavalent (donor) impurity", "Tetravalent element", "Inert gas"], solution: "Trivalent atoms (e.g. boron) create holes, giving p-type material." },
  { topic: "Semiconductors", difficulty: "easy", stem: "A PN-junction diode conducts appreciably only when it is:", correct: "Forward biased", distractors: ["Reverse biased", "Unbiased", "At absolute zero"], solution: "Forward bias lowers the barrier and allows current; reverse bias blocks it (except small leakage)." },
  { topic: "Semiconductors", difficulty: "medium", stem: "A Zener diode used as a voltage regulator operates in its:", correct: "Reverse breakdown region", distractors: ["Forward conduction region", "Cut-off region", "Saturation region"], solution: "In reverse breakdown the Zener holds a nearly constant voltage, regulating the output." },
  { topic: "Semiconductors", difficulty: "medium", stem: "The region around a PN junction that is depleted of free carriers is the:", correct: "Depletion region", distractors: ["Conduction band", "Valence band", "Inversion layer"], solution: "Diffusion of carriers leaves a charge-depleted layer with a built-in potential." },
  { topic: "Semiconductors", difficulty: "easy", stem: "A photodiode is normally operated in:", correct: "Reverse bias, to detect light", distractors: ["Forward bias, to emit light", "Breakdown, as a regulator", "No bias, as a resistor"], solution: "Reverse-biased photodiodes produce a current proportional to incident light." },
  { topic: "Electronic Devices", difficulty: "medium", stem: "A bipolar junction transistor (BJT) is fundamentally a:", correct: "Current-controlled device", distractors: ["Voltage-controlled device", "Light-controlled device", "Magnetically controlled device"], solution: "Collector current is controlled by base current (Ic = βIb) — a current-controlled device." },
  { topic: "Electronic Devices", difficulty: "medium", stem: "A field-effect transistor (FET) is a:", correct: "Voltage-controlled device with high input impedance", distractors: ["Current-controlled device", "Low input impedance device", "Two-terminal device"], solution: "Gate voltage controls the channel current; the gate draws almost no current (high Zin)." },
  { topic: "Electronic Devices", difficulty: "medium", stem: "A MOSFET is preferred in digital ICs largely because of its:", correct: "Very high input impedance and low power", distractors: ["Low input impedance", "Large gate current", "Bipolar conduction"], solution: "The insulated gate gives near-infinite input impedance and low static power." },
  { topic: "Electronic Devices", difficulty: "easy", stem: "An LED emits light when it is:", correct: "Forward biased", distractors: ["Reverse biased", "In breakdown", "Unbiased"], solution: "Forward-biased recombination of carriers releases photons in an LED." },
  // Analog
  { topic: "Analog Electronics", difficulty: "medium", stem: "An ideal operational amplifier has:", correct: "Infinite open-loop gain and input impedance", distractors: ["Zero gain", "Finite low input impedance", "Infinite output impedance"], solution: "Ideal op-amp: infinite gain, infinite Zin, zero Zout, infinite bandwidth." },
  { topic: "Analog Electronics", difficulty: "medium", stem: "The closed-loop gain of an inverting op-amp amplifier is:", correct: "−Rf/Rin", distractors: ["1 + Rf/Rin", "Rf/Rin", "−Rin/Rf"], solution: "For the inverting configuration, gain = −Rf/Rin." },
  { topic: "Analog Electronics", difficulty: "medium", stem: "The closed-loop gain of a non-inverting op-amp amplifier is:", correct: "1 + Rf/Rin", distractors: ["−Rf/Rin", "Rf/Rin", "1 − Rf/Rin"], solution: "Non-inverting gain = 1 + Rf/Rin, always ≥ 1 and in phase." },
  { topic: "Analog Electronics", difficulty: "medium", stem: "In an inverting op-amp circuit, the inverting input behaves as a:", correct: "Virtual ground", distractors: ["Virtual open", "Constant current source", "High-voltage node"], solution: "Negative feedback forces the inverting input to ≈ 0 V (virtual ground) when the + input is grounded." },
  { topic: "Analog Electronics", difficulty: "medium", stem: "A rectifier circuit is used to convert:", correct: "AC into DC", distractors: ["DC into AC", "Low voltage into high voltage", "Current into voltage"], solution: "Rectifiers (using diodes) convert alternating voltage into unidirectional (DC) voltage." },
  { topic: "Analog Electronics", difficulty: "medium", stem: "Compared with a half-wave rectifier, a full-wave rectifier has:", correct: "Lower ripple and higher efficiency", distractors: ["Higher ripple", "Lower efficiency", "No need for filtering ever"], solution: "Using both half-cycles, full-wave rectification gives smoother output and better efficiency." },
  { topic: "Analog Electronics", difficulty: "medium", stem: "Negative feedback in an amplifier generally:", correct: "Reduces gain but increases bandwidth and stability", distractors: ["Increases gain and reduces bandwidth", "Has no effect on bandwidth", "Increases distortion"], solution: "Negative feedback trades gain for wider bandwidth, lower distortion and better stability." },
  // Digital
  { topic: "Digital Electronics", difficulty: "easy", stem: "Which gate gives an output of 1 only when both inputs differ?", correct: "XOR", distractors: ["AND", "OR", "NAND"], solution: "XOR outputs 1 when the two inputs are unequal." },
  { topic: "Digital Electronics", difficulty: "medium", stem: "NAND and NOR are termed universal gates because they can:", correct: "Realize any Boolean function", distractors: ["Only invert", "Only store data", "Only add numbers"], solution: "Any logic function can be implemented using only NAND (or only NOR) gates." },
  { topic: "Digital Electronics", difficulty: "medium", stem: "A flip-flop is the basic building block of:", correct: "Sequential circuits (memory)", distractors: ["Combinational circuits only", "Rectifiers", "Oscillators"], solution: "Flip-flops store state and form registers, counters and other sequential logic." },
  { topic: "Digital Electronics", difficulty: "medium", stem: "A multiplexer (MUX) is a circuit that:", correct: "Selects one of several inputs onto a single output", distractors: ["Splits one input into many outputs", "Adds two numbers", "Stores one bit"], solution: "A MUX routes one of 2ⁿ inputs to the output based on n select lines." },
  { topic: "Digital Electronics", difficulty: "medium", stem: "A half-adder produces which two outputs?", correct: "Sum and carry", distractors: ["Sum and borrow", "Difference and carry", "Quotient and remainder"], solution: "A half-adder gives Sum = A⊕B and Carry = A·B." },
  { topic: "Digital Electronics", difficulty: "medium", stem: "An ADC is a circuit that converts:", correct: "An analog signal into a digital code", distractors: ["A digital code into analog", "AC into DC", "Voltage into current"], solution: "An analog-to-digital converter samples and quantizes an analog input into digital values." },
  // Signals & systems
  { topic: "Signals & Systems", difficulty: "medium", stem: "The Fourier series can represent any periodic signal as a sum of:", correct: "Sinusoids at harmonic frequencies", distractors: ["Exponentially decaying terms only", "A single sinusoid", "Random noise"], solution: "A periodic signal decomposes into a fundamental plus its harmonics." },
  { topic: "Signals & Systems", difficulty: "medium", stem: "According to the sampling theorem, a signal of maximum frequency fm must be sampled at a rate of at least:", correct: "2·fm", distractors: ["fm", "fm/2", "4·fm"], solution: "The Nyquist rate is 2fm; sampling slower causes aliasing." },
  { topic: "Signals & Systems", difficulty: "medium", stem: "The output of a linear time-invariant (LTI) system is the input convolved with the:", correct: "Impulse response", distractors: ["Step response only", "Transfer-function zeros", "Sampling function"], solution: "y(t) = x(t) ∗ h(t); the impulse response h(t) fully characterizes an LTI system." },
  { topic: "Signals & Systems", difficulty: "medium", stem: "The Laplace transform is especially useful for analysing:", correct: "Transient and stability behaviour of systems", distractors: ["Only steady-state DC", "Only digital logic", "Only resistive circuits"], solution: "The s-domain handles initial conditions, transients and pole locations for stability." },
  // Communication
  { topic: "Communication Systems", difficulty: "medium", stem: "In amplitude modulation (AM), the quantity varied in proportion to the message is the carrier's:", correct: "Amplitude", distractors: ["Frequency", "Phase", "Wavelength only"], solution: "AM varies the carrier amplitude with the modulating signal." },
  { topic: "Communication Systems", difficulty: "medium", stem: "In frequency modulation (FM), the carrier parameter varied is its:", correct: "Frequency", distractors: ["Amplitude", "Phase delay", "Power only"], solution: "FM varies the instantaneous carrier frequency with the message amplitude." },
  { topic: "Communication Systems", difficulty: "medium", stem: "The bandwidth of an AM signal modulated by a message of highest frequency fm is:", correct: "2·fm", distractors: ["fm", "fm/2", "4·fm"], solution: "AM produces two sidebands, giving a transmission bandwidth of 2fm." },
  { topic: "Communication Systems", difficulty: "medium", stem: "FM is generally preferred over AM for high-fidelity audio because it offers:", correct: "Better noise immunity", distractors: ["Smaller bandwidth", "Simpler receivers", "Lower transmitter power always"], solution: "FM's constant amplitude makes it far more robust against amplitude noise than AM." },
  { topic: "Communication Systems", difficulty: "easy", stem: "An antenna is a device that:", correct: "Converts between guided signals and radiated EM waves", distractors: ["Amplifies DC", "Rectifies AC", "Stores charge"], solution: "Antennas transduce between currents on a conductor and free-space electromagnetic waves." },
  { topic: "Communication Systems", difficulty: "medium", stem: "Time-division multiplexing (TDM) shares a channel by allocating:", correct: "Different time slots to different signals", distractors: ["Different frequency bands", "Different codes", "Different antennas"], solution: "TDM interleaves samples of several signals in distinct time slots on one channel." },
  { topic: "Communication Systems", difficulty: "medium", stem: "Pulse-code modulation (PCM) involves sampling, quantizing and:", correct: "Encoding into binary", distractors: ["Amplitude modulation", "Frequency division", "Rectification"], solution: "PCM digitizes an analog signal by sampling, quantizing, then binary-encoding each sample." },
  // Control / EM / micro
  { topic: "Control Systems", difficulty: "medium", stem: "A continuous LTI system is stable if all poles of its transfer function lie in the:", correct: "Left half of the s-plane", distractors: ["Right half of the s-plane", "On the imaginary axis only", "At the origin"], solution: "Poles with negative real parts (left half-plane) give decaying, stable responses." },
  { topic: "Control Systems", difficulty: "medium", stem: "Negative feedback in a control system primarily improves:", correct: "Stability and accuracy", distractors: ["Only the gain", "Only the cost", "Only the size"], solution: "Negative feedback reduces sensitivity to disturbances and improves accuracy and stability." },
  { topic: "Electromagnetics", difficulty: "easy", stem: "The wavelength λ of an electromagnetic wave of frequency f in free space is:", correct: "c/f", distractors: ["f/c", "c·f", "c·f²"], solution: "λ = c/f, with c the speed of light." },
  { topic: "Electromagnetics", difficulty: "medium", stem: "Maxwell's equations predict that a time-varying electric field produces a:", correct: "Time-varying magnetic field", distractors: ["Static charge", "Constant current", "Gravitational field"], solution: "Faraday/Ampère–Maxwell coupling of changing E and B fields gives rise to EM waves." },
  { topic: "Microprocessors", difficulty: "medium", stem: "The program counter (PC) in a microprocessor holds the:", correct: "Address of the next instruction", distractors: ["Current data value", "Result of the ALU", "Stack base only"], solution: "The PC points to the memory address of the next instruction to fetch." },
  { topic: "Microprocessors", difficulty: "easy", stem: "The ALU in a CPU performs:", correct: "Arithmetic and logic operations", distractors: ["Memory storage", "Clock generation", "Power regulation"], solution: "The Arithmetic Logic Unit executes add/subtract and AND/OR/NOT-type operations." },
  // Filters / oscillators
  { topic: "Analog Electronics", difficulty: "medium", stem: "The cut-off frequency of a simple RC low-pass filter is:", correct: "1/(2πRC)", distractors: ["2πRC", "RC", "1/(RC)"], solution: "f_c = 1/(2πRC); above it the output falls at 20 dB/decade." },
  { topic: "Analog Electronics", difficulty: "medium", stem: "The Barkhausen criterion for sustained oscillation requires the loop gain to be:", correct: "Unity with zero net phase shift", distractors: ["Greater than 10", "Zero", "Negative"], solution: "Oscillation is sustained when |loop gain| = 1 and total phase around the loop = 0°/360°." },
  { topic: "Digital Electronics", difficulty: "medium", stem: "A decoder with n input lines activates:", correct: "One of up to 2ⁿ outputs", distractors: ["All outputs at once", "n outputs", "Only one fixed output"], solution: "An n-to-2ⁿ decoder asserts exactly one output line for each input combination." },
  { topic: "Communication Systems", difficulty: "medium", stem: "Frequency-division multiplexing (FDM) shares a channel by allocating:", correct: "Different frequency bands to different signals", distractors: ["Different time slots", "Different spreading codes", "Different antennas"], solution: "FDM places each signal in its own frequency band on the shared medium." },
];

// ─── Hard E&T theory (conceptual) ────────────────────────────────────────────
const ENT_HARD_THEORY: FactQ[] = [
  { topic: "Electronic Devices", difficulty: "hard", stem: "For a BJT to operate as a linear amplifier, its junctions must be biased so that the:", correct: "Emitter junction is forward and collector junction reverse biased", distractors: ["Both junctions are forward biased", "Both junctions are reverse biased", "Emitter junction is reverse and collector forward biased"], solution: "Active (amplifying) region: emitter–base forward, collector–base reverse biased." },
  { topic: "Analog Electronics", difficulty: "hard", stem: "For an op-amp, the gain–bandwidth product is:", correct: "Approximately constant", distractors: ["Proportional to gain squared", "Zero", "Equal to the slew rate"], solution: "As closed-loop gain rises, bandwidth falls so that gain × bandwidth ≈ constant (unity-gain frequency)." },
  { topic: "Analog Electronics", difficulty: "hard", stem: "The slew rate of an op-amp limits the:", correct: "Maximum rate of change of the output voltage", distractors: ["DC gain", "Input offset voltage", "Common-mode gain"], solution: "Slew rate (V/µs) bounds how fast the output can swing, distorting fast large signals." },
  { topic: "Analog Electronics", difficulty: "hard", stem: "A high common-mode rejection ratio (CMRR) in a differential amplifier means it:", correct: "Strongly rejects signals common to both inputs", distractors: ["Amplifies common-mode signals", "Has low differential gain", "Has high output impedance"], solution: "CMRR = differential gain/common-mode gain; high CMRR suppresses noise common to both inputs." },
  { topic: "Signals & Systems", difficulty: "hard", stem: "Sampling a signal below the Nyquist rate causes:", correct: "Aliasing (high frequencies fold to lower ones)", distractors: ["Quantization noise only", "Perfect reconstruction", "Increased bandwidth"], solution: "Under-sampling overlaps spectral images, so high frequencies masquerade as lower ones." },
  { topic: "Communication Systems", difficulty: "hard", stem: "For a sinusoidally modulated AM wave, the maximum fraction of total power in the sidebands (at 100% modulation) is:", correct: "About one third (33%)", distractors: ["About one half (50%)", "About two thirds (66%)", "All of it (100%)"], solution: "At μ = 1, sideband power is Pc·μ²/2 of carrier; total sideband fraction = μ²/(2+μ²) = 1/3." },
  { topic: "Communication Systems", difficulty: "hard", stem: "Carson's rule estimates FM bandwidth as:", correct: "2(Δf + fm)", distractors: ["2·fm", "Δf + fm", "2·Δf"], solution: "B_FM ≈ 2(Δf + fm), where Δf is peak deviation and fm the highest message frequency." },
  { topic: "Communication Systems", difficulty: "hard", stem: "The Shannon–Hartley theorem gives channel capacity as:", correct: "C = B·log₂(1 + SNR)", distractors: ["C = B·SNR", "C = B/log₂(SNR)", "C = log₂(B·SNR)"], solution: "Capacity rises with bandwidth B and signal-to-noise ratio: C = B log₂(1 + SNR) bits/s." },
  { topic: "Communication Systems", difficulty: "hard", stem: "For an n-bit PCM system, the signal-to-quantization-noise ratio improves by about:", correct: "6 dB per additional bit", distractors: ["3 dB per bit", "1 dB per bit", "12 dB per bit"], solution: "SQNR ≈ 6.02n + 1.76 dB, so each extra bit adds ~6 dB." },
  { topic: "Control Systems", difficulty: "hard", stem: "The Routh–Hurwitz criterion is used to determine system stability without:", correct: "Explicitly computing the pole locations", distractors: ["Knowing the characteristic equation", "Any algebra", "The transfer function"], solution: "Routh's array tests sign changes in the first column to count right-half-plane roots directly." },
  { topic: "Electronic Devices", difficulty: "hard", stem: "An n-channel enhancement MOSFET enters the saturation (active) region when:", correct: "V_GS > V_th and V_DS ≥ V_GS − V_th", distractors: ["V_GS < V_th", "V_DS = 0", "V_GS = 0"], solution: "Above threshold and with V_DS pinching off the channel, the MOSFET saturates and acts as a current source." },
  { topic: "Signals & Systems", difficulty: "hard", stem: "The region of convergence (ROC) of the Laplace transform determines:", correct: "Whether the system is stable and/or causal", distractors: ["The DC gain only", "The sampling rate", "The number of poles"], solution: "Stability requires the ROC to include the jω-axis; ROC position also encodes causality." },
  { topic: "Analog Electronics", difficulty: "hard", stem: "A Class C amplifier achieves the highest efficiency but:", correct: "Conducts for less than half a cycle, producing heavy distortion", distractors: ["Conducts for the full cycle linearly", "Has the lowest efficiency", "Is used for hi-fi audio"], solution: "Class C conducts <180°, so it is efficient but non-linear — used with tuned RF loads." },
  { topic: "Digital Electronics", difficulty: "hard", stem: "An n-bit ADC/DAC provides how many distinct output levels?", correct: "2ⁿ", distractors: ["2n", "n²", "2ⁿ − 1 minus sign bit"], solution: "n bits quantize into 2ⁿ levels; resolution = full-scale/2ⁿ." },
  { topic: "Electromagnetics", difficulty: "hard", stem: "The directivity (gain) of an antenna increases as its:", correct: "Effective aperture increases relative to wavelength", distractors: ["Physical size decreases", "Frequency decreases", "Bandwidth increases"], solution: "Gain ∝ 4π·A_eff/λ²; larger apertures (in wavelengths) give higher directivity." },
  { topic: "Analog Electronics", difficulty: "hard", stem: "The total voltage gain of two amplifier stages with gains A₁ and A₂ in cascade is:", correct: "A₁ × A₂", distractors: ["A₁ + A₂", "A₁ − A₂", "(A₁ + A₂)/2"], solution: "Cascaded voltage gains multiply (or add in dB): A_total = A₁·A₂." },
  { topic: "Communication Systems", difficulty: "hard", stem: "Over-modulation (μ > 1) in AM causes:", correct: "Envelope distortion and spurious sidebands", distractors: ["Cleaner reception", "Lower bandwidth", "Higher fidelity"], solution: "When μ > 1 the envelope crosses zero, distorting the recovered signal and spreading the spectrum." },
];

// ─── Tricky conceptual pool (INCORRECT / compare / limiting) ─────────────────
const ENT_TRICKY_POOL: FactQ[] = [
  { topic: "Semiconductors", difficulty: "hard", stem: "Which statement about diodes is INCORRECT?", correct: "An ideal diode conducts fully in reverse bias", distractors: ["A diode conducts in forward bias", "A Zener operates in reverse breakdown", "Reverse leakage current is very small"], solution: "An ideal diode blocks in reverse bias; it conducts in forward bias." },
  { topic: "Electronic Devices", difficulty: "hard", stem: "Which comparison of BJT and FET is correct?", correct: "BJT is current-controlled; FET is voltage-controlled", distractors: ["Both are current-controlled", "BJT is voltage-controlled; FET is current-controlled", "Both have low input impedance"], solution: "BJTs are controlled by base current, FETs by gate voltage with very high input impedance." },
  { topic: "Analog Electronics", difficulty: "hard", stem: "Which statement about an inverting op-amp amplifier is correct?", correct: "Its output is 180° out of phase with the input", distractors: ["Its gain is always positive", "Its input impedance is infinite", "It cannot have gain greater than 1"], solution: "The inverting amplifier inverts the signal (gain = −Rf/Rin)." },
  { topic: "Signals & Systems", difficulty: "hard", stem: "If a 4 kHz signal is sampled at 6 kHz, the result is:", correct: "Aliasing (below the Nyquist rate of 8 kHz)", distractors: ["Perfect reconstruction", "No effect", "Doubled bandwidth"], solution: "Nyquist rate = 2×4 = 8 kHz; sampling at 6 kHz under-samples and aliases." },
  { topic: "Communication Systems", difficulty: "hard", stem: "Which statement comparing AM and FM is INCORRECT?", correct: "AM has better noise immunity than FM", distractors: ["FM uses more bandwidth than AM", "FM has better noise immunity", "AM varies carrier amplitude"], solution: "FM, not AM, has superior noise immunity (constant amplitude)." },
  { topic: "Digital Electronics", difficulty: "hard", stem: "Which gate set is NOT functionally complete on its own?", correct: "AND only", distractors: ["NAND only", "NOR only", "AND, OR, NOT together"], solution: "NAND or NOR alone are universal; AND alone cannot realize all functions (no inversion)." },
  { topic: "Communication Systems", difficulty: "hard", stem: "According to Shannon, channel capacity increases when:", correct: "Either bandwidth or SNR increases", distractors: ["Only when power decreases", "Only when bandwidth decreases", "SNR has no effect"], solution: "C = B log₂(1 + SNR) rises with both bandwidth and signal-to-noise ratio." },
  { topic: "Analog Electronics", difficulty: "hard", stem: "Which statement about negative feedback is INCORRECT?", correct: "It increases the closed-loop gain", distractors: ["It increases bandwidth", "It reduces distortion", "It improves stability"], solution: "Negative feedback reduces gain (in exchange for bandwidth, linearity and stability)." },
  { topic: "Analog Electronics", difficulty: "hard", stem: "Among amplifier classes, the highest theoretical efficiency but most distortion belongs to:", correct: "Class C", distractors: ["Class A", "Class B", "Class AB"], solution: "Class C conducts for <180°, giving high efficiency but heavy distortion (used with tuned loads)." },
  { topic: "Digital Electronics", difficulty: "hard", stem: "Doubling the number of bits in an ADC changes the number of quantization levels from 2ⁿ to:", correct: "2²ⁿ (squared)", distractors: ["Double", "Four times", "Unchanged"], solution: "Levels = 2^bits, so doubling n gives 2^(2n) = (2ⁿ)² levels." },
  { topic: "Semiconductors", difficulty: "hard", stem: "Which statement about a Zener diode regulator is correct?", correct: "It maintains a nearly constant voltage in reverse breakdown", distractors: ["It regulates in forward bias", "It must be reverse biased below breakdown", "Its voltage rises steeply with current in breakdown"], solution: "In reverse breakdown the Zener voltage stays almost constant over a range of current." },
  { topic: "Communication Systems", difficulty: "hard", stem: "Which statement about an AM modulation index μ is correct?", correct: "μ should be ≤ 1 to avoid over-modulation", distractors: ["μ should exceed 1 for clarity", "μ has no effect on distortion", "μ is the carrier frequency ratio"], solution: "μ > 1 causes envelope distortion (over-modulation); 0 < μ ≤ 1 is required." },
  { topic: "Signals & Systems", difficulty: "hard", stem: "Which statement about an LTI system's impulse response h(t) is correct?", correct: "The system is causal if h(t) = 0 for t < 0", distractors: ["Causality requires h(t) = 0 for t > 0", "h(t) determines only the DC gain", "Convolution with h(t) is irrelevant to the output"], solution: "A causal system cannot respond before the input, so h(t) = 0 for t < 0." },
  { topic: "Analog Electronics", difficulty: "hard", stem: "If two amplifier stages of 20 dB and 30 dB are cascaded, the overall gain is:", correct: "50 dB", distractors: ["600 dB", "10 dB", "25 dB"], solution: "Gains in dB add: 20 + 30 = 50 dB (i.e. voltage gains multiply)." },
];

// ─── E&T numerical generators (parametric) ───────────────────────────────────
const ENT_NUM_GENERATORS: SpecGen[] = [
  // Inverting amp gain
  (rand) => {
    const rf = pick(rand, [10, 22, 47, 100]);
    const ri = pick(rand, [1, 2, 5, 10]);
    const g = r2(-rf / ri);
    return {
      topic: "Analog Electronics", difficulty: "medium",
      stem: `An inverting op-amp has Rf = ${rf} kΩ and Rin = ${ri} kΩ. Its voltage gain is:`,
      correct: `${g}`, distractors: [`${r2(rf / ri)}`, `${r2(1 + rf / ri)}`, `${r2(-ri / rf)}`],
      solution: `A = −Rf/Rin = −${rf}/${ri} = ${g}.`,
    };
  },
  // Non-inverting amp gain
  (rand) => {
    const rf = pick(rand, [10, 20, 50, 90]);
    const ri = pick(rand, [10, 5, 2]);
    const g = r2(1 + rf / ri);
    return {
      topic: "Analog Electronics", difficulty: "medium",
      stem: `A non-inverting op-amp has Rf = ${rf} kΩ and Rin = ${ri} kΩ. Its voltage gain is:`,
      correct: `${g}`, distractors: [`${r2(rf / ri)}`, `${r2(-rf / ri)}`, `${r2(rf / ri - 1)}`],
      solution: `A = 1 + Rf/Rin = 1 + ${rf}/${ri} = ${g}.`,
    };
  },
  // Nyquist rate
  (rand) => {
    const fm = pick(rand, [3, 4, 5, 8, 10, 15, 20]); // kHz
    const ns = 2 * fm;
    return {
      topic: "Signals & Systems", difficulty: "easy",
      stem: `A signal has a maximum frequency of ${fm} kHz. Its Nyquist sampling rate is:`,
      correct: `${ns} kHz`, distractors: [`${fm} kHz`, `${fm / 2} kHz`, `${4 * fm} kHz`],
      solution: `Nyquist rate = 2·fm = 2×${fm} = ${ns} kHz.`,
    };
  },
  // AM bandwidth
  (rand) => {
    const fm = pick(rand, [3, 4, 5, 10, 15]); // kHz
    const bw = 2 * fm;
    return {
      topic: "Communication Systems", difficulty: "medium",
      stem: `An AM signal carries a message of highest frequency ${fm} kHz. Its transmission bandwidth is:`,
      correct: `${bw} kHz`, distractors: [`${fm} kHz`, `${fm / 2} kHz`, `${4 * fm} kHz`],
      solution: `B_AM = 2·fm = 2×${fm} = ${bw} kHz.`,
    };
  },
  // Modulation index
  (rand) => {
    const am = pick(rand, [20, 30, 40, 50]); // message amp
    const ac = pick(rand, [50, 80, 100]); // carrier amp
    const mu = r2(am / ac);
    return {
      topic: "Communication Systems", difficulty: "medium",
      stem: `An AM carrier of amplitude ${ac} V is modulated by a ${am} V message. The modulation index is:`,
      correct: `${mu}`, distractors: [`${r2(ac / am)}`, `${r2(mu * 2)}`, `${r2(mu + 0.2)}`],
      solution: `μ = Am/Ac = ${am}/${ac} = ${mu}.`,
    };
  },
  // Wavelength c/f
  (rand) => {
    const f = pick(rand, [100, 150, 300, 600, 900]); // MHz
    const lam = r2(300 / f);
    return {
      topic: "Electromagnetics", difficulty: "medium",
      stem: `The free-space wavelength of a ${f} MHz signal is:`,
      correct: `${lam} m`, distractors: [`${r2(f / 300)} m`, `${r2(lam * 2)} m`, `${r2(lam / 2)} m`],
      solution: `λ = c/f = 3×10⁸/(${f}×10⁶) = ${lam} m.`,
    };
  },
  // Quantization levels
  (rand) => {
    const n = pick(rand, [3, 4, 6, 8, 10]);
    const L = Math.pow(2, n);
    return {
      topic: "Digital Electronics", difficulty: "easy",
      stem: `An ${n}-bit ADC provides how many quantization levels?`,
      correct: `${L}`, distractors: [`${2 * n}`, `${L - 1}`, `${L / 2}`],
      solution: `Levels = 2ⁿ = 2^${n} = ${L}.`,
    };
  },
  // BJT collector current
  (rand) => {
    const beta = pick(rand, [50, 100, 150, 200]);
    const ib = pick(rand, [10, 20, 40]); // µA
    const ic = r2((beta * ib) / 1000);
    return {
      topic: "Electronic Devices", difficulty: "medium",
      stem: `A BJT with β = ${beta} has a base current of ${ib} µA. Its collector current is about:`,
      correct: `${ic} mA`, distractors: [`${r2(ib / beta)} mA`, `${r2(ic * 2)} mA`, `${r2(ic + 1)} mA`],
      solution: `Ic = β·Ib = ${beta}×${ib}µA = ${ic} mA.`,
    };
  },
  // dB voltage gain
  (rand) => {
    const ratio = pick(rand, [10, 100, 1000, 31.6]);
    const db = r1(20 * Math.log10(ratio));
    return {
      topic: "Analog Electronics", difficulty: "medium",
      stem: `An amplifier has a voltage gain of ${ratio}. Expressed in decibels this is about:`,
      correct: `${db} dB`, distractors: [`${r1(db / 2)} dB`, `${r1(db * 2)} dB`, `${r1(10 * Math.log10(ratio))} dB`],
      solution: `Gain(dB) = 20·log₁₀(${ratio}) ≈ ${db} dB.`,
    };
  },
  // RC low-pass cutoff
  (rand) => {
    const r = pick(rand, [1, 2, 10]); // kΩ
    const c = pick(rand, [100, 47, 10]); // nF
    const fc = r1(1 / (2 * Math.PI * r * 1e3 * c * 1e-9));
    return {
      topic: "Analog Electronics", difficulty: "medium",
      stem: `An RC low-pass filter has R = ${r} kΩ and C = ${c} nF. Its cut-off frequency is about:`,
      correct: `${fc} Hz`, distractors: [`${r1(fc * 2)} Hz`, `${r1(fc / 2)} Hz`, `${r1(fc + 200)} Hz`],
      solution: `f_c = 1/(2πRC) = 1/(2π×${r}kΩ×${c}nF) ≈ ${fc} Hz.`,
    };
  },
  // Binary to decimal
  (rand) => {
    const n = pick(rand, [5, 6, 9, 10, 11, 13, 14]);
    const bin = n.toString(2);
    return {
      topic: "Digital Electronics", difficulty: "easy",
      stem: `The decimal equivalent of the binary number ${bin}₂ is:`,
      correct: `${n}`, distractors: [`${n + 1}`, `${n - 1}`, `${n + 2}`],
      solution: `${bin}₂ = ${n}₁₀.`,
    };
  },
  // Resonant frequency LC
  (rand) => {
    const L = pick(rand, [1, 10, 100]); // µH
    const C = pick(rand, [10, 100, 1000]); // pF
    const f0 = r1(1 / (2 * Math.PI * Math.sqrt(L * 1e-6 * C * 1e-12)) / 1e6);
    return {
      topic: "Communication Systems", difficulty: "medium",
      stem: `An LC tank has L = ${L} µH and C = ${C} pF. Its resonant frequency is about:`,
      correct: `${f0} MHz`, distractors: [`${r1(f0 * 2)} MHz`, `${r1(f0 / 2)} MHz`, `${r1(f0 + 1)} MHz`],
      solution: `f₀ = 1/(2π√(LC)) = 1/(2π√(${L}µH×${C}pF)) ≈ ${f0} MHz.`,
    };
  },
  // FM bandwidth Carson
  (rand) => {
    const df = pick(rand, [5, 10, 15, 75]); // kHz deviation
    const fm = pick(rand, [3, 5, 10, 15]); // kHz
    const bw = 2 * (df + fm);
    return {
      topic: "Communication Systems", difficulty: "medium",
      stem: `An FM signal has peak deviation ${df} kHz and message bandwidth ${fm} kHz. By Carson's rule the bandwidth is:`,
      correct: `${bw} kHz`, distractors: [`${2 * df} kHz`, `${df + fm} kHz`, `${2 * fm} kHz`],
      solution: `B = 2(Δf + fm) = 2(${df}+${fm}) = ${bw} kHz.`,
    };
  },
  // Bits for levels
  (rand) => {
    const L = pick(rand, [8, 16, 32, 64, 256]);
    const n = Math.log2(L);
    return {
      topic: "Digital Electronics", difficulty: "medium",
      stem: `How many bits are needed to encode ${L} distinct quantization levels?`,
      correct: `${n}`, distractors: [`${n - 1}`, `${n + 1}`, `${L / 8}`],
      solution: `bits = log₂(${L}) = ${n}.`,
    };
  },
];

// ─── Hard E&T numerical generators (multi-step) ──────────────────────────────
const ENT_HARD_NUM: SpecGen[] = [
  // Shannon capacity with SNR in dB
  (rand) => {
    const B = pick(rand, [3, 4, 10]); // kHz
    const snrdb = pick(rand, [20, 30]);
    const snr = Math.pow(10, snrdb / 10);
    const C = r1(B * 1000 * Math.log2(1 + snr) / 1000);
    return {
      topic: "Communication Systems", difficulty: "hard",
      stem: `A channel of bandwidth ${B} kHz has an SNR of ${snrdb} dB. Its Shannon capacity is about:`,
      correct: `${C} kbps`, distractors: [`${r1(C / 2)} kbps`, `${r1(C * 2)} kbps`, `${r1(B * snrdb)} kbps`],
      solution: `SNR = 10^(${snrdb}/10) = ${r1(snr)}; C = B·log₂(1+SNR) = ${B}k×log₂(${r1(1 + snr)}) ≈ ${C} kbps.`,
    };
  },
  // PCM SQNR
  (rand) => {
    const n = pick(rand, [8, 10, 12, 16]);
    const sqnr = r1(6.02 * n + 1.76);
    return {
      topic: "Communication Systems", difficulty: "hard",
      stem: `An ${n}-bit PCM system has a signal-to-quantization-noise ratio of about:`,
      correct: `${sqnr} dB`, distractors: [`${r1(6.02 * n)} dB`, `${r1(sqnr + 6)} dB`, `${r1(sqnr / 2)} dB`],
      solution: `SQNR ≈ 6.02n + 1.76 = 6.02×${n} + 1.76 ≈ ${sqnr} dB.`,
    };
  },
  // Op-amp summing amplifier output
  (rand) => {
    const rf = pick(rand, [10, 20]);
    const r1k = pick(rand, [2, 5]);
    const r2k = pick(rand, [4, 10]);
    const v1 = pick(rand, [1, 2]);
    const v2 = pick(rand, [1, 3]);
    const vo = r2(-(rf / r1k) * v1 - (rf / r2k) * v2);
    return {
      topic: "Analog Electronics", difficulty: "hard",
      stem: `A summing op-amp (Rf = ${rf} kΩ) has inputs ${v1} V via ${r1k} kΩ and ${v2} V via ${r2k} kΩ. The output is:`,
      correct: `${vo} V`, distractors: [`${r2((rf / r1k) * v1 + (rf / r2k) * v2)} V`, `${r2(-(v1 + v2))} V`, `${r2(vo + 2)} V`],
      solution: `Vo = −(Rf/R1·V1 + Rf/R2·V2) = −(${rf}/${r1k}×${v1} + ${rf}/${r2k}×${v2}) = ${vo} V.`,
    };
  },
  // AM transmission efficiency
  (rand) => {
    const mu = pick(rand, [0.5, 0.6, 0.8, 1.0]);
    const eff = r1((mu * mu / (2 + mu * mu)) * 100);
    return {
      topic: "Communication Systems", difficulty: "hard",
      stem: `An AM transmitter has modulation index μ = ${mu}. The fraction of total power in the sidebands is about:`,
      correct: `${eff}%`, distractors: [`${r1(mu * 50)}%`, `${r1(eff + 10)}%`, `${r1((mu * mu / 2) * 100)}%`],
      solution: `η = μ²/(2 + μ²) = ${mu}²/(2 + ${mu}²) ≈ ${eff}%.`,
    };
  },
  // Cascaded gain dB
  (rand) => {
    const g1 = pick(rand, [10, 15, 20]);
    const g2 = pick(rand, [20, 25, 30]);
    const loss = pick(rand, [3, 6]);
    const total = g1 + g2 - loss;
    return {
      topic: "Analog Electronics", difficulty: "hard",
      stem: `Two amplifiers of ${g1} dB and ${g2} dB are connected with a ${loss} dB interstage loss. The overall gain is:`,
      correct: `${total} dB`, distractors: [`${g1 + g2} dB`, `${g1 + g2 + loss} dB`, `${total - loss} dB`],
      solution: `Total = ${g1} + ${g2} − ${loss} = ${total} dB (dB values add/subtract).`,
    };
  },
  // Aliased frequency
  (rand) => {
    const fs = pick(rand, [8, 10, 12]); // kHz
    const f = pick(rand, [9, 11, 13, 14]); // kHz > fs
    const alias = Math.abs(f - fs);
    return {
      topic: "Signals & Systems", difficulty: "hard",
      stem: `A ${f} kHz tone is sampled at ${fs} kHz. The alias frequency that appears in the baseband is:`,
      correct: `${alias} kHz`, distractors: [`${f} kHz`, `${f + fs} kHz`, `${r2(fs / 2)} kHz`],
      solution: `Alias = |f − fs| = |${f} − ${fs}| = ${alias} kHz (since f exceeds fs).`,
    };
  },
  // Resolution of ADC
  (rand) => {
    const n = pick(rand, [8, 10, 12]);
    const fs = pick(rand, [5, 10]); // V full-scale
    const res = r2((fs / Math.pow(2, n)) * 1000);
    return {
      topic: "Digital Electronics", difficulty: "hard",
      stem: `A ${n}-bit ADC has a full-scale range of ${fs} V. Its resolution (LSB step) is about:`,
      correct: `${res} mV`, distractors: [`${r2(res * 2)} mV`, `${r2(res / 2)} mV`, `${r2(fs / n)} mV`],
      solution: `Resolution = FS/2ⁿ = ${fs}/2^${n} ≈ ${res} mV.`,
    };
  },
  // Free-space path loss-ish: received power simple
  (rand) => {
    const pt = pick(rand, [10, 20, 40]); // W
    const gain = pick(rand, [10, 100]);
    const loss = pick(rand, [1000, 10000]);
    const pr = r2((pt * gain) / loss * 1000);
    return {
      topic: "Communication Systems", difficulty: "hard",
      stem: `A link transmits ${pt} W with a net antenna gain of ${gain} and a path loss factor of ${loss}. The received power is about:`,
      correct: `${pr} mW`, distractors: [`${r2(pr * 2)} mW`, `${r2(pr / 2)} mW`, `${r2(pt / loss)} mW`],
      solution: `Pr = Pt·G/loss = ${pt}×${gain}/${loss} = ${r2((pt * gain) / loss)} W = ${pr} mW.`,
    };
  },
];

// ─── Graphical (SVG) E&T figure generators ───────────────────────────────────
const svg = (markup: string): { kind: "svg"; markup: string } => ({ kind: "svg", markup });

const ENT_FIGURE_GENERATORS: ((rand: () => number) => FactQ)[] = [
  // Inverting op-amp → output voltage
  (rand) => {
    const rf = pick(rand, [10, 20, 40]);
    const ri = pick(rand, [2, 5, 10]);
    const vin = pick(rand, [0.5, 1, 2]);
    const vo = r2(-(rf / ri) * vin);
    const markup = `<svg viewBox="0 0 250 130" width="250" height="130"><line x1="10" y1="70" x2="50" y2="70" stroke="#1e293b" stroke-width="2"/><rect x="50" y="62" width="34" height="16" fill="none" stroke="#2563eb" stroke-width="2"/><text x="67" y="58" font-size="9" text-anchor="middle" fill="#2563eb">Rin=${ri}k</text><line x1="84" y1="70" x2="110" y2="70" stroke="#1e293b" stroke-width="2"/><polygon points="110,45 110,95 165,70" fill="#f1f5f9" stroke="#475569" stroke-width="1.5"/><text x="128" y="74" font-size="10" fill="#475569">−</text><text x="128" y="62" font-size="9" fill="#475569">+</text><path d="M97 40 H150 V40" fill="none"/><line x1="97" y1="40" x2="97" y2="70" stroke="#1e293b" stroke-width="1.5"/><line x1="97" y1="40" x2="150" y2="40" stroke="#16a34a" stroke-width="2"/><rect x="115" y="32" width="30" height="14" fill="none" stroke="#16a34a" stroke-width="1.5"/><text x="130" y="28" font-size="9" text-anchor="middle" fill="#16a34a">Rf=${rf}k</text><line x1="150" y1="40" x2="150" y2="70" stroke="#16a34a" stroke-width="1.5"/><line x1="165" y1="70" x2="230" y2="70" stroke="#1e293b" stroke-width="2"/><text x="6" y="64" font-size="9" fill="#dc2626">Vin=${vin}V</text><text x="200" y="64" font-size="9" fill="#dc2626">Vout</text></svg>`;
    return {
      topic: "Analog Electronics", difficulty: "medium",
      stem: `For the inverting op-amp shown (Rin = ${ri} kΩ, Rf = ${rf} kΩ, Vin = ${vin} V), the output voltage is:`,
      correct: `${vo} V`, distractors: [`${r2((rf / ri) * vin)} V`, `${r2(-vin)} V`, `${r2((1 + rf / ri) * vin)} V`],
      solution: `Vout = −(Rf/Rin)·Vin = −(${rf}/${ri})×${vin} = ${vo} V.`,
      figure: { ...svg(markup), caption: "Inverting op-amp amplifier" },
    };
  },
  // Rectifier output waveform → identify
  (rand) => {
    const kind = pick(rand, ["full", "half"]);
    const path =
      kind === "full"
        ? "M20 90 Q 45 20 70 90 Q 95 20 120 90 Q 145 20 170 90 Q 195 20 220 90"
        : "M20 90 Q 45 20 70 90 L120 90 Q 145 20 170 90 L220 90";
    const markup = `<svg viewBox="0 0 250 110" width="250" height="110"><line x1="15" y1="90" x2="235" y2="90" stroke="#94a3b8" stroke-width="1"/><line x1="20" y1="15" x2="20" y2="100" stroke="#94a3b8" stroke-width="1"/><path d="${path}" fill="none" stroke="#2563eb" stroke-width="2"/><text x="222" y="104" font-size="9" fill="#475569">t</text></svg>`;
    return {
      topic: "Analog Electronics", difficulty: "medium",
      stem: `The rectified output waveform shown (${kind === "full" ? "every half-cycle is positive" : "alternate gaps between pulses"}) is produced by a:`,
      correct: kind === "full" ? "Full-wave rectifier" : "Half-wave rectifier",
      distractors: kind === "full" ? ["Half-wave rectifier", "Clipper circuit", "Pure AC source"] : ["Full-wave rectifier", "Voltage doubler", "Pure DC source"],
      solution: kind === "full"
        ? "Both half-cycles appear as positive humps with no gaps — characteristic of full-wave rectification."
        : "Only one half-cycle passes, leaving flat gaps — characteristic of half-wave rectification.",
      figure: { ...svg(markup), caption: `${kind}-wave rectified output` },
    };
  },
  // AM waveform → modulation index from envelope
  (rand) => {
    const amax = pick(rand, [10, 12, 15]);
    const amin = pick(rand, [2, 4, 6]);
    const mu = r2((amax - amin) / (amax + amin));
    const markup = `<svg viewBox="0 0 260 120" width="260" height="120"><line x1="15" y1="60" x2="245" y2="60" stroke="#94a3b8" stroke-width="1"/><path d="M20 40 Q 70 18 130 40 Q 190 62 240 45" fill="none" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="3 2"/><path d="M20 80 Q 70 102 130 80 Q 190 58 240 75" fill="none" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="3 2"/><path d="M20 60 L26 42 L32 78 L38 44 L44 76 L50 46 L56 74 L62 48 L68 72 L74 50 L80 70 L86 52 L92 68 L98 54 L104 66 L110 56 L116 64 L122 58 L128 62 L134 58 L140 64 L146 56 L152 66 L158 54 L164 68 L170 52 L176 70 L182 54 L188 68 L194 56 L200 66 L206 58 L212 64 L218 60 L224 62" fill="none" stroke="#2563eb" stroke-width="1.2"/><text x="120" y="16" font-size="9" fill="#16a34a">envelope (Amax=${amax}, Amin=${amin})</text></svg>`;
    return {
      topic: "Communication Systems", difficulty: "hard",
      stem: `The AM waveform's envelope (shown) has Amax = ${amax} V and Amin = ${amin} V. The modulation index is:`,
      correct: `${mu}`, distractors: [`${r2(amin / amax)}`, `${r2((amax - amin) / amax)}`, `${r2(mu + 0.2)}`],
      solution: `μ = (Amax − Amin)/(Amax + Amin) = (${amax}−${amin})/(${amax}+${amin}) = ${mu}.`,
      figure: { ...svg(markup), caption: "AM waveform with envelope" },
    };
  },
  // Two-gate logic circuit → output
  (rand) => {
    const a = pick(rand, [0, 1]);
    const b = pick(rand, [0, 1]);
    const c = pick(rand, [0, 1]);
    const out = (a & b) | c; // AND then OR
    const markup = `<svg viewBox="0 0 250 130" width="250" height="130"><line x1="10" y1="30" x2="60" y2="30" stroke="#1e293b" stroke-width="2"/><line x1="10" y1="55" x2="60" y2="55" stroke="#1e293b" stroke-width="2"/><text x="4" y="34" font-size="10" fill="#2563eb">A=${a}</text><text x="4" y="59" font-size="10" fill="#2563eb">B=${b}</text><path d="M60 18 L85 18 Q105 42 85 66 L60 66 Z" fill="#f1f5f9" stroke="#475569" stroke-width="1.5"/><text x="74" y="46" font-size="8" text-anchor="middle">AND</text><line x1="105" y1="42" x2="140" y2="42" stroke="#1e293b" stroke-width="2"/><line x1="10" y1="95" x2="140" y2="95" stroke="#1e293b" stroke-width="2"/><text x="4" y="99" font-size="10" fill="#2563eb">C=${c}</text><path d="M140 30 Q150 30 165 55 Q150 80 140 80 Q150 55 140 30 Z" fill="#f1f5f9" stroke="#475569" stroke-width="1.5"/><text x="150" y="58" font-size="8" text-anchor="middle">OR</text><line x1="165" y1="55" x2="220" y2="55" stroke="#1e293b" stroke-width="2"/><text x="195" y="48" font-size="10" fill="#dc2626">Y=?</text></svg>`;
    return {
      topic: "Digital Electronics", difficulty: "medium",
      stem: `In the logic circuit shown, Y = (A AND B) OR C with A = ${a}, B = ${b}, C = ${c}. The output Y is:`,
      correct: `${out}`, distractors: [`${1 - out}`, `${a & b & c}`, `${a | b | c ? 1 - out : out}`],
      solution: `(A·B) = ${a & b}; Y = (A·B) + C = ${a & b} + ${c} = ${out}.`,
      figure: { ...svg(markup), caption: "AND–OR logic circuit" },
    };
  },
  // RC filter Bode-style response → cutoff
  (rand) => {
    const fc = pick(rand, [100, 159, 320, 1000]);
    const markup = `<svg viewBox="0 0 270 120" width="270" height="120"><line x1="25" y1="90" x2="255" y2="90" stroke="#94a3b8" stroke-width="1"/><line x1="30" y1="15" x2="30" y2="95" stroke="#94a3b8" stroke-width="1"/><path d="M30 30 L150 30 L240 95" fill="none" stroke="#2563eb" stroke-width="2"/><line x1="150" y1="30" x2="150" y2="90" stroke="#dc2626" stroke-width="1" stroke-dasharray="3 2"/><text x="150" y="104" font-size="9" text-anchor="middle" fill="#dc2626">f_c</text><text x="34" y="26" font-size="9" fill="#475569">|H|(dB)</text><text x="244" y="104" font-size="9" fill="#475569">log f</text></svg>`;
    return {
      topic: "Analog Electronics", difficulty: "medium",
      stem: `The magnitude response shown is flat then rolls off at −20 dB/decade past f_c ≈ ${fc} Hz. This is the response of a:`,
      correct: "First-order low-pass filter", distractors: ["First-order high-pass filter", "Band-pass filter", "Notch (band-stop) filter"],
      solution: `Constant gain at low frequencies with a single −20 dB/decade roll-off above f_c ≈ ${fc} Hz is a first-order low-pass response.`,
      figure: { ...svg(markup), caption: "Low-pass magnitude response" },
    };
  },
];

// ─── Paper-II assembly (60 theory + 40 numerical, 3:2 interleave) ────────────
function genProfessional(rand: () => number, startId: number, setNo: number, tough: boolean): Q[] {
  const out: Q[] = [];
  const hardTheory = ENT_HARD_THEORY;
  const baseTheory = ENT_THEORY_POOL;
  const theorySlice: FactQ[] = tough
    ? [
        ...rotateSlice(ENT_TRICKY_POOL, setNo, 8, 7),
        ...rotateSlice(hardTheory, setNo, 12, 11),
        ...rotateSlice(baseTheory, setNo, 40, 44),
      ]
    : [
        ...rotateSlice(hardTheory, setNo, 16, 11),
        ...rotateSlice(baseTheory, setNo, 44, 44),
      ];
  shuffleInPlace(rand, theorySlice);

  const figItems = drawDistinct(rand, ENT_FIGURE_GENERATORS, 12);
  const numItems: FactQ[] = [
    ...figItems,
    ...fillSpecs(rand, ENT_HARD_NUM, ENT_NUM_GENERATORS, 28, tough ? 10 : 6),
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
  slug: "e-and-t",
  discipline: "Electronics & Telecom",
  seedBase: 0x2222000,
  genProfessional,
});

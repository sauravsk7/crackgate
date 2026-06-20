/**
 * CrackGate — CIL Management Trainee (Geology) Paper-II generator.
 *
 *   npx tsx scripts/cil/geology.ts                 # sets 1..15
 *   npx tsx scripts/cil/geology.ts --only=11,12
 *   npx tsx scripts/cil/geology.ts --from=1 --to=10
 *
 * Paper-I (100 Q) is the shared CIL core. This file supplies only Paper-II
 * (Professional Knowledge, 100 Q = ~60 theory + ~40 numerical) for Geology,
 * with strong emphasis on coal/economic geology relevant to Coal India Ltd.
 * SVG figures (folds, faults, strike–dip blocks, coal-seam sections) are
 * rendered by the app's QuestionFigure engine.
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

// ─── Curated Geology theory pool (base: easy / medium) ───────────────────────
const GEO_THEORY_POOL: FactQ[] = [
  // Mineralogy
  { topic: "Mineralogy", difficulty: "easy", stem: "On the Mohs scale of hardness, the hardest mineral (value 10) is:", correct: "Diamond", distractors: ["Quartz", "Corundum", "Topaz"], solution: "Mohs scale runs from talc (1) to diamond (10), the hardest natural mineral." },
  { topic: "Mineralogy", difficulty: "easy", stem: "The chemical composition of quartz is:", correct: "SiO₂", distractors: ["CaCO₃", "Al₂O₃", "FeS₂"], solution: "Quartz is silicon dioxide, SiO₂, one of the commonest minerals." },
  { topic: "Mineralogy", difficulty: "medium", stem: "The most abundant group of rock-forming minerals in the Earth's crust is the:", correct: "Silicates", distractors: ["Carbonates", "Sulphides", "Oxides"], solution: "Silicate minerals (feldspar, quartz, mica, etc.) dominate the crust." },
  { topic: "Mineralogy", difficulty: "medium", stem: "A mineral that effervesces (fizzes) when dilute hydrochloric acid is applied is:", correct: "Calcite", distractors: ["Quartz", "Feldspar", "Garnet"], solution: "Calcite (CaCO₃) reacts with dilute HCl, releasing CO₂ — a standard field test." },
  { topic: "Mineralogy", difficulty: "medium", stem: "The most abundant single mineral group in the crust is:", correct: "Feldspar", distractors: ["Mica", "Olivine", "Calcite"], solution: "Feldspars make up roughly half of the Earth's crust by volume." },
  { topic: "Mineralogy", difficulty: "medium", stem: "The colour of a mineral's powder, seen when it is rubbed on a porcelain plate, is its:", correct: "Streak", distractors: ["Lustre", "Cleavage", "Habit"], solution: "Streak is the colour of the fine powder, often more diagnostic than the surface colour." },
  { topic: "Mineralogy", difficulty: "easy", stem: "Mica is well known for its perfect:", correct: "Basal cleavage (it splits into thin sheets)", distractors: ["Conchoidal fracture", "Cubic cleavage", "Lack of any cleavage"], solution: "Mica has one perfect cleavage direction, peeling into thin elastic sheets." },
  // Petrology
  { topic: "Petrology", difficulty: "easy", stem: "Igneous rocks are formed by the:", correct: "Cooling and solidification of magma or lava", distractors: ["Compaction of sediments", "Recrystallization under heat and pressure", "Evaporation of seawater"], solution: "Igneous rocks crystallize from molten material (magma below ground, lava above)." },
  { topic: "Petrology", difficulty: "medium", stem: "Granite is best classified as a(n):", correct: "Coarse-grained intrusive (plutonic) felsic igneous rock", distractors: ["Fine-grained extrusive basic rock", "Clastic sedimentary rock", "Foliated metamorphic rock"], solution: "Granite cools slowly at depth, producing large crystals; it is felsic and intrusive." },
  { topic: "Petrology", difficulty: "medium", stem: "Basalt is a(n):", correct: "Fine-grained extrusive mafic igneous rock", distractors: ["Coarse-grained intrusive felsic rock", "Chemical sedimentary rock", "High-grade metamorphic rock"], solution: "Basalt is the fine-grained, dark, mafic rock formed from rapidly cooled lava." },
  { topic: "Petrology", difficulty: "easy", stem: "Sedimentary rocks are formed mainly by:", correct: "Deposition and lithification of sediments", distractors: ["Crystallization of magma", "Metamorphism of igneous rocks", "Volcanic eruption only"], solution: "Weathered material is transported, deposited, compacted and cemented into sedimentary rock." },
  { topic: "Petrology", difficulty: "medium", stem: "Sandstone is a:", correct: "Clastic sedimentary rock made of sand-sized grains", distractors: ["Chemical limestone", "Intrusive igneous rock", "Foliated metamorphic rock"], solution: "Sandstone is a clastic rock of cemented sand (mostly quartz) grains." },
  { topic: "Petrology", difficulty: "medium", stem: "Limestone is composed predominantly of the mineral:", correct: "Calcite (CaCO₃)", distractors: ["Quartz (SiO₂)", "Feldspar", "Gypsum"], solution: "Limestone is a carbonate rock chiefly of calcite." },
  { topic: "Petrology", difficulty: "easy", stem: "Metamorphic rocks form by the action of:", correct: "Heat and/or pressure on pre-existing rocks", distractors: ["Cooling of lava", "Cementation of sediment", "Evaporation of brine"], solution: "Metamorphism alters mineralogy and texture in the solid state under heat/pressure." },
  { topic: "Petrology", difficulty: "medium", stem: "Marble is the metamorphic product of:", correct: "Limestone", distractors: ["Shale", "Granite", "Sandstone"], solution: "Limestone recrystallizes into marble under metamorphism." },
  { topic: "Petrology", difficulty: "medium", stem: "Slate is the low-grade metamorphic product of:", correct: "Shale (mudstone)", distractors: ["Limestone", "Basalt", "Sandstone"], solution: "Fine-grained shale metamorphoses to slate, with characteristic slaty cleavage." },
  { topic: "Petrology", difficulty: "medium", stem: "Gneiss is characterised by:", correct: "Banding (segregation of light and dark minerals)", distractors: ["A glassy texture", "Fossil content", "Vesicular holes"], solution: "Gneiss is a high-grade foliated rock showing compositional banding (gneissic foliation)." },
  // Structural geology
  { topic: "Structural Geology", difficulty: "easy", stem: "An upward-arching fold, with the oldest beds in its core, is called a(n):", correct: "Anticline", distractors: ["Syncline", "Monocline", "Graben"], solution: "An anticline arches upward; its limbs dip away from the axis and oldest rocks lie in the core." },
  { topic: "Structural Geology", difficulty: "easy", stem: "A downward (trough-shaped) fold, with the youngest beds in its core, is a:", correct: "Syncline", distractors: ["Anticline", "Horst", "Dome"], solution: "A syncline sags downward; limbs dip toward the axis and youngest rocks lie in the core." },
  { topic: "Structural Geology", difficulty: "medium", stem: "A fracture in rock along which there has been observable displacement is a:", correct: "Fault", distractors: ["Joint", "Cleavage", "Bedding plane"], solution: "Faults show relative movement of the two blocks; joints show none." },
  { topic: "Structural Geology", difficulty: "medium", stem: "A normal fault is produced mainly by:", correct: "Tensional (extensional) stress", distractors: ["Compressional stress", "Shear stress only", "No stress"], solution: "Tension drops the hanging wall down relative to the footwall — a normal fault." },
  { topic: "Structural Geology", difficulty: "medium", stem: "A reverse (or thrust) fault is produced mainly by:", correct: "Compressional stress", distractors: ["Tensional stress", "Hydrostatic pressure", "Erosion"], solution: "Compression pushes the hanging wall up over the footwall — a reverse/thrust fault." },
  { topic: "Structural Geology", difficulty: "medium", stem: "The angle that a bed makes with the horizontal, measured perpendicular to strike, is the:", correct: "Dip", distractors: ["Strike", "Plunge", "Rake"], solution: "Dip is the maximum inclination of a plane; strike is the horizontal line on it." },
  { topic: "Structural Geology", difficulty: "medium", stem: "A fracture in rock along which there is no appreciable displacement is a:", correct: "Joint", distractors: ["Fault", "Fold", "Unconformity"], solution: "Joints are cracks without relative movement of the blocks." },
  // Stratigraphy / palaeontology
  { topic: "Stratigraphy", difficulty: "easy", stem: "The law of superposition states that, in an undisturbed sequence, the oldest layer is:", correct: "At the bottom", distractors: ["At the top", "In the middle", "Randomly placed"], solution: "Sediments are deposited oldest-first, so the lowest undisturbed bed is the oldest." },
  { topic: "Stratigraphy", difficulty: "medium", stem: "The principle of original horizontality states that sediments are originally deposited:", correct: "In nearly horizontal layers", distractors: ["In vertical sheets", "Along fault planes", "In random orientations"], solution: "Tilted/folded strata indicate later deformation, since beds start horizontal." },
  { topic: "Palaeontology", difficulty: "medium", stem: "A good index (guide) fossil should be:", correct: "Widespread but short-lived in geologic time", distractors: ["Geographically restricted and long-lived", "Rare and immobile", "Found only in igneous rocks"], solution: "Wide distribution plus a short time range makes a fossil useful for correlation/dating." },
  { topic: "Stratigraphy", difficulty: "medium", stem: "A buried erosion surface separating older from much younger rocks is a(n):", correct: "Unconformity", distractors: ["Conformity", "Fault", "Fold axis"], solution: "An unconformity represents a gap (missing time) in the rock record." },
  { topic: "Geologic Time", difficulty: "easy", stem: "We currently live in which geological era?", correct: "Cenozoic", distractors: ["Mesozoic", "Palaeozoic", "Precambrian"], solution: "The Cenozoic ('age of mammals') is the present era, following the Mesozoic." },
  // Economic / coal geology (CIL focus)
  { topic: "Coal Geology", difficulty: "easy", stem: "Arranged from lowest to highest rank, the coal series is:", correct: "Peat → lignite → bituminous → anthracite", distractors: ["Anthracite → bituminous → lignite → peat", "Lignite → peat → anthracite → bituminous", "Bituminous → anthracite → peat → lignite"], solution: "Increasing rank (carbon content) goes peat, lignite, sub-bituminous/bituminous, anthracite." },
  { topic: "Coal Geology", difficulty: "medium", stem: "The coal rank with the highest fixed-carbon content and calorific value is:", correct: "Anthracite", distractors: ["Peat", "Lignite", "Bituminous"], solution: "Anthracite is the highest-rank coal, with the greatest carbon content and heating value." },
  { topic: "Coal Geology", difficulty: "medium", stem: "The progressive transformation of plant matter into higher-rank coal is called:", correct: "Coalification", distractors: ["Lithification", "Metasomatism", "Diagenesis of carbonates"], solution: "Coalification increases carbon and reduces moisture/volatiles as burial heat and pressure rise." },
  { topic: "Coal Geology", difficulty: "medium", stem: "Most of India's coal occurs in rocks of which geological system?", correct: "Gondwana", distractors: ["Vindhyan", "Deccan Trap", "Siwalik"], solution: "The bulk of Indian coal lies in Lower Gondwana (Permian) sediments, e.g. the Barakar Formation." },
  { topic: "Economic Geology", difficulty: "medium", stem: "In an ore, the valueless minerals associated with the ore mineral are called:", correct: "Gangue", distractors: ["Tailings only", "Flux", "Slag"], solution: "Gangue is the commercially worthless material that must be separated from the ore mineral." },
  { topic: "Economic Geology", difficulty: "medium", stem: "Heavy minerals concentrated by flowing water in stream beds form a:", correct: "Placer deposit", distractors: ["Vein deposit", "Porphyry deposit", "Evaporite deposit"], solution: "Placers (e.g. of gold, cassiterite) form where moving water sorts dense, durable grains." },
  // Geomorphology / hydrogeology
  { topic: "Geomorphology", difficulty: "easy", stem: "The in-place breakdown of rock by mechanical and chemical processes is:", correct: "Weathering", distractors: ["Erosion", "Deposition", "Metamorphism"], solution: "Weathering disintegrates/decomposes rock in situ; erosion then removes the products." },
  { topic: "Hydrogeology", difficulty: "medium", stem: "A rock body that can store and transmit usable amounts of groundwater is a(n):", correct: "Aquifer", distractors: ["Aquiclude", "Aquifuge", "Caprock"], solution: "An aquifer is porous and permeable enough to yield water to wells." },
  { topic: "Hydrogeology", difficulty: "medium", stem: "The upper surface of the zone of saturation in the ground is the:", correct: "Water table", distractors: ["Capillary fringe top", "Bedrock surface", "Soil horizon A"], solution: "The water table marks the top of the saturated zone, below which pores are water-filled." },
  { topic: "Hydrogeology", difficulty: "medium", stem: "Porosity of a rock refers to its:", correct: "Fraction of pore (void) space", distractors: ["Ability to transmit fluids", "Mineral hardness", "Grain colour"], solution: "Porosity is the percentage of void space; permeability is the ability to transmit fluid." },
  // Plate tectonics / geophysics
  { topic: "Plate Tectonics", difficulty: "medium", stem: "The theory that the Earth's lithosphere is divided into moving plates is:", correct: "Plate tectonics", distractors: ["Uniformitarianism", "Isostasy", "Catastrophism"], solution: "Plate tectonics explains earthquakes, volcanism and mountain building by plate interactions." },
  { topic: "Geophysics", difficulty: "medium", stem: "The fastest seismic body waves, which arrive first at a station, are:", correct: "P-waves (primary/compressional)", distractors: ["S-waves (secondary/shear)", "Love waves", "Rayleigh waves"], solution: "P-waves are compressional and travel fastest, arriving before slower S and surface waves." },
  { topic: "Geophysics", difficulty: "easy", stem: "The magnitude of an earthquake is commonly expressed on the:", correct: "Richter (magnitude) scale", distractors: ["Mohs scale", "Beaufort scale", "pH scale"], solution: "Earthquake size is reported as magnitude (Richter / moment magnitude)." },
  { topic: "Earth Interior", difficulty: "medium", stem: "From the surface inward, the major layers of the Earth are:", correct: "Crust, mantle, core", distractors: ["Mantle, crust, core", "Core, crust, mantle", "Crust, core, mantle"], solution: "The Earth is layered into a thin crust, a thick mantle, and a metallic core." },
  { topic: "Earth Interior", difficulty: "medium", stem: "The boundary separating the crust from the mantle is the:", correct: "Mohorovičić discontinuity (Moho)", distractors: ["Gutenberg discontinuity", "Lehmann discontinuity", "Conrad surface"], solution: "The Moho marks the crust–mantle boundary, identified by a jump in seismic velocity." },
  { topic: "Crystallography", difficulty: "medium", stem: "A mineral's tendency to break along smooth planes related to its atomic structure is its:", correct: "Cleavage", distractors: ["Streak", "Lustre", "Tenacity"], solution: "Cleavage reflects planes of weak bonding in the crystal lattice." },
  { topic: "Petrology", difficulty: "medium", stem: "A volcanic rock containing many gas-bubble cavities is described as:", correct: "Vesicular", distractors: ["Porphyritic", "Phaneritic", "Foliated"], solution: "Vesicles are voids left by escaping gas in rapidly cooled lava (e.g. scoria, pumice)." },
];

// ─── Hard Geology theory (conceptual) ────────────────────────────────────────
const GEO_HARD_THEORY: FactQ[] = [
  { topic: "Petrology", difficulty: "hard", stem: "Bowen's reaction series predicts that the first silicate mineral to crystallize from a cooling basaltic magma is:", correct: "Olivine", distractors: ["Quartz", "Muscovite", "Biotite"], solution: "In the discontinuous series olivine crystallizes first at the highest temperature; quartz last." },
  { topic: "Coal Geology", difficulty: "hard", stem: "In the proximate analysis of coal, fixed carbon is obtained by subtracting from 100% the sum of:", correct: "Moisture, volatile matter and ash", distractors: ["Sulphur, ash and moisture", "Carbon, hydrogen and oxygen", "Volatile matter and sulphur only"], solution: "Fixed carbon (%) = 100 − (moisture + volatile matter + ash) in proximate analysis." },
  { topic: "Coal Geology", difficulty: "hard", stem: "As coal rank increases from lignite to anthracite, the volatile matter and moisture generally:", correct: "Decrease while fixed carbon increases", distractors: ["Increase while fixed carbon decreases", "Stay constant", "All increase together"], solution: "Higher rank means more fixed carbon and less moisture/volatiles, raising calorific value." },
  { topic: "Geophysics", difficulty: "hard", stem: "The Earth's outer core is inferred to be liquid because:", correct: "S-waves cannot pass through it", distractors: ["P-waves cannot pass through it", "Both P- and S-waves speed up there", "Neither wave reaches it"], solution: "Shear (S) waves cannot travel through liquids, creating an S-wave shadow zone — evidence of a liquid outer core." },
  { topic: "Structural Geology", difficulty: "hard", stem: "In a plunging anticline eroded to a level surface, the outcrop pattern of beds forms a:", correct: "V or nose closing in the direction of plunge", distractors: ["Perfect circle", "Straight parallel lines", "Random scatter"], solution: "Plunging folds produce V-shaped (zig-zag) outcrops; an anticline's nose points in the plunge direction." },
  { topic: "Petrology", difficulty: "hard", stem: "Index minerals such as chlorite → biotite → garnet → kyanite → sillimanite mark increasing:", correct: "Metamorphic grade (temperature/pressure)", distractors: ["Weathering intensity", "Sedimentary maturity", "Coal rank"], solution: "These index minerals appear at successive isograds, recording rising metamorphic grade." },
  { topic: "Geochronology", difficulty: "hard", stem: "Radiometric dating works because a radioactive parent isotope decays to a daughter at a rate set by its:", correct: "Constant half-life", distractors: ["Temperature", "Pressure", "Depth of burial"], solution: "Decay is exponential with a fixed half-life, so the parent/daughter ratio gives an absolute age." },
  { topic: "Earth Interior", difficulty: "hard", stem: "Isostasy is the principle that the lithosphere:", correct: "Floats in buoyant equilibrium on the denser mantle", distractors: ["Is rigid and fixed in place", "Has uniform density everywhere", "Sinks indefinitely under load"], solution: "Thicker/lighter crust rides higher; loading (ice, sediment) depresses it, like a floating raft." },
  { topic: "Structural Geology", difficulty: "hard", stem: "A nonconformity is an unconformity in which sedimentary rocks overlie:", correct: "Eroded igneous or metamorphic ('basement') rocks", distractors: ["Tilted older sedimentary rocks", "Parallel younger sedimentary rocks", "A lava flow only"], solution: "A nonconformity has stratified rocks resting on eroded crystalline basement; an angular unconformity has tilted strata below." },
  { topic: "Coal Geology", difficulty: "hard", stem: "Coalbed methane (CBM) is held in coal seams chiefly by:", correct: "Adsorption onto the coal's internal surfaces", distractors: ["Free gas in large open caverns", "Dissolution in oil", "Chemical bonding as carbonate"], solution: "CBM is mostly adsorbed on micropore surfaces; lowering pressure (dewatering) desorbs and releases it." },
  { topic: "Hydrogeology", difficulty: "hard", stem: "Darcy's law states that groundwater discharge is proportional to the hydraulic gradient and the:", correct: "Hydraulic conductivity (permeability) of the medium", distractors: ["Porosity alone", "Grain colour", "Water temperature only"], solution: "Q = K·i·A; flow rises with hydraulic conductivity K and gradient i." },
  { topic: "Petrology", difficulty: "hard", stem: "A porphyritic texture (large crystals in a fine groundmass) indicates:", correct: "Two stages of cooling — slow then fast", distractors: ["Uniform rapid cooling", "Deposition in water", "High-grade metamorphism"], solution: "Early slow cooling grows phenocrysts; later rapid cooling forms the fine matrix." },
  { topic: "Mineralogy", difficulty: "hard", stem: "Quartz (hardness 7) will scratch, but not be scratched by, which mineral?", correct: "Orthoclase feldspar (hardness 6)", distractors: ["Topaz (8)", "Corundum (9)", "Diamond (10)"], solution: "A mineral scratches anything softer; quartz (7) scratches feldspar (6) but not topaz/corundum/diamond." },
  { topic: "Coal Geology", difficulty: "hard", stem: "Compared with surface (opencast) mining, underground coal mining is generally chosen when the seam is:", correct: "Deep, so that the stripping ratio becomes uneconomic", distractors: ["Very shallow and thick", "At the surface", "Always, regardless of depth"], solution: "When overburden-to-coal (stripping) ratio is too high for opencast, underground methods become economic." },
  { topic: "Geophysics", difficulty: "hard", stem: "Gravity and magnetic surveys are examples of ____ geophysical methods:", correct: "Potential-field", distractors: ["Seismic-reflection", "Electromagnetic-induction", "Radiometric"], solution: "Gravity and magnetics map potential fields arising from density and susceptibility contrasts." },
  { topic: "Stratigraphy", difficulty: "hard", stem: "Walther's law states that facies occurring in a conformable vertical succession also occur:", correct: "Laterally adjacent in the original depositional environments", distractors: ["Only at unconformities", "In reverse order laterally", "Never side by side"], solution: "Conformably superposed facies represent environments that were originally side by side and migrated." },
];

// ─── Tricky conceptual pool (INCORRECT / compare / limiting) ─────────────────
const GEO_TRICKY_POOL: FactQ[] = [
  { topic: "Coal Geology", difficulty: "hard", stem: "Which statement about coal ranks is INCORRECT?", correct: "Lignite has a higher carbon content than anthracite", distractors: ["Anthracite is the highest-rank coal", "Peat is the lowest-rank precursor", "Carbon content increases with rank"], solution: "Anthracite, not lignite, has the highest carbon content — the statement is reversed." },
  { topic: "Structural Geology", difficulty: "hard", stem: "Which statement about anticlines is correct?", correct: "The oldest beds lie in the core of an anticline", distractors: ["The youngest beds lie in the core of an anticline", "An anticline is a downward fold", "Anticlines never trap hydrocarbons"], solution: "Erosion of an upfold exposes the oldest strata at its core; anticlines are classic hydrocarbon traps." },
  { topic: "Structural Geology", difficulty: "hard", stem: "Which pairing of fault type and stress is correct?", correct: "Normal fault — tensional stress", distractors: ["Normal fault — compressional stress", "Reverse fault — tensional stress", "Reverse fault — no stress"], solution: "Tension produces normal faults; compression produces reverse/thrust faults." },
  { topic: "Geophysics", difficulty: "hard", stem: "Which statement comparing seismic waves is correct?", correct: "S-waves cannot travel through liquids, but P-waves can", distractors: ["P-waves cannot travel through liquids", "Both travel only through solids", "S-waves are faster than P-waves"], solution: "Shear (S) waves need a solid; compressional (P) waves pass through solids, liquids and gases, and are faster." },
  { topic: "Hydrogeology", difficulty: "hard", stem: "Which statement about porosity and permeability is correct?", correct: "Clay can have high porosity but low permeability", distractors: ["High porosity always means high permeability", "Permeability is independent of pore connectivity", "Sand has lower porosity than shale always"], solution: "Clay's tiny, poorly connected pores hold much water yet transmit it slowly — high porosity, low permeability." },
  { topic: "Petrology", difficulty: "hard", stem: "Which statement is INCORRECT?", correct: "Granite cools faster than basalt, giving it finer grains", distractors: ["Granite is coarse-grained and intrusive", "Basalt is fine-grained and extrusive", "Slow cooling produces larger crystals"], solution: "Granite cools slowly at depth (coarse grains); basalt cools fast at the surface (fine grains) — the claim is reversed." },
  { topic: "Mineralogy", difficulty: "hard", stem: "Using Mohs hardness, which comparison is correct?", correct: "Quartz (7) scratches feldspar (6)", distractors: ["Calcite (3) scratches quartz (7)", "Talc (1) scratches gypsum (2)", "Feldspar (6) scratches corundum (9)"], solution: "A harder mineral scratches a softer one; quartz (7) > feldspar (6)." },
  { topic: "Stratigraphy", difficulty: "hard", stem: "The law of superposition reliably gives relative age only when the strata are:", correct: "Undisturbed (not overturned by folding/faulting)", distractors: ["Strongly folded and overturned", "Always vertical", "Igneous intrusions"], solution: "Tectonic overturning can invert beds, so superposition needs an undisturbed (right-way-up) sequence." },
  { topic: "Coal Geology", difficulty: "hard", stem: "Which statement about coalification is correct?", correct: "It increases fixed carbon and reduces volatile matter", distractors: ["It reduces carbon content", "It increases moisture content", "It converts coal into limestone"], solution: "Progressive burial heat raises rank: more fixed carbon, less moisture and volatiles." },
  { topic: "Palaeontology", difficulty: "hard", stem: "Which property makes a fossil a good index fossil?", correct: "Short geological range plus wide geographic distribution", distractors: ["Long range and narrow distribution", "Found only locally", "Restricted to igneous rocks"], solution: "Brief existence pins a narrow time; wide spread allows correlation across regions." },
  { topic: "Petrology", difficulty: "hard", stem: "Foliation (planar fabric) is a feature of which rock type?", correct: "Many metamorphic rocks", distractors: ["All igneous rocks", "All sedimentary rocks", "Only volcanic glass"], solution: "Directed pressure aligns minerals into foliation in metamorphic rocks like schist and gneiss." },
  { topic: "Economic Geology", difficulty: "hard", stem: "Which statement about ore and gangue is correct?", correct: "Gangue is the worthless mineral matter associated with the ore", distractors: ["Gangue is the valuable metal-bearing mineral", "Ore minerals are always worthless", "Gangue must always be smelted"], solution: "The ore mineral carries the metal of value; the surrounding gangue is discarded or processed away." },
  { topic: "Coal Geology", difficulty: "hard", stem: "Which statement about mining method selection is correct?", correct: "A high stripping ratio favours underground over opencast mining", distractors: ["A high stripping ratio favours opencast mining", "Stripping ratio is irrelevant", "Deep seams are always opencast"], solution: "When too much overburden must be removed per tonne (high stripping ratio), underground mining is preferred." },
  { topic: "Geophysics", difficulty: "hard", stem: "Which statement about the Moho is correct?", correct: "It separates the crust from the mantle and shows a velocity increase", distractors: ["It separates the outer and inner core", "Seismic velocity drops sharply across it", "It lies within the crust"], solution: "The Mohorovičić discontinuity marks the crust–mantle boundary, where P-wave velocity jumps." },
];

// ─── Geology numerical generators (parametric) ───────────────────────────────
const GEO_NUM_GENERATORS: SpecGen[] = [
  // Fixed carbon
  (rand) => {
    const m = pick(rand, [4, 5, 8, 10]);
    const vm = pick(rand, [20, 25, 30, 35]);
    const ash = pick(rand, [8, 10, 15, 20]);
    const fc = 100 - (m + vm + ash);
    return {
      topic: "Coal Geology", difficulty: "medium",
      stem: `A coal sample (proximate analysis) has ${m}% moisture, ${vm}% volatile matter and ${ash}% ash. Its fixed carbon is:`,
      correct: `${fc}%`, distractors: [`${100 - (vm + ash)}%`, `${100 - m}%`, `${fc + 5}%`],
      solution: `Fixed C = 100 − (moisture + VM + ash) = 100 − (${m}+${vm}+${ash}) = ${fc}%.`,
    };
  },
  // True thickness from apparent
  (rand) => {
    const apparent = pick(rand, [10, 20, 30, 40]);
    const dip = pick(rand, [30, 45, 60]);
    const t = r2(apparent * Math.sin((dip * Math.PI) / 180));
    return {
      topic: "Structural Geology", difficulty: "medium",
      stem: `A bed dipping at ${dip}° shows a width of ${apparent} m across a horizontal surface. Its true (perpendicular) thickness is about:`,
      correct: `${t} m`, distractors: [`${r2(apparent * Math.cos((dip * Math.PI) / 180))} m`, `${apparent} m`, `${r2(t + 5)} m`],
      solution: `True thickness = width × sin(dip) = ${apparent}×sin${dip}° ≈ ${t} m.`,
    };
  },
  // Porosity
  (rand) => {
    const voids = pick(rand, [15, 20, 25, 30]);
    const total = 100;
    return {
      topic: "Hydrogeology", difficulty: "easy",
      stem: `A rock sample of ${total} cm³ contains ${voids} cm³ of pore space. Its porosity is:`,
      correct: `${voids}%`, distractors: [`${voids / 2}%`, `${voids * 2}%`, `${100 - voids}%`],
      solution: `Porosity = (void volume/total volume)×100 = ${voids}/${total} = ${voids}%.`,
    };
  },
  // Number of half-lives → fraction remaining
  (rand) => {
    const n = pick(rand, [1, 2, 3, 4]);
    const frac = r2(100 / Math.pow(2, n));
    return {
      topic: "Geochronology", difficulty: "medium",
      stem: `After ${n} half-lives, the percentage of the original radioactive parent isotope remaining is:`,
      correct: `${frac}%`, distractors: [`${r2(frac * 2)}%`, `${r2(100 - frac)}%`, `${r2(frac / 2)}%`],
      solution: `Fraction remaining = (1/2)^${n} = ${frac}%.`,
    };
  },
  // Age from half-lives
  (rand) => {
    const hl = pick(rand, [1.3, 4.5, 5730 / 1000]); // Gyr / kyr scale (use generic)
    const n = pick(rand, [1, 2, 3]);
    const age = r2(hl * n);
    return {
      topic: "Geochronology", difficulty: "medium",
      stem: `A mineral has passed through ${n} half-lives of an isotope whose half-life is ${hl} (in the given time units). Its age is:`,
      correct: `${age}`, distractors: [`${r2(hl / n)}`, `${r2(age + hl)}`, `${r2(hl)}`],
      solution: `Age = number of half-lives × half-life = ${n}×${hl} = ${age}.`,
    };
  },
  // Coal reserve estimation
  (rand) => {
    const area = pick(rand, [1, 2, 5]); // km²
    const thick = pick(rand, [2, 3, 5]); // m
    const density = pick(rand, [1.3, 1.4]); // t/m³
    const reserve = r1(area * 1e6 * thick * density / 1e6);
    return {
      topic: "Coal Geology", difficulty: "medium",
      stem: `A coal seam covers ${area} km², is ${thick} m thick, with density ${density} t/m³. The in-situ reserve is about:`,
      correct: `${reserve} Mt`, distractors: [`${r1(reserve / 2)} Mt`, `${r1(reserve * 2)} Mt`, `${r1(area * thick)} Mt`],
      solution: `Reserve = area×thickness×density = ${area}×10⁶ m²×${thick} m×${density} t/m³ ≈ ${reserve} Mt.`,
    };
  },
  // Darcy velocity
  (rand) => {
    const K = pick(rand, [10, 20, 50]); // m/day
    const i = pick(rand, [0.01, 0.02, 0.05]);
    const v = r2(K * i);
    return {
      topic: "Hydrogeology", difficulty: "medium",
      stem: `An aquifer has hydraulic conductivity ${K} m/day and a hydraulic gradient of ${i}. The Darcy velocity is:`,
      correct: `${v} m/day`, distractors: [`${r2(K / i)} m/day`, `${r2(v * 2)} m/day`, `${r2(K)} m/day`],
      solution: `q = K·i = ${K}×${i} = ${v} m/day.`,
    };
  },
  // Specific gravity / density
  (rand) => {
    const mass = pick(rand, [54, 78, 81, 105]);
    const vol = pick(rand, [20, 30]);
    const sg = r2(mass / vol);
    return {
      topic: "Mineralogy", difficulty: "easy",
      stem: `A mineral specimen of mass ${mass} g has a volume of ${vol} cm³. Its specific gravity is about:`,
      correct: `${sg}`, distractors: [`${r2(vol / mass)}`, `${r2(sg * 2)}`, `${r2(sg + 1)}`],
      solution: `SG = mass/volume = ${mass}/${vol} = ${sg}.`,
    };
  },
  // Seismic distance
  (rand) => {
    const v = pick(rand, [6, 7, 8]); // km/s
    const t = pick(rand, [10, 20, 30]); // s
    const d = r1(v * t);
    return {
      topic: "Geophysics", difficulty: "medium",
      stem: `A P-wave travels at ${v} km/s and arrives ${t} s after the earthquake. The (approx.) distance to the source is:`,
      correct: `${d} km`, distractors: [`${r1(v / t)} km`, `${r1(d / 2)} km`, `${r1(t)} km`],
      solution: `distance = velocity × time = ${v}×${t} = ${d} km.`,
    };
  },
  // Stripping ratio
  (rand) => {
    const ob = pick(rand, [30, 45, 60]); // m³ overburden
    const coal = pick(rand, [5, 10, 15]); // m³ coal
    const sr = r2(ob / coal);
    return {
      topic: "Coal Geology", difficulty: "medium",
      stem: `To extract ${coal} m³ of coal, ${ob} m³ of overburden must be removed. The stripping ratio is:`,
      correct: `${sr} : 1`, distractors: [`${r2(coal / ob)} : 1`, `${r2(sr * 2)} : 1`, `${r2(sr + 1)} : 1`],
      solution: `Stripping ratio = overburden/coal = ${ob}/${coal} = ${sr} : 1.`,
    };
  },
  // Dip from rise/run
  (rand) => {
    const rise = pick(rand, [10, 20, 30]);
    const run = pick(rand, [10, 20, 40]);
    const dip = r1((Math.atan2(rise, run) * 180) / Math.PI);
    return {
      topic: "Structural Geology", difficulty: "medium",
      stem: `A bed drops ${rise} m over a horizontal distance of ${run} m. Its dip angle is about:`,
      correct: `${dip}°`, distractors: [`${r1(90 - dip)}°`, `${r1(dip + 10)}°`, `${r1(dip / 2)}°`],
      solution: `dip = tan⁻¹(rise/run) = tan⁻¹(${rise}/${run}) ≈ ${dip}°.`,
    };
  },
  // Calorific value rough
  (rand) => {
    const fc = pick(rand, [40, 50, 60, 70]);
    const cv = fc * 70; // crude kcal/kg proxy
    return {
      topic: "Coal Geology", difficulty: "easy",
      stem: `Using a simplified proxy where calorific value ≈ 70 × fixed-carbon%, a coal with ${fc}% fixed carbon has a calorific value of about:`,
      correct: `${cv} kcal/kg`, distractors: [`${cv / 2} kcal/kg`, `${cv * 2} kcal/kg`, `${cv + 700} kcal/kg`],
      solution: `CV ≈ 70 × ${fc} = ${cv} kcal/kg (illustrative proxy).`,
    };
  },
];

// ─── Hard Geology numerical generators (multi-step) ──────────────────────────
const GEO_HARD_NUM: SpecGen[] = [
  // Radiometric age from parent fraction (whole half-lives)
  (rand) => {
    const hl = pick(rand, [1.3, 0.7, 4.47]); // Gyr
    const n = pick(rand, [1, 2, 3]);
    const remaining = r2(100 / Math.pow(2, n));
    const age = r2(hl * n);
    return {
      topic: "Geochronology", difficulty: "hard",
      stem: `A rock retains ${remaining}% of its original parent isotope (half-life ${hl} Gyr). Its radiometric age is about:`,
      correct: `${age} Gyr`, distractors: [`${r2(hl)} Gyr`, `${r2(age + hl)} Gyr`, `${r2(hl / n)} Gyr`],
      solution: `${remaining}% remaining ⇒ ${n} half-lives ⇒ age = ${n}×${hl} = ${age} Gyr.`,
    };
  },
  // True thickness with two angles (slope + dip) simplified
  (rand) => {
    const width = pick(rand, [50, 80, 100]);
    const dip = pick(rand, [20, 35, 50]);
    const t = r2(width * Math.sin((dip * Math.PI) / 180));
    return {
      topic: "Structural Geology", difficulty: "hard",
      stem: `A dipping coal seam outcrops over a horizontal width of ${width} m on flat ground and dips at ${dip}°. Its true thickness is about:`,
      correct: `${t} m`, distractors: [`${r2(width * Math.cos((dip * Math.PI) / 180))} m`, `${r2(width)} m`, `${r2(t + 10)} m`],
      solution: `True thickness = horizontal width × sin(dip) = ${width}×sin${dip}° ≈ ${t} m.`,
    };
  },
  // Coal reserve with recovery factor
  (rand) => {
    const area = pick(rand, [2, 4, 6]); // km²
    const thick = pick(rand, [3, 4, 6]); // m
    const density = 1.4;
    const recovery = pick(rand, [0.6, 0.75, 0.85]);
    const minable = r1(area * 1e6 * thick * density * recovery / 1e6);
    return {
      topic: "Coal Geology", difficulty: "hard",
      stem: `A ${thick} m seam over ${area} km² (density 1.4 t/m³) has a recovery factor of ${recovery}. The mineable reserve is about:`,
      correct: `${minable} Mt`, distractors: [`${r1(area * thick * density)} Mt`, `${r1(minable / recovery)} Mt`, `${r1(minable * 2)} Mt`],
      solution: `Mineable = area×thickness×density×recovery = ${area}M m²×${thick}×1.4×${recovery} ≈ ${minable} Mt.`,
    };
  },
  // Darcy discharge
  (rand) => {
    const K = pick(rand, [10, 25, 50]); // m/day
    const i = pick(rand, [0.01, 0.02]);
    const A = pick(rand, [100, 200, 500]); // m²
    const Q = r1(K * i * A);
    return {
      topic: "Hydrogeology", difficulty: "hard",
      stem: `An aquifer (K = ${K} m/day) of cross-section ${A} m² has a hydraulic gradient of ${i}. The groundwater discharge is about:`,
      correct: `${Q} m³/day`, distractors: [`${r1(K * A)} m³/day`, `${r1(Q / 2)} m³/day`, `${r1(Q * 2)} m³/day`],
      solution: `Q = K·i·A = ${K}×${i}×${A} = ${Q} m³/day.`,
    };
  },
  // Earthquake epicentre distance from S-P time
  (rand) => {
    const sp = pick(rand, [5, 10, 15, 20]); // s
    const factor = 8; // km per s (approx)
    const d = r1(sp * factor);
    return {
      topic: "Geophysics", difficulty: "hard",
      stem: `At a station the S-wave arrives ${sp} s after the P-wave. Using ~8 km per second of S–P delay, the epicentral distance is about:`,
      correct: `${d} km`, distractors: [`${r1(sp)} km`, `${r1(d / 2)} km`, `${r1(d * 2)} km`],
      solution: `distance ≈ (S−P time) × 8 km/s = ${sp}×8 = ${d} km.`,
    };
  },
  // Overburden volume to remove
  (rand) => {
    const area = pick(rand, [10000, 20000, 50000]); // m²
    const depth = pick(rand, [20, 30, 50]); // m
    const vol = r1(area * depth / 1e6);
    return {
      topic: "Coal Geology", difficulty: "hard",
      stem: `An opencast block of ${area} m² has ${depth} m of overburden above the seam. The overburden volume to be removed is:`,
      correct: `${vol} million m³`, distractors: [`${r1(area / depth / 1e6)} million m³`, `${r1(vol / 2)} million m³`, `${r1(vol * 2)} million m³`],
      solution: `Volume = area × depth = ${area}×${depth} = ${area * depth} m³ = ${vol} million m³.`,
    };
  },
  // Grade tonnage of metal
  (rand) => {
    const ore = pick(rand, [1, 2, 5]); // Mt
    const grade = pick(rand, [1, 2, 3]); // %
    const metal = r1(ore * 1e6 * grade / 100 / 1000);
    return {
      topic: "Economic Geology", difficulty: "hard",
      stem: `An ore body of ${ore} Mt has an average metal grade of ${grade}%. The contained metal is about:`,
      correct: `${metal} kt`, distractors: [`${r1(metal / 2)} kt`, `${r1(ore * grade)} kt`, `${r1(metal * 2)} kt`],
      solution: `Metal = tonnage × grade = ${ore} Mt × ${grade}% = ${metal} thousand tonnes (kt).`,
    };
  },
];

// ─── Graphical (SVG) Geology figure generators ───────────────────────────────
const svg = (markup: string): { kind: "svg"; markup: string } => ({ kind: "svg", markup });

const GEO_FIGURE_GENERATORS: ((rand: () => number) => FactQ)[] = [
  // Fold cross-section → identify anticline/syncline
  (rand) => {
    const kind = pick(rand, ["anticline", "syncline"]);
    const path =
      kind === "anticline"
        ? "M20 90 Q 130 20 240 90"
        : "M20 30 Q 130 100 240 30";
    const path2 =
      kind === "anticline"
        ? "M20 110 Q 130 45 240 110"
        : "M20 55 Q 130 120 240 55";
    const markup = `<svg viewBox="0 0 260 130" width="260" height="130"><path d="${path}" fill="none" stroke="#2563eb" stroke-width="2"/><path d="${path2}" fill="none" stroke="#16a34a" stroke-width="2"/><line x1="130" y1="15" x2="130" y2="120" stroke="#dc2626" stroke-width="1" stroke-dasharray="3 2"/><text x="130" y="128" font-size="9" text-anchor="middle" fill="#dc2626">axial plane</text></svg>`;
    return {
      topic: "Structural Geology", difficulty: "medium",
      stem: `The fold shown in cross-section (${kind === "anticline" ? "beds arch upward" : "beds sag downward"} about the axial plane) is a(n):`,
      correct: kind === "anticline" ? "Anticline" : "Syncline",
      distractors: kind === "anticline" ? ["Syncline", "Monocline", "Graben"] : ["Anticline", "Horst", "Dome"],
      solution: kind === "anticline"
        ? "Upward-arching limbs dipping away from the axis define an anticline (oldest beds in core)."
        : "Downward-sagging limbs dipping toward the axis define a syncline (youngest beds in core).",
      figure: { ...svg(markup), caption: `${kind} (cross-section)` },
    };
  },
  // Fault block → identify normal/reverse
  (rand) => {
    const kind = pick(rand, ["normal", "reverse"]);
    // normal: hanging wall down; reverse: hanging wall up
    const hw = kind === "normal" ? 70 : 40;
    const markup = `<svg viewBox="0 0 260 130" width="260" height="130"><line x1="40" y1="25" x2="150" y2="80" stroke="#dc2626" stroke-width="2"/><rect x="20" y="40" width="120" height="70" fill="#fde68a" stroke="#475569" stroke-width="1" transform="skewX(-10)"/><rect x="150" y="${hw}" width="100" height="70" fill="#bfdbfe" stroke="#475569" stroke-width="1"/><line x1="60" y1="55" x2="135" y2="92" stroke="#1e293b" stroke-width="1.5" stroke-dasharray="2 2"/><line x1="160" y1="${hw + 20}" x2="245" y2="${hw + 20}" stroke="#1e293b" stroke-width="1.5" stroke-dasharray="2 2"/><text x="190" y="${hw + 12}" font-size="9" fill="#1e293b">hanging wall</text><text x="40" y="35" font-size="9" fill="#1e293b">footwall</text></svg>`;
    return {
      topic: "Structural Geology", difficulty: "medium",
      stem: `In the faulted block shown, the hanging wall has moved ${kind === "normal" ? "down relative to" : "up over"} the footwall. This is a:`,
      correct: kind === "normal" ? "Normal fault (tensional)" : "Reverse fault (compressional)",
      distractors: kind === "normal" ? ["Reverse fault (compressional)", "Strike-slip fault", "Thrust fault"] : ["Normal fault (tensional)", "Strike-slip fault", "Detachment fault"],
      solution: kind === "normal"
        ? "Hanging wall down = normal fault, caused by extension/tension."
        : "Hanging wall up = reverse fault, caused by compression.",
      figure: { ...svg(markup), caption: `${kind} fault` },
    };
  },
  // Strike-dip block → dip angle
  (rand) => {
    const dip = pick(rand, [20, 30, 45, 60]);
    const markup = `<svg viewBox="0 0 240 130" width="240" height="130"><polygon points="20,40 200,40 220,70 40,70" fill="#e2e8f0" stroke="#475569" stroke-width="1.5"/><line x1="40" y1="70" x2="220" y2="70" stroke="#2563eb" stroke-width="2"/><text x="120" y="86" font-size="9" fill="#2563eb">strike</text><line x1="120" y1="70" x2="160" y2="110" stroke="#dc2626" stroke-width="2"/><text x="150" y="100" font-size="10" fill="#dc2626">dip ${dip}°</text><path d="M120 70 A 30 30 0 0 1 150 92" fill="none" stroke="#dc2626" stroke-width="1"/></svg>`;
    return {
      topic: "Structural Geology", difficulty: "medium",
      stem: `On the block diagram shown, the inclined bedding plane dips at ${dip}°. The dip direction is, by definition:`,
      correct: "Perpendicular to the strike, in the direction of steepest descent",
      distractors: ["Parallel to the strike", "Vertical regardless of strike", "Horizontal along the strike"],
      solution: `Dip (here ${dip}°) is measured perpendicular to strike, down the line of steepest slope of the plane.`,
      figure: { ...svg(markup), caption: "Strike and dip of a bed" },
    };
  },
  // Coal-seam cross-section → overburden / thickness
  (rand) => {
    const ob = pick(rand, [20, 30, 40]);
    const seam = pick(rand, [3, 4, 5]);
    const sr = r2(ob / seam);
    const markup = `<svg viewBox="0 0 260 140" width="260" height="140"><rect x="20" y="20" width="220" height="60" fill="#fef3c7" stroke="#475569" stroke-width="1"/><text x="130" y="54" font-size="10" text-anchor="middle" fill="#92400e">overburden ${ob} m</text><rect x="20" y="80" width="220" height="20" fill="#1e293b"/><text x="130" y="94" font-size="9" text-anchor="middle" fill="#fff">coal seam ${seam} m</text><rect x="20" y="100" width="220" height="30" fill="#d1d5db" stroke="#475569" stroke-width="1"/><text x="130" y="120" font-size="9" text-anchor="middle" fill="#374151">floor</text></svg>`;
    return {
      topic: "Coal Geology", difficulty: "medium",
      stem: `The section shows ${ob} m of overburden above a ${seam} m coal seam. The volumetric stripping ratio (overburden : coal thickness) is:`,
      correct: `${sr} : 1`, distractors: [`${r2(seam / ob)} : 1`, `${r2(sr * 2)} : 1`, `${r2(sr + 1)} : 1`],
      solution: `Stripping ratio = overburden/coal = ${ob}/${seam} = ${sr} : 1.`,
      figure: { ...svg(markup), caption: "Coal seam with overburden" },
    };
  },
  // Stratigraphic column → relative age
  (rand) => {
    const labels = pick(rand, [["A", "B", "C", "D"]]);
    const markup = `<svg viewBox="0 0 180 150" width="180" height="150"><rect x="40" y="15" width="100" height="28" fill="#fde68a" stroke="#475569"/><text x="90" y="33" font-size="11" text-anchor="middle">${labels[0]}</text><rect x="40" y="43" width="100" height="28" fill="#bfdbfe" stroke="#475569"/><text x="90" y="61" font-size="11" text-anchor="middle">${labels[1]}</text><rect x="40" y="71" width="100" height="28" fill="#bbf7d0" stroke="#475569"/><text x="90" y="89" font-size="11" text-anchor="middle">${labels[2]}</text><rect x="40" y="99" width="100" height="28" fill="#fecaca" stroke="#475569"/><text x="90" y="117" font-size="11" text-anchor="middle">${labels[3]}</text><text x="150" y="33" font-size="9" fill="#475569">top</text><text x="150" y="117" font-size="9" fill="#475569">base</text></svg>`;
    return {
      topic: "Stratigraphy", difficulty: "medium",
      stem: `In the undisturbed stratigraphic column shown (top to base: ${labels.join(", ")}), the oldest layer is:`,
      correct: labels[3], distractors: [labels[0], labels[1], labels[2]],
      solution: `By the law of superposition, the lowest bed (${labels[3]}) is the oldest in an undisturbed sequence.`,
      figure: { ...svg(markup), caption: "Stratigraphic column" },
    };
  },
];

// ─── Paper-II assembly (60 theory + 40 numerical, 3:2 interleave) ────────────
function genProfessional(rand: () => number, startId: number, setNo: number, tough: boolean): Q[] {
  const out: Q[] = [];
  const hardTheory = GEO_HARD_THEORY;
  const baseTheory = GEO_THEORY_POOL;
  const theorySlice: FactQ[] = tough
    ? [
        ...rotateSlice(GEO_TRICKY_POOL, setNo, 8, 7),
        ...rotateSlice(hardTheory, setNo, 12, 11),
        ...rotateSlice(baseTheory, setNo, 40, 44),
      ]
    : [
        ...rotateSlice(hardTheory, setNo, 16, 11),
        ...rotateSlice(baseTheory, setNo, 44, 44),
      ];
  shuffleInPlace(rand, theorySlice);

  const figItems = drawDistinct(rand, GEO_FIGURE_GENERATORS, 12);
  const numItems: FactQ[] = [
    ...figItems,
    ...fillSpecs(rand, GEO_HARD_NUM, GEO_NUM_GENERATORS, 28, tough ? 10 : 6),
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
  slug: "geology",
  discipline: "Geology",
  seedBase: 0x2323000,
  genProfessional,
});

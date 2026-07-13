import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DIR = "apps/web/src/data/questions/ongc/geology";

function loadMock(no) {
  const path = join(DIR, `ongc-geology-${String(no).padStart(2, "0")}.json`);
  return { path, data: JSON.parse(readFileSync(path, "utf-8")) };
}

function saveMock(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  console.log(`  ✓ Saved ${path}`);
}

// Convert diagram format to figure format
// diagram: { type: "svg", description: "...", svg: "..." }
// → figure: { kind: "svg", caption: "...", markup: "..." }
function convertDiagram(q) {
  if (q.diagram && q.diagram.type === "svg" && q.diagram.svg) {
    q.figure = {
      kind: "svg",
      markup: q.diagram.svg,
      caption: q.diagram.description || "",
    };
    delete q.diagram;
    return true;
  }
  return false;
}

// Convert media array format to figure format
// media: [{ kind: "svg", caption: "...", markup: "..." }]
// → figure: { kind: "svg", caption: "...", markup: "..." }
function convertMedia(q) {
  if (Array.isArray(q.media) && q.media.length > 0) {
    const svgMedia = q.media.find((m) => m.kind === "svg");
    if (svgMedia) {
      q.figure = {
        kind: "svg",
        markup: svgMedia.markup,
        caption: svgMedia.caption || "",
      };
      delete q.media;
      return true;
    }
  }
  return false;
}

console.log("=== Normalizing Geology Mock Formats ===\n");

for (const i of [11, 12, 14]) {
  console.log(`Mock ${String(i).padStart(2, "0")}:`);
  const m = loadMock(i);
  let converted = 0;
  for (const q of m.data.questions) {
    if (convertDiagram(q)) converted++;
    else if (convertMedia(q)) converted++;
  }
  saveMock(m.path, m.data);
  console.log(`  Converted ${converted} diagrams/media to figure format\n`);
}

// Validate
console.log("=== Validation ===\n");
for (let i = 1; i <= 15; i++) {
  const { data } = loadMock(i);
  const domain = data.questions.filter((q) => q.section === "Domain");
  const withFig = domain.filter(
    (q) => q.figure && q.figure.kind === "svg"
  ).length;
  const withDiagram = domain.filter((q) => q.diagram).length;
  const withMedia = domain.filter((q) => q.media).length;
  const status =
    data.questions.length === 85 && withDiagram === 0 && withMedia === 0
      ? "✓"
      : "✗";
  console.log(
    `Mock ${String(i).padStart(2, "0")}: ${status} total=${data.questions.length} domainSVGs=${withFig} diagram=${withDiagram} media=${withMedia}`
  );
}

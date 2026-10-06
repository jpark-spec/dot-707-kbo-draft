// The reverse of build: pulls the data back out of a built page into data/
// (for when someone edited a single-file build directly). Usage: node scripts/extract.mjs dist/index.html
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(process.argv[2] || join(root, "dist/index.html"), "utf8");
const start = html.indexOf("const D = ") + "const D = ".length;
const end = html.indexOf(";\n", start);
const D = JSON.parse(html.slice(start, end).replace(/<\\\/(script)/gi, "</$1"));
const lines = a => "[\n" + a.map(x => JSON.stringify(x)).join(",\n") + "\n]\n";
const m = { data: Object.keys(D), moneyball: Object.keys(D.mb) };
for (const k of m.data) if (k !== "mb") writeFileSync(join(root, `data/${k}.json`), k === "rows" ? lines(D[k]) : JSON.stringify(D[k], null, 1) + "\n");
for (const k of m.moneyball) writeFileSync(join(root, `data/moneyball/${k}.json`), ["hist", "hist29"].includes(k) ? lines(D.mb[k]) : JSON.stringify(D.mb[k], null, 1) + "\n");
writeFileSync(join(root, "data/manifest.json"), JSON.stringify(m, null, 1) + "\n");
console.log(`extracted ${m.data.length} tables, ${D.rows.length} player-seasons`);

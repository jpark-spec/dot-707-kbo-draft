// Builds dist/index.html: the template in src/ with the data in data/ and the font in assets/
// inlined, so the game ships as one self-contained page (no requests besides Google Fonts).
import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = p => readFileSync(join(root, p), "utf8");
const json = p => JSON.parse(read(p));

export function loadData() {
  const m = json("data/manifest.json");
  const D = {};
  for (const k of m.data) {
    if (k === "mb") { D.mb = {}; for (const j of m.moneyball) D.mb[j] = json(`data/moneyball/${j}.json`); }
    else D[k] = json(`data/${k}.json`);
  }
  return D;
}

export function build({ out = "dist" } = {}) {
  const D = loadData();
  const font = readFileSync(join(root, "assets/fonts/Galmuri14-subset.woff2")).toString("base64");
  let html = read("src/index.html");
  const data = JSON.stringify(D).replace(/<\/(script)/gi, "<\\/$1");
  const must = (s, k) => { if (!s.includes(k)) throw new Error(`placeholder ${k} missing in src/index.html`); };
  must(html, "/*__DATA__*/null"); must(html, "/*__FONT_GALMURI14__*/");
  html = html.replace("/*__DATA__*/null", () => data)
             .replace("/*__FONT_GALMURI14__*/", () => `data:font/woff2;base64,${font}`);
  const dist = join(root, out);
  mkdirSync(dist, { recursive: true });
  writeFileSync(join(dist, "index.html"), html);
  const pub = join(root, "public");
  if (existsSync(pub)) for (const f of readdirSync(pub)) copyFileSync(join(pub, f), join(dist, f));
  return { bytes: Buffer.byteLength(html), rows: D.rows.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = build();
  console.log(`dist/index.html  ${(r.bytes / 1024 / 1024).toFixed(2)} MB  ·  ${r.rows} player-seasons`);
}

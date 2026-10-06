// Writes data/exports/player_seasons.csv: every player-season decoded into readable columns.
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadData } from "./build.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const D = loadData();
const BAT = ["PA", "AB", "H", "2B", "3B", "HR", "RBI", "BB", "HBP", "SO", "SB", "GDP", "IBB", "SF"];
const PIT = ["outs", "ER", "H", "HR", "BB", "HBP", "SO", "GS", "SV", "W", "G", "IBB", "L"];
const head = ["season", "team", "franchise", "player_id", "name", "type", "pos", "foreign", "bats_throws", "birth", "WAR", ...BAT.map(s => "bat_" + s), ...PIT.map(s => "pit_" + s)];
const q = v => (v == null ? "" : /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v);
const out = [head.join(",")];
for (const a of D.rows) {
  const t = a[0], s = a.slice(10), team = D.teams[a[2]], hb = D.hb[a[5]] || ["", ""];
  out.push([a[3] + 1982, team, D.fr[team] || "", a[5], D.names[a[1]], t ? "P" : "B", D.pos[a[4]], a[9] ? 1 : 0, hb[0], hb[1], (a[6] / 100).toFixed(2),
    ...BAT.map((_, i) => (t ? "" : s[i] ?? "")), ...PIT.map((_, i) => (t ? s[i] ?? "" : ""))].map(q).join(","));
}
mkdirSync(join(root, "data/exports"), { recursive: true });
writeFileSync(join(root, "data/exports/player_seasons.csv"), "﻿" + out.join("\n") + "\n");
console.log(`data/exports/player_seasons.csv  ${D.rows.length} rows`);

// Builds, then serves dist/ on http://localhost:3000 (PORT to change). No dependencies.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "./build.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const types = { ".html": "text/html; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".json": "application/json", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png" };
console.log(build());
const port = Number(process.env.PORT) || 3000;
createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  try {
    const body = await readFile(join(root, p.replace(/\.\.+/g, "")));
    res.writeHead(200, { "content-type": types[extname(p)] || "application/octet-stream", "cache-control": "no-store" });
    res.end(body);
  } catch { res.writeHead(404); res.end("not found"); }
}).listen(port, () => console.log(`.707 → http://localhost:${port}`));

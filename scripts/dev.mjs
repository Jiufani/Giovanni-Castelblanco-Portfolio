// A dependency-free local preview server. Nothing here runs in production.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../public/", import.meta.url));
const port = Number(process.env.PORT || 3000);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".pdf": "application/pdf", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8" };

const server = createServer(async (req, res) => {
  try {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { Allow: "GET, HEAD" }); return res.end();
    }
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    let target = resolve(root, "." + pathname);
    const rel = relative(root, target);
    if (rel.startsWith("..") || rel.includes("\u0000")) {
      res.writeHead(403); return res.end("Forbidden");
    }
    if ((await stat(target)).isDirectory()) target = resolve(target, "index.html");
    const bytes = await readFile(target);
    res.writeHead(200, { "Content-Type": types[extname(target)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(req.method === "HEAD" ? undefined : bytes);
  } catch (error) {
    res.writeHead(error instanceof URIError ? 400 : 404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(error instanceof URIError ? "Invalid URL" : "Page not found");
  }
});
server.on("error", (error) => { console.error(error.message); process.exitCode = 1; });
server.listen(port, "127.0.0.1", () => {
  console.log("Portfolio: http://localhost:" + port + "/");
  console.log("Press Ctrl+C to stop.");
});

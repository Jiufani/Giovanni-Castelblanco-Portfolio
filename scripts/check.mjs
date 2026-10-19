// Build-time checks validate source, assets, and deployment layout.
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Script } from "node:vm";
import { execFileSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = resolve(root, "public");
const html = await readFile(resolve(publicDir, "index.html"), "utf8");
const configSource = await readFile(resolve(publicDir, "site-config.js"), "utf8");
const sandbox = { window: {} };
new Script(configSource).runInNewContext(sandbox);
const config = sandbox.window.PORTFOLIO;
assert.ok(config && config.name && Array.isArray(config.projects), "Portfolio config is incomplete");

for (const script of ["public/app.js", "public/site-config.js", "public/sculpture.js", "public/work.js", "scripts/dev.mjs"]) {
  execFileSync(process.execPath, ["--check", resolve(root, script)], { stdio: "pipe" });
}
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  if (/^(https?:|mailto:|tel:)/.test(match[1])) continue;
  const file = match[1].split("?")[0];
  await access(resolve(publicDir, file.replace(/^\//, "")));
}
const htmlIds = Array.from(html.matchAll(/\bid="([^"]+)"/g), (match) => match[1]);
assert.equal(new Set(htmlIds).size, htmlIds.length, "Duplicate HTML IDs");
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  assert.ok(htmlIds.includes(match[1]), "Missing anchor: " + match[1]);
}
const ids = new Set();
async function checkAsset(value, label) {
  if (!value) return;
  assert.equal(typeof value, "string", "Invalid asset path: " + label);
  if (/^https?:\/\//i.test(value)) return;
  assert.ok(!/^[a-z][a-z0-9+.-]*:/i.test(value), "Use a local public path or HTTP(S) URL: " + label);
  const file = resolve(publicDir, value.split(/[?#]/)[0].replace(/^\//, ""));
  assert.ok(file.startsWith(publicDir + "/"), "Asset must stay under public: " + label);
  try { await access(file); } catch (error) { throw new Error("Missing asset for " + label + ": " + value); }
}
for (const project of config.projects) {
  if (project.published === false) continue;
  assert.ok(project.id && !ids.has(project.id), "Missing or duplicate project ID");
  assert.match(project.id, /^[a-z0-9][a-z0-9-]*$/);
  ids.add(project.id);
  await checkAsset(project.image, project.title);
  await checkAsset(project.cover, project.title + " cover");
  assert.ok(Array.isArray(project.filters), "Add discipline filters for " + project.id);
  assert.ok(project.sections.length >= 2 && project.previewNote, "Project overview is incomplete");
  const files = new Set();
  for (const file of project.files || []) {
    if (file.published === false) continue;
    assert.ok(file.id && !files.has(file.id), "Missing or duplicate file ID in " + project.id);
    assert.match(file.id, /^[a-z0-9][a-z0-9-]*$/);
    files.add(file.id);
    assert.ok(file.title && file.src && ["image", "video", "document"].includes(file.type), "Incomplete original work entry in " + project.id);
    await checkAsset(file.src, project.title + " / " + file.title);
    await checkAsset(file.thumbnail, project.title + " / " + file.title + " thumbnail");
  }
}
new Script(await readFile(resolve(publicDir, "work.js"), "utf8")).runInNewContext(sandbox);
const model = sandbox.window.PortfolioWork.build(config);
assert.equal(model.projects.length, config.projects.filter(project => project.published !== false).length);
assert.ok(html.includes('data-filter="projects"') && html.includes('id="sculpture-canvas"'), "Updated work controls missing");
const vercel = JSON.parse(await readFile(resolve(root, "vercel.json"), "utf8"));
assert.equal(vercel.framework, null, "Use Vercel's Other framework preset");
assert.equal(vercel.outputDirectory, "public");
assert.equal(vercel.buildCommand, "npm run build");
const css = await readFile(resolve(publicDir, "styles.css"), "utf8");
assert.ok(css.includes("prefers-reduced-motion") && css.includes("@media"), "Responsive and motion styles missing");
assert.ok(css.includes("[hidden]{display:none!important}"), "Hidden UI needs a reliable style");
console.log("PASS: Script syntax, gallery data, original-file paths, navigation anchors, and Vercel output.");
if (!config.email) console.log("SETUP: Add your contact email in public/site-config.js before sharing.");
if (!config.linkedin && !config.github) console.log("SETUP: Add your exact LinkedIn/GitHub profile URLs in public/site-config.js.");

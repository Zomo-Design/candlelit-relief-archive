import { readFile, readdir, realpath, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const resolvedRoot = await realpath(root);
const requiredRootAssets = [
  "card-back-logo.svg",
  "cursor-candle.png",
  "candle-sconce-loop.mp4",
  "candle-sconce-poster.png",
  "ASSET_LICENSE.md",
];
const minimumPublicCardCount = 2;
const canonicalDemoUrl = "https://zomo-design.github.io/candlelit-relief-archive/";
const requiredPresentationAssets = [
  "docs/images/candlelit-relief-archive-preview.webp",
];
const generatedHostDirectory = [".", "vercel"].join("");

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
}

async function requireFile(relativePath) {
  if (path.isAbsolute(relativePath) || relativePath.split(/[\\/]/).includes("..")) {
    throw new Error(`Unsafe asset path: ${relativePath}`);
  }
  const target = path.join(root, relativePath);
  const resolvedTarget = await realpath(target);
  if (!resolvedTarget.startsWith(`${resolvedRoot}${path.sep}`)) {
    throw new Error(`Asset escapes repository root: ${relativePath}`);
  }
  if (!(await stat(resolvedTarget)).isFile()) throw new Error(`Not a file: ${relativePath}`);
}

async function listRepositoryFiles(directory = root) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === ".git") continue;
    const absolute = path.join(directory, entry.name);
    const relative = path.relative(root, absolute).split(path.sep).join("/");
    if (entry.name === ".DS_Store" || entry.name === generatedHostDirectory) {
      throw new Error(`Private or generated file must not be published: ${relative}`);
    }
    if (entry.isDirectory()) files.push(...await listRepositoryFiles(absolute));
    else if (entry.isFile()) files.push({ absolute, relative });
  }
  return files;
}

const gallery = await readJson("gallery-config.json");
if (!Array.isArray(gallery.order) || gallery.order.length < minimumPublicCardCount) {
  throw new Error(`gallery-config.json must include at least ${minimumPublicCardCount} cards`);
}

for (const cardId of gallery.order) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(cardId)) throw new Error(`Invalid card id: ${cardId}`);
  const configPath = `${cardId}/card-config.json`;
  const card = await readJson(configPath);
  for (const key of ["albedo", "normal", "roughness", "height"]) {
    const asset = card.assets?.[key];
    if (typeof asset !== "string" || asset.length === 0) {
      throw new Error(`${configPath} is missing assets.${key}`);
    }
    await requireFile(`${cardId}/${asset}`);
  }
}

for (const file of ["index.html", "LICENSE", "README.md", "SECURITY.md", "ASSETS.md"]) {
  await requireFile(file);
}
for (const file of requiredRootAssets) await requireFile(file);
for (const file of requiredPresentationAssets) await requireFile(file);

const assetLicense = await readFile(path.join(root, "ASSET_LICENSE.md"), "utf8");
for (const phrase of ["All rights reserved", "not licensed under the MIT License", "Zomo Design"]) {
  if (!assetLicense.includes(phrase)) {
    throw new Error(`ASSET_LICENSE.md is missing required phrase: ${phrase}`);
  }
}

const readme = await readFile(path.join(root, "README.md"), "utf8");
for (const fragment of [
  canonicalDemoUrl,
  "docs/images/candlelit-relief-archive-preview.webp",
  "▶ Open Live Demo",
]) {
  if (!readme.includes(fragment)) {
    throw new Error(`README.md is missing required Demo fragment: ${fragment}`);
  }
}

const html = await readFile(path.join(root, "index.html"), "utf8");
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1]);
if (scripts.length !== 1) throw new Error(`Expected one inline script, found ${scripts.length}`);
new Function(scripts[0]);

const privateTokens = [
  ["/", "Users", "/"].join(""),
  ["/", "home", "/"].join(""),
  ["C:", "\\", "Users", "\\"].join(""),
  [".", "vercel", "/"].join(""),
  ["Work", "Buddy"].join(""),
];
const secretPatterns = [
  new RegExp(["gho", "_"].join("") + "[A-Za-z0-9]{20,}"),
  new RegExp(["github", "_pat_"].join("") + "[A-Za-z0-9_]{20,}"),
  new RegExp(["sk", "-"].join("") + "[A-Za-z0-9_-]{20,}"),
  new RegExp(["AK", "IA"].join("") + "[A-Z0-9]{16}"),
  new RegExp(["team", "_"].join("") + "[A-Za-z0-9]{8,}"),
  new RegExp(["prj", "_"].join("") + "[A-Za-z0-9]{8,}"),
];
const allowedUrlPrefixes = [
  canonicalDemoUrl,
  "http://127.0.0.1:",
  "http://www.w3.org/2000/svg",
];

const repositoryFiles = await listRepositoryFiles();
for (const file of repositoryFiles) {
  const buffer = await readFile(file.absolute);
  if (buffer.includes(0)) continue;
  const source = buffer.toString("utf8");
  for (const token of privateTokens) {
    const documentedIgnore = file.relative === ".gitignore" && token === privateTokens[3];
    if (!documentedIgnore && source.includes(token)) {
      throw new Error(`${file.relative} contains private data: ${token}`);
    }
  }
  for (const pattern of secretPatterns) {
    if (pattern.test(source)) throw new Error(`${file.relative} contains a possible secret: ${pattern}`);
  }
  for (const match of source.matchAll(/https?:\/\/[^\s<>"')]+/g)) {
    if (!allowedUrlPrefixes.some((prefix) => match[0].startsWith(prefix))) {
      throw new Error(`${file.relative} contains an unreviewed external URL: ${match[0]}`);
    }
  }
}

console.log(
  `Validated ${gallery.order.length} card(s), ${repositoryFiles.length} repository files, ` +
  "asset paths, inline JavaScript, and privacy checks."
);

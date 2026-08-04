#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const mdLinkRegex = /\[[^\]]+\]\(([^)]+)\)/g;
const errors = [];

const explicitFiles = [
  "agents/README.md",
  "cookbook/README.md",
  "hooks/README.md",
  "instructions/README.md",
  "plugins/README.md",
  "skills/README.md",
  "workflows/README.md",
  "schemas/README.md",
];

const explicitDirs = [
  "plugins/lightspeed-github-ops",
  "skills/lightspeed-frontmatter-audit",
  "skills/lightspeed-pr-review",
  "skills/lightspeed-label-governance",
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.isFile() && full.endsWith(".md")) files.push(full);
  }
  return files;
}

const filesToCheck = new Set(explicitFiles.map((f) => path.join(root, f)));
for (const dir of explicitDirs) {
  const fullDir = path.join(root, dir);
  if (fs.existsSync(fullDir)) {
    for (const file of walk(fullDir)) filesToCheck.add(file);
  }
}

for (const file of filesToCheck) {
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  for (const match of text.matchAll(mdLinkRegex)) {
    const href = match[1];
    if (
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("#") ||
      href.startsWith("mailto:")
    ) {
      continue;
    }
    const target = href.split("#")[0];
    const resolved = path.resolve(path.dirname(file), target);
    if (!fs.existsSync(resolved)) {
      errors.push(`${path.relative(root, file)} -> ${href}`);
    }
  }
}

if (errors.length) {
  console.error("Link validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("Link validation passed.");

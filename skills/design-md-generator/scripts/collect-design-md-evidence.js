#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

const includeNames = new Set(["DESIGN.md", "theme.json", "block.json"]);

const includeExtensions = new Set([".css", ".scss", ".sass", ".json", ".md"]);

const includePathFragments = [
  `${path.sep}styles${path.sep}`,
  `${path.sep}patterns${path.sep}`,
  `${path.sep}templates${path.sep}`,
  `${path.sep}parts${path.sep}`,
];

const skipDirs = new Set([
  ".git",
  "node_modules",
  "vendor",
  "dist",
  "build",
  "__pycache__",
]);

const results = [];

function shouldInclude(filePath, entryName) {
  if (includeNames.has(entryName)) {
    return true;
  }

  if (entryName.toLowerCase().includes("design")) {
    return true;
  }

  const ext = path.extname(entryName).toLowerCase();
  if (includeExtensions.has(ext)) {
    return includePathFragments.some((fragment) => filePath.includes(fragment));
  }

  return false;
}

function walk(currentDir) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) {
        walk(fullPath);
      }
      continue;
    }

    if (shouldInclude(fullPath, entry.name)) {
      const relativePath = path.relative(root, fullPath) || entry.name;
      const stat = fs.statSync(fullPath);
      results.push({
        path: relativePath,
        bytes: stat.size,
      });
    }
  }
}

walk(root);
results.sort((a, b) => a.path.localeCompare(b.path));

process.stdout.write(
  JSON.stringify(
    {
      root,
      files: results,
    },
    null,
    2,
  ),
);
process.stdout.write("\n");

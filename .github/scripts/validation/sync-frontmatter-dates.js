#!/usr/bin/env node

/**
 * Update `last_updated` to today's UTC date in staged markdown files
 * that contain YAML frontmatter.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "../..");
const TODAY_UTC = new Date().toISOString().slice(0, 10);

function runGit(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: "utf8", stdio: "pipe" }).trim();
}

function stagedMarkdownFiles() {
  const output = runGit("git diff --cached --name-only -- '*.md' '*.mdx'");
  return output
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((file) => fs.existsSync(path.join(ROOT, file)));
}

function updateLastUpdated(content) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!fmMatch) return { changed: false, content };

  const frontmatter = fmMatch[1];
  if (
    !/^\s*last_updated:\s*["']?\d{4}-\d{2}-\d{2}["']?\s*$/m.test(frontmatter)
  ) {
    return { changed: false, content };
  }

  const updatedFrontmatter = frontmatter.replace(
    /^\s*last_updated:\s*["']?\d{4}-\d{2}-\d{2}["']?\s*$/m,
    `last_updated: "${TODAY_UTC}"`,
  );

  if (updatedFrontmatter === frontmatter) return { changed: false, content };

  const updatedContent =
    content.slice(0, fmMatch.index) +
    `---\n${updatedFrontmatter}\n---\n` +
    content.slice(fmMatch[0].length);

  return { changed: true, content: updatedContent };
}

function main() {
  const files = stagedMarkdownFiles();
  if (!files.length) {
    console.log("No staged markdown files found.");
    return;
  }

  let updatedCount = 0;
  for (const relPath of files) {
    const absPath = path.join(ROOT, relPath);
    const original = fs.readFileSync(absPath, "utf8");
    const result = updateLastUpdated(original);
    if (!result.changed) continue;

    fs.writeFileSync(absPath, result.content);
    execSync(`git add -- "${relPath}"`, { cwd: ROOT, stdio: "pipe" });
    updatedCount++;
    console.log(`Updated last_updated: ${relPath}`);
  }

  if (!updatedCount) {
    console.log("No last_updated fields needed changes.");
    return;
  }

  console.log(`Updated ${updatedCount} file(s) to last_updated=${TODAY_UTC}.`);
}

if (require.main === module) main();

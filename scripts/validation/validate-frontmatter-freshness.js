#!/usr/bin/env node

/**
 * Validate frontmatter freshness for changed markdown files.
 *
 * Rules for existing files with YAML frontmatter:
 * - If body content changed, `last_updated` must change and match today's UTC date.
 * - If body content changed, `version` must change.
 *
 * New files are skipped by this validator because frontmatter presence/shape
 * is already handled by the schema validator.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const ROOT = path.join(__dirname, "../..");
const TODAY_UTC = new Date().toISOString().slice(0, 10);

function parseArgs(argv) {
  const args = { base: null, head: null, staged: false };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--base") args.base = argv[++i];
    else if (arg === "--head") args.head = argv[++i];
    else if (arg === "--staged") args.staged = true;
  }
  return args;
}

function runGit(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: "utf8", stdio: "pipe" }).trim();
}

function changedMarkdownFiles({ base, head, staged }) {
  let output;
  if (staged) {
    output = runGit("git diff --cached --name-only -- '*.md' '*.mdx'");
  } else if (base && head) {
    output = runGit(`git diff --name-only ${base} ${head} -- '*.md' '*.mdx'`);
  } else {
    output = runGit("git diff --name-only HEAD~1 HEAD -- '*.md' '*.mdx'");
  }

  return output
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((file) => fs.existsSync(path.join(ROOT, file)));
}

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { raw: null, data: null, body: content };
  const raw = match[0];
  let data;
  try {
    data = yaml.load(match[1]) || {};
  } catch {
    data = null;
  }
  const body = content.slice(raw.length);
  return { raw, data, body };
}

function gitShowFile(rev, file) {
  try {
    return runGit(`git show ${rev}:${file}`);
  } catch {
    return null;
  }
}

function main() {
  const args = parseArgs(process.argv);
  const files = changedMarkdownFiles(args);

  if (!files.length) {
    console.log("No changed markdown files to validate.");
    return;
  }

  const errors = [];

  for (const relPath of files) {
    const currentContent = fs.readFileSync(path.join(ROOT, relPath), "utf8");
    const current = extractFrontmatter(currentContent);

    // Skip files without frontmatter.
    if (!current.raw || !current.data) continue;

    // Determine base content from `base` (range mode) or index/HEAD (staged mode).
    const previousContent = args.staged
      ? gitShowFile("HEAD", relPath)
      : args.base
        ? gitShowFile(args.base, relPath)
        : gitShowFile("HEAD~1", relPath);

    // New file in this diff scope; skip (handled by other validators).
    if (!previousContent) continue;

    const previous = extractFrontmatter(previousContent);
    if (!previous.raw || !previous.data) continue;

    const bodyChanged = previous.body !== current.body;
    if (!bodyChanged) continue;

    const hasDateField =
      Object.prototype.hasOwnProperty.call(previous.data, "last_updated") ||
      Object.prototype.hasOwnProperty.call(current.data, "last_updated");
    const hasVersionField =
      Object.prototype.hasOwnProperty.call(previous.data, "version") ||
      Object.prototype.hasOwnProperty.call(current.data, "version");

    if (hasDateField) {
      const prevLastUpdated = String(previous.data.last_updated || "");
      const currLastUpdated = String(current.data.last_updated || "");
      const unchangedButToday =
        prevLastUpdated === currLastUpdated && currLastUpdated === TODAY_UTC;

      if (prevLastUpdated === currLastUpdated && !unchangedButToday) {
        errors.push(
          `${relPath}: body changed but last_updated was not updated (${currLastUpdated}).`,
        );
      } else if (currLastUpdated !== TODAY_UTC) {
        errors.push(
          `${relPath}: last_updated must be today's UTC date (${TODAY_UTC}), found ${currLastUpdated}.`,
        );
      }
    }

    if (hasVersionField) {
      const prevVersion = String(previous.data.version || "");
      const currVersion = String(current.data.version || "");
      if (prevVersion === currVersion) {
        errors.push(
          `${relPath}: body changed but version was not updated (${currVersion}).`,
        );
      }
    }
  }

  if (errors.length) {
    console.error("\nFrontmatter freshness validation failed:\n");
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log("Frontmatter freshness validation passed.");
}

if (require.main === module) main();

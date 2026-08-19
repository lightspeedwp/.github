#!/usr/bin/env node
/**
 * Collect Markdown files with URLs for link checking
 * Replaces multiline shell logic with Node.js
 */

import { execFileSync } from "child_process";
import fs from "fs";

const eventName = process.env.GITHUB_EVENT_NAME;
const baseSha = process.env.BASE_SHA;
const headSha = process.env.HEAD_SHA;

if (eventName !== "pull_request" && eventName !== "push") {
  console.log("files=");
  process.exit(0);
}

// Get changed markdown files
let changedFiles = [];
try {
  const output = execFileSync("git", [
    "diff",
    "--name-only",
    baseSha,
    headSha,
    "--",
    "*.md",
    "*.mdx",
  ]);

  changedFiles = output
    .toString()
    .split("\n")
    .filter((f) => f.trim())
    .filter((f) => !f.startsWith(".github/instructions/.archive/"))
    .filter((f) => !f.startsWith(".githu./.github/reports/"));
} catch (error) {
  console.error("Failed to get changed files:", error.message);
  process.exit(1);
}

if (changedFiles.length === 0) {
  console.log("files=");
  process.exit(0);
}

// Find files with URLs
const urlPattern = /https?:\/\/|www\.|mailto:|^\[[^\]]+\]:\s*https?:\/\//m;
const MAX_LINK_FILES = 300;

let linkFiles = [];
for (const file of changedFiles) {
  try {
    const content = fs.readFileSync(file, "utf8");
    if (urlPattern.test(content)) {
      linkFiles.push(file);
      if (linkFiles.length >= MAX_LINK_FILES) break;
    }
  } catch {
    // File doesn't exist or can't be read, skip it
  }
}

if (
  changedFiles.filter((f) => {
    try {
      return urlPattern.test(fs.readFileSync(f, "utf8"));
    } catch {
      return false;
    }
  }).length > MAX_LINK_FILES
) {
  const totalWithUrls = changedFiles.filter((f) => {
    try {
      return urlPattern.test(fs.readFileSync(f, "utf8"));
    } catch {
      return false;
    }
  }).length;
  console.error(
    `::warning::Changed files with URLs (${totalWithUrls}) exceed the ${MAX_LINK_FILES}-file link-check cap; only the first ${MAX_LINK_FILES} were checked. Remaining ${totalWithUrls - MAX_LINK_FILES} file(s) were not link-checked.`,
  );
}

console.log(`files=${linkFiles.join(" ")}`);

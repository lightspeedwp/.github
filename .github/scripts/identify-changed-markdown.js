#!/usr/bin/env node
/**
 * Identify changed Markdown files from git diff
 * Outputs: has_changes, files (multiline heredoc format)
 */

import { execFileSync } from "child_process";

let base = process.env.BASE_SHA || "";
let head = process.env.HEAD_SHA || process.env.GITHUB_SHA || "";

// Fallback for null SHAs
if (base === "0000000000000000000000000000000000000000") {
  base = "HEAD~1";
}

if (!head) {
  console.error("Missing HEAD_SHA environment variable");
  process.exit(1);
}

try {
  const changed = execFileSync(
    "git",
    ["diff", "--name-only", base, head, "--", "*.md", "*.mdx"],
    {
      encoding: "utf8",
      maxBuffer: 1024 * 1024,
    },
  )
    .trim()
    .split("\n")
    .filter(Boolean);

  const hasChanges = changed.length > 0;

  // Output for GitHub Actions
  console.log(`has_changes=${hasChanges}`);

  if (hasChanges) {
    console.log("files<<CHANGED_EOF");
    changed.forEach((f) => console.log(f));
    console.log("CHANGED_EOF");
  }
} catch (_err) {
  // Fallback if diff fails
  console.log("has_changes=false");
  console.log("files<<CHANGED_EOF");
  console.log("CHANGED_EOF");
}

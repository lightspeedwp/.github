#!/usr/bin/env node
/**
 * badges.agent.js - Automates workflow badge updates in README.md.
 *
 * Usage: node .github/agents/badges.agent.js
 *
 * @author [Author Name]
 * @date [YYYY-MM-DD]
 *
 * See .github/agents/badges.agent.md for spec.
 */
import { updateBadgesInReadme } from "../../scripts/includes/badges.js";
import path from "path";
import { fileURLToPath } from "url";

async function main() {
  const repoRoot = process.cwd();
  const readmePath = path.join(repoRoot, "README.md");
  await updateBadgesInReadme(readmePath, ".github/workflows", {
    backup: true,
  });
  console.log("Badges updated.");
}

// Run if called directly
const __filename = fileURLToPath(import.meta.url);
if (__filename === process.argv[1]) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

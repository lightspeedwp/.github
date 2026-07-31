/**
 * badgeUtils.js
 * Utilities for generating and inserting badge blocks in README.md files.
 */

// TODO: Align this helper with the latest automation spec updates.

const fs = require("fs");
const path = require("path");

/**
 * Generate badge markdown for all workflows in .github/workflows/
 */
function generateWorkflowBadges(repo, branch = "main", format = "stacked") {
  const workflowsDir = path.join(".github", "workflows");
  if (!fs.existsSync(workflowsDir)) {
    return [];
  }
  const badges = [];
  fs.readdirSync(workflowsDir).forEach((file) => {
    if (file.endsWith(".yml") || file.endsWith(".yaml")) {
      const workflowName = file.replace(/\.(yml|yaml)$/, "");
      const badgeUrl = `https://github.com/${repo}/actions/workflows/${file}/badge.svg?branch=${branch}`;
      const workflowUrl = `https://github.com/${repo}/actions/workflows/${file}`;
      badges.push(`[![${workflowName}](${badgeUrl})](${workflowUrl})`);
    }
  });
  if (badges.length === 0) {
    return [];
  }
  if (format === "inline") {
    return [badges.join(" ")];
  }
  return badges;
}

/**
 * Insert or update badge block in README.md between <!-- BADGES-START --> and <!-- BADGES-END -->
 */
function updateReadmeBadges(readmeFile, badges) {
  const badgeStart = "<!-- BADGES-START -->";
  const badgeEnd = "<!-- BADGES-END -->";
  let content = fs.readFileSync(readmeFile, "utf-8");
  const badgeBlock = [badgeStart, ...badges, badgeEnd].join("\n");
  if (content.includes(badgeStart) && content.includes(badgeEnd)) {
    // Replace existing block
    content = content.replace(
      new RegExp(`${badgeStart}[\\s\\S]*?${badgeEnd}`, "m"),
      badgeBlock,
    );
  } else {
    // Insert after first header
    content = content.replace(/^(# .+\n)/, `$1${badgeBlock}\n`);
  }
  fs.writeFileSync(readmeFile, content);
}

module.exports = {
  generateWorkflowBadges,
  updateReadmeBadges,
};

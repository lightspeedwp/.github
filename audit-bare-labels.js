#!/usr/bin/env node

/**
 * Audit script to identify bare labels (unprefixed) in the repository
 * Phase 2: Label Prefix Enforcement - Fix Existing Issues
 */

import fs from "fs";
import * as yaml from "js-yaml";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load canonical labels from labels.yml
function loadCanonicalLabels() {
  const labelsPath = path.join(__dirname, ".github", "labels.yml");
  const content = fs.readFileSync(labelsPath, "utf8");
  const labels = yaml.load(content);

  return labels.map((label) => label.name);
}

// Extract common bare labels (these were used before governance was enforced)
function getCommonBareLabels() {
  return [
    // Type aliases
    "bug",
    "feature",
    "enhancement",
    "task",
    "refactor",
    "test",
    "documentation",
    "chore",
    "improve",
    "ui",
    "ux",
    "help",
    "support",
    "research",
    "investigation",
    "build",
    "ci",
    "cd",
    "release",
    "performance",
    "security",
    "a11y",
    "accessibility",
    "design",
    "content",
    "epic",
    "story",
    "qa",

    // Priority aliases
    "urgent",
    "critical",
    "high",
    "medium",
    "low",
    "important",
    "minor",
    "priority",

    // Status aliases
    "needs-review",
    "in-progress",
    "done",
    "blocked",
    "wontfix",
    "duplicate",
    "invalid",
    "stale",
    "on-hold",
    "needs-triage",
    "needs-design",
    "needs-documentation",
    "needs-qa",
    "needs-testing",

    // Area aliases
    "core",
    "docs",
    "testing",
    "infrastructure",
    "devops",
    "backend",
    "frontend",
    "database",
    "api",
    "plugin",
    "theme",
    "block-editor",
    "woocommerce",
    "dependencies",
    "deployment",

    // Meta / contributor aliases
    "good-first-issue",
    "help-wanted",
    "help wanted",
    "discussion",
    "contributor",
    "community",

    // Other common bare labels
    "bug-report",
    "feature-request",
    "question",
    "feedback",
    "improvement",
    "urgent-fix",
  ];
}

// Map bare labels to canonical prefixed labels
function createBareToCanonicalMapping(canonicalLabels) {
  const bareLabels = getCommonBareLabels();
  const mapping = {};

  bareLabels.forEach((bare) => {
    const normalized = bare.toLowerCase().trim();
    let canonical = null;

    // Direct matching logic
    {
      switch (normalized) {
        // Type mappings
        case "bug":
        case "bug-report":
          canonical = "type:bug";
          break;
        case "feature":
        case "feature-request":
          canonical = "type:feature";
          break;
        case "enhancement":
        case "improve":
          canonical = "type:improve";
          break;
        case "task":
          canonical = "type:task";
          break;
        case "refactor":
          canonical = "type:refactor";
          break;
        case "test":
          canonical = "type:test";
          break;
        case "documentation":
          canonical = "type:documentation";
          break;
        case "docs":
          canonical = "area:documentation";
          break;
        case "chore":
          canonical = "type:chore";
          break;
        case "ui":
          canonical = "type:ui";
          break;
        case "ux":
        case "ux-feedback":
          canonical = "type:ux-feedback";
          break;
        case "help":
        case "support":
          canonical = "type:help";
          break;
        case "research":
        case "investigation":
          canonical = "type:research";
          break;
        case "build":
          canonical = "type:build";
          break;
        case "ci":
        case "cd":
          canonical = "area:ci";
          break;
        case "release":
          canonical = "type:release";
          break;
        case "performance":
          canonical = "type:performance";
          break;
        case "security":
          canonical = "type:security";
          break;
        case "a11y":
        case "accessibility":
          canonical = "type:a11y";
          break;
        case "design":
          canonical = "type:design";
          break;
        case "content":
          canonical = "area:content";
          break;
        case "epic":
          canonical = "type:epic";
          break;
        case "story":
          canonical = "type:story";
          break;
        case "qa":
          canonical = "type:qa";
          break;

        // Priority mappings
        case "urgent":
        case "critical":
          canonical = "priority:critical";
          break;
        case "high":
        case "important":
          canonical = "priority:important";
          break;
        case "urgent-fix":
          canonical = "priority:critical";
          break;
        case "medium":
          canonical = "priority:normal";
          break;
        case "low":
        case "minor":
          canonical = "priority:minor";
          break;

        // Status mappings
        case "needs-review":
          canonical = "status:needs-review";
          break;
        case "in-progress":
          canonical = "status:in-progress";
          break;
        case "done":
          canonical = "status:done";
          break;
        case "blocked":
          canonical = "status:blocked";
          break;
        case "wontfix":
          canonical = "status:wontfix";
          break;
        case "duplicate":
          canonical = "status:duplicate";
          break;
        case "invalid":
          canonical = "status:wontfix";
          break;
        case "stale":
          canonical = "meta:stale";
          break;
        case "on-hold":
          canonical = "status:on-hold";
          break;
        case "needs-triage":
          canonical = "status:needs-triage";
          break;
        case "needs-design":
          canonical = "status:needs-design";
          break;
        case "needs-documentation":
          canonical = "status:needs-documentation";
          break;
        case "needs-qa":
          canonical = "status:needs-qa";
          break;
        case "needs-testing":
          canonical = "status:needs-testing";
          break;

        // Area mappings
        case "core":
          canonical = "area:core";
          break;
        case "testing":
          canonical = "area:tests";
          break;
        case "infrastructure":
        case "devops":
          canonical = "area:infrastructure";
          break;
        case "backend":
        case "api":
        case "database":
          canonical = "area:core";
          break;
        case "frontend":
          canonical = "area:theme";
          break;
        case "plugin":
          canonical = "area:plugins";
          break;
        case "theme":
          canonical = "area:theme";
          break;
        case "block-editor":
          canonical = "area:block-editor";
          break;
        case "woocommerce":
          canonical = "area:woocommerce";
          break;
        case "dependencies":
          canonical = "area:dependencies";
          break;
        case "deployment":
          canonical = "area:deployment";
          break;

        // Contributor mappings
        case "good-first-issue":
          canonical = "contrib:good-first-issue";
          break;
        case "help-wanted":
        case "help wanted":
          canonical = "contrib:help-wanted";
          break;
        case "discussion":
        case "contributor":
        case "community":
          canonical = "contrib:discussion";
          break;

        // Fallback
        default: {
          // Try to find a close match in canonical labels
          const match = canonicalLabels.find(
            (cl) =>
              cl.includes(normalized) ||
              normalized.includes(cl.split(":")[1] || ""),
          );
          canonical = match || null;
          break;
        }
      }
    }

    if (canonical) {
      mapping[bare] = canonical;
    }
  });

  return mapping;
}

function main() {
  console.log("🔍 Label Audit - Phase 2: Bare Label Identification\n");

  const canonicalLabels = loadCanonicalLabels();
  console.log(`✓ Loaded ${canonicalLabels.length} canonical prefixed labels\n`);

  const mapping = createBareToCanonicalMapping(canonicalLabels);

  console.log("📋 Bare Label → Canonical Label Mapping:\n");
  console.log("| Bare Label | Canonical Label |");
  console.log("|---|---|");

  Object.entries(mapping)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([bare, canonical]) => {
      console.log(`| \`${bare}\` | \`${canonical}\` |`);
    });

  console.log(`\n✓ Total bare labels mapped: ${Object.keys(mapping).length}`);

  // Save mapping to JSON for use in remediation script
  const reportDir = path.join(
    __dirname,
    ".github",
    "reports",
    "label-remediation",
  );
  const mappingPath = path.join(reportDir, "bare-label-mapping.json");

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log(
    `\n📄 Mapping saved to: ${path.relative(process.cwd(), mappingPath)}`,
  );
}

main();

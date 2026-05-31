#!/usr/bin/env node

/**
 * Phase 2 WCEU 2026 Validation Script
 * Verifies all Phase 2 deliverables are complete and ready for Phase 3
 *
 * @module scripts/validate-phase2-completion
 * @fileoverview Validates Phase 2 WCEU 2026 deliverables
 * @author LightSpeedWP Team
 * @version 1.0.0
 */

import fs from "fs";
import { execSync } from "child_process";
import readline from "readline";

const COLORS = {
  RED: "\x1b[31m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  RESET: "\x1b[0m",
};

let checksPassed = 0;
let checksFailed = 0;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}

function passCheck(msg) {
  console.log(`${COLORS.GREEN}✓${COLORS.RESET} ${msg}`);
  checksPassed++;
}

function failCheck(msg) {
  console.log(`${COLORS.RED}✗${COLORS.RESET} ${msg}`);
  checksFailed++;
}

function warnCheck(msg) {
  console.log(`${COLORS.YELLOW}⚠${COLORS.RESET} ${msg}`);
}

function infoCheck(msg) {
  console.log(`${COLORS.BLUE}ℹ${COLORS.RESET} ${msg}`);
}

function checkFile(filePath, errorMsg = null) {
  if (fs.existsSync(filePath)) {
    passCheck(`${filePath} exists`);
    return true;
  }
  if (errorMsg) {
    failCheck(errorMsg);
  } else {
    failCheck(`${filePath} missing`);
  }
  return false;
}

function countMatches(filePath, pattern) {
  try {
    if (!fs.existsSync(filePath)) return 0;
    const content = fs.readFileSync(filePath, "utf8");
    const regex = new RegExp(pattern, "g");
    const matches = content.match(regex);
    return matches ? matches.length : 0;
  } catch {
    return 0;
  }
}

function getLineCount(filePath) {
  try {
    if (!fs.existsSync(filePath)) return 0;
    const content = fs.readFileSync(filePath, "utf8");
    return content.split("\n").length;
  } catch {
    return 0;
  }
}

async function main() {
  console.log("==========================================");
  console.log("Phase 2 WCEU 2026 Completion Validation");
  console.log("==========================================");
  console.log("");

  // 1. NotebookLM Output Files
  console.log("=== NotebookLM Output Files ===");
  const notebookLmOutput = "wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md";
  checkFile(notebookLmOutput);

  if (fs.existsSync(notebookLmOutput)) {
    const part1 = countMatches(notebookLmOutput, "Part 1:");
    const part2 = countMatches(notebookLmOutput, "Part 2:");
    const part3 = countMatches(notebookLmOutput, "Part 3:");
    const part4 = countMatches(notebookLmOutput, "Part 4:");

    part1 > 0
      ? passCheck("Part 1 (Speaker Notes) present")
      : warnCheck("Part 1 (Speaker Notes) not found");
    part2 > 0
      ? passCheck("Part 2 (Visuals) present")
      : warnCheck("Part 2 (Visuals) not found");
    part3 > 0
      ? passCheck("Part 3 (Metrics) present")
      : warnCheck("Part 3 (Metrics) not found");
    part4 > 0
      ? passCheck("Part 4 (Narrative Flow) present")
      : warnCheck("Part 4 (Narrative Flow) not found");

    const lines = getLineCount(notebookLmOutput);
    if (lines > 100) {
      passCheck(`${notebookLmOutput} has content (${lines} lines)`);
    } else {
      failCheck(`${notebookLmOutput} appears too short (${lines} lines)`);
    }
  }

  console.log("");
  console.log("=== Supporting Files ===");
  checkFile("wceu-2026/PHASE2_NOTEBOOKLM_PROMPTS.md");
  checkFile("wceu-2026/PHASE2_EXECUTION_CHECKLIST.md");
  checkFile("wceu-2026/notebooklm/sources-index.md");

  if (fs.existsSync("wceu-2026/notebooklm/sources-index.md")) {
    const sourceUrls = countMatches(
      "wceu-2026/notebooklm/sources-index.md",
      "<https://",
    );
    if (sourceUrls >= 50) {
      passCheck(`notebooklm/sources-index.md has ${sourceUrls} URLs`);
    } else {
      warnCheck(
        `notebooklm/sources-index.md has only ${sourceUrls} URLs (expected ~60)`,
      );
    }
  }

  console.log("");
  console.log("=== Foundation Slides (Google Slides) ===");
  infoCheck("Google Slides verification requires manual check:");
  infoCheck("  - Slide 1: Cover (title, subtitle, speaker name, dark design)");
  infoCheck("  - Slide 2: Speaker intro (photo, bio, credentials, footer)");
  infoCheck(
    "  - Slide 23: Contact details (email, website, GitHub, LinkedIn, footer)",
  );
  infoCheck("  - Slide 24: Thank you (minimal, elegant)");
  console.log("");

  const slidesComplete = await question(
    "Are all 4 foundation slides created and accessible? (y/n): ",
  );
  if (slidesComplete.toLowerCase() === "y") {
    passCheck("Foundation slides created");
  } else {
    warnCheck("Foundation slides not yet complete");
  }

  console.log("");
  const slidesUrl = await question(
    "Google Slides URL (paste here, then press Enter): ",
  );
  if (slidesUrl) {
    infoCheck(`Google Slides URL saved: ${slidesUrl}`);
    try {
      fs.mkdirSync("wceu-2026", { recursive: true });
      fs.writeFileSync("wceu-2026/.phase2-slides-url.txt", slidesUrl);
      passCheck("Google Slides URL recorded in .phase2-slides-url.txt");
    } catch (err) {
      failCheck(`Failed to save Google Slides URL: ${err.message}`);
    }
  } else {
    warnCheck("No Google Slides URL provided");
  }

  console.log("");
  console.log("=== Design System (Optional) ===");
  checkFile(
    "wceu-2026/DESIGN_SYSTEM.md",
    "wceu-2026/DESIGN_SYSTEM.md not yet created (optional)",
  );

  console.log("");
  console.log("=== Content Quality Checks ===");

  // Check frontmatter on NotebookLM output
  if (fs.existsSync(notebookLmOutput)) {
    const content = fs.readFileSync(notebookLmOutput, "utf8");
    if (
      content.includes("---") &&
      content.includes("title:") &&
      content.includes("description:")
    ) {
      passCheck("PHASE2_NOTEBOOKLM_OUTPUT.md has proper frontmatter");
    } else {
      warnCheck("PHASE2_NOTEBOOKLM_OUTPUT.md frontmatter incomplete");
    }
  }

  // Check for key content sections
  if (fs.existsSync(notebookLmOutput)) {
    const hasTiming = countMatches(notebookLmOutput, "Timing:");
    const hasExamples = countMatches(
      notebookLmOutput,
      "Example|example|GitHub",
    );
    const hasVisuals = countMatches(
      notebookLmOutput,
      "diagram|Diagram|visual|Visual|flowchart",
    );

    if (hasTiming > 10) {
      passCheck(`Content includes timing estimates (${hasTiming} instances)`);
    } else {
      warnCheck(`Timing estimates may be sparse (${hasTiming} instances)`);
    }

    if (hasExamples > 10) {
      passCheck(
        `Content includes examples and links (${hasExamples} instances)`,
      );
    } else {
      warnCheck(`Examples/links may be sparse (${hasExamples} instances)`);
    }

    if (hasVisuals > 10) {
      passCheck(
        `Content includes visual suggestions (${hasVisuals} instances)`,
      );
    } else {
      warnCheck(`Visual suggestions may be sparse (${hasVisuals} instances)`);
    }
  }

  console.log("");
  console.log("=== Markdown Validation ===");
  try {
    execSync("npm run lint:md -- wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md", {
      stdio: "pipe",
      cwd: process.cwd(),
    });
    passCheck("PHASE2_NOTEBOOKLM_OUTPUT.md markdown linting passed");
  } catch {
    failCheck("PHASE2_NOTEBOOKLM_OUTPUT.md has markdown linting issues");
  }

  console.log("");
  console.log("=== Frontmatter Validation ===");
  try {
    execSync("npm run validate:frontmatter", {
      stdio: "pipe",
      cwd: process.cwd(),
    });
    passCheck("All frontmatter validation passed");
  } catch {
    warnCheck("Some frontmatter validation issues (check logs for details)");
  }

  console.log("");
  console.log("=== Phase 2 Readiness for Phase 3 ===");

  // Summary
  let readyForPhase3 = true;
  if (checksFailed > 0) {
    warnCheck("Some validation checks failed (review above)");
    readyForPhase3 = false;
  }

  if (slidesComplete.toLowerCase() !== "y") {
    warnCheck("Foundation slides not complete");
    readyForPhase3 = false;
  }

  if (!slidesUrl) {
    warnCheck("Google Slides URL not provided");
    readyForPhase3 = false;
  }

  console.log("");
  console.log("==========================================");
  console.log(
    `Results: ${COLORS.GREEN}${checksPassed} passed${COLORS.RESET}, ${COLORS.RED}${checksFailed} failed${COLORS.RESET}`,
  );
  console.log("==========================================");
  console.log("");

  rl.close();

  if (readyForPhase3) {
    console.log(
      `${COLORS.GREEN}✓ Phase 2 Complete — Ready for Phase 3 (May 31)${COLORS.RESET}`,
    );
    console.log("");
    console.log("Next Steps:");
    console.log("1. Review PHASE2_NOTEBOOKLM_OUTPUT.md for completeness");
    console.log("2. Start Phase 3 on May 31 morning (6–8 hours)");
    console.log("3. Transfer NotebookLM briefs to Google Slides");
    console.log("4. Design all 24 slides with dark-mode template");
    console.log("5. Final accessibility audit + speaker rehearsal");
    process.exit(0);
  } else {
    console.log(
      `${COLORS.YELLOW}⚠ Phase 2 Incomplete — Address issues above before Phase 3${COLORS.RESET}`,
    );
    console.log("");
    console.log("Missing:");
    if (slidesComplete.toLowerCase() !== "y") {
      console.log("  - Complete 4 foundation slides in Google Slides");
    }
    if (!slidesUrl) {
      console.log("  - Provide Google Slides URL");
    }
    if (!fs.existsSync(notebookLmOutput)) {
      console.log(
        "  - Create PHASE2_NOTEBOOKLM_OUTPUT.md with NotebookLM content",
      );
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`${COLORS.RED}Error:${COLORS.RESET} ${err.message}`);
  process.exit(1);
});

#!/usr/bin/env node

/**
 * Generate Phase 2C Performance Reports
 * Runs benchmarks and generates HTML dashboard + Markdown report
 */

import { runBenchmarks } from "./performance-benchmarking-phase-2c.js";
import {
  generateHTMLDashboard,
  generateMarkdownReport,
} from "./metrics-dashboard-phase-2c.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "../../../../");

async function generateReports() {
  console.log("\n🚀 Generating Phase 2C Performance Reports...\n");

  try {
    // Run benchmarks
    const results = await runBenchmarks();

    // Generate HTML dashboard
    const htmlPath = path.join(__dirname, "phase-2c-dashboard.html");
    generateHTMLDashboard(results, htmlPath);
    console.log(`\n✅ HTML Dashboard: ${path.relative(REPO_ROOT, htmlPath)}`);

    // Generate Markdown report
    const md = generateMarkdownReport(results);
    const mdPath = path.join(REPO_ROOT, "docs/PHASE-2C-VALIDATION-RESULTS.md");
    fs.mkdirSync(path.dirname(mdPath), { recursive: true });
    fs.writeFileSync(mdPath, md);
    console.log(`✅ Markdown Report: ${path.relative(REPO_ROOT, mdPath)}`);

    console.log("\n✨ Phase 2C reports generated successfully!\n");
    return true;
  } catch (err) {
    console.error("Error generating reports:", err);
    throw err;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateReports()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

export { generateReports };

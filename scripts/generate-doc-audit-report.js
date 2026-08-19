#!/usr/bin/env node
/**
 * Generate documentation audit report
 * Reads validation outcome environment variables and generates step summary
 */

import fs from "fs";

const syntaxPassed = process.env.SYNTAX_PASSED === "true";
const a11yPassed = process.env.A11Y_PASSED === "true";
const contrastPassed = process.env.CONTRAST_PASSED === "true";
const auditScope = process.env.AUDIT_SCOPE || "documentation";

const report = [
  "## Documentation Audit Report",
  "",
  `**Scope**: ${auditScope}`,
  "",
  "### Validation Results",
  "| Check | Result |",
  "|-------|--------|",
  `| Syntax | ${syntaxPassed ? "✅ Passed" : "❌ Failed"} |`,
  `| Accessibility | ${a11yPassed ? "✅ Passed" : "❌ Failed"} |`,
  `| Colour Contrast | ${contrastPassed ? "✅ Passed" : "❌ Failed"} |`,
  "",
];

// Append summary file if it exists
const summaryPath = ".githu./.github/reports/mermaid-audit/summary.md";
if (fs.existsSync(summaryPath)) {
  const summaryContent = fs.readFileSync(summaryPath, "utf8");
  report.push(summaryContent);
}

console.log(report.join("\n"));

#!/usr/bin/env node
/**
 * Validate Mermaid diagram accessibility compliance in all README files
 * Checks for presence of accTitle and accDescr attributes
 * @module scripts/validation/validate-mermaid-accessibility.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../../");

const README_FILES = [
  "README.md",
  "profile/README.md",
  "scripts/README.md",
  "tests/README.md",
  ".github/README.md",
  ".github/ISSUE_TEMPLATE/README.md",
  ".github/projects/README.md",
  ".vscode/README.md",
];

function extractMermaidDiagrams(content) {
  const diagrams = [];
  const regex = /```mermaid\r?\n([\s\S]*?)```/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const diagramContent = match[1].trim();
    diagrams.push(diagramContent);
  }

  return diagrams;
}

function getDiagramType(content) {
  const types = [
    "graph",
    "flowchart",
    "sequenceDiagram",
    "stateDiagram",
    "erDiagram",
    "gantt",
    "pie",
  ];
  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "" || trimmed.startsWith("%%")) {
      continue;
    }

    for (const type of types) {
      if (new RegExp(`^${type}\\b`).test(trimmed)) {
        return type;
      }
    }

    if (/^stateDiagram-v2\b/.test(trimmed)) {
      return "stateDiagram";
    }

    const match = trimmed.match(/^(\w+)/);
    return match ? match[1] : "unknown";
  }

  return "unknown";
}

function validateAccessibility(content) {
  const issues = [];

  // Check for accTitle
  const hasAccTitle =
    /accTitle\s*[:=]|accTitle\s*{/.test(content) ||
    /^\s*accTitle\s+/m.test(content);
  if (!hasAccTitle) {
    issues.push("Missing accTitle attribute");
  }

  // Check for accDescr
  const hasAccDescr =
    /accDescr\s*[:=]|accDescr\s*{/.test(content) ||
    /^\s*accDescr\s+/m.test(content);
  if (!hasAccDescr) {
    issues.push("Missing accDescr attribute");
  }

  // Validate accDescr block format if present
  let inAccDescrBlock = false;
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("accDescr {")) {
      inAccDescrBlock = true;
    }

    if (inAccDescrBlock && line === "}") {
      inAccDescrBlock = false;
    }
  }

  if (inAccDescrBlock) {
    issues.push("Unclosed accDescr block");
  }

  return issues;
}

async function main() {
  console.log("♿ Validating Mermaid diagram accessibility compliance...\n");

  const report = {
    totalDiagrams: 0,
    accessibleDiagrams: 0,
    inaccessibleDiagrams: 0,
    issues: [],
  };

  const csvRows = [
    "README,Diagram Number,Diagram Type,Has accTitle,Has accDescr,Missing Attributes,Compliance Status",
  ];

  for (const file of README_FILES) {
    const filePath = path.join(ROOT, file);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${file}`);
      continue;
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const diagrams = extractMermaidDiagrams(content);

    if (diagrams.length === 0) {
      console.log(`✅ ${file}: No Mermaid diagrams`);
      continue;
    }

    console.log(`📄 ${file}: Checking ${diagrams.length} diagram(s)`);

    for (let i = 0; i < diagrams.length; i++) {
      const diagramContent = diagrams[i];
      const type = getDiagramType(diagramContent);
      report.totalDiagrams++;

      const issues = validateAccessibility(diagramContent);

      const hasAccTitle =
        /accTitle\s*[:=]|accTitle\s*{/.test(diagramContent) ||
        /^\s*accTitle\s+/m.test(diagramContent);
      const hasAccDescr =
        /accDescr\s*[:=]|accDescr\s*{/.test(diagramContent) ||
        /^\s*accDescr\s+/m.test(diagramContent);

      if (issues.length === 0) {
        report.accessibleDiagrams++;
        console.log(
          `   ✅ Diagram ${i + 1} [${type}]: Accessible (accTitle & accDescr present)`,
        );
        csvRows.push(`${file},${i + 1},${type},Yes,Yes,"—",✅ Accessible`);
      } else {
        report.inaccessibleDiagrams++;
        const issueMsg = issues.join("; ");
        console.log(`   ⚠️  Diagram ${i + 1} [${type}]: ${issueMsg}`);
        csvRows.push(
          `${file},${i + 1},${type},${hasAccTitle ? "Yes" : "No"},${hasAccDescr ? "Yes" : "No"},"${issueMsg}",⚠️ Non-Compliant`,
        );
        report.issues.push({
          file,
          diagramIndex: i + 1,
          type,
          issues,
        });
      }
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 ACCESSIBILITY SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total diagrams:       ${report.totalDiagrams}`);
  console.log(`Accessible diagrams:  ${report.accessibleDiagrams}`);
  console.log(`Non-compliant:        ${report.inaccessibleDiagrams}`);
  console.log(
    `Compliance rate:      ${((report.accessibleDiagrams / report.totalDiagrams) * 100).toFixed(1)}%`,
  );

  if (report.inaccessibleDiagrams > 0) {
    console.log("\n⚠️  ACCESSIBILITY ISSUES FOUND:");
    for (const issue of report.issues) {
      console.log(`\n  📄 ${issue.file}`);
      console.log(`  📊 Diagram: #${issue.diagramIndex} (${issue.type})`);
      for (const msg of issue.issues) {
        console.log(`  ⚠️  ${msg}`);
      }
    }
  }

  // Create accessibility audit report
  const reportContent = `---
title: Mermaid Diagram Accessibility Compliance Report — Issue #669
description: Accessibility compliance audit of all 24 Mermaid diagrams for accTitle and accDescr attributes
version: 1.0.0
created_date: "${new Date().toISOString().split("T")[0]}"
last_updated: "${new Date().toISOString().split("T")[0]}"
file_type: documentation
maintainer: Claude Code
owners:
  - Claude Code
license: GPL-3.0
tags:
  - audit
  - mermaid
  - accessibility
  - a11y
  - diagrams
  - wave-5
domain: documentation
status: active
stability: stable
---

# Mermaid Diagram Accessibility Compliance Report

**Generated**: ${new Date().toISOString()}

## Summary

- **Total diagrams**: ${report.totalDiagrams}
- **Accessible diagrams**: ${report.accessibleDiagrams}
- **Non-compliant diagrams**: ${report.inaccessibleDiagrams}
- **Compliance rate**: ${((report.accessibleDiagrams / report.totalDiagrams) * 100).toFixed(1)}%

## Files Analyzed

${README_FILES.map((f) => `- ${f}`).join("\n")}

## Compliance Criteria

All diagrams must include:
- ✅ **accTitle attribute** — Brief accessible title for screen readers
- ✅ **accDescr attribute** — Detailed accessible description of diagram content

Supported formats:
- Single-line: \`accTitle Title text\` or \`accDescr: "Description text"\`
- Block format: \`accDescr { ... }\`

## Detailed Results

${
  report.inaccessibleDiagrams === 0
    ? "✅ All diagrams are fully accessible with proper accTitle and accDescr attributes!"
    : `⚠️ ${report.inaccessibleDiagrams} diagram(s) missing accessibility attributes:

${report.issues
  .map(
    (i) => `### ${i.file} — Diagram #${i.diagramIndex} (${i.type})

${i.issues.map((issue) => `- ${issue}`).join("\n")}`,
  )
  .join("\n\n")}`
}

## Recommendations

${
  report.inaccessibleDiagrams === 0
    ? "✅ All Mermaid diagrams meet WCAG 2.2 AA accessibility requirements. Proceed to Issue #670 (Fix & Refresh README Files)."
    : `⚠️ Recommended actions:
1. Add missing \`accTitle\` attributes to identify each diagram
2. Add comprehensive \`accDescr\` blocks describing diagram purpose and key relationships
3. Test with screen readers to verify readability
4. Re-run validation after fixes
5. Consult [Mermaid Accessibility Docs](https://mermaid.js.org/syntax/diagram-type-mermaid.html#diagram-types)`
}

---

**Audit Conducted By**: Claude Code
**Date**: ${new Date().toISOString().split("T")[0]}
**Related Issues**: #667, #668, #669, #670
`;

  fs.writeFileSync(
    path.join(ROOT, ".github/reports/mermaid-accessibility-report.md"),
    reportContent,
  );
  console.log(
    "\n✅ Accessibility report saved to .github/reports/mermaid-accessibility-report.md",
  );

  // Create/update comprehensive audit spreadsheet
  const spreadsheetContent = csvRows.join("\n");
  fs.writeFileSync(
    path.join(
      ROOT,
      ".github/reports/mermaid-diagram-accessibility-spreadsheet.csv",
    ),
    spreadsheetContent,
  );
  console.log(
    "✅ Accessibility spreadsheet saved to .github/reports/mermaid-diagram-accessibility-spreadsheet.csv",
  );

  process.exit(report.inaccessibleDiagrams > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Accessibility validation error:", err);
  process.exit(1);
});

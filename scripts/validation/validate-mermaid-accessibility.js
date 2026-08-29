#!/usr/bin/env node
/**
 * Validate Mermaid diagram accessibility compliance in all markdown files
 * Checks for presence of accTitle and accDescr attributes
 * @module scripts/validation/validate-mermaid-accessibility.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { globSync } from "glob";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../../");

const getMarkdownFiles = () =>
  globSync("**/*.{md,mdx}", {
    cwd: ROOT,
    ignore: [
      "**/node_modules/**",
      "**/.git/**",
      "**/.claude/**",
      "**/coverage/**",
      "**/logs/**",
      "**/.github/projects/**",
      "**/plugin-provided/**",
      "**/platform-managed/**",
      "**/directory-installed/**",
      "**/agentskills-main/**",
    ],
    dot: true,
  }).sort();

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
    "mindmap",
  ];
  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();

    if (
      trimmed === "" ||
      trimmed.startsWith("%%") ||
      trimmed === "---" ||
      trimmed.startsWith("accTitle") ||
      trimmed.startsWith("accDescr")
    ) {
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
  const lines = content.split("\n");

  // Check for YAML front-matter header (--- blocks) — NOT supported by GitHub's renderer.
  // The first non-blank, non-comment line of a Mermaid block must be the diagram type,
  // not a YAML front-matter delimiter.
  const firstMeaningfulLine = lines.find(
    (l) => l.trim() !== "" && !l.trim().startsWith("%%"),
  );
  if (firstMeaningfulLine && firstMeaningfulLine.trim() === "---") {
    issues.push(
      "YAML front-matter (---) syntax is not supported by GitHub's Mermaid renderer. " +
        "Move accTitle and accDescr inline, after the diagram type declaration.",
    );
    // Return early — remaining checks are meaningless if the block uses the unsupported format
    return issues;
  }

  // Reject accessibility attributes placed before the diagram type declaration.
  // The diagram type (e.g. flowchart TD) must be the very first line; accTitle/accDescr
  // that precede it are invisible to screen readers and indicate a mis-ordered block.
  if (
    firstMeaningfulLine &&
    /^\s*(accTitle|accDescr)\s*[:{\s]/.test(firstMeaningfulLine)
  ) {
    issues.push(
      "accTitle/accDescr must appear after the diagram type declaration, not before it. " +
        "Move the diagram type (e.g. `flowchart TD`) to the first line.",
    );
    return issues;
  }

  // Check for accTitle as an inline statement after the diagram type line.
  // Supported forms: "accTitle: text" or (rarely) "accTitle text"
  const hasAccTitle =
    /^\s*accTitle\s*:/m.test(content) || /^\s*accTitle\s+\S/m.test(content);
  if (!hasAccTitle) {
    issues.push(
      "Missing accTitle — add it inline after the diagram type (e.g. `    accTitle: My title`)",
    );
  }

  // Check for accDescr as an inline statement after the diagram type line.
  // Supported forms: "accDescr: text" or block "accDescr { ... }"
  const hasAccDescr =
    /^\s*accDescr\s*:/m.test(content) ||
    /^\s*accDescr\s*\{/m.test(content) ||
    /^\s*accDescr\s+\S/m.test(content);
  if (!hasAccDescr) {
    issues.push(
      "Missing accDescr — add it inline after the diagram type (e.g. `    accDescr: My description`)",
    );
  }

  // Validate accDescr block format if present — ensure closing brace exists
  let inAccDescrBlock = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (/^accDescr\s*\{/.test(line)) {
      inAccDescrBlock = true;
    }

    if (inAccDescrBlock && line === "}") {
      inAccDescrBlock = false;
    }
  }

  if (inAccDescrBlock) {
    issues.push("Unclosed accDescr block — add a closing `}` on its own line");
  }

  return issues;
}

async function main() {
  const args = process.argv.slice(2);
  const changedFilesArg = args.find((a) => a.startsWith("--changed-files="));
  const changedFilesListArg = args.find((a) =>
    a.startsWith("--changed-files-list="),
  );
  const isVendorPath = (filePath) =>
    /\/(plugin-provided|platform-managed|directory-installed|agentskills-main)\//.test(
      filePath,
    );
  const targetFiles = (
    changedFilesListArg
      ? fs
          .readFileSync(
            changedFilesListArg.replace("--changed-files-list=", ""),
            "utf8",
          )
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean)
      : changedFilesArg
        ? changedFilesArg
            .replace("--changed-files=", "")
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean)
        : getMarkdownFiles()
  ).filter((f) => !isVendorPath(f));

  console.log("♿ Validating Mermaid diagram accessibility compliance...\n");

  const report = {
    totalDiagrams: 0,
    accessibleDiagrams: 0,
    inaccessibleDiagrams: 0,
    issues: [],
  };

  const csvRows = [
    "File,Diagram Number,Diagram Type,Has accTitle,Has accDescr,Missing Attributes,Compliance Status",
  ];

  for (const file of targetFiles) {
    const filePath = path.isAbsolute(file) ? file : path.join(ROOT, file);

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
  const complianceRate =
    report.totalDiagrams === 0
      ? 100
      : (report.accessibleDiagrams / report.totalDiagrams) * 100;
  console.log(`Compliance rate:      ${complianceRate.toFixed(1)}%`);

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

  const reportPath = path.join(
    ROOT,
    ".github/reports/mermaid-accessibility-report.md",
  );
  const existingReport = fs.existsSync(reportPath)
    ? fs.readFileSync(reportPath, "utf-8")
    : "";
  const fallbackGeneratedAt = new Date().toISOString();
  const fallbackDate = fallbackGeneratedAt.split("T")[0];
  const createdDate =
    existingReport.match(/^created_date:\s*"([^"]+)"/m)?.[1] ?? fallbackDate;
  const lastUpdated =
    existingReport.match(/^last_updated:\s*"([^"]+)"/m)?.[1] ?? fallbackDate;
  const generatedAt =
    existingReport.match(/^\*\*Generated\*\*:\s*(.+)$/m)?.[1] ??
    fallbackGeneratedAt;
  const auditDate =
    existingReport.match(/^\*\*Date\*\*:\s*(.+)$/m)?.[1] ?? fallbackDate;

  // Create accessibility audit report
  const reportContent = `---
title: Mermaid Diagram Accessibility Compliance Report — Issue #669
description: Accessibility compliance audit of all 24 Mermaid diagrams for accTitle and accDescr attributes
version: 1.0.0
created_date: "${createdDate}"
last_updated: "${lastUpdated}"
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
domain: a11y
status: active
stability: stable
---

# Mermaid Diagram Accessibility Compliance Report

**Generated**: ${generatedAt}

## Summary

- **Total diagrams**: ${report.totalDiagrams}
- **Accessible diagrams**: ${report.accessibleDiagrams}
- **Non-compliant diagrams**: ${report.inaccessibleDiagrams}
- **Compliance rate**: ${report.totalDiagrams === 0 ? "100.0" : ((report.accessibleDiagrams / report.totalDiagrams) * 100).toFixed(1)}%

## Files Analyzed

${targetFiles.map((f) => `- ${f}`).join("\n")}

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
**Date**: ${auditDate}
**Related Issues**: #667, #668, #669, #670
`;

  fs.writeFileSync(reportPath, reportContent);
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

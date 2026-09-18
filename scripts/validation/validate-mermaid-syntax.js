#!/usr/bin/env node
/**
 * Validate Mermaid diagram syntax in all markdown files
 * Using pattern-based validation (no DOM required)
 * @module scripts/validation/validate-mermaid-syntax.js
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
      "**/coverage/**",
      "**/logs/**",
      "**/.github/projects/**",
      "**/plugin-provided/**",
      "**/platform-managed/**",
      "**/directory-installed/**",
      "**/agentskills-main/**",
      "**/tests/fixtures/**",
    ],
  }).sort();

// Mermaid syntax validation patterns
const DIAGRAM_TYPES = {
  graph: /^\s*graph\b/m,
  flowchart: /^\s*flowchart\b/m,
  sequenceDiagram: /^\s*sequenceDiagram\b/m,
  stateDiagram: /^\s*(stateDiagram|stateDiagram-v2)\b/m,
  erDiagram: /^\s*erDiagram\b/m,
  gantt: /^\s*gantt\b/m,
  pie: /^\s*pie\b/m,
  mindmap: /^\s*mindmap\b/m,
};

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

function validateDiagramSyntax(content) {
  const errors = [];

  // Check for basic structure
  if (!content || content.length === 0) {
    errors.push("Empty diagram");
    return errors;
  }

  // Check for valid diagram type
  const firstLine = content.split("\n")[0].trim();
  const hasValidType = Object.values(DIAGRAM_TYPES).some((pattern) =>
    pattern.test(content),
  );

  if (!hasValidType) {
    errors.push(`Unknown diagram type: ${firstLine}`);
  } else {
    const directionMatch = firstLine.match(
      /^\s*(graph|flowchart)\s+([A-Za-z]{2})\b/,
    );
    if (directionMatch) {
      const direction = directionMatch[2].toUpperCase();
      const validDirections = new Set(["TD", "TB", "BT", "LR", "RL"]);
      if (!validDirections.has(direction)) {
        errors.push(`Invalid direction for ${directionMatch[1]}: ${direction}`);
      }
    } else if (/^\s*(graph|flowchart)\b/.test(firstLine)) {
      errors.push(`Missing direction for ${firstLine.split(/\s+/)[0]}`);
    }
  }

  // Check for accTitle/accDescr format
  // Both single-line (accDescr: "text") and block (accDescr { ... }) formats are valid
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
    errors.push("Unclosed accDescr block");
  }

  // Basic syntax checks for common issues
  // Strip double-quoted string literals to avoid false positives in brace/bracket matching
  // Basic syntax checks for common issues
  // Strip double-quoted string literals to avoid false positives in brace/bracket matching
  const cleanContent = content.replace(/"[^"\\]*(?:\\.[^"\\]*)*"/g, "");

  const openBraces = (cleanContent.match(/{/g) || []).length;
  const closeBraces = (cleanContent.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push(`Mismatched braces: ${openBraces} open, ${closeBraces} close`);
  }

  const openBrackets = (cleanContent.match(/\s*\[/g) || []).length
    ? (cleanContent.match(/\[/g) || []).length
    : 0;
  const closeBrackets = (cleanContent.match(/]/g) || []).length;
  if (openBrackets !== closeBrackets) {
    errors.push(
      `Mismatched brackets: ${openBrackets} open, ${closeBrackets} close`,
    );
  }

  const openParens = (cleanContent.match(/\(/g) || []).length;
  const closeParens = (cleanContent.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push(
      `Mismatched parentheses: ${openParens} open, ${closeParens} close`,
    );
  }

  return errors;
}

async function main() {
  const args = process.argv.slice(2);
  const changedFilesArg = args.find((a) => a.startsWith("--changed-files="));
  const changedFilesListArg = args.find((a) =>
    a.startsWith("--changed-files-list="),
  );
  const isVendorPath = (filePath) =>
    /(^|\/)(plugin-provided|platform-managed|directory-installed|agentskills-main)\//.test(
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
  )
    .filter((f) => /\.mdx?$/i.test(f))
    .filter((f) => !isVendorPath(f));

  console.log("🔍 Validating Mermaid diagram syntax...\n");

  const report = {
    totalDiagrams: 0,
    validDiagrams: 0,
    errorDiagrams: 0,
    errors: [],
  };

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

    console.log(`📄 ${file}: Found ${diagrams.length} diagram(s)`);

    for (let i = 0; i < diagrams.length; i++) {
      const diagramContent = diagrams[i];
      const type = getDiagramType(diagramContent);
      report.totalDiagrams++;

      const errors = validateDiagramSyntax(diagramContent);
      if (errors.length > 0) {
        report.errorDiagrams++;
        const errorMsg = errors.join("; ");
        console.log(`   ❌ Diagram ${i + 1} [${type}]: ${errorMsg}`);
        report.errors.push({
          file,
          diagramIndex: i + 1,
          type,
          content: diagramContent.substring(0, 50) + "...",
          error: errorMsg,
        });
      } else {
        report.validDiagrams++;
        console.log(`   ✅ Diagram ${i + 1} [${type}]: Valid`);
      }
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 VALIDATION SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total diagrams:  ${report.totalDiagrams}`);
  console.log(`Valid diagrams:  ${report.validDiagrams}`);
  console.log(`Error diagrams:  ${report.errorDiagrams}`);
  const successRate =
    report.totalDiagrams === 0
      ? 100
      : (report.validDiagrams / report.totalDiagrams) * 100;

  console.log(`Success rate:    ${successRate.toFixed(1)}%`);

  if (report.errorDiagrams > 0) {
    console.log("\n❌ ERRORS FOUND:");
    for (const error of report.errors) {
      console.log(`\n  📄 ${error.file}`);
      console.log(`  📊 Diagram: #${error.diagramIndex} (${error.type})`);
      console.log(`  ⚠️  Error: ${error.error}`);
    }
  }

  // Create audit report file
  const reportContent = `---
title: Mermaid Diagram Syntax Validation Report
description: Mermaid diagram syntax validation results for repository README files
version: "1.0.0"
created_date: "${new Date().toISOString().slice(0, 10)}"
last_updated: "${new Date().toISOString().slice(0, 10)}"
file_type: documentation
tags: ["mermaid", "validation", "diagrams"]
domain: generic
status: active
stability: stable
---

# Mermaid Diagram Syntax Validation Report

**Generated**: ${new Date().toISOString()}

## Summary

- **Total diagrams**: ${report.totalDiagrams}
- **Valid diagrams**: ${report.validDiagrams}
- **Error diagrams**: ${report.errorDiagrams}
- **Success rate**: ${(report.totalDiagrams === 0 ? 100 : (report.validDiagrams / report.totalDiagrams) * 100).toFixed(1)}%
## Files Analyzed

${targetFiles.map((f) => `- ${f}`).join("\n")}

## Detailed Results

${report.totalDiagrams === report.validDiagrams ? "✅ All diagrams are syntactically valid!" : ""}

${
  report.errorDiagrams > 0
    ? `### Diagrams with Errors (${report.errorDiagrams})

${report.errors.map((e) => `- **${e.file}** — Diagram #${e.diagramIndex} (${e.type})\n  - Error: ${e.error}`).join("\n\n")}`
    : ""
}

## Recommendations

${
  report.errorDiagrams === 0
    ? "✅ All Mermaid diagrams pass syntax validation. Proceed to accessibility compliance audit (#669)."
    : `⚠️ Found ${report.errorDiagrams} diagram(s) with syntax errors. Recommended actions:
1. Review the errors listed above
2. Consult [Mermaid Documentation](https://mermaid.js.org/)
3. Test fixes in [Mermaid Live Editor](https://mermaid.live/)
4. Update README files with corrected diagrams`
}
`;

  fs.writeFileSync(
    path.join(ROOT, ".github/reports/mermaid-validation-report.md"),
    reportContent,
  );
  console.log(
    "\n✅ Validation report saved to .github/reports/mermaid-validation-report.md",
  );

  process.exit(report.errorDiagrams > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Validation error:", err);
  process.exit(1);
});

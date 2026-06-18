#!/usr/bin/env node
/**
 * Validate WCAG 2.2 AA colour contrast compliance in Mermaid diagrams.
 *
 * Checks every `style X fill:#colour` and `classDef X fill:#colour`
 * declaration and verifies:
 * 1. An explicit `color` (text colour) is set alongside each `fill`.
 * 2. The fill / color pair meets the WCAG AA minimum contrast ratio of 4.5:1.
 *
 * Scans all markdown files so repository-wide Mermaid diagrams are covered.
 *
 * @module scripts/validation/validate-mermaid-colour-contrast.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { globSync } from "glob";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../../");

const WCAG_AA_NORMAL_TEXT = 4.5;

const getMarkdownFiles = () =>
  globSync("**/*.{md,mdx}", {
    cwd: ROOT,
    ignore: [
      "**/node_modules/**",
      "**/.git/**",
      "**/coverage/**",
      "**/logs/**",
      "**/.github/projects/**",
    ],
    dot: true,
  }).sort();

function normaliseHex(hex) {
  const h = hex.replace(/^#/, "");
  if (h.length === 3) {
    return h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  return h;
}

function relativeLuminance(hex) {
  const h = normaliseHex(hex);
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;

  const linearise = (c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

  return 0.2126 * linearise(r) + 0.7152 * linearise(g) + 0.0722 * linearise(b);
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function namedColourToHex(name) {
  const map = {
    black: "#000000",
    white: "#ffffff",
    red: "#ff0000",
    green: "#008000",
    blue: "#0000ff",
    yellow: "#ffff00",
    orange: "#ffa500",
    purple: "#800080",
    pink: "#ffc0cb",
    gray: "#808080",
    grey: "#808080",
    darkgray: "#a9a9a9",
    darkgrey: "#a9a9a9",
    lightgray: "#d3d3d3",
    lightgrey: "#d3d3d3",
    navy: "#000080",
    teal: "#008080",
    aqua: "#00ffff",
    cyan: "#00ffff",
    fuchsia: "#ff00ff",
    magenta: "#ff00ff",
    silver: "#c0c0c0",
    maroon: "#800000",
    olive: "#808000",
    lime: "#00ff00",
    transparent: null,
    none: null,
  };
  return map[name.toLowerCase()] ?? null;
}

function parseColour(colour) {
  if (!colour) return null;
  const trimmed = colour.trim().toLowerCase();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(trimmed)) return trimmed;
  return namedColourToHex(trimmed);
}

function extractDiagrams(content) {
  const diagrams = [];
  const lines = content.split("\n");
  let inBlock = false;
  let blockStart = -1;
  let blockLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!inBlock && /^```mermaid\s*$/.test(line.trim())) {
      inBlock = true;
      blockStart = i + 1;
      blockLines = [];
    } else if (inBlock && /^```\s*$/.test(line.trim())) {
      diagrams.push({ raw: blockLines.join("\n"), startLine: blockStart });
      inBlock = false;
      blockLines = [];
    } else if (inBlock) {
      blockLines.push(line);
    }
  }

  return diagrams;
}

function detectTheme(diagramRaw) {
  const match = diagramRaw.match(/%%\{.*?'theme'\s*:\s*'([^']+)'/);
  if (match) return match[1].toLowerCase();
  const dq = diagramRaw.match(/%%\{.*?"theme"\s*:\s*"([^"]+)"/);
  if (dq) return dq[1].toLowerCase();
  return "default";
}

function parseDeclarations(diagramRaw) {
  const results = [];
  const lines = diagramRaw.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^\s*(style|classDef)\s+(\S+)\s+(.+)/);
    if (!match) continue;

    const kind = match[1];
    const nodeId = match[2];
    const props = match[3];
    const fillMatch = props.match(/(?<!-)\bfill\s*:\s*([^,;\s]+)/i);
    const colorMatch = props.match(/(?<!-)\bcolor\s*:\s*([^,;\s]+)/i);

    results.push({
      kind,
      nodeId,
      fill: fillMatch ? fillMatch[1].trim() : null,
      color: colorMatch ? colorMatch[1].trim() : null,
      raw: line.trim(),
      line: i,
    });
  }

  return results;
}

function validateDeclaration(styleDecl) {
  const issues = [];
  const { kind, nodeId, fill, color } = styleDecl;

  if (!fill) return issues;

  const fillHex = parseColour(fill);
  if (!fillHex) return issues;

  if (!color) {
    const lightRatio = contrastRatio(fillHex, "#333333");
    const darkRatio = contrastRatio(fillHex, "#ffffff");
    const failsLight = lightRatio < WCAG_AA_NORMAL_TEXT;
    const failsDark = darkRatio < WCAG_AA_NORMAL_TEXT;

    if (failsLight || failsDark) {
      const failMode =
        failsLight && failsDark
          ? "both light and dark modes"
          : failsLight
            ? "light mode (dark text)"
            : "dark mode (white text)";
      issues.push({
        level: "error",
        message:
          `${kind} "${nodeId}": fill ${fill} without explicit color FAILS in ${failMode} ` +
          `(light contrast: ${lightRatio.toFixed(2)}:1, dark contrast: ${darkRatio.toFixed(2)}:1). ` +
          `Add an explicit color: to guarantee contrast.`,
      });
    } else {
      issues.push({
        level: "warning",
        message:
          `${kind} "${nodeId}": fill ${fill} has no explicit color. ` +
          `Passes contrast in both modes (light: ${lightRatio.toFixed(2)}:1, dark: ${darkRatio.toFixed(2)}:1) ` +
          `but adding an explicit color: is strongly recommended.`,
      });
    }

    return issues;
  }

  const colorHex = parseColour(color);
  if (!colorHex) return issues;

  const ratio = contrastRatio(fillHex, colorHex);
  if (ratio < WCAG_AA_NORMAL_TEXT) {
    issues.push({
      level: "error",
      message:
        `${kind} "${nodeId}": fill ${fill} / color ${color} contrast ratio is ${ratio.toFixed(2)}:1 — ` +
        `FAILS WCAG AA 2.2 (${WCAG_AA_NORMAL_TEXT}:1 required for normal text).`,
    });
  }

  return issues;
}

async function main() {
  const args = process.argv.slice(2);
  const changedFilesArg = args.find((a) => a.startsWith("--changed-files="));
  const targetFiles = changedFilesArg
    ? changedFilesArg.replace("--changed-files=", "").split(",").filter(Boolean)
    : getMarkdownFiles();

  console.log("🎨 Validating Mermaid colour contrast (WCAG 2.2 AA)...\n");
  console.log(`Scanning ${targetFiles.length} file(s)\n`);

  const report = {
    filesScanned: 0,
    diagramsScanned: 0,
    declarationsChecked: 0,
    errors: 0,
    warnings: 0,
    findings: [],
  };

  for (const relPath of targetFiles) {
    const filePath = path.isAbsolute(relPath)
      ? relPath
      : path.join(ROOT, relPath);

    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, "utf-8");
    const diagrams = extractDiagrams(content);
    if (diagrams.length === 0) continue;

    report.filesScanned++;
    let fileHasIssues = false;

    for (let di = 0; di < diagrams.length; di++) {
      const diagram = diagrams[di];
      report.diagramsScanned++;

      const theme = detectTheme(diagram.raw);
      const declarations = parseDeclarations(diagram.raw);

      for (const decl of declarations) {
        report.declarationsChecked++;
        const issues = validateDeclaration(decl);

        for (const issue of issues) {
          if (issue.level === "error") report.errors++;
          else report.warnings++;

          const fileLine = diagram.startLine + decl.line + 1;
          report.findings.push({
            file: relPath,
            diagramIndex: di + 1,
            line: fileLine,
            theme,
            level: issue.level,
            message: issue.message,
            rawDeclaration: decl.raw,
          });

          if (!fileHasIssues) {
            console.log(`\n📄 ${relPath}`);
            fileHasIssues = true;
          }

          const icon = issue.level === "error" ? "❌" : "⚠️ ";
          console.log(
            `   ${icon} Diagram ${di + 1} (line ${fileLine}): ${issue.message}`,
          );
        }
      }
    }

    if (!fileHasIssues && diagrams.length > 0) {
      console.log(`✅ ${relPath} — ${diagrams.length} diagram(s), all styles pass`);
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log("🎨 COLOUR CONTRAST SUMMARY");
  console.log("=".repeat(70));
  console.log(`Files scanned:        ${report.filesScanned}`);
  console.log(`Diagrams scanned:     ${report.diagramsScanned}`);
  console.log(`Declarations checked: ${report.declarationsChecked}`);
  console.log(`Errors:               ${report.errors}`);
  console.log(`Warnings:             ${report.warnings}`);

  if (report.findings.length > 0) {
    console.log("\n📋 FINDINGS:");
    for (const finding of report.findings) {
      console.log(
        `\n  ${finding.level.toUpperCase()} in ${finding.file} (Diagram #${finding.diagramIndex}, theme: ${finding.theme})`,
      );
      console.log(`  Declaration: ${finding.rawDeclaration}`);
      console.log(`  Issue: ${finding.message}`);
    }
  }

  if (report.errors > 0) {
    console.log(
      `\n❌ ${report.errors} contrast error(s) found. See approved palette in instructions/mermaid.instructions.md`,
    );
  } else if (report.warnings > 0) {
    console.log(
      `\n⚠️  ${report.warnings} warning(s). Add explicit color: to every fill: declaration to guarantee contrast in all themes.`,
    );
  } else {
    console.log("\n✅ All style declarations meet WCAG 2.2 AA contrast requirements.");
  }

  const reportDir = path.join(ROOT, ".github/reports/mermaid");
  fs.mkdirSync(reportDir, { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  const reportPath = path.join(reportDir, `colour-contrast-report-${today}.md`);

  const reportMd = `---
title: Mermaid Colour Contrast Report
description: WCAG 2.2 AA colour contrast validation for all Mermaid diagrams
file_type: documentation
created_date: "${today}"
last_updated: "${today}"
tags: ["mermaid", "a11y", "wcag", "colour-contrast"]
status: active
stability: stable
---

# Mermaid Colour Contrast Report

**Generated**: ${new Date().toISOString()}

## Summary

| Metric | Value |
|--------|-------|
| Files scanned | ${report.filesScanned} |
| Diagrams scanned | ${report.diagramsScanned} |
| Declarations checked | ${report.declarationsChecked} |
| Errors (contrast failures) | ${report.errors} |
| Warnings (missing explicit color) | ${report.warnings} |

## Findings

${
  report.findings.length === 0
    ? "✅ All style declarations meet WCAG 2.2 AA requirements."
    : report.findings
        .map(
          (finding) =>
            `### ${finding.level.toUpperCase()}: \`${finding.file}\` — Diagram #${finding.diagramIndex} (line ${finding.line})\n\n` +
            `- **Theme**: ${finding.theme}\n` +
            `- **Declaration**: \`${finding.rawDeclaration}\`\n` +
            `- **Issue**: ${finding.message}\n`,
        )
        .join("\n")
}

## Approved Colour Palette

See \`instructions/mermaid.instructions.md\` for the full approved palette with pre-verified WCAG AA contrast pairs.

| Role | fill | color | stroke | Contrast |
|------|------|-------|--------|----------|
| Information | \`#dbeafe\` | \`#1e3a5f\` | \`#1e3a5f\` | 9.1:1 |
| Success | \`#dcfce7\` | \`#14532d\` | \`#14532d\` | 10.5:1 |
| Warning | \`#fef3c7\` | \`#4a2c00\` | \`#b45309\` | 8.3:1 |
| Error / Alert | \`#fee2e2\` | \`#7f1d1d\` | \`#b91c1c\` | 8.7:1 |
| Documentation | \`#f3e8ff\` | \`#3b0764\` | \`#7e22ce\` | 10.2:1 |
| Neutral | \`#f1f5f9\` | \`#0f172a\` | \`#334155\` | 14.7:1 |
| Highlight | \`#ecfdf5\` | \`#064e3b\` | \`#059669\` | 10.8:1 |
`;

  fs.writeFileSync(reportPath, reportMd);
  console.log(`\n📄 Report saved to ${path.relative(ROOT, reportPath)}`);

  process.exit(report.errors > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Colour contrast validation error:", err);
  process.exit(1);
});

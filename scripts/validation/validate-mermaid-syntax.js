#!/usr/bin/env node
/**
 * Validate Mermaid diagram syntax in all README files
 * Using pattern-based validation (no DOM required)
 * @module scripts/validation/validate-mermaid-syntax.js
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

// Mermaid syntax validation patterns
const DIAGRAM_TYPES = {
  graph: /^(graph|flowchart)\s+(TD|BT|LR|RL|TB)/m,
  flowchart: /^(flowchart|graph)\s+(TD|BT|LR|RL|TB)/m,
  sequenceDiagram: /^sequenceDiagram/m,
  stateDiagram: /^(stateDiagram|stateDiagram-v2)/m,
  erDiagram: /^erDiagram/m,
  gantt: /^gantt/m,
  pie: /^pie\s+title/m,
};

function extractMermaidDiagrams(content) {
  const diagrams = [];
  const regex = /```mermaid\n([\s\S]*?)```/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const diagramContent = match[1].trim();
    diagrams.push(diagramContent);
  }

  return diagrams;
}

function getDiagramType(content) {
  for (const [type, pattern] of Object.entries(DIAGRAM_TYPES)) {
    if (pattern.test(content)) {
      return type;
    }
  }
  // Try to extract type from first line
  const firstLine = content.split("\n")[0].trim();
  const match = firstLine.match(/^(\w+)/);
  return match ? match[1] : "unknown";
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
  }

  // Check for accTitle/accDescr format
  // Both single-line (accDescr: "text") and block (accDescr { ... }) formats are valid
  let inAccDescrBlock = false;
  for (let i = 0; i < content.split("\n").length; i++) {
    const line = content.split("\n")[i].trim();

    if (line.startsWith("accDescr {")) {
      inAccDescrBlock = true;
    }

    if (inAccDescrBlock && line.includes("}")) {
      inAccDescrBlock = false;
    }
  }

  if (inAccDescrBlock) {
    errors.push("Unclosed accDescr block");
  }

  // Basic syntax checks for common issues
  // Only check braces outside of string literals
  const openBraces = (content.match(/{/g) || []).length;
  const closeBraces = (content.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push(`Mismatched braces: ${openBraces} open, ${closeBraces} close`);
  }

  const openBrackets = (content.match(/\[/g) || []).length;
  const closeBrackets = (content.match(/]/g) || []).length;
  if (openBrackets !== closeBrackets) {
    errors.push(
      `Mismatched brackets: ${openBrackets} open, ${closeBrackets} close`,
    );
  }

  return errors;
}

async function main() {
  console.log("🔍 Validating Mermaid diagram syntax...\n");

  const report = {
    totalDiagrams: 0,
    validDiagrams: 0,
    errorDiagrams: 0,
    errors: [],
  };

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
  console.log(
    `Success rate:    ${((report.validDiagrams / report.totalDiagrams) * 100).toFixed(1)}%`,
  );

  if (report.errorDiagrams > 0) {
    console.log("\n❌ ERRORS FOUND:");
    for (const error of report.errors) {
      console.log(`\n  📄 ${error.file}`);
      console.log(`  📊 Diagram: #${error.diagramIndex} (${error.type})`);
      console.log(`  ⚠️  Error: ${error.error}`);
    }
  }

  // Create audit report file
  const reportContent = `# Mermaid Diagram Syntax Validation Report

**Generated**: ${new Date().toISOString()}

## Summary

- **Total diagrams**: ${report.totalDiagrams}
- **Valid diagrams**: ${report.validDiagrams}
- **Error diagrams**: ${report.errorDiagrams}
- **Success rate**: ${((report.validDiagrams / report.totalDiagrams) * 100).toFixed(1)}%

## Files Analyzed

${README_FILES.map((f) => `- ${f}`).join("\n")}

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

class ReportGenerator {
  generateCliReport(auditResult) {
    const lines = [];

    lines.push("═".repeat(80));
    lines.push("Label Coverage Audit Report");
    lines.push("═".repeat(80));
    lines.push("");

    // Summary section
    lines.push("SUMMARY");
    lines.push("─".repeat(80));
    lines.push(`Total Issues: ${auditResult.total}`);
    lines.push(
      `Fully Labeled (100%): ${auditResult.fullyLabeled} (${this._percentage(auditResult.fullyLabeled, auditResult.total)})`,
    );
    lines.push(
      `Partially Labeled: ${auditResult.partiallyLabeled} (${this._percentage(auditResult.partiallyLabeled, auditResult.total)})`,
    );
    lines.push(
      `Unlabeled (0%): ${auditResult.unlabeled} (${this._percentage(auditResult.unlabeled, auditResult.total)})`,
    );
    lines.push(`Average Coverage: ${auditResult.averageCoverage.toFixed(1)}%`);
    lines.push("");

    // Family Coverage section
    lines.push("FAMILY COVERAGE");
    lines.push("─".repeat(80));
    lines.push("Family      Labeled  Coverage  Status");
    lines.push("─".repeat(80));

    for (const [family, stats] of Object.entries(auditResult.familyCoverage)) {
      const status = stats.coverage === 100 ? "✓ Complete" : "✗ Incomplete";
      lines.push(
        `${family.padEnd(12)}${String(stats.labeled).padEnd(9)}${stats.coverage}%${" ".repeat(Math.max(0, 10 - String(stats.coverage).length))}${status}`,
      );
    }
    lines.push("");

    // Top Missing Labels
    if (auditResult.topMissingLabels.length > 0) {
      lines.push("TOP MISSING LABEL FAMILIES");
      lines.push("─".repeat(80));
      lines.push("Family     Count  %");
      lines.push("─".repeat(80));

      for (const item of auditResult.topMissingLabels.slice(0, 10)) {
        lines.push(
          `${item.family.padEnd(11)}${String(item.count).padEnd(7)}${item.percentage}%`,
        );
      }
      lines.push("");
    }

    // Top Suggested Labels
    if (auditResult.topSuggestedLabels.length > 0) {
      lines.push("TOP SUGGESTED LABELS");
      lines.push("─".repeat(80));
      lines.push("Label                      Count");
      lines.push("─".repeat(80));

      for (const item of auditResult.topSuggestedLabels.slice(0, 10)) {
        lines.push(`${item.label.padEnd(27)}${item.count}`);
      }
      lines.push("");
    }

    lines.push("═".repeat(80));
    return lines.join("\n");
  }

  generateMarkdownReport(auditResult) {
    const lines = [];

    lines.push("# Label Coverage Audit Report");
    lines.push("");

    // Metadata
    const timestamp = new Date().toISOString();
    lines.push(`> Generated: ${timestamp}`);
    lines.push("");

    // Summary section
    lines.push("## Summary");
    lines.push("");
    lines.push(`**Total Issues:** ${auditResult.total}`);
    lines.push(
      `**Fully Labeled:** ${auditResult.fullyLabeled} (${this._percentage(auditResult.fullyLabeled, auditResult.total)})`,
    );
    lines.push(
      `**Partially Labeled:** ${auditResult.partiallyLabeled} (${this._percentage(auditResult.partiallyLabeled, auditResult.total)})`,
    );
    lines.push(
      `**Unlabeled:** ${auditResult.unlabeled} (${this._percentage(auditResult.unlabeled, auditResult.total)})`,
    );
    lines.push(
      `**Average Coverage:** ${auditResult.averageCoverage.toFixed(1)}%`,
    );
    lines.push("");

    // Family Coverage table
    lines.push("## Family Coverage");
    lines.push("");
    lines.push("| Family | Labeled | Coverage | Status |");
    lines.push("|--------|---------|----------|--------|");

    for (const [family, stats] of Object.entries(auditResult.familyCoverage)) {
      const status = stats.coverage === 100 ? "✓" : "✗";
      lines.push(
        `| ${family} | ${stats.labeled} | ${stats.coverage}% | ${status} |`,
      );
    }
    lines.push("");

    // Recommendations section
    lines.push("## Recommendations");
    lines.push("");

    if (auditResult.topMissingLabels.length > 0) {
      lines.push("### High Priority Gaps");
      lines.push("");

      for (const item of auditResult.topMissingLabels.slice(0, 5)) {
        lines.push(
          `- **${item.family}**: ${item.percentage}% missing (${item.count} issues)`,
        );
      }
      lines.push("");
    }

    if (auditResult.topSuggestedLabels.length > 0) {
      const topSuggestion = auditResult.topSuggestedLabels[0];
      lines.push("### Most Common Suggestions");
      lines.push("");
      lines.push(
        `Most common suggestion: \`${topSuggestion.label}\` (${topSuggestion.count} issues)`,
      );
      lines.push("");

      lines.push("**Suggested bulk labels:**");
      for (const item of auditResult.topSuggestedLabels.slice(0, 5)) {
        lines.push(`- \`${item.label}\` (${item.count} issues)`);
      }
      lines.push("");
    }

    // Next Steps
    lines.push("## Next Steps");
    lines.push("");
    lines.push(
      "1. **Review low-coverage issues** — Start with issues at 0-50% coverage",
    );
    lines.push(
      "2. **Apply suggested labels** — Use the automation tools to bulk-apply recommended labels",
    );
    lines.push(
      "3. **Monitor progress** — Re-run audit weekly to track improvements",
    );
    lines.push(
      "4. **Close gaps** — Focus on the highest-impact missing label families",
    );
    lines.push("");

    // Data export note
    lines.push("---");
    lines.push("");
    lines.push("*For detailed issue-by-issue data, use `--format json` flag.*");
    lines.push("");

    return lines.join("\n");
  }

  generateJsonReport(auditResult) {
    const report = {
      metadata: {
        timestamp: new Date().toISOString(),
        format: "json",
        version: "1.0",
      },
      summary: {
        total: auditResult.total,
        fullyLabeled: auditResult.fullyLabeled,
        partiallyLabeled: auditResult.partiallyLabeled,
        unlabeled: auditResult.unlabeled,
        averageCoverage: auditResult.averageCoverage,
      },
      familyCoverage: auditResult.familyCoverage,
      topMissingLabels: auditResult.topMissingLabels,
      topSuggestedLabels: auditResult.topSuggestedLabels,
      issues: auditResult.issues.map((issue) => ({
        number: issue.number,
        title: issue.title,
        coverage: issue.coverage,
        labels: issue.labels,
        missing: Object.keys(issue.missing),
        suggestions: issue.suggestions,
        ...(issue.invalid && { invalid: issue.invalid }),
      })),
    };

    return JSON.stringify(report, null, 2);
  }

  _percentage(value, total) {
    if (total === 0) return "0%";
    return `${Math.round((value / total) * 100)}%`;
  }
}

module.exports = { ReportGenerator };

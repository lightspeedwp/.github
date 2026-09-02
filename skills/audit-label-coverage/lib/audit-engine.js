class AuditEngine {
  constructor(gitHubClient, labelConfig = {}) {
    this.gitHubClient = gitHubClient;
    this.required = labelConfig.required || {};
    this.optional = labelConfig.optional || {};
    this.allFamilies = { ...this.required, ...this.optional };
  }

  auditIssue(issue) {
    const labels = this._groupLabelsByFamily(issue.labels || []);
    const missing = this._detectMissing(labels);
    const coverage = this._calculateCoverage(labels);
    const suggestions = this._generateSuggestions(issue, labels, missing);

    return {
      number: issue.number,
      title: issue.title,
      missing:
        missing.length > 0
          ? Object.fromEntries(missing.map((f) => [f, true]))
          : {},
      coverage,
      labels,
      suggestions,
    };
  }

  async auditBatch(issues) {
    const auditResults = issues.map((issue) => this.auditIssue(issue));

    return {
      total: issues.length,
      fullyLabeled: auditResults.filter((r) => r.coverage === 100).length,
      partiallyLabeled: auditResults.filter(
        (r) => r.coverage > 0 && r.coverage < 100,
      ).length,
      unlabeled: auditResults.filter((r) => r.coverage === 0).length,
      averageCoverage:
        auditResults.reduce((sum, r) => sum + r.coverage, 0) / issues.length,
      familyCoverage: this._calculateFamilyCoverage(auditResults),
      topMissingLabels: this._identifyTopMissing(auditResults),
      topSuggestedLabels: this._identifyTopSuggested(auditResults),
      issues: auditResults,
    };
  }

  _groupLabelsByFamily(labels) {
    const grouped = {};

    for (const label of labels) {
      const family = label.name.split(":")[0];
      if (!grouped[family]) {
        grouped[family] = [];
      }
      grouped[family].push(label.name);
    }

    return grouped;
  }

  _detectMissing(labels) {
    const missing = [];

    for (const family of Object.keys(this.required)) {
      if (!labels[family] || labels[family].length === 0) {
        missing.push(family);
      }
    }

    return missing;
  }

  _calculateCoverage(labels) {
    if (Object.keys(this.required).length === 0) {
      return 0;
    }

    let covered = 0;
    for (const family of Object.keys(this.required)) {
      if (labels[family] && labels[family].length > 0) {
        covered += 1;
      }
    }

    return Math.round((covered / Object.keys(this.required).length) * 100);
  }

  _generateSuggestions(issue, labels, missing) {
    const suggestions = [];

    for (const family of missing) {
      // Add family-level suggestion
      suggestions.push(`${family}:*`);
    }

    return suggestions;
  }

  _calculateFamilyCoverage(auditResults) {
    const coverage = {};

    // Only include required families in coverage
    for (const family of Object.keys(this.required)) {
      const labeled = auditResults.filter((r) => r.labels[family]).length;
      coverage[family] = {
        labeled,
        coverage: Math.round((labeled / auditResults.length) * 100),
      };
    }

    return coverage;
  }

  _identifyTopMissing(auditResults) {
    const missingCounts = {};

    for (const result of auditResults) {
      for (const family of Object.keys(result.missing)) {
        missingCounts[family] = (missingCounts[family] || 0) + 1;
      }
    }

    return Object.entries(missingCounts)
      .map(([family, count]) => ({
        family,
        count,
        percentage: Math.round((count / auditResults.length) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }

  _identifyTopSuggested(auditResults) {
    const suggestionCounts = {};

    for (const result of auditResults) {
      for (const suggestion of result.suggestions || []) {
        suggestionCounts[suggestion] = (suggestionCounts[suggestion] || 0) + 1;
      }
    }

    return Object.entries(suggestionCounts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}

module.exports = { AuditEngine };

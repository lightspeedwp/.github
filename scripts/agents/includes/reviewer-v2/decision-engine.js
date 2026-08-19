class DecisionEngine {
  constructor(rules = {}) {
    this.rules = {
      excludedFiles: rules.excludedFiles || [],
      excludedCategories: rules.excludedCategories || [],
      autoResolvePatterns: rules.autoResolvePatterns || [],
      escalatePatterns: rules.escalatePatterns || [],
      suppressFalsePositives: rules.suppressFalsePositives || [],
      ...rules,
    };
    this.decisions = [];
  }

  process(findings) {
    if (!Array.isArray(findings)) {
      return { auto_resolved: [], suppressed: [], requires_review: [] };
    }

    const autoResolved = [];
    const suppressed = [];
    const requiresReview = [];

    for (const finding of findings) {
      const decision = this.makeDecision(finding);

      switch (decision.status) {
        case "resolved":
          autoResolved.push(decision);
          break;
        case "suppressed":
          suppressed.push(decision);
          break;
        case "requires_review":
        default:
          requiresReview.push(decision);
          break;
      }
    }

    return {
      auto_resolved: autoResolved,
      suppressed,
      requires_review: requiresReview,
    };
  }

  makeDecision(finding) {
    const decision = {
      ...finding,
      decision_reason: [],
      decision_status: null,
    };

    if (this.isExcludedFile(finding.file)) {
      decision.status = "suppressed";
      decision.decision_reason.push("File is in excluded files list");
      return decision;
    }

    if (this.isExcludedCategory(finding.category)) {
      decision.status = "suppressed";
      decision.decision_reason.push("Category is excluded");
      return decision;
    }

    if (this.isFalsePositive(finding)) {
      decision.status = "suppressed";
      decision.decision_reason.push("Known false positive pattern");
      return decision;
    }

    if (this.shouldAutoResolve(finding)) {
      decision.status = "resolved";
      decision.decision_reason.push("Matches auto-resolve pattern");
      return decision;
    }

    decision.status = "requires_review";
    decision.decision_reason.push("Requires manual review");

    if (this.shouldEscalate(finding)) {
      decision.escalated = true;
      decision.decision_reason.push(
        "Critical severity - escalated for immediate review",
      );
    }

    return decision;
  }

  isExcludedFile(filePath) {
    if (!filePath || !Array.isArray(this.rules.excludedFiles)) {
      return false;
    }

    return this.rules.excludedFiles.some((pattern) =>
      this.matchPattern(filePath, pattern),
    );
  }

  isExcludedCategory(category) {
    if (!category || !Array.isArray(this.rules.excludedCategories)) {
      return false;
    }

    return this.rules.excludedCategories.includes(category);
  }

  isFalsePositive(finding) {
    if (!Array.isArray(this.rules.suppressFalsePositives)) {
      return false;
    }

    return this.rules.suppressFalsePositives.some((pattern) =>
      this.matchFalsePositivePattern(finding, pattern),
    );
  }

  matchFalsePositivePattern(finding, pattern) {
    if (pattern.tool && finding.tool !== pattern.tool) {
      return false;
    }

    if (pattern.category && finding.category !== pattern.category) {
      return false;
    }

    if (pattern.file && !this.matchPattern(finding.file, pattern.file)) {
      return false;
    }

    if (pattern.message) {
      const suggestionLower = finding.suggestion.toLowerCase();
      const messageLower = pattern.message.toLowerCase();
      if (!suggestionLower.includes(messageLower)) {
        return false;
      }
    }

    return true;
  }

  shouldAutoResolve(finding) {
    if (!Array.isArray(this.rules.autoResolvePatterns)) {
      return false;
    }

    return this.rules.autoResolvePatterns.some((pattern) =>
      this.matchPattern(finding.suggestion, pattern),
    );
  }

  shouldEscalate(finding) {
    if (!Array.isArray(this.rules.escalatePatterns)) {
      return finding.severity === "critical";
    }

    if (finding.severity === "critical") {
      return true;
    }

    return this.rules.escalatePatterns.some((pattern) => {
      if (pattern.severity && finding.severity !== pattern.severity) {
        return false;
      }

      if (pattern.category && finding.category !== pattern.category) {
        return false;
      }

      if (pattern.file && !this.matchPattern(finding.file, pattern.file)) {
        return false;
      }

      return true;
    });
  }

  matchPattern(text, pattern) {
    if (!text || !pattern) {
      return false;
    }

    if (pattern instanceof RegExp) {
      return pattern.test(text);
    }

    if (typeof pattern === "string") {
      if (pattern.includes("*")) {
        const regex = new RegExp(`^${pattern.replace(/\*/g, ".*")}$`);
        return regex.test(text);
      }

      return text.includes(pattern);
    }

    return false;
  }

  setRules(newRules) {
    this.rules = { ...this.rules, ...newRules };
  }

  reset() {
    this.decisions = [];
  }
}

module.exports = {
  DecisionEngine,
};

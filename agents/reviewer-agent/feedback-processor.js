const crypto = require("crypto");

const TOOL_TYPES = {
  CODERABBIT: "coderabbit",
  CODE_QUALITY: "code-quality",
  COPILOT: "copilot",
  WORDPRESS: "wordpress-quality",
};

const SEVERITY_MAP = {
  critical: "critical",
  major: "major",
  minor: "minor",
  error: "critical",
  warning: "major",
  note: "minor",
  suggestion: "minor",
  info: "minor",
};

class FeedbackProcessor {
  constructor() {
    this.findings = [];
    this.seenIds = new Set();
  }

  process(rawResults) {
    if (!rawResults || typeof rawResults !== "object") {
      return { findings: [], errors: [] };
    }

    const errors = [];

    if (rawResults.coderabbit) {
      try {
        const converted = this.convertCodeRabbit(rawResults.coderabbit);
        this.addFindings(converted);
      } catch (e) {
        errors.push({ tool: TOOL_TYPES.CODERABBIT, error: e.message });
      }
    }

    if (rawResults.codeQuality) {
      try {
        const converted = this.convertCodeQuality(rawResults.codeQuality);
        this.addFindings(converted);
      } catch (e) {
        errors.push({ tool: TOOL_TYPES.CODE_QUALITY, error: e.message });
      }
    }

    if (rawResults.copilot) {
      try {
        const converted = this.convertCopilot(rawResults.copilot);
        this.addFindings(converted);
      } catch (e) {
        errors.push({ tool: TOOL_TYPES.COPILOT, error: e.message });
      }
    }

    if (rawResults.wordPressQuality) {
      try {
        const converted = this.convertWordPress(rawResults.wordPressQuality);
        this.addFindings(converted);
      } catch (e) {
        errors.push({ tool: TOOL_TYPES.WORDPRESS, error: e.message });
      }
    }

    return {
      findings: this.deduplicateFindings(),
      errors,
    };
  }

  convertCodeRabbit(findings) {
    if (!Array.isArray(findings)) {
      return [];
    }

    return findings.map((finding) => ({
      id: this.generateId(
        TOOL_TYPES.CODERABBIT,
        finding.file,
        finding.line,
        finding.title,
      ),
      tool: TOOL_TYPES.CODERABBIT,
      severity: SEVERITY_MAP[finding.severity?.toLowerCase()] || "major",
      category: this.extractCategoryFromCodeRabbit(finding),
      file: finding.file || "",
      line: finding.line || 0,
      status: "open",
      suggestion: finding.title || finding.description || "",
      originalData: finding,
    }));
  }

  convertCodeQuality(findings) {
    if (!Array.isArray(findings)) {
      return [];
    }

    return findings.map((finding) => ({
      id: this.generateId(
        TOOL_TYPES.CODE_QUALITY,
        finding.path,
        finding.line,
        finding.message,
      ),
      tool: TOOL_TYPES.CODE_QUALITY,
      severity: SEVERITY_MAP[finding.severity?.toLowerCase()] || "major",
      category: finding.rule || "code-quality",
      file: finding.path || "",
      line: finding.line || 0,
      status: "open",
      suggestion: finding.message || "",
      originalData: finding,
    }));
  }

  convertCopilot(findings) {
    if (!Array.isArray(findings)) {
      return [];
    }

    return findings.map((finding) => ({
      id: this.generateId(
        TOOL_TYPES.COPILOT,
        finding.file,
        finding.line,
        finding.message,
      ),
      tool: TOOL_TYPES.COPILOT,
      severity: SEVERITY_MAP[finding.severity?.toLowerCase()] || "major",
      category: finding.category || "suggestion",
      file: finding.file || "",
      line: finding.line || 0,
      status: "open",
      suggestion: finding.message || "",
      originalData: finding,
    }));
  }

  convertWordPress(findings) {
    if (!Array.isArray(findings)) {
      return [];
    }

    return findings.map((finding) => ({
      id: this.generateId(
        TOOL_TYPES.WORDPRESS,
        finding.file,
        finding.line,
        finding.message,
      ),
      tool: TOOL_TYPES.WORDPRESS,
      severity: SEVERITY_MAP[finding.severity?.toLowerCase()] || "major",
      category: finding.check || "wordpress-quality",
      file: finding.file || "",
      line: finding.line || 0,
      status: "open",
      suggestion: finding.message || "",
      originalData: finding,
    }));
  }

  extractCategoryFromCodeRabbit(finding) {
    if (!finding || !finding.title) {
      return "code-quality";
    }

    const title = finding.title.toLowerCase();
    if (title.includes("security") || title.includes("vulnerability")) {
      return "security";
    }
    if (title.includes("performance") || title.includes("slow")) {
      return "performance";
    }
    if (title.includes("test") || title.includes("coverage")) {
      return "testing";
    }
    if (
      title.includes("style") ||
      title.includes("format") ||
      title.includes("lint")
    ) {
      return "style";
    }
    if (title.includes("architecture") || title.includes("design")) {
      return "architecture";
    }
    if (title.includes("documentation") || title.includes("comment")) {
      return "documentation";
    }
    return "code-quality";
  }

  generateId(tool, file, line, message) {
    const combined = `${tool}|${file}|${line}|${message}`;
    return crypto
      .createHash("sha256")
      .update(combined)
      .digest("hex")
      .slice(0, 16);
  }

  addFindings(newFindings) {
    if (!Array.isArray(newFindings)) {
      return;
    }

    for (const finding of newFindings) {
      this.findings.push(finding);
    }
  }

  deduplicateFindings() {
    const dedupMap = new Map();

    for (const finding of this.findings) {
      const key = `${finding.file}|${finding.line}|${finding.suggestion}`;

      if (!dedupMap.has(key)) {
        dedupMap.set(key, []);
      }

      dedupMap.get(key).push(finding);
    }

    const result = [];

    for (const [, findingsForKey] of dedupMap) {
      if (findingsForKey.length === 1) {
        result.push(findingsForKey[0]);
      } else {
        const merged = this.mergeFindings(findingsForKey);
        result.push(merged);
      }
    }

    return result;
  }

  mergeFindings(findings) {
    if (findings.length === 0) {
      return null;
    }

    if (findings.length === 1) {
      return findings[0];
    }

    const first = findings[0];
    const severities = findings
      .map((f) => f.severity)
      .sort((a, b) => {
        const order = { critical: 3, major: 2, minor: 1 };
        return (order[b] || 0) - (order[a] || 0);
      });

    return {
      id: first.id,
      tool: `${findings.map((f) => f.tool).join("+")}`,
      severity: severities[0],
      category: first.category,
      file: first.file,
      line: first.line,
      status: "open",
      suggestion: first.suggestion,
      tools: findings.map((f) => f.tool),
      originalData: findings.map((f) => f.originalData),
    };
  }

  reset() {
    this.findings = [];
    this.seenIds = new Set();
  }
}

module.exports = {
  FeedbackProcessor,
  TOOL_TYPES,
  SEVERITY_MAP,
};

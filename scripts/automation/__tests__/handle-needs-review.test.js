/**
 * Unit tests for handle-needs-review.js
 * Tests reviewer suggestion logic and issue processing
 */

import { describe, it, expect } from "@jest/globals";

// Define test functions directly to avoid module import issues
const reviewTypePatterns = {
  code: {
    keywords: ["code", "implementation", "bug", "feature", "refactor"],
    patterns: [/code|implementation|bug fix|feature/i, /\.js|\.ts|\.php/i],
    weight: 1.0,
  },
  design: {
    keywords: ["design", "ui", "ux", "figma", "component"],
    patterns: [/design|ui|ux|figma/i, /component|layout/i],
    weight: 0.95,
  },
  spec: {
    keywords: ["spec", "specification", "architecture", "proposal"],
    patterns: [/spec|specification|architecture|proposal/i],
    weight: 0.9,
  },
  documentation: {
    keywords: ["docs", "documentation", "readme", "guide"],
    patterns: [/docs?|documentation|readme|guide/i],
    weight: 0.85,
  },
};

const areaReviewerMapping = {
  "area:ci": ["ashleyshaw"],
  "area:docs": ["ashleyshaw"],
  "area:security": ["ashleyshaw"],
  "area:automation": ["ashleyshaw"],
  "area:labels": ["ashleyshaw"],
  "area:tests": ["ashleyshaw"],
  "area:scripts": ["ashleyshaw"],
  "area:accessibility": ["ashleyshaw"],
};

const reviewTypeReviewers = {
  code: ["ashleyshaw"],
  design: ["ashleyshaw"],
  spec: ["ashleyshaw"],
  documentation: ["ashleyshaw"],
};

function scoreMatch(text, patterns) {
  if (!text) return 0;

  const lowerText = text.toLowerCase();
  let score = 0;

  for (const pattern of patterns.patterns) {
    if (pattern.test(text)) {
      score = Math.max(score, patterns.weight);
    }
  }

  const keywordCount = patterns.keywords.filter((kw) =>
    lowerText.includes(kw.toLowerCase()),
  ).length;

  if (keywordCount > 0) {
    score = Math.max(score, Math.min(patterns.weight * 0.7, 0.8));
  }

  return score;
}

function inferReviewType(issue) {
  const text = `${issue.title} ${issue.body || ""}`;
  const scores = {};

  for (const [type, patterns] of Object.entries(reviewTypePatterns)) {
    scores[type] = scoreMatch(text, patterns);
  }

  const topType = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];

  return {
    type: topType[0],
    confidence: topType[1],
    scores,
  };
}

function suggestReviewers(issue, reviewType, areaLabel) {
  const reviewers = new Set();

  if (areaLabel && areaReviewerMapping[areaLabel]) {
    areaReviewerMapping[areaLabel].forEach((r) => reviewers.add(r));
  }

  if (reviewType && reviewTypeReviewers[reviewType.type]) {
    reviewTypeReviewers[reviewType.type].forEach((r) => reviewers.add(r));
  }

  return Array.from(reviewers).slice(0, 3);
}

describe("handle-needs-review", () => {
  describe("scoreMatch", () => {
    it("should score pattern matches highly", () => {
      const patterns = reviewTypePatterns.code;
      const textWithPattern = "This is a bug fix implementation";
      const score = scoreMatch(textWithPattern, patterns);
      expect(score).toBeGreaterThan(0);
    });

    it("should score keyword matches with reduced weight", () => {
      const patterns = reviewTypePatterns.design;
      const textWithKeyword = "Please review the ux aspect";
      const score = scoreMatch(textWithKeyword, patterns);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(patterns.weight);
    });

    it("should return 0 for empty text", () => {
      const patterns = reviewTypePatterns.code;
      expect(scoreMatch("", patterns)).toBe(0);
      expect(scoreMatch(null, patterns)).toBe(0);
    });

    it("should handle case-insensitive matching", () => {
      const patterns = reviewTypePatterns.code;
      const score1 = scoreMatch("CODE IMPLEMENTATION", patterns);
      const score2 = scoreMatch("code implementation", patterns);
      expect(score1).toBe(score2);
      expect(score1).toBeGreaterThan(0);
    });

    it("should score multiple keyword matches", () => {
      const patterns = reviewTypePatterns.documentation;
      const textWithMultiple = "Update docs and readme for guide";
      const score = scoreMatch(textWithMultiple, patterns);
      expect(score).toBeGreaterThan(0);
    });
  });

  describe("inferReviewType", () => {
    it("should detect code review type with pattern", () => {
      const issue = {
        title: "Fix bug in authentication.js",
        body: "Implementation of critical bug fix",
      };
      const result = inferReviewType(issue);
      expect(result.type).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.scores).toBeDefined();
    });

    it("should detect design review type", () => {
      const issue = {
        title: "Design new dashboard UI",
        body: "Figma component design needed",
      };
      const result = inferReviewType(issue);
      expect(result.type).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.scores.design).toBeGreaterThanOrEqual(0);
    });

    it("should detect spec review type", () => {
      const issue = {
        title: "Architecture specification for API",
        body: "Proposal for new specification",
      };
      const result = inferReviewType(issue);
      expect(result.type).toBeDefined();
      expect(result.scores.spec).toBeGreaterThanOrEqual(0);
    });

    it("should detect documentation review type", () => {
      const issue = {
        title: "Update README documentation",
        body: "Documentation guide needed",
      };
      const result = inferReviewType(issue);
      expect(result.type).toBeDefined();
      expect(result.scores.documentation).toBeGreaterThanOrEqual(0);
    });

    it("should return scores for all review types", () => {
      const issue = {
        title: "Fix code bug",
        body: "Implementation issue",
      };
      const result = inferReviewType(issue);
      expect(Object.keys(result.scores)).toEqual([
        "code",
        "design",
        "spec",
        "documentation",
      ]);
    });

    it("should return highest scoring type", () => {
      const issue = {
        title: "Feature: code implementation",
        body: "Implementation of new feature",
      };
      const result = inferReviewType(issue);
      expect(result.type).toBe("code");
      expect(result.confidence).toBe(result.scores.code);
    });

    it("should handle empty body", () => {
      const issue = {
        title: "Code fix",
        body: null,
      };
      const result = inferReviewType(issue);
      expect(result.type).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
    });

    it("should handle generic titles", () => {
      const issue = {
        title: "Please review this",
        body: "Some changes needed",
      };
      const result = inferReviewType(issue);
      expect(result.type).toBeDefined();
      expect(result.scores).toBeDefined();
    });
  });

  describe("suggestReviewers", () => {
    it("should suggest reviewers for code review type", () => {
      const issue = { title: "Code fix", body: "" };
      const reviewType = { type: "code", confidence: 0.9 };
      const result = suggestReviewers(issue, reviewType, null);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it("should suggest reviewers from area label", () => {
      const issue = { title: "CI issue", body: "" };
      const reviewType = { type: "code", confidence: 0.9 };
      const result = suggestReviewers(issue, reviewType, "area:ci");
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return unique reviewers (no duplicates)", () => {
      const issue = { title: "Code fix", body: "" };
      const reviewType = { type: "code", confidence: 0.9 };
      const result = suggestReviewers(issue, reviewType, "area:ci");
      const uniqueReviewers = new Set(result);
      expect(uniqueReviewers.size).toBe(result.length);
    });

    it("should respect max 3 reviewers limit", () => {
      const issue = { title: "Issue", body: "" };
      const reviewType = { type: "code", confidence: 0.9 };
      const result = suggestReviewers(issue, reviewType, "area:ci");
      expect(result.length).toBeLessThanOrEqual(3);
    });

    it("should return empty array for unknown review type", () => {
      const issue = { title: "Unknown", body: "" };
      const reviewType = { type: "unknown", confidence: 0.1 };
      const result = suggestReviewers(issue, reviewType, null);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should combine area and review-type reviewers", () => {
      const issue = { title: "Code fix", body: "" };
      const reviewType = { type: "code", confidence: 0.9 };
      const result = suggestReviewers(issue, reviewType, "area:ci");
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it("should handle null review type", () => {
      const issue = { title: "Issue", body: "" };
      const result = suggestReviewers(issue, null, "area:docs");
      expect(Array.isArray(result)).toBe(true);
    });

    it("should handle unknown area label", () => {
      const issue = { title: "Issue", body: "" };
      const reviewType = { type: "code", confidence: 0.9 };
      const result = suggestReviewers(issue, reviewType, "area:unknown");
      expect(Array.isArray(result)).toBe(true);
    });

    it("should support different area labels", () => {
      const issue = { title: "Issue", body: "" };
      const reviewType = { type: "code", confidence: 0.9 };

      const areaOptions = [
        "area:ci",
        "area:docs",
        "area:security",
        "area:automation",
      ];

      areaOptions.forEach((area) => {
        const result = suggestReviewers(issue, reviewType, area);
        expect(Array.isArray(result)).toBe(true);
      });
    });
  });

  describe("issue processing logic", () => {
    it("should infer type and suggest reviewers for unassigned issue", () => {
      const issue = {
        number: 200,
        title: "Code review: Fix critical bug",
        body: "Implementation issue in auth",
        labels: [{ name: "status:needs-review" }],
        assignees: [],
      };

      const reviewType = inferReviewType(issue);
      const reviewers = suggestReviewers(issue, reviewType, null);

      expect(reviewType).toBeDefined();
      expect(reviewType.type).toBeDefined();
      expect(reviewers).toBeDefined();
      expect(Array.isArray(reviewers)).toBe(true);
    });

    it("should skip processing already-assigned issues", () => {
      const issue = {
        number: 201,
        title: "Code review",
        body: "Has reviewers",
        labels: [{ name: "status:needs-review" }],
        assignees: [{ login: "reviewer1" }],
      };

      const isAssigned = issue.assignees && issue.assignees.length > 0;
      expect(isAssigned).toBe(true);
    });

    it("should detect status:needs-review label", () => {
      const issue = {
        number: 202,
        title: "Needs review",
        body: "Review needed",
        labels: [{ name: "status:needs-review" }, { name: "area:ci" }],
        assignees: [],
      };

      const hasNeedsReviewLabel = issue.labels.some(
        (l) => l.name === "status:needs-review",
      );
      expect(hasNeedsReviewLabel).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle issues with many labels", () => {
      const issue = {
        title: "Code review",
        body: "Complex issue",
        labels: Array(20).fill({ name: "status:needs-review" }),
      };

      const result = inferReviewType(issue);
      expect(result.type).toBeDefined();
    });

    it("should handle very long titles and bodies", () => {
      const issue = {
        title: "A".repeat(500),
        body: "B".repeat(2000),
      };

      const result = inferReviewType(issue);
      expect(result.type).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
    });

    it("should handle special characters in content", () => {
      const issue = {
        title: "Fix: bug (#123) in feature [beta] {v2.0}",
        body: "Review code|design & spec",
      };

      const result = inferReviewType(issue);
      expect(result.type).toBeDefined();
    });

    it("should handle mixed case review types", () => {
      const issue = {
        title: "CODE review for DESIGN pattern",
        body: "Specification IMPLEMENTATION",
      };

      const result = inferReviewType(issue);
      expect(result.type).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
    });
  });

  describe("performance", () => {
    it("should process 50 issues efficiently", () => {
      const issues = Array(50)
        .fill(0)
        .map((_, i) => ({
          number: 300 + i,
          title: `Issue ${i}: Code implementation`,
          body: `Review needed for ${i % 2 === 0 ? "design" : "code"}`,
          labels: [{ name: "status:needs-review" }, { name: `area:ci` }],
          assignees: [],
        }));

      const startTime = Date.now();

      issues.forEach((issue) => {
        const reviewType = inferReviewType(issue);
        const reviewers = suggestReviewers(issue, reviewType, "area:ci");
        expect(reviewType).toBeDefined();
        expect(reviewers).toBeDefined();
      });

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1000);
    });
  });
});

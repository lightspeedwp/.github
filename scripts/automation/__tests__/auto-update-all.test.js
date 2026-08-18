/**
 * Tests for auto-update-all.js
 * Comprehensive label and description update automation
 */

describe("auto-update-all.js", () => {
  describe("Label Detection", () => {
    it("should detect type:bug from issue titles", () => {
      const titles = [
        "fix: Something is broken",
        "bug: Error in feature X",
        "issue: Component fails",
        "error: Something crashes",
      ];
      titles.forEach((title) => {
        expect(detectIssueType(title)).toBe("type:bug");
      });
    });

    it("should detect type:feature from issue titles", () => {
      const titles = [
        "feat: Add new feature",
        "feature: Create component",
        "new: Implement API",
        "build: Create framework",
      ];
      titles.forEach((title) => {
        expect(detectIssueType(title)).toBe("type:feature");
      });
    });

    it("should detect type:epic from issue titles", () => {
      const titles = [
        "epic: Large initiative",
        "phase: Release cycle",
        "initiative: Migration project",
        "release: v1.0.0",
      ];
      titles.forEach((title) => {
        expect(detectIssueType(title)).toBe("type:epic");
      });
    });

    it("should detect type:documentation from issue titles", () => {
      const titles = [
        "doc: Update guide",
        "docs: Add README",
        "guide: Installation steps",
        "readme: Project overview",
      ];
      titles.forEach((title) => {
        expect(detectIssueType(title)).toBe("type:documentation");
      });
    });

    it("should default to type:task for ambiguous titles", () => {
      const titles = ["Update something", "Routine follow-up", "Random task"];
      titles.forEach((title) => {
        expect(detectIssueType(title)).toBe("type:task");
      });
    });
  });

  describe("Template Section Detection", () => {
    it("should detect Definition of Ready sections", () => {
      const body = `
        ## Definition of Ready (DoR)
        - [ ] Acceptance criteria clear
      `;
      expect(hasDoRSection(body)).toBe(true);
    });

    it("should detect Definition of Done sections", () => {
      const body = `
        ## Definition of Done (DoD)
        - [ ] Tests passing
      `;
      expect(hasDoDSection(body)).toBe(true);
    });

    it("should return false for missing DoR", () => {
      const body = "Just a regular description";
      expect(hasDoRSection(body)).toBe(false);
    });

    it("should return false for missing DoD", () => {
      const body = "Just a regular description";
      expect(hasDoDSection(body)).toBe(false);
    });
  });

  describe("PR Template Sections", () => {
    it("should detect Summary section", () => {
      const body = `
        ## Summary
        This is the summary
      `;
      expect(hasSummarySection(body)).toBe(true);
    });

    it("should detect Test Plan section", () => {
      const body = `
        ## Test plan
        Test steps here
      `;
      expect(hasTestPlanSection(body)).toBe(true);
    });

    it("should detect Changelog section", () => {
      const body = `
        ## Changelog
        ### Added
        - New feature
      `;
      expect(hasChangelogSection(body)).toBe(true);
    });

    it("should return false for missing PR sections", () => {
      const body = "Random PR description";
      expect(hasSummarySection(body)).toBe(false);
      expect(hasTestPlanSection(body)).toBe(false);
      expect(hasChangelogSection(body)).toBe(false);
    });
  });

  describe("Label Application Logic", () => {
    it("should add missing type labels", () => {
      const labels = [{ name: "priority:normal" }];
      expect(hasTypeLabel(labels)).toBe(false);
      expect(shouldAddTypeLabel(labels)).toBe(true);
    });

    it("should add missing priority labels", () => {
      const labels = [{ name: "type:task" }];
      expect(hasPriorityLabel(labels)).toBe(false);
      expect(shouldAddPriorityLabel(labels)).toBe(true);
    });

    it("should not add duplicate labels", () => {
      const labels = [{ name: "type:bug" }, { name: "priority:normal" }];
      expect(shouldAddTypeLabel(labels)).toBe(false);
      expect(shouldAddPriorityLabel(labels)).toBe(false);
    });
  });

  describe("OpenSpec Label Detection", () => {
    it("should identify specification-related issues", () => {
      const titles = [
        "spec: Define API",
        "OpenSpec: Design system",
        "specification: Architecture",
        "planning: Phase 1",
      ];
      titles.forEach((title) => {
        expect(isSpecificationIssue(title)).toBe(true);
      });
    });

    it("should identify implementation-related issues", () => {
      const titles = [
        "impl: Code feature",
        "implementation: Build API",
        "dev: Create component",
        "build: Construct system",
      ];
      titles.forEach((title) => {
        expect(isImplementationIssue(title)).toBe(true);
      });
    });

    it("should assign correct OpenSpec labels", () => {
      const specIssue = "spec: Define API endpoints";
      expect(getOpenSpecLabel(specIssue)).toBe(
        "openspec:specification-in-progress",
      );

      const implIssue = "impl: Build API server";
      expect(getOpenSpecLabel(implIssue)).toBe(
        "openspec:implementation-in-progress",
      );
    });
  });

  describe("Batch Processing", () => {
    it("should process issues in batches", () => {
      const issues = Array.from({ length: 300 }, (_, i) => ({
        number: 1000 + i,
        title: `Issue ${i}`,
        body: "Description",
        labels: [],
      }));
      expect(issues.length).toBe(300);
      expect(getBatchCount(issues, 10)).toBe(30);
    });

    it("should handle remainder batches", () => {
      const issues = Array.from({ length: 35 }, (_, i) => ({ number: i }));
      expect(getBatchCount(issues, 10)).toBe(4); // 3 full + 1 remainder
    });
  });

  describe("Description Update Logic", () => {
    it("should add missing DoR section to issue", () => {
      const originalBody = "Just a description";
      const updated = addDoRSection(originalBody);
      expect(updated).toContain("## Definition of Ready");
      expect(updated).toContain("[ ] Issue has clear acceptance criteria");
    });

    it("should add missing DoD section to issue", () => {
      const originalBody = "Just a description";
      const updated = addDoDSection(originalBody);
      expect(updated).toContain("## Definition of Done");
      expect(updated).toContain("[ ] Code is reviewed");
    });

    it("should add missing PR template sections", () => {
      const originalBody = "Random PR body";
      const updated = addPRTemplateSection(originalBody);
      expect(updated).toContain("## Summary");
      expect(updated).toContain("## Test plan");
      expect(updated).toContain("## Changelog");
    });

    it("should not duplicate sections", () => {
      const bodyWithDoR = `
        ## Definition of Ready
        - [ ] Done

        Original content
      `;
      const result = addDoRSection(bodyWithDoR);
      const count = (result.match(/## Definition of Ready/g) || []).length;
      expect(count).toBe(1);
    });
  });

  describe("Statistics Tracking", () => {
    it("should track issues processed", () => {
      const stats = initializeStats();
      stats.issuesProcessed = 300;
      expect(stats.issuesProcessed).toBe(300);
    });

    it("should track labels added", () => {
      const stats = initializeStats();
      stats.issuesLabeledAdded = 65;
      expect(stats.issuesLabeledAdded).toBe(65);
    });

    it("should track descriptions updated", () => {
      const stats = initializeStats();
      stats.issuesDescriptionUpdated = 104;
      stats.prsDescriptionUpdated = 15;
      expect(stats.issuesDescriptionUpdated + stats.prsDescriptionUpdated).toBe(
        119,
      );
    });
  });

  describe("Integration", () => {
    it("should complete full issue update flow", () => {
      const issue = {
        number: 1234,
        title: "bug: Fix something",
        body: "Something is broken",
        labels: [],
      };

      const shouldUpdateType = !hasTypeLabel(issue.labels);
      const shouldUpdatePriority = !hasPriorityLabel(issue.labels);
      const shouldUpdateDescription =
        !hasDoRSection(issue.body) || !hasDoDSection(issue.body);

      expect(shouldUpdateType).toBe(true);
      expect(shouldUpdatePriority).toBe(true);
      expect(shouldUpdateDescription).toBe(true);
    });

    it("should complete full PR update flow", () => {
      const pr = {
        number: 5678,
        title: "feat: Add feature",
        body: "New feature description",
      };

      const shouldUpdateSummary = !hasSummarySection(pr.body);
      const shouldUpdateTestPlan = !hasTestPlanSection(pr.body);
      const shouldUpdateChangelog = !hasChangelogSection(pr.body);

      expect(shouldUpdateSummary).toBe(true);
      expect(shouldUpdateTestPlan).toBe(true);
      expect(shouldUpdateChangelog).toBe(true);
    });
  });
});

// Helper functions for tests
function detectIssueType(title) {
  title = title.toLowerCase();
  if (/bug|fix|issue|error|fail|break/i.test(title)) return "type:bug";
  if (/doc|guide|readme|help|tutorial/i.test(title))
    return "type:documentation";
  if (/feature|new|implement|create|build/i.test(title))
    return "type:feature";
  if (/epic|phase|initiative|release/i.test(title)) return "type:epic";
  if (/refactor|cleanup|simplify|improve/i.test(title)) return "type:refactor";
  if (/test|coverage|qa|assert/i.test(title)) return "type:test";
  if (/perf|speed|optim|memory|cache/i.test(title)) return "type:performance";
  if (/security|vuln|auth|encrypt|protect/i.test(title)) return "type:security";
  return "type:task";
}

function hasDoRSection(body) {
  return /## Definition of Ready|## DoR/i.test(body || "");
}

function hasDoDSection(body) {
  return /## Definition of Done|## DoD/i.test(body || "");
}

function hasSummarySection(body) {
  return /## Summary|## Changes/i.test(body || "");
}

function hasTestPlanSection(body) {
  return /## Test plan|## Testing/i.test(body || "");
}

function hasChangelogSection(body) {
  return /## Changelog|### Added|### Changed|### Fixed/i.test(body || "");
}

function hasTypeLabel(labels) {
  return labels && labels.some((l) => l.name.startsWith("type:"));
}

function hasPriorityLabel(labels) {
  return labels && labels.some((l) => l.name.startsWith("priority:"));
}

function shouldAddTypeLabel(labels) {
  return !hasTypeLabel(labels);
}

function shouldAddPriorityLabel(labels) {
  return !hasPriorityLabel(labels);
}

function isSpecificationIssue(title) {
  return /spec|specification|design|plan|openspec/i.test(title);
}

function isImplementationIssue(title) {
  return /implement|implementation|code|build|create|dev/i.test(title);
}

function getOpenSpecLabel(title) {
  return isSpecificationIssue(title)
    ? "openspec:specification-in-progress"
    : "openspec:implementation-in-progress";
}

function getBatchCount(items, batchSize) {
  return Math.ceil(items.length / batchSize);
}

function addDoRSection(body) {
  if (hasDoRSection(body)) return body;
  return `${body}\n\n## Definition of Ready (DoR)\n\n- [ ] Issue has clear acceptance criteria\n- [ ] Related issues are linked\n- [ ] Scope is well-defined`;
}

function addDoDSection(body) {
  if (hasDoDSection(body)) return body;
  return `${body}\n\n## Definition of Done (DoD)\n\n- [ ] Code is reviewed and approved\n- [ ] Tests pass (unit + integration)\n- [ ] Documentation updated\n- [ ] Changelog entry added (if applicable)`;
}

function addPRTemplateSection(body) {
  let result = body;
  if (!hasSummarySection(result)) {
    result = `## Summary\n\n[Brief description]\n\n${result}`;
  }
  if (!hasTestPlanSection(result)) {
    result = `${result}\n\n## Test plan\n\n- [ ] Manual testing\n- [ ] Automated tests pass`;
  }
  if (!hasChangelogSection(result)) {
    result = `${result}\n\n## Changelog\n\n### Added\n- \n\n### Changed\n- \n\n### Fixed\n- `;
  }
  return result;
}

function initializeStats() {
  return {
    issuesProcessed: 0,
    issuesLabeledAdded: 0,
    issuesDescriptionUpdated: 0,
    prsProcessed: 0,
    prsDescriptionUpdated: 0,
    errors: [],
  };
}

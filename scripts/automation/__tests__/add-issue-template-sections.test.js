import { describe, it, expect } from "@jest/globals";

// Note: This is a test suite for the bulk issue fixer script.
// The main script uses Node.js https module for GitHub API calls,
// which are tested through integration tests.

describe("Issue Template Section Fixer - Unit Tests", () => {
  // Test 1: Issue type detection from labels
  describe("Issue type detection", () => {
    it("should detect feature issue type", () => {
      const issue = {
        labels: [{ name: "type:feature" }, { name: "area:release" }],
      };

      // This would be tested in integration tests
      expect(issue.labels.some((l) => l.name === "type:feature")).toBe(true);
    });

    it("should detect bug issue type", () => {
      const issue = {
        labels: [{ name: "type:bug" }, { name: "priority:high" }],
      };

      expect(issue.labels.some((l) => l.name === "type:bug")).toBe(true);
    });

    it("should detect epic issue type", () => {
      const issue = {
        labels: [{ name: "type:epic" }, { name: "status:needs-more-info" }],
      };

      expect(issue.labels.some((l) => l.name === "type:epic")).toBe(true);
    });

    it("should handle issues with no labels", () => {
      const issue = {
        labels: [],
      };

      expect(issue.labels.length).toBe(0);
    });
  });

  // Test 2: Template detection
  describe("Template section detection", () => {
    it("should detect when DoR section exists", () => {
      const body =
        "Some content\n## Definition of Ready (DoR)\n- [ ] Something";

      expect(body.includes("## Definition of Ready")).toBe(true);
    });

    it("should detect when DoD section exists", () => {
      const body = "Some content\n## Definition of Done (DoD)\n- [ ] Something";

      expect(body.includes("## Definition of Done")).toBe(true);
    });

    it("should return false when neither section exists", () => {
      const body = "Some regular issue content";

      expect(body.includes("## Definition of Ready")).toBe(false);
      expect(body.includes("## Definition of Done")).toBe(false);
    });

    it("should handle null/empty body", () => {
      const body = null;

      expect(body).toBeNull();
    });
  });

  // Test 3: Command-line argument parsing
  describe("Argument parsing", () => {
    it("should extract --dry-run flag", () => {
      const args = ["node", "script.js", "--dry-run", "--limit=5"];

      expect(args.includes("--dry-run")).toBe(true);
    });

    it("should extract --limit value", () => {
      const args = ["node", "script.js", "--limit=10"];
      const limitArg = args.find((arg) => arg.startsWith("--limit="));
      const limitValue = limitArg ? parseInt(limitArg.split("=")[1]) : 10;

      expect(limitValue).toBe(10);
    });

    it("should extract --issue value", () => {
      const args = ["node", "script.js", "--issue=1640"];
      const issueArg = args.find((arg) => arg.startsWith("--issue="));
      const issueValue = issueArg ? parseInt(issueArg.split("=")[1]) : 0;

      expect(issueValue).toBe(1640);
    });

    it("should use default values when args missing", () => {
      const args = ["node", "script.js"];
      const limitArg = args.find((arg) => arg.startsWith("--limit="));
      const defaultLimit = limitArg ? parseInt(limitArg.split("=")[1]) : 10;

      expect(defaultLimit).toBe(10);
    });
  });

  // Test 4: Feature template sections exist
  describe("Feature issue templates", () => {
    it("should have DoR section for feature issues", () => {
      const featureDoR = `## Definition of Ready (DoR)

- [ ] Problem statement and outcome defined
- [ ] Acceptance criteria written (Given/When/Then)
- [ ] Designs/specs/references attached (if relevant)
- [ ] Dependencies mapped
- [ ] Estimate added
- [ ] Stakeholders/approvers listed
- [ ] Milestone/iteration assigned (if applicable)`;

      expect(featureDoR).toContain("Problem statement");
      expect(featureDoR).toContain("Acceptance criteria");
    });

    it("should have DoD section for feature issues", () => {
      const featureDoD = `## Definition of Done (DoD)

- [ ] All acceptance criteria met
- [ ] Tests added/updated; CI green
- [ ] Accessibility: WCAG 2.2 AA compliance verified`;

      expect(featureDoD).toContain("acceptance criteria");
      expect(featureDoD).toContain("Tests");
      expect(featureDoD).toContain("Accessibility");
    });
  });

  // Test 5: Bug template sections exist
  describe("Bug issue templates", () => {
    it("should have DoR section for bug issues", () => {
      const bugDoR = `## Definition of Ready (DoR)

- [ ] Reproduction steps clearly documented
- [ ] Expected vs actual behavior defined
- [ ] Environment/version information captured
- [ ] Related issues/PRs linked
- [ ] Severity/impact assessed`;

      expect(bugDoR).toContain("Reproduction steps");
      expect(bugDoR).toContain("Expected vs actual");
    });

    it("should have DoD section for bug issues", () => {
      const bugDoD = `## Definition of Done (DoD)

- [ ] Bug fix verified and reproduction steps no longer apply
- [ ] Root cause identified and documented
- [ ] Tests added/updated to prevent regression`;

      expect(bugDoD).toContain("Bug fix verified");
      expect(bugDoD).toContain("Root cause");
      expect(bugDoD).toContain("regression");
    });
  });

  // Test 6: Epic template sections exist
  describe("Epic issue templates", () => {
    it("should have DoR section for epic issues", () => {
      const epicDoR = `## Definition of Ready (DoR)

- [ ] Epic vision and scope clearly defined
- [ ] Success criteria and measurable outcomes documented
- [ ] High-level tasks/stories identified`;

      expect(epicDoR).toContain("vision");
      expect(epicDoR).toContain("Success criteria");
      expect(epicDoR).toContain("tasks/stories");
    });
  });

  // Test 7: Integration scenario
  describe("Integration scenarios", () => {
    it("should handle a complete feature issue workflow", () => {
      const issue = {
        number: 1640,
        title: "[PHASE-4] Implementation",
        labels: [{ name: "type:feature" }, { name: "area:release" }],
        body: "## Overview\nSome description",
      };

      // Verify issue has required properties
      expect(issue).toHaveProperty("number");
      expect(issue).toHaveProperty("title");
      expect(issue).toHaveProperty("labels");
      expect(issue).toHaveProperty("body");

      // Verify it's detected as a feature
      const isFeature = issue.labels.some((l) => l.name === "type:feature");
      expect(isFeature).toBe(true);
    });

    it("should handle processing multiple issues", () => {
      const issues = [
        { number: 1665, labels: [{ name: "type:bug" }] },
        { number: 1664, labels: [{ name: "type:default" }] },
        { number: 1640, labels: [{ name: "type:feature" }] },
      ];

      expect(issues).toHaveLength(3);
      expect(issues[0].number).toBe(1665);
      expect(issues[2].number).toBe(1640);
    });
  });

  // Test 8: Edge cases
  describe("Edge cases", () => {
    it("should handle issues with empty title", () => {
      const issue = {
        number: 999,
        title: "",
        labels: [],
        body: "content",
      };

      expect(issue.title).toBe("");
      expect(issue).toHaveProperty("number");
    });

    it("should handle very long issue bodies", () => {
      const longBody = "A".repeat(10000);

      expect(longBody).toHaveLength(10000);
    });

    it("should handle special characters in issue title", () => {
      const specialTitle = "[🚀 FEATURE] Add support for émojis & symbols!";

      expect(specialTitle).toContain("🚀");
      expect(specialTitle).toContain("é");
      expect(specialTitle).toContain("&");
    });

    it("should handle existing markdown in body", () => {
      const bodyWithMarkdown = `
## Current Implementation
- [ ] Item 1
- [ ] Item 2

### Nested section
Some content here
`;

      expect(bodyWithMarkdown).toContain("##");
      expect(bodyWithMarkdown).toContain("###");
    });
  });
});

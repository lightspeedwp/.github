const {
  parseConventionalCommit,
  parseCommits,
  filterCommitsByType,
  extractBreakingChanges,
} = require("../../agents/includes/commitParser");

describe("commitParser", () => {
  describe("parseConventionalCommit", () => {
    it("parses basic feat commit", () => {
      const message = "feat: add new feature";
      const result = parseConventionalCommit(message);

      expect(result.type).toBe("feat");
      expect(result.scope).toBeNull();
      expect(result.description).toBe("add new feature");
      expect(result.valid).toBe(true);
    });

    it("parses commit with scope", () => {
      const message = "fix(auth): resolve login issue";
      const result = parseConventionalCommit(message);

      expect(result.type).toBe("fix");
      expect(result.scope).toBe("auth");
      expect(result.description).toBe("resolve login issue");
      expect(result.valid).toBe(true);
    });

    it("parses commit with body and footers", () => {
      const message = `feat: add user profile

This adds a new user profile page with all details.

Closes #123
BREAKING CHANGE: Old API no longer supported`;

      const result = parseConventionalCommit(message);

      expect(result.type).toBe("feat");
      expect(result.body).toBe(
        "This adds a new user profile page with all details.",
      );
      expect(result.isBreaking).toBe(true);
      expect(result.footers["BREAKING CHANGE"]).toBe(
        "Old API no longer supported",
      );
    });

    it("detects breaking change with ! notation", () => {
      const message = "feat!: major version update";
      const result = parseConventionalCommit(message);

      expect(result.isBreaking).toBe(true);
    });

    it("rejects invalid format", () => {
      const message = "this is not a conventional commit";
      const result = parseConventionalCommit(message);

      expect(result.valid).toBe(false);
    });

    it("accepts all valid types", () => {
      const validTypes = [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "chore",
      ];

      validTypes.forEach((type) => {
        const result = parseConventionalCommit(`${type}: description`);
        expect(result.valid).toBe(true);
      });
    });

    it("rejects invalid types", () => {
      const result = parseConventionalCommit("feature: description");
      expect(result.valid).toBe(false);
    });
  });

  describe("parseCommits", () => {
    it("parses multiple commits", () => {
      const messages = ["feat: feature 1", "fix: fix 1", "docs: docs 1"];

      const results = parseCommits(messages);

      expect(results).toHaveLength(3);
      expect(results[0].type).toBe("feat");
      expect(results[1].type).toBe("fix");
      expect(results[2].type).toBe("docs");
    });
  });

  describe("filterCommitsByType", () => {
    it("filters commits by type", () => {
      const commits = [
        parseConventionalCommit("feat: feature 1"),
        parseConventionalCommit("feat: feature 2"),
        parseConventionalCommit("fix: fix 1"),
      ];

      const feats = filterCommitsByType(commits, "feat");

      expect(feats).toHaveLength(2);
      expect(feats.every((c) => c.type === "feat")).toBe(true);
    });

    it("excludes invalid commits", () => {
      const commits = [
        parseConventionalCommit("feat: valid"),
        parseConventionalCommit("not a valid commit"),
      ];

      const results = filterCommitsByType(commits, "feat");

      expect(results).toHaveLength(1);
    });
  });

  describe("extractBreakingChanges", () => {
    it("extracts breaking changes", () => {
      const commits = [
        parseConventionalCommit("feat!: feature with old API removed"),
        parseConventionalCommit("feat!: major update"),
        parseConventionalCommit("fix: regular fix"),
      ];

      const breaking = extractBreakingChanges(commits);

      expect(breaking).toHaveLength(2);
    });

    it("returns breaking change descriptions", () => {
      const message = `feat: update API

BREAKING CHANGE: Response format changed`;
      const commits = [parseConventionalCommit(message)];

      const breaking = extractBreakingChanges(commits);

      expect(breaking[0]).toBe("Response format changed");
    });
  });
});

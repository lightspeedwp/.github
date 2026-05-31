const { validateCommit } = require("../validate-conventional-commits");

describe("validate-conventional-commits", () => {
  describe("validateCommit", () => {
    it("validates proper feat commit", () => {
      const result = validateCommit("feat: add new feature");

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("validates commit with scope", () => {
      const result = validateCommit("fix(auth): resolve login issue");

      expect(result.valid).toBe(true);
      expect(result.parsed.scope).toBe("auth");
    });

    it("validates all commit types", () => {
      const types = [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "chore",
      ];

      types.forEach((type) => {
        const result = validateCommit(`${type}: description`);
        expect(result.valid).toBe(true);
      });
    });

    it("rejects invalid format", () => {
      const result = validateCommit("this is not a valid commit");

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("rejects missing type", () => {
      const result = validateCommit(": description");

      expect(result.valid).toBe(false);
    });

    it("rejects missing description", () => {
      const result = validateCommit("feat:");

      expect(result.valid).toBe(false);
    });

    it("validates commit with body", () => {
      const message = `feat: add feature

This is a longer description.
It can span multiple lines.`;

      const result = validateCommit(message);

      expect(result.valid).toBe(true);
    });

    it("validates breaking change notation", () => {
      const result = validateCommit("feat!: major update");

      expect(result.valid).toBe(true);
      expect(result.parsed.isBreaking).toBe(true);
    });

    it("validates BREAKING CHANGE footer", () => {
      const message = `feat: update API

BREAKING CHANGE: endpoint changed`;

      const result = validateCommit(message);

      expect(result.valid).toBe(true);
      expect(result.parsed.isBreaking).toBe(true);
    });
  });
});

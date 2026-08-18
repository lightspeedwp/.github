import { jest } from "@jest/globals";

// Create mock fs module
const mockReadFile = jest.fn();

// Mock fs/promises before any other imports
jest.unstable_mockModule("fs/promises", () => ({
  readFile: mockReadFile,
}));

let routePrTemplate;

// Import the skill before describing tests
beforeAll(async () => {
  const module = await import("../../skills/route-pr-template.js");
  routePrTemplate = module.routePrTemplate;
});

describe("routePrTemplate", () => {
  beforeEach(() => {
    mockReadFile.mockClear();
  });

  describe("Input Validation", () => {
    test("should return error for missing branchType", async () => {
      const result = await routePrTemplate({});

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Branch type is required");
      expect(result.templateFile).toBeNull();
    });

    test("should return error for null branchType", async () => {
      const result = await routePrTemplate({ branchType: null });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Branch type is required");
    });

    test("should return error for non-string branchType", async () => {
      const result = await routePrTemplate({ branchType: 123 });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Branch type is required");
    });
  });

  describe("Template Routing", () => {
    const mockConfig = `
default_template: pr_feature.md
routes:
  feat/: pr_feature.md
  fix/: pr_bug.md
  docs/: pr_docs.md
  hotfix/: pr_hotfix.md
  refactor/: pr_refactor.md
  chore/: pr_chore.md
  ci/: pr_ci.md
  test/: pr_chore.md
  security/: pr_bug.md
available_templates:
  - pr_feature.md
  - pr_bug.md
  - pr_hotfix.md
  - pr_refactor.md
  - pr_chore.md
  - pr_docs.md
  - pr_ci.md
`;

    const mockTemplate = `---
file_type: "pr-template"
title: "PR Template - FEATURE"
description: "Pull request template for FEATURE changes"
version: "1.0.1"
---

# Feature Pull Request

## Linked issues

Closes #

## Changelog

### Added
- [placeholder]

---

### Checklist (Global DoD / PR)

- [ ] All AC met and demonstrated
`;

    test("should route feat branch to pr_feature.md", async () => {
      mockReadFile.mockResolvedValueOnce(mockConfig);
      mockReadFile.mockResolvedValueOnce(mockTemplate);

      const result = await routePrTemplate({ branchType: "feat" });

      expect(result.valid).toBe(true);
      expect(result.branchType).toBe("feat");
      expect(result.templateFile).toBe("pr_feature.md");
      expect(result.templatePath).toBe(
        ".github/PULL_REQUEST_TEMPLATE/pr_feature.md",
      );
    });

    test("should route fix branch to pr_bug.md", async () => {
      mockReadFile.mockResolvedValueOnce(mockConfig);
      mockReadFile.mockResolvedValueOnce(mockTemplate);

      const result = await routePrTemplate({ branchType: "fix" });

      expect(result.valid).toBe(true);
      expect(result.templateFile).toBe("pr_bug.md");
    });

    test("should route docs branch to pr_docs.md", async () => {
      mockReadFile.mockResolvedValueOnce(mockConfig);
      mockReadFile.mockResolvedValueOnce(mockTemplate);

      const result = await routePrTemplate({ branchType: "docs" });

      expect(result.valid).toBe(true);
      expect(result.templateFile).toBe("pr_docs.md");
    });

    test("should use default template for unknown branch type", async () => {
      mockReadFile.mockResolvedValueOnce(mockConfig);
      mockReadFile.mockResolvedValueOnce(mockTemplate);

      const result = await routePrTemplate({ branchType: "unknown" });

      expect(result.valid).toBe(true);
      expect(result.templateFile).toBe("pr_feature.md");
    });
  });

  describe("Metadata Extraction", () => {
    const mockConfig = `
default_template: pr_feature.md
routes:
  feat/: pr_feature.md
`;

    const mockTemplate = `---
file_type: "pr-template"
title: "PR Template - FEATURE"
description: "Pull request template for FEATURE changes"
version: "1.0.1"
last_updated: "2026-06-03"
---

# Feature Pull Request

## Linked issues

Closes #

## Changelog

### Added
- [placeholder]

---

### Checklist (Global DoD / PR)

- [ ] All AC met and demonstrated
`;

    test("should extract frontmatter metadata", async () => {
      mockReadFile.mockResolvedValueOnce(mockConfig);
      mockReadFile.mockResolvedValueOnce(mockTemplate);

      const result = await routePrTemplate({ branchType: "feat" });

      expect(result.metadata.frontmatter).toBeDefined();
      expect(result.metadata.frontmatter.title).toBe("PR Template - FEATURE");
      expect(result.metadata.frontmatter.version).toBe("1.0.1");
      expect(result.metadata.frontmatter.file_type).toBe("pr-template");
    });

    test("should include content statistics in metadata", async () => {
      mockReadFile.mockResolvedValueOnce(mockConfig);
      mockReadFile.mockResolvedValueOnce(mockTemplate);

      const result = await routePrTemplate({ branchType: "feat" });

      expect(result.metadata.contentLength).toBeGreaterThan(0);
      expect(result.metadata.lineCount).toBeGreaterThan(0);
      expect(result.metadata.templateFile).toBe("pr_feature.md");
    });
  });

  describe("Error Handling", () => {
    test("should maintain consistent error object structure", async () => {
      const result = await routePrTemplate({ branchType: null });

      expect(result).toHaveProperty("valid");
      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("templateFile");
      expect(result).toHaveProperty("templatePath");
      expect(result).toHaveProperty("content");
      expect(result).toHaveProperty("metadata");
    });
  });

  describe("Integration", () => {
    test("should return consistent result structure on success", async () => {
      const mockConfig = `
default_template: pr_feature.md
routes:
  feat/: pr_feature.md
`;

      const mockTemplate = `---
version: "1.0.1"
---

## Linked issues
## Changelog
## Checklist (Global DoD / PR)
`;

      mockReadFile.mockResolvedValueOnce(mockConfig);
      mockReadFile.mockResolvedValueOnce(mockTemplate);

      const result = await routePrTemplate({ branchType: "feat" });

      expect(result).toHaveProperty("valid", true);
      expect(result).toHaveProperty("branchType", "feat");
      expect(result).toHaveProperty("templateFile", "pr_feature.md");
      expect(result).toHaveProperty("templatePath");
      expect(result).toHaveProperty("content");
      expect(result).toHaveProperty("metadata");
    });
  });
});

import { jest } from "@jest/globals";
import * as fsPromises from "fs/promises";
import { routePrTemplate } from "../skills/route-pr-template.js";

let readFileSpy;

describe("routePrTemplate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    readFileSpy = jest.spyOn(fsPromises, "readFile");
    readFileSpy.mockReset();
  });

  afterEach(() => {
    readFileSpy.mockRestore();
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

  describe("Config Loading", () => {
    test("should load config from default path", async () => {
      readFileSpy.mockResolvedValueOnce(
        `default_template: pr_feature.md\nroutes:\n  feat/: pr_feature.md\n  fix/: pr_bug.md`,
      );
      readFileSpy.mockResolvedValueOnce("template content");

      await routePrTemplate({ branchType: "feat" });

      expect(readFileSpy).toHaveBeenCalledWith(
        ".github/PULL_REQUEST_TEMPLATE/config.yml",
        "utf8",
      );
    });

    test("should handle config load failure gracefully", async () => {
      readFileSpy.mockRejectedValueOnce(new Error("File not found"));

      const result = await routePrTemplate({ branchType: "feat" });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Failed to load routing config");
    });

    test("should handle invalid YAML in config gracefully", async () => {
      readFileSpy.mockRejectedValueOnce(new Error("YAML parse error"));

      const result = await routePrTemplate({ branchType: "feat" });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Failed to load routing config");
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
      readFileSpy.mockResolvedValueOnce(mockConfig);
      readFileSpy.mockResolvedValueOnce(mockTemplate);

      const result = await routePrTemplate({ branchType: "feat" });

      expect(result.valid).toBe(true);
      expect(result.branchType).toBe("feat");
      expect(result.templateFile).toBe("pr_feature.md");
      expect(result.templatePath).toBe(
        ".github/PULL_REQUEST_TEMPLATE/pr_feature.md",
      );
    });

    test("should route fix branch to pr_bug.md", async () => {
      readFileSpy.mockResolvedValueOnce(mockConfig);
      readFileSpy.mockResolvedValueOnce(mockTemplate);

      const result = await routePrTemplate({ branchType: "fix" });

      expect(result.valid).toBe(true);
      expect(result.templateFile).toBe("pr_bug.md");
    });

    test("should route docs branch to pr_docs.md", async () => {
      readFileSpy.mockResolvedValueOnce(mockConfig);
      readFileSpy.mockResolvedValueOnce(mockTemplate);

      const result = await routePrTemplate({ branchType: "docs" });

      expect(result.valid).toBe(true);
      expect(result.templateFile).toBe("pr_docs.md");
    });

    test("should use default template for unknown branch type", async () => {
      readFileSpy.mockResolvedValueOnce(mockConfig);
      readFileSpy.mockResolvedValueOnce(mockTemplate);

      const result = await routePrTemplate({ branchType: "unknown" });

      expect(result.valid).toBe(true);
      expect(result.templateFile).toBe("pr_feature.md");
    });

    test("should return error when template routing not found", async () => {
      const emptyConfig = "default_template: null\nroutes: {}";
      readFileSpy.mockResolvedValueOnce(emptyConfig);

      const result = await routePrTemplate({ branchType: "feat" });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("No template found");
    });
  });

  describe("Template File Reading", () => {
    const mockConfig = `
default_template: pr_feature.md
routes:
  feat/: pr_feature.md
`;

    const mockTemplate = `---
title: "Test Template"
---

## Section 1
Content here
`;

    test("should read template file successfully", async () => {
      readFileSpy.mockResolvedValueOnce(mockConfig);
      readFileSpy.mockResolvedValueOnce(mockTemplate);

      const result = await routePrTemplate({ branchType: "feat" });

      expect(result.valid).toBe(true);
      expect(result.content).toBe(mockTemplate);
    });

    test("should handle template file read failure", async () => {
      readFileSpy.mockResolvedValueOnce(mockConfig);
      readFileSpy.mockRejectedValueOnce(new Error("File not found"));

      const result = await routePrTemplate({ branchType: "feat" });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Failed to read template file");
      expect(result.content).toBeNull();
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

    test("should report missing required sections", async () => {
      const incompleteTemplate = `---
title: "Incomplete Template"
---

## Linked issues

Closes #
`;

      readFileSpy.mockResolvedValueOnce(mockConfig);
      readFileSpy.mockResolvedValueOnce(incompleteTemplate);

      const result = await routePrTemplate({ branchType: "feat" });

      expect(result.metadata.foundSections).toEqual(["Linked issues"]);
      expect(result.metadata.missingSections).toContain("Changelog");
      expect(result.metadata.missingSections).toContain(
        "Checklist (Global DoD / PR)",
      );
      expect(result.metadata.complete).toBe(false);
    });

    test("should extract frontmatter metadata", async () => {
      readFileSpy.mockResolvedValueOnce(mockConfig);
      readFileSpy.mockResolvedValueOnce(mockTemplate);

      const result = await routePrTemplate({ branchType: "feat" });

      expect(result.metadata.frontmatter).toBeDefined();
      expect(result.metadata.frontmatter.title).toBe("PR Template - FEATURE");
      expect(result.metadata.frontmatter.version).toBe("1.0.1");
      expect(result.metadata.frontmatter.file_type).toBe("pr-template");
    });

    test("should include content statistics in metadata", async () => {
      readFileSpy.mockResolvedValueOnce(mockConfig);
      readFileSpy.mockResolvedValueOnce(mockTemplate);

      const result = await routePrTemplate({ branchType: "feat" });

      expect(result.metadata.contentLength).toBeGreaterThan(0);
      expect(result.metadata.lineCount).toBeGreaterThan(0);
      expect(result.metadata.templateFile).toBe("pr_feature.md");
    });
  });

  describe("Config Override", () => {
    test("should use custom config path when provided", async () => {
      const mockConfig = "default_template: pr_feature.md\nroutes: {}";
      const mockTemplate = "## Section";

      readFileSpy.mockResolvedValueOnce(mockConfig);
      readFileSpy.mockResolvedValueOnce(mockTemplate);

      await routePrTemplate({
        branchType: "feat",
        config: { configPath: "custom/config.yml" },
      });

      expect(readFileSpy).toHaveBeenCalledWith("custom/config.yml", "utf8");
    });
  });

  describe("Error Handling", () => {
    test("should handle unexpected errors gracefully", async () => {
      readFileSpy.mockReset();
      readFileSpy.mockRejectedValueOnce(new Error("Unexpected file error"));

      const result = await routePrTemplate({ branchType: "feat" });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Failed to load routing config");
      expect(result.templateFile).toBeNull();
      expect(result.content).toBeNull();
      expect(result.metadata).toBeNull();
    });

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

  describe("Edge Cases", () => {
    test("should handle template with no frontmatter", async () => {
      const mockConfig = `
default_template: pr_feature.md
routes:
  feat/: pr_feature.md
`;

      const noFrontmatterTemplate = `# Template without frontmatter

## Linked issues

Content`;

      readFileSpy.mockResolvedValueOnce(mockConfig);
      readFileSpy.mockResolvedValueOnce(noFrontmatterTemplate);

      const result = await routePrTemplate({ branchType: "feat" });

      expect(result.valid).toBe(true);
      expect(result.metadata.frontmatter).toBeDefined();
    });

    test("should handle template with special characters in sections", async () => {
      const mockConfig = `
default_template: pr_feature.md
routes:
  feat/: pr_feature.md
`;

      const specialCharTemplate = `---
title: "Test"
---

## Linked issues & PRs

Content

## Changelog (Keep a Changelog)

Content`;

      readFileSpy.mockResolvedValueOnce(mockConfig);
      readFileSpy.mockResolvedValueOnce(specialCharTemplate);

      const result = await routePrTemplate({ branchType: "feat" });

      expect(result.valid).toBe(true);
      expect(result.metadata.sections).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/^Linked issues/),
          expect.stringMatching(/^Changelog/),
        ]),
      );
    });
  });

  describe("Integration", () => {
    test("should return all expected properties on success", async () => {
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

      readFileSpy.mockResolvedValueOnce(mockConfig);
      readFileSpy.mockResolvedValueOnce(mockTemplate);

      const result = await routePrTemplate({ branchType: "feat" });

      expect(result).toHaveProperty("valid", true);
      expect(result).toHaveProperty("branchType", "feat");
      expect(result).toHaveProperty("templateFile", "pr_feature.md");
      expect(result).toHaveProperty("templatePath");
      expect(result).toHaveProperty("content");
      expect(result).toHaveProperty("metadata");
      expect(result.metadata).toHaveProperty("sections");
      expect(result.metadata).toHaveProperty("requiredSections");
      expect(result.metadata).toHaveProperty("foundSections");
      expect(result.metadata).toHaveProperty("missingSections");
      expect(result.metadata).toHaveProperty("complete");
      expect(result.metadata).toHaveProperty("frontmatter");
      expect(result.metadata).toHaveProperty("contentLength");
      expect(result.metadata).toHaveProperty("lineCount");
    });

    test("should support all documented branch types", async () => {
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
  design/: pr_feature.md
  a11y/: pr_feature.md
  ux/: pr_feature.md
  release/: pr_release.md
  research/: pr_feature.md
  revert/: pr_chore.md
  i18n/: pr_feature.md
  ops/: pr_chore.md
`;

      const mockTemplate =
        "## Linked issues\n## Changelog\n## Checklist (Global DoD / PR)";

      const branchTypes = [
        "feat",
        "fix",
        "docs",
        "hotfix",
        "refactor",
        "chore",
        "ci",
        "test",
        "security",
      ];

      for (const branchType of branchTypes) {
        readFileSpy.mockResolvedValueOnce(mockConfig);
        readFileSpy.mockResolvedValueOnce(mockTemplate);

        const result = await routePrTemplate({ branchType });

        expect(result.valid).toBe(true);
        expect(result.branchType).toBe(branchType);
      }
    });
  });
});

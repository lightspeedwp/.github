import { jest } from "@jest/globals";
import path from "path";

// Get repo root - tests are in agents/pr-creation-agent/__tests__/unit/
// Need to go up to repo root at process.cwd()
const repoRoot = process.cwd();

let routePrTemplate;

beforeAll(async () => {
  const module = await import("../../skills/route-pr-template.js");
  routePrTemplate = module.routePrTemplate;
});

describe("routePrTemplate", () => {
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

  describe("Config Loading and Template Routing", () => {
    test("should route feat branch to pr_feature.md", async () => {
      const result = await routePrTemplate({
        branchType: "feat",
        configPath: path.join(
          repoRoot,
          ".github/PULL_REQUEST_TEMPLATE/config.yml",
        ),
        templateDir: path.join(repoRoot, ".github/PULL_REQUEST_TEMPLATE"),
      });

      expect(result.valid).toBe(true);
      expect(result.branchType).toBe("feat");
      expect(result.templateFile).toBe("pr_feature.md");
    });

    test("should route fix branch to pr_bug.md", async () => {
      const result = await routePrTemplate({
        branchType: "fix",
        configPath: path.join(
          repoRoot,
          ".github/PULL_REQUEST_TEMPLATE/config.yml",
        ),
        templateDir: path.join(repoRoot, ".github/PULL_REQUEST_TEMPLATE"),
      });

      expect(result.valid).toBe(true);
      expect(result.templateFile).toBe("pr_bug.md");
    });

    test("should route docs branch to pr_docs.md", async () => {
      const result = await routePrTemplate({
        branchType: "docs",
        configPath: path.join(
          repoRoot,
          ".github/PULL_REQUEST_TEMPLATE/config.yml",
        ),
        templateDir: path.join(repoRoot, ".github/PULL_REQUEST_TEMPLATE"),
      });

      expect(result.valid).toBe(true);
      expect(result.templateFile).toBe("pr_docs.md");
    });

    test("should use default template for unknown branch type", async () => {
      const result = await routePrTemplate({
        branchType: "unknown-type",
        configPath: path.join(
          repoRoot,
          ".github/PULL_REQUEST_TEMPLATE/config.yml",
        ),
        templateDir: path.join(repoRoot, ".github/PULL_REQUEST_TEMPLATE"),
      });

      expect(result.valid).toBe(true);
      expect(result.templateFile).toBe("pr_feature.md");
    });

    test("should route hotfix branch to pr_hotfix.md", async () => {
      const result = await routePrTemplate({
        branchType: "hotfix",
        configPath: path.join(
          repoRoot,
          ".github/PULL_REQUEST_TEMPLATE/config.yml",
        ),
        templateDir: path.join(repoRoot, ".github/PULL_REQUEST_TEMPLATE"),
      });

      expect(result.valid).toBe(true);
      expect(result.templateFile).toBe("pr_hotfix.md");
    });

    test("should route security branch to pr_bug.md", async () => {
      const result = await routePrTemplate({
        branchType: "security",
        configPath: path.join(
          repoRoot,
          ".github/PULL_REQUEST_TEMPLATE/config.yml",
        ),
        templateDir: path.join(repoRoot, ".github/PULL_REQUEST_TEMPLATE"),
      });

      expect(result.valid).toBe(true);
      expect(result.templateFile).toBe("pr_bug.md");
    });
  });

  describe("Template Content Reading", () => {
    test("should read and return template content", async () => {
      const result = await routePrTemplate({
        branchType: "feat",
        configPath: path.join(
          repoRoot,
          ".github/PULL_REQUEST_TEMPLATE/config.yml",
        ),
        templateDir: path.join(repoRoot, ".github/PULL_REQUEST_TEMPLATE"),
      });

      expect(result.valid).toBe(true);
      expect(result.content).toBeDefined();
      expect(typeof result.content).toBe("string");
      expect(result.content.length).toBeGreaterThan(0);
    });

    test("should include template body after frontmatter", async () => {
      const result = await routePrTemplate({
        branchType: "feat",
        configPath: path.join(
          repoRoot,
          ".github/PULL_REQUEST_TEMPLATE/config.yml",
        ),
        templateDir: path.join(repoRoot, ".github/PULL_REQUEST_TEMPLATE"),
      });

      expect(result.valid).toBe(true);
      expect(result.content).toContain("##");
    });
  });

  describe("Metadata Extraction", () => {
    test("should extract metadata from template", async () => {
      const result = await routePrTemplate({
        branchType: "feat",
        configPath: path.join(
          repoRoot,
          ".github/PULL_REQUEST_TEMPLATE/config.yml",
        ),
        templateDir: path.join(repoRoot, ".github/PULL_REQUEST_TEMPLATE"),
      });

      expect(result.valid).toBe(true);
      expect(result.metadata).toBeDefined();
      expect(result.metadata.templateFile).toBe("pr_feature.md");
      expect(result.metadata).toHaveProperty("sections");
      expect(result.metadata).toHaveProperty("requiredSections");
      expect(result.metadata).toHaveProperty("foundSections");
      expect(result.metadata).toHaveProperty("missingSections");
      expect(result.metadata).toHaveProperty("complete");
      expect(result.metadata).toHaveProperty("frontmatter");
      expect(result.metadata).toHaveProperty("contentLength");
      expect(result.metadata).toHaveProperty("lineCount");
    });

    test("should identify required sections in template", async () => {
      const result = await routePrTemplate({
        branchType: "feat",
        configPath: path.join(
          repoRoot,
          ".github/PULL_REQUEST_TEMPLATE/config.yml",
        ),
        templateDir: path.join(repoRoot, ".github/PULL_REQUEST_TEMPLATE"),
      });

      expect(result.valid).toBe(true);
      expect(result.metadata.requiredSections).toContain("Linked issues");
      expect(result.metadata.requiredSections).toContain("Changelog");
      expect(result.metadata.requiredSections).toContain(
        "Checklist (Global DoD / PR)",
      );
    });

    test("should report metadata statistics", async () => {
      const result = await routePrTemplate({
        branchType: "feat",
        configPath: path.join(
          repoRoot,
          ".github/PULL_REQUEST_TEMPLATE/config.yml",
        ),
        templateDir: path.join(repoRoot, ".github/PULL_REQUEST_TEMPLATE"),
      });

      expect(result.valid).toBe(true);
      expect(result.metadata.contentLength).toBeGreaterThan(0);
      expect(result.metadata.lineCount).toBeGreaterThan(0);
    });
  });

  describe("Response Structure", () => {
    test("should return expected properties on success", async () => {
      const result = await routePrTemplate({
        branchType: "feat",
        configPath: path.join(
          repoRoot,
          ".github/PULL_REQUEST_TEMPLATE/config.yml",
        ),
        templateDir: path.join(repoRoot, ".github/PULL_REQUEST_TEMPLATE"),
      });

      expect(result).toHaveProperty("valid");
      expect(result).toHaveProperty("branchType");
      expect(result).toHaveProperty("templateFile");
      expect(result).toHaveProperty("templatePath");
      expect(result).toHaveProperty("content");
      expect(result).toHaveProperty("metadata");
    });

    test("should return consistent error structure", async () => {
      const result = await routePrTemplate({ branchType: null });

      expect(result).toHaveProperty("valid", false);
      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("templateFile");
      expect(result).toHaveProperty("templatePath");
      expect(result).toHaveProperty("content");
      expect(result).toHaveProperty("metadata");
    });
  });

  describe("Integration - All Supported Branch Types", () => {
    const supportedTypes = [
      "feat",
      "fix",
      "hotfix",
      "refactor",
      "chore",
      "docs",
      "test",
      "perf",
      "ci",
      "build",
      "deps",
      "security",
      "design",
      "a11y",
      "ux",
      "release",
      "research",
      "revert",
      "i18n",
      "ops",
    ];

    supportedTypes.forEach((branchType) => {
      test(`should route ${branchType} to correct template`, async () => {
        const result = await routePrTemplate({
          branchType,
          configPath: path.join(
            repoRoot,
            ".github/PULL_REQUEST_TEMPLATE/config.yml",
          ),
          templateDir: path.join(repoRoot, ".github/PULL_REQUEST_TEMPLATE"),
        });

        expect(result.valid).toBe(true);
        expect(result.branchType).toBe(branchType);
        expect(result.templateFile).toBeTruthy();
        expect(result.templateFile.endsWith(".md")).toBe(true);
      });
    });
  });
});

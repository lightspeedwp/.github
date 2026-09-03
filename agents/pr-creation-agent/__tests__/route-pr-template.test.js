import { routePrTemplate } from "../skills/route-pr-template.js";

describe("routePrTemplate", () => {
  test("returns user override when provided", async () => {
    const result = await routePrTemplate({
      branchType: "feat",
      userSelectedTemplate: "pr_custom.md",
    });

    expect(result).toEqual({
      routed: true,
      template: "pr_custom.md",
      reason: "user-override",
      userOverride: true,
      fallback: false,
    });
  });

  test("routes recognised branch types to mapped templates", async () => {
    await expect(
      routePrTemplate({ branchType: "feat" }),
    ).resolves.toMatchObject({
      routed: true,
      template: "pr_feature.md",
      reason: "feat-type-matched",
      fallback: false,
    });

    await expect(routePrTemplate({ branchType: "fix" })).resolves.toMatchObject(
      {
        routed: true,
        template: "pr_bug.md",
        reason: "fix-type-matched",
        fallback: false,
      },
    );

    await expect(
      routePrTemplate({ branchType: "docs" }),
    ).resolves.toMatchObject({
      routed: true,
      template: "pr_docs.md",
      reason: "docs-type-matched",
      fallback: false,
    });
  });

  test("extracts branch type from branch name when branchType is absent", async () => {
    const result = await routePrTemplate({
      branchName: "hotfix/fix-critical-bug",
    });

    expect(result).toMatchObject({
      routed: true,
      template: "pr_hotfix.md",
      reason: "hotfix-type-matched",
      fallback: false,
    });
  });

  test("falls back when input branch type is invalid", async () => {
    const result = await routePrTemplate({ branchType: null });

    expect(result).toMatchObject({
      routed: false,
      template: "pull_request_template.md",
      reason: "invalid-input",
      fallback: true,
    });
    expect(result.warning).toContain("Branch type is required");
  });

  test("returns a consistent fallback object shape for invalid input", async () => {
    const result = await routePrTemplate({});

    expect(result).toEqual(
      expect.objectContaining({
        routed: false,
        template: "pull_request_template.md",
        reason: "invalid-input",
        fallback: true,
      }),
    );
    expect(result).toHaveProperty("warning");
  });

  test("falls back when branch type is unknown", async () => {
    const result = await routePrTemplate({ branchType: "unknown" });

    expect(result).toMatchObject({
      routed: false,
      template: "pull_request_template.md",
      reason: "unknown-branch-type",
      fallback: true,
    });
    expect(result.warning).toContain(
      "No template found for branch type 'unknown'",
    );
  });

  test("supports documented aliases", async () => {
    await expect(
      routePrTemplate({ branchType: "test" }),
    ).resolves.toMatchObject({
      routed: true,
      template: "pr_chore.md",
      reason: "test-type-matched",
      fallback: false,
    });

    await expect(
      routePrTemplate({ branchType: "security" }),
    ).resolves.toMatchObject({
      routed: true,
      template: "pr_bug.md",
      reason: "security-type-matched",
      fallback: false,
    });
  });

  describe("all nine templates", () => {
    const templateMappings = [
      {
        branchType: "feat",
        template: "pr_feature.md",
        example: "feat/new-user-auth",
      },
      {
        branchType: "fix",
        template: "pr_bug.md",
        example: "fix/validation-error",
      },
      {
        branchType: "chore",
        template: "pr_chore.md",
        example: "chore/deps-update",
      },
      {
        branchType: "ci",
        template: "pr_ci.md",
        example: "ci/github-workflows",
      },
      {
        branchType: "docs",
        template: "pr_docs.md",
        example: "docs/api-reference",
      },
      {
        branchType: "hotfix",
        template: "pr_hotfix.md",
        example: "hotfix/critical-bug",
      },
      {
        branchType: "refactor",
        template: "pr_refactor.md",
        example: "refactor/code-cleanup",
      },
      {
        branchType: "deps",
        template: "pr_dep_update.md",
        example: "deps/npm-upgrade",
      },
      {
        branchType: "release",
        template: "pr_release.md",
        example: "release/v1-0-0",
      },
    ];

    templateMappings.forEach(({ branchType, template, example }) => {
      test(`routes ${branchType}/ branches to ${template}`, async () => {
        const result = await routePrTemplate({ branchType });
        expect(result).toMatchObject({
          routed: true,
          template,
          fallback: false,
        });
      });

      test(`extracts type from example branch ${example} and routes to ${template}`, async () => {
        const result = await routePrTemplate({ branchName: example });
        expect(result).toMatchObject({
          routed: true,
          template,
          fallback: false,
        });
      });
    });
  });

  describe("forbidden branch prefixes fallback handling", () => {
    test("rejects unknown branch type (claude) and uses default fallback", async () => {
      const result = await routePrTemplate({
        branchName: "claude/governance-implementation",
      });

      expect(result).toMatchObject({
        routed: false,
        template: "pull_request_template.md",
        fallback: true,
        warning: expect.stringContaining("claude"),
      });
    });

    test("rejects copilot/ prefix as unknown type and uses fallback", async () => {
      const result = await routePrTemplate({
        branchName: "copilot/new-integration",
      });

      expect(result).toMatchObject({
        routed: false,
        template: "pull_request_template.md",
        fallback: true,
      });
    });

    test("rejects openai/ prefix as unknown type and uses fallback", async () => {
      const result = await routePrTemplate({
        branchName: "openai/my-feature",
      });

      expect(result).toMatchObject({
        routed: false,
        template: "pull_request_template.md",
        fallback: true,
      });
    });
  });

  describe("comprehensive branch type coverage (30+ types)", () => {
    const allBranchTypesAndTemplates = [
      // Core types
      { type: "feat", template: "pr_feature.md" },
      { type: "fix", template: "pr_bug.md" },
      { type: "hotfix", template: "pr_hotfix.md" },
      { type: "chore", template: "pr_chore.md" },
      { type: "docs", template: "pr_docs.md" },
      { type: "ci", template: "pr_ci.md" },
      { type: "refactor", template: "pr_refactor.md" },
      { type: "deps", template: "pr_dep_update.md" },
      { type: "release", template: "pr_release.md" },
      // Extended types
      { type: "test", template: "pr_chore.md" },
      { type: "security", template: "pr_bug.md" },
      { type: "perf", template: "pr_feature.md" },
      { type: "build", template: "pr_ci.md" },
      { type: "revert", template: "pr_chore.md" },
      { type: "research", template: "pr_feature.md" },
      { type: "design", template: "pr_feature.md" },
      { type: "a11y", template: "pr_feature.md" },
      { type: "ux", template: "pr_feature.md" },
      { type: "i18n", template: "pr_feature.md" },
      { type: "ops", template: "pr_chore.md" },
      { type: "proto", template: "pr_feature.md" },
      { type: "ds", template: "pr_feature.md" },
      { type: "api", template: "pr_feature.md" },
      { type: "schema", template: "pr_feature.md" },
      { type: "telemetry", template: "pr_feature.md" },
      { type: "content", template: "pr_docs.md" },
      { type: "seo", template: "pr_docs.md" },
      { type: "config", template: "pr_chore.md" },
      { type: "migrate", template: "pr_chore.md" },
      { type: "qa", template: "pr_chore.md" },
      { type: "uat", template: "pr_chore.md" },
      { type: "audit", template: "pr_chore.md" },
      { type: "codex", template: "pr_feature.md" },
    ];

    test(`should map all ${allBranchTypesAndTemplates.length} types correctly`, () => {
      expect(allBranchTypesAndTemplates.length).toBeGreaterThanOrEqual(33);
    });

    allBranchTypesAndTemplates.forEach(({ type, template }) => {
      test(`correctly routes ${type} to ${template}`, async () => {
        const result = await routePrTemplate({ branchType: type });
        expect(result.template).toBe(template);
        expect(result.routed).toBe(true);
      });
    });
  });

  describe("error handling and validation", () => {
    test("handles empty branchType gracefully", async () => {
      const result = await routePrTemplate({ branchType: "" });
      expect(result.fallback).toBe(true);
      expect(result.template).toBe("pull_request_template.md");
    });

    test("handles empty branch name gracefully", async () => {
      const result = await routePrTemplate({ branchName: "" });
      expect(result.fallback).toBe(true);
      expect(result.template).toBe("pull_request_template.md");
    });

    test("handles non-string branch type", async () => {
      const result = await routePrTemplate({
        branchType: 123,
      });
      expect(result.fallback).toBe(true);
      expect(result.template).toBe("pull_request_template.md");
    });

    test("handles branch name without forward slash", async () => {
      const result = await routePrTemplate({
        branchName: "invalidbranch",
      });
      expect(result.fallback).toBe(true);
      expect(result.template).toBe("pull_request_template.md");
    });
  });
});

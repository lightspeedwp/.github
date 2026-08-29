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
});

const {
  ALLOWED_PREFIXES,
  BOT_PREFIXES,
  PROTECTED_BRANCHES,
  isAllowed,
  checkBaseBranch,
  checkBranchReuse,
} = require("../validate-branch-name");

describe("validate-branch-name", () => {
  describe("isAllowed", () => {
    it("accepts protected branches (main, develop)", () => {
      expect(isAllowed("main")).toBe(true);
      expect(isAllowed("develop")).toBe(true);
    });

    it("accepts bot-generated branches", () => {
      expect(isAllowed("dependabot/npm_and_yarn/lodash-4.17.21")).toBe(true);
      expect(isAllowed("renovate/eslint-9.x")).toBe(true);
    });

    it("accepts all valid prefix/slug combinations", () => {
      const validBranches = [
        "feat/add-login-page",
        "fix/header-alignment",
        "hotfix/critical-security-patch",
        "release/v1.2.0",
        "refactor/extract-utils",
        "chore/update-deps",
        "docs/readme-overhaul",
        "test/unit-coverage",
        "perf/lazy-load-images",
        "ci/github-actions-upgrade",
        "build/webpack-config",
        "deps/bump-react",
        "security/xss-prevention",
        "revert/rollback-feature",
        "research/ai-tooling",
        "design/new-brand-colours",
        "a11y/screen-reader-labels",
        "ux/onboarding-flow",
        "i18n/french-translations",
        "ops/branch-governance-guardrails",
        "proto/experimental-api",
        "ds/design-tokens",
        "api/rest-endpoints",
        "schema/frontmatter-update",
        "telemetry/analytics-events",
        "content/blog-posts",
        "seo/meta-tags",
        "config/eslint-rules",
        "migrate/legacy-data",
        "qa/smoke-tests",
        "uat/user-acceptance",
        "codex/agent-prompts",
      ];

      validBranches.forEach((branch) => {
        expect(isAllowed(branch)).toBe(true);
      });
    });

    it("accepts slugs with hyphens (kebab-case)", () => {
      expect(isAllowed("feat/my-feature")).toBe(true);
      expect(isAllowed("fix/v2-1-0-patch")).toBe(true);
      expect(isAllowed("chore/update-deps-2025")).toBe(true);
    });

    it("rejects slugs with dots and underscores", () => {
      expect(isAllowed("feat/my_feature")).toBe(false);
      expect(isAllowed("fix/v2.1.0-patch")).toBe(false);
      expect(isAllowed("chore/update_deps-2025")).toBe(false);
    });

    it("rejects the forbidden claude/ prefix", () => {
      expect(isAllowed("claude/some-task")).toBe(false);
    });

    it("rejects branches with no prefix separator", () => {
      expect(isAllowed("my-branch-name")).toBe(false);
      expect(isAllowed("featadd-login")).toBe(false);
    });

    it("rejects branches with unknown prefixes", () => {
      expect(isAllowed("wip/experiment")).toBe(false);
      expect(isAllowed("temp/scratch-work")).toBe(false);
      expect(isAllowed("user/john-feature")).toBe(false);
    });

    it("rejects empty or whitespace-only branch names", () => {
      expect(isAllowed("")).toBe(false);
      expect(isAllowed("  ")).toBe(false);
    });

    it("rejects branches with trailing slash and no slug", () => {
      expect(isAllowed("feat/")).toBe(false);
    });

    it("rejects branches with nested slashes", () => {
      expect(isAllowed("feat/scope/sub-scope")).toBe(false);
    });
  });

  describe("checkBaseBranch", () => {
    it("returns valid when no base branch is provided", () => {
      const result = checkBaseBranch("feat/some-feature", "");

      expect(result.valid).toBe(true);
    });

    it("allows release/* branches to target main", () => {
      const result = checkBaseBranch("release/v1.5.0", "main");

      expect(result.valid).toBe(true);
    });

    it("allows hotfix/* branches to target main", () => {
      const result = checkBaseBranch("hotfix/critical-fix", "main");

      expect(result.valid).toBe(true);
    });

    it("allows protected branches to target main", () => {
      const result = checkBaseBranch("develop", "main");

      expect(result.valid).toBe(true);
    });

    it("allows bot branches to target main", () => {
      const result = checkBaseBranch(
        "dependabot/npm_and_yarn/lodash-4.17.21",
        "main",
      );

      expect(result.valid).toBe(true);
    });

    it("rejects feature branches targeting main", () => {
      const result = checkBaseBranch("feat/new-widget", "main");

      expect(result.valid).toBe(false);
      expect(result.message).toContain("Policy Violation");
      expect(result.message).toContain("release/*");
      expect(result.message).toContain("hotfix/*");
    });

    it("rejects fix branches targeting main", () => {
      const result = checkBaseBranch("fix/typo-correction", "main");

      expect(result.valid).toBe(false);
      expect(result.message).toContain("Policy Violation");
    });

    it("rejects docs branches targeting main", () => {
      const result = checkBaseBranch("docs/update-readme", "main");

      expect(result.valid).toBe(false);
    });

    it("rejects chore branches targeting main", () => {
      const result = checkBaseBranch("chore/cleanup-deps", "main");

      expect(result.valid).toBe(false);
    });

    it("rejects main merging back into develop", () => {
      const result = checkBaseBranch("main", "develop");

      expect(result.valid).toBe(false);
      expect(result.message).toContain("Policy Violation");
      expect(result.message).toContain("main");
    });

    it("allows feature branches to target develop", () => {
      const result = checkBaseBranch("feat/add-tests", "develop");

      expect(result.valid).toBe(true);
    });

    it("allows fix branches to target develop", () => {
      const result = checkBaseBranch("fix/broken-ci", "develop");

      expect(result.valid).toBe(true);
    });

    it("allows any branch to target an arbitrary base", () => {
      const result = checkBaseBranch("feat/new-thing", "staging");

      expect(result.valid).toBe(true);
    });
  });

  describe("checkBranchReuse", () => {
    it("skips reuse check for protected branches", () => {
      const result = checkBranchReuse("main");

      expect(result.reused).toBe(false);
    });

    it("skips reuse check for develop", () => {
      const result = checkBranchReuse("develop");

      expect(result.reused).toBe(false);
    });

    it("skips reuse check for bot branches", () => {
      const result = checkBranchReuse("dependabot/npm_and_yarn/eslint-9.0.0");

      expect(result.reused).toBe(false);
    });

    it("skips reuse check for renovate branches", () => {
      const result = checkBranchReuse("renovate/typescript-5.x");

      expect(result.reused).toBe(false);
    });

    it("returns not-reused for a fresh branch name", () => {
      // A branch name unlikely to appear in git log or CHANGELOG.md
      const result = checkBranchReuse(
        `feat/test-unique-${Date.now()}-${Math.random()}`,
      );

      expect(result.reused).toBe(false);
    });
  });

  describe("ALLOWED_PREFIXES", () => {
    it("contains the core required prefixes", () => {
      const corePrefixes = [
        "feat",
        "fix",
        "hotfix",
        "release",
        "refactor",
        "chore",
        "docs",
        "test",
        "perf",
        "ci",
        "build",
        "deps",
        "security",
        "revert",
      ];

      corePrefixes.forEach((prefix) => {
        expect(ALLOWED_PREFIXES).toContain(prefix);
      });
    });

    it("does not contain claude as an allowed prefix", () => {
      expect(ALLOWED_PREFIXES).not.toContain("claude");
    });
  });

  describe("PROTECTED_BRANCHES", () => {
    it("includes main and develop", () => {
      expect(PROTECTED_BRANCHES.has("main")).toBe(true);
      expect(PROTECTED_BRANCHES.has("develop")).toBe(true);
    });

    it("does not include arbitrary branches", () => {
      expect(PROTECTED_BRANCHES.has("staging")).toBe(false);
      expect(PROTECTED_BRANCHES.has("release")).toBe(false);
    });
  });

  describe("BOT_PREFIXES", () => {
    it("matches dependabot branches", () => {
      expect(BOT_PREFIXES.test("dependabot/npm/lodash")).toBe(true);
    });

    it("matches renovate branches", () => {
      expect(BOT_PREFIXES.test("renovate/react-19")).toBe(true);
    });

    it("does not match non-bot branches", () => {
      expect(BOT_PREFIXES.test("feat/something")).toBe(false);
      expect(BOT_PREFIXES.test("dependabotx/fake")).toBe(false);
    });
  });
});

/**
 * Jest suite for validate-main-branch-pr.cjs — the main-branch-guard script
 * that enforces release/* and hotfix/* branch naming and PR body shape.
 * @see ../validate-main-branch-pr.cjs
 */
const path = require("path");

const {
  normaliseBranchName,
  extractReleaseVersion,
  isReleaseBranch,
  isHotfixBranch,
  isAllowedBranch,
  validatePullRequestMetadata,
} = require(path.join(__dirname, "../validate-main-branch-pr.cjs"));

// ---------------------------------------------------------------------------
// normaliseBranchName
// ---------------------------------------------------------------------------

describe("normaliseBranchName", () => {
  test("strips refs/heads/ prefix", () => {
    expect(normaliseBranchName("refs/heads/main")).toBe("main");
  });

  test("leaves plain branch names unchanged", () => {
    expect(normaliseBranchName("release/v1.2.3")).toBe("release/v1.2.3");
  });

  test("trims surrounding whitespace", () => {
    expect(normaliseBranchName("  develop  ")).toBe("develop");
  });

  test("handles null/undefined gracefully", () => {
    expect(normaliseBranchName(null)).toBe("");
    expect(normaliseBranchName(undefined)).toBe("");
  });
});

// ---------------------------------------------------------------------------
// extractReleaseVersion
// ---------------------------------------------------------------------------

describe("extractReleaseVersion", () => {
  test("extracts version from release/vX.Y.Z", () => {
    expect(extractReleaseVersion("release/v1.2.3")).toBe("1.2.3");
    expect(extractReleaseVersion("release/v0.6.0")).toBe("0.6.0");
    expect(extractReleaseVersion("release/v10.20.30")).toBe("10.20.30");
  });

  test("extracts pre-release version", () => {
    expect(extractReleaseVersion("release/v1.0.0-rc.1")).toBe("1.0.0-rc.1");
  });

  test("returns null for non-release branches", () => {
    expect(extractReleaseVersion("main")).toBeNull();
    expect(extractReleaseVersion("hotfix/some-fix")).toBeNull();
    expect(extractReleaseVersion("feat/new-thing")).toBeNull();
  });

  test("returns null for release/ without vX.Y.Z format", () => {
    expect(extractReleaseVersion("release/my-release")).toBeNull();
    expect(extractReleaseVersion("release/v1.2")).toBeNull();
  });

  test("strips refs/heads/ prefix before matching", () => {
    expect(extractReleaseVersion("refs/heads/release/v2.0.0")).toBe("2.0.0");
  });
});

// ---------------------------------------------------------------------------
// isReleaseBranch
// ---------------------------------------------------------------------------

describe("isReleaseBranch", () => {
  test("accepts release/vX.Y.Z", () => {
    expect(isReleaseBranch("release/v1.2.3")).toBe(true);
    expect(isReleaseBranch("release/v0.6.0")).toBe(true);
  });

  test("rejects release/ without semver format", () => {
    expect(isReleaseBranch("release/my-release")).toBe(false);
    expect(isReleaseBranch("release/v1.2")).toBe(false);
  });

  test("rejects non-release branch names", () => {
    expect(isReleaseBranch("main")).toBe(false);
    expect(isReleaseBranch("develop")).toBe(false);
    expect(isReleaseBranch("feat/new-feature")).toBe(false);
    expect(isReleaseBranch("hotfix/urgent-fix")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isHotfixBranch
// ---------------------------------------------------------------------------

describe("isHotfixBranch", () => {
  test("accepts hotfix/<slug>", () => {
    expect(isHotfixBranch("hotfix/critical-fix")).toBe(true);
    expect(isHotfixBranch("hotfix/urgent-security-patch")).toBe(true);
    expect(isHotfixBranch("hotfix/fix-123")).toBe(true);
  });

  test("rejects non-hotfix branches", () => {
    expect(isHotfixBranch("main")).toBe(false);
    expect(isHotfixBranch("develop")).toBe(false);
    expect(isHotfixBranch("release/v1.2.3")).toBe(false);
    expect(isHotfixBranch("fix/something")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isAllowedBranch
// ---------------------------------------------------------------------------

describe("isAllowedBranch", () => {
  test("allows release branches", () => {
    expect(isAllowedBranch("release/v1.0.0")).toBe(true);
  });

  test("allows hotfix branches", () => {
    expect(isAllowedBranch("hotfix/some-fix")).toBe(true);
  });

  test("blocks all other branch types", () => {
    expect(isAllowedBranch("main")).toBe(false);
    expect(isAllowedBranch("develop")).toBe(false);
    expect(isAllowedBranch("feat/new-feature")).toBe(false);
    expect(isAllowedBranch("fix/bug")).toBe(false);
    expect(isAllowedBranch("chore/update-deps")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// validatePullRequestMetadata — release branch
// ---------------------------------------------------------------------------

describe("validatePullRequestMetadata (release branch)", () => {
  const validBody = `## Linked issues & merged PRs

Closes #1

## Changelog

See CHANGELOG.md

### Checklist (Global DoD / PR)

- [x] Done
`;

  test("passes for a valid release PR", () => {
    const pr = {
      draft: false,
      title: "chore(release): v1.2.3",
      body: validBody,
    };
    const findings = validatePullRequestMetadata(pr, "release/v1.2.3");
    expect(findings).toHaveLength(0);
  });

  test("fails when PR title does not match expected format", () => {
    const pr = {
      draft: false,
      title: "Release 1.2.3",
      body: validBody,
    };
    const findings = validatePullRequestMetadata(pr, "release/v1.2.3");
    expect(findings.some((f) => /title/i.test(f))).toBe(true);
  });

  test("fails when PR is a draft", () => {
    const pr = {
      draft: true,
      title: "chore(release): v1.2.3",
      body: validBody,
    };
    const findings = validatePullRequestMetadata(pr, "release/v1.2.3");
    expect(findings.some((f) => /ready for review/i.test(f))).toBe(true);
  });

  test("fails when Linked issues section is missing", () => {
    const body = `## Changelog\n\nSee CHANGELOG.md\n\n### Checklist (Global DoD / PR)\n\n- [x] Done\n`;
    const pr = { draft: false, title: "chore(release): v1.2.3", body };
    const findings = validatePullRequestMetadata(pr, "release/v1.2.3");
    expect(findings.some((f) => /Linked issues/i.test(f))).toBe(true);
  });

  test("fails when Changelog section is missing", () => {
    const body = `## Linked issues & merged PRs\n\nCloses #1\n\n### Checklist (Global DoD / PR)\n\n- [x] Done\n`;
    const pr = { draft: false, title: "chore(release): v1.2.3", body };
    const findings = validatePullRequestMetadata(pr, "release/v1.2.3");
    expect(findings.some((f) => /Changelog/i.test(f))).toBe(true);
  });

  test("fails when Checklist section is missing", () => {
    const body = `## Linked issues & merged PRs\n\nCloses #1\n\n## Changelog\n\nSee CHANGELOG.md\n`;
    const pr = { draft: false, title: "chore(release): v1.2.3", body };
    const findings = validatePullRequestMetadata(pr, "release/v1.2.3");
    expect(findings.some((f) => /Checklist/i.test(f))).toBe(true);
  });

  test("fails when release branch name doesn't match vX.Y.Z format", () => {
    const pr = {
      draft: false,
      title: "chore(release): v1.2.3",
      body: validBody,
    };
    const findings = validatePullRequestMetadata(pr, "release/my-release");
    expect(findings.some((f) => /release\/vX\.Y\.Z/i.test(f))).toBe(true);
  });

  test("fails when pull request payload is null", () => {
    const findings = validatePullRequestMetadata(null, "release/v1.2.3");
    expect(findings.some((f) => /Missing pull request/i.test(f))).toBe(true);
  });

  test("automated release PR body shape satisfies guard", () => {
    const today = new Date().toISOString().split("T")[0];
    const body = `## Linked issues & merged PRs\n\n<!-- Auto-generated -->\n\n## Changelog\n\nSee CHANGELOG.md for the [\`0.6.0\`] entry dated ${today}.\n\n### Checklist (Global DoD / PR)\n\n- [x] Release branch \`release/v0.6.0\` created from \`develop\`\n- [x] \`VERSION\` bumped to \`0.6.0\`\n`;
    const pr = { draft: false, title: "chore(release): v0.6.0", body };
    const findings = validatePullRequestMetadata(pr, "release/v0.6.0");
    expect(findings).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// validatePullRequestMetadata — hotfix branch
// ---------------------------------------------------------------------------

describe("validatePullRequestMetadata (hotfix branch)", () => {
  const validHotfixBody = `## Linked issues

Closes #2

## Incident / Root Cause

Server was down.

## Changelog

Applied patch.

### Checklist (Global DoD / PR)

- [x] Done
`;

  test("passes for a valid hotfix PR", () => {
    const pr = {
      draft: false,
      title: "hotfix: critical patch",
      body: validHotfixBody,
    };
    const findings = validatePullRequestMetadata(pr, "hotfix/critical-patch");
    expect(findings).toHaveLength(0);
  });

  test("fails when Incident / Root Cause section is missing", () => {
    const body = `## Linked issues\n\nCloses #2\n\n## Changelog\n\nPatch\n\n### Checklist (Global DoD / PR)\n\n- [x] Done\n`;
    const pr = { draft: false, title: "hotfix: fix", body };
    const findings = validatePullRequestMetadata(pr, "hotfix/fix");
    expect(findings.some((f) => /Incident/i.test(f))).toBe(true);
  });
});

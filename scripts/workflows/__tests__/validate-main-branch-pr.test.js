const {
  isAllowedBranch,
  extractReleaseVersion,
  isReleaseBranch,
  isHotfixBranch,
  normaliseBranchName,
  validatePullRequestMetadata,
} = require("../branch-policy/validate-main-branch-pr.cjs");

describe("validate-main-branch-pr", () => {
  it("allows release and hotfix branches", () => {
    expect(isAllowedBranch("release/v1.2.3")).toBe(true);
    expect(isAllowedBranch("hotfix/security-fix")).toBe(true);
  });

  it("rejects non-release branches", () => {
    expect(isAllowedBranch("fix/main-protection")).toBe(false);
    expect(isAllowedBranch("develop")).toBe(false);
    expect(isAllowedBranch("release/not-a-version")).toBe(false);
  });

  it("normalises refs/heads prefixes", () => {
    expect(normaliseBranchName("refs/heads/release/v1.2.3")).toBe(
      "release/v1.2.3",
    );
  });

  it("detects release and hotfix branch types", () => {
    expect(isReleaseBranch("release/v1.2.3")).toBe(true);
    expect(isReleaseBranch("hotfix/security-fix")).toBe(false);
    expect(isHotfixBranch("hotfix/security-fix")).toBe(true);
    expect(isHotfixBranch("release/v1.2.3")).toBe(false);
    expect(extractReleaseVersion("release/v1.2.3")).toBe("1.2.3");
  });

  it("validates release PR shape", () => {
    const findings = validatePullRequestMetadata(
      {
        title: "chore(release): v1.2.3",
        body: [
          "## Linked issues & merged PRs",
          "",
          "Includes:",
          "",
          "- PRs/Issues",
          "",
          "## Changelog",
          "",
          "### Added",
          "",
          "### Changed",
          "",
          "### Fixed",
          "",
          "### Removed",
          "",
          "### Checklist (Global DoD / PR)",
        ].join("\n"),
      },
      "release/v1.2.3",
    );

    expect(findings).toEqual([]);
  });

  it("rejects mismatched release PR titles and missing sections", () => {
    const findings = validatePullRequestMetadata(
      {
        title: "chore(release): v1.2.4",
        body: "## Changelog\n\n### Added\n- Example",
      },
      "release/v1.2.3",
    );

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          "Release PR title must be 'chore(release): v1.2.3'",
        ),
        expect.stringContaining(
          "Release PR body is missing required section(s): Linked issues & merged PRs, Checklist (Global DoD / PR).",
        ),
      ]),
    );
  });

  it("rejects invalid release branch shapes", () => {
    const findings = validatePullRequestMetadata(
      {
        title: "chore(release): v1.2.3",
        body: [
          "## Linked issues & merged PRs",
          "",
          "Includes:",
          "",
          "- PRs/Issues",
          "",
          "## Changelog",
          "",
          "### Added",
          "",
          "### Changed",
          "",
          "### Fixed",
          "",
          "### Removed",
          "",
          "### Checklist (Global DoD / PR)",
        ].join("\n"),
      },
      "release/next",
    );

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          "Release branches must use the form release/vX.Y.Z.",
        ),
      ]),
    );
  });

  it("requires hotfix PR body sections", () => {
    const findings = validatePullRequestMetadata(
      {
        title: "fix: urgent patch",
        body: "## Linked issues\n\nFixes #123",
      },
      "hotfix/security-fix",
    );

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          "Hotfix PR body is missing required section(s): Incident / Root Cause, Changelog, Checklist (Global DoD / PR).",
        ),
      ]),
    );
  });
});

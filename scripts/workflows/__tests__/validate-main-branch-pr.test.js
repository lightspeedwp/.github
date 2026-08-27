const {
  isAllowedBranch,
  normaliseBranchName,
} = require("../branch-policy/validate-main-branch-pr.cjs");

describe("validate-main-branch-pr", () => {
  it("allows release and hotfix branches", () => {
    expect(isAllowedBranch("release/v1.2.3")).toBe(true);
    expect(isAllowedBranch("hotfix/security-fix")).toBe(true);
  });

  it("rejects non-release branches", () => {
    expect(isAllowedBranch("fix/main-protection")).toBe(false);
    expect(isAllowedBranch("develop")).toBe(false);
  });

  it("normalises refs/heads prefixes", () => {
    expect(normaliseBranchName("refs/heads/release/v1.2.3")).toBe(
      "release/v1.2.3",
    );
  });
});

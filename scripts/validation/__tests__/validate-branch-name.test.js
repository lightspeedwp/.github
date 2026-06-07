/**
 * @jest-environment jsdom
 */

const { spawnSync } = require("child_process");
const path = require("path");

const scriptPath = path.join(__dirname, "../validate-branch-name.js");

function runValidator(branchName) {
  return spawnSync(process.execPath, [scriptPath, "--branch", branchName], {
    encoding: "utf8",
  });
}

describe("Branch name validation", () => {
  it("accepts temporary audit replay branches", () => {
    const result = runValidator("pr-895-audit");

    expect(result.status).toBe(0);
    expect(result.stdout).toContain(
      "matches the repository branching strategy",
    );
  });

  it("rejects malformed branch names", () => {
    const result = runValidator("audit-branch");

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("does not follow the required format");
  });
});

/**
 * Smoke test for the issue template label validator.
 */
const path = require("path");
const { execFileSync } = require("child_process");

describe("check-template-labels.js", () => {
  it("validates the current issue template frontmatter and mappings", () => {
    const scriptPath = path.join(__dirname, "../check-template-labels.js");
    const output = execFileSync(process.execPath, [scriptPath], {
      cwd: path.join(__dirname, "../../../.."),
      encoding: "utf8",
    });

    expect(output).toContain(
      "All template frontmatter, labels, and type mappings are valid.",
    );
  });
});

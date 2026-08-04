/**
 * @jest-environment jsdom
 */
/**
 * Jest suite verifying the baseline behaviour of `validate-frontmatter-alt.js`.
 * @see ../validate-frontmatter-alt.js
 */
const path = require("path");
const { execSync } = require("child_process");

describe("validate-frontmatter alt mode", () => {
  it("runs the alternate frontmatter validation stub", () => {
    const scriptPath = path.join(__dirname, "../validate-frontmatter.js");
    const output = execSync(`node ${scriptPath} --alt`, {
      encoding: "utf8",
      maxBuffer: 1024 * 1024,
    });

    expect(output).toMatch(/Alt frontmatter validation placeholder/);
    expect(output).toMatch(/Files discovered:/);
  });
});

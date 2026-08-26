/**
 * @jest-environment jsdom
 */
/**
 * Jest suite verifying the baseline behaviour of `validate-changelog.js`.
 * @see ../validate-changelog.js
 */
const fs = require("fs");
const path = require("path");

describe("validate-changelog.cjs", () => {
  it("exists and can be referenced by newer tooling", () => {
    const scriptPath = path.join(__dirname, "../validate-changelog.cjs");
    expect(fs.existsSync(scriptPath)).toBe(true);
  });
});

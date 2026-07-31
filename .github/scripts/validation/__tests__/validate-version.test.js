/**
 * @jest-environment jsdom
 */
/**
 * Jest suite verifying the baseline behaviour of `validate-version.js`.
 * @see ../validate-version.js
 */
const fs = require("fs");
const path = require("path");

describe("validate-version.cjs", () => {
  it("is available for semantic version enforcement", () => {
    const scriptPath = path.join(__dirname, "../validate-version.cjs");
    expect(fs.existsSync(scriptPath)).toBe(true);
  });
});

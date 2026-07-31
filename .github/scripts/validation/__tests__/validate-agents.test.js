/**
 * @jest-environment jsdom
 */
/**
 * Jest suite verifying the baseline behaviour of `validate-agents.js`.
 * @see ../validate-agents.js
 */
const fs = require("fs");
const path = require("path");

describe("validate-agents.js", () => {
  it("exists so tooling has an entry point", () => {
    const scriptPath = path.join(__dirname, "../validate-agents.js");
    expect(fs.existsSync(scriptPath)).toBe(true);
  });
});

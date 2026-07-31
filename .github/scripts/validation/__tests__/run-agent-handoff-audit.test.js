/**
 * @jest-environment jsdom
 */
/**
 * Jest suite verifying the baseline behaviour of `run-agent-handoff-audit.js`.
 * @see ../run-agent-handoff-audit.js
 */
const fs = require("fs");
const path = require("path");

describe("run-agent-handoff-audit.js", () => {
  it("exists in the validation folder", () => {
    const scriptPath = path.join(__dirname, "../run-agent-handoff-audit.js");
    expect(fs.existsSync(scriptPath)).toBe(true);
  });
});

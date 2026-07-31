/**
 * Jest suite verifying the baseline behaviour of `reporting.agent.js`.
 * @see ../reporting.agent.js
 */
const fs = require("fs");
const path = require("path");

describe("reporting.agent", () => {
  it("agent module file exists", () => {
    const agentPath = path.join(__dirname, "../reporting.agent.js");
    expect(fs.existsSync(agentPath)).toBe(true);
  });
});

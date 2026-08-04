/**
 * Jest suite verifying the baseline behaviour of `meta.agent.js`.
 */
const fs = require("fs");
const path = require("path");

describe("meta.agent", () => {
  it("agent module file exists", () => {
    const agentPath = path.join(__dirname, "../meta.agent.js");
    expect(fs.existsSync(agentPath)).toBe(true);
  });
});

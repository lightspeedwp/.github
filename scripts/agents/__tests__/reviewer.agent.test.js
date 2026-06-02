/**
 * Jest suite verifying the baseline behaviour of `reviewer.agent.js`.
 * @see ../reviewer.agent.js
 */
const fs = require("fs");
const path = require("path");

describe("reviewer.agent", () => {
  it("agent module file exists", () => {
    const agentPath = path.join(__dirname, "../reviewer.agent.js");
    expect(fs.existsSync(agentPath)).toBe(true);
  });
});

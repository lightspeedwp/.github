/**
 * Jest suite verifying the baseline behaviour of `labeling.agent.js`.
 * @see ../labeling.agent.js
 */
const fs = require("fs");
const path = require("path");

describe("labeling.agent", () => {
  it("agent module file exists", () => {
    const agentPath = path.join(__dirname, "../labeling.agent.js");
    expect(fs.existsSync(agentPath)).toBe(true);
  });
});

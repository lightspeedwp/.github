/**
 * Jest suite verifying the baseline behaviour of `template.agent.js`.
 * @see ../template.agent.js
 */
const fs = require("fs");
const path = require("path");

describe("template.agent", () => {
  it("agent module file exists", () => {
    const agentPath = path.join(__dirname, "../template.agent.js");
    expect(fs.existsSync(agentPath)).toBe(true);
  });
});

/**
 * Jest suite verifying the baseline behaviour of `issues.agent.js`.
 * @see ../issues.agent.js
 */
// Basic smoke test for issues.agent.js
const agent = require("../issues.agent.js");

describe("issues.agent", () => {
  it("should be defined", () => {
    expect(agent).toBeDefined();
  });
});

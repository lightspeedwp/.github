/**
 * Jest suite verifying the baseline behaviour of `issues.agent.cjs`.
 * @see ../issues.agent.cjs
 */
// Basic smoke test for issues.agent.cjs
const agent = require("../issues.agent.cjs");

describe("issues.agent", () => {
  it("should be defined", () => {
    expect(agent).toBeDefined();
  });
});

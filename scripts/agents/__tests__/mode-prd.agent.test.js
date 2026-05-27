/**
 * Jest suite verifying the baseline behaviour of `mode-prd.agent.js`.
 * @see ../mode-prd.agent.js
 */
// Basic smoke test for mode-prd.agent.js
const agent = require("../mode-prd.agent");

describe("mode-prd.agent", () => {
  it("should be defined", () => {
    expect(agent).toBeDefined();
  });
});

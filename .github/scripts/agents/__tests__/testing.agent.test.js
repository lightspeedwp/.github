/**
 * Jest suite verifying the baseline behaviour of `testing.agent.js`.
 * @see ../testing.agent.js
 */
// Basic smoke test for testing.agent.js
const agent = require("../testing.agent");

describe("testing.agent", () => {
  it("should be defined", () => {
    expect(agent).toBeDefined();
  });
});

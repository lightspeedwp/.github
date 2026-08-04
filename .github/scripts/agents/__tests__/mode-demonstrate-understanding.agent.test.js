/**
 * Jest suite verifying the baseline behaviour of `mode-demonstrate-understanding.agent.js`.
 * @see ../mode-demonstrate-understanding.agent.js
 */
// Basic smoke test for mode-demonstrate-understanding.agent.js
const agent = require("../mode-demonstrate-understanding.agent");

describe("mode-demonstrate-understanding.agent", () => {
  it("should be defined", () => {
    expect(agent).toBeDefined();
  });
});

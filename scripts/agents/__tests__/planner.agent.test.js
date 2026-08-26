/**
 * Jest suite verifying the baseline behaviour of `planner.agent.js`.
 * @see ../planner.agent.js
 */
// Basic smoke test for planner.agent.js
const agent = require("../planner.agent.js");

describe("planner.agent", () => {
  it("should be defined", () => {
    expect(agent).toBeDefined();
  });
});

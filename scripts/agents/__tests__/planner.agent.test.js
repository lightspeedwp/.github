/**
 * Jest suite verifying the baseline behaviour of `planner.agent.cjs`.
 * @see ../planner.agent.cjs
 */
// Basic smoke test for planner.agent.cjs
const agent = require("../planner.agent.cjs");

describe("planner.agent", () => {
  it("should be defined", () => {
    expect(agent).toBeDefined();
  });
});

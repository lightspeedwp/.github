/**
 * Jest suite verifying the baseline behaviour of `task-planner.agent.js`.
 * @see ../task-planner.agent.js
 */
// Basic smoke test for task-planner.agent.js
const agent = require("../task-planner.agent");

describe("task-planner.agent", () => {
  it("should be defined", () => {
    expect(agent).toBeDefined();
  });
});

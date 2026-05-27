/**
 * Jest suite verifying the baseline behaviour of `task-researcher.agent.js`.
 * @see ../task-researcher.agent.js
 */
// Basic smoke test for task-researcher.agent.js
const agent = require("../task-researcher.agent");

describe("task-researcher.agent", () => {
  it("should be defined", () => {
    expect(agent).toBeDefined();
  });
});

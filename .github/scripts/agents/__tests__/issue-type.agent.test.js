/**
 * Jest suite verifying the baseline behaviour of `issue-type.agent.js`.
 * @see ../issue-type.agent.js
 */
// Basic smoke test for issue-type.agent.js
const agent = require("../issue-type.agent.js");

describe("issue-type.agent", () => {
  it("should be defined", () => {
    expect(agent).toBeDefined();
  });
});

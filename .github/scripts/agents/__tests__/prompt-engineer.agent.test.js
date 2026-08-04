/**
 * Jest suite verifying the baseline behaviour of `prompt-engineer.agent.js`.
 * @see ../prompt-engineer.agent.js
 */
// Basic smoke test for prompt-engineer.agent.js
const agent = require("../prompt-engineer.agent");

describe("prompt-engineer.agent", () => {
  it("should be defined", () => {
    expect(agent).toBeDefined();
  });
});

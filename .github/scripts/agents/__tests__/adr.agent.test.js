/**
 * Jest suite verifying the baseline behaviour of `adr.agent.js`.
 * @see ../adr.agent.js
 */
// Basic smoke test for adr.agent.js
const agent = require("../adr.agent.js");

describe("adr.agent", () => {
  it("should be defined", () => {
    expect(agent).toBeDefined();
  });
});

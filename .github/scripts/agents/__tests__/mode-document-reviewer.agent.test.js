/**
 * Jest suite verifying the baseline behaviour of `mode-document-reviewer.agent.js`.
 * @see ../mode-document-reviewer.agent.js
 */
// Basic smoke test for mode-document-reviewer.agent.js
const agent = require("../mode-document-reviewer.agent");

describe("mode-document-reviewer.agent", () => {
  it("should be defined", () => {
    expect(agent).toBeDefined();
  });
});

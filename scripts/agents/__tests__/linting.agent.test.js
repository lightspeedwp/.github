/**
 * Jest suite verifying the baseline behaviour of `linting.agent.js`.
 * @see ../linting.agent.js
 */
// Basic smoke test for linting.agent.js
describe("linting.agent", () => {
  it("should be defined", async () => {
    const agent = await import("../linting.agent.js");
    expect(agent).toBeDefined();
  });
});

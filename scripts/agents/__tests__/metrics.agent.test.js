/**
 * Jest suite verifying the baseline behaviour of `metrics.agent.js`.
 * @see ../metrics.agent.js
 */
// Basic smoke test for metrics.agent.js
describe("metrics.agent", () => {
  it("should be defined", async () => {
    const agent = await import("../metrics.agent.js");
    expect(agent).toBeDefined();
  });
});

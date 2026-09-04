// TODO: Migrate to ESM (planner.agent.js) once ESM test infrastructure is ready
// This test suite is currently skipped while the planner agent is being refactored
// from CommonJS to ESM. Once planner.agent.js reaches feature parity with the old
// planner.agent.cjs implementation, this test should be rewritten for ESM.
// @see scripts/agents/planner.agent.js
// @see scripts/agents/__tests__/planner.agent.test.js

describe.skip("Planner Agent (ESM migration pending)", () => {
  it.skip("posts a checklist comment on PR", async () => {
    // TODO: Rewrite for ESM once planner.agent.js is fully implemented
  });
});

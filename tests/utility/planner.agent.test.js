/**
 * ============================================================================
 * Tests for planner.agent.js
 * Location: tests/utility/planner.agent.test.js
 * Description: Ensures planner agent posts checklist comments and handles dry-run logic.
 * Uses shared test helpers from tests/utility/test-helpers.js.
 * ============================================================================
 */

const {
    mockContext,
    mockPrPayload,
    expectDryRun,
    setTestEnv,
    resetTestEnv,
} = require('./test-helpers');
const { run } = require('../../.github/agents/planner.agent.js');

describe('Planner Agent', () => {
    beforeAll(() => setTestEnv({ GITHUB_TOKEN: 'test' }));
    afterAll(() => resetTestEnv(['GITHUB_TOKEN']));

    /**
     * Tests posting planner checklist comment on a PR.
     */
    test('posts planner checklist comment', async () => {
        const context = mockContext(mockPrPayload());
        // Simulate comment posting, verify via spies/mocks as needed.
        await run(context);
        // Optionally, capture comment body and use shared assertions.
    });

    /**
     * Tests planner agent dry-run logic.
     */
    test('dry-run logic', async () => {
        const context = mockContext({ ...mockPrPayload(), dryRun: true });
        await expectDryRun(run, context);
    });
});

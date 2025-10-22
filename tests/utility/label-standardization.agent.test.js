/**
 * ============================================================================
 * Tests for label-standardization.agent.js
 * Location: tests/utility/label-standardization.agent.test.js
 * Description: Ensures label standardization agent migrates non-standard labels, syncs with canonical, and posts reports.
 * Uses shared helpers from tests/utility/test-helpers.js.
 * ============================================================================
 */

const {
    mockOctokit,
    mockContext,
    expectMarkdownReport,
    setTestEnv,
    resetTestEnv,
    mockPrPayload,
    expectDryRun,
} = require('./test-helpers');
const { run } = require('../../.github/agents/label-standardization.agent.js');

describe('Label Standardization Agent', () => {
    beforeAll(() => setTestEnv({ GITHUB_TOKEN: 'test' }));
    afterAll(() => resetTestEnv(['GITHUB_TOKEN']));

    /**
     * Tests migration and reporting for a PR with non-standard labels.
     */
    test('migrates non-standard labels and posts report', async () => {
        const octokit = mockOctokit({
            rest: {
                issues: {
                    addLabels: jest.fn(),
                    createComment: jest.fn(),
                },
            },
        });
        const context = mockContext(
            mockPrPayload({ labels: ['bug', 'urgent'] })
        );
        await run(context);
        expect(octokit.rest.issues.addLabels).toHaveBeenCalled();
        expect(octokit.rest.issues.createComment).toHaveBeenCalled();
    });

    /**
     * Tests dry-run logic for the agent.
     */
    test('dry-run logic', async () => {
        const context = mockContext({ ...mockPrPayload(), dryRun: true });
        await expectDryRun(run, context);
    });
});

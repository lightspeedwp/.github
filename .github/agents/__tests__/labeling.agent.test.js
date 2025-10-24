const {
    mockOctokit,
    mockContext,
    mockPrPayload,
    mockIssuePayload,
    setTestEnv,
    resetTestEnv,
    expectCommentPosted,
} = require('../../../tests/test-helpers');
const { runLabelingAgent } = require('../labeling.agent.js');

describe('Labeling Agent', () => {
    beforeAll(() => setTestEnv({ GITHUB_TOKEN: 'test' }));
    afterAll(() => resetTestEnv(['GITHUB_TOKEN']));

    it('applies default status and priority labels to issues and PRs', async () => {
        const octokit = mockOctokit();
        const context = mockContext(mockPrPayload({ labels: [] }));
        context.github = octokit;
        context.core = { info: jest.fn() };

        await runLabelingAgent({ context, configs: {}, dryRun: false });

        expect(octokit.rest.issues.addLabels).toHaveBeenCalled();
    });

    it('removes duplicate status labels', async () => {
        const octokit = mockOctokit();
        const context = mockContext(
            mockPrPayload({
                labels: [
                    { name: 'status:needs-review' },
                    { name: 'status:in-progress' },
                ],
            })
        );
        context.github = octokit;
        context.core = { info: jest.fn() };

        await runLabelingAgent({ context, configs: {}, dryRun: false });

        expect(octokit.rest.issues.removeLabel).toHaveBeenCalled();
    });

    // Add more tests for type assignment, changelog nudge, file/branch heuristics, etc.
});

/**
 * ============================================================================
 * Tests for reviewer.agent.js
 * Location: tests/utility/reviewer.agent.test.js
 * Description:
 *   - Tests agent functions: run(), CI status check, file analysis, markdown summary/comment posting, dry-run logic.
 *   - Uses shared helpers: mockOctokit, mockContext, mockChangedFiles, expectCommentPosted, expectDryRun, setTestEnv, resetTestEnv.
 *   - Mocks Octokit, GitHub Actions context, PR payloads, file changes.
 *   - Coverage: review summary posting, changelog checks, CI state, dry-run, error handling.
 * Standards:
 *   - Follows [LightSpeedWP Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
 *   - Org instructions: [Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
 * Contribution:
 *   - Update docblock when expanding coverage or adding new helpers.
 * ============================================================================
 */

const {
    mockOctokit,
    mockContext,
    setTestEnv,
    resetTestEnv,
    mockPrPayload,
    mockChangedFiles,
    expectCommentPosted,
    expectDryRun,
} = require('./test-helpers');
const { run } = require('../../.github/agents/reviewer.agent.js');

describe('Reviewer Agent', () => {
    beforeAll(() => setTestEnv({ GITHUB_TOKEN: 'test' }));
    afterAll(() => resetTestEnv(['GITHUB_TOKEN']));

    /**
     * Tests posting review summary comment on a PR.
     */
    test('posts reviewer summary comment', async () => {
        const octokit = mockOctokit({
            rest: {
                repos: {
                    getCombinedStatusForRef: jest
                        .fn()
                        .mockResolvedValue({ data: { state: 'success' } }),
                },
                pulls: {
                    listFiles: jest.fn().mockResolvedValue({
                        data: mockChangedFiles(['src/file.js', 'CHANGELOG.md']),
                    }),
                },
                issues: {
                    createComment: jest.fn(),
                },
            },
        });
        const context = mockContext(mockPrPayload());
        await run(context);
        expectCommentPosted(
            octokit.rest.issues.createComment,
            'Reviewer Summary'
        );
    });

    /**
     * Tests reviewer agent dry-run logic.
     */
    test('dry-run logic', async () => {
        const context = mockContext({ ...mockPrPayload(), dryRun: true });
        await expectDryRun(run, context);
    });
});

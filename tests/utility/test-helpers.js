/**
 * ============================================================================
 * Shared Test Helpers for LightSpeedWP Agent & Utility Tests
 * Location: tests/utility/test-helpers.js
 * Description:
 *   - Provides mocks for Octokit, context, PR/Issue payloads, file changes, workflow events.
 *   - Contains reusable assertions (e.g. expectMarkdownReport, expectCommentPosted).
 *   - Includes dry-run helpers, env setup/teardown, custom Jest matchers.
 * Usage:
 *   - Import into any agent/utility test for consistent, DRY test code.
 *   - Document new helpers with JSDoc & update this summary.
 * Standards:
 *   - Follows org-wide [Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
 *   - Org instructions: [Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
 * Contribution:
 *   - Update docblock with every new helper or major change.
 *   - Encourage contributors to add and document new helpers.
 * ============================================================================
 */

/**
 * Creates a mock Octokit client with overridable methods.
 * Use for any agent or utility test needing GitHub API simulation.
 * @param {Object} overrides - Methods to override (rest.issues, rest.pulls, rest.repos, etc.).
 * @returns {Object} Mocked Octokit client.
 */
function mockOctokit(overrides = {}) {
    return {
        rest: {
            issues: {
                addLabels: jest.fn(),
                createComment: jest.fn(),
                listLabelsOnIssue: jest.fn(),
                ...((overrides.rest || {}).issues || {}),
            },
            pulls: {
                listFiles: jest.fn(),
                ...((overrides.rest || {}).pulls || {}),
            },
            repos: {
                getContent: jest.fn(),
                getCombinedStatusForRef: jest.fn(),
                ...((overrides.rest || {}).repos || {}),
            },
            ...overrides.rest,
        },
    };
}

/**
 * Creates a mock GitHub Actions context object.
 * Use for simulating workflow context in agent tests.
 * @param {Object} overrides - Properties to override.
 * @returns {Object} Mocked context object.
 */
function mockContext(overrides = {}) {
    return Object.assign(
        {
            repo: { owner: 'lightspeedwp', repo: 'repo' },
            payload: {},
            eventName: 'pull_request',
        },
        overrides
    );
}

/**
 * Asserts that a markdown report contains expected labels and report type.
 * Use for verifying agent reporting output.
 * @param {string} report - Markdown report string.
 * @param {string[]} expectedLabels - Array of expected label strings.
 */
function expectMarkdownReport(report, expectedLabels = []) {
    expectedLabels.forEach((label) => {
        expect(report).toContain(label);
    });
    expect(report).toMatch(
        /Auto-Labeling Report|Standardization Report|Reviewer Summary|Planner/
    );
}

/**
 * Mocks environment variables for a test.
 * Use for setting up required env vars (e.g. GITHUB_TOKEN).
 * @param {Object} envVars - Key-value pairs to set in process.env.
 */
function setTestEnv(envVars) {
    Object.entries(envVars).forEach(([key, value]) => {
        process.env[key] = value;
    });
}

/**
 * Resets environment variables after a test.
 * Use for cleaning up env after test runs.
 * @param {string[]} keys - Array of env var keys to delete.
 */
function resetTestEnv(keys) {
    keys.forEach((key) => {
        delete process.env[key];
    });
}

/**
 * Mocks a PR payload for context.
 * Use for simulating pull request events in agent tests.
 * @param {Object} overrides - Properties to override in the PR payload.
 * @returns {Object} Mocked PR payload.
 */
function mockPrPayload(overrides = {}) {
    return Object.assign(
        {
            pull_request: {
                number: 1,
                title: 'Test PR',
                head: { sha: 'abc123', ref: 'feature/test' },
                labels: [],
                body: 'This is a test PR.',
            },
        },
        overrides
    );
}

/**
 * Mocks an Issue payload for context.
 * Use for simulating issue events in agent tests.
 * @param {Object} overrides - Properties to override in the Issue payload.
 * @returns {Object} Mocked Issue payload.
 */
function mockIssuePayload(overrides = {}) {
    return Object.assign(
        {
            issue: {
                number: 1,
                title: 'Test Issue',
                labels: [],
                body: 'This is a test issue.',
            },
        },
        overrides
    );
}

/**
 * Utility to test dry-run logic.
 * Use for verifying agents print dry-run output appropriately.
 * @param {Function} fn - Function to run (usually agent run function).
 * @param {Object} context - Context with dryRun enabled.
 */
async function expectDryRun(fn, context) {
    const consoleSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
    await fn(context);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/DRY RUN/));
    consoleSpy.mockRestore();
}

/**
 * Mocks changed files for a PR, simulating the files returned by octokit.rest.pulls.listFiles.
 * @param {string[]} filenames - Array of filenames that are changed.
 * @returns {Object[]} Array of file objects as returned by octokit.
 */
function mockChangedFiles(filenames = []) {
    return filenames.map((filename) => ({
        filename,
        status: 'modified',
        additions: 10,
        deletions: 2,
        changes: 12,
    }));
}

/**
 * Utility to simulate a workflow event context.
 * @param {string} eventName - Name of the workflow event (e.g., 'push', 'pull_request').
 * @param {Object} payload - Event payload.
 * @returns {Object} Mocked context object.
 */
function mockWorkflowEvent(eventName, payload) {
    return {
        eventName,
        payload,
        repo: { owner: 'lightspeedwp', repo: 'repo' },
    };
}

/**
 * Custom Jest matcher to check if a comment was posted with given content.
 * @param {Function} createCommentMock - The jest mock for createComment.
 * @param {string} expectedContent - Content expected in the posted comment.
 */
function expectCommentPosted(createCommentMock, expectedContent) {
    expect(createCommentMock).toHaveBeenCalledWith(
        expect.objectContaining({
            body: expect.stringContaining(expectedContent),
        })
    );
}

module.exports = {
    mockOctokit,
    mockContext,
    expectMarkdownReport,
    setTestEnv,
    resetTestEnv,
    mockPrPayload,
    mockIssuePayload,
    expectDryRun,
    mockChangedFiles,
    mockWorkflowEvent,
    expectCommentPosted,
};

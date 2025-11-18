/**
 * Global Jest test helpers for agents and utilities.
 * - Mocks Octokit, context, PR/Issue payloads, etc.
 * - Shared assertions and setup/teardown functions.
 */

function mockOctokit(overrides = {}) {
    return {
        rest: {
            issues: {
                addLabels: jest.fn(),
                createComment: jest.fn(),
                listLabelsOnIssue: jest.fn(),
                removeLabel: jest.fn(),
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

function setTestEnv(envVars) {
    Object.entries(envVars).forEach(([key, value]) => {
        process.env[key] = value;
    });
}

function resetTestEnv(keys) {
    keys.forEach((key) => {
        delete process.env[key];
    });
}

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

function mockChangedFiles(filenames = []) {
    return filenames.map((filename) => ({
        filename,
        status: 'modified',
        additions: 10,
        deletions: 2,
        changes: 12,
    }));
}

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
    setTestEnv,
    resetTestEnv,
    mockPrPayload,
    mockIssuePayload,
    mockChangedFiles,
    expectCommentPosted,
};

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
    const defaultContext = {
        repo: { owner: 'lightspeedwp', repo: 'repo' },
        payload: {},
        eventName: 'pull_request',
    };

    // Properly merge payload if provided
    if (overrides.payload) {
        return Object.assign(defaultContext, overrides, {
            payload: Object.assign(
                {},
                defaultContext.payload,
                overrides.payload
            ),
        });
    }

    return Object.assign(defaultContext, overrides);
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
    const defaultPayload = {
        pull_request: {
            number: 1,
            title: 'Test PR',
            head: { sha: 'abc123', ref: 'feature/test' },
            labels: [],
            body: 'This is a test PR.',
        },
    };

    // Properly merge pull_request if provided
    if (overrides.pull_request) {
        return Object.assign(defaultPayload, overrides, {
            pull_request: Object.assign(
                {},
                defaultPayload.pull_request,
                overrides.pull_request
            ),
        });
    }

    return Object.assign(defaultPayload, overrides);
}

function mockIssuePayload(overrides = {}) {
    const defaultPayload = {
        issue: {
            number: 1,
            title: 'Test Issue',
            labels: [],
            body: 'This is a test issue.',
        },
    };

    // Properly merge issue if provided
    if (overrides.issue) {
        return Object.assign(defaultPayload, overrides, {
            issue: Object.assign({}, defaultPayload.issue, overrides.issue),
        });
    }

    return Object.assign(defaultPayload, overrides);
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

/**
 * Tests for reviewer.agent.js
 * Relocated from tests/utility/reviewer.agent.test.js
 * TODO: Add tests for error branches (missing token, failing CI, no changed files).
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
} = require("../../tests/test-helpers");
const { run } = require("../reviewer.agent.js");

describe("Reviewer Agent", () => {
  beforeAll(() => setTestEnv({ GITHUB_TOKEN: "test" }));
  afterAll(() => resetTestEnv(["GITHUB_TOKEN"]));

  test("posts reviewer summary comment", async () => {
    const octokit = mockOctokit({
      rest: {
        repos: {
          getCombinedStatusForRef: jest
            .fn()
            .mockResolvedValue({ data: { state: "success" } }),
        },
        pulls: {
          listFiles: jest.fn().mockResolvedValue({
            data: mockChangedFiles(["src/file.js", "CHANGELOG.md"]),
          }),
        },
        issues: {
          createComment: jest.fn(),
        },
      },
    });
    const context = mockContext(mockPrPayload());
    await run(context);
    expectCommentPosted(octokit.rest.issues.createComment, "Reviewer Summary");
  });

  test("dry-run logic", async () => {
    const context = mockContext({ ...mockPrPayload(), dryRun: true });
    await expectDryRun(run, context);
  });
});
const reviewerAgent = require("../reviewer.agent.js");

describe("reviewer.agent.js", () => {
  it("should export a run function", () => {
    expect(typeof reviewerAgent.run).toBe("function");
  });

  // Add more tests for reviewerAgent.run as implementation details and mocks are available
});

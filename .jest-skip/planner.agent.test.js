const {
  mockOctokit,
  mockContext,
  setTestEnv,
  resetTestEnv,
  mockPrPayload,
} = require("../../tests/test-helpers");
const { run } = require("../planner.agent.cjs");

describe("Planner Agent", () => {
  beforeAll(() => setTestEnv({ GITHUB_TOKEN: "test" }));
  afterAll(() => resetTestEnv(["GITHUB_TOKEN"]));

  it("posts a checklist comment on PR", async () => {
    const octokit = mockOctokit();
    const context = mockContext(mockPrPayload());
    context.github = octokit;
    context.core = { info: jest.fn() };

    await run(context);

    expect(octokit.rest.issues.createComment).toHaveBeenCalled();
  });

  // Add more tests for dry-run, exit criteria, etc.
});

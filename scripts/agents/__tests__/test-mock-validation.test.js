/**
 * ============================================================================
 * Mock and Stub Validation Tests for Agents
 * Location: .github/agents/__tests__/test-mock-validation.test.js
 * Description:
 *   - Validates mock functions provide all required GitHub API methods
 *   - Ensures mock payloads match GitHub API schema expectations
 *   - Tests helper functions return valid data structures
 * Standards:
 *   - Follows [LightSpeedWP Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
 *   - Org instructions: [Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
 * Contribution:
 *   - Update when adding new mock methods or API endpoints
 *   - Maintain schema validation as GitHub API evolves
 * ============================================================================
 */

const { setTestEnv, resetTestEnv } = require("../../../tests/test-helpers");
const {
  mockOctokit,
  mockPrPayload,
  mockIssuePayload,
  mockContext,
} = require("../../../tests/test-helpers");

describe("Mock and Test Helper Validation", () => {
  beforeAll(() => setTestEnv({ GITHUB_TOKEN: "test-token" }));
  afterAll(() => resetTestEnv(["GITHUB_TOKEN"]));

  describe("mockOctokit validation", () => {
    test("provides all required REST API methods", () => {
      const octokit = mockOctokit();

      // Issues API
      expect(octokit.rest.issues.createComment).toBeDefined();
      expect(octokit.rest.issues.addLabels).toBeDefined();
      expect(octokit.rest.issues.removeLabel).toBeDefined();
      expect(octokit.rest.issues.update).toBeDefined();

      // Pull Requests API
      expect(octokit.rest.pulls.listFiles).toBeDefined();
      expect(octokit.rest.pulls.createReview).toBeDefined();
      expect(octokit.rest.pulls.requestReviewers).toBeDefined();

      // Repository API
      expect(octokit.rest.repos.getContent).toBeDefined();
      expect(octokit.rest.repos.createOrUpdateFileContents).toBeDefined();
    });

    test("mock methods return expected data structures", async () => {
      const octokit = mockOctokit();

      // Test comment creation
      const comment = await octokit.rest.issues.createComment({
        owner: "test",
        repo: "test",
        issue_number: 1,
        body: "test comment",
      });

      expect(comment.data).toHaveProperty("id");
      expect(comment.data).toHaveProperty("body", "test comment");
      expect(comment.data).toHaveProperty("user");
    });

    test("handles API errors correctly", async () => {
      const octokit = mockOctokit({
        shouldThrow: true,
        errorStatus: 403,
      });

      await expect(octokit.rest.issues.createComment({})).rejects.toThrow();
    });
  });

  describe("payload validation", () => {
    test("mockPrPayload matches GitHub PR webhook schema", () => {
      const payload = mockPrPayload();

      expect(payload).toHaveProperty("action");
      expect(payload).toHaveProperty("pull_request");
      expect(payload).toHaveProperty("repository");

      // PR structure validation
      expect(payload.pull_request).toHaveProperty("number");
      expect(payload.pull_request).toHaveProperty("title");
      expect(payload.pull_request).toHaveProperty("body");
      expect(payload.pull_request).toHaveProperty("labels");
      expect(payload.pull_request).toHaveProperty("user");

      // Repository structure validation
      expect(payload.repository).toHaveProperty("name");
      expect(payload.repository).toHaveProperty("owner");
      expect(payload.repository.owner).toHaveProperty("login");

      // Type validation
      expect(payload.pull_request.number).toEqual(expect.any(Number));
      expect(payload.pull_request.title).toEqual(expect.any(String));
      expect(Array.isArray(payload.pull_request.labels)).toBe(true);
    });

    test("mockIssuePayload matches GitHub issue webhook schema", () => {
      const payload = mockIssuePayload();

      expect(payload).toHaveProperty("action");
      expect(payload).toHaveProperty("issue");
      expect(payload).toHaveProperty("repository");

      expect(payload.issue).toHaveProperty("number");
      expect(payload.issue).toHaveProperty("title");
      expect(payload.issue).toHaveProperty("body");
      expect(payload.issue).toHaveProperty("labels");
    });

    test("mockContext provides complete GitHub Actions context", () => {
      const context = mockContext();

      expect(context).toHaveProperty("eventName");
      expect(context).toHaveProperty("payload");
      expect(context).toHaveProperty("repo");
      expect(context).toHaveProperty("sha");

      expect(context.repo).toHaveProperty("owner");
      expect(context.repo).toHaveProperty("repo");
    });
  });

  describe("data consistency validation", () => {
    test("generated IDs are unique across calls", () => {
      const payload1 = mockPrPayload();
      const payload2 = mockPrPayload();

      expect(payload1.pull_request.number).not.toBe(
        payload2.pull_request.number,
      );
    });

    test("custom payload overrides work correctly", () => {
      const customPayload = mockPrPayload({
        pull_request: {
          title: "Custom Title",
          number: 999,
        },
      });

      expect(customPayload.pull_request.title).toBe("Custom Title");
      expect(customPayload.pull_request.number).toBe(999);
    });
  });
});

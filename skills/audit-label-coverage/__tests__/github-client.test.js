const { GitHubClient } = require("../lib/github-client");

describe("GitHubClient", () => {
  let client;
  const mockOctokit = {
    rest: {
      issues: {
        listForRepo: jest.fn(),
        addLabels: jest.fn(),
        removeLabel: jest.fn(),
      },
    },
    repos: {
      getContent: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    client = new GitHubClient(mockOctokit, "owner", "repo");
  });

  describe("fetchIssues", () => {
    test("fetches open issues with default state", async () => {
      const mockIssues = [
        { number: 1, title: "Issue 1", labels: [] },
        { number: 2, title: "Issue 2", labels: [{ name: "type:bug" }] },
      ];
      mockOctokit.rest.issues.listForRepo.mockResolvedValue({
        data: mockIssues,
        headers: {},
      });

      const issues = await client.fetchIssues();

      expect(issues).toEqual(mockIssues);
      expect(mockOctokit.rest.issues.listForRepo).toHaveBeenCalledWith(
        expect.objectContaining({
          owner: "owner",
          repo: "repo",
          state: "open",
        }),
      );
    });

    test("fetches issues with custom filters", async () => {
      mockOctokit.rest.issues.listForRepo.mockResolvedValue({
        data: [],
        headers: {},
      });

      await client.fetchIssues({ state: "closed", labels: "type:bug" });

      expect(mockOctokit.rest.issues.listForRepo).toHaveBeenCalledWith(
        expect.objectContaining({
          state: "closed",
          labels: "type:bug",
        }),
      );
    });

    test("handles pagination", async () => {
      const page1 = Array.from({ length: 30 }, (_, i) => ({
        number: i + 1,
        title: `Issue ${i + 1}`,
        labels: [],
      }));
      const page2 = Array.from({ length: 5 }, (_, i) => ({
        number: i + 31,
        title: `Issue ${i + 31}`,
        labels: [],
      }));

      mockOctokit.rest.issues.listForRepo.mockResolvedValueOnce({
        data: page1,
        headers: { link: 'rel="next"' },
      });
      mockOctokit.rest.issues.listForRepo.mockResolvedValueOnce({
        data: page2,
        headers: {},
      });

      const issues = await client.fetchIssues({ perPage: 30 });

      expect(issues).toHaveLength(35);
      expect(mockOctokit.rest.issues.listForRepo).toHaveBeenCalledTimes(2);
    });

    test("retries on rate limit", async () => {
      const error = new Error("API rate limit exceeded");
      error.status = 403;
      error.response = {
        headers: { "x-ratelimit-reset": Date.now() / 1000 + 1 },
      };

      mockOctokit.rest.issues.listForRepo
        .mockRejectedValueOnce(error)
        .mockResolvedValue({ data: [], headers: {} });

      const issues = await client.fetchIssues();

      expect(issues).toEqual([]);
      expect(mockOctokit.rest.issues.listForRepo).toHaveBeenCalledTimes(2);
    });

    test("throws after max retries", async () => {
      const error = new Error("Server error");
      error.status = 500;
      mockOctokit.rest.issues.listForRepo.mockRejectedValue(error);

      // Use a shorter timeout for this test
      const shortClient = new GitHubClient(mockOctokit, "owner", "repo", {
        maxRetries: 1,
        baseDelay: 10, // 10ms instead of 2s
      });

      await expect(shortClient.fetchIssues()).rejects.toThrow("Server error");
      expect(mockOctokit.rest.issues.listForRepo).toHaveBeenCalledTimes(2); // 1 initial + 1 retry
    }, 10000);
  });

  describe("addLabels", () => {
    test("adds labels to an issue", async () => {
      const labels = ["type:bug", "area:ci"];
      mockOctokit.rest.issues.addLabels.mockResolvedValue({ data: {} });

      await client.addLabels(123, labels);

      expect(mockOctokit.rest.issues.addLabels).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
        issue_number: 123,
        labels,
      });
    });

    test("handles empty label list", async () => {
      await client.addLabels(123, []);

      expect(mockOctokit.rest.issues.addLabels).not.toHaveBeenCalled();
    });

    test("retries on transient errors", async () => {
      const error = new Error("Network error");
      error.status = 500;
      mockOctokit.rest.issues.addLabels
        .mockRejectedValueOnce(error)
        .mockResolvedValue({ data: {} });

      await client.addLabels(123, ["type:bug"]);

      expect(mockOctokit.rest.issues.addLabels).toHaveBeenCalledTimes(2);
    });
  });

  describe("removeLabel", () => {
    test("removes a label from an issue", async () => {
      mockOctokit.rest.issues.removeLabel.mockResolvedValue({ data: {} });

      await client.removeLabel(123, "meta:stale");

      expect(mockOctokit.rest.issues.removeLabel).toHaveBeenCalledWith({
        owner: "owner",
        repo: "repo",
        issue_number: 123,
        name: "meta:stale",
      });
    });

    test("retries on transient errors", async () => {
      const error = new Error("Network error");
      error.status = 500;
      mockOctokit.rest.issues.removeLabel
        .mockRejectedValueOnce(error)
        .mockResolvedValue({ data: {} });

      await client.removeLabel(123, "meta:stale");

      expect(mockOctokit.rest.issues.removeLabel).toHaveBeenCalledTimes(2);
    });
  });

  describe("validateLabels", () => {
    test("validates labels against canonical set", async () => {
      const mockYamlContent = `
- name: type:bug
  color: 9F3734
- name: area:ci
  color: BFD4F2
- name: invalid-label
  color: '000000'
`;

      mockOctokit.repos.getContent.mockResolvedValue({
        data: {
          content: Buffer.from(mockYamlContent).toString("base64"),
        },
      });

      const result = await client.validateLabels([
        "type:bug",
        "area:ci",
        "invalid-label",
      ]);

      expect(result).toEqual({
        valid: ["type:bug", "area:ci", "invalid-label"],
        invalid: [],
      });
    });

    test("caches label validation results", async () => {
      const mockLabelsYml = [{ name: "type:bug", color: "9F3734" }];
      mockOctokit.repos.getContent.mockResolvedValue({
        data: {
          content: Buffer.from(JSON.stringify(mockLabelsYml)).toString(
            "base64",
          ),
        },
      });

      await client.validateLabels(["type:bug"]);
      await client.validateLabels(["type:bug"]);

      expect(mockOctokit.repos.getContent).toHaveBeenCalledTimes(1); // Only fetched once
    });
  });

  describe("retry logic", () => {
    test("retries on transient errors with backoff", async () => {
      const error = new Error("Server error");
      error.status = 500;

      mockOctokit.rest.issues.listForRepo
        .mockRejectedValueOnce(error)
        .mockRejectedValueOnce(error)
        .mockResolvedValue({ data: [], headers: {} });

      const shortClient = new GitHubClient(mockOctokit, "owner", "repo", {
        maxRetries: 3,
        baseDelay: 10, // 10ms for testing
      });

      const result = await shortClient.fetchIssues();

      expect(result).toEqual([]);
      expect(mockOctokit.rest.issues.listForRepo).toHaveBeenCalledTimes(3);
    }, 10000);

    test("respects rate limit reset time", async () => {
      const error = new Error("Rate limited");
      error.status = 403;
      const resetTime = Math.ceil(Date.now() / 1000) + 1; // 1 second in future
      error.response = { headers: { "x-ratelimit-reset": resetTime } };

      mockOctokit.rest.issues.listForRepo
        .mockRejectedValueOnce(error)
        .mockResolvedValue({ data: [], headers: {} });

      const shortClient = new GitHubClient(mockOctokit, "owner", "repo", {
        maxRetries: 3,
        baseDelay: 10,
      });

      const result = await shortClient.fetchIssues();

      expect(result).toEqual([]);
      expect(mockOctokit.rest.issues.listForRepo).toHaveBeenCalledTimes(2);
    }, 10000);
  });
});

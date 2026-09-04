const PRsAPI = require("../../lib/api/prs-api");
const fixtures = require("../fixtures/github-responses.json");
const repos = require("../fixtures/mock-repos.json");

describe("PRsAPI", () => {
  let client;

  beforeEach(() => {
    client = {
      pulls: {
        list: jest.fn(),
        get: jest.fn(),
      },
    };
  });

  test("throws when client is invalid", () => {
    expect(() => new PRsAPI({})).toThrow(
      "Octokit client with pulls scope is required",
    );
  });

  test("fetches pull requests", async () => {
    client.pulls.list.mockResolvedValue({ data: fixtures.pulls });
    const api = new PRsAPI(client);

    const prs = await api.getPullRequests(repos.default);

    expect(prs).toHaveLength(1);
    expect(prs[0]).toMatchObject({
      number: 2032,
      title: "Reporting Agent v2 Phase 2.2",
      author: "copilot",
    });
  });

  test("passes filtering options", async () => {
    client.pulls.list.mockResolvedValue({ data: fixtures.pulls });
    const api = new PRsAPI(client);

    await api.getPullRequests({
      ...repos.default,
      state: "closed",
      perPage: 10,
    });

    expect(client.pulls.list).toHaveBeenCalledWith(
      expect.objectContaining({ state: "closed", per_page: 10 }),
    );
  });

  test("uses fallback list on API error", async () => {
    client.pulls.list.mockRejectedValue(new Error("api down"));
    const api = new PRsAPI(client);

    const prs = await api.getPullRequests({
      ...repos.default,
      fallback: [
        { number: 1, title: "cached", state: "open", user: { login: "x" } },
      ],
    });

    expect(prs[0].number).toBe(1);
  });

  test("uses fallback handler", async () => {
    client.pulls.list.mockRejectedValue(new Error("timeout"));
    const fallbackHandler = jest.fn().mockResolvedValue(fixtures.pulls);
    const api = new PRsAPI(client, { fallbackHandler });

    const prs = await api.getPullRequests(repos.default);

    expect(fallbackHandler).toHaveBeenCalled();
    expect(prs).toHaveLength(1);
  });

  test("uses retry strategy when provided", async () => {
    client.pulls.list.mockResolvedValue({ data: fixtures.pulls });
    const retryStrategy = {
      execute: jest.fn(async (requestFn) => requestFn()),
    };
    const api = new PRsAPI(client, { retryStrategy });

    await api.getPullRequests(repos.default);

    expect(retryStrategy.execute).toHaveBeenCalledWith(
      expect.any(Function),
      "fetch pull requests",
    );
  });

  test("fetches single pull request", async () => {
    client.pulls.get.mockResolvedValue({ data: fixtures.pulls[0] });
    const api = new PRsAPI(client);

    const pr = await api.getPullRequest({ ...repos.default, pullNumber: 2032 });

    expect(pr).toEqual({
      number: 2032,
      title: "Reporting Agent v2 Phase 2.2",
      state: "open",
      author: "copilot",
      merged: false,
      url: "https://github.com/lightspeedwp/.github/pull/2032",
      headSha: "abc123",
    });
  });

  test("uses fallback for single pull request", async () => {
    client.pulls.get.mockRejectedValue(new Error("missing"));
    const api = new PRsAPI(client);

    const pr = await api.getPullRequest({
      ...repos.default,
      pullNumber: 999,
      fallback: { number: 999, title: "cached" },
    });

    expect(pr.number).toBe(999);
  });

  test("throws wrapped error when fallback disabled", async () => {
    client.pulls.list.mockRejectedValue(new Error("boom"));
    const api = new PRsAPI(client);

    await expect(
      api.getPullRequests({ ...repos.default, fallback: undefined }),
    ).rejects.toThrow("Failed to fetch pull requests: boom");
  });

  test("validates required options", async () => {
    const api = new PRsAPI(client);

    await expect(
      api.getPullRequests({ owner: "lightspeedwp" }),
    ).rejects.toThrow("owner and repo are required");
    await expect(
      api.getPullRequest({ ...repos.default, pullNumber: 0 }),
    ).rejects.toThrow("owner, repo, and pullNumber are required");
  });
});

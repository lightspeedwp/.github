const CommitsAPI = require("../../lib/api/commits-api");
const fixtures = require("../fixtures/github-responses.json");
const repos = require("../fixtures/mock-repos.json");

describe("CommitsAPI", () => {
  let client;

  beforeEach(() => {
    client = {
      repos: {
        listCommits: jest.fn(),
        getCommit: jest.fn(),
      },
    };
  });

  test("throws when client is missing repos scope", () => {
    expect(() => new CommitsAPI({})).toThrow(
      "Octokit client with repos scope is required",
    );
  });

  test("fetches commits and maps response", async () => {
    client.repos.listCommits.mockResolvedValue({ data: fixtures.commits });
    const api = new CommitsAPI(client);

    const commits = await api.getCommits({
      ...repos.default,
      branch: "develop",
    });

    expect(commits).toHaveLength(2);
    expect(commits[0]).toMatchObject({
      sha: "abc123",
      author: "ashleyshaw",
      message: "feat: add metadata retrieval",
    });
    expect(client.repos.listCommits).toHaveBeenCalledWith(
      expect.objectContaining({ sha: "develop" }),
    );
  });

  test("supports array fallback format", async () => {
    client.repos.listCommits.mockResolvedValue(fixtures.commits);
    const api = new CommitsAPI(client);

    const commits = await api.getCommits(repos.default);

    expect(commits).toHaveLength(2);
  });

  test("uses fallback value on API failure", async () => {
    client.repos.listCommits.mockRejectedValue(new Error("network"));
    const api = new CommitsAPI(client);

    const commits = await api.getCommits({
      ...repos.default,
      fallback: [{ sha: "cached" }],
    });

    expect(commits).toEqual([
      {
        sha: "cached",
        message: "",
        author: null,
        authorDate: null,
        url: undefined,
      },
    ]);
  });

  test("uses fallback handler when provided", async () => {
    client.repos.listCommits.mockRejectedValue(new Error("timeout"));
    const fallbackHandler = jest.fn().mockResolvedValue(fixtures.commits);
    const api = new CommitsAPI(client, { fallbackHandler });

    const commits = await api.getCommits(repos.default);

    expect(fallbackHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        module: "commits",
        operation: "fetch commits",
      }),
    );
    expect(commits).toHaveLength(2);
  });

  test("uses retry strategy when provided", async () => {
    client.repos.listCommits.mockResolvedValue({ data: fixtures.commits });
    const retryStrategy = {
      execute: jest.fn(async (requestFn) => requestFn()),
    };
    const api = new CommitsAPI(client, { retryStrategy });

    await api.getCommits(repos.default);

    expect(retryStrategy.execute).toHaveBeenCalledWith(
      expect.any(Function),
      "fetch commits",
    );
  });

  test("throws wrapped error when fallback unavailable", async () => {
    client.repos.listCommits.mockRejectedValue(new Error("boom"));
    const api = new CommitsAPI(client);

    await expect(
      api.getCommits({ ...repos.default, fallback: undefined }),
    ).rejects.toThrow("Failed to fetch commits: boom");
  });

  test("fetches single commit metadata", async () => {
    client.repos.getCommit.mockResolvedValue({ data: fixtures.singleCommit });
    const api = new CommitsAPI(client);

    const commit = await api.getCommit({ ...repos.default, sha: "abc123" });

    expect(commit).toMatchObject({
      sha: "abc123",
      author: "ashleyshaw",
      parents: ["000111"],
    });
  });

  test("returns commit fallback for missing commit", async () => {
    client.repos.getCommit.mockRejectedValue(new Error("missing"));
    const api = new CommitsAPI(client);

    const commit = await api.getCommit({
      ...repos.default,
      sha: "bad",
      fallback: { sha: "cached" },
    });

    expect(commit).toEqual({
      sha: "cached",
      message: "",
      author: null,
      authorDate: null,
      url: undefined,
      parents: [],
    });
  });

  test("validates required options", async () => {
    const api = new CommitsAPI(client);
    await expect(api.getCommits({ repo: ".github" })).rejects.toThrow(
      "owner and repo are required",
    );
    await expect(api.getCommit({ ...repos.default })).rejects.toThrow(
      "owner, repo, and sha are required",
    );
  });
});

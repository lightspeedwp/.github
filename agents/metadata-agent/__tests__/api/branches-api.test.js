const BranchesAPI = require("../../lib/api/branches-api");
const fixtures = require("../fixtures/github-responses.json");
const repos = require("../fixtures/mock-repos.json");

describe("BranchesAPI", () => {
  let client;

  beforeEach(() => {
    client = {
      repos: {
        listBranches: jest.fn(),
        get: jest.fn(),
      },
    };
  });

  test("throws when client is invalid", () => {
    expect(() => new BranchesAPI({})).toThrow(
      "Octokit client with repos scope is required",
    );
  });

  test("fetches and maps branches", async () => {
    client.repos.listBranches.mockResolvedValue({ data: fixtures.branches });
    const api = new BranchesAPI(client);

    const branches = await api.getBranches(repos.default);

    expect(branches).toHaveLength(2);
    expect(branches[0]).toEqual({
      name: "develop",
      sha: "abc123",
      isProtected: true,
    });
  });

  test("passes protectedOnly to API", async () => {
    client.repos.listBranches.mockResolvedValue({ data: fixtures.branches });
    const api = new BranchesAPI(client);

    await api.getBranches({ ...repos.default, protectedOnly: true });

    expect(client.repos.listBranches).toHaveBeenCalledWith(
      expect.objectContaining({ protected: true }),
    );
  });

  test("uses fallback list on error", async () => {
    client.repos.listBranches.mockRejectedValue(new Error("offline"));
    const api = new BranchesAPI(client);

    const branches = await api.getBranches({
      ...repos.default,
      fallback: [{ name: "cached", commit: { sha: "x" }, protected: false }],
    });

    expect(branches[0]).toEqual({
      name: "cached",
      sha: "x",
      isProtected: false,
    });
  });

  test("uses fallback handler", async () => {
    client.repos.listBranches.mockRejectedValue(new Error("timeout"));
    const fallbackHandler = jest.fn().mockResolvedValue(fixtures.branches);
    const api = new BranchesAPI(client, { fallbackHandler });

    const branches = await api.getBranches(repos.default);

    expect(fallbackHandler).toHaveBeenCalled();
    expect(branches).toHaveLength(2);
  });

  test("uses retry strategy when provided", async () => {
    client.repos.listBranches.mockResolvedValue({ data: fixtures.branches });
    const retryStrategy = {
      execute: jest.fn(async (requestFn) => requestFn()),
    };
    const api = new BranchesAPI(client, { retryStrategy });

    await api.getBranches(repos.default);

    expect(retryStrategy.execute).toHaveBeenCalledWith(
      expect.any(Function),
      "fetch branches",
    );
  });

  test("returns default branch from repository metadata", async () => {
    client.repos.get.mockResolvedValue({ data: fixtures.repo });
    const api = new BranchesAPI(client);

    const defaultBranch = await api.getDefaultBranch(repos.default);

    expect(defaultBranch).toBe("develop");
  });

  test("returns fallback default branch on error", async () => {
    client.repos.get.mockRejectedValue(new Error("forbidden"));
    const api = new BranchesAPI(client);

    const defaultBranch = await api.getDefaultBranch({
      ...repos.default,
      fallback: "main",
    });

    expect(defaultBranch).toBe("main");
  });

  test("throws wrapped branch error when fallback disabled", async () => {
    client.repos.listBranches.mockRejectedValue(new Error("boom"));
    const api = new BranchesAPI(client);

    await expect(
      api.getBranches({ ...repos.default, fallback: undefined }),
    ).rejects.toThrow("Failed to fetch branches: boom");
  });

  test("validates owner and repo", async () => {
    const api = new BranchesAPI(client);
    await expect(api.getBranches({ owner: "lightspeedwp" })).rejects.toThrow(
      "owner and repo are required",
    );
  });
});

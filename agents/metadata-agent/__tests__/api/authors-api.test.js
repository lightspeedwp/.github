const AuthorsAPI = require("../../lib/api/authors-api");
const fixtures = require("../fixtures/github-responses.json");
const repos = require("../fixtures/mock-repos.json");

describe("AuthorsAPI", () => {
  let client;

  beforeEach(() => {
    client = {
      repos: {
        listCommits: jest.fn(),
      },
    };
  });

  test("throws when client is invalid", () => {
    expect(() => new AuthorsAPI({})).toThrow(
      "Octokit client with repos scope is required",
    );
  });

  test("aggregates author commit counts", async () => {
    client.repos.listCommits.mockResolvedValue({ data: fixtures.commits });
    const api = new AuthorsAPI(client);

    const authors = await api.getAuthorsFromCommits(repos.default);

    expect(authors).toHaveLength(2);
    expect(authors[0]).toMatchObject({ id: "ashleyshaw", commits: 1 });
  });

  test("groups commits by login when available", async () => {
    const duplicated = [...fixtures.commits, fixtures.commits[0]];
    client.repos.listCommits.mockResolvedValue({ data: duplicated });
    const api = new AuthorsAPI(client);

    const authors = await api.getAuthorsFromCommits(repos.default);

    const ash = authors.find((author) => author.id === "ashleyshaw");
    expect(ash.commits).toBe(2);
  });

  test("uses fallback list when API fails", async () => {
    client.repos.listCommits.mockRejectedValue(new Error("network"));
    const api = new AuthorsAPI(client);

    const authors = await api.getAuthorsFromCommits({
      ...repos.default,
      fallback: [{ id: "cached", commits: 3 }],
    });

    expect(authors).toEqual([
      expect.objectContaining({ id: "cached", commits: 3 }),
    ]);
  });

  test("uses fallback handler", async () => {
    client.repos.listCommits.mockRejectedValue(new Error("timeout"));
    const fallbackHandler = jest.fn().mockResolvedValue([
      {
        author: { login: "fallback" },
        commit: { author: { name: "Fallback" } },
      },
    ]);
    const api = new AuthorsAPI(client, { fallbackHandler });

    const authors = await api.getAuthorsFromCommits(repos.default);

    expect(fallbackHandler).toHaveBeenCalled();
    expect(authors[0].id).toBe("fallback");
  });

  test("uses retry strategy when provided", async () => {
    client.repos.listCommits.mockResolvedValue({ data: fixtures.commits });
    const retryStrategy = {
      execute: jest.fn(async (requestFn) => requestFn()),
    };
    const api = new AuthorsAPI(client, { retryStrategy });

    await api.getAuthorsFromCommits(repos.default);

    expect(retryStrategy.execute).toHaveBeenCalledWith(
      expect.any(Function),
      "fetch author metadata",
    );
  });

  test("returns top authors with default limit", async () => {
    const many = [
      ...fixtures.commits,
      fixtures.commits[0],
      fixtures.commits[0],
      fixtures.commits[1],
    ];
    client.repos.listCommits.mockResolvedValue({ data: many });
    const api = new AuthorsAPI(client);

    const authors = await api.getTopAuthors(repos.default);

    expect(authors.length).toBeLessThanOrEqual(5);
    expect(authors[0].id).toBe("ashleyshaw");
    expect(authors[0].commits).toBe(3);
  });

  test("respects top authors limit", async () => {
    client.repos.listCommits.mockResolvedValue({ data: fixtures.commits });
    const api = new AuthorsAPI(client);

    const authors = await api.getTopAuthors({ ...repos.default, limit: 1 });

    expect(authors).toHaveLength(1);
  });

  test("throws wrapped error when fallback disabled", async () => {
    client.repos.listCommits.mockRejectedValue(new Error("boom"));
    const api = new AuthorsAPI(client);

    await expect(
      api.getAuthorsFromCommits({ ...repos.default, fallback: undefined }),
    ).rejects.toThrow("Failed to fetch author metadata: boom");
  });

  test("validates owner and repo", async () => {
    const api = new AuthorsAPI(client);

    await expect(
      api.getAuthorsFromCommits({ owner: "lightspeedwp" }),
    ).rejects.toThrow("owner and repo are required");
  });
});

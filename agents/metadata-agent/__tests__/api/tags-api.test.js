const TagsAPI = require("../../lib/api/tags-api");
const fixtures = require("../fixtures/github-responses.json");
const repos = require("../fixtures/mock-repos.json");

describe("TagsAPI", () => {
  let client;

  beforeEach(() => {
    client = {
      repos: {
        listTags: jest.fn(),
      },
    };
  });

  test("throws when client is invalid", () => {
    expect(() => new TagsAPI({})).toThrow(
      "Octokit client with repos scope is required",
    );
  });

  test("fetches and maps tags", async () => {
    client.repos.listTags.mockResolvedValue({ data: fixtures.tags });
    const api = new TagsAPI(client);

    const tags = await api.getTags(repos.default);

    expect(tags).toHaveLength(2);
    expect(tags[0]).toEqual({
      name: "v2.0.0",
      sha: "abc123",
      url: "https://api.github.com/repos/lightspeedwp/.github/commits/abc123",
    });
  });

  test("supports array responses", async () => {
    client.repos.listTags.mockResolvedValue(fixtures.tags);
    const api = new TagsAPI(client);

    const tags = await api.getTags(repos.default);
    expect(tags).toHaveLength(2);
  });

  test("uses fallback list when API fails", async () => {
    client.repos.listTags.mockRejectedValue(new Error("rate limited"));
    const api = new TagsAPI(client);

    const tags = await api.getTags({
      ...repos.default,
      fallback: [{ name: "cached", commit: { sha: "x" } }],
    });

    expect(tags[0].name).toBe("cached");
  });

  test("uses fallback handler when available", async () => {
    client.repos.listTags.mockRejectedValue(new Error("timeout"));
    const fallbackHandler = jest.fn().mockResolvedValue(fixtures.tags);
    const api = new TagsAPI(client, { fallbackHandler });

    const tags = await api.getTags(repos.default);

    expect(fallbackHandler).toHaveBeenCalled();
    expect(tags).toHaveLength(2);
  });

  test("uses retry strategy when provided", async () => {
    client.repos.listTags.mockResolvedValue({ data: fixtures.tags });
    const retryStrategy = {
      execute: jest.fn(async (requestFn) => requestFn()),
    };
    const api = new TagsAPI(client, { retryStrategy });

    await api.getTags(repos.default);

    expect(retryStrategy.execute).toHaveBeenCalledWith(
      expect.any(Function),
      "fetch tags",
    );
  });

  test("fetches latest tag", async () => {
    client.repos.listTags.mockResolvedValue({ data: fixtures.tags });
    const api = new TagsAPI(client);

    const tag = await api.getLatestTag(repos.default);

    expect(tag.name).toBe("v2.0.0");
  });

  test("returns fallback latest tag when list is empty", async () => {
    client.repos.listTags.mockResolvedValue({ data: [] });
    const api = new TagsAPI(client);

    const tag = await api.getLatestTag({
      ...repos.default,
      fallback: { name: "v0" },
    });

    expect(tag).toEqual({ name: "v0" });
  });

  test("throws wrapped error without fallback", async () => {
    client.repos.listTags.mockRejectedValue(new Error("boom"));
    const api = new TagsAPI(client);

    await expect(
      api.getTags({ ...repos.default, fallback: undefined }),
    ).rejects.toThrow("Failed to fetch tags: boom");
  });

  test("validates owner and repo", async () => {
    const api = new TagsAPI(client);
    await expect(api.getTags({ owner: "lightspeedwp" })).rejects.toThrow(
      "owner and repo are required",
    );
  });
});

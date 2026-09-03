const WorkflowsAPI = require("../../lib/api/workflows-api");
const fixtures = require("../fixtures/github-responses.json");
const repos = require("../fixtures/mock-repos.json");

describe("WorkflowsAPI", () => {
  let client;

  beforeEach(() => {
    client = {
      actions: {
        listRepoWorkflows: jest.fn(),
        listWorkflowRunsForRepo: jest.fn(),
        listWorkflowRuns: jest.fn(),
      },
    };
  });

  test("throws when client is invalid", () => {
    expect(() => new WorkflowsAPI({})).toThrow(
      "Octokit client with actions scope is required",
    );
  });

  test("fetches workflows", async () => {
    client.actions.listRepoWorkflows.mockResolvedValue({
      data: fixtures.workflows,
    });
    const api = new WorkflowsAPI(client);

    const workflows = await api.getWorkflows(repos.default);

    expect(workflows).toEqual([
      {
        id: 123,
        name: "CI",
        state: "active",
        path: ".github/workflows/testing.yml",
        url: "https://github.com/lightspeedwp/.github/actions/workflows/testing.yml",
      },
    ]);
  });

  test("uses fallback list when workflow API fails", async () => {
    client.actions.listRepoWorkflows.mockRejectedValue(new Error("rate limit"));
    const api = new WorkflowsAPI(client);

    const workflows = await api.getWorkflows({
      ...repos.default,
      fallback: [
        { id: 1, name: "cached", state: "active", path: "x", html_url: "u" },
      ],
    });

    expect(workflows[0].name).toBe("cached");
  });

  test("uses workflow fallback handler", async () => {
    client.actions.listRepoWorkflows.mockRejectedValue(new Error("timeout"));
    const fallbackHandler = jest.fn().mockResolvedValue(fixtures.workflows);
    const api = new WorkflowsAPI(client, { fallbackHandler });

    const workflows = await api.getWorkflows(repos.default);

    expect(fallbackHandler).toHaveBeenCalled();
    expect(workflows).toHaveLength(1);
  });

  test("uses retry strategy when provided", async () => {
    client.actions.listRepoWorkflows.mockResolvedValue({
      data: fixtures.workflows,
    });
    const retryStrategy = {
      execute: jest.fn(async (requestFn) => requestFn()),
    };
    const api = new WorkflowsAPI(client, { retryStrategy });

    await api.getWorkflows(repos.default);

    expect(retryStrategy.execute).toHaveBeenCalledWith(
      expect.any(Function),
      "fetch workflows",
    );
  });

  test("fetches workflow runs for repo", async () => {
    client.actions.listWorkflowRunsForRepo.mockResolvedValue({
      data: fixtures.workflowRuns,
    });
    const api = new WorkflowsAPI(client);

    const runs = await api.getWorkflowRuns(repos.default);

    expect(runs[0]).toMatchObject({
      id: 987,
      branch: "develop",
      conclusion: "success",
    });
  });

  test("fetches workflow runs for specific workflow", async () => {
    client.actions.listWorkflowRuns.mockResolvedValue({
      data: fixtures.workflowRuns,
    });
    const api = new WorkflowsAPI(client);

    await api.getWorkflowRuns({ ...repos.default, workflowId: 123 });

    expect(client.actions.listWorkflowRuns).toHaveBeenCalledWith(
      expect.objectContaining({ workflow_id: 123 }),
    );
  });

  test("uses fallback runs when run API fails", async () => {
    client.actions.listWorkflowRunsForRepo.mockRejectedValue(
      new Error("offline"),
    );
    const api = new WorkflowsAPI(client);

    const runs = await api.getWorkflowRuns({
      ...repos.default,
      fallback: [
        { id: 1, name: "cached", status: "completed", head_branch: "main" },
      ],
    });

    expect(runs[0].id).toBe(1);
  });

  test("throws wrapped error when fallback disabled", async () => {
    client.actions.listRepoWorkflows.mockRejectedValue(new Error("boom"));
    const api = new WorkflowsAPI(client);

    await expect(
      api.getWorkflows({ ...repos.default, fallback: undefined }),
    ).rejects.toThrow("Failed to fetch workflows: boom");
  });

  test("validates owner and repo", async () => {
    const api = new WorkflowsAPI(client);

    await expect(api.getWorkflows({ owner: "lightspeedwp" })).rejects.toThrow(
      "owner and repo are required",
    );
  });
});

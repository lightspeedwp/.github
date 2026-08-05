/**
 * Tests for planner.agent.js reliability paths.
 * @see ../planner.agent.js
 */

const path = require("path");

function createPlannerHarness(options = {}) {
  const {
    tokenInput = "",
    _envToken = "test-token",
    contextPayload = {
      issue: { number: 42, title: "Implement feature", body: "Links #100" },
    },
    issueGetReject = null,
    getOctokitReject = null,
    comments = [],
    issueTitle = "Implement feature",
    issueBody = "Links #100",
  } = options;

  const octokit = {
    rest: {
      issues: {
        get: issueGetReject
          ? jest.fn().mockRejectedValue(issueGetReject)
          : jest.fn().mockResolvedValue({
              data: { labels: [{ name: "type:feature" }] },
            }),
        createComment: jest.fn().mockResolvedValue({ data: { id: 10 } }),
        updateComment: jest.fn().mockResolvedValue({ data: { id: 11 } }),
        listComments: jest.fn(),
      },
    },
    paginate: jest.fn().mockResolvedValue(comments),
  };

  const core = {
    getInput: jest.fn((name) => (name === "github-token" ? tokenInput : "")),
    info: jest.fn(),
    warning: jest.fn(),
    setFailed: jest.fn(),
  };

  const github = {
    context: {
      repo: { owner: "lightspeedwp", repo: ".github" },
      payload: contextPayload || {
        issue: { number: 42, title: issueTitle, body: issueBody },
      },
    },
    getOctokit: getOctokitReject
      ? jest.fn().mockImplementation(() => {
          throw getOctokitReject;
        })
      : jest.fn().mockReturnValue(octokit),
  };

  return { core, github, octokit };
}

function loadPlannerWithMocks(harness) {
  jest.resetModules();
  jest.doMock("@actions/core", () => harness.core);
  jest.doMock("@actions/github", () => harness.github);
  return require(path.join("..", "planner.agent.js"));
}

describe("planner.agent run", () => {
  let _exitSpy;

  beforeEach(() => {
    process.env.GITHUB_TOKEN = "test-token";
    delete process.env.DRY_RUN;

    _exitSpy = jest.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`process.exit:${code}`);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.GITHUB_TOKEN;
    delete process.env.DRY_RUN;
  });

  test("fails fast when token is missing", async () => {
    delete process.env.GITHUB_TOKEN;
    const harness = createPlannerHarness({ tokenInput: "", envToken: "" });
    const { run } = loadPlannerWithMocks(harness);

    await expect(run()).rejects.toThrow("process.exit:1");
    expect(harness.core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining("Missing GITHUB_TOKEN"),
    );
  });

  test("exits gracefully when no issue or PR is in context", async () => {
    const harness = createPlannerHarness({ contextPayload: {} });
    const { run } = loadPlannerWithMocks(harness);

    await expect(
      run(harness.github.context, { dryRun: true }),
    ).resolves.toBeUndefined();
    expect(harness.core.info).toHaveBeenCalledWith(
      "No PR or issue in context; exiting.",
    );
    expect(harness.octokit.rest.issues.createComment).not.toHaveBeenCalled();
  });

  test("dry-run logs plan and avoids posting comments", async () => {
    const harness = createPlannerHarness();
    const { run } = loadPlannerWithMocks(harness);

    await expect(
      run(harness.github.context, { dryRun: true }),
    ).resolves.toBeUndefined();
    expect(harness.core.info).toHaveBeenCalledWith(
      expect.stringContaining("DRY-RUN: Would post plan:"),
    );
    expect(harness.octokit.rest.issues.createComment).not.toHaveBeenCalled();
    expect(harness.octokit.rest.issues.updateComment).not.toHaveBeenCalled();
  });

  test("warns and continues when label lookup fails", async () => {
    const harness = createPlannerHarness({
      issueGetReject: new Error("labels API down"),
    });
    const { run } = loadPlannerWithMocks(harness);

    await expect(
      run(harness.github.context, { dryRun: true }),
    ).resolves.toBeUndefined();
    expect(harness.core.warning).toHaveBeenCalledWith(
      expect.stringContaining("Could not fetch issue labels"),
    );
  });

  test("posts a planner comment in apply mode", async () => {
    const harness = createPlannerHarness();
    const { run } = loadPlannerWithMocks(harness);

    await expect(
      run(harness.github.context, { dryRun: false }),
    ).resolves.toBeUndefined();
    expect(harness.octokit.paginate).toHaveBeenCalled();
    expect(harness.octokit.rest.issues.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        owner: "lightspeedwp",
        repo: ".github",
        issue_number: 42,
        body: expect.stringContaining("planner-agent-summary"),
      }),
    );
  });

  test("updates existing planner summary comment in apply mode", async () => {
    const harness = createPlannerHarness({
      comments: [{ id: 77, body: "existing\n<!-- planner-agent-summary -->" }],
    });
    const { run } = loadPlannerWithMocks(harness);

    await expect(
      run(harness.github.context, { dryRun: false }),
    ).resolves.toBeUndefined();
    expect(harness.octokit.rest.issues.updateComment).toHaveBeenCalledWith(
      expect.objectContaining({ comment_id: 77 }),
    );
    expect(harness.octokit.rest.issues.createComment).not.toHaveBeenCalled();
  });

  test("logs actionable failure when GitHub client initialization fails", async () => {
    const harness = createPlannerHarness({
      getOctokitReject: new Error("bad token format"),
    });
    const { run } = loadPlannerWithMocks(harness);

    await expect(run(harness.github.context, { dryRun: true })).rejects.toThrow(
      "process.exit:1",
    );
    expect(harness.core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining("Failed to initialize GitHub client"),
    );
  });

  test("handles architecture plan type and project assignment recommendation", async () => {
    const harness = createPlannerHarness({
      issueTitle: "Architecture design for workflows",
      issueBody: "",
    });
    harness.octokit.rest.issues.get.mockResolvedValueOnce({
      data: {
        labels: [{ name: "area:workflows" }, { name: "type:architecture" }],
      },
    });
    const { run } = loadPlannerWithMocks(harness);

    await expect(
      run(harness.github.context, { dryRun: true }),
    ).resolves.toBeUndefined();
    expect(harness.core.info).toHaveBeenCalledWith(
      expect.stringContaining("Would assign to project: workflows-automation"),
    );
  });

  test("runPlanner apply mode requires token and exits when missing", async () => {
    delete process.env.GITHUB_TOKEN;
    const harness = createPlannerHarness();
    const { runPlanner } = loadPlannerWithMocks(harness);

    await expect(runPlanner({ dryRun: false })).rejects.toThrow(
      "process.exit:1",
    );
  });
});

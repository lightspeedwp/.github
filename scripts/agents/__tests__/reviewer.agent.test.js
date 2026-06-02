/**
 * Tests for reviewer.agent.js reliability and blocker detection.
 * @see ../reviewer.agent.js
 */

async function loadReviewerModules() {
  const core = await import("@actions/core");
  const github = await import("@actions/github");
  const reviewer = await import("../reviewer.agent.js");
  return { core, github, reviewer };
}

function createOctokit(options = {}) {
  const {
    ciState = "success",
    changedFiles = ["src/app.js", "CHANGELOG.md"],
    listFilesReject = null,
    statusReject = null,
    createCommentReject = null,
    largeDeletion = false,
  } = options;

  const filePayload = changedFiles.map((filename) => ({
    filename,
    additions: 1,
    deletions: largeDeletion ? 600 : 1,
  }));

  const octokit = {
    rest: {
      repos: {
        getCombinedStatusForRef: statusReject
          ? jest.fn().mockRejectedValue(statusReject)
          : jest.fn().mockResolvedValue({ data: { state: ciState } }),
      },
      pulls: {
        listFiles: listFilesReject
          ? jest.fn().mockRejectedValue(listFilesReject)
          : jest.fn().mockResolvedValue({ data: filePayload }),
      },
      issues: {
        listComments: jest.fn().mockResolvedValue({ data: [] }),
        createComment: createCommentReject
          ? jest.fn().mockRejectedValue(createCommentReject)
          : jest.fn().mockResolvedValue({ data: { id: 1 } }),
        updateComment: jest.fn().mockResolvedValue({ data: { id: 2 } }),
      },
    },
    paginate: jest.fn().mockImplementation((_fn, params = {}) => {
      if (params.pull_number) {
        if (listFilesReject) {
          return Promise.reject(listFilesReject);
        }
        return Promise.resolve(filePayload);
      }
      return Promise.resolve([]);
    }),
  };

  return octokit;
}

describe("reviewer.agent run", () => {
  let exitSpy;
  const context = {
    repo: { owner: "lightspeedwp", repo: ".github" },
    payload: {
      pull_request: {
        number: 100,
        head: { sha: "abc123" },
      },
    },
  };

  beforeEach(() => {
    jest.resetModules();
    exitSpy = jest.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`process.exit:${code}`);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.GITHUB_TOKEN;
    delete process.env.DRY_RUN;
  });

  test("fails fast when token is missing", async () => {
    const { core, github, reviewer } = await loadReviewerModules();
    const octokit = createOctokit();

    jest.spyOn(core, "getInput").mockImplementation((name) => {
      if (name === "github-token") return "";
      if (name === "require-changelog") return "false";
      return "";
    });
    jest.spyOn(core, "setFailed").mockImplementation(() => {});
    delete process.env.GITHUB_TOKEN;
    jest.spyOn(github, "getOctokit").mockReturnValue(octokit);

    await expect(reviewer.run(context)).rejects.toThrow("process.exit:1");
    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining("Missing GITHUB_TOKEN"),
    );
  });

  test("dry-run mode logs and skips comment creation", async () => {
    const { core, github, reviewer } = await loadReviewerModules();
    const octokit = createOctokit();

    jest.spyOn(core, "getInput").mockImplementation((name) => {
      if (name === "github-token") return "";
      if (name === "require-changelog") return "false";
      return "";
    });
    jest.spyOn(core, "info").mockImplementation(() => {});
    process.env.GITHUB_TOKEN = "test-token";
    process.env.DRY_RUN = "true";
    jest.spyOn(github, "getOctokit").mockReturnValue(octokit);

    await expect(reviewer.run(context)).resolves.toBeUndefined();
    expect(core.info).toHaveBeenCalledWith(
      expect.stringContaining("DRY-RUN: Would post comment"),
    );
    expect(octokit.rest.issues.createComment).not.toHaveBeenCalled();
  });

  test("adds CI blocker when status is not success", async () => {
    const { core, github, reviewer } = await loadReviewerModules();
    const octokit = createOctokit({ ciState: "failure" });

    jest.spyOn(core, "getInput").mockImplementation((name) => {
      if (name === "github-token") return "";
      if (name === "require-changelog") return "false";
      return "";
    });
    process.env.GITHUB_TOKEN = "test-token";
    jest.spyOn(github, "getOctokit").mockReturnValue(octokit);

    await expect(reviewer.run(context)).resolves.toBeUndefined();
    expect(octokit.rest.issues.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining("CI checks not green"),
      }),
    );
  });

  test("flags missing changelog when required and src changes are present", async () => {
    const { core, github, reviewer } = await loadReviewerModules();
    const octokit = createOctokit({
      changedFiles: ["src/logic.js", "docs/README.md"],
    });

    jest.spyOn(core, "getInput").mockImplementation((name) => {
      if (name === "github-token") return "";
      if (name === "require-changelog") return "true";
      return "";
    });
    process.env.GITHUB_TOKEN = "test-token";
    jest.spyOn(github, "getOctokit").mockReturnValue(octokit);

    await expect(reviewer.run(context)).resolves.toBeUndefined();
    expect(octokit.rest.issues.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining("CHANGELOG.md missing for code change"),
      }),
    );
  });

  test("fails with actionable message when listFiles API call fails", async () => {
    const { core, github, reviewer } = await loadReviewerModules();
    const octokit = createOctokit({
      listFilesReject: new Error("API unavailable"),
    });

    jest.spyOn(core, "getInput").mockImplementation((name) => {
      if (name === "github-token") return "";
      if (name === "require-changelog") return "false";
      return "";
    });
    jest.spyOn(core, "setFailed").mockImplementation(() => {});
    process.env.GITHUB_TOKEN = "test-token";
    jest.spyOn(github, "getOctokit").mockReturnValue(octokit);

    await expect(reviewer.run(context)).rejects.toThrow("process.exit:1");
    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining("Failed to fetch files for PR #100"),
    );
  });

  test("fails with actionable message when posting comment fails", async () => {
    const { core, github, reviewer } = await loadReviewerModules();
    const octokit = createOctokit({
      createCommentReject: new Error("permission denied"),
    });

    jest.spyOn(core, "getInput").mockImplementation((name) => {
      if (name === "github-token") return "";
      if (name === "require-changelog") return "false";
      return "";
    });
    jest.spyOn(core, "setFailed").mockImplementation(() => {});
    process.env.GITHUB_TOKEN = "test-token";
    jest.spyOn(github, "getOctokit").mockReturnValue(octokit);

    await expect(reviewer.run(context)).rejects.toThrow("process.exit:1");
    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining("Failed to post comment on PR #100"),
    );
  });

  test("warns and continues when CI status API fails", async () => {
    const { core, github, reviewer } = await loadReviewerModules();
    const octokit = createOctokit({
      statusReject: new Error("status endpoint timeout"),
      changedFiles: ["README.md"],
    });

    jest.spyOn(core, "getInput").mockImplementation((name) => {
      if (name === "github-token") return "";
      if (name === "require-changelog") return "false";
      return "";
    });
    jest.spyOn(core, "warning").mockImplementation(() => {});
    process.env.GITHUB_TOKEN = "test-token";
    jest.spyOn(github, "getOctokit").mockReturnValue(octokit);

    await expect(reviewer.run(context)).resolves.toBeUndefined();
    expect(core.warning).toHaveBeenCalledWith(
      expect.stringContaining("Could not fetch CI status for ref"),
    );
    expect(octokit.rest.issues.createComment).toHaveBeenCalled();
  });

  test("returns early when no pull request exists in context", async () => {
    const { core, github, reviewer } = await loadReviewerModules();
    const octokit = createOctokit();

    jest.spyOn(core, "getInput").mockImplementation((name) => {
      if (name === "github-token") return "";
      if (name === "require-changelog") return "false";
      return "";
    });
    jest.spyOn(core, "info").mockImplementation(() => {});
    process.env.GITHUB_TOKEN = "test-token";
    jest.spyOn(github, "getOctokit").mockReturnValue(octokit);

    await expect(
      reviewer.run({ repo: context.repo, payload: {} }, { dryRun: true }),
    ).resolves.toBeUndefined();
    expect(core.info).toHaveBeenCalledWith("No PR in context; exiting.");
    expect(octokit.rest.issues.createComment).not.toHaveBeenCalled();
  });

  test("reports high-risk blockers for security-sensitive and large deletions", async () => {
    const { core, github, reviewer } = await loadReviewerModules();
    const octokit = createOctokit({
      changedFiles: [
        ".github/workflows/release.yml",
        "migrations/add-users.sql",
      ],
      largeDeletion: true,
    });

    jest.spyOn(core, "getInput").mockImplementation((name) => {
      if (name === "github-token") return "";
      if (name === "require-changelog") return "false";
      return "";
    });
    process.env.GITHUB_TOKEN = "test-token";
    jest.spyOn(github, "getOctokit").mockReturnValue(octokit);

    await expect(reviewer.run(context)).resolves.toBeUndefined();
    expect(octokit.rest.issues.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining("Security-sensitive files modified"),
      }),
    );
    expect(octokit.rest.issues.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining("Large deletion detected"),
      }),
    );
  });
});

import rollback from "../release/rollback.cjs";

describe("release rollback provider parity", () => {
  const originalEnv = { ...process.env };
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env = { ...originalEnv, GITHUB_REPOSITORY: "lightspeedwp/.github" };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    globalThis.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  test("shell provider dry-run prints shell cleanup commands", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await rollback.rollbackRelease({
      version: "1.2.3",
      force: false,
      dryRun: true,
      provider: "shell",
    });

    const output = logSpy.mock.calls.map((call) => String(call[0])).join("\n");
    expect(output).toContain("[DRY-RUN] git push origin :refs/tags/v1.2.3");
    expect(output).toContain("[DRY-RUN] gh release delete v1.2.3 --yes");
    expect(output).toContain(
      "[DRY-RUN] git push origin --delete release/v1.2.3",
    );
  });

  test("mcp provider dry-run prints MCP cleanup steps", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await rollback.rollbackRelease({
      version: "1.2.3",
      force: false,
      dryRun: true,
      provider: "mcp",
    });

    const output = logSpy.mock.calls.map((call) => String(call[0])).join("\n");
    expect(output).toContain("[DRY-RUN] [MCP] Would delete remote tag v1.2.3");
    expect(output).toContain("[DRY-RUN] [MCP] Would delete release v1.2.3");
    expect(output).toContain(
      "[DRY-RUN] [MCP] Would delete remote release branch release/v1.2.3",
    );
  });

  test("parseArgs accepts provider and rejects invalid provider", () => {
    const parsed = rollback.parseArgs([
      "node",
      "rollback.cjs",
      "--version=1.2.3",
      "--provider=mcp",
    ]);

    expect(parsed.provider).toBe("mcp");

    expect(() =>
      rollback.parseArgs([
        "node",
        "rollback.cjs",
        "--version=1.2.3",
        "--provider=unknown",
      ]),
    ).toThrow("Invalid provider");
  });

  test("githubApiRequest retries retryable failures then succeeds", async () => {
    process.env.GITHUB_TOKEN = "token";
    let calls = 0;
    globalThis.fetch = jest.fn(async () => {
      calls += 1;
      if (calls === 1) {
        return {
          ok: false,
          status: 500,
          statusText: "Server Error",
          text: async () => JSON.stringify({ message: "retry" }),
        };
      }
      return {
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify({ ok: true }),
      };
    });

    const result = await rollback.githubApiRequest(
      "/repos/lightspeedwp/.github/test",
      {
        retries: 1,
        initialBackoffMs: 1,
        backoffFactor: 1,
      },
    );

    expect(calls).toBe(2);
    expect(result).toEqual({ ok: true });
  });
});

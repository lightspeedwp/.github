/**
 * Tests for planner.agent.js
 * Tests the stub/dry-run implementation before full feature implementation
 */

import { runPlanner } from "../planner.agent.js";

describe("Planner Agent", () => {
  let originalEnv;
  let consoleLogSpy;

  beforeEach(() => {
    originalEnv = { ...process.env };
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.env = originalEnv;
  });

  it("exports runPlanner function", () => {
    expect(typeof runPlanner).toBe("function");
  });

  it("logs context on successful run in dry-run mode", async () => {
    process.env.GITHUB_EVENT_NAME = "pull_request";

    await runPlanner({ dryRun: true });

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Starting planner agent (dry-run)"),
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Context: event=pull_request"),
    );
  });

  it("accepts dryRun option and respects it", async () => {
    process.env.GITHUB_EVENT_NAME = "push";

    await runPlanner({ dryRun: false });

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Starting planner agent (apply)"),
    );
  });

  it("defaults to dry-run when no options provided", async () => {
    process.env.GITHUB_EVENT_NAME = "push";

    await runPlanner();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Starting planner agent (dry-run)"),
    );
  });

  it("logs context with correct event name from environment", async () => {
    process.env.GITHUB_EVENT_NAME = "issues";

    await runPlanner({ dryRun: true });

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringMatching(/event=issues/),
    );
  });

  it("defaults to 'local' event when GITHUB_EVENT_NAME not set", async () => {
    delete process.env.GITHUB_EVENT_NAME;

    await runPlanner({ dryRun: true });

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringMatching(/event=local/),
    );
  });

  it("completes without errors", async () => {
    await expect(runPlanner({ dryRun: true })).resolves.not.toThrow();
  });

  it("includes repo root in context log", async () => {
    await runPlanner({ dryRun: true });

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("repoRoot="),
    );
  });

  it("logs completion message", async () => {
    await runPlanner({ dryRun: true });

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Planner agent finished without errors"),
    );
  });
});

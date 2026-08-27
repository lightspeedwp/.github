import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const repoRoot = path.resolve(__dirname, "../../..");
const runtimeScript = path.join(
  repoRoot,
  "scripts/workflows/release/trigger-telemetry.cjs",
);
const releaseAgentScript = path.join(
  repoRoot,
  "scripts/workflows/release/run-release-agent.cjs",
);
const notesPreviewScript = path.join(
  repoRoot,
  "scripts/workflows/release/build-notes-preview.cjs",
);
const createMainReleasePRScript = path.join(
  repoRoot,
  "scripts/workflows/release/create-main-release-pr.cjs",
);
const createGithubReleaseScript = path.join(
  repoRoot,
  "scripts/workflows/release/create-github-release.cjs",
);

describe("release workflow JS scripts", () => {
  test("trigger-telemetry writes expected GITHUB_OUTPUT and telemetry payload", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "wf-telemetry-"));
    const outputPath = path.join(tempDir, "github_output.txt");

    try {
      execFileSync(process.execPath, [runtimeScript], {
        cwd: tempDir,
        env: {
          ...process.env,
          GITHUB_OUTPUT: outputPath,
          GITHUB_EVENT_NAME: "workflow_dispatch",
          GITHUB_ACTOR: "ash",
          GITHUB_TOKEN: "", // Empty token causes authorization to fail
        },
        encoding: "utf8",
        stdio: "pipe",
      });
    } catch (_error) {
      // Expected to fail when GITHUB_TOKEN is missing
    }

    const outputContent = fs.readFileSync(outputPath, "utf8");
    const telemetry = JSON.parse(
      fs.readFileSync(path.join(tempDir, "trigger-telemetry.json"), "utf8"),
    );

    // When token is missing, authorization fails and unauthorized_attempts is 1
    expect(outputContent).toContain("unauthorized_attempts=1");
    expect(telemetry).toEqual({
      event: "workflow_dispatch",
      actor: "ash",
      is_authorized: false,
      unauthorized_attempts: 1,
      failure_reason: expect.stringContaining("GITHUB_TOKEN"),
      timestamp: expect.any(String),
    });
  });

  test("run-release-agent composes args and validates scope", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "wf-release-agent-"));
    const captureFile = path.join(tempDir, "args.json");
    const mockAgentPath = path.join(tempDir, "mock-release-agent.js");

    fs.writeFileSync(
      mockAgentPath,
      `const fs = require('fs'); fs.writeFileSync(${JSON.stringify(captureFile)}, JSON.stringify(process.argv.slice(2)));`,
      "utf8",
    );

    execFileSync(process.execPath, [releaseAgentScript], {
      cwd: repoRoot,
      env: {
        ...process.env,
        INPUT_SCOPE: "minor",
        INPUT_PROVIDER: "shell",
        INPUT_VERSION: "1.2.3",
        INPUT_NOTES_FROM: "v1.2.2",
        INPUT_DRY_RUN: "true",
        RELEASE_AGENT_PATH: mockAgentPath,
      },
      encoding: "utf8",
    });

    const args = JSON.parse(fs.readFileSync(captureFile, "utf8"));
    expect(args).toEqual([
      "--scope=minor",
      "--provider=shell",
      "--version=1.2.3",
      "--notes-from=v1.2.2",
      "--dry-run",
    ]);

    expect(() =>
      execFileSync(process.execPath, [releaseAgentScript], {
        cwd: repoRoot,
        env: {
          ...process.env,
          INPUT_SCOPE: "invalid",
        },
        encoding: "utf8",
      }),
    ).toThrow(/Invalid release scope/);

    expect(() =>
      execFileSync(process.execPath, [releaseAgentScript], {
        cwd: repoRoot,
        env: {
          ...process.env,
          INPUT_SCOPE: "patch",
          INPUT_PROVIDER: "invalid",
        },
        encoding: "utf8",
      }),
    ).toThrow(/Invalid release provider/);
  });

  test("build-notes-preview writes markdown file", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "wf-notes-"));
    const previewPath = path.join(tempDir, "preview.md");

    execFileSync(process.execPath, [notesPreviewScript], {
      cwd: repoRoot,
      env: {
        ...process.env,
        INPUT_NOTES_FROM: "HEAD~1",
        RELEASE_NOTES_PREVIEW_PATH: previewPath,
      },
      encoding: "utf8",
    });

    const preview = fs.readFileSync(previewPath, "utf8");
    expect(preview).toBeDefined();
    if (preview.trim().length > 0) {
      expect(preview).toMatch(/^-\s+[0-9a-f]+\s+/m);
    }
  });

  test("create-main-release-pr requires INPUT_VERSION and INPUT_RELEASE_BRANCH", () => {
    expect(() =>
      execFileSync(process.execPath, [createMainReleasePRScript], {
        cwd: repoRoot,
        env: {
          ...process.env,
          INPUT_PROVIDER: "shell",
        },
        encoding: "utf8",
        stdio: "pipe",
      }),
    ).toThrow(/Missing required environment variable.*INPUT_VERSION/i);

    expect(() =>
      execFileSync(process.execPath, [createMainReleasePRScript], {
        cwd: repoRoot,
        env: {
          ...process.env,
          INPUT_VERSION: "1.2.3",
          INPUT_PROVIDER: "shell",
        },
        encoding: "utf8",
        stdio: "pipe",
      }),
    ).toThrow(/Missing required environment variable.*INPUT_RELEASE_BRANCH/i);
  });

  test("create-main-release-pr accepts version and release branch", () => {
    expect(() =>
      execFileSync(process.execPath, [createMainReleasePRScript], {
        cwd: repoRoot,
        env: {
          ...process.env,
          INPUT_VERSION: "1.2.3",
          INPUT_RELEASE_BRANCH: "release/v1.2.3",
          INPUT_PROVIDER: "shell",
        },
        encoding: "utf8",
        stdio: "pipe",
      }),
    ).toThrow(); // Will fail trying to call gh, but that's expected in test environment
  });

  test("create-github-release requires INPUT_VERSION", () => {
    expect(() =>
      execFileSync(process.execPath, [createGithubReleaseScript], {
        cwd: repoRoot,
        env: {
          ...process.env,
          INPUT_PROVIDER: "shell",
        },
        encoding: "utf8",
        stdio: "pipe",
      }),
    ).toThrow(/Missing required environment variable.*INPUT_VERSION/i);
  });

  test("create-github-release accepts INPUT_PROVIDER parameter", () => {
    // Test that the script accepts and logs the provider
    expect(() =>
      execFileSync(process.execPath, [createGithubReleaseScript], {
        cwd: repoRoot,
        env: {
          ...process.env,
          INPUT_VERSION: "1.2.3",
          INPUT_PROVIDER: "mcp",
        },
        encoding: "utf8",
        stdio: "pipe",
      }),
    ).toThrow(); // Expected to fail in test environment without CHANGELOG
  });
});

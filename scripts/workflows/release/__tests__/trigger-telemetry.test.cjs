#!/usr/bin/env node
/* eslint-env node,jest */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Mock child_process and other dependencies
jest.mock("child_process");
jest.mock("fs");

describe("trigger-telemetry.cjs", () => {
  let mockLog;
  let mockWriteGithubOutput;
  let mockReadEnv;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    // Mock runtime utilities
    mockLog = jest.fn();
    mockWriteGithubOutput = jest.fn();
    mockReadEnv = jest.fn((key, opts) => {
      const defaults = {
        GITHUB_EVENT_NAME: "workflow_dispatch",
        GITHUB_ACTOR: "test-actor",
        GITHUB_TOKEN: "test-token",
      };
      return defaults[key] || opts?.defaultValue || "";
    });

    // Patch require for runtime utilities
    jest.doMock("../shared/runtime.cjs", () => ({
      readEnv: mockReadEnv,
      writeGithubOutput: mockWriteGithubOutput,
      log: mockLog,
      runMain: (fn) => fn().catch(console.error),
    }));
  });

  describe("authorization validation", () => {
    it("should authorize maintainer team members with active status", async () => {
      mockReadEnv.mockImplementation((key, opts) => {
        const values = {
          GITHUB_EVENT_NAME: "workflow_dispatch",
          GITHUB_ACTOR: "authorized-user",
          GITHUB_TOKEN: "test-token",
        };
        return values[key] || opts?.defaultValue || "";
      });

      execSync.mockReturnValue(
        JSON.stringify({ state: "active", url: "..." }),
      );
      fs.writeFileSync.mockImplementation(() => {});

      const { main } = require("../trigger-telemetry.cjs");
      await main();

      expect(mockWriteGithubOutput).toHaveBeenCalledWith(
        "is_authorized",
        "true",
      );
      expect(mockWriteGithubOutput).toHaveBeenCalledWith(
        "unauthorized_attempts",
        "0",
      );
      expect(mockLog).toHaveBeenCalledWith(
        "info",
        expect.stringContaining("Authorized"),
      );
    });

    it("should reject unauthorized users not in maintainers team", async () => {
      mockReadEnv.mockImplementation((key, opts) => {
        const values = {
          GITHUB_EVENT_NAME: "workflow_dispatch",
          GITHUB_ACTOR: "unauthorized-user",
          GITHUB_TOKEN: "test-token",
        };
        return values[key] || opts?.defaultValue || "";
      });

      execSync.mockReturnValue(
        JSON.stringify({ state: "inactive", url: "..." }),
      );
      fs.writeFileSync.mockImplementation(() => {});

      const { main } = require("../trigger-telemetry.cjs");
      await main();

      expect(mockWriteGithubOutput).toHaveBeenCalledWith(
        "is_authorized",
        "false",
      );
      expect(mockWriteGithubOutput).toHaveBeenCalledWith(
        "unauthorized_attempts",
        "1",
      );
      expect(mockLog).toHaveBeenCalledWith(
        "error",
        expect.stringContaining("not an active member"),
      );
    });

    it("should reject invalid trigger events", async () => {
      mockReadEnv.mockImplementation((key, opts) => {
        const values = {
          GITHUB_EVENT_NAME: "push", // Invalid event
          GITHUB_ACTOR: "test-user",
          GITHUB_TOKEN: "test-token",
        };
        return values[key] || opts?.defaultValue || "";
      });

      fs.writeFileSync.mockImplementation(() => {});

      const { main } = require("../trigger-telemetry.cjs");
      await main();

      expect(mockWriteGithubOutput).toHaveBeenCalledWith(
        "is_authorized",
        "false",
      );
      expect(mockLog).toHaveBeenCalledWith(
        "error",
        expect.stringContaining("Unauthorized trigger event"),
      );
    });

    it("should accept workflow_dispatch events", async () => {
      mockReadEnv.mockImplementation((key, opts) => {
        const values = {
          GITHUB_EVENT_NAME: "workflow_dispatch",
          GITHUB_ACTOR: "authorized-user",
          GITHUB_TOKEN: "test-token",
        };
        return values[key] || opts?.defaultValue || "";
      });

      execSync.mockReturnValue(
        JSON.stringify({ state: "active", url: "..." }),
      );
      fs.writeFileSync.mockImplementation(() => {});

      const { main } = require("../trigger-telemetry.cjs");
      await main();

      expect(mockWriteGithubOutput).toHaveBeenCalledWith(
        "is_authorized",
        "true",
      );
    });

    it("should accept workflow_call events", async () => {
      mockReadEnv.mockImplementation((key, opts) => {
        const values = {
          GITHUB_EVENT_NAME: "workflow_call",
          GITHUB_ACTOR: "authorized-user",
          GITHUB_TOKEN: "test-token",
        };
        return values[key] || opts?.defaultValue || "";
      });

      execSync.mockReturnValue(
        JSON.stringify({ state: "active", url: "..." }),
      );
      fs.writeFileSync.mockImplementation(() => {});

      const { main } = require("../trigger-telemetry.cjs");
      await main();

      expect(mockWriteGithubOutput).toHaveBeenCalledWith(
        "is_authorized",
        "true",
      );
    });

    it("should handle missing GITHUB_TOKEN", async () => {
      mockReadEnv.mockImplementation((key, opts) => {
        const values = {
          GITHUB_EVENT_NAME: "workflow_dispatch",
          GITHUB_ACTOR: "test-user",
          GITHUB_TOKEN: "", // Missing token
        };
        return values[key] || opts?.defaultValue || "";
      });

      fs.writeFileSync.mockImplementation(() => {});

      const { main } = require("../trigger-telemetry.cjs");
      await main();

      expect(mockWriteGithubOutput).toHaveBeenCalledWith(
        "is_authorized",
        "false",
      );
      expect(mockLog).toHaveBeenCalledWith(
        "error",
        expect.stringContaining("GITHUB_TOKEN"),
      );
    });

    it("should handle API errors gracefully", async () => {
      mockReadEnv.mockImplementation((key, opts) => {
        const values = {
          GITHUB_EVENT_NAME: "workflow_dispatch",
          GITHUB_ACTOR: "test-user",
          GITHUB_TOKEN: "test-token",
        };
        return values[key] || opts?.defaultValue || "";
      });

      execSync.mockImplementation(() => {
        throw new Error("GitHub API unreachable");
      });
      fs.writeFileSync.mockImplementation(() => {});

      const { main } = require("../trigger-telemetry.cjs");
      await main();

      expect(mockWriteGithubOutput).toHaveBeenCalledWith(
        "is_authorized",
        "false",
      );
      expect(mockLog).toHaveBeenCalledWith(
        "error",
        expect.stringContaining("Authorization check failed"),
      );
    });
  });

  describe("telemetry recording", () => {
    it("should write telemetry JSON with correct structure", async () => {
      mockReadEnv.mockImplementation((key, opts) => {
        const values = {
          GITHUB_EVENT_NAME: "workflow_dispatch",
          GITHUB_ACTOR: "test-user",
          GITHUB_TOKEN: "test-token",
        };
        return values[key] || opts?.defaultValue || "";
      });

      execSync.mockReturnValue(
        JSON.stringify({ state: "active", url: "..." }),
      );
      fs.writeFileSync.mockImplementation(() => {});

      const { main } = require("../trigger-telemetry.cjs");
      await main();

      expect(fs.writeFileSync).toHaveBeenCalled();
      const call = fs.writeFileSync.mock.calls[0];
      const payload = JSON.parse(call[1]);

      expect(payload).toHaveProperty("event", "workflow_dispatch");
      expect(payload).toHaveProperty("actor", "test-user");
      expect(payload).toHaveProperty("is_authorized");
      expect(payload).toHaveProperty("unauthorized_attempts");
      expect(payload).toHaveProperty("timestamp");
      expect(payload).toHaveProperty("failure_reason");
    });

    it("should record failure reason on authorization failure", async () => {
      mockReadEnv.mockImplementation((key, opts) => {
        const values = {
          GITHUB_EVENT_NAME: "push",
          GITHUB_ACTOR: "test-user",
          GITHUB_TOKEN: "test-token",
        };
        return values[key] || opts?.defaultValue || "";
      });

      fs.writeFileSync.mockImplementation(() => {});

      const { main } = require("../trigger-telemetry.cjs");
      await main();

      const call = fs.writeFileSync.mock.calls[0];
      const payload = JSON.parse(call[1]);

      expect(payload.failure_reason).toBeTruthy();
      expect(payload.is_authorized).toBe(false);
    });
  });

  describe("process exit handling", () => {
    it("should exit with code 1 if unauthorized", async () => {
      const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});

      mockReadEnv.mockImplementation((key, opts) => {
        const values = {
          GITHUB_EVENT_NAME: "push",
          GITHUB_ACTOR: "test-user",
          GITHUB_TOKEN: "test-token",
        };
        return values[key] || opts?.defaultValue || "";
      });

      fs.writeFileSync.mockImplementation(() => {});

      const { main } = require("../trigger-telemetry.cjs");
      await main();

      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockRestore();
    });

    it("should not exit if authorized", async () => {
      const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});

      mockReadEnv.mockImplementation((key, opts) => {
        const values = {
          GITHUB_EVENT_NAME: "workflow_dispatch",
          GITHUB_ACTOR: "authorized-user",
          GITHUB_TOKEN: "test-token",
        };
        return values[key] || opts?.defaultValue || "";
      });

      execSync.mockReturnValue(
        JSON.stringify({ state: "active", url: "..." }),
      );
      fs.writeFileSync.mockImplementation(() => {});

      const { main } = require("../trigger-telemetry.cjs");
      await main();

      expect(exitSpy).not.toHaveBeenCalled();

      exitSpy.mockRestore();
    });
  });
});

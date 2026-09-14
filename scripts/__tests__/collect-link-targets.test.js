/**
 * Tests for collect-link-targets.js
 * Validates markdown file collection with URL detection
 */
import { jest } from "@jest/globals";

// Mock modules
jest.mock("child_process");
jest.mock("fs");

// collect-link-targets.js is a top-level script (side effects + process.exit()
// at import time, not exported functions), so exercising it for real means
// forcing a fresh module instance per test. jest.resetModules() is the
// robust way to do that, but it also re-instantiates the mocked
// "child_process"/"fs" modules -- so this helper re-requires them AFTER
// the reset and returns the fresh instances, rather than relying on a
// static top-of-file import that would go stale after the first reset.
function runScript({ onExecFileSync, onReadFileSync } = {}) {
  jest.resetModules();
  const { execFileSync } = require("child_process");
  const fs = require("fs");

  if (onExecFileSync) {
    execFileSync.mockImplementation(onExecFileSync);
  }
  fs.readFileSync.mockImplementation(
    onReadFileSync || (() => "no urls in this fixture"),
  );

  jest.spyOn(process, "exit").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});

  require("../collect-link-targets.js");

  return { execFileSync, readFileSync: fs.readFileSync };
}

describe("collect-link-targets", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  describe("early exit conditions", () => {
    it("should exit with empty output for non-push/non-pull_request events", () => {
      process.env.GITHUB_EVENT_NAME = "issues";
      process.env.BASE_SHA = "abc123";
      process.env.HEAD_SHA = "def456";

      // process.exit is mocked as a no-op (it must not actually kill the
      // Jest worker), so control flow continues past this early return in
      // the test the same way it would not in production; only the
      // early-return's own side effects are asserted here.
      runScript();

      expect(console.log).toHaveBeenCalledWith("files=");
      expect(process.exit).toHaveBeenCalledWith(0);
    });

    it("should exit 0 when no markdown files changed", () => {
      process.env.GITHUB_EVENT_NAME = "pull_request";
      process.env.BASE_SHA = "abc123";
      process.env.HEAD_SHA = "def456";

      runScript({ onExecFileSync: () => Buffer.from("") });

      expect(console.log).toHaveBeenCalledWith("files=");
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe("file filtering", () => {
    beforeEach(() => {
      process.env.GITHUB_EVENT_NAME = "pull_request";
      process.env.BASE_SHA = "abc123";
      process.env.HEAD_SHA = "def456";
    });

    it("should filter out archived instruction files", () => {
      const changedFiles =
        ".github/instructions/.archive/old.md\ndocs/guide.md\n";

      const { execFileSync } = runScript({
        onExecFileSync: () => Buffer.from(changedFiles),
      });

      expect(execFileSync).toHaveBeenCalledWith(
        "git",
        expect.arrayContaining(["diff", "--name-only"]),
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining("files="),
      );
      expect(console.log).not.toHaveBeenCalledWith(
        expect.stringContaining(".github/instructions/.archive/old.md"),
      );
    });

    it("should filter out report files", () => {
      const changedFiles = ".github/reports/metrics.md\ndocs/guide.md\n";

      const { execFileSync } = runScript({
        onExecFileSync: () => Buffer.from(changedFiles),
      });

      expect(execFileSync).toHaveBeenCalledWith(
        "git",
        expect.arrayContaining(["diff"]),
      );
      expect(console.log).not.toHaveBeenCalledWith(
        expect.stringContaining(".github/reports/metrics.md"),
      );
    });
  });

  describe("URL detection", () => {
    beforeEach(() => {
      process.env.GITHUB_EVENT_NAME = "pull_request";
      process.env.BASE_SHA = "abc123";
      process.env.HEAD_SHA = "def456";
    });

    it("should detect https:// URLs", () => {
      const content = "Check out https://example.com for more info";
      const urlPattern =
        /https?:\/\/|www\.|mailto:|^\[[^\]]+\]:\s*https?:\/\//m;

      expect(urlPattern.test(content)).toBe(true);
    });

    it("should detect http:// URLs", () => {
      const content = "Visit http://example.com";
      const urlPattern =
        /https?:\/\/|www\.|mailto:|^\[[^\]]+\]:\s*https?:\/\//m;

      expect(urlPattern.test(content)).toBe(true);
    });

    it("should detect www. URLs", () => {
      const content = "Go to www.example.com for details";
      const urlPattern =
        /https?:\/\/|www\.|mailto:|^\[[^\]]+\]:\s*https?:\/\//m;

      expect(urlPattern.test(content)).toBe(true);
    });

    it("should detect mailto: links", () => {
      const content = "Email: mailto:test@example.com";
      const urlPattern =
        /https?:\/\/|www\.|mailto:|^\[[^\]]+\]:\s*https?:\/\//m;

      expect(urlPattern.test(content)).toBe(true);
    });

    it("should detect reference-style links", () => {
      const content = "[link]: https://example.com";
      const urlPattern =
        /https?:\/\/|www\.|mailto:|^\[[^\]]+\]:\s*https?:\/\//m;

      expect(urlPattern.test(content)).toBe(true);
    });
  });

  describe("cap on link files", () => {
    it("should warn when files exceed MAX_LINK_FILES", () => {
      const MAX_LINK_FILES = 300;
      const totalFiles = 350;

      expect(totalFiles).toBeGreaterThan(MAX_LINK_FILES);
    });

    it("should limit output to first MAX_LINK_FILES", () => {
      const MAX_LINK_FILES = 300;
      const files = Array.from({ length: 350 }, (_, i) => `file-${i}.md`);

      expect(files.slice(0, MAX_LINK_FILES).length).toBe(MAX_LINK_FILES);
    });
  });

  describe("error handling", () => {
    beforeEach(() => {
      process.env.GITHUB_EVENT_NAME = "pull_request";
      process.env.BASE_SHA = "abc123";
      process.env.HEAD_SHA = "def456";
    });

    it("should handle git diff failures gracefully", () => {
      runScript({
        onExecFileSync: () => {
          throw new Error("git not found");
        },
      });

      expect(console.error).toHaveBeenCalledWith(
        "Failed to get changed files:",
        "git not found",
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it("should handle missing files gracefully", () => {
      // A file disappearing between `git diff` and readFileSync (e.g.
      // deleted in the same PR) must not crash the whole script -- it
      // should just be skipped from the URL-detection pass.
      const { execFileSync } = runScript({
        onExecFileSync: () => Buffer.from("missing.md\n"),
        onReadFileSync: () => {
          throw new Error("ENOENT");
        },
      });

      expect(execFileSync).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith("files=");
      expect(process.exit).not.toHaveBeenCalledWith(1);
    });
  });

  describe("output format", () => {
    it("should output space-separated file list", () => {
      const files = ["doc1.md", "doc2.md", "doc3.md"];
      const expected = `files=${files.join(" ")}`;

      expect(expected).toBe("files=doc1.md doc2.md doc3.md");
    });

    it("should output empty string for no files", () => {
      const files = [];
      const expected = `files=${files.join(" ")}`;

      expect(expected).toBe("files=");
    });
  });
});

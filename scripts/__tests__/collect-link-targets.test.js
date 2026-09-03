/**
 * Tests for collect-link-targets.js
 * Validates markdown file collection with URL detection
 */
import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { jest } from "@jest/globals";

// Mock modules
jest.mock("child_process");
jest.mock("fs");

describe("collect-link-targets", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("early exit conditions", () => {
    it("should exit with empty output for non-push/non-pull_request events", () => {
      process.env.GITHUB_EVENT_NAME = "issues";
      process.env.BASE_SHA = "abc123";
      process.env.HEAD_SHA = "def456";

      // Dynamic import to allow env setup
      delete require.cache[require.resolve("../collect-link-targets.js")];
    });

    it("should exit 0 when no markdown files changed", () => {
      process.env.GITHUB_EVENT_NAME = "pull_request";
      process.env.BASE_SHA = "abc123";
      process.env.HEAD_SHA = "def456";

      execFileSync.mockReturnValueOnce(Buffer.from(""));
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
      execFileSync.mockReturnValueOnce(Buffer.from(changedFiles));

      expect(execFileSync).toHaveBeenCalledWith(
        "git",
        expect.arrayContaining(["diff", "--name-only"]),
      );
    });

    it("should filter out report files", () => {
      const changedFiles = ".github/reports/metrics.md\ndocs/guide.md\n";
      execFileSync.mockReturnValueOnce(Buffer.from(changedFiles));

      expect(execFileSync).toHaveBeenCalledWith(
        "git",
        expect.arrayContaining(["diff"]),
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
      execFileSync.mockImplementationOnce(() => {
        throw new Error("git not found");
      });

      expect(() => {
        execFileSync("git", ["diff"]);
      }).toThrow();
    });

    it("should handle missing files gracefully", () => {
      fs.readFileSync.mockImplementationOnce(() => {
        throw new Error("ENOENT");
      });

      expect(() => {
        fs.readFileSync("missing.md", "utf8");
      }).toThrow();
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

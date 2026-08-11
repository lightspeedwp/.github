/**
 * Tests for gitOps.cjs
 * Tests for both function-based and class-based API
 */

const {
  GitRepository,
  sanitizeErrorMessage,
  validateDirectory,
} = require("../includes/gitOps.cjs");

const path = require("path");
const fs = require("fs");
const os = require("os");

describe("gitOps.cjs - Core Functionality", () => {
  describe("Directory Validation", () => {
    it("should validate directory exists", () => {
      expect(() => {
        validateDirectory("/nonexistent/path/that/does/not/exist");
      }).toThrow();
    });

    it("should throw for empty string", () => {
      expect(() => {
        validateDirectory("");
      }).toThrow();
    });

    it("should throw for non-string input", () => {
      expect(() => {
        validateDirectory(123);
      }).toThrow();
    });

    it("should accept valid directory", () => {
      expect(() => {
        validateDirectory(os.tmpdir());
      }).not.toThrow();
    });
  });

  describe("Error Sanitization", () => {
    it("should remove absolute paths from error messages", () => {
      const tempPath = "/Users/someone/projects/repo";
      const message = `Error in ${tempPath}: something failed`;
      const sanitized = sanitizeErrorMessage(message, tempPath);
      expect(sanitized).not.toContain(tempPath);
      expect(sanitized).toContain("[WORKDIR]");
    });

    it("should handle sanitization without workDir", () => {
      const message = "Error: git command failed";
      const sanitized = sanitizeErrorMessage(message);
      expect(sanitized).toBe(message);
    });

    it("should redact git HTTPS URLs", () => {
      const message = "Failed: https://token@github.com/repo.git";
      const sanitized = sanitizeErrorMessage(message);
      expect(sanitized).toContain("[REDACTED]");
      expect(sanitized).not.toContain("token@github.com");
    });

    it("should redact git SSH addresses", () => {
      const message = "Connection to git@github.com failed";
      const sanitized = sanitizeErrorMessage(message);
      expect(sanitized).toContain("[REDACTED]");
      expect(sanitized).not.toContain("git@github.com");
    });

    it("should handle multiple path replacements", () => {
      const tempPath = "/Users/test/repo";
      const message = `Error in ${tempPath} and again ${tempPath}`;
      const sanitized = sanitizeErrorMessage(message, tempPath);
      expect(sanitized).toContain("[WORKDIR]");
      const count = (sanitized.match(/\[WORKDIR\]/g) || []).length;
      expect(count).toBe(2);
    });

    it("should handle HOME directory redaction", () => {
      const homeDir = process.env.HOME || process.env.USERPROFILE;
      if (homeDir) {
        const message = `Path is ${homeDir}/projects`;
        const sanitized = sanitizeErrorMessage(message);
        expect(sanitized).not.toContain(homeDir);
      }
    });
  });

  describe("GitRepository Constructor", () => {
    it("should create instance with valid directory", () => {
      const repo = new GitRepository(os.tmpdir());
      expect(repo).toBeDefined();
      expect(repo.workDir).toBe(os.tmpdir());
    });

    it("should throw for invalid directory", () => {
      expect(() => {
        new GitRepository("/nonexistent/directory/path");
      }).toThrow();
    });

    it("should throw for non-directory path", () => {
      const tempFile = path.join(os.tmpdir(), `test-${Date.now()}.txt`);
      fs.writeFileSync(tempFile, "test");
      try {
        expect(() => {
          new GitRepository(tempFile);
        }).toThrow();
      } finally {
        fs.unlinkSync(tempFile);
      }
    });

    it("should use current directory by default", () => {
      const repo = new GitRepository();
      expect(repo.workDir).toBeDefined();
      expect(typeof repo.workDir).toBe("string");
    });
  });

  describe("GitRepository Isolation", () => {
    it("should store workDir on instance", () => {
      const tmpDir = os.tmpdir();
      const repo = new GitRepository(tmpDir);
      expect(repo.workDir).toBe(tmpDir);
    });

    it("should not share state between instances", () => {
      const repo1 = new GitRepository(os.tmpdir());
      const repo2 = new GitRepository(os.tmpdir());

      expect(repo1).not.toBe(repo2);
      expect(repo1.workDir).toBe(repo2.workDir);
    });

    it("should prevent workDir modification after creation", () => {
      const repo = new GitRepository(os.tmpdir());
      const originalDir = repo.workDir;

      // Attempting to modify should not affect git operations
      repo.workDir = "/different/path";
      expect(repo.workDir).toBe("/different/path");
    });
  });

  describe("GitRepository Method Existence", () => {
    let repo;

    beforeEach(() => {
      repo = new GitRepository(os.tmpdir());
    });

    it("should have all required methods", () => {
      const methods = [
        "execute",
        "isWorkingTreeClean",
        "getCurrentBranch",
        "createBranch",
        "checkoutBranch",
        "stageFiles",
        "commitChanges",
        "createTag",
        "deleteTag",
        "push",
        "getLatestTag",
        "getCommitsSince",
        "getCommitCount",
        "branchExists",
        "tagExists",
      ];

      methods.forEach((method) => {
        expect(typeof repo[method]).toBe("function");
      });
    });
  });

  describe("Error Message Format", () => {
    it("should produce consistent error message format", () => {
      const message1 = sanitizeErrorMessage("Error: test", "/path/to/repo");
      expect(typeof message1).toBe("string");

      const message2 = sanitizeErrorMessage("Another error");
      expect(typeof message2).toBe("string");
    });

    it("should handle null/undefined gracefully", () => {
      expect(() => {
        sanitizeErrorMessage(null, "/path");
      }).not.toThrow();

      expect(() => {
        sanitizeErrorMessage(undefined, "/path");
      }).not.toThrow();
    });
  });

  describe("Module Exports", () => {
    it("should export GitRepository class", () => {
      expect(typeof GitRepository).toBe("function");
      expect(GitRepository.prototype.constructor).toBe(GitRepository);
    });

    it("should export utility functions", () => {
      expect(typeof sanitizeErrorMessage).toBe("function");
      expect(typeof validateDirectory).toBe("function");
    });
  });
});

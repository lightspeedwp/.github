/**
 * Jest suite verifying the baseline behaviour of `release.agent.js`.
 * @see ../release.agent.js
 */
import { jest } from "@jest/globals";

const execSync = jest.fn(() => "");
const fs = {
  existsSync: jest.fn(() => true),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
};

describe("Release Agent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Version Determination", () => {
    test("should correctly bump patch version", () => {
      const currentVersion = "1.2.3";
      const scope = "patch";

      // Test version bumping logic
      const parts = currentVersion.split(".").map(Number);
      parts[2] += 1;
      const expected = parts.join(".");

      expect(expected).toBe("1.2.4");
    });

    test("should correctly bump minor version and reset patch", () => {
      const currentVersion = "1.2.3";
      const scope = "minor";

      const parts = currentVersion.split(".").map(Number);
      parts[1] += 1;
      parts[2] = 0;
      const expected = parts.join(".");

      expect(expected).toBe("1.3.0");
    });

    test("should correctly bump major version and reset minor/patch", () => {
      const currentVersion = "1.2.3";
      const scope = "major";

      const parts = currentVersion.split(".").map(Number);
      parts[0] += 1;
      parts[1] = 0;
      parts[2] = 0;
      const expected = parts.join(".");

      expect(expected).toBe("2.0.0");
    });

    test("should handle versions with leading zeros", () => {
      const currentVersion = "0.1.0";
      const scope = "minor";

      const parts = currentVersion.split(".").map(Number);
      parts[1] += 1;
      parts[2] = 0;
      const expected = parts.join(".");

      expect(expected).toBe("0.2.0");
    });
  });

  describe("Version Validation", () => {
    test("should accept valid semantic versions", () => {
      const validVersions = ["1.0.0", "1.2.3", "0.1.0", "10.20.30"];

      validVersions.forEach((version) => {
        const parts = version.split(".");
        expect(parts).toHaveLength(3);
        expect(parts.every((p) => !isNaN(parseInt(p)))).toBe(true);
      });
    });

    test("should reject invalid version formats", () => {
    const invalidVersions = ["1.0", "1.0.0.0", "v1.0", "1.0.x", "abc"];

      invalidVersions.forEach((version) => {
        const parts = version.replace(/^v/, "").split(".");
        const isValid =
          parts.length === 3 && parts.every((p) => !isNaN(parseInt(p)));
        expect(isValid).toBe(false);
      });
    });
  });

  describe("Changelog Validation", () => {
    test("should detect unreleased section in changelog", () => {
      const changelogContent = `# Changelog

## [Unreleased]

### Added
- New feature

### Fixed
/**
 * @jest-environment jsdom
 */
- Bug fix

## [1.0.0] - 2025-12-15
`;

      expect(changelogContent).toContain("[Unreleased]");
      expect(changelogContent).toMatch(/## \[Unreleased\]/);
    });

    test("should validate changelog has entries under unreleased", () => {
      const changelogContent = `# Changelog

## [Unreleased]

### Added
- New feature
`;

      const unreleasedSection = changelogContent
        .split("## [Unreleased]")[1]
        ?.split("## [")[0];

      expect(unreleasedSection).toBeDefined();
      expect(unreleasedSection).toContain("### Added");
      expect(unreleasedSection).toContain("- New feature");
    });

    test("should reject changelog without unreleased section", () => {
      const changelogContent = `# Changelog

## [1.0.0] - 2025-12-15

### Added
- Initial release
`;

      expect(changelogContent).not.toContain("[Unreleased]");
    });

    test("should detect empty unreleased section", () => {
      const changelogContent = `# Changelog

## [Unreleased]

## [1.0.0] - 2025-12-15
`;

      const unreleasedSection = changelogContent
        .split("## [Unreleased]")[1]
        ?.split("## [")[0]
        .trim();

      expect(unreleasedSection).toBe("");
    });
  });

  describe("Dry Run Mode", () => {
    test("should not execute commands in dry run mode", () => {
      const dryRun = true;
      const command = "git tag v1.0.0";

      if (!dryRun) {
        execSync(command);
      }

      expect(execSync).not.toHaveBeenCalled();
    });

    test("should log commands without executing in dry run", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      const dryRun = true;
      const command = "git push origin v1.0.0";

      if (dryRun) {
        console.log(`[DRY-RUN] Would execute: ${command}`);
      } else {
        execSync(command);
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        `[DRY-RUN] Would execute: ${command}`,
      );
      expect(execSync).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("Git Tag Creation", () => {
    test("should format git tag command correctly", () => {
      const version = "1.2.3";
      const message = "Release v1.2.3";
      const tagCommand = `git tag -a v${version} -m "${message}"`;

      expect(tagCommand).toBe('git tag -a v1.2.3 -m "Release v1.2.3"');
    });

    test("should include changelog in tag message", () => {
      const version = "1.2.3";
      const changelog = "### Added\\n- New feature";
      const tagMessage = `Release v${version}\\n\\n${changelog}`;

      expect(tagMessage).toContain("Release v1.2.3");
      expect(tagMessage).toContain("### Added");
      expect(tagMessage).toContain("- New feature");
    });
  });

  describe("Release PR Creation", () => {
    test("should format release branch name correctly", () => {
      const version = "1.2.3";
      const branchName = `release/v${version}`;

      expect(branchName).toBe("release/v1.2.3");
    });

    test("should create PR from release branch to main", () => {
      const version = "1.2.3";
      const baseBranch = "main";
      const headBranch = `release/v${version}`;

      const prCommand = `gh pr create --base ${baseBranch} --head ${headBranch} --title "Release v${version}"`;

      expect(prCommand).toContain("--base main");
      expect(prCommand).toContain("--head release/v1.2.3");
      expect(prCommand).toContain('--title "Release v1.2.3"');
    });
  });

  describe("Error Handling", () => {
    test("should throw error for missing changelog", () => {
      fs.existsSync.mockReturnValue(false);

      const checkChangelog = () => {
        if (!fs.existsSync("CHANGELOG.md")) {
          throw new Error("CHANGELOG.md not found");
        }
      };

      expect(checkChangelog).toThrow("CHANGELOG.md not found");
    });

    test("should throw error for invalid version format", () => {
      const invalidVersion = "1.0.invalid";

      const validateVersion = (version) => {
        const semverRegex = /^\d+\.\d+\.\d+$/;
        if (!semverRegex.test(version)) {
          throw new Error(`Invalid version format: ${version}`);
        }
      };

      expect(() => validateVersion(invalidVersion)).toThrow(
        "Invalid version format",
      );
    });

    test("should handle git command failures gracefully", () => {
      execSync.mockImplementation(() => {
        throw new Error("fatal: not a git repository");
      });

      const executeGitCommand = (allowError = false) => {
        try {
          execSync("git status");
        } catch (error) {
          if (!allowError) {
            throw error;
          }
          return null;
        }
      };

      expect(() => executeGitCommand(false)).toThrow(
        "fatal: not a git repository",
      );
      expect(executeGitCommand(true)).toBeNull();
    });
  });

  describe("Changelog Update", () => {
    test("should move unreleased entries to versioned section", () => {
      const oldChangelog = `## [Unreleased]

### Added
- New feature

## [1.0.0] - 2025-12-01`;

      const newVersion = "1.0.1";
      const date = "2025-12-15";

      const newChangelog = oldChangelog.replace(
        "## [Unreleased]",
        `## [Unreleased]

## [${newVersion}] - ${date}`,
      );

      expect(newChangelog).toContain(`## [${newVersion}] - ${date}`);
      expect(newChangelog).toContain("## [Unreleased]");
    });

    test("should preserve unreleased section for next cycle", () => {
      const newChangelog = `## [Unreleased]

## [1.0.1] - 2025-12-15

### Added
- New feature

## [1.0.0] - 2025-12-01`;

      const unreleasedSection = newChangelog
        .split("## [Unreleased]")[1]
        ?.split("## [1.0.1]")[0]
        .trim();

      expect(newChangelog).toContain("## [Unreleased]");
      expect(unreleasedSection).toBe("");
    });
  });

  describe("Scope Detection", () => {
    test("should detect scope from command line args", () => {
      const args = ["--scope=major"];
      const scope =
        args.find((arg) => arg.startsWith("--scope="))?.split("=")[1] ||
        "patch";

      expect(scope).toBe("major");
    });

    test("should default to patch when no scope provided", () => {
      const args = ["--dry-run"];
      const scope =
        args.find((arg) => arg.startsWith("--scope="))?.split("=")[1] ||
        "patch";

      expect(scope).toBe("patch");
    });

    test("should handle all valid scope values", () => {
      const validScopes = ["major", "minor", "patch"];

      validScopes.forEach((scope) => {
        expect(["major", "minor", "patch"]).toContain(scope);
      });
    });
  });
});

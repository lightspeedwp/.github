/**
 * Jest suite for validate-changelog.cjs — exercises the CLI behaviour and
 * delegates to changelogUtils for parsing/validation assertions.
 * @see ../validate-changelog.cjs
 */
const path = require("path");
const fs = require("fs");
const os = require("os");
const { execFileSync } = require("child_process");

const scriptPath = path.join(__dirname, "../validate-changelog.cjs");
const changelogUtilsPath = path.join(
  __dirname,
  "../../agents/includes/changelogUtils.cjs",
);

const { parseChangelog, validateChangelog } = require(changelogUtilsPath);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function writeTempChangelog(content) {
  const file = path.join(os.tmpdir(), `vc-test-${Date.now()}.md`);
  fs.writeFileSync(file, content, "utf8");
  return file;
}

function runScript(args = [], env = {}) {
  try {
    const stdout = execFileSync(process.execPath, [scriptPath, ...args], {
      encoding: "utf8",
      env: { ...process.env, ...env },
    });
    return { code: 0, stdout };
  } catch (err) {
    return {
      code: err.status || 1,
      stdout: err.stdout || "",
      stderr: err.stderr || "",
    };
  }
}

const VALID_CHANGELOG = `# Changelog

## [Unreleased]

### Added

- Upcoming feature

## [1.0.0] - 2025-04-01

### Added

- Initial release
`;

const INVALID_CHANGELOG = `# Changelog

## [bad-version-format] - not-a-date

### UnknownSection

- Something
`;

// ---------------------------------------------------------------------------
// Script file presence
// ---------------------------------------------------------------------------

describe("validate-changelog.cjs", () => {
  test("script file exists", () => {
    expect(fs.existsSync(scriptPath)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// CLI — valid changelog
// ---------------------------------------------------------------------------

describe("validate-changelog CLI (valid changelog)", () => {
  let tmpFile;

  beforeAll(() => {
    tmpFile = writeTempChangelog(VALID_CHANGELOG);
  });

  afterAll(() => {
    if (tmpFile && fs.existsSync(tmpFile)) {
      fs.unlinkSync(tmpFile);
    }
  });

  test("exits 0 for a valid changelog", () => {
    const result = runScript([tmpFile]);
    expect(result.code).toBe(0);
  });

  test("prints validation success message", () => {
    const result = runScript([tmpFile]);
    expect(result.stdout).toMatch(/✓ Changelog is valid/);
  });

  test("reports release count in output", () => {
    const result = runScript([tmpFile]);
    expect(result.stdout).toMatch(/2 release/);
  });
});

// ---------------------------------------------------------------------------
// CLI — invalid changelog
// ---------------------------------------------------------------------------

describe("validate-changelog CLI (invalid changelog)", () => {
  let tmpFile;

  beforeAll(() => {
    tmpFile = writeTempChangelog(INVALID_CHANGELOG);
  });

  afterAll(() => {
    if (tmpFile && fs.existsSync(tmpFile)) {
      fs.unlinkSync(tmpFile);
    }
  });

  test("exits non-zero for an invalid changelog", () => {
    const result = runScript([tmpFile]);
    expect(result.code).not.toBe(0);
  });

  test("reports validation failure in output", () => {
    const result = runScript([tmpFile]);
    const output = result.stdout + result.stderr;
    expect(output).toMatch(/validation failed/i);
  });
});

// ---------------------------------------------------------------------------
// CLI — missing file
// ---------------------------------------------------------------------------

describe("validate-changelog CLI (missing file)", () => {
  test("exits non-zero when file does not exist", () => {
    const result = runScript(["/nonexistent/CHANGELOG.md"]);
    expect(result.code).not.toBe(0);
  });
});

// ---------------------------------------------------------------------------
// parseChangelog integration — section extraction
// ---------------------------------------------------------------------------

describe("parseChangelog section extraction", () => {
  test("extracts all standard section types", () => {
    const content = `# Changelog\n\n## [1.0.0] - 2025-06-01\n\n### Added\n\n- Added thing\n\n### Fixed\n\n- Fixed thing\n\n### Security\n\n- Security thing\n`;
    const tmpFile = writeTempChangelog(content);
    try {
      const data = parseChangelog(tmpFile);
      const release = data.releases.find((r) => r.version === "1.0.0");
      expect(release.sections.added).toContain("Added thing");
      expect(release.sections.fixed).toContain("Fixed thing");
      expect(release.sections.security).toContain("Security thing");
    } finally {
      fs.unlinkSync(tmpFile);
    }
  });

  test("ignores placeholder and empty list items", () => {
    const content = `# Changelog\n\n## [1.0.0] - 2025-06-01\n\n### Added\n\n- [placeholder]\n- Real item\n`;
    const tmpFile = writeTempChangelog(content);
    try {
      const data = parseChangelog(tmpFile);
      const release = data.releases.find((r) => r.version === "1.0.0");
      expect(release.sections.added).not.toContain("[placeholder]");
      expect(release.sections.added).toContain("Real item");
    } finally {
      fs.unlinkSync(tmpFile);
    }
  });
});

// ---------------------------------------------------------------------------
// validateChangelog — all valid section names
// ---------------------------------------------------------------------------

describe("validateChangelog — allowed section names", () => {
  const allowedSections = [
    "added",
    "changed",
    "deprecated",
    "removed",
    "fixed",
    "security",
    "documentation",
    "performance",
  ];

  allowedSections.forEach((section) => {
    test(`accepts '${section}' section`, () => {
      const result = validateChangelog({
        releases: [
          {
            version: "1.0.0",
            date: "2025-06-01",
            sections: { [section]: ["An entry"] },
          },
        ],
      });
      expect(result.valid).toBe(true);
    });
  });

  test("rejects unknown section name", () => {
    const result = validateChangelog({
      releases: [
        {
          version: "1.0.0",
          date: "2025-06-01",
          sections: { improvements: ["Something"] },
        },
      ],
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => /unknown section/i.test(e))).toBe(true);
  });
});

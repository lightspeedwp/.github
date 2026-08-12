/**
 * Jest suite for changelogUtils.cjs — covers parsing, validation, and
 * unreleased-change detection against the Keep a Changelog format.
 * @see ../changelogUtils.cjs
 */
const path = require("path");
const fs = require("fs");
const os = require("os");

const {
  parseChangelog,
  validateChangelog,
  getLatestRelease,
  getUnreleasedChanges,
  hasUnreleasedChanges,
} = require(path.join(__dirname, "../changelogUtils.cjs"));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function writeTempChangelog(content) {
  const file = path.join(os.tmpdir(), `cl-test-${Date.now()}.md`);
  fs.writeFileSync(file, content, "utf8");
  return file;
}

const FULL_CHANGELOG = `# Changelog

## [Unreleased]

### Added

- Upcoming feature

### Fixed

- Minor bug fix

## [1.2.0] - 2025-06-01

### Added

- Feature X
- Feature Y

### Changed

- Improved performance

## [1.1.0] - 2025-05-01

### Fixed

- Critical bug

## [1.0.0] - 2025-04-01

### Added

- Initial release
`;

const EMPTY_UNRELEASED_CHANGELOG = `# Changelog

## [Unreleased]

## [1.0.0] - 2025-04-01

### Added

- Initial release
`;

const NO_UNRELEASED_CHANGELOG = `# Changelog

## [1.0.0] - 2025-04-01

### Added

- Initial release
`;

// ---------------------------------------------------------------------------
// parseChangelog
// ---------------------------------------------------------------------------

describe("parseChangelog", () => {
  test("parses all release headers", () => {
    const tmpFile = writeTempChangelog(FULL_CHANGELOG);
    try {
      const data = parseChangelog(tmpFile);
      const versions = data.releases.map((r) => r.version);
      expect(versions).toContain("Unreleased");
      expect(versions).toContain("1.2.0");
      expect(versions).toContain("1.1.0");
      expect(versions).toContain("1.0.0");
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });

  test("extracts sections within a release", () => {
    const tmpFile = writeTempChangelog(FULL_CHANGELOG);
    try {
      const data = parseChangelog(tmpFile);
      const release = data.releases.find((r) => r.version === "1.2.0");
      expect(release.sections).toHaveProperty("added");
      expect(release.sections.added).toContain("Feature X");
      expect(release.sections.added).toContain("Feature Y");
      expect(release.sections).toHaveProperty("changed");
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });

  test("extracts Unreleased entries", () => {
    const tmpFile = writeTempChangelog(FULL_CHANGELOG);
    try {
      const data = parseChangelog(tmpFile);
      const unreleased = data.releases.find((r) => r.version === "Unreleased");
      expect(unreleased.sections.added).toContain("Upcoming feature");
      expect(unreleased.sections.fixed).toContain("Minor bug fix");
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });

  test("parses release dates", () => {
    const tmpFile = writeTempChangelog(FULL_CHANGELOG);
    try {
      const data = parseChangelog(tmpFile);
      const release = data.releases.find((r) => r.version === "1.2.0");
      expect(release.date).toBe("2025-06-01");
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });

  test("throws when file does not exist", () => {
    expect(() => parseChangelog("/nonexistent/CHANGELOG.md")).toThrow(
      /Changelog file not found/,
    );
  });

  test("returns format and semver metadata", () => {
    const tmpFile = writeTempChangelog(FULL_CHANGELOG);
    try {
      const data = parseChangelog(tmpFile);
      expect(data.format).toBe("keepachangelog");
      expect(data.semver).toBe(true);
    } finally {
      if (fs.existsSync(tmpFile)) {
        if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// validateChangelog
// ---------------------------------------------------------------------------

describe("validateChangelog", () => {
  test("passes for a valid changelog", () => {
    const tmpFile = writeTempChangelog(FULL_CHANGELOG);
    try {
      const data = parseChangelog(tmpFile);
      const result = validateChangelog(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });

  test("fails when releases array is missing", () => {
    const result = validateChangelog({});
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/releases array/i);
  });

  test("fails when releases array is empty", () => {
    const result = validateChangelog({ releases: [] });
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/at least one release/i);
  });

  test("fails for release missing a date", () => {
    const result = validateChangelog({
      releases: [{ version: "1.0.0", sections: {} }],
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => /missing date/i.test(e))).toBe(true);
  });

  test("fails for invalid date format", () => {
    const result = validateChangelog({
      releases: [{ version: "1.0.0", date: "01/06/2025", sections: {} }],
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => /invalid date/i.test(e))).toBe(true);
  });

  test("fails for unknown section name", () => {
    const result = validateChangelog({
      releases: [
        {
          version: "1.0.0",
          date: "2025-06-01",
          sections: { improvements: ["something"] },
        },
      ],
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => /unknown section/i.test(e))).toBe(true);
  });

  test("passes for Unreleased entry without a date", () => {
    const result = validateChangelog({
      releases: [
        { version: "Unreleased", sections: { added: ["WIP feature"] } },
        { version: "1.0.0", date: "2025-04-01", sections: {} },
      ],
    });
    expect(result.valid).toBe(true);
  });

  test("fails for version not matching semver or Unreleased", () => {
    const result = validateChangelog({
      releases: [{ version: "v1.0.0", date: "2025-06-01", sections: {} }],
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => /invalid version/i.test(e))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// getLatestRelease
// ---------------------------------------------------------------------------

describe("getLatestRelease", () => {
  test("returns the first non-unreleased entry", () => {
    const tmpFile = writeTempChangelog(FULL_CHANGELOG);
    try {
      const data = parseChangelog(tmpFile);
      const latest = getLatestRelease(data);
      expect(latest.version).toBe("1.2.0");
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });

  test("returns null when releases array is empty", () => {
    expect(getLatestRelease({ releases: [] })).toBeNull();
  });

  test("returns null when only Unreleased exists", () => {
    const content = `# Changelog\n\n## [Unreleased]\n\n### Added\n\n- thing\n`;
    const tmpFile = writeTempChangelog(content);
    try {
      const data = parseChangelog(tmpFile);
      expect(getLatestRelease(data)).toBeNull();
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });
});

// ---------------------------------------------------------------------------
// getUnreleasedChanges
// ---------------------------------------------------------------------------

describe("getUnreleasedChanges", () => {
  test("returns the Unreleased entry", () => {
    const tmpFile = writeTempChangelog(FULL_CHANGELOG);
    try {
      const data = parseChangelog(tmpFile);
      const unreleased = getUnreleasedChanges(data);
      expect(unreleased).not.toBeNull();
      expect(unreleased.version).toBe("Unreleased");
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });

  test("returns null when no Unreleased entry exists", () => {
    const tmpFile = writeTempChangelog(NO_UNRELEASED_CHANGELOG);
    try {
      const data = parseChangelog(tmpFile);
      expect(getUnreleasedChanges(data)).toBeNull();
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });
});

// ---------------------------------------------------------------------------
// hasUnreleasedChanges
// ---------------------------------------------------------------------------

describe("hasUnreleasedChanges", () => {
  test("returns true when Unreleased section has entries", () => {
    const tmpFile = writeTempChangelog(FULL_CHANGELOG);
    try {
      const data = parseChangelog(tmpFile);
      expect(hasUnreleasedChanges(data)).toBe(true);
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });

  test("returns false when Unreleased section exists but is empty", () => {
    const tmpFile = writeTempChangelog(EMPTY_UNRELEASED_CHANGELOG);
    try {
      const data = parseChangelog(tmpFile);
      expect(hasUnreleasedChanges(data)).toBe(false);
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });

  test("returns false when no Unreleased section exists", () => {
    const tmpFile = writeTempChangelog(NO_UNRELEASED_CHANGELOG);
    try {
      const data = parseChangelog(tmpFile);
      expect(hasUnreleasedChanges(data)).toBe(false);
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });

  test("returns false for empty releases array", () => {
    expect(hasUnreleasedChanges({ releases: [] })).toBe(false);
  });
});

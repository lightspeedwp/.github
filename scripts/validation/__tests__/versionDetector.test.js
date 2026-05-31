const {
  parseVersion,
  formatVersion,
  compareVersions,
  determineBumpType,
  calculateNextVersion,
  detectBump,
  suggestNextVersion,
} = require("../../agents/includes/versionDetector");

describe("versionDetector", () => {
  describe("parseVersion", () => {
    test("should parse valid version string", () => {
      const result = parseVersion("1.2.3");
      expect(result).toEqual({ major: 1, minor: 2, patch: 3 });
    });

    test("should parse version with v prefix", () => {
      const result = parseVersion("v2.0.0");
      expect(result).toEqual({ major: 2, minor: 0, patch: 0 });
    });

    test("should return null for invalid version", () => {
      expect(parseVersion("invalid")).toBeNull();
      expect(parseVersion("1.2")).toBeNull();
      expect(parseVersion(null)).toBeNull();
      expect(parseVersion("")).toBeNull();
    });

    test("should reject version substrings and pre-release strings", () => {
      expect(parseVersion("release-1.2.3")).toBeNull();
      expect(parseVersion("1.2.3-beta")).toBeNull();
    });
  });

  describe("formatVersion", () => {
    test("should format version object to string", () => {
      const version = { major: 1, minor: 2, patch: 3 };
      expect(formatVersion(version)).toBe("1.2.3");
    });

    test("should return null for invalid input", () => {
      expect(formatVersion(null)).toBeNull();
      expect(formatVersion({})).toBeNull();
      expect(formatVersion({ major: 1 })).toBeNull();
    });
  });

  describe("compareVersions", () => {
    test("should return -1 when first version is less", () => {
      const v1 = { major: 1, minor: 0, patch: 0 };
      const v2 = { major: 2, minor: 0, patch: 0 };
      expect(compareVersions(v1, v2)).toBe(-1);
    });

    test("should return 1 when first version is greater", () => {
      const v1 = { major: 2, minor: 0, patch: 0 };
      const v2 = { major: 1, minor: 0, patch: 0 };
      expect(compareVersions(v1, v2)).toBe(1);
    });

    test("should return 0 when versions are equal", () => {
      const v1 = { major: 1, minor: 2, patch: 3 };
      const v2 = { major: 1, minor: 2, patch: 3 };
      expect(compareVersions(v1, v2)).toBe(0);
    });

    test("should handle minor version comparison", () => {
      const v1 = { major: 1, minor: 2, patch: 0 };
      const v2 = { major: 1, minor: 3, patch: 0 };
      expect(compareVersions(v1, v2)).toBe(-1);
    });

    test("should handle patch version comparison", () => {
      const v1 = { major: 1, minor: 0, patch: 5 };
      const v2 = { major: 1, minor: 0, patch: 3 };
      expect(compareVersions(v1, v2)).toBe(1);
    });
  });

  describe("determineBumpType", () => {
    test("should return major for breaking changes", () => {
      const entries = { added: [] };
      const breakingChanges = ["API change"];
      expect(determineBumpType(entries, breakingChanges)).toBe("major");
    });

    test("should return major for removed section", () => {
      const entries = { removed: [{ description: "Old feature" }] };
      expect(determineBumpType(entries)).toBe("major");
    });

    test("should return minor for added features", () => {
      const entries = { added: [{ description: "New feature" }] };
      expect(determineBumpType(entries)).toBe("minor");
    });

    test("should return minor for deprecated items", () => {
      const entries = { deprecated: [{ description: "Old method" }] };
      expect(determineBumpType(entries)).toBe("minor");
    });

    test("should return patch for bug fixes", () => {
      const entries = { fixed: [{ description: "Bug fix" }] };
      expect(determineBumpType(entries)).toBe("patch");
    });

    test("should return patch for security fixes", () => {
      const entries = { security: [{ description: "Security fix" }] };
      expect(determineBumpType(entries)).toBe("patch");
    });

    test("should return null for no changes", () => {
      const entries = { added: [], fixed: [] };
      expect(determineBumpType(entries)).toBeNull();
    });

    test("should return null for invalid input", () => {
      expect(determineBumpType(null)).toBeNull();
      expect(determineBumpType({})).toBeNull();
    });
  });

  describe("calculateNextVersion", () => {
    test("should increment major version", () => {
      expect(calculateNextVersion("1.2.3", "major")).toBe("2.0.0");
    });

    test("should increment minor version", () => {
      expect(calculateNextVersion("1.2.3", "minor")).toBe("1.3.0");
    });

    test("should increment patch version", () => {
      expect(calculateNextVersion("1.2.3", "patch")).toBe("1.2.4");
    });

    test("should handle v prefix in input", () => {
      expect(calculateNextVersion("v1.2.3", "patch")).toBe("1.2.4");
    });

    test("should return null for invalid version", () => {
      expect(calculateNextVersion("invalid", "patch")).toBeNull();
    });

    test("should return null for invalid bump type", () => {
      expect(calculateNextVersion("1.2.3", "invalid")).toBeNull();
    });
  });

  describe("detectBump", () => {
    test("should detect major bump for breaking changes", () => {
      const entries = { added: [] };
      const breakingChanges = ["API change"];
      const result = detectBump(entries, breakingChanges);

      expect(result.bumpType).toBe("major");
      expect(result.hasBreakingChanges).toBe(true);
    });

    test("should detect minor bump for features", () => {
      const entries = { added: [{ description: "New feature" }] };
      const result = detectBump(entries);

      expect(result.bumpType).toBe("minor");
      expect(result.hasFeaturesOrDeprecations).toBe(true);
    });

    test("should detect patch bump for fixes", () => {
      const entries = { fixed: [{ description: "Bug fix" }] };
      const result = detectBump(entries);

      expect(result.bumpType).toBe("patch");
      expect(result.hasModifications).toBe(true);
    });

    test("should return null bump type for no changes", () => {
      const entries = {};
      const result = detectBump(entries);

      expect(result.bumpType).toBeNull();
      expect(result.hasBreakingChanges).toBe(false);
    });
  });

  describe("suggestNextVersion", () => {
    test("should suggest next patch version", () => {
      expect(suggestNextVersion("1.2.3")).toBe("1.2.4");
    });

    test("should handle version history", () => {
      const history = ["1.2.0", "1.1.0"];
      const result = suggestNextVersion("1.2.3", history);

      expect(result).toBe("1.2.4");
    });

    test("should return null for invalid version", () => {
      expect(suggestNextVersion("invalid")).toBeNull();
      expect(suggestNextVersion(null)).toBeNull();
    });

    test("should handle empty version history", () => {
      expect(suggestNextVersion("2.0.0", [])).toBe("2.0.1");
    });
  });
});

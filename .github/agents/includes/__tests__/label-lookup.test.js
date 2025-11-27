/**
 * ============================================================================
 * Tests for label-lookup utility functions
 * Location: .github/agents/includes/__tests__/label-lookup.test.js
 * Description:
 *   - Tests label lookup functions: fetchCanonicalLabels, buildLabelAliasMap, findStandardLabel
 *   - Uses shared helpers for consistent testing patterns
 *   - Coverage: label matching, alias resolution, canonical label lookup
 * Standards:
 *   - Follows [LightSpeedWP Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
 *   - Org instructions: [Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
 * Contribution:
 *   - Update docblock when expanding coverage or adding new helpers
 * ============================================================================
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const {
  fetchCanonicalLabels,
  buildLabelAliasMap,
  findStandardLabel,
} = require("../label-lookup");

describe("label-lookup.js", () => {
  // Create temporary test files
  const tempLabelsPath = path.join(__dirname, "temp-labels.yml");
  const tempLabelsComplexPath = path.join(__dirname, "temp-labels-complex.yml");

  beforeEach(() => {
    // Create simple test labels YAML file
    const simpleLabels = `
- bug
- enhancement
- documentation
- type:feature
        `;
    fs.writeFileSync(tempLabelsPath, simpleLabels.trim());

    // Create complex test labels YAML file with aliases
    const complexLabels = [
      { name: "bug", aliases: ["defect", "issue"] },
      { name: "enhancement", aliases: ["feature", "improvement"] },
      { name: "documentation", aliases: ["docs"] },
      { name: "type:frontend", aliases: ["ui", "frontend"] },
      { name: "type:backend", aliases: ["api", "backend"] },
    ];
    fs.writeFileSync(tempLabelsComplexPath, yaml.dump(complexLabels));
  });

  afterEach(() => {
    // Clean up temp files
    try {
      fs.unlinkSync(tempLabelsPath);
      fs.unlinkSync(tempLabelsComplexPath);
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe("fetchCanonicalLabels", () => {
    test("loads simple string labels from YAML", () => {
      const labels = fetchCanonicalLabels(tempLabelsPath);

      expect(labels).toBeInstanceOf(Set);
      expect(labels.has("bug")).toBe(true);
      expect(labels.has("enhancement")).toBe(true);
      expect(labels.has("documentation")).toBe(true);
      expect(labels.has("type:feature")).toBe(true);
      expect(labels.size).toBe(4);
    });

    test("loads object labels from YAML using name property", () => {
      const labels = fetchCanonicalLabels(tempLabelsComplexPath);

      expect(labels).toBeInstanceOf(Set);
      expect(labels.has("bug")).toBe(true);
      expect(labels.has("enhancement")).toBe(true);
      expect(labels.has("documentation")).toBe(true);
      expect(labels.has("type:frontend")).toBe(true);
      expect(labels.has("type:backend")).toBe(true);
      expect(labels.size).toBe(5);
    });

    test("uses default path when no path provided", () => {
      // Mock a labels.yml file in .github directory
      const defaultPath = ".github/labels.yml";
      const mockLabels = "- test-label\n- another-label";

      // Create directory if it doesn't exist
      if (!fs.existsSync(".github")) {
        fs.mkdirSync(".github", { recursive: true });
      }
      fs.writeFileSync(defaultPath, mockLabels);

      try {
        const labels = fetchCanonicalLabels();
        expect(labels.has("test-label")).toBe(true);
        expect(labels.has("another-label")).toBe(true);
      } finally {
        // Clean up
        try {
          fs.unlinkSync(defaultPath);
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    });

    test("throws error for non-existent file", () => {
      expect(() => {
        fetchCanonicalLabels("non-existent-file.yml");
      }).toThrow();
    });

    test("throws error for invalid YAML", () => {
      const invalidYamlPath = path.join(__dirname, "invalid.yml");
      fs.writeFileSync(invalidYamlPath, "invalid: yaml: content: [");

      try {
        expect(() => {
          fetchCanonicalLabels(invalidYamlPath);
        }).toThrow();
      } finally {
        fs.unlinkSync(invalidYamlPath);
      }
    });
  });

  describe("buildLabelAliasMap", () => {
    test("builds alias map from label objects with aliases", () => {
      const labelsData = [
        { name: "bug", aliases: ["defect", "issue"] },
        { name: "enhancement", aliases: ["feature", "improvement"] },
        { name: "documentation", aliases: ["docs"] },
      ];

      const aliasMap = buildLabelAliasMap(labelsData);

      expect(aliasMap.defect).toBe("bug");
      expect(aliasMap.issue).toBe("bug");
      expect(aliasMap.feature).toBe("enhancement");
      expect(aliasMap.improvement).toBe("enhancement");
      expect(aliasMap.docs).toBe("documentation");
    });

    test("ignores labels without aliases", () => {
      const labelsData = [
        { name: "bug", aliases: ["defect"] },
        { name: "enhancement" }, // No aliases
        "simple-string-label", // String label, not object
      ];

      const aliasMap = buildLabelAliasMap(labelsData);

      expect(aliasMap.defect).toBe("bug");
      expect(Object.keys(aliasMap)).toHaveLength(1);
    });

    test("handles empty labels array", () => {
      const aliasMap = buildLabelAliasMap([]);
      expect(Object.keys(aliasMap)).toHaveLength(0);
    });

    test("handles malformed label objects", () => {
      const labelsData = [
        { name: "bug", aliases: ["defect"] },
        { name: "enhancement", aliases: "not-an-array" }, // Invalid aliases
        { aliases: ["orphaned"] }, // No name
        null,
        undefined,
        "string-label",
      ];

      const aliasMap = buildLabelAliasMap(labelsData);

      expect(aliasMap.defect).toBe("bug");
      expect(Object.keys(aliasMap)).toHaveLength(1);
    });

    test("handles duplicate aliases", () => {
      const labelsData = [
        { name: "bug", aliases: ["issue"] },
        { name: "problem", aliases: ["issue"] }, // Duplicate alias
      ];

      const aliasMap = buildLabelAliasMap(labelsData);

      // Last one wins
      expect(aliasMap.issue).toBe("problem");
    });

    test("handles empty and null aliases in array", () => {
      const labelsData = [
        {
          name: "bug",
          aliases: ["defect", "", null, undefined, "issue"],
        },
      ];

      const aliasMap = buildLabelAliasMap(labelsData);

      expect(aliasMap.defect).toBe("bug");
      expect(aliasMap.issue).toBe("bug");
      expect(aliasMap[""]).toBeUndefined();
      expect(aliasMap.null).toBeUndefined();
    });
  });

  describe("findStandardLabel", () => {
    const canonicalSet = new Set([
      "bug",
      "enhancement",
      "documentation",
      "type:frontend",
    ]);
    const aliasMap = {
      defect: "bug",
      feature: "enhancement",
      docs: "documentation",
      ui: "type:frontend",
    };

    test("finds canonical labels directly", () => {
      expect(findStandardLabel("bug", aliasMap, canonicalSet)).toBe("bug");
      expect(findStandardLabel("enhancement", aliasMap, canonicalSet)).toBe(
        "enhancement",
      );
      expect(findStandardLabel("documentation", aliasMap, canonicalSet)).toBe(
        "documentation",
      );
      expect(findStandardLabel("type:frontend", aliasMap, canonicalSet)).toBe(
        "type:frontend",
      );
    });

    test("finds canonical labels through aliases", () => {
      expect(findStandardLabel("defect", aliasMap, canonicalSet)).toBe("bug");
      expect(findStandardLabel("feature", aliasMap, canonicalSet)).toBe(
        "enhancement",
      );
      expect(findStandardLabel("docs", aliasMap, canonicalSet)).toBe(
        "documentation",
      );
      expect(findStandardLabel("ui", aliasMap, canonicalSet)).toBe(
        "type:frontend",
      );
    });

    test("returns null for unknown labels", () => {
      expect(findStandardLabel("unknown", aliasMap, canonicalSet)).toBeNull();
      expect(
        findStandardLabel("nonexistent", aliasMap, canonicalSet),
      ).toBeNull();
      expect(findStandardLabel("", aliasMap, canonicalSet)).toBeNull();
    });

    test("handles null and undefined inputs", () => {
      expect(findStandardLabel(null, aliasMap, canonicalSet)).toBeNull();
      expect(findStandardLabel(undefined, aliasMap, canonicalSet)).toBeNull();
      expect(findStandardLabel("bug", null, canonicalSet)).toBe("bug");
      expect(findStandardLabel("bug", aliasMap, null)).toBeNull();
    });

    test("prioritizes canonical set over alias map", () => {
      // If a label exists in both canonical set and alias map, canonical should win
      const conflictSet = new Set(["defect"]);
      const conflictAliasMap = { defect: "bug" };

      expect(findStandardLabel("defect", conflictAliasMap, conflictSet)).toBe(
        "defect",
      );
    });

    test("handles empty canonical set and alias map", () => {
      expect(findStandardLabel("anything", {}, new Set())).toBeNull();
    });
  });

  describe("integration with real-world scenarios", () => {
    test("works with GitHub-style labels", () => {
      const githubLabels = [
        { name: "bug", aliases: ["type:bug"] },
        { name: "enhancement", aliases: ["type:enhancement"] },
        { name: "good first issue", aliases: ["beginner-friendly"] },
        { name: "help wanted", aliases: ["contributions-welcome"] },
      ];

      const canonicalSet = new Set(githubLabels.map((l) => l.name));
      const aliasMap = buildLabelAliasMap(githubLabels);

      expect(findStandardLabel("type:bug", aliasMap, canonicalSet)).toBe("bug");
      expect(
        findStandardLabel("beginner-friendly", aliasMap, canonicalSet),
      ).toBe("good first issue");
      expect(
        findStandardLabel("contributions-welcome", aliasMap, canonicalSet),
      ).toBe("help wanted");
    });

    test("works with LightSpeedWP-style labels", () => {
      const lightspeedLabels = [
        {
          name: "component:wordpress-core",
          aliases: ["wp-core", "core"],
        },
        {
          name: "area:accessibility",
          aliases: ["a11y", "accessibility"],
        },
        { name: "lang:php", aliases: ["php"] },
        { name: "priority:high", aliases: ["urgent", "critical"] },
      ];

      const canonicalSet = new Set(lightspeedLabels.map((l) => l.name));
      const aliasMap = buildLabelAliasMap(lightspeedLabels);

      expect(findStandardLabel("wp-core", aliasMap, canonicalSet)).toBe(
        "component:wordpress-core",
      );
      expect(findStandardLabel("a11y", aliasMap, canonicalSet)).toBe(
        "area:accessibility",
      );
      expect(findStandardLabel("php", aliasMap, canonicalSet)).toBe("lang:php");
      expect(findStandardLabel("urgent", aliasMap, canonicalSet)).toBe(
        "priority:high",
      );
    });

    test("handles mixed string and object label definitions", () => {
      // Simulate labels.yml with mixed string and object entries
      const mixedLabelsYaml = `
- bug
- enhancement
- name: documentation
  aliases: [docs]
- name: type:frontend
  aliases: [ui, frontend]
            `;

      const mixedPath = path.join(__dirname, "mixed-labels.yml");
      fs.writeFileSync(mixedPath, mixedLabelsYaml.trim());

      try {
        const canonicalSet = fetchCanonicalLabels(mixedPath);
        const labelsData = yaml.load(fs.readFileSync(mixedPath, "utf8"));
        const aliasMap = buildLabelAliasMap(labelsData);

        expect(canonicalSet.has("bug")).toBe(true);
        expect(canonicalSet.has("documentation")).toBe(true);
        expect(findStandardLabel("docs", aliasMap, canonicalSet)).toBe(
          "documentation",
        );
        expect(findStandardLabel("ui", aliasMap, canonicalSet)).toBe(
          "type:frontend",
        );
      } finally {
        fs.unlinkSync(mixedPath);
      }
    });
  });

  describe("error handling and edge cases", () => {
    test("handles file system errors gracefully", () => {
      // Test with a path that doesn't exist
      expect(() => {
        fetchCanonicalLabels("/nonexistent/path/labels.yml");
      }).toThrow();
    });

    test("handles YAML parsing errors", () => {
      const malformedYaml = path.join(__dirname, "malformed.yml");
      fs.writeFileSync(malformedYaml, "- valid\n  - invalid indentation");

      try {
        expect(() => {
          fetchCanonicalLabels(malformedYaml);
        }).toThrow();
      } finally {
        fs.unlinkSync(malformedYaml);
      }
    });

    test("handles very large label sets", () => {
      // Generate a large set of labels
      const largeLabels = [];
      for (let i = 0; i < 1000; i++) {
        largeLabels.push({
          name: `label-${i}`,
          aliases: [`alias-${i}`, `alt-${i}`],
        });
      }

      const largePath = path.join(__dirname, "large-labels.yml");
      fs.writeFileSync(largePath, yaml.dump(largeLabels));

      try {
        const start = Date.now();
        const canonicalSet = fetchCanonicalLabels(largePath);
        const aliasMap = buildLabelAliasMap(largeLabels);
        const processingTime = Date.now() - start;

        expect(canonicalSet.size).toBe(1000);
        expect(Object.keys(aliasMap)).toHaveLength(2000); // 2 aliases per label
        expect(processingTime).toBeLessThan(1000); // Should complete in under 1 second

        // Test lookup performance
        const lookupStart = Date.now();
        for (let i = 0; i < 100; i++) {
          findStandardLabel(`alias-${i}`, aliasMap, canonicalSet);
        }
        const lookupTime = Date.now() - lookupStart;
        expect(lookupTime).toBeLessThan(100); // 100 lookups in under 100ms
      } finally {
        fs.unlinkSync(largePath);
      }
    });
  });
});

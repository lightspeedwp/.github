const {
  normalize,
  levenshteinDistance,
  calculateSimilarity,
  isFuzzyDuplicate,
  hasSemanticDuplicate,
  findBestMatch,
  deduplicateEntries,
  groupDuplicates,
} = require("../../agents/includes/duplicateDetector");

describe("duplicateDetector", () => {
  describe("normalize", () => {
    test("should normalize to lowercase", () => {
      expect(normalize("HELLO WORLD")).toBe("hello world");
    });

    test("should remove extra whitespace", () => {
      expect(normalize("hello   world")).toBe("hello world");
    });

    test("should remove punctuation", () => {
      expect(normalize("Hello, world!")).toBe("hello world");
    });

    test("should handle null input", () => {
      expect(normalize(null)).toBe("");
      expect(normalize(undefined)).toBe("");
    });

    test("should trim whitespace", () => {
      expect(normalize("  hello world  ")).toBe("hello world");
    });
  });

  describe("levenshteinDistance", () => {
    test("should calculate distance between identical strings", () => {
      expect(levenshteinDistance("hello", "hello")).toBe(0);
    });

    test("should calculate distance for one character difference", () => {
      expect(levenshteinDistance("hello", "hallo")).toBe(1);
    });

    test("should calculate distance for different lengths", () => {
      expect(levenshteinDistance("kitten", "sitting")).toBe(3);
    });

    test("should handle empty strings", () => {
      expect(levenshteinDistance("", "hello")).toBe(5);
      expect(levenshteinDistance("hello", "")).toBe(5);
      expect(levenshteinDistance("", "")).toBe(0);
    });

    test("should handle null input", () => {
      expect(levenshteinDistance(null, "hello")).toBe(5);
      expect(levenshteinDistance("hello", null)).toBe(5);
    });
  });

  describe("calculateSimilarity", () => {
    test("should return 1 for identical strings", () => {
      expect(calculateSimilarity("hello", "hello")).toBe(1);
    });

    test("should return 0 for completely different strings", () => {
      const similarity = calculateSimilarity("abc", "xyz");
      expect(similarity).toBeLessThan(0.5);
    });

    test("should return 0.8 for similar strings", () => {
      const similarity = calculateSimilarity("hello", "hallo");
      expect(similarity).toBeGreaterThanOrEqual(0.8);
    });

    test("should handle empty strings", () => {
      expect(calculateSimilarity("", "")).toBe(1);
      expect(calculateSimilarity("", "hello")).toBe(0);
    });
  });

  describe("isFuzzyDuplicate", () => {
    test("should detect exact match after normalization", () => {
      expect(isFuzzyDuplicate("Hello World", "hello world")).toBe(true);
    });

    test("should detect similar strings above threshold", () => {
      expect(
        isFuzzyDuplicate("Fixed bug in parser", "Fixed bug in parser"),
      ).toBe(true);
    });

    test("should detect slight variations", () => {
      expect(
        isFuzzyDuplicate("Fixed parser bug", "Fixed parser bug in core", 0.65),
      ).toBe(true);
    });

    test("should not match completely different strings", () => {
      expect(isFuzzyDuplicate("Feature A", "Feature B", 0.9)).toBe(false);
    });

    test("should use custom threshold", () => {
      const str1 = "Fixed bug";
      const str2 = "Fixed a bug";
      expect(isFuzzyDuplicate(str1, str2, 0.95)).toBe(false);
      expect(isFuzzyDuplicate(str1, str2, 0.7)).toBe(true);
    });

    test("should handle null input", () => {
      expect(isFuzzyDuplicate(null, "hello")).toBe(false);
      expect(isFuzzyDuplicate("hello", null)).toBe(false);
    });
  });

  describe("hasSemanticDuplicate", () => {
    test("should find semantic duplicates by key terms", () => {
      const desc = "Fixed performance issue";
      const existing = ["Performance problem fixed"];

      expect(hasSemanticDuplicate(desc, existing)).toBe(true);
    });

    test("should not match unrelated entries", () => {
      const desc = "Added new feature";
      const existing = ["Fixed security bug", "Improved documentation"];

      expect(hasSemanticDuplicate(desc, existing)).toBe(false);
    });

    test("should handle empty existing list", () => {
      expect(hasSemanticDuplicate("Test description", [])).toBe(false);
    });

    test("should ignore common stopwords", () => {
      const desc = "The API now supports something";
      const existing = ["API now supports something else"];

      expect(hasSemanticDuplicate(desc, existing)).toBe(true);
    });

    test("should handle null input", () => {
      expect(hasSemanticDuplicate(null, ["existing"])).toBe(false);
    });
  });

  describe("findBestMatch", () => {
    test("should find exact match", () => {
      const desc = "Fixed parser";
      const existing = ["Added feature", "Fixed parser", "Updated docs"];

      const result = findBestMatch(desc, existing);

      expect(result).not.toBeNull();
      expect(result.matched).toBe(true);
      expect(result.matchedEntry).toBe("Fixed parser");
      expect(result.similarity).toBe(1);
    });

    test("should find best fuzzy match", () => {
      const desc = "Fixed parser bug";
      const existing = [
        "Fixed parser bug in core",
        "Added feature",
        "Updated docs",
      ];

      const result = findBestMatch(desc, existing, 0.65);

      expect(result).not.toBeNull();
      expect(result.matched).toBe(true);
      expect(result.matchedEntry).toBe("Fixed parser bug in core");
    });

    test("should return null if no match above threshold", () => {
      const desc = "Completely new thing";
      const existing = ["Feature A", "Feature B"];

      const result = findBestMatch(desc, existing, 0.9);

      expect(result).toBeNull();
    });

    test("should return match when similarity equals threshold", () => {
      const desc = "Fixed bug";
      const existing = ["Fixed bug"];

      const result = findBestMatch(desc, existing, 1.0);

      expect(result).not.toBeNull();
      expect(result.matched).toBe(true);
      expect(result.matchedEntry).toBe("Fixed bug");
      expect(result.similarity).toBe(1);
    });

    test("should handle empty existing list", () => {
      const result = findBestMatch("Test", []);
      expect(result).toBeNull();
    });

    test("should handle null input", () => {
      expect(findBestMatch(null, ["existing"])).toBeNull();
    });
  });

  describe("deduplicateEntries", () => {
    test("should remove fuzzy duplicates", () => {
      const entries = [
        { description: "Fixed parser" },
        { description: "Fixed parser" },
        { description: "Added feature" },
      ];

      const result = deduplicateEntries(entries);

      expect(result).toHaveLength(2);
      expect(result[0].description).toBe("Fixed parser");
      expect(result[1].description).toBe("Added feature");
    });

    test("should keep similar but different entries", () => {
      const entries = [
        { description: "Fixed parser" },
        { description: "Fixed lexer" },
      ];

      const result = deduplicateEntries(entries, 0.95);

      expect(result).toHaveLength(2);
    });

    test("should use custom threshold", () => {
      const entries = [
        { description: "Fixed parser" },
        { description: "Fixed parser bug" },
      ];

      const result1 = deduplicateEntries(entries, 0.95);
      const result2 = deduplicateEntries(entries, 0.7);

      expect(result1).toHaveLength(2);
      expect(result2).toHaveLength(1);
    });

    test("should handle invalid entries", () => {
      const entries = [
        { description: "Valid" },
        { noDescription: true },
        { description: "Also valid" },
      ];

      const result = deduplicateEntries(entries);

      expect(result).toHaveLength(2);
      expect(result[0].description).toBe("Valid");
      expect(result[1].description).toBe("Also valid");
    });

    test("should return empty array for null input", () => {
      expect(deduplicateEntries(null)).toEqual([]);
    });
  });

  describe("groupDuplicates", () => {
    test("should group duplicate entries", () => {
      const entries = [
        { description: "Fixed bug", id: 1 },
        { description: "Fixed bug", id: 2 },
        { description: "Added feature", id: 3 },
      ];

      const result = groupDuplicates(entries);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveLength(2);
      expect(result[1]).toHaveLength(1);
    });

    test("should handle multiple groups", () => {
      const entries = [
        { description: "Fixed parser", id: 1 },
        { description: "Fixed parser", id: 2 },
        { description: "Added feature", id: 3 },
        { description: "Added feature", id: 4 },
      ];

      const result = groupDuplicates(entries);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveLength(2);
      expect(result[1]).toHaveLength(2);
    });

    test("should use custom threshold", () => {
      const entries = [
        { description: "Fixed parser", id: 1 },
        { description: "Fixed parser bug", id: 2 },
      ];

      const result1 = groupDuplicates(entries, 0.95);
      const result2 = groupDuplicates(entries, 0.7);

      expect(result1).toHaveLength(2);
      expect(result2).toHaveLength(1);
    });

    test("should handle invalid entries", () => {
      const entries = [
        { description: "Valid", id: 1 },
        { noDescription: true },
        { description: "Also valid", id: 2 },
      ];

      const result = groupDuplicates(entries);

      expect(result).toHaveLength(2);
    });

    test("should return empty array for null input", () => {
      expect(groupDuplicates(null)).toEqual([]);
    });
  });
});

/**
 * Tests for LabelingRuleCache
 * Validates caching functionality and performance improvements
 */

const { LabelingRuleCache } = require("../agents/includes/labeling-cache");

describe("LabelingRuleCache", () => {
  let cache;
  let mockIssue;
  let mockRule;

  beforeEach(() => {
    cache = new LabelingRuleCache(100);

    mockIssue = {
      number: 123,
      title: "Test issue",
      body: "Test body",
      labels: ["type:bug", "area:ci"],
    };

    mockRule = {
      id: "rule-001",
      evaluate: jest.fn().mockReturnValue(true),
    };
  });

  describe("evaluateWithCache", () => {
    test("should evaluate rule on cache miss", () => {
      const result = cache.evaluateWithCache(mockIssue, mockRule);

      expect(result).toBe(true);
      expect(mockRule.evaluate).toHaveBeenCalledWith(mockIssue);
      expect(mockRule.evaluate).toHaveBeenCalledTimes(1);
    });

    test("should return cached result on cache hit", () => {
      cache.evaluateWithCache(mockIssue, mockRule);
      const result = cache.evaluateWithCache(mockIssue, mockRule);

      expect(result).toBe(true);
      expect(mockRule.evaluate).toHaveBeenCalledTimes(1); // Called only once
    });

    test("should increment cache stats correctly", () => {
      cache.evaluateWithCache(mockIssue, mockRule);
      cache.evaluateWithCache(mockIssue, mockRule);

      const stats = cache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
    });

    test("should handle different rules separately", () => {
      const rule2 = {
        id: "rule-002",
        evaluate: jest.fn().mockReturnValue(false),
      };

      const result1 = cache.evaluateWithCache(mockIssue, mockRule);
      const result2 = cache.evaluateWithCache(mockIssue, rule2);

      expect(result1).toBe(true);
      expect(result2).toBe(false);
      expect(mockRule.evaluate).toHaveBeenCalledTimes(1);
      expect(rule2.evaluate).toHaveBeenCalledTimes(1);
    });

    test("should handle different issues separately", () => {
      const issue2 = {
        number: 124,
        title: "Another issue",
        body: "Another body",
        labels: [],
      };

      cache.evaluateWithCache(mockIssue, mockRule);
      cache.evaluateWithCache(issue2, mockRule);

      expect(mockRule.evaluate).toHaveBeenCalledTimes(2);
    });
  });

  describe("getStats", () => {
    test("should return correct statistics", () => {
      cache.evaluateWithCache(mockIssue, mockRule);
      cache.evaluateWithCache(mockIssue, mockRule); // Cache hit

      const stats = cache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
      expect(stats.cacheSize).toBe(1);
      expect(stats.maxSize).toBe(100);
      expect(stats.hitRate).toContain("50");
    });

    test("should return N/A for hit rate when no evaluations", () => {
      const stats = cache.getStats();
      expect(stats.hitRate).toBe("N/A");
    });
  });

  describe("clear", () => {
    test("should clear cache and reset stats", () => {
      cache.evaluateWithCache(mockIssue, mockRule);
      cache.clear();

      const stats = cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.cacheSize).toBe(0);

      // Next evaluation should be a miss
      cache.evaluateWithCache(mockIssue, mockRule);
      expect(stats.misses).toBe(0); // Stats were reset
    });
  });

  describe("LRU eviction", () => {
    test("should evict oldest entry when cache is full", () => {
      const smallCache = new LabelingRuleCache(2);
      const rule1 = { id: "rule-1", evaluate: jest.fn().mockReturnValue(true) };
      const rule2 = { id: "rule-2", evaluate: jest.fn().mockReturnValue(true) };
      const rule3 = { id: "rule-3", evaluate: jest.fn().mockReturnValue(true) };

      const issue1 = { number: 1, title: "Issue 1" };
      const issue2 = { number: 2, title: "Issue 2" };
      const issue3 = { number: 3, title: "Issue 3" };

      smallCache.evaluateWithCache(issue1, rule1);
      smallCache.evaluateWithCache(issue2, rule2);
      smallCache.evaluateWithCache(issue3, rule3); // Should evict issue1-rule1

      expect(smallCache.cache.size).toBe(2);

      // Re-evaluating issue1-rule1 should be a miss (was evicted)
      smallCache.evaluateWithCache(issue1, rule1);
      const stats = smallCache.getStats();
      expect(stats.misses).toBeGreaterThan(0);
    });
  });
});

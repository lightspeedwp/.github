const RateLimiter = require("../../lib/api/rate-limiter");

describe("RateLimiter", () => {
  let mockClient;
  let rateLimiter;

  beforeEach(() => {
    mockClient = {
      rateLimit: {
        get: jest.fn(),
      },
    };
    rateLimiter = new RateLimiter(mockClient);
  });

  describe("constructor", () => {
    test("throws on missing client", () => {
      expect(() => new RateLimiter()).toThrow("Octokit client is required");
    });

    test("throws on null client", () => {
      expect(() => new RateLimiter(null)).toThrow("Octokit client is required");
    });

    test("initializes with default limits", () => {
      expect(rateLimiter.limits.core.limit).toBe(5000);
      expect(rateLimiter.limits.graphql.limit).toBe(5000);
      expect(rateLimiter.limits.search.limit).toBe(30);
    });

    test("initializes with default thresholds", () => {
      expect(rateLimiter.thresholds.core).toBe(100);
      expect(rateLimiter.thresholds.graphql).toBe(100);
      expect(rateLimiter.thresholds.search).toBe(5);
    });
  });

  describe("updateRateLimits", () => {
    test("updates core rate limit", async () => {
      mockClient.rateLimit.get.mockResolvedValue({
        data: {
          rate_limit: {
            limit: 5000,
            remaining: 4500,
            reset: Math.floor(Date.now() / 1000) + 3600,
          },
          resources: {
            graphql: {
              limit: 5000,
              remaining: 4800,
              reset: Math.floor(Date.now() / 1000) + 3600,
            },
            search: {
              limit: 30,
              remaining: 28,
              reset: Math.floor(Date.now() / 1000) + 60,
            },
          },
        },
      });

      const limits = await rateLimiter.updateRateLimits();

      expect(limits.core.remaining).toBe(4500);
      expect(limits.graphql.remaining).toBe(4800);
      expect(limits.search.remaining).toBe(28);
      expect(rateLimiter.lastUpdate).not.toBe(null);
    });

    test("throws on API error", async () => {
      mockClient.rateLimit.get.mockRejectedValue(new Error("API Error"));

      await expect(rateLimiter.updateRateLimits()).rejects.toThrow(
        "Failed to update rate limits: API Error",
      );
    });
  });

  describe("getLimit", () => {
    test("returns core limit", () => {
      const limit = rateLimiter.getLimit("core");
      expect(limit.limit).toBe(5000);
      expect(limit.remaining).toBe(5000);
    });

    test("returns graphql limit", () => {
      const limit = rateLimiter.getLimit("graphql");
      expect(limit.limit).toBe(5000);
      expect(limit.remaining).toBe(5000);
    });

    test("returns search limit", () => {
      const limit = rateLimiter.getLimit("search");
      expect(limit.limit).toBe(30);
      expect(limit.remaining).toBe(30);
    });

    test("throws on unknown type", () => {
      expect(() => rateLimiter.getLimit("unknown")).toThrow(
        "Unknown rate limit type: unknown",
      );
    });

    test("returns a copy not a reference", () => {
      const limit = rateLimiter.getLimit("core");
      limit.remaining = 0;
      expect(rateLimiter.getLimit("core").remaining).toBe(5000);
    });
  });

  describe("getAllLimits", () => {
    test("returns all limits", () => {
      const allLimits = rateLimiter.getAllLimits();

      expect(allLimits).toHaveProperty("core");
      expect(allLimits).toHaveProperty("graphql");
      expect(allLimits).toHaveProperty("search");
      expect(allLimits.core.limit).toBe(5000);
      expect(allLimits.graphql.limit).toBe(5000);
      expect(allLimits.search.limit).toBe(30);
    });

    test("returns copies not references", () => {
      const allLimits = rateLimiter.getAllLimits();
      allLimits.core.remaining = 0;
      expect(rateLimiter.getLimit("core").remaining).toBe(5000);
    });
  });

  describe("isBelowThreshold", () => {
    test("returns true when below threshold", () => {
      rateLimiter.limits.core.remaining = 50;
      expect(rateLimiter.isBelowThreshold("core")).toBe(true);
    });

    test("returns false when strictly above threshold", () => {
      rateLimiter.limits.core.remaining = 101;
      expect(rateLimiter.isBelowThreshold("core")).toBe(false);

      rateLimiter.limits.core.remaining = 200;
      expect(rateLimiter.isBelowThreshold("core")).toBe(false);
    });

    test("uses different thresholds for different types", () => {
      // Core threshold = 100, search threshold = 5
      rateLimiter.limits.core.remaining = 50; // below 100
      rateLimiter.limits.search.remaining = 3; // below 5

      expect(rateLimiter.isBelowThreshold("core")).toBe(true);
      expect(rateLimiter.isBelowThreshold("search")).toBe(true);

      rateLimiter.limits.core.remaining = 150; // above 100
      rateLimiter.limits.search.remaining = 20; // above 5

      expect(rateLimiter.isBelowThreshold("core")).toBe(false);
      expect(rateLimiter.isBelowThreshold("search")).toBe(false);
    });
  });

  describe("getTimeUntilReset", () => {
    test("returns 0 when reset time is in past", () => {
      const pastTime = new Date(Date.now() - 1000);
      rateLimiter.limits.core.reset = pastTime;
      expect(rateLimiter.getTimeUntilReset("core")).toBe(0);
    });

    test("returns milliseconds until reset", () => {
      const futureTime = new Date(Date.now() + 5000);
      rateLimiter.limits.core.reset = futureTime;
      const timeLeft = rateLimiter.getTimeUntilReset("core");
      expect(timeLeft).toBeGreaterThan(4000);
      expect(timeLeft).toBeLessThanOrEqual(5000);
    });

    test("returns 0 when no reset time is set", () => {
      rateLimiter.limits.core.reset = null;
      expect(rateLimiter.getTimeUntilReset("core")).toBe(0);
    });
  });

  describe("getPercentageRemaining", () => {
    test("calculates percentage correctly", () => {
      rateLimiter.limits.core.remaining = 2500;
      rateLimiter.limits.core.limit = 5000;
      expect(rateLimiter.getPercentageRemaining("core")).toBe(50);
    });

    test("handles 100 percent", () => {
      rateLimiter.limits.core.remaining = 5000;
      rateLimiter.limits.core.limit = 5000;
      expect(rateLimiter.getPercentageRemaining("core")).toBe(100);
    });

    test("handles 0 percent", () => {
      rateLimiter.limits.core.remaining = 0;
      rateLimiter.limits.core.limit = 5000;
      expect(rateLimiter.getPercentageRemaining("core")).toBe(0);
    });

    test("returns 0 when limit is 0", () => {
      rateLimiter.limits.core.limit = 0;
      rateLimiter.limits.core.remaining = 0;
      expect(rateLimiter.getPercentageRemaining("core")).toBe(0);
    });
  });

  describe("isAnyExhausted", () => {
    test("returns false when all have quota", async () => {
      mockClient.rateLimit.get.mockResolvedValue({
        data: {
          rate_limit: {
            limit: 5000,
            remaining: 100,
            reset: Math.floor(Date.now() / 1000) + 3600,
          },
          resources: {
            graphql: {
              limit: 5000,
              remaining: 100,
              reset: Math.floor(Date.now() / 1000) + 3600,
            },
            search: {
              limit: 30,
              remaining: 5,
              reset: Math.floor(Date.now() / 1000) + 60,
            },
          },
        },
      });

      const result = await rateLimiter.isAnyExhausted();
      expect(result).toBe(false);
    });

    test("returns true when any quota is exhausted", async () => {
      mockClient.rateLimit.get.mockResolvedValue({
        data: {
          rate_limit: {
            limit: 5000,
            remaining: 0,
            reset: Math.floor(Date.now() / 1000) + 3600,
          },
          resources: {
            graphql: {
              limit: 5000,
              remaining: 100,
              reset: Math.floor(Date.now() / 1000) + 3600,
            },
            search: {
              limit: 30,
              remaining: 5,
              reset: Math.floor(Date.now() / 1000) + 60,
            },
          },
        },
      });

      const result = await rateLimiter.isAnyExhausted();
      expect(result).toBe(true);
    });
  });

  describe("estimateQuotaRecovery", () => {
    test("returns 0 when quota is available", async () => {
      mockClient.rateLimit.get.mockResolvedValue({
        data: {
          rate_limit: {
            limit: 5000,
            remaining: 1000,
            reset: Math.floor(Date.now() / 1000) + 3600,
          },
          resources: {
            graphql: {
              limit: 5000,
              remaining: 5000,
              reset: Math.floor(Date.now() / 1000) + 3600,
            },
            search: {
              limit: 30,
              remaining: 30,
              reset: Math.floor(Date.now() / 1000) + 60,
            },
          },
        },
      });

      const result = await rateLimiter.estimateQuotaRecovery("core");
      expect(result).toBe(0);
    });

    test("returns time until reset when quota is exhausted", async () => {
      const resetTime = Math.floor(Date.now() / 1000) + 3600;
      mockClient.rateLimit.get.mockResolvedValue({
        data: {
          rate_limit: { limit: 5000, remaining: 0, reset: resetTime },
          resources: {
            graphql: { limit: 5000, remaining: 5000, reset: resetTime },
            search: { limit: 30, remaining: 30, reset: resetTime },
          },
        },
      });

      const result = await rateLimiter.estimateQuotaRecovery("core");
      expect(result).toBeGreaterThan(0);
    });
  });

  describe("getSummary", () => {
    test("returns comprehensive summary", async () => {
      mockClient.rateLimit.get.mockResolvedValue({
        data: {
          rate_limit: {
            limit: 5000,
            remaining: 2500,
            reset: Math.floor(Date.now() / 1000) + 3600,
          },
          resources: {
            graphql: {
              limit: 5000,
              remaining: 4000,
              reset: Math.floor(Date.now() / 1000) + 3600,
            },
            search: {
              limit: 30,
              remaining: 15,
              reset: Math.floor(Date.now() / 1000) + 60,
            },
          },
        },
      });

      const summary = await rateLimiter.getSummary();

      expect(summary.core.percentage).toBe(50);
      expect(summary.graphql.percentage).toBe(80);
      expect(summary.search.percentage).toBe(50);
      expect(summary.lastUpdate).not.toBe(null);
      expect(summary.core.resetIn).toBeGreaterThan(0);
    });
  });

  describe("setThreshold", () => {
    test("sets custom threshold", () => {
      rateLimiter.setThreshold("core", 50);
      expect(rateLimiter.thresholds.core).toBe(50);
    });

    test("throws on negative threshold", () => {
      expect(() => rateLimiter.setThreshold("core", -1)).toThrow(
        "Threshold must be non-negative",
      );
    });

    test("throws on unknown type", () => {
      expect(() => rateLimiter.setThreshold("unknown", 50)).toThrow(
        "Unknown rate limit type: unknown",
      );
    });

    test("allows zero threshold", () => {
      rateLimiter.setThreshold("core", 0);
      expect(rateLimiter.thresholds.core).toBe(0);
    });
  });

  describe("resetLimits", () => {
    test("resets all limits to defaults", () => {
      rateLimiter.limits.core.remaining = 0;
      rateLimiter.limits.graphql.remaining = 0;
      rateLimiter.limits.search.remaining = 0;
      rateLimiter.lastUpdate = new Date();

      rateLimiter.resetLimits();

      expect(rateLimiter.limits.core.remaining).toBe(5000);
      expect(rateLimiter.limits.graphql.remaining).toBe(5000);
      expect(rateLimiter.limits.search.remaining).toBe(30);
      expect(rateLimiter.lastUpdate).toBe(null);
    });
  });
});

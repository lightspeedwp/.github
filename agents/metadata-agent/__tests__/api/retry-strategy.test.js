const RetryStrategy = require("../../lib/api/retry-strategy");

describe("RetryStrategy", () => {
  let strategy;

  beforeEach(() => {
    strategy = new RetryStrategy();
  });

  describe("constructor", () => {
    test("initializes with default config", () => {
      expect(strategy.maxRetries).toBe(5);
      expect(strategy.initialDelayMs).toBe(1000);
      expect(strategy.maxDelayMs).toBe(60000);
      expect(strategy.backoffFactor).toBe(2);
      expect(strategy.jitterFactor).toBe(0.1);
    });

    test("accepts custom config", () => {
      const customStrategy = new RetryStrategy({
        maxRetries: 3,
        initialDelayMs: 500,
        maxDelayMs: 30000,
      });

      expect(customStrategy.maxRetries).toBe(3);
      expect(customStrategy.initialDelayMs).toBe(500);
      expect(customStrategy.maxDelayMs).toBe(30000);
    });

    test("initializes retryable errors set", () => {
      expect(strategy.retryableErrors.has(429)).toBe(true);
      expect(strategy.retryableErrors.has(503)).toBe(true);
      expect(strategy.retryableErrors.has("ECONNRESET")).toBe(true);
    });
  });

  describe("isRetryable", () => {
    test("returns true for 429 (rate limit)", () => {
      const error = new Error("Rate limit");
      error.status = 429;
      expect(strategy.isRetryable(error)).toBe(true);
    });

    test("returns true for 503 (service unavailable)", () => {
      const error = new Error("Service Unavailable");
      error.status = 503;
      expect(strategy.isRetryable(error)).toBe(true);
    });

    test("returns true for ECONNRESET code", () => {
      const error = new Error("Connection reset");
      error.code = "ECONNRESET";
      expect(strategy.isRetryable(error)).toBe(true);
    });

    test("returns true for rate limit in message", () => {
      const error = new Error("You have exceeded your rate limit");
      expect(strategy.isRetryable(error)).toBe(true);
    });

    test("returns true for timeout in message", () => {
      const error = new Error("Request timeout");
      expect(strategy.isRetryable(error)).toBe(true);
    });

    test("returns false for 404 (not found)", () => {
      const error = new Error("Not found");
      error.status = 404;
      expect(strategy.isRetryable(error)).toBe(false);
    });

    test("returns false for null error", () => {
      expect(strategy.isRetryable(null)).toBe(false);
    });

    test("returns false for error without status or code", () => {
      const error = new Error("Generic error");
      expect(strategy.isRetryable(error)).toBe(false);
    });

    test("returns true for 500 (internal server error)", () => {
      const error = new Error("Internal server error");
      error.status = 500;
      expect(strategy.isRetryable(error)).toBe(true);
    });
  });

  describe("calculateDelay", () => {
    test("calculates exponential backoff", () => {
      const delay0 = strategy.calculateDelay(0); // 1000ms
      const delay1 = strategy.calculateDelay(1); // ~2000ms
      const delay2 = strategy.calculateDelay(2); // ~4000ms

      expect(delay0).toBeGreaterThan(900);
      expect(delay0).toBeLessThan(1100);
      expect(delay1).toBeGreaterThan(1800);
      expect(delay1).toBeLessThan(2200);
      expect(delay2).toBeGreaterThan(3600);
      expect(delay2).toBeLessThan(4400);
    });

    test("caps delay at maxDelayMs", () => {
      const delay = strategy.calculateDelay(10); // Would exceed 60000ms
      expect(delay).toBeLessThanOrEqual(strategy.maxDelayMs + 6000); // jitter
    });

    test("returns non-negative delay", () => {
      const delay = strategy.calculateDelay(0);
      expect(delay).toBeGreaterThanOrEqual(0);
    });

    test("throws on negative attempt number", () => {
      expect(() => strategy.calculateDelay(-1)).toThrow(
        "Attempt number must be non-negative",
      );
    });

    test("applies jitter", () => {
      const delays = [];
      for (let i = 0; i < 10; i++) {
        delays.push(strategy.calculateDelay(1));
      }

      // With jitter, all delays should be slightly different
      const unique = new Set(delays);
      expect(unique.size).toBeGreaterThan(5);
    });
  });

  describe("getRetryDelay", () => {
    test("respects Retry-After header (seconds)", () => {
      const error = new Error("Rate limited");
      error.response = {
        headers: { "retry-after": "30" },
      };

      const delay = strategy.getRetryDelay(error, 0);
      expect(delay).toBe(30000);
    });

    test("respects Retry-After header (HTTP-date)", () => {
      const error = new Error("Rate limited");
      const futureDate = new Date(Date.now() + 45000);

      error.response = {
        headers: { "retry-after": futureDate.toUTCString() },
      };

      const delay = strategy.getRetryDelay(error, 0);
      expect(delay).toBeGreaterThan(40000);
      expect(delay).toBeLessThanOrEqual(45000);
    });

    test("falls back to exponential backoff if no Retry-After", () => {
      const error = new Error("Rate limited");
      const delay = strategy.getRetryDelay(error, 2);
      expect(delay).toBeGreaterThan(3000);
    });

    test("handles missing response headers", () => {
      const error = new Error("Generic error");
      const delay = strategy.getRetryDelay(error, 0);
      expect(delay).toBeGreaterThan(0);
    });
  });

  describe("execute", () => {
    test("executes function successfully on first try", async () => {
      const fn = jest.fn().mockResolvedValue("success");
      const result = await strategy.execute(fn);

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test("retries and succeeds on second attempt", async () => {
      // Create strategy with short delays for faster testing
      const fastStrategy = new RetryStrategy({
        initialDelayMs: 5,
        maxDelayMs: 50,
      });

      const error = new Error("Timeout");
      error.status = 503;

      const fn = jest
        .fn()
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce("success");

      const result = await fastStrategy.execute(fn);

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(2);
    }, 5000);

    test("gives up after maxRetries", async () => {
      // Use fast strategy to avoid slow tests
      const fastStrategy = new RetryStrategy({
        maxRetries: 2,
        initialDelayMs: 5,
        maxDelayMs: 50,
        jitterFactor: 0,
      });

      const error = new Error("Persistent error");
      error.status = 503;

      const fn = jest.fn().mockRejectedValue(error);

      await expect(fastStrategy.execute(fn)).rejects.toThrow(
        "Persistent error",
      );
      expect(fn).toHaveBeenCalledTimes(3); // 2 retries + 1 initial = 3 total calls
    }, 5000);

    test("does not retry non-retryable errors", async () => {
      const error = new Error("Not found");
      error.status = 404;

      const fn = jest.fn().mockRejectedValue(error);

      await expect(strategy.execute(fn)).rejects.toThrow("Not found");
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test("throws if fn is not a function", async () => {
      await expect(strategy.execute("not a function")).rejects.toThrow(
        "First argument must be a function",
      );
    });

    test("works with async functions", async () => {
      const fn = jest.fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return "async success";
      });

      const result = await strategy.execute(fn);
      expect(result).toBe("async success");
    });
  });

  describe("validate", () => {
    test("passes with valid config", () => {
      strategy.validate();
      // Should not throw
      expect(true).toBe(true);
    });

    test("throws on negative maxRetries", () => {
      strategy.maxRetries = -1;
      expect(() => strategy.validate()).toThrow(
        "maxRetries must be non-negative",
      );
    });

    test("throws on negative initialDelayMs", () => {
      strategy.initialDelayMs = -1;
      expect(() => strategy.validate()).toThrow(
        "initialDelayMs must be non-negative",
      );
    });

    test("throws if maxDelayMs < initialDelayMs", () => {
      strategy.initialDelayMs = 5000;
      strategy.maxDelayMs = 2000;
      expect(() => strategy.validate()).toThrow(
        "maxDelayMs must be >= initialDelayMs",
      );
    });

    test("throws if backoffFactor < 1", () => {
      strategy.backoffFactor = 0.5;
      expect(() => strategy.validate()).toThrow("backoffFactor must be >= 1");
    });

    test("throws if jitterFactor not between 0-1", () => {
      strategy.jitterFactor = 1.5;
      expect(() => strategy.validate()).toThrow(
        "jitterFactor must be between 0 and 1",
      );
    });
  });

  describe("getConfig", () => {
    test("returns current configuration", () => {
      const config = strategy.getConfig();

      expect(config.maxRetries).toBe(5);
      expect(config.initialDelayMs).toBe(1000);
      expect(config.maxDelayMs).toBe(60000);
      expect(config.backoffFactor).toBe(2);
      expect(config.jitterFactor).toBe(0.1);
    });
  });

  describe("updateConfig", () => {
    test("updates individual config values", () => {
      strategy.updateConfig({ maxRetries: 3, initialDelayMs: 500 });

      expect(strategy.maxRetries).toBe(3);
      expect(strategy.initialDelayMs).toBe(500);
      expect(strategy.maxDelayMs).toBe(60000); // unchanged
    });

    test("validates after update", () => {
      expect(() => {
        strategy.updateConfig({ maxRetries: -1 });
      }).toThrow("maxRetries must be non-negative");
    });

    test("allows partial updates", () => {
      const original = strategy.getConfig();

      strategy.updateConfig({ backoffFactor: 3 });

      const updated = strategy.getConfig();
      expect(updated.backoffFactor).toBe(3);
      expect(updated.maxRetries).toBe(original.maxRetries);
    });
  });

  describe("edge cases", () => {
    test("handles zero initialDelayMs", () => {
      const s = new RetryStrategy({ initialDelayMs: 0, jitterFactor: 0 });
      const delay = s.calculateDelay(0);
      // Zero initial delay gives zero result
      expect(delay).toBe(0);

      const delay1 = s.calculateDelay(1);
      expect(delay1).toBe(0);
    });

    test("handles zero jitterFactor", () => {
      const s = new RetryStrategy({
        initialDelayMs: 100,
        jitterFactor: 0,
      });
      const delay1 = s.calculateDelay(0);
      const delay2 = s.calculateDelay(0);
      // Without jitter, same input gives same output
      expect(delay1).toBe(delay2);
    });

    test("handles large attempt numbers", () => {
      const delay = strategy.calculateDelay(20);
      expect(delay).toBeLessThanOrEqual(strategy.maxDelayMs + 6000);
    });

    test("handles error with no status, code, or message (returns false)", () => {
      const error = {};
      expect(strategy.isRetryable(error)).toBe(false);
    });
  });

  describe("updateConfig coverage", () => {
    test("updates jitterFactor via updateConfig", () => {
      strategy.updateConfig({ jitterFactor: 0.5 });
      expect(strategy.jitterFactor).toBe(0.5);
    });

    test("rethrowing last error after all retries is covered", async () => {
      const s = new RetryStrategy({ maxRetries: 1, initialDelayMs: 0 });
      let calls = 0;
      const fn = async () => {
        calls += 1;
        const err = new Error("Persistent");
        err.status = 503;
        throw err;
      };

      await expect(s.execute(fn, "Test")).rejects.toThrow("Persistent");
      // called initial + 1 retry = 2 times
      expect(calls).toBe(2);
    });
  });
});

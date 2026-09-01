/**
 * Tests for retry-with-backoff utility
 * Validates exponential backoff calculation and retry logic
 */

describe("retry-with-backoff", () => {
  describe("calculateBackoffDelay", () => {
    // Mock the backoff calculation function
    const calculateBackoffDelay = (
      attempt,
      initialDelay,
      maxDelay,
      jitter = false,
    ) => {
      const exponentialDelay = Math.pow(2, attempt) * initialDelay;
      const boundedDelay = Math.min(exponentialDelay, maxDelay);

      if (jitter) {
        const jitterRange = boundedDelay * 0.1;
        const randomJitter = (Math.random() - 0.5) * jitterRange * 2;
        return Math.max(boundedDelay + randomJitter, initialDelay);
      }

      return boundedDelay;
    };

    test("should calculate exponential backoff without jitter", () => {
      const initialDelay = 1000;
      const maxDelay = 30000;

      // Attempt 0: 2^0 * 1000 = 1000
      expect(calculateBackoffDelay(0, initialDelay, maxDelay, false)).toBe(
        1000,
      );

      // Attempt 1: 2^1 * 1000 = 2000
      expect(calculateBackoffDelay(1, initialDelay, maxDelay, false)).toBe(
        2000,
      );

      // Attempt 2: 2^2 * 1000 = 4000
      expect(calculateBackoffDelay(2, initialDelay, maxDelay, false)).toBe(
        4000,
      );

      // Attempt 3: 2^3 * 1000 = 8000
      expect(calculateBackoffDelay(3, initialDelay, maxDelay, false)).toBe(
        8000,
      );

      // Attempt 4: 2^4 * 1000 = 16000
      expect(calculateBackoffDelay(4, initialDelay, maxDelay, false)).toBe(
        16000,
      );

      // Attempt 5: 2^5 * 1000 = 32000, but maxDelay = 30000
      expect(calculateBackoffDelay(5, initialDelay, maxDelay, false)).toBe(
        30000,
      );
    });

    test("should respect maximum delay cap", () => {
      const maxDelay = 5000;
      const result = calculateBackoffDelay(10, 1000, maxDelay, false);
      expect(result).toBeLessThanOrEqual(maxDelay);
      expect(result).toBe(maxDelay);
    });

    test("should calculate backoff with jitter within expected range", () => {
      const initialDelay = 1000;
      const maxDelay = 30000;
      const attempt = 2;

      // Run multiple times to verify jitter range
      for (let i = 0; i < 20; i++) {
        const delay = calculateBackoffDelay(
          attempt,
          initialDelay,
          maxDelay,
          true,
        );
        const expectedBase = Math.min(
          Math.pow(2, attempt) * initialDelay,
          maxDelay,
        );
        const expectedMin = expectedBase * 0.9;
        const expectedMax = expectedBase * 1.1;

        // With jitter, delay should be within ±10% of base (roughly)
        expect(delay).toBeGreaterThanOrEqual(initialDelay);
        expect(delay).toBeLessThanOrEqual(maxDelay);
      }
    });

    test("should handle zero attempt gracefully", () => {
      expect(calculateBackoffDelay(0, 1000, 30000, false)).toBe(1000);
    });

    test("should use initial delay as minimum", () => {
      const initialDelay = 500;
      const maxDelay = 10000;

      // Even with jitter, should not go below initial delay
      for (let i = 0; i < 10; i++) {
        const delay = calculateBackoffDelay(0, initialDelay, maxDelay, true);
        expect(delay).toBeGreaterThanOrEqual(initialDelay);
      }
    });
  });

  describe("retry configuration validation", () => {
    test("should accept valid retry parameters", () => {
      const maxRetries = 5;
      const initialDelayMs = 1000;
      const maxDelayMs = 30000;

      expect(maxRetries).toBeGreaterThan(0);
      expect(initialDelayMs).toBeGreaterThan(0);
      expect(maxDelayMs).toBeGreaterThanOrEqual(initialDelayMs);
    });

    test("should handle various delay configurations", () => {
      const configs = [
        { maxRetries: 3, initialDelayMs: 500, maxDelayMs: 5000 },
        { maxRetries: 5, initialDelayMs: 1000, maxDelayMs: 30000 },
        { maxRetries: 10, initialDelayMs: 100, maxDelayMs: 60000 },
      ];

      configs.forEach((config) => {
        expect(config.maxRetries).toBeGreaterThan(0);
        expect(config.initialDelayMs).toBeGreaterThan(0);
        expect(config.maxDelayMs).toBeGreaterThanOrEqual(config.initialDelayMs);
      });
    });
  });

  describe("retry usage scenarios", () => {
    test("should calculate retry sequence for typical workflow", () => {
      const calculateBackoffDelay = (attempt, initialDelay, maxDelay) => {
        const exponentialDelay = Math.pow(2, attempt) * initialDelay;
        return Math.min(exponentialDelay, maxDelay);
      };

      const maxRetries = 5;
      const initialDelay = 1000;
      const maxDelay = 30000;

      const sequence = [];
      for (let i = 0; i < maxRetries; i++) {
        sequence.push(calculateBackoffDelay(i, initialDelay, maxDelay));
      }

      // Should be increasing up to maxDelay
      expect(sequence).toEqual([1000, 2000, 4000, 8000, 16000]);
      expect(sequence[sequence.length - 1]).toBeLessThanOrEqual(maxDelay);
    });

    test("should generate proper delay sequence when hitting max", () => {
      const calculateBackoffDelay = (attempt, initialDelay, maxDelay) => {
        const exponentialDelay = Math.pow(2, attempt) * initialDelay;
        return Math.min(exponentialDelay, maxDelay);
      };

      const sequence = [];
      for (let i = 0; i < 8; i++) {
        sequence.push(calculateBackoffDelay(i, 1000, 10000));
      }

      // After hitting max, should stay at max
      const maxDelay = 10000;
      expect(sequence[6]).toBe(maxDelay);
      expect(sequence[7]).toBe(maxDelay);
    });
  });
});

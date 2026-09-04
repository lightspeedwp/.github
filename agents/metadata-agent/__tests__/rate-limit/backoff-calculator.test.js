const BackoffCalculator = require("../../lib/rate-limit/backoff-calculator");

describe("BackoffCalculator", () => {
  const originalRandom = Math.random;

  afterEach(() => {
    Math.random = originalRandom;
  });

  test("calculates exponential delay with jitter", () => {
    Math.random = jest.fn(() => 0.75);
    const calculator = new BackoffCalculator({
      initialDelayMs: 1000,
      maxDelayMs: 60000,
      backoffFactor: 2,
      jitterFactor: 0.1,
    });

    const delay = calculator.calculateDelay({ attemptNumber: 2 });

    expect(delay).toBeGreaterThan(4000);
    expect(delay).toBeLessThan(4500);
  });

  test("prefers Retry-After header over computed delay", () => {
    const calculator = new BackoffCalculator({ maxDelayMs: 60000 });
    const error = new Error("Rate limited");
    error.response = { headers: { "retry-after": "30" } };

    const delay = calculator.calculateDelay({ attemptNumber: 0, error });

    expect(delay).toBe(30000);
  });

  test("adapts delay for rate limit pressure", () => {
    Math.random = jest.fn(() => 0.5);
    const calculator = new BackoffCalculator({
      initialDelayMs: 1000,
      jitterFactor: 0,
      maxDelayMs: 60000,
    });

    const error = new Error("API rate limit exceeded");
    error.status = 429;

    const normal = calculator.calculateDelay({ attemptNumber: 1, error });
    const pressured = calculator.calculateDelay({
      attemptNumber: 1,
      error,
      rateLimitType: "search",
      quotaRemainingPercent: 2,
    });

    expect(pressured).toBeGreaterThan(normal);
  });
});

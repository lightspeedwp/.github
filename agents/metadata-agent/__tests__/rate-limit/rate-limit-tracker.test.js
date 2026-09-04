const RateLimitTracker = require("../../lib/rate-limit/rate-limit-tracker");

describe("RateLimitTracker", () => {
  let tracker;

  beforeEach(() => {
    tracker = new RateLimitTracker();
  });

  test("tracks core/graphql/search from rate limit response", () => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const limits = tracker.updateFromRateLimitResponse({
      rate_limit: { limit: 5000, remaining: 4900, reset: nowInSeconds + 3600 },
      resources: {
        graphql: { limit: 5000, remaining: 4700, reset: nowInSeconds + 3600 },
        search: { limit: 30, remaining: 20, reset: nowInSeconds + 60 },
      },
    });

    expect(limits.core.remaining).toBe(4900);
    expect(limits.graphql.remaining).toBe(4700);
    expect(limits.search.remaining).toBe(20);
  });

  test("updates limit state from headers", () => {
    const update = tracker.updateFromHeaders("search", {
      "x-ratelimit-limit": "30",
      "x-ratelimit-remaining": "5",
      "x-ratelimit-reset": String(Math.floor(Date.now() / 1000) + 30),
    });

    expect(update.limit).toBe(30);
    expect(update.remaining).toBe(5);
    expect(update.reset).toBeInstanceOf(Date);
  });

  test("estimates quota recovery when quota is exhausted", () => {
    tracker.limits.search.remaining = 0;
    tracker.limits.search.reset = new Date(Date.now() + 15000);

    const estimate = tracker.estimateQuotaRecovery("search", 1);

    expect(estimate.hasQuota).toBe(false);
    expect(estimate.recoveryInMs).toBeGreaterThan(10000);
    expect(estimate.recoveryInMs).toBeLessThanOrEqual(15000);
  });

  test("identifies the most constrained quota pool", () => {
    tracker.limits.core.remaining = 4500;
    tracker.limits.graphql.remaining = 2500;
    tracker.limits.search.remaining = 3;

    expect(tracker.getMostConstrainedType()).toBe("search");
  });
});

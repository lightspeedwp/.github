const QuotaMonitor = require("../../lib/rate-limit/quota-monitor");
const RateLimitTracker = require("../../lib/rate-limit/rate-limit-tracker");

describe("QuotaMonitor", () => {
  let tracker;
  let monitor;

  beforeEach(() => {
    tracker = new RateLimitTracker();
    monitor = new QuotaMonitor(tracker);
  });

  test("throws when tracker is missing", () => {
    expect(() => new QuotaMonitor()).toThrow("RateLimitTracker is required");
  });

  test("returns warning state when quota is low", () => {
    tracker.limits.search.remaining = 4;

    const status = monitor.getStatus("search");

    expect(status.state).toBe("warning");
    expect(status.percentage).toBe(13);
  });

  test("returns exhausted state when no quota remains", () => {
    tracker.limits.graphql.remaining = 0;
    tracker.limits.graphql.reset = new Date(Date.now() + 20000);

    const status = monitor.getStatus("graphql", 1);

    expect(status.state).toBe("exhausted");
    expect(status.hasQuota).toBe(false);
    expect(status.recoveryInMs).toBeGreaterThan(15000);
  });

  test("reports global bottleneck", () => {
    tracker.limits.core.remaining = 4900;
    tracker.limits.graphql.remaining = 500;
    tracker.limits.search.remaining = 3;

    const status = monitor.getGlobalStatus();

    expect(status.bottleneck).toBe("search");
    expect(status.search.state).toBe("warning");
  });
});

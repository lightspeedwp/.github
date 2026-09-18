const CacheMetrics = require("../../lib/cache/cache-metrics");

describe("CacheMetrics", () => {
  let metrics;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    metrics = new CacheMetrics();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("starts with empty counters", () => {
    const snapshot = metrics.getSnapshot();
    expect(snapshot.hits).toBe(0);
    expect(snapshot.misses).toBe(0);
    expect(snapshot.sets).toBe(0);
    expect(snapshot.hitRate).toBe(0);
  });

  test("tracks hits and misses", () => {
    metrics.recordHit();
    metrics.recordHit();
    metrics.recordMiss();

    const snapshot = metrics.getSnapshot();
    expect(snapshot.hits).toBe(2);
    expect(snapshot.misses).toBe(1);
    expect(snapshot.hitRate).toBeCloseTo(2 / 3, 5);
  });

  test("tracks sets, evictions, and expirations", () => {
    metrics.recordSet();
    metrics.recordSet();
    metrics.recordEviction();
    metrics.recordExpiration();

    const snapshot = metrics.getSnapshot();
    expect(snapshot.sets).toBe(2);
    expect(snapshot.evictions).toBe(1);
    expect(snapshot.expirations).toBe(1);
  });

  test("tracks invalidations by reason", () => {
    metrics.recordInvalidation("manual-clear", 3);
    metrics.recordInvalidation("manual-clear", 1);
    metrics.recordInvalidation("repo-refresh", 2);

    const snapshot = metrics.getSnapshot();
    expect(snapshot.invalidations).toBe(6);
    expect(snapshot.invalidationReasons["manual-clear"]).toBe(4);
    expect(snapshot.invalidationReasons["repo-refresh"]).toBe(2);
  });

  test("ignores invalid invalidation counts", () => {
    metrics.recordInvalidation("manual", 0);
    metrics.recordInvalidation("manual", -1);
    metrics.recordInvalidation("manual", 1.5);

    const snapshot = metrics.getSnapshot();
    expect(snapshot.invalidations).toBe(0);
    expect(snapshot.invalidationReasons.manual).toBeUndefined();
  });

  test("reports cache size in snapshot", () => {
    const snapshot = metrics.getSnapshot(12);
    expect(snapshot.size).toBe(12);
  });

  test("reports increasing uptime", () => {
    jest.advanceTimersByTime(250);
    const snapshot = metrics.getSnapshot();
    expect(snapshot.uptimeMs).toBe(250);
  });
});

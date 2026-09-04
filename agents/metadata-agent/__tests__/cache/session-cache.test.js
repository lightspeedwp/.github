const SessionCache = require("../../lib/cache/session-cache");
const { resolveCacheConfig } = require("../../lib/cache/cache-config");

describe("SessionCache", () => {
  describe("resolveCacheConfig", () => {
    test("returns defaults when config is empty", () => {
      const config = resolveCacheConfig();
      expect(config.ttlMs).toBe(300000);
      expect(config.maxEntries).toBe(1000);
      expect(config.evictionPolicy).toBe("lru");
    });

    test("throws on invalid ttlMs", () => {
      expect(() => resolveCacheConfig({ ttlMs: 0 })).toThrow(
        "ttlMs must be a positive integer",
      );
    });

    test("throws on invalid maxEntries", () => {
      expect(() => resolveCacheConfig({ maxEntries: -1 })).toThrow(
        "maxEntries must be a positive integer",
      );
    });

    test("throws on unsupported evictionPolicy", () => {
      expect(() => resolveCacheConfig({ evictionPolicy: "fifo" })).toThrow(
        "evictionPolicy must be one of: lru",
      );
    });
  });

  describe("basic operations", () => {
    let cache;

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
      cache = new SessionCache({ ttlMs: 1000, maxEntries: 2 });
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("stores and retrieves values", () => {
      cache.set("k1", { value: 1 });
      expect(cache.get("k1")).toEqual({ value: 1 });
    });

    test("returns null for cache misses", () => {
      expect(cache.get("missing")).toBe(null);
    });

    test("expires entries based on ttl", () => {
      cache.set("k1", "value");
      jest.setSystemTime(new Date("2026-01-01T00:00:01.001Z"));
      expect(cache.get("k1")).toBe(null);
    });

    test("supports custom ttl per entry", () => {
      cache.set("k1", "value", { ttlMs: 50 });
      jest.advanceTimersByTime(60);
      expect(cache.get("k1")).toBe(null);
    });

    test("throws when custom ttl is invalid", () => {
      expect(() => cache.set("k1", "value", { ttlMs: 0 })).toThrow(
        "ttlMs must be a positive integer",
      );
    });

    test("uses lru eviction when capacity is exceeded", () => {
      cache.set("a", 1);
      cache.set("b", 2);
      cache.get("a");
      cache.set("c", 3);

      expect(cache.get("b")).toBe(null);
      expect(cache.get("a")).toBe(1);
      expect(cache.get("c")).toBe(3);
    });

    test("updates existing key without eviction", () => {
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("a", 3);

      expect(cache.size()).toBe(2);
      expect(cache.get("a")).toBe(3);
    });

    test("updating existing key refreshes lru recency", () => {
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("a", 3);
      cache.set("c", 4);

      expect(cache.get("b")).toBe(null);
      expect(cache.get("a")).toBe(3);
      expect(cache.get("c")).toBe(4);
    });

    test("delete removes existing key", () => {
      cache.set("a", 1);
      expect(cache.delete("a", "manual-delete")).toBe(true);
      expect(cache.get("a")).toBe(null);
    });

    test("delete returns false for missing key", () => {
      expect(cache.delete("missing")).toBe(false);
    });

    test("clear invalidates all entries", () => {
      cache.set("a", 1);
      cache.set("b", 2);
      const removed = cache.clear("manual-clear");
      expect(removed).toBe(2);
      expect(cache.size()).toBe(0);
    });

    test("invalidateByPrefix clears matching keys", () => {
      cache = new SessionCache({ ttlMs: 1000, maxEntries: 5 });
      cache.set("repo:1", 1);
      cache.set("repo:2", 2);
      cache.set("user:1", 3);
      const removed = cache.invalidateByPrefix("repo:", "repo-refresh");
      expect(removed).toBe(2);
      expect(cache.get("repo:1")).toBe(null);
      expect(cache.get("user:1")).toBe(3);
    });

    test("invalidateByPredicate removes matching entries", () => {
      cache.set("one", { stale: true });
      cache.set("two", { stale: false });
      const removed = cache.invalidateByPredicate(
        (key, value) => value.stale,
        "stale",
      );
      expect(removed).toBe(1);
      expect(cache.get("one")).toBe(null);
      expect(cache.get("two")).toEqual({ stale: false });
    });

    test("invalidateByPredicate throws on invalid predicate", () => {
      expect(() => cache.invalidateByPredicate("bad")).toThrow(
        "predicate must be a function",
      );
    });

    test("invalidateExpired sweeps expired keys", () => {
      cache.set("short", "v", { ttlMs: 100 });
      cache.set("long", "v", { ttlMs: 5000 });
      jest.advanceTimersByTime(101);
      const removed = cache.invalidateExpired("sweep");

      expect(removed).toBe(1);
      expect(cache.get("short")).toBe(null);
      expect(cache.get("long")).toBe("v");
    });

    test("has reports key state", () => {
      cache.set("a", 1);
      expect(cache.has("a")).toBe(true);
      expect(cache.has("b")).toBe(false);
    });

    test("has supports null values", () => {
      cache.set("nullable", null);
      expect(cache.has("nullable")).toBe(true);
    });

    test("metrics include hit rate and invalidation reasons", () => {
      cache.set("a", 1);
      cache.get("a");
      cache.get("missing");
      cache.delete("a", "manual-delete");

      const metrics = cache.getMetrics();
      expect(metrics.hits).toBe(1);
      expect(metrics.misses).toBe(1);
      expect(metrics.hitRate).toBe(0.5);
      expect(metrics.invalidationReasons["manual-delete"]).toBe(1);
    });
  });
});

const { resolveCacheConfig } = require("./cache-config");
const CacheMetrics = require("./cache-metrics");

/**
 * In-memory session cache with TTL and LRU eviction.
 */
class SessionCache {
  constructor(config = {}) {
    this.config = resolveCacheConfig(config);
    this.metrics = new CacheMetrics();
    this.entries = new Map();
  }

  _isExpired(entry) {
    return entry.expiresAt <= Date.now();
  }

  _touch(key, entry) {
    this.entries.delete(key);
    this.entries.set(key, entry);
  }

  _ensureCapacity() {
    while (this.entries.size > this.config.maxEntries - 1) {
      const oldestKey = this.entries.keys().next().value;
      if (oldestKey === undefined) {
        return;
      }
      this.entries.delete(oldestKey);
      this.metrics.recordEviction();
    }
  }

  set(key, value, options = {}) {
    const ttlMs = options.ttlMs || this.config.ttlMs;
    const expiresAt = Date.now() + ttlMs;
    const entry = { value, expiresAt };

    if (!this.entries.has(key)) {
      this._ensureCapacity();
    }

    this.entries.set(key, entry);
    this.metrics.recordSet();

    return value;
  }

  get(key) {
    const entry = this.entries.get(key);

    if (!entry) {
      this.metrics.recordMiss();
      return null;
    }

    if (this._isExpired(entry)) {
      this.entries.delete(key);
      this.metrics.recordExpiration();
      this.metrics.recordMiss();
      return null;
    }

    this._touch(key, entry);
    this.metrics.recordHit();
    return entry.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key, reason = "manual") {
    const removed = this.entries.delete(key);
    if (removed) {
      this.metrics.recordInvalidation(reason);
    }
    return removed;
  }

  clear(reason = "manual-clear") {
    const removedCount = this.entries.size;
    this.entries.clear();
    if (removedCount > 0) {
      this.metrics.recordInvalidation(reason, removedCount);
    }
    return removedCount;
  }

  invalidateByPrefix(prefix, reason = "prefix") {
    if (!prefix) {
      return 0;
    }

    let removed = 0;
    for (const key of this.entries.keys()) {
      if (String(key).startsWith(prefix)) {
        this.entries.delete(key);
        removed += 1;
      }
    }

    if (removed > 0) {
      this.metrics.recordInvalidation(reason, removed);
    }

    return removed;
  }

  invalidateByPredicate(predicate, reason = "predicate") {
    if (typeof predicate !== "function") {
      throw new Error("predicate must be a function");
    }

    let removed = 0;
    for (const [key, entry] of this.entries.entries()) {
      if (predicate(key, entry.value)) {
        this.entries.delete(key);
        removed += 1;
      }
    }

    if (removed > 0) {
      this.metrics.recordInvalidation(reason, removed);
    }

    return removed;
  }

  invalidateExpired(reason = "expired-sweep") {
    let removed = 0;
    for (const [key, entry] of this.entries.entries()) {
      if (this._isExpired(entry)) {
        this.entries.delete(key);
        removed += 1;
        this.metrics.recordExpiration();
      }
    }

    if (removed > 0) {
      this.metrics.recordInvalidation(reason, removed);
    }

    return removed;
  }

  size() {
    return this.entries.size;
  }

  getMetrics() {
    return this.metrics.getSnapshot(this.entries.size);
  }
}

module.exports = SessionCache;

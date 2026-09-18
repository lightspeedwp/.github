/**
 * Lightweight metrics tracker for in-memory cache behaviour.
 */
class CacheMetrics {
  constructor() {
    this.startedAt = Date.now();
    this.counters = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0,
      expirations: 0,
      invalidations: 0,
    };
    this.invalidationReasons = {};
  }

  recordHit() {
    this.counters.hits += 1;
  }

  recordMiss() {
    this.counters.misses += 1;
  }

  recordSet() {
    this.counters.sets += 1;
  }

  recordEviction() {
    this.counters.evictions += 1;
  }

  recordExpiration() {
    this.counters.expirations += 1;
  }

  recordInvalidation(reason = "manual", count = 1) {
    if (!Number.isInteger(count) || count < 1) {
      return;
    }

    this.counters.invalidations += count;
    this.invalidationReasons[reason] =
      (this.invalidationReasons[reason] || 0) + count;
  }

  getSnapshot(cacheSize = 0) {
    const totalReads = this.counters.hits + this.counters.misses;
    const hitRate = totalReads === 0 ? 0 : this.counters.hits / totalReads;

    return {
      ...this.counters,
      hitRate,
      size: cacheSize,
      uptimeMs: Date.now() - this.startedAt,
      invalidationReasons: { ...this.invalidationReasons },
    };
  }
}

module.exports = CacheMetrics;

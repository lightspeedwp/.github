const { RATE_LIMIT_TYPES } = require("./rate-limit-types");

/**
 * Produces quota health and recovery estimates from a rate limit tracker.
 */
class QuotaMonitor {
  constructor(tracker, config = {}) {
    if (!tracker) {
      throw new Error("RateLimitTracker is required");
    }

    this.tracker = tracker;
    this.warningPercent = config.warningPercent ?? 15;
    this.criticalPercent = config.criticalPercent ?? 5;
  }

  _resolveState(limitPercent, remaining) {
    if (remaining <= 0) {
      return "exhausted";
    }

    if (limitPercent <= this.criticalPercent) {
      return "critical";
    }

    if (limitPercent <= this.warningPercent) {
      return "warning";
    }

    return "healthy";
  }

  getStatus(type = RATE_LIMIT_TYPES.CORE, requiredRequests = 1) {
    const limit = this.tracker.getLimit(type);
    const percentage = this.tracker.getPercentageRemaining(type);
    const recovery = this.tracker.estimateQuotaRecovery(type, requiredRequests);

    return {
      type,
      state: this._resolveState(percentage, limit.remaining),
      remaining: limit.remaining,
      limit: limit.limit,
      percentage,
      requiredRequests,
      recoveryInMs: recovery.recoveryInMs,
      resetAt: recovery.resetAt,
      hasQuota: recovery.hasQuota,
    };
  }

  getGlobalStatus(requiredRequests = 1) {
    const statuses = Object.values(RATE_LIMIT_TYPES).map((type) =>
      this.getStatus(type, requiredRequests),
    );

    const bottleneck = statuses.sort(
      (a, b) => a.percentage - b.percentage || a.remaining - b.remaining,
    )[0];

    return {
      core: this.getStatus(RATE_LIMIT_TYPES.CORE, requiredRequests),
      graphql: this.getStatus(RATE_LIMIT_TYPES.GRAPHQL, requiredRequests),
      search: this.getStatus(RATE_LIMIT_TYPES.SEARCH, requiredRequests),
      bottleneck: bottleneck.type,
    };
  }
}

module.exports = QuotaMonitor;

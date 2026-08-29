const {
  RATE_LIMIT_TYPES,
  DEFAULT_LIMITS,
  DEFAULT_THRESHOLDS,
  isValidRateLimitType,
} = require("./rate-limit-types");

/**
 * Tracks GitHub API quotas for core, GraphQL, and search independently.
 */
class RateLimitTracker {
  constructor(config = {}) {
    const limits = config.limits || {};
    const thresholds = config.thresholds || {};

    this.limits = {
      core: { ...DEFAULT_LIMITS.core, ...(limits.core || {}) },
      graphql: { ...DEFAULT_LIMITS.graphql, ...(limits.graphql || {}) },
      search: { ...DEFAULT_LIMITS.search, ...(limits.search || {}) },
    };

    this.thresholds = {
      core: thresholds.core ?? DEFAULT_THRESHOLDS.core,
      graphql: thresholds.graphql ?? DEFAULT_THRESHOLDS.graphql,
      search: thresholds.search ?? DEFAULT_THRESHOLDS.search,
    };

    this.lastUpdate = null;
  }

  _assertType(type) {
    if (!isValidRateLimitType(type)) {
      throw new Error(`Unknown rate limit type: ${type}`);
    }
  }

  _toResetDate(rawReset) {
    if (!rawReset && rawReset !== 0) {
      return null;
    }

    if (rawReset instanceof Date) {
      return rawReset;
    }

    if (typeof rawReset === "number") {
      return new Date(rawReset * 1000);
    }

    if (typeof rawReset === "string" && /^\d+$/.test(rawReset)) {
      return new Date(parseInt(rawReset, 10) * 1000);
    }

    const parsed = new Date(rawReset);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  _normaliseLimit(payload, fallbackType) {
    if (!payload) {
      return this.getLimit(fallbackType);
    }

    return {
      limit: Number(payload.limit) || this.limits[fallbackType].limit,
      remaining: Number(payload.remaining) || 0,
      reset: this._toResetDate(payload.reset),
    };
  }

  updateFromRateLimitResponse(responseData = {}) {
    const resources = responseData.resources || {};
    const corePayload = responseData.rate_limit || resources.core;

    if (corePayload) {
      this.limits.core = this._normaliseLimit(
        corePayload,
        RATE_LIMIT_TYPES.CORE,
      );
    }

    if (resources.graphql) {
      this.limits.graphql = this._normaliseLimit(
        resources.graphql,
        RATE_LIMIT_TYPES.GRAPHQL,
      );
    }

    if (resources.search) {
      this.limits.search = this._normaliseLimit(
        resources.search,
        RATE_LIMIT_TYPES.SEARCH,
      );
    }

    this.lastUpdate = new Date();
    return this.getAllLimits();
  }

  updateFromHeaders(type, headers = {}) {
    this._assertType(type);

    const limit = Number(headers["x-ratelimit-limit"]);
    const remaining = Number(headers["x-ratelimit-remaining"]);
    const reset = this._toResetDate(headers["x-ratelimit-reset"]);

    if (Number.isFinite(limit) && limit >= 0) {
      this.limits[type].limit = limit;
    }

    if (Number.isFinite(remaining) && remaining >= 0) {
      this.limits[type].remaining = remaining;
    }

    if (reset) {
      this.limits[type].reset = reset;
    }

    this.lastUpdate = new Date();
    return this.getLimit(type);
  }

  getLimit(type = RATE_LIMIT_TYPES.CORE) {
    this._assertType(type);
    return { ...this.limits[type] };
  }

  getAllLimits() {
    return {
      core: this.getLimit(RATE_LIMIT_TYPES.CORE),
      graphql: this.getLimit(RATE_LIMIT_TYPES.GRAPHQL),
      search: this.getLimit(RATE_LIMIT_TYPES.SEARCH),
    };
  }

  setThreshold(type, threshold) {
    this._assertType(type);

    if (!Number.isFinite(threshold) || threshold < 0) {
      throw new Error("Threshold must be non-negative");
    }

    this.thresholds[type] = threshold;
  }

  isBelowThreshold(type = RATE_LIMIT_TYPES.CORE) {
    const limit = this.getLimit(type);
    return limit.remaining <= this.thresholds[type];
  }

  getTimeUntilReset(type = RATE_LIMIT_TYPES.CORE) {
    const limit = this.getLimit(type);
    if (!limit.reset) {
      return 0;
    }

    return Math.max(0, limit.reset.getTime() - Date.now());
  }

  getPercentageRemaining(type = RATE_LIMIT_TYPES.CORE) {
    const limit = this.getLimit(type);
    if (limit.limit <= 0) {
      return 0;
    }

    return Math.round((limit.remaining / limit.limit) * 100);
  }

  estimateQuotaRecovery(type = RATE_LIMIT_TYPES.CORE, requiredRequests = 1) {
    this._assertType(type);

    if (!Number.isFinite(requiredRequests) || requiredRequests < 0) {
      throw new Error("requiredRequests must be non-negative");
    }

    const limit = this.getLimit(type);
    const missingRequests = Math.max(0, requiredRequests - limit.remaining);

    return {
      hasQuota: missingRequests === 0,
      missingRequests,
      recoveryInMs: missingRequests === 0 ? 0 : this.getTimeUntilReset(type),
      resetAt: limit.reset,
      remaining: limit.remaining,
      requiredRequests,
    };
  }

  getMostConstrainedType() {
    const entries = Object.values(RATE_LIMIT_TYPES).map((type) => ({
      type,
      percentage: this.getPercentageRemaining(type),
      remaining: this.getLimit(type).remaining,
    }));

    return entries.sort(
      (a, b) => a.percentage - b.percentage || a.remaining - b.remaining,
    )[0].type;
  }

  recordRequest(type = RATE_LIMIT_TYPES.CORE, count = 1) {
    this._assertType(type);

    if (!Number.isFinite(count) || count < 0) {
      throw new Error("count must be non-negative");
    }

    this.limits[type].remaining = Math.max(
      0,
      this.limits[type].remaining - count,
    );
    return this.getLimit(type);
  }

  reset() {
    this.limits = {
      core: { ...DEFAULT_LIMITS.core },
      graphql: { ...DEFAULT_LIMITS.graphql },
      search: { ...DEFAULT_LIMITS.search },
    };
    this.thresholds = {
      core: DEFAULT_THRESHOLDS.core,
      graphql: DEFAULT_THRESHOLDS.graphql,
      search: DEFAULT_THRESHOLDS.search,
    };
    this.lastUpdate = null;
  }

  getSummary() {
    return {
      core: {
        ...this.getLimit(RATE_LIMIT_TYPES.CORE),
        percentage: this.getPercentageRemaining(RATE_LIMIT_TYPES.CORE),
        resetIn: this.getTimeUntilReset(RATE_LIMIT_TYPES.CORE),
      },
      graphql: {
        ...this.getLimit(RATE_LIMIT_TYPES.GRAPHQL),
        percentage: this.getPercentageRemaining(RATE_LIMIT_TYPES.GRAPHQL),
        resetIn: this.getTimeUntilReset(RATE_LIMIT_TYPES.GRAPHQL),
      },
      search: {
        ...this.getLimit(RATE_LIMIT_TYPES.SEARCH),
        percentage: this.getPercentageRemaining(RATE_LIMIT_TYPES.SEARCH),
        resetIn: this.getTimeUntilReset(RATE_LIMIT_TYPES.SEARCH),
      },
      lastUpdate: this.lastUpdate,
      bottleneck: this.getMostConstrainedType(),
    };
  }
}

module.exports = RateLimitTracker;

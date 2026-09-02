#!/usr/bin/env node

/**
 * Telemetry Client
 *
 * Lightweight telemetry client for tracking events across the codebase.
 * Supports multiple backends (console, file, analytics) and environment-aware behavior.
 *
 * Features:
 * - Safe vs restricted property separation
 * - Environment detection (development vs production)
 * - Multiple backend support
 * - Automatic property validation
 * - Error handling with fallback
 *
 * @module TelemetryClient
 */

const fs = require("fs");
const path = require("path");

/**
 * Environment types
 * @enum {string}
 */
const Environment = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
};

/**
 * Backend types for telemetry data
 * @enum {string}
 */
const BackendType = {
  CONSOLE: "console",
  FILE: "file",
  ANALYTICS: "analytics",
  NONE: "none",
};

/**
 * Property classification for privacy
 * @enum {string}
 */
const PropertyClassification = {
  SAFE: "safe", // Anonymous, aggregated data safe for all environments
  RESTRICTED: "restricted", // May contain repo-specific or detailed information
};

/**
 * Telemetry Client
 *
 * @class TelemetryClient
 */
class TelemetryClient {
  /**
   * Create a telemetry client
   *
   * @param {Object} options - Configuration options
   * @param {string} options.environment - Environment (development, production, test)
   * @param {string} options.backend - Backend type (console, file, analytics, none)
   * @param {string} options.outputPath - Path for file backend
   * @param {Object} options.eventSchemas - Event schema definitions
   * @param {boolean} options.enabled - Enable/disable telemetry
   */
  constructor(options = {}) {
    this.environment = options.environment || this.detectEnvironment();
    this.backend = options.backend || this.getDefaultBackend();
    this.outputPath = options.outputPath || ".github/reports/telemetry";
    this.eventSchemas = options.eventSchemas || {};
    this.enabled = options.enabled !== undefined ? options.enabled : true;
    this.errorHandler = options.errorHandler || this.defaultErrorHandler;

    // Statistics tracking
    this.stats = {
      totalEvents: 0,
      eventsByType: {},
      errors: 0,
    };
  }

  /**
   * Detect current environment
   *
   * @returns {string} Environment type
   */
  detectEnvironment() {
    if (process.env.NODE_ENV === "test") {
      return Environment.TEST;
    }

    if (process.env.NODE_ENV === "production" || process.env.CI === "true") {
      return Environment.PRODUCTION;
    }

    return Environment.DEVELOPMENT;
  }

  /**
   * Get default backend based on environment
   *
   * @returns {string} Backend type
   */
  getDefaultBackend() {
    switch (this.environment) {
      case Environment.TEST:
        return BackendType.NONE;
      case Environment.DEVELOPMENT:
        return BackendType.CONSOLE;
      case Environment.PRODUCTION:
        return BackendType.FILE;
      default:
        return BackendType.CONSOLE;
    }
  }

  /**
   * Default error handler - never throws, just logs
   *
   * @param {Error} error - The error that occurred
   * @param {Object} context - Context about the error
   */
  defaultErrorHandler(error, context) {
    this.stats.errors++;

    // In development, log to console for debugging
    if (this.environment === Environment.DEVELOPMENT) {
      console.warn("[Telemetry Error]", error.message, context);
    }

    // Never throw - telemetry failures should not break the application
  }

  /**
   * Emit a telemetry event
   *
   * @param {string} eventType - Event type (e.g., 'release.validation.started')
   * @param {Object} properties - Event properties
   * @param {Object} properties.safe - Safe properties (anonymous, aggregated)
   * @param {Object} properties.restricted - Restricted properties (detailed, repo-specific)
   * @returns {boolean} Success status
   */
  emit(eventType, properties = {}) {
    // Early exit if disabled
    if (!this.enabled) {
      return false;
    }

    try {
      // Validate event type
      if (!eventType || typeof eventType !== "string") {
        throw new Error(`Invalid event type: ${eventType}`);
      }

      // Separate safe and restricted properties
      const safeProps = properties.safe || {};
      const restrictedProps = properties.restricted || {};

      // Validate properties against schema if available
      const schema = this.eventSchemas[eventType];
      if (schema) {
        this.validateProperties(eventType, safeProps, restrictedProps, schema);
      }

      // Build event payload
      const event = {
        eventType,
        timestamp: new Date().toISOString(),
        environment: this.environment,
        safe: safeProps,
        restricted: this.shouldIncludeRestrictedProperties()
          ? restrictedProps
          : {},
      };

      // Send to backend
      this.sendToBackend(event);

      // Update statistics
      this.updateStats(eventType);

      return true;
    } catch (error) {
      // Protect custom error-handler invocation with a non-throwing internal reporter
      try {
        this.errorHandler(error, { eventType, properties });
      } catch (handlerError) {
        // Silently ignore handler errors - telemetry should never throw
        this.defaultErrorHandler(handlerError, { eventType, properties });
      }
      return false;
    }
  }

  /**
   * Validate properties against schema
   *
   * @param {string} eventType - Event type
   * @param {Object} safeProps - Safe properties
   * @param {Object} restrictedProps - Restricted properties
   * @param {Object} schema - Event schema
   * @throws {Error} If validation fails
   */
  validateProperties(eventType, safeProps, restrictedProps, schema) {
    // Validate safe properties
    if (schema.safe) {
      for (const prop of schema.safe.required || []) {
        if (!(prop in safeProps)) {
          throw new Error(
            `Missing required safe property '${prop}' for event '${eventType}'`,
          );
        }
      }
    }

    // Validate restricted properties
    if (schema.restricted) {
      for (const prop of schema.restricted.required || []) {
        if (!(prop in restrictedProps)) {
          throw new Error(
            `Missing required restricted property '${prop}' for event '${eventType}'`,
          );
        }
      }
    }
  }

  /**
   * Determine if restricted properties should be included
   *
   * @returns {boolean} True if restricted properties should be included
   */
  shouldIncludeRestrictedProperties() {
    // In production, be more conservative
    if (this.environment === Environment.PRODUCTION) {
      return process.env.TELEMETRY_INCLUDE_RESTRICTED === "true";
    }

    // In development and test, include by default
    return true;
  }

  /**
   * Send event to configured backend
   *
   * @param {Object} event - Event payload
   */
  sendToBackend(event) {
    switch (this.backend) {
      case BackendType.CONSOLE:
        this.sendToConsole(event);
        break;

      case BackendType.FILE:
        this.sendToFile(event);
        break;

      case BackendType.ANALYTICS:
        this.sendToAnalytics(event);
        break;

      case BackendType.NONE:
        // No-op for testing
        break;

      default:
        throw new Error(`Unknown backend type: ${this.backend}`);
    }
  }

  /**
   * Send event to console
   *
   * @param {Object} event - Event payload
   */
  sendToConsole(event) {
    console.log("[Telemetry]", JSON.stringify(event, null, 2));
  }

  /**
   * Send event to file
   *
   * @param {Object} event - Event payload
   */
  sendToFile(event) {
    try {
      // Ensure output directory exists
      fs.mkdirSync(this.outputPath, { recursive: true });

      // Generate filename with date
      const date = new Date().toISOString().split("T")[0];
      const filename = `telemetry-${date}.jsonl`;
      const filepath = path.join(this.outputPath, filename);

      // Append event as JSON line
      const line = JSON.stringify(event) + "\n";
      fs.appendFileSync(filepath, line, "utf8");
    } catch (error) {
      // Protect custom error-handler invocation with a non-throwing internal reporter
      try {
        this.errorHandler(error, { event, backend: "file" });
      } catch (handlerError) {
        // Silently ignore handler errors - telemetry should never throw
        this.defaultErrorHandler(handlerError, { event, backend: "file" });
      }
    }
  }

  /**
   * Send event to analytics service
   *
   * @param {Object} _event - Event payload
   */
  sendToAnalytics(_event) {
    // Analytics backend not yet implemented
    // Return a non-throwing failure result
    return false;
  }

  /**
   * Update statistics
   *
   * @param {string} eventType - Event type
   */
  updateStats(eventType) {
    this.stats.totalEvents++;
    this.stats.eventsByType[eventType] =
      (this.stats.eventsByType[eventType] || 0) + 1;
  }

  /**
   * Get current statistics
   *
   * @returns {Object} Statistics
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      totalEvents: 0,
      eventsByType: {},
      errors: 0,
    };
  }

  /**
   * Flush any pending events (for file backend)
   *
   * @returns {Promise<void>}
   */
  async flush() {
    // Currently synchronous file writes, but keeping async interface
    // for future async backend implementations
    return Promise.resolve();
  }
}

/**
 * Create a telemetry client instance
 *
 * @param {Object} options - Configuration options
 * @returns {TelemetryClient} Telemetry client instance
 */
function createTelemetryClient(options = {}) {
  return new TelemetryClient(options);
}

// Export classes and functions
module.exports = {
  TelemetryClient,
  createTelemetryClient,
  Environment,
  BackendType,
  PropertyClassification,
};

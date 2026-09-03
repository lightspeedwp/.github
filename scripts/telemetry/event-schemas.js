#!/usr/bin/env node

/**
 * Event Schema Definitions
 *
 * Defines all telemetry event schemas with safe and restricted properties.
 * Used by the telemetry client for automatic validation.
 *
 * Event naming convention: {domain}.{action}.{status}
 * Examples:
 * - release.validation.started
 * - metrics.collection.completed
 * - website.theme.toggled
 *
 * @module EventSchemas
 */

/**
 * Release Agent Events
 *
 * Events emitted by the release agent during changelog validation
 * and release preparation workflows.
 */
const RELEASE_EVENTS = {
  /**
   * Emitted when release validation starts
   *
   * Use case: Track validation workflow initiation
   * Location: .github/agentic-workflows/release.agent.js
   */
  "release.validation.started": {
    description: "Release validation workflow started",
    safe: {
      required: ["component", "version"],
      optional: ["trigger"],
    },
    restricted: {
      required: ["repositoryName"],
      optional: ["changelogPath", "versionFile"],
    },
  },

  /**
   * Emitted when release validation completes successfully
   *
   * Use case: Track successful validations and measure duration
   * Location: .github/agentic-workflows/release.agent.js
   */
  "release.validation.completed": {
    description: "Release validation workflow completed successfully",
    safe: {
      required: ["component", "version", "validationDuration"],
      optional: ["gatesPassed", "warningCount"],
    },
    restricted: {
      required: ["repositoryName"],
      optional: ["changelogPath", "validationResults"],
    },
  },

  /**
   * Emitted when a validation gate fails
   *
   * Use case: Track validation failures and identify common issues
   * Location: .github/agentic-workflows/release.agent.js
   */
  "release.gate.failure": {
    description: "A validation gate failed during release preparation",
    safe: {
      required: ["component", "gateName", "failureReason"],
      optional: ["attemptNumber", "recoverable"],
    },
    restricted: {
      required: ["repositoryName"],
      optional: ["changelogPath", "errorDetails", "stackTrace"],
    },
  },
};

/**
 * Metrics Collection Events
 *
 * Events emitted during metrics collection orchestration across repositories.
 */
const METRICS_COLLECTION_EVENTS = {
  /**
   * Emitted when metrics collection starts
   *
   * Use case: Track collection workflow initiation and repository count
   * Location: scripts/workflows/metrics-collection-orchestrator.cjs
  "metrics.collection.started": {
    description: "Metrics collection workflow started",
    safe: {
      required: ["repositoryCount", "collectionType"],
      optional: ["scheduledRun", "trigger"],
    },
    restricted: {
      required: [],
      optional: ["repositories", "configPath"],
    },
  },

  /**
   * Emitted when metrics collection completes
   *
   * Use case: Track successful collections and measure performance
   * Location: scripts/workflows/metrics-collection-orchestrator.cjs
   */
  "metrics.collection.completed": {
    description: "Metrics collection workflow completed",
    safe: {
      required: [
        "repositoryCount",
        "successCount",
        "failureCount",
        "collectionDuration",
      ],
      optional: ["metricsCollected", "anomaliesDetected"],
    },
    restricted: {
      required: [],
      optional: ["repositories", "failedRepositories", "summaryPath"],
    },
  },

  /**
   * Emitted when metrics collection fails for a specific repository
   *
   * Use case: Track per-repository failures and identify problematic repos
   * Location: scripts/workflows/metrics-collection-orchestrator.cjs
   */
  "metrics.repository.collection.failed": {
    description: "Metrics collection failed for a specific repository",
    safe: {
      required: ["failureReason", "attemptNumber"],
      optional: ["recoverable", "retryScheduled"],
    },
    restricted: {
      required: ["repository"],
      optional: ["errorDetails", "apiResponse", "stackTrace"],
    },
  },
};

/**
 * Metrics Reporting Events
 *
 * Events emitted during metrics report generation.
 */
const METRICS_REPORTING_EVENTS = {
  /**
   * Emitted when a metrics report is successfully generated
   *
   * Use case: Track report generation and storage
   * Location: scripts/workflows/metrics-reporting-orchestrator.cjs
   */
  "metrics.report.generated": {
    description: "Metrics report successfully generated and saved",
    safe: {
      required: ["reportType", "period", "metricsIncluded"],
      optional: ["trendsIncluded", "anomaliesIncluded", "generationDuration"],
    },
    restricted: {
      required: ["repository"],
      optional: ["reportPath", "fileSize"],
    },
  },
};

/**
 * Website Events
 *
 * Events emitted by the website theme toggle and other UI interactions.
 */
const WEBSITE_EVENTS = {
  /**
   * Emitted when theme is toggled
   *
   * Use case: Track theme preference changes and usage patterns
   * Location: .github/website/src/scripts/theme-toggle.js
   */
  "website.theme.toggled": {
    description: "User toggled website theme",
    safe: {
      required: ["fromTheme", "toTheme"],
      optional: ["method", "timestamp"],
    },
    restricted: {
      required: [],
      optional: ["userAgent", "viewport"],
    },
  },

  /**
   * Emitted when theme storage fails
   *
   * Use case: Track localStorage failures (private browsing, quota exceeded)
   * Location: .github/website/src/scripts/theme-toggle.js
   */
  "website.theme.storage.failure": {
    description: "Failed to store theme preference in localStorage",
    safe: {
      required: ["failureType"],
      optional: ["theme", "fallbackUsed"],
    },
    restricted: {
      required: [],
      optional: ["storageError", "browserInfo"],
    },
  },
};

/**
 * All event schemas combined
 */
const EVENT_SCHEMAS = {
  ...RELEASE_EVENTS,
  ...METRICS_COLLECTION_EVENTS,
  ...METRICS_REPORTING_EVENTS,
  ...WEBSITE_EVENTS,
};

/**
 * Get schema for a specific event type
 *
 * @param {string} eventType - Event type identifier
 * @returns {Object|null} Event schema or null if not found
 */
function getEventSchema(eventType) {
  return Object.prototype.hasOwnProperty.call(EVENT_SCHEMAS, eventType)
    ? EVENT_SCHEMAS[eventType]
    : null;
}

/**
 * Get all event types
 *
 * @returns {string[]} Array of all event type identifiers
 */
function getAllEventTypes() {
  return Object.keys(EVENT_SCHEMAS);
}

/**
 * Validate that an event type exists
 *
 * @param {string} eventType - Event type identifier
 * @returns {boolean} True if event type exists
 */
function isValidEventType(eventType) {
  return Object.prototype.hasOwnProperty.call(EVENT_SCHEMAS, eventType);
}

/**
 * Get events by domain
 *
 * @param {string} domain - Domain name (e.g., 'release', 'metrics', 'website')
 * @returns {Object} Event schemas for the domain
 */
function getEventsByDomain(domain) {
  const domainEvents = {};
  for (const [eventType, schema] of Object.entries(EVENT_SCHEMAS)) {
    if (eventType.startsWith(domain + ".")) {
      domainEvents[eventType] = schema;
    }
  }
  return domainEvents;
}

// Export schemas and utilities
module.exports = {
  EVENT_SCHEMAS,
  RELEASE_EVENTS,
  METRICS_COLLECTION_EVENTS,
  METRICS_REPORTING_EVENTS,
  WEBSITE_EVENTS,
  getEventSchema,
  getAllEventTypes,
  isValidEventType,
  getEventsByDomain,
};

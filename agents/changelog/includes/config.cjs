/**
 * Configuration module for changelog validation system
 * Manages rule versions, paths, and feature flags
 */

const path = require('path');

const config = {
  // Rule versioning
  RULE_VERSION: '1.0',
  RULES_FILE: path.join(__dirname, '../../.github/changelog-rules.yml'),

  // Validation categories
  VALID_CATEGORIES: [
    'feature',
    'fix',
    'improvement',
    'breaking-change',
    'security',
    'performance',
  ],

  // Storage paths
  METRICS_DIR: path.join(__dirname, '../../.github/reports/changelog-metrics'),
  AUDIT_REPORTS_DIR: path.join(__dirname, '../../.github/reports/release-audits'),

  // GitHub API
  GITHUB_API_CACHE_TTL_MS: 3600000, // 1 hour
  GITHUB_API_TIMEOUT_MS: 5000,
  GITHUB_API_RATE_LIMIT_RETRY_DELAY_MS: 60000,

  // Performance targets
  SINGLE_ENTRY_VALIDATION_TARGET_MS: 100,
  FULL_AUDIT_TARGET_MS: 300000, // 5 minutes

  // Feature flags
  REQUIRE_PR_REFERENCES_FOR_RELEASE: true,
  ALLOW_PR_REFERENCE_FOR_PRERELEASE: false,
  VALIDATE_PR_LINKS_VIA_GITHUB_API: true,
  GRACEFUL_DEGRADATION_ON_API_ERROR: true,

  // Score calculation
  SCORE_BASE: 100,
  SCORE_ERROR_PENALTY: 25,
  SCORE_WARNING_PENALTY: 5,
  COMPLIANCE_PASS_THRESHOLD: 90,
  COMPLIANCE_WARNING_THRESHOLD: 75,

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'INFO',
};

module.exports = config;

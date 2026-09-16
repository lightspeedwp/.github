/**
 * Changelog Validator Configuration
 * Feature flags and settings for validation behavior
 */

module.exports = {
  // GitHub API Configuration
  github: {
    // Enable/disable GitHub API integration for PR/issue validation
    enabled: true,
    // Cache TTL in milliseconds (1 hour)
    cacheTTL: 60 * 60 * 1000,
    // Graceful degradation: if API unavailable, treat as valid
    gracefulDegradation: true,
  },

  // Validation Rules Configuration
  validation: {
    // Pre-release entries don't require valid PR links
    // Release entries must have valid PR/issue links
    strictForRelease: true,

    // Determine if entry is for pre-release or final release
    // Can be overridden per-entry with meta field
    releaseMode: "auto", // auto | prerelease | release

    // Rules to enable/disable globally
    rules: {
      R001: true, // no_implementation_details
      R002: true, // has_category
      R003: true, // has_title
      R004: true, // has_description
      R005: true, // reasonable_length
      R006: true, // no_excessive_punctuation
      R007: true, // proper_capitalization
      R008: true, // consistent_tense
      R009: true, // link_format_valid
      R010: true, // valid_pr_reference (uses GitHub API when enabled)
      R011: true, // no_internal_jargon
      R012: true, // no_code_samples
      R013: true, // no_database_details
      R014: true, // clear_user_benefit
      R015: true, // valid_date_format
      R016: true, // category_valid
      R017: true, // no_typos_common
      R018: true, // no_excessive_length
      R019: true, // entry_complete
      R020: true, // valid_category
    },
  },

  // Valid Category Values
  VALID_CATEGORIES: [
    'feature',
    'fix',
    'improvement',
    'breaking-change',
    'security',
    'performance'
  ],

  // Repository Configuration
  repository: {
    // Default owner for GitHub API calls
    owner: "lightspeedwp",
    // Default repo for GitHub API calls
    repo: ".github",
  },

  // Output Configuration
  output: {
    // Verbosity level: quiet | normal | verbose
    verbosity: "normal",
    // Include remediation guidance in output
    includeRemediationGuidance: true,
    // Include score details
    includeScoreDetails: true,
  },

  // Feature Flags
  features: {
    // Enable/disable changelog entry validation
    validateEntries: true,
    // Enable/disable changelog structure validation
    validateStructure: true,
    // Enable/disable GitHub API integration
    githubIntegration: true,
    // Enable/disable metrics collection
    metricsCollection: true,
    // Enable/disable report generation
    reportGeneration: true,
    // Enable/disable Markdown release notes export
    releaseNotesExport: true,
  },

  // Compliance Thresholds
  compliance: {
    // Minimum compliance percentage for "PASS" status
    passingThreshold: 100, // 100%
    // Minimum compliance percentage for "CONDITIONAL_PASS" status
    conditionalPassThreshold: 90, // >=90%
    // Below conditionalPassThreshold is "FAIL"
  },

  // Scoring Configuration
  scoring: {
    // Points deducted per error
    errorPenalty: 25,
    // Points deducted per warning
    warningPenalty: 5,
    // Base score (starts at this)
    baseScore: 100,
  },
};

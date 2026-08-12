/**
 * @lightspeedwp/metadata-agent — Main Entry Point
 *
 * Shared npm package for metadata agent operations across LightSpeedWP repositories.
 *
 * Exports all submodules for label utilities, GitHub API integration, validation,
 * confidence scoring, and error handling.
 *
 * @module @lightspeedwp/metadata-agent
 *
 * @example
 * // Import individual modules
 * import { labelUtils } from '@lightspeedwp/metadata-agent/label-utils';
 * import { createClient } from '@lightspeedwp/metadata-agent/api-client';
 * import { validation } from '@lightspeedwp/metadata-agent/validation';
 *
 * @example
 * // Or import from main entry point
 * import {
 *   labelUtils,
 *   apiClient,
 *   validation,
 *   confidenceScorer,
 *   errorHandler
 * } from '@lightspeedwp/metadata-agent';
 */

// Export label utilities
export {
  parse as parseLa,
  validate as validateLabel,
  suggest as suggestLabels,
  score as scoreLabel,
  getFamilies as getLabelFamilies,
  getLabelsByFamily,
  getAllCanonical,
  labelUtils
} from './label-utils.js';

// Export API client
export {
  createClient,
  authenticateClient,
  GitHubAPIClient,
  apiClient
} from './api-client.js';

// Export validation
export {
  validateTier1,
  validateTier2,
  validateTier3,
  getRecommendation,
  validation
} from './validation.js';

// Export confidence scorer
export {
  createScorer,
  ConfidenceScorer,
  confidenceScorer,
  DEFAULT_THRESHOLD
} from './confidence-scorer.js';

// Export error handler
export {
  catchError,
  retry,
  suggest,
  format,
  errorHandler,
  ERROR_TYPES
} from './error-handler.js';

/**
 * Package version
 * @type {string}
 */
export const VERSION = '1.0.0-rc.1';

/**
 * Complete API namespace for easier importing
 *
 * Contains all modules under a single export.
 *
 * @type {Object}
 *
 * @example
 * import { api } from '@lightspeedwp/metadata-agent';
 *
 * api.labelUtils.validate('type:bug');
 * api.createClient({ token: process.env.GITHUB_TOKEN });
 * api.validation.validateTier1(issues);
 */
export const api = {
  version: VERSION,
  labelUtils,
  apiClient,
  validation,
  confidenceScorer,
  errorHandler,
  createClient,
  authenticateClient,
  validateTier1,
  validateTier2,
  validateTier3,
  getRecommendation,
  createScorer,
  catchError,
  retry,
  suggest,
  format
};

export default api;

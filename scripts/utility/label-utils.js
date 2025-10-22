#!/usr/bin/env node
/**
 * ============================================================================
 * Script Name: label-utils.js
 * Location: scripts/utility/label-utils.js
 * Description: Labeling Utility Functions for LightSpeedWP. Provides helpers for
 *              label reporting and auto-labeling actions.
 * Version: v1.0.0
 * Author: LightSpeed WP Team
 * License: GPL v3 or later
 * Requirements: Node.js
 * Usage: Import for labeling reports
 * ============================================================================
 */
const { buildLabelingReport } = require('./build-labeling-report');

module.exports = {
  buildLabelingReport,
};
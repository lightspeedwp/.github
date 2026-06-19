#!/usr/bin/env node
/**
 * ============================================================================
 * Script Name: label-heuristics.js
 * Location: scripts/utility/label-heuristics.js
 * Description: Content-based heuristic functions for label suggestion.
 * Version: v1.0.0
 * Author: LightSpeed WP Team
 * License: GPL v3 or later
 * ============================================================================
 */
// TODO: Align this helper with the latest automation spec updates.

/**
 * Suggest labels from content using heuristics (regex, keywords, etc.)
 * @param {Object} item - { title, body }
 * @param {Object} aliasMap - for canonicalization
 * @returns {string[]} Array of suggested canonical label strings
 */
function suggestLabelsFromContent(item, aliasMap) {
  const heuristics = {
    "type:bug": [
      /\b(bug|error|issue|broken|fail|crash|exception|not working|fix)\b/i,
    ],
    "type:feature": [
      /\b(feature|enhancement|improvement|add|new|request|proposal|suggestion|create|implement|build|develop)\b/i,
    ],
    "type:documentation": [
      /\b(documentation|docs|readme|guide|tutorial|document|explain|clarify|describe)\b/i,
    ],
    "type:refactor": [
      /\b(refactor|restructure|reorganize|cleanup|optimize|improve|simplify|modernize)\b/i,
    ],
    "priority:critical": [
      /\b(urgent|critical|high priority|asap|blocking|production|live|customer|client)\b/i,
    ],
    "priority:minor": [
      /\b(low priority|nice to have|minor|cosmetic|polish)\b/i,
    ],
    "area:security": [
      /\b(security|vulnerability|exploit|attack|auth|authentication|permission|access|credential|token|password)\b/i,
    ],
    "area:performance": [
      /\b(performance|speed|slow|optimization|bottleneck|memory|cpu|latency|load time)\b/i,
    ],
  };
  const labels = new Set();
  const content = `${item.title || ""} ${item.body || ""}`.toLowerCase();
  for (const [label, patterns] of Object.entries(heuristics)) {
    for (const pattern of patterns) {
      if (pattern.test(content) && aliasMap[label]) {
        labels.add(aliasMap[label]);
        break;
      }
    }
  }
  return Array.from(labels);
}

module.exports = {
  suggestLabelsFromContent,
};

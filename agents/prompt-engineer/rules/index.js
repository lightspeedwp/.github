/**
 * Prompt Engineer Rules Index
 * Task 3.2: Framework-Specific Validation Rules
 *
 * Central export point for all validation rules across three frameworks:
 * - .github (Control plane: workflows, scripts, governance)
 * - WordPress Plugins (Hook names, block registration, plugin headers)
 * - WordPress Themes (theme.json, design tokens, templates)
 *
 * @version 1.0.0
 * @phase 3.2
 */

import { githubRules, validateGitHub } from './.github-rules.js';
import { pluginRules, validatePlugin } from './plugin-rules.js';
import { themeRules, validateTheme } from './theme-rules.js';

/**
 * Master validation engine
 * Detects context and validates against appropriate rules
 *
 * @param {string} text - Prompt or code to validate
 * @param {string} context - Context type ('github', 'plugin', 'theme') - auto-detected if omitted
 * @param {Object} options - Validation options
 * @returns {Object} {context, findings, stats}
 */
export function validate(text, context, options = {}) {
  const detectedContext = context || detectContext(text);
  let findings = [];
  let validationFn;

  switch (detectedContext) {
    case 'github':
      findings = validateGitHub(text, options);
      validationFn = validateGitHub;
      break;
    case 'plugin':
      findings = validatePlugin(text, options);
      validationFn = validatePlugin;
      break;
    case 'theme':
      findings = validateTheme(text, options);
      validationFn = validateTheme;
      break;
    default:
      // Run all validators
      findings = [
        ...validateGitHub(text, { ...options, strict: false }),
        ...validatePlugin(text, { ...options, strict: false }),
        ...validateTheme(text, { ...options, strict: false })
      ];
      detectedContext = 'multi';
  }

  return {
    context: detectedContext,
    findings: findings.sort((a, b) => {
      const severityOrder = { error: 0, warning: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }),
    stats: {
      total: findings.length,
      errors: findings.filter(f => f.severity === 'error').length,
      warnings: findings.filter(f => f.severity === 'warning').length,
      info: findings.filter(f => f.severity === 'info').length
    }
  };
}

/**
 * Context detection engine
 * Identifies which framework/context the prompt targets
 *
 * @param {string} text - Prompt or code text
 * @returns {string} Context: 'github', 'plugin', 'theme', or 'unknown'
 */
export function detectContext(text) {
  const lowerText = text.toLowerCase();

  // GitHub control-plane indicators
  const githubIndicators = [
    /\.github\/workflows/,
    /github actions?/i,
    /workflow_?dispatch/,
    /pull_?request/,
    /branch protect/i,
    /labeling.*github/i,
    /permission.*scope/i,
    /runs-on:/
  ];

  // WordPress plugin indicators
  const pluginIndicators = [
    /plugin name:/i,
    /add_action|add_filter/,
    /wp_enqueue_script/,
    /block\.json/,
    /register_rest_route/,
    /register_activation_hook/,
    /wp-block\.json/
  ];

  // WordPress theme indicators
  const themeIndicators = [
    /theme name:/i,
    /theme\.json/,
    /register_nav_menus?/,
    /templates?\//,
    /parts\//,
    /add_theme_support/,
    /style\.css.*theme/i
  ];

  const githubScore = githubIndicators.filter(r => r.test(text)).length;
  const pluginScore = pluginIndicators.filter(r => r.test(text)).length;
  const themeScore = themeIndicators.filter(r => r.test(text)).length;

  if (githubScore > 0 && githubScore >= pluginScore && githubScore >= themeScore) {
    return 'github';
  }
  if (pluginScore > 0 && pluginScore >= themeScore) {
    return 'plugin';
  }
  if (themeScore > 0) {
    return 'theme';
  }
  return 'unknown';
}

/**
 * Get all rules for a context
 * @param {string} context - 'github', 'plugin', 'theme'
 * @returns {Object} Rules object for that context
 */
export function getRules(context) {
  switch (context) {
    case 'github':
      return githubRules;
    case 'plugin':
      return pluginRules;
    case 'theme':
      return themeRules;
    default:
      return { github: githubRules, plugin: pluginRules, theme: themeRules };
  }
}

/**
 * Get summary of all rules
 * @returns {Object} Summary with counts and descriptions
 */
export function getSummary() {
  const allRules = {
    github: Object.keys(githubRules).length,
    plugin: Object.keys(pluginRules).length,
    theme: Object.keys(themeRules).length
  };

  return {
    total: Object.values(allRules).reduce((a, b) => a + b, 0),
    byContext: allRules,
    description: 'Framework-specific validation rules for prompt engineering across three contexts'
  };
}

/**
 * Generate a report for findings
 * @param {Object} validationResult - Result from validate()
 * @returns {string} Formatted report
 */
export function generateReport(validationResult) {
  const { context, findings, stats } = validationResult;

  let report = `\n📊 Validation Report\n`;
  report += `Context: ${context}\n`;
  report += `Total findings: ${stats.total} (${stats.errors} errors, ${stats.warnings} warnings, ${stats.info} info)\n\n`;

  if (findings.length === 0) {
    report += `✅ No issues found!\n`;
  } else {
    const byServer = {};
    findings.forEach(f => {
      const severity = f.severity.toUpperCase();
      if (!byServer[severity]) byServer[severity] = [];
      byServer[severity].push(f);
    });

    ['ERROR', 'WARNING', 'INFO'].forEach(severity => {
      if (byServer[severity]) {
        report += `\n${severity}S:\n`;
        byServer[severity].forEach(f => {
          report += `  • ${f.rule}\n`;
          report += `    ${f.message}\n`;
          if (f.suggestion) report += `    💡 ${f.suggestion}\n`;
        });
      }
    });
  }

  return report;
}

// Export all rules and validators
export { githubRules, validateGitHub } from './.github-rules.js';
export { pluginRules, validatePlugin } from './plugin-rules.js';
export { themeRules, validateTheme } from './theme-rules.js';

export default {
  validate,
  detectContext,
  getRules,
  getSummary,
  generateReport,
  githubRules,
  pluginRules,
  themeRules,
  validateGitHub,
  validatePlugin,
  validateTheme
};

class ReportFormatter {
  static formatJSON(report) {
    return JSON.stringify(report, null, 2);
  }

  static formatText(report) {
    let output = '';

    output += '\n';
    output += '════════════════════════════════════════════════════════════\n';
    output += '    CHANGELOG QUALITY VALIDATION REPORT\n';
    output += '════════════════════════════════════════════════════════════\n';
    output += '\n';

    // Summary
    const summary = report.summary || {};
    output += `Total Entries:      ${summary.total_entries || 0}\n`;
    output += `Compliant:          ${summary.passed || 0} (${summary.pass_rate || 0}%)\n`;
    output += `Non-Compliant:      ${summary.failed || 0}\n`;
    output += '\n';

    // Gate result
    const gateResult = report.ci_gate_result || 'unknown';
    const recommendation = report.recommendation || 'unknown';
    const gateIcon = gateResult === 'pass' ? '✓' : gateResult === 'warning' ? '⚠' : '✗';

    output += `Gate Result:        ${gateIcon} ${gateResult.toUpperCase()}\n`;
    output += `Recommendation:     ${recommendation}\n`;
    output += '\n';

    // Violations by rule
    const violations = report.violations_by_rule || [];
    if (violations.length > 0) {
      output += '════════════════════════════════════════════════════════════\n';
      output += 'ISSUES FOUND\n';
      output += '════════════════════════════════════════════════════════════\n';
      output += '\n';

      for (const violation of violations) {
        output += `${violation.rule_id} [${violation.severity.toUpperCase()}]: ${violation.count} violation(s)\n`;

        for (const entry of violation.entries || []) {
          output += `  • ${entry.entry_id}: ${entry.message}\n`;
        }

        output += '\n';
      }
    }

    // Timestamp and trigger
    output += '════════════════════════════════════════════════════════════\n';
    output += `Timestamp:          ${report.timestamp || 'unknown'}\n`;
    output += `Trigger:            ${report.trigger || 'manual'}\n`;

    if (report.ci_context) {
      output += `CI System:          ${report.ci_context.ci_system || 'local'}\n`;
      output += `Branch:             ${report.ci_context.branch || 'unknown'}\n`;
      if (report.ci_context.pr_number) {
        output += `PR Number:          ${report.ci_context.pr_number}\n`;
      }
    }

    output += '════════════════════════════════════════════════════════════\n';
    output += '\n';

    return output;
  }

  static formatMarkdown(report) {
    let output = '';

    const summary = report.summary || {};
    const gateResult = report.ci_gate_result || 'unknown';
    const recommendation = report.recommendation || 'unknown';
    const violations = report.violations_by_rule || [];

    // Header
    output += '## 📋 Changelog Quality Validation\n\n';

    // Summary table
    output += '### Summary\n\n';
    output += '| Metric | Value |\n';
    output += '|--------|-------|\n';
    output += `| Total Entries | ${summary.total_entries || 0} |\n`;
    output += `| ✅ Compliant | ${summary.passed || 0} (${summary.pass_rate || 0}%) |\n`;
    output += `| ❌ Non-Compliant | ${summary.failed || 0} |\n`;
    output += '\n';

    // Status
    const statusIcon = gateResult === 'pass' ? '✅' : gateResult === 'warning' ? '⚠️' : '❌';
    const statusText =
      gateResult === 'pass' ? 'PASSED' : gateResult === 'warning' ? 'WARNING' : 'FAILED';

    output += '### Status\n\n';
    output += `${statusIcon} **Validation ${statusText}**\n\n`;

    if (gateResult === 'fail') {
      output +=
        'Please fix the issues below before merging. All changelog entries must pass validation.\n\n';
    } else if (gateResult === 'warning') {
      output += 'Review the warnings below and consider addressing them for better quality.\n\n';
    } else {
      output += 'All entries meet quality standards! ✨\n\n';
    }

    output += `**Recommendation:** ${recommendation}\n\n`;

    // Violations
    if (violations.length > 0) {
      output += '### Issues Found\n\n';

      for (const violation of violations) {
        const severityBadge =
          violation.severity === 'critical'
            ? '🔴'
            : violation.severity === 'high'
              ? '🟠'
              : violation.severity === 'medium'
                ? '🟡'
                : '🔵';

        output += `#### ${severityBadge} ${violation.rule_id}\n\n`;
        output += `**Severity:** ${violation.severity}\n`;
        output += `**Count:** ${violation.count} violation(s)\n\n`;

        output += '**Examples:**\n\n';
        for (const entry of violation.entries || []) {
          output += `- _${entry.entry_id}_: ${entry.message}\n`;
        }

        output += '\n';
      }
    }

    // How to fix
    output += '### How to Fix\n\n';
    output += 'Run validation locally:\n\n';
    output += '```bash\n';
    output += 'cd .github/validation/changelog\n';
    output += 'node bin/validate.js --changelog-path ../../../CHANGELOG.md\n';
    output += '```\n\n';

    // Footer
    output += `_Report generated at ${report.timestamp || new Date().toISOString()}_\n`;

    return output;
  }

  static formatCSV(report) {
    const summary = report.summary || {};
    const violations = report.violations_by_rule || [];

    let output = '';

    // Summary section
    output += 'SUMMARY\n';
    output += 'Metric,Value\n';
    output += `Total Entries,${summary.total_entries || 0}\n`;
    output += `Compliant,${summary.passed || 0}\n`;
    output += `Non-Compliant,${summary.failed || 0}\n`;
    output += `Pass Rate,${summary.pass_rate || 0}%\n`;
    output += `Gate Result,${report.ci_gate_result || 'unknown'}\n`;
    output += '\n';

    // Violations section
    if (violations.length > 0) {
      output += 'VIOLATIONS\n';
      output += 'Rule ID,Severity,Count,Entry IDs\n';

      for (const violation of violations) {
        const entryIds = violation.entries?.map((e) => e.entry_id).join('; ') || '';

        output += `"${violation.rule_id}","${violation.severity}",${violation.count},"${entryIds}"\n`;
      }
    }

    return output;
  }

  static formatHTML(report) {
    const summary = report.summary || {};
    const gateResult = report.ci_gate_result || 'unknown';
    const violations = report.violations_by_rule || [];

    const statusClass =
      gateResult === 'pass'
        ? 'status-pass'
        : gateResult === 'warning'
          ? 'status-warning'
          : 'status-fail';

    let html = '';

    html += '<!DOCTYPE html>\n';
    html += '<html lang="en">\n';
    html += '<head>\n';
    html += '<meta charset="UTF-8">\n';
    html += '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    html += '<title>Changelog Validation Report</title>\n';
    html += '<style>\n';
    html +=
      'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 20px; }\n';
    html +=
      '.container { max-width: 900px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; }\n';
    html +=
      '.header { border-bottom: 2px solid #ddd; padding-bottom: 20px; margin-bottom: 20px; }\n';
    html += '.status { padding: 12px; border-radius: 4px; margin: 12px 0; font-weight: bold; }\n';
    html += '.status-pass { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }\n';
    html += '.status-warning { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }\n';
    html += '.status-fail { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }\n';
    html += 'table { width: 100%; border-collapse: collapse; margin: 12px 0; }\n';
    html += 'th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }\n';
    html += 'th { background: #f5f5f5; font-weight: bold; }\n';
    html +=
      '.violation { margin: 20px 0; padding: 12px; border-left: 4px solid #ff6b6b; background: #f9f9f9; }\n';
    html += '</style>\n';
    html += '</head>\n';
    html += '<body>\n';

    html += '<div class="container">\n';
    html += '<div class="header"><h1>📋 Changelog Quality Validation Report</h1></div>\n';

    // Summary
    html += '<h2>Summary</h2>\n';
    html += '<table>\n';
    html += `<tr><td>Total Entries</td><td><strong>${summary.total_entries || 0}</strong></td></tr>\n`;
    html += `<tr><td>Compliant</td><td><strong>${summary.passed || 0}</strong> (${summary.pass_rate || 0}%)</td></tr>\n`;
    html += `<tr><td>Non-Compliant</td><td><strong>${summary.failed || 0}</strong></td></tr>\n`;
    html += '</table>\n';

    // Status
    html += `<div class="status ${statusClass}">Status: ${gateResult.toUpperCase()}</div>\n`;

    // Violations
    if (violations.length > 0) {
      html += '<h2>Issues Found</h2>\n';

      for (const violation of violations) {
        html += `<div class="violation">\n`;
        html += `<h3>${violation.rule_id} <span style="font-size: 0.8em; color: #999;">[${violation.severity}]</span></h3>\n`;
        html += `<p><strong>Count:</strong> ${violation.count} violation(s)</p>\n`;
        html += '<p><strong>Examples:</strong></p>\n';
        html += '<ul>\n';

        for (const entry of violation.entries || []) {
          html += `<li><code>${entry.entry_id}</code>: ${entry.message}</li>\n`;
        }

        html += '</ul>\n';
        html += '</div>\n';
      }
    }

    html += `<p style="color: #999; font-size: 0.9em;">Generated: ${report.timestamp || new Date().toISOString()}</p>\n`;
    html += '</div>\n';
    html += '</body>\n';
    html += '</html>\n';

    return html;
  }

  static format(report, format = 'text') {
    switch (format) {
      case 'json':
        return ReportFormatter.formatJSON(report);
      case 'markdown':
      case 'md':
        return ReportFormatter.formatMarkdown(report);
      case 'csv':
        return ReportFormatter.formatCSV(report);
      case 'html':
        return ReportFormatter.formatHTML(report);
      case 'text':
      default:
        return ReportFormatter.formatText(report);
    }
  }
}

export default ReportFormatter;

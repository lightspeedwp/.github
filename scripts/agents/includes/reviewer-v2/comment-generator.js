const path = require('path');

class CommentGenerator {
  constructor(options = {}) {
    this.options = {
      maxFindingsPerCategory: options.maxFindingsPerCategory || 10,
      includeToolBreakdown: options.includeToolBreakdown !== false,
      includeLinks: options.includeLinks !== false,
      format: options.format || 'markdown',
    };
  }

  generate(decisions) {
    if (!decisions || typeof decisions !== 'object') {
      return '';
    }

    const { auto_resolved = [], suppressed = [], requires_review = [] } = decisions;

    const sections = [];

    if (requires_review.length > 0) {
      sections.push(this.generateRequiresReviewSection(requires_review));
    }

    if (auto_resolved.length > 0) {
      sections.push(this.generateAutoResolvedSection(auto_resolved));
    }

    if (suppressed.length > 0) {
      sections.push(this.generateSuppressedSection(suppressed));
    }

    if (sections.length === 0) {
      return this.generateNoFindingsMessage();
    }

    const header = this.generateHeader(requires_review, auto_resolved, suppressed);
    const footer = this.generateFooter(requires_review.length, auto_resolved.length);

    return [header, ...sections, footer].join('\n\n');
  }

  generateHeader(requiresReview, autoResolved, suppressed) {
    let summary = '## Code Review Summary\n\n';

    const counts = {
      requires_review: requiresReview.length,
      auto_resolved: autoResolved.length,
      suppressed: suppressed.length,
    };

    const escalated = requiresReview.filter(f => f.escalated).length;

    if (escalated > 0) {
      summary += `🚨 **${escalated} critical finding(s) requiring immediate attention**\n\n`;
    }

    summary += '| Status | Count |\n';
    summary += '|--------|-------|\n';
    summary += `| 🔍 Requires Review | ${counts.requires_review} |\n`;
    summary += `| ✅ Auto-Resolved | ${counts.auto_resolved} |\n`;
    summary += `| ⏭️ Suppressed | ${counts.suppressed} |\n`;
    summary += `| **Total** | **${counts.requires_review + counts.auto_resolved + counts.suppressed}** |\n`;

    return summary;
  }

  generateRequiresReviewSection(findings) {
    const escalated = findings.filter(f => f.escalated);
    const standard = findings.filter(f => !f.escalated);

    let section = '### 🔍 Requires Review\n\n';

    if (escalated.length > 0) {
      section += '#### 🚨 Critical/Escalated\n\n';
      section += this.generateFindingsTable(escalated);
      section += '\n\n';
    }

    if (standard.length > 0) {
      section += '#### Standard Review Items\n\n';
      section += this.generateFindingsTable(standard);
    }

    return section;
  }

  generateAutoResolvedSection(findings) {
    const section = '### ✅ Auto-Resolved\n\n';
    const grouped = this.groupByCategory(findings);

    let content = section;

    for (const [category, items] of Object.entries(grouped)) {
      content += `**${this.formatCategory(category)}**: ${items.length} finding(s)\n`;
    }

    content += '\n_These findings have been automatically resolved based on configured patterns._\n';

    return content;
  }

  generateSuppressedSection(findings) {
    const section = '### ⏭️ Suppressed\n\n';
    const grouped = this.groupByCategory(findings);

    let content = section;

    for (const [category, items] of Object.entries(grouped)) {
      content += `**${this.formatCategory(category)}**: ${items.length} finding(s)\n`;
    }

    content += '\n_These findings have been suppressed based on exclusion rules or false positive patterns._\n';

    return content;
  }

  generateFindingsTable(findings) {
    let table = '| File | Line | Severity | Category | Message | Tools |\n';
    table += '|------|------|----------|----------|---------|-------|\n';

    const limited = findings.slice(0, this.options.maxFindingsPerCategory);

    for (const finding of limited) {
      const file = this.formatFile(finding.file);
      const line = finding.line || '-';
      const severity = this.formatSeverity(finding.severity);
      const category = this.formatCategory(finding.category);
      const message = this.truncateMessage(finding.suggestion, 60);
      const tools = this.formatTools(finding);

      table += `| ${file} | ${line} | ${severity} | ${category} | ${message} | ${tools} |\n`;
    }

    if (findings.length > this.options.maxFindingsPerCategory) {
      const remaining = findings.length - this.options.maxFindingsPerCategory;
      table += `\n_... and ${remaining} more finding(s)_`;
    }

    return table;
  }

  generateFooter(requiresReviewCount, autoResolvedCount) {
    let footer = '---\n\n';

    footer += '**Review Actions:**\n\n';

    if (requiresReviewCount > 0) {
      footer += '- [ ] Review and address the findings above\n';
      footer += '- [ ] Run tests to ensure changes are correct\n';
      footer += '- [ ] Comment on specific findings if you have questions\n';
    } else {
      footer += '- ✅ All findings have been addressed or suppressed\n';
    }

    if (autoResolvedCount > 0) {
      footer += '- ℹ️ Some findings may have been auto-resolved; please verify\n';
    }

    footer += '\n_Generated by Reviewer Agent v2 — Phase 2B (Feedback Processor, Decision Engine, Comment Generator)_';

    return footer;
  }

  generateNoFindingsMessage() {
    return '## Code Review Summary\n\n✅ **No findings** — All code reviews passed successfully!';
  }

  formatFile(filePath) {
    if (!filePath) return '-';
    return `\`${path.basename(filePath)}\``;
  }

  formatSeverity(severity) {
    const icons = {
      critical: '🔴',
      major: '🟠',
      minor: '🟡',
    };

    return `${icons[severity] || '⚪'} ${severity}`;
  }

  formatCategory(category) {
    if (!category) {
      return 'Unknown';
    }

    return category
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  formatTools(finding) {
    if (!finding.tool && !finding.tools) {
      return '-';
    }

    if (finding.tools && Array.isArray(finding.tools)) {
      return finding.tools.map(t => this.toolBadge(t)).join(' ');
    }

    return this.toolBadge(finding.tool);
  }

  toolBadge(tool) {
    const badges = {
      'coderabbit': '🐰',
      'code-quality': '📊',
      'copilot': '✨',
      'wordpress-quality': '🔌',
    };

    const icon = badges[tool] || '🔧';
    return `\`${icon} ${tool}\``;
  }

  truncateMessage(message, maxLength = 60) {
    if (!message) return '-';

    if (message.length <= maxLength) {
      return message.replace(/[|]/g, '\\|');
    }

    return message.slice(0, maxLength - 3).replace(/[|]/g, '\\|') + '...';
  }

  groupByCategory(findings) {
    const grouped = {};

    for (const finding of findings) {
      const category = finding.category || 'unknown';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(finding);
    }

    return grouped;
  }

  generateInlineComments(findings) {
    if (!Array.isArray(findings) || findings.length === 0) {
      return [];
    }

    const comments = [];

    for (const finding of findings) {
      if (!finding.file || !finding.line) {
        continue;
      }

      const comment = {
        path: finding.file,
        line: finding.line,
        body: this.generateInlineComment(finding),
      };

      comments.push(comment);
    }

    return comments;
  }

  generateInlineComment(finding) {
    let comment = '';

    const severity = finding.severity ? `**${finding.severity.toUpperCase()}**` : 'ISSUE';
    comment += `${severity}: ${finding.suggestion}\n\n`;

    if (finding.category) {
      comment += `Category: \`${finding.category}\`\n`;
    }

    if (finding.tools || finding.tool) {
      const tools = Array.isArray(finding.tools) ? finding.tools : [finding.tool];
      comment += `Detected by: ${tools.map(t => this.toolBadge(t)).join(', ')}\n`;
    }

    if (finding.decision_reason && Array.isArray(finding.decision_reason)) {
      comment += `\nReason: ${finding.decision_reason.join('; ')}\n`;
    }

    return comment;
  }

  generateSummaryStats(findings) {
    const stats = {
      total: findings.length,
      by_severity: {
        critical: 0,
        major: 0,
        minor: 0,
      },
      by_category: {},
      by_tool: {},
    };

    for (const finding of findings) {
      if (finding.severity) {
        stats.by_severity[finding.severity] = (stats.by_severity[finding.severity] || 0) + 1;
      }

      if (finding.category) {
        stats.by_category[finding.category] = (stats.by_category[finding.category] || 0) + 1;
      }

      const tools = Array.isArray(finding.tools) ? finding.tools : [finding.tool];
      for (const tool of tools) {
        if (tool) {
          stats.by_tool[tool] = (stats.by_tool[tool] || 0) + 1;
        }
      }
    }

    return stats;
  }

  reset() {
    // No internal state to reset
  }
}

module.exports = {
  CommentGenerator,
};

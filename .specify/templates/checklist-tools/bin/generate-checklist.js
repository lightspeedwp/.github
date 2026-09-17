#!/usr/bin/env node

/**
 * Generate Checklist
 * CLI tool to generate requirement quality checklists from templates
 * Usage: checklist --template base --audience author --domain base [--output checklist.md]
 */

const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const lib = require('../lib/index.js');

const args = minimist(process.argv.slice(2), {
  string: ['template', 'audience', 'domain', 'output', 'title', 'spec-ref'],
  boolean: ['help', 'version', 'json'],
  alias: {
    h: 'help',
    v: 'version',
    t: 'template',
    a: 'audience',
    d: 'domain',
    o: 'output',
    j: 'json',
  },
});

const VERSION = '1.0.0';

// Help text
const HELP = `
Requirements Quality Checklist Generator v${VERSION}

Usage:
  checklist [options]

Options:
  -t, --template <name>      Template name (default: base)
  -a, --audience <type>      Audience type: author, peer, stakeholder, integration
  -d, --domain <name>        Domain: base, ux, api, security, performance, custom
  --title <title>            Specification title (optional)
  --spec-ref <path>          Specification reference path (optional)
  -o, --output <file>        Output file (default: stdout)
  -j, --json                 Output as JSON instead of markdown
  -h, --help                 Show this help
  -v, --version              Show version

Examples:
  checklist --audience author --domain base
  checklist -a peer -d api --output api-checklist.md
  checklist -a stakeholder -d security --json
`;

if (args.help) {
  console.log(HELP);
  process.exit(0);
}

if (args.version) {
  console.log(`Requirements Quality Checklist Generator v${VERSION}`);
  process.exit(0);
}

// Get arguments with defaults
const template = args.template || args.t || 'base';
const audience = args.audience || args.a || 'author';
const domain = args.domain || args.d || 'base';
const title = args.title || `Quality Checklist — ${domain} Domain`;
const specRef = args['spec-ref'] || '';
const outputFile = args.output || args.o || null;
const jsonOutput = args.json || args.j || false;

// Validate inputs
const validAudiences = ['author', 'peer', 'stakeholder', 'integration'];
const validDomains = ['base', 'ux', 'api', 'security', 'performance', 'custom'];

if (!validAudiences.includes(audience)) {
  console.error(`Error: Invalid audience '${audience}'. Valid: ${validAudiences.join(', ')}`);
  process.exit(1);
}

if (!validDomains.includes(domain)) {
  console.error(`Error: Invalid domain '${domain}'. Valid: ${validDomains.join(', ')}`);
  process.exit(1);
}

// Generate checklist
function generateChecklist() {
  // Create base items
  const baseItems = generateBaseItems();

  // Add domain-specific items if not base
  const allItems = domain !== 'base' ? [...baseItems, ...generateDomainItems(domain)] : baseItems;

  // Filter by audience if needed (audience-specific guidance is added separately)
  const filteredItems = filterByAudience(allItems, audience);

  // Calculate metrics
  const metrics = lib.calculateMetrics(filteredItems);
  const report = lib.calculateReport(filteredItems);

  // Format output
  let output;
  if (jsonOutput) {
    output = generateJSON(filteredItems, metrics, report);
  } else {
    output = generateMarkdown(filteredItems, metrics, report, audience);
  }

  return output;
}

function generateBaseItems() {
  // Get dimensions and create items from them
  const dimensions = lib.getDimensionNames();
  const items = [];
  let itemId = 1;

  dimensions.forEach((dimension) => {
    const dimData = lib.getDimension(dimension);
    if (dimData && dimData.items) {
      dimData.items.forEach((question) => {
        items.push({
          id: `CHK-${String(itemId).padStart(3, '0')}-${dimension}`,
          question,
          dimension,
          state: 'unchecked',
        });
        itemId++;
      });
    }
  });

  return items;
}

function generateDomainItems(domain) {
  // Placeholder for domain-specific items
  // In Phase 4, domain-specific items would be loaded from domain variant files
  return [];
}

function filterByAudience(items, audience) {
  // In Phase 5, audience-specific filtering would be applied
  // For now, return all items (no filtering)
  return items;
}

function generateMarkdown(items, metrics, report, audience) {
  const now = new Date().toISOString().split('T')[0];
  const audienceLabel =
    {
      author: 'Author Pre-Review (Self-Check)',
      peer: 'Peer Reviewer Feedback',
      stakeholder: 'Stakeholder Go/No-Go',
      integration: 'Integration Reviewer',
    }[audience] || 'Quality Checklist';

  let output = `# Requirements Quality Checklist\n\n`;
  output += `**Checklist**: ${audienceLabel}  \n`;
  output += `**Domain**: ${domain}  \n`;
  output += `**Date**: ${now}  \n`;

  if (specRef) {
    output += `**Specification**: ${specRef}  \n`;
  }

  output += `\n---\n\n`;

  // Audience-specific guidance
  const audienceGuidance = {
    author:
      '**Guidance**: Self-review your specification against these quality dimensions. Complete in ~30 minutes. Mark items as you verify each aspect.',
    peer: '**Guidance**: Review specification for completeness and clarity. This is feedback prioritization, not implementation testing. Target: 45 minutes.',
    stakeholder:
      '**Guidance**: Assess whether this specification is clear and complete enough to proceed with implementation. Target: 15 minutes go/no-go decision.',
    integration:
      '**Guidance**: Verify that this specification aligns with other related specifications and systems. Cross-project validation.',
  };

  output += `${audienceGuidance[audience] || ''}\n\n`;

  // Group items by dimension
  const grouped = lib.classifyByDimension(items);

  Object.entries(grouped).forEach(([dimension, dimItems]) => {
    if (dimItems.length > 0) {
      output += `## ${dimension}\n\n`;
      dimItems.forEach((item) => {
        const checkbox = item.state === 'checked' ? '[x]' : '[ ]';
        output += `- ${checkbox} ${item.id}: ${item.question}\n`;
      });
      output += `\n`;
    }
  });

  // Summary section
  output += `---\n\n`;
  output += `## Summary\n\n`;
  output += `| Metric | Value |\n`;
  output += `|--------|-------|\n`;
  output += `| Total Items | ${metrics.totalItems} |\n`;
  output += `| Checked Items | ${metrics.checkedItems} |\n`;
  output += `| Unchecked Items | ${metrics.uncheckedItems} |\n`;
  output += `| Completion % | ${metrics.completionPercent}% |\n`;
  output += `| Gaps | ${metrics.gaps} |\n`;
  output += `| Ambiguities | ${metrics.ambiguities} |\n`;
  output += `| Critical Ambiguities | ${metrics.criticalAmbiguities} |\n\n`;

  output += `**Status**: ${report.symbol} **${report.description}**\n\n`;

  if (report.blockingIssues.length > 0) {
    output += `**Blocking Issues**:\n`;
    report.blockingIssues.forEach((issue) => {
      output += `- ${issue}\n`;
    });
    output += `\n`;
  }

  if (report.recommendedActions.length > 0) {
    output += `**Next Steps**:\n`;
    report.recommendedActions.forEach((action) => {
      output += `- ${action}\n`;
    });
  }

  return output;
}

function generateJSON(items, metrics, report) {
  const now = new Date().toISOString();

  return JSON.stringify(
    {
      checklist: {
        metadata: {
          id: `checklist-${domain}-${audience}-${Date.now()}`,
          domain,
          audience,
          specificationRef: specRef,
          generatedAt: now,
        },
        items,
        summary: {
          totalItems: metrics.totalItems,
          checkedItems: metrics.checkedItems,
          uncheckedItems: metrics.uncheckedItems,
          completionPercent: metrics.completionPercent,
          gaps: metrics.gaps,
          ambiguities: metrics.ambiguities,
          criticalAmbiguities: metrics.criticalAmbiguities,
          status: report.status,
        },
      },
    },
    null,
    2
  );
}

// Main execution
try {
  const output = generateChecklist();

  if (outputFile) {
    fs.writeFileSync(outputFile, output);
    console.log(`✓ Checklist generated: ${outputFile}`);
  } else {
    console.log(output);
  }
} catch (err) {
  console.error(`Error generating checklist: ${err.message}`);
  process.exit(1);
}

#!/usr/bin/env node
/**
 * Active Projects Status Update Helper
 *
 * Scans all active projects and generates reports/templates for:
 * 1. Projects missing status/priority/type/effort fields
 * 2. Projects missing Related Issues section
 * 3. Template updates needed for two-way linking
 *
 * Usage:
 *   node update-projects-status.cjs [audit|template|link]
 *   - audit: Report missing fields and sections
 *   - template: Generate README template for each project
 *   - link: Generate issue linking suggestions
 */

const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = '.github/projects/active';
const REQUIRED_FIELDS = ['status', 'priority', 'type', 'effort'];
const REQUIRED_SECTIONS = ['Related Issues'];

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function readFile(filepath) {
  try {
    return fs.readFileSync(filepath, 'utf8');
  } catch {
    return null;
  }
}

function parseYAMLFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const yaml = match[1];
  const obj = {};
  yaml.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      obj[key.trim()] = valueParts.join(':').trim();
    }
  });
  return obj;
}

function hasFrontmatterField(content, field) {
  const frontmatter = parseYAMLFrontmatter(content);
  return field in frontmatter;
}

function hasSection(content, section) {
  return new RegExp(`^## ${section}`, 'm').test(content);
}

function getProjects() {
  if (!fs.existsSync(PROJECTS_DIR)) {
    log(`Projects directory not found: ${PROJECTS_DIR}`, 'red');
    process.exit(1);
  }

  return fs.readdirSync(PROJECTS_DIR)
    .filter(name => {
      const stat = fs.statSync(path.join(PROJECTS_DIR, name));
      return stat.isDirectory() && !name.startsWith('_');
    })
    .sort();
}

function auditCommand() {
  log('\n=== PROJECT AUDIT ===\n', 'cyan');

  const projects = getProjects();
  const results = {
    total: projects.length,
    missingFields: [],
    missingSections: [],
    complete: [],
  };

  projects.forEach(project => {
    const readmePath = path.join(PROJECTS_DIR, project, 'README.md');
    const content = readFile(readmePath);

    if (!content) {
      log(`✗ ${project}: No README.md`, 'red');
      return;
    }

    const missing = {
      fields: REQUIRED_FIELDS.filter(f => !hasFrontmatterField(content, f)),
      sections: REQUIRED_SECTIONS.filter(s => !hasSection(content, s)),
    };

    if (missing.fields.length === 0 && missing.sections.length === 0) {
      log(`✓ ${project}`, 'green');
      results.complete.push(project);
    } else {
      if (missing.fields.length > 0) {
        log(`⚠ ${project}: Missing fields: ${missing.fields.join(', ')}`, 'yellow');
        results.missingFields.push({ project, fields: missing.fields });
      }
      if (missing.sections.length > 0) {
        log(`⚠ ${project}: Missing sections: ${missing.sections.join(', ')}`, 'yellow');
        results.missingSections.push({ project, sections: missing.sections });
      }
    }
  });

  log('\n=== SUMMARY ===\n', 'cyan');
  log(`Total projects: ${results.total}`, 'blue');
  log(`Complete: ${results.complete.length}`, 'green');
  log(`Missing fields: ${results.missingFields.length}`, 'yellow');
  log(`Missing sections: ${results.missingSections.length}`, 'yellow');

  if (results.missingFields.length > 0) {
    log('\nProjects needing frontmatter updates:', 'yellow');
    results.missingFields.forEach(({ project, fields }) => {
      log(`  - ${project}: ${fields.join(', ')}`);
    });
  }

  if (results.missingSections.length > 0) {
    log('\nProjects needing Related Issues section:', 'yellow');
    results.missingSections.forEach(({ project }) => {
      log(`  - ${project}`);
    });
  }
}

function templateCommand() {
  log('\n=== TEMPLATE GENERATOR ===\n', 'cyan');

  const projects = getProjects();

  projects.forEach(project => {
    const readmePath = path.join(PROJECTS_DIR, project, 'README.md');
    const content = readFile(readmePath);

    if (!content) {
      log(`\n📄 ${project}/README.md: [NEEDS CREATION]`, 'yellow');
      return;
    }

    const missing = {
      fields: REQUIRED_FIELDS.filter(f => !hasFrontmatterField(content, f)),
      sections: REQUIRED_SECTIONS.filter(s => !hasSection(content, s)),
    };

    if (missing.fields.length === 0 && missing.sections.length === 0) {
      return;
    }

    log(`\n📄 ${project}/README.md:\n`, 'blue');

    if (missing.fields.length > 0) {
      log('Add to frontmatter (after first ---):', 'yellow');
      log(`status: active|pending|review|blocked|at_risk`);
      log(`priority: critical|high|medium|low`);
      log(`type: feature|infrastructure|maintenance|documentation`);
      log(`effort: "24h"`);
      log(`last_updated: ${new Date().toISOString().split('T')[0]}\n`);
    }

    if (missing.sections.length > 0) {
      log('Add new section:', 'yellow');
      log(`\n## Related Issues & PRs\n`);
      log(`| Issue/PR | Type | Status | Purpose |`);
      log(`|----------|------|--------|---------|`);
      log(`| [#XXXX](https://github.com/lightspeedwp/.github/issues/XXXX) | Issue | Open | Description |`);
      log(`\nSee [Full Project Definition](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/${project}/PLANNING.md)\n`);
    }
  });
}

function linkCommand() {
  log('\n=== LINKING SUGGESTIONS ===\n', 'cyan');

  const projects = getProjects();

  log('To create two-way links:\n', 'blue');

  projects.forEach(project => {
    const readmePath = path.join(PROJECTS_DIR, project, 'README.md');
    const content = readFile(readmePath);

    if (!content) return;

    // Extract issue numbers from related issues section
    const issuesMatch = content.match(/## Related Issues[\s\S]*?(?=##|$)/);
    if (!issuesMatch) {
      log(`\n${project}: Add tracking issues`, 'yellow');
      log(`  No Related Issues section found. Create one with relevant issue numbers.\n`);
      return;
    }

    const issueNumbers = (issuesMatch[0].match(/#(\d+)/g) || [])
      .map(m => m.slice(1))
      .filter(Boolean);

    if (issueNumbers.length === 0) {
      log(`\n${project}: Add issue links`, 'yellow');
      log(`  Related Issues section exists but has no issue numbers.\n`);
      return;
    }

    log(`\n${project}: Link back from issues:`, 'green');
    issueNumbers.forEach(issueNum => {
      log(`  Issue #${issueNum}:`);
      log(`    Add to issue body:`);
      log(`    ## 📋 Project Reference`);
      log(`    **Related Project:** [${project}](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/${project}/README.md)`);
      log(`    See [Project PLANNING](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/${project}/PLANNING.md)\n`);
    });
  });
}

function showHelp() {
  console.log(`
Active Projects Status Update Helper

Usage: node update-projects-status.cjs [command]

Commands:
  audit       Report missing fields and sections (default)
  template    Generate update templates for each project
  link        Generate two-way linking suggestions
  help        Show this message

Examples:
  node update-projects-status.cjs audit
  node update-projects-status.cjs template
  node update-projects-status.cjs link

Required fields in README.md:
  - status: active|pending|review|blocked|at_risk
  - priority: critical|high|medium|low
  - type: feature|infrastructure|maintenance|documentation
  - effort: "XXh" format

Required sections:
  - ## Related Issues & PRs
  `);
}

// Main
const command = process.argv[2] || 'audit';

switch (command) {
  case 'audit':
    auditCommand();
    break;
  case 'template':
    templateCommand();
    break;
  case 'link':
    linkCommand();
    break;
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    log(`Unknown command: ${command}\n`, 'red');
    showHelp();
    process.exit(1);
}

log('\n');

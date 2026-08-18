#!/usr/bin/env node
/**
 * Batch Update Projects Helper
 *
 * Simplifies updating multiple projects with status/priority/type/effort fields.
 * Automatically updates frontmatter in README.md files.
 *
 * Usage:
 *   node batch-update-projects.cjs [command] [options]
 *
 * Commands:
 *   update <project1,project2,...> --status=active --priority=high --type=feature --effort=24h
 *   batch-file <filepath>   # Update projects from CSV file
 *   generate-csv            # Generate CSV template
 *   validate                # Check updates before commit
 *   help                    # Show this help
 *
 * Examples:
 *   # Update single project
 *   node batch-update-projects.cjs update testing-agent-phase-2-4-2-7 \\
 *     --status=active --priority=critical --type=feature --effort=40h
 *
 *   # Update multiple projects
 *   node batch-update-projects.cjs update project1,project2,project3 \\
 *     --priority=high --type=infrastructure --effort=24h
 *
 *   # Batch from CSV (columns: project,status,priority,type,effort)
 *   node batch-update-projects.cjs batch-file projects-to-update.csv
 *
 *   # Generate CSV template
 *   node batch-update-projects.cjs generate-csv > my-updates.csv
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

const PROJECTS_DIR = '.github/projects/active';

/**
 * Validate field values
 */
function validateFields(fields) {
  const errors = [];

  if (fields.status && !['active', 'pending', 'review', 'blocked', 'at_risk'].includes(fields.status)) {
    errors.push(`Invalid status: ${fields.status}`);
  }

  if (fields.priority && !['critical', 'high', 'medium', 'low'].includes(fields.priority)) {
    errors.push(`Invalid priority: ${fields.priority}`);
  }

  if (fields.type && !['feature', 'infrastructure', 'maintenance', 'documentation', 'testing', 'planning'].includes(fields.type)) {
    errors.push(`Invalid type: ${fields.type}`);
  }

  if (fields.effort && !/^\d+[hd]$/.test(fields.effort)) {
    errors.push(`Invalid effort format: ${fields.effort} (use 24h or 5d)`);
  }

  return errors;
}

/**
 * Get existing frontmatter from README
 */
function readFrontmatter(projectPath) {
  const readmePath = path.join(projectPath, 'README.md');

  if (!fs.existsSync(readmePath)) {
    return {};
  }

  const content = fs.readFileSync(readmePath, 'utf8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);

  if (!match) {
    return {};
  }

  const yaml = match[1];
  const frontmatter = {};

  yaml.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
      frontmatter[key.trim()] = value;
    }
  });

  return frontmatter;
}

/**
 * Update frontmatter in README
 */
function updateProject(projectName, fields) {
  const projectPath = path.join(PROJECTS_DIR, projectName);
  const readmePath = path.join(projectPath, 'README.md');

  if (!fs.existsSync(readmePath)) {
    return { success: false, error: `README.md not found for ${projectName}` };
  }

  let content = fs.readFileSync(readmePath, 'utf8');
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) {
    return { success: false, error: `No frontmatter found in ${projectName}/README.md` };
  }

  const oldFrontmatter = frontmatterMatch[1];
  const existingFields = readFrontmatter(projectPath);
  const updatedFields = { ...existingFields, ...fields };

  // Build new frontmatter
  const lines = [];
  lines.push('file_type: project');
  if (updatedFields.title) lines.push(`title: "${updatedFields.title}"`);
  if (updatedFields.description) lines.push(`description: "${updatedFields.description}"`);
  if (updatedFields.status) lines.push(`status: ${updatedFields.status}`);
  if (updatedFields.priority) lines.push(`priority: ${updatedFields.priority}`);
  if (updatedFields.type) lines.push(`type: ${updatedFields.type}`);
  if (updatedFields.effort) lines.push(`effort: "${updatedFields.effort}"`);
  lines.push(`last_updated: ${new Date().toISOString().split('T')[0]}`);

  const newFrontmatter = lines.join('\n');
  const newContent = content.replace(/^---\n[\s\S]*?\n---/, `---\n${newFrontmatter}\n---`);

  fs.writeFileSync(readmePath, newContent);

  return {
    success: true,
    projectName,
    changes: Object.keys(fields),
  };
}

/**
 * Update command
 */
function updateCommand(projectsStr, options) {
  const projects = projectsStr.split(',').map(p => p.trim());

  log(`\n=== BATCH UPDATE ===\n`, 'cyan');
  log(`Projects to update: ${projects.length}`, 'blue');
  log(`Fields: ${Object.keys(options).join(', ')}\n`, 'blue');

  // Validate fields
  const errors = validateFields(options);
  if (errors.length > 0) {
    errors.forEach(e => log(`✗ ${e}`, 'red'));
    process.exitCode = 1;
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  projects.forEach(projectName => {
    const result = updateProject(projectName, options);

    if (result.success) {
      log(`✓ ${projectName}: Updated ${result.changes.join(', ')}`, 'green');
      successCount++;
    } else {
      log(`✗ ${projectName}: ${result.error}`, 'red');
      errorCount++;
    }
  });

  log(`\n=== SUMMARY ===\n`, 'cyan');
  log(`Success: ${successCount}`, 'green');
  log(`Errors: ${errorCount}`, errorCount > 0 ? 'red' : 'green');

  if (errorCount === 0) {
    log(`\nNext: Review changes and commit\n`, 'blue');
  }
}

/**
 * Parse CSV input
 */
function parseCSV(line) {
  // Simple CSV parser (handles quoted fields)
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim().replace(/^["']|["']$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }

  fields.push(current.trim().replace(/^["']|["']$/g, ''));
  return fields;
}

/**
 * Batch file command
 */
async function batchFileCommand(filepath) {
  if (!fs.existsSync(filepath)) {
    log(`File not found: ${filepath}`, 'red');
    process.exitCode = 1;
    return;
  }

  log(`\n=== BATCH FILE UPDATE ===\n`, 'cyan');
  log(`Reading: ${filepath}\n`, 'blue');

  const fileStream = fs.createReadStream(filepath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let lineNum = 0;
  let successCount = 0;
  let errorCount = 0;
  const results = [];

  for await (const line of rl) {
    lineNum++;

    // Skip header and empty lines
    if (lineNum === 1 || !line.trim()) continue;

    const fields = parseCSV(line);
    if (fields.length < 2) continue;

    const projectName = fields[0];
    const options = {
      status: fields[1] || undefined,
      priority: fields[2] || undefined,
      type: fields[3] || undefined,
      effort: fields[4] || undefined,
    };

    // Remove undefined values
    Object.keys(options).forEach(k => options[k] === undefined && delete options[k]);

    const result = updateProject(projectName, options);

    if (result.success) {
      log(`✓ Line ${lineNum}: ${projectName}`, 'green');
      successCount++;
      results.push({ projectName, status: 'success' });
    } else {
      log(`✗ Line ${lineNum}: ${projectName} - ${result.error}`, 'red');
      errorCount++;
      results.push({ projectName, status: 'error', error: result.error });
    }
  }

  log(`\n=== SUMMARY ===\n`, 'cyan');
  log(`Success: ${successCount}`, 'green');
  log(`Errors: ${errorCount}`, errorCount > 0 ? 'red' : 'green');
  log(`Total lines processed: ${lineNum - 1}\n`, 'blue');

  if (errorCount === 0) {
    log(`Next: Review changes and commit\n`, 'blue');
  }
}

/**
 * Generate CSV template
 */
function generateCSVCommand() {
  log(`# Batch Update CSV Template`, 'cyan');
  log(`# Columns: project, status, priority, type, effort`);
  log(`# Status: active|pending|review|blocked|at_risk`);
  log(`# Priority: critical|high|medium|low`);
  log(`# Type: feature|infrastructure|maintenance|documentation|testing|planning`);
  log(`# Effort: 8h, 16h, 24h, 40h, or Xd format`);
  log(`# Example:`);
  log(`project,status,priority,type,effort`);
  log(`testing-agent-phase-2-4-2-7,active,critical,feature,40h`);
  log(`reviewer-agent-v2-2026-08,active,critical,feature,32h`);
  log(`linting-agent-2026-08-12,active,high,feature,32h`);
  log(`branch-naming-enforcement-2026-08-11,active,high,infrastructure,20h`);
}

/**
 * Validate command
 */
function validateCommand() {
  log(`\n=== VALIDATION CHECK ===\n`, 'cyan');

  const projects = fs.readdirSync(PROJECTS_DIR)
    .filter(name => {
      const stat = fs.statSync(path.join(PROJECTS_DIR, name));
      return stat.isDirectory() && !name.startsWith('_');
    });

  let completeCount = 0;
  const incompleteProjects = [];

  projects.forEach(projectName => {
    const projectPath = path.join(PROJECTS_DIR, projectName);
    const frontmatter = readFrontmatter(projectPath);

    const hasRequired = frontmatter.status && frontmatter.priority && frontmatter.type && frontmatter.effort;

    if (hasRequired) {
      completeCount++;
    } else {
      const missing = [];
      if (!frontmatter.status) missing.push('status');
      if (!frontmatter.priority) missing.push('priority');
      if (!frontmatter.type) missing.push('type');
      if (!frontmatter.effort) missing.push('effort');
      incompleteProjects.push({ projectName, missing });
    }
  });

  log(`Total projects: ${projects.length}`, 'blue');
  log(`Complete: ${completeCount}`, 'green');
  log(`Incomplete: ${incompleteProjects.length}\n`, incompleteProjects.length > 0 ? 'yellow' : 'green');

  if (incompleteProjects.length > 0 && incompleteProjects.length <= 20) {
    log(`Projects needing updates:`, 'yellow');
    incompleteProjects.forEach(({ projectName, missing }) => {
      log(`  ${projectName}: ${missing.join(', ')}`);
    });
  }
}

/**
 * Show help
 */
function showHelp() {
  console.log(`
Batch Update Projects Helper

Usage: node batch-update-projects.cjs [command] [options]

Commands:
  update <projects>       Update one or more projects
                         Format: update project1,project2,project3 --status=active --priority=high

  batch-file <filepath>   Update from CSV file
                         CSV columns: project,status,priority,type,effort
                         Example: batch-file projects.csv

  generate-csv            Generate CSV template for batch updates
                         Outputs template to stdout
                         Example: generate-csv > projects-to-update.csv

  validate                Check project completion status
                         Shows which projects need updates

  help                    Show this help message

Examples:
  # Single project update
  node batch-update-projects.cjs update testing-agent-phase-2-4-2-7 \\
    --status=active --priority=critical --type=feature --effort=40h

  # Multiple projects
  node batch-update-projects.cjs update proj1,proj2,proj3 \\
    --priority=high --type=infrastructure --effort=24h

  # Batch from file
  node batch-update-projects.cjs batch-file updates.csv

  # Generate template
  node batch-update-projects.cjs generate-csv > my-updates.csv

  # Validate progress
  node batch-update-projects.cjs validate

Valid field values:
  status:   active, pending, review, blocked, at_risk
  priority: critical, high, medium, low
  type:     feature, infrastructure, maintenance, documentation, testing, planning
  effort:   8h, 16h, 24h, 40h, 5d (hours or days)

Workflow:
  1. node batch-update-projects.cjs generate-csv > updates.csv
  2. Edit updates.csv with your project names and values
  3. node batch-update-projects.cjs batch-file updates.csv
  4. Review changes with: git diff .github/projects/active/*/README.md
  5. Commit changes
  `);
}

// Main
const command = process.argv[2];

if (!command || command === 'help' || command === '--help' || command === '-h') {
  showHelp();
} else if (command === 'update') {
  const projectsStr = process.argv[3];
  if (!projectsStr) {
    log('Error: Missing projects argument', 'red');
    log('Usage: update project1,project2,... --status=value --priority=value', 'yellow');
    process.exitCode = 1;
  } else {
    const options = {};
    process.argv.slice(4).forEach(arg => {
      if (arg.startsWith('--')) {
        const [key, value] = arg.slice(2).split('=');
        if (key && value) options[key] = value;
      }
    });
    updateCommand(projectsStr, options);
  }
} else if (command === 'batch-file') {
  const filepath = process.argv[3];
  if (!filepath) {
    log('Error: Missing file path', 'red');
    log('Usage: batch-file <filepath>', 'yellow');
    process.exitCode = 1;
  } else {
    batchFileCommand(filepath);
  }
} else if (command === 'generate-csv') {
  generateCSVCommand();
} else if (command === 'validate') {
  validateCommand();
} else {
  log(`Unknown command: ${command}\n`, 'red');
  showHelp();
  process.exitCode = 1;
}

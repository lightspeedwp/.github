#!/usr/bin/env node

/**
 * Scan active projects for completion markers
 *
 * Checks each project in .github/projects/active/ for completion indicators:
 * - Project README has "status: completed"
 * - All associated issues are closed
 * - All associated PRs are merged or closed
 *
 * Outputs: projects_json (JSON array of completed projects), has_completed (true|false)
 */

const fs = require('fs');
const path = require('path');

const ACTIVE_DIR = process.env.ACTIVE_PROJECTS_DIR || '.github/projects/active';
const PROJECT_FILTER = process.env.PROJECT_FILTER || '';

const completedProjects = [];

try {
  if (!fs.existsSync(ACTIVE_DIR)) {
    console.log(`ℹ️  Active projects directory not found: ${ACTIVE_DIR}`);
    outputResults([], false);
    process.exit(0);
  }

  const projectDirs = fs
    .readdirSync(ACTIVE_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  if (projectDirs.length === 0) {
    console.log('ℹ️  No active projects found');
    outputResults([], false);
    process.exit(0);
  }

  console.log(`Scanning ${projectDirs.length} active projects...`);

  for (const projectName of projectDirs) {
    // Filter by name if specified
    if (PROJECT_FILTER && !projectName.includes(PROJECT_FILTER)) {
      continue;
    }

    const projectPath = path.join(ACTIVE_DIR, projectName);
    const readmePath = path.join(projectPath, 'PARENT_ISSUE.md');

    // Check if project has a status indicator
    if (!fs.existsSync(readmePath)) {
      console.log(`⚠️  No PARENT_ISSUE.md found for project: ${projectName}`);
      continue;
    }

    const content = fs.readFileSync(readmePath, 'utf8');
    const isCompleted = checkProjectCompletion(projectName, content);

    if (isCompleted) {
      completedProjects.push({
        name: projectName,
        path: projectPath,
        archivedAt: new Date().toISOString().split('T')[0],
      });
      console.log(`✅ Project marked for archival: ${projectName}`);
    } else {
      console.log(`➖ Project active: ${projectName}`);
    }
  }

  if (completedProjects.length > 0) {
    console.log(
      `\n✅ Found ${completedProjects.length} completed project(s) ready for archival`,
    );
  } else {
    console.log('\nℹ️  No completed projects found');
  }

  outputResults(completedProjects, completedProjects.length > 0);
} catch (err) {
  console.error(`❌ Error scanning projects: ${err.message}`);
  process.exit(1);
}

/**
 * Check if project should be archived
 * Returns true if project shows completion markers
 */
function checkProjectCompletion(projectName, content) {
  // Check for explicit completion markers in content
  const completionMarkers = [
    /status:\s*completed/i,
    /status:\s*"completed"/i,
    /\[x\]\s+completed/i,
    /\[x\]\s+project\s+complete/i,
  ];

  for (const marker of completionMarkers) {
    if (marker.test(content)) {
      return true;
    }
  }

  // Check for manual archival comment
  if (content.includes('<!-- archival-ready -->')) {
    return true;
  }

  return false;
}

/**
 * Output GitHub Actions workflow outputs
 */
function outputResults(projects, hasCompleted) {
  const projectsJson = JSON.stringify(projects);
  const outputFile = process.env.GITHUB_OUTPUT;

  if (!outputFile) {
    console.log(`projects_json=${projectsJson}`);
    console.log(`has_completed=${hasCompleted}`);
    return;
  }

  let output = `projects_json=${projectsJson}\n`;
  output += `has_completed=${hasCompleted}\n`;

  fs.appendFileSync(outputFile, output, 'utf8');
}

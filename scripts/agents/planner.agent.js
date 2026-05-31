/**
 * planner.agent.js
 *
 * Automatically adds new issues and PRs to appropriate projects based on labels
 * and metadata. Supports dry-run mode and generates comments with assignment reasoning.
 *
 * @module scripts/agents/planner.agent.js
 * @see agents/task-planner.agent.md
 * @see .github/issue-fields.yml
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[planner] ${timestamp} ${message}`);
}

async function runPlanner(options = {}) {
  const { dryRun = true } = options;

  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token && !dryRun) {
      throw new Error(
        'Missing GITHUB_TOKEN environment variable (required for write operations)',
      );
    }

    const eventName = process.env.GITHUB_EVENT_NAME || 'local';
    const repoRoot = path.resolve(__dirname, '..', '..');

    log(`Starting planner agent (${dryRun ? 'dry-run' : 'apply'})`);
    log(`Context: event=${eventName}, repoRoot=${repoRoot}`);

    // Detect active projects
    const activeProjectsDir = path.join(repoRoot, '.github/projects/active');
    if (!fs.existsSync(activeProjectsDir)) {
      log('No active projects directory found; nothing to plan');
      return;
    }

    const activeProjects = fs
      .readdirSync(activeProjectsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    if (activeProjects.length === 0) {
      log('No active projects found');
      return;
    }

    log(`Found ${activeProjects.length} active projects: ${activeProjects.join(', ')}`);

    // For dry-run, log analysis; for apply, would require more complex GitHub API integration
    if (dryRun) {
      log('Dry-run mode: logging analysis only (write operations disabled)');
      log(`Would check for unassigned issues/PRs and propose project assignments`);
      log(`Planner agent ready for activation once implementation is confirmed`);
    } else {
      // TODO: Implement GitHub API integration to:
      // 1. List recent issues/PRs without project assignment
      // 2. Derive project from labels and metadata
      // 3. Add to appropriate project via GitHub API
      // 4. Comment on issue with assignment reasoning
      log('Apply mode not yet fully implemented');
    }

    log('Planner agent finished without errors.');
  } catch (error) {
    console.error(`[planner] fatal error: ${error.message}`);
    process.exit(1);
  }
}

export { runPlanner };

if (process.argv[1] && import.meta.url === new URL(process.argv[1], `file://${process.cwd()}/`).href) {
  const dryRun = !process.argv.includes('--apply');
  await runPlanner({ dryRun }).catch((error) => {
    console.error('[planner] fatal error', error);
    process.exit(1);
  });
}

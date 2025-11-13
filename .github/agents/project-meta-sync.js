#!/usr/bin/env node
/**
 * Project Meta Sync Agent
 *
 * Maps labels/branch conventions to ProjectV2 fields (Status, Priority, Type)
 * and updates the corresponding item. Non-destructive by default.
 *
 * @author LightSpeed
 * @requires @octokit/graphql, js-yaml, fs
 * @see .github/agents/project-meta-sync.agent.md
 */
const fs = require('fs');
const path = require('path');
const { graphql } = require('@octokit/graphql');
const yaml = require('js-yaml');

// Parse CLI args
const args = process.argv.slice(2);
const eventName = args.find(a => a.startsWith('--event'))?.split('=')[1];
const payloadPath = args.find(a => a.startsWith('--payload'))?.split('=')[1];

if (
  !eventName || typeof eventName !== 'string' || eventName.trim() === '' ||
  !payloadPath || typeof payloadPath !== 'string' || payloadPath.trim() === ''
) {
  console.error('Usage: project-meta-sync.js --event=<event_name> --payload=<path_to_payload>');
  process.exit(1);
}

// Load event payload
let event;
try {
  event = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));
} catch (e) {
  console.error('Failed to parse event payload:', e.message);
  process.exit(1);
}

// Environment
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const PROJECT_URL = process.env.PROJECT_URL || process.env.LS_PROJECT_URL;

if (!GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN not set');
  process.exit(1);
}

// GraphQL client

/**
 * Load canonical project fields mapping (if present)
 * TODO: Implement loading of normalized mapping dictionary
 */
function loadFieldsMapping() {
  const fieldsPath = path.resolve('.github/automation/project-fields.yml');
  if (fs.existsSync(fieldsPath)) {
    return yaml.load(fs.readFileSync(fieldsPath, 'utf8'));
  }
  return null;
}

/**
 * Derive Status from labels and event
 */
function deriveStatus(labels, eventName, eventAction, isMerged = false) {
  const labelNames = labels.map(l => l.name || l);

  // Check status labels
  if (labelNames.some(l => l === 'status:in-progress')) return 'In progress';
  if (labelNames.some(l => l === 'status:needs-review')) return 'In review';
  if (labelNames.some(l => l === 'status:needs-qa')) return 'In QA';
  if (labelNames.some(l => l === 'status:blocked')) return 'Blocked';
  if (labelNames.some(l => l === 'status:ready')) return 'Ready';

  // Check closed/merged events
  if (eventAction === 'closed') {
    if (eventName === 'issues') return 'Done';
    if (eventName === 'pull_request' && isMerged) return 'Done';
  }

  // Default to Triage
  return 'Triage';
}

/**
 * Derive Priority from labels
 */
function derivePriority(labels) {
  const labelNames = labels.map(l => l.name || l);

  if (labelNames.some(l => l === 'priority:critical')) return 'Critical';
  if (labelNames.some(l => l === 'priority:important')) return 'Important';
  if (labelNames.some(l => l === 'priority:normal')) return 'Normal';
  if (labelNames.some(l => l === 'priority:minor')) return 'Minor';

  return null; // No priority set
}

/**
 * Derive Type from branch name or labels
 */
function deriveType(branchName, labels) {
  // Try branch conventions first
  if (branchName) {
    if (branchName.startsWith('feat/')) return 'Feature';
    if (branchName.startsWith('fix/')) return 'Bug';
    if (branchName.startsWith('doc/') || branchName.startsWith('docs/')) return 'Documentation';
    if (branchName.startsWith('chore/') || branchName.startsWith('build/')) return 'Task';
  }

  // Try labels
  const labelNames = labels.map(l => l.name || l);
  if (labelNames.some(l => l === 'type:feature')) return 'Feature';
  if (labelNames.some(l => l === 'type:bug')) return 'Bug';
  if (labelNames.some(l => l === 'type:documentation')) return 'Documentation';
  if (labelNames.some(l => l === 'type:task')) return 'Task';

  return null; // No type set
}

/**
 * Main sync logic
 */
async function sync() {
  console.log(`project-meta-sync: handling ${eventName} event`);

  // Extract item details from event
  const item = event.issue || event.pull_request;
  if (!item) {
    console.log('No issue or PR in event payload');
    return;
  }

  const labels = item.labels || [];
  const branchName = event.pull_request?.head?.ref || null;
  const eventAction = event.action;
  const isMerged = event.pull_request?.merged || false;

  // Derive field values
  const status = deriveStatus(labels, eventName, eventAction, isMerged);
  const priority = derivePriority(labels);
  const type = deriveType(branchName, labels);

  console.log(`Derived fields:`, { status, priority, type });

  // TODO: Enforce single status:* label (warn or auto-tidy)
  const statusLabels = labels.filter(l => (l.name || l).startsWith('status:'));
  if (statusLabels.length > 1) {
    console.warn(`⚠️  Multiple status labels found: ${statusLabels.map(l => l.name || l).join(', ')}`);
    console.warn('Consider using label-sync to enforce single status label');
  }

  // TODO: Use GraphQL to upsert ProjectV2 item & fields
  // For now, just log what would be updated
  console.log(`Would update ProjectV2 item for ${item.html_url}:`);
  console.log(`  Status: ${status}`);
  if (priority) console.log(`  Priority: ${priority}`);
  if (type) console.log(`  Type: ${type}`);

  // TODO: Guard against overwriting manual fields unless override label present
  const hasOverride = labels.some(l => (l.name || l) === 'meta:auto-sync');
  if (!hasOverride) {
    console.log('ℹ️  No override label (meta:auto-sync) - would check for manual changes');
  }

  // TODO: Load normalized mapping dictionary if present
  const fieldsMapping = loadFieldsMapping();
  if (fieldsMapping) {
    console.log('✅ Loaded project fields mapping');
  }
}

// Run
sync().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

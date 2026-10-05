#!/usr/bin/env node
/**
 * Generate thin Claude Code agent definitions from canonical agent specs.
 *
 * Pilot: agents/changelog-agent/changelog.agent.md -> .claude/agents/changelog-agent.md
 *
 * The generated file carries only the identity Claude Code needs for
 * delegation (frontmatter `name` + `description`, the two required fields
 * per https://code.claude.com/docs/en/sub-agents) and points at the
 * canonical specification instead of duplicating its prose. The Copilot
 * location (`.github/agents/`) is deliberately NOT generated: that tree was
 * removed in 48ef77b569 to consolidate duplication, and recreating it would
 * revert that decision.
 *
 * Usage:
 *   node scripts/agents/generate-agent-defs.cjs        # regenerate + write
 *   node scripts/agents/generate-agent-defs.cjs --check # exit 1 if drifted
 */

const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.join(__dirname, '..', '..');

const AGENTS = [
  {
    canonical: 'agents/changelog-agent/changelog.agent.md',
    generated: '.claude/agents/changelog-agent.md',
  },
];

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv) fields[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return fields;
}

function renderDefinition({ name, description, canonical }) {
  return `---
name: ${name}
description: ${description}
---

# ${name} (generated thin definition)

This file is generated from \`${canonical}\` — do not edit it by hand.
Regenerate with \`node scripts/agents/generate-agent-defs.cjs\`.

Read the canonical specification in full before acting. Start with
\`${canonical}\` (specification and integration guide).
`;
}

function buildDefinition(canonicalRel) {
  const content = fs.readFileSync(path.join(REPO_ROOT, canonicalRel), 'utf8');
  const fm = parseFrontmatter(content);
  if (!fm || !fm.description) {
    throw new Error(`canonical spec has no usable frontmatter: ${canonicalRel}`);
  }
  const base = path.basename(canonicalRel, '.agent.md');
  const name = (fm.name || base)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return renderDefinition({ name, description: fm.description, canonical: canonicalRel });
}

function generateAll({ write } = {}) {
  const results = [];
  for (const { canonical, generated } of AGENTS) {
    const text = buildDefinition(canonical);
    const target = path.join(REPO_ROOT, generated);
    const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
    if (write && current !== text) {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, text, 'utf8');
    }
    results.push({ canonical, generated, drifted: current !== text });
  }
  return results;
}

function main() {
  const check = process.argv.includes('--check');
  const results = generateAll({ write: !check });
  let drifted = 0;
  for (const r of results) {
    console.log(`${r.drifted ? 'DRIFTED ' : 'current  '} ${r.generated}`);
    if (r.drifted) drifted++;
  }
  if (check && drifted > 0) {
    console.error('agent definitions drifted from canonical specs');
    process.exit(1);
  }
  return 0;
}

if (require.main === module) {
  process.exit(main());
}

module.exports = { buildDefinition, renderDefinition, generateAll };

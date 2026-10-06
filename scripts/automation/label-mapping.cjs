#!/usr/bin/env node
/**
 * Builds the label mapping for the spec 008 consolidation (task T043, T043a)
 * from the rules the spec states, and checks it against the schema's validation
 * rules (contracts/label-mapping-schema.md, rules 1 to 9).
 *
 * The rules come from the spec, not from this script:
 * - FR-011: `ai-ops:*` -> `aiops:*`, `openspec:*` -> `spec:*`, spec numbers ->
 *   `spec-id:NNN`, and each `openspec:` name found in files but not in
 *   `labels.yml` is a gap, mapped to a `spec:*` label or retired;
 * - FR-012: the listed merges, the five #3554 imports, imports of Linear-only
 *   labels in use, retirement of unused ones, `migrate:*` retired, project
 *   labels moved to team scope;
 * - FR-014: `type:question` retired, `type:decision` already mapped;
 * - FR-015: eight Linear-only type labels re-prefixed.
 *
 * Judgement calls are not made here. A Linear-only label in use is proposed as
 * an import with its family's most common colour and Linear's own description,
 * and says so in `notes`, so the approver sees what to check.
 *
 * Usage: node scripts/automation/label-mapping.cjs [--write]
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const EVIDENCE = '.github/reports/audits/2026-09-14-label-audit/evidence';

/** FR-012 approved merges, source -> target. */
const MERGES = {
  'area:ci-cd': 'area:ci',
  'type:content-model': 'type:content-modelling',
  'type:ai-ops': 'type:aiops',
  'area:docs': 'area:documentation',
  'area:ops': 'area:operations',
  'scope:website': 'area:website',
  'scope: website': 'area:website',
  'status:planned': 'status:needs-planning',
  'status:planning': 'status:needs-planning',
  'priority:medium': 'priority:normal',
  'status:completed': 'status:done',
  'status:resolved': 'status:done',
  'area:tests': 'area:testing',
  'area:quality': 'area:qa',
  'status:no-issue-activity': 'meta:no-issue-activity',
  'status:ready-for-development': 'status:ready',
  'status:in-review': 'status:needs-review',
  'lang:scss': 'lang:css',
  'comp:workflows': 'area:workflows',
  'area:platform': 'area:infrastructure',
  'area:process': 'area:governance',
  'area:standards': 'area:governance',
  'area:pr-automation': 'area:automation',
  'area:issue-management': 'area:automation',
  'area:design': 'area:design-system',
  'scope:audit': 'meta:audit',
  'scope:project-management': 'area:projects',
  'meta:documentation': 'area:documentation',
  'meta:ai-ops': 'area:ai',
  'area:agents': 'aiops:agents',
  'area:instructions': 'aiops:instructions',
  'area:prompts': 'aiops:prompts',
};

/**
 * Merges the spec does not list, proposed because schema rule 5 requires the
 * type family to end at exactly 25 and these Linear-only labels duplicate an
 * existing one. Each follows the FR-019 renames (Build & CI -> CI, Code Refactor
 * -> Refactor). The approver can replace any of them.
 */
const PROPOSED_TYPE_MERGES = {
  'type: feature': {
    target: 'type:feature',
    why: 'spacing variant of type:feature; spacing variants are separate sources (FR-023 point 8)',
  },
  'type:build-ci': {
    target: 'type:ci',
    why: 'Linear-only duplicate; FR-019 renames the Build & CI type to CI',
  },
  'type:code-refactor': {
    target: 'type:refactor',
    why: 'Linear-only duplicate; FR-019 renames the Code Refactor type to Refactor',
  },
  'type:documentation': { target: 'type:docs', why: 'Linear-only duplicate of type:docs' },
};

/**
 * `openspec:` names used in files but not defined in labels.yml (FR-011 gaps),
 * each mapped to one of the nine spec status labels or retired. These are
 * judgement calls the spec leaves to this mapping, so each says why and is
 * marked for the approver.
 */
const GAP_MAP = {
  'openspec:specification-pending': {
    target: 'spec:planning',
    why: 'specification not started yet; closest status is planning',
  },
  'openspec:specification': {
    target: 'spec:specification-in-progress',
    why: 'generic specification stage',
  },
  'openspec:implementation': {
    target: 'spec:implementation-in-progress',
    why: 'generic implementation stage',
  },
  'openspec:status': {
    target: null,
    why: 'a namespace prefix used in examples (openspec:status/production), not a label',
  },
  'openspec:domain': {
    target: null,
    why: 'a namespace prefix used in examples (openspec:domain/governance), not a label',
  },
  'openspec:priority': {
    target: null,
    why: 'a namespace prefix used in examples (openspec:priority/medium), not a label',
  },
  'openspec:tracking': { target: null, why: 'no spec status label matches tracking' },
  'openspec:unknown': { target: null, why: 'a placeholder value, not a label' },
};

/** FR-015 re-prefixes of the eight Linear-only type labels. */
const REPREFIX = {
  'type:help': { target: 'type:task', concept: 'discussion:support' },
  'type:support': { target: 'type:task', concept: 'discussion:support' },
  'type:investigation': { target: 'type:research', concept: null },
  'type:maintenance': { target: 'type:chore', concept: 'area:maintenance' },
  'type:qa': { target: 'type:test', concept: 'area:qa' },
  'type:ui': { target: 'type:design', concept: 'area:frontend' },
  'type:ux-feedback': { target: 'type:design', concept: 'discussion:feedback' },
  'type:integration': { target: 'type:feature', concept: 'area:integration' },
};

/** FR-012 project-specific labels, moved to a Linear team rather than imported. */
const TEAM_SCOPE = ['area:xero', 'area:flow', 'area:jobs', 'area:monorepo'];

/** The five imports of #3554, with the colours and descriptions set in FR-012. */
const ISSUE_3554 = {
  'area:builds': {
    color: 'BFD4F2',
    description:
      'Build configuration, tooling, packaging, and artefact generation; use `area:ci` for CI pipeline execution and checks.',
  },
  'area:monitoring': {
    color: '006B75',
    description:
      'Operational checks, health monitoring, alerts, and failure detection; use `area:observability` for diagnostic telemetry and dashboards.',
  },
  'area:observability': {
    color: '006B75',
    description:
      'Logs, metrics, traces, and dashboards used to understand and diagnose system behaviour; use `area:monitoring` for checks and alerts.',
  },
  'area:workflows': {
    color: '0F448A',
    description:
      'Cross-cutting automated or operational workflow design and orchestration; use `area:automation` for scripts and automation implementation.',
  },
  'meta:needs-approval': {
    color: '57606A',
    description:
      'Explicit decision or sign-off required before the specified work proceeds; remove once the decision and approver are recorded.',
  },
};

const FAMILY_STRATEGY_COLOUR = { meta: '57606A' };

/**
 * Normalises a colour to six upper-case hex digits, or null when invalid.
 * @param {string | null | undefined} value Colour from a label.
 * @returns {string | null} Normalised colour.
 */
function hex(value) {
  const match = /^#?([0-9a-f]{6})$/i.exec(String(value || '').trim());
  return match ? match[1].toUpperCase() : null;
}

/**
 * The prefix before the first colon, or the whole name when there is none.
 * @param {string} name Label name.
 * @returns {string} Family.
 */
function familyOf(name) {
  const index = name.indexOf(':');
  return index === -1 ? name : name.slice(0, index);
}

/**
 * Most common colour among the labels of a family in `labels.yml`.
 * @param {Array<{name: string, color?: string}>} yml Parsed labels.yml.
 * @param {string} family Family prefix.
 * @returns {string | null} Colour, or null when the family is not in labels.yml.
 */
function familyColour(yml, family) {
  const counts = new Map();
  for (const label of yml) {
    if (familyOf(label.name) === family && hex(label.color)) {
      const colour = hex(label.color);
      counts.set(colour, (counts.get(colour) || 0) + 1);
    }
  }
  return (
    [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? null
  );
}

/**
 * Builds the mapping.
 * @param {object} input
 * @param {Array<{name: string, color?: string, description?: string}>} input.yml Parsed labels.yml.
 * @param {Array<{name: string, scope: string, issue_count?: number, color?: string, description?: string}>} input.linear Linear labels.
 * @param {string[]} input.openspecInFiles `openspec:` names found in files (renamed-label-references.json).
 * @param {string[]} input.specNumberLabels `spec:NNN` names found in files.
 * @returns {{ mappings: object[], proposedNames: Set<string> }} Mapping and the proposed label set.
 */
function buildMappings({ yml, linear, openspecInFiles = [], specNumberLabels = [] }) {
  const inYml = new Map(yml.map((label) => [label.name, label]));
  const linearByName = new Map();
  for (const label of linear) {
    if (!linearByName.has(label.name)) linearByName.set(label.name, []);
    linearByName.get(label.name).push(label);
  }
  const issuesOn = (name) =>
    (linearByName.get(name) || []).reduce((n, l) => n + (l.issue_count || 0), 0);
  const where = (name) => [
    ...(inYml.has(name) ? ['github'] : []),
    ...(linearByName.has(name) ? ['linear'] : []),
  ];
  const mappings = [];
  const add = (entry) =>
    mappings.push({ concept_label: null, notes: '', change_request: null, ...entry });
  const handled = new Set();

  // FR-011 prefix renames.
  for (const label of yml) {
    if (label.name.startsWith('ai-ops:')) {
      const target = `aiops:${label.name.slice('ai-ops:'.length)}`;
      add({
        source: label.name,
        systems: where(label.name),
        action: 'rename',
        target,
        issue_count: issuesOn(label.name),
        requirement: 'FR-011',
      });
      handled.add(label.name);
    } else if (label.name.startsWith('openspec:')) {
      const target = `spec:${label.name.slice('openspec:'.length)}`;
      add({
        source: label.name,
        systems: where(label.name),
        action: 'rename',
        target,
        issue_count: issuesOn(label.name),
        requirement: 'FR-011',
      });
      handled.add(label.name);
    }
  }

  // FR-011 gaps: openspec names in files but not in labels.yml.
  const specTargets = new Set(
    yml.filter((l) => l.name.startsWith('openspec:')).map((l) => `spec:${l.name.slice(9)}`)
  );
  for (const name of openspecInFiles) {
    if (inYml.has(name) || handled.has(name)) continue;
    const decision = GAP_MAP[name];
    const target = decision ? decision.target : null;
    if (target && !specTargets.has(target))
      throw new Error(`${name} maps to ${target}, which is not one of the nine spec labels`);
    add({
      source: name,
      systems: where(name),
      action: target ? 'rename' : 'retire',
      target,
      issue_count: issuesOn(name),
      requirement: 'FR-011',
      gap: true,
      notes: `Used in files but not defined in labels.yml. Proposed ${target ? `rename to ${target}` : 'retirement'}: ${decision ? decision.why : 'no rule covers this name; the approver decides'}.`,
    });
    handled.add(name);
  }
  for (const name of specNumberLabels) {
    if (handled.has(name)) continue;
    add({
      source: name,
      systems: where(name),
      action: 'rename',
      target: `spec-id:${name.slice('spec:'.length)}`,
      issue_count: issuesOn(name),
      requirement: 'FR-011',
      gap: true,
      notes: 'Spec numbers move to spec-id:NNN so spec:* holds only status labels.',
    });
    handled.add(name);
  }

  // FR-012 merges.
  for (const [source, target] of Object.entries(MERGES)) {
    if (handled.has(source)) continue;
    add({
      source,
      systems: where(source),
      action: source === 'type:ai-ops' || source.startsWith('area:ci-cd') ? 'merge' : 'merge',
      target,
      issue_count: issuesOn(source),
      requirement: 'FR-012',
    });
    handled.add(source);
  }

  const absentSources = [];

  // Proposed merges for Linear-only type labels the spec does not list.
  for (const [source, { target, why }] of Object.entries(PROPOSED_TYPE_MERGES)) {
    if (handled.has(source) || !linearByName.has(source)) continue;
    add({
      source,
      systems: where(source),
      action: 'merge',
      target,
      issue_count: issuesOn(source),
      requirement: 'FR-014',
      notes: `Proposed (not listed in FR-012): ${why}. Needed so the type family ends at exactly 25.`,
    });
    handled.add(source);
  }

  // FR-015 re-prefixes.
  // A source that exists in neither system has nothing to re-prefix; it is
  // recorded in `absentSources` so the gap is visible rather than silent.
  for (const [source, { target, concept }] of Object.entries(REPREFIX)) {
    if (!inYml.has(source) && !linearByName.has(source)) {
      absentSources.push({ source, requirement: 'FR-015' });
      continue;
    }
    add({
      source,
      systems: where(source),
      action: 're-prefix',
      target,
      concept_label: concept,
      issue_count: issuesOn(source),
      requirement: 'FR-015',
    });
    handled.add(source);
  }

  // FR-014: type:question is retired; type:decision takes its slot.
  add({
    source: 'type:question',
    systems: where('type:question'),
    action: 'swap',
    target: null,
    issue_count: issuesOn('type:question'),
    requirement: 'FR-014',
    notes:
      'Retired; open questions become Discussions (discussion:support) and closed ones are relabelled type:task + discussion:support before deletion. type:decision already holds its slot (Stage 0a).',
  });
  handled.add('type:question');

  // FR-012 team scope.
  for (const source of TEAM_SCOPE) {
    add({
      source,
      systems: where(source),
      action: 'team-scope',
      target: null,
      issue_count: issuesOn(source),
      requirement: 'FR-012',
      notes: 'Project-specific; moved to a Linear team, not imported.',
    });
    handled.add(source);
  }

  // FR-012 imports from #3554.
  for (const [source, { color, description }] of Object.entries(ISSUE_3554)) {
    add({
      source,
      systems: where(source).length ? where(source) : ['linear'],
      action: 'import',
      target: null,
      issue_count: issuesOn(source),
      requirement: source.startsWith('meta:') ? 'FR-012, FR-021' : 'FR-012',
      color,
      description,
      change_request: 3554,
      notes: 'Requested in #3554.',
    });
    handled.add(source);
  }

  // FR-012: every other Linear-only label.
  const seen = new Set();
  for (const label of linear) {
    const name = label.name;
    if (handled.has(name) || inYml.has(name) || seen.has(name)) continue;
    seen.add(name);
    const issueCount = issuesOn(name);
    if (name.startsWith('migrate:')) {
      add({
        source: name,
        systems: where(name),
        action: 'retire',
        target: null,
        issue_count: issueCount,
        requirement: 'FR-012',
        notes:
          issueCount > 0
            ? 'migrate:* labels are never imported; retired in Linear (kept as a per-repository migrate_to source in the FR-016 dry run).'
            : 'migrate:* labels are never imported.',
      });
      continue;
    }
    if (issueCount === 0) {
      add({
        source: name,
        systems: where(name),
        action: 'retire',
        target: null,
        issue_count: 0,
        requirement: 'FR-012',
        notes: 'Linear-only with zero issues; retire, not import.',
      });
      continue;
    }
    const family = familyOf(name);
    const familyDefault = FAMILY_STRATEGY_COLOUR[family] || familyColour(yml, family);
    const ownColour = hex(label.color);
    const colour = familyDefault || ownColour || 'EDEDED';
    const colourSource = familyDefault
      ? 'family default'
      : ownColour
        ? "Linear label's own"
        : 'fallback EDEDED';
    const ownDescription = String(label.description || '').trim();
    add({
      source: name,
      systems: where(name),
      action: 'import',
      target: null,
      issue_count: issueCount,
      requirement: 'FR-012',
      color: colour,
      description:
        ownDescription ||
        `Imported from Linear (${issueCount} issues); description to be written at approval.`,
      notes: `Proposed: applied to ${issueCount} Linear issue${issueCount === 1 ? '' : 's'}. Colour is the ${colourSource}; description is ${ownDescription ? "Linear's own" : 'a placeholder'}. Check both at approval.`,
    });
  }

  // The proposed labels.yml: current labels, minus sources that go away, plus
  // imports and rename or merge targets.
  const proposed = new Set(inYml.keys());
  for (const m of mappings) {
    if (['rename', 'merge', 're-prefix', 'retire', 'swap', 'team-scope'].includes(m.action))
      proposed.delete(m.source);
  }
  for (const m of mappings) {
    if (m.action === 'import') proposed.add(m.source);
    if (m.action === 'rename' && !m.gap) proposed.add(m.target);
    if (m.action === 'rename' && m.gap && m.target) proposed.add(m.target);
  }
  for (const m of mappings) {
    if (m.action === 'merge' || m.action === 're-prefix') {
      if (!proposed.has(m.target) && (inYml.has(m.target) || linearByName.has(m.target)))
        proposed.add(m.target);
    }
  }

  return { mappings, proposedNames: proposed, inYml, linearByName, absentSources };
}

/**
 * Checks the schema's validation rules 1 to 9.
 * @param {object[]} mappings The mapping entries.
 * @param {Set<string>} proposedNames The proposed labels.yml names.
 * @param {Array<{name: string}>} yml Current labels.yml.
 * @param {string[]} openspecInFiles `openspec:` names found in files.
 * @returns {string[]} Problems; empty when every rule holds.
 */
function validateMappings(mappings, proposedNames, yml, openspecInFiles = []) {
  const problems = [];
  // 1. Targets and concept labels exist.
  for (const m of mappings) {
    for (const key of ['target', 'concept_label']) {
      const value = m[key];
      if (value && !proposedNames.has(value))
        problems.push(`rule 1: ${m.source} ${key} ${value} is not in the proposed labels.yml`);
    }
  }
  // 3. Imports have issues or a named automation.
  for (const m of mappings.filter((x) => x.action === 'import')) {
    if (m.issue_count < 1 && !/automation|requested in #\d+/i.test(m.notes))
      problems.push(`rule 3: import ${m.source} has no issues and no named automation`);
  }
  // 4. Retire with issues names a reason.
  for (const m of mappings.filter((x) => x.action === 'retire' && x.issue_count > 0)) {
    if (!m.notes)
      problems.push(`rule 4: retire ${m.source} has ${m.issue_count} issues and no reason`);
  }
  // 5. The type family ends at exactly 25.
  const types = [...proposedNames].filter((n) => n.startsWith('type:'));
  if (types.length !== 25)
    problems.push(`rule 5: the type family has ${types.length} labels, not 25`);
  // 6. Imports have colour and description; meta imports use 57606A.
  for (const m of mappings.filter((x) => x.action === 'import')) {
    if (!hex(m.color) || !m.description)
      problems.push(`rule 6: import ${m.source} lacks a colour or description`);
    if (m.source.startsWith('meta:') && hex(m.color) !== '57606A')
      problems.push(`rule 6: meta import ${m.source} must use 57606A`);
  }
  // 7. No observability -> monitoring merge; AI areas map to aiops.
  if (mappings.some((m) => m.source === 'area:observability' && m.action === 'merge'))
    problems.push('rule 7: area:observability is merged');
  for (const [from, to] of [
    ['area:agents', 'aiops:agents'],
    ['area:instructions', 'aiops:instructions'],
    ['area:prompts', 'aiops:prompts'],
  ]) {
    const entry = mappings.find((m) => m.source === from);
    if (!entry || entry.target !== to) problems.push(`rule 7: ${from} must map to ${to}`);
  }
  // 8. Every non-canonical openspec name in files has a gap entry.
  const ymlNames = new Set(yml.map((l) => l.name));
  for (const name of openspecInFiles) {
    if (!ymlNames.has(name) && !mappings.some((m) => m.source === name && m.gap === true))
      problems.push(`rule 8: ${name} has no gap entry`);
  }
  // 9. No spec:* target is a spec number.
  for (const m of mappings) {
    if (m.target && /^spec:\d+$/.test(m.target))
      problems.push(`rule 9: ${m.source} targets the spec number ${m.target}`);
  }
  // Each source appears once.
  const seen = new Set();
  for (const m of mappings) {
    if (seen.has(m.source)) problems.push(`duplicate source ${m.source}`);
    seen.add(m.source);
  }
  return problems;
}

module.exports = {
  MERGES,
  REPREFIX,
  TEAM_SCOPE,
  ISSUE_3554,
  hex,
  familyOf,
  familyColour,
  buildMappings,
  validateMappings,
};

if (require.main === module) {
  const yaml = require('js-yaml');
  const root = process.cwd();
  const yml = yaml.load(fs.readFileSync(path.join(root, '.github/labels.yml'), 'utf8'));
  const linearFile = JSON.parse(
    fs.readFileSync(path.join(root, EVIDENCE, 'linear-labels.json'), 'utf8')
  );
  const refs = JSON.parse(
    fs.readFileSync(path.join(root, EVIDENCE, 'renamed-label-references.json'), 'utf8')
  );
  // The evidence lists files per label group; the `openspec:` names appear in its text.
  const names = new Set(
    [...JSON.stringify(refs).matchAll(/openspec:[a-z][a-z0-9-]*/gi)].map((m) => m[0])
  );
  const openspecInFiles = [...names].sort();
  // Spec-number labels used by .github/projects/active/prd-combined-agent (FR-011).
  const specNumberLabels = ['spec:001'];
  const { mappings, proposedNames, absentSources } = buildMappings({
    yml,
    linear: linearFile.sources.labels,
    openspecInFiles,
    specNumberLabels,
  });
  const problems = validateMappings(mappings, proposedNames, yml, openspecInFiles);
  const counts = {};
  mappings.forEach((m) => {
    counts[m.action] = (counts[m.action] || 0) + 1;
  });
  console.log(
    JSON.stringify(
      {
        entries: mappings.length,
        byAction: counts,
        proposedLabels: proposedNames.size,
        absentSources: absentSources.map((a) => a.source),
        problems,
      },
      null,
      2
    )
  );
  if (process.argv.includes('--write')) {
    linearFile.mappings = mappings;
    fs.writeFileSync(
      path.join(root, EVIDENCE, 'linear-labels.json'),
      `${JSON.stringify(linearFile, null, 2)}\n`
    );
    console.log(`Wrote ${mappings.length} mappings.`);
  }
  process.exitCode = problems.length > 0 ? 1 : 0;
}

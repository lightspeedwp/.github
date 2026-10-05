/**
 * Pure planning for the label consolidation (spec 008, FR-011, FR-012, FR-016,
 * FR-023; contracts/dry-run-and-drift-report-schema.md). Nothing here reads or
 * writes GitHub or the file system, so every rule is testable on its own.
 *
 * GitHub label names ignore case, so lookups into a repository's labels are
 * case-insensitive. Mapping sources are the opposite: a source is an exact
 * string, so labels that differ only by case or spacing are separate sources
 * and are never merged automatically (FR-023 point 8). A case-only difference
 * from an approved label is a rename in place.
 */

import crypto from 'node:crypto';

const MAPPING_ACTIONS_WITH_TARGET = new Set(['rename', 'merge', 're-prefix']);

/**
 * Normalises a colour for comparison: lower case, no leading `#`.
 * @param {string | null | undefined} color - Colour from GitHub or `labels.yml`
 * @returns {string} Six-digit lower-case hex, or an empty string
 */
export function normaliseColor(color) {
  return String(color ?? '')
    .replace(/^#/, '')
    .toLowerCase();
}

/**
 * Normalises a description for comparison: null and missing become empty.
 * @param {string | null | undefined} description - Label description
 * @returns {string} Description text
 */
export function normaliseDescription(description) {
  return String(description ?? '').trim();
}

/**
 * Reads the approved label set.
 * @param {Array<{ name: string, color?: string, description?: string }>} entries - Parsed `labels.yml`
 * @returns {Map<string, { name: string, color: string, description: string }>} Keyed by lower-case name
 */
export function buildApprovedSet(entries) {
  const approved = new Map();
  for (const entry of entries) {
    if (!entry || typeof entry.name !== 'string' || entry.name === '') {
      throw new Error('labels.yml has an entry without a name');
    }
    const key = entry.name.toLowerCase();
    if (approved.has(key)) {
      throw new Error(`labels.yml defines "${entry.name}" twice (names ignore case on GitHub)`);
    }
    approved.set(key, {
      name: entry.name,
      color: normaliseColor(entry.color),
      description: normaliseDescription(entry.description),
    });
  }
  return approved;
}

/**
 * Reads the GitHub mapping entries from `evidence/linear-labels.json`.
 * @param {{ mappings?: object[] }} mappingFile - Parsed mapping file
 * @returns {Map<string, { action: string, target: string | null, concept_label: string | null }>} Keyed by exact source
 */
export function buildMappingIndex(mappingFile) {
  const index = new Map();
  for (const mapping of mappingFile?.mappings ?? []) {
    if (!Array.isArray(mapping.systems) || !mapping.systems.includes('github')) {
      continue;
    }
    if (index.has(mapping.source)) {
      throw new Error(`The label mapping lists "${mapping.source}" twice`);
    }
    if (MAPPING_ACTIONS_WITH_TARGET.has(mapping.action) && !mapping.target) {
      throw new Error(
        `The mapping for "${mapping.source}" has action ${mapping.action} but no target`
      );
    }
    index.set(mapping.source, {
      action: mapping.action,
      target: mapping.target ?? null,
      concept_label: mapping.concept_label ?? null,
    });
  }
  return index;
}

/**
 * Finds the approved label a source maps to, if any.
 * `migrate:*` labels are kept out of the import mapping (FR-012) but still have
 * a per-repository target: the approved label their name points to.
 * @param {string} name - Exact label name in the repository
 * @param {Map<string, object>} approved - From `buildApprovedSet`
 * @param {Map<string, object>} mappingIndex - From `buildMappingIndex`
 * @returns {{ target: string, concept_label: string | null } | null} Target, or null when unmapped
 */
export function resolveTarget(name, approved, mappingIndex) {
  const mapping = mappingIndex.get(name);
  if (mapping?.target) {
    const target = approved.get(mapping.target.toLowerCase());
    if (target) {
      return { target: target.name, concept_label: mapping.concept_label };
    }
  }
  if (name.startsWith('migrate:')) {
    const target = approved.get(name.slice('migrate:'.length).toLowerCase());
    if (target) {
      return { target: target.name, concept_label: null };
    }
  }
  return null;
}

/**
 * Plans Stage 3: renames in place, creates, updates and relabels.
 * @param {Map<string, object>} approved - From `buildApprovedSet`
 * @param {Map<string, object>} mappingIndex - From `buildMappingIndex`
 * @param {Array<{ name: string, color?: string, description?: string }>} repoLabels - Every label in the repository
 * @returns {{ to_rename: object[], to_create: object[], to_update: object[], to_relabel: object[] }} The plan
 */
export function planStage3(approved, mappingIndex, repoLabels) {
  const repoByLower = new Map(repoLabels.map((label) => [label.name.toLowerCase(), label]));
  const toRename = [];
  const toRelabel = [];
  const renamedTargets = new Set();
  const renamedSources = new Set();

  // Mapped renames and merges, by exact source name.
  for (const label of repoLabels) {
    const mapping = mappingIndex.get(label.name);
    if (!mapping?.target) {
      continue;
    }
    const target = approved.get(mapping.target.toLowerCase());
    if (!target) {
      continue;
    }
    const existing = repoByLower.get(target.name.toLowerCase());
    if (
      mapping.action === 'rename' &&
      !existing &&
      !renamedTargets.has(target.name.toLowerCase())
    ) {
      toRename.push({ from: label.name, to: target.name });
      renamedTargets.add(target.name.toLowerCase());
      renamedSources.add(label.name);
    } else {
      // The target already exists, or another source is being renamed to it, or
      // the mapping is a merge: move the items across and leave the source for
      // the gated Stage 4 deletion.
      toRelabel.push({ from: label.name, to: target.name, concept_label: mapping.concept_label });
    }
  }

  // Case-only differences from an approved name are renamed in place.
  for (const label of repoLabels) {
    if (renamedSources.has(label.name)) {
      continue;
    }
    const approvedLabel = approved.get(label.name.toLowerCase());
    if (approvedLabel && approvedLabel.name !== label.name) {
      toRename.push({ from: label.name, to: approvedLabel.name, reason: 'case' });
    }
  }

  const toCreate = [];
  const toUpdate = [];
  for (const approvedLabel of approved.values()) {
    const key = approvedLabel.name.toLowerCase();
    if (renamedTargets.has(key)) {
      continue;
    }
    const existing = repoByLower.get(key);
    if (!existing) {
      toCreate.push({
        name: approvedLabel.name,
        color: approvedLabel.color,
        description: approvedLabel.description,
      });
      continue;
    }
    const patch = {};
    if (normaliseColor(existing.color) !== approvedLabel.color) {
      patch.color = approvedLabel.color;
    }
    if (normaliseDescription(existing.description) !== approvedLabel.description) {
      patch.description = approvedLabel.description;
    }
    if (Object.keys(patch).length > 0) {
      toUpdate.push({ name: approvedLabel.name, ...patch });
    }
  }

  return { to_rename: toRename, to_create: toCreate, to_update: toUpdate, to_relabel: toRelabel };
}

/**
 * Plans Stage 4: every label outside the approved set is deleted, after its
 * items are migrated (FR-016).
 * @param {Map<string, object>} approved - From `buildApprovedSet`
 * @param {Map<string, object>} mappingIndex - From `buildMappingIndex`
 * @param {Array<{ name: string, color?: string, description?: string }>} repoLabels - Every label in the repository
 * @param {(name: string) => Array<{ kind: string, number: number, state: string }>} itemsFor - Items carrying a label
 * @returns {{ to_delete: object[], needs_decision: string[] }} The plan
 */
export function planStage4(approved, mappingIndex, repoLabels, itemsFor) {
  const toDelete = [];
  const needsDecision = [];
  for (const label of repoLabels) {
    if (approved.has(label.name.toLowerCase())) {
      continue;
    }
    const items = itemsFor(label.name);
    const openItems = items
      .filter((item) => item.state === 'open')
      .map(({ kind, number }) => ({ kind, number }));
    const closedItems = items
      .filter((item) => item.state !== 'open')
      .map(({ kind, number }) => ({ kind, number }));
    const resolved = resolveTarget(label.name, approved, mappingIndex);
    const entry = {
      name: label.name,
      color: normaliseColor(label.color),
      description: normaliseDescription(label.description),
      open_items: openItems,
      closed_items: closedItems,
      migrate_to: resolved?.target ?? null,
    };
    if (resolved?.concept_label) {
      entry.concept_label = resolved.concept_label;
    }
    if (openItems.length > 0 && !entry.migrate_to) {
      needsDecision.push(label.name);
    }
    toDelete.push(entry);
  }
  return { to_delete: toDelete, needs_decision: needsDecision };
}

/**
 * Builds a dry-run record (the shape in the dry-run contract).
 * Regenerating always resets the approval, because the approval cites the
 * `generated_at` of the file it approved (FR-023 point 3).
 * @param {object} input
 * @param {string} input.repository - `owner/name`
 * @param {string} input.generatedAt - ISO timestamp
 * @param {string} input.approvedSetCommit - Commit of `labels.yml` on develop
 * @param {number} input.labelCount - Labels read
 * @param {number} input.pagesRead - Pages read
 * @param {number} input.approvedSetCount - Labels in the approved set
 * @param {object} [input.stage3] - From `planStage3`
 * @param {object} [input.stage4] - From `planStage4`
 * @param {object | null} [input.previous] - Earlier record, for `executed_at`
 * @returns {object} Dry-run record
 */
export function buildDryRunRecord({
  repository,
  generatedAt,
  approvedSetCommit,
  labelCount,
  pagesRead,
  approvedSetCount,
  stage3 = { to_rename: [], to_create: [], to_update: [], to_relabel: [] },
  stage4 = { to_delete: [], needs_decision: [] },
  previous = null,
}) {
  return {
    repository,
    generated_at: generatedAt,
    approved_set_commit: approvedSetCommit,
    executed_at: {
      3: previous?.executed_at?.['3'] ?? null,
      4: previous?.executed_at?.['4'] ?? null,
    },
    label_count: labelCount,
    pages_read: pagesRead,
    approved_set_count: approvedSetCount,
    to_delete: stage4.to_delete,
    needs_decision: stage4.needs_decision,
    to_create: stage3.to_create,
    to_update: stage3.to_update,
    to_rename: stage3.to_rename,
    to_relabel: stage3.to_relabel,
    approval: { status: 'pending', approved_by: null, approved_at: null, gate_comment_url: null },
  };
}

/**
 * Checks a dry-run record against the contract's rules 1 and 2, and rule 7's
 * requirement on regeneration.
 * @param {object} record - Dry-run record
 * @param {Map<string, object>} approved - From `buildApprovedSet`
 * @returns {string[]} Problems; empty when the record is valid
 */
export function validateDryRun(record, approved) {
  const problems = [];
  if (record.pages_read * 100 < record.label_count) {
    problems.push(
      `pages_read (${record.pages_read}) cannot cover label_count (${record.label_count}); the repository was not read in full`
    );
  }
  for (const entry of record.to_delete ?? []) {
    const hasOpen = (entry.open_items ?? []).length > 0;
    if (hasOpen && !entry.migrate_to) {
      if (!(record.needs_decision ?? []).includes(entry.name)) {
        problems.push(
          `${entry.name} has open items and no migrate_to, and is not listed for a decision`
        );
      }
    }
    if (entry.migrate_to && !approved.has(entry.migrate_to.toLowerCase())) {
      problems.push(`${entry.name} migrates to ${entry.migrate_to}, which is not in labels.yml`);
    }
  }
  return problems;
}

/**
 * Tells whether a stage still needs running for a repository (FR-023 point 1).
 * @param {object | null} record - Dry-run record, or null when there is none
 * @param {'3' | '4'} stage - The stage being run
 * @returns {boolean} False when the stage already finished for the repository
 */
export function stageStillToRun(record, stage) {
  return !record?.executed_at?.[stage];
}

/**
 * Applies this run's `done` records to a dry run, giving the state a resumed
 * run should find (dry-run rule 6).
 * @param {object} record - Dry-run record
 * @param {object[]} doneRecords - This run's `done` records for the repository
 * @returns {{ deletedLabels: Set<string>, migratedItems: Map<string, Set<string>> }} What the run already changed
 */
export function appliedChanges(record, doneRecords) {
  const deletedLabels = new Set();
  const migratedItems = new Map();
  for (const entry of doneRecords) {
    if (entry.repository !== record.repository || entry.state !== 'done') {
      continue;
    }
    if (entry.action === 'delete') {
      deletedLabels.add(entry.label);
    } else if (entry.action === 'relabel' && entry.before?.item) {
      const set = migratedItems.get(entry.label) ?? new Set();
      set.add(`${entry.before.item.kind}#${entry.before.item.number}`);
      migratedItems.set(entry.label, set);
    }
  }
  return { deletedLabels, migratedItems };
}

/**
 * Decides whether an approved dry run is stale (dry-run rule 6, FR-023 point 4).
 * The expected state is the file plus the changes this run's own `done`
 * records show, so a resumed run does not mistake its own deletions for drift.
 * @param {object} input
 * @param {object} input.record - The approved dry-run record
 * @param {Array<{ name: string, color?: string, description?: string }>} input.liveLabels - Labels read just now
 * @param {(name: string) => Array<{ kind: string, number: number }>} input.liveItemsFor - Items carrying a label, read just now
 * @param {object[]} [input.doneRecords] - This run's `done` records
 * @param {string} input.currentApprovedSetCommit - Commit of `labels.yml` on develop now
 * @returns {{ stale: boolean, reasons: string[] }} Verdict
 */
export function detectStaleness({
  record,
  liveLabels,
  liveItemsFor,
  doneRecords = [],
  currentApprovedSetCommit,
}) {
  const reasons = [];
  if (record.approved_set_commit !== currentApprovedSetCommit) {
    reasons.push(
      `labels.yml on develop changed since approval (${record.approved_set_commit} -> ${currentApprovedSetCommit})`
    );
  }
  const { deletedLabels, migratedItems } = appliedChanges(record, doneRecords);
  const expectedCount = record.label_count - deletedLabels.size;
  if (liveLabels.length !== expectedCount) {
    reasons.push(
      `the repository has ${liveLabels.length} labels, the dry run expected ${expectedCount}`
    );
  }
  const liveByName = new Map(liveLabels.map((label) => [label.name, label]));
  for (const entry of record.to_delete ?? []) {
    if (deletedLabels.has(entry.name)) {
      if (liveByName.has(entry.name)) {
        reasons.push(`${entry.name} was deleted by this run but is back`);
      }
      continue;
    }
    const live = liveByName.get(entry.name);
    if (!live) {
      reasons.push(`${entry.name} is gone but this run did not delete it`);
      continue;
    }
    if (
      normaliseColor(live.color) !== entry.color ||
      normaliseDescription(live.description) !== entry.description
    ) {
      reasons.push(`${entry.name} changed colour or description`);
    }
    const migrated = migratedItems.get(entry.name) ?? new Set();
    const expected = new Set(
      [...(entry.open_items ?? []), ...(entry.closed_items ?? [])]
        .map((item) => `${item.kind}#${item.number}`)
        .filter((key) => !migrated.has(key))
    );
    const actual = new Set(liveItemsFor(entry.name).map((item) => `${item.kind}#${item.number}`));
    const added = [...actual].filter((key) => !expected.has(key));
    const missing = [...expected].filter((key) => !actual.has(key));
    if (added.length > 0 || missing.length > 0) {
      reasons.push(
        `${entry.name} items differ from the dry run (${added.length} new, ${missing.length} missing)`
      );
    }
  }
  return { stale: reasons.length > 0, reasons };
}

/**
 * Fingerprints the parts of a dry run that matter to an approval, for display
 * in gate comments.
 * @param {object} record - Dry-run record
 * @returns {string} Short hex digest
 */
export function dryRunFingerprint(record) {
  const canonical = JSON.stringify({
    repository: record.repository,
    generated_at: record.generated_at,
    approved_set_commit: record.approved_set_commit,
    to_delete: record.to_delete,
    to_create: record.to_create,
    to_update: record.to_update,
    to_rename: record.to_rename,
    to_relabel: record.to_relabel,
  });
  return crypto.createHash('sha256').update(canonical).digest('hex').slice(0, 12);
}

export default {
  normaliseColor,
  normaliseDescription,
  buildApprovedSet,
  buildMappingIndex,
  resolveTarget,
  planStage3,
  planStage4,
  buildDryRunRecord,
  validateDryRun,
  stageStillToRun,
  appliedChanges,
  detectStaleness,
  dryRunFingerprint,
};

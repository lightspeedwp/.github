/**
 * The consolidation engine: per-repository dry runs, Stage 3 changes and gated
 * Stage 4 deletion (spec 008 T062, T062b, T065, T065a, T067; FR-016, FR-023).
 *
 * Safety rules enforced here, each covered by a test:
 * - nothing writes to GitHub unless the caller passes `apply: true`;
 * - every change is an `intended` record, then the API call, then a `done`
 *   record, all written under the run's lock and epoch;
 * - the plan is computed from live state each time, so a finished repository
 *   makes no write and adds no record;
 * - Stage 4 deletes only after the cited approval verifies, and only when the
 *   repository still matches its dry run once this run's own `done` records
 *   are applied;
 * - a private repository's dry run, records, approval and gate comments stay in
 *   `.private-evidence/` and the private report repository, never in the
 *   committed evidence or on the public gate issue.
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  buildDryRunRecord,
  buildApprovedSet,
  detectStaleness,
  planStage3,
  planStage4,
  stageStillToRun,
  validateDryRun,
} from './consolidation-plan.js';
import { readLog, truncatePartialLine, unmatchedIntended } from './consolidation-run.js';
import {
  APPROVER_LOGIN,
  PrivateEvidenceError,
  assertPrivateDirIgnored,
  consolidationLogPathFor,
  dryRunPathFor,
  gateFor,
  isPrivateRepository,
  verifyApproval,
} from './private-evidence.js';

/** A change cannot be made safely; the run stops and keeps its lock. */
export class ConsolidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConsolidationError';
  }
}

/**
 * Reads a JSON file.
 * @param {string} file - Path
 * @returns {object | null} Parsed contents, or null when the file does not exist
 */
export function readJsonFile(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw new ConsolidationError(`Cannot read ${file}: ${error.message}`);
  }
}

/**
 * Writes a JSON file atomically, so a crash cannot leave half a file.
 * @param {string} file - Path
 * @param {object} value - Contents
 */
export function writeJsonFile(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  const fd = fs.openSync(temporary, 'w');
  try {
    fs.writeSync(fd, `${JSON.stringify(value, null, 2)}\n`);
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  fs.renameSync(temporary, file);
}

/**
 * Parses `labels.yml` entries into the approved set.
 * @param {object[]} entries - Parsed YAML list
 * @returns {Map<string, object>} Approved set
 */
export function approvedSetFrom(entries) {
  return buildApprovedSet(entries);
}

/**
 * Prepares the evidence files for a run: ignores nothing public, but refuses
 * to touch the private area unless Git ignores it, and cleans up any log whose
 * last line was cut off by an earlier crash.
 * @param {object} ctx - Run context
 * @param {object[]} repos - Repositories in scope
 */
export function prepareEvidence(ctx, repos) {
  const logs = new Set();
  let needsPrivate = false;
  for (const repo of repos) {
    const { file, isPrivate } = consolidationLogPathFor(repo, ctx.root);
    needsPrivate ||= isPrivate;
    logs.add(file);
  }
  if (needsPrivate) {
    assertPrivateDirIgnored(ctx.root);
  }
  for (const file of logs) {
    truncatePartialLine(file);
  }
  return [...logs];
}

/**
 * Refuses any write unless the run was started with --apply. This is the last
 * line of defence: the dispatcher also routes a dry run away from the apply
 * functions.
 * @param {object} ctx - Run context
 */
function assertApply(ctx) {
  if (ctx.apply !== true) {
    throw new ConsolidationError(
      'Refusing to write: this is a dry run. Pass --apply and --confirm-gate to change anything.'
    );
  }
}

/**
 * Wraps the state shared by one repository's operations.
 * @param {object} ctx - Run context
 * @param {object} repo - Repository from the API
 * @returns {object} Helpers bound to the repository
 */
function repoScope(ctx, repo) {
  const fullName = repo.full_name ?? `${ctx.org}/${repo.name}`;
  const { file: dryRunFile, isPrivate } = dryRunPathFor(repo, ctx.root);
  const { file: logFile } = consolidationLogPathFor(repo, ctx.root);
  const client = isPrivate && ctx.privateClient ? ctx.privateClient : ctx.client;
  return {
    fullName,
    dryRunFile,
    logFile,
    isPrivate,
    client,
    // Resolved on first use: a dry run needs no gate, but every write, approval
    // check and comment does, and a private repository must have a private one.
    get gate() {
      return gateFor(repo, ctx.gates);
    },
  };
}

/**
 * Items carrying a label: issues, pull requests and Discussions.
 * @param {object} client - Consolidation client
 * @param {string} fullName - `owner/name`
 * @param {string} label - Exact label name
 * @returns {Promise<object[]>} Items
 */
async function itemsCarrying(client, fullName, label) {
  const [issues, discussions] = await Promise.all([
    client.listItemsByLabel(fullName, label),
    client.listDiscussionsByLabel(fullName, label),
  ]);
  return [...issues, ...discussions];
}

/**
 * Reads a repository's labels and, for those outside the approved set, their items.
 * @param {object} ctx - Run context
 * @param {object} scope - From `repoScope`
 * @param {{ items: boolean }} options - Whether to read items
 * @returns {Promise<object>} Live state
 */
async function readLive(ctx, scope, { items }) {
  const { labels, pages } = await scope.client.listLabels(scope.fullName);
  const itemsByLabel = new Map();
  if (items) {
    for (const label of labels) {
      if (!ctx.approved.has(label.name.toLowerCase())) {
        itemsByLabel.set(label.name, await itemsCarrying(scope.client, scope.fullName, label.name));
      }
    }
  }
  return { labels, pages, itemsFor: (name) => itemsByLabel.get(name) ?? [] };
}

/**
 * Builds and saves a repository's dry run. It changes nothing on GitHub.
 * @param {object} ctx - Run context
 * @param {object} repo - Repository from the API
 * @returns {Promise<{ record: object, file: string, problems: string[], isPrivate: boolean }>} The saved record
 */
export async function generateDryRun(ctx, repo) {
  const scope = repoScope(ctx, repo);
  const live = await readLive(ctx, scope, { items: true });
  const stage3 = planStage3(ctx.approved, ctx.mappingIndex, live.labels);
  const stage4 = planStage4(ctx.approved, ctx.mappingIndex, live.labels, live.itemsFor);
  const previous = readJsonFile(scope.dryRunFile);
  const record = buildDryRunRecord({
    repository: scope.fullName,
    generatedAt: ctx.now().toISOString(),
    approvedSetCommit: ctx.currentApprovedSetCommit,
    labelCount: live.labels.length,
    pagesRead: live.pages,
    approvedSetCount: ctx.approved.size,
    stage3,
    stage4,
    previous,
  });
  if (record.executed_at['4']) {
    throw new ConsolidationError(
      `${scope.fullName} already finished Stage 4; a deletion dry run must leave executed_at.4 null (dry-run rule 7).`
    );
  }
  const problems = validateDryRun(record, ctx.approved);
  if (scope.isPrivate) {
    assertPrivateDirIgnored(ctx.root);
  }
  writeJsonFile(scope.dryRunFile, record);
  return { record, file: scope.dryRunFile, problems, isPrivate: scope.isPrivate };
}

/**
 * Formats the summary comment for a dry run.
 * @param {object} record - Dry-run record
 * @returns {string} Markdown
 */
export function formatSummary(record) {
  const deletable = record.to_delete.length;
  const open = record.to_delete.reduce((n, d) => n + d.open_items.length, 0);
  const closed = record.to_delete.reduce((n, d) => n + d.closed_items.length, 0);
  const lines = [
    `### Dry run: ${record.repository}`,
    '',
    `Generated: ${record.generated_at}`,
    `Approved set commit: ${record.approved_set_commit}`,
    '',
    `- Labels read: ${record.label_count} (${record.pages_read} pages)`,
    `- To create: ${record.to_create.length}; to update: ${record.to_update.length}; to rename: ${record.to_rename.length}; to relabel: ${record.to_relabel.length}`,
    `- To delete: ${deletable} (${open} open items and ${closed} closed items carry them)`,
  ];
  if (record.needs_decision.length > 0) {
    lines.push(
      '',
      `Needs a decision (open items, no target): ${record.needs_decision.map((n) => `\`${n}\``).join(', ')}`
    );
  }
  lines.push(
    '',
    `To approve, comment exactly: \`Approved: ${record.repository} dry run ${record.generated_at}\``
  );
  return lines.join('\n');
}

/**
 * Posts a dry run's summary on the gate that applies to the repository's
 * visibility. A private repository's summary goes to the private report
 * repository only.
 * @param {object} ctx - Run context
 * @param {object} repo - Repository from the API
 * @returns {Promise<{ repository: string, issue: number }>} Where it was posted
 */
export async function postSummary(ctx, repo) {
  const scope = repoScope(ctx, repo);
  const record = readJsonFile(scope.dryRunFile);
  if (!record) {
    throw new ConsolidationError(`${scope.fullName} has no dry run to summarise.`);
  }
  await scope.client.postComment(scope.gate.repository, scope.gate.issue, formatSummary(record));
  return { repository: scope.gate.repository, issue: scope.gate.issue };
}

/**
 * Reads a gate comment and, when it is a valid approval, records it in the
 * dry-run file (T066).
 * @param {object} ctx - Run context
 * @param {object} repo - Repository from the API
 * @param {string} commentUrl - URL of the approval comment
 * @returns {Promise<{ ok: boolean, reason?: string }>} Verdict
 */
export async function recordApproval(ctx, repo, commentUrl) {
  const scope = repoScope(ctx, repo);
  const record = readJsonFile(scope.dryRunFile);
  if (!record) {
    return { ok: false, reason: 'there is no dry run to approve' };
  }
  const comment = await scope.client.getCommentByUrl(commentUrl);
  const candidate = {
    ...record,
    approval: {
      status: 'approved',
      approved_by: comment?.user?.login ?? null,
      approved_at: comment?.created_at ?? null,
      gate_comment_url: commentUrl,
    },
  };
  const verdict = await verifyApproval(candidate, repo, scope.gate, async () => comment);
  if (!verdict.ok) {
    return verdict;
  }
  if (scope.isPrivate) {
    assertPrivateDirIgnored(ctx.root);
  }
  writeJsonFile(scope.dryRunFile, candidate);
  return { ok: true };
}

/**
 * Performs one logged change.
 * @param {object} ctx - Run context
 * @param {object} scope - From `repoScope`
 * @param {object} spec - `action`, `label`, `before`, `after`
 * @returns {Promise<object>} The `done` record
 */
async function change(ctx, scope, spec) {
  assertApply(ctx);
  const base = {
    run_by: ctx.run.runBy,
    at: ctx.now().toISOString(),
    repository: scope.fullName,
    action: spec.action,
    label: spec.label,
    before: spec.before ?? null,
    after: spec.after ?? null,
    gate_issue: scope.gate.issue,
    op_id: ctx.run.nextOpId(),
  };
  ctx.run.append(scope.logFile, { ...base, state: 'intended' });
  await performRecord(ctx, scope, base);
  const done = { ...base, at: ctx.now().toISOString(), state: 'done' };
  ctx.run.append(scope.logFile, done);
  ctx.done.push(done);
  return done;
}

/**
 * Makes the GitHub writes for a change record.
 * @param {object} ctx - Run context
 * @param {object} scope - From `repoScope`
 * @param {object} record - A change record
 */
async function performRecord(ctx, scope, record) {
  const { client, fullName } = scope;
  switch (record.action) {
    case 'create':
      await client.createLabel(fullName, {
        name: record.after.name,
        color: record.after.color,
        description: record.after.description,
      });
      return;
    case 'update': {
      const patch = {};
      for (const key of ['color', 'description']) {
        if (record.after[key] !== record.before[key]) {
          patch[key] = record.after[key];
        }
      }
      await client.updateLabel(fullName, record.before.name, patch);
      return;
    }
    case 'rename':
      await client.updateLabel(fullName, record.before.name, { new_name: record.after.name });
      return;
    case 'delete':
      await client.deleteLabel(fullName, record.before.name);
      return;
    case 'relabel': {
      const item = record.after.item;
      await setItemLabel(client, fullName, item, record.after.name, 'add');
      if (record.after.concept_label) {
        await setItemLabel(client, fullName, item, record.after.concept_label, 'add');
      }
      // Stage 4 moves the item off the source label; Stage 3 leaves the source
      // in place for the gated deletion.
      if (ctx.run.stage === '4') {
        await setItemLabel(client, fullName, item, record.before.name, 'remove');
      }
      return;
    }
    default:
      throw new ConsolidationError(
        `A ${record.action} cannot be repeated by the tool; redo it by hand and log it with the record subcommand.`
      );
  }
}

/** Adds or removes one label on an issue, pull request or Discussion. */
async function setItemLabel(client, fullName, item, label, mode) {
  if (item.kind === 'discussion') {
    await client.setDiscussionLabel(fullName, item.number, label, mode);
  } else if (mode === 'add') {
    await client.addLabelToItem(fullName, item.number, label);
  } else {
    await client.removeLabelFromItem(fullName, item.number, label);
  }
}

/**
 * Tells whether a change record is already reflected in the live state.
 * @param {object} ctx - Run context
 * @param {object} scope - From `repoScope`
 * @param {object} record - An `intended` record
 * @returns {Promise<boolean>} True when the change happened
 */
async function isApplied(ctx, scope, record) {
  const { client, fullName } = scope;
  if (record.action === 'convert') {
    return (await client.getIssue(fullName, record.before.item.number)) === null;
  }
  if (record.action === 'relabel') {
    const item = record.after.item;
    const carrying = await itemsCarrying(client, fullName, record.after.name);
    const hasTarget = carrying.some((i) => i.kind === item.kind && i.number === item.number);
    if (!hasTarget) {
      return false;
    }
    if (ctx.run.stage !== '4') {
      return true;
    }
    const stillSource = (await itemsCarrying(client, fullName, record.before.name)).some(
      (i) => i.kind === item.kind && i.number === item.number
    );
    return !stillSource;
  }
  const { labels } = await client.listLabels(fullName);
  const exact = (name) => labels.find((label) => label.name === name);
  const loose = (name) => labels.find((label) => label.name.toLowerCase() === name.toLowerCase());
  switch (record.action) {
    case 'create':
      return Boolean(loose(record.after.name));
    case 'update': {
      const live = loose(record.after.name ?? record.before.name);
      return Boolean(
        live &&
        (live.color ?? '').toLowerCase() === record.after.color &&
        (live.description ?? '') === record.after.description
      );
    }
    case 'rename':
      return Boolean(exact(record.after.name)) && !exact(record.before.name);
    case 'delete':
      return !loose(record.before.name);
    default:
      return false;
  }
}

/**
 * Reconciles this run's unmatched `intended` records against live state before
 * any other write (FR-023 points 1 and 11): a change that happened gets its
 * `done` record; one that did not is retried.
 * @param {object} ctx - Run context
 * @param {object[]} repos - Repositories in scope
 * @returns {Promise<number>} Records reconciled
 */
export async function reconcileRun(ctx, repos) {
  const byFullName = new Map(
    repos.map((repo) => [repo.full_name ?? `${ctx.org}/${repo.name}`, repo])
  );
  const logs = new Map();
  for (const repo of repos) {
    const scope = repoScope(ctx, repo);
    logs.set(scope.logFile, readLog(scope.logFile));
  }
  let reconciled = 0;
  for (const [logFile, records] of logs) {
    ctx.run.continueFrom(records);
    for (const record of unmatchedIntended(records, ctx.run.runId)) {
      const repo = byFullName.get(record.repository);
      if (!repo) {
        throw new ConsolidationError(
          `Unmatched record ${record.op_id} names ${record.repository}, which is not in scope.`
        );
      }
      const scope = repoScope(ctx, repo);
      if (!(await isApplied(ctx, scope, record))) {
        assertApply(ctx);
        await performRecord(ctx, scope, record);
      }
      const done = { ...record, at: ctx.now().toISOString(), state: 'done' };
      ctx.run.append(logFile, done);
      ctx.done.push(done);
      reconciled += 1;
    }
  }
  return reconciled;
}

/**
 * Loads this run's `done` records from the logs, for the stale-state check.
 * @param {object} ctx - Run context
 * @param {object[]} repos - Repositories in scope
 * @returns {object[]} Done records of this run
 */
export function loadRunDoneRecords(ctx, repos) {
  const records = [];
  const seen = new Set();
  for (const repo of repos) {
    const { logFile } = repoScope(ctx, repo);
    if (seen.has(logFile)) {
      continue;
    }
    seen.add(logFile);
    records.push(
      ...readLog(logFile).filter(
        (r) => r.state === 'done' && String(r.op_id).startsWith(`${ctx.run.runId}-`)
      )
    );
  }
  return records;
}

/**
 * Stage 3: renames in place, creates, updates and relabels, from live state.
 * @param {object} ctx - Run context (`ctx.apply` must be true to write)
 * @param {object} repo - Repository from the API
 * @returns {Promise<{ status: string, changes: number, reason?: string }>} Outcome
 */
export async function applyStage3(ctx, repo) {
  const scope = repoScope(ctx, repo);
  const record = readJsonFile(scope.dryRunFile);
  if (!record) {
    return { status: 'skipped', changes: 0, reason: 'no dry run; generate one first' };
  }
  if (!stageStillToRun(record, '3')) {
    return { status: 'skipped', changes: 0, reason: 'Stage 3 already finished' };
  }
  const { labels } = await scope.client.listLabels(scope.fullName);
  const plan = planStage3(ctx.approved, ctx.mappingIndex, labels);
  const byName = new Map(labels.map((label) => [label.name, label]));
  let changes = 0;
  const shape = (label) => ({
    name: label.name,
    color: String(label.color ?? '').toLowerCase(),
    description: label.description ?? '',
  });

  for (const rename of plan.to_rename) {
    const before = shape(byName.get(rename.from));
    await change(ctx, scope, {
      action: 'rename',
      label: rename.from,
      before,
      after: { ...before, name: rename.to },
    });
    changes += 1;
  }
  for (const create of plan.to_create) {
    await change(ctx, scope, { action: 'create', label: create.name, before: null, after: create });
    changes += 1;
  }
  for (const update of plan.to_update) {
    const live =
      byName.get(update.name) ??
      [...byName.values()].find((l) => l.name.toLowerCase() === update.name.toLowerCase());
    const before = shape(live);
    await change(ctx, scope, {
      action: 'update',
      label: update.name,
      before,
      after: { ...before, ...update },
    });
    changes += 1;
  }
  for (const relabel of plan.to_relabel) {
    for (const item of await itemsCarrying(scope.client, scope.fullName, relabel.from)) {
      if (item.labels.includes(relabel.to)) {
        continue;
      }
      const ref = { kind: item.kind, number: item.number };
      await change(ctx, scope, {
        action: 'relabel',
        label: relabel.from,
        before: { name: relabel.from, item: ref },
        after: {
          name: relabel.to,
          item: ref,
          ...(relabel.concept_label ? { concept_label: relabel.concept_label } : {}),
        },
      });
      changes += 1;
    }
  }

  record.executed_at['3'] = ctx.now().toISOString();
  if (scope.isPrivate) {
    assertPrivateDirIgnored(ctx.root);
  }
  writeJsonFile(scope.dryRunFile, record);
  return { status: 'finished', changes };
}

/**
 * Stage 4: gated deletion. Refuses unless the approval verifies and the
 * repository still matches its dry run.
 * @param {object} ctx - Run context (`ctx.apply` must be true to write)
 * @param {object} repo - Repository from the API
 * @returns {Promise<{ status: string, changes: number, reason?: string, reasons?: string[] }>} Outcome
 */
export async function applyStage4(ctx, repo) {
  const scope = repoScope(ctx, repo);
  const record = readJsonFile(scope.dryRunFile);
  if (!record) {
    return { status: 'skipped', changes: 0, reason: 'no dry run' };
  }
  if (!stageStillToRun(record, '4')) {
    return { status: 'skipped', changes: 0, reason: 'Stage 4 already finished' };
  }
  if (record.stale) {
    return {
      status: 'skipped',
      changes: 0,
      reason: 'marked stale; regenerate the dry run and get a new approval',
    };
  }
  const verdict = await verifyApproval(record, repo, scope.gate, (url) =>
    scope.client.getCommentByUrl(url)
  );
  if (!verdict.ok) {
    return { status: 'skipped', changes: 0, reason: `not approved: ${verdict.reason}` };
  }
  if (record.needs_decision?.length > 0) {
    return {
      status: 'skipped',
      changes: 0,
      reason: `open items on ${record.needs_decision.join(', ')} have no migrate_to; decide on the gate and regenerate`,
    };
  }

  scope.client.forgetDiscussions?.(scope.fullName);
  const live = await readLive(ctx, scope, { items: true });
  const verdictStale = detectStaleness({
    record,
    liveLabels: live.labels,
    liveItemsFor: live.itemsFor,
    doneRecords: ctx.done.filter((entry) => entry.repository === record.repository),
    currentApprovedSetCommit: ctx.currentApprovedSetCommit,
  });
  if (verdictStale.stale) {
    record.stale = { detected_at: ctx.now().toISOString(), reasons: verdictStale.reasons };
    if (scope.isPrivate) {
      assertPrivateDirIgnored(ctx.root);
    }
    writeJsonFile(scope.dryRunFile, record);
    if (ctx.apply) {
      await scope.client.postComment(
        scope.gate.repository,
        scope.gate.issue,
        `Stale dry run, ${scope.isPrivate ? 'a private repository' : record.repository}: ${verdictStale.reasons.join('; ')}. Skipped; a new dry run and approval are needed.`
      );
    }
    return { status: 'stale', changes: 0, reasons: verdictStale.reasons };
  }

  // GitHub creates a label when it is added to an item and does not exist yet.
  // A missing migration target would be created with no colour or description,
  // outside the approved set, so Stage 3 must have created it first.
  const liveNames = new Set(live.labels.map((label) => label.name.toLowerCase()));
  const missingTargets = [
    ...new Set(
      record.to_delete
        .filter(
          (entry) => entry.migrate_to && entry.open_items.length + entry.closed_items.length > 0
        )
        .map((entry) => entry.migrate_to)
        .filter((target) => !liveNames.has(target.toLowerCase()))
    ),
  ];
  if (missingTargets.length > 0) {
    return {
      status: 'skipped',
      changes: 0,
      reason: `migration targets do not exist yet (${missingTargets.join(', ')}); run Stage 3 first`,
    };
  }

  const deletedAlready = new Set(
    ctx.done
      .filter((e) => e.repository === record.repository && e.action === 'delete')
      .map((e) => e.label)
  );
  let changes = 0;
  for (const entry of record.to_delete) {
    if (deletedAlready.has(entry.name)) {
      continue;
    }
    const labelShape = { name: entry.name, color: entry.color, description: entry.description };
    const migrateItems = entry.migrate_to ? [...entry.open_items, ...entry.closed_items] : [];
    const alreadyMigrated = new Set(
      ctx.done
        .filter(
          (e) =>
            e.repository === record.repository && e.action === 'relabel' && e.label === entry.name
        )
        .map((e) => `${e.before.item.kind}#${e.before.item.number}`)
    );
    for (const item of migrateItems) {
      if (alreadyMigrated.has(`${item.kind}#${item.number}`)) {
        continue;
      }
      await change(ctx, scope, {
        action: 'relabel',
        label: entry.name,
        before: { name: entry.name, item },
        after: {
          name: entry.migrate_to,
          item,
          ...(entry.concept_label ? { concept_label: entry.concept_label } : {}),
        },
      });
      changes += 1;
    }
    await change(ctx, scope, {
      action: 'delete',
      label: entry.name,
      before: labelShape,
      after: null,
    });
    changes += 1;
  }

  record.executed_at['4'] = ctx.now().toISOString();
  if (scope.isPrivate) {
    assertPrivateDirIgnored(ctx.root);
  }
  writeJsonFile(scope.dryRunFile, record);
  return { status: 'finished', changes };
}

/**
 * Appends a record for a step done by hand (T063), under the run's lock.
 * @param {object} ctx - Run context
 * @param {object} repo - Repository from the API
 * @param {object} record - Record without `run_by`, `gate_issue` or `op_id`
 * @param {string} [opId] - Reuse an op id to write the `done` half of a pair
 * @returns {string} The op id used
 */
export function recordManualStep(ctx, repo, record, opId) {
  const scope = repoScope(ctx, repo);
  if (!['intended', 'done'].includes(record.state)) {
    throw new ConsolidationError('A manual record must be intended or done.');
  }
  if (!['rename', 'create', 'update', 'relabel', 'convert', 'delete'].includes(record.action)) {
    throw new ConsolidationError(`Unknown action ${record.action}`);
  }
  if (opId !== undefined && !String(opId).startsWith(`${ctx.run.runId}-`)) {
    throw new ConsolidationError(`op_id ${opId} does not belong to run ${ctx.run.runId}.`);
  }
  const id = opId ?? ctx.run.nextOpId();
  if (scope.isPrivate) {
    assertPrivateDirIgnored(ctx.root);
  }
  ctx.run.append(scope.logFile, {
    run_by: ctx.run.runBy,
    at: ctx.now().toISOString(),
    repository: scope.fullName,
    before: null,
    after: null,
    ...record,
    gate_issue: scope.gate.issue,
    op_id: id,
  });
  return id;
}

/**
 * Runs one stage over the repositories in scope. Without `ctx.apply` it only
 * writes dry-run files. With it, a stopped run's unmatched records are
 * reconciled first, then each repository is processed in turn; the first
 * failure stops the run and leaves its lock for `--resume`.
 * @param {object} ctx - Run context
 * @param {object[]} repos - Repositories in scope (non-archived, non-fork)
 * @param {'3' | '4'} stage - The stage to run
 * @returns {Promise<object[]>} One outcome per repository
 */
export async function runStage(ctx, repos, stage) {
  prepareEvidence(ctx, repos);
  ctx.done = ctx.apply ? loadRunDoneRecords(ctx, repos) : [];
  const outcomes = [];
  if (!ctx.apply) {
    for (const repo of repos) {
      const { record, problems, isPrivate } = await generateDryRun(ctx, repo);
      outcomes.push({
        repository: isPrivate ? '(private repository)' : record.repository,
        status: problems.length > 0 ? 'invalid' : 'dry-run',
        problems,
      });
    }
    return outcomes;
  }
  await reconcileRun(ctx, repos);
  for (const repo of repos) {
    const result = stage === '3' ? await applyStage3(ctx, repo) : await applyStage4(ctx, repo);
    outcomes.push({
      repository: isPrivateRepository(repo)
        ? '(private repository)'
        : (repo.full_name ?? repo.name),
      ...result,
    });
  }
  return outcomes;
}

export { APPROVER_LOGIN, PrivateEvidenceError, isPrivateRepository };

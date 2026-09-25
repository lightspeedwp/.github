/**
 * Unified Labeling Agent for LightSpeedWP
 * Applies, enforces, and standardizes labels on issues and PRs.
 * Includes content-based issue type detection, branch pattern matching, and file path analysis.
 * Uses canonical config from .github/labels.yml, .github/labeler.yml, .github/issue-types.yml.
 * Replaces all prior split agents.
 *
 * @module scripts/agents/labeling.agent.js
 * @see ../../agents/labeling.agent.md
 * @version 2.0.0
 * @author LightSpeedWP
 */

import fs from 'fs';
import { load } from 'js-yaml';
import * as core from '@actions/core';
import * as github from '@actions/github';
import { buildLabelAliasMap, findStandardLabel } from './includes/label-lookup.js';
import {
  enforceOneHotLabels,
  applyDefaultStatus,
  applyDefaultPriority,
  applyDefaultType,
} from './includes/status-enforcer.js';
import { fetchLabelerRules, applyLabelerRules } from './includes/labeler-utils.js';
import { buildLabelingReport } from './includes/label-reporting.js';

// Environment configurable paths (fallback to repo defaults)
const LABELS_CONFIG = process.env.LABELS_CONFIG || '.github/labels.yml';
const LABELER_RULES = process.env.LABELER_RULES || '.github/labeler.yml';
const ISSUE_TYPES_CONFIG = process.env.ISSUE_TYPES_CONFIG || '.github/issue-types.yml';

// Content fallback signals use explicit markers and whole-word matching.
const KEYWORD_TYPE_MAP = {
  bug: 'type:bug',
  defect: 'type:bug',
  error: 'type:bug',
  'fix:': 'type:bug',
  fixes: 'type:bug',
  'closes #': 'type:bug',
  hotfix: 'type:bug',
  feature: 'type:feature',
  feat: 'type:feature',
  enhancement: 'type:feature',
  'new feature': 'type:feature',
  improvement: 'type:feature',
  docs: 'type:docs',
  documentation: 'type:docs',
  readme: 'type:docs',
  guide: 'type:docs',
  test: 'type:test',
  testing: 'type:test',
  'unit test': 'type:test',
  'integration test': 'type:test',
  perf: 'type:performance',
  performance: 'type:performance',
  optimization: 'type:performance',
  optimize: 'type:performance',
  security: 'type:security',
  vulnerability: 'type:security',
  cve: 'type:security',
  refactor: 'type:refactor',
  refactoring: 'type:refactor',
  restructure: 'type:refactor',
  chore: 'type:chore',
  maintenance: 'type:chore',
  cleanup: 'type:chore',
  dependencies: 'type:dependency',
  dependency: 'type:dependency',
  'bump version': 'type:dependency',
  ci: 'type:ci',
  'continuous integration': 'type:ci',
  workflow: 'type:ci',
  a11y: 'type:a11y',
  accessibility: 'type:a11y',
  wcag: 'type:a11y',
};

// Branch prefix to type mapping for PRs. Values must stay canonical
// (see .github/labels.yml) and in parity with .github/branch-labels.yml
// default_labels (see scripts/agents/__tests__/label-contracts.test.js).
// Ownership: on PRs the router (branch-labels.yml) is the sole type writer;
// the agent uses this map only to recognise branch intent when reconciling.
const BRANCH_PREFIX_TYPE_MAP = {
  'feat/': 'type:feature',
  'feature/': 'type:feature',
  'fix/': 'type:bug',
  'bugfix/': 'type:bug',
  'hotfix/': 'type:bug',
  'docs/': 'type:docs',
  'doc/': 'type:docs',
  'audit/': 'type:review',
  'test/': 'type:test',
  'tests/': 'type:test',
  'perf/': 'type:performance',
  'refactor/': 'type:refactor',
  'chore/': 'type:chore',
  'ci/': 'type:ci',
  'deps/': 'type:dependency',
  'security/': 'type:security',
  'a11y/': 'type:a11y',
};

function readYamlArrayFile(path, purpose) {
  if (!fs.existsSync(path)) {
    throw new Error(`[labeling.agent] Missing ${purpose} file at: ${path}`);
  }
  const raw = fs.readFileSync(path, 'utf8');
  const data = load(raw);
  if (!Array.isArray(data)) {
    throw new Error(`[labeling.agent] Expected array in ${purpose} file: ${path}`);
  }
  return data;
}

/**
 * Loads canonical label definitions from LABELS_CONFIG.
 * @returns {Set<string>} Set of canonical label names.
 */
function loadCanonicalLabels() {
  const labelsData = readYamlArrayFile(LABELS_CONFIG, 'labels config');
  return new Set(labelsData.map((l) => (typeof l === 'string' ? l : l.name)));
}

/**
 * Loads alias mapping from LABELS_CONFIG.
 * @returns {Object} aliasMap - Maps alias to canonical label.
 */
function loadAliasMap() {
  const labelsData = readYamlArrayFile(LABELS_CONFIG, 'labels config');
  return buildLabelAliasMap(labelsData);
}

function loadIssueTypeMap(path = ISSUE_TYPES_CONFIG) {
  if (!fs.existsSync(path)) {
    throw new Error(`[labeling.agent] Missing issue types file at: ${path}`);
  }
  const data = load(fs.readFileSync(path, 'utf8'));
  if (!data || !Array.isArray(data.issue_types)) {
    throw new Error(`[labeling.agent] Expected issue_types array in: ${path}`);
  }
  return new Map(
    data.issue_types
      .filter((entry) => entry && typeof entry.name === 'string' && typeof entry.label === 'string')
      .map((entry) => [entry.name.toLowerCase(), entry.label])
  );
}

async function fetchNativeIssueTypeLabel(octokit, owner, repo, number, issueTypeMap) {
  const { data } = await octokit.rest.issues.get({
    owner,
    repo,
    issue_number: number,
  });
  const nativeType =
    (typeof data?.type === 'string' ? data.type : data?.type?.name) ||
    data?.issue_type?.name ||
    null;
  if (!nativeType) return null;

  const label = issueTypeMap.get(String(nativeType).toLowerCase()) || null;
  if (!label) {
    core.warning(`[labeling.agent] Native issue type '${nativeType}' is not mapped`);
  }
  return label;
}

/**
 * Detect issue type from branch name using prefix patterns
 * @param {string} branchName - Branch name to analyze
 * @returns {string|null} Canonical type label or null if none matched
 */
function detectTypeFromBranch(branchName = '') {
  if (!branchName) return null;

  const lowerBranch = branchName.toLowerCase();
  for (const [prefix, typeLabel] of Object.entries(BRANCH_PREFIX_TYPE_MAP)) {
    if (lowerBranch.startsWith(prefix)) {
      core.info(`[labeling.agent] Detected type from branch prefix '${prefix}': ${typeLabel}`);
      return typeLabel;
    }
  }
  return null;
}

function containsKeyword(text, keyword) {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const value = String(text ?? '');
  const leadingBoundary = /^[a-z0-9_]/i.test(keyword) ? '(^|[^a-z0-9_])' : '';
  const trailingBoundary = /[a-z0-9_]$/i.test(keyword) ? '(?=$|[^a-z0-9_])' : '';
  return new RegExp(`${leadingBoundary}${escaped}${trailingBoundary}`, 'i').test(value);
}

/**
 * Detect issue type from content (title + body) using explicit, whole-word
 * fallback signals. Native issue types are handled before this function.
 * @param {string} title - Issue/PR title
 * @param {string} body - Issue/PR body
 * @returns {string|null} Canonical type label or null if none matched
 */
function detectIssueTypeFromContent(title = '', body = '') {
  for (const [keyword, typeLabel] of Object.entries(KEYWORD_TYPE_MAP)) {
    if (containsKeyword(title, keyword)) {
      core.info(`[labeling.agent] Detected type from title keyword '${keyword}': ${typeLabel}`);
      return typeLabel;
    }
  }

  for (const [keyword, typeLabel] of Object.entries(KEYWORD_TYPE_MAP)) {
    if (containsKeyword(body, keyword)) {
      core.info(`[labeling.agent] Detected type from body keyword '${keyword}': ${typeLabel}`);
      return typeLabel;
    }
  }

  return null;
}

/**
 * Removes a label, treating "already absent" (404) as success so a label
 * removed earlier in the run (or by a concurrent workflow) is never an
 * error. Other failures are rethrown for the caller to record.
 */
async function removeLabelSafe(octokit, owner, repo, number, label) {
  try {
    await octokit.rest.issues.removeLabel({
      owner,
      repo,
      issue_number: number,
      name: label,
    });
    return true;
  } catch (error) {
    if (error && error.status === 404) {
      core.info(`[labeling.agent] Label already absent, skipping removal: ${label} on #${number}`);
      return false;
    }
    throw error;
  }
}

/**
 * Reads the item's live labels from the API. Event payloads go stale while
 * runs queue, so every mutating decision reconciles against this, never
 * against the payload snapshot alone (#3545).
 *
 * @returns {Promise<string[]>} Live label names.
 */
async function fetchLiveLabels(octokit, owner, repo, number) {
  const names = [];
  let page = 1;
  for (;;) {
    const { data } = await octokit.rest.issues.listLabelsOnIssue({
      owner,
      repo,
      issue_number: number,
      per_page: 100,
      page,
    });
    if (!data.length) break;
    for (const label of data) {
      if (label && label.name) names.push(label.name);
    }
    if (data.length < 100) break;
    page += 1;
  }
  return names;
}

// Explicit severity rank so duplicate priority labels resolve
// deterministically (never "first in the API array").
const PRIORITY_SEVERITY_ORDER = [
  'priority:critical',
  'priority:high',
  'priority:important',
  'priority:normal',
  'priority:low',
  'priority:minor',
];

/**
 * Deterministically picks the single surviving type label.
 *
 * Precedence (no reliance on API/event ordering):
 *   1. nativeType, when it is live (the issue's authoritative type);
 *   2. branchType, when it is live (the router's branch intent);
 *   3. contentType, when it is live (fresh content signal);
 *   4. otherwise the earliest label in canonical labels.yml order.
 *
 * @returns {string|null} Winning label, or null when none are live.
 */
function resolveTypeWinner({ liveTypes, nativeType, branchType, contentType, canonicalOrder }) {
  const live = new Set(liveTypes);
  if (nativeType && live.has(nativeType)) return nativeType;
  if (branchType && live.has(branchType)) return branchType;
  if (contentType && live.has(contentType)) return contentType;
  for (const name of canonicalOrder) {
    if (live.has(name)) return name;
  }
  return liveTypes[0] || null;
}

/**
 * Deterministically picks the surviving priority label by severity rank,
 * falling back to canonical order for unknown values.
 */
function resolvePriorityWinner({ livePriorities, canonicalOrder }) {
  for (const name of PRIORITY_SEVERITY_ORDER) {
    if (livePriorities.includes(name)) return name;
  }
  for (const name of canonicalOrder) {
    if (livePriorities.includes(name)) return name;
  }
  return livePriorities[0] || null;
}

/**
 * Removes or migrates any label on an issue/PR that is not in the canonical set.
 * @param {Object} github - Octokit instance.
 * @param {string} owner
 * @param {string} repo
 * @param {number} number - Issue/PR number.
 * @param {string[]} currentLabels
 * @param {Set<string>} canonicalSet
 * @param {Object} aliasMap
 * @param {boolean} dryRun
 * @param {function} log
 */
async function standardizeLabelsOnItem(
  github,
  owner,
  repo,
  number,
  currentLabels,
  canonicalSet,
  aliasMap = {},
  dryRun = false,
  log = console.log
) {
  for (const label of currentLabels) {
    if (!canonicalSet.has(label)) {
      // Migrate legacy/alias to canonical
      const canonical = findStandardLabel(label, aliasMap, canonicalSet);
      if (canonical) {
        if (!dryRun) {
          await github.rest.issues.addLabels({
            owner,
            repo,
            issue_number: number,
            labels: [canonical],
          });
        }
        log(`[labeling.agent] Migrated: ${label} -> ${canonical} on #${number}`);
      }
      // Remove non-canonical label; an already-absent label is success,
      // never a 404 abort mid-run (#3545).
      if (!dryRun) {
        await removeLabelSafe(github, owner, repo, number, label);
      }
      log(`[labeling.agent] Removed non-canonical label: ${label} from #${number}`);
    }
  }
}

/**
 * Main orchestrator for labeling agent with comprehensive error handling
 * @param {Object} opts - Configuration options
 * @param {Object} [opts.context=github.context] - GitHub context
 * @param {Object} [opts.github] - Octokit instance
 * @param {boolean} [opts.dryRun=false] - Dry run mode
 * @param {number} [opts.maxRetries=3] - Maximum retry attempts for API calls
 * @returns {Promise<Object>} Report object with summary of actions taken
 */
async function runLabelingAgent(opts = {}) {
  const startTime = Date.now();
  const report = {
    success: false,
    added: [],
    removed: [],
    migrated: [],
    errors: [],
    rulesApplied: [],
    duration: 0,
  };

  try {
    // Initialize context and GitHub client
    const context = opts.context || github.context;
    const octokit =
      opts.github || github.getOctokit(core.getInput('github-token') || process.env.GITHUB_TOKEN);
    const dryRun = !!opts.dryRun;
    const maxRetries = opts.maxRetries || 3;

    const owner = context.repo.owner;
    const repo = context.repo.repo;
    const isPR = !!context.payload.pull_request;
    const isIssue = !!context.payload.issue;
    const number = isIssue
      ? context.payload.issue.number
      : isPR
        ? context.payload.pull_request.number
        : null;

    if (!number) {
      core.info('[labeling.agent] No issue or PR in context');
      report.success = true;
      report.duration = Date.now() - startTime;
      return report;
    }

    core.info(`[labeling.agent] Processing ${isPR ? 'PR' : 'Issue'} #${number}`);
    if (dryRun) {
      core.info('[labeling.agent] Running in DRY RUN mode');
    }

    // Load canonical configurations with error handling
    let canonicalSet, aliasMap, labelerRules, issueTypeMap;
    try {
      core.startGroup('Loading canonical configurations');
      canonicalSet = loadCanonicalLabels();
      core.info(`[labeling.agent] Loaded ${canonicalSet.size} canonical labels`);

      aliasMap = loadAliasMap();
      core.info(`[labeling.agent] Loaded ${Object.keys(aliasMap).length} label aliases`);

      issueTypeMap = loadIssueTypeMap();
      core.info(`[labeling.agent] Loaded ${issueTypeMap.size} native issue types`);

      labelerRules = fetchLabelerRules(LABELER_RULES);
      core.info(`[labeling.agent] Loaded ${Object.keys(labelerRules).length} labeler rules`);
      core.endGroup();
    } catch (error) {
      core.error(`[labeling.agent] Configuration loading failed: ${error.message}`);
      core.endGroup();
      report.errors.push(`Configuration error: ${error.message}`);
      core.setFailed(error.message);
      report.duration = Date.now() - startTime;
      return report;
    }

    // Labels known to be present, tracked across every mutation below.
    // The event payload goes stale while runs queue, so this starts from
    // the live API state and is updated after each stage (#3545).
    const snapshotLabels = isIssue
      ? (context.payload.issue.labels || []).map((l) => l.name)
      : (context.payload.pull_request.labels || []).map((l) => l.name);

    core.info(
      `[labeling.agent] Payload labels (${snapshotLabels.length}): ${snapshotLabels.join(', ') || 'none'}`
    );

    let knownLabels;
    try {
      knownLabels = new Set(await fetchLiveLabels(octokit, owner, repo, number));
    } catch (error) {
      core.warning(
        `[labeling.agent] Live label fetch failed, falling back to payload snapshot: ${error.message}`
      );
      report.errors.push(`Live label fetch error: ${error.message}`);
      knownLabels = new Set(snapshotLabels);
    }

    core.info(
      `[labeling.agent] Current labels (${knownLabels.size}): ${[...knownLabels].join(', ') || 'none'}`
    );

    const markAdded = (label) => {
      knownLabels.add(label);
      report.added.push(label);
    };
    const markRemoved = (label) => {
      knownLabels.delete(label);
      report.removed.push(label);
    };

    // Canonical order for deterministic fallbacks (stable file order,
    // never API/event ordering).
    const canonicalOrder = [...canonicalSet];

    // Branch intent for PRs, used for precedence only. The router owns
    // PR type labels; the agent never adds competing types (#3545).
    const branchName = isPR ? context.payload.pull_request.head.ref : '';
    const branchType = isPR ? detectTypeFromBranch(branchName) : null;
    let nativeTypeLabel = null;
    let nativeTypeLookupFailed = false;
    if (!isPR) {
      try {
        nativeTypeLabel = await fetchNativeIssueTypeLabel(
          octokit,
          owner,
          repo,
          number,
          issueTypeMap
        );
        if (nativeTypeLabel) {
          core.info(`[labeling.agent] Using native issue type label: ${nativeTypeLabel}`);
        }
      } catch (error) {
        nativeTypeLookupFailed = true;
        core.warning(`[labeling.agent] Native issue type lookup failed: ${error.message}`);
        report.errors.push(`Native issue type lookup error: ${error.message}`);
      }
    }

    // Step 1: Apply labeler rules (branch patterns and file changes).
    // On PRs, type:* is router-owned and skipped here so the agent never
    // writes a family another writer owns (#3545).
    try {
      core.startGroup('Applying labeler rules');
      const appliedFromRules = await applyLabelerRules({
        github: octokit,
        context,
        labelerRules,
        currentLabels: [...knownLabels],
        dryRun,
        maxRetries,
        skipFamilies: isPR ? ['type:'] : [],
      });

      if (appliedFromRules.length > 0) {
        for (const label of appliedFromRules) markAdded(label);
        report.rulesApplied.push(`File/branch patterns matched: ${appliedFromRules.join(', ')}`);
      }
      core.endGroup();
    } catch (error) {
      core.warning(`[labeling.agent] Labeler rules application failed: ${error.message}`);
      report.errors.push(`Labeler rules error: ${error.message}`);
      core.endGroup();
    }

    // (No branch-prefix type adds: PR types are owned by the router.
    // branchType above feeds final precedence only.)

    // Step 3: Enforce one-hot constraints (status, priority, type)
    // against tracked state, then refresh from live so later stages
    // observe one-hot removals. Types are pre-ordered winner-first so the
    // first-keep rule below cannot transiently drop the deterministic
    // winner ahead of final reconciliation.
    try {
      core.startGroup('Enforcing one-hot label constraints');
      const preTypes = [...knownLabels].filter((l) => l.startsWith('type:'));
      if (preTypes.length > 1) {
        const prestatement =
          isPR || nativeTypeLabel || nativeTypeLookupFailed
            ? null
            : detectIssueTypeFromContent(context.payload.issue.title, context.payload.issue.body);
        const preWinner = resolveTypeWinner({
          liveTypes: preTypes,
          branchType: isPR ? branchType : null,
          nativeType: nativeTypeLabel,
          contentType: !isPR ? prestatement : null,
          canonicalOrder,
        });
        if (preWinner) {
          knownLabels = new Set([preWinner, ...[...knownLabels].filter((l) => l !== preWinner)]);
        }
      }
      await enforceOneHotLabels({
        github: octokit,
        owner,
        repo,
        number,
        currentLabels: [...knownLabels],
        dryRun,
      });
      core.endGroup();
    } catch (error) {
      core.warning(`[labeling.agent] One-hot enforcement failed: ${error.message}`);
      report.errors.push(`One-hot enforcement error: ${error.message}`);
      core.endGroup();
    }

    try {
      knownLabels = new Set(await fetchLiveLabels(octokit, owner, repo, number));
    } catch (error) {
      core.warning(
        `[labeling.agent] Label refresh failed, continuing with tracked state: ${error.message}`
      );
    }

    // Step 4: Apply defaults for missing required labels.
    // PR types are router-owned and never added here; issues fall back
    // to content detection (Step 5) before the type default, so a default
    // can never stack a second type onto a detected one (#3545).
    try {
      core.startGroup('Applying default labels');
      await applyDefaultStatus({
        github: octokit,
        owner,
        repo,
        number,
        currentLabels: [...knownLabels],
        dryRun,
        isPR,
      });

      await applyDefaultPriority({
        github: octokit,
        owner,
        repo,
        number,
        currentLabels: [...knownLabels],
        dryRun,
      });

      try {
        knownLabels = new Set(await fetchLiveLabels(octokit, owner, repo, number));
      } catch (error) {
        core.warning(
          `[labeling.agent] Label refresh failed, continuing with tracked state: ${error.message}`
        );
        if (![...knownLabels].some((l) => l.startsWith('status:')) && !dryRun) {
          markAdded(isPR ? 'status:needs-review' : 'status:needs-triage');
        }
        if (![...knownLabels].some((l) => l.startsWith('priority:')) && !dryRun) {
          markAdded('priority:normal');
        }
      }
      core.endGroup();
    } catch (error) {
      core.warning(`[labeling.agent] Default label application failed: ${error.message}`);
      report.errors.push(`Default labels error: ${error.message}`);
      core.endGroup();
    }

    // Step 5: Resolve one type for issues. Native issue type is authoritative;
    // content keywords are only a fallback when no type is already live.
    const liveTypeLabels = [...knownLabels].filter((l) => l.startsWith('type:'));
    const isUntypedIssueEvent =
      !isPR && context.payload.action === 'untyped' && !nativeTypeLookupFailed && !nativeTypeLabel;
    if (isUntypedIssueEvent) {
      try {
        nativeTypeLabel = await fetchNativeIssueTypeLabel(
          octokit,
          owner,
          repo,
          number,
          issueTypeMap
        );
        if (nativeTypeLabel) {
          core.info(`[labeling.agent] Revalidated native issue type label: ${nativeTypeLabel}`);
        }
      } catch (error) {
        nativeTypeLookupFailed = true;
        core.warning(`[labeling.agent] Native issue type revalidation failed: ${error.message}`);
        report.errors.push(`Native issue type revalidation error: ${error.message}`);
      }
      if (!nativeTypeLookupFailed && !nativeTypeLabel) {
        for (const label of liveTypeLabels) {
          try {
            if (!dryRun) {
              await removeLabelSafe(octokit, owner, repo, number, label);
            }
            markRemoved(label);
            report.rulesApplied.push(
              `Cleared stale type label after native type removal: ${label}`
            );
          } catch (error) {
            core.warning(`[labeling.agent] Stale type label removal failed: ${error.message}`);
            report.errors.push(`Stale type label removal error: ${error.message}`);
          }
        }
      }
    }
    const hasTypeLabel = [...knownLabels].some((l) => l.startsWith('type:'));
    let contentType = null;
    if (!isPR && nativeTypeLabel) {
      try {
        if (!knownLabels.has(nativeTypeLabel)) {
          if (!dryRun) {
            await octokit.rest.issues.addLabels({
              owner,
              repo,
              issue_number: number,
              labels: [nativeTypeLabel],
            });
          }
          markAdded(nativeTypeLabel);
        }
        report.rulesApplied.push(`Native issue type: ${nativeTypeLabel}`);
      } catch (error) {
        core.warning(`[labeling.agent] Native type label application failed: ${error.message}`);
        report.errors.push(`Native type label error: ${error.message}`);
      }
    } else if (!isPR && !nativeTypeLookupFailed && !hasTypeLabel) {
      try {
        contentType = detectIssueTypeFromContent(
          context.payload.issue.title,
          context.payload.issue.body
        );

        if (contentType && !knownLabels.has(contentType)) {
          if (!dryRun) {
            await octokit.rest.issues.addLabels({
              owner,
              repo,
              issue_number: number,
              labels: [contentType],
            });
          }
          markAdded(contentType);
          report.rulesApplied.push(`Content-based type detection: ${contentType}`);
        }
      } catch (error) {
        core.warning(`[labeling.agent] Content type detection failed: ${error.message}`);
        report.errors.push(`Content detection error: ${error.message}`);
      }
    }

    // Deferred type default for issues: only when content detection found
    // nothing, so exactly one type is ever introduced per run.
    if (
      !isPR &&
      !nativeTypeLabel &&
      !nativeTypeLookupFailed &&
      ![...knownLabels].some((l) => l.startsWith('type:'))
    ) {
      try {
        await applyDefaultType({
          github: octokit,
          owner,
          repo,
          number,
          currentLabels: [...knownLabels],
          dryRun,
          isPR,
        });
        if (!dryRun) markAdded('type:task');
      } catch (error) {
        core.warning(`[labeling.agent] Default type application failed: ${error.message}`);
        report.errors.push(`Default type error: ${error.message}`);
      }
    }

    // Step 6: Changelog nudge for PRs
    if (isPR) {
      try {
        const changelogLabels = ['meta:no-changelog', 'meta:needs-changelog'];
        if (![...knownLabels].some((l) => changelogLabels.includes(l))) {
          if (!dryRun) {
            await octokit.rest.issues.addLabels({
              owner,
              repo,
              issue_number: number,
              labels: ['meta:needs-changelog'],
            });
          }
          markAdded('meta:needs-changelog');
          core.info('[labeling.agent] Added meta:needs-changelog');
        }
      } catch (error) {
        core.warning(`[labeling.agent] Changelog label application failed: ${error.message}`);
        report.errors.push(`Changelog label error: ${error.message}`);
      }
    }

    // Step 7: Final reconciliation toward the deterministic managed state.
    // Re-reads live labels, then converges: at most one type:* (by
    // precedence, never array order), status/priority defaults already
    // applied above, non-canonical labels migrated/removed 404-tolerantly.
    // A rerun with unchanged inputs mutates nothing (idempotent).
    try {
      core.startGroup('Reconciling managed label state');
      let live;
      try {
        live = await fetchLiveLabels(octokit, owner, repo, number);
      } catch (error) {
        core.warning(
          `[labeling.agent] Final live fetch failed, reconciling tracked state: ${error.message}`
        );
        live = [...knownLabels];
      }

      const liveTypes = live.filter((l) => l.startsWith('type:'));
      if (liveTypes.length > 1) {
        const winner = resolveTypeWinner({
          liveTypes,
          branchType: isPR ? branchType : null,
          nativeType: nativeTypeLabel,
          contentType: !isPR ? contentType : null,
          canonicalOrder,
        });
        core.info(
          `[labeling.agent] Multiple type labels live on #${number}: ${liveTypes.join(', ')}; keeping ${winner}`
        );
        for (const label of liveTypes) {
          if (label === winner) continue;
          if (!dryRun) {
            await removeLabelSafe(octokit, owner, repo, number, label);
          }
          markRemoved(label);
        }
      }

      const livePriorities = live.filter((l) => l.startsWith('priority:'));
      if (livePriorities.length > 1) {
        const winner = resolvePriorityWinner({
          livePriorities,
          canonicalOrder,
        });
        core.info(
          `[labeling.agent] Multiple priority labels live on #${number}: ${livePriorities.join(', ')}; keeping ${winner}`
        );
        for (const label of livePriorities) {
          if (label === winner) continue;
          if (!dryRun) {
            await removeLabelSafe(octokit, owner, repo, number, label);
          }
          markRemoved(label);
        }
      }

      let standardizeList;
      try {
        standardizeList = await fetchLiveLabels(octokit, owner, repo, number);
      } catch (error) {
        core.warning(`[labeling.agent] Live fetch before standardize failed: ${error.message}`);
        standardizeList = [...knownLabels];
      }
      await standardizeLabelsOnItem(
        octokit,
        owner,
        repo,
        number,
        standardizeList,
        canonicalSet,
        aliasMap,
        dryRun,
        core.info
      );
      core.endGroup();
    } catch (error) {
      core.warning(`[labeling.agent] Label reconciliation failed: ${error.message}`);
      report.errors.push(`Reconciliation error: ${error.message}`);
      core.endGroup();
    }

    // Generate summary report
    report.success = true;
    report.duration = Date.now() - startTime;

    core.info(`[labeling.agent] Completed in ${report.duration}ms (DRY_RUN=${dryRun})`);
    core.info(
      `[labeling.agent] Summary: ${report.added.length} added, ${report.removed.length} removed, ${report.migrated.length} migrated, ${report.errors.length} errors`
    );

    // Output structured report
    const summaryReport = buildLabelingReport({
      added: report.added,
      removed: report.removed,
      migrated: report.migrated,
      rulesApplied: report.rulesApplied,
      errors: report.errors,
      context,
    });

    core.summary.addRaw(summaryReport).write();

    return report;
  } catch (error) {
    core.error(`[labeling.agent] Fatal error: ${error.message}`);
    core.error(error.stack);
    report.errors.push(`Fatal error: ${error.message}`);
    report.duration = Date.now() - startTime;
    core.setFailed(error.message);
    return report;
  }
}

// Check if this module is being run directly (transform-safe: import.meta
// does not survive the repo's babel CJS transform, which breaks Jest
// loading; an argv suffix check is equivalent for CLI use).
const isMainModule =
  typeof process !== 'undefined' &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === 'string' &&
  (process.argv[1].endsWith('scripts/agents/labeling.agent.js') ||
    process.argv[1].endsWith('scripts\\agents\\labeling.agent.js'));

if (isMainModule) {
  runLabelingAgent().catch((error) => {
    core.error(`[labeling.agent] Unhandled error: ${error.message}`);
    core.error(error.stack);
    core.setFailed(error.message);
    process.exit(1);
  });
}

export {
  runLabelingAgent,
  detectIssueTypeFromContent,
  containsKeyword,
  detectTypeFromBranch,
  loadIssueTypeMap,
  fetchNativeIssueTypeLabel,
  loadCanonicalLabels,
  loadAliasMap,
  fetchLiveLabels,
  removeLabelSafe,
  resolveTypeWinner,
  resolvePriorityWinner,
  standardizeLabelsOnItem,
  BRANCH_PREFIX_TYPE_MAP,
  KEYWORD_TYPE_MAP,
};

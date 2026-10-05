/**
 * Where consolidation evidence for a repository may live (spec 008, FR-016;
 * decision of 2026-10-04 recorded in the dry-run contract).
 *
 * This repository is public, so nothing that names a private repository, its
 * labels or its items may be committed here or posted on the public gate
 * issue. Public repositories keep their evidence under
 * `.github/reports/audits/2026-09-14-label-audit/evidence/`. Private ones use
 * `.private-evidence/`, which is never committed, and report only in the
 * private report repository.
 *
 * Every function here fails closed: when visibility is unknown, or the private
 * directory could end up in a commit, it throws instead of choosing a path.
 */

import { spawnSync } from 'node:child_process';
import path from 'node:path';

export const PUBLIC_EVIDENCE_DIR = '.github/reports/audits/2026-09-14-label-audit/evidence';
export const PRIVATE_EVIDENCE_DIR = '.private-evidence';
export const APPROVER_LOGIN = 'ashleyshaw';

/** Evidence for a private repository was about to leave the private area. */
export class PrivateEvidenceError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PrivateEvidenceError';
  }
}

/**
 * Reads whether a repository is private from the GitHub repository object.
 * @param {{ private?: boolean, visibility?: string }} repo - Repository from the API
 * @returns {boolean} True for private and internal repositories
 * @throws {PrivateEvidenceError} When the visibility is not stated
 */
export function isPrivateRepository(repo) {
  if (typeof repo?.private === 'boolean') {
    return repo.private || repo.visibility === 'internal';
  }
  if (typeof repo?.visibility === 'string') {
    return repo.visibility !== 'public';
  }
  throw new PrivateEvidenceError(
    `Visibility of ${repo?.full_name ?? repo?.name ?? 'a repository'} is unknown; refusing to choose an evidence location.`
  );
}

/**
 * Refuses a repository name that could leave the evidence directory when used
 * in a file name. GitHub names are letters, digits, dots, hyphens and
 * underscores, and never `.` or `..`.
 * @param {string} name - Repository name
 * @throws {PrivateEvidenceError} When the name is not safe to use in a path
 */
export function assertSafeRepositoryName(name) {
  if (
    typeof name !== 'string' ||
    !/^[A-Za-z0-9._-]+$/.test(name) ||
    name === '.' ||
    name === '..'
  ) {
    throw new PrivateEvidenceError(
      `Repository name ${JSON.stringify(name)} is not safe to use in a file path.`
    );
  }
}

/**
 * Chooses the evidence directory for a repository.
 * @param {object} repo - Repository from the API
 * @param {string} [root] - Checkout root
 * @returns {{ dir: string, isPrivate: boolean }} Absolute directory and visibility
 */
export function evidenceDirFor(repo, root = process.cwd()) {
  const isPrivate = isPrivateRepository(repo);
  return {
    isPrivate,
    dir: path.join(root, isPrivate ? PRIVATE_EVIDENCE_DIR : PUBLIC_EVIDENCE_DIR),
  };
}

/**
 * Path of a repository's dry-run file.
 * @param {object} repo - Repository from the API
 * @param {string} [root] - Checkout root
 * @returns {{ file: string, isPrivate: boolean }} Absolute path and visibility
 */
export function dryRunPathFor(repo, root = process.cwd()) {
  assertSafeRepositoryName(repo.name);
  const { dir, isPrivate } = evidenceDirFor(repo, root);
  return { isPrivate, file: path.join(dir, 'dry-run', `${repo.name}.json`) };
}

/**
 * Path of the consolidation log that may hold a repository's records. A
 * private repository's records go to a private log, never the committed one.
 * @param {object} repo - Repository from the API
 * @param {string} [root] - Checkout root
 * @returns {{ file: string, isPrivate: boolean }} Absolute path and visibility
 */
export function consolidationLogPathFor(repo, root = process.cwd()) {
  const { dir, isPrivate } = evidenceDirFor(repo, root);
  return { isPrivate, file: path.join(dir, 'consolidation-log.jsonl') };
}

/**
 * Confirms the private directory is ignored by Git, so a later `git add` cannot
 * pick it up. Call before writing any private evidence.
 * @param {string} [root] - Checkout root
 * @param {typeof spawnSync} [run] - Process runner, for tests
 * @throws {PrivateEvidenceError} When the directory is not ignored
 */
export function assertPrivateDirIgnored(root = process.cwd(), run = spawnSync) {
  const result = run('git', ['check-ignore', '-q', `${PRIVATE_EVIDENCE_DIR}/probe`], {
    cwd: root,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new PrivateEvidenceError(
      `${PRIVATE_EVIDENCE_DIR}/ is not ignored by Git here; refusing to write private evidence where it could be committed.`
    );
  }
}

/**
 * Splits repositories by visibility, failing closed on an unknown one.
 * @param {object[]} repos - Repositories from the API
 * @returns {{ publicRepos: object[], privateRepos: object[] }} The two groups
 */
export function splitByVisibility(repos) {
  const publicRepos = [];
  const privateRepos = [];
  for (const repo of repos) {
    (isPrivateRepository(repo) ? privateRepos : publicRepos).push(repo);
  }
  return { publicRepos, privateRepos };
}

/**
 * Chooses where a repository's gate comments go.
 * @param {object} repo - Repository from the API
 * @param {object} gates
 * @param {string} gates.publicRepository - Repository of the public gate issue, for example `lightspeedwp/.github`
 * @param {number} gates.publicIssue - Public gate issue number
 * @param {string | undefined} gates.privateRepository - The private report repository
 * @param {number | undefined} gates.privateIssue - Gate issue number in the private report repository
 * @returns {{ repository: string, issue: number, isPrivate: boolean }} Where to post and read approvals
 * @throws {PrivateEvidenceError} When a private repository has no private gate
 */
export function gateFor(repo, gates) {
  if (!isPrivateRepository(repo)) {
    return { repository: gates.publicRepository, issue: gates.publicIssue, isPrivate: false };
  }
  if (!gates.privateRepository || !Number.isInteger(gates.privateIssue)) {
    throw new PrivateEvidenceError(
      `${repo.name} is private, so it needs a private gate: set PRIVATE_REPORT_REPO and --private-gate-issue. ` +
        'It will not use the public gate issue.'
    );
  }
  if (gates.privateRepository.toLowerCase() === gates.publicRepository.toLowerCase()) {
    throw new PrivateEvidenceError(
      'The private report repository must not be the public gate repository.'
    );
  }
  return { repository: gates.privateRepository, issue: gates.privateIssue, isPrivate: true };
}

/**
 * Verifies an approval record against the gate comment it cites (FR-016, dry-run
 * rule 4): author, repository and timestamp must match, and the comment must be
 * on the gate that applies to the repository's visibility.
 * @param {object} record - The dry-run file contents
 * @param {object} repo - Repository from the API
 * @param {{ repository: string, issue: number }} gate - Gate from `gateFor`
 * @param {(url: string) => Promise<{ user?: { login?: string }, body?: string } | null>} fetchComment - Reads a comment by URL
 * @returns {Promise<{ ok: boolean, reason?: string }>} Verdict
 */
export async function verifyApproval(record, repo, gate, fetchComment) {
  const approval = record?.approval;
  if (approval?.status !== 'approved') {
    return { ok: false, reason: 'approval.status is not approved' };
  }
  if (approval.approved_by !== APPROVER_LOGIN) {
    return { ok: false, reason: `approved_by is not ${APPROVER_LOGIN}` };
  }
  if (typeof approval.gate_comment_url !== 'string' || approval.gate_comment_url === '') {
    return { ok: false, reason: 'gate_comment_url is missing' };
  }
  const expectedPrefix = `https://github.com/${gate.repository}/issues/${gate.issue}#issuecomment-`;
  if (!approval.gate_comment_url.toLowerCase().startsWith(expectedPrefix.toLowerCase())) {
    return {
      ok: false,
      reason: `gate_comment_url is not a comment on the ${isPrivateRepository(repo) ? 'private' : 'public'} gate issue`,
    };
  }
  const comment = await fetchComment(approval.gate_comment_url);
  if (!comment) {
    return { ok: false, reason: 'the cited comment cannot be read' };
  }
  if (comment.user?.login !== APPROVER_LOGIN) {
    return { ok: false, reason: `the cited comment was not written by ${APPROVER_LOGIN}` };
  }
  const expectedBody = `Approved: ${record.repository} dry run ${record.generated_at}`;
  if (String(comment.body ?? '').trim() !== expectedBody) {
    return { ok: false, reason: `the cited comment does not read "${expectedBody}"` };
  }
  return { ok: true };
}

export default {
  PUBLIC_EVIDENCE_DIR,
  PRIVATE_EVIDENCE_DIR,
  APPROVER_LOGIN,
  PrivateEvidenceError,
  isPrivateRepository,
  evidenceDirFor,
  dryRunPathFor,
  assertSafeRepositoryName,
  consolidationLogPathFor,
  assertPrivateDirIgnored,
  splitByVisibility,
  gateFor,
  verifyApproval,
};

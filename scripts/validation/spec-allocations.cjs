'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { isDeepStrictEqual } = require('node:util');
const { TextDecoder } = require('node:util');

/** An invalid allocation snapshot, distinct from usage and I/O failures. */
class AllocationError extends Error {}
const invalid = (message) => { throw new AllocationError(message); };
const need = (condition, message) => { if (!condition) invalid(message); };
const numberPattern = /^(?!000)[0-9]{3}$/;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const baseUrl = 'https://github.com/lightspeedwp/.github';

/**
 * Parse strict JSON and reject duplicate decoded object keys at every depth.
 * Native parsing checks syntax; a structural walk retains keys before loss.
 * @param {string} text JSON source, not a parsed object.
 * @returns {object} Parsed document.
 */
function parseStrictJson(text) {
  let document;
  try { document = JSON.parse(text); } catch (error) { invalid(`Invalid JSON: ${error.message}`); }
  let at = 0;
  const whitespace = () => { while (' \t\r\n'.includes(text[at]) && at < text.length) at++; };
  const string = () => {
    const start = at++;
    while (at < text.length) {
      const character = text[at++];
      if (character === '\\') at++;
      else if (character === '"') return JSON.parse(text.slice(start, at));
    }
    invalid('Unterminated JSON string');
  };
  const value = () => {
    whitespace();
    if (text[at] === '{') {
      at++;
      whitespace();
      const keys = new Set();
      if (text[at] !== '}') {
        while (true) {
          const key = string();
          need(!keys.has(key), `Duplicate JSON key: ${key}`);
          keys.add(key);
          whitespace();
          at++;
          value();
          whitespace();
          if (text[at++] !== ',') break;
          whitespace();
        }
      } else at++;
    } else if (text[at] === '[') {
      at++;
      whitespace();
      if (text[at] !== ']') {
        while (true) {
          value();
          whitespace();
          if (text[at++] !== ',') break;
        }
      } else at++;
    } else if (text[at] === '"') string();
    else while (at < text.length && !',]} \t\r\n'.includes(text[at])) at++;
  };
  value();
  return document;
}

function closed(value, fields, label) {
  need(value !== null && typeof value === 'object' && !Array.isArray(value), `${label}: expected object`);
  need(isDeepStrictEqual(Object.keys(value).sort(), [...fields].sort()), `${label}: wrong fields`);
}
function text(value, label) {
  need(typeof value === 'string' && value.trim().length > 0, `${label}: expected non-empty string`);
}
function list(value, label) { need(Array.isArray(value), `${label}: expected array`); }
function slug(value) { need(typeof value === 'string' && slugPattern.test(value), 'Invalid slug'); }
function number(value) { need(typeof value === 'string' && numberPattern.test(value), 'Invalid number'); }
function date(value) {
  need(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value), 'Invalid UTC timestamp');
  const parsed = new Date(value);
  need(!Number.isNaN(parsed.valueOf()) && parsed.toISOString() === (value.includes('.') ? value : value.replace('Z', '.000Z')), 'Invalid UTC date');
}
function indexed(values, label) {
  list(values, label);
  const result = new Map();
  for (const value of values) {
    text(value?.id, `${label} id`);
    need(!result.has(value.id), `Duplicate ${label} id`);
    result.set(value.id, value);
  }
  return result;
}

/**
 * Validate closed version-1 schema and references without reading directories.
 * @param {object} ledger Candidate ledger.
 * @param {string} specsDirectory Configured repository-relative root.
 * @returns {object} Validated ledger.
 */
function validateLedger(ledger, specsDirectory) {
  closed(ledger, ['version', 'repository', 'specsDirectory', 'decisions', 'sources', 'allocations'], 'ledger');
  need(ledger.version === 1 && ledger.repository === 'lightspeedwp/.github', 'Unsupported version or repository');
  need(ledger.specsDirectory === specsDirectory, 'Ledger specifications root mismatch');
  const decisions = indexed(ledger.decisions, 'decision');
  const sources = indexed(ledger.sources, 'source');
  need(decisions.size > 0 && sources.size > 0, 'Missing provenance');
  for (const decision of decisions.values()) {
    closed(decision, ['id', 'recordUrl', 'decidedAt', 'recordedAt', 'scope'], 'decision');
    text(decision.scope, 'decision scope');
    need(typeof decision.recordUrl === 'string' && /^https:\/\/(?:linear\.app\/lightspeedwp\/issue\/GIT-[1-9][0-9]*(?:\/[a-z0-9-]+)?|github\.com\/lightspeedwp\/\.github\/issues\/[1-9][0-9]*)$/.test(decision.recordUrl), 'Invalid decision URL');
    date(decision.decidedAt);
    date(decision.recordedAt);
    need(Date.parse(decision.recordedAt) >= Date.parse(decision.decidedAt), 'Decision recorded before it was made');
  }
  for (const source of sources.values()) {
    closed(source, ['id', 'kind', 'url', 'sha'], 'source');
    need(typeof source.sha === 'string' && /^[0-9a-f]{40}$/.test(source.sha), 'Invalid source SHA');
    const expected = { tree: `${baseUrl}/tree/${source.sha}`, commit: `${baseUrl}/commit/${source.sha}` };
    need(typeof source.url === 'string', 'Invalid source URL');
    if (source.kind === 'pull-request') need(source.url.startsWith(`${baseUrl}/pull/`) && /^[1-9][0-9]*$/.test(source.url.slice(`${baseUrl}/pull/`.length)), 'Invalid PR source URL');
    else if (source.kind === 'tree') need(source.url === expected.tree || source.url === `${expected.tree}/${specsDirectory}`, 'Invalid tree source URL');
    else need(source.kind === 'commit' && source.url === expected.commit, 'Invalid commit source');
  }
  const references = (object) => {
    need(typeof object.decisionRef === 'string' && decisions.has(object.decisionRef), 'Broken decision reference');
    list(object.sourceRefs, 'sourceRefs');
    need(object.sourceRefs.length > 0 && new Set(object.sourceRefs).size === object.sourceRefs.length, 'Missing or duplicate source reference');
    for (const ref of object.sourceRefs) need(typeof ref === 'string' && sources.has(ref), 'Broken source reference');
  };
  list(ledger.allocations, 'allocations');
  const identities = new Set();
  for (const [index, allocation] of ledger.allocations.entries()) {
    closed(allocation, ['number', 'canonicalSlug', 'state', 'decisionRef', 'sourceRefs', 'historicalClaims'], 'allocation');
    number(allocation.number);
    need(Number(allocation.number) === index + 1, 'Missing, duplicate or unsorted allocation');
    need(['pending', 'materialised', 'retired'].includes(allocation.state), 'Unknown allocation state');
    if (allocation.state === 'retired') need(allocation.canonicalSlug === null, 'Retired allocation has canonical slug');
    else {
      slug(allocation.canonicalSlug);
      need(!identities.has(allocation.canonicalSlug), 'Conflicting canonical identity');
      identities.add(allocation.canonicalSlug);
    }
    references(allocation);
    list(allocation.historicalClaims, 'historicalClaims');
    need(allocation.state !== 'retired' || allocation.historicalClaims.length > 0, 'Retirement lacks history');
    const claims = new Set();
    for (const claim of allocation.historicalClaims) {
      closed(claim, ['slug', 'kind', 'resolvedTo', 'decisionRef', 'sourceRefs'], 'historical claim');
      slug(claim.slug);
      need(['unfulfilled-claim', 'superseded-assignment', 'former-directory'].includes(claim.kind), 'Unknown historical claim kind');
      references(claim);
      const identity = `${claim.kind}:${claim.slug}`;
      need(!claims.has(identity), 'Duplicate historical claim');
      claims.add(identity);
      if (claim.resolvedTo !== null) {
        closed(claim.resolvedTo, ['number', 'slug'], 'resolvedTo');
        number(claim.resolvedTo.number);
        slug(claim.resolvedTo.slug);
        const target = ledger.allocations[Number(claim.resolvedTo.number) - 1];
        // Retirement preserves the destination identity, not an active allocation.
        const retainedIdentity = target?.state === 'retired' && Array.isArray(target.historicalClaims)
          && target.historicalClaims.some((history) => history.slug === claim.resolvedTo.slug
            && history.kind === 'unfulfilled-claim' && history.resolvedTo === null && history.decisionRef === target.decisionRef);
        need((target?.canonicalSlug === claim.resolvedTo.slug && target.state !== 'retired') || retainedIdentity, 'Broken historical target');
      }
    }
  }
  return ledger;
}

/**
 * Compare provenance and transitions to a supplied ledger, never a live branch.
 * @param {object} previous Reviewed schema-valid baseline (directories not read).
 * @param {object} candidate Schema-valid candidate.
 * @returns {void}
 */
function compareBaseline(previous, candidate) {
  need(previous.repository === candidate.repository && previous.specsDirectory === candidate.specsDirectory, 'Baseline root mismatch');
  for (const key of ['sources', 'decisions']) {
    for (const old of previous[key]) need(candidate[key].some((entry) => isDeepStrictEqual(entry, old)), `Replaced or removed ${key} provenance`);
  }
  for (const old of previous.allocations) {
    const next = candidate.allocations.find((entry) => entry.number === old.number);
    need(next, `Removed allocation ${old.number}`);
    const changed = old.state !== next.state;
    need(!changed || (old.state === 'pending' && ['materialised', 'retired'].includes(next.state)), `Forbidden transition ${old.number}`);
    need(next.canonicalSlug === old.canonicalSlug || (old.state === 'pending' && next.state === 'retired'), `Changed identity ${old.number}`);
    need(old.sourceRefs.every((ref) => next.sourceRefs.includes(ref)), `Removed sources ${old.number}`);
    need(old.historicalClaims.every((claim) => next.historicalClaims.some((entry) => isDeepStrictEqual(entry, claim))), `Removed history ${old.number}`);
    if (changed) {
      need(next.decisionRef !== old.decisionRef, `Transition requires a new decision ${old.number}`);
      const before = previous.decisions.find((entry) => entry.id === old.decisionRef);
      const after = candidate.decisions.find((entry) => entry.id === next.decisionRef);
      need(Date.parse(after.decidedAt) >= Date.parse(before.decidedAt), 'Transition decision predates baseline decision');
      if (next.state === 'retired') need(next.historicalClaims.some((claim) => claim.slug === old.canonicalSlug && claim.kind === 'unfulfilled-claim' && claim.decisionRef === next.decisionRef), 'Retirement must retain pending identity');
    } else need(next.decisionRef === old.decisionRef, `Replaced allocation decision ${old.number}`);
  }
}

function readJson(file) {
  need(fs.lstatSync(file).isFile(), `Not a regular JSON file: ${file}`);
  const bytes = fs.readFileSync(file);
  let decoded;
  try { decoded = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes); }
  catch { invalid(`Invalid UTF-8: ${file}`); }
  return parseStrictJson(decoded);
}
function optionalStat(file) {
  try { return fs.lstatSync(file); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}
function roots(repoRoot, specsDirectory) {
  if (typeof repoRoot !== 'string' || !path.isAbsolute(repoRoot)) throw new Error('An absolute --repo-root is required');
  need(typeof specsDirectory === 'string' && /^[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*$/.test(specsDirectory) && !specsDirectory.split('/').some((part) => ['.', '..'].includes(part)), 'Invalid specifications root');
  const repo = fs.realpathSync(repoRoot);
  need(fs.statSync(repo).isDirectory(), 'Repository root is not a directory');
  let directory = repo;
  for (const part of specsDirectory.split('/')) {
    directory = path.join(directory, part);
    const stat = optionalStat(directory);
    need(!stat || stat.isDirectory(), `Specifications path is not a real directory: ${directory}`);
  }
  const config = path.join(repo, '.specify', 'init-options.json');
  if (optionalStat(config)) {
    const value = readJson(config);
    need(value !== null && typeof value === 'object' && !Array.isArray(value), 'Invalid configuration object');
    need((Object.hasOwn(value, 'specs_directory') ? value.specs_directory : '.github/specs') === specsDirectory, 'Configured specifications root mismatch');
  } else need(specsDirectory === '.github/specs', 'Configured specifications root mismatch');
  return directory;
}

/**
 * Inspect a configured snapshot. No writes, network calls or inferred fulfilment.
 * @param {object} options Explicit repoRoot/specsDirectory, optional baseline.
 * @returns {object} Inventory, validated ledger and comparison scope.
 */
function validate({ repoRoot, specsDirectory, baseline, allowEmpty = false }) {
  const root = roots(repoRoot, specsDirectory);
  const entries = optionalStat(root) ? fs.readdirSync(root, { withFileTypes: true }) : [];
  const directories = [];
  for (const entry of entries) {
    if (entry.isSymbolicLink()) {
      const stat = fs.statSync(path.join(root, entry.name));
      need(!stat.isDirectory(), `Symbolic specification directory: ${entry.name}`);
    }
    if (!entry.isDirectory()) continue;
    const match = /^(?!000)([0-9]{3})-([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(entry.name);
    need(match, entry.name.startsWith('000-') ? 'Duplicate number: 0' : `Invalid specification directory: ${entry.name}`);
    directories.push({ number: match[1], slug: match[2] });
  }
  directories.sort((a, b) => a.number.localeCompare(b.number));
  for (let i = 1; i < directories.length; i++) need(directories[i - 1].number !== directories[i].number, `Duplicate number: ${Number(directories[i].number)}`);
  const ledgerPath = path.join(root, 'ALLOCATIONS.json');
  const ledgerStat = optionalStat(ledgerPath);
  const ledger = ledgerStat ? validateLedger(readJson(ledgerPath), specsDirectory) : null;
  if (baseline) {
    need(ledger, 'Candidate ledger is missing while a baseline was supplied');
    compareBaseline(validateLedger(readJson(baseline), specsDirectory), ledger);
  }
  if (ledger) {
    for (const dir of directories) {
      const allocation = ledger.allocations[Number(dir.number) - 1];
      need(allocation?.state === 'materialised' && allocation.canonicalSlug === dir.slug, `Undeclared or non-materialised directory: ${dir.number}-${dir.slug}`);
    }
    for (const allocation of ledger.allocations) {
      const found = directories.find((dir) => dir.number === allocation.number);
      need((allocation.state === 'materialised') === Boolean(found), `Directory/state mismatch: ${allocation.number}`);
    }
  } else {
    const errors = [];
    let expected = 1;
    for (const dir of directories) {
      if (Number(dir.number) !== expected) errors.push(`Gap detected: expected ${expected} but found ${Number(dir.number)}`);
      expected = Number(dir.number) + 1;
    }
    need(errors.length === 0, errors.join('\n'));
  }
  need(allowEmpty || directories.length > 0, 'No specification directories found');
  return { ledger, directories, highest: ledger ? ledger.allocations.length : directories.length, preservation: baseline ? 'baseline-compared' : 'snapshot-only' };
}

/**
 * Plan a number after validation, using the caller's already-fitted final slug.
 * @param {object} options Validation roots, slug, optional number/allowExisting.
 * @returns {string} Three-digit number; never mutates the ledger or directories.
 */
function allocate(options) {
  const snapshot = validate({ ...options, allowEmpty: true });
  slug(options.slug);
  const raw = options.number;
  let chosen = snapshot.highest + 1;
  if (raw !== undefined) {
    need(typeof raw === 'string' && /^[0-9]+$/.test(raw), 'Number must be an unsigned integer');
    const normalised = raw.replace(/^0+/, '') || '0';
    need(normalised.length <= 3 && Number(normalised) >= 1 && Number(normalised) <= 999, 'Number must be between 001 and 999');
    chosen = Number(normalised);
    const entry = snapshot.ledger?.allocations[chosen - 1];
    const directory = snapshot.directories.find((dir) => Number(dir.number) === chosen);
    if (entry?.state === 'pending') need(entry.canonicalSlug === options.slug, 'Pending claim slug conflict');
    else if (directory) need(options.allowExisting === true && directory.slug === options.slug && (!entry || entry.state === 'materialised'), 'Existing allocation conflict');
    else need(!entry && chosen === snapshot.highest + 1, 'Retired allocation or number jump');
  }
  need(chosen <= 999, 'Allocation exhausted at 999');
  // A pending or materialised identity cannot migrate to the next free number.
  const owner = snapshot.ledger?.allocations.find((entry) => entry.canonicalSlug === options.slug);
  need(!owner || Number(owner.number) === chosen, 'Canonical slug belongs to another allocation; use its explicit exact claim or supported reuse');
  return String(chosen).padStart(3, '0');
}

/** CLI adapter: 0 valid, 1 invalid snapshot/request, 2 usage/I/O/runtime failure. */
function main(args) {
  try {
    const [operation, ...rest] = args;
    if (!['validate', 'allocate'].includes(operation)) throw new Error('Expected validate or allocate');
    const options = {};
    const names = { '--repo-root': 'repoRoot', '--specs-directory': 'specsDirectory', '--baseline': 'baseline', '--slug': 'slug', '--number': 'number' };
    for (let i = 0; i < rest.length; i++) {
      const flag = rest[i];
      const key = Object.hasOwn(names, flag) ? names[flag] : (flag === '--allow-existing' ? 'allowExisting' : null);
      if (!key || Object.hasOwn(options, key)) throw new Error(`Unknown or repeated option: ${flag}`);
      if (key === 'allowExisting') options[key] = true;
      else {
        if (!rest[i + 1] || rest[i + 1].startsWith('--')) throw new Error(`Missing value: ${flag}`);
        options[key] = rest[++i];
      }
    }
    if (!options.repoRoot || !options.specsDirectory) throw new Error('Explicit --repo-root and --specs-directory are required');
    if (operation === 'validate' && (options.slug || options.number || options.allowExisting)) throw new Error('Allocation options used with validate');
    if (operation === 'allocate') {
      if (!options.slug) throw new Error('--slug is required for allocate');
      console.log(allocate(options));
    } else {
      const result = validate(options);
      if (result.ledger) console.log(`Allocation consistency verified: ${result.directories.length} real directories; ${result.ledger.allocations.length} allocations; ${result.preservation}`);
      else console.log(`Sequential numbering verified: 001 to ${String(result.highest).padStart(3, '0')} with no gaps; ${result.preservation}`);
    }
    return 0;
  } catch (error) {
    console.error(`spec-allocations: ❌ ${error.message}`);
    return error instanceof AllocationError ? 1 : 2;
  }
}

module.exports = { AllocationError, parseStrictJson, validateLedger, compareBaseline, validate, allocate, main };
if (require.main === module) process.exitCode = main(process.argv.slice(2));

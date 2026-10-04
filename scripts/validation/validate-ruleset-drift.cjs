#!/usr/bin/env node
/**
 * Fails when a deployed branch ruleset has drifted from the version-controlled
 * declaration in .github/rulesets/.
 *
 * Why this exists: the ruleset JSON files are declarations, and applying them
 * is a manual step (see .github/rulesets/README.md). Nothing verified that the
 * live ruleset still matched the file, so a required status check could be
 * dropped from enforcement without anyone noticing. A check that stops being
 * required is invisible in the file and only shows up as a PR merging that it
 * should not have.
 *
 * Scope, deliberately narrow:
 *
 * - A declaration with no live ruleset is drift, unless its name is listed in
 *   NOT_YET_APPLIED. main.ruleset.json is documented as "not yet applied (needs
 *   explicit go-ahead)", so it is reported as pending; any other missing
 *   ruleset, such as a deleted develop ruleset, fails the check.
 * - Drift only. This never applies, creates or mutates a ruleset. Pushing
 *   ruleset changes needs a token with ruleset-write, and letting a pull
 *   request rewrite branch protection is a privilege escalation. Detection and
 *   application stay separate steps.
 * - Comparison is on the fields that change enforcement: the target, the full
 *   ref include and exclude lists, enforcement, bypass actors with their
 *   bypass mode, the rule types present, every declared rule parameter
 *   (approval count, code-owner review, thread resolution, strict status
 *   checks), and the required status-check contexts. Only declared keys are
 *   compared, so a default the API adds does not read as drift.
 *
 * Usage:
 *   node scripts/validation/validate-ruleset-drift.cjs            # report
 *   node scripts/validation/validate-ruleset-drift.cjs --json     # machine
 *
 * Requires a token with read access to repository rulesets (GITHUB_TOKEN in
 * CI). Exits 0 when every deployed declaration is in sync and the only items
 * missing live are the intentionally pending ones (NOT_YET_APPLIED rulesets and
 * NOT_YET_REQUIRED_CONTEXTS checks), 1 on drift, including a declared ruleset that
 * is missing live and not listed as pending, and 2 when the API cannot be read.
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const RULESETS_DIR = path.join(ROOT, '.github/rulesets');

const jsonOutput = process.argv.includes('--json');

function readDeclarations() {
  if (!fs.existsSync(RULESETS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(RULESETS_DIR)
    .filter((name) => name.endsWith('.ruleset.json'))
    .map((name) => {
      const file = path.join(RULESETS_DIR, name);
      return {
        file: path.relative(ROOT, file),
        declaration: JSON.parse(fs.readFileSync(file, 'utf8')),
      };
    });
}

function apiBase() {
  const explicit = process.env.RULESETS_API_BASE;
  if (explicit) return explicit.replace(/\/$/, '');
  return 'https://api.github.com';
}

function repoSlug() {
  const explicit = process.env.GITHUB_REPOSITORY;
  if (explicit) return explicit;
  const remote = process.env.GITHUB_REPOSITORY_FALLBACK;
  return remote || null;
}

function apiHeaders() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'lightspeed-ruleset-drift-check',
  };
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function fetchRulesetList(slug) {
  const response = await fetch(`${apiBase()}/repos/${slug}/rulesets?per_page=100`, {
    headers: apiHeaders(),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `GET /repos/${slug}/rulesets failed: ${response.status} ${detail.slice(0, 200)}`
    );
  }

  return response.json();
}

/**
 * Fetch one ruleset in full.
 *
 * The list endpoint returns each ruleset without its `rules` or `conditions`;
 * those are only populated by the per-ruleset endpoint. Comparing against the
 * list shape reads every live field as empty (target ref null, rules [], no
 * required checks) and reports total drift, so the full definition has to be
 * fetched by id before anything is compared.
 */
async function fetchRulesetById(slug, id) {
  const response = await fetch(`${apiBase()}/repos/${slug}/rulesets/${id}`, {
    headers: apiHeaders(),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `GET /repos/${slug}/rulesets/${id} failed: ${response.status} ${detail.slice(0, 200)}`
    );
  }

  return response.json();
}

/**
 * Declarations that are intentionally not applied yet. A missing live ruleset
 * for anything else is drift: if the protection on `develop` were deleted, the
 * check has to fail rather than report it as pending. Remove a name from this
 * list when its ruleset is applied.
 */
const NOT_YET_APPLIED = new Set(['main-branch-ruleset']);

/**
 * Rulesets that must have a declaration in `.github/rulesets/`. The comparison is
 * driven by the declaration files that exist, so deleting one would otherwise leave
 * its live ruleset unexamined and unversioned with no signal. A missing declaration
 * for any of these names is drift.
 */
const EXPECTED_DECLARATIONS = new Set(['develop-branch-ruleset', 'main-branch-ruleset']);

/**
 * Status-check contexts the declaration requires but that cannot be required live
 * yet, each mapped to the workflow file that reports it. Requiring a context nothing
 * reports would block every pull request, so while that workflow is not on the
 * `develop` branch a context that is absent live is reported as pending, not drift.
 *
 * The state comes from `develop`, not from the live ruleset and not from the
 * checkout (a stacked pull request carries workflows `develop` does not have), so it
 * cannot revert to pending after activation: once the workflow is on `develop`, an
 * absent context is drift, which also forces the ruleset to be applied after the
 * workflow lands, and a later removal of the check live is drift too. No cleanup of
 * this list is needed for that; delete the entry whenever convenient.
 * `Lint (JS/YAML/package.json)` and `Typecheck` come from lint.yml (#3775, #3780).
 */
const NOT_YET_REQUIRED_CONTEXTS = new Map([
  ['Lint (JS/YAML/package.json)', '.github/workflows/lint.yml'],
  ['Typecheck', '.github/workflows/lint.yml'],
]);

/**
 * Live rulesets this repository does not manage, so they are not drift when they have
 * no declaration. Platform-managed: created and maintained by GitHub, not by a file here.
 */
const UNMANAGED_LIVE_RULESETS = new Set(['Code Quality Copilot review for default branch']);

/**
 * Whether a file exists on the `develop` branch of the repository.
 * @param {string} slug - owner/repo
 * @param {string} file - Repository-relative path
 * @returns {Promise<boolean>}
 */
async function existsOnDevelop(slug, file) {
  const response = await fetch(`${apiBase()}/repos/${slug}/contents/${file}?ref=develop`, {
    headers: apiHeaders(),
  });
  if (response.status === 404) return false;
  if (!response.ok) {
    throw new Error(`GET contents/${file}@develop failed: ${response.status}`);
  }
  return true;
}

/** The `include` or `exclude` ref patterns of a ruleset, sorted for comparison. */
function refPatterns(ruleset, key) {
  const patterns = ruleset?.conditions?.ref_name?.[key];
  return Array.isArray(patterns) ? [...patterns].sort() : [];
}

/**
 * Differences between what a declaration asks for and what is live. Only the
 * declared keys are compared, so a default the API adds (an `integration_id`, an
 * allowed-merge-methods list) is not drift, but any declared value that changed
 * is, however deep it sits. Arrays must match in length and element by element.
 * @param {unknown} declared - The declared value
 * @param {unknown} live - The live value
 * @param {string} where - Dotted path, for the report
 * @returns {string[]}
 */
function subsetDifferences(declared, live, where) {
  if (Array.isArray(declared)) {
    if (!Array.isArray(live) || live.length !== declared.length) {
      return [`${where}: declared ${JSON.stringify(declared)} vs live ${JSON.stringify(live)}`];
    }
    return declared.flatMap((item, index) =>
      subsetDifferences(item, live[index], `${where}[${index}]`)
    );
  }
  if (declared !== null && typeof declared === 'object') {
    if (live === null || typeof live !== 'object') {
      return [`${where}: declared ${JSON.stringify(declared)} vs live ${JSON.stringify(live)}`];
    }
    return Object.keys(declared).flatMap((key) =>
      subsetDifferences(declared[key], live[key], `${where}.${key}`)
    );
  }
  return declared === live ? [] : [`${where}: declared ${declared} vs live ${live}`];
}

function ruleTypes(declaration) {
  return (declaration.rules || []).map((rule) => rule.type).sort();
}

function liveRuleTypes(live) {
  return (live.rules || []).map((rule) => rule.type).sort();
}

function requiredContexts(declaration) {
  const rule = (declaration.rules || []).find((entry) => entry.type === 'required_status_checks');
  if (!rule) return [];
  return (rule.parameters?.required_status_checks || []).map((entry) => entry.context).sort();
}

function liveRequiredContexts(live) {
  const rule = (live.rules || []).find((entry) => entry.type === 'required_status_checks');
  if (!rule) return [];
  return (rule.parameters?.required_status_checks || []).map((entry) => entry.context).sort();
}

/**
 * Bypass actor identity, normalised to a comparable "type:id:mode" string. The
 * mode is part of the identity: the same actor moving from pull-request-only
 * bypass to `always` or `exempt` is a different level of protection.
 */
function bypassActors(ruleset) {
  return (ruleset.bypass_actors || [])
    .map(
      (actor) =>
        `${actor.actor_type}:${actor.actor_id ?? actor.actor_login ?? ''}:${actor.bypass_mode ?? ''}`
    )
    .sort();
}

/** Parameter differences for every declared rule, apart from the status-check list. */
function parameterDifferences(declaration, live) {
  const differences = [];
  for (const rule of declaration.rules || []) {
    const liveRule = (live.rules || []).find((entry) => entry.type === rule.type);
    // A rule missing live is already reported through the rule types.
    if (!liveRule || !rule.parameters) continue;

    // The status-check list is reported by context, in its own line, below.
    const { required_status_checks: _contexts, ...declaredParameters } = rule.parameters;
    differences.push(
      ...subsetDifferences(declaredParameters, liveRule.parameters || {}, `${rule.type}`)
    );
  }
  return differences;
}

function compare(declaration, live, absentOnDevelop) {
  const differences = [];

  if ((declaration.target || null) !== (live.target || null)) {
    differences.push(`target: declared "${declaration.target}" vs live "${live.target}"`);
  }

  for (const key of ['include', 'exclude']) {
    const declaredRefs = refPatterns(declaration, key);
    const liveRefs = refPatterns(live, key);
    if (declaredRefs.join('|') !== liveRefs.join('|')) {
      differences.push(
        `ref ${key}: declared [${declaredRefs.join(', ') || 'none'}] vs live [${liveRefs.join(', ') || 'none'}]`
      );
    }
  }

  differences.push(...parameterDifferences(declaration, live));

  if ((declaration.enforcement || null) !== (live.enforcement || null)) {
    differences.push(
      `enforcement: declared "${declaration.enforcement}" vs live "${live.enforcement}"`
    );
  }

  const declaredTypes = ruleTypes(declaration);
  const actualTypes = liveRuleTypes(live);
  if (declaredTypes.join(',') !== actualTypes.join(',')) {
    differences.push(
      `rule types: declared [${declaredTypes.join(', ')}] vs live [${actualTypes.join(', ')}]`
    );
  }

  const allDeclaredContexts = requiredContexts(declaration);
  const actualContexts = liveRequiredContexts(live);
  // A context that is declared but cannot be required yet is pending, not drift,
  // while it is absent live. Once it is applied live it is compared like any other.
  const pendingContexts = allDeclaredContexts.filter(
    (context) =>
      absentOnDevelop.has(NOT_YET_REQUIRED_CONTEXTS.get(context)) &&
      !actualContexts.includes(context)
  );
  const declaredContexts = allDeclaredContexts.filter(
    (context) => !pendingContexts.includes(context)
  );
  if (declaredContexts.join('|') !== actualContexts.join('|')) {
    differences.push(
      `required status checks:\n      declared: ${declaredContexts.join(', ') || '(none)'}\n      live:     ${actualContexts.join(', ') || '(none)'}`
    );
  }

  // The API returns `bypass_actors` only to a token with admin access; any other
  // token (the workflow's GITHUB_TOKEN) gets a ruleset with the key omitted. An
  // omitted key is "not visible", not "no actors", so it is not compared: reading it
  // as an empty list would report drift against every declared actor in CI. An empty
  // list from an admin token is a real empty list and is compared.
  const notes = [];
  if (Array.isArray(live.bypass_actors)) {
    const declaredBypass = bypassActors(declaration);
    const liveBypass = bypassActors(live);
    if (declaredBypass.join('|') !== liveBypass.join('|')) {
      differences.push(
        `bypass actors: declared [${declaredBypass.join(', ') || 'none'}] vs live [${liveBypass.join(', ') || 'none'}]`
      );
    }
  } else {
    notes.push('bypass actors are not visible to this token, so they were not compared');
  }

  return { differences, pendingContexts, notes };
}

async function main() {
  const slug = repoSlug();

  if (!slug) {
    console.error('GITHUB_REPOSITORY is not set; cannot compare against live rulesets.');
    process.exit(2);
  }

  // No early exit when there are no declarations: that is the state in which every
  // expected declaration is missing, which is drift, not "nothing to compare".
  const declarations = readDeclarations();

  const listed = await fetchRulesetList(slug);

  // The list endpoint omits rules/conditions, so hydrate each ruleset by id
  // before comparing anything.
  const liveByName = new Map();
  for (const summary of listed) {
    if (!summary?.id) continue;
    const full = await fetchRulesetById(slug, summary.id);
    liveByName.set(full.name, full);
  }

  // Which pending-context workflows are not on `develop` yet.
  const absentOnDevelop = new Set();
  for (const workflow of new Set(NOT_YET_REQUIRED_CONTEXTS.values())) {
    if (!(await existsOnDevelop(slug, workflow))) absentOnDevelop.add(workflow);
  }

  const results = [];

  // A ruleset that must be versioned has lost its declaration: the loop below never
  // sees it, so its live ruleset would go unexamined.
  const declaredNames = new Set(declarations.map(({ declaration }) => declaration.name));
  for (const name of EXPECTED_DECLARATIONS) {
    if (!declaredNames.has(name)) {
      results.push({
        file: '(missing declaration)',
        name,
        status: 'drift',
        differences: [
          `no declaration in .github/rulesets/ for the expected ruleset "${name}", so ${liveByName.has(name) ? 'its live ruleset is unversioned' : 'nothing describes it'}`,
        ],
      });
    }
  }

  // A live ruleset with no declaration is unversioned: nothing would notice it change.
  for (const name of liveByName.keys()) {
    if (
      !declaredNames.has(name) &&
      !EXPECTED_DECLARATIONS.has(name) &&
      !UNMANAGED_LIVE_RULESETS.has(name)
    ) {
      results.push({
        file: '(no declaration)',
        name,
        status: 'drift',
        differences: [`live ruleset "${name}" has no declaration in .github/rulesets/`],
      });
    }
  }

  for (const { file, declaration } of declarations) {
    const live = liveByName.get(declaration.name);

    if (!live) {
      if (NOT_YET_APPLIED.has(declaration.name)) {
        results.push({
          file,
          name: declaration.name,
          status: 'not-deployed',
          detail: 'No live ruleset with this name; declared as not yet applied, not drift.',
        });
      } else {
        results.push({
          file,
          name: declaration.name,
          status: 'drift',
          differences: [
            'no live ruleset with this name: it was never applied or it has been deleted, and it is not listed as not yet applied',
          ],
        });
      }
      continue;
    }

    const { differences, pendingContexts, notes } = compare(declaration, live, absentOnDevelop);
    results.push({
      file,
      name: declaration.name,
      status: differences.length === 0 ? 'in-sync' : 'drift',
      differences,
      pendingContexts,
      notes,
    });
  }

  if (jsonOutput) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log(
      `Comparing ${declarations.length} declaration(s) against live rulesets in ${slug}\n`
    );
    for (const result of results) {
      if (result.status === 'in-sync') {
        console.log(`  OK        ${result.file} (${result.name}) matches live`);
        for (const context of result.pendingContexts || []) {
          console.log(
            `  PENDING   required check "${context}" is declared but not yet required live`
          );
        }
        for (const note of result.notes || []) {
          console.log(`  NOTE      ${result.name}: ${note}`);
        }
      } else if (result.status === 'not-deployed') {
        console.log(`  PENDING   ${result.file} (${result.name}) — ${result.detail}`);
      } else {
        console.log(`  DRIFT     ${result.file} (${result.name})`);
        for (const difference of result.differences) {
          console.log(`      - ${difference}`);
        }
        for (const context of result.pendingContexts || []) {
          console.log(
            `      (pending, not drift: "${context}" is declared but not yet required live)`
          );
        }
      }
    }
    console.log('');
  }

  const drifted = results.filter((result) => result.status === 'drift');
  process.exit(drifted.length === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(2);
});

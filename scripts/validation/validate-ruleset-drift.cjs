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
 * - Only rulesets that are actually deployed are compared. A declaration that
 *   has never been applied is not drift, it is pending. main.ruleset.json is
 *   documented as "not yet applied (needs explicit go-ahead)", so it is
 *   skipped rather than reported as a failure.
 * - Drift only. This never applies, creates or mutates a ruleset. Pushing
 *   ruleset changes needs a token with ruleset-write, and letting a pull
 *   request rewrite branch protection is a privilege escalation. Detection and
 *   application stay separate steps.
 * - Comparison is on the fields that change enforcement: target ref,
 *   enforcement, bypass actors, the rule types present, and the required
 *   status-check contexts. Fields the API fills with defaults are normalised
 *   rather than compared literally, so an omitted optional key does not read
 *   as drift.
 *
 * Usage:
 *   node scripts/validation/validate-ruleset-drift.cjs            # report
 *   node scripts/validation/validate-ruleset-drift.cjs --json     # machine
 *
 * Requires a token with read access to repository rulesets (GITHUB_TOKEN in
 * CI). Exits 0 when in sync or when nothing is deployed, 1 on drift.
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

/** Ruleset name from the target ref, e.g. refs/heads/develop -> develop. */
function targetRefName(declaration) {
  const include = declaration?.conditions?.ref_name?.include;
  if (!Array.isArray(include) || include.length === 0) return null;
  return include[0].replace(/^refs\/heads\//, '');
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

/** Bypass actor identity, normalised to a comparable "type:id" string. */
function bypassActors(ruleset) {
  return (ruleset.bypass_actors || [])
    .map((actor) => `${actor.actor_type}:${actor.actor_id ?? actor.actor_login ?? ''}`)
    .sort();
}

function compare(declaration, live) {
  const differences = [];

  const declaredRef = targetRefName(declaration);
  const liveRef = targetRefName(live);
  if (declaredRef !== liveRef) {
    differences.push(`target ref: declared "${declaredRef}" vs live "${liveRef}"`);
  }

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

  const declaredContexts = requiredContexts(declaration);
  const actualContexts = liveRequiredContexts(live);
  if (declaredContexts.join('|') !== actualContexts.join('|')) {
    differences.push(
      `required status checks:\n      declared: ${declaredContexts.join(', ') || '(none)'}\n      live:     ${actualContexts.join(', ') || '(none)'}`
    );
  }

  const declaredBypass = bypassActors(declaration);
  const liveBypass = bypassActors(live);
  if (declaredBypass.join('|') !== liveBypass.join('|')) {
    differences.push(
      `bypass actors: declared [${declaredBypass.join(', ') || 'none'}] vs live [${liveBypass.join(', ') || 'none'}]`
    );
  }

  return differences;
}

async function main() {
  const slug = repoSlug();

  if (!slug) {
    console.error('GITHUB_REPOSITORY is not set; cannot compare against live rulesets.');
    process.exit(2);
  }

  const declarations = readDeclarations();
  if (declarations.length === 0) {
    console.log('No .ruleset.json declarations found; nothing to compare.');
    process.exit(0);
  }

  const listed = await fetchRulesetList(slug);

  // The list endpoint omits rules/conditions, so hydrate each ruleset by id
  // before comparing anything.
  const liveByName = new Map();
  for (const summary of listed) {
    if (!summary?.id) continue;
    const full = await fetchRulesetById(slug, summary.id);
    liveByName.set(full.name, full);
  }

  const results = [];

  for (const { file, declaration } of declarations) {
    const live = liveByName.get(declaration.name);

    if (!live) {
      results.push({
        file,
        name: declaration.name,
        status: 'not-deployed',
        detail: 'No live ruleset with this name; treated as pending, not drift.',
      });
      continue;
    }

    const differences = compare(declaration, live);
    results.push({
      file,
      name: declaration.name,
      status: differences.length === 0 ? 'in-sync' : 'drift',
      differences,
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
      } else if (result.status === 'not-deployed') {
        console.log(`  PENDING   ${result.file} (${result.name}) — ${result.detail}`);
      } else {
        console.log(`  DRIFT     ${result.file} (${result.name})`);
        for (const difference of result.differences) {
          console.log(`      - ${difference}`);
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

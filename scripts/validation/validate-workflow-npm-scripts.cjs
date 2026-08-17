#!/usr/bin/env node
/* eslint-disable no-console */
// Fails when a changed workflow file's `run: npm run <script>` step invokes an
// npm script that isn't declared in package.json.
//
// This is the recurring failure mode this repository has hit repeatedly:
// validate:footers, validate:skill-manifests and validate:agent-hooks were
// all referenced from checks.yml with no matching npm script, so each step
// failed every single run with "npm error Missing script" until someone
// noticed and removed it. This check catches the mistake in the PR that
// introduces it instead of after it's merged and silently failing forever.
//
// Scoped to workflow files changed in the current diff, matching the
// changed-files-only pattern used by lint:md:changed — a full-repo sweep
// would immediately fail on any pre-existing gap unrelated to the PR at hand
// (see https://github.com/lightspeedwp/.github/issues/1962 for one such gap
// already tracked). Steps with a working-directory other than the repo root
// are skipped: resolving a nested package.json correctly is out of scope for
// this check, and skipping avoids false positives rather than risking them.

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { changedFiles } = require("./lib/changed-files.cjs");

const ROOT = process.cwd();
const NPM_RUN_RE = /\bnpm\s+run\s+([\w:.-]+)/g;

function isRepoRootWorkingDir(dir) {
  if (!dir) return true;
  const normalized = dir.replace(/\/+$/, "");
  return normalized === "." || normalized === "";
}

function scanRunText(text, scripts, missing, context) {
  let match;
  NPM_RUN_RE.lastIndex = 0;
  while ((match = NPM_RUN_RE.exec(text))) {
    const name = match[1];
    if (!Object.prototype.hasOwnProperty.call(scripts, name)) {
      missing.push(`${context}: npm run ${name}`);
    }
  }
}

function checkWorkflow(filePath, scripts, missing) {
  let doc;
  try {
    doc = yaml.load(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    console.warn(`Skipping ${filePath}: could not parse YAML (${err.message}).`);
    return;
  }
  if (!doc || typeof doc !== "object" || !doc.jobs) return;

  const topDefaultDir = doc.defaults?.run?.["working-directory"];

  for (const [jobName, job] of Object.entries(doc.jobs)) {
    if (!job || !Array.isArray(job.steps)) continue;
    const jobDefaultDir = job.defaults?.run?.["working-directory"] ?? topDefaultDir;

    job.steps.forEach((step, i) => {
      if (!step || typeof step.run !== "string") return;
      const dir = step["working-directory"] ?? jobDefaultDir;
      if (!isRepoRootWorkingDir(dir)) return;
      const label = step.name || `step ${i + 1}`;
      scanRunText(step.run, scripts, missing, `${filePath} :: ${jobName} :: ${label}`);
    });
  }
}

const changed = changedFiles((f) => /^\.github\/workflows\/.*\.ya?ml$/.test(f));

if (changed === null) {
  const message = "Could not resolve a base commit to diff against.";
  if (process.env.CI) {
    console.error(`${message} Set BASE_SHA and HEAD_SHA, or check out with fetch-depth: 0.`);
    process.exit(1);
  }
  console.log(`${message} Skipping — nothing to check without a diff.`);
  process.exit(0);
}

if (changed.length === 0) {
  console.log("No workflow files changed — nothing to check.");
  process.exit(0);
}

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
const scripts = pkg.scripts || {};

const missing = [];
for (const file of changed) {
  if (fs.existsSync(file)) checkWorkflow(file, scripts, missing);
}

if (missing.length > 0) {
  console.error(`Found ${missing.length} npm script reference(s) with no matching package.json script:`);
  for (const m of missing) console.error(`  - ${m}`);
  process.exit(1);
}

console.log(`Checked ${changed.length} changed workflow file(s) — all referenced npm scripts exist.`);

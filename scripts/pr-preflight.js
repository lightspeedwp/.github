#!/usr/bin/env node

/**
 * Pull request preflight.
 *
 * Run this before opening a pull request. It applies the same rules as the
 * required checks that fail most often on opening:
 *
 * 1. Route the branch name to its PR template, as the routing check does.
 * 2. Compare a body file with that template's sections.
 * 3. Predict the changelog gate from the diff, labels and intended PR author.
 * 4. When the diff touches `CHANGELOG.md`, run the changelog engine on it
 *    (the "Changelog Validation" check).
 * 5. Run changed Jest files under the read tracer and check them against the
 *    prose-dependent test list (the "Jest (head)" check).
 * 6. When the diff touches `.github/specs/`, run the specification audit and
 *    the catalogue check; lint any changed Markdown files.
 *
 * Usage:
 *   node scripts/pr-preflight.js --branch <name> --skeleton
 *   node scripts/pr-preflight.js --branch <name> [--body-file <file>]
 *     [--labels a,b] [--base origin/develop] [--author <login>]
 *
 * Exit code 0 when every applicable check passes, 1 otherwise.
 */

import fs from 'node:fs';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import {
  bodyFailureMessage,
  checkPrBody,
  isTestFile,
  predictChangelogGate,
  renderSkeleton,
} from './pr-preflight-rules.js';

function parseArgs(argv) {
  const args = { base: 'origin/develop', labels: [], author: '' };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    if (flag === '--skeleton') args.skeleton = true;
    else if (flag === '--branch') args.branch = argv[++i];
    else if (flag === '--body-file' || flag === '--author') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        throw new Error(
          `${flag} requires ${flag === '--body-file' ? 'a file path' : 'a PR author login'}.`
        );
      }
      if (flag === '--body-file') args.bodyFile = value;
      else args.author = value;
      i += 1;
    } else if (flag === '--base') args.base = argv[++i];
    else if (flag === '--labels') args.labels = (argv[++i] || '').split(',').filter(Boolean);
    else throw new Error(`Unknown argument: ${flag}`);
  }
  return args;
}

function run(file, fileArgs, options = {}) {
  return execFileSync(file, fileArgs, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  });
}

/** The end of a failed command's output: its stdout first, then its stderr. */
function outputTail(error) {
  const lines = (text) =>
    String(text || '')
      .split('\n')
      .filter(Boolean);
  const out = lines(error.stdout).slice(-12);
  const err = lines(error.stderr).slice(-25);
  return [...out, ...err].join('\n') || error.message;
}

/**
 * Failing-entry count from the changelog engine, as CI counts it: the engine's
 * own exit code is ignored and `summary.failed` is read from its JSON report.
 * The report goes to a file, as in CI: the engine exits before a piped stdout
 * is flushed, which truncates a report this large. Returns null when the report
 * is missing or malformed (CI fails closed). The engine takes about a minute.
 */
function engineFailures(engineDir, file) {
  const reportDir = fs.mkdtempSync(path.join(os.tmpdir(), 'changelog-report-'));
  const report = path.join(reportDir, 'report.json');
  const out = fs.openSync(report, 'w');
  try {
    run(
      'node',
      [
        'bin/validate.js',
        '--changelog-path',
        file,
        '--trigger',
        'pr_submission',
        '--output',
        'json',
      ],
      { cwd: engineDir, stdio: ['ignore', out, 'ignore'] }
    );
  } catch {
    // A non-zero exit still leaves a report; CI ignores the exit code.
  } finally {
    fs.closeSync(out);
  }
  try {
    const failedCount = JSON.parse(fs.readFileSync(report, 'utf8')).summary?.failed;
    return Number.isInteger(failedCount) && failedCount >= 0 ? failedCount : null;
  } catch {
    return null;
  } finally {
    fs.rmSync(reportDir, { recursive: true, force: true });
  }
}

/** Whether a path matches a workflow `paths` glob (`*` within a segment, `**` across). */
function matchesGlob(file, glob) {
  const source = glob
    .split('**')
    .map((part) =>
      part
        .split('*')
        .map((piece) => piece.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
        .join('[^/]*')
    )
    .join('.*');
  return new RegExp(`^${source}$`).test(file);
}

function main() {
  // The router and the audit read repository-relative paths, so run from the
  // repository root wherever the command was started. A body file given as a
  // relative path is resolved before the move.
  const args = parseArgs(process.argv.slice(2));
  if (args.bodyFile) args.bodyFile = path.resolve(args.bodyFile);
  process.chdir(fileURLToPath(new URL('..', import.meta.url)));
  if (!args.branch) {
    console.error('Branch name required: --branch <name>');
    return 1;
  }
  // Resolve the way the router will (hoisted and shared installs count).
  const requireFromRoot = createRequire(path.resolve('package.json'));
  try {
    requireFromRoot.resolve('js-yaml');
  } catch {
    console.error(
      'Dependencies are missing: run `npm ci` first (the template router needs js-yaml).'
    );
    return 1;
  }

  const routing = JSON.parse(run('node', ['scripts/pr-template-router.js', args.branch]));
  const templateFile = `.github/PULL_REQUEST_TEMPLATE/${routing.template}.md`;
  if (!fs.existsSync(templateFile)) {
    // The workflow skips the body check in this case, with a warning.
    console.error(`skip PR body: template ${templateFile} does not exist`);
    args.skeleton = false;
    args.bodyFile = undefined;
  }
  const template = fs.existsSync(templateFile) ? fs.readFileSync(templateFile, 'utf8') : '';
  console.error(`branch type ${routing.branch_type}, template ${routing.template}.md`);

  if (args.skeleton) {
    process.stdout.write(`\n${renderSkeleton(template)}`);
    return 0;
  }

  let failed = false;
  const fail = (message) => {
    failed = true;
    console.error(`FAIL ${message}`);
  };

  if (args.bodyFile) {
    const result = checkPrBody({ template, body: fs.readFileSync(args.bodyFile, 'utf8') });
    const message = bodyFailureMessage({ templateName: routing.template, result });
    if (message) fail(message);
    else if (result.todo.length > 0) {
      fail(`PR body still has TODO markers in: ${result.todo.map((h) => `"## ${h}"`).join(', ')}.`);
    } else console.log('ok   PR body has every template section with content');
  } else {
    console.log('skip PR body (no --body-file)');
  }

  // Compare the final working tree with the common ancestor so edits that
  // restore a tracked file to its original state do not count as PR changes.
  const mergeBase = run('git', ['merge-base', args.base, 'HEAD']).trim();
  const tracked = run('git', ['diff', '--name-only', '-z', mergeBase, '--']).split('\0');
  const untracked = run('git', ['ls-files', '--others', '--exclude-standard', '-z']).split('\0');
  const changed = [...new Set([...tracked, ...untracked].filter(Boolean))];
  const labels = [
    ...new Set([...routing.default_labels.filter((l) => l.startsWith('type:')), ...args.labels]),
  ];
  const gate = predictChangelogGate({ changed, labels, author: args.author });
  if (gate.outcome === 'fail') fail(`changelog gate: ${gate.reason}`);
  else console.log(`ok   changelog gate: ${gate.reason}`);

  // The same steps the required and merge-blocking checks run, in the same
  // way. Each is [name, command, arguments, options].
  const specChecks = [];

  // Changelog: the steps CI runs when CHANGELOG.md is in the diff. The engine
  // fails the check only for entries the PR adds (head failures minus base).
  if (changed.includes('CHANGELOG.md')) {
    specChecks.push(
      [
        'changelog schema (utils)',
        'node',
        ['scripts/agents/includes/changelogUtils.cjs', '--validate', 'CHANGELOG.md'],
      ],
      ['changelog schema', 'node', ['scripts/validation/validate-changelog.cjs', 'CHANGELOG.md']]
    );
    const engine = '.github/validation/changelog';
    if (fs.existsSync(`${engine}/node_modules`)) {
      const headFailed = engineFailures(engine, path.resolve('CHANGELOG.md'));
      const baseFile = path.join(os.tmpdir(), `base-changelog-${process.pid}.md`);
      let baseFailed = 0;
      try {
        fs.writeFileSync(baseFile, run('git', ['show', `${mergeBase}:CHANGELOG.md`]));
        baseFailed = engineFailures(engine, baseFile) ?? 0;
      } catch {
        // No base changelog to compare: CI then gates on total failures.
      } finally {
        fs.rmSync(baseFile, { force: true });
      }
      if (headFailed === null) {
        fail('changelog engine report missing or malformed (CI fails closed on this).');
      } else if (headFailed - baseFailed > 0) {
        fail(
          `changelog engine: ${headFailed - baseFailed} new failing entr${headFailed - baseFailed === 1 ? 'y' : 'ies'} ` +
            `(${headFailed} failing, ${baseFailed} on base). Run the engine for details: ` +
            `cd ${engine} && node bin/validate.js --changelog-path ../../../CHANGELOG.md`
        );
      } else {
        console.log(
          `ok   changelog entries (engine): ${headFailed} failing, ${baseFailed} on base`
        );
      }
    } else {
      fail(`changelog engine dependencies are missing: run \`npm ci\` in ${engine} first.`);
    }
  }

  // Test files that read Markdown or text must be listed in
  // tests/jest-prose-tests.json. Trace just the changed test files and check
  // the trace against the list, as the Jest job does for the whole suite.
  const changedTests = changed.filter((f) => isTestFile(f) && fs.existsSync(f));
  if (changedTests.length > 0 && fs.existsSync('scripts/workflows/jest-read-tracer.cjs')) {
    const traceDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jest-reads-'));
    const trace = path.join(traceDir, 'reads.tsv');
    try {
      run(
        'node_modules/.bin/jest',
        [
          '--config',
          '.jest.config.cjs',
          '--coverage=false',
          '--passWithNoTests',
          '--runTestsByPath',
          ...changedTests,
        ],
        {
          env: {
            ...process.env,
            JEST_READ_TRACE_FILE: trace,
            JEST_READ_TRACE_ROOT: process.cwd(),
            NODE_OPTIONS: [
              process.env.NODE_OPTIONS,
              `--require=${path.resolve('scripts/workflows/jest-read-tracer.cjs')}`,
            ]
              .filter(Boolean)
              .join(' '),
          },
        }
      );
      // Only T and P lines name a test that read prose; F, S and D lines are
      // ordinary reads and make the checker report "no test file".
      const namesATest =
        fs.existsSync(trace) &&
        fs
          .readFileSync(trace, 'utf8')
          .split('\n')
          .some((line) => /^[TP]\t/.test(line));
      if (namesATest) {
        run('node', ['scripts/workflows/jest-prose-tests.cjs', '--check', trace]);
      }
      console.log(
        namesATest
          ? 'ok   prose-dependent test list'
          : 'ok   changed tests read no Markdown or text files'
      );
    } catch (error) {
      fail(`changed tests or the prose-dependent test list failed:\n${outputTail(error)}`);
    } finally {
      fs.rmSync(traceDir, { recursive: true, force: true });
    }
  }

  // Specification checks run when the workflow's own `paths` filter matches,
  // read from the workflow so the trigger list cannot drift.
  const specWorkflowFile = '.github/workflows/validate-specifications.yml';
  const specPaths = fs.existsSync(specWorkflowFile)
    ? (requireFromRoot('js-yaml').load(fs.readFileSync(specWorkflowFile, 'utf8')).on?.pull_request
        ?.paths ?? [])
    : [];
  if (changed.some((f) => specPaths.some((glob) => matchesGlob(f, glob)))) {
    specChecks.push(
      ['specification audit', 'bash', ['.specify/scripts/bash/audit-specs.sh']],
      ['catalog structure', 'bash', ['.specify/scripts/bash/validate-catalog.sh']]
    );

    // The audit script's own Bats suite, when the script or its tests changed.
    if (
      changed.some((f) => f.startsWith('.specify/scripts/bash/') || f.startsWith('tests/bash/'))
    ) {
      let hasBats = true;
      try {
        run('bats', ['--version']);
      } catch {
        hasBats = false;
      }
      if (hasBats) specChecks.push(['audit script tests (bats)', 'bats', ['tests/bash']]);
      else fail('bats is not installed, and the audit script or its tests changed.');
    }

    // The workflow's secrets-pattern scan, on the changed specification files.
    const secretPattern = /(password|api_key|token)\s*[=:]\s*['"]?[^'" \n]/;
    const secretHits = changed
      .filter((f) => f.startsWith('.github/specs/') && f.endsWith('.md') && fs.existsSync(f))
      .flatMap((f) =>
        fs
          .readFileSync(f, 'utf8')
          .split('\n')
          .map((line, index) => (secretPattern.test(line) ? `${f}:${index + 1}` : null))
          .filter(Boolean)
      );
    if (secretHits.length > 0) {
      fail(
        `possible hardcoded secrets in specifications (the CI scan fails on these):\n${secretHits.join('\n')}`
      );
    } else {
      console.log('ok   specification secrets scan');
    }

    const changedMarkdown = changed.filter((f) => /\.mdx?$/.test(f) && fs.existsSync(f));
    if (changedMarkdown.length === 0) {
      console.log('ok   no changed Markdown files to lint');
    } else if (fs.existsSync('node_modules/.bin/markdownlint-cli2')) {
      specChecks.push([
        'markdown lint of changed files',
        'node_modules/.bin/markdownlint-cli2',
        changedMarkdown,
      ]);
    } else {
      fail('markdownlint-cli2 is missing: run `npm ci` first.');
    }
  } else {
    console.log('skip specification checks (no path matches validate-specifications.yml)');
  }
  for (const [name, file, fileArgs, options] of specChecks) {
    try {
      run(file, fileArgs, options);
      console.log(`ok   ${name}`);
    } catch (error) {
      fail(`${name} failed:\n${outputTail(error)}`);
    }
  }

  return failed ? 1 : 0;
}

process.exitCode = main();

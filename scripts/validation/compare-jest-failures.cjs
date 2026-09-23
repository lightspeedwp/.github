#!/usr/bin/env node
/**
 * Compare two Jest `--json` reports and report failures that are new in the
 * head report. Used by .github/workflows/tests.yml to gate PRs on "no new
 * failures" while pre-existing failures on the base branch are fixed (#3472).
 *
 * A failure ID is `<path relative to its checkout>::<test full name>`. A
 * suite that fails without running any test (load or syntax error, a
 * process.exit at import) gets `<path>::<suite failed to run>`.
 *
 * Usage:
 *   node compare-jest-failures.cjs \
 *     --head head.json --head-root /path/to/head/checkout \
 *     --base base.json --base-root /path/to/base/checkout
 * Exit codes: 0 no new failures, 1 new failures, 2 bad input.
 */

const fs = require('node:fs');
const path = require('node:path');

const SUITE_FAILURE = '<suite failed to run>';
const OPTIONS = ['--head', '--head-root', '--base', '--base-root'];

/**
 * @param {object} report - Parsed Jest JSON report
 * @param {string} rootDir - Checkout the report's absolute paths are under
 * @returns {Set<string>}
 */
function failureIds(report, rootDir) {
  if (!report || !Array.isArray(report.testResults)) {
    throw new Error('Not a Jest --json report (missing testResults)');
  }

  const ids = new Set();

  for (const suite of report.testResults) {
    const file = path.relative(rootDir, suite.name).split(path.sep).join('/');
    const failedTests = (suite.assertionResults || []).filter((test) => test.status === 'failed');

    for (const test of failedTests) {
      ids.add(`${file}::${test.fullName}`);
    }

    if (suite.status === 'failed' && failedTests.length === 0) {
      ids.add(`${file}::${SUITE_FAILURE}`);
    }
  }

  return ids;
}

/**
 * @returns {{added: string[], fixed: string[], unchanged: number}}
 */
function compare(headIds, baseIds) {
  const added = [...headIds].filter((id) => !baseIds.has(id)).sort();
  const fixed = [...baseIds].filter((id) => !headIds.has(id)).sort();

  return { added, fixed, unchanged: headIds.size - added.length };
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    if (!OPTIONS.includes(key) || argv[index + 1] === undefined) {
      throw new Error(`Unexpected argument: ${key}`);
    }
    args[key.slice(2)] = argv[index + 1];
  }
  const missing = OPTIONS.filter((option) => !(option.slice(2) in args));
  if (missing.length > 0) {
    throw new Error(`Missing ${missing.join(', ')}`);
  }
  return args;
}

function formatReport(result) {
  const lines = [
    `New failures: ${result.added.length}`,
    `Fixed since base: ${result.fixed.length}`,
    `Pre-existing failures still failing: ${result.unchanged}`,
  ];
  if (result.added.length > 0) {
    lines.push('', 'New failures:', ...result.added.map((id) => `- ${id}`));
  }
  if (result.fixed.length > 0) {
    lines.push('', 'Fixed:', ...result.fixed.map((id) => `- ${id}`));
  }
  return lines.join('\n');
}

function main(argv, log = console.log, logError = console.error) {
  let result;
  try {
    const args = parseArgs(argv);
    const head = JSON.parse(fs.readFileSync(args.head, 'utf8'));
    const base = JSON.parse(fs.readFileSync(args.base, 'utf8'));
    result = compare(
      failureIds(head, path.resolve(args['head-root'])),
      failureIds(base, path.resolve(args['base-root']))
    );
  } catch (error) {
    logError(`compare-jest-failures: ${error.message}`);
    return 2;
  }

  log(formatReport(result));
  return result.added.length > 0 ? 1 : 0;
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}

module.exports = { failureIds, compare, formatReport, main, SUITE_FAILURE };

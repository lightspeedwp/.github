'use strict';

/**
 * Keeps the list of Jest test files that depend on prose (Markdown and text).
 *
 * The list is built from a trace written by jest-read-tracer.cjs. A test file
 * is on it when it read a prose file, or when it started a program other than
 * Node, because what such a program reads cannot be traced.
 *
 * Usage:
 *   node scripts/workflows/jest-prose-tests.cjs --write <trace>   rebuild the list
 *   node scripts/workflows/jest-prose-tests.cjs --check <trace>   fail if the list misses a traced test
 *   node scripts/workflows/jest-prose-tests.cjs --list            print the list on one line
 *
 * @module scripts/workflows/jest-prose-tests
 */

const fs = require('node:fs');
const path = require('node:path');

const MANIFEST = path.join(__dirname, '..', '..', 'tests', 'jest-prose-tests.json');
const OUTSIDE = '(outside a test)';

/**
 * Test files a trace shows to depend on prose.
 * @param {string} traceFile Path to a trace written by jest-read-tracer.cjs.
 * @returns {string[]} Sorted repository-relative test paths.
 */
function tracedTests(traceFile) {
  const tests = new Set();
  for (const line of fs.readFileSync(traceFile, 'utf8').split('\n')) {
    const [kind, test] = line.split('\t');
    if ((kind === 'T' || kind === 'P') && test && test !== OUTSIDE) tests.add(test);
  }
  return [...tests].sort();
}

/**
 * The committed list.
 * @returns {string[]} Repository-relative test paths.
 */
function manifestTests() {
  const document = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  if (!Array.isArray(document.tests)) throw new Error(`${MANIFEST}: "tests" must be an array`);
  return document.tests;
}

/**
 * @param {string[]} args Command-line arguments.
 * @returns {number} Exit code.
 */
function main(args) {
  const [mode, traceFile] = args;
  if (mode === '--list') {
    console.log(manifestTests().join(' '));
    return 0;
  }
  if ((mode !== '--write' && mode !== '--check') || !traceFile) {
    console.error('Usage: jest-prose-tests.cjs --write <trace> | --check <trace> | --list');
    return 2;
  }
  const traced = tracedTests(traceFile);
  if (mode === '--write') {
    const document = {
      description:
        'Jest test files that depend on Markdown or text files. Generated from a read trace; do not edit by hand.',
      regenerate:
        'JEST_READ_TRACE_FILE=/tmp/jest-reads.tsv JEST_READ_TRACE_ROOT="$PWD" NODE_OPTIONS="--require=$PWD/scripts/workflows/jest-read-tracer.cjs" npx jest --config .jest.config.cjs --coverage=false; node scripts/workflows/jest-prose-tests.cjs --write /tmp/jest-reads.tsv',
      tests: traced,
    };
    fs.writeFileSync(MANIFEST, `${JSON.stringify(document, null, 2)}\n`);
    console.log(`Wrote ${traced.length} test files to ${path.relative(process.cwd(), MANIFEST)}`);
    return 0;
  }
  if (traced.length === 0) {
    console.error('The trace names no test file, so the list cannot be checked.');
    return 1;
  }
  const listed = new Set(manifestTests());
  const missing = traced.filter((test) => !listed.has(test));
  if (missing.length > 0) {
    console.error('These test files depend on Markdown or text files but are not in tests/jest-prose-tests.json:');
    for (const test of missing) console.error(`  ${test}`);
    console.error('Regenerate the list with the command in its "regenerate" field and commit it.');
    return 1;
  }
  console.log(`The list covers all ${traced.length} test files that depend on Markdown or text files.`);
  return 0;
}

module.exports = { tracedTests, manifestTests, main };
if (require.main === module) process.exitCode = main(process.argv.slice(2));

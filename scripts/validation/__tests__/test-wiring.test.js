// Guard for #3552/#3496: the single root Jest runner must execute every
// test file in the repo. Suites that root cannot run (standalone CLI
// scripts with their own test()/assert harness) must each have a dedicated
// npm script owner. If files go unrun, this test fails instead of the
// regression going unseen.
//
// The nested listing is read the way it is on purpose (#3575). This guard is
// only as trustworthy as the child process it interrogates, so a child that
// fails or returns a clipped listing must say so rather than let a short list
// of paths be reported as "these files are undiscovered".
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '../../..');

// Suites deliberately parked outside the suite (established .jest-skip/
// convention); excluded from the every-file-runs invariant.
const KNOWN_SKIP_DIRS = ['.jest-skip/'];

// Suites with their own harness that crash Jest workers; each names the npm
// script that actually runs it, so a script that keeps its name but stops
// executing its suite is caught. `via` marks an indirect owner: the script
// runs a shell runner that invokes the suite.
const STANDALONE = [
  {
    file: '.github/scripts/__tests__/create-agent-spec.test.js',
    script: 'test:create-agent-spec',
  },
  {
    file: '.github/scripts/__tests__/generate-agent-index.test.js',
    script: 'test:index-generator',
  },
  {
    file: '.github/scripts/__tests__/validate-agent-specs.test.js',
    script: 'test:agent-spec-validation',
  },
  {
    file: '.github/scripts/__tests__/workflow-integration.test.js',
    script: 'test:phase-5',
    via: '.github/scripts/__tests__/run-all-tests.sh',
  },
];

const STANDALONE_FILES = STANDALONE.map(({ file }) => file);

function listTestFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listTestFiles(full, out);
    } else if (/\.test\.(js|mjs|ts)$/.test(entry.name)) {
      // .test.cjs files are out of root's scope on purpose: they run under
      // package-local node:test runners (e.g. release-agent) or nowhere
      // yet — tracked in #3560, not silently absorbed here.
      out.push(full);
    }
  }
  return out;
}

function toPosix(file) {
  return path.relative(ROOT, file).split(path.sep).join('/');
}

// The root config reads these to override which tests are discovered. The
// nested listing has to describe the DEFAULT root configuration, not whatever
// a caller scoped the parent run to: a run with one of these set made the
// child list 230 files instead of 282 and the guard then reported 50 healthy
// files as undiscovered (#3575).
const DISCOVERY_OVERRIDES = [
  'JEST_IGNORE_PATTERN',
  'JEST_TEST_MATCH_1',
  'JEST_TEST_MATCH_2',
  'JEST_TEST_MATCH_3',
  'JEST_TEST_MATCH_4',
  'JEST_TEST_MATCH_5',
  'JEST_TEST_MATCH_6',
];

function defaultDiscoveryEnv() {
  const env = { ...process.env };
  for (const key of DISCOVERY_OVERRIDES) {
    delete env[key];
  }
  return env;
}

let listingCounter = 0;

/**
 * Ask a Jest CLI which tests it would run, and return the resolved paths.
 *
 * `--json --outputFile` is used instead of reading stdout, for two reasons:
 *
 *  - `--outputFile` makes Jest write the list with one synchronous
 *    writeFileSync rather than console.log, so the payload cannot be clipped by
 *    a stdout pipe that the process exits before it drains. That is the
 *    load-dependent short list reported in #3575.
 *  - `--json` makes the payload a JSON array, so a partial file fails to parse
 *    and is reported as an incomplete listing. Plain newline-delimited paths
 *    have no completeness marker, so a clipped list is indistinguishable from
 *    a genuinely shorter one.
 *
 * Any failure to obtain a complete listing throws with that diagnosis.
 */
function listTestsWithJest({ command, cwd, extraArgs = [] }) {
  const outputFile = path.join(
    os.tmpdir(),
    `jest-list-tests-${process.pid}-${listingCounter++}.json`
  );

  try {
    const result = spawnSync(
      process.execPath,
      [...command, '--listTests', '--json', '--outputFile', outputFile, ...extraArgs],
      {
        cwd,
        encoding: 'utf8',
        env: defaultDiscoveryEnv(),
        maxBuffer: 16 * 1024 * 1024,
      }
    );

    if (result.error) {
      throw new Error(`the nested Jest listing did not run: ${result.error.message}`);
    }
    if (result.status !== 0) {
      throw new Error(
        `the nested Jest listing exited with status ${result.status}` +
          `${result.signal ? ` (signal ${result.signal})` : ''}, so its result is unknown:\n${result.stderr}`
      );
    }
    if (!fs.existsSync(outputFile)) {
      throw new Error(
        'the nested Jest listing produced no output file, so the listing is incomplete. This is not a wiring failure.'
      );
    }

    let listed;
    try {
      listed = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
    } catch (cause) {
      throw new Error(
        `the nested Jest listing is not valid JSON, so it is incomplete rather than short: ${cause.message}`,
        { cause }
      );
    }
    if (!Array.isArray(listed)) {
      throw new Error(
        `the nested Jest listing was ${typeof listed}, expected an array of test paths.`
      );
    }

    return listed.map((file) => path.resolve(cwd, file));
  } finally {
    fs.rmSync(outputFile, { force: true });
  }
}

describe('jest runner wiring (#3552)', () => {
  test('root jest does not delegate test directories elsewhere', () => {
    const configSource = fs.readFileSync(path.join(ROOT, '.jest.config.cjs'), 'utf8');
    expect(configSource).not.toMatch(/agents\/pr-agent\//);
  });

  test('root jest selects every test file except documented standalone suites', () => {
    const files = listTestFiles(ROOT).map(toPosix).sort();
    expect(files.length).toBeGreaterThan(0);

    const listedPaths = listTestsWithJest({
      command: ['node_modules/jest/bin/jest.js'],
      cwd: ROOT,
      extraArgs: ['--config', '.jest.config.cjs'],
    });
    const expected = files.filter(
      (file) =>
        !STANDALONE_FILES.includes(file) &&
        !KNOWN_SKIP_DIRS.some((dir) => file === dir || file.startsWith(dir))
    );
    const listed = new Set(listedPaths.map(toPosix));
    const missing = expected.filter((file) => !listed.has(file));
    // listTestsWithJest only ever returns a complete listing, so anything
    // missing here is a real wiring break and the path below names it. A
    // separate "is the listing suspiciously short?" assertion is deliberately
    // absent: it cannot tell a clipped listing from a genuine break, and once
    // the listing is known to be complete it is implied by this one.
    expect(missing).toEqual([]);
  }, 300000);

  test('root-ignored standalone suites are still executed by their owning script', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

    for (const { file, script, via } of STANDALONE) {
      const command = pkg.scripts?.[script];
      // The owner script must exist...
      expect(typeof command).toBe('string');
      // ...and must actually reach the suite, directly or through the
      // runner it invokes.
      if (via) {
        expect(command).toContain(via);
        expect(fs.readFileSync(path.join(ROOT, via), 'utf8')).toContain(path.basename(file));
      } else {
        expect(command).toContain(file);
      }
    }

    // The standalone files must also be ignored by the root config, or
    // they crash workers instead of reporting failures (#3496 context).
    const configSource = fs.readFileSync(path.join(ROOT, '.jest.config.cjs'), 'utf8');
    for (const file of STANDALONE_FILES) {
      expect(configSource).toContain(file);
    }
  });

  test('nested pr-agent runner selects every test file it owns', () => {
    const agentDir = path.join(ROOT, 'agents/pr-agent');

    // Compare against the files on disk rather than a count, so a nested
    // jest config that silently drops the skill-level suites fails here.
    const onDisk = listTestFiles(agentDir)
      .map((file) => toPosix(path.resolve(file)))
      .sort();
    expect(onDisk.length).toBeGreaterThan(0);

    const listedPaths = listTestsWithJest({
      command: [path.join(agentDir, 'scripts/jest-vm.js')],
      cwd: agentDir,
    });
    const listed = listedPaths.map((file) => toPosix(path.resolve(file))).sort();
    expect(listed).toEqual(onDisk);
  }, 120000);
});

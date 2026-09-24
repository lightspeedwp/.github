// Guard for #3552/#3496: the single root Jest runner must execute every
// test file in the repo. Suites that root cannot run (standalone CLI
// scripts with their own test()/assert harness) must each have a dedicated
// npm script owner. If files go unrun, this test fails instead of the
// regression going unseen.
const fs = require('fs');
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

function jestListTests(cwd, extraArgs = []) {
  const result = spawnSync(
    process.execPath,
    ['node_modules/jest/bin/jest.js', '--config', '.jest.config.cjs', '--listTests', ...extraArgs],
    { cwd, encoding: 'utf8' }
  );
  expect(result.status).toBe(0);
  return new Set(
    result.stdout
      .split(/\r?\n/)
      .filter(Boolean)
      .map((file) => toPosix(path.resolve(cwd, file)))
  );
}

describe('jest runner wiring (#3552)', () => {
  test('root jest does not delegate test directories elsewhere', () => {
    const configSource = fs.readFileSync(path.join(ROOT, '.jest.config.cjs'), 'utf8');
    expect(configSource).not.toMatch(/agents\/pr-agent\//);
  });

  test('root jest selects every test file except documented standalone suites', () => {
    const files = listTestFiles(ROOT).map(toPosix).sort();
    expect(files.length).toBeGreaterThan(0);

    const listed = jestListTests(ROOT);
    const expected = files.filter(
      (file) =>
        !STANDALONE_FILES.includes(file) &&
        !KNOWN_SKIP_DIRS.some((dir) => file === dir || file.startsWith(dir))
    );
    const missing = expected.filter((file) => !listed.has(file));
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
    const result = spawnSync(
      process.execPath,
      [path.join(agentDir, 'scripts/jest-vm.js'), '--listTests'],
      { cwd: agentDir, encoding: 'utf8' }
    );
    expect(result.status).toBe(0);

    // Compare against the files on disk rather than a count, so a nested
    // jest config that silently drops the skill-level suites fails here.
    const onDisk = listTestFiles(agentDir)
      .map((file) => toPosix(path.resolve(file)))
      .sort();
    expect(onDisk.length).toBeGreaterThan(0);

    const listed = result.stdout
      .split(/\r?\n/)
      .filter(Boolean)
      .map((file) => toPosix(path.resolve(agentDir, file)))
      .sort();
    expect(listed).toEqual(onDisk);
  }, 120000);
});

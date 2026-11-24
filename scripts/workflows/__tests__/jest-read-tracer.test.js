/** @jest-environment node */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const TRACER = path.join(__dirname, '..', 'jest-read-tracer.cjs');
const LIST_TOOL = path.join(__dirname, '..', 'jest-prose-tests.cjs');
const REPO_ROOT = path.join(__dirname, '..', '..', '..');

let workDir;

/**
 * Run a script in a child Node process with the tracer preloaded.
 * @param {string} script Source to evaluate.
 * @param {Record<string, string>} [env] Extra environment.
 * @returns {{ status: number | null, stdout: string, stderr: string, trace: string }}
 */
function runTraced(script, env = {}) {
  const traceFile = path.join(workDir, 'trace.tsv');
  const result = spawnSync(process.execPath, ['--require', TRACER, '-e', script], {
    cwd: workDir,
    encoding: 'utf8',
    env: { ...process.env, NODE_OPTIONS: '', JEST_READ_TRACE_FILE: traceFile, JEST_READ_TRACE_ROOT: workDir, ...env },
  });
  const trace = fs.existsSync(traceFile) ? fs.readFileSync(traceFile, 'utf8') : '';
  return { status: result.status, stdout: result.stdout, stderr: result.stderr, trace };
}

beforeEach(() => {
  workDir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'read-tracer-')));
  fs.writeFileSync(path.join(workDir, 'notes.md'), '# Notes\n');
  fs.writeFileSync(path.join(workDir, 'data.json'), '{}\n');
});

afterEach(() => fs.rmSync(workDir, { recursive: true, force: true }));

describe('jest-read-tracer', () => {
  it('does nothing when no trace is requested', () => {
    const result = runTraced('require("fs").readFileSync("notes.md"); console.log("ok")', {
      JEST_READ_TRACE_FILE: '',
    });
    expect(result).toMatchObject({ status: 0, stdout: 'ok\n', trace: '' });
  });

  it('records prose reads against the running test and leaves other files unattributed', () => {
    const result = runTraced('const fs = require("fs"); fs.readFileSync("notes.md"); fs.readFileSync("data.json");', {
      JEST_READ_TRACE_TEST: 'tests/example.test.js',
    });
    expect(result.status).toBe(0);
    expect(result.trace).toContain('F\tnotes.md\n');
    expect(result.trace).toContain('F\tdata.json\n');
    expect(result.trace.match(/^T\t/gm)).toHaveLength(1);
    expect(result.trace).toContain('T\ttests/example.test.js\n');
  });

  it('keeps util.promisify working on exec and records the program it starts', () => {
    const script = [
      'const { promisify } = require("util");',
      'promisify(require("child_process").exec)("git --version").then((r) => console.log(typeof r.stdout));',
    ].join('\n');
    const result = runTraced(script, { JEST_READ_TRACE_TEST: 'tests/example.test.js' });
    expect(result).toMatchObject({ status: 0, stdout: 'string\n' });
    expect(result.trace).toContain('P\ttests/example.test.js\tgit\n');
  });

  it('keeps the properties of the functions it wraps', () => {
    const script = 'const fs = require("fs"); console.log(typeof fs.realpath.native, typeof fs.realpathSync.native);';
    expect(runTraced(script)).toMatchObject({ status: 0, stdout: 'function function\n' });
  });

  it('treats an existence check on a prose file as a dependency of the running test', () => {
    const result = runTraced('require("fs").existsSync("notes.md");', {
      JEST_READ_TRACE_TEST: 'tests/example.test.js',
    });
    expect(result.status).toBe(0);
    expect(result.trace).toContain('S\tnotes.md\n');
    expect(result.trace).toContain('T\ttests/example.test.js\n');
  });

  it('does not count an existence check on a file that is not prose', () => {
    const result = runTraced('require("fs").existsSync("data.json");', {
      JEST_READ_TRACE_TEST: 'tests/example.test.js',
    });
    expect(result.trace).toContain('S\tdata.json\n');
    expect(result.trace).not.toContain('T\t');
  });

  /** A script that starts a traced Node child which reads a prose file and prints $KEPT. */
  const childScript = (options) =>
    [
      'require("fs").__jestCurrentTest = "tests/parent.test.js";',
      `const args = ["-r", ${JSON.stringify(TRACER)}, "-e", 'require("fs").readFileSync("notes.md"); process.stdout.write(process.env.KEPT || "")'];`,
      `process.stdout.write(require("child_process").execFileSync(process.execPath, args${options}).toString());`,
    ].join('\n');

  it('attributes the prose a Node child reads to the test that started it', () => {
    const result = runTraced(childScript(''));
    expect(result.status).toBe(0);
    expect(result.trace).toContain('T\ttests/parent.test.js\n');
  });

  it('keeps the environment a caller passes to a child, and still attributes its reads', () => {
    const result = runTraced(childScript(', { env: { ...process.env, KEPT: "yes" } }'));
    expect(result.status).toBe(0);
    expect(result.stdout).toBe('yes');
    expect(result.trace).toContain('T\ttests/parent.test.js\n');
  });

  it('keeps the options of a call whose argument list is undefined', () => {
    const script = [
      'require("fs").__jestCurrentTest = "tests/parent.test.js";',
      `const result = require("child_process").spawnSync(process.execPath, undefined, { input: "console.log(42)", encoding: "utf8", cwd: ${JSON.stringify(workDir)} });`,
      'process.stdout.write(result.stdout);',
    ].join('\n');
    expect(runTraced(script)).toMatchObject({ status: 0, stdout: '42\n' });
  });

  it('attributes the prose a forked Node child reads, without counting the module as a program', () => {
    fs.writeFileSync(path.join(workDir, 'child.cjs'), 'require("fs").readFileSync("notes.md"); process.exit(0);\n');
    const script = [
      'require("fs").__jestCurrentTest = "tests/parent.test.js";',
      `const child = require("child_process").fork(${JSON.stringify(path.join(workDir, 'child.cjs'))});`,
      'child.on("exit", () => process.stdout.write("forked"));',
    ].join('\n');
    const result = runTraced(script);
    expect(result).toMatchObject({ status: 0, stdout: 'forked' });
    expect(result.trace).toContain('T\ttests/parent.test.js\n');
    expect(result.trace).not.toContain('P\t');
  });

  it('counts an existence check reached through the module resolver', () => {
    const script = [
      'require("fs").__jestCurrentTest = "tests/parent.test.js";',
      'try { require.resolve("./notes.md"); } catch {}',
    ].join('\n');
    expect(runTraced(script).trace).toContain('T\ttests/parent.test.js\n');
  });

  it('passes the callback form of exec through unchanged', () => {
    const script = [
      'require("fs").__jestCurrentTest = "tests/parent.test.js";',
      'require("child_process").exec("echo hello", (error, stdout) => process.stdout.write(stdout));',
    ].join('\n');
    expect(runTraced(script)).toMatchObject({ status: 0, stdout: 'hello\n' });
  });

  it('ignores paths outside the traced root', () => {
    const result = runTraced(`require("fs").readFileSync(${JSON.stringify(TRACER)});`);
    expect(result.status).toBe(0);
    expect(result.trace).toBe('');
  });
});

describe('jest-prose-tests', () => {
  const run = (...args) => spawnSync(process.execPath, [LIST_TOOL, ...args], { encoding: 'utf8', cwd: REPO_ROOT });

  it('lists the committed test files, all of which exist', () => {
    const listed = run('--list').stdout.trim().split(' ');
    expect(listed.length).toBeGreaterThan(0);
    for (const test of listed) expect(fs.existsSync(path.join(REPO_ROOT, test))).toBe(true);
  });

  it('fails the check when a traced test file is not on the list', () => {
    const trace = path.join(workDir, 'trace.tsv');
    fs.writeFileSync(trace, 'T\ttests/not-on-the-list.test.js\n');
    const result = run('--check', trace);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('tests/not-on-the-list.test.js');
  });

  it('counts a test that only starts another program', () => {
    const trace = path.join(workDir, 'trace.tsv');
    fs.writeFileSync(trace, 'P\ttests/starts-git.test.js\tgit\n');
    expect(run('--check', trace).stderr).toContain('tests/starts-git.test.js');
  });

  it('refuses an empty trace and a missing mode', () => {
    const trace = path.join(workDir, 'trace.tsv');
    fs.writeFileSync(trace, 'F\tREADME.md\n');
    expect(run('--check', trace).status).toBe(1);
    expect(run('--write', trace).status).toBe(1);
    expect(run().status).toBe(2);
  });
});

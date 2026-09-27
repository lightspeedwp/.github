/**
 * Jest suite verifying the baseline behaviour of `meta.agent.js`.
 *
 * The agent is driven as a child process rather than imported. It is an ES module
 * that declares a module-level `const __filename = fileURLToPath(import.meta.url)`,
 * which collides with the CommonJS wrapper Jest's transform supplies and fails to
 * initialise on import. Spawning it also tests the thing that actually broke: the
 * command-line contract the workflow depends on.
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const AGENT = path.join(__dirname, '..', 'meta.agent.js');

/**
 * Build a throwaway repository containing `count` trivial Markdown files.
 *
 * @param {number} count - How many .md files to create
 * @returns {{ dir: string, before: Record<string, string> }} Fixture dir and original contents
 */
function makeFixture(count) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'meta-agent-cli-'));
  const before = {};
  for (let i = 0; i < count; i += 1) {
    const name = `file-${i}.md`;
    const body = `# File ${i}\n\nOriginal body ${i}.\n`;
    fs.writeFileSync(path.join(dir, name), body);
    before[name] = body;
  }
  return { dir, before };
}

/**
 * Run the agent in `dir` with the given arguments.
 *
 * @param {string} dir - Working directory for the child
 * @param {string[]} args - Arguments after the script path
 * @returns {import("child_process").SpawnSyncReturns<string>} Child process result
 */
function runAgent(dir, args) {
  return spawnSync(process.execPath, [AGENT, ...args], {
    cwd: dir,
    encoding: 'utf8',
    timeout: 120000,
  });
}

describe('meta.agent', () => {
  it('agent module file exists', () => {
    expect(fs.existsSync(AGENT)).toBe(true);
  });

  it('honours --files and touches only the files it is given', () => {
    // Regression for #3602. The workflow computes an impacted-README list and
    // passes it as `--files`, but the flag was never parsed, so a run scoped to
    // one file rewrote the whole repository -- measured at 9,424 files rewritten
    // on develop, including bare footers appended to AGENTS.md and CLAUDE.md.
    const { dir, before } = makeFixture(3);

    const result = runAgent(dir, ['--files', 'file-0.md']);

    expect(result.status).toBe(0);
    expect(fs.readFileSync(path.join(dir, 'file-0.md'), 'utf8')).not.toBe(before['file-0.md']);
    // The other two were never asked for, so they must be byte-identical.
    expect(fs.readFileSync(path.join(dir, 'file-1.md'), 'utf8')).toBe(before['file-1.md']);
    expect(fs.readFileSync(path.join(dir, 'file-2.md'), 'utf8')).toBe(before['file-2.md']);
  });

  it('accepts a comma-delimited list, which is what the workflow emits', () => {
    // scripts/workflows/resolve-readme-files.cjs ends with `readmes.join(",")`.
    const { dir, before } = makeFixture(3);

    const result = runAgent(dir, ['--files', 'file-0.md,file-2.md']);

    expect(result.status).toBe(0);
    expect(fs.readFileSync(path.join(dir, 'file-0.md'), 'utf8')).not.toBe(before['file-0.md']);
    expect(fs.readFileSync(path.join(dir, 'file-2.md'), 'utf8')).not.toBe(before['file-2.md']);
    expect(fs.readFileSync(path.join(dir, 'file-1.md'), 'utf8')).toBe(before['file-1.md']);
  });

  it('keeps a path that contains spaces intact', () => {
    // 12 tracked Markdown files in this repository have spaces in the name,
    // e.g. "AI Chatbot Discovery Questionnaire - Expanded.md". Splitting the list
    // on whitespace would truncate those into paths that do not exist and the
    // run would quietly do nothing.
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'meta-agent-space-'));
    const spaced = 'AI Chatbot Discovery Questionnaire - Expanded.md';
    fs.writeFileSync(path.join(dir, spaced), '# Spaced\n\nOriginal body.\n');
    fs.writeFileSync(path.join(dir, 'plain.md'), '# Plain\n\nOriginal body.\n');
    const before = fs.readFileSync(path.join(dir, spaced), 'utf8');

    const result = runAgent(dir, ['--files', spaced]);

    expect(result.status).toBe(0);
    expect(fs.readFileSync(path.join(dir, spaced), 'utf8')).not.toBe(before);
    expect(fs.readFileSync(path.join(dir, 'plain.md'), 'utf8')).toBe('# Plain\n\nOriginal body.\n');
  });

  it('rejects a flag in place of the --files value', () => {
    // `--files --dry-run` must not parse to a file literally named "--dry-run",
    // which matches nothing and turns the run into a silent no-op.
    const { dir, before } = makeFixture(2);

    const result = runAgent(dir, ['--files', '--dry-run']);

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/--files/);
    expect(fs.readFileSync(path.join(dir, 'file-0.md'), 'utf8')).toBe(before['file-0.md']);
  });

  it('fails when none of the requested paths exist', () => {
    // A scoped run that matches nothing and still exits 0 is a silent no-op, and
    // the step after this one in the workflow decides whether to open a PR from
    // whatever changed -- so it would see nothing and quietly open nothing.
    const { dir, before } = makeFixture(2);

    const result = runAgent(dir, ['--files', 'renamed-away.md']);

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/renamed-away\.md/);
    expect(fs.readFileSync(path.join(dir, 'file-0.md'), 'utf8')).toBe(before['file-0.md']);
  });

  it('still processes the paths that do exist when only some are missing', () => {
    const { dir, before } = makeFixture(2);

    const result = runAgent(dir, ['--files', 'file-0.md,renamed-away.md']);

    expect(result.status).toBe(0);
    expect(fs.readFileSync(path.join(dir, 'file-0.md'), 'utf8')).not.toBe(before['file-0.md']);
  });

  it('documents the separator it actually accepts', () => {
    // The help text is what a caller reads when a run does nothing, so it must
    // not claim whitespace separation: paths in this repository contain spaces.
    const { dir } = makeFixture(1);

    const result = runAgent(dir, ['--help']);

    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/comma or newline separated/);
    expect(result.stdout).not.toMatch(/space or comma/);
  });

  it('still scans the whole tree when --files is not given', () => {
    // The default is unchanged: a bare run is repo-wide by design.
    const { dir } = makeFixture(3);

    const result = runAgent(dir, ['--dry-run']);

    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/Total files: 3/);
  });

  it('fails loudly on an unrecognised flag instead of ignoring it', () => {
    // A silently ignored argument is how a scoped run became a whole-repo run.
    // An unknown flag has to stop the process, not fall through to a live,
    // in-place rewrite of the tree.
    const { dir, before } = makeFixture(2);

    const result = runAgent(dir, ['--filez', 'file-0.md']);

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/--filez/);
    expect(fs.readFileSync(path.join(dir, 'file-0.md'), 'utf8')).toBe(before['file-0.md']);
  });

  it('rejects --files with no value rather than falling back to a full scan', () => {
    const { dir, before } = makeFixture(2);

    const result = runAgent(dir, ['--files']);

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/--files/);
    expect(fs.readFileSync(path.join(dir, 'file-0.md'), 'utf8')).toBe(before['file-0.md']);
  });
});

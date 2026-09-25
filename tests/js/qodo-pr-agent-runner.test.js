/**
 * Behavioural tests for the Qodo PR-Agent skill runner, without invoking Qodo or GitHub.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const runner = path.resolve(__dirname, '../../skills/qodo-pr-agent/scripts/run-qodo-pr-agent.sh');
const python = spawnSync('sh', ['-c', 'command -v python3'], { encoding: 'utf8' }).stdout.trim();

describe('Qodo PR-Agent skill runner', () => {
  let directory;
  let output;
  let diff;
  let capture;
  let credentialCapture;

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'qodo-runner-test-'));
    output = path.join(directory, 'output');
    diff = path.join(directory, 'input.diff');
    capture = path.join(directory, 'invocation.txt');
    credentialCapture = path.join(directory, 'credential.txt');
    fs.writeFileSync(diff, 'diff --git a/file b/file\n');
    const bin = path.join(directory, 'bin');
    fs.mkdirSync(bin);
    fs.writeFileSync(path.join(bin, 'docker'), '#!/bin/sh\nexit 1\n', { mode: 0o755 });
    fs.writeFileSync(
      path.join(bin, 'python3'),
      `#!/bin/sh
if [ "$1" = '-c' ]; then
  if [ "$MOCK_PYTHON_UNSUPPORTED" = 'true' ]; then exit 1; fi
  exit 0
fi
exec "${python}" "$@"
`,
      { mode: 0o755 }
    );
    fs.writeFileSync(
      path.join(bin, 'pipx'),
      `#!/bin/sh
printf '%s\\n' "$@" > "$MOCK_CAPTURE"
printf '%s\\n' "$ANTHROPIC__KEY" > "$MOCK_ENV_CAPTURE"
if [ "$MOCK_FAILURE" = 'rate' ]; then echo 'HTTP 429 rate limit' >&2; exit 1; fi
if [ "$MOCK_FAILURE" = 'error' ]; then echo 'upstream failed' >&2; exit 1; fi
while [ "$#" -gt 0 ]; do
  case "$1" in
    --output) markdown="$2"; shift ;;
    --json-output) json="$2"; shift ;;
  esac
  shift
done
if [ -n "$markdown" ]; then
  printf '%s\\n' 'Suggestion: clipped output' > "$markdown"
  if [ -n "$json" ]; then
    if [ "$MOCK_JSON" = 'invalid' ]; then
      printf '%s\\n' '{invalid' > "$json"
    else
      printf '%s\\n' '{"suggestions":[1]}' > "$json"
    fi
  fi
else
  printf '%s\\n' 'Suggested PR summary'
fi
`,
      { mode: 0o755 }
    );
  });

  afterEach(() => fs.rmSync(directory, { recursive: true, force: true }));

  /**
   * Run the shell skill with mock tools and isolated output.
   * @param {string[]} args - Arguments passed to the runner.
   * @param {object} [env] - Environment overrides for this invocation.
   * @returns {import('node:child_process').SpawnSyncReturns<string>} Process result.
   */
  function run(args, env = {}) {
    return spawnSync('bash', [runner, ...args, '--out', output], {
      encoding: 'utf8',
      timeout: 10000,
      env: {
        ...process.env,
        PATH: `${path.join(directory, 'bin')}:${process.env.PATH}`,
        MOCK_CAPTURE: capture,
        MOCK_ENV_CAPTURE: credentialCapture,
        MOCK_FAILURE: '',
        MOCK_JSON: '',
        MOCK_PYTHON_UNSUPPORTED: '',
        ANTHROPIC_API_KEY_QODO_PR_AGENT: '',
        ANTHROPIC_API_KEY: '',
        GITHUB_TOKEN: '',
        ...env,
      },
    });
  }

  it.each([
    [['review'], /One of --pr-url or --diff-file is required/],
    [['ask', '--diff-file', 'missing.diff'], /--question is required for ask/],
    [
      ['review', '--pr-url', 'https://github.com/org/repo/pull/1', '--diff-file', 'file.diff'],
      /Use either/,
    ],
    [['review', '--diff-file', 'missing.diff'], /Diff file not found/],
    [['review', '--diff-file', 'file.diff', '--unexpected'], /Unknown argument/],
  ])('rejects invalid inputs without running the agent', (args, message) => {
    const result = run(args);
    expect(result.status).toBe(64);
    expect(result.stderr).toMatch(message);
    expect(fs.existsSync(capture)).toBe(false);
  });

  it('skips a PR-only tool on diffs before requesting credentials', () => {
    const result = run(['generate_labels', '--diff-file', diff]);
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      status: 'skipped',
      reason: 'tool-disabled',
      tool: 'generate_labels',
      truncated: false,
    });
    expect(fs.existsSync(capture)).toBe(false);
  });

  it('skips a diff when the model credential is absent', () => {
    const result = run(['review', '--diff-file', diff]);
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({ status: 'skipped', reason: 'no-credential' });
    expect(fs.existsSync(capture)).toBe(false);
  });

  it('skips a PR when the GitHub credential is absent', () => {
    const result = run(['describe', '--pr-url', 'https://github.com/org/repo/pull/1'], {
      ANTHROPIC_API_KEY_QODO_PR_AGENT: 'test-only-key',
    });
    expect(JSON.parse(result.stdout)).toMatchObject({ status: 'skipped', reason: 'no-credential' });
    expect(fs.existsSync(capture)).toBe(false);
  });

  it('normalises a diff result and passes safe, non-publishing settings', () => {
    const result = run(['ask', '--diff-file', diff, '--question', 'Why?'], {
      ANTHROPIC_API_KEY_QODO_PR_AGENT: 'test-only-key',
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      status: 'ok',
      tool: 'ask',
      reason: null,
      markdown: 'Suggestion: clipped output\n',
      data: null,
      truncated: true,
    });
    expect(JSON.parse(fs.readFileSync(path.join(output, 'result.json'), 'utf8'))).toStrictEqual(
      JSON.parse(result.stdout)
    );
    const invocation = fs.readFileSync(capture, 'utf8');
    expect(invocation).toContain('--config.publish_output=false');
    expect(invocation).toContain('--config.response_language=en-GB');
    expect(invocation).toContain('Why?');
    // Upstream rejects --json-output for every command except review.
    expect(invocation).not.toContain('--json-output');
    expect(invocation).not.toContain('test-only-key');
  });

  it('requests structured JSON output for diff-mode review only', () => {
    const result = run(['review', '--diff-file', diff], {
      ANTHROPIC_API_KEY_QODO_PR_AGENT: 'test-only-key',
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({ status: 'ok', data: { suggestions: [1] } });
    expect(fs.readFileSync(capture, 'utf8')).toContain('--json-output');
  });

  it('treats malformed upstream JSON as absent while keeping the Markdown result', () => {
    const result = run(['review', '--diff-file', diff], {
      ANTHROPIC_API_KEY_QODO_PR_AGENT: 'test-only-key',
      MOCK_JSON: 'invalid',
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      status: 'ok',
      markdown: 'Suggestion: clipped output\n',
      data: null,
    });
  });

  it('uses the dedicated key before the fallback key without putting either in arguments', () => {
    const result = run(['review', '--diff-file', diff], {
      ANTHROPIC_API_KEY_QODO_PR_AGENT: 'dedicated-test-key',
      ANTHROPIC_API_KEY: 'fallback-test-key',
    });
    expect(result.status).toBe(0);
    expect(fs.readFileSync(credentialCapture, 'utf8').trim()).toBe('dedicated-test-key');
    expect(fs.readFileSync(capture, 'utf8')).not.toMatch(/dedicated-test-key|fallback-test-key/);
  });

  it('uses the fallback key when the dedicated key is absent', () => {
    const result = run(['review', '--diff-file', diff], {
      ANTHROPIC_API_KEY: 'fallback-test-key',
    });
    expect(result.status).toBe(0);
    expect(fs.readFileSync(credentialCapture, 'utf8').trim()).toBe('fallback-test-key');
  });

  it('passes a question with spaces and shell punctuation as one argument', () => {
    const question = 'Why does value=$(false); remain literal?';
    const result = run(['ask', '--diff-file', diff, '--question', question], {
      ANTHROPIC_API_KEY_QODO_PR_AGENT: 'test-only-key',
    });
    expect(result.status).toBe(0);
    expect(fs.readFileSync(capture, 'utf8').split('\n')).toContain(question);
  });

  it('skips when no supported execution runtime is available', () => {
    const result = run(['review', '--diff-file', diff], {
      ANTHROPIC_API_KEY_QODO_PR_AGENT: 'test-only-key',
      MOCK_PYTHON_UNSUPPORTED: 'true',
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({ status: 'skipped', reason: 'no-runtime' });
    expect(fs.existsSync(capture)).toBe(false);
  });

  it('resolves a relative --out directory to an absolute path', () => {
    const relative = path.relative(process.cwd(), output);
    const result = spawnSync('bash', [runner, 'review', '--diff-file', diff, '--out', relative], {
      encoding: 'utf8',
      timeout: 10000,
      env: {
        ...process.env,
        PATH: `${path.join(directory, 'bin')}:${process.env.PATH}`,
        MOCK_CAPTURE: capture,
        MOCK_FAILURE: '',
        ANTHROPIC_API_KEY_QODO_PR_AGENT: 'test-only-key',
      },
    });
    expect(result.status).toBe(0);
    const outputArg = fs
      .readFileSync(capture, 'utf8')
      .split('\n')
      .find((l) => l.endsWith('out.md'));
    expect(path.isAbsolute(outputArg)).toBe(true);
  });

  it('captures PR-mode stdout as Markdown without publishing', () => {
    const url = 'https://github.com/org/repo/pull/1';
    const result = run(['describe', '--pr-url', url], {
      ANTHROPIC_API_KEY_QODO_PR_AGENT: 'test-only-key',
      GITHUB_TOKEN: 'test-only-token',
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      status: 'ok',
      tool: 'describe',
      markdown: 'Suggested PR summary\n',
      data: null,
      truncated: false,
    });
    expect(fs.readFileSync(capture, 'utf8')).toContain(url);
    expect(fs.readFileSync(capture, 'utf8')).not.toContain('test-only-token');
  });

  it.each([
    ['rate', 'rate-limited'],
    ['error', 'upstream-error'],
  ])('returns a nonzero error status for %s failures', (failure, reason) => {
    const result = run(['review', '--diff-file', diff], {
      ANTHROPIC_API_KEY_QODO_PR_AGENT: 'test-only-key',
      MOCK_FAILURE: failure,
    });
    expect(result.status).toBe(2);
    expect(JSON.parse(result.stdout)).toMatchObject({ status: 'error', reason, tool: 'review' });
  });
});

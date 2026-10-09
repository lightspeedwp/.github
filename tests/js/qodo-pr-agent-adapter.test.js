/**
 * Execute the PR-mode adapter with mocked upstream modules, without Docker or API calls.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const adapter = path.resolve(__dirname, '../../skills/qodo-pr-agent/scripts/pr_mode_adapter.py');
const prUrl = 'https://github.com/example/project/pull/42';

// Load the real adapter after installing mocks. The request observes the settings
// at invocation time and supplies its result only after the coroutine is awaited.
const harness = String.raw`
import json
import runpy
import sys
import types
from unittest.mock import AsyncMock, Mock, patch

fixture = json.loads(sys.argv[2])
settings = Mock()
settings.get.return_value = None
observed = {}

async def handle_request(url, request):
    observed.update(url=url, request=request,
                    settings=dict(call.args for call in settings.set.call_args_list))
    if fixture.get("error"):
        raise RuntimeError(fixture["error"])
    settings.get.return_value = fixture.get("data")
    return fixture.get("result", True)

agent = Mock()
agent.handle_request = AsyncMock(side_effect=handle_request)
agent_module = types.ModuleType("pr_agent.agent.pr_agent")
agent_module.PRAgent = Mock(return_value=agent)
config_module = types.ModuleType("pr_agent.config_loader")
config_module.get_settings = Mock(return_value=settings)
modules = {name: types.ModuleType(name) for name in ("pr_agent", "pr_agent.agent")}
modules.update({"pr_agent.agent.pr_agent": agent_module,
                "pr_agent.config_loader": config_module})

with patch.dict(sys.modules, modules):
    adapter = runpy.run_path(sys.argv[1], run_name="adapter_test")
    with patch.object(sys, "argv", [sys.argv[1], *fixture["argv"]]):
        try:
            observed["exit_code"] = adapter["main"]()
        except Exception as error:
            observed["error"] = {"type": type(error).__name__, "message": str(error)}

observed["await_count"] = agent.handle_request.await_count
observed["settings_calls"] = config_module.get_settings.call_count
print(json.dumps(observed))
`;

describe('Qodo PR-Agent PR-mode adapter', () => {
  let directory;
  let output;

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'qodo-adapter-test-'));
    output = path.join(directory, 'review output.md');
  });

  afterEach(() => fs.rmSync(directory, { recursive: true, force: true }));

  function run(fixture = {}) {
    const result = spawnSync(
      'python3',
      ['-B', '-', adapter, JSON.stringify({ argv: [output, prUrl, 'review'], ...fixture })],
      { input: harness, encoding: 'utf8', timeout: 10000 }
    );
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);
    return { observed: JSON.parse(result.stdout), stderr: result.stderr };
  }

  it.each(['review', 'describe', 'improve'])(
    'awaits %s with safe settings and writes the exact UTF-8 artefact',
    (tool) => {
      const artifact = '\n## Révision — £5\n\nPréférer une vérification. ✓\n';
      const request = [tool, '--config.publish_output=false', '--config.model=test-model'];
      const { observed, stderr } = run({
        argv: [output, prUrl, ...request],
        data: { artifact },
      });

      expect(stderr).toBe('');
      expect(observed).toMatchObject({
        url: prUrl,
        request,
        settings: { 'CONFIG.CLI_MODE': true, 'CONFIG.USE_REPO_SETTINGS_FILE': false },
        await_count: 1,
        exit_code: 0,
      });
      expect(fs.readFileSync(output, 'utf8')).toBe(artifact);
    }
  );

  it('preserves a question and setting overrides as separate request arguments', () => {
    const request = [
      'ask',
      'Why use "quoted text"; $(echo example)?\nExplain.',
      '--config.publish_output=false',
    ];
    const { observed } = run({ argv: [output, prUrl, ...request] });
    expect(observed.request).toStrictEqual(request);
    expect(observed.exit_code).toBe(0);
    expect(fs.existsSync(output)).toBe(false);
  });

  it.each(
    [
      null,
      [],
      ['unexpected'],
      'unexpected',
      42,
      {},
      { artifact: null },
      { artifact: false },
      { artifact: 42 },
      { artifact: [] },
      { artifact: { markdown: 'not a string' } },
      { artifact: '' },
      { artifact: ' \t\n\r ' },
    ].map((data) => [data])
  )('leaves no output for unusable artefact data: %j', (data) => {
    const { observed } = run({ data });
    expect(observed).toMatchObject({ exit_code: 0, await_count: 1 });
    expect(observed.error).toBeUndefined();
    expect(fs.existsSync(output)).toBe(false);
  });

  it.each([true, null, 0, ''])('treats a non-False upstream result as success: %j', (result) => {
    const { observed } = run({ result, data: { artifact: 'Completed review' } });
    expect(observed.exit_code).toBe(0);
    expect(fs.readFileSync(output, 'utf8')).toBe('Completed review');
  });

  it.each([null, { artifact: 'Partial review' }])(
    'returns failure even when upstream leaves an artefact: %j',
    (data) => {
      const { observed } = run({ result: false, data });
      expect(observed).toMatchObject({ exit_code: 1, await_count: 1 });
      expect(fs.existsSync(output)).toBe(data !== null);
      if (data) expect(fs.readFileSync(output, 'utf8')).toBe(data.artifact);
    }
  );

  it.each([[], ['out.md'], ['out.md', prUrl]].map((argv) => [argv]))(
    'rejects insufficient arguments before calling upstream: %j',
    (argv) => {
      const { observed, stderr } = run({ argv });
      expect(observed).toMatchObject({ exit_code: 64, await_count: 0, settings_calls: 0 });
      expect(stderr).toContain(
        'Usage: python pr_mode_adapter.py <out.md> <pr_url> <tool> [args...]'
      );
      expect(fs.existsSync(output)).toBe(false);
    }
  );

  it('propagates upstream exceptions without creating an output file', () => {
    const { observed } = run({ error: 'upstream unavailable' });
    expect(observed.error).toStrictEqual({ type: 'RuntimeError', message: 'upstream unavailable' });
    expect(observed).not.toHaveProperty('exit_code');
    expect(fs.existsSync(output)).toBe(false);
  });

  it('propagates output write failures instead of reporting success', () => {
    const { observed } = run({
      argv: [directory, prUrl, 'review'],
      data: { artifact: 'Review result' },
    });
    expect(observed.error.type).toBe('IsADirectoryError');
    expect(observed).not.toHaveProperty('exit_code');
  });
});

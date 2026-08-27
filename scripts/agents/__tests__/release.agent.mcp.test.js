import { execFileSync } from "node:child_process";
import path from "node:path";

const repoRoot = path.resolve(__dirname, "../../..");

function runNodeEsm(code) {
  const raw = execFileSync(
    process.execPath,
    ["--input-type=module", "-e", code],
    {
      cwd: repoRoot,
      encoding: "utf8",
    },
  ).trim();

  const lines = raw.split("\n").filter(Boolean);
  return lines[lines.length - 1] || "";
}

describe("release.agent MCP provider", () => {
  test("full run path in mcp dry-run performs preflight and no live mutations", () => {
    const output = runNodeEsm(`
      import { createRequire } from 'node:module';

      const require = createRequire(import.meta.url);
      const fs = require('node:fs');
      const originalReadFileSync = fs.readFileSync;

      process.env.GITHUB_TOKEN = 'token';
      process.env.GITHUB_REPOSITORY = 'lightspeedwp/.github';
      process.env.RELEASE_FORCE_VERSION = '1';
      let fetchCalls = 0;
      globalThis.fetch = async () => {
        fetchCalls += 1;
        return {
          ok: false,
          status: 404,
          statusText: 'Not Found',
          text: async () => JSON.stringify({ message: 'Not Found' }),
        };
      };
      const FAKE_CHANGELOG = [
        '# Changelog',
        '',
        '## [Unreleased]',
        '',
        '### Added',
        '',
        '- Fake unreleased entry for test fixture',
        '',
        '## [0.5.0] - 2026-06-19',
        '',
        '### Added',
        '',
        '- Fixture release entry for test',
        '',
        '## [0.4.0] - 2026-01-01',
        '',
        '### Fixed',
        '',
        '- Previous release entry',
      ].join('\\n');
      fs.readFileSync = (filePath, ...args) => {
        if (String(filePath).endsWith('VERSION')) {
          return '0.4.0\\n';
        }
        if (String(filePath).endsWith('CHANGELOG.md')) {
          return FAKE_CHANGELOG;
        }
        return originalReadFileSync.call(fs, filePath, ...args);
      };

      const { run } = await import('./scripts/agents/release.agent.js');
      const logs = [];
      const warnings = [];
      const originalLog = console.log;
      const originalWarn = console.warn;
      console.log = (...args) => logs.push(args.join(' '));
      console.warn = (...args) => warnings.push(args.join(' '));

      process.argv = ['node', 'release.agent.js', '--scope=patch', '--version=0.5.0', '--provider=mcp', '--dry-run'];
      await run();

      console.log = originalLog;
      console.warn = originalWarn;
      fs.readFileSync = originalReadFileSync;
      console.log(JSON.stringify({ fetchCalls, logs, warnings }));
    `);

    const result = JSON.parse(output);
    const joinedLogs = result.logs.join("\n");

    expect(result.fetchCalls).toBe(2);
    expect(joinedLogs).toMatch(
      /\[DRY-RUN\] \[MCP\] Preflight passed for v\d+\.\d+\.\d+/,
    );
    expect(joinedLogs).toContain("[DRY-RUN] [MCP] Would create tag ref v");
    expect(joinedLogs).toContain(
      "[DRY-RUN] [MCP] Would create release PR from release/v",
    );
    expect(joinedLogs).not.toContain("Would publish release v");
    expect(joinedLogs).not.toContain("✓ [MCP] Tag");
    expect(joinedLogs).not.toContain("✓ [MCP] GitHub Release");
  });

  test("preflight rejects when tag already exists", () => {
    const output = runNodeEsm(`
      process.env.GITHUB_TOKEN = 'token';
      process.env.GITHUB_REPOSITORY = 'lightspeedwp/.github';
      globalThis.fetch = async () => ({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => JSON.stringify({ ref: 'x' }),
      });
      const { createMcpReleaseProvider } = await import('./scripts/agents/release.agent.js');
      const provider = createMcpReleaseProvider();
      try {
        await provider.preflight('9.9.9', { dryRun: false });
        console.log(JSON.stringify({ ok: true }));
      } catch (error) {
        console.log(JSON.stringify({ ok: false, message: error.message }));
      }
    `);

    const result = JSON.parse(output);
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/already exists/i);
  });

  test("createTag mutation calls refs endpoint", () => {
    const output = runNodeEsm(`
      process.env.GITHUB_TOKEN = 'token';
      process.env.GITHUB_REPOSITORY = 'lightspeedwp/.github';
      const calls = [];
      globalThis.fetch = async (url, options) => {
        calls.push({ url, method: options.method, body: options.body });
        return {
          ok: true,
          status: 201,
          statusText: 'Created',
          text: async () => JSON.stringify({}),
        };
      };
      const { createMcpReleaseProvider } = await import('./scripts/agents/release.agent.js');
      const provider = createMcpReleaseProvider();
      await provider.createTag('9.9.9', { dryRun: false });
      console.log(JSON.stringify(calls[0]));
    `);

    const call = JSON.parse(output);
    expect(call.url).toContain("/repos/lightspeedwp/.github/git/refs");
    expect(call.method).toBe("POST");
    const body = JSON.parse(call.body);
    expect(body.ref).toBe("refs/tags/v9.9.9");
    expect(typeof body.sha).toBe("string");
  });

  test("createReleasePR mutation calls pulls endpoint (develop target)", () => {
    const output = runNodeEsm(`
      process.env.GITHUB_TOKEN = 'token';
      process.env.GITHUB_REPOSITORY = 'lightspeedwp/.github';
      const calls = [];
      globalThis.fetch = async (url, options) => {
        calls.push({ url, method: options.method, body: options.body });
        return {
          ok: true,
          status: 201,
          statusText: 'Created',
          text: async () => JSON.stringify({ number: 1 }),
        };
      };
      const { createMcpReleaseProvider } = await import('./scripts/agents/release.agent.js');
      const provider = createMcpReleaseProvider();
      await provider.createReleasePR('9.9.9', 'release/v9.9.9', { dryRun: false });
      console.log(JSON.stringify(calls[0]));
    `);

    const call = JSON.parse(output);
    expect(call.url).toContain("/repos/lightspeedwp/.github/pulls");
    expect(call.method).toBe("POST");
    const body = JSON.parse(call.body);
    expect(body.base).toBe("develop");
    expect(body.head).toBe("release/v9.9.9");
  });

  test("createReleasePRToMain mutation creates PR from develop to main", () => {
    const output = runNodeEsm(`
      process.env.GITHUB_TOKEN = 'token';
      process.env.GITHUB_REPOSITORY = 'lightspeedwp/.github';
      const calls = [];
      globalThis.fetch = async (url, options) => {
        calls.push({ url, method: options.method, body: options.body });
        return {
          ok: true,
          status: 201,
          statusText: 'Created',
          text: async () => JSON.stringify({ number: 2 }),
        };
      };
      const { createMcpReleaseProvider } = await import('./scripts/agents/release.agent.js');
      const provider = createMcpReleaseProvider();
      await provider.createReleasePRToMain('9.9.9', { dryRun: false, developPRNumber: '1' });
      console.log(JSON.stringify(calls[0]));
    `);

    const call = JSON.parse(output);
    expect(call.url).toContain("/repos/lightspeedwp/.github/pulls");
    expect(call.method).toBe("POST");
    const body = JSON.parse(call.body);
    expect(body.base).toBe("main");
    expect(body.head).toBe("develop");
  });

  test("githubApiRequest retries on 500 and succeeds", () => {
    const output = runNodeEsm(`
      process.env.GITHUB_TOKEN = 'token';
      let count = 0;
      globalThis.fetch = async () => {
        count += 1;
        if (count === 1) {
          return {
            ok: false,
            status: 500,
            statusText: 'Server Error',
            text: async () => JSON.stringify({ message: 'retry' }),
          };
        }
        return {
          ok: true,
          status: 200,
          statusText: 'OK',
          text: async () => JSON.stringify({ ok: true }),
        };
      };
      const { githubApiRequest } = await import('./scripts/agents/release.agent.js');
      const result = await githubApiRequest('/repos/lightspeedwp/.github/test', {
        retries: 1,
        initialBackoffMs: 1,
        backoffFactor: 1,
      });
      console.log(JSON.stringify({ count, result }));
    `);

    const parsed = JSON.parse(output);
    expect(parsed.count).toBe(2);
    expect(parsed.result).toEqual({ ok: true });
  });
});

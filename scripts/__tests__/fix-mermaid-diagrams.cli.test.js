/**
 * The fixer's self-check (#3492): after rewriting files it parses every
 * diagram in them with mermaid's own parser and exits non-zero on failure,
 * so the docs bot fails before it can open a PR with broken diagrams.
 */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const script = path.join(__dirname, '..', 'fix-mermaid-diagrams.cjs');

function runFixerIn(files) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'fix-mermaid-'));
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(directory, name), content);
  }
  try {
    const result = spawnSync(process.execPath, [script], {
      cwd: directory,
      encoding: 'utf8',
      env: { ...process.env, DRY_RUN: 'true' },
    });
    return { status: result.status, output: `${result.stdout}${result.stderr}` };
  } finally {
    fs.rmSync(directory, { force: true, recursive: true });
  }
}

describe('fix-mermaid-diagrams self-check', () => {
  test('exits 0 when every fixed diagram parses', () => {
    const { status, output } = runFixerIn({
      'doc.md': '```mermaid\nflowchart TD\n  A --> B\n```\n',
    });

    expect(output).toContain('Mermaid fixes: 1 files');
    expect(status).toBe(0);
  });

  test('exits 1 and names the diagram when a fixed file still fails to parse', () => {
    const { status, output } = runFixerIn({
      'doc.md': '# Doc\n\n```mermaid\nflowchart TD\n  A -->\n```\n',
    });

    expect(status).toBe(1);
    expect(output).toMatch(/doc\.md:3: Parse error/);
    expect(output).toContain('Mermaid self-check failed: 1 diagram(s)');
  });

  test('does not parse-check files it did not change', () => {
    const { status } = runFixerIn({
      'untouched.md': '```text\nnot a diagram\n```\n',
    });

    expect(status).toBe(0);
  });
});

/**
 * Runs the real validate-mermaid-syntax.js CLI against temporary files.
 * Guards #3490: accTitle/accDescr above the diagram type line must fail.
 */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const script = path.join(__dirname, '..', 'validate-mermaid-syntax.js');

function runOn(markdown) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'mermaid-syntax-'));
  const file = path.join(directory, 'doc.md');
  fs.writeFileSync(file, markdown);

  try {
    const result = spawnSync(process.execPath, [script, `--changed-files=${file}`], {
      encoding: 'utf8',
      env: { ...process.env, MERMAID_SYNTAX_REPORT: path.join(directory, 'report.md') },
    });
    return { status: result.status, output: `${result.stdout}${result.stderr}` };
  } finally {
    fs.rmSync(directory, { force: true, recursive: true });
  }
}

describe('validate-mermaid-syntax CLI: accessibility statement placement (#3490)', () => {
  test('fails when accTitle sits above the diagram type line', () => {
    const { status, output } = runOn('```mermaid\naccTitle: T\nflowchart TD\n  A --> B\n```\n');

    expect(status).toBe(1);
    expect(output).toContain('accTitle/accDescr must come after the diagram type line');
  });

  test('passes when accTitle and accDescr follow the type line', () => {
    const { status, output } = runOn(
      '```mermaid\nflowchart TD\n  accTitle: T\n  accDescr: D\n  A --> B\n```\n'
    );

    expect(output).not.toContain('must come after the diagram type line');
    expect(status).toBe(0);
  });

  test('skips %% directives before the type line', () => {
    const { output } = runOn(
      "```mermaid\n%%{init: {'theme': 'base'}}%%\ngraph LR\n  accTitle: T\n  accDescr: D\n  A --> B\n```\n"
    );

    expect(output).not.toContain('must come after the diagram type line');
  });

  test('fails when any non-type statement precedes the type line (Copilot #3491)', () => {
    const { status, output } = runOn(
      '```mermaid\ngarbage line\nflowchart TD\n  accTitle: T\n  accDescr: D\n  A --> B\n```\n'
    );

    expect(status).toBe(1);
    expect(output).toContain('First statement must be a diagram type, found: garbage line');
  });
});

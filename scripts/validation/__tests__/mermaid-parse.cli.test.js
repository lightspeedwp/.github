/**
 * Runs the real scripts/validation/mermaid-parse.mjs CLI (#3492) against
 * temporary Markdown files. It uses mermaid's own parser, so each fixture
 * is judged exactly as mermaid judges it.
 */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const script = path.join(__dirname, '..', 'mermaid-parse.mjs');

function runOn(files) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'mermaid-parse-'));
  const paths = Object.entries(files).map(([name, content]) => {
    const file = path.join(directory, name);
    fs.writeFileSync(file, content);
    return file;
  });

  try {
    const result = spawnSync(process.execPath, [script, ...paths], {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..', '..', '..'),
    });
    return { status: result.status, stdout: result.stdout, stderr: result.stderr };
  } finally {
    fs.rmSync(directory, { force: true, recursive: true });
  }
}

const block = (source) => `# Doc\n\n\`\`\`mermaid\n${source}\n\`\`\`\n`;

describe('mermaid-parse CLI', () => {
  test('passes a valid diagram', () => {
    const { status, stdout } = runOn({
      'ok.md': block('flowchart TD\n  accTitle: T\n  accDescr: D\n  A --> B'),
    });

    expect(status).toBe(0);
    expect(stdout).toContain('1 diagram(s), 0 failure(s)');
  });

  test.each([
    [
      'accTitle before the type (#3490)',
      'accTitle: T\nflowchart TD\n  A --> B',
      'No diagram type detected',
    ],
    ['no-colon accTitle', 'flowchart TD\n  accTitle "T"\n  A --> B', 'Parse error'],
    ['dangling edge', 'flowchart TD\n  A -->\n', 'Parse error'],
    ['accTitle in a mindmap', 'mindmap\n  accTitle: T\n  root((R))', 'only one root'],
  ])('fails with file:line on %s', (_name, source, message) => {
    const { status, stderr } = runOn({ 'bad.md': block(source) });

    expect(status).toBe(1);
    expect(stderr).toMatch(/bad\.md:3: /);
    expect(stderr).toContain(message);
  });

  test('reports an unclosed fence', () => {
    const { status, stderr } = runOn({ 'open.md': '```mermaid\nflowchart TD\n  A --> B\n' });

    expect(status).toBe(1);
    expect(stderr).toContain('Unclosed ```mermaid fence');
  });

  test('reads a NUL-delimited list with a non-ASCII and a spaced pathname', () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'mermaid-list-'));
    try {
      const good = path.join(directory, 'café notes.md');
      const bad = path.join(directory, 'naïve.md');
      fs.writeFileSync(good, block('flowchart TD\n  A --> B'));
      fs.writeFileSync(bad, block('flowchart TD\n  A -->\n'));
      const list = path.join(directory, 'changed.txt');
      fs.writeFileSync(list, `${good}\0${bad}\0`);

      const result = spawnSync(process.execPath, [script, `--changed-files-list=${list}`], {
        encoding: 'utf8',
        cwd: path.join(__dirname, '..', '..', '..'),
      });

      expect(result.status).toBe(1);
      expect(result.stdout).toContain('2 file(s), 2 diagram(s), 1 failure(s)');
      expect(result.stderr).toContain('naïve.md:3:');
    } finally {
      fs.rmSync(directory, { force: true, recursive: true });
    }
  });

  test('ignores ```mermaid quoted inside another code block', () => {
    const { status, stdout } = runOn({
      'quoted.md': '````markdown\n```mermaid\nnot a diagram\n```\n````\n',
    });

    expect(status).toBe(0);
    expect(stdout).toContain('0 diagram(s), 0 failure(s)');
  });
});

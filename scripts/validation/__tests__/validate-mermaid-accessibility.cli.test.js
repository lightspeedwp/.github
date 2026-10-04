/**
 * Runs the real validate-mermaid-accessibility.js CLI against temporary files.
 * Guards #3526: diagram types that cannot carry accTitle/accDescr must be given
 * a Markdown text alternative above the fence instead, and a fragment fenced as
 * `mermaid` with no diagram type must not be counted as an accessible diagram.
 */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const script = path.join(__dirname, '..', 'validate-mermaid-accessibility.js');

function runOn(markdown) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'mermaid-a11y-'));
  const file = path.join(directory, 'doc.md');
  fs.writeFileSync(file, markdown);

  try {
    // Both artefacts go to the temp dir so the run cannot dirty the working
    // tree, which tests/jest.working-tree-guard.cjs fails on.
    const result = spawnSync(process.execPath, [script, `--changed-files=${file}`], {
      encoding: 'utf8',
      env: { ...process.env, MERMAID_ACCESSIBILITY_REPORT_DIR: directory },
    });
    return { status: result.status, output: `${result.stdout}${result.stderr}` };
  } finally {
    fs.rmSync(directory, { force: true, recursive: true });
  }
}

describe('validate-mermaid-accessibility CLI: text alternative (#3526)', () => {
  test('accepts a block-beta diagram with a text alternative above the fence', () => {
    const { status, output } = runOn(
      'Issues sit in three priority bands.\n\n' +
        '```mermaid\nblock-beta\n    columns 1\n    block:priority["Priority"]\n        P1["P1"]\n    end\n```\n'
    );

    expect(status).toBe(0);
    expect(output).toContain('text alternative above the fence');
  });

  test('rejects a block-beta diagram with no text alternative', () => {
    const { status, output } = runOn(
      '```mermaid\nblock-beta\n    columns 1\n    block:priority["Priority"]\n        P1["P1"]\n    end\n```\n'
    );

    expect(status).toBe(1);
    expect(output).toContain('Missing text alternative above the `block-beta` fence');
  });

  test('does not accept a heading as the text alternative', () => {
    const { status, output } = runOn(
      '### Priority\n\n```mermaid\nblock-beta\n    columns 1\n    block:a["A"]\n    end\n```\n'
    );

    expect(status).toBe(1);
    expect(output).toContain('Missing text alternative');
  });

  test.each([
    ['a lone setext underline', 'Prose above.\n=\n\n'],
    ['indented code', 'Prose above.\n\n    code\n\n'],
    ['tab-indented code', 'Prose above.\n\n\tcode\n\n'],
  ])('does not accept %s as the text alternative', (_name, above) => {
    const { status, output } = runOn(
      `${above}\`\`\`mermaid\nblock-beta\n    columns 1\n    block:a["A"]\n    end\n\`\`\`\n`
    );

    expect(status).toBe(1);
    expect(output).toContain('Missing text alternative');
  });

  test('recognises the hyphenated type rather than truncating it', () => {
    const { status, output } = runOn('Bands.\n\n```mermaid\nsankey-beta\nA,B,1\n```\n');

    expect(status).toBe(0);
    expect(output).toContain('[sankey-beta]');
  });

  test('still requires accTitle and accDescr from types that accept them', () => {
    const { status, output } = runOn('Bands.\n\n```mermaid\nflowchart TD\n  A --> B\n```\n');

    expect(status).toBe(1);
    expect(output).toContain('Missing accTitle');
    expect(output).toContain('Missing accDescr');
  });

  test('a one-line fragment fenced as mermaid is not treated as accessible', () => {
    const { status, output } = runOn('```mermaid\naccTitle: Contribution workflow\n```\n');

    expect(status).toBe(1);
    expect(output).toContain('accTitle/accDescr must appear after the diagram type declaration');
  });

  test('does not accept a multi-line HTML comment as the text alternative', () => {
    const { status, output } = runOn(
      '<!--\n  This caption is commented out and a screen reader never reads it\n-->\n\n' +
        '```mermaid\nblock-beta\n    columns 1\n    block:a["A"]\n    end\n```\n'
    );

    expect(status).toBe(1);
    expect(output).toContain('Missing text alternative');
  });

  test('does not accept a horizontal rule as the text alternative', () => {
    const { status, output } = runOn(
      'Some prose.\n\n---\n\n```mermaid\nmindmap\n  root((X))\n```\n'
    );

    expect(status).toBe(1);
    expect(output).toContain('Missing text alternative');
  });

  test.each(['- - -', '***', '___', '= = =', '---', '==='])(
    'does not accept the rule %s as the text alternative',
    (rule) => {
      const { status, output } = runOn(
        `Prose above.\n\n${rule}\n\n\`\`\`mermaid\nmindmap\n  root((X))\n\`\`\`\n`
      );

      expect(status).toBe(1);
      expect(output).toContain('Missing text alternative');
    }
  );

  test('accepts prose that follows a horizontal rule', () => {
    const { status, output } = runOn(
      '---\n\nBands.\n\n```mermaid\nblock-beta\n    columns 1\n    block:a["A"]\n    end\n```\n'
    );

    expect(status).toBe(0);
    expect(output).toContain('text alternative above the fence');
  });

  test('still reports a YAML front-matter block on a no-acc type', () => {
    const { status, output } = runOn(
      'Bands.\n\n' +
        '```mermaid\n---\nconfig:\n  flowchart:\n    useMaxWidth: true\n---\n' +
        'block-beta\n    columns 1\n    block:a["A"]\n    end\n```\n'
    );

    expect(status).toBe(1);
    expect(output).toContain('YAML front-matter');
  });

  test('still reports a mis-ordered block on a no-acc type', () => {
    const { status, output } = runOn(
      'Bands.\n\n```mermaid\naccTitle: T\nmindmap\n  root((X))\n```\n'
    );

    expect(status).toBe(1);
    expect(output).toContain('accTitle/accDescr must appear after the diagram type declaration');
  });

  test('rejects a YAML front-matter block inside a mermaid fence', () => {
    const { status, output } = runOn(
      '```mermaid\n---\nconfig:\n  flowchart:\n    useMaxWidth: true\n---\nflowchart TD\n  A --> B\n```\n'
    );

    expect(status).toBe(1);
    expect(output).toContain('YAML front-matter');
  });
});

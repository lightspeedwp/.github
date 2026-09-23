const { fixDiagram, fixMarkdown, findTypeLineIndex } = require('../fix-mermaid-diagrams.cjs');

describe('fixDiagram accessibility placement (#3490)', () => {
  test('inserts accTitle and accDescr directly after the type line', () => {
    expect(fixDiagram('flowchart TD\n    A --> B')).toBe(
      [
        'flowchart TD',
        '    accTitle: Flowchart',
        '    accDescr: Detailed diagram',
        '    A --> B',
      ].join('\n')
    );
  });

  test('moves accTitle/accDescr found above the type line below it', () => {
    const broken = 'accTitle: Flowchart\nflowchart TD\n    A --> B\naccDescr: Detailed diagram';

    expect(fixDiagram(broken)).toBe(
      ['flowchart TD', '    accTitle: Flowchart', '    A --> B', 'accDescr: Detailed diagram'].join(
        '\n'
      )
    );
  });

  test('keeps an existing accDescr and does not duplicate it', () => {
    const result = fixDiagram('sequenceDiagram\n  accDescr: Login flow\n  A->>B: hi');

    expect(result.match(/accDescr:/g)).toHaveLength(1);
    expect(result.split('\n')[1]).toBe('  accTitle: Sequence Diagram');
  });

  test('recognises the multi-line accDescr { } block form', () => {
    const block =
      'flowchart TD\n    accTitle: T\n    accDescr {\n      Long text\n    }\n    A --> B';

    expect(fixDiagram(block)).toBe(block);
  });

  test('skips %% directives and frontmatter when finding the type line', () => {
    const withInit = "%%{init: {'theme': 'base'}}%%\ngraph LR\n  A --> B";
    const withFrontmatter = '---\ntitle: Example\n---\nflowchart LR\n  A --> B';

    expect(fixDiagram(withInit).split('\n').slice(0, 3)).toEqual([
      "%%{init: {'theme': 'base'}}%%",
      'graph LR',
      '  accTitle: Graph Diagram',
    ]);
    expect(fixDiagram(withFrontmatter).split('\n').slice(3, 5)).toEqual([
      'flowchart LR',
      '  accTitle: Flowchart',
    ]);
  });

  test('is idempotent', () => {
    const once = fixDiagram('accTitle: X\ngantt\n  title Plan');

    expect(fixDiagram(once)).toBe(once);
  });

  test('leaves diagrams with no type line alone', () => {
    expect(findTypeLineIndex(['%% only a comment', ''])).toBe(-1);
    expect(fixDiagram('%% only a comment')).toBe('%% only a comment');
  });

  test('never adds accessibility lines to typeless snippets, and removes injected ones', () => {
    const snippet =
      'accTitle: Diagram\nstyle A fill:#f1f5f9,color:#0f172a,stroke:#334155\naccDescr: Detailed diagram';

    expect(fixDiagram(snippet)).toBe('style A fill:#f1f5f9,color:#0f172a,stroke:#334155');
  });

  test.each([
    'block-beta\n  columns 1\n  A',
    'sankey-beta\n  A,B,1',
    'mindmap\n  root((R))\n    A',
  ])('does not inject into types that reject accTitle: %s', (diagram) => {
    expect(fixDiagram(`accTitle: Diagram\n${diagram}\naccDescr: Detailed diagram`)).toBe(diagram);
  });

  test('keeps author-written accessibility text on unsupported types untouched', () => {
    expect(fixDiagram('block-beta\n  %% accTitle: kept as comment\n  A')).toBe(
      'block-beta\n  %% accTitle: kept as comment\n  A'
    );
  });
});

describe('fixMarkdown', () => {
  test('rewrites only blocks whose content changes', () => {
    const fixedBlock = '```mermaid\nflowchart TD\n  accTitle: T\n  accDescr: D\n  A --> B\n```';
    const indentedFixed =
      '- item\n\n  ```mermaid\n  flowchart TD\n    accTitle: T\n    accDescr: D\n  ```';

    expect(fixMarkdown(`# Doc\n\n${fixedBlock}\n`)).toEqual({
      content: `# Doc\n\n${fixedBlock}\n`,
      modified: false,
    });
    expect(fixMarkdown(indentedFixed).modified).toBe(false);
  });

  test('ignores ```mermaid written inline in prose', () => {
    const prose =
      'The diagram type must be the first line after the opening ` ```mermaid ` fence.\n' +
      'More text with a code span ` ``` ` here.\n';

    expect(fixMarkdown(prose)).toEqual({ content: prose, modified: false });
  });

  test('keeps the fence indentation of blocks nested in lists', () => {
    const { content } = fixMarkdown('- item\n\n  ```mermaid\n  flowchart TD\n    A --> B\n  ```\n');

    expect(content).toBe(
      '- item\n\n  ```mermaid\n  flowchart TD\n    accTitle: Flowchart\n    accDescr: Detailed diagram\n    A --> B\n  ```\n'
    );
  });

  test('repairs a broken block and reports the change', () => {
    const { content, modified } = fixMarkdown(
      '```mermaid\naccTitle: T\nflowchart TD\n  A --> B\n```'
    );

    expect(modified).toBe(true);
    expect(content).toBe(
      '```mermaid\nflowchart TD\n  accTitle: T\n  accDescr: Detailed diagram\n  A --> B\n```'
    );
  });

  test('a closing fence indented differently from the opening does not swallow later content', () => {
    const doc =
      '1. Step\n\n   ```mermaid\n   flowchart TD\n     A --> B\n```\n\nProse between.\n\n```mermaid\nflowchart LR\n  C --> D\n```\n';
    const { content } = fixMarkdown(doc);

    expect(content).toContain('Prose between.');
    expect(content.match(/```mermaid/g)).toHaveLength(2);
    expect(content).toContain('flowchart LR\n  accTitle: Flowchart');
  });
});

describe('fixDiagram duplicates (#3490 review)', () => {
  test('drops a misplaced accTitle when one already follows the type line', () => {
    const result = fixDiagram(
      'accTitle: Old\nflowchart TD\n  accTitle: New\n  accDescr: D\n  A --> B'
    );

    expect(result.match(/accTitle:/g)).toHaveLength(1);
    expect(result).toContain('accTitle: New');
  });

  test('collapses identical accTitle lines that already follow the type line (Copilot #3491)', () => {
    const result = fixDiagram(
      'graph LR\naccTitle: Graph Diagram\naccTitle: Graph Diagram\n    A --> B'
    );

    expect(result.match(/accTitle:/g)).toHaveLength(1);
    expect(fixDiagram(result)).toBe(result);
  });

  test('drops injected boilerplate when an authored statement of the same kind exists', () => {
    const block =
      'flowchart TD\n  accTitle: Release flow\n  accDescr {\n    Real text\n  }\n  A --> B\naccDescr: Detailed diagram';

    expect(fixDiagram(block)).toBe(
      'flowchart TD\n  accTitle: Release flow\n  accDescr {\n    Real text\n  }\n  A --> B'
    );
  });

  test('moves a misplaced multi-line accDescr { } block below the type line (Copilot #3491)', () => {
    const result = fixDiagram('accDescr {\n  Long text\n}\nflowchart TD\n  A --> B');

    expect(result).toBe(
      [
        'flowchart TD',
        '  accTitle: Flowchart',
        '  accDescr {',
        '    Long text',
        '  }',
        '  A --> B',
      ].join('\n')
    );
    expect(fixDiagram(result)).toBe(result);
  });
});

describe('CodeRabbit review on #3491', () => {
  test('normalises the no-colon form and drops boilerplate next to it', () => {
    const block = [
      'flowchart TD',
      '  accTitle: Flowchart',
      '  accTitle "Phase 4 Planning Workflow"',
      '  accDescr "Project planning workflow"',
      '  A --> B',
      'accDescr: Detailed diagram',
    ].join('\n');

    expect(fixDiagram(block)).toBe(
      [
        'flowchart TD',
        '  accTitle: Phase 4 Planning Workflow',
        '  accDescr: Project planning workflow',
        '  A --> B',
      ].join('\n')
    );
  });

  test('treats flowchart-elk as a type that takes accessibility statements', () => {
    expect(fixDiagram('accTitle: T\nflowchart-elk TD\n  A --> B').split('\n').slice(0, 2)).toEqual([
      'flowchart-elk TD',
      '  accTitle: T',
    ]);
  });
});

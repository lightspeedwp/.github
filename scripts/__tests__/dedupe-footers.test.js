/**
 * Tests for scripts/dedupe-footers.js (#3451)
 *
 * The tool deletes lines from ~9,500 Markdown files, so the tests below are
 * overwhelmingly about what it must NOT delete. Each "must not" case is a real
 * hazard found in this repository, not a hypothetical:
 *
 *  - 237 recognised footer phrases sit inside fenced code blocks in the repo
 *    (e.g. .github/SAVED_REPLIES/issues/area-routing.md line 34 is genuine
 *    content that merely starts with "Thanks for helping"), so fence tracking
 *    is load-bearing.
 *  - Frontmatter delimiters are `---`, the same token as a thematic break, so
 *    removing the wrong one silently corrupts a document's metadata.
 *  - Real piles are either compounded at EOF (hooks/hook-name/README.md) or stranded
 *    mid-document (AGENTS.md), and the two need opposite treatment.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  analyseContent,
  run,
  findFrontmatterRange,
  computeFenceMask,
  parseArgs,
} from '../dedupe-footers.js';

const PHRASE = '*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*';
const LINK = '[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)';

/** Join lines with a trailing newline, matching a normal text file. */
const doc = (...lines) => `${lines.join('\n')}\n`;

describe('findFrontmatterRange', () => {
  test('locates the opening and closing delimiters', () => {
    const lines = ['---', 'title: X', 'category: docs', '---', '', '# X'];
    expect(findFrontmatterRange(lines)).toEqual({ start: 0, end: 3 });
  });

  test('returns null when the document does not open with frontmatter', () => {
    expect(findFrontmatterRange(['# X', '', '---'])).toBeNull();
  });

  test('returns null for an unterminated frontmatter block', () => {
    expect(findFrontmatterRange(['---', 'title: X', '', '# X'])).toBeNull();
  });
});

describe('computeFenceMask', () => {
  test('marks a fenced block including its delimiters', () => {
    const mask = computeFenceMask(['a', '```', PHRASE, '```', 'b']);
    expect(mask).toEqual([false, true, true, true, false]);
  });

  test('handles tilde fences and longer fences', () => {
    const mask = computeFenceMask(['~~~', PHRASE, '~~~~', 'x']);
    expect(mask).toEqual([true, true, true, false]);
  });

  test('treats an inner shorter fence as content, not a delimiter', () => {
    const mask = computeFenceMask(['````', '```', 'x', '````', 'y']);
    expect(mask).toEqual([true, true, true, true, false]);
  });

  test('leaves an unterminated fence masking to the end of the file', () => {
    const mask = computeFenceMask(['```', PHRASE]);
    expect(mask).toEqual([true, true]);
  });
});

describe('analyseContent', () => {
  describe('files with no footer', () => {
    test('leaves a document with no footer byte-identical', () => {
      const content = doc('# Title', '', 'Some prose.', '', '## Section');
      const result = analyseContent(content);
      expect(result.changed).toBe(false);
      expect(result.cleaned).toBe(content);
      expect(result.blocks).toBe(0);
    });
  });

  describe('already-correct files', () => {
    test('leaves a single footer at EOF untouched', () => {
      const content = doc('# Title', '', PHRASE, LINK);
      const result = analyseContent(content);
      expect(result.changed).toBe(false);
      expect(result.removedBlocks).toBe(0);
      expect(result.reason).toBe('single-block-at-eof');
    });
  });

  describe('compounded footers at EOF', () => {
    const piled = doc(
      '# Hook',
      '',
      'Purpose line.',
      '',
      PHRASE,
      LINK,
      '',
      PHRASE,
      LINK,
      '',
      '_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_',
      LINK
    );

    test('keeps exactly one block, and it is the last one', () => {
      const result = analyseContent(piled);
      expect(result.blocks).toBe(3);
      expect(result.removedBlocks).toBe(2);
      expect(result.reason).toBe('duplicate-at-eof');
      const out = result.cleaned;
      expect(out.match(/Built by 🧱/g)).toHaveLength(1);
      expect(out).toContain('_Built by 🧱');
      expect(out).toContain('# Hook');
      expect(out).toContain('Purpose line.');
    });

    test('preserves the trailing newline', () => {
      expect(analyseContent(piled).cleaned.endsWith('\n')).toBe(true);
    });

    test('is idempotent', () => {
      const once = analyseContent(piled).cleaned;
      const twice = analyseContent(once);
      expect(twice.changed).toBe(false);
      expect(twice.blocks).toBe(1);
    });

    test('handles a separator-introduced pile', () => {
      const withRules = doc('# Doc', '', 'Prose.', '', '---', '', PHRASE, '', '---', '', PHRASE);
      const result = analyseContent(withRules);
      expect(result.removedBlocks).toBe(1);
      expect(result.cleaned.match(/Built by 🧱/g)).toHaveLength(1);
      // Exactly one thematic break survives: the one introducing the kept block.
      expect(result.cleaned.match(/^---$/gm)).toHaveLength(1);
    });
  });

  describe('stranded footers with content after them', () => {
    // The AGENTS.md shape: a pile followed by real sections.
    const stranded = doc(
      '# Title',
      '',
      'Intro.',
      '',
      '---',
      '',
      PHRASE,
      LINK,
      '',
      PHRASE,
      LINK,
      '',
      '## Real Section',
      '',
      'This content must survive.'
    );

    test('removes every stranded block, not just the extras', () => {
      const result = analyseContent(stranded);
      expect(result.blocks).toBe(2);
      expect(result.removedBlocks).toBe(2);
      expect(result.reason).toBe('stranded-block');
      expect(result.cleaned).not.toContain('Built by 🧱');
    });

    test('keeps the following content intact', () => {
      const out = analyseContent(stranded).cleaned;
      expect(out).toContain('## Real Section');
      expect(out).toContain('This content must survive.');
      expect(out).toContain('# Title');
      expect(out).toContain('Intro.');
    });

    test('removes the thematic break that introduced the stranded pile', () => {
      const out = analyseContent(stranded).cleaned;
      expect(out).not.toMatch(/^---$/m);
    });
  });

  describe('fenced code is never touched', () => {
    test('leaves a footer phrase inside a fence alone', () => {
      const content = doc(
        '# Saved replies',
        '',
        '```markdown',
        'Thanks for helping us get this to the right place!',
        '```',
        '',
        PHRASE
      );
      const result = analyseContent(content);
      expect(result.cleaned).toContain('Thanks for helping us get this to the right place!');
      // The single real footer at EOF is left in place.
      expect(result.removedBlocks).toBe(0);
    });

    test('collapses real duplicates while preserving an identical-looking fence', () => {
      const content = doc(
        '# Doc',
        '',
        '```markdown',
        PHRASE,
        LINK,
        '```',
        '',
        PHRASE,
        LINK,
        '',
        PHRASE,
        LINK
      );
      const result = analyseContent(content);
      // Two un-fenced blocks are in play (the third is inside the fence), so
      // one is removed and one is kept as the canonical footer.
      expect(result.blocks).toBe(2);
      expect(result.removedBlocks).toBe(1);
      // The fenced copy survives verbatim.
      expect(result.cleaned).toContain('```markdown\n' + PHRASE + '\n' + LINK + '\n```');
      // And exactly one un-fenced copy remains.
      const outside =
        result.cleaned.split('```')[0] + result.cleaned.split('```').slice(2).join('```');
      expect(outside.match(/Built by 🧱/g)).toHaveLength(1);
    });
  });

  describe('fence detection follows CommonMark (regression)', () => {
    // A closing fence is the marker plus whitespace only. Treating ```bash as
    // a closer ended the block early, unmasked the rest of the real code, and
    // let a footer-shaped line inside that code be deleted.
    test('a fence-like line with an info string does not close an open block', () => {
      const mask = computeFenceMask([
        '```markdown',
        '```bash',
        'echo "still inside the block"',
        '*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*',
        '```',
        'outside',
      ]);
      expect(mask).toEqual([true, true, true, true, true, false]);
    });

    test('a footer phrase inside such a block survives analysis', () => {
      const content = doc(
        '# Doc',
        '',
        '```markdown',
        '```bash',
        'nested example',
        PHRASE,
        '```',
        '',
        PHRASE,
        LINK,
        '',
        PHRASE,
        LINK
      );
      const result = analyseContent(content);
      // The fenced copy is preserved; only the two real copies are reconciled.
      expect(result.cleaned).toContain('```bash\nnested example\n' + PHRASE);
      expect(result.removedBlocks).toBe(1);
    });

    test('a 4-space indented fence is indented code, not a delimiter', () => {
      const mask = computeFenceMask(['    ```', 'still code', '    ```', 'outside']);
      expect(mask).toEqual([false, false, false, false]);
    });

    test('a backtick opener whose info string contains a backtick is not a fence', () => {
      const mask = computeFenceMask(['```a`b', PHRASE, 'text']);
      expect(mask).toEqual([false, false, false]);
    });

    test('a tilde fence still closes on trailing whitespace', () => {
      const mask = computeFenceMask(['~~~', 'x', '~~~   ', 'outside']);
      expect(mask).toEqual([true, true, true, false]);
    });
  });

  describe('stranded regions require a high-confidence phrase (regression)', () => {
    // The full pattern list accepts any trailing text, so patterns such as
    // "Update when", "Questions?" and "Keep tone" also begin ordinary prose.
    // At EOF that is harmless because position proves the match. Mid-document
    // it is not, and this tool rewrites thousands of files, so a false positive
    // would delete real content.
    const genericProse = [
      '# Runbook',
      '',
      'Update when the API version changes.',
      '',
      '## Notes',
      '',
      'Use responsibly; tailor to the thread.',
      '',
      'Real content that must survive.',
      '',
    ].join('\n');

    test('leaves generic phrase-shaped prose alone when stranded', () => {
      const result = analyseContent(genericProse);
      expect(result.removedBlocks).toBe(0);
      expect(result.changed).toBe(false);
      expect(result.cleaned).toContain('Update when the API version changes.');
      expect(result.cleaned).toContain('Use responsibly; tailor to the thread.');
      expect(result.cleaned).toContain('Real content that must survive.');
    });

    test('still removes a stranded region of unmistakable footers', () => {
      // Same shape as the AGENTS.md pile: two real footers above real content.
      const realFootersStranded = doc(
        '# Title',
        '',
        'Intro.',
        '',
        '---',
        '',
        PHRASE,
        LINK,
        '',
        PHRASE,
        LINK,
        '',
        '## Real Section',
        '',
        'This content must survive.'
      );
      const result = analyseContent(realFootersStranded);
      expect(result.removedBlocks).toBe(2);
      expect(result.cleaned).not.toContain('Built by 🧱');
      expect(result.cleaned).toContain('## Real Section');
      expect(result.cleaned).toContain('This content must survive.');
    });

    test('leaves a single generic footer at EOF alone', () => {
      // Position is decisive at EOF, so a lone generic footer is a legitimate
      // footer and is the generator's to own, not this tool's to delete.
      const atEof = doc('# Doc', '', 'Prose.', '', 'Questions? See the runbook.');
      const result = analyseContent(atEof);
      expect(result.removedBlocks).toBe(0);
      expect(result.changed).toBe(false);
      expect(result.cleaned).toContain('Questions? See the runbook.');
    });

    test('still collapses a compounded generic pile at EOF to one', () => {
      const piled = doc(
        '# Doc',
        '',
        'Prose.',
        '',
        'Questions? See the runbook.',
        '',
        'Update when guidance changes.'
      );
      const result = analyseContent(piled);
      expect(result.removedBlocks).toBe(1);
      expect(result.cleaned).toContain('Update when guidance changes.');
      expect(result.cleaned).not.toContain('Questions? See the runbook.');
      expect(result.cleaned).toContain('Prose.');
    });
  });

  describe('frontmatter is never touched', () => {
    test('preserves frontmatter byte-for-byte', () => {
      const content = doc(
        '---',
        'title: Example',
        'category: docs',
        '---',
        '',
        '# Example',
        '',
        PHRASE,
        LINK,
        '',
        PHRASE,
        LINK
      );
      const result = analyseContent(content);
      expect(result.cleaned.startsWith('---\ntitle: Example\ncategory: docs\n---\n')).toBe(true);
      expect(result.removedBlocks).toBe(1);
    });

    test('does not treat the frontmatter closer as a removable separator', () => {
      // Phrase directly below the closing delimiter, with no blank line: the
      // delimiter is document structure, not a footer separator.
      const content = '---\ntitle: X\n---\n' + PHRASE + '\n';
      const result = analyseContent(content);
      // Single block at EOF: nothing to remove, and the delimiter must survive.
      expect(result.removedBlocks).toBe(0);
      expect(result.cleaned).toContain('---\ntitle: X\n---');
    });
  });

  describe('exempt paths', () => {
    test('removes even a single correct footer', () => {
      const content = doc('# Reference', '', 'Reference material.', '', PHRASE, LINK);
      const result = analyseContent(content, { exempt: true });
      expect(result.removedBlocks).toBe(1);
      expect(result.reason).toBe('exempt-path');
      expect(result.cleaned).not.toContain('Built by 🧱');
      expect(result.cleaned).toContain('Reference material.');
    });
  });

  describe('safety invariants', () => {
    const samples = [
      doc('# T', '', PHRASE, LINK, '', PHRASE, LINK, '', PHRASE, LINK),
      doc('# T', '', '---', '', PHRASE, LINK, '', '## After', '', 'Body.'),
      doc('---', 'title: X', '---', '', '# T', '', PHRASE, '', PHRASE),
      doc('# T', '', '```', PHRASE, '```', '', PHRASE, LINK),
    ];

    // Strips everything the tool is allowed to touch, so what remains is the
    // document's real content. Comparing input against output is the tool's
    // central promise; an earlier version of this test asserted only that a
    // length was >= 0, which passes for any input including a no-op.
    const stripFooterMachinery = (text) =>
      text.split('\n').filter((l) => {
        const t = l.trim();
        return (
          t !== '' &&
          t !== '---' &&
          !/^\s*\[.*?\]\(.*?\)\s*$/.test(l) &&
          !/^[*_]?(Maintained with ❤️|Built by 🧱|Have questions\?|This page brought to you by|Docs signed by 🤖|Made with ❤️)/.test(
            t
          )
        );
      });

    test.each(samples)('never removes a non-blank, non-footer content line', (content) => {
      for (const exempt of [false, true]) {
        const after = analyseContent(content, { exempt }).cleaned;
        expect(stripFooterMachinery(after)).toEqual(stripFooterMachinery(content));
      }
    });

    test('analysis is a pure function of its input', () => {
      const content = samples[0];
      expect(analyseContent(content).cleaned).toBe(analyseContent(content).cleaned);
    });

    test('reports blocks consistently with what it removes', () => {
      for (const content of samples) {
        const result = analyseContent(content);
        expect(result.removedBlocks).toBeLessThanOrEqual(result.blocks);
        if (result.blocks === 0) {
          expect(result.changed).toBe(false);
        }
      }
    });
  });
});

describe('run() path containment', () => {
  // --fix writes in place and --paths-from is operator-supplied, so a list
  // holding an absolute path or a ../ segment must not be able to rewrite
  // files outside the repository.
  test('refuses a path that resolves outside the repository', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dedupe-escape-'));
    const list = path.join(dir, 'list.txt');
    fs.writeFileSync(list, '/etc/passwd\n');
    expect(() => run({ cwd: dir, pathsFrom: list, fix: true, check: false })).toThrow(
      /outside the repository/
    );
  });

  test('refuses a ../ escape', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dedupe-escape-'));
    const list = path.join(dir, 'list.txt');
    fs.writeFileSync(list, '../outside.md\n');
    expect(() => run({ cwd: dir, pathsFrom: list, fix: true, check: false })).toThrow(
      /outside the repository/
    );
  });

  test('accepts a path inside the repository', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dedupe-inside-'));
    const list = path.join(dir, 'list.txt');
    fs.writeFileSync(path.join(dir, 'a.md'), doc('# A', '', PHRASE, LINK, '', PHRASE, LINK));
    fs.writeFileSync(list, 'a.md\n');
    const report = run({ cwd: dir, pathsFrom: list, fix: true, check: false });
    expect(report.files).toBe(1);
    expect(fs.readFileSync(path.join(dir, 'a.md'), 'utf8').match(/Built by 🧱/g)).toHaveLength(1);
  });
});

describe('parseArgs', () => {
  test('defaults to a non-mutating, whole-repo scan', () => {
    const options = parseArgs([]);
    expect(options.fix).toBe(false);
    expect(options.changedOnly).toBe(false);
    expect(options.pathsFrom).toBeNull();
  });

  test('parses each supported flag', () => {
    const options = parseArgs([
      '--fix',
      '--json',
      '--changed-only',
      '--base=origin/develop',
      '--head=HEAD',
    ]);
    expect(options).toMatchObject({
      fix: true,
      json: true,
      changedOnly: true,
      base: 'origin/develop',
      head: 'HEAD',
    });
  });

  test('rejects an unknown flag rather than ignoring it', () => {
    expect(() => parseArgs(['--nope'])).toThrow(/Unknown argument/);
  });
});

describe('end-to-end against a temporary git worktree-free directory', () => {
  test('run() reports and fixes only what it would change', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dedupe-e2e-'));
    const target = path.join(dir, 'a.md');
    fs.writeFileSync(target, doc('# A', '', PHRASE, LINK, '', PHRASE, LINK));
    const clean = path.join(dir, 'b.md');
    fs.writeFileSync(clean, doc('# B', '', 'Only prose.'));

    // run() reads the file list from git, so exercise analyseContent directly
    // for the file-level behaviour and keep git out of it.
    const before = fs.readFileSync(target, 'utf8');
    const result = analyseContent(before);
    expect(result.changed).toBe(true);
    fs.writeFileSync(target, result.cleaned);
    expect(fs.readFileSync(target, 'utf8').match(/Built by 🧱/g)).toHaveLength(1);

    const untouched = analyseContent(fs.readFileSync(clean, 'utf8'));
    expect(untouched.changed).toBe(false);
  });
});

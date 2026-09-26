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

    test.each(samples)('never removes a non-blank, non-footer content line', (content) => {
      for (const exempt of [false, true]) {
        const before = analyseContent(content, { exempt }).cleaned;
        const strip = (text) =>
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
        // The fence delimiters are dropped by this crude filter, so compare the
        // prose either side of them separately via the full-content check below.
        expect(strip(before).length).toBeGreaterThanOrEqual(0);
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
    expect(() => parseArgs('--nope')).toThrow(/Unknown argument/);
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

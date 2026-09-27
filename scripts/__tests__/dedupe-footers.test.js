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

import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  analyseContent,
  run,
  findFrontmatterRange,
  computeFenceMask,
  parseArgs,
  listChangedMarkdownFiles,
} from '../dedupe-footers.js';
import { isIndentedCodeLine } from '../agents/includes/footer-policy.js';

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

    // This test previously asserted the opposite, and encoded a data-loss bug:
    // "Questions? See the runbook." and "Update when guidance changes." are
    // ordinary prose. Real examples in this repo are
    // docs/RELEASE_RUNBOOK_MAJOR.md ("Questions? Reply in thread.") and
    // PHASE-5-ROLLOUT.md ("Questions? Ask in #engineering..."). The block's own
    // comment above already explains that a generic phrase at EOF is only
    // harmless because position proves the match -- which is true of the one
    // block that is kept, not of the earlier ones this tool would have deleted.
    test('leaves an all-generic EOF group alone rather than deleting prose', () => {
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
      expect(result.removedBlocks).toBe(0);
      expect(result.changed).toBe(false);
      expect(result.cleaned).toContain('Update when guidance changes.');
      expect(result.cleaned).toContain('Questions? See the runbook.');
      expect(result.cleaned).toContain('Prose.');
    });

    test('removes the duplicate footer but keeps prose sharing its group', () => {
      // A genuine footer and an ordinary sentence can end up in the same
      // blank-line-separated group. The footer being real says nothing about
      // the sentence, so only the block carrying its own evidence is removed.
      const piled = doc(
        '# Doc',
        '',
        'Prose.',
        '',
        'Questions? See the runbook.',
        '',
        '*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*',
        '',
        '*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*'
      );
      const result = analyseContent(piled);
      expect(result.removedBlocks).toBe(1);
      expect(result.cleaned).toContain('Questions? See the runbook.');
      expect(result.cleaned.match(/Docs signed by/g) || []).toHaveLength(1);
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

  test('force defaults to off and is parsed explicitly', () => {
    expect(parseArgs([]).force).toBe(false);
    expect(parseArgs(['--fix']).force).toBe(false);
    expect(parseArgs(['--fix', '--force']).force).toBe(true);
  });

  test('rejects an unknown flag rather than ignoring it', () => {
    expect(() => parseArgs(['--nope'])).toThrow(/Unknown argument/);
  });
});

describe('a CRLF document is fenced the same as an LF one', () => {
  // In JavaScript regex `.` does not match `\r`, so a fence pattern ending
  // `(.*)$` fails outright on a CRLF line. The fence was then never recognised,
  // which unmasked everything after it -- so a footer phrase inside a code block
  // in a CRLF file was deleted as if it were real content.
  const fenced =
    'Intro.\r\n\r\n```bash\r\n*Docs signed by \u{1F916} Copilot for LightSpeedWP \u2013 always fresh!*\r\n```\r\n';

  test('masks a fenced block that uses CRLF endings', () => {
    const mask = computeFenceMask(fenced.split('\n'));

    expect(mask[2]).toBe(true);
    expect(mask[3]).toBe(true);
    expect(mask[4]).toBe(true);
    expect(mask[5]).toBe(false);
  });

  test('leaves a footer phrase inside a CRLF fenced block alone', () => {
    const result = analyseContent(fenced, { exempt: false });

    expect(result.changed).toBe(false);
    expect(result.cleaned).toContain('Docs signed by');
  });

  test('still collapses a genuine CRLF duplicate outside the fence', () => {
    const duplicate =
      'Intro.\r\n\r\n```\r\ncode\r\n```\r\n\r\n' +
      '*Docs signed by \u{1F916} Copilot for LightSpeedWP \u2013 always fresh!*\r\n\r\n' +
      '*Docs signed by \u{1F916} Copilot for LightSpeedWP \u2013 always fresh!*\r\n';

    const result = analyseContent(duplicate, { exempt: false });

    expect(result.removedBlocks).toBe(1);
    expect(result.cleaned.match(/Docs signed by/g) || []).toHaveLength(1);
  });
});

describe('--fix refuses a dirty working tree', () => {
  // A repro run of the default --fix scan once rewrote 9,536 files as a side
  // effect, burying whatever the operator already had in progress. The guard
  // makes that impossible without an explicit opt-in.
  function initRepo(dir) {
    execFileSync('git', ['init', '-q'], { cwd: dir });
    execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: dir });
    execFileSync('git', ['config', 'user.name', 'Test'], { cwd: dir });
  }

  const stacked = doc(
    '# Doc',
    '',
    '*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*',
    '',
    '*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*'
  );

  function seedRepo(dir, { dirty }) {
    initRepo(dir);
    fs.writeFileSync(path.join(dir, 'README.md'), stacked);
    execFileSync('git', ['add', '-A'], { cwd: dir });
    execFileSync('git', ['commit', '-qm', 'seed'], { cwd: dir });
    if (dirty) {
      fs.writeFileSync(path.join(dir, 'notes.md'), 'in progress\n');
      execFileSync('git', ['add', '-A'], { cwd: dir });
    }
  }

  test('refuses to rewrite when uncommitted work is present', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dedupe-dirty-'));
    seedRepo(dir, { dirty: true });

    expect(() => run({ fix: true, force: false, cwd: dir, pathsFrom: null })).toThrow(
      /uncommitted changes/
    );

    // The refusal must happen before anything is written.
    expect(fs.readFileSync(path.join(dir, 'README.md'), 'utf8')).toBe(stacked);
  });

  test('rewrites a dirty tree when the operator passes --force', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dedupe-force-'));
    seedRepo(dir, { dirty: true });

    run({ fix: true, force: true, cwd: dir, pathsFrom: null });

    const cleaned = fs.readFileSync(path.join(dir, 'README.md'), 'utf8');
    expect(cleaned.match(/Built by/g) || []).toHaveLength(1);
  });

  test('an untracked file does not block a rewrite', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dedupe-untracked-'));
    seedRepo(dir, { dirty: false });
    // The tool only rewrites files it enumerates, and both path sources cover
    // tracked files only, so an untracked scratch file cannot be touched by it.
    // Blocking here would break the #3589 batch workflow, which writes a paths
    // list to disk.
    fs.writeFileSync(path.join(dir, 'batch-paths.txt'), 'README.md\n');

    run({ fix: true, force: false, cwd: dir, pathsFrom: null });

    const cleaned = fs.readFileSync(path.join(dir, 'README.md'), 'utf8');
    expect(cleaned.match(/Built by/g) || []).toHaveLength(1);
  });

  test('a dry run is never blocked', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dedupe-check-'));
    seedRepo(dir, { dirty: true });

    // CI and repro work both run --check against a dirty tree.
    const report = run({ fix: false, force: false, cwd: dir, pathsFrom: null });

    expect(report.files).toBeGreaterThan(0);
    expect(fs.readFileSync(path.join(dir, 'README.md'), 'utf8')).toBe(stacked);
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

describe('exempt paths keep real prose (data integrity)', () => {
  // A generic phrase like "Update when ..." also matches ordinary prose that
  // merely ends a document. On a non-exempt path the trailing block is always
  // kept, so position provides the safety. On an exempt path nothing is kept,
  // so without a high-confidence requirement a bulk --fix deletes real content
  // across the ~5,500 exempt files.
  test('leaves exempt-path prose ending in a generic phrase untouched', () => {
    const body = 'Some real prose here.\n\nUpdate when the API version changes.\n';

    expect(analyseContent(body, { exempt: true }).changed).toBe(false);
  });

  test('still removes a genuine footer from an exempt path', () => {
    const body =
      'Doc body.\n\n_Docs signed by \u{1F916} Copilot for LightSpeedWP \u2013 always fresh!_\n';
    const result = analyseContent(body, { exempt: true });

    expect(result.changed).toBe(true);
    expect(result.removedBlocks).toBe(1);
    expect(result.cleaned).toContain('Doc body.');
    expect(result.cleaned).not.toContain('Docs signed by');
  });
});

describe('run() refuses to write through a symlink that escapes the repository', () => {
  // --fix writes in place, and Node follows a symlink for both the read and the
  // write. A lexical path check passes a repo-local link pointing outside, so
  // containment has to be verified physically or an external file is rewritten.
  test('rejects a --paths-from entry that is a link to an external file', () => {
    const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'dedupe-repo-'));
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'dedupe-outside-'));
    const target = path.join(outside, 'external.md');
    fs.writeFileSync(
      target,
      'External.\n\n_Docs signed by \u{1F916} Copilot for LightSpeedWP \u2013 always fresh!_\n' +
        '\n_Docs signed by \u{1F916} Copilot for LightSpeedWP \u2013 always fresh!_\n'
    );
    const before = fs.readFileSync(target, 'utf8');

    const link = path.join(repo, 'linked.md');
    fs.symlinkSync(target, link);
    const listFile = path.join(repo, 'paths.txt');
    fs.writeFileSync(listFile, 'linked.md\n');

    try {
      expect(() => run({ cwd: repo, fix: true, pathsFrom: listFile })).toThrow(
        /resolves outside the repository/
      );
      // The external file must be untouched.
      expect(fs.readFileSync(target, 'utf8')).toBe(before);
    } finally {
      fs.rmSync(repo, { recursive: true, force: true });
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });
});

describe('a tracked symlink cannot escape the repository via the git-derived scan', () => {
  // The physical containment guard originally sat behind the --paths-from
  // branch. But the default scan uses `git ls-files`, which selects tracked
  // symlinks, and it is the path the CI guard runs. Without the guard covering
  // every path source, `validate:footers:fix` rewrote a target outside the
  // repository.
  test('refuses a tracked symlink that resolves outside the repository', () => {
    const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'dedupe-git-repo-'));
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'dedupe-git-out-'));
    const target = path.join(outside, 'external.md');
    fs.writeFileSync(
      target,
      'External.\n\n_Docs signed by \u{1F916} Copilot for LightSpeedWP \u2013 always fresh!_\n' +
        '\n_Docs signed by \u{1F916} Copilot for LightSpeedWP \u2013 always fresh!_\n'
    );
    const before = fs.readFileSync(target, 'utf8');

    const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8' });
    git('init', '-q');
    git('config', 'user.email', 'test@example.com');
    git('config', 'user.name', 'test');
    fs.writeFileSync(path.join(repo, 'README.md'), '# Repo\n');
    fs.symlinkSync(target, path.join(repo, 'linked.md'));
    git('add', '-A');
    git('commit', '-q', '-m', 'init');

    try {
      expect(() => run({ cwd: repo, fix: true })).toThrow(/resolves outside the repository/);
      expect(fs.readFileSync(target, 'utf8')).toBe(before);
    } finally {
      fs.rmSync(repo, { recursive: true, force: true });
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });
});

describe('listChangedMarkdownFiles handles a tree-object base', () => {
  // A first push resolves `base` to the empty tree. A symmetric difference
  // needs two commits, so `base...head` errors with "is a tree, not a commit"
  // and takes the whole scan down. The two-dot form is the correct diff there.
  test('diffs against the empty tree without throwing', () => {
    const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'dedupe-tree-'));
    const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8' });
    git('init', '-q');
    git('config', 'user.email', 'test@example.com');
    git('config', 'user.name', 'test');
    fs.writeFileSync(path.join(repo, 'a.md'), '# A\n');
    fs.writeFileSync(path.join(repo, 'b.md'), '# B\n');
    git('add', '-A');
    git('commit', '-q', '-m', 'init');

    try {
      const emptyTree = execFileSync('git', ['hash-object', '-t', 'tree', '/dev/null'], {
        cwd: repo,
        encoding: 'utf8',
      }).trim();
      const files = listChangedMarkdownFiles(repo, emptyTree, 'HEAD');

      expect(files.sort()).toEqual(['a.md', 'b.md']);
    } finally {
      fs.rmSync(repo, { recursive: true, force: true });
    }
  });
});

describe('an indented footer phrase is code content, not a footer', () => {
  // CommonMark treats 4+ leading spaces or a leading tab as an indented code
  // block. Every phrase matcher trims before matching, so without an explicit
  // guard an indented example line is classified as a footer and deleted.
  // A lone indented line at EOF is the kept block, so it survives regardless of
  // the guard. The real exposure needs two indented lines: the earlier one
  // becomes a removal candidate and, without the guard, is deleted as example
  // code.
  test('leaves a duplicated footer phrase indented as a code block', () => {
    const body =
      'Intro.\n\n' +
      '    *Docs signed by \u{1F916} Copilot for LightSpeedWP \u2013 always fresh!*\n\n' +
      '    *Docs signed by \u{1F916} Copilot for LightSpeedWP \u2013 always fresh!*\n';

    const result = analyseContent(body, { exempt: false });

    expect(result.changed).toBe(false);
    expect(result.cleaned.match(/Docs signed by/g) || []).toHaveLength(2);
  });

  test('leaves a footer phrase indented under a list item', () => {
    const body =
      'Intro.\n\n- Item\n\n\t*Built by \u{1F9F1} LightSpeedWP with \u2615, \u{1F680}, and open-source spirit!*\n';

    const result = analyseContent(body, { exempt: false });

    expect(result.changed).toBe(false);
    expect(result.cleaned).toContain('Built by');
  });

  test('isIndentedCodeLine counts columns, not leading characters', () => {
    expect(isIndentedCodeLine('    text')).toBe(true);
    expect(isIndentedCodeLine('\ttext')).toBe(true);
    expect(isIndentedCodeLine('   text')).toBe(false);
    expect(isIndentedCodeLine('text')).toBe(false);
    // A tab advances to the next multiple of four, so fewer than four leading
    // spaces followed by a tab still reaches four columns.
    expect(isIndentedCodeLine('  \ttext')).toBe(true);
    expect(isIndentedCodeLine(' \ttext')).toBe(true);
    expect(isIndentedCodeLine('   \ttext')).toBe(true);
    expect(isIndentedCodeLine('  text')).toBe(false);
  });

  test('leaves a duplicated footer phrase indented with a mixed tab', () => {
    // "  \t" is four columns of indentation, so these are example lines rather
    // than footers and a bulk --fix must not delete the first of the pair.
    const body =
      'Intro.\n\n' +
      '  \t*Docs signed by \u{1F916} Copilot for LightSpeedWP \u2013 always fresh!*\n\n' +
      '  \t*Docs signed by \u{1F916} Copilot for LightSpeedWP \u2013 always fresh!*\n';

    const result = analyseContent(body, { exempt: false });

    expect(result.changed).toBe(false);
    expect(result.cleaned.match(/Docs signed by/g) || []).toHaveLength(2);
  });
});

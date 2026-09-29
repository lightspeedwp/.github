/**
 * Tests for the footer-shape measurement script. These cover the inventory and
 * matching rules rather than the corpus totals: the totals move every time a
 * footer is rewritten, so asserting them here would fail on ordinary repo work
 * and hide a real regression behind a number that was always going to change.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

import {
  buildPhraseInventory,
  knownPhraseIn,
  measure,
  CURATED_PHRASES,
} from '../measure-footer-shape.js';

describe('measure-footer-shape', () => {
  describe('the known-phrase inventory', () => {
    test('is built from the repository configuration and is not empty', () => {
      const inv = buildPhraseInventory();
      expect(inv.size).toBeGreaterThan(10);
    });

    test('includes footers declared in quirky-footers.yaml', () => {
      const inv = buildPhraseInventory();
      expect([...inv].some((p) => p.includes('open-source spirit'))).toBe(true);
    });

    test('the curated phrases are opt-out, so the list they pad is visible', () => {
      const withCurated = buildPhraseInventory(true);
      const withoutCurated = buildPhraseInventory(false);
      expect(withoutCurated.size).toBeLessThan(withCurated.size);
      for (const phrase of CURATED_PHRASES) {
        expect([...withCurated].some((p) => p.startsWith(phrase.slice(0, 25).toLowerCase()))).toBe(
          true
        );
      }
    });

    test('drops phrases too short or with no letter in them', () => {
      const inv = buildPhraseInventory();
      for (const p of inv) {
        expect(p.length).toBeGreaterThanOrEqual(15);
        expect(p).toMatch(/[a-z]/);
      }
    });
  });

  describe('knownPhraseIn', () => {
    const inv = buildPhraseInventory();

    test('matches a known phrase however the line emphasises it', () => {
      const line =
        '**Built by \u{1F9F1} LightSpeedWP with \u2615, \u{1F680}, and open-source spirit!**';
      expect(knownPhraseIn(line, inv)).toBeTruthy();
    });

    test('matches by containment, so a decorated suffix still counts', () => {
      const line =
        '*This page brought to you by the \u{1F984} Magic Automation Unicorns of LightSpeedWP.*';
      expect(knownPhraseIn(line, inv)).toBeTruthy();
    });

    test('returns null for a line that is not a known footer', () => {
      expect(knownPhraseIn('Please see CONTRIBUTING.md for details.', inv)).toBeNull();
    });

    test('returns null for a line too short to be a footer', () => {
      expect(knownPhraseIn('Thanks!', inv)).toBeNull();
    });
  });

  describe('measure', () => {
    // A full corpus run is far too slow for a unit test, so this checks the
    // shape of the report against a throwaway repository with a known layout.
    let repo;

    /** Stage and commit whatever the test just wrote, so `git ls-files` sees it. */
    const commitFixture = () => {
      execFileSync('git', ['add', '-A'], { cwd: repo });
      execFileSync('git', ['commit', '-q', '-m', 'fixture'], { cwd: repo });
    };

    beforeAll(() => {
      repo = fs.mkdtempSync(path.join(os.tmpdir(), 'footer-shape-measure-'));
      // measure() enumerates files with `git ls-files`, so the fixture has to be
      // a real repository rather than a plain directory.
      execFileSync('git', ['init', '-q'], { cwd: repo });
      execFileSync('git', ['config', 'user.email', 'test@example.invalid'], { cwd: repo });
      execFileSync('git', ['config', 'user.name', 'Test'], { cwd: repo });
      fs.mkdirSync(path.join(repo, '.github/config'), { recursive: true });
      fs.writeFileSync(
        path.join(repo, '.github/config/quirky-footers.yaml'),
        'categories: {}\n',
        'utf8'
      );
      fs.writeFileSync(path.join(repo, '.github/footers.yml'), '{}\n', 'utf8');
      execFileSync('git', ['add', '-A'], { cwd: repo });
      execFileSync('git', ['commit', '-q', '-m', 'fixture'], { cwd: repo });
    });

    afterAll(() => {
      fs.rmSync(repo, { recursive: true, force: true });
    });

    test('reports zero for a repository with no Markdown', () => {
      const r = measure(repo);
      expect(r.scanned).toBe(0);
      expect(r.flagged).toBe(0);
      expect(r.falsePositiveRate).toBe('0.0');
      expect(r.recall).toBe('0.0');
    });

    test('the arithmetic is self-consistent', () => {
      const r = measure(repo);
      expect(r.noKnownFooter).toBe(r.flagged - r.twoKnown);
      expect(r.missed).toBe(r.groundTruth - r.caught);
      expect(r.caught).toBeLessThanOrEqual(r.groundTruth);
      expect(r.twoKnown).toBeLessThanOrEqual(r.flagged);
    });

    test('reads the configuration from the tree it is given, not the checkout', () => {
      // Two phrases only the fixture declares. If measure() built its inventory
      // from this repository's configuration instead of the fixture's, neither
      // would be found and the file would not count as ground truth. Two
      // *distinct* phrases are needed, since the count is of distinct phrases.
      const one = 'Curated by the fixture team for this measurement test.';
      const two = 'Maintained by the fixture stewards for this measurement test.';
      fs.writeFileSync(
        path.join(repo, '.github/footers.yml'),
        `phrases:\n  - "${one}"\n  - "${two}"\n`,
        'utf8'
      );
      fs.writeFileSync(
        path.join(repo, 'A.md'),
        ['# Doc', '', `*${one}*`, '', `*${two}*`, ''].join('\n'),
        'utf8'
      );
      commitFixture();

      const r = measure(repo);
      expect(r.groundTruthFiles).toContain('A.md');
    });

    test('examines eight real lines, so a file ending in a newline is not short a line', () => {
      // findTrailingFooterShapedBlocks drops the empty element a trailing newline
      // leaves behind before taking its eight lines. If the ground truth did not,
      // it would see seven real lines and the two sides of the recall figure
      // would be comparing different windows. Both phrases here sit on the
      // eighth-from-last real line, so neither is in a seven-line window.
      const one = 'Curated by the fixture team for this measurement test.';
      const two = 'Maintained by the fixture stewards for this measurement test.';
      fs.writeFileSync(
        path.join(repo, '.github/footers.yml'),
        `phrases:\n  - "${one}"\n  - "${two}"\n`,
        'utf8'
      );
      const after = Array.from(
        { length: 6 },
        (_, i) => `Filler line number ${i} of trailing prose.`
      );
      fs.writeFileSync(
        path.join(repo, 'B.md'),
        [`*${one}*`, `*${two}*`, ...after, ''].join('\n'),
        'utf8'
      );
      commitFixture();

      const r = measure(repo);
      expect(r.groundTruthFiles).toContain('B.md');
    });
  });
});

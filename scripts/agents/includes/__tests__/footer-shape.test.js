/**
 * footer-shape.test.js — the shape-based signal, including the exact case that
 * motivated it.
 */
import {
  findShapeMultiples,
  findTrailingFooterShapedBlocks,
  emphasisedPhraseText,
  computeFenceMask,
} from '../footer-shape.js';

describe('footer-shape', () => {
  // Verbatim shape of README.md when the bug was reported: two different
  // unrecognised footer-shaped blocks plus one generated block. The
  // wording-based tool reported this file as clean.
  const TWO_DIFFERENT_UNRECOGNISED = [
    '# Project',
    '',
    'Some real content here.',
    '',
    '---',
    '',
    '**\u{1F680} Built by LightSpeedWP with \u2615, open source, and automation spirit!**',
    '',
    '*This repository is managed by the LightSpeed team. All organisational automation, governance, and documentation updates are maintained here.*',
    '',
    '*Built by \u{1F9F1} LightSpeedWP with \u2615, \u{1F680}, and open-source spirit!*',
    '[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)',
    '',
  ].join('\n');

  describe('the case that motivated this', () => {
    test('flags the two different unrecognised blocks that wording cannot see', () => {
      const r = findShapeMultiples(TWO_DIFFERENT_UNRECOGNISED);
      expect(r.count).toBe(3);
      expect(r.regions).toHaveLength(3);
    });

    test('surfaces the text so a human need not open the file', () => {
      const joined = findShapeMultiples(TWO_DIFFERENT_UNRECOGNISED)
        .regions.map((x) => x.texts.join(' '))
        .join(' | ');
      expect(joined).toContain('automation spirit');
      expect(joined).toContain('This repository is managed by the LightSpeed team');
    });

    test('a single footer is not flagged', () => {
      const one = [
        '# Doc',
        '',
        'Content.',
        '',
        '---',
        '',
        '_Built by \u{1F9F1} LightSpeedWP with \u2615, \u{1F680}, and open-source spirit!_',
        '[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)',
        '',
      ].join('\n');
      expect(findShapeMultiples(one).count).toBe(0);
    });

    test('two identical footers are flagged', () => {
      const two =
        '# D\n\nC\n\n---\n\n*Made with ❤️ by the LightSpeed team.*\n\n*Made with ❤️ by the LightSpeed team.*\n';
      expect(findShapeMultiples(two).count).toBe(2);
    });
  });

  describe('it reports and never rewrites', () => {
    test('content is untouched by being analysed', () => {
      const input = '# T\n\n**\u{1F680} Built by LightSpeedWP!**\n\n*Made with ❤️ by the team.*\n';
      const copy = input;
      findShapeMultiples(input);
      findTrailingFooterShapedBlocks(input);
      expect(input).toBe(copy);
    });
  });

  describe('shape rules', () => {
    test('accepts the emphasis forms footers are actually written in', () => {
      expect(
        emphasisedPhraseText(
          '*Built by \u{1F9F1} LightSpeedWP with \u2615, \u{1F680}, and open-source spirit!*'
        )
      ).toBeTruthy();
      expect(
        emphasisedPhraseText('_Maintained with ❤️ by the \u{1F680} LightSpeedWP Automation Team_')
      ).toBeTruthy();
      expect(
        emphasisedPhraseText(
          '**\u{1F680} Built by LightSpeedWP with \u2615, open source, and automation spirit!**'
        )
      ).toBeTruthy();
    });

    test('rejects document structure that is not a footer phrase', () => {
      expect(emphasisedPhraseText('> A blockquote callout near the end.')).toBeNull();
      expect(emphasisedPhraseText('- a list item that matters')).toBeNull();
      expect(emphasisedPhraseText('| a | b |')).toBeNull();
      expect(emphasisedPhraseText('<!-- a comment -->')).toBeNull();
      expect(emphasisedPhraseText('---')).toBeNull();
      expect(emphasisedPhraseText('[Contributors](https://example.invalid)')).toBeNull();
      expect(emphasisedPhraseText('*Too short*')).toBeNull();
      expect(emphasisedPhraseText('Just an ordinary sentence with no emphasis at all.')).toBeNull();
    });

    test('a heading in the tail narrows the zone', () => {
      // The emphasised line sits above a heading, so it is section content
      // rather than part of the trailing footer zone.
      const text = [
        '# Title',
        '',
        '**A bolded note about the section.**',
        '',
        '## Contributing',
        '',
        'Please see CONTRIBUTING.md.',
        '',
        '_Maintained with ❤️ by the team_',
        '',
      ].join('\n');
      expect(findShapeMultiples(text).count).toBe(0);
    });

    test('empty and trivial files are handled', () => {
      expect(findShapeMultiples('').count).toBe(0);
      expect(findShapeMultiples('   \n\n').count).toBe(0);
      expect(findTrailingFooterShapedBlocks('')).toBeNull();
    });
  });
  describe('footer-shaped lines inside a fenced code block are not footers', () => {
    // The wording-based deduper already refuses to touch fenced content, so a
    // signal that counted it would point a maintainer at documentation *showing*
    // the footer shape rather than at a file needing reconciliation.
    const fenced = (eol) =>
      [
        '# Docs',
        '',
        '```markdown',
        '*Thanks for reading the guide*',
        '[Docs](https://example.invalid)',
        '```',
        '',
      ].join(eol);
    const real = (eol) =>
      [
        '# Docs',
        '',
        'Some body text here.',
        '*Thanks for reading the guide*',
        '[Docs](https://example.invalid)',
        '',
      ].join(eol);

    test.each([
      ['LF', '\n'],
      ['CRLF', '\r\n'],
    ])('ignores a fenced example on %s files', (_label, eol) => {
      // No block found, so the result object is empty rather than null: null
      // means "no trailing zone at all", which is a different condition.
      expect(findTrailingFooterShapedBlocks(fenced(eol)).blocks).toHaveLength(0);
      expect(findShapeMultiples(fenced(eol)).count).toBe(0);
    });

    test.each([
      ['LF', '\n'],
      ['CRLF', '\r\n'],
    ])('still reports the real block on %s files', (_label, eol) => {
      const blocks = findTrailingFooterShapedBlocks(real(eol));
      expect(blocks).not.toBeNull();
      expect(blocks.blocks).toHaveLength(1);
      // One-based, so the number matches an editor and `grep -n`.
      expect(blocks.blocks[0].line).toBe(4);
    });

    test('an unclosed fence still masks the rest of the zone', () => {
      const text = [
        '# Docs',
        '',
        '```markdown',
        '*Thanks for reading the guide*',
        '[Docs](https://example.invalid)',
        '',
      ].join('\n');
      expect(findTrailingFooterShapedBlocks(text).blocks).toHaveLength(0);
    });
  });

  describe('the fence-mask copy stays in step with dedupe-footers.js', () => {
    // This module keeps its own copy of computeFenceMask because importing the
    // one in dedupe-footers.js would close an import cycle, and its docstring
    // requires the two to agree. They had drifted: on a backtick fence whose info
    // string contains a backtick, dedupe-footers.js leaves the line unmasked
    // (asserted in its own test suite) while this copy masked it. The line can
    // never be a heading or a footer phrase, so the drift was invisible in this
    // module's output — which is exactly why it needs a test rather than a
    // corpus measurement.
    test('a backtick opener whose info string contains a backtick is not a fence', () => {
      const mask = computeFenceMask(['```a`b', 'A phrase inside nothing.', 'text']);
      expect(mask).toEqual([false, false, false]);
    });
  });

  describe('a heading inside a fence is not a heading of the document', () => {
    // Regression: the heading scan did not consult fenceMask, so a fenced ATX
    // heading set lastHeading and the candidate loop then discarded every line
    // above it — hiding real footer-shaped blocks from the report entirely.
    const TWO_FOOTERS_ABOVE_FENCED_HEADING = [
      'Some content here.',
      '',
      '**Made with love by the LightSpeed team.**',
      '',
      '*Built with \u{1F680} by LightSpeedWP with love.*',
      '```markdown',
      '# Example heading inside a fence',
      '```',
    ].join('\n');

    test('the two real footers above a fenced heading are still reported', () => {
      const blocks = findTrailingFooterShapedBlocks(TWO_FOOTERS_ABOVE_FENCED_HEADING);
      expect(blocks.blocks).toHaveLength(2);
      expect(blocks.blocks.map((b) => b.line)).toEqual([3, 5]);
    });

    test('the signal flags the file rather than reporting it clean', () => {
      const r = findShapeMultiples(TWO_FOOTERS_ABOVE_FENCED_HEADING);
      expect(r.count).toBe(2);
      expect(r.regions).toHaveLength(2);
    });

    test('a fenced heading does not narrow the zone on CRLF files either', () => {
      const crlf = TWO_FOOTERS_ABOVE_FENCED_HEADING.replace(/\n/g, '\r\n');
      expect(findShapeMultiples(crlf).count).toBe(2);
    });

    test('an unfenced heading still narrows the zone', () => {
      // The fix must not weaken the rule for a real heading: a footer-shaped
      // line above a genuine heading is section content, not a trailing footer.
      const text = [
        '# Title',
        '',
        '**A bolded note about the section.**',
        '',
        '## Contributing',
        '',
        '_Maintained with \u2764\uFE0F by the team_',
        '',
      ].join('\n');
      expect(findShapeMultiples(text).count).toBe(0);
    });
  });
});

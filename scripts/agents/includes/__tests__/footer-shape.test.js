/**
 * footer-shape.test.js — the shape-based signal, including the exact case that
 * motivated it.
 */
import {
  findShapeMultiples,
  findTrailingFooterShapedBlocks,
  emphasisedPhraseText,
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
      const two = '# D\n\nC\n\n---\n\n*Made with ❤️ by the LightSpeed team.*\n\n*Made with ❤️ by the LightSpeed team.*\n';
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
      expect(emphasisedPhraseText('*Built by \u{1F9F1} LightSpeedWP with \u2615, \u{1F680}, and open-source spirit!*')).toBeTruthy();
      expect(emphasisedPhraseText('_Maintained with ❤️ by the \u{1F680} LightSpeedWP Automation Team_')).toBeTruthy();
      expect(emphasisedPhraseText('**\u{1F680} Built by LightSpeedWP with \u2615, open source, and automation spirit!**')).toBeTruthy();
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
});

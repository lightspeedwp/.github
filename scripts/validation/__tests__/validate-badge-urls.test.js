const { BROKEN_BADGE, findBrokenBadges, repairContent } = require('../validate-badge-urls.cjs');

/** One badge exactly as the generator used to emit it, with a bare space. */
const BROKE_SPACES =
  '![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)';

describe('validate-badge-urls', () => {
  describe('findBrokenBadges', () => {
    it('reports a badge whose destination ends at a space', () => {
      const findings = findBrokenBadges(BROKE_SPACES);
      expect(findings).toHaveLength(1);
      expect(findings[0].lineNumber).toBe(1);
    });

    it('reports every affected line with its number', () => {
      const findings = findBrokenBadges(['# T', '', BROKE_SPACES, '', BROKE_SPACES].join('\n'));
      expect(findings.map((finding) => finding.lineNumber)).toEqual([3, 5]);
    });

    it('ignores a badge that is already encoded', () => {
      const line =
        '![Docs Validation](https://img.shields.io/badge/Docs%20Validation-OK-success.svg)';
      expect(findBrokenBadges(line)).toHaveLength(0);
    });

    it('ignores a label with no space', () => {
      expect(
        findBrokenBadges('![Checks](https://img.shields.io/badge/Checks-OK-success.svg)')
      ).toHaveLength(0);
    });

    it('ignores a shields.io URL in a fenced block', () => {
      const content = ['```md', BROKE_SPACES, '```'].join('\n');
      expect(findBrokenBadges(content)).toHaveLength(0);
    });

    it('does not let one match suppress the next line', () => {
      // BROKEN_BADGE is global, so a shared lastIndex could skip a line.
      const findings = findBrokenBadges([BROKE_SPACES, BROKE_SPACES, BROKE_SPACES].join('\n'));
      expect(findings).toHaveLength(3);
    });
  });

  describe('repairContent', () => {
    it('percent-encodes the space in the destination', () => {
      expect(repairContent(BROKE_SPACES)).toBe(
        '![Docs Validation](https://img.shields.io/badge/Docs%20Validation-OK-success.svg)'
      );
    });

    it('encodes every space in a multi-word label', () => {
      const line =
        '![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)';
      expect(repairContent(line)).toBe(
        '![Main Branch Guard](https://img.shields.io/badge/Main%20Branch%20Guard-OK-success.svg)'
      );
    });

    it('keeps the alt text readable', () => {
      // The alt text is the accessible name, so it must not be encoded.
      expect(repairContent(BROKE_SPACES)).toContain('![Docs Validation]');
    });

    it('does not duplicate the shields.io host', () => {
      expect(repairContent(BROKE_SPACES)).not.toContain('img.shields.io/https://');
    });

    it('leaves an already-correct badge unchanged', () => {
      const line = '![X](https://img.shields.io/badge/A%20B-OK-success.svg)';
      expect(repairContent(line)).toBe(line);
    });

    it('is idempotent', () => {
      const once = repairContent(BROKE_SPACES);
      expect(repairContent(once)).toBe(once);
    });

    it('leaves surrounding prose untouched', () => {
      const content = [
        '# Title',
        '',
        'Some prose with https://example.com/a b in it.',
        '',
        BROKE_SPACES,
      ].join('\n');
      const repaired = repairContent(content);
      expect(repaired).toContain('# Title');
      expect(repaired).toContain('Some prose with https://example.com/a b in it.');
      expect(findBrokenBadges(repaired)).toHaveLength(0);
    });

    it('clears every finding in a multi-badge file', () => {
      const content = [BROKE_SPACES, BROKE_SPACES, BROKE_SPACES].join('\n');
      expect(findBrokenBadges(repairContent(content))).toHaveLength(0);
    });
  });

  describe('BROKEN_BADGE', () => {
    it('matches the bare-space form', () => {
      BROKEN_BADGE.lastIndex = 0;
      expect(BROKEN_BADGE.test(BROKE_SPACES)).toBe(true);
    });

    it('does not match an encoded destination', () => {
      BROKEN_BADGE.lastIndex = 0;
      expect(BROKEN_BADGE.test('![X](https://img.shields.io/badge/A%20B-OK-success.svg)')).toBe(
        false
      );
    });
  });
});

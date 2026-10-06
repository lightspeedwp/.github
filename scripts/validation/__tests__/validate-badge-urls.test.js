const {
  BROKEN_BADGE,
  findBrokenBadges,
  isBrokenBadgeDestination,
  repairContent,
  splitDestination,
} = require('../validate-badge-urls.cjs');

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

  describe('splitDestination', () => {
    it('separates a quoted title from the destination', () => {
      const parsed = splitDestination('https://img.shields.io/badge/X-OK-green.svg "Build status"');
      expect(parsed.destination).toBe('https://img.shields.io/badge/X-OK-green.svg');
      expect(parsed.title).toBe('"Build status"');
    });

    it('separates a title from a destination that itself contains spaces', () => {
      // A broken badge has spaces in its URL by definition, so a `\\S+` prefix
      // would never match and the title would be swallowed into the path.
      const parsed = splitDestination(
        'https://img.shields.io/badge/Docs Validation-OK-success.svg "Tip"'
      );
      expect(parsed.destination).toBe(
        'https://img.shields.io/badge/Docs Validation-OK-success.svg'
      );
      expect(parsed.title).toBe('"Tip"');
    });

    it('returns no title when there is none', () => {
      expect(splitDestination(BROKE_SPACES).title).toBe('');
    });
  });

  describe('isBrokenBadgeDestination', () => {
    it('treats a space inside the shields path as broken', () => {
      expect(
        isBrokenBadgeDestination('https://img.shields.io/badge/Docs Validation-OK-success.svg')
      ).toBe(true);
    });

    it('treats a space-free shields URL as sound', () => {
      expect(isBrokenBadgeDestination('https://img.shields.io/badge/Checks-OK-success.svg')).toBe(
        false
      );
    });

    it('ignores a non-shields host', () => {
      expect(isBrokenBadgeDestination('https://example.com/a b.svg')).toBe(false);
    });
  });

  describe('image titles', () => {
    // Markdown permits a quoted title after the destination. Treating it as
    // part of the URL made a valid badge report as broken, and `--fix` then
    // percent-encoded the title into the path and corrupted it.
    const withTitle = '![X](https://img.shields.io/badge/X-OK-green.svg "Build status")';

    it('does not report a valid badge that carries a title', () => {
      expect(findBrokenBadges(withTitle)).toHaveLength(0);
    });

    it('leaves a titled badge unchanged under repair', () => {
      expect(repairContent(withTitle)).toBe(withTitle);
    });

    it('repairs the destination while keeping the title', () => {
      const broken = '![Docs](https://img.shields.io/badge/Docs Validation-OK-success.svg "Tip")';
      expect(repairContent(broken)).toBe(
        '![Docs](https://img.shields.io/badge/Docs%20Validation-OK-success.svg "Tip")'
      );
    });
  });

  describe('titles that contain parentheses', () => {
    // CommonMark allows `(` and `)` inside a quoted title. Matching up to the first
    // `)` split the title, so a valid badge was reported and `--fix` rewrote part of
    // the title into the URL.
    const bareTitle = '![X](https://img.shields.io/badge/X-OK-green.svg "Build (main)")';
    const angleTitle = '![X](<https://img.shields.io/badge/X-OK-green.svg> "Build (main)")';

    it('does not report a valid bare badge whose title has parentheses', () => {
      expect(findBrokenBadges(bareTitle)).toHaveLength(0);
      expect(repairContent(bareTitle)).toBe(bareTitle);
    });

    it('does not report a valid angle-bracket badge whose title has parentheses', () => {
      expect(findBrokenBadges(angleTitle)).toHaveLength(0);
      expect(repairContent(angleTitle)).toBe(angleTitle);
    });

    it('repairs a broken bare badge and keeps a title with parentheses intact', () => {
      const broken = '![X](https://img.shields.io/badge/Docs Validation-OK-success.svg "Tip (x)")';
      expect(repairContent(broken)).toBe(
        '![X](https://img.shields.io/badge/Docs%20Validation-OK-success.svg "Tip (x)")'
      );
    });

    it('repairs a broken angle-bracket badge and keeps a title with parentheses intact', () => {
      const broken =
        '![X](<https://img.shields.io/badge/Docs> Validation-OK-success.svg "Tip (x)")';
      expect(repairContent(broken)).toBe(
        '![X](https://img.shields.io/badge/Docs%20Validation-OK-success.svg "Tip (x)")'
      );
    });

    it('still reports and repairs the next badge on the same line', () => {
      const line = `${angleTitle} ${BROKE_SPACES}`;
      expect(findBrokenBadges(line)).toHaveLength(1);
      expect(repairContent(line)).toBe(
        `${angleTitle} ![Docs Validation](https://img.shields.io/badge/Docs%20Validation-OK-success.svg)`
      );
    });
  });

  describe('parenthesised titles and apostrophes', () => {
    // CommonMark also allows a title in parentheses. A quote is a title only after
    // whitespace; elsewhere it is an ordinary character, so `Don't Stop` stays a label.
    const parenBare = '![X](https://img.shields.io/badge/X-OK-green.svg (Build))';
    const parenAngle = '![X](<https://img.shields.io/badge/X-OK-green.svg> (Build))';

    it('does not report a valid badge with a parenthesised title', () => {
      for (const line of [parenBare, parenAngle]) {
        expect(findBrokenBadges(line)).toHaveLength(0);
        expect(repairContent(line)).toBe(line);
      }
    });

    it('repairs a broken angle-bracket badge and keeps a parenthesised title', () => {
      const broken = '![X](<https://img.shields.io/badge/Docs> Validation-OK-success.svg (Tip))';
      expect(repairContent(broken)).toBe(
        '![X](https://img.shields.io/badge/Docs%20Validation-OK-success.svg (Tip))'
      );
    });

    it('still finds and repairs a broken badge whose label has an apostrophe', () => {
      const broken = "![Don't](https://img.shields.io/badge/Don't Stop-OK-success.svg)";
      expect(findBrokenBadges(broken)).toHaveLength(1);
      expect(repairContent(broken)).toBe(
        "![Don't](https://img.shields.io/badge/Don't%20Stop-OK-success.svg)"
      );
    });

    it('keeps the apostrophe and a quoted title when both are present', () => {
      const broken = '![X](https://img.shields.io/badge/Don\'t Stop-OK-success.svg "Tip")';
      expect(repairContent(broken)).toBe(
        '![X](https://img.shields.io/badge/Don\'t%20Stop-OK-success.svg "Tip")'
      );
    });

    it('leaves an already-encoded badge with an apostrophe alone', () => {
      const ok = "![Don't](https://img.shields.io/badge/Don't%20Stop-OK-success.svg)";
      expect(findBrokenBadges(ok)).toHaveLength(0);
      expect(repairContent(ok)).toBe(ok);
    });

    it('does not encode spaces that sit before a title into the URL', () => {
      const broken = '![X](https://img.shields.io/badge/Docs Validation-OK-success.svg   "Tip")';
      expect(repairContent(broken)).toBe(
        '![X](https://img.shields.io/badge/Docs%20Validation-OK-success.svg "Tip")'
      );
    });
  });

  describe('escaped delimiters in titles', () => {
    // A backslash escapes the next character in a CommonMark title, so an escaped closing
    // delimiter does not end it.
    const quoted = String.raw`![X](https://img.shields.io/badge/X-OK-green.svg "Say \"hi\"")`;
    const quotedAngle = String.raw`![X](<https://img.shields.io/badge/X-OK-green.svg> "Say \"hi\"")`;
    const paren = String.raw`![X](https://img.shields.io/badge/X-OK-green.svg (Build \) ok))`;
    const parenAngle = String.raw`![X](<https://img.shields.io/badge/X-OK-green.svg> (Build \) ok))`;
    const single = String.raw`![X](https://img.shields.io/badge/X-OK-green.svg 'It\'s fine')`;

    it('does not report or change a valid badge whose title has an escaped delimiter', () => {
      for (const line of [quoted, quotedAngle, paren, parenAngle, single]) {
        expect(findBrokenBadges(line)).toHaveLength(0);
        expect(repairContent(line)).toBe(line);
      }
    });

    it('repairs a broken bare badge and keeps an escaped-quote title intact', () => {
      const broken = String.raw`![X](https://img.shields.io/badge/Docs Validation-OK-success.svg "Say \"hi\"")`;
      expect(repairContent(broken)).toBe(
        String.raw`![X](https://img.shields.io/badge/Docs%20Validation-OK-success.svg "Say \"hi\"")`
      );
    });

    it('repairs a broken angle-bracket badge and keeps an escaped-parenthesis title intact', () => {
      const broken = String.raw`![X](<https://img.shields.io/badge/Docs> Validation-OK-success.svg (Tip \) x))`;
      expect(repairContent(broken)).toBe(
        String.raw`![X](https://img.shields.io/badge/Docs%20Validation-OK-success.svg (Tip \) x))`
      );
    });

    it('stays fast on a title made of backslashes', () => {
      const line = `![x](https://img.shields.io/badge/X "${'\\\\ '.repeat(20000)}`;
      const started = Date.now();
      findBrokenBadges(line);
      repairContent(line);
      expect(Date.now() - started).toBeLessThan(1000);
    });
  });

  describe('pathological input', () => {
    // A long run of spaces with no closing parenthesis made an earlier version of the
    // title pattern backtrack quadratically (about 30 seconds for 200,000 characters).
    const run = ' '.repeat(100000);
    const inputs = {
      'an unclosed bare image': `![x](https://img.shields.io/badge/X${run}y`,
      'an unclosed angle-bracket image': `![x](<https://img.shields.io/badge/X>${run}y`,
      'a closed image with a long space run': `![x](https://img.shields.io/badge/X${run}y)`,
      'many quote openers': `![x](https://img.shields.io/badge/X ${'" '.repeat(20000)}`,
      'many parenthesis openers': `![x](https://img.shields.io/badge/X ${'( '.repeat(20000)}`,
    };

    it.each(Object.entries(inputs))('handles %s quickly', (_name, line) => {
      const started = Date.now();
      findBrokenBadges(line);
      repairContent(line);
      expect(Date.now() - started).toBeLessThan(1000);
    });
  });

  describe('nested fences', () => {
    // A four-backtick example may contain a three-backtick block. Toggling on
    // every fence-like line ends the block early and rewrites badge examples
    // inside documentation.
    const nested = ['````markdown', '```', BROKE_SPACES, '```', '````', ''].join('\n');

    it('ignores a badge inside a nested fence', () => {
      expect(findBrokenBadges(nested)).toHaveLength(0);
    });

    it('leaves a nested fence unchanged under repair', () => {
      expect(repairContent(nested)).toBe(nested);
    });
  });

  describe('angle-bracket form', () => {
    // As emitted by the README regeneration of #3803: the `>` closes the link
    // before the label ends, leaving "Validation-OK-success.svg" as stray text.
    const ANGLE =
      '![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)';
    const ANGLE_COLON =
      '![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)';
    const ANGLE_MULTI =
      '![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)';

    it('reports a badge whose `>` closes before the label ends', () => {
      for (const line of [ANGLE, ANGLE_COLON, ANGLE_MULTI]) {
        expect(findBrokenBadges(line)).toHaveLength(1);
      }
    });

    it('repairs the label with a joining %20', () => {
      expect(repairContent(ANGLE)).toBe(
        '![Docs Validation](https://img.shields.io/badge/Docs%20Validation-OK-success.svg)'
      );
      expect(repairContent(ANGLE_MULTI)).toBe(
        '![Main Branch Guard](https://img.shields.io/badge/Main%20Branch%20Guard-OK-success.svg)'
      );
    });

    it('joins a colon label without inserting a stray %20 before the colon', () => {
      expect(repairContent(ANGLE_COLON)).toBe(
        '![Badges: Health Check](https://img.shields.io/badge/Badges:%20Health%20Check-OK-success.svg)'
      );
    });

    it('does not report a well-formed angle-bracket destination', () => {
      const ok = '![Checks](<https://img.shields.io/badge/Checks-OK-success.svg>)';
      expect(findBrokenBadges(ok)).toHaveLength(0);
      expect(repairContent(ok)).toBe(ok);
    });

    it('does not report a valid angle-bracket destination that carries a title', () => {
      const titled = '![X](<https://img.shields.io/badge/X-OK-green.svg> "Build status")';
      expect(findBrokenBadges(titled)).toHaveLength(0);
      expect(repairContent(titled)).toBe(titled);
    });

    it('keeps a title while repairing a broken angle-bracket badge', () => {
      const broken = '![D](<https://img.shields.io/badge/Docs> Validation-OK-success.svg "Tip")';
      expect(repairContent(broken)).toBe(
        '![D](https://img.shields.io/badge/Docs%20Validation-OK-success.svg "Tip")'
      );
    });

    it('ignores the form inside a fenced block', () => {
      expect(findBrokenBadges(['```md', ANGLE, '```'].join('\n'))).toHaveLength(0);
    });

    it('repairs a mix of both forms on separate lines and clears every finding', () => {
      const content = [BROKE_SPACES, ANGLE, ANGLE_COLON].join('\n');
      expect(findBrokenBadges(content)).toHaveLength(3);
      const repaired = repairContent(content);
      expect(findBrokenBadges(repaired)).toHaveLength(0);
      expect(repairContent(repaired)).toBe(repaired);
    });

    it('does not reset a shared regex position between lines', () => {
      expect(findBrokenBadges([ANGLE, ANGLE, ANGLE].join('\n'))).toHaveLength(3);
    });
  });

  describe('BROKEN_BADGE', () => {
    it('matches the bare-space form', () => {
      BROKEN_BADGE.lastIndex = 0;
      expect(BROKEN_BADGE.test(BROKE_SPACES)).toBe(true);
    });

    // The pattern deliberately matches any image; whether that image is a
    // broken badge is decided by isBrokenBadgeDestination. Keeping the two
    // apart is what lets a titled badge and an encoded URL be handled as steps
    // rather than as nested capture groups.
    it('matches an encoded badge, which the destination check then rejects', () => {
      const encoded = '![X](https://img.shields.io/badge/A%20B-OK-success.svg)';
      BROKEN_BADGE.lastIndex = 0;
      expect(BROKEN_BADGE.test(encoded)).toBe(true);
      expect(findBrokenBadges(encoded)).toHaveLength(0);
    });
  });
});

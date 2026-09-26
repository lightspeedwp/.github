/**
 * Tests for scripts/agents/includes/footer-policy.js
 *
 * This module is the single source of truth for what a footer *is* and where
 * footers *belong*, shared by the generator (header-footer.js, meta.agent.js)
 * and the guard (scripts/dedupe-footers.js). Drift between those two is what
 * let ~117K duplicate blocks accumulate unnoticed, so the recognition helpers
 * are pinned here explicitly.
 */

import {
  FOOTER_PATTERNS,
  buildFooterRegex,
  isFooterPhraseLine,
  isFooterLinkLine,
  isThematicBreakLine,
  isFooterExemptPath,
  isHighConfidenceFooterPhraseLine,
  HIGH_CONFIDENCE_FOOTER_PATTERNS,
  FOOTER_EXEMPT_DIR_NAMES,
} from '../footer-policy.js';

describe('footer-policy', () => {
  describe('FOOTER_PATTERNS', () => {
    test('matches the asterisk-wrapped forms that caused the compounding bug', () => {
      // Regression guard for #3443: before the leading [*_]? was added, these
      // were invisible to ensureFooter(), so every run appended a new copy
      // instead of replacing the existing one. Narrowing these reintroduces
      // the #3451 backlog at the next automation run.
      const asteriskForms = [
        '*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*',
        '*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*',
        '*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*',
        '*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*',
        '*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*',
      ];
      for (const line of asteriskForms) {
        expect(isFooterPhraseLine(line)).toBe(true);
      }
    });

    test('matches the underscore-wrapped forms', () => {
      expect(
        isFooterPhraseLine('_Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_')
      ).toBe(true);
      expect(
        isFooterPhraseLine('_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_')
      ).toBe(true);
    });

    test('matches the footers.yml default phrases', () => {
      // The live config's phrases must be recognisable, otherwise the generator
      // would never replace a footer it had just written.
      expect(isFooterPhraseLine('Made with ❤️ by the LightSpeed team.')).toBe(true);
      expect(isFooterPhraseLine('Need help? Say hi—work with us.')).toBe(true);
    });

    test('does not match ordinary prose', () => {
      const prose = [
        '## Footer formatting',
        'This document describes the footer pipeline.',
        'The contributor guide explains footer policy.',
        '- Built by hand, reviewed by the team.',
        'Questions are welcome in the issue tracker.',
      ];
      for (const line of prose) {
        expect(isFooterPhraseLine(line)).toBe(false);
      }
    });

    test('requires the phrase to start its own line', () => {
      // A mid-sentence mention must not be treated as a footer.
      expect(isFooterPhraseLine('This note mentions Have questions? Ping us on GitHub!')).toBe(
        false
      );
      expect(isFooterPhraseLine('## Footer formatting')).toBe(false);
    });

    test('is line-bounded, not word-bounded', () => {
      // Every pattern body ends in [^\n]*, so trailing text on the same line is
      // tolerated. That is deliberate: it keeps the generator from appending a
      // second footer when a human lightly edits the wording of an existing one.
      // The flip side is that a phrase line carrying extra prose is still
      // classified as a footer, which is the conservative direction for the
      // generator (replace) and for the guard (see the fence tests in
      // dedupe-footers.test.js for the real-content protection).
      expect(
        isFooterPhraseLine('Docs signed by 🤖 Copilot for LightSpeedWP – always fresh! (see below)')
      ).toBe(true);
    });

    test('every pattern body stays single-line bounded', () => {
      // A body that can span newlines would let one phrase match to EOF and
      // take real content with it.
      for (const pattern of FOOTER_PATTERNS) {
        expect(pattern).not.toContain('[\\s\\S]');
      }
    });
  });

  describe('isHighConfidenceFooterPhraseLine', () => {
    test('accepts the unmistakable footer forms', () => {
      const footers = [
        '*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*',
        '_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_',
        '*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*',
        '*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*',
        '_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_',
        'Made with ❤️ by the LightSpeed team.',
        '*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*',
      ];
      for (const line of footers) {
        expect(isHighConfidenceFooterPhraseLine(line)).toBe(true);
      }
    });

    test('rejects prose that merely begins with a generic footer opener', () => {
      // This is the whole point of the narrower set: the full pattern list
      // matches all of these, and each is a plausible sentence in a document.
      const prose = [
        'Update when the API version changes.',
        'Questions? See the runbook.',
        'Use responsibly; tailor to the thread.',
        'Keep tone human, clear, and kind.',
        'Keep prompts versioned for sanity.',
        'Link policies; avoid assumptions.',
        'Reuse beats rework. Share improvements.',
        'Copy, adapt, and keep shipping.',
        'Clarity first, then code. Thanks for reading.',
        'Improvements welcome—PRs encouraged.',
        'Thanks for helping contributors.',
        'Need help? Say hi—work with us.',
        'Tweak the variables, get results fast.',
        'Your feedback shapes the next iteration.',
        'Prefer a guided setup? Book a consult.',
        'Thanks for helping us get this to the right place!',
      ];
      for (const line of prose) {
        expect(isHighConfidenceFooterPhraseLine(line)).toBe(false);
      }
    });

    test('rejects the generic openers that the full list does match', () => {
      // Pins the relationship between the two predicates: anything the narrow
      // set rejects but the full set accepts is exactly the ambiguous class.
      const ambiguous = ['Update when guidance changes.', 'Questions? Open an issue.'];
      for (const line of ambiguous) {
        expect(isFooterPhraseLine(line)).toBe(true);
        expect(isHighConfidenceFooterPhraseLine(line)).toBe(false);
      }
    });

    test('is start-anchored, so a mid-sentence mention is rejected', () => {
      expect(isHighConfidenceFooterPhraseLine('We still use the Built by 🧱 footer here.')).toBe(
        false
      );
    });

    test('the narrow set is a genuine subset of the full list', () => {
      // Every opener in HIGH_CONFIDENCE_FOOTER_PATTERNS must also be recognised
      // by the full list. Written out rather than derived from the pattern
      // strings so a future edit to either list is a visible test failure.
      const openers = [
        'Maintained with ❤️',
        'Built by 🧱',
        'Have questions? Ping us on GitHub',
        'This page brought to you by',
        'Docs signed by 🤖',
        'Made with ❤️',
      ];
      expect(HIGH_CONFIDENCE_FOOTER_PATTERNS).toHaveLength(openers.length);
      for (const opener of openers) {
        expect(isFooterPhraseLine(opener)).toBe(true);
        expect(isHighConfidenceFooterPhraseLine(opener)).toBe(true);
      }
    });
  });

  describe('buildFooterRegex', () => {
    const regex = buildFooterRegex();

    test('matches a footer at end of file', () => {
      expect(
        regex.test('Body text.\n\n_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_')
      ).toBe(true);
      expect(regex.test('Body text.\n\nMade with ❤️ by the LightSpeed team.')).toBe(true);
    });

    test('does not match an emphasised "Made with ❤️" footer', () => {
      // Latent gap, documented rather than silently changed: unlike the first
      // five patterns, "Made with ❤️" has no leading [*_]?, so an emphasised
      // variant of it is invisible to the generator. The generator itself only
      // ever writes the unemphasised form (see .github/footers.yml), so this is
      // not currently reachable — but it is the same shape of defect as #3443
      // and should be fixed with its own change and blast-radius check.
      expect(isFooterPhraseLine('*Made with ❤️ by the LightSpeed team.*')).toBe(false);
      expect(regex.test('Body.\n\n*Made with ❤️ by the LightSpeed team.*')).toBe(false);
    });

    test('does not match a footer stranded above real content', () => {
      // The generator's regex is deliberately end-anchored, so it can only ever
      // see the last block. This asymmetry with isFooterPhraseLine is why
      // duplicate auditing needs the line-level predicate.
      const content = '_Made with ❤️ by the LightSpeed team._\n\nMore real content.';
      expect(regex.test(content)).toBe(false);
    });

    test('is rebuilt from the same pattern list', () => {
      const rebuilt = buildFooterRegex();
      expect(rebuilt.source).toBe(regex.source);
      expect(regex.source).toContain(FOOTER_PATTERNS[0].split('[')[0].slice(1));
    });
  });

  describe('isFooterLinkLine', () => {
    test('accepts a standalone link, with or without emphasis', () => {
      expect(
        isFooterLinkLine('[Contributors](https://github.com/org/repo/graphs/contributors)')
      ).toBe(true);
      expect(isFooterLinkLine('  [Automation Docs](https://example.com/docs)  ')).toBe(true);
    });

    test('rejects a link embedded in a sentence', () => {
      expect(isFooterLinkLine('See [the docs](https://example.com) for more.')).toBe(false);
    });
  });

  describe('isThematicBreakLine', () => {
    test('accepts the three thematic break forms', () => {
      expect(isThematicBreakLine('---')).toBe(true);
      expect(isThematicBreakLine('***')).toBe(true);
      expect(isThematicBreakLine('___')).toBe(true);
      expect(isThematicBreakLine('  ---  ')).toBe(true);
    });

    test('rejects a horizontal rule with trailing content', () => {
      expect(isThematicBreakLine('--- title: frontmatter ---')).toBe(false);
      expect(isThematicBreakLine('--- some text')).toBe(false);
    });
  });

  describe('isFooterExemptPath', () => {
    test('exempts the directories the guide lists', () => {
      expect(isFooterExemptPath('agents/x/skills/y/references/z.md')).toBe(true);
      expect(isFooterExemptPath('agents/x/skills/y/examples/z.md')).toBe(true);
      expect(isFooterExemptPath('agents/x/skills/y/templates/z.md')).toBe(true);
      expect(isFooterExemptPath('template/z.md')).toBe(true);
      expect(isFooterExemptPath('example/z.md')).toBe(true);
      expect(isFooterExemptPath('sample/z.md')).toBe(true);
      expect(isFooterExemptPath('samples/z.md')).toBe(true);
      expect(isFooterExemptPath('fixture/z.md')).toBe(true);
      expect(isFooterExemptPath('fixtures/z.md')).toBe(true);
      expect(isFooterExemptPath('mocks/z.md')).toBe(true);
      expect(isFooterExemptPath('mock/z.md')).toBe(true);
    });

    test('exempts the archive and historical directories', () => {
      expect(isFooterExemptPath('.github/instructions/.archive/agents.instructions.md')).toBe(true);
      expect(isFooterExemptPath('docs/completed/old.md')).toBe(true);
      expect(isFooterExemptPath('docs/deprecated/old.md')).toBe(true);
      expect(isFooterExemptPath('docs/legacy/old.md')).toBe(true);
    });

    test('exempts vendor-provided and template-rooted paths', () => {
      expect(isFooterExemptPath('plugin-provided/x/README.md')).toBe(true);
      expect(isFooterExemptPath('platform-managed/x/README.md')).toBe(true);
      expect(isFooterExemptPath('directory-installed/x/README.md')).toBe(true);
      expect(isFooterExemptPath('.github/ISSUE_TEMPLATE/bug_report.md')).toBe(true);
      expect(isFooterExemptPath('.github/PULL_REQUEST_TEMPLATE/fix.md')).toBe(true);
    });

    test('does not exempt ordinary documentation', () => {
      expect(isFooterExemptPath('AGENTS.md')).toBe(false);
      expect(isFooterExemptPath('docs/QUIRKY_FOOTERS_GUIDE.md')).toBe(false);
      expect(isFooterExemptPath('hooks/session-logger/README.md')).toBe(false);
      expect(isFooterExemptPath('agents/x/skills/y/SKILL.md')).toBe(false);
    });

    test('matches whole segments, not substrings of a filename', () => {
      // "examples.md" is a document about examples, not a file inside an
      // examples directory. Substring matching would wrongly exempt it.
      expect(isFooterExemptPath('docs/examples.md')).toBe(false);
      expect(isFooterExemptPath('docs/reference-notes.md')).toBe(false);
      expect(isFooterExemptPath('docs/my-template-guide.md')).toBe(false);
    });

    test('normalises Windows-style separators', () => {
      expect(isFooterExemptPath('agents\\x\\skills\\y\\references\\z.md')).toBe(true);
    });

    test('exempt set contains no empty or wildcard entries', () => {
      for (const name of FOOTER_EXEMPT_DIR_NAMES) {
        expect(name).not.toBe('');
        expect(name).not.toContain('*');
        expect(name).not.toContain('/');
      }
    });
  });
});

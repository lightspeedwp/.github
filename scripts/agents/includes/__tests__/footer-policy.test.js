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
  contributorsLink,
  repoSlug,
  repoUrl,
  DEFAULT_REPO_SLUG,
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

    test('every phrase pattern tolerates a leading emphasis marker', () => {
      // Previously only the first five patterns carried the optional [*_]? , so
      // an emphasised generic footer was invisible to both the generator and the
      // auditing predicate. That is not hypothetical: this repo contains
      // "*Questions? Check [RELEASE_FAQ.md](...) or ask @lightspeedwp/maintainers*",
      // which the generator could not match, so it would have appended a second
      // footer to that file.
      expect(isFooterPhraseLine('*Made with ❤️ by the LightSpeed team.*')).toBe(true);
      expect(isFooterPhraseLine('*Questions? Check the FAQ or ask Y*')).toBe(true);
      expect(isFooterPhraseLine('*Update when guidance changes*')).toBe(true);
      expect(isFooterPhraseLine('_Update when guidance changes_')).toBe(true);
      expect(regex.test('Doc\n\n*Questions? Check the FAQ or ask Y*')).toBe(true);
      expect(regex.test('Doc\n\n_Update when guidance changes_')).toBe(true);
    });

    test('the emphasis marker does not make bare prose matchable', () => {
      // The marker is optional, so this has to be pinned in both directions:
      // adding it must not reopen the prose case the tightening closed.
      expect(regex.test('Runbook\n\nUpdate when the API version changes.\n')).toBe(false);
      expect(regex.test('Runbook\n\nQuestions? See the runbook.\n')).toBe(false);
    });

    test('does not match a footer stranded above real content', () => {
      // The generator's regex is deliberately end-anchored, so it can only ever
      // see the last block. This asymmetry with isFooterPhraseLine is why
      // duplicate auditing needs the line-level predicate.
      const content = '_Made with ❤️ by the LightSpeed team._\n\nMore real content.';
      expect(regex.test(content)).toBe(false);
    });

    test('does not match an ordinary sentence that begins like a footer', () => {
      // ensureFooter() *replaces* whatever this matches, so a generic opener at
      // end of file used to delete the sentence. Verified against the generator:
      // "Update when the API version changes." and "Questions? See the runbook."
      // were both silently replaced by a footer.
      expect(regex.test('Runbook\n\nUpdate when the API version changes.\n')).toBe(false);
      expect(regex.test('Runbook\n\nQuestions? See the runbook.\n')).toBe(false);
      expect(regex.test('Runbook\n\nUse responsibly; tailor to the thread.\n')).toBe(false);
    });

    test('still matches the footers this repo actually writes', () => {
      // Every real footer is either an unmistakable phrase or an emphasised
      // phrase line, so tightening the matcher must not lose any of them. The
      // link line that may follow a footer has to keep matching too.
      expect(
        regex.test('Doc\n\n*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*')
      ).toBe(true);
      expect(
        regex.test(
          'Doc\n\n*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*\n' +
            // Derived, not written out, so this cannot drift from what the
      // generator emits. The assertion is that the link line after a footer
      // phrase still matches; the URL is incidental to that.
      contributorsLink({ GITHUB_REPOSITORY: 'lightspeedwp/.github' })
        )
      ).toBe(true);
      expect(
        regex.test('Doc\n\n_This page brought to you by the 🦄 Magic Automation Unicorns._')
      ).toBe(true);
      expect(regex.test('Doc\n\nMade with ❤️ by the LightSpeed team.')).toBe(true);
      expect(regex.test('Doc\n\n*Have questions? Ping us on GitHub! 🐙*')).toBe(true);
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

describe('repo-scoped links', () => {
  test('defaults to this repository when GITHUB_REPOSITORY is unset', () => {
    expect(repoSlug({})).toBe(DEFAULT_REPO_SLUG);
    expect(repoUrl('graphs/contributors', {})).toBe(
      'https://github.com/lightspeedwp/.github/graphs/contributors'
    );
  });

  test('follows GITHUB_REPOSITORY when it is a well-formed slug', () => {
    // The bug this fixes: the Contributors link was hardcoded to
    // lsx-demo-theme, so a file generated for any other repository inherited a
    // link to an unrelated project.
    expect(repoSlug({ GITHUB_REPOSITORY: 'acme/other-repo' })).toBe('acme/other-repo');
    expect(contributorsLink({ GITHUB_REPOSITORY: 'acme/other-repo' })).toBe(
      '[Contributors](https://github.com/acme/other-repo/graphs/contributors)'
    );
  });

  test.each([
    ['empty', ''],
    ['whitespace', '   '],
    ['not a slug', 'not a slug!!'],
    ['owner only', 'lightspeedwp'],
    ['path traversal', '../../etc'],
    ['scheme injection', 'https://evil.example/x'],
  ])('falls back to the default for a malformed value (%s)', (_label, value) => {
    expect(repoSlug({ GITHUB_REPOSITORY: value })).toBe(DEFAULT_REPO_SLUG);
  });

  test('no generator emits a link to lsx-demo-theme any more', () => {
    // Guards the regression directly rather than by inspection.
    for (const env of [{}, { GITHUB_REPOSITORY: 'acme/other-repo' }]) {
      expect(contributorsLink(env)).not.toContain('lsx-demo-theme');
    }
  });

  test('repoUrl accepts an array, a string, or nothing', () => {
    expect(repoUrl(['tree', 'main', 'profile'])).toBe(
      'https://github.com/lightspeedwp/.github/tree/main/profile'
    );
    expect(repoUrl('tree/main/profile')).toBe(
      'https://github.com/lightspeedwp/.github/tree/main/profile'
    );
    expect(repoUrl([])).toBe('https://github.com/lightspeedwp/.github');
    expect(repoUrl()).toBe('https://github.com/lightspeedwp/.github');
  });
});

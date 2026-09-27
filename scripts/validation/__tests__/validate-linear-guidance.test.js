const fs = require('fs');
const path = require('path');
const {
  ENTERPRISE_ONLY,
  GUIDE_PATH,
  GUIDANCE_PATH,
  REQUIRED_GUIDE_SECTIONS,
  extractPayload,
  fingerprint,
  headingsOutsideFences,
  validateGuideSections,
  validateLinearGuidance,
  validatePayload,
} = require('../validate-linear-guidance.cjs');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');

/** A minimal payload that satisfies every required topic. */
function minimalPayload() {
  return [
    'This repository is a governance control plane.',
    'Read AGENTS.md, then docs/AGENT-INDEX.md.',
    'Workflows live in .github/workflows/.',
    'Scripts live in scripts/ and are tested in __tests__/.',
    '.github/labels.yml is locked.',
    '.gitattributes assigns review categories.',
    'This repository uses UK English.',
  ].join('\n');
}

describe('extractPayload', () => {
  test('returns the single text fence', () => {
    const { payload, count } = extractPayload('intro\n\n```text\nhello\n```\n\noutro\n');

    expect(count).toBe(1);
    expect(payload).toBe('hello');
  });

  test('trims surrounding blank lines from the payload', () => {
    const { payload } = extractPayload('```text\n\n  body  \n\n```\n');

    expect(payload).toBe('body');
  });

  test('reports zero fences when there are none', () => {
    expect(extractPayload('no fence here').count).toBe(0);
  });

  // Counting only closed blocks would accept a valid payload followed by an
  // unfinished one, and extraction would be ambiguous. Caught by the local
  // CodeRabbit review.
  test('counts an unterminated text fence as an opener, not a payload', () => {
    const { payload, count, unterminated } = extractPayload(
      '```text\nreal payload\n```\n\n```text\nnever closed\n'
    );

    expect(count).toBe(2);
    expect(unterminated).toBe(1);
    expect(payload).toBe('');
  });

  test('reports no unterminated fence for a well-formed document', () => {
    expect(extractPayload('```text\nbody\n```\n').unterminated).toBe(0);
  });

  test('does not treat a non-text fence as an unterminated text fence', () => {
    const { count, unterminated } = extractPayload('```js\nconst a = 1;\n```\n');

    expect(count).toBe(0);
    expect(unterminated).toBe(0);
  });

  test('counts every fence, so an ambiguous file is detectable', () => {
    const { count } = extractPayload('```text\na\n```\n\n```text\nb\n```\n');

    expect(count).toBe(2);
  });

  test('ignores other fence languages', () => {
    const { count } = extractPayload('```js\nconst a = 1;\n```\n');

    expect(count).toBe(0);
  });

  test('is not affected by leftover state between calls', () => {
    const source = '```text\npayload\n```\n';
    const first = extractPayload(source);
    const second = extractPayload(source);

    expect(second.payload).toBe(first.payload);
    expect(second.count).toBe(1);
  });
});

describe('fingerprint', () => {
  test('is stable for identical input', () => {
    expect(fingerprint('abc')).toBe(fingerprint('abc'));
  });

  test('changes when the guidance changes by one character', () => {
    expect(fingerprint('abc')).not.toBe(fingerprint('abd'));
  });

  test('is a short hex string suitable for recording in Linear', () => {
    expect(fingerprint('abc')).toMatch(/^[0-9a-f]{12}$/);
  });

  test('handles multi-line content', () => {
    expect(fingerprint('a\nb\nc')).toMatch(/^[0-9a-f]{12}$/);
  });
});

describe('validatePayload rejects Enterprise-only guidance', () => {
  // Linear's own wording does not always match a single obvious term. Two that
  // a naive literal missed: "OAuth app approval" against "OAuth application
  // approvals", and a hyphenated "private-team issue sharing" against the
  // unhyphenated form. Caught by the local CodeRabbit review.
  test.each([
    ['ask the Workspace Owner', /workspace Admin/],
    ['configure SCIM first', /SCIM is Enterprise-only/],
    ['check the audit logs', /audit logs are Enterprise-only/],
    ['use workspace exports', /workspace exports are Enterprise-only/],
    ['OAuth application approvals are owner-only', /OAuth application approvals/],
    ['OAuth app approvals are owner-only', /OAuth application approvals/],
    ['private team issue sharing is Enterprise-only', /Enterprise-only/],
    ['private-team issue sharing is Enterprise-only', /Enterprise-only/],
    ['issue sharing from a private team', /Enterprise-only/],
    ['you can share an issue from a private team', /Enterprise-only/],
  ])('rejects the phrasing %s', (phrase, expected) => {
    const { errors } = validatePayload(`${minimalPayload()}\n${phrase}`);

    expect(errors.join('\n')).toMatch(expected);
  });

  test('every declared variant is actually reachable', () => {
    // Guards against a variant being added that the matcher never consults.
    for (const { variants } of ENTERPRISE_ONLY) {
      expect(Array.isArray(variants)).toBe(true);
      expect(variants.length).toBeGreaterThan(0);
      for (const variant of variants) {
        const { errors } = validatePayload(`${minimalPayload()}\n${variant}`);
        expect(errors.length).toBeGreaterThan(0);
      }
    }
  });

  test('names the matched variant in the casing the author used', () => {
    // The variant is singular and matches the prefix of the plural in the
    // source, so the quoted text is the singular form. The full phrase still
    // appears in the guidance half of the message.
    const { errors } = validatePayload(`${minimalPayload()}\nOAuth application approvals`);

    expect(errors.join('\n')).toMatch(/"OAuth application approval"/);
    expect(errors.join('\n')).toMatch(/OAuth application approvals are Enterprise-only/);
  });

  test('does not report a lowercased variant when the source is not', () => {
    const { errors } = validatePayload(`${minimalPayload()}\nask the Workspace Owner`);

    expect(errors.join('\n')).toMatch(/"Workspace Owner"/);
  });

  test('accepts the correct Business-plan term', () => {
    const { errors } = validatePayload(`${minimalPayload()}\nAsk a workspace Admin to approve.`);

    expect(errors).toEqual([]);
  });

  test('is case-insensitive', () => {
    const { errors } = validatePayload(`${minimalPayload()}\nCheck with a Workspace Owner.`);

    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('validatePayload requires the topics that make it useful', () => {
  test('reports every missing topic at once rather than only the first', () => {
    const { errors } = validatePayload('too short');

    expect(errors.length).toBeGreaterThan(3);
  });

  test('names the missing topic so the failure is actionable', () => {
    const { errors } = validatePayload(minimalPayload().replace(/UK English/i, 'American English'));

    expect(errors.join('\n')).toMatch(/UK English/);
  });

  test('accepts a complete payload with no errors', () => {
    expect(validatePayload(minimalPayload()).errors).toEqual([]);
  });
});

describe('validatePayload warnings', () => {
  test('warns when the payload is too short to be useful', () => {
    const { warnings } = validatePayload(
      'short but complete: AGENTS.md docs/AGENT-INDEX.md .github/workflows/ scripts/ __tests__ .github/labels.yml .gitattributes governance UK English'
    );

    expect(warnings.join('\n')).toMatch(/unlikely to cover/);
  });

  test('warns when the payload is long enough to be followed inconsistently', () => {
    const { warnings } = validatePayload(minimalPayload() + '\n' + 'x'.repeat(8000));

    expect(warnings.join('\n')).toMatch(/followed inconsistently/);
  });

  test('warns about an unresolved placeholder', () => {
    const { warnings } = validatePayload(`${minimalPayload()}\nTODO: confirm this`);

    expect(warnings.join('\n')).toMatch(/placeholder/);
  });

  test('warnings alone do not fail validation', () => {
    const report = validatePayload(`${minimalPayload()}\nTODO: confirm this`);

    expect(report.errors).toEqual([]);
  });
});

describe('the guidance file in this repository is valid', () => {
  // The point of the tool is to protect the real file, so the real file has to
  // be part of the suite. A rewrite that drops a topic fails here.
  test('passes with no errors and no warnings', () => {
    const report = validateLinearGuidance(REPO_ROOT);

    expect(report.errors).toEqual([]);
    expect(report.warnings).toEqual([]);
    expect(report.ok).toBe(true);
  });

  test('exposes a fingerprint to record in Linear', () => {
    const report = validateLinearGuidance(REPO_ROOT);

    expect(report.fingerprint).toMatch(/^[0-9a-f]{12}$/);
    expect(report.characters).toBeGreaterThan(400);
  });

  test('contains exactly one payload fence', () => {
    const report = validateLinearGuidance(REPO_ROOT);

    expect(report.payload.length).toBeGreaterThan(0);
  });

  test('names the AGENTS.md rule the repository actually enforces', () => {
    // Guards against the guidance drifting from the rule it describes. AGENTS.md
    // is the authority; if it stops forbidding .github/scripts/, this fails.
    const { payload } = validateLinearGuidance(REPO_ROOT);

    expect(payload).toMatch(/\.github\/scripts\//);
  });
});

describe('validateLinearGuidance failure modes', () => {
  test('reports a missing file rather than throwing', () => {
    const report = validateLinearGuidance(path.join(REPO_ROOT, 'no-such-dir'));

    expect(report.ok).toBe(false);
    expect(report.errors.join('\n')).toMatch(/Missing/);
  });
});

describe('the integration guide keeps every required section', () => {
  // A range-based edit once removed the whole Triage Intelligence section, which
  // carries a production warning about auto-applying labels to a locked label
  // set. Nothing failed; it was only caught because another section still
  // linked to the missing anchor. This makes the omission fail on its own.
  test('all sections are present in the real guide', () => {
    const { ok, missing } = validateGuideSections(REPO_ROOT);

    expect(missing).toEqual([]);
    expect(ok).toBe(true);
  });

  test('detects a removed section', () => {
    const contents = fs.readFileSync(path.join(REPO_ROOT, GUIDE_PATH), 'utf8');
    const stripped = contents
      .split('\n')
      .filter((line) => !line.startsWith('## Triage Intelligence'))
      .join('\n');
    const headings = new Set(
      stripped
        .split('\n')
        .filter((line) => line.startsWith('## '))
        .map((line) => line.slice(3).trim())
    );
    const missing = REQUIRED_GUIDE_SECTIONS.filter((section) => !headings.has(section));

    expect(missing).toContain('Triage Intelligence');
  });

  test('the Triage Intelligence section still carries the auto-apply warning', () => {
    // The section existing is not enough; the warning inside it is the point.
    const contents = fs.readFileSync(path.join(REPO_ROOT, GUIDE_PATH), 'utf8');
    const start = contents.indexOf('## Triage Intelligence');
    const end = contents.indexOf('## ', start + 3);
    const section = contents.slice(start, end === -1 ? undefined : end);

    expect(section).toMatch(/never auto-apply/i);
    expect(section).toMatch(/labels\.yml/);
  });

  test('reports a missing guide rather than throwing', () => {
    const result = validateGuideSections(path.join(REPO_ROOT, 'no-such-dir'));

    expect(result.ok).toBe(false);
    expect(result.missing.join()).toMatch(/Missing/);
  });
});

describe('the CLI enforces the guide-section guard', () => {
  // The guard is only worth having if the script CI runs enforces it. A test
  // alone would leave `npm run validate:all` green while the guide had silently
  // lost a section. Found by the local CodeRabbit review.
  const { execFileSync } = require('child_process');
  const script = path.join(REPO_ROOT, 'scripts', 'validation', 'validate-linear-guidance.cjs');

  test('exits 0 on a clean tree', () => {
    expect(() => execFileSync('node', [script], { cwd: REPO_ROOT })).not.toThrow();
  });

  test('reports the fingerprint a maintainer records in Linear', () => {
    const out = execFileSync('node', [script], { cwd: REPO_ROOT, encoding: 'utf8' });

    expect(out).toMatch(/Fingerprint: [0-9a-f]{12}/);
  });
});

describe('headingsOutsideFences ignores headings inside code blocks', () => {
  // A `## ` line inside an example must not satisfy a required-section check.
  // Found by the local CodeRabbit review: the previous scan matched any line
  // beginning with `## `, so a section could look present purely because an
  // example mentioned it.
  test('excludes a heading inside a text fence', () => {
    const headings = headingsOutsideFences('## Real\n\n```text\n## Fake\n```\n\n## Also real\n');

    expect(headings).toEqual(['Real', 'Also real']);
    expect(headings).not.toContain('Fake');
  });

  test('excludes a heading inside a non-text fence', () => {
    const headings = headingsOutsideFences('```sh\n## not a heading\n```\n');

    expect(headings).toEqual([]);
  });

  test('handles several fences in sequence', () => {
    const headings = headingsOutsideFences(
      [
        '## One',
        '```text',
        '## Hidden',
        '```',
        '## Two',
        '```js',
        '## AlsoHidden',
        '```',
        '## Three',
      ].join('\n')
    );

    expect(headings).toEqual(['One', 'Two', 'Three']);
  });

  test('the real integration guide carries every required section', () => {
    const contents = fs.readFileSync(path.join(REPO_ROOT, GUIDE_PATH), 'utf8');
    const found = headingsOutsideFences(contents);

    // The required list is a minimum, not an exhaustive set: the guide also has
    // a Table of Contents, so adding a section must not fail this test.
    expect(REQUIRED_GUIDE_SECTIONS.filter((section) => !found.includes(section))).toEqual([]);
    expect(found.length).toBeGreaterThanOrEqual(REQUIRED_GUIDE_SECTIONS.length);
  });
});

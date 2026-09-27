const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  ENTERPRISE_ONLY,
  GUIDE_PATH,
  GUIDANCE_PATH,
  REQUIRED_GUIDE_SECTIONS,
  escapeRegExp,
  extractPayload,
  fingerprint,
  headingsOutsideFences,
  validateGuideSections,
  validateLinearGuidance,
  validatePayload,
} = require('../validate-linear-guidance.cjs');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');

/**
 * Organisation-level claims the shipped payload must make. Held separately from
 * the validator's REQUIRED_TOPICS so a failure here names the exact thing that
 * stopped the guidance from covering the whole organisation.
 */
const REQUIRED_ORG_SCOPE = [
  /do not share one stack|do not assume/i,
  /read (that|the target) repository's own|its own (AGENTS|documentation)/i,
  /REPOSITORY FAMILIES/i,
  /lightspeed-hosting-infra/,
  /nexus/i,
  /WordPress/i,
  /PHP/i,
  /UK English/i,
];

/** A minimal payload that satisfies every required topic. */
function minimalPayload() {
  return [
    'The repositories do not share one stack, so read the target repository’s own',
    'documentation before answering.',
    'REPOSITORY FAMILIES: .github, lightspeed-hosting-infra, lightspeed-nexus.',
    'The organisation is predominantly PHP and predominantly WordPress.',
    'lightspeedwp/.github is the governance control plane.',
    'Read AGENTS.md, then docs/AGENT-INDEX.md.',
    'Workflows live in .github/workflows/.',
    'Scripts live in scripts/ and are tested in __tests__/.',
    '.github/labels.yml is locked.',
    '.gitattributes assigns review categories.',
    'This repository uses UK English.',
  ].join('\n');
}

describe('validateLinearGuidance', () => {
  it('reads the guidance file it is documented to validate', () => {
    // GUIDANCE_PATH holds the payload; GUIDE_PATH holds the integration guide.
    // They are different files, so pin both to catch either drifting or being
    // pointed at the other by mistake.
    expect(GUIDANCE_PATH).toBe('docs/LINEAR_AGENT_GUIDANCE.md');
    expect(GUIDE_PATH).toBe('docs/LINEAR_INTEGRATION.md');
    expect(GUIDANCE_PATH).not.toBe(GUIDE_PATH);
    // Both constants are relative, so resolve against REPO_ROOT. Testing the
    // bare relative path passes only when the runner happens to sit at the
    // repository root, and fails for the wrong reason anywhere else.
    expect(fs.existsSync(path.resolve(REPO_ROOT, GUIDANCE_PATH))).toBe(true);
    expect(fs.existsSync(path.resolve(REPO_ROOT, GUIDE_PATH))).toBe(true);
  });

  it('describes the whole organisation, not only this repository', () => {
    // Reads the file rather than a fixture, so this is the shipped guidance.
    const { payload } = validateLinearGuidance(REPO_ROOT);
    const missing = REQUIRED_ORG_SCOPE.filter((pattern) => !pattern.test(payload));

    expect(missing).toEqual([]);
  });
});

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
  // Linear's own wording does not always match a single obvious term. A
  // hyphenated "private-team issue sharing" does not match the unhyphenated
  // form. Caught by the local CodeRabbit review.
  test.each([
    ['ask the Workspace Owner', /workspace Admin/],
    ['configure SCIM first', /SCIM is Enterprise-only/],
    ['check the audit logs', /audit logs are Enterprise-only/],
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
    const { errors } = validatePayload(`${minimalPayload()}\nask the Workspace Owner`);

    expect(errors.join('\n')).toMatch(/"Workspace Owner"/);
  });

  test.each(['workspace exports', 'OAuth app approvals', 'OAuth application approvals'])(
    'allows the Business-plan feature %s',
    (feature) => {
      expect(validatePayload(`${minimalPayload()}\n${feature}`).errors).toEqual([]);
    }
  );

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
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'linear-guide-'));
    try {
      fs.mkdirSync(path.join(root, 'docs'));
      fs.writeFileSync(
        path.join(root, GUIDE_PATH),
        `~~~md\n## Triage Intelligence\n~~~\n${contents.replace('## Triage Intelligence', '')}`
      );
      expect(validateGuideSections(root).missing).toContain('Triage Intelligence');
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
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

  test('reports a missing never auto-apply warning inside Triage Intelligence', () => {
    const contents = fs.readFileSync(path.join(REPO_ROOT, GUIDE_PATH), 'utf8');
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'linear-guide-'));
    try {
      fs.mkdirSync(path.join(root, 'docs'));
      fs.writeFileSync(
        path.join(root, GUIDE_PATH),
        contents
          .replace('suggest only, never auto-apply', 'suggest only')
          .replace(
            '## Triage Intelligence',
            '~~~text\nnever auto-apply\n~~~\n## Triage Intelligence'
          )
      );
      expect(validateGuideSections(root).missing).toContain(
        'Triage Intelligence "never auto-apply" warning'
      );
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});

describe('the CLI enforces the guide-section guard', () => {
  // The guard is only worth having if the script CI runs enforces it. A test
  // alone would leave `npm run validate:all` green while the guide had silently
  // lost a section. Found by the local CodeRabbit review.
  const { execFileSync, spawnSync } = require('child_process');
  const script = path.join(REPO_ROOT, 'scripts', 'validation', 'validate-linear-guidance.cjs');
  // process.execPath rather than "node": resolving the interpreter through PATH
  // makes the test depend on how the runner was invoked, and a hung child would
  // hang the suite instead of failing it.
  const RUN = { timeout: 5000 };

  test('exits 0 on a clean tree', () => {
    expect(() =>
      execFileSync(process.execPath, [script], { cwd: REPO_ROOT, ...RUN })
    ).not.toThrow();
  });

  test('reports the fingerprint a maintainer records in Linear', () => {
    const out = execFileSync(process.execPath, [script], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      ...RUN,
    });

    expect(out).toMatch(/Fingerprint: [0-9a-f]{12}/);
  });

  test('fails when the Triage Intelligence warning is removed', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'linear-guide-'));
    try {
      fs.mkdirSync(path.join(root, 'docs'));
      fs.copyFileSync(path.join(REPO_ROOT, GUIDANCE_PATH), path.join(root, GUIDANCE_PATH));
      const contents = fs.readFileSync(path.join(REPO_ROOT, GUIDE_PATH), 'utf8');
      fs.writeFileSync(
        path.join(root, GUIDE_PATH),
        contents.replace('suggest only, never auto-apply', 'suggest only')
      );
      const result = spawnSync(process.execPath, [script], {
        cwd: root,
        encoding: 'utf8',
        ...RUN,
      });
      expect(result.status).toBe(1);
      expect(result.stderr).toMatch(/missing section\(s\).*never auto-apply/i);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
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

  test('ignores tilde fences and closes only with a matching marker', () => {
    const headings = headingsOutsideFences(
      '## One\n~~~md\n## Hidden\n```\n## Still hidden\n~~~\n## Two\n'
    );

    expect(headings).toEqual(['One', 'Two']);
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

describe('payload extraction edge cases', () => {
  test.each([
    ['empty document', '', { payload: '', count: 0, unterminated: 0 }],
    ['empty block', '```text\n```', { payload: '', count: 1, unterminated: 0 }],
    ['blank block', '```text\n \t\n```', { payload: '', count: 1, unterminated: 0 }],
    ['unclosed block', '```text\nbody', { payload: '', count: 1, unterminated: 1 }],
    [
      'two closed blocks',
      '```text\nfirst\n```\n```text\nsecond\n```',
      { payload: '', count: 2, unterminated: 0 },
    ],
    [
      'trailing whitespace on fences',
      '```text \t\nfirst\n\n  indented\nlast\n```\t ',
      { payload: 'first\n\n  indented\nlast', count: 1, unterminated: 0 },
    ],
  ])('handles %s', (_name, contents, expected) => {
    expect(extractPayload(contents)).toEqual(expected);
  });

  test('ignores text openers inside another language block', () => {
    const contents = '```markdown\n```text\nexample\n```\n```text\nreal payload\n```';

    expect(extractPayload(contents)).toEqual({
      payload: 'real payload',
      count: 1,
      unterminated: 0,
    });
  });
});

describe('fingerprint compatibility', () => {
  test.each([
    ['', 'e3b0c44298fc'],
    ['abc', 'ba7816bf8f01'],
  ])('keeps the SHA-256 prefix for %j', (payload, expected) => {
    // Fixed vectors catch an algorithm change that would invalidate recorded fingerprints.
    expect(fingerprint(payload)).toBe(expected);
  });

  test('includes internal whitespace in the fingerprint', () => {
    expect(fingerprint('first\nsecond')).not.toBe(fingerprint('first second'));
  });
});

describe('escapeRegExp', () => {
  test.each([
    '',
    'plain text',
    '.',
    '*',
    '+',
    '?',
    '^',
    '$',
    '{',
    '}',
    '(',
    ')',
    '|',
    '[',
    ']',
    '\\',
  ])('matches %j literally', (literal) => {
    const pattern = new RegExp(`^${escapeRegExp(literal)}$`);

    expect(pattern.test(literal)).toBe(true);
    expect(pattern.test('different text')).toBe(false);
  });
});

describe('required topic regressions', () => {
  test.each([
    ['do not share one stack', 'warn against assuming one shared stack across repositories'],
    [
      'read the target repository’s own',
      "instruct reading the target repository's own documentation first",
    ],
    ['REPOSITORY FAMILIES', 'name the repository families'],
    ['.github', 'identify the .github governance repository'],
    ['lightspeed-hosting-infra', 'name the hosting infrastructure repository'],
    ['nexus', 'name the nexus product family'],
    ['WordPress', 'state the WordPress majority'],
    ['PHP', 'state the predominant language'],
    ['UK English', 'state the UK English requirement'],
    ['AGENTS.md', 'point at AGENTS.md as the canonical rules'],
    ['docs/AGENT-INDEX.md', 'point at the agent index'],
    ['.github/workflows/', 'say where workflows live'],
    ['scripts/', 'say where scripts live'],
    ['__tests__', 'state the test location requirement'],
    ['labels.yml', 'name the locked label configuration'],
    ['.gitattributes', 'mention the review categories'],
  ])('detects loss of %s from otherwise complete guidance', (phrase, topic) => {
    const payload = minimalPayload().split(phrase).join('removed');

    expect(validatePayload(payload).errors).toContain(`Does not ${topic}.`);
  });

  test.each([
    "read the target repository's own",
    'read that repository’s own',
    "read that repository's own",
    'its own documentation',
    'its own AGENTS',
  ])('accepts the supported documentation wording: %s', (wording) => {
    const payload = minimalPayload().replace('read the target repository’s own', wording);

    expect(validatePayload(payload).errors).toEqual([]);
  });

  test('cites the Linear documentation behind every Enterprise-only claim', () => {
    // A classification the reader cannot check is a classification they have to
    // trust. Two entries were already wrong once, so each now carries the page
    // that establishes it.
    const undocumented = ENTERPRISE_ONLY.filter(
      ({ source }) => !/^https:\/\/linear\.app\/docs\//.test(source || '')
    );

    expect(undocumented.map(({ id }) => id)).toEqual([]);
  });

  test('reports a forbidden concept with the documentation link that proves it', () => {
    const { errors } = validatePayload(`${minimalPayload()}\nUse SCIM.`);

    expect(errors).toEqual([expect.stringContaining('https://linear.app/docs/scim')]);
  });

  test('reports each forbidden concept once even when its variants repeat', () => {
    // Both concepts are still Enterprise-only. Workspace exports and third-party
    // application approvals are not: they are available to a workspace Admin on
    // Business, so using them here would assert the opposite of the correction
    // in 80b3000560 and pass for the wrong reason.
    const { errors } = validatePayload(`${minimalPayload()}\nSCIM SCIM audit log and audit logs`);

    expect(errors).toHaveLength(2);
    expect(errors).toEqual([
      expect.stringContaining('(scim)'),
      expect.stringContaining('(audit-log)'),
    ]);
  });

  test('reports forbidden concepts and missing topics together', () => {
    const payload = minimalPayload().replace('UK English', 'American English') + '\nUse SCIM.';
    const { errors } = validatePayload(payload);

    expect(errors).toHaveLength(2);
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining('(scim)'),
        'Does not state the UK English requirement.',
      ])
    );
  });
});

describe('payload warning boundaries', () => {
  test.each([
    [399, /unlikely to cover/],
    [400, null],
    [8000, null],
    [8001, /followed inconsistently/],
  ])('applies length warnings at %i characters', (length, expected) => {
    const { warnings } = validatePayload('x'.repeat(length));

    expect(warnings).toEqual(expected ? [expect.stringMatching(expected)] : []);
  });

  test.each(['TODO', 'tbd', 'Placeholder'])('warns about %s', (marker) => {
    const { errors, warnings } = validatePayload(`${minimalPayload()}\n${marker}`);

    expect(errors).toEqual([]);
    expect(warnings).toEqual([expect.stringMatching(/placeholder/)]);
  });

  test('does not mistake embedded TODO or TBD letters for placeholders', () => {
    const { warnings } = validatePayload(`${minimalPayload()}\nTODOLOGY ATBDZ`);

    expect(warnings).toEqual([]);
  });

  test('reports an empty payload without unrelated topic or length diagnostics', () => {
    expect(validatePayload('')).toEqual({
      errors: [expect.stringContaining('No guidance payload found')],
      warnings: [],
    });
  });
});

describe('guidance and guide validation with isolated files', () => {
  const fixtureRoot = path.join(os.tmpdir(), 'linear-guidance-unit-fixture');

  beforeEach(() => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue('');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('reports only the extracted payload, ignoring surrounding documentation', () => {
    const payload = minimalPayload();
    fs.readFileSync.mockReturnValue(
      `SCIM documentation\n\n\`\`\`text\n\n${payload}\n\n\`\`\`\nTODO`
    );

    expect(validateLinearGuidance(fixtureRoot)).toEqual({
      ok: true,
      file: GUIDANCE_PATH,
      payload,
      fingerprint: fingerprint(payload),
      characters: payload.length,
      errors: [],
      warnings: [],
    });
    expect(fs.readFileSync).toHaveBeenCalledWith(path.join(fixtureRoot, GUIDANCE_PATH), 'utf8');
  });

  test.each([
    ['no fence', 'plain prose', /Found 0/],
    ['empty payload', '```text\n```', /No guidance payload/],
    ['unclosed payload', '```text\nbody', /never closed/],
    ['duplicate payloads', '```text\none\n```\n```text\ntwo\n```', /Found 2/],
    ['trailing unclosed payload', '```text\none\n```\n```text\ntwo', /never closed/],
  ])('rejects %s without publishing a fingerprint', (_name, contents, error) => {
    fs.readFileSync.mockReturnValue(contents);

    expect(validateLinearGuidance(fixtureRoot)).toEqual({
      ok: false,
      file: GUIDANCE_PATH,
      payload: '',
      fingerprint: null,
      characters: 0,
      errors: expect.arrayContaining([expect.stringMatching(error)]),
      warnings: [],
    });
  });

  test('does not attempt to read a missing guidance file', () => {
    fs.existsSync.mockReturnValue(false);

    expect(validateLinearGuidance(fixtureRoot)).toEqual({
      ok: false,
      file: GUIDANCE_PATH,
      payload: '',
      fingerprint: null,
      characters: 0,
      errors: [`Missing ${GUIDANCE_PATH}.`],
      warnings: [],
    });
    expect(fs.readFileSync).not.toHaveBeenCalled();
  });

  test('returns the exact missing guide path without reading it', () => {
    fs.existsSync.mockReturnValue(false);

    expect(validateGuideSections(fixtureRoot)).toEqual({
      ok: false,
      missing: [`Missing ${GUIDE_PATH}.`],
    });
    expect(fs.readFileSync).not.toHaveBeenCalled();
  });

  test('rejects a deleted guide section even if a fenced example still names it', () => {
    const contents = REQUIRED_GUIDE_SECTIONS.filter((section) => section !== 'Triage Intelligence')
      .map((section) => `## ${section}`)
      .join('\n');
    fs.readFileSync.mockReturnValue(`${contents}\n\`\`\`text\n## Triage Intelligence\n\`\`\``);

    expect(validateGuideSections(fixtureRoot)).toEqual({
      ok: false,
      missing: ['Triage Intelligence'],
    });
  });

  test('reports all missing sections for an empty guide', () => {
    expect(validateGuideSections(fixtureRoot)).toEqual({
      ok: false,
      missing: REQUIRED_GUIDE_SECTIONS,
    });
  });
});

describe('heading boundaries', () => {
  test('accepts only level-two headings and trims their titles', () => {
    expect(
      headingsOutsideFences('# Title\n### Nested\n##No space\n## Real  \t\n## Also real')
    ).toEqual(['Real', 'Also real']);
  });

  test('ignores the remainder of an unclosed code fence', () => {
    expect(headingsOutsideFences('## Before\n```text\n## Hidden\n## Still hidden')).toEqual([
      'Before',
    ]);
  });
});

describe('CLI output and failure contracts', () => {
  const script = path.join(REPO_ROOT, 'scripts/validation/validate-linear-guidance.cjs');
  let root;

  /**
   * A guide fixture that satisfies every section rule, including the
   * auto-apply warning inside Triage Intelligence. A bare list of headings is
   * not a valid guide: the section check rejects a Triage section that exists
   * but has lost its warning, so a fixture built from headings alone now fails
   * for the right reason and would mask the CLI contracts under test.
   */
  function guideFixture(sections = REQUIRED_GUIDE_SECTIONS) {
    return sections
      .map((section) =>
        section === 'Triage Intelligence'
          ? `## ${section}\n\nLabels are suggested only, never auto-apply, because .github/labels.yml is locked.`
          : `## ${section}`
      )
      .join('\n\n');
  }

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'linear-guidance-cli-'));
    fs.mkdirSync(path.join(root, 'docs'));
    fs.writeFileSync(path.join(root, GUIDANCE_PATH), `\`\`\`text\n${minimalPayload()}\n\`\`\`\n`);
    fs.writeFileSync(path.join(root, GUIDE_PATH), guideFixture());
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  function runCli(...args) {
    return spawnSync(process.execPath, [script, ...args], {
      cwd: root,
      encoding: 'utf8',
      timeout: 5000,
    });
  }

  test('emits a parseable JSON report with metadata but no payload', () => {
    const result = runCli('--json');

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      ok: true,
      file: GUIDANCE_PATH,
      fingerprint: fingerprint(minimalPayload()),
      characters: minimalPayload().length,
      errors: [],
      warnings: [],
    });
  });

  test.each(['text', 'json'])('fails when the guide loses a section (%s output)', (format) => {
    fs.writeFileSync(
      path.join(root, GUIDE_PATH),
      guideFixture(REQUIRED_GUIDE_SECTIONS.filter((section) => section !== 'Triage Intelligence'))
    );
    const result = runCli(...(format === 'json' ? ['--json'] : []));

    expect(result.status).toBe(1);
    if (format === 'json') {
      const report = JSON.parse(result.stdout);
      expect(report.ok).toBe(false);
      expect(report.errors).toEqual([
        expect.stringMatching(/LINEAR_INTEGRATION\.md.*Triage Intelligence/),
      ]);
      expect(report).not.toHaveProperty('payload');
      expect(result.stderr).toBe('');
    } else {
      expect(result.stdout).toBe('');
      expect(result.stderr).toMatch(/ERROR.*LINEAR_INTEGRATION\.md.*Triage Intelligence/);
    }
  });

  test('fails and reports both missing documents in JSON', () => {
    fs.rmSync(path.join(root, 'docs'), { recursive: true });
    const result = runCli('--json');
    const report = JSON.parse(result.stdout);

    expect(result.status).toBe(1);
    expect(result.stderr).toBe('');
    expect(report.ok).toBe(false);
    expect(report.fingerprint).toBeNull();
    expect(report.characters).toBe(0);
    expect(report.errors).toEqual([
      `Missing ${GUIDANCE_PATH}.`,
      expect.stringContaining(`Missing ${GUIDE_PATH}.`),
    ]);
  });

  test('rejects invalid guidance even when the guide has every section', () => {
    fs.writeFileSync(
      path.join(root, GUIDANCE_PATH),
      `\`\`\`text\n${minimalPayload()}\nUse SCIM.\n\`\`\``
    );
    const result = runCli();

    expect(result.status).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toMatch(/ERROR.*SCIM/);
  });

  test.each(['text', 'json'])('keeps warnings non-fatal (%s output)', (format) => {
    fs.writeFileSync(
      path.join(root, GUIDANCE_PATH),
      `\`\`\`text\n${minimalPayload()}\nTODO: confirm\n\`\`\``
    );
    const result = runCli(...(format === 'json' ? ['--json'] : []));

    expect(result.status).toBe(0);
    if (format === 'json') {
      const report = JSON.parse(result.stdout);
      expect(report.ok).toBe(true);
      expect(report.errors).toEqual([]);
      expect(report.warnings).toEqual([expect.stringMatching(/placeholder/)]);
      expect(result.stderr).toBe('');
    } else {
      expect(result.stdout).toMatch(/Linear agent guidance is valid/);
      expect(result.stdout).toMatch(/Fingerprint: [0-9a-f]{12}/);
      expect(result.stderr).toMatch(/WARN.*placeholder/);
    }
  });
});

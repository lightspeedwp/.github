const {
  EXTENSION_MARKER,
  RISK_CATEGORIES,
  RISK_LABELS,
  SUPPORTED_AGENTS,
  buildExtensionBlock,
  buildRiskAssessment,
  parseExtensionBlocks,
  upsertExtensionComment,
} = require('../linear-review-extension.cjs');

const VALID_SHA = '0123456789abcdef0123456789abcdef01234567';

/** A path that triggers exactly one RISK_CATEGORIES entry, and no other. */
const SAMPLE_PATH_FOR = {
  'github-actions': '.github/workflows/linear-review-platform.yml',
  'governance-config': '.github/labels.yml',
  'repository-rulesets': '.github/rulesets/develop.ruleset.json',
  'dependency-lockfile': 'package-lock.json',
  'security-config': '.gitleaks.toml',
  'security-sensitive-path': 'plugins/wordpress/auth/session.php',
};

function createGithubMock(comments = []) {
  return {
    paginate: jest.fn().mockResolvedValue(comments),
    rest: {
      issues: {
        listComments: jest.fn(),
        createComment: jest.fn().mockResolvedValue({ data: {} }),
        updateComment: jest.fn().mockResolvedValue({ data: {} }),
      },
    },
  };
}

function countWrites(github) {
  return (
    github.rest.issues.createComment.mock.calls.length +
    github.rest.issues.updateComment.mock.calls.length
  );
}

describe('buildRiskAssessment', () => {
  test('returns level 1 and no explanations for empty input', () => {
    expect(buildRiskAssessment({})).toEqual({ level: 1, explanations: [] });
  });

  test('returns level 1 when called with no argument at all', () => {
    expect(buildRiskAssessment()).toEqual({ level: 1, explanations: [] });
  });

  test('leaves a single low-risk file at level 1', () => {
    const result = buildRiskAssessment({ files: ['scripts/automation/example.js'] });

    expect(result.level).toBe(1);
    expect(result.explanations).toEqual([]);
  });

  test.each(RISK_CATEGORIES.map((category) => [category.id, category]))(
    'escalates one level for the %s category',
    (_id, category) => {
      const result = buildRiskAssessment({ files: [SAMPLE_PATH_FOR[category.id]] });

      expect(result.level).toBe(2);
      expect(result.explanations).toHaveLength(1);
      expect(result.explanations[0]).toContain(category.label);
    }
  );

  test('names a single matched file and counts several', () => {
    const single = buildRiskAssessment({ files: ['.github/labels.yml'] });
    const several = buildRiskAssessment({
      files: ['.github/labels.yml', '.github/issue-types.yml', 'CODEOWNERS'],
    });

    expect(single.explanations).toEqual(['Touches locked governance config: .github/labels.yml']);
    expect(several.explanations).toEqual(['Changes locked governance config (3 files)']);
  });

  test('ignores duplicate files rather than double counting a category', () => {
    const result = buildRiskAssessment({
      files: ['.github/labels.yml', '.github/labels.yml', { filename: '.github/labels.yml' }],
    });

    expect(result.level).toBe(2);
    expect(result.explanations).toEqual(['Touches locked governance config: .github/labels.yml']);
  });

  test('clamps at level 4 when every signal fires', () => {
    const result = buildRiskAssessment({
      files: Object.values(SAMPLE_PATH_FOR),
      labels: RISK_LABELS,
      additions: 4000,
      deletions: 1000,
    });

    expect(result.level).toBe(4);
  });

  test('does not escalate below the 500 line threshold', () => {
    expect(buildRiskAssessment({ additions: 499 }).level).toBe(1);
    expect(buildRiskAssessment({ additions: 250, deletions: 249 }).level).toBe(1);
  });

  test('adds one level at 500 changed lines', () => {
    const result = buildRiskAssessment({ additions: 300, deletions: 200 });

    expect(result.level).toBe(2);
    expect(result.explanations).toEqual(['Large diff: 500 changed lines']);
  });

  test('adds one level just below 1500 changed lines', () => {
    const result = buildRiskAssessment({ additions: 1000, deletions: 499 });

    expect(result.level).toBe(2);
    expect(result.explanations).toEqual(['Large diff: 1499 changed lines']);
  });

  test('adds two levels at 1500 changed lines', () => {
    const result = buildRiskAssessment({ additions: 1000, deletions: 500 });

    expect(result.level).toBe(3);
    expect(result.explanations).toEqual(['Very large diff: 1500 changed lines']);
  });

  test.each(RISK_LABELS)('escalates for the %s label', (label) => {
    const result = buildRiskAssessment({ labels: [label] });

    expect(result.level).toBe(2);
    expect(result.explanations).toEqual([`Escalating label applied: ${label}`]);
  });

  test('matches labels case-insensitively and accepts GitHub label objects', () => {
    const result = buildRiskAssessment({ labels: [{ name: 'Priority:Critical' }] });

    expect(result.level).toBe(2);
  });

  test('ignores labels that do not escalate', () => {
    expect(buildRiskAssessment({ labels: ['type:bug', 'area:docs'] }).level).toBe(1);
  });

  test('caps explanations at eight entries, keeping category order first', () => {
    const result = buildRiskAssessment({
      files: Object.values(SAMPLE_PATH_FOR),
      labels: RISK_LABELS,
      additions: 2000,
    });

    expect(RISK_CATEGORIES.length + RISK_LABELS.length + 1).toBeGreaterThan(8);
    expect(result.explanations).toHaveLength(8);
    expect(result.explanations[0]).toContain(RISK_CATEGORIES[0].label);
  });

  test('truncates an over-long explanation to 200 characters', () => {
    const longPath = `plugins/${'x'.repeat(400)}/auth-handler.js`;
    const result = buildRiskAssessment({ files: [longPath] });

    expect(result.level).toBe(2);
    expect(result.explanations[0]).toHaveLength(200);
    expect(result.explanations[0].startsWith('Touches security-sensitive paths: plugins/xxx')).toBe(
      true
    );
  });

  test('is deterministic for the same input', () => {
    const input = {
      files: Object.values(SAMPLE_PATH_FOR),
      labels: [...RISK_LABELS, 'priority:critical'],
      additions: 900,
      deletions: 300,
    };

    expect(buildRiskAssessment(input)).toEqual(buildRiskAssessment(input));
  });

  test('is unaffected by the order of the changed file list', () => {
    const forward = buildRiskAssessment({ files: ['.github/labels.yml', 'package-lock.json'] });
    const reversed = buildRiskAssessment({ files: ['package-lock.json', '.github/labels.yml'] });

    expect(forward).toEqual(reversed);
  });

  test('accepts both plain path strings and { filename } objects', () => {
    const fromStrings = buildRiskAssessment({ files: ['.github/rulesets/main.ruleset.json'] });
    const fromObjects = buildRiskAssessment({
      files: [{ filename: '.github/rulesets/main.ruleset.json' }],
    });

    expect(fromStrings).toEqual(fromObjects);
  });

  test.each([
    ['null', null],
    ['undefined', undefined],
    ['a number', 42],
    ['a string', '.github/labels.yml'],
    ['a mixed garbage array', [null, 7, {}, { filename: 9 }, '', '   ']],
    ['garbage labels', 'not-an-array'],
  ])('never throws on %s input', (_label, value) => {
    expect(() => buildRiskAssessment({ files: value, labels: value })).not.toThrow();
    expect(buildRiskAssessment({ files: value, labels: value }).level).toBeGreaterThanOrEqual(1);
  });

  test('ignores non-numeric addition and deletion counts', () => {
    const result = buildRiskAssessment({ additions: 'many', deletions: null });

    expect(result).toEqual({ level: 1, explanations: [] });
  });
});

describe('buildExtensionBlock', () => {
  test('emits both plugins in one block', () => {
    const body = buildExtensionBlock({
      risk: { level: 3, explanations: ['Touches authentication'] },
      agent: 'claude',
      model: 'Opus 4.5',
      sha: VALID_SHA,
    });

    expect(body).toContain(EXTENSION_MARKER);
    expect(body).toContain('<!-- linear:extension');
    expect(body.match(/<!--\s*linear:extension/g)).toHaveLength(1);

    const blocks = parseExtensionBlocks(body);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].map((plugin) => plugin.plugin)).toEqual(['riskScore', 'onBehalfOf']);
  });

  test('emits a single valid JSON payload that starts with the marker', () => {
    const body = buildExtensionBlock({ risk: { level: 1 } });

    expect(body.startsWith(`${EXTENSION_MARKER}\n`)).toBe(true);
    const payload = JSON.parse(
      body
        .slice(
          body.indexOf('<!-- linear:extension ') + '<!-- linear:extension '.length,
          body.lastIndexOf('-->')
        )
        .trim()
    );
    expect(payload.version).toBe(1);
    expect(payload.plugins[0]).toEqual({ plugin: 'riskScore', level: 1 });
  });

  test('omits sha and explanations when they are absent', () => {
    const plugin = parseExtensionBlocks(buildExtensionBlock({ risk: { level: 2 } }))[0][0];

    expect(plugin).not.toHaveProperty('sha');
    expect(plugin).not.toHaveProperty('explanations');
  });

  test('omits model when it is absent or blank', () => {
    const block = buildExtensionBlock({ agent: 'codex' });
    const blank = buildExtensionBlock({ agent: 'codex', model: '   ' });

    expect(parseExtensionBlocks(block)[0][0]).toEqual({ plugin: 'onBehalfOf', agent: 'codex' });
    expect(parseExtensionBlocks(blank)[0][0]).not.toHaveProperty('model');
  });

  test('emits onBehalfOf alone when there is no risk assessment', () => {
    const body = buildExtensionBlock({ risk: null, agent: 'opencode' });

    expect(parseExtensionBlocks(body)[0].map((plugin) => plugin.plugin)).toEqual(['onBehalfOf']);
  });

  test('returns null when there is nothing to publish', () => {
    expect(buildExtensionBlock({ risk: null })).toBeNull();
    expect(buildExtensionBlock({})).toBeNull();
    expect(buildExtensionBlock()).toBeNull();
    expect(buildExtensionBlock({ agent: '   ' })).toBeNull();
  });

  test.each([0, 5, 1.5, '3', null])('throws on the out-of-range level %p', (level) => {
    expect(() => buildExtensionBlock({ risk: { level } })).toThrow(/Invalid riskScore level/);
  });

  test.each([VALID_SHA, 'ABCDEF0123456789ABCDEF0123456789ABCDEF01'])(
    'accepts the 40-character SHA %s',
    (sha) => {
      expect(parseExtensionBlocks(buildExtensionBlock({ risk: { level: 1 }, sha }))[0][0].sha).toBe(
        sha
      );
    }
  );

  test.each(['not-a-sha', 'abc', `${VALID_SHA}0`, 'z'.repeat(40)])(
    'throws on the malformed SHA %s',
    (sha) => {
      expect(() => buildExtensionBlock({ risk: { level: 1 }, sha })).toThrow(
        /40-character hexadecimal commit SHA/
      );
    }
  );

  test('truncates more than eight explanations', () => {
    const explanations = Array.from({ length: 20 }, (_value, index) => `Reason ${index}`);
    const plugin = parseExtensionBlocks(
      buildExtensionBlock({ risk: { level: 4, explanations } })
    )[0][0];

    expect(plugin.explanations).toHaveLength(8);
    expect(plugin.explanations[0]).toBe('Reason 0');
  });

  test('truncates over-long explanations to 200 characters', () => {
    const plugin = parseExtensionBlocks(
      buildExtensionBlock({ risk: { level: 2, explanations: ['y'.repeat(500)] } })
    )[0][0];

    expect(plugin.explanations[0]).toHaveLength(200);
  });

  test('truncates an over-long model to 200 characters', () => {
    const plugin = parseExtensionBlocks(
      buildExtensionBlock({ agent: 'claude', model: 'm'.repeat(500) })
    )[0][0];

    expect(plugin.model).toHaveLength(200);
  });

  test('drops blank and duplicate explanations rather than emitting them', () => {
    const plugin = parseExtensionBlocks(
      buildExtensionBlock({ risk: { level: 2, explanations: ['Same', 'Same', '  ', 42] } })
    )[0][0];

    expect(plugin.explanations).toEqual(['Same']);
  });

  test('accepts an unknown agent without throwing', () => {
    const body = buildExtensionBlock({ agent: 'my-own-bot' });

    expect(SUPPORTED_AGENTS).not.toContain('my-own-bot');
    expect(parseExtensionBlocks(body)[0][0]).toEqual({
      plugin: 'onBehalfOf',
      agent: 'my-own-bot',
    });
  });

  test('honours visible on each plugin object', () => {
    const visible = parseExtensionBlocks(
      buildExtensionBlock({ risk: { level: 1 }, agent: 'claude', visible: true })
    )[0];

    expect(visible.map((plugin) => plugin.visible)).toEqual([true, true]);

    const hidden = parseExtensionBlocks(
      buildExtensionBlock({ risk: { level: 1 }, agent: 'claude', visible: false })
    )[0];

    expect(hidden.map((plugin) => plugin.visible)).toEqual([false, false]);
  });

  test('omits visible when it is not a boolean', () => {
    const plugin = parseExtensionBlocks(
      buildExtensionBlock({ risk: { level: 1 }, visible: 'yes' })
    )[0][0];

    expect(plugin).not.toHaveProperty('visible');
  });
});

describe('parseExtensionBlocks', () => {
  test('round-trips a block produced by buildExtensionBlock', () => {
    const assessment = buildRiskAssessment({
      files: ['.github/labels.yml'],
      labels: ['type:security'],
      additions: 600,
    });
    const body = buildExtensionBlock({
      risk: assessment,
      agent: 'claude',
      model: 'Opus 4.5',
      sha: VALID_SHA,
      visible: true,
    });
    const plugins = parseExtensionBlocks(body)[0];

    expect(plugins[0]).toEqual({
      plugin: 'riskScore',
      sha: VALID_SHA,
      level: 4,
      explanations: [
        'Touches locked governance config: .github/labels.yml',
        'Escalating label applied: type:security',
        'Large diff: 600 changed lines',
      ],
      visible: true,
    });
    expect(plugins[1]).toEqual({
      plugin: 'onBehalfOf',
      agent: 'claude',
      model: 'Opus 4.5',
      visible: true,
    });
  });

  test('returns an empty array for malformed JSON', () => {
    expect(parseExtensionBlocks('<!-- linear:extension {not json} -->')).toEqual([]);
  });

  test('returns an empty array for a body with no block', () => {
    expect(parseExtensionBlocks('Just a normal review comment.')).toEqual([]);
  });

  test('returns an empty array for a payload with no plugins array', () => {
    expect(parseExtensionBlocks('<!-- linear:extension {"version":1} -->')).toEqual([]);
  });

  test.each([null, undefined, 42, ''])('returns an empty array for %p', (body) => {
    expect(parseExtensionBlocks(body)).toEqual([]);
  });

  test('parses every block in a body and skips the broken one', () => {
    const good = buildExtensionBlock({ risk: { level: 1 } });
    const body = `${good}\n<!-- linear:extension {oops} -->\n${good}`;

    expect(parseExtensionBlocks(body)).toHaveLength(2);
  });
});

describe('upsertExtensionComment', () => {
  const body = buildExtensionBlock({ risk: { level: 2 } });

  it('creates a comment when no marker comment exists', async () => {
    const github = createGithubMock([{ id: 1, user: { type: 'User' }, body: 'human comment' }]);

    await expect(
      upsertExtensionComment(github, { owner: 'o', repo: 'r', issueNumber: 7, body })
    ).resolves.toBe('created');

    expect(github.paginate).toHaveBeenCalledWith(github.rest.issues.listComments, {
      owner: 'o',
      repo: 'r',
      issue_number: 7,
      per_page: 100,
    });
    expect(github.rest.issues.createComment).toHaveBeenCalledWith({
      owner: 'o',
      repo: 'r',
      issue_number: 7,
      body,
    });
    expect(github.rest.issues.updateComment).not.toHaveBeenCalled();
  });

  it('updates the existing marker comment when the body differs', async () => {
    const github = createGithubMock([
      {
        id: 5,
        user: { type: 'Bot' },
        body: `${EXTENSION_MARKER}\n<!-- linear:extension {"version":1} -->`,
      },
    ]);

    await expect(
      upsertExtensionComment(github, { owner: 'o', repo: 'r', issueNumber: 7, body })
    ).resolves.toBe('updated');

    expect(github.rest.issues.updateComment).toHaveBeenCalledWith({
      owner: 'o',
      repo: 'r',
      comment_id: 5,
      body,
    });
    expect(github.rest.issues.createComment).not.toHaveBeenCalled();
  });

  it('performs no write at all when the body is already identical', async () => {
    const github = createGithubMock([{ id: 5, user: { type: 'Bot' }, body }]);

    await expect(
      upsertExtensionComment(github, { owner: 'o', repo: 'r', issueNumber: 7, body })
    ).resolves.toBe('unchanged');

    expect(countWrites(github)).toBe(0);
  });

  it.each([null, undefined, '', '   '])(
    'skips the %p body without calling the API',
    async (input) => {
      const github = createGithubMock([]);

      await expect(
        upsertExtensionComment(github, { owner: 'o', repo: 'r', issueNumber: 7, body: input })
      ).resolves.toBe('skipped');

      expect(github.paginate).not.toHaveBeenCalled();
      expect(countWrites(github)).toBe(0);
    }
  );

  it('ignores a marker comment authored by a human', async () => {
    const github = createGithubMock([{ id: 9, user: { type: 'User' }, body }]);

    await expect(
      upsertExtensionComment(github, { owner: 'o', repo: 'r', issueNumber: 7, body })
    ).resolves.toBe('created');

    expect(github.rest.issues.updateComment).not.toHaveBeenCalled();
  });

  it('ignores a bot comment that lacks the marker', async () => {
    const github = createGithubMock([
      { id: 9, user: { type: 'Bot' }, body: 'some other bot comment' },
    ]);

    await expect(
      upsertExtensionComment(github, { owner: 'o', repo: 'r', issueNumber: 7, body })
    ).resolves.toBe('created');
  });

  it('tolerates a paginate call that returns nothing', async () => {
    const github = createGithubMock();
    github.paginate.mockResolvedValue(undefined);

    await expect(
      upsertExtensionComment(github, { owner: 'o', repo: 'r', issueNumber: 7, body })
    ).resolves.toBe('created');
  });
});

describe('emitted blocks satisfy the documented contract', () => {
  /**
   * Independent re-implementation of the documented Linear constraints. It does
   * not share code with the emitter, so a future change to the emitter that
   * breaks the contract fails here rather than silently producing a block that
   * Linear ignores.
   * @param {string} body - Comment body to validate.
   * @returns {object[]} The validated plugins.
   */
  function validateAgainstLinearDocs(body) {
    const match = /<!--\s*linear:extension\s*([\s\S]*?)\s*-->/.exec(body);
    expect(match).not.toBeNull();
    expect(body).toContain(EXTENSION_MARKER);

    const payload = JSON.parse(match[1]);
    expect(payload.version).toBe(1);
    expect(Array.isArray(payload.plugins)).toBe(true);
    expect(payload.plugins.length).toBeGreaterThan(0);

    for (const plugin of payload.plugins) {
      if (plugin.plugin === 'riskScore') {
        expect(Number.isInteger(plugin.level)).toBe(true);
        expect(plugin.level).toBeGreaterThanOrEqual(1);
        expect(plugin.level).toBeLessThanOrEqual(4);
        if (plugin.sha !== undefined) {
          expect(plugin.sha).toMatch(/^[0-9a-f]{40}$/i);
        }
        if (plugin.explanations !== undefined) {
          expect(Array.isArray(plugin.explanations)).toBe(true);
          expect(plugin.explanations.length).toBeLessThanOrEqual(8);
          for (const explanation of plugin.explanations) {
            expect(typeof explanation).toBe('string');
            expect(explanation.length).toBeGreaterThan(0);
            expect(explanation.length).toBeLessThanOrEqual(200);
          }
        }
      } else if (plugin.plugin === 'onBehalfOf') {
        expect(typeof plugin.agent).toBe('string');
        expect(plugin.agent.length).toBeGreaterThan(0);
        if (plugin.model !== undefined) {
          expect(plugin.model.length).toBeLessThanOrEqual(200);
        }
      } else {
        throw new Error(`Unexpected plugin: ${plugin.plugin}`);
      }
      if (plugin.visible !== undefined) {
        expect(typeof plugin.visible).toBe('boolean');
      }
    }

    return payload.plugins;
  }

  test('holds for a worst-case assessment with every signal firing', () => {
    const assessment = buildRiskAssessment({
      files: Object.values(SAMPLE_PATH_FOR),
      labels: RISK_LABELS,
      additions: 5000,
      deletions: 2500,
    });
    const plugins = validateAgainstLinearDocs(
      buildExtensionBlock({
        risk: assessment,
        agent: 'claude',
        model: 'm'.repeat(400),
        sha: VALID_SHA,
        visible: true,
      })
    );

    expect(plugins).toHaveLength(2);
    expect(plugins[0].level).toBe(4);
    expect(plugins[0].explanations.length).toBeLessThanOrEqual(8);
  });

  test('holds for a minimal assessment with no optional fields', () => {
    const plugins = validateAgainstLinearDocs(
      buildExtensionBlock({ risk: buildRiskAssessment({}) })
    );

    expect(plugins).toEqual([{ plugin: 'riskScore', level: 1 }]);
  });

  test('holds for every supported agent', () => {
    for (const agent of SUPPORTED_AGENTS) {
      const plugins = validateAgainstLinearDocs(
        buildExtensionBlock({ risk: { level: 1 }, agent, model: 'test-model' })
      );

      expect(plugins[1]).toEqual({
        plugin: 'onBehalfOf',
        agent,
        model: 'test-model',
      });
    }
  });
});

/**
 * Regression guard for the security-sensitive path matcher.
 *
 * The first implementation used an unanchored /auth|security|permission|capabilit/i,
 * which also matched "author" and "authors". This repository ships
 * agents/metadata-agent/lib/api/authors-api.js -- the GitHub authors API, which
 * has nothing to do with authentication -- so any PR touching it was scored as
 * security-sensitive and escalated a risk level for no reason.
 */
describe('RISK_CATEGORIES security-sensitive-path matching is token-bounded', () => {
  const category = RISK_CATEGORIES.find((entry) => entry.id === 'security-sensitive-path');
  const matches = (path) => category.pattern.test(path);

  test.each([
    'lib/auth/session.js',
    'plugins/wordpress/auth/session.php',
    'skills/security-review/SKILL.md',
    '.github/PULL_REQUEST_TEMPLATE/pr_security.md',
    '.github/SAVED_REPLIES/workflow/permissions-secrets.md',
    'scripts/capabilities/map.json',
    '.github/projects/active/release-workflow-authorization-fixes/STATUS.md',
  ])('matches the genuinely security-sensitive path %s', (path) => {
    expect(matches(path)).toBe(true);
  });

  test.each([
    // "author"/"authors" contain "auth" as a substring but mean authorship.
    'agents/metadata-agent/lib/api/authors-api.js',
    'agents/metadata-agent/__tests__/api/authors-api.test.js',
    '.github/SAVED_REPLIES/pull-requests/awaiting-author.md',
    'agents/authoring-agent/agent.md',
    'skills/author-pre-review/SKILL.md',
    'prompts/author-a-pr.md',
  ])('does not match the authorship path %s', (path) => {
    expect(matches(path)).toBe(false);
  });

  test('a false positive on authors-api.js does not escalate the risk level', () => {
    const authorship = buildRiskAssessment({
      files: ['agents/metadata-agent/lib/api/authors-api.js'],
    });
    const empty = buildRiskAssessment({ files: [] });

    expect(authorship.level).toBe(empty.level);
    expect(authorship.explanations).toEqual(empty.explanations);
  });
});

/**
 * Regression guard for an HTML comment injection in the emitted block.
 *
 * Explanations quote pull request filenames, and a contributor picks those
 * names. A file called `lib/auth-->.js` closed the `linear:extension` HTML
 * comment early: the block truncated, `parseExtensionBlocks` recovered nothing,
 * so Linear silently stopped receiving the risk score, and the remaining text
 * rendered as live markup in the GitHub comment. Found by CodeRabbit's security
 * architecture pass rather than the four actionable review comments.
 */
describe('emitted block cannot be terminated by untrusted input', () => {
  const build = (input, extra = {}) =>
    buildExtensionBlock({
      risk: buildRiskAssessment(input),
      agent: 'claude',
      sha: VALID_SHA,
      ...extra,
    });

  const wellFormed = (body) => {
    // Two terminators: our marker and the extension block. A third means
    // untrusted text escaped the comment.
    expect((body.match(/-->/g) || []).length).toBe(2);
    expect(parseExtensionBlocks(body)).toHaveLength(1);
  };

  test.each([
    ['a comment terminator in the filename', { files: ['lib/auth-->.js'] }],
    ['a comment opener in the filename', { files: ['lib/<!--auth.js'] }],
    [
      'markup and both delimiters in the filename',
      { files: ['<!-- x --> auth<img src=x onerror=alert(1)>.js'] },
    ],
    ['a terminator in an otherwise normal filename', { files: ['package.json-->.js'] }],
  ])('stays well formed with %s', (_label, input) => {
    wellFormed(build(input));
  });

  test('stays well formed when the model name carries a terminator', () => {
    wellFormed(build({ files: ['package.json'] }, { model: 'opus --> <b>x</b>' }));
  });

  test('the escaped path stays readable rather than being stripped', () => {
    const [plugins] = parseExtensionBlocks(build({ files: ['lib/auth-->.js'] }));
    const [explanation] = plugins[0].explanations;

    expect(explanation).toBe('Touches security-sensitive paths: lib/auth--&gt;.js');
  });

  test('ordinary paths are untouched', () => {
    const [plugins] = parseExtensionBlocks(
      build({ files: ['.github/workflows/linear-review-platform.yml'] })
    );

    expect(plugins[0].explanations[0]).toBe(
      'Touches GitHub Actions workflows: .github/workflows/linear-review-platform.yml'
    );
  });
});

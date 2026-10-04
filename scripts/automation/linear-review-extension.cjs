/**
 * Linear Review Platform extension emitter.
 *
 * Linear's Review Platform lets any connected tool attach metadata to a GitHub
 * pull request by posting an HTML comment containing a `linear:extension` JSON
 * block. Two plugins exist:
 *
 * - `riskScore` — a 1-4 integer risk level, an optional 40-character commit
 *   SHA, and up to 8 explanations of up to 200 characters each.
 * - `onBehalfOf` — the agent that produced the comment, an optional model name,
 *   and a `visible` flag.
 *
 * This module is the single source of truth for that contract: every AI tool in
 * this repository (Claude Code, opencode, Codex, and the workflow) emits through
 * here, so Linear attributes all of them identically.
 *
 * CommonJS so `actions/github-script` can `require()` it, matching
 * `scripts/validation/ai-feedback-helpers.cjs`.
 *
 * @see https://linear.app/docs/diffs
 * @see docs/LINEAR_INTEGRATION.md
 */

/** Marker used to find our own comment again for an idempotent upsert. */
const EXTENSION_MARKER = '<!-- lightspeed-linear-review -->';

/** Payload schema version understood by Linear. */
const EXTENSION_VERSION = 1;

/** Matches every `linear:extension` block, capturing its raw JSON payload. */
const EXTENSION_BLOCK_PATTERN = /<!--\s*linear:extension\s*([\s\S]*?)-->/g;

/** Documented Linear risk levels: 1 (low) to 4 (very high). */
const MIN_RISK_LEVEL = 1;
const MAX_RISK_LEVEL = 4;

/** Documented `explanations` limits: at most 8 entries of at most 200 characters. */
const MAX_EXPLANATIONS = 8;
const MAX_EXPLANATION_LENGTH = 200;

/** Documented `onBehalfOf.model` limit. */
const MAX_MODEL_LENGTH = 200;

/** Changed-line thresholds that escalate risk beyond file and label signals. */
const LARGE_DIFF_LINES = 500;
const VERY_LARGE_DIFF_LINES = 1500;

/**
 * Agents Linear documents for `onBehalfOf`. Unknown values are still emitted —
 * Linear renders them as a generic agent — so this list drives documentation
 * and tests, not validation.
 *
 * @type {readonly string[]}
 */
const SUPPORTED_AGENTS = Object.freeze(['claude', 'codex', 'linear', 'pi', 'opencode']);

/**
 * High-risk path categories, derived from this repository's own review
 * precedent. Each distinct category matched by at least one changed file adds
 * one risk level.
 *
 * @type {ReadonlyArray<Readonly<{ id: string, label: string, pattern: RegExp }>>}
 */
const RISK_CATEGORIES = Object.freeze([
  Object.freeze({
    id: 'github-actions',
    label: 'GitHub Actions workflows',
    // Workflows carry the repository's own CI permissions and gates.
    pattern: /(^|\/)\.github\/workflows\//,
  }),
  Object.freeze({
    id: 'governance-config',
    label: 'locked governance config',
    // AGENTS.md declares these canonical files final and manually curated.
    pattern:
      /(^|\/)(\.github\/labels\.yml|\.github\/issue-types\.yml|\.github\/labeler\.yml|CODEOWNERS)$/i,
  }),
  Object.freeze({
    id: 'repository-rulesets',
    label: 'repository rulesets',
    // Rulesets decide what may merge to develop and main.
    pattern: /(^|\/)\.github\/rulesets\//,
  }),
  Object.freeze({
    id: 'dependency-lockfile',
    label: 'dependency lockfiles',
    // Lockfile edits change the resolved dependency tree, not just the manifest.
    pattern:
      /(^|\/)(package-lock\.json|npm-shrinkwrap\.json|yarn\.lock|pnpm-lock\.yaml|bun\.lockb|composer\.lock)$/,
  }),
  Object.freeze({
    id: 'security-config',
    label: 'security policy and secret-scanning config',
    // The disclosure policy and the gitleaks allow/deny lists gate secret handling.
    pattern: /(^|\/)(SECURITY\.md|\.gitleaks\.toml|\.gitleaksignore)$/i,
  }),
  Object.freeze({
    id: 'security-sensitive-path',
    label: 'security-sensitive paths',
    // Catches auth, security, permission and capability code wherever it lives.
    // The token must be a whole path segment or a delimited word. An unanchored
    // /auth/ would also match "author" and "authors" -- the repository has
    // agents/metadata-agent/lib/api/authors-api.js, which is the GitHub authors
    // API and has nothing to do with authentication. Longer alternatives come
    // first so "permissions" is not split into "permission" plus a stray "s".
    pattern:
      /(^|[/._-])(authentication|authorization|authorisation|permissions|capability|capabilities|authn|auth|security|permission)([/._-]|$)/i,
  }),
]);

/**
 * Labels that escalate risk on their own. Compare case-insensitively, since
 * GitHub label names are not normalised.
 *
 * @type {readonly string[]}
 */
const RISK_LABELS = Object.freeze(['priority:critical', 'type:security', 'area:security']);

/**
 * Truncate a string to a maximum length without throwing.
 * @param {string} value - Text to shorten.
 * @param {number} maxLength - Maximum number of characters to keep.
 * @returns {string} The original string, or its first `maxLength` characters.
 */
function truncate(value, maxLength) {
  return value.length <= maxLength ? value : value.slice(0, maxLength);
}

/**
 * Coerce a possibly missing or malformed count to a non-negative integer.
 * @param {unknown} value - Raw input from an API payload or CLI flag.
 * @returns {number} A non-negative integer, or 0 when the input is unusable.
 */
function toCount(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 0;
  }
  return Math.floor(parsed);
}

/**
 * Normalise the `files` input to a de-duplicated list of repository paths.
 * Accepts plain strings (the CLI) and `{ filename }` objects (the GitHub API).
 * @param {unknown} files - Changed file paths in either supported shape.
 * @returns {string[]} Trimmed, de-duplicated paths in first-seen order.
 */
function normalisePaths(files) {
  if (!Array.isArray(files)) {
    return [];
  }

  const seen = new Set();
  const paths = [];

  for (const entry of files) {
    let value = null;
    if (typeof entry === 'string') {
      value = entry;
    } else if (entry && typeof entry === 'object' && typeof entry.filename === 'string') {
      value = entry.filename;
    }
    if (typeof value !== 'string') {
      continue;
    }
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) {
      continue;
    }
    seen.add(trimmed);
    paths.push(trimmed);
  }

  return paths;
}

/**
 * Normalise the `labels` input to a de-duplicated list of label names.
 * Accepts plain strings (the CLI) and `{ name }` objects (the GitHub API).
 * @param {unknown} labels - Label names in either supported shape.
 * @returns {string[]} Trimmed, de-duplicated names in first-seen order.
 */
function normaliseLabels(labels) {
  if (!Array.isArray(labels)) {
    return [];
  }

  const seen = new Set();
  const names = [];

  for (const entry of labels) {
    let value = null;
    if (typeof entry === 'string') {
      value = entry;
    } else if (entry && typeof entry === 'object' && typeof entry.name === 'string') {
      value = entry.name;
    }
    if (typeof value !== 'string') {
      continue;
    }
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) {
      continue;
    }
    seen.add(trimmed);
    names.push(trimmed);
  }

  return names;
}

/**
 * Explain why a category matched, naming a single file or counting several.
 * @param {{ id: string, label: string }} category - The matched category.
 * @param {string[]} matched - Sorted paths that matched the category.
 * @returns {string} A human-readable explanation.
 */
function describeCategory(category, matched) {
  if (matched.length === 1) {
    return `Touches ${category.label}: ${matched[0]}`;
  }
  return `Changes ${category.label} (${matched.length} files)`;
}

/**
 * Clean the `explanations` list, enforcing the documented count and length caps.
 * @param {unknown} value - Raw explanations from an assessment.
 * @returns {string[]} Up to 8 unique, non-empty explanations of at most 200 characters.
 */
function normaliseExplanations(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set();
  const explanations = [];

  for (const entry of value) {
    if (typeof entry !== 'string') {
      continue;
    }
    const trimmed = truncate(entry.trim(), MAX_EXPLANATION_LENGTH);
    if (!trimmed || seen.has(trimmed)) {
      continue;
    }
    seen.add(trimmed);
    explanations.push(trimmed);
    if (explanations.length === MAX_EXPLANATIONS) {
      break;
    }
  }

  return explanations;
}

/**
 * Assess the risk of a change set and explain the assessment.
 *
 * Pure and deterministic: no I/O, no clock, no randomness. Starts at level 1 and
 * adds one level per distinct high-risk signal (category, escalating label, or
 * size band), clamped to 1-4. Never throws on bad input.
 *
 * @param {object} [input] - Change-set facts.
 * @param {Array<string|{filename: string}>} [input.files] - Changed file paths.
 * @param {Array<string|{name: string}>} [input.labels] - Labels on the change set.
 * @param {number} [input.additions] - Added lines.
 * @param {number} [input.deletions] - Removed lines.
 * @returns {{ level: number, explanations: string[] }} The risk level and why.
 */
function buildRiskAssessment(input = {}) {
  const { files, labels, additions, deletions } = input && typeof input === 'object' ? input : {};
  const paths = normalisePaths(files);
  const labelNames = normaliseLabels(labels);
  const explanations = [];
  let level = 1;

  // Categories first, in declaration order, for a stable explanation order.
  for (const category of RISK_CATEGORIES) {
    const matched = paths.filter((path) => category.pattern.test(path)).sort();
    if (matched.length === 0) {
      continue;
    }
    level += 1;
    explanations.push(describeCategory(category, matched));
  }

  // Then labels, in declaration order.
  const lowered = labelNames.map((name) => name.toLowerCase());
  for (const riskLabel of RISK_LABELS) {
    if (lowered.includes(riskLabel.toLowerCase())) {
      level += 1;
      explanations.push(`Escalating label applied: ${riskLabel}`);
    }
  }

  // Then size. The larger band is worth two levels.
  const changedLines = toCount(additions) + toCount(deletions);
  if (changedLines >= VERY_LARGE_DIFF_LINES) {
    level += 2;
    explanations.push(`Very large diff: ${changedLines} changed lines`);
  } else if (changedLines >= LARGE_DIFF_LINES) {
    level += 1;
    explanations.push(`Large diff: ${changedLines} changed lines`);
  }

  const unique = [];
  const seen = new Set();
  for (const explanation of explanations) {
    if (seen.has(explanation)) {
      continue;
    }
    seen.add(explanation);
    unique.push(explanation);
  }

  return {
    level: Math.min(MAX_RISK_LEVEL, Math.max(MIN_RISK_LEVEL, level)),
    explanations: normaliseExplanations(unique),
  };
}

/**
 * Serialise the payload for embedding inside an HTML comment.
 *
 * The block is delimited by `<!--` and `-->`, but the HTML parser also closes a
 * comment on `--!>` ("comment end bang state"), and any untrusted value can reach
 * here: explanations quote pull request filenames, and a contributor picks those
 * names. A file called `lib/auth--!>.js` closed the comment early, so Linear
 * silently stopped receiving the risk score and the remaining text rendered as
 * live markup in the GitHub comment.
 *
 * Escaping is applied to the finished JSON rather than to individual fields, so
 * it covers every field including `agent` and `model`, including anything added
 * later. JSON has no `\uXXXX` ambiguity: `\u003e` is a valid escape that
 * `JSON.parse` turns back into `>`, so the parsed value is byte-identical to the
 * input while the literal `>` that closes a comment never appears in the body.
 * Escaping per field could not make that guarantee, since a new field would
 * silently ship unescaped.
 *
 * Only `<` and `>` are escaped. They appear in no JSON structural position, so
 * the replace cannot corrupt the document, and removing every `>` is what makes
 * both `-->` and `--!>` unrepresentable.
 *
 * @param {object} payload - The `linear:extension` payload.
 * @returns {string} Pretty-printed JSON that cannot terminate its comment.
 */
function serialisePayload(payload) {
  return JSON.stringify(payload, null, 2).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
}

/**
 * Build the full comment body carrying the `linear:extension` block.
 *
 * Hard-validates before emitting: an out-of-range `level` or a malformed `sha`
 * throws, because Linear would otherwise ignore the block with no feedback.
 * Length caps are handled by truncation instead, which loses only display text.
 *
 * @param {object} [input] - What to publish.
 * @param {{level: number, explanations?: string[]}|null} [input.risk] - Risk assessment, or null to omit `riskScore`.
 * @param {string} [input.agent] - Agent for `onBehalfOf`; unknown values are accepted.
 * @param {string} [input.model] - Model name, at most 200 characters.
 * @param {string} [input.sha] - 40-character commit SHA to score.
 * @param {boolean} [input.visible] - Surface the comment in Linear's activity feed.
 * @returns {string|null} The comment body, or null when there is nothing to publish.
 * @throws {Error} When `level` is not an integer 1-4 or `sha` is malformed.
 */
function buildExtensionBlock(input = {}) {
  const { risk, agent, model, sha, visible } = input && typeof input === 'object' ? input : {};
  const hasRisk = risk !== null && risk !== undefined;
  const hasAgent = typeof agent === 'string' && agent.trim() !== '';
  const suppliedSha = typeof sha === 'string' && sha.trim() !== '';

  if (!hasRisk && !hasAgent) {
    return null;
  }

  if (suppliedSha && !/^[0-9a-f]{40}$/i.test(sha.trim())) {
    throw new Error(
      `Invalid sha ${JSON.stringify(sha)}: must be a 40-character hexadecimal commit SHA.`
    );
  }

  const showVisible = typeof visible === 'boolean' ? { visible } : {};
  const plugins = [];

  if (hasRisk) {
    if (
      !Number.isInteger(risk.level) ||
      risk.level < MIN_RISK_LEVEL ||
      risk.level > MAX_RISK_LEVEL
    ) {
      throw new Error(
        `Invalid riskScore level ${JSON.stringify(risk.level)}: must be an integer from ${MIN_RISK_LEVEL} (low risk) to ${MAX_RISK_LEVEL} (very high risk).`
      );
    }

    const plugin = { plugin: 'riskScore' };
    if (suppliedSha) {
      plugin.sha = sha.trim();
    }
    plugin.level = risk.level;
    const explanations = normaliseExplanations(risk.explanations);
    if (explanations.length > 0) {
      plugin.explanations = explanations;
    }
    Object.assign(plugin, showVisible);
    plugins.push(plugin);
  }

  if (hasAgent) {
    const plugin = { plugin: 'onBehalfOf', agent: agent.trim() };
    if (typeof model === 'string' && model.trim() !== '') {
      plugin.model = truncate(model.trim(), MAX_MODEL_LENGTH);
    }
    Object.assign(plugin, showVisible);
    plugins.push(plugin);
  }

  const payload = { version: EXTENSION_VERSION, plugins };
  return (
    `${EXTENSION_MARKER}\n<!-- linear:extension ${serialisePayload(payload)} -->` +
    `\n\n${renderVisibleSummary(plugins)}`
  );
}

/**
 * Render untrusted text as an inline code span.
 *
 * Explanations quote pull request filenames, which a contributor chooses, and this
 * text is now shown on GitHub. A code span keeps it literal: no mentions, links,
 * images, HTML or Markdown. The fence is one backtick longer than the longest run
 * inside, so a name containing backticks cannot close the span early.
 *
 * Angle brackets are replaced with the look-alike single angle quotation marks.
 * Markdown rendering is not the only reader: Linear scans the comment's source for
 * `<!-- linear:extension ... -->`, so a file named like a forged block would
 * otherwise be parsed as a second one, and a literal `-->` would break the
 * invariant that the body holds exactly the closers this module wrote. With no
 * `<` or `>` in the visible text, neither can occur.
 * @param {string} text - Text to show verbatim.
 * @returns {string} The code span.
 */
function codeSpan(text) {
  const flat = String(text).replace(/</g, '‹').replace(/>/g, '›').replace(/\s+/g, ' ').trim();
  const longestRun = Math.max(0, ...(flat.match(/`+/g) || []).map((run) => run.length));
  const fence = '`'.repeat(longestRun + 1);
  const pad = flat.startsWith('`') || flat.endsWith('`') ? ' ' : '';
  return `${fence}${pad}${flat}${pad}${fence}`;
}

/**
 * The human-readable part of the comment.
 *
 * The `linear:extension` blocks are HTML comments, so on their own GitHub renders
 * the comment as "No description provided." This gives people reading the pull
 * request the same facts Linear receives: the risk level, why, and who published
 * it. It is derived only from the validated payload, so it is deterministic and
 * the upsert's byte-identical check still avoids needless edits.
 * @param {Array<object>} plugins - The plugins just serialised into the block.
 * @returns {string} Markdown to append below the hidden blocks.
 */
function renderVisibleSummary(plugins) {
  const lines = [];
  for (const plugin of plugins) {
    if (plugin.plugin === 'riskScore') {
      lines.push(`**Linear review**: risk level ${plugin.level} of ${MAX_RISK_LEVEL}`);
      for (const explanation of plugin.explanations || []) {
        lines.push(`- ${codeSpan(explanation)}`);
      }
    } else if (plugin.plugin === 'onBehalfOf') {
      const model = plugin.model ? ` (${codeSpan(plugin.model)})` : '';
      lines.push(`Published on behalf of ${codeSpan(plugin.agent)}${model}`);
    }
  }
  return lines.join('\n');
}

/**
 * Extract and parse every `linear:extension` block in a comment body.
 * Malformed JSON is skipped rather than thrown on, so a broken block in someone
 * else's comment cannot break the caller.
 * @param {string} body - Comment body to scan.
 * @returns {Array<Array<object>>} One plugins array per successfully parsed block.
 */
function parseExtensionBlocks(body) {
  if (typeof body !== 'string' || body === '') {
    return [];
  }

  const blocks = [];
  const pattern = new RegExp(EXTENSION_BLOCK_PATTERN.source, 'g');
  let match;

  while ((match = pattern.exec(body)) !== null) {
    try {
      const payload = JSON.parse(match[1].trim());
      if (payload && typeof payload === 'object' && Array.isArray(payload.plugins)) {
        blocks.push(payload.plugins);
      }
    } catch {
      // Malformed JSON is ignored: callers get the blocks that did parse.
      continue;
    }
  }

  return blocks;
}

/**
 * Create or update our marker comment on a pull request.
 *
 * Finds the previous comment by bot author plus marker, then updates it. When
 * the body is byte-identical to the existing one it performs no write at all:
 * editing a comment triggers a Linear re-sync for no benefit.
 *
 * Known residual risks, both raised by CodeRabbit's security pass and accepted
 * here on purpose. Ownership is "any bot comment containing the marker", so a
 * second bot that quoted the marker could be overwritten; tightening this to a
 * per-publisher identity would only matter once a second publisher exists, and
 * the only publisher today is this workflow. Writes are not conditional on the
 * current head, so two runs that overlap could land out of order and leave a
 * stale score; the caller cancels superseded runs through a per-PR concurrency
 * group, which orders everything except a request already in flight. Neither is
 * worth the machinery before a second publisher or a demonstrated race.
 *
 * @param {object} github - The `actions/github-script` Octokit client.
 * @param {object} options - Target and payload.
 * @param {string} options.owner - Repository owner.
 * @param {string} options.repo - Repository name.
 * @param {number} options.issueNumber - Pull request number.
 * @param {string} options.body - Comment body to publish.
 * @returns {Promise<'created'|'updated'|'unchanged'|'skipped'>} What was done.
 */
async function upsertExtensionComment(github, { owner, repo, issueNumber, body } = {}) {
  if (typeof body !== 'string' || body.trim() === '') {
    return 'skipped';
  }

  const comments = await github.paginate(github.rest.issues.listComments, {
    owner,
    repo,
    issue_number: issueNumber,
    per_page: 100,
  });
  const existing = Array.isArray(comments) ? comments : [];
  const previous = existing.find(
    (comment) => comment.user?.type === 'Bot' && comment.body?.includes(EXTENSION_MARKER)
  );

  if (previous) {
    if (previous.body === body) {
      return 'unchanged';
    }
    await github.rest.issues.updateComment({
      owner,
      repo,
      comment_id: previous.id,
      body,
    });
    return 'updated';
  }

  await github.rest.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body,
  });
  return 'created';
}

/**
 * Split a comma-separated CLI flag into trimmed, non-empty values.
 * @param {string|undefined} value - Raw flag value.
 * @returns {string[]} The parsed values.
 */
function splitList(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return [];
  }
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry !== '');
}

/**
 * Parse CLI arguments into an options object.
 * @param {string[]} argv - Arguments after the script path.
 * @returns {object} Parsed flags, with `visible` and `json` as booleans.
 */
function parseArgs(argv) {
  const options = { files: [], labels: [], visible: undefined, json: false };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => {
      index += 1;
      return argv[index];
    };

    switch (arg) {
      case '--files':
        options.files = splitList(next());
        break;
      case '--labels':
        options.labels = splitList(next());
        break;
      case '--additions':
        options.additions = next();
        break;
      case '--deletions':
        options.deletions = next();
        break;
      case '--agent':
        options.agent = next();
        break;
      case '--model':
        options.model = next();
        break;
      case '--sha':
        options.sha = next();
        break;
      case '--visible': {
        const value = argv[index + 1];
        if (value === 'true' || value === 'false') {
          index += 1;
          options.visible = value === 'true';
        } else {
          options.visible = true;
        }
        break;
      }
      case '--json':
        options.json = true;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

/**
 * CLI entry point: assess a change set and print the comment body, or the
 * assessment and block as JSON with `--json`. Makes no network calls.
 * @param {string[]} argv - Arguments after the script path.
 * @returns {number} Process exit code.
 * @throws {Error} When the block cannot be built from the supplied flags.
 */
function runCli(argv) {
  const options = parseArgs(argv);
  const assessment = buildRiskAssessment({
    files: options.files,
    labels: options.labels,
    additions: options.additions,
    deletions: options.deletions,
  });
  const block = buildExtensionBlock({
    risk: assessment,
    agent: options.agent,
    model: options.model,
    sha: options.sha,
    visible: options.visible,
  });

  if (block === null) {
    throw new Error('Nothing to publish: supply --files with a risk assessment, or --agent.');
  }

  if (options.json) {
    process.stdout.write(`${JSON.stringify({ assessment, block }, null, 2)}\n`);
  } else {
    process.stdout.write(`${block}\n`);
  }

  return 0;
}

if (require.main === module) {
  try {
    process.exitCode = runCli(process.argv.slice(2));
  } catch (error) {
    console.error(`linear-review-extension: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = {
  EXTENSION_MARKER,
  SUPPORTED_AGENTS,
  RISK_CATEGORIES,
  RISK_LABELS,
  buildRiskAssessment,
  buildExtensionBlock,
  parseExtensionBlocks,
  upsertExtensionComment,
};

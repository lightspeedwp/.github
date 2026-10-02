'use strict';

/**
 * Field rules per file class, and the parsers the validator uses.
 *
 * Every rule below cites the specification it comes from. There is no blanket
 * permission: each class has its own documented set, and a key outside the set
 * for that class is reported.
 *
 * Sources, all read 2026-10-01:
 * - Agent Skills:            https://agentskills.io/specification
 * - skills-ref validator:    https://github.com/agentskills/agentskills/blob/main/skills-ref/src/skills_ref/validator.py
 * - Claude Code skills:      https://code.claude.com/docs/en/skills
 * - Claude Code subagents:   https://code.claude.com/docs/en/sub-agents
 * - AGENTS.md convention:    https://agents.md
 * - This repository's agent frontmatter schema:
 *   schemas/agent-config.schema.json (definitions.requiredFrontmatterFields and
 *   definitions.optionalFrontmatterFields)
 */

const path = require('path');

/** Specification URL, quoted in error output. */
const SPEC_URL = 'https://agentskills.io/specification';

/** Claude Code skills documentation URL. */
const CLAUDE_SKILLS_URL = 'https://code.claude.com/docs/en/skills';

/** Claude Code subagent documentation URL. */
const SUBAGENT_URL = 'https://code.claude.com/docs/en/sub-agents';

/** AGENTS.md convention URL. */
const AGENTS_MD_URL = 'https://agents.md';

/** The six top-level fields the Agent Skills specification permits. */
const SPEC_FIELDS = Object.freeze([
  'name',
  'description',
  'license',
  'compatibility',
  'metadata',
  'allowed-tools',
]);

/** Fields the specification requires on a skill. */
const REQUIRED_SKILL_FIELDS = Object.freeze(['name', 'description']);

/**
 * Fields Claude Code accepts on a skill in addition to the specification's six.
 *
 * From the frontmatter reference at https://code.claude.com/docs/en/skills. The
 * same page's "Using skill frontmatter outside Claude Code" section states that a
 * Claude Code skill may use every field in its table, while a claude.ai upload,
 * the Skills API or `package_skill.py` may use only the six specification
 * fields and fails otherwise with
 * `Unexpected key(s) in SKILL.md frontmatter: <key>`.
 *
 * Permitted only on skills that are actually loaded by Claude Code. A skill
 * intended for upload outside Claude Code must drop them, which is why the
 * `claude-code-skill` class is assigned per directory rather than applied to
 * every skill.
 */
const CLAUDE_CODE_SKILL_FIELDS = Object.freeze([
  'agent',
  'argument-hint',
  'arguments',
  'background',
  'context',
  'disable-model-invocation',
  'disallowed-tools',
  'effort',
  'hooks',
  'model',
  'paths',
  'shell',
  'user-invocable',
  'when_to_use',
]);

/** Every field a Claude Code skill may carry. */
const CLAUDE_CODE_SKILL_SET = Object.freeze([...SPEC_FIELDS, ...CLAUDE_CODE_SKILL_FIELDS]);

/**
 * Fields a subagent definition may carry.
 *
 * The subagent table at https://code.claude.com/docs/en/sub-agents lists
 * `name`, `description`, `tools`, `disallowedTools`, `model`, `permissionMode`,
 * `maxTurns`, `skills`, `mcpServers`, `hooks`, `memory`, `effort`, `background`,
 * `omitClaudeMd`, `isolation`, `color`, `initialPrompt` and `experimental`, of
 * which only `name` and `description` are required. Unlike a skill, the
 * filename need not match `name`, so no directory rule applies.
 *
 * The remainder come from this repository's own schema,
 * `schemas/agent-config.schema.json`: `file_type`, `title` and `last_updated`
 * are required by `definitions.requiredFrontmatterFields`, and `description`,
 * `version`, `created_date`, `owners`, `tags`, `category`, `domain`,
 * `stability`, `maintainer` and `license` are the optional set in
 * `definitions.optionalFrontmatterFields`. That schema is the documented local
 * design, so it is honoured rather than replaced by upstream.
 */
const SUBAGENT_FIELDS = Object.freeze([
  'name',
  'description',
  'tools',
  'disallowedTools',
  'model',
  'permissionMode',
  'maxTurns',
  'skills',
  'mcpServers',
  'hooks',
  'memory',
  'effort',
  'background',
  'omitClaudeMd',
  'isolation',
  'color',
  'initialPrompt',
  'experimental',
  'file_type',
  'title',
  'last_updated',
  'version',
  'created_date',
  'owners',
  'tags',
  'category',
  'domain',
  'stability',
  'maintainer',
  'license',
  'metadata',
]);

/**
 * Fields an `AGENTS.md` file may carry.
 *
 * https://agents.md defines no frontmatter at all: for that convention the file's
 * headings are the contract. This repository's own AGENTS.md files nevertheless
 * carry the same document frontmatter as the rest of its documentation
 * (`title`, `version`, `last_updated`, `file_type`, `maintainer`, `authors`,
 * `tags`, `domain`, `stability`), which is a documented local design rather than
 * an upstream rule. That local set is what is enforced here; the divergence from
 * agents.md is recorded for a decision rather than asserted as conformant.
 */
const AGENTS_MD_FIELDS = Object.freeze([
  'name',
  'description',
  'tools',
  'model',
  'license',
  'metadata',
  'title',
  'version',
  'last_updated',
  'created_date',
  'file_type',
  'maintainer',
  'authors',
  'tags',
  'domain',
  'stability',
]);

/**
 * Frontmatter each class must carry.
 *
 * A subagent definition is held to `description` (required upstream) plus this
 * repository's own document frontmatter, from
 * `requiredFrontmatterFields` in `schemas/agent-config.schema.json`. Checking
 * skills only let a subagent carrying nothing but `name` pass.
 */
const REQUIRED_SUBAGENT_FIELDS = Object.freeze([
  'description',
  'file_type',
  'title',
  'last_updated',
]);

/**
 * Required fields for a class.
 *
 * @param {string} fileClass One of the `CLASS_FIELD_SETS` keys.
 * @returns {readonly string[]} Fields that must be present.
 */
function requiredFieldsFor(fileClass) {
  if (fileClass === 'subagent-definition') {
    return REQUIRED_SUBAGENT_FIELDS;
  }
  if (fileClass === 'agents-md') {
    // agents.md defines no frontmatter; only the document fields this repository
    // applies to its own AGENTS.md files are required.
    return REQUIRED_SUBAGENT_FIELDS.filter((field) => field !== 'description');
  }
  return REQUIRED_SKILL_FIELDS;
}

/**
 * Value shapes for optional fields that a specification documents.
 *
 * `docs/SKILLS_STANDARDS.md` requires strings for these. Allowing them without
 * checking the shape accepted `allowed-tools: [Read]` and a list-valued
 * `license`, which the documented format does not allow.
 *
 * The tool field is checked per class: open-spec skills document a comma-separated
 * string, Claude Code skills a list, so one rule cannot cover both.
 *
 * @param {Record<string, unknown>} frontmatter Parsed frontmatter.
 * @param {string} fileClass One of the `CLASS_FIELD_SETS` keys.
 * @returns {string[]} Diagnostics.
 */
function validateOptionalFieldShapes(frontmatter, fileClass) {
  const findings = [];
  const stringFields = ['license', 'version', 'domain', 'stability', 'file_type'];

  for (const field of stringFields) {
    const value = frontmatter[field];
    if (value === undefined) {
      continue;
    }
    if (typeof value !== 'string') {
      findings.push(
        `\`${field}\` must be a string but is ${Array.isArray(value) ? 'a list' : typeof value}. ` +
          'Fix: give it a string value.'
      );
    }
  }

  const tools = frontmatter['allowed-tools'];
  if (tools !== undefined) {
    if (fileClass === 'open-spec-skill') {
      // docs/SKILLS_STANDARDS.md records this field as "Space-separated
      // pre-approved tools", so for an open-spec skill it is a string.
      if (typeof tools !== 'string') {
        findings.push(
          '`allowed-tools` must be a space-separated string for an open-spec skill but is ' +
            `${Array.isArray(tools) ? 'a list' : typeof tools}. Fix: give it "Read Write Grep".`
        );
      }
    } else if (!Array.isArray(tools) && typeof tools !== 'string') {
      // Claude Code documents a YAML list, but the open-spec spelling is a string,
      // so either is accepted here rather than failing a file for the representation.
      findings.push(
        `\`allowed-tools\` must be a list or a space-separated string for a ${fileClass} but is ` +
          `${typeof tools}. Fix: give it a YAML list of tool names.`
      );
    }
  }

  return findings;
}

/** Field set per class. */
const CLASS_FIELD_SETS = Object.freeze({
  'open-spec-skill': SPEC_FIELDS,
  'claude-code-skill': CLAUDE_CODE_SKILL_SET,
  'subagent-definition': SUBAGENT_FIELDS,
  'agents-md': AGENTS_MD_FIELDS,
});

/** Documentation URL per class, quoted in error output. */
const CLASS_URLS = Object.freeze({
  'open-spec-skill': SPEC_URL,
  'claude-code-skill': CLAUDE_SKILLS_URL,
  'subagent-definition': SUBAGENT_URL,
  'agents-md': AGENTS_MD_URL,
});

/**
 * Directory prefixes whose skills are loaded by Claude Code and may therefore
 * carry the documented Claude Code platform fields.
 *
 * `.claude/skills/` is Claude Code's own skill location. The other entries are
 * skills that use `argument-hint`, `user-invocable` or `disable-model-invocation`
 * today and are installed into Claude Code; a skill with none of those fields
 * conforms to the open specification alone and needs no exemption.
 */
const CLAUDE_CODE_SKILL_ROOTS = Object.freeze([
  '.claude/skills',
  'skills/acquire-codebase-knowledge',
  'skills/design-md-agent',
  'skills/figma-code-connect',
  'skills/generate-image',
  'skills/generate-project-plan',
  'skills/sync-figma-token',
  'skills/webmcpify',
  'plugins/figma',
]);

/**
 * Plugin trees vendored from a third party, where the directory name encodes
 * the upstream source rather than the skill name.
 *
 * `plugins/<owner>__<skill>` is the vendoring convention, so `name` is the bare
 * skill name and cannot equal the directory. These are reported as findings for
 * a decision rather than silently accepted; see the report.
 */
const VENDORED_PLUGIN_ROOTS = Object.freeze([
  'plugins/figma',
  'plugins/github__gh-address-comments',
  'plugins/github__gh-fix-ci',
  'plugins/github__github',
  'plugins/github__yeet',
  'plugins/gmail',
  'plugins/google-calendar',
  'plugins/google-drive',
  'plugins/google-drive__google-docs',
  'plugins/google-drive__google-drive',
  'plugins/google-drive__google-drive-comments',
  'plugins/google-drive__google-sheets',
  'plugins/google-drive__google-slides',
  'plugins/linear',
  'plugins/linear__linear',
  'plugins/slack',
  'plugins/slack__slack',
  'plugins/slack__slack-channel-summarization',
  'plugins/slack__slack-daily-digest',
  'plugins/slack__slack-notification-triage',
  'plugins/slack__slack-outgoing-message',
  'plugins/slack__slack-reply-drafting',
]);

/**
 * Scaffolds under `skills/` that are templates to be copied, not skills.
 *
 * `_template-skill` has a leading underscore, which the specification's name
 * rule rejects, and an empty body by design.
 */
const SCAFFOLD_DIRECTORIES = Object.freeze(['_template-skill']);

/**
 * Directories under `skills/` that hold no skill at either level the walk
 * inspects: no SKILL.md of their own and none in an immediate child.
 *
 * Content packs - questionnaires, agent instruction sets, theme sources and
 * loose skill files. Listed rather than skipped implicitly so a pack that later
 * grows a SKILL.md is validated like any other skill. Relocation out of
 * `skills/` is tracked in issue #573.
 */
const NON_SKILL_DIRECTORIES = Object.freeze([
  'accessibility-auditor',
  'agent-creator-agent-builder-pack',
  'ai-governance-toolkit-expanded',
  'ai-readiness-agent-knowledge-upload',
  'ai-readiness-template-pack-md',
  'ai-service-templates',
  'claude-skills',
  'lsx-wp-design-system-v2',
  'prd-task-manager-agent-pack',
  'tour-operator-agent-instructions',
  'zendesk-backlog-capability-profile-pack',
]);

/**
 * Classify one file by its path relative to the repository root.
 *
 * @param {string} relativePath POSIX path from the repository root.
 * @returns {{class: string, directoryName: string|null, specUrl: string}}
 */
function classify(relativePath) {
  const posix = relativePath.split(path.sep).join('/');
  const parts = posix.split('/');
  const directoryName = parts.length > 1 ? parts[parts.length - 2] : null;
  const directory = parts.slice(0, -1).join('/');

  if (parts[parts.length - 1] === 'AGENTS.md') {
    return { class: 'agents-md', directoryName: null, specUrl: AGENTS_MD_URL };
  }

  if (parts[parts.length - 1].endsWith('.agent.md')) {
    return {
      class: 'subagent-definition',
      directoryName: null,
      specUrl: SUBAGENT_URL,
    };
  }

  const claudeCode = CLAUDE_CODE_SKILL_ROOTS.some(
    (root) => directory === root || directory.startsWith(`${root}/`)
  );

  return {
    class: claudeCode ? 'claude-code-skill' : 'open-spec-skill',
    directoryName,
    specUrl: claudeCode ? CLAUDE_SKILLS_URL : SPEC_URL,
  };
}

/** Is this path inside a vendored third-party plugin tree? */
function isVendoredPlugin(relativePath) {
  const posix = relativePath.split(path.sep).join('/');
  return VENDORED_PLUGIN_ROOTS.some((root) => posix === root || posix.startsWith(`${root}/`));
}

/** `name` maximum length. */
const MAX_NAME_LENGTH = 64;

/** `description` maximum length. */
const MAX_DESCRIPTION_LENGTH = 1024;

/** `compatibility` maximum length. */
const MAX_COMPATIBILITY_LENGTH = 500;

/**
 * Split a document into YAML frontmatter and Markdown body.
 *
 * @param {string} content Raw file content.
 * @returns {{frontmatter: string, body: string}|null} Null when there is none.
 */
function splitFrontmatter(content) {
  const normalised = content.charCodeAt(0) === 0xfeff ? content.slice(1) : content;
  const match = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(normalised);
  if (!match) {
    return null;
  }
  return { frontmatter: match[1], body: normalised.slice(match[0].length) };
}

/**
 * Every footer phrase opening the repository can actually emit.
 *
 * Two sources define what a footer looks like, and both are honoured here:
 *
 * - `FOOTER_PATTERNS` in `scripts/agents/includes/footer-policy.js`, the shared
 *   policy that owns footer recognition for the generator and the duplicate
 *   guard.
 * - `.github/footers.yml`, whose `categories` and `default` phrases the
 *   generator resolves through `resolveFooterPhrases()`.
 *
 * An earlier version listed only the five `DEFAULT_FOOTERS` fallbacks, so a file
 * holding only a heading and any *configured* footer — `Questions?`,
 * `Prefer a guided`, `Copy, adapt`, `Keep tone`, `Need help?` and the rest — was
 * not recognised as empty and passed the #3707 gate. That is the whole class of
 * defect the finding describes, not one variant of it.
 *
 * Both owners are ESM and this module is CommonJS, so the list cannot be
 * imported. `__tests__/validate-skills.test.js` reads the real `FOOTER_PATTERNS`
 * and the real `footers.yml` and asserts this list covers both, which is what
 * keeps them from drifting.
 */
const FOOTER_STEMS = Object.freeze([
  'Maintained with',
  'Built by',
  'Have questions?',
  'This page brought to you by',
  'Docs signed by',
  'Made with',
  'Questions?',
  'Prefer a guided',
  'Clarity first',
  'Improvements welcome',
  'Copy, adapt',
  'Tweak the variables',
  'Your feedback shapes',
  'Reuse beats',
  'Keep prompts',
  'Use responsibly',
  'Keep tone',
  'Update when',
  'Link policies',
  'Thanks for helping',
  'Need help?',
]);
const FOOTER_LINE_RE = new RegExp(
  `^[*_>#\\s]*(${FOOTER_STEMS.map((stem) => stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`
);
const FOOTER_LINK_LINE_RE = /^\[(?:Contributors|Org Profile|Automation Docs)\]\(/;

/**
 * Is this line part of a generated footer?
 *
 * Exported so the anti-drift test can hold this module to the shared policy
 * without re-deriving the regular expression.
 *
 * @param {string} line A single line, without its trailing newline.
 * @returns {boolean} True when the line is a footer phrase or footer link line.
 */
function isFooterLine(line) {
  const trimmed = typeof line === 'string' ? line.trim() : '';
  return FOOTER_LINE_RE.test(trimmed) || FOOTER_LINK_LINE_RE.test(trimmed);
}

/**
 * Strip a trailing generated footer so only real instructions count as a body.
 *
 * @param {string} body Markdown after the frontmatter.
 * @returns {string} Body with the footer removed.
 */
function stripFooter(body) {
  const lines = body.split(/\r?\n/);

  // A canonical footer is a *block*, not a line: most variants are a prose line
  // with a link line beneath it. Scanning backwards and returning at the first
  // match removed only the link and left the prose as apparent instructions, so
  // the scan records the earliest line of the trailing block and cuts there.
  //
  // Scanning from the end also means a footer phrase quoted partway through the
  // instructions is never mistaken for the footer, because a real footer sits at
  // the end of the file.
  let cut = -1;
  let i = lines.length - 1;
  // Trailing blank lines are not content and are not a footer either.
  while (i >= 0 && lines[i].trim() === '') {
    i -= 1;
  }
  while (i >= 0) {
    const line = lines[i].trim();
    if (FOOTER_LINE_RE.test(line) || FOOTER_LINK_LINE_RE.test(line)) {
      cut = i;
      i -= 1;
      continue;
    }
    // A blank line inside or above the block belongs to it.
    if (line === '') {
      i -= 1;
      continue;
    }
    break;
  }

  if (cut === -1) {
    return body;
  }
  // Trim the blank lines left above the block so they cannot read as content.
  let head = lines.slice(0, cut);
  while (head.length && head[head.length - 1].trim() === '') {
    head.pop();
  }
  return head.join('\n');
}

/**
 * Is the Markdown body substantive?
 *
 * A heading is a title, not an instruction, which is the defect issue #3707
 * records: a file holding only a heading and the generated footer carries
 * nothing for an agent to act on.
 *
 * @param {string} body Markdown after the frontmatter.
 * @returns {boolean} True when an instruction line remains.
 */
function hasBody(body) {
  return stripFooter(body)
    .split(/\r?\n/)
    .some((line) => {
      const content = line
        .replace(/^\s*[-*+]\s+/, '')
        .replace(/^\s*\d+\.\s+/, '')
        .replace(/^\s*>\s?/, '')
        .trim();
      if (content === '') {
        return false;
      }
      if (/^#{1,6}\s/.test(content) || /^[-*_]{3,}$/.test(content)) {
        return false;
      }
      if (/^\[[^\]]+\]:\s*\S+$/.test(content)) {
        return false;
      }
      return true;
    });
}

/**
 * Assert that top-level fields fall inside the set for this class.
 *
 * @param {object} frontmatter Parsed frontmatter mapping.
 * @param {string} fileClass One of CLASS_FIELD_SETS.
 * @returns {string[]} Human-readable failures.
 */
function validateFieldSet(frontmatter, fileClass) {
  const allowed = CLASS_FIELD_SETS[fileClass] || SPEC_FIELDS;
  const unknown = Object.keys(frontmatter).filter((key) => !allowed.includes(key));
  if (unknown.length === 0) {
    return [];
  }

  // Only steer an author towards `metadata` when this class actually allows it.
  // Telling a subagent author to move a field into `metadata` when the field set
  // excludes `metadata` sent them in a circle.
  // One finding per unknown field, not one finding that lists them all. A combined
  // message made fixing one field change the other fields' baseline key, so a
  // partial fix could not be recorded independently.
  const metadataAllowed = allowed.includes('metadata');
  return unknown.map((key) => {
    let fix;
    // `references` is prohibited outright by the repository Markdown standard, so
    // moving it into `metadata` is not the fix even for a class that allows
    // `metadata`. Checked before the metadata branch for that reason.
    if (key === 'references' && fileClass === 'agents-md') {
      fix =
        `\`references\` -> remove it. It is prohibited by ` +
        '.github/instructions/markdown.instructions.md; use inline links or a ' +
        '`## Cross-References` section instead.';
    } else if (!metadataAllowed) {
      fix = `\`${key}\` -> remove it, or move it into \`metadata.${key}\` if this class allows metadata.`;
    } else if (key === 'version') {
      fix = '`version` -> move it to `metadata.version` as a quoted string';
    } else {
      fix = `\`${key}\` -> move it to \`metadata.${key}\` as a string`;
    }
    return (
      `\`${key}\` is not a field that ${fileClass} permits. ` +
      `Permitted: ${allowed.join(', ')}. Fix: ${fix}. ` +
      `See ${CLASS_URLS[fileClass]}.`
    );
  });
}

/**
 * Assert that `name` follows the specification and matches its directory.
 *
 * Rules from https://agentskills.io/specification: 1-64 characters; `a-z`, `0-9`
 * and hyphens only; no leading or trailing hyphen; no consecutive hyphens; and
 * it must match the parent directory name.
 *
 * @param {string} name Parsed `name` value.
 * @param {string} directoryName Parent directory name, or null to skip the match.
 * @returns {string[]} Human-readable failures.
 */
function validateName(name, directoryName) {
  const errors = [];

  if (typeof name !== 'string' || name.trim() === '') {
    errors.push(
      `name is missing or empty. Fix: set \`name: ${directoryName ?? 'the-skill-name'}\` in the frontmatter.`
    );
    return errors;
  }

  if (name.length > MAX_NAME_LENGTH) {
    errors.push(
      `name is ${name.length} characters; the maximum is ${MAX_NAME_LENGTH}. Fix: shorten it.`
    );
  }
  if (name !== name.toLowerCase()) {
    errors.push(`name "${name}" is not lowercase. Fix: use "${name.toLowerCase()}".`);
  }
  if (name.startsWith('-') || name.endsWith('-')) {
    errors.push(`name "${name}" starts or ends with a hyphen. Fix: remove the hyphen.`);
  }
  if (name.includes('--')) {
    errors.push(
      `name "${name}" contains consecutive hyphens. Fix: use a single hyphen (${name.replace(
        /--+/g,
        '-'
      )}).`
    );
  }

  const invalid = [...name].filter((character) => !/[a-z0-9-]/.test(character));
  if (invalid.length > 0) {
    errors.push(
      `name "${name}" contains characters outside a-z, 0-9 and hyphen: ` +
        `${[...new Set(invalid)].join(' ')}. Fix: rename to "${directoryName ?? name}".`
    );
  }

  if (directoryName !== null && name !== directoryName) {
    errors.push(
      `name "${name}" does not match its directory "${directoryName}". ` +
        `Fix: set \`name: ${directoryName}\` (the specification requires name to match the parent directory).`
    );
  }

  return errors;
}

/**
 * Assert that `description` is present and within bounds.
 *
 * @param {string} description Parsed `description` value.
 * @returns {string[]} Human-readable failures.
 */
function validateDescription(description, options = {}) {
  if (typeof description !== 'string' || description.trim() === '') {
    return [
      'description is missing or empty. Fix: add a one-line description of what the skill does and when to use it.',
    ];
  }
  // MAX_DESCRIPTION_LENGTH comes from the Agent Skills specification, which governs
  // skills only. Subagent and AGENTS.md descriptions have no such cap, so enforcing
  // it on them rejected documents their own contracts permit.
  if (options.enforceLength !== false && description.length > MAX_DESCRIPTION_LENGTH) {
    return [
      `description is ${description.length} characters; the maximum is ${MAX_DESCRIPTION_LENGTH}. ` +
        'Fix: shorten it and move detail into the body or a references/ file.',
    ];
  }
  return [];
}

/**
 * Assert that `compatibility` is a string within bounds.
 *
 * @param {string} compatibility Parsed `compatibility` value.
 * @returns {string[]} Human-readable failures.
 */
function validateCompatibility(compatibility) {
  if (typeof compatibility !== 'string') {
    return ['compatibility must be a string. Fix: quote the value or remove the field.'];
  }
  if (compatibility.length > MAX_COMPATIBILITY_LENGTH) {
    return [
      `compatibility is ${compatibility.length} characters; the maximum is ${MAX_COMPATIBILITY_LENGTH}. Fix: shorten it.`,
    ];
  }
  return [];
}

/**
 * Assert that `metadata` is a flat map of string keys to string values.
 *
 * The specification defines `metadata` as a map from string keys to string
 * values, so a nested mapping or a bare YAML scalar is invalid even though a
 * permissive parser accepts it.
 *
 * @param {object} frontmatter Parsed frontmatter mapping.
 * @returns {string[]} Human-readable failures.
 */
function validateMetadataValues(frontmatter) {
  const metadata = frontmatter.metadata;
  if (metadata === undefined) {
    return [];
  }
  if (metadata === null || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return [
      'metadata must be a mapping of string keys to string values. Fix: use indented `key: "value"` lines under `metadata:`.',
    ];
  }

  const errors = [];
  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value !== 'string') {
      errors.push(
        `metadata.${key} is ${Array.isArray(value) ? 'a list' : typeof value}; metadata values must be strings. ` +
          `Fix: write \`${key}: "${String(value).replace(/"/g, '\\"')}"\`.`
      );
    }
  }
  return errors;
}

/**
 * Assert the freshness metadata a skill must carry.
 *
 * Absence is the failure: a skill with no `metadata.last_reviewed` has never been
 * reviewed, which is a different fact from one reviewed long ago. An old date is
 * reported by the staleness report, never counted as a pass here, so this check
 * only distinguishes recorded from unrecorded.
 *
 * @param {object} frontmatter Parsed frontmatter mapping.
 * @param {boolean} enforce False to report the finding without failing.
 * @returns {string[]} Human-readable failures.
 */
function validateFreshness(frontmatter, enforce) {
  const metadata = frontmatter.metadata || {};
  const errors = [];

  if (metadata.last_reviewed === undefined) {
    errors.push(
      'metadata.last_reviewed is absent. Fix: add `last_reviewed: "YYYY-MM-DD"` under `metadata:` with the ' +
        'date the skill content was last checked against its sources. Absence is the failure: a missing date ' +
        'means the skill has never been reviewed, which is not the same as a stale one.'
    );
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(String(metadata.last_reviewed))) {
    errors.push(
      `metadata.last_reviewed is "${metadata.last_reviewed}"; it must be an ISO date, YYYY-MM-DD, quoted.`
    );
  }

  return enforce ? errors : [];
}

/**
 * Validate a subagent definition's `name`.
 *
 * The subagent table at https://code.claude.com/docs/en/sub-agents says only
 * that `name` is a unique identifier such as `code-reviewer`, that the filename
 * need not match it, and that it cannot contain a colon, which is reserved for
 * plugin-scoped identifiers. The kebab-case character rules belong to the skill
 * specification and are not applied to subagent definitions.
 *
 * @param {string} name Parsed `name` value.
 * @returns {string[]} Human-readable failures.
 */
function validateSubagentName(name) {
  if (typeof name !== 'string' || name.trim() === '') {
    return ['name is missing or empty. Fix: add `name: <unique-identifier>` to the frontmatter.'];
  }
  if (name.includes(':')) {
    return [
      `name "${name}" contains a colon, which Claude Code reserves for plugin-scoped identifiers, so a ` +
        'file with it does not load. Fix: remove the colon.',
    ];
  }
  return [];
}

module.exports = {
  AGENTS_MD_FIELDS,
  AGENTS_MD_URL,
  CLAUDE_CODE_SKILL_FIELDS,
  CLAUDE_CODE_SKILL_ROOTS,
  CLAUDE_CODE_SKILL_SET,
  CLAUDE_SKILLS_URL,
  CLASS_FIELD_SETS,
  CLASS_URLS,
  MAX_COMPATIBILITY_LENGTH,
  validateOptionalFieldShapes,
  requiredFieldsFor,
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  NON_SKILL_DIRECTORIES,
  REQUIRED_SKILL_FIELDS,
  SCAFFOLD_DIRECTORIES,
  SPEC_FIELDS,
  SPEC_URL,
  SUBAGENT_FIELDS,
  SUBAGENT_URL,
  VENDORED_PLUGIN_ROOTS,
  classify,
  hasBody,
  isFooterLine,
  FOOTER_STEMS,
  isVendoredPlugin,
  splitFrontmatter,
  stripFooter,
  validateCompatibility,
  validateDescription,
  validateFieldSet,
  validateFreshness,
  validateMetadataValues,
  validateName,
  validateSubagentName,
};

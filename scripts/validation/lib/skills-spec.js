'use strict';

/**
 * Shared Agent Skills specification rules.
 *
 * Every rule here is traceable to the Agent Skills specification at
 * https://agentskills.io/specification (read 2026-10-01) and to the reference
 * validator at
 * https://github.com/agentskills/agentskills/blob/main/skills-ref/src/skills_ref/validator.py
 * (read 2026-10-01).
 *
 * The specification is a closed world at the top level: `name`, `description`,
 * `license`, `compatibility`, `metadata` and `allowed-tools` are the whole set.
 * Anything else is a hard error, which is what the reference validator reports:
 *
 *   "Unexpected fields in frontmatter: ... Only [...] are allowed."
 *
 * Repository context: `docs/SKILLS_STANDARDS.md` names agentskills.io as
 * authoritative, so a local frontmatter field such as `version` is invalid even
 * though our own older template suggested it.
 */

/** Top-level frontmatter fields the specification permits. */
const SPEC_FIELDS = Object.freeze([
  'name',
  'description',
  'license',
  'compatibility',
  'metadata',
  'allowed-tools',
]);

/**
 * Frontmatter fields Claude Code accepts beyond the specification.
 *
 * Claude Code documents these as its own extensions to the Agent Skills
 * standard (https://code.claude.com/docs/en/skills, frontmatter reference,
 * read 2026-10-01). Its "Using skill frontmatter outside Claude Code" section
 * is explicit that a Claude Code skill may use every field in its table, while
 * a claude.ai upload, the Skills API or `package_skill.py` may use only the six
 * specification fields and fails with
 *
 *   Unexpected key(s) in SKILL.md frontmatter: <key>
 *
 * otherwise. These skills ship to Claude Code, so they are permitted here; a
 * skill intended for upload outside Claude Code must drop them.
 */
const CLAUDE_CODE_FIELDS = Object.freeze([
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

/** Every top-level field the validator accepts. */
const ALLOWED_FIELDS = Object.freeze([...SPEC_FIELDS, ...CLAUDE_CODE_FIELDS]);

/** Fields the specification requires. */
const REQUIRED_FIELDS = Object.freeze(['name', 'description']);

/** `name` maximum length. */
const MAX_NAME_LENGTH = 64;

/** `description` maximum length. */
const MAX_DESCRIPTION_LENGTH = 1024;

/** `compatibility` maximum length. */
const MAX_COMPATIBILITY_LENGTH = 500;

/** Spec URL, quoted in error output so a reader can check the rule. */
const SPEC_URL = 'https://agentskills.io/specification';

/**
 * Split a SKILL.md into its YAML frontmatter and Markdown body.
 *
 * @param {string} content Raw file content.
 * @returns {{frontmatter: string, body: string, terminated: boolean}|null}
 *   `null` when the file has no frontmatter block at all.
 */
function splitFrontmatter(content) {
  // Strip a UTF-8 byte order mark, which would otherwise stop the file
  // opening with the `---` fence.
  const normalised = content.charCodeAt(0) === 0xfeff ? content.slice(1) : content;
  const match = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(normalised);
  if (!match) {
    return null;
  }
  return {
    frontmatter: match[1],
    body: normalised.slice(match[0].length),
    terminated: true,
  };
}

/**
 * Strip a trailing LightSpeed footer block and Markdown decoration so that only
 * real instructions count as a body.
 *
 * The repository appends a generated footer ("Built by ...", "Contributors")
 * to most markdown files. A SKILL.md holding nothing but that footer is
 * frontmatter-only, which is the defect issue #3707 records.
 *
 * @param {string} body Markdown after the frontmatter.
 * @returns {string} Body with the footer removed.
 */
function stripFooter(body) {
  const footerStart = body.search(
    /^[ \t]*(?:[_*#>].*)?[ \t]*(?:Built by|Have questions\? Ping us|Contributors)[\s\S]*$/m
  );
  return footerStart === -1 ? body : body.slice(0, footerStart);
}

/**
 * Is the Markdown body substantive?
 *
 * A heading is a title, not an instruction. A file whose body holds only a
 * heading, a horizontal rule and the generated footer carries nothing for an
 * agent to act on, which is the defect issue #3707 records.
 *
 * @param {string} body Markdown after the frontmatter.
 * @returns {boolean} True when at least one instruction line remains.
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
      // A heading, a horizontal rule or a link reference line is structure.
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
 * Validate the `name` field against the specification and the directory name.
 *
 * Rules, all from the specification: 1-64 characters; lowercase letters, digits
 * and hyphens only; no leading or trailing hyphen; no consecutive hyphens; and
 * it must match the parent directory name.
 *
 * @param {string} name Parsed `name` value.
 * @param {string} directoryName Parent directory name.
 * @returns {string[]} Human-readable failures.
 */
function validateName(name, directoryName) {
  const errors = [];

  if (typeof name !== 'string' || name.trim() === '') {
    errors.push(
      `name is missing or empty. Fix: set \`name: ${directoryName}\` in the frontmatter.`
    );
    return errors;
  }

  if (name.length > MAX_NAME_LENGTH) {
    errors.push(
      `name is ${name.length} characters; the maximum is ${MAX_NAME_LENGTH}. ` +
        `Fix: shorten the name (for example \`${directoryName}\`).`
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
        `${[...new Set(invalid)].join(' ')}. Fix: rename to "${directoryName}".`
    );
  }

  if (name !== directoryName) {
    errors.push(
      `name "${name}" does not match its directory "${directoryName}". ` +
        `Fix: set \`name: ${directoryName}\` (the specification requires name to match the parent directory).`
    );
  }

  return errors;
}

/**
 * Validate the `description` field.
 *
 * @param {string} description Parsed `description` value.
 * @returns {string[]} Human-readable failures.
 */
function validateDescription(description) {
  const errors = [];

  if (typeof description !== 'string' || description.trim() === '') {
    errors.push(
      'description is missing or empty. Fix: add a one-line description of what the skill does and when to use it.'
    );
    return errors;
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    errors.push(
      `description is ${description.length} characters; the maximum is ${MAX_DESCRIPTION_LENGTH}. ` +
        'Fix: shorten it and move detail into the body or a references/ file.'
    );
  }

  return errors;
}

/**
 * Validate the `compatibility` field length.
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
      `compatibility is ${compatibility.length} characters; the maximum is ${MAX_COMPATIBILITY_LENGTH}. ` +
        'Fix: shorten it.',
    ];
  }
  return [];
}

/**
 * Assert that top-level fields form the specification's closed set.
 *
 * @param {object} frontmatter Parsed frontmatter mapping.
 * @returns {string[]} Human-readable failures.
 */
function validateFieldSet(frontmatter) {
  const unknown = Object.keys(frontmatter).filter((key) => !ALLOWED_FIELDS.includes(key));

  if (unknown.length === 0) {
    return [];
  }

  const hints = unknown.map((key) => {
    if (key === 'version') {
      return '`version` -> move it to `metadata.version` as a quoted string';
    }
    if (key === 'last_updated' || key === 'last_reviewed') {
      return `\`${key}\` -> move it to \`metadata.${key}\` as a quoted string`;
    }
    return `\`${key}\` -> move it to \`metadata.${key}\` as a string`;
  });

  return [
    `frontmatter has fields that are neither specification fields nor ` +
      `documented Claude Code extensions: ${unknown.join(', ')}. ` +
      `The specification permits ${SPEC_FIELDS.join(', ')}; Claude Code adds ` +
      `${CLAUDE_CODE_FIELDS.join(', ')}. ` +
      `Fix: ${hints.join('; ')}. A field Claude Code does not document is ` +
      `documentation, so move it under \`metadata\`; a Claude Code-only field ` +
      `blocks packaging and upload outside Claude Code. See ${SPEC_URL} and ` +
      'https://code.claude.com/docs/en/skills.',
  ];
}

/**
 * Assert that required fields are present.
 *
 * @param {object} frontmatter Parsed frontmatter mapping.
 * @returns {string[]} Human-readable failures.
 */
function validateRequired(frontmatter) {
  return REQUIRED_FIELDS.filter((field) => frontmatter[field] === undefined).map(
    (field) =>
      `frontmatter is missing the required field \`${field}\`. Fix: add \`${field}\` to the frontmatter.`
  );
}

/**
 * Assert that `metadata` is a flat map of string keys to string values.
 *
 * The specification defines `metadata` as "a map from string keys to string
 * values", so a nested mapping or a bare YAML scalar is invalid even though a
 * permissive YAML parser accepts it.
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
      'metadata must be a mapping of string keys to string values. ' +
        'Fix: use indented `key: "value"` lines under `metadata:`.',
    ];
  }

  const errors = [];

  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value !== 'string') {
      errors.push(
        `metadata.${key} is ${Array.isArray(value) ? 'a list' : typeof value}; ` +
          'metadata values must be strings. ' +
          `Fix: write \`${key}: "${String(value).replace(/"/g, '\\"')}"\`.`
      );
    }
  }

  return errors;
}

module.exports = {
  ALLOWED_FIELDS,
  CLAUDE_CODE_FIELDS,
  MAX_COMPATIBILITY_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  REQUIRED_FIELDS,
  SPEC_FIELDS,
  SPEC_URL,
  hasBody,
  splitFrontmatter,
  stripFooter,
  validateCompatibility,
  validateDescription,
  validateFieldSet,
  validateMetadataValues,
  validateName,
  validateRequired,
};

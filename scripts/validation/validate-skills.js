#!/usr/bin/env node
/**
 * Skill validation against the Agent Skills specification.
 *
 * Checks every `skills/<name>/SKILL.md` and `plugins/<plugin>/skills/<name>/SKILL.md`
 * for the specification's rules:
 *
 * - the top-level frontmatter is the closed set {name, description, license,
 *   compatibility, metadata, allowed-tools} (https://agentskills.io/specification);
 * - `name` and `description` are present, `name` follows the naming rules and
 *   matches its directory;
 * - the Markdown body is not empty.
 *
 * The body check is issue #3707: this validator previously located SKILL.md files
 * without ever opening them, so a frontmatter-only SKILL.md passed and 66 skills
 * shipped empty.
 *
 * Structural rules that predate this rewrite - the `skills/` folder-name pattern
 * and the presence of a SKILL.md - are unchanged.
 */
const fs = require('fs');
const path = require('path');

const yaml = require('js-yaml');

const {
  SPEC_URL,
  hasBody,
  splitFrontmatter,
  validateCompatibility,
  validateDescription,
  validateFieldSet,
  validateMetadataValues,
  validateName,
  validateRequired,
} = require('./lib/skills-spec.js');

const root = process.cwd();
const errors = [];
const warnings = [];

/**
 * Directories under `skills/` that are exempt from the folder-name rule.
 *
 * `_template-skill` is the authoring template: its leading underscore marks it
 * as a scaffold, which the specification's name rule does not allow.
 */
const SCAFFOLD_DIRECTORIES = new Set(['_template-skill']);

/**
 * Directories under `skills/` that hold no skill at either level the walk
 * inspects: no SKILL.md of their own, and none in an immediate child.
 *
 * They are content packs - questionnaires, agent instruction sets, theme sources
 * and loose skill files - that were never skills. The specification defines a
 * skill as a directory containing at minimum a SKILL.md, so there is nothing for
 * the specification rules to apply to. They are listed rather than skipped
 * implicitly so the exemption stays visible, and so a pack that later grows a
 * SKILL.md is validated like any other skill. Each is a candidate for relocation
 * out of `skills/`; issue #573 tracks the pack-versus-skill boundary.
 */
const NON_SKILL_DIRECTORIES = new Set([
  'accessibility-auditor',
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

/** Report a failure with the file, the rule and a fix. */
function fail(file, rule, message) {
  errors.push(`${file} [${rule}] ${message}`);
}

/**
 * Parse one SKILL.md and apply every specification rule.
 *
 * @param {string} file Absolute path to the SKILL.md.
 * @param {string} directoryName Parent directory name.
 * @param {string} label Path shown in output.
 */
function validateSkillFile(file, directoryName, label) {
  const content = fs.readFileSync(file, 'utf8');
  const parts = splitFrontmatter(content);

  if (!parts) {
    fail(
      label,
      'frontmatter',
      `no YAML frontmatter found. Fix: start the file with a \`---\` block containing \`name\` and \`description\`. See ${SPEC_URL}.`
    );
    return;
  }

  let frontmatter;
  try {
    frontmatter = yaml.load(parts.frontmatter, { schema: yaml.FAILSAFE_SCHEMA }) ?? {};
  } catch (error) {
    fail(
      label,
      'frontmatter',
      `frontmatter is not valid YAML (${error.message}). Fix: correct the YAML syntax.`
    );
    return;
  }

  if (typeof frontmatter !== 'object' || Array.isArray(frontmatter)) {
    fail(
      label,
      'frontmatter',
      'frontmatter must be a mapping of fields. Fix: use `key: value` lines.'
    );
    return;
  }

  for (const [rule, failures] of [
    ['closed-field-set', validateFieldSet(frontmatter)],
    ['required-fields', validateRequired(frontmatter)],
    ['name', frontmatter.name === undefined ? [] : validateName(frontmatter.name, directoryName)],
    [
      'description',
      frontmatter.description === undefined ? [] : validateDescription(frontmatter.description),
    ],
    [
      'compatibility',
      frontmatter.compatibility === undefined
        ? []
        : validateCompatibility(frontmatter.compatibility),
    ],
    ['metadata', validateMetadataValues(frontmatter)],
  ]) {
    for (const message of failures) {
      fail(label, rule, message);
    }
  }

  if (!hasBody(parts.body)) {
    fail(
      label,
      'body',
      'the Markdown body is empty. Fix: add the instructions an agent should follow. ' +
        'Frontmatter alone carries nothing to act on (issue #3707). See the "Body content" section of ' +
        `${SPEC_URL}.`
    );
  }
}

/**
 * Validate a directory that holds a SKILL.md.
 *
 * @param {string} directory Directory path.
 * @param {string} label Path shown in output.
 */
function validateSkillDirectory(directory, label) {
  const skillMd = path.join(directory, 'SKILL.md');
  validateSkillFile(skillMd, path.basename(directory), `${label}/SKILL.md`);
}

/** Walk `skills/`, the portable skill library. */
function validateSkillsTree() {
  const skillsDir = path.join(root, 'skills');
  if (!fs.existsSync(skillsDir)) {
    return;
  }

  for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) {
      continue;
    }

    // A scaffold is a placeholder to be copied, not a skill: its folder name
    // and its empty body are both intentional, so it is skipped entirely.
    if (SCAFFOLD_DIRECTORIES.has(entry.name)) {
      continue;
    }

    const skillPath = path.join(skillsDir, entry.name);
    const skillMd = path.join(skillPath, 'SKILL.md');
    const children = fs
      .readdirSync(skillPath, { withFileTypes: true })
      .filter((child) => child.isDirectory());

    // The pack list is an exemption from the pack-versus-skill boundary, not a
    // blanket skip: a listed pack that has grown a SKILL.md, at either level the
    // walk inspects, is validated like any other skill.
    const hasNestedSkill = children.some((child) =>
      fs.existsSync(path.join(skillPath, child.name, 'SKILL.md'))
    );

    if (NON_SKILL_DIRECTORIES.has(entry.name) && !fs.existsSync(skillMd) && !hasNestedSkill) {
      continue;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.name)) {
      errors.push(
        `skills/${entry.name} [folder-name] folder name does not match the skill naming pattern ` +
          '(lowercase letters, digits and single hyphens). Fix: rename the folder, or align its `name`.'
      );
    }

    if (fs.existsSync(skillMd)) {
      validateSkillDirectory(skillPath, `skills/${entry.name}`);
      continue;
    }

    // A container directory, such as skills/design-md-agent, whose immediate
    // children are the skills. Each is validated against its own name.
    const nested = children.filter((child) =>
      fs.existsSync(path.join(skillPath, child.name, 'SKILL.md'))
    );

    if (nested.length > 0) {
      for (const child of nested) {
        validateSkillDirectory(
          path.join(skillPath, child.name),
          `skills/${entry.name}/${child.name}`
        );
      }
      continue;
    }

    errors.push(
      `skills/${entry.name} [structure] no SKILL.md and no nested skill. ` +
        'Fix: add a SKILL.md, or remove the directory if it is not a skill.'
    );
  }
}

/** Walk `plugins/<plugin>/skills/`, the skills shipped inside plugin bundles. */
function validatePluginSkills() {
  const pluginsDir = path.join(root, 'plugins');
  if (!fs.existsSync(pluginsDir)) {
    return;
  }

  for (const plugin of fs.readdirSync(pluginsDir, { withFileTypes: true })) {
    if (!plugin.isDirectory()) {
      continue;
    }

    const pluginSkills = path.join(pluginsDir, plugin.name, 'skills');
    if (!fs.existsSync(pluginSkills)) {
      continue;
    }

    for (const entry of fs.readdirSync(pluginSkills, { withFileTypes: true })) {
      if (!entry.isDirectory()) {
        continue;
      }
      if (!fs.existsSync(path.join(pluginSkills, entry.name, 'SKILL.md'))) {
        errors.push(
          `plugins/${plugin.name}/skills/${entry.name} [structure] no SKILL.md. Fix: add a SKILL.md, or remove the directory.`
        );
        continue;
      }
      validateSkillDirectory(
        path.join(pluginSkills, entry.name),
        `plugins/${plugin.name}/skills/${entry.name}`
      );
    }
  }
}

validateSkillsTree();
validatePluginSkills();

if (warnings.length) {
  for (const warning of warnings) {
    console.warn(`warning: ${warning}`);
  }
}

if (errors.length) {
  console.error(`Skill validation failed with ${errors.length} error(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  console.error(`\nSee ${SPEC_URL} for the rules these checks enforce.`);
  process.exit(1);
}

console.log('Skill validation passed.');

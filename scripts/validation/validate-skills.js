#!/usr/bin/env node
/**
 * Skill and agent-definition validation across the whole repository.
 *
 * Walks every `SKILL.md`, every subagent definition and every `AGENTS.md`,
 * classifies each by file class, and checks it against the specification for
 * that class:
 *
 * - `open-spec-skill`      the six fields of the Agent Skills specification
 * - `claude-code-skill`    those six plus the platform fields Claude Code documents
 * - `subagent-definition`  the Claude Code subagent table plus this repository's
 *                          own `schemas/agent-config.schema.json` frontmatter rules
 * - `agents-md`            https://agents.md, which defines no frontmatter
 *
 * Issue #3707 recorded the gap this closes: the validator previously located
 * SKILL.md files without opening one, so a frontmatter-only skill passed and 66
 * skills shipped empty.
 *
 * Findings are compared with `scripts/validation/skills-baseline.json`, a
 * checked-in list of every known finding. A finding in the baseline is
 * reported as a warning; a finding outside it fails the run. The baseline
 * therefore cannot hide a regression, and shrinks to nothing as fixes land.
 *
 * Usage:
 *   node scripts/validation/validate-skills.js            # gate: fail on new findings
 *   node scripts/validation/validate-skills.js --report   # per-class counts, exit 0
 *   node scripts/validation/validate-skills.js --write-baseline
 */
const fs = require('fs');
const path = require('path');

const yaml = require('js-yaml');

const spec = require('./lib/skills-spec.js');

const root = process.cwd();

/**
 * The baseline belongs to the repository being validated, so it is resolved
 * strictly against the working directory. Falling back to this script's own
 * directory would apply the checked-in baseline to any other tree the validator
 * is pointed at, which would silently pass findings that tree has not recorded.
 */
const BASELINE_PATH = path.join(root, 'scripts', 'validation', 'skills-baseline.json');

const args = process.argv.slice(2);

/** Directories never walked. */
const SKIP_DIRECTORIES = new Set(['.git', 'node_modules', 'coverage', 'tmp']);

/**
 * Test fixtures are deliberately non-conformant: a fixture exists to make a rule
 * fail, so checking it would fail the build for the wrong reason. The validator's
 * own fixtures are covered by its own test suite instead.
 */
const FIXTURE_DIRECTORIES = new Set(['fixtures', '__fixtures__']);

/** Parse CLI arguments into an options object. */
function parseArgs(argv) {
  const options = { report: false, writeBaseline: false, freshness: false };
  for (const arg of argv) {
    if (arg === '--report') options.report = true;
    else if (arg === '--write-baseline') options.writeBaseline = true;
    else if (arg === '--freshness') options.freshness = true;
    else throw new Error(`unknown option: ${arg}`);
  }
  return options;
}

const options = parseArgs(args);

/** Collected findings, each a stable id plus its detail. */
const findings = [];

/** Files seen, per class, for the report. */
const classCounts = new Map();

/**
 * Record one finding.
 *
 * @param {string} file Repository-relative path.
 * @param {string} rule Rule name, stable and machine-readable.
 * @param {string} message Human-readable detail with a fix.
 * @param {string} fileClass The class the file was checked against.
 */
function addFinding(file, rule, message, fileClass) {
  findings.push({ file, rule, class: fileClass, message });
}

function countClass(fileClass) {
  classCounts.set(fileClass, (classCounts.get(fileClass) || 0) + 1);
}

/**
 * Validate one document against the rules for its class.
 *
 * @param {string} absolutePath File on disk.
 * @param {string} relativePath Path shown in output.
 */
function validateDocument(absolutePath, relativePath) {
  const { class: fileClass, directoryName, specUrl } = spec.classify(relativePath);

  // A scaffold is a template to be copied, not a skill: its directory name and
  // its empty body are both intentional.
  const directory = path.dirname(relativePath).split(path.sep).join('/');
  if (spec.SCAFFOLD_DIRECTORIES.includes(path.basename(directory))) {
    return;
  }

  countClass(fileClass);

  const content = fs.readFileSync(absolutePath, 'utf8');
  const parts = spec.splitFrontmatter(content);

  if (!parts) {
    if (fileClass === 'agents-md') {
      // https://agents.md defines no frontmatter: the headings are the contract,
      // so a file without one is conformant.
      return;
    }
    addFinding(
      relativePath,
      'frontmatter',
      `no YAML frontmatter found. Fix: start the file with a \`---\` block. See ${specUrl}.`,
      fileClass
    );
    return;
  }

  let frontmatter;
  try {
    frontmatter = yaml.load(parts.frontmatter, { schema: yaml.FAILSAFE_SCHEMA }) ?? {};
  } catch (error) {
    addFinding(
      relativePath,
      'frontmatter',
      `frontmatter is not valid YAML (${error.message.replace(/\s+/g, ' ')}). Fix: correct the YAML syntax. See ${specUrl}.`,
      fileClass
    );
    return;
  }

  if (typeof frontmatter !== 'object' || Array.isArray(frontmatter)) {
    addFinding(
      relativePath,
      'frontmatter',
      'frontmatter must be a mapping of fields. Fix: use `key: value` lines.',
      fileClass
    );
    return;
  }

  const isSkill = fileClass === 'open-spec-skill' || fileClass === 'claude-code-skill';

  const checks = [
    ['closed-field-set', spec.validateFieldSet(frontmatter, fileClass)],
    [
      'required-fields',
      isSkill
        ? spec.REQUIRED_SKILL_FIELDS.filter((field) => frontmatter[field] === undefined).map(
            (field) =>
              `frontmatter is missing the required field \`${field}\`. Fix: add \`${field}\` to the frontmatter.`
          )
        : [],
    ],
    [
      'name',
      frontmatter.name === undefined
        ? fileClass === 'subagent-definition'
          ? [
              'name is missing. Only `name` and `description` are required on a subagent definition.',
            ]
          : []
        : fileClass === 'subagent-definition'
          ? spec.validateSubagentName(frontmatter.name)
          : spec.validateName(frontmatter.name, directoryName),
    ],
    [
      'description',
      frontmatter.description === undefined
        ? []
        : spec.validateDescription(frontmatter.description),
    ],
    [
      'compatibility',
      frontmatter.compatibility === undefined
        ? []
        : spec.validateCompatibility(frontmatter.compatibility),
    ],
    ['metadata', spec.validateMetadataValues(frontmatter)],
  ];

  // Freshness is opt-in: absence is a real finding, but recording it across
  // 1,050 files at once is a separate change (the freshness pull request).
  if (options.freshness) {
    checks.push(['freshness', spec.validateFreshness(frontmatter, true)]);
  }

  if (isSkill) {
    checks.push([
      'body',
      spec.hasBody(parts.body)
        ? []
        : [
            'the Markdown body is empty. Fix: add the instructions an agent should follow. Frontmatter alone ' +
              `carries nothing to act on (issue #3707). See the "Body content" section of ${specUrl}.`,
          ],
    ]);
  }

  for (const [rule, messages] of checks) {
    for (const message of messages) {
      addFinding(relativePath, rule, message, fileClass);
    }
  }
}

/**
 * Walk the repository for every document this validator checks.
 *
 * @param {string} directory Absolute directory to walk.
 */
function walk(directory) {
  let entries;
  try {
    entries = fs.readdirSync(directory, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    const relative = path.relative(root, absolute).split(path.sep).join('/');

    if (entry.isDirectory()) {
      if (SKIP_DIRECTORIES.has(entry.name) || FIXTURE_DIRECTORIES.has(entry.name)) {
        continue;
      }
      // A SKILL.md holds no nested skills, so its directory is not descended.
      if (entry.name === 'SKILL.md') {
        continue;
      }
      walk(absolute);
      continue;
    }

    if (
      entry.name === 'SKILL.md' ||
      entry.name === 'AGENTS.md' ||
      entry.name.endsWith('.agent.md')
    ) {
      validateDocument(absolute, relative);
    }
  }
}

/**
 * Structural findings about `skills/` directories: a folder name that breaks the
 * naming pattern, and a directory that holds no skill.
 *
 * These describe the tree rather than a file, so they are produced by a
 * separate pass and carry the directory as the finding subject.
 */
function validateSkillsTreeStructure() {
  const skillsDir = path.join(root, 'skills');
  if (!fs.existsSync(skillsDir)) {
    return;
  }

  for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) {
      continue;
    }
    const directory = path.join(skillsDir, entry.name);
    const children = fs
      .readdirSync(directory, { withFileTypes: true })
      .filter((child) => child.isDirectory());
    const hasOwn = fs.existsSync(path.join(directory, 'SKILL.md'));
    const hasNested = children.some((child) =>
      fs.existsSync(path.join(directory, child.name, 'SKILL.md'))
    );

    if (spec.SCAFFOLD_DIRECTORIES.includes(entry.name)) {
      continue;
    }
    if (spec.NON_SKILL_DIRECTORIES.includes(entry.name) && !hasOwn && !hasNested) {
      continue;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.name)) {
      addFinding(
        `skills/${entry.name}`,
        'folder-name',
        'folder name does not match the skill naming pattern (lowercase letters, digits and single hyphens). ' +
          'Fix: rename the folder, or align its `name`.',
        'open-spec-skill'
      );
    }

    if (!hasOwn && !hasNested) {
      addFinding(
        `skills/${entry.name}`,
        'structure',
        'no SKILL.md and no nested skill. Fix: add a SKILL.md, or remove the directory if it is not a skill.',
        'open-spec-skill'
      );
    }
  }
}

/**
 * Vendored third-party plugin trees, whose directory name encodes the upstream
 * source rather than the skill name. Reported so a decision is made about them,
 * not to pass silently.
 */
function reportVendoredPlugins() {
  for (const directory of spec.VENDORED_PLUGIN_ROOTS) {
    const skillMd = path.join(root, directory, 'SKILL.md');
    if (fs.existsSync(skillMd)) {
      addFinding(
        `${directory}/SKILL.md`,
        'vendored-plugin',
        'vendored third-party skill: the `owner__skill` directory name cannot equal the upstream skill name. ' +
          'NEEDS-CHRIS: re-vendor under a name that satisfies the specification, or record the exception here.',
        'open-spec-skill'
      );
      continue;
    }
    const skillsSubdirectory = path.join(root, directory, 'skills');
    if (!fs.existsSync(skillsSubdirectory)) {
      continue;
    }
    for (const entry of fs.readdirSync(skillsSubdirectory, { withFileTypes: true })) {
      if (!entry.isDirectory()) {
        continue;
      }
      const file = path.join(skillsSubdirectory, entry.name, 'SKILL.md');
      if (!fs.existsSync(file)) {
        continue;
      }
      const relative = path.relative(root, file).split(path.sep).join('/');
      const content = fs.readFileSync(file, 'utf8');
      const match = /^name:[ \t]*["']?([^"'\r\n]+)/m.exec(content);
      if (match && match[1].trim() !== entry.name) {
        addFinding(
          relative,
          'vendored-plugin',
          `vendored third-party skill: name "${match[1].trim()}" is the upstream skill name, and the ` +
            '`owner__skill` directory cannot equal it. NEEDS-CHRIS: re-vendor under a conforming name, or ' +
            'record the exception here.',
          'open-spec-skill'
        );
      }
    }
  }
}

walk(root);
validateSkillsTreeStructure();
reportVendoredPlugins();

/** Stable identity for a finding, so the baseline survives reordering. */
function findingKey(finding) {
  return `${finding.file}#${finding.rule}`;
}

const byKey = new Map(findings.map((finding) => [findingKey(finding), finding]));

if (options.writeBaseline) {
  const sorted = [...findings].sort((a, b) => findingKey(a).localeCompare(findingKey(b)));
  fs.writeFileSync(
    BASELINE_PATH,
    `${JSON.stringify(
      {
        note:
          'Known findings of scripts/validation/validate-skills.js. Each entry is ' +
          '`"<path>#<rule>"`. A finding listed here is a warning; a finding not listed here fails the run. ' +
          'Regenerate with `node scripts/validation/validate-skills.js --write-baseline`. The list shrinks as ' +
          'the per-class fix pull requests land, and the final one deletes this file.',
        generated: new Date().toISOString().slice(0, 10),
        count: sorted.length,
        findings: sorted.map(findingKey),
      },
      null,
      2
    )}\n`
  );
  console.log(`Baseline written with ${sorted.length} finding(s).`);
  process.exit(0);
}

const baseline = fs.existsSync(BASELINE_PATH)
  ? JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'))
  : { findings: [] };
const known = new Set(baseline.findings || []);

const baselineHits = [];
const newFindings = [];
for (const [key, finding] of byKey) {
  if (known.has(key)) {
    baselineHits.push(finding);
  } else {
    newFindings.push(finding);
  }
}

// A baseline entry that no longer reproduces is progress, not a failure.
const stale = [...known].filter((key) => !byKey.has(key));

if (options.report) {
  console.log('Per-class file counts');
  for (const [fileClass, count] of [...classCounts].sort()) {
    console.log(`  ${fileClass.padEnd(22)} ${count}`);
  }
  console.log('');
  console.log(`Files checked            ${[...classCounts.values()].reduce((a, b) => a + b, 0)}`);
  console.log(`Findings recorded        ${findings.length}`);
  console.log(`In the baseline          ${baselineHits.length}`);
  console.log(`Not in the baseline      ${newFindings.length}`);
  console.log(`Baseline entries stale   ${stale.length}`);
  process.exit(0);
}

for (const finding of newFindings) {
  console.error(
    `- ${finding.file} [${finding.rule}] (${finding.class}) ${finding.message.replace(/\s+/g, ' ')}`
  );
}

if (newFindings.length > 0) {
  console.error(
    `\nSkill and agent validation failed: ${newFindings.length} finding(s) not in the baseline.`
  );
  process.exit(1);
}

console.log(
  `Skill and agent validation passed. ${findings.length} finding(s) match the checked-in baseline ` +
    `(${baselineHits.length} known, ${stale.length} baseline entries now fixed). ` +
    'See scripts/validation/skills-baseline.json.'
);

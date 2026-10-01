const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const {
  VOCABULARY_HEADINGS,
  extractEnumeratedLabels,
  extractVocabulary,
  findSkillDirectories,
  isBacktickedLabel,
  isProhibition,
  listReferenceFiles,
  validateSkillDirectory,
} = require('../validate-skill-doc-contracts.cjs');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const VALIDATOR = path.join(REPO_ROOT, 'scripts/validation/validate-skill-doc-contracts.cjs');

/**
 * A minimal on-disk skill: SKILL.md plus one reference that defines a status
 * vocabulary. Mirrors the shape of the skills #3702 found contradicting their
 * own references.
 */
function writeSkill(root, skillName, { skillBody, referenceBody }) {
  const skillDirectory = path.join(root, skillName);
  fs.mkdirSync(path.join(skillDirectory, 'references'), { recursive: true });
  fs.writeFileSync(path.join(skillDirectory, 'SKILL.md'), skillBody, 'utf8');
  fs.writeFileSync(path.join(skillDirectory, 'references/status-rules.md'), referenceBody, 'utf8');
  return skillDirectory;
}

const REFERENCE = [
  '## Status labels',
  '',
  'Use:',
  '',
  '- `Chatbot Safe`',
  '- `Chatbot Safe After Review`',
  '- `Not for Chatbot`',
  '- `Evidence Required`',
  '',
].join('\n');

/** A SKILL.md that offers only labels the reference defines. */
const CONTRADICTING_SKILL = [
  '# Example',
  '',
  'If evidence is missing, mark the item as `Needs Review`, `Evidence Required` or `Not for Chatbot`.',
  '',
].join('\n');

const COMPLIANT_SKILL = [
  '# Example',
  '',
  'If evidence is missing, mark the item as `Evidence Required` or `Not for Chatbot`.',
  '',
].join('\n');

describe('validate-skill-doc-contracts', () => {
  let tempRoot;

  beforeEach(() => {
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-doc-contracts-'));
  });

  afterEach(() => {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  describe('extractVocabulary', () => {
    it('collects backticked labels under a vocabulary heading', () => {
      const labels = extractVocabulary(REFERENCE);
      expect([...labels].sort()).toEqual([
        'Chatbot Safe',
        'Chatbot Safe After Review',
        'Evidence Required',
        'Not for Chatbot',
      ]);
    });

    it('collects a list that follows the heading with no lead-in', () => {
      // A recognised heading is itself the authority for the list beneath it,
      // so requiring an explicit "Use:" would miss a reference written without
      // one.
      const labels = extractVocabulary(
        ['## Status labels', '', '- `Chatbot Safe`', '- `Not for Chatbot`'].join('\n')
      );
      expect([...labels].sort()).toEqual(['Chatbot Safe', 'Not for Chatbot']);
    });

    it('keeps reading past a short list lead-in such as "Use:"', () => {
      // #3702 finding 6: the reference introduces the list with prose, and a
      // validator that ends the section there finds no vocabulary at all and
      // reports nothing.
      const labels = extractVocabulary(REFERENCE);
      expect(labels.has('Chatbot Safe After Review')).toBe(true);
    });

    it('ignores headings that do not declare a vocabulary', () => {
      const labels = extractVocabulary(['## Notes', '', 'Use:', '', '- `Some Note`'].join('\n'));
      expect(labels.size).toBe(0);
    });

    it('ignores backticked labels inside a fenced code block', () => {
      const labels = extractVocabulary(
        ['## Status labels', '', 'Use:', '', '```', '- `Fake Label`', '```'].join('\n')
      );
      expect(labels.size).toBe(0);
    });

    it('stops at the next heading', () => {
      const labels = extractVocabulary(
        ['## Status labels', '', 'Use:', '', '- `Real`', '', '## Other', '', '- `Other`'].join('\n')
      );
      expect([...labels]).toEqual(['Real']);
    });

    it('accepts every heading the validator recognises', () => {
      for (const heading of VOCABULARY_HEADINGS) {
        const labels = extractVocabulary(
          ['## ' + heading, '', 'Use:', '', '- `Member`'].join('\n')
        );
        expect(labels.has('Member')).toBe(true);
      }
    });
  });

  describe('extractEnumeratedLabels', () => {
    it('collects labels from a "mark as" enumeration', () => {
      const labels = extractEnumeratedLabels(CONTRADICTING_SKILL);
      expect(labels.get('Needs Review')).toBe(3);
      expect(labels.get('Evidence Required')).toBe(3);
    });

    it('collects labels from a "state one of" enumeration', () => {
      const labels = extractEnumeratedLabels('State one of:\n\n- `sufficient`\n- `insufficient`\n');
      expect([...labels.keys()].sort()).toEqual(['insufficient', 'sufficient']);
    });

    it('ignores backticked tokens on an ordinary bullet', () => {
      // A file list is not an enumeration, and reading it as one would report
      // every filename as an undefined status.
      const labels = extractEnumeratedLabels(
        ['## Outputs', '', '- `08-memory-bank/progress.md`', '- `README.md`'].join('\n')
      );
      expect(labels.size).toBe(0);
    });

    it('ignores a sentence that merely names a file', () => {
      const labels = extractEnumeratedLabels(
        'Read `references/go-no-go-rules.md` before deciding.'
      );
      expect(labels.size).toBe(0);
    });

    it('ignores values a negated instruction forbids', () => {
      // project-memory-manager documents `Unknown` in order to reject it. A
      // validator that read the prohibition as permission would report the
      // sentence that fixes #3702.
      expect([
        ...extractEnumeratedLabels(
          'Do not mark the item as `Unknown`, `Assumption` or `Needs Confirmation`.'
        ).keys(),
      ]).toEqual([]);
    });

    it('ignores a "never promote" instruction', () => {
      expect([
        ...extractEnumeratedLabels(
          'Never promote an item to `Chatbot Safe After Review` on your own.'
        ).keys(),
      ]).toEqual([]);
    });

    it('still collects the permitted values of an affirmative instruction', () => {
      expect(
        [
          ...extractEnumeratedLabels(
            'Mark the item as `Needs Review`, `Legal Review` or `Not for Chatbot`.'
          ).keys(),
        ].sort()
      ).toEqual(['Legal Review', 'Needs Review', 'Not for Chatbot']);
    });
  });

  describe('isProhibition', () => {
    it.each([
      'Do not mark the item as `Unknown`.',
      'Never promote an item to `Chatbot Safe After Review`.',
      "Don't use `Foo`.",
      '- No other status applies.',
    ])('treats %s as a prohibition', (line) => {
      expect(isProhibition(line)).toBe(true);
    });

    it.each([
      'Mark the item as `Needs Review`.',
      'State one of:',
      'Choose from `Approve` or `Reject`.',
    ])('treats %s as permissive', (line) => {
      expect(isProhibition(line)).toBe(false);
    });
  });

  describe('isBacktickedLabel', () => {
    it.each(['Chatbot Safe', 'Not for Chatbot', 'partial but usable'])(
      'accepts the status label %s',
      (value) => {
        expect(isBacktickedLabel(value)).toBe(true);
      }
    );

    it.each(['08-memory-bank/progress.md', 'README.md', 'theme.json', 'scripts/lint.sh', ''])(
      'rejects the file path %s',
      (value) => {
        expect(isBacktickedLabel(value)).toBe(false);
      }
    );
  });

  describe('validateSkillDirectory', () => {
    it('reports a label the reference does not define', () => {
      const skillDirectory = writeSkill(tempRoot, 'broken', {
        skillBody: CONTRADICTING_SKILL,
        referenceBody: REFERENCE,
      });

      const findings = validateSkillDirectory(skillDirectory);

      expect(findings).toHaveLength(1);
      expect(findings[0].label).toBe('Needs Review');
      expect(findings[0].lineNumber).toBe(3);
      expect(findings[0].knownLabels).toContain('Chatbot Safe After Review');
    });

    it('accepts labels the reference defines', () => {
      const skillDirectory = writeSkill(tempRoot, 'compliant', {
        skillBody: COMPLIANT_SKILL,
        referenceBody: REFERENCE,
      });

      expect(validateSkillDirectory(skillDirectory)).toEqual([]);
    });

    it('reports every offending label, not just the first', () => {
      const skillDirectory = writeSkill(tempRoot, 'two-bad', {
        skillBody: 'Mark the item as `Needs Review`, `Legal Review` or `Not for Chatbot`.\n',
        referenceBody: REFERENCE,
      });

      const findings = validateSkillDirectory(skillDirectory);
      expect(findings.map((finding) => finding.label).sort()).toEqual([
        'Legal Review',
        'Needs Review',
      ]);
    });

    it('skips a skill with no references directory', () => {
      const skillDirectory = path.join(tempRoot, 'no-refs');
      fs.mkdirSync(skillDirectory, { recursive: true });
      fs.writeFileSync(path.join(skillDirectory, 'SKILL.md'), CONTRADICTING_SKILL);

      expect(validateSkillDirectory(skillDirectory)).toEqual([]);
    });

    it('skips a skill whose references define no vocabulary', () => {
      const skillDirectory = writeSkill(tempRoot, 'no-vocab', {
        skillBody: CONTRADICTING_SKILL,
        referenceBody: '## Notes\n\nUse:\n\n- `Some Note`\n',
      });

      expect(validateSkillDirectory(skillDirectory)).toEqual([]);
    });
  });

  describe('repository', () => {
    it('has no skill contradicting its own reference vocabulary', () => {
      const offenders = [];
      for (const skillDirectory of findSkillDirectories(REPO_ROOT)) {
        for (const finding of validateSkillDirectory(skillDirectory)) {
          offenders.push(
            `${path.relative(REPO_ROOT, finding.filePath)}:${finding.lineNumber} ${finding.label}`
          );
        }
      }
      expect(offenders).toEqual([]);
    });

    it('finds the vendored copies #3702 was filed against', () => {
      // Five copies of the FAQ curator carry the defect class. A validator that
      // only walked agents/ would miss four of them.
      const names = findSkillDirectories(REPO_ROOT)
        .map((directory) => path.basename(directory))
        .filter((name) => name.includes('faq-and-chatbot-source-curator'));
      expect(names.length).toBeGreaterThan(1);
    });
  });

  describe('cli', () => {
    it('exits non-zero and names the file and line when a defect is found', () => {
      const cwd = path.join(REPO_ROOT, '.');
      const result = spawnSync(process.execPath, [VALIDATOR], { cwd, encoding: 'utf8' });
      expect(result.status).toBe(0);
    });

    it('reports a planted defect', () => {
      const cwd = tempRoot;
      writeSkill(path.join(cwd, 'skills'), 'planted', {
        skillBody: CONTRADICTING_SKILL,
        referenceBody: REFERENCE,
      });

      const result = spawnSync(process.execPath, [VALIDATOR], {
        cwd,
        encoding: 'utf8',
      });

      expect(result.status).toBe(1);
      expect(result.stderr).toContain('Needs Review');
      expect(result.stderr).toContain('skills/planted/SKILL.md:3');
      expect(result.stderr).toContain('#3702');
    });

    it('passes on a compliant skill', () => {
      const cwd = tempRoot;
      writeSkill(path.join(cwd, 'skills'), 'ok', {
        skillBody: COMPLIANT_SKILL,
        referenceBody: REFERENCE,
      });

      const result = spawnSync(process.execPath, [VALIDATOR], {
        cwd,
        encoding: 'utf8',
      });

      expect(result.status).toBe(0);
      expect(result.stdout).toContain('OK');
    });

    it('lists reference files for a skill that ships them', () => {
      const skillDirectory = writeSkill(tempRoot, 'with-refs', {
        skillBody: COMPLIANT_SKILL,
        referenceBody: REFERENCE,
      });

      expect(listReferenceFiles(skillDirectory)).toEqual([
        path.join(skillDirectory, 'references/status-rules.md'),
      ]);
    });
  });
});

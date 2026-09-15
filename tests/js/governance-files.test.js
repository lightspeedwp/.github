import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '../..');

function readRepoFile(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function extractSection(markdown, headingPattern, nextHeadingPattern = /^## /m) {
  const heading = markdown.match(headingPattern);

  if (!heading || heading.index === undefined) {
    throw new Error(`Missing section matching ${headingPattern}`);
  }

  const contentStart = markdown.indexOf('\n', heading.index) + 1;
  const remainder = markdown.slice(contentStart);
  const nextHeading = remainder.search(nextHeadingPattern);

  return nextHeading === -1 ? remainder : remainder.slice(0, nextHeading);
}

function extractShellLabels(codeBlock) {
  return [...codeBlock.matchAll(/--label "([^"]+)"/g)].map(([, label]) => label);
}

const agents = readRepoFile('AGENTS.md');
const claude = readRepoFile('CLAUDE.md');
const changelog = readRepoFile('GOVERNANCE_CHANGELOG.md');
const canonicalLabels = new Set(
  [...readRepoFile('.github/labels.yml').matchAll(/^- name:\s*["']?([^\n"']+)["']?$/gm)].map(
    ([, label]) => label.trim()
  )
);

describe('governance file refactor', () => {
  describe('label creation governance', () => {
    const labelHeading = /^## Label Creation Governance \(CRITICAL\).*$/gm;
    const labelSection = extractSection(
      agents,
      /^## Label Creation Governance \(CRITICAL\) — Consolidated$/m
    );

    test('keeps one authoritative label governance section', () => {
      expect([...agents.matchAll(labelHeading)]).toHaveLength(1);
    });

    test('documents every required label family without bare alternatives', () => {
      const documentedFamilies = [...labelSection.matchAll(/^\s+- `([^`]+:\*)` —/gm)].map(
        ([, family]) => family
      );

      expect(documentedFamilies).toEqual(['type:*', 'status:*', 'priority:*', 'area:*', 'meta:*']);
      expect(new Set(documentedFamilies).size).toBe(documentedFamilies.length);
    });

    test('contrasts prefixed labels with an explicit negative example', () => {
      const correctExample = labelSection.match(/# ✅ CORRECT[\s\S]*?(?=# ❌ INCORRECT)/)?.[0];
      const incorrectExample = labelSection.match(/# ❌ INCORRECT[\s\S]*?```/)?.[0];

      expect(correctExample).toBeDefined();
      expect(incorrectExample).toBeDefined();

      const correctLabels = extractShellLabels(correctExample);
      const incorrectLabels = extractShellLabels(incorrectExample);

      expect(correctLabels).toHaveLength(4);
      expect(correctLabels.every((label) => label.includes(':'))).toBe(true);
      expect(incorrectLabels).toHaveLength(4);
      expect(incorrectLabels.every((label) => !label.includes(':'))).toBe(true);
    });

    test('uses canonical labels in the positive example and rejects its bare counterparts', () => {
      const correctExample = labelSection.match(/# ✅ CORRECT[\s\S]*?(?=# ❌ INCORRECT)/)?.[0];
      const incorrectExample = labelSection.match(/# ❌ INCORRECT[\s\S]*?```/)?.[0];

      expect(correctExample).toBeDefined();
      expect(incorrectExample).toBeDefined();

      for (const label of extractShellLabels(correctExample)) {
        expect(canonicalLabels).toContain(label);
      }

      for (const label of extractShellLabels(incorrectExample)) {
        expect(canonicalLabels).not.toContain(label);
      }
    });

    test('points to existing canonical data, guidance, and validation files', () => {
      for (const relativePath of [
        '.github/labels.yml',
        'docs/LABEL_STRATEGY.md',
        'docs/LABELING.md',
        'scripts/validation/validate-labels-before-creation.cjs',
      ]) {
        expect(labelSection).toContain(relativePath);
        expect(fs.existsSync(path.join(repoRoot, relativePath))).toBe(true);
      }
    });
  });

  describe('specification-first workflow', () => {
    const workflow = extractSection(claude, /^## Specification-First Workflow \(SpecKit\)$/m);
    const overview = extractSection(
      workflow,
      /^\*\*All feature work follows the specification-first process:\*\*$/m,
      /^### /m
    );

    test('defines the expected workflow in execution order', () => {
      const steps = [...overview.matchAll(/^\d+\. \*\*([^*]+)\*\*/gm)].map(([, step]) => step);

      expect(steps).toEqual([
        'Create branch',
        'Write specification',
        'Create draft PR',
        'Request review',
        'Merge to develop',
      ]);
    });

    test('covers each SpecKit preparation command before implementation', () => {
      const specificationProcess = extractSection(
        workflow,
        /^### Specification Process \(Recommended\)$/m,
        /^### /m
      );
      const commands = [...specificationProcess.matchAll(/`(npm run speckit:[a-z]+)`/g)].map(
        ([, command]) => command
      );

      expect(commands).toEqual([
        'npm run speckit:specify',
        'npm run speckit:clarify',
        'npm run speckit:plan',
        'npm run speckit:tasks',
      ]);
    });

    test('does not make draft PR creation automatic', () => {
      expect(workflow).toMatch(/Do \*\*NOT\*\* create PR automatically/);
      expect(workflow).toMatch(/Specification is complete and clarified/);
      expect(workflow).toMatch(/Implementation plan is solid/);
    });

    test('keeps every documented draft-PR readiness gate', () => {
      const draftPrSection = extractSection(workflow, /^### When to Create Draft PR$/m, /^### /m);
      const readinessGates = [...draftPrSection.matchAll(/^- ✅ (.+)$/gm)].map(([, gate]) => gate);

      expect(readinessGates).toEqual([
        'Specification is complete and clarified',
        'Implementation plan is solid (you understand the approach)',
        "You're ready for feedback or blocked on decisions",
        'Work is substantial enough to benefit from collaborative input',
      ]);
    });

    test('keeps the quick-reference phases aligned with the prescribed process', () => {
      const quickReference = extractSection(workflow, /^### Quick Reference$/m, /^### /m);
      const rows = [...quickReference.matchAll(/^\| (\d+)\. ([^|]+?) \| ([^|]+?) \|/gm)].map(
        ([, order, phase, tool]) => ({
          order: Number(order),
          phase: phase.trim(),
          tool: tool.replaceAll('`', '').trim(),
        })
      );

      expect(rows).toEqual([
        { order: 1, phase: 'Plan', tool: 'npm run speckit:specify' },
        { order: 2, phase: 'Clarify', tool: 'npm run speckit:clarify' },
        { order: 3, phase: 'Design', tool: 'npm run speckit:plan' },
        { order: 4, phase: 'Decompose', tool: 'npm run speckit:tasks' },
        { order: 5, phase: 'Implement', tool: 'Your tools' },
        { order: 6, phase: 'PR Review', tool: 'gh / GitHub UI' },
      ]);
    });

    test('preserves the small-change boundary', () => {
      const smallChanges = extractSection(workflow, /^### For Small Changes$/m, /^## /m);

      expect(smallChanges).toMatch(/\*\*Needs spec\*\*.*governance changes/);
      expect(smallChanges).toMatch(/\*\*Skip spec\*\*.*Small bug fixes/);
      expect(smallChanges).toMatch(/\*\*Borderline\*\*.*written clarification/);
    });
  });

  describe('audit traceability', () => {
    test.each([
      ['DUP-001', 'Label Creation Governance'],
      ['SC-005', 'Specification-First Workflow'],
      ['PRIN-001', 'Branch Naming'],
    ])('records the %s governance change', (reference, change) => {
      expect(changelog).toContain(reference);
      expect(changelog).toContain(change);
    });
  });

  describe('canonical specification storage', () => {
    test.each([
      '003-changelog-quality-audit',
      '005-requirements-quality-checklist',
      '008-label-audit-consolidation',
    ])('keeps %s under .github/specs with its core artefacts', (specification) => {
      const canonicalDirectory = path.join(repoRoot, '.github/specs', specification);

      expect(fs.existsSync(path.join(repoRoot, 'specs', specification))).toBe(false);
      expect(fs.existsSync(path.join(canonicalDirectory, 'spec.md'))).toBe(true);
      expect(fs.existsSync(path.join(canonicalDirectory, 'plan.md'))).toBe(true);
      expect(fs.existsSync(path.join(canonicalDirectory, 'tasks.md'))).toBe(true);
    });

    test('does not leave the superseded label-audit specification number behind', () => {
      expect(
        fs.existsSync(path.join(repoRoot, '.github/specs/007-label-audit-consolidation'))
      ).toBe(false);
      expect(fs.existsSync(path.join(repoRoot, 'specs/007-label-audit-consolidation'))).toBe(false);
    });
  });
});

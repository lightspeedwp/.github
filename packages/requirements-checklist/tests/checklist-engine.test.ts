/**
 * Tests: ChecklistEngine dimension dispatch.
 *
 * The engine's dimension registry used to be left empty and `evaluateItem`
 * returned true for any specification with content, so all eight dimension
 * evaluators had no effect on the public result. These tests pin that the
 * evaluators are registered, that they decide item outcomes, and that each one
 * runs once per template rather than once per item.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';

import { ChecklistEngine } from '../src/lib/checklist-engine';
import { BaseDimension } from '../src/lib/dimensions/base-dimension';

const FR001_DIMENSIONS = [
  'Completeness',
  'Clarity',
  'Consistency',
  'Measurability',
  'Scenario Coverage',
  'Edge Cases',
  'Dependencies',
  'Ambiguities',
];

let workDir: string;

function writeSpec(content: string): string {
  const file = path.join(workDir, 'spec.md');
  fs.writeFileSync(file, content, 'utf-8');
  return file;
}

/** A specification with no sections, no keywords and no scenarios. */
const EMPTY_SPEC = 'Nothing useful here.\n';

beforeEach(() => {
  workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'checklist-engine-'));
});

afterEach(() => {
  fs.rmSync(workDir, { recursive: true, force: true });
});

describe('ChecklistEngine dimension dispatch', () => {
  it('registers all eight dimensions from FR-001', () => {
    const registry = (
      new ChecklistEngine() as unknown as { dimensions: Map<string, BaseDimension> }
    ).dimensions;

    expect([...registry.keys()].sort()).toEqual([...FR001_DIMENSIONS].sort());
    for (const dimension of registry.values()) {
      expect(dimension).toBeInstanceOf(BaseDimension);
    }
  });

  it('fails items for a specification with no required content', async () => {
    const engine = new ChecklistEngine();
    const result = await engine.run({
      variant: 'peer-review',
      specPath: writeSpec(EMPTY_SPEC),
      format: 'markdown',
    } as never);

    // The previous behaviour passed every item because the specification had
    // content, which made the evaluators unreachable.
    expect(result.findings.some((finding) => finding.status === 'fail')).toBe(true);
    expect(result.passed).toBe(false);
  });

  it('reports the evaluator failure reason on the failing item', async () => {
    const engine = new ChecklistEngine();
    const result = await engine.run({
      variant: 'peer-review',
      specPath: writeSpec(EMPTY_SPEC),
      format: 'markdown',
    } as never);

    const failing = result.findings.filter((finding) => finding.status === 'fail');
    expect(failing.length).toBeGreaterThan(0);
    // A bare question restated with no reason would be the placeholder message.
    expect(failing[0].message).toMatch(/✗ .+ - \S/);
  });

  it('judges the completeness dimension by the sections the specification has', async () => {
    // The defect this suite guards against is the stub that passed every item
    // for any specification with content. Completeness reports CMP-001 on the
    // six required sections, so a specification that carries them must be
    // judged differently from one that does not.
    const engine = new ChecklistEngine();

    const completenessReason = async (specPath: string): Promise<string> => {
      const result = await engine.run({
        variant: 'peer-review',
        specPath,
        format: 'markdown',
      } as never);
      const findings = result.findings.filter((finding) => finding.dimension === 'Completeness');
      expect(findings.length).toBeGreaterThan(0);
      return findings[0].message;
    };

    const sparse = await completenessReason(writeSpec('Short note.\n'));

    const complete = await completenessReason(
      writeSpec(
        [
          '# Specification',
          '',
          '## Overview',
          'A paragraph of substantive detail long enough to count as real content.',
          '',
          '## User Stories',
          '- As a user I can sign in with an email address and a password.',
          '',
          '## Functional Requirements',
          '- The system shall authenticate the user before granting access.',
          '',
          '## Success Criteria',
          '- A user reaches their dashboard in under two seconds.',
          '',
          '## Assumptions',
          '- The identity provider is already provisioned.',
          '',
          '## Edge Cases',
          '- Empty input is rejected with a clear message.',
        ].join('\n')
      )
    );

    // CMP-001 reports which of the six required sections are absent, so the
    // reason carried on the item must change with the specification's content.
    expect(sparse).toContain('Missing sections');
    expect(complete).not.toContain('Missing sections');
  });

  it('runs each dimension evaluator once per template, not once per item', async () => {
    const engine = new ChecklistEngine();
    const registry = (engine as unknown as { dimensions: Map<string, BaseDimension> }).dimensions;

    const calls = new Map<string, number>();
    for (const [name, dimension] of registry) {
      const original = dimension.evaluate.bind(dimension);
      dimension.evaluate = (spec: never) => {
        calls.set(name, (calls.get(name) ?? 0) + 1);
        return original(spec);
      };
    }

    const specPath = writeSpec(EMPTY_SPEC);
    const template = await (
      engine as unknown as {
        templateLoader: { loadTemplate(v: string): Promise<{ items: unknown[] }> };
      }
    ).templateLoader.loadTemplate('peer-review');

    const itemCount = template.items.length;
    expect(itemCount).toBeGreaterThan(1);

    await engine.run({ variant: 'peer-review', specPath, format: 'markdown' } as never);

    const totalCalls = [...calls.values()].reduce((sum, count) => sum + count, 0);
    // At most one call per distinct dimension in the template, never one per item.
    expect(totalCalls).toBeLessThanOrEqual(
      new Set((template.items as Array<{ dimension: string }>).map((item) => item.dimension)).size
    );
  });

  it('falls back to a content check for a dimension with no evaluator', async () => {
    const engine = new ChecklistEngine();
    const registry = (engine as unknown as { dimensions: Map<string, BaseDimension> }).dimensions;
    registry.delete('Clarity');

    const specPath = writeSpec(EMPTY_SPEC);
    const template = await (
      engine as unknown as {
        templateLoader: { loadTemplate(v: string): Promise<{ items: unknown[] }> };
      }
    ).templateLoader.loadTemplate('peer-review');

    const clarityItems = (template.items as Array<{ dimension: string }>).filter(
      (item) => item.dimension === 'Clarity'
    );
    expect(clarityItems.length).toBeGreaterThan(0);

    const result = await engine.run({
      variant: 'peer-review',
      specPath,
      format: 'markdown',
    } as never);

    // With no evaluator, a non-empty specification still passes these items.
    for (const item of clarityItems) {
      const finding = result.findings.find((entry) => entry.item_id === item.id);
      expect(finding?.status).toBe('pass');
    }
  });
});

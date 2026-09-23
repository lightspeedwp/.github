import path from 'path';
import SkillsRegistryValidator from '../lib/skills-registry-validator.js';

const schemaPath = path.resolve(
  process.cwd(),
  '.github/specs/014-agents-restructure-consolidate/contracts/registry-schema.json'
);

const skill = {
  id: 'agent:test-agent/test-skill',
  name: 'test-skill',
  category: 'agent:test-agent',
  path: 'agents/test-agent/skills/test-skill/SKILL.md',
  description: 'Test skill',
  type: 'unknown',
  version: '1.0.0',
  agentskills_io_compliant: {
    compliant: true,
    checks: {
      hasName: true,
      hasDescription: true,
      hasInputs: false,
      hasOutputs: false,
      hasExamples: false,
    },
  },
};

const registry = {
  timestamp: '2026-09-23T00:00:00.000Z',
  version: '1.0.0',
  schema: 'https://agentskills.io/schema/v1',
  summary: {
    total: 1,
    byCategory: { 'agent:test-agent': 1 },
    compliant: 1,
    compliancePercentage: 100,
  },
  skills: [skill],
};

const categoryRegistry = {
  timestamp: '2026-09-23T00:00:00.000Z',
  version: '1.0.0',
  category: 'agent:test-agent',
  skills: [skill],
  summary: { total: 1, compliant: 1, compliancePercentage: 100 },
};

describe('SkillsRegistryValidator', () => {
  it('validates consolidated and category registries against the declared schema', () => {
    const validator = new SkillsRegistryValidator(schemaPath);

    const result = validator.validateRegistries(registry, {
      'agent:test-agent': categoryRegistry,
    });

    expect(result.consolidated.valid).toBe(true);
    expect(result.categories['agent:test-agent'].valid).toBe(true);
  });

  it('propagates category schema errors into the validation report', () => {
    const validator = new SkillsRegistryValidator(schemaPath);
    const invalidCategoryRegistry = { ...categoryRegistry, summary: undefined };

    const result = validator.validateRegistries(registry, {
      'agent:test-agent': invalidCategoryRegistry,
    });

    expect(result.consolidated.valid).toBe(true);
    expect(result.categories['agent:test-agent'].valid).toBe(false);
    expect(result.categories['agent:test-agent'].errors.length).toBeGreaterThan(0);
  });

  it('propagates consolidated schema errors into the validation report', () => {
    const validator = new SkillsRegistryValidator(schemaPath);
    const invalidRegistry = { ...registry, summary: undefined };

    const result = validator.validateRegistries(invalidRegistry, {
      'agent:test-agent': categoryRegistry,
    });

    expect(result.consolidated.valid).toBe(false);
    expect(result.consolidated.errors.length).toBeGreaterThan(0);
    expect(result.categories['agent:test-agent'].valid).toBe(true);
  });
});

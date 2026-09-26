import path from 'path';
import SkillsRegistryValidator from '../lib/skills-registry-validator.js';

const schemaPath = path.resolve(
  process.cwd(),
  '.github/specs/014-agents-restructure-consolidate/contracts/registry-schema.json'
);

const skill = {
  id: 'test-skill',
  name: 'test-skill',
  category: 'test-category',
  location: 'test-agent',
  description: 'Test skill',
  type: 'utility',
  version: '1.0.0',
  agentskills_compliant: true,
  compliance_violations: [],
  used_by: [],
};

const registry = {
  timestamp: '2026-09-23T00:00:00.000Z',
  version: '1.0.0',
  schema: 'https://agentskills.io/schema/v1',
  summary: {
    total: 1,
    byCategory: { 'test-category': 1 },
    compliant: 1,
    compliancePercentage: 100,
  },
  skills: [skill],
};

const categoryRegistry = {
  timestamp: '2026-09-23T00:00:00.000Z',
  version: '1.0.0',
  category: 'test-category',
  skills: [skill],
  summary: { total: 1, compliant: 1, compliancePercentage: 100 },
};

describe('SkillsRegistryValidator', () => {
  it('validates consolidated and category registries against the declared schema', () => {
    const validator = new SkillsRegistryValidator(schemaPath);

    const result = validator.validateRegistries(registry, {
      'test-category': categoryRegistry,
    });

    expect(result.consolidated.valid).toBe(true);
    expect(result.categories['test-category'].valid).toBe(true);
  });

  it('propagates category schema errors into the validation report', () => {
    const validator = new SkillsRegistryValidator(schemaPath);
    const invalidCategoryRegistry = { ...categoryRegistry, summary: undefined };

    const result = validator.validateRegistries(registry, {
      'test-category': invalidCategoryRegistry,
    });

    expect(result.consolidated.valid).toBe(true);
    expect(result.categories['test-category'].valid).toBe(false);
    expect(result.categories['test-category'].errors.length).toBeGreaterThan(0);
  });

  it('propagates consolidated schema errors into the validation report', () => {
    const validator = new SkillsRegistryValidator(schemaPath);
    const invalidRegistry = { ...registry, summary: undefined };

    const result = validator.validateRegistries(invalidRegistry, {
      'test-category': categoryRegistry,
    });

    expect(result.consolidated.valid).toBe(false);
    expect(result.consolidated.errors.length).toBeGreaterThan(0);
    expect(result.categories['test-category'].valid).toBe(true);
  });

  it('rejects skill ids that are not schema-legal', () => {
    const validator = new SkillsRegistryValidator(schemaPath);
    const invalidRegistry = {
      ...registry,
      skills: [{ ...skill, id: 'github__github', name: 'github__github' }],
    };

    const result = validator.validateRegistries(invalidRegistry, {});

    expect(result.consolidated.valid).toBe(false);
  });
});

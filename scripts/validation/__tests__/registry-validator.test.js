// Regression coverage for #3522: RegistryValidator must evaluate the
// loaded registry schema (via ajv), not just check for truthy fields.
const fs = require('fs');
const os = require('os');
const path = require('path');

// Resolve the schema from this file, not process.cwd(), so the
// schema-backed tests exercise ajv wherever Jest is started.
const REPO_ROOT = path.resolve(__dirname, '../../..');

async function schemaValidator() {
  const RegistryValidator = await loadValidator();
  const validator = new RegistryValidator({ rootDir: REPO_ROOT });
  expect(validator.validateFn).not.toBeNull();
  return validator;
}
async function loadValidator() {
  const { RegistryValidator } = await import('../lib/registry-validator.js');
  return RegistryValidator;
}

const VALID_AGENT = {
  id: 'test-agent',
  name: 'Test Agent',
  version: '1.0.0',
  folder_path: 'agents/test-agent',
  status: 'active',
};

// `combinedRegistry` references legacySkill, which carries fewer required
// fields than the `generatedSkill` used by the split registries. Both shapes
// are valid, so each fixture matches the branch that accepts it.
const LEGACY_SKILL = {
  id: 'test-skill',
  name: 'Test Skill',
  version: '1.0.0',
  location: 'test-skill',
  category: 'testing',
};

const GENERATED_SKILL = {
  ...LEGACY_SKILL,
  description: 'A skill used to exercise registry validation.',
  type: 'utility',
  agentskills_compliant: true,
  compliance_violations: [],
  used_by: [],
};

const VALID_REGISTRY = {
  agents: [VALID_AGENT],
  skills: [LEGACY_SKILL],
};

describe('RegistryValidator schema evaluation (#3522)', () => {
  test('rejects an empty skill item that matches no schema branch', async () => {
    const validator = await schemaValidator();

    const result = validator.validateObject({ agents: [], skills: [{}] }, 'fixture');

    expect(result.valid).toBe(false);
    expect(result.errors.join('\n')).toMatch(/Schema: \/skills\/0 must have required property/);
  });

  test('keeps the entry and timestamp checks on the schema path', async () => {
    const validator = await schemaValidator();

    const result = validator.validateObject(
      { ...VALID_REGISTRY, entries: [{}], generatedAt: 'invalid' },
      'fixture'
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        'Entry 0: id is required',
        'Entry 0: name is required',
        'generatedAt must be valid ISO 8601 timestamp',
      ])
    );
  });

  test('accepts a well-formed consolidated registry', async () => {
    const validator = await schemaValidator();

    const result = validator.validateObject(VALID_REGISTRY, 'fixture');

    expect(result).toEqual({ valid: true, errors: [], path: 'fixture' });
  });

  test('rejects a non-object registry', async () => {
    const validator = await schemaValidator();

    expect(validator.validateObject(null, 'fixture').valid).toBe(false);
    expect(validator.validateObject('nope', 'fixture').valid).toBe(false);
  });

  test('falls back to structural validation when the schema file is absent', async () => {
    const RegistryValidator = await loadValidator();
    const validator = new RegistryValidator({
      rootDir: '/tmp',
      schemaPath: 'does-not-exist-3522.json',
    });

    expect(validator.schema).toBeNull();
    expect(validator.validateFn).toBeNull();
    expect(validator.validateObject({ skills: [{}] }, 'fixture').valid).toBe(true);
    expect(validator.validateObject({}, 'fixture').valid).toBe(false);
  });

  // Split registries are separate oneOf branches, so they must not be
  // rejected for omitting the unrelated collection. See #3522.
  test.each([
    [
      'consolidated skills registry',
      {
        timestamp: '2026-01-01T00:00:00.000Z',
        version: '1.0.0',
        schema: 'https://agentskills.io/schema/v1',
        summary: { total: 1, byCategory: { testing: 1 }, compliant: 1, compliancePercentage: 100 },
        skills: [GENERATED_SKILL],
      },
    ],
    [
      'per-category skills registry',
      {
        timestamp: '2026-01-01T00:00:00.000Z',
        version: '1.0.0',
        category: 'testing',
        summary: { total: 1, compliant: 1, compliancePercentage: 100 },
        skills: [GENERATED_SKILL],
      },
    ],
  ])('accepts a %s that omits agents', async (_label, registry) => {
    const validator = await schemaValidator();

    const result = validator.validateObject(registry, 'fixture');

    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
  });

  // The schema has no agents-only branch, so an agents registry without a
  // `skills` key is correctly rejected. Documented rather than worked around.
  test('rejects an agents-only registry, which no schema branch describes', async () => {
    const validator = await schemaValidator();

    const result = validator.validateObject({ agents: [VALID_AGENT] }, 'fixture');

    expect(result.valid).toBe(false);
    expect(result.errors.join('\n')).toMatch(/required property 'skills'/);
  });

  // A present-but-uncompilable schema must fail closed, not degrade to the
  // permissive structural path that #3522 exists to replace.
  test('reports invalid when the schema exists but cannot be compiled', async () => {
    const RegistryValidator = await loadValidator();
    const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'registry-schema-'));
    const schemaPath = 'broken-schema.json';
    fs.writeFileSync(
      path.join(rootDir, schemaPath),
      JSON.stringify({ type: 'object', properties: { a: { $ref: '#/$defs/missing' } }, $defs: {} })
    );

    try {
      const validator = new RegistryValidator({ rootDir, schemaPath });

      expect(validator.schema).not.toBeNull();
      expect(validator.validateFn).toBeNull();
      expect(validator.schemaError).toEqual(expect.any(String));

      // The permissive fallback would accept this malformed registry.
      const result = validator.validateObject({ skills: [{}] }, 'fixture');

      expect(result.valid).toBe(false);
      expect(result.errors.join('\n')).toMatch(/schema could not be compiled/i);
    } finally {
      fs.rmSync(rootDir, { recursive: true, force: true });
    }
  });
});

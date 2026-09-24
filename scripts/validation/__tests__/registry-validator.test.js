// Regression coverage for #3522: RegistryValidator must evaluate the
// loaded registry schema (via ajv), not just check for truthy fields.
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

const VALID_REGISTRY = {
  agents: [
    {
      id: 'test-agent',
      name: 'Test Agent',
      version: '1.0.0',
      folder_path: 'agents/test-agent',
      status: 'active',
    },
  ],
  skills: [
    {
      id: 'test-skill',
      name: 'Test Skill',
      version: '1.0.0',
      location: 'test-skill',
      category: 'testing',
    },
  ],
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
});

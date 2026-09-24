// Regression coverage for #3522: RegistryValidator must evaluate the
// loaded registry schema (via ajv), not just check for truthy fields.
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
  test('rejects {"skills":[{}]} that matches no schema branch', async () => {
    const RegistryValidator = await loadValidator();
    const validator = new RegistryValidator();

    const result = validator.validateObject({ skills: [{}] }, 'fixture');

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.join('\n')).toMatch(/required property/);
  });

  test('accepts a well-formed consolidated registry', async () => {
    const RegistryValidator = await loadValidator();
    const validator = new RegistryValidator();

    const result = validator.validateObject(VALID_REGISTRY, 'fixture');

    expect(result).toEqual({ valid: true, errors: [], path: 'fixture' });
  });

  test('rejects a non-object registry', async () => {
    const RegistryValidator = await loadValidator();
    const validator = new RegistryValidator();

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

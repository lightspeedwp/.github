const fs = require('node:fs');
const path = require('node:path');

const { buildValidator, configPath, readConfig } = require('../validate-mergify-config.cjs');

const repositoryRoot = path.resolve(__dirname, '../../..');

// Deliberately not committed: the published schema is ~176 kB, and vendoring it
// is a repository-footprint decision that belongs to a maintainer rather than to
// this change. `npm run validate:mergify` performs the same validation against
// the live schema and prints the result; drop a copy of it at this path to have
// this suite assert the same thing offline.
const schemaPath = path.join(repositoryRoot, 'tests/fixtures/mergify-configuration-schema.json');
const schemaExists = fs.existsSync(schemaPath);

// Read lazily inside the tests: `describe.skip` still evaluates its callback, so
// reading the fixture at describe-body scope would throw when it is absent.
function loadSchema() {
  return JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
}

describe('validate-mergify-config', () => {
  test('points at the repository configuration', () => {
    expect(configPath).toBe(path.join(repositoryRoot, '.github/mergify.yml'));
  });

  test('reads .github/mergify.yml as an object', () => {
    const config = readConfig();

    expect(typeof config).toBe('object');
    expect(config).not.toBeNull();
  });
});

(schemaExists ? describe : describe.skip)('mergify.yml against the published schema', () => {
  test('the fixture is the Mergify schema', () => {
    expect(loadSchema().properties).toHaveProperty('pull_request_rules');
  });

  test('the configuration validates', () => {
    const validate = buildValidator(loadSchema());
    const valid = validate(readConfig());

    if (!valid) {
      // Printed so a failure names the offending path rather than only
      // reporting that something is wrong somewhere.
      console.error(JSON.stringify(validate.errors, null, 2));
    }
    expect(valid).toBe(true);
  });

  // The evidence behind removing the rule rather than reconfiguring it. If a
  // future schema revision adds an option that changes how a failed update is
  // reported, this is the test to revisit.
  test('the update action still accepts no reporting option', () => {
    const validate = buildValidator(loadSchema());
    const probe = {
      pull_request_rules: [
        {
          name: 'probe',
          conditions: ['base=develop'],
          actions: { update: { method: 'rebase' } },
        },
      ],
    };
    const valid = validate(probe);

    expect(valid).toBe(false);
    expect(validate.errors.some((error) => error.keyword === 'additionalProperties')).toBe(true);
  });
});

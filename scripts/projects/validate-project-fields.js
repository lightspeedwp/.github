#!/usr/bin/env node
/**
 * Validate .github/automation/project-fields.yml against the JSON schema.
 *
 * @author LightSpeed
 * @requires js-yaml, ajv
 */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Ajv = require('ajv');

const SCHEMA_PATH = path.resolve('schemas/automation/project-fields.schema.json');
const FIELDS_PATH = path.resolve('.github/automation/project-fields.yml');

try {
  const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
  const fields = yaml.load(fs.readFileSync(FIELDS_PATH, 'utf8'));
  const ajv = new Ajv({ allErrors: true, strict: true });
  const validate = ajv.compile(schema);
  const ok = validate(fields);

  if (!ok) {
    console.error('❌ Validation errors:\n', validate.errors);
    process.exit(1);
  }
  console.log('✅ project-fields.yml is valid.');
} catch (e) {
  console.error('❌ Validation failed:', e.message);
  process.exit(1);
}

// scripts/projects/validate-project-fields.js
const fs = require('fs');
const yaml = require('js-yaml');
const Ajv = require('ajv');
const schema = require('../..../.github/automation/schemas/project-fields.schema.json');  // adjust path as needed

try {
  const data = yaml.load(fs.readFileSync('.github/automation/project-fields.yml', 'utf8'));
  const ajv = new Ajv({allErrors: true});
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    console.error('Project fields YAML validation failed:');
    console.error(validate.errors);
    process.exit(1);
  } else {
    console.log('Project fields YAML is valid ✅');
  }
} catch (err) {
  console.error('Error reading or validating project-fields.yml:', err);
  process.exit(1);
}

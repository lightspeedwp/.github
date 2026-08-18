const fs = require('fs');
const path = require('path');

/**
 * Validates frontmatter of a markdown file against a schema.
 * @param {string} filePath - Path to the markdown file
 * @param {object} schema - JSON schema to validate against
 * @returns {object} Validation result with errors and warnings
 */
function validateFrontmatter(filePath, schema) {
  if (!fs.existsSync(filePath)) {
    return {
      valid: false,
      errors: [`File not found: ${filePath}`],
      warnings: [],
      frontmatter: null,
    };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) {
    return {
      valid: false,
      errors: ['No frontmatter found'],
      warnings: [],
      frontmatter: null,
    };
  }

  try {
    const yaml = require('js-yaml');
    const frontmatter = yaml.load(frontmatterMatch[1]) || {};

    const errors = [];
    const warnings = [];

    // Basic validation against schema
    if (schema.required && Array.isArray(schema.required)) {
      for (const field of schema.required) {
        if (!frontmatter[field]) {
          errors.push(`Missing required field: ${field}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      frontmatter,
    };
  } catch (err) {
    return {
      valid: false,
      errors: [`YAML parsing error: ${err.message}`],
      warnings: [],
      frontmatter: null,
    };
  }
}

/**
 * CLI interface for frontmatter validation skill.
 */
async function run(options = {}) {
  const { filePath, schemaPath } = options;

  if (!filePath) {
    throw new Error('filePath is required');
  }

  const schema = schemaPath ? JSON.parse(fs.readFileSync(schemaPath, 'utf8')) : {};
  const result = validateFrontmatter(filePath, schema);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    if (result.valid) {
      console.log(`✓ Valid frontmatter: ${filePath}`);
    } else {
      console.log(`✗ Invalid frontmatter: ${filePath}`);
      result.errors.forEach(err => console.log(`  - ${err}`));
    }
  }

  return result;
}

module.exports = { validateFrontmatter, run };

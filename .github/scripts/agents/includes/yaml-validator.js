#!/usr/bin/env node
/**
 * ============================================================================
 * Script Name: yaml-validator.js
 * Location: includes/yaml-validator.js
 * Description: YAML schema validation for labeling configuration files
 * Version: v1.0.0
 * Author: LightSpeed WP Team
 * License: GPL v3 or later
 * ============================================================================
 */
// TODO: Align this helper with the latest automation spec updates.

const fs = require("fs");
const yaml = require("js-yaml");
const core = require("@actions/core");

/**
 * Schema for labels.yml validation
 */
const LABELS_SCHEMA = {
  type: "array",
  items: {
    oneOf: [
      { type: "string" }, // Simple string label
      {
        // Label object
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 1 },
          color: {
            type: "string",
            pattern: "^[0-9A-Fa-f]{6}$",
          },
          description: { type: "string" },
          aliases: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    ],
  },
};

/**
 * Schema for issue-types.yml validation
 */
const ISSUE_TYPES_SCHEMA = {
  type: "object",
  required: ["issue_types"],
  properties: {
    issue_types: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "label"],
        properties: {
          name: { type: "string", minLength: 1 },
          label: { type: "string", minLength: 1 },
          color: {
            type: "string",
            pattern: "^[0-9A-Fa-f]{6}$",
          },
        },
      },
    },
  },
};

/**
 * Schema for labeler.yml validation
 */
const LABELER_SCHEMA = {
  type: "object",
  patternProperties: {
    "^[a-zA-Z0-9:_-]+$": {
      // Label name pattern
      type: "object",
      properties: {
        "head-branch": {
          type: "array",
          items: { type: "string" },
        },
        "changed-files": {
          type: "object",
          properties: {
            "any-glob-to-any-file": {
              type: "array",
              items: { type: "string" },
            },
            "all-globs-to-all-files": {
              type: "array",
              items: { type: "string" },
            },
            "any-glob-to-all-files": {
              type: "array",
              items: { type: "string" },
            },
          },
        },
      },
    },
  },
};

/**
 * Validates data against a schema (basic validation)
 * @param {*} data - Data to validate
 * @param {Object} schema - Schema object
 * @param {string} path - Current path for error messages
 * @returns {Array<string>} Array of validation errors
 */
function validateSchema(data, schema, path = "root") {
  const errors = [];

  // Type validation
  if (schema.type) {
    const actualType = Array.isArray(data) ? "array" : typeof data;
    if (actualType !== schema.type) {
      errors.push(
        `${path}: Expected type '${schema.type}', got '${actualType}'`,
      );
      return errors; // Stop further validation if type is wrong
    }
  }

  // Array validation
  if (schema.type === "array" && schema.items) {
    if (!Array.isArray(data)) {
      errors.push(`${path}: Expected array`);
      return errors;
    }

    data.forEach((item, index) => {
      if (schema.items.oneOf) {
        // Try each schema in oneOf
        let valid = false;
        for (const subSchema of schema.items.oneOf) {
          const subErrors = validateSchema(
            item,
            subSchema,
            `${path}[${index}]`,
          );
          if (subErrors.length === 0) {
            valid = true;
            break;
          }
        }
        if (!valid) {
          errors.push(
            `${path}[${index}]: Item doesn't match any allowed schema`,
          );
        }
      } else {
        const itemErrors = validateSchema(
          item,
          schema.items,
          `${path}[${index}]`,
        );
        errors.push(...itemErrors);
      }
    });
  }

  // Object validation
  if (schema.type === "object") {
    if (typeof data !== "object" || data === null) {
      errors.push(`${path}: Expected object`);
      return errors;
    }

    // Required properties
    if (schema.required) {
      for (const required of schema.required) {
        if (!(required in data)) {
          errors.push(`${path}: Missing required property '${required}'`);
        }
      }
    }

    // Property validation
    if (schema.properties) {
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        if (key in data) {
          const propErrors = validateSchema(
            data[key],
            propSchema,
            `${path}.${key}`,
          );
          errors.push(...propErrors);
        }
      }
    }

    // Pattern properties (for dynamic keys)
    if (schema.patternProperties) {
      for (const key of Object.keys(data)) {
        for (const [pattern, propSchema] of Object.entries(
          schema.patternProperties,
        )) {
          if (new RegExp(pattern).test(key)) {
            const propErrors = validateSchema(
              data[key],
              propSchema,
              `${path}.${key}`,
            );
            errors.push(...propErrors);
          }
        }
      }
    }
  }

  // String validation
  if (schema.type === "string") {
    if (typeof data !== "string") {
      errors.push(`${path}: Expected string`);
      return errors;
    }

    if (schema.minLength && data.length < schema.minLength) {
      errors.push(
        `${path}: String length ${data.length} is less than minimum ${schema.minLength}`,
      );
    }

    if (schema.pattern && !new RegExp(schema.pattern).test(data)) {
      errors.push(
        `${path}: String '${data}' doesn't match pattern ${schema.pattern}`,
      );
    }
  }

  return errors;
}

/**
 * Validates labels.yml file
 * @param {string} filePath - Path to labels.yml
 * @returns {Object} Validation result {valid: boolean, errors: string[]}
 */
function validateLabelsYml(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(content);
    const errors = validateSchema(data, LABELS_SCHEMA, "labels.yml");

    if (errors.length === 0) {
      core.info(
        `[yaml-validator] ✅ labels.yml is valid (${data.length} labels)`,
      );
      return { valid: true, errors: [] };
    }

    core.error(
      `[yaml-validator] ❌ labels.yml validation failed with ${errors.length} error(s):`,
    );
    errors.forEach((error) => core.error(`  - ${error}`));

    return { valid: false, errors };
  } catch (error) {
    const errorMsg = `Failed to validate labels.yml: ${error.message}`;
    core.error(`[yaml-validator] ${errorMsg}`);
    return { valid: false, errors: [errorMsg] };
  }
}

/**
 * Validates issue-types.yml file
 * @param {string} filePath - Path to issue-types.yml
 * @returns {Object} Validation result {valid: boolean, errors: string[]}
 */
function validateIssueTypesYml(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(content);
    const errors = validateSchema(data, ISSUE_TYPES_SCHEMA, "issue-types.yml");

    if (errors.length === 0) {
      core.info(
        `[yaml-validator] ✅ issue-types.yml is valid (${data.issue_types.length} types)`,
      );
      return { valid: true, errors: [] };
    }

    core.error(
      `[yaml-validator] ❌ issue-types.yml validation failed with ${errors.length} error(s):`,
    );
    errors.forEach((error) => core.error(`  - ${error}`));

    return { valid: false, errors };
  } catch (error) {
    const errorMsg = `Failed to validate issue-types.yml: ${error.message}`;
    core.error(`[yaml-validator] ${errorMsg}`);
    return { valid: false, errors: [errorMsg] };
  }
}

/**
 * Validates labeler.yml file
 * @param {string} filePath - Path to labeler.yml
 * @returns {Object} Validation result {valid: boolean, errors: string[]}
 */
function validateLabelerYml(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(content);
    const errors = validateSchema(data, LABELER_SCHEMA, "labeler.yml");

    if (errors.length === 0) {
      const labelCount = Object.keys(data).length;
      core.info(
        `[yaml-validator] ✅ labeler.yml is valid (${labelCount} label rules)`,
      );
      return { valid: true, errors: [] };
    }

    core.error(
      `[yaml-validator] ❌ labeler.yml validation failed with ${errors.length} error(s):`,
    );
    errors.forEach((error) => core.error(`  - ${error}`));

    return { valid: false, errors };
  } catch (error) {
    const errorMsg = `Failed to validate labeler.yml: ${error.message}`;
    core.error(`[yaml-validator] ${errorMsg}`);
    return { valid: false, errors: [errorMsg] };
  }
}

/**
 * Validates all labeling configuration files
 * @param {Object} config - Configuration object
 * @param {string} config.labelsPath - Path to labels.yml
 * @param {string} config.issueTypesPath - Path to issue-types.yml
 * @param {string} config.labelerPath - Path to labeler.yml
 * @returns {Object} Validation result {valid: boolean, results: Object}
 */
function validateAllConfigs(config) {
  const results = {
    labels: validateLabelsYml(config.labelsPath),
    issueTypes: validateIssueTypesYml(config.issueTypesPath),
    labeler: validateLabelerYml(config.labelerPath),
  };

  const allValid =
    results.labels.valid && results.issueTypes.valid && results.labeler.valid;

  if (allValid) {
    core.info("[yaml-validator] ✅ All configuration files are valid");
  } else {
    core.error(
      "[yaml-validator] ❌ Some configuration files have validation errors",
    );
  }

  return { valid: allValid, results };
}

module.exports = {
  validateLabelsYml,
  validateIssueTypesYml,
  validateLabelerYml,
  validateAllConfigs,
  validateSchema,
  LABELS_SCHEMA,
  ISSUE_TYPES_SCHEMA,
  LABELER_SCHEMA,
};

/**
 * Registry Schema Validation (T014)
 * Validates registry files against JSON schema contracts
 * Per contracts/registry-schema.json
 */

import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

export class RegistryValidator {
  constructor(options = {}) {
    this.rootDir = options.rootDir || process.cwd();
    this.schemaPath =
      options.schemaPath ||
      '.github/specs/014-agents-restructure-consolidate/contracts/registry-schema.json';
    this.schema = this.loadSchema();
    this.validateFn = this.compileSchema();
  }

  /**
   * Load JSON schema
   */
  loadSchema() {
    const schemaFile = path.join(this.rootDir, this.schemaPath);
    if (!fs.existsSync(schemaFile)) {
      console.warn(`Schema not found at ${schemaFile}, using minimal validation`);
      return null;
    }
    return JSON.parse(fs.readFileSync(schemaFile, 'utf-8'));
  }

  /**
   * Compile the loaded schema with ajv (same convention as
   * validate-agents.js). Returns null when no schema was loaded so
   * callers fall back to minimal structural validation.
   */
  compileSchema() {
    if (!this.schema) {
      return null;
    }
    try {
      this.ajv = new Ajv({ allErrors: true, strict: false });
      addFormats(this.ajv);
      return this.ajv.compile(this.schema);
    } catch (error) {
      console.warn(`Could not compile registry schema: ${error.message}`);
      return null;
    }
  }
  /**
   * Validate registry file structure
   */
  validateRegistry(registryPath) {
    const fullPath = path.join(this.rootDir, registryPath);

    if (!fs.existsSync(fullPath)) {
      return {
        valid: false,
        errors: [`Registry file not found: ${registryPath}`],
      };
    }

    try {
      const registry = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
      return this.validateObject(registry, registryPath);
    } catch (error) {
      return {
        valid: false,
        errors: [`Invalid JSON: ${error.message}`],
      };
    }
  }

  /**
   * Validate object against schema
   */
  validateObject(obj, path) {
    const errors = [];

    // Basic structural validation
    if (!obj || typeof obj !== 'object') {
      return {
        valid: false,
        errors: ['Registry must be an object'],
      };
    }

    // Evaluate the loaded JSON schema when available (#3522). Without a
    // compiled schema, fall through to minimal structural validation.
    if (this.validateFn) {
      const schemaValid = this.validateFn(obj);
      if (!schemaValid) {
        for (const err of this.validateFn.errors || []) {
          errors.push(`Schema: ${err.instancePath || '/'} ${err.message}`);
        }
      }
      return {
        valid: errors.length === 0,
        errors,
        path,
      };
    }
    // Check for required fields (will be expanded per schema)
    if (!Array.isArray(obj.entries) && !obj.agents && !obj.skills) {
      errors.push('Registry must contain entries, agents, or skills field');
    }

    // Validate entries if present
    if (Array.isArray(obj.entries)) {
      for (let i = 0; i < obj.entries.length; i++) {
        const entry = obj.entries[i];
        const entryErrors = this.validateEntry(entry, i);
        errors.push(...entryErrors);
      }
    }

    // Validate timestamp
    if (obj.generatedAt && !this.isValidISO8601(obj.generatedAt)) {
      errors.push('generatedAt must be valid ISO 8601 timestamp');
    }

    return {
      valid: errors.length === 0,
      errors,
      path,
    };
  }

  /**
   * Validate individual registry entry
   */
  validateEntry(entry, index) {
    const errors = [];

    if (!entry.id) {
      errors.push(`Entry ${index}: id is required`);
    }

    if (!entry.name) {
      errors.push(`Entry ${index}: name is required`);
    }

    if (entry.type && !['agent', 'skill'].includes(entry.type)) {
      errors.push(`Entry ${index}: type must be 'agent' or 'skill'`);
    }

    return errors;
  }

  /**
   * Check if string is valid ISO 8601 timestamp
   */
  isValidISO8601(str) {
    return !Number.isNaN(new Date(str).getTime());
  }

  /**
   * Validate all registries in a directory
   */
  validateAllRegistries(registryDir) {
    const results = [];

    if (!fs.existsSync(registryDir)) {
      return results;
    }

    const files = fs.readdirSync(registryDir).filter((f) => f.endsWith('.json'));
    for (const file of files) {
      const registryPath = path.join(registryDir, file);
      const result = this.validateRegistry(registryPath);
      results.push({
        file,
        ...result,
      });
    }

    return results;
  }
}

export default RegistryValidator;

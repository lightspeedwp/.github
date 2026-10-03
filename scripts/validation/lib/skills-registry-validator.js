import fs from 'fs';
import Ajv from 'ajv';

class SkillsRegistryValidator {
  constructor(schemaPath) {
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
    const ajv = new Ajv({ allErrors: true, strict: false });
    this.validateSchema = ajv.compile(schema);
  }

  validateDocument(document) {
    const valid = this.validateSchema(document);
    const errors = valid
      ? []
      : (this.validateSchema.errors || []).map((error) => {
          const location = error.instancePath || '/';
          return `${location} ${error.message}`;
        });

    // The data model requires a unique skill identifier. A schema cannot say
    // that, so repeated ids are rejected here: an id that names several skills
    // makes the registry ambiguous.
    errors.push(...this.duplicateIdErrors(document));

    return { valid: Boolean(valid) && errors.length === 0, errors };
  }

  /**
   * Errors for skill ids that appear more than once in a registry document.
   * @param {{ skills?: { id?: string, location?: string }[] }} document
   * @returns {string[]}
   */
  duplicateIdErrors(document) {
    if (!document || !Array.isArray(document.skills)) return [];

    const locations = new Map();
    for (const skill of document.skills) {
      if (!skill || typeof skill.id !== 'string') continue;
      if (!locations.has(skill.id)) locations.set(skill.id, []);
      locations.get(skill.id).push(skill.location ?? 'unknown');
    }

    return [...locations.entries()]
      .filter(([, where]) => where.length > 1)
      .map(([id, where]) => `/skills duplicate skill id "${id}" (${where.join(', ')})`);
  }

  validateRegistries(registry, categoryRegistries) {
    const consolidatedResult = this.validateDocument(registry);
    const validation = {
      consolidated: {
        ...consolidatedResult,
        warnings: [],
      },
      categories: {},
    };

    for (const [category, categoryRegistry] of Object.entries(categoryRegistries)) {
      const categoryResult = this.validateDocument(categoryRegistry);
      validation.categories[category] = {
        ...categoryResult,
        skills: Array.isArray(categoryRegistry.skills) ? categoryRegistry.skills.length : 0,
        compliant: categoryRegistry.summary?.compliant ?? 0,
        compliancePercentage: categoryRegistry.summary?.compliancePercentage ?? 0,
      };
    }

    return validation;
  }
}

export default SkillsRegistryValidator;

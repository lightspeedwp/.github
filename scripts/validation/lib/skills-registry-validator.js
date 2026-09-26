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

    return { valid: Boolean(valid), errors };
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

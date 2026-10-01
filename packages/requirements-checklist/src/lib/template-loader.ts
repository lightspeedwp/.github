import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import { ChecklistTemplate } from './types';

/**
 * Load and validate checklist templates
 */
export class TemplateLoader {
  private templatesDir: string;
  private templateCache: Map<string, ChecklistTemplate> = new Map();

  /**
   * Create a loader for a template directory.
   *
   * @param templatesDir - Directory containing variant-named YAML files; defaults to the bundled templates.
   */
  constructor(templatesDir?: string) {
    this.templatesDir = templatesDir || path.join(__dirname, 'templates');
  }

  /**
   * Load, validate, and cache a checklist template by variant name.
   *
   * @returns The cached template, or the parsed template on its first load.
   * @throws {Error} If the template is missing, malformed, or lacks required fields.
   */
  async loadTemplate(variant: string): Promise<ChecklistTemplate> {
    // Check cache first
    if (this.templateCache.has(variant)) {
      return this.templateCache.get(variant)!;
    }

    const templatePath = path.join(this.templatesDir, `${variant}.yaml`);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${variant}`);
    }

    const content = fs.readFileSync(templatePath, 'utf-8');
    const template = this.parseTemplate(content, variant);

    // Validate template
    this.validateTemplate(template);

    // Cache for future use
    this.templateCache.set(variant, template);

    return template;
  }

  /**
   * Parse YAML content and apply defaults for omitted template fields.
   *
   * @param variant - Identifier used for the template ID and fallback name.
   * @throws {Error} If the content is not valid YAML.
   */
  private parseTemplate(content: string, variant: string): ChecklistTemplate {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsed = yaml.parse(content) as any;

    const template: ChecklistTemplate = {
      id: variant,
      name: (parsed.name as ChecklistTemplate['name']) || this.normalizeVariant(variant),
      audience: (parsed.audience as string) || '',
      time_estimate_minutes: (parsed.time_estimate_minutes as number) || 30,
      description: (parsed.description as string) || '',
      items: this.parseItems(parsed.items as unknown[]),
    };

    return template;
  }

  /**
   * Normalize parsed checklist items, applying defaults to omitted fields.
   *
   * @returns An empty array when the parsed value is not an array.
   */
  private parseItems(items: unknown[]): ChecklistTemplate['items'] {
    if (!Array.isArray(items)) {
      return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return items.map((item: any, index: number) => ({
      id: item.id || `ITEM-${index + 1}`,
      dimension: item.dimension || 'Completeness',
      question: item.question || '',
      description: item.description,
      audience: item.audience || ['author', 'peer', 'stakeholder', 'integration'],
      pass_criteria: item.pass_criteria || '',
      suggestion: item.suggestion,
      reference_examples: item.reference_examples,
    }));
  }

  /**
   * Require a template name, at least one item, and each item's ID, dimension, and question.
   *
   * @throws {Error} If any required value is missing.
   */
  private validateTemplate(template: ChecklistTemplate): void {
    if (!template.name) {
      throw new Error('Template must have a name');
    }

    if (!template.items || template.items.length === 0) {
      throw new Error('Template must have at least one item');
    }

    // Verify all items have required fields
    for (const item of template.items) {
      if (!item.id) {
        throw new Error('All items must have an id');
      }
      if (!item.dimension) {
        throw new Error(`Item ${item.id} must have a dimension`);
      }
      if (!item.question) {
        throw new Error(`Item ${item.id} must have a question`);
      }
    }
  }

  /**
   * Convert a variant identifier to a supported template name.
   *
   * @returns The matching name, or `author-pre-review` for an unknown identifier.
   */
  private normalizeVariant(variant: string): ChecklistTemplate['name'] {
    const mapping: Record<string, ChecklistTemplate['name']> = {
      'author-pre-review': 'author-pre-review',
      'peer-review': 'peer-review',
      'stakeholder-gate': 'stakeholder-gate',
      'cross-project-integration': 'cross-project-integration',
    };
    return mapping[variant] || ('author-pre-review' as const);
  }

  /**
   * Clear template cache
   */
  clearCache(): void {
    this.templateCache.clear();
  }
}

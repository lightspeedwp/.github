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

  constructor(templatesDir?: string) {
    this.templatesDir = templatesDir || path.join(__dirname, 'templates');
  }

  /**
   * Load a checklist template by variant name
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
   * Parse YAML template into ChecklistTemplate
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
   * Parse checklist items from template
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
   * Validate template structure
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
   * Normalize variant name to ChecklistTemplate name
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

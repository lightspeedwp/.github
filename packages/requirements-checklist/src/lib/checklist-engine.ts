import {
  ChecklistOptions,
  ChecklistResult,
  ChecklistTemplate,
  Finding,
  ParsedSpecification,
  SpecificationReference,
} from './types';
import { SpecParser } from './utils/spec-parser';
import {
  calculateDimensionScore,
  calculateOverallScore,
  isDimensionPassing,
} from './utils/scoring';
import { ResultFormatter } from './utils/result-formatter';
import { TemplateLoader } from './template-loader';
import { BaseDimension } from './dimensions/base-dimension';

/**
 * Core validation engine for the requirements checklist framework
 * Loads template → parses spec → evaluates items → aggregates scores → generates findings
 */
export class ChecklistEngine {
  private templateLoader: TemplateLoader;
  private dimensions: Map<string, BaseDimension> = new Map();

  /**
   * Create an engine with the default template loader and dimension registry.
   */
  constructor() {
    this.templateLoader = new TemplateLoader();
    this.initializeDimensions();
  }

  /**
   * Provide the initialization hook for dimension evaluators.
   *
   * The current implementation leaves the registry empty.
   */
  private initializeDimensions(): void {
    // Dimensions will be lazily loaded when needed
  }

  /**
   * Evaluate a specification with the selected checklist template.
   *
   * @param options - Template selection, specification path, and optional result metadata.
   * @returns Scores and findings for every item in the selected template.
   * @throws {Error} If the template or specification cannot be read or parsed.
   */
  async run(options: ChecklistOptions): Promise<ChecklistResult> {
    const startTime = Date.now();

    // Load checklist template
    const template = await this.templateLoader.loadTemplate(options.variant);

    // Parse specification
    const spec = SpecParser.parse(options.specPath, options.format);

    // Create specification reference
    const specReference: SpecificationReference = {
      path: options.specPath,
      format: (options.format as 'markdown' | 'yaml' | 'json') || 'markdown',
      author: options.author,
      version: options.version,
    };

    // Evaluate all items
    const findings = await this.evaluateTemplate(template, spec);

    // Aggregate findings by dimension
    const findingsByDimension = this.groupFindingsByDimension(findings);

    // Calculate dimension scores
    const dimensionScores = this.calculateDimensionScores(findingsByDimension);

    // Create result
    const result: ChecklistResult = {
      overall_score: calculateOverallScore(dimensionScores),
      dimension_scores: dimensionScores,
      dimension_status: this.calculateDimensionStatus(dimensionScores),
      findings,
      findings_by_dimension: findingsByDimension,
      completion_time_ms: Date.now() - startTime,
      generated_at: new Date().toISOString(),
      spec_reference: specReference,
    };

    return result;
  }

  /**
   * Create one finding per template item from the specification content check.
   *
   * @returns Findings in the same order as the template items.
   */
  private async evaluateTemplate(
    template: ChecklistTemplate,
    spec: ParsedSpecification
  ): Promise<Finding[]> {
    const findings: Finding[] = [];

    for (const item of template.items) {
      // For now, simple rule-based evaluation
      // In full implementation, this would call dimension-specific evaluators
      const passed = this.evaluateItem(item, spec);

      findings.push({
        item_id: item.id,
        dimension: item.dimension,
        status: passed ? 'pass' : 'fail',
        message: passed
          ? `✓ ${item.question}`
          : `✗ ${item.question} - ${item.description || 'Item failed'}`,
        suggestion: !passed ? item.suggestion : undefined,
      });
    }

    return findings;
  }

  /**
   * Report whether the specification contains non-whitespace content.
   *
   * @param item - The checklist item reserved for future item-specific evaluation.
   */
  private evaluateItem(item: ChecklistTemplate['items'][0], spec: ParsedSpecification): boolean {
    // This is a placeholder - in the full implementation,
    // each dimension would have its own evaluation logic
    // For now, assume items pass if spec has content
    return (spec.raw_content || '').trim().length > 0;
  }

  /**
   * Group findings by dimension for analysis
   */
  private groupFindingsByDimension(findings: Finding[]): Record<string, Finding[]> {
    const grouped: Record<string, Finding[]> = {};

    for (const finding of findings) {
      if (!grouped[finding.dimension]) {
        grouped[finding.dimension] = [];
      }
      grouped[finding.dimension].push(finding);
    }

    return grouped;
  }

  /**
   * Calculate dimension scores from findings
   */
  private calculateDimensionScores(
    findingsByDimension: Record<string, Finding[]>
  ): Record<string, number> {
    const scores: Record<string, number> = {};

    for (const [dimension, findings] of Object.entries(findingsByDimension)) {
      const passed = findings.filter((f) => f.status === 'pass').length;
      const total = findings.length;
      scores[dimension] = calculateDimensionScore(passed, total);
    }

    return scores;
  }

  /**
   * Calculate pass/fail status for each dimension
   */
  private calculateDimensionStatus(
    dimensionScores: Record<string, number>
  ): Record<string, 'pass' | 'fail'> {
    const status: Record<string, 'pass' | 'fail'> = {};

    for (const [dimension, score] of Object.entries(dimensionScores)) {
      status[dimension] = isDimensionPassing(score) ? 'pass' : 'fail';
    }

    return status;
  }

  /**
   * Format result as JSON, YAML, or text
   */
  formatResult(result: ChecklistResult, format: 'json' | 'yaml' | 'text' = 'json'): string {
    return ResultFormatter.format(result, format);
  }
}

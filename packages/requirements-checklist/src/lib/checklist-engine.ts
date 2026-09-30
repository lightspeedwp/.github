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
import { AmbiguitiesDimension } from './dimensions/ambiguities';
import { ClarityDimension } from './dimensions/clarity';
import { CompletenessDimension } from './dimensions/completeness';
import { ConsistencyDimension } from './dimensions/consistency';
import { DependenciesDimension } from './dimensions/dependencies';
import { EdgeCasesDimension } from './dimensions/edge-cases';
import { MeasurabilityDimension } from './dimensions/measurability';
import { ScenarioCoverageDimension } from './dimensions/scenario-coverage';

/**
 * The eight quality dimensions in FR-001, in specification order.
 *
 * Each entry is keyed by the dimension name that the templates use in an
 * item's `dimension` field, which is also the evaluator's `name`, so the two
 * join without a translation table.
 */
const DIMENSION_EVALUATORS: Array<new () => BaseDimension> = [
  CompletenessDimension,
  ClarityDimension,
  ConsistencyDimension,
  MeasurabilityDimension,
  ScenarioCoverageDimension,
  EdgeCasesDimension,
  DependenciesDimension,
  AmbiguitiesDimension,
];

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
   * Register the eight dimension evaluators, keyed by dimension name.
   *
   * The registry was previously left empty, so no evaluator ever ran and
   * every template item passed for any specification with content.
   */
  private initializeDimensions(): void {
    for (const Evaluator of DIMENSION_EVALUATORS) {
      const dimension = new Evaluator();
      this.dimensions.set(dimension.name, dimension);
    }
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
    const dimensionStatus = this.calculateDimensionStatus(dimensionScores);
    const result: ChecklistResult = {
      id: `chk_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`,
      overall_score: calculateOverallScore(dimensionScores),
      dimension_scores: dimensionScores,
      dimension_status: dimensionStatus,
      passed: Object.values(dimensionStatus).every((status) => status === 'pass'),
      template: template.id,
      audience: template.audience,
      findings,
      findings_by_dimension: findingsByDimension,
      completion_time_ms: Date.now() - startTime,
      generated_at: new Date().toISOString(),
      spec_reference: specReference,
    };

    return result;
  }

  /**
   * Create one finding per template item, judged by that item's dimension
   * evaluator.
   *
   * Each dimension evaluator is run at most once per template, and its
   * findings are shared by every item in the same dimension. An item therefore
   * reports the dimension's verdict rather than a verdict of its own: the
   * evaluators check one condition per dimension, not one per question.
   *
   * @returns Findings in the same order as the template items.
   */
  private async evaluateTemplate(
    template: ChecklistTemplate,
    spec: ParsedSpecification
  ): Promise<Finding[]> {
    const findings: Finding[] = [];
    const verdicts = new Map<string, { passed: boolean; reason?: string }>();

    for (const item of template.items) {
      const verdict = this.evaluateItem(item, spec, verdicts);

      findings.push({
        item_id: item.id,
        dimension: item.dimension,
        status: verdict.passed ? 'pass' : 'fail',
        message: verdict.passed
          ? `✓ ${item.question}`
          : `✗ ${item.question} - ${verdict.reason || item.description || 'Item failed'}`,
        suggestion: !verdict.passed ? item.suggestion : undefined,
      });
    }

    return findings;
  }

  /**
   * Judge one template item using the evaluator registered for its dimension.
   *
   * An item in a dimension with no registered evaluator falls back to the
   * original check: does the specification contain any content at all.
   *
   * @param verdicts - Memo for this run, so an evaluator runs once per
   * dimension rather than once per item.
   */
  private evaluateItem(
    item: ChecklistTemplate['items'][0],
    spec: ParsedSpecification,
    verdicts: Map<string, { passed: boolean; reason?: string }>
  ): { passed: boolean; reason?: string } {
    const dimension = this.dimensions.get(item.dimension);

    if (!dimension) {
      return { passed: (spec.raw_content || '').trim().length > 0 };
    }

    const cached = verdicts.get(item.dimension);
    if (cached) return cached;

    const failures = dimension.evaluate(spec).filter((finding) => finding.status === 'fail');
    const verdict = {
      passed: failures.length === 0,
      reason: failures.map((finding) => finding.message).join('; ') || undefined,
    };

    verdicts.set(item.dimension, verdict);
    return verdict;
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

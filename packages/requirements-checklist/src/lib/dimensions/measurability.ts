import { BaseDimension } from './base-dimension';
import { Finding, ParsedSpecification } from '../types';
import { KeywordRegistry } from './keyword-registry';

export class MeasurabilityDimension extends BaseDimension {
  evaluate(spec: ParsedSpecification): Finding[] {
    const findings: Finding[] = [];

    // MES-001: Check for quantified success criteria
    const successCriteria = spec.success_criteria || [];
    const quantifiedCriteria = this.countQuantifiedCriteria(successCriteria);
    const quantificationScore =
      successCriteria.length > 0 ? quantifiedCriteria / successCriteria.length : 1;

    findings.push(
      this.createFinding(
        'MES-001',
        quantificationScore >= 0.8,
        quantificationScore >= 0.8
          ? '✓ Success criteria are quantified'
          : `✗ Quantification score: ${Math.round(quantificationScore * 100)}% (${quantifiedCriteria}/${successCriteria.length})`,
        undefined,
        quantificationScore < 0.8
          ? 'Add specific metrics, percentages, or thresholds to success criteria'
          : undefined
      )
    );

    // MES-002: Check for performance metrics
    const hasPerformanceMetrics = this.hasPerformanceMetrics(spec);
    findings.push(
      this.createFinding(
        'MES-002',
        hasPerformanceMetrics,
        hasPerformanceMetrics
          ? '✓ Performance metrics are documented'
          : '✗ No performance metrics found',
        undefined,
        !hasPerformanceMetrics
          ? 'Document latency, throughput, memory, or other performance targets'
          : undefined
      )
    );

    // MES-003: Check for testability
    const testability = this.evaluateTestability(spec);
    findings.push(
      this.createFinding(
        'MES-003',
        testability >= 0.7,
        testability >= 0.7
          ? '✓ Requirements appear testable'
          : `✗ Testability score: ${Math.round(testability * 100)}%`,
        undefined,
        testability < 0.7
          ? 'Ensure each requirement has clear, observable pass/fail criteria'
          : undefined
      )
    );

    // MES-004: Check for requirement metrics
    const metricsContent = this.searchInSpec(
      spec,
      KeywordRegistry.measurability.required_metrics,
      false
    );
    findings.push(
      this.createFinding(
        'MES-004',
        metricsContent.matched && metricsContent.matched.length >= 3,
        metricsContent.matched && metricsContent.matched.length >= 3
          ? `✓ Found ${metricsContent.matched.length} metrics: ${metricsContent.matched.slice(0, 3).join(', ')}`
          : `✗ Found only ${metricsContent.matched?.length || 0} quantified metrics`,
        undefined,
        !metricsContent.matched || metricsContent.matched.length < 3
          ? 'Add measurable metrics (%, ms, RPS, GB, etc.) throughout the specification'
          : undefined
      )
    );

    // MES-005: Check for SLA/SLO definitions
    const hasSLAs =
      this.searchInSpec(spec, ['SLA', 'SLO', 'service level', 'uptime', 'availability'], false)
        .matched &&
      this.searchInSpec(spec, ['SLA', 'SLO', 'service level', 'uptime', 'availability'], false)
        .matched.length > 0;
    findings.push(
      this.createFinding(
        'MES-005',
        hasSLAs,
        hasSLAs
          ? '✓ SLAs or availability targets are documented'
          : '✗ No SLA/availability targets found',
        undefined,
        !hasSLAs
          ? 'Define availability, latency, or error rate SLOs (e.g., 99.9% uptime, P99 < 500ms)'
          : undefined
      )
    );

    return findings;
  }

  private countQuantifiedCriteria(criteria: string[]): number {
    let quantifiedCount = 0;

    for (const criterion of criteria) {
      // Check for quantification patterns: numbers, percentages, time units, comparisons
      if (
        /\d+(%|ms|s|min|hours?|days?|weeks?|months?|years?|mb|gb|rps|requests?|users?|items?|\$|€|£|¥)?(?:\s+|$)/i.test(
          criterion
        ) ||
        /([<>]=?|equals?|at least|at most|between|more than|less than)\s+\d+/i.test(criterion) ||
        /(p\d+|percentile|slo|sla|uptime|availability|error rate)\s*[:=]?\s*[\d.]+%?/i.test(
          criterion
        )
      ) {
        quantifiedCount++;
      }
    }

    return quantifiedCount;
  }

  private hasPerformanceMetrics(spec: ParsedSpecification): boolean {
    const content = spec.raw_content || '';

    // Check for common performance metric patterns
    const performancePatterns = [
      /latency|response time|throughput|rps|requests per second|memory|cpu|concurrent/i,
      /\d+\s*(ms|seconds?|minutes?|mb|gb|%)/i,
      /(p\d+|p50|p95|p99|median|average)\s*[<>]?\s*\d+/i,
      /uptime|availability|sla|slo/i,
    ];

    return performancePatterns.some((pattern) => pattern.test(content));
  }

  private evaluateTestability(spec: ParsedSpecification): number {
    const content = spec.raw_content || '';
    let testabilityScore = 0;

    // Check for test-related keywords
    const testKeywords = [
      'test',
      'verify',
      'validate',
      'given',
      'when',
      'then',
      'should',
      'assert',
    ];
    if (testKeywords.some((kw) => new RegExp(`\\b${kw}\\b`, 'i').test(content))) {
      testabilityScore += 0.3;
    }

    // Check for quantified criteria (observable)
    if (
      /\d+(%|ms|s|min|hours?|days?|weeks?|months?|years?|mb|gb|rps|requests?|users?|items?)/i.test(
        content
      )
    ) {
      testabilityScore += 0.3;
    }

    // Check for boolean/clear outcomes
    if (/pass|fail|success|error|warning|status|state|condition/i.test(content)) {
      testabilityScore += 0.2;
    }

    // Check for absence of vague language in requirements
    const vaguePatterns = [/should|could|may|might|possibly|hopefully/i];
    if (!vaguePatterns.some((p) => p.test(content))) {
      testabilityScore += 0.2;
    }

    return Math.min(1, testabilityScore);
  }
}

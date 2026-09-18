import { BaseDimension } from './base-dimension';
import { Finding, ParsedSpecification } from '../types';
import { KeywordRegistry } from './keyword-registry';

export class EdgeCasesDimension extends BaseDimension {
  /**
   * Evaluate edge-case count, errors, boundaries, concurrency, and recovery coverage.
   *
   * @returns Five edge-case findings in checklist order.
   */
  evaluate(spec: ParsedSpecification): Finding[] {
    const findings: Finding[] = [];

    // EC-001: Check for documented edge cases
    const edgeCases = spec.edge_cases || [];
    findings.push(
      this.createFinding(
        'EC-001',
        edgeCases.length >= 3,
        edgeCases.length >= 3
          ? `✓ ${edgeCases.length} edge cases documented`
          : `✗ Only ${edgeCases.length} edge cases documented (minimum 3)`,
        undefined,
        edgeCases.length < 3
          ? 'Document at least 3 edge cases: empty states, boundary conditions, error states'
          : undefined
      )
    );

    // EC-002: Check for error state handling
    const hasErrorHandling =
      this.searchInSpec(spec, KeywordRegistry.edge_cases.edge_case_keywords, false).matched &&
      this.searchInSpec(spec, KeywordRegistry.edge_cases.edge_case_keywords, false).matched.length >
        0;
    findings.push(
      this.createFinding(
        'EC-002',
        hasErrorHandling,
        hasErrorHandling
          ? '✓ Error and exception handling documented'
          : '✗ No error handling scenarios found',
        undefined,
        !hasErrorHandling
          ? 'Document error scenarios: invalid input, network failures, timeouts, conflicts'
          : undefined
      )
    );

    // EC-003: Check for boundary conditions
    const hasBoundaryConditions = this.checkBoundaryConditions(spec);
    findings.push(
      this.createFinding(
        'EC-003',
        hasBoundaryConditions,
        hasBoundaryConditions
          ? '✓ Boundary conditions (min/max values) are documented'
          : '✗ No boundary conditions documented',
        undefined,
        !hasBoundaryConditions
          ? 'Document boundary conditions: minimum/maximum values, empty/null cases, limits'
          : undefined
      )
    );

    // EC-004: Check for concurrent/race condition handling
    const hasConcurrencyHandling = this.checkConcurrencyHandling(spec);
    findings.push(
      this.createFinding(
        'EC-004',
        hasConcurrencyHandling,
        hasConcurrencyHandling
          ? '✓ Concurrent operation handling documented'
          : '✗ No concurrency scenarios covered',
        undefined,
        !hasConcurrencyHandling
          ? 'Document handling of concurrent requests, race conditions, and simultaneous updates'
          : undefined
      )
    );

    // EC-005: Check for recovery and rollback procedures
    const hasRecoveryProcedures =
      this.searchInSpec(spec, ['rollback', 'recovery', 'retry', 'fallback', 'compensation'], false)
        .matched &&
      this.searchInSpec(spec, ['rollback', 'recovery', 'retry', 'fallback', 'compensation'], false)
        .matched.length > 0;
    findings.push(
      this.createFinding(
        'EC-005',
        hasRecoveryProcedures,
        hasRecoveryProcedures
          ? '✓ Recovery and rollback procedures documented'
          : '✗ No recovery procedures found',
        undefined,
        !hasRecoveryProcedures
          ? 'Document recovery strategies: rollback procedures, retry logic, fallback behaviors'
          : undefined
      )
    );

    return findings;
  }

  /**
   * Report whether the source contains a predefined boundary-condition pattern.
   */
  private checkBoundaryConditions(spec: ParsedSpecification): boolean {
    const content = spec.raw_content || '';

    // Check for min/max patterns and boundary documentation
    const boundaryPatterns = [
      /\bmin(?:imum)?[:\s=]+\d+/i,
      /\bmax(?:imum)?[:\s=]+\d+/i,
      /\b(empty|null|zero|blank)\s+(state|case|value|response)/i,
      /\b(limit|threshold|cap|quota)[:\s=]+\d+/i,
      /\bboundary|limit|constraint/i,
      /\b(0|1)\s*-\s*(\d+)/i, // Range patterns
    ];

    return boundaryPatterns.some((pattern) => pattern.test(content));
  }

  /**
   * Report whether the source contains a predefined concurrency-handling pattern.
   */
  private checkConcurrencyHandling(spec: ParsedSpecification): boolean {
    const content = spec.raw_content || '';

    const concurrencyPatterns = [
      /concurrent|parallel|simultaneous|race condition|deadlock/i,
      /lock|mutex|semaphore|atomic|transaction/i,
      /conflict resolution|last-write-wins|optimistic|pessimistic/i,
      /duplicate request|idempotent|idempotency/i,
    ];

    return concurrencyPatterns.some((pattern) => pattern.test(content));
  }
}

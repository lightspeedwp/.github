import { BaseDimension } from './base-dimension';
import { Finding, ParsedSpecification } from '../types';

export class DependenciesDimension extends BaseDimension {
  evaluate(spec: ParsedSpecification): Finding[] {
    const findings: Finding[] = [];

    // DEP-001: Check for external dependencies documentation
    const dependencies = spec.dependencies || [];
    findings.push(
      this.createFinding(
        'DEP-001',
        dependencies.length >= 1,
        dependencies.length >= 1
          ? `✓ ${dependencies.length} dependencies documented`
          : '✗ No external dependencies documented',
        undefined,
        dependencies.length === 0
          ? 'Document all external services, APIs, and system dependencies'
          : undefined
      )
    );

    // DEP-002: Check for assumptions documentation
    const assumptions = spec.assumptions || [];
    findings.push(
      this.createFinding(
        'DEP-002',
        assumptions.length >= 1,
        assumptions.length >= 1
          ? `✓ ${assumptions.length} assumptions documented`
          : '✗ No assumptions documented',
        undefined,
        assumptions.length === 0
          ? 'Document critical assumptions about infrastructure, availability, and constraints'
          : undefined
      )
    );

    // DEP-003: Check for SLA/availability requirements of dependencies
    const hasSLADocumentation = this.checkDependencySLAs(spec);
    findings.push(
      this.createFinding(
        'DEP-003',
        hasSLADocumentation,
        hasSLADocumentation
          ? '✓ Dependency SLAs and availability are documented'
          : '✗ Dependency availability/SLA not documented',
        undefined,
        !hasSLADocumentation
          ? 'Document SLAs, availability requirements, and impact of dependencies failing'
          : undefined
      )
    );

    // DEP-004: Check for integration points
    const integrationPoints = this.checkIntegrationPoints(spec);
    findings.push(
      this.createFinding(
        'DEP-004',
        integrationPoints >= 1,
        integrationPoints >= 1
          ? `✓ ${integrationPoints} integration points documented`
          : '✗ No integration points documented',
        undefined,
        integrationPoints === 0
          ? 'Document how this feature integrates with other systems (APIs, events, shared data)'
          : undefined
      )
    );

    // DEP-005: Check for version compatibility and constraints
    const hasVersionConstraints =
      this.searchInSpec(spec, ['version', 'compatibility', 'requires', 'depend', 'support'], false)
        .matched &&
      this.searchInSpec(spec, ['version', 'compatibility', 'requires', 'depend', 'support'], false)
        .matched.length > 0;
    findings.push(
      this.createFinding(
        'DEP-005',
        hasVersionConstraints,
        hasVersionConstraints
          ? '✓ Version and compatibility constraints documented'
          : '✗ No version/compatibility constraints found',
        undefined,
        !hasVersionConstraints
          ? 'Document minimum versions, compatibility constraints, and tech stack requirements'
          : undefined
      )
    );

    return findings;
  }

  private checkDependencySLAs(spec: ParsedSpecification): boolean {
    const content = spec.raw_content || '';

    // Check for SLA/availability documentation
    const slaPatterns = [
      /sla|slo|service level/i,
      /availability|uptime|downtime/i,
      /\d+%\s*(uptime|available|availability)/i,
      /critical|essential|required|mandatory.*dependency/i,
      /optional|graceful.*degradation|fallback/i,
    ];

    return slaPatterns.some((pattern) => pattern.test(content));
  }

  private checkIntegrationPoints(spec: ParsedSpecification): number {
    const content = spec.raw_content || '';

    // Count integration-related keywords
    const integrationKeywords = [
      'api',
      'endpoint',
      'service',
      'database',
      'cache',
      'queue',
      'event',
      'webhook',
      'callback',
      'integration',
      'interface',
      'contract',
      'protocol',
      'communication',
      'synchronization',
    ];

    let count = 0;
    for (const keyword of integrationKeywords) {
      if (new RegExp(`\\b${keyword}\\b`, 'i').test(content)) {
        count++;
      }
    }

    return count;
  }
}

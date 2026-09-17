import { BaseDimension } from './base-dimension';
import { Finding, ParsedSpecification } from '../types';
import { KeywordRegistry } from './keyword-registry';

export class ScenarioCoverageDimension extends BaseDimension {
  evaluate(spec: ParsedSpecification): Finding[] {
    const findings: Finding[] = [];

    // SC-001: Check for user stories/scenarios
    const userStories = spec.user_stories || [];
    findings.push(
      this.createFinding(
        'SC-001',
        userStories.length >= 1,
        userStories.length >= 1
          ? `✓ ${userStories.length} user stories/scenarios documented`
          : '✗ No user stories or scenarios found',
        undefined,
        userStories.length === 0
          ? 'Document primary user journeys and scenarios using user story format (As a..., I want..., So that...)'
          : undefined
      )
    );

    // SC-002: Check for happy path documentation
    const happyPathContent = this.searchInSpec(
      spec,
      KeywordRegistry.scenario_coverage.happy_path_keywords,
      false
    );
    findings.push(
      this.createFinding(
        'SC-002',
        happyPathContent.matched && happyPathContent.matched.length > 0,
        happyPathContent.matched && happyPathContent.matched.length > 0
          ? '✓ Happy path is documented'
          : '✗ No happy path scenario found',
        undefined,
        !happyPathContent.matched || happyPathContent.matched.length === 0
          ? 'Document the primary/happy path using given/when/then format'
          : undefined
      )
    );

    // SC-003: Check for alternative flows
    const hasAlternativeFlows = this.checkAlternativeFlows(spec);
    findings.push(
      this.createFinding(
        'SC-003',
        hasAlternativeFlows >= 1,
        hasAlternativeFlows >= 1
          ? `✓ ${hasAlternativeFlows} alternative flows identified`
          : '✗ No alternative flow documentation found',
        undefined,
        hasAlternativeFlows < 1
          ? 'Document alternative flows (cancellation, retry, rework paths)'
          : undefined
      )
    );

    // SC-004: Check for user roles/personas
    const hasUserRoles = this.checkUserRolesDocumented(spec);
    findings.push(
      this.createFinding(
        'SC-004',
        hasUserRoles,
        hasUserRoles
          ? '✓ User roles or personas are documented'
          : '✗ No user roles or personas defined',
        undefined,
        !hasUserRoles
          ? 'Define user roles, personas, or segments that interact with this feature'
          : undefined
      )
    );

    // SC-005: Check for interaction points documentation
    const interactionPoints = this.checkInteractionPoints(spec);
    findings.push(
      this.createFinding(
        'SC-005',
        interactionPoints >= 2,
        interactionPoints >= 2
          ? `✓ ${interactionPoints} interaction points documented`
          : `✗ Few interaction points documented (${interactionPoints})`,
        undefined,
        interactionPoints < 2
          ? 'Document key interaction points: user actions, system responses, state changes'
          : undefined
      )
    );

    return findings;
  }

  private checkAlternativeFlows(spec: ParsedSpecification): number {
    const content = spec.raw_content || '';

    const alternativeFlowPatterns = [
      /alternative|alt flow|alternate path|error case|exception/i,
      /when\s+user\s+cancels/i,
      /if\s+.*\s+fails/i,
      /retry|rework|fallback/i,
    ];

    let count = 0;
    for (const pattern of alternativeFlowPatterns) {
      if (pattern.test(content)) count++;
    }

    return count;
  }

  private checkUserRolesDocumented(spec: ParsedSpecification): boolean {
    const content = spec.raw_content || '';

    // Check for role patterns like "admin", "user", "guest", "moderator", etc.
    const rolePatterns = [
      /\b(admin|user|guest|moderator|owner|editor|viewer|contributor|customer|stakeholder|reviewer)\b/i,
      /\brole[s]?\s*[=:]\s*\[/i,
      /\bpersona[s]?\s*[=:]/i,
      /\buser.*type[s]?|user.*segment[s]?/i,
    ];

    return rolePatterns.some((pattern) => pattern.test(content));
  }

  private checkInteractionPoints(spec: ParsedSpecification): number {
    const content = spec.raw_content || '';

    // Count interaction point keywords
    const interactionKeywords = [
      'click',
      'select',
      'enter',
      'submit',
      'confirm',
      'cancel',
      'download',
      'upload',
      'navigate',
      'return',
      'display',
      'show',
      'hide',
      'alert',
      'notification',
    ];

    let count = 0;
    for (const keyword of interactionKeywords) {
      if (new RegExp(`\\b${keyword}\\b`, 'i').test(content)) {
        count++;
      }
    }

    return count;
  }
}

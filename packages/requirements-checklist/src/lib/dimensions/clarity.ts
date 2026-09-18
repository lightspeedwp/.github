import { BaseDimension } from './base-dimension';
import { Finding, ParsedSpecification } from '../types';
import { KeywordRegistry } from './keyword-registry';

export class ClarityDimension extends BaseDimension {
  /**
   * Evaluate vague adjectives, term and acronym definitions, success criteria, and scope.
   *
   * @returns Five clarity findings in checklist order.
   */
  evaluate(spec: ParsedSpecification): Finding[] {
    const findings: Finding[] = [];

    // CLR-001: Check for vague adjectives
    const vagueTermsResult = this.searchInSpec(
      spec,
      KeywordRegistry.clarity.vague_adjectives,
      false
    );
    findings.push(
      this.createFinding(
        'CLR-001',
        !vagueTermsResult.matched || vagueTermsResult.matched.length === 0,
        !vagueTermsResult.matched || vagueTermsResult.matched.length === 0
          ? '✓ No vague adjectives detected'
          : `✗ Found vague adjectives (${vagueTermsResult.matched.length}): ${vagueTermsResult.matched.slice(0, 3).join(', ')}...`,
        vagueTermsResult.evidence,
        vagueTermsResult.matched && vagueTermsResult.matched.length > 0
          ? 'Replace vague terms with specific, quantifiable criteria'
          : undefined
      )
    );

    // CLR-002: Check for undefined technical terms
    const hasGlossary =
      this.searchInSpec(spec, ['glossary', 'definitions', 'terms'], false).matched &&
      this.searchInSpec(spec, ['glossary', 'definitions', 'terms'], false).matched.length > 0;
    findings.push(
      this.createFinding(
        'CLR-002',
        hasGlossary || this.countTermDefinitions(spec) >= 3,
        hasGlossary || this.countTermDefinitions(spec) >= 3
          ? '✓ Technical terms appear to be defined'
          : '✗ No evidence of defined technical terms or glossary',
        undefined,
        !hasGlossary && this.countTermDefinitions(spec) < 3
          ? 'Add glossary section or define technical terms inline'
          : undefined
      )
    );

    // CLR-003: Check for clear context around acronyms
    const acronymMatches = (spec.raw_content || '').match(/\b[A-Z]{2,}\b/g) || [];
    const uniqueAcronyms = new Set(acronymMatches);
    findings.push(
      this.createFinding(
        'CLR-003',
        uniqueAcronyms.size <= 3 || this.hasAcronymDefinitions(spec),
        this.hasAcronymDefinitions(spec) || uniqueAcronyms.size <= 3
          ? '✓ Acronyms are appropriately defined or minimal'
          : `✗ Found ${uniqueAcronyms.size} undefined acronyms`,
        undefined,
        uniqueAcronyms.size > 3 && !this.hasAcronymDefinitions(spec)
          ? 'Define all acronyms on first use or in a glossary'
          : undefined
      )
    );

    // CLR-004: Check for clear success criteria language
    const hasSuccessCriteria = spec.success_criteria && spec.success_criteria.length > 0;
    const successCriteriaClarity = hasSuccessCriteria
      ? this.evaluateSuccessCriteriaClarity(spec.success_criteria || [])
      : 0;
    findings.push(
      this.createFinding(
        'CLR-004',
        successCriteriaClarity >= 0.7,
        successCriteriaClarity >= 0.7
          ? '✓ Success criteria are clearly stated'
          : `✗ Success criteria clarity score: ${Math.round(successCriteriaClarity * 100)}%`,
        undefined,
        successCriteriaClarity < 0.7
          ? 'Use clear, measurable language in success criteria (avoid "should", "may", "could")'
          : undefined
      )
    );

    // CLR-005: Check for explicit scope and exclusions
    const hasScopeStatement =
      this.searchInSpec(spec, ['scope', 'in scope', 'out of scope'], false).matched &&
      this.searchInSpec(spec, ['scope', 'in scope', 'out of scope'], false).matched.length > 0;
    findings.push(
      this.createFinding(
        'CLR-005',
        hasScopeStatement,
        hasScopeStatement
          ? '✓ Scope is explicitly defined'
          : '✗ No explicit scope definition found',
        undefined,
        !hasScopeStatement ? 'Add section clearly defining scope and exclusions' : undefined
      )
    );

    return findings;
  }

  /**
   * Count definition-like lines that match the supported `term: Definition` pattern.
   */
  private countTermDefinitions(spec: ParsedSpecification): number {
    const content = spec.raw_content || '';
    // Simple heuristic: count lines with pattern "term: definition" or "term - definition"
    const definitionPattern = /\b[a-z]+[a-z\s]*:\s+[A-Z][^.\n]{10,}/gm;
    const matches = content.match(definitionPattern) || [];
    return matches.length;
  }

  /**
   * Report whether the source contains an uppercase acronym followed by a parenthesized definition.
   */
  private hasAcronymDefinitions(spec: ParsedSpecification): boolean {
    const content = spec.raw_content || '';
    // Check for patterns like "API (Application Programming Interface)"
    const acronymPattern = /\b([A-Z]{2,})\s*\([^)]{3,}\)/g;
    return acronymPattern.test(content);
  }

  /**
   * Calculate the proportion of criteria that omit the predefined unclear terms.
   *
   * @returns A value from 0 to 1, or 0 when no criteria are supplied.
   */
  private evaluateSuccessCriteriaClarity(criteria: string[]): number {
    if (criteria.length === 0) return 0;

    const unclearTerms = ['should', 'may', 'might', 'could', 'hopefully', 'ideally', 'arguably'];
    let unclearCount = 0;

    for (const criterion of criteria) {
      const lowerCriterion = criterion.toLowerCase();
      for (const term of unclearTerms) {
        if (lowerCriterion.includes(term)) {
          unclearCount++;
          break;
        }
      }
    }

    return 1 - unclearCount / criteria.length;
  }
}

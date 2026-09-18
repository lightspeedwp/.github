import { BaseDimension } from './base-dimension';
import { Finding, ParsedSpecification } from '../types';
import { KeywordRegistry } from './keyword-registry';

export class AmbiguitiesDimension extends BaseDimension {
  /**
   * Evaluate vague language, unresolved decisions, potential conflicts, scope, and relative terms.
   *
   * @returns Five ambiguity findings in checklist order.
   */
  evaluate(spec: ParsedSpecification): Finding[] {
    const findings: Finding[] = [];

    // AMB-001: Check for vague language
    const vagueLanguage = this.searchInSpec(
      spec,
      KeywordRegistry.ambiguities.ambiguous_phrases,
      false
    );
    findings.push(
      this.createFinding(
        'AMB-001',
        !vagueLanguage.matched || vagueLanguage.matched.length === 0,
        !vagueLanguage.matched || vagueLanguage.matched.length === 0
          ? '✓ No vague or ambiguous language detected'
          : `✗ Found vague language (${vagueLanguage.matched?.length || 0} instances)`,
        vagueLanguage.evidence,
        vagueLanguage.matched && vagueLanguage.matched.length > 0
          ? 'Replace vague phrases (might, could, possibly, hopefully) with definitive statements'
          : undefined
      )
    );

    // AMB-002: Check for marked/unresolved decisions
    const unresolvedDecisions = this.checkUnresolvedDecisions(spec);
    findings.push(
      this.createFinding(
        'AMB-002',
        unresolvedDecisions === 0,
        unresolvedDecisions === 0
          ? '✓ No unresolved decisions found'
          : `✗ ${unresolvedDecisions} unresolved decisions marked [DECISION NEEDED]`,
        undefined,
        unresolvedDecisions > 0
          ? 'Resolve marked decisions or escalate to stakeholders for guidance'
          : undefined
      )
    );

    // AMB-003: Check for conflicting or contradictory statements
    const conflicts = this.checkConflicts(spec);
    findings.push(
      this.createFinding(
        'AMB-003',
        conflicts === 0,
        conflicts === 0
          ? '✓ No conflicting statements detected'
          : `✗ ${conflicts} potential conflicts detected`,
        undefined,
        conflicts > 0 ? 'Review for contradictory requirements and resolve conflicts' : undefined
      )
    );

    // AMB-004: Check for clear scope boundaries
    const hasScopeBoundaries =
      this.searchInSpec(spec, ['in scope', 'out of scope', 'excludes'], false).matched &&
      this.searchInSpec(spec, ['in scope', 'out of scope', 'excludes'], false).matched.length > 0;
    findings.push(
      this.createFinding(
        'AMB-004',
        hasScopeBoundaries,
        hasScopeBoundaries
          ? '✓ Scope boundaries are clearly defined'
          : '✗ Scope boundaries not clearly defined',
        undefined,
        !hasScopeBoundaries
          ? 'Clearly define what is in scope and out of scope to avoid ambiguity'
          : undefined
      )
    );

    // AMB-005: Check for relative terms without context
    const relativeTerms = this.checkRelativeTerms(spec);
    findings.push(
      this.createFinding(
        'AMB-005',
        relativeTerms === 0,
        relativeTerms === 0
          ? '✓ No unexplained relative terms'
          : `✗ Found ${relativeTerms} relative terms without context (big, small, many, few, etc.)`,
        undefined,
        relativeTerms > 0
          ? 'Replace relative terms with absolute measurements or define baselines'
          : undefined
      )
    );

    return findings;
  }

  /**
   * Count case-insensitive `[DECISION NEEDED]` markers in the source text.
   */
  private checkUnresolvedDecisions(spec: ParsedSpecification): number {
    const content = spec.raw_content || '';

    // Count [DECISION NEEDED] markers
    const decisionMarkers = content.match(/\[DECISION\s+NEEDED\]/gi) || [];
    return decisionMarkers.length;
  }

  /**
   * Count predefined pairs of potentially contradictory terms found anywhere in the source text.
   */
  private checkConflicts(spec: ParsedSpecification): number {
    const content = spec.raw_content || '';
    let conflictCount = 0;

    // Check for contradictory patterns
    const conflictingPatterns = [
      { pattern1: /must|required|mandatory/i, pattern2: /optional|may|might/i },
      { pattern1: /always|never/i, pattern2: /sometimes|occasionally|rarely/i },
      { pattern1: /high priority/i, pattern2: /low priority/i },
      { pattern1: /critical/i, pattern2: /nice-to-have/i },
    ];

    for (const conflict of conflictingPatterns) {
      if (conflict.pattern1.test(content) && conflict.pattern2.test(content)) {
        conflictCount++;
      }
    }

    return conflictCount;
  }

  /**
   * Count distinct predefined relative terms found in the source text.
   */
  private checkRelativeTerms(spec: ParsedSpecification): number {
    const content = spec.raw_content || '';

    // Check for relative terms without context
    const relativeTerms = [
      'big',
      'small',
      'large',
      'tiny',
      'many',
      'few',
      'some',
      'several',
      'lot',
      'bunch',
    ];

    let count = 0;
    for (const term of relativeTerms) {
      const pattern = new RegExp(`\\b${term}\\b`, 'i');
      if (pattern.test(content)) {
        count++;
      }
    }

    return count;
  }
}

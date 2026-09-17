import { Finding, ParsedSpecification } from '../types';
import { BaseDimension } from './base-dimension';

/**
 * Completeness Dimension
 * Validates that all required sections are present and specifications are complete
 */
export class CompletenessDimension extends BaseDimension {
  id = 'completeness';
  name = 'Completeness';
  description = 'Required sections present, coverage of all scenarios and edge cases';

  private requiredSections = [
    'Overview',
    'User Scenarios',
    'Requirements',
    'Success Criteria',
    'Assumptions',
    'Edge Cases',
  ];

  evaluate(spec: ParsedSpecification): Finding[] {
    const findings: Finding[] = [];

    // Check for required sections
    const { missing } = this.checkRequiredSections(spec, this.requiredSections);

    if (missing.length === 0) {
      findings.push(this.createFinding('CMP-001', true, 'All required sections are present'));
    } else {
      findings.push(
        this.createFinding(
          'CMP-001',
          false,
          `Missing sections: ${missing.join(', ')}`,
          undefined,
          `Add the following sections: ${missing.join(', ')}`
        )
      );
    }

    // Check for content completeness (non-empty sections)
    const hasContent = (spec.raw_content || '').trim().length > 100;
    findings.push(
      this.createFinding(
        'CMP-002',
        hasContent,
        hasContent
          ? 'Specification has substantial content'
          : 'Specification appears incomplete or too brief',
        undefined,
        'Expand specification with more detail and examples'
      )
    );

    // Check for user stories/scenarios
    const hasUserStories = spec.user_stories && spec.user_stories.length > 0;
    findings.push(
      this.createFinding(
        'CMP-003',
        hasUserStories || false,
        hasUserStories
          ? 'User stories/scenarios are documented'
          : 'No user stories or scenarios documented',
        undefined,
        'Add at least one user story with Given-When-Then format'
      )
    );

    // Check for success criteria
    const hasSuccessCriteria = spec.success_criteria && spec.success_criteria.length > 0;
    findings.push(
      this.createFinding(
        'CMP-004',
        hasSuccessCriteria || false,
        hasSuccessCriteria ? 'Success criteria are defined' : 'No success criteria defined',
        undefined,
        'Define measurable success criteria (SC-001, SC-002, etc.)'
      )
    );

    // Check for edge cases
    const hasEdgeCases = spec.edge_cases && spec.edge_cases.length > 0;
    findings.push(
      this.createFinding(
        'CMP-005',
        hasEdgeCases || false,
        hasEdgeCases ? 'Edge cases are documented' : 'No edge cases documented',
        undefined,
        'Identify and document at least 3 edge cases'
      )
    );

    return findings;
  }
}

/**
 * Requirements Quality Checklist Framework
 * Main public API entry point
 */

// Core engine
import { ChecklistEngine } from './checklist-engine';

export { ChecklistEngine } from './checklist-engine';

// Type definitions
export type {
  ChecklistDimension,
  ChecklistItem,
  ChecklistTemplate,
  ChecklistResult,
  Finding,
  SpecificationReference,
  ChecklistOptions,
  ParsedSpecification,
  SpecificationEvidence,
} from './types';

// Utilities
export { SpecParser } from './utils/spec-parser';
export { ResultFormatter } from './utils/result-formatter';
export {
  calculateDimensionScore,
  isDimensionPassing,
  calculateOverallScore,
  generateScoreBreakdown,
} from './utils/scoring';

// Template loading
export { TemplateLoader } from './template-loader';

/**
 * Convenience function to run a checklist
 * @param options Checklist options including variant, specPath, format
 * @returns ChecklistResult with scores, findings, and metadata
 */
export async function run(options: {
  variant: 'author-pre-review' | 'peer-review' | 'stakeholder-gate' | 'cross-project-integration';
  specPath: string;
  format?: 'markdown' | 'yaml' | 'json';
  author?: string;
  version?: string;
  output_format?: 'json' | 'yaml' | 'text';
}): Promise<string> {
  const engine = new ChecklistEngine();
  const result = await engine.run(options);
  return engine.formatResult(result, options.output_format || 'json');
}

/**
 * Get available checklist variants
 */
export function getAvailableVariants(): Array<{
  id: string;
  name: string;
  audience: string;
  time_estimate_minutes: number;
}> {
  return [
    {
      id: 'author-pre-review',
      name: 'Author Pre-Review',
      audience: 'Specification authors',
      time_estimate_minutes: 30,
    },
    {
      id: 'peer-review',
      name: 'Peer Review',
      audience: 'Technical reviewers',
      time_estimate_minutes: 45,
    },
    {
      id: 'stakeholder-gate',
      name: 'Stakeholder Gate',
      audience: 'Product managers & stakeholders',
      time_estimate_minutes: 15,
    },
    {
      id: 'cross-project-integration',
      name: 'Cross-Project Integration',
      audience: 'Technical leads',
      time_estimate_minutes: 20,
    },
  ];
}

/**
 * Get information about quality dimensions
 */
export function getDimensions(): Array<{
  id: string;
  name: string;
  description: string;
  threshold: number;
}> {
  return [
    {
      id: 'completeness',
      name: 'Completeness',
      description: 'Required sections present, coverage of all scenarios and edge cases',
      threshold: 75,
    },
    {
      id: 'clarity',
      name: 'Clarity',
      description: 'No vague adjectives without quantifiable thresholds, clear terminology',
      threshold: 75,
    },
    {
      id: 'consistency',
      name: 'Consistency',
      description: 'Consistent naming, no terminology drift, clear definitions',
      threshold: 75,
    },
    {
      id: 'measurability',
      name: 'Measurability',
      description: 'All success criteria quantified, testable outcomes defined',
      threshold: 75,
    },
    {
      id: 'scenario-coverage',
      name: 'Scenario Coverage',
      description: 'Primary user journeys, alternative flows, negative cases documented',
      threshold: 75,
    },
    {
      id: 'edge-cases',
      name: 'Edge Cases',
      description: 'Boundary conditions, error states, and unusual scenarios identified',
      threshold: 75,
    },
    {
      id: 'dependencies',
      name: 'Dependencies',
      description: 'Cross-project dependencies, assumptions, and constraints documented',
      threshold: 75,
    },
    {
      id: 'ambiguities',
      name: 'Ambiguities',
      description:
        'No ambiguous requirements, clear acceptance criteria, unresolved decisions flagged',
      threshold: 75,
    },
  ];
}

/**
 * Core TypeScript interfaces for the Requirements Quality Checklist Framework
 */

/**
 * Represents one of the 8 quality dimensions
 */
export interface ChecklistDimension {
  id: string;
  name:
    | 'Completeness'
    | 'Clarity'
    | 'Consistency'
    | 'Measurability'
    | 'Scenario Coverage'
    | 'Edge Cases'
    | 'Dependencies'
    | 'Ambiguities';
  description: string;
  success_threshold: number; // e.g., 75 for >= 75%
}

/**
 * A single quality checkpoint within a checklist
 */
export interface ChecklistItem {
  id: string;
  dimension: string; // Dimension name
  question: string;
  description?: string;
  audience: ('author' | 'peer' | 'stakeholder' | 'integration')[];
  pass_criteria: string;
  suggestion?: string;
  reference_examples?: {
    good: string;
    poor: string;
  };
}

/**
 * A named checklist variant for a specific audience/workflow
 */
export interface ChecklistTemplate {
  id: string;
  name: 'author-pre-review' | 'peer-review' | 'stakeholder-gate' | 'cross-project-integration';
  audience: string;
  time_estimate_minutes: number;
  items: ChecklistItem[];
  description: string;
}

/**
 * The result of running a checklist on a specification
 */
export interface ChecklistResult {
  id: string; // Unique result identifier
  overall_score: number; // 0-100
  dimension_scores: Record<string, number>; // dimension name -> score
  dimension_status: Record<string, 'pass' | 'fail'>; // dimension name -> pass/fail
  passed: boolean; // true when every dimension passes
  template: string; // checklist template id used for this run
  audience: string; // intended audience of the template used
  findings: Finding[];
  completion_time_ms: number;
  generated_at: string; // ISO 8601 timestamp
  spec_reference: SpecificationReference;
  findings_by_dimension: Record<string, Finding[]>;
}

/**
 * A single quality issue found during checklist evaluation
 */
export interface Finding {
  item_id: string;
  dimension: string;
  status: 'pass' | 'fail';
  message: string;
  evidence?: string; // Quoted text from spec
  suggestion?: string;
}

/**
 * Metadata linking a result to a specification
 */
export interface SpecificationReference {
  path: string;
  format: 'markdown' | 'yaml' | 'json';
  author?: string;
  version?: string;
}

/**
 * Options for running a checklist
 */
export interface ChecklistOptions {
  variant: 'author-pre-review' | 'peer-review' | 'stakeholder-gate' | 'cross-project-integration';
  specPath: string;
  format?: 'markdown' | 'yaml' | 'json'; // Auto-detect if omitted
  author?: string;
  version?: string;
  output_format?: 'json' | 'yaml' | 'text';
}

/**
 * Parsed specification structure
 */
export interface ParsedSpecification {
  overview?: string;
  user_stories?: string[];
  functional_requirements?: string[];
  success_criteria?: string[];
  assumptions?: string[];
  edge_cases?: string[];
  dependencies?: string[];
  raw_content: string; // Full spec text for evidence extraction
}

/**
 * Evidence extracted from specification
 */
export interface SpecificationEvidence {
  heading?: string;
  context_before?: string;
  matched_text: string;
  context_after?: string;
}

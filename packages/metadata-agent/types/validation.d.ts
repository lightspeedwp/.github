/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Validation Module Type Definitions
 *
 * @lightspeedwp/metadata-agent/validation
 */

/**
 * Issue object for validation
 */
export interface IssueForValidation {
  number: number;
  title: string;
  labels: string[];
  state?: "open" | "closed";
  milestone?: string;
  isPR?: boolean;
  created_at?: string;
}

/**
 * Validation rule result
 */
export interface RuleResult {
  rule: string;
  passed: boolean;
  message: string;
  failCount?: number;
  coverage?: number;
  threshold?: number;
  details?: Record<string, any>;
}

/**
 * Tier 1 blocker validation
 */
export interface Tier1ValidationResult {
  passed: boolean;
  blockers: RuleResult[];
  count: number;
  total: number;
  details: {
    issuesChecked: number;
  };
}

/**
 * Tier 2 warning validation
 */
export interface Tier2ValidationResult {
  passed: boolean;
  warnings: RuleResult[];
  count: number;
  total: number;
  details: {
    issuesChecked: number;
  };
}

/**
 * Tier 3 info validation (always passes)
 */
export interface Tier3ValidationResult {
  passed: true;
  info: RuleResult[];
  count: number;
  total: number;
  details: {
    issuesChecked: number;
  };
}

/**
 * Release types for recommendations
 */
export type ReleaseType = "patch" | "minor" | "major";

/**
 * Validation recommendation
 */
export interface ValidationRecommendation {
  action: "proceed" | "check" | "block";
  reason: string;
  details: {
    releaseType: ReleaseType;
    blockerCount?: number;
    warningCount?: number;
    blockers?: string[];
    warnings?: string[];
    tier1Passed?: boolean;
    tier2Passed?: boolean;
    note?: string;
  };
}

/**
 * Tier 1 validation rules
 */
export const TIER_1_RULES: {
  "All issues have type label": (issues: IssueForValidation[]) => RuleResult;
  "No conflicting labels": (issues: IssueForValidation[]) => RuleResult;
  "All PRs have status label": (issues: IssueForValidation[]) => RuleResult;
  "Milestone is populated": (issues: IssueForValidation[]) => RuleResult;
};

/**
 * Tier 2 validation rules
 */
export const TIER_2_RULES: {
  "High label coverage (95%+)": (issues: IssueForValidation[]) => RuleResult;
  "All issues have priority label": (
    issues: IssueForValidation[],
  ) => RuleResult;
  "Consistent area labels": (issues: IssueForValidation[]) => RuleResult;
  "Changelog tracking": (issues: IssueForValidation[]) => RuleResult;
};

/**
 * Tier 3 validation rules
 */
export const TIER_3_RULES: {
  "Average labels per issue": (issues: IssueForValidation[]) => RuleResult;
  "Label family distribution": (issues: IssueForValidation[]) => RuleResult;
};

/**
 * Validation function signatures
 */
export function validateTier1(
  issues: IssueForValidation[],
): Tier1ValidationResult;
export function validateTier2(
  issues: IssueForValidation[],
): Tier2ValidationResult;
export function validateTier3(
  issues: IssueForValidation[],
): Tier3ValidationResult;

export function getRecommendation(
  releaseType: ReleaseType,
  tier1: Tier1ValidationResult,
  tier2: Tier2ValidationResult,
): ValidationRecommendation;

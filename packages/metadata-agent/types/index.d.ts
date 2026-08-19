/**
 * TypeScript Type Definitions
 *
 * @lightspeedwp/metadata-agent
 */

// Label utilities types
export interface ParsedLabel {
  family: string | null;
  name: string;
  full: string;
}

export interface ValidationResult {
  valid: boolean;
  label: string;
  suggestion: string | null;
  reason: string;
}

export interface LabelScore {
  label: string;
  score: number;
  confidence: boolean;
}

export interface LabelUtilities {
  parse(label: string): ParsedLabel;
  validate(label: string): ValidationResult;
  suggest(label: string, maxSuggestions?: number): string[];
  score(label: string, context?: ScoreContext): number;
  getFamilies(): string[];
  getLabelsByFamily(family: string): string[];
  getAllCanonical(): string[];
}

export interface ScoreContext {
  issueType?: string;
  existingLabels?: string[];
  isCanonical?: boolean;
}

// API client types
export interface AuthenticateOptions {
  token: string;
  baseUrl?: string;
  maxRetries?: number;
  rateLimitWait?: number;
}

export interface GetIssuesOptions {
  owner: string;
  repo: string;
  state?: "open" | "closed" | "all";
  labels?: string[];
  per_page?: number;
  page?: number;
}

export interface Issue {
  number: number;
  title: string;
  state: "open" | "closed";
  labels: string[];
  url: string;
  created_at: string;
  updated_at: string;
}

export interface ApplyLabelsOptions {
  owner: string;
  repo: string;
  issue_number: number;
  labels: string[];
}

export interface ApplyLabelsResult {
  success: boolean;
  issue_number: number;
  labels: string[];
  count: number;
}

export interface RateLimit {
  remaining: number;
  limit: number;
  reset: number;
  resetTime: Date;
}

export interface GitHubAPIClient {
  authenticate(): Promise<{
    login: string;
    name: string;
    email: string;
    type: string;
  }>;
  getIssues(options: GetIssuesOptions): Promise<Issue[]>;
  applyLabels(options: ApplyLabelsOptions): Promise<ApplyLabelsResult>;
  removeLabels(options: ApplyLabelsOptions): Promise<ApplyLabelsResult>;
  setProjectFields(options: any): Promise<any>;
  getRateLimit(): Promise<RateLimit>;
  handleRateLimit(): Promise<void>;
  retry(fn: Function, options?: any): Promise<any>;
}

export interface APIClient {
  createClient(options: AuthenticateOptions): GitHubAPIClient;
  authenticateClient(options: AuthenticateOptions): Promise<GitHubAPIClient>;
  GitHubAPIClient: typeof GitHubAPIClient;
}

// Validation types
export interface ValidationRule {
  rule: string;
  message: string;
  passed?: boolean;
}

export interface Tier1Result {
  passed: boolean;
  blockers: ValidationRule[];
  count: number;
  total: number;
  details: Record<string, any>;
}

export interface Tier2Result {
  passed: boolean;
  warnings: ValidationRule[];
  count: number;
  total: number;
  details: Record<string, any>;
}

export interface Tier3Result {
  passed: true;
  info: ValidationRule[];
  count: number;
  total: number;
  details: Record<string, any>;
}

export type ReleaseType = "patch" | "minor" | "major";

export interface Recommendation {
  action: "proceed" | "check" | "block";
  reason: string;
  details: Record<string, any>;
}

export interface Validation {
  validateTier1(issues: any[]): Tier1Result;
  validateTier2(issues: any[]): Tier2Result;
  validateTier3(issues: any[]): Tier3Result;
  getRecommendation(
    releaseType: ReleaseType,
    tier1: Tier1Result,
    tier2: Tier2Result,
  ): Recommendation;
}

// Confidence scorer types
export interface ConfidenceContext {
  issueNumber?: number;
  issueTitle?: string;
  issueBody?: string;
  existingLabels?: string[];
  issueType?: string;
  stats?: { appliedCount: number; correctCount: number };
}

export interface ScorerOptions {
  threshold?: number;
  weights?: {
    canonicality?: number;
    contextMatch?: number;
    noConflict?: number;
    frequency?: number;
  };
}

export interface Assessment {
  score: number;
  threshold: number;
  confident: boolean;
  action: "auto-apply" | "review";
  gap: number;
  reason: string;
}

export interface ConfidenceScorerClass {
  calculate(label: string, context?: ConfidenceContext): number;
  getThreshold(): number;
  setThreshold(threshold: number): void;
  isConfident(score: number): boolean;
  assess(score: number, reason?: string): Assessment;
}

export interface ConfidenceScorerModule {
  createScorer(options?: ScorerOptions): ConfidenceScorerClass;
  ConfidenceScorer: typeof ConfidenceScorerClass;
  DEFAULT_THRESHOLD: number;
}

// Error handler types
export type ErrorType =
  | "authentication"
  | "authorization"
  | "rate_limit"
  | "not_found"
  | "validation"
  | "conflict"
  | "network"
  | "unknown";

export interface ErrorClassification {
  type: ErrorType;
  message: string;
  recovery: string;
  retriable: boolean;
  code: number | string | null;
  original?: Error;
}

export interface RetryOptions {
  maxAttempts?: number;
  backoffMs?: number;
  maxBackoffMs?: number;
  onRetry?: (context: any) => void;
}

export interface ErrorSuggestions {
  type: ErrorType;
  immediate: string[];
  checks: string[];
  escalation: string | null;
}

export interface ErrorHandler {
  catch(error: Error | any): ErrorClassification;
  retry(fn: Function, options?: RetryOptions): Promise<any>;
  suggest(error: Error | any): ErrorSuggestions;
  format(error: Error | any, includeStack?: boolean): string;
  ERROR_TYPES: Record<string, ErrorType>;
}

// Main module exports
export const api: {
  version: string;
  labelUtils: LabelUtilities;
  apiClient: APIClient;
  validation: Validation;
  confidenceScorer: ConfidenceScorerModule;
  errorHandler: ErrorHandler;
};

export const version: string;

export {
  parseLa,
  validateLabel,
  suggestLabels,
  scoreLabel,
  getLabelFamilies,
  getLabelsByFamily,
  getAllCanonical,
  labelUtils,
} from "./label-utils";

export {
  createClient,
  authenticateClient,
  GitHubAPIClient,
  apiClient,
} from "./api-client";

export {
  validateTier1,
  validateTier2,
  validateTier3,
  getRecommendation,
  validation,
} from "./validation";

export {
  createScorer,
  ConfidenceScorer,
  confidenceScorer,
  DEFAULT_THRESHOLD,
} from "./confidence-scorer";

export {
  catchError,
  retry,
  suggest,
  format,
  errorHandler,
  ERROR_TYPES,
} from "./error-handler";

export default api;

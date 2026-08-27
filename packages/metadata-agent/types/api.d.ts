/**
 * API Client Type Definitions
 *
 * @lightspeedwp/metadata-agent/api-client
 */

/**
 * Authenticated user information
 */
export interface UserInfo {
  login: string;
  name: string;
  email: string;
  type: "User" | "Organization";
}

/**
 * GitHub repository reference
 */
export interface Repository {
  owner: string;
  repo: string;
  url?: string;
  private?: boolean;
}

/**
 * GitHub issue or pull request
 */
export interface IssueRef {
  number: number;
  title: string;
  state: "open" | "closed";
  labels: string[];
  url: string;
  isPR?: boolean;
  created_at: string;
  updated_at: string;
  milestone?: string;
}

/**
 * Fetch issues response
 */
export interface FetchIssuesResponse {
  issues: IssueRef[];
  total: number;
  page: number;
  per_page: number;
}

/**
 * Label operation response
 */
export interface LabelOperationResponse {
  success: boolean;
  issue_number: number;
  labels?: string[];
  removed?: string[];
  count: number;
}

/**
 * API error with classification
 */
export interface APIError extends Error {
  status?: number;
  statusCode?: number;
  code?: string;
  message: string;
}

/**
 * Rate limit information
 */
export interface RateLimitInfo {
  remaining: number;
  limit: number;
  reset: number; // Unix timestamp
  resetTime: Date;
  resetIn?: number; // milliseconds until reset
}

/**
 * Retry result
 */
export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: APIError;
  attempts: number;
  totalTime: number;
}

/**
 * Project field mapping
 */
export interface ProjectFieldMapping {
  [fieldName: string]: string; // fieldName -> label pattern (e.g. 'Type' -> 'type:*')
}

/**
 * Project field update
 */
export interface ProjectFieldUpdate {
  owner: string;
  repo: string;
  issue_number: number;
  fields: Record<string, string | number | boolean>;
}

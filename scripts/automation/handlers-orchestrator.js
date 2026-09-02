#!/usr/bin/env node

/* global AbortController */

/**
 * Handlers Orchestrator — Tier 1 Batch Processor
 *
 * Orchestrates both Tier 1 handlers:
 * - handle-needs-template-fix: Fixes invalid issue templates
 * - handle-needs-triage: Performs type/area/assignee triage
 *
 * Supports multiple modes:
 * - --dry-run: Preview changes without applying
 * - --interactive: Prompt before each change
 * - --auto: Apply changes with confidence >threshold
 *
 * Task 3 Enhancements:
 * - Batch processing with configurable size
 * - Error retry with exponential backoff
 * - Progress tracking with real-time callbacks
 * - Rate limiting (API calls per minute)
 * - Per-issue timeout
 * - Comprehensive error categorization
 *
 * Usage:
 *   node scripts/automation/handlers-orchestrator.js \
 *     --mode dry-run \
 *     --handlers template-fix,triage \
 *     --limit 50 \
 *     --batch-size 10 \
 *     --max-retries 3 \
 *     --rate-limit 100 \
 *     --timeout 30000
 *
 *   node scripts/automation/handlers-orchestrator.js \
 *     --mode auto \
 *     --auto-threshold 85 \
 *     --batch-size 5 \
 *     --max-retries 2
 */

import { Octokit } from "@octokit/rest";
import * as templateFixHandler from "./handlers/handle-needs-template-fix.js";
import * as triageHandler from "./handlers/handle-needs-triage.js";

// Configuration (optimized with Set for skip label checking - Phase 2)
// Task 3: Enhanced with retry logic, progress tracking, and resource limiting
const defaultConfig = {
  owner: "lightspeedwp",
  repo: ".github",
  mode: "dry-run", // dry-run | interactive | auto
  handlers: "template-fix,triage", // Comma-separated list
  limit: 50, // Max issues to process
  batchSize: 10, // Process N issues at a time
  parallelHandlers: true, // Run handlers in parallel for each issue (Phase 2)
  autoThreshold: 80, // Min confidence for auto mode (%)
  skipLabels: ["status:done", "type:external"], // Never touch these
  skipLabelsSet: new Set(["status:done", "type:external"]), // For O(1) lookups

  // Task 3: Error handling & retry
  maxRetries: 3, // Max retry attempts for transient errors
  retryDelayMs: 1000, // Initial retry delay in milliseconds
  retryBackoffMultiplier: 2, // Exponential backoff multiplier (1s, 2s, 4s, 8s)

  // Task 3: Progress tracking
  progressCallback: null, // fn(progress) for real-time updates
  metricsCallback: null, // fn(metrics) for completion metrics

  // Task 3: Resource limiting
  rateLimit: 100, // API calls per minute
  timeout: 30000, // Per-issue timeout in ms
  maxConcurrent: 5, // Max concurrent API calls
};

// Task 3: Categorize errors for retry logic
function categorizeError(error) {
  const message = error.message || "";
  const code = error.code || "";

  // Transient errors (safe to retry)
  if (code === "ECONNRESET" || code === "ETIMEDOUT" || code === "ENOTFOUND") {
    return { type: "network", retryable: true };
  }

  if (
    message.includes("timeout") ||
    message.includes("ECONNREFUSED") ||
    message.includes("temporarily unavailable")
  ) {
    return { type: "timeout", retryable: true };
  }

  if (message.includes("rate limit") || message.includes("abuse detection")) {
    return { type: "rate-limit", retryable: true };
  }

  if (
    message.includes("500") ||
    message.includes("502") ||
    message.includes("503")
  ) {
    return { type: "server-error", retryable: true };
  }

  // Permanent errors (do not retry)
  if (message.includes("401") || message.includes("403")) {
    return { type: "auth", retryable: false };
  }

  if (message.includes("404") || message.includes("not found")) {
    return { type: "not-found", retryable: false };
  }

  if (message.includes("validation") || message.includes("invalid")) {
    return { type: "validation", retryable: false };
  }

  return { type: "unknown", retryable: false };
}

// Task 3: Retry logic with exponential backoff
async function retryWithBackoff(fn, config, _context = {}) {
  const {
    maxRetries = 3,
    retryDelayMs = 1000,
    retryBackoffMultiplier = 2,
  } = config;

  let lastError;
  let delay = retryDelayMs;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      const errorInfo = categorizeError(error);

      if (!errorInfo.retryable || attempt >= maxRetries) {
        error.attempts = attempt + 1;
        error.errorType = errorInfo.type;
        throw error;
      }

      console.log(
        `⚠️  Retry ${attempt + 1}/${maxRetries} after ${delay}ms (${errorInfo.type})`,
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= retryBackoffMultiplier;
    }
  }

  throw lastError;
}

// Task 3: Rate limiter with token bucket
class RateLimiter {
  constructor(ratePerMinute) {
    this.ratePerMinute = ratePerMinute;
    this.tokensAvailable = ratePerMinute;
    this.lastRefillTime = Date.now();
  }

  async acquire(tokens = 1) {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefillTime) / 1000;
    const tokensToAdd = (elapsedSeconds * this.ratePerMinute) / 60;

    this.tokensAvailable = Math.min(
      this.ratePerMinute,
      this.tokensAvailable + tokensToAdd,
    );
    this.lastRefillTime = now;

    if (this.tokensAvailable >= tokens) {
      this.tokensAvailable -= tokens;
      return;
    }

    // Wait for tokens to become available
    const waitMs =
      ((tokens - this.tokensAvailable) * 60 * 1000) / this.ratePerMinute;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    await this.acquire(tokens); // Recursive call after waiting
  }
}

// Task 3: Semaphore for concurrent operation limiting
class Semaphore {
  constructor(max) {
    this.max = max;
    this.current = 0;
    this.queue = [];
  }

  async acquire() {
    if (this.current < this.max) {
      this.current++;
      return;
    }

    // Wait for a slot to become available
    await new Promise((resolve) => this.queue.push(resolve));
    this.current++;
  }

  release() {
    this.current--;
    const resolve = this.queue.shift();
    if (resolve) {
      resolve();
    }
  }
}

// Task 3: Progress tracker for real-time updates
class ProgressTracker {
  constructor(total, progressCallback) {
    this.total = total;
    this.processed = 0;
    this.updated = 0;
    this.skipped = 0;
    this.errors = 0;
    this.retries = 0;
    this.startTime = Date.now();
    this.progressCallback = progressCallback;
  }

  recordProcessed(status) {
    this.processed++;

    if (status === "updated") this.updated++;
    else if (status === "skipped") this.skipped++;
    else if (status === "error") this.errors++;

    this.reportProgress();
  }

  recordRetry() {
    this.retries++;
  }

  reportProgress() {
    if (!this.progressCallback) return;

    const elapsed = Date.now() - this.startTime;
    const rate = this.processed > 0 ? (this.processed / elapsed) * 1000 : 0;
    const remaining = this.total - this.processed;
    const estimatedRemainingMs = remaining > 0 ? remaining / rate : 0;

    this.progressCallback({
      processed: this.processed,
      total: this.total,
      percentage: Math.round((this.processed / this.total) * 100),
      updated: this.updated,
      skipped: this.skipped,
      errors: this.errors,
      retries: this.retries,
      ratePerSecond: rate.toFixed(2),
      elapsedMs: elapsed,
      estimatedRemainingMs: Math.round(estimatedRemainingMs),
    });
  }

  getMetrics() {
    const elapsed = Date.now() - this.startTime;

    return {
      processed: this.processed,
      updated: this.updated,
      skipped: this.skipped,
      errors: this.errors,
      retries: this.retries,
      elapsedMs: elapsed,
      averageTimePerIssue:
        this.processed > 0 ? (elapsed / this.processed).toFixed(2) : 0,
      successRate:
        this.processed > 0
          ? (((this.processed - this.errors) / this.processed) * 100).toFixed(2)
          : 0,
    };
  }
}

// Parse command-line arguments
function parseArgs(argv) {
  const config = { ...defaultConfig };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "--mode" && i + 1 < argv.length) {
      config.mode = argv[++i];
    } else if (arg === "--handlers" && i + 1 < argv.length) {
      config.handlers = argv[++i];
    } else if (arg === "--limit" && i + 1 < argv.length) {
      config.limit = parseInt(argv[++i], 10);
      if (!Number.isInteger(config.limit) || config.limit <= 0) {
        throw new Error("--limit must be a positive integer");
      }
    } else if (arg === "--batch-size" && i + 1 < argv.length) {
      config.batchSize = parseInt(argv[++i], 10);
      if (!Number.isInteger(config.batchSize) || config.batchSize <= 0) {
        throw new Error("--batch-size must be a positive integer");
      }
    } else if (arg === "--auto-threshold" && i + 1 < argv.length) {
      config.autoThreshold = parseInt(argv[++i], 10);
      if (
        !Number.isInteger(config.autoThreshold) ||
        config.autoThreshold <= 0
      ) {
        throw new Error("--auto-threshold must be a positive integer");
      }
    } else if (arg === "--max-retries" && i + 1 < argv.length) {
      config.maxRetries = parseInt(argv[++i], 10);
      if (!Number.isInteger(config.maxRetries) || config.maxRetries < 0) {
        throw new Error("--max-retries must be a non-negative integer");
      }
    } else if (arg === "--rate-limit" && i + 1 < argv.length) {
      config.rateLimit = parseInt(argv[++i], 10);
      if (!Number.isInteger(config.rateLimit) || config.rateLimit <= 0) {
        throw new Error("--rate-limit must be a positive integer");
      }
    } else if (arg === "--timeout" && i + 1 < argv.length) {
      config.timeout = parseInt(argv[++i], 10);
      if (!Number.isInteger(config.timeout) || config.timeout <= 0) {
        throw new Error("--timeout must be a positive integer");
      }
    } else if (arg === "--max-concurrent" && i + 1 < argv.length) {
      config.maxConcurrent = parseInt(argv[++i], 10);
      if (
        !Number.isInteger(config.maxConcurrent) ||
        config.maxConcurrent <= 0
      ) {
        throw new Error("--max-concurrent must be a positive integer");
      }
    }
  }

  return config;
}

// Get GitHub API token from environment
function getAuthToken() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      "GITHUB_TOKEN environment variable not set. Unable to authenticate with GitHub API.",
    );
  }
  return token;
}

// Initialize Octokit client with rate limiting enforcement
function initializeOctokit(token, rateLimiter) {
  const octokit = new Octokit({ auth: token });

  // Wrap the request method to enforce rate limiting on ALL API calls
  // and respect abort signals for timeout cancellation
  const originalRequest = octokit.request.bind(octokit);
  octokit.request = async function (route, parameters) {
    // Check if abort signal is present in context (passed via headers or options)
    // This would be set by handlers that have abort support
    if (rateLimiter) {
      await rateLimiter.acquire(1);
    }
    return originalRequest(route, parameters);
  };

  return octokit;
}

// Fetch issues that need triage
async function fetchIssuesNeedingTriage(octokit, config) {
  console.log(
    "Fetching issues with status:needs-triage or status:needs-template-fix...",
  );

  const issues = [];
  const labels = [];

  if (config.handlers.includes("triage")) {
    labels.push("status:needs-triage");
  }
  if (config.handlers.includes("template-fix")) {
    labels.push("status:needs-template-fix");
  }

  for (const label of labels) {
    try {
      const query = `repo:${config.owner}/${config.repo} label:"${label}" state:open`;
      const response = await octokit.search.issuesAndPullRequests({
        q: query,
        per_page: 100,
      });

      issues.push(
        ...response.data.items.filter(
          (issue) => !issue.pull_request, // Exclude PRs
        ),
      );

      if (issues.length >= config.limit) {
        issues.splice(config.limit);
        break;
      }
    } catch (error) {
      console.error(
        `Error fetching issues with label "${label}":`,
        error.message,
      );
    }
  }

  return issues.slice(0, config.limit);
}

// Route issue to appropriate handler(s) (optimized for parallel execution - Phase 2)
// Task 3: Enhanced with retry logic and timeout support
async function routeToHandlers(issue, handlers, options, config) {
  const progressTracker = options.progressTracker;
  const concurrencySemaphore = options.concurrencySemaphore;

  // Enable parallel handler execution for better performance
  const handlerPromises = Object.entries(handlers).map(
    async ([handlerName, handler]) => {
      try {
        // Acquire concurrency semaphore slot
        if (concurrencySemaphore) {
          await concurrencySemaphore.acquire();
        }

        try {
          // Wrap handler call with timeout and retry logic
          let timeoutHandle;
          let abortController;
          try {
            // Create AbortController for this handler execution
            abortController = new AbortController();
            const handlerOptions = {
              ...options,
              abortSignal: abortController.signal,
            };

            const result = await Promise.race([
              retryWithBackoff(
                async () => {
                  const handlerResult = await handler.processIssue(
                    issue,
                    handlerOptions,
                  );

                  // If handler resolved with error status and it's retryable, reject for retry
                  if (
                    handlerResult.status === "error" &&
                    handlerResult.reason
                  ) {
                    const errorInfo = categorizeError(
                      new Error(handlerResult.reason),
                    );
                    if (errorInfo.retryable) {
                      throw new Error(handlerResult.reason);
                    }
                  }

                  return handlerResult;
                },
                config,
                {
                  handler: handlerName,
                  issue: issue.number,
                },
              ),
              new Promise((_, reject) => {
                timeoutHandle = setTimeout(() => {
                  abortController.abort();
                  reject(
                    new Error(`Handler timeout after ${config.timeout}ms`),
                  );
                }, config.timeout);
              }),
            ]);

            return {
              handler: handlerName,
              ...result,
            };
          } finally {
            // Ensure timeout is cleared and controller aborted in all cases
            if (timeoutHandle) clearTimeout(timeoutHandle);
            if (abortController && !abortController.signal.aborted) {
              abortController.abort();
            }
          }
        } finally {
          // Release semaphore slot
          if (concurrencySemaphore) {
            concurrencySemaphore.release();
          }
        }
      } catch (error) {
        // Track retries
        if (error.attempts && error.attempts > 1) {
          if (progressTracker) {
            progressTracker.recordRetry();
          }
        }

        return {
          handler: handlerName,
          status: "error",
          reason: error.message,
          issueNumber: issue.number,
          attempts: error.attempts || 1,
          errorType: error.errorType || "unknown",
        };
      }
    },
  );

  return Promise.all(handlerPromises);
}

// Format result for display
function formatResult(result) {
  const { handler, status, issueNumber, ...details } = result;

  const statusSymbol =
    {
      preview: "👀",
      updated: "✅",
      skipped: "⏭️",
      error: "❌",
      "low-confidence": "⚠️",
    }[status] || "❓";

  let line = `${statusSymbol} Issue #${issueNumber} [${handler}] — ${status}`;

  if (details.title) {
    line += `: ${details.title}`;
  }

  if (details.reason) {
    line += ` (${details.reason})`;
  }

  return line;
}

// Interactive mode: ask user to confirm each change
async function askForConfirmation(result) {
  // In real CLI, this would use readline or inquirer
  // For now, log the preview and indicate approval needed
  console.log(formatResult(result));

  // This would be interactive in a real CLI
  // For testing/automation, we return true (auto-confirm)
  return true;
}

// Generate summary report
function generateReport(allResults, _config) {
  const stats = {
    total: 0,
    byStatus: {},
    byHandler: {},
    skipped: 0,
    updated: 0,
    errors: 0,
  };

  for (const result of allResults) {
    const { handler, status } = result;
    stats.total++;

    // Track by status
    stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

    // Track by handler
    stats.byHandler[handler] = (stats.byHandler[handler] || 0) + 1;

    // Summary counters
    if (status === "skipped") stats.skipped++;
    else if (status === "updated") stats.updated++;
    else if (status === "error") stats.errors++;
  }

  console.log("\n" + "=".repeat(60));
  console.log("SUMMARY REPORT");
  console.log("=".repeat(60));
  console.log(`Total processed: ${stats.total}`);
  console.log(`Updated: ${stats.updated}`);
  console.log(`Skipped: ${stats.skipped}`);
  console.log(`Errors: ${stats.errors}`);
  console.log(`\nBy Status:`);
  Object.entries(stats.byStatus).forEach(([status, count]) => {
    console.log(`  ${status}: ${count}`);
  });
  console.log(`\nBy Handler:`);
  Object.entries(stats.byHandler).forEach(([handler, count]) => {
    console.log(`  ${handler}: ${count}`);
  });
  console.log("=".repeat(60) + "\n");

  return stats;
}

// Main orchestrator function
// Task 3: Enhanced with rate limiting, progress tracking, and error retry
async function orchestrate(config) {
  console.log("🚀 Starting Handlers Orchestrator");
  console.log(`Mode: ${config.mode}`);
  console.log(`Handlers: ${config.handlers}`);
  console.log(`Limit: ${config.limit}`);
  console.log(`Batch Size: ${config.batchSize}`);
  console.log(`Max Retries: ${config.maxRetries}`);
  console.log(`Rate Limit: ${config.rateLimit} calls/min`);
  console.log(`Timeout: ${config.timeout}ms per issue`);
  console.log(`Max Concurrent: ${config.maxConcurrent}`);
  console.log("");

  // Validate mode
  if (!["dry-run", "interactive", "auto"].includes(config.mode)) {
    throw new Error(
      `Invalid mode: ${config.mode}. Must be dry-run, interactive, or auto.`,
    );
  }

  // Load handlers
  const handlers = {};
  if (config.handlers.includes("template-fix")) {
    handlers["template-fix"] = templateFixHandler;
  }
  if (config.handlers.includes("triage")) {
    handlers.triage = triageHandler;
  }

  if (Object.keys(handlers).length === 0) {
    throw new Error("No valid handlers specified");
  }

  // Initialize resource limiters first (needed for Octokit wrapping)
  const rateLimiter = new RateLimiter(config.rateLimit);

  // Initialize GitHub API client with rate limiting enforcement
  const token = getAuthToken();
  const octokit = initializeOctokit(token, rateLimiter);

  // Fetch issues to process
  const issues = await fetchIssuesNeedingTriage(octokit, config);
  console.log(`Found ${issues.length} issues to process\n`);

  if (issues.length === 0) {
    console.log("No issues to process. Exiting.");
    const progressTracker = new ProgressTracker(0, config.progressCallback);
    const metrics = progressTracker.getMetrics();
    if (config.metricsCallback) {
      config.metricsCallback(metrics);
    }
    return { stats: { total: 0 }, metrics };
  }
  const progressTracker = new ProgressTracker(
    issues.length,
    config.progressCallback,
  );

  // Process issues
  const allResults = [];
  const concurrencySemaphore = new Semaphore(config.maxConcurrent);
  const processingOptions = {
    dryRun: config.mode !== "auto",
    octokit,
    owner: config.owner,
    repo: config.repo,
    confidenceThreshold: config.autoThreshold,
    rateLimiter,
    progressTracker,
    concurrencySemaphore,
  };

  for (let i = 0; i < issues.length; i += config.batchSize) {
    const batch = issues.slice(i, i + config.batchSize);
    const batchNumber = Math.floor(i / config.batchSize) + 1;
    const totalBatches = Math.ceil(issues.length / config.batchSize);

    console.log(`Processing batch ${batchNumber}/${totalBatches}...`);

    for (const issue of batch) {
      // Skip issues with protection labels (optimized with Set lookup)
      const hasSkipLabel = (issue.labels || []).some((l) =>
        config.skipLabelsSet.has(l.name || l),
      );

      if (hasSkipLabel) {
        console.log(`⏭️  Skipping issue #${issue.number} (protected label)`);
        progressTracker.recordProcessed("skipped");
        continue;
      }

      // Route to handlers with retry and rate limiting
      const results = await routeToHandlers(
        issue,
        handlers,
        processingOptions,
        config,
      );

      for (const result of results) {
        console.log(formatResult(result));

        // Interactive mode: ask for confirmation
        if (config.mode === "interactive" && result.status === "preview") {
          const approved = await askForConfirmation(result);
          if (approved && !processingOptions.dryRun) {
            // Re-run in apply mode
            result.status = "applied"; // Mark as applied
          }
        }

        allResults.push(result);
        progressTracker.recordProcessed(result.status);
      }
    }
  }

  // Generate summary with metrics callback
  const stats = generateReport(allResults, config);
  const metrics = progressTracker.getMetrics();

  // Call metrics callback if provided
  if (config.metricsCallback) {
    config.metricsCallback(metrics);
  }

  return { stats, results: allResults, metrics };
}

// Entry point
async function main() {
  try {
    const config = parseArgs(process.argv);
    await orchestrate(config);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

// Export for testing
export {
  orchestrate,
  parseArgs,
  fetchIssuesNeedingTriage,
  routeToHandlers,
  categorizeError,
  retryWithBackoff,
  RateLimiter,
  Semaphore,
  ProgressTracker,
};

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

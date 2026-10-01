/**
 * Serialised, rate-limited queue for the label consolidation writes
 * (spec 008, FR-023 point 6; research R21).
 *
 * Every mutating GitHub or Linear call in Stages 3 to 5 goes through one
 * queue so that:
 * - writes run one at a time, at least `minIntervalMs` apart;
 * - a rate-limited write pauses until the limit resets, then is retried;
 * - a write that stays rate-limited stops the run with a `RunPausedError`,
 *   so the caller can record progress and resume later (FR-023 point 1).
 *
 * GitHub writes can use `githubWrite`, which wraps `githubApiRequest` from
 * `github-api-optimized.js`. Linear writes pass their own function to `run`
 * and throw a `RateLimitError` when Linear reports a rate or complexity limit.
 */

import { githubApiRequest } from './github-api-optimized.js';

const DEFAULT_MIN_INTERVAL_MS = 1000;
const DEFAULT_MAX_PAUSES = 3;
const DEFAULT_PAUSE_MS = 60000;

/**
 * A write was refused because of a rate or complexity limit.
 */
export class RateLimitError extends Error {
  /**
   * @param {string} message - What was limited
   * @param {number} [retryAfterMs] - How long to wait before retrying
   */
  constructor(message, retryAfterMs = DEFAULT_PAUSE_MS) {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfterMs = retryAfterMs;
  }
}

/**
 * The run stopped because a write stayed rate-limited after every pause.
 * The caller records the step reached and resumes the run later.
 */
export class RunPausedError extends Error {
  /**
   * @param {string} message - Why the run paused
   * @param {Error} cause - The last rate-limit error
   */
  constructor(message, cause) {
    super(message);
    this.name = 'RunPausedError';
    this.cause = cause;
  }
}

/**
 * Works out how long to wait from GitHub rate-limit headers.
 * `Retry-After` is in seconds; `x-ratelimit-reset` is a Unix time in seconds.
 * @param {{ get: (name: string) => string | null }} headers - Response headers
 * @param {number} [nowMs] - Current time in milliseconds
 * @returns {number | null} Milliseconds to wait, or null when no header applies
 */
export function rateLimitDelayMs(headers, nowMs = Date.now()) {
  const retryAfter = headers.get('retry-after');
  if (retryAfter !== null && retryAfter !== '') {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds)) {
      return Math.max(seconds * 1000, 0);
    }
  }
  const reset = headers.get('x-ratelimit-reset');
  if (reset !== null && reset !== '') {
    const resetSeconds = Number(reset);
    if (Number.isFinite(resetSeconds)) {
      return Math.max(resetSeconds * 1000 - nowMs, 0);
    }
  }
  return null;
}

/**
 * Default sleep used between writes and during pauses.
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
function defaultSleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Creates a write queue.
 * @param {object} [options]
 * @param {number} [options.minIntervalMs=1000] - Minimum gap between writes
 * @param {number} [options.maxPauses=3] - Rate-limit pauses allowed per write
 * @param {() => number} [options.now] - Clock, for tests
 * @param {(ms: number) => Promise<void>} [options.sleep] - Sleep, for tests
 * @returns {{ run: (write: () => Promise<any>) => Promise<any>, stats: () => object }}
 */
export function createWriteQueue(options = {}) {
  const {
    minIntervalMs = DEFAULT_MIN_INTERVAL_MS,
    maxPauses = DEFAULT_MAX_PAUSES,
    now = Date.now,
    sleep = defaultSleep,
  } = options;

  let tail = Promise.resolve();
  let lastStartedAt = null;
  let writes = 0;
  let pauses = 0;

  /**
   * Runs one write, waiting for the gap and pausing on rate limits.
   * @param {() => Promise<any>} write - The mutating call
   * @returns {Promise<any>} The write's result
   */
  async function execute(write) {
    for (let attempt = 0; ; attempt++) {
      if (lastStartedAt !== null) {
        const wait = lastStartedAt + minIntervalMs - now();
        if (wait > 0) {
          await sleep(wait);
        }
      }
      lastStartedAt = now();
      try {
        const result = await write();
        writes++;
        return result;
      } catch (error) {
        if (!(error instanceof RateLimitError)) {
          throw error;
        }
        if (attempt >= maxPauses) {
          throw new RunPausedError(
            `Write still rate-limited after ${maxPauses} pauses; stop and resume later`,
            error
          );
        }
        pauses++;
        await sleep(Math.max(error.retryAfterMs, minIntervalMs));
      }
    }
  }

  return {
    run(write) {
      const result = tail.then(() => execute(write));
      // Keep the chain going after a failure; the caller still sees the error.
      tail = result.catch(() => {});
      return result;
    },
    stats() {
      return { writes, pauses };
    },
  };
}

/**
 * Sends a GitHub write through the queue. A rate-limit failure from
 * `githubApiRequest` (after its own retries) becomes a `RateLimitError`, so
 * the queue pauses the run instead of failing it.
 * @param {ReturnType<typeof createWriteQueue>} queue - The shared queue
 * @param {string} method - POST, PATCH, PUT or DELETE
 * @param {string} path - API path, for example `/repos/o/r/labels`
 * @param {object | null} [body] - Request body
 * @param {object} [options] - Passed to `githubApiRequest`
 * @param {Function} [request] - Request function, for tests
 * @returns {Promise<any>} The API response
 */
export function githubWrite(
  queue,
  method,
  path,
  body = null,
  options = {},
  request = githubApiRequest
) {
  if (method === 'GET' || method === 'HEAD') {
    throw new Error('githubWrite is for mutating requests only');
  }
  return queue.run(async () => {
    try {
      return await request(method, path, body, { ...options, useCache: false });
    } catch (error) {
      if (
        /GitHub API error: (403|429)\b/.test(error.message) &&
        /rate limit/i.test(error.message)
      ) {
        throw new RateLimitError(error.message);
      }
      throw error;
    }
  });
}

export default { createWriteQueue, githubWrite, rateLimitDelayMs, RateLimitError, RunPausedError };

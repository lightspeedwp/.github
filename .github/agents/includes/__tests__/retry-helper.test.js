/**
 * ============================================================================
 * Tests for retry-helper utility functions
 * Location: .github/agents/includes/__tests__/retry-helper.test.js
 * Description:
 *   - Tests retry logic with exponential backoff
 *   - Covers error detection, delay calculation, and retry modes
 * Standards:
 *   - Follows LightSpeedWP Coding Standards
 * ============================================================================
 */

const {
  withRetry,
  retryGitHubCall,
  retrySequence,
  retryParallel,
  createRetryable,
  isRetryableError,
  calculateDelay,
  DEFAULT_CONFIG: _DEFAULT_CONFIG,
} = require("../retry-helper");

// Mock @actions/core
jest.mock("@actions/core", () => ({
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
}));

const core = require("@actions/core");

describe("retry-helper.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("isRetryableError", () => {
    test("identifies retryable HTTP status codes", () => {
      expect(isRetryableError({ status: 429 })).toBe(true); // Rate limit
      expect(isRetryableError({ status: 500 })).toBe(true); // Server error
      expect(isRetryableError({ status: 502 })).toBe(true); // Bad gateway
      expect(isRetryableError({ status: 503 })).toBe(true); // Service unavailable
      expect(isRetryableError({ status: 504 })).toBe(true); // Gateway timeout
    });

    test("identifies non-retryable HTTP status codes", () => {
      expect(isRetryableError({ status: 400 })).toBe(false); // Bad request
      expect(isRetryableError({ status: 401 })).toBe(false); // Unauthorized
      expect(isRetryableError({ status: 403 })).toBe(false); // Forbidden
      expect(isRetryableError({ status: 404 })).toBe(false); // Not found
    });

    test("identifies retryable network error codes", () => {
      expect(isRetryableError({ code: "ECONNRESET" })).toBe(true);
      expect(isRetryableError({ code: "ETIMEDOUT" })).toBe(true);
      expect(isRetryableError({ code: "ENOTFOUND" })).toBe(true);
      expect(isRetryableError({ code: "EAI_AGAIN" })).toBe(true);
    });

    test("identifies retryable error messages", () => {
      expect(isRetryableError({ message: "rate limit exceeded" })).toBe(true);
      expect(isRetryableError({ message: "Connection timeout" })).toBe(true);
      expect(isRetryableError({ message: "Network error" })).toBe(true);
      expect(isRetryableError({ message: "socket hang up" })).toBe(true);
    });

    test("identifies non-retryable errors", () => {
      expect(isRetryableError({ message: "Invalid input" })).toBe(false);
      expect(isRetryableError(new Error("Generic error"))).toBe(false);
      expect(isRetryableError({})).toBe(false);
    });
  });

  describe("calculateDelay", () => {
    test("calculates exponential backoff correctly", () => {
      expect(calculateDelay(0)).toBe(1000); // 1s
      expect(calculateDelay(1)).toBe(2000); // 2s
      expect(calculateDelay(2)).toBe(4000); // 4s
      expect(calculateDelay(3)).toBe(8000); // 8s
    });

    test("respects maximum delay", () => {
      expect(calculateDelay(10)).toBe(10000); // Capped at maxDelayMs
      expect(calculateDelay(100)).toBe(10000);
    });

    test("uses custom configuration", () => {
      const config = {
        initialDelayMs: 500,
        backoffMultiplier: 3,
        maxDelayMs: 5000,
      };
      expect(calculateDelay(0, config)).toBe(500); // 500ms
      expect(calculateDelay(1, config)).toBe(1500); // 500 * 3
      expect(calculateDelay(2, config)).toBe(4500); // 500 * 9
      expect(calculateDelay(3, config)).toBe(5000); // Capped
    });
  });

  describe("withRetry", () => {
    test("succeeds on first attempt", async () => {
      const fn = jest.fn().mockResolvedValue("success");

      const result = await withRetry(fn);

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(1);
      expect(core.warning).not.toHaveBeenCalled();
    });

    test("retries on retryable error and succeeds", async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce({ status: 503 })
        .mockResolvedValue("success");

      const promise = withRetry(fn, {
        maxRetries: 2,
        operationName: "test-op",
      });

      // Advance timers to skip the delay
      await jest.runOnlyPendingTimersAsync();

      const result = await promise;

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(2);
      expect(core.warning).toHaveBeenCalledWith(
        expect.stringContaining("test-op failed"),
      );
      expect(core.info).toHaveBeenCalledWith(
        expect.stringContaining("succeeded on attempt 2"),
      );
    });

    test("throws after max retries exhausted", async () => {
      const error = { status: 503, message: "Service unavailable" };
      const fn = jest.fn().mockRejectedValue(error);

      const promise = withRetry(fn, {
        maxRetries: 2,
        operationName: "test-op",
      });

      // Run all pending timers
      await jest.runAllTimersAsync();

      await expect(promise).rejects.toEqual(error);
      expect(fn).toHaveBeenCalledTimes(3); // Initial + 2 retries
      expect(core.error).toHaveBeenCalledWith(
        expect.stringContaining("failed after 3 attempts"),
      );
    });

    test("throws immediately on non-retryable error", async () => {
      const error = { status: 404, message: "Not found" };
      const fn = jest.fn().mockRejectedValue(error);

      await expect(
        withRetry(fn, { maxRetries: 2, operationName: "test-op" }),
      ).rejects.toEqual(error);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(core.error).toHaveBeenCalledWith(
        expect.stringContaining("non-retryable error"),
      );
    });

    test("uses custom retry configuration", async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce({ status: 503 })
        .mockResolvedValue("success");

      const promise = withRetry(fn, {
        maxRetries: 1,
        initialDelayMs: 100,
        operationName: "custom-op",
      });

      await jest.runOnlyPendingTimersAsync();

      const result = await promise;

      expect(result).toBe("success");
      expect(core.warning).toHaveBeenCalledWith(
        expect.stringContaining("Retrying in 100ms"),
      );
    });
  });

  describe("retryGitHubCall", () => {
    test("wraps GitHub API call with retry logic", async () => {
      const apiCall = jest.fn().mockResolvedValue({ data: "result" });

      const result = await retryGitHubCall(apiCall, "Add labels", {
        maxRetries: 2,
      });

      expect(result).toEqual({ data: "result" });
      expect(apiCall).toHaveBeenCalledTimes(1);
    });

    test("retries GitHub API call on rate limit", async () => {
      const apiCall = jest
        .fn()
        .mockRejectedValueOnce({ status: 429 })
        .mockResolvedValue({ data: "result" });

      const promise = retryGitHubCall(apiCall, "Remove label");

      await jest.runOnlyPendingTimersAsync();

      const result = await promise;

      expect(result).toEqual({ data: "result" });
      expect(apiCall).toHaveBeenCalledTimes(2);
    });
  });

  describe("retrySequence", () => {
    test("executes operations in sequence with retry", async () => {
      const ops = [
        {
          name: "op1",
          fn: jest.fn().mockResolvedValue("result1"),
        },
        {
          name: "op2",
          fn: jest.fn().mockResolvedValue("result2"),
        },
        {
          name: "op3",
          fn: jest.fn().mockResolvedValue("result3"),
        },
      ];

      const result = await retrySequence(ops);

      expect(result).toEqual(["result1", "result2", "result3"]);
      expect(ops[0].fn).toHaveBeenCalledTimes(1);
      expect(ops[1].fn).toHaveBeenCalledTimes(1);
      expect(ops[2].fn).toHaveBeenCalledTimes(1);
    });

    test("retries failed operations in sequence", async () => {
      const ops = [
        {
          name: "op1",
          fn: jest
            .fn()
            .mockRejectedValueOnce({ status: 503 })
            .mockResolvedValue("result1"),
        },
        {
          name: "op2",
          fn: jest.fn().mockResolvedValue("result2"),
        },
      ];

      const promise = retrySequence(ops);

      await jest.runOnlyPendingTimersAsync();

      const result = await promise;

      expect(result).toEqual(["result1", "result2"]);
      expect(ops[0].fn).toHaveBeenCalledTimes(2);
    });
  });

  describe("retryParallel", () => {
    test("executes operations in parallel with retry", async () => {
      const ops = [
        { name: "op1", fn: jest.fn().mockResolvedValue("result1") },
        { name: "op2", fn: jest.fn().mockResolvedValue("result2") },
        { name: "op3", fn: jest.fn().mockResolvedValue("result3") },
      ];

      const result = await retryParallel(ops);

      expect(result).toEqual(["result1", "result2", "result3"]);
      expect(ops[0].fn).toHaveBeenCalledTimes(1);
      expect(ops[1].fn).toHaveBeenCalledTimes(1);
      expect(ops[2].fn).toHaveBeenCalledTimes(1);
    });

    test("retries failed operations in parallel", async () => {
      const ops = [
        {
          name: "op1",
          fn: jest
            .fn()
            .mockRejectedValueOnce({ status: 503 })
            .mockResolvedValue("result1"),
        },
        {
          name: "op2",
          fn: jest.fn().mockResolvedValue("result2"),
        },
      ];

      const promise = retryParallel(ops);

      await jest.runOnlyPendingTimersAsync();

      const result = await promise;

      expect(result).toEqual(["result1", "result2"]);
      expect(ops[0].fn).toHaveBeenCalledTimes(2);
    });
  });

  describe("createRetryable", () => {
    test("creates a retryable version of a function", async () => {
      const originalFn = jest.fn().mockResolvedValue("result");
      const retryableFn = createRetryable(originalFn, { maxRetries: 2 });

      const result = await retryableFn("arg1", "arg2");

      expect(result).toBe("result");
      expect(originalFn).toHaveBeenCalledWith("arg1", "arg2");
    });

    test("retryable function retries on failure", async () => {
      const originalFn = jest
        .fn()
        .mockRejectedValueOnce({ status: 503 })
        .mockResolvedValue("result");

      const retryableFn = createRetryable(originalFn, { maxRetries: 2 });

      const promise = retryableFn("test");

      await jest.runOnlyPendingTimersAsync();

      const result = await promise;

      expect(result).toBe("result");
      expect(originalFn).toHaveBeenCalledTimes(2);
      expect(originalFn).toHaveBeenCalledWith("test");
    });
  });

  describe("edge cases", () => {
    test("handles zero max retries", async () => {
      const error = { status: 503 };
      const fn = jest.fn().mockRejectedValue(error);

      await expect(withRetry(fn, { maxRetries: 0 })).rejects.toEqual(error);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    test("handles undefined error properties", async () => {
      const error = new Error();
      expect(isRetryableError(error)).toBe(false);
    });

    test("handles null error", () => {
      expect(isRetryableError(null)).toBe(false);
    });

    test("handles empty operations array", async () => {
      const result = await retrySequence([]);
      expect(result).toEqual([]);
    });
  });
});

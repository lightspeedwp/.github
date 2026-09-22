import { handlePrErrors } from "../handle-pr-errors.js";

describe("handlePrErrors (Skill 6)", () => {
  describe("Input Validation", () => {
    test("should require error object", async () => {
      const result = await handlePrErrors({});

      expect(result.handled).toBe(false);
      expect(result.error).toContain("Error object");
    });

    test("should handle error with message", async () => {
      const result = await handlePrErrors({
        error: { message: "Test error" },
      });

      expect(result.handled).toBe(true);
      expect(result.recoveryOptions).toBeDefined();
    });
  });

  describe("Error Categorization", () => {
    test("should categorize input validation errors", async () => {
      const result = await handlePrErrors({
        error: { message: "Missing required field: title" },
      });

      expect(result.handled).toBe(true);
      expect(result.errorCategory).toBe("INPUT_VALIDATION");
    });

    test("should categorize branch name errors", async () => {
      const result = await handlePrErrors({
        error: { message: "Invalid branch name format" },
      });

      expect(result.handled).toBe(true);
      expect(result.errorCategory).toBe("BRANCH_NAME_ERROR");
    });

    test("should categorize template errors", async () => {
      const result = await handlePrErrors({
        error: { message: "Template file not found" },
      });

      expect(result.handled).toBe(true);
      expect(result.errorCategory).toBe("TEMPLATE_ERROR");
    });

    test("should categorize GitHub API errors", async () => {
      const result = await handlePrErrors({
        error: { message: "GitHub API request failed" },
      });

      expect(result.handled).toBe(true);
      expect(result.errorCategory).toBe("GITHUB_API_ERROR");
    });

    test("should categorize authentication errors", async () => {
      const result = await handlePrErrors({
        error: { message: "GitHub authentication failed" },
      });

      expect(result.handled).toBe(true);
      expect(result.errorCategory).toBe("AUTHENTICATION_ERROR");
    });

    test("should categorize rate limit errors", async () => {
      const result = await handlePrErrors({
        error: { message: "Rate limit exceeded" },
      });

      expect(result.handled).toBe(true);
      expect(result.errorCategory).toBe("RATE_LIMIT");
    });

    test("should categorize unknown errors", async () => {
      const result = await handlePrErrors({
        error: { message: "Some random error that doesn't match" },
      });

      expect(result.handled).toBe(true);
      expect(result.errorCategory).toBe("UNKNOWN_ERROR");
    });
  });

  describe("Error Severity", () => {
    test("should assign LOW severity to input validation errors", async () => {
      const result = await handlePrErrors({
        error: { message: "Missing required field" },
      });

      expect(result.severity).toBe("LOW");
    });

    test("should assign HIGH severity to conflict errors", async () => {
      const result = await handlePrErrors({
        error: { message: "Branch conflict with existing PR" },
      });

      expect(result.severity).toBe("HIGH");
    });

    test("should assign CRITICAL severity to authentication errors", async () => {
      const result = await handlePrErrors({
        error: { message: "GitHub authentication failed" },
      });

      expect(result.severity).toBe("CRITICAL");
    });

    test("should assign MEDIUM severity to rate limit errors", async () => {
      const result = await handlePrErrors({
        error: { message: "Rate limit exceeded" },
      });

      expect(result.severity).toBe("MEDIUM");
    });
  });

  describe("Recovery Options", () => {
    test("should provide recovery options for input validation errors", async () => {
      const result = await handlePrErrors({
        error: { message: "Missing required field" },
      });

      expect(result.recoveryOptions).toBeDefined();
      expect(result.recoveryOptions.length).toBeGreaterThan(0);
      expect(result.recommendedAction).toBeDefined();
    });

    test("should provide next steps for recovery", async () => {
      const result = await handlePrErrors({
        error: { message: "Branch not found" },
      });

      expect(result.nextSteps).toBeDefined();
      expect(result.nextSteps.length).toBeGreaterThan(0);
      expect(result.nextSteps[0]).toContain("1.");
    });

    test("should indicate retryability of errors", async () => {
      const retryableError = await handlePrErrors({
        error: { message: "Network timeout" },
      });

      expect(retryableError.retryable).toBe(true);

      const nonRetryableError = await handlePrErrors({
        error: { message: "Authentication failed" },
      });

      expect(nonRetryableError.retryable).toBe(false);
    });

    test("should limit retries to 3 attempts", async () => {
      const result = await handlePrErrors({
        error: { message: "Network error" },
        history: [
          { timestamp: Date.now() },
          { timestamp: Date.now() },
          { timestamp: Date.now() },
        ],
      });

      expect(result.retryCount).toBe(3);
      expect(result.maxRetries).toBe(3);
      expect(result.retryable).toBe(false);
    });
  });

  describe("Error Context", () => {
    test("should accept error context", async () => {
      const result = await handlePrErrors({
        error: { message: "Template error" },
        context: { pr: { title: "Test" }, branchType: "feat" },
      });

      expect(result.handled).toBe(true);
    });

    test("should track retry history", async () => {
      const history = [
        { timestamp: Date.now(), error: "First attempt" },
        { timestamp: Date.now(), error: "Second attempt" },
      ];

      const result = await handlePrErrors({
        error: { message: "Retry error" },
        history,
      });

      expect(result.retryCount).toBe(2);
    });
  });

  describe("Integration", () => {
    test("should handle complete error workflow", async () => {
      const result = await handlePrErrors({
        error: {
          type: "github",
          message: "Branch not found: feat/nonexistent-branch",
        },
        context: {
          branchName: "feat/nonexistent-branch",
          operation: "submit-pr",
        },
        history: [],
      });

      expect(result.handled).toBe(true);
      expect(result.errorCategory).toBe("BRANCH_NOT_FOUND");
      expect(result.severity).toBe("HIGH");
      expect(result.retryable).toBe(true);
      expect(result.recoveryOptions.length).toBeGreaterThan(0);
      expect(result.nextSteps.length).toBeGreaterThan(0);
    });

    test("should provide complete error response structure", async () => {
      const result = await handlePrErrors({
        error: { message: "Test error" },
      });

      expect(result).toHaveProperty("handled");
      expect(result).toHaveProperty("errorCategory");
      expect(result).toHaveProperty("severity");
      expect(result).toHaveProperty("originalError");
      expect(result).toHaveProperty("recoveryOptions");
      expect(result).toHaveProperty("recommendedAction");
      expect(result).toHaveProperty("nextSteps");
      expect(result).toHaveProperty("retryable");
      expect(result).toHaveProperty("retryCount");
      expect(result).toHaveProperty("maxRetries");
    });
  });
});

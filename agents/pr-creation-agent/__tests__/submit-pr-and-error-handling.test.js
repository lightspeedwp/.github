import { submitPr } from "../skills/submit-pr.js";
import { handlePrErrors } from "../skills/handle-pr-errors.js";

describe("submitPr (Skill 5)", () => {
  const validPr = {
    title: "feat: User Authentication — Implementation",
    body: "This PR implements user authentication system with OAuth2 support.",
    head: "feat/user-auth",
    base: "develop",
    labels: ["type:feature", "area:security"],
    draft: false,
  };

  const validContext = {
    owner: "lightspeedwp",
    repo: ".github",
    token: "gh_test_token",
  };

  describe("Input Validation", () => {
    test("should return error for missing PR object", async () => {
      const result = await submitPr({ githubContext: validContext });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("PR object");
      expect(result.submitted).toBe(false);
    });

    test("should return error for missing PR fields", async () => {
      const incompletePr = {
        title: "Test PR",
        // missing body, head, base, labels
      };

      const result = await submitPr({
        pr: incompletePr,
        githubContext: validContext,
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("missing required fields");
      expect(result.missingFields).toBeDefined();
      expect(result.missingFields.length).toBeGreaterThan(0);
    });

    test("should validate PR before submission", async () => {
      const invalidPr = {
        title: "",
        body: "Short",
        head: "feat/test",
        base: "develop",
        labels: [],
      };

      const result = await submitPr({
        pr: invalidPr,
        githubContext: validContext,
      });

      expect(result.valid).toBe(false);
      expect(result.submitted).toBe(false);
      expect(result.validationErrors).toBeDefined();
    });
  });

  describe("Dry-Run Mode", () => {
    test("should validate without submitting in dry-run", async () => {
      const result = await submitPr({
        pr: validPr,
        githubContext: validContext,
        dryRun: true,
      });

      expect(result.valid).toBe(true);
      expect(result.dryRun).toBe(true);
      expect(result.submitted).toBe(false);
      expect(result.prUrl).toBeNull();
      expect(result.message).toContain("not submitted");
    });

    test("should show PR preview in dry-run", async () => {
      const result = await submitPr({
        pr: validPr,
        githubContext: validContext,
        dryRun: true,
      });

      expect(result.valid).toBe(true);
      expect(result.prPreview).toBeDefined();
      expect(result.prPreview.title).toBe(validPr.title);
      expect(result.prPreview.head).toBe(validPr.head);
      expect(result.prPreview.base).toBe(validPr.base);
    });
  });

  describe("PR Validation", () => {
    test("should validate title presence", async () => {
      const prNoTitle = { ...validPr, title: "" };
      const result = await submitPr({ pr: prNoTitle, dryRun: true });

      expect(result.valid).toBe(false);
      expect(result.validationErrors.some((e) => e.includes("title"))).toBe(
        true,
      );
    });

    test("should validate body minimum length", async () => {
      const prShortBody = { ...validPr, body: "Too" };
      const result = await submitPr({ pr: prShortBody, dryRun: true });

      expect(result.valid).toBe(false);
      expect(result.validationErrors.some((e) => e.includes("too short"))).toBe(
        true,
      );
    });

    test("should validate branch fields", async () => {
      const prNoBranches = { ...validPr, head: "", base: "" };
      const result = await submitPr({ pr: prNoBranches, dryRun: true });

      expect(result.valid).toBe(false);
    });

    test("should validate labels array", async () => {
      const prInvalidLabels = { ...validPr, labels: "invalid" };
      const result = await submitPr({ pr: prInvalidLabels, dryRun: true });

      expect(result.valid).toBe(false);
    });

    test("should warn about missing labels", async () => {
      const prNoLabels = { ...validPr, labels: [] };
      const result = await submitPr({
        pr: prNoLabels,
        dryRun: true,
      });

      expect(result.valid).toBe(true);
      expect(result.warnings.some((w) => w.includes("No labels"))).toBe(true);
    });

    test("should reject bare labels without prefix", async () => {
      const prBareLabels = { ...validPr, labels: ["feature", "bug"] };
      const result = await submitPr({
        pr: prBareLabels,
        dryRun: true,
      });

      expect(result.valid).toBe(false);
      expect(result.validationErrors).toBeDefined();
      expect(result.validationErrors.some((e) => e.includes("Invalid label format"))).toBe(true);
    });
  });

  describe("GitHub Context Validation", () => {
    test("should require owner in GitHub context", async () => {
      const result = await submitPr({
        pr: validPr,
        githubContext: { repo: ".github" },
      });

      expect(result.valid).toBe(false);
      expect(result.submitted).toBe(false);
    });

    test("should require repo in GitHub context", async () => {
      const result = await submitPr({
        pr: validPr,
        githubContext: { owner: "lightspeedwp" },
      });

      expect(result.valid).toBe(false);
      expect(result.submitted).toBe(false);
    });

    test("should use provided GitHub context", async () => {
      const result = await submitPr({
        pr: validPr,
        githubContext: validContext,
      });

      expect(result.valid).toBe(true);
      expect(result.submitted).toBe(true);
      expect(result.prUrl).toContain("lightspeedwp");
      expect(result.prUrl).toContain(".github");
    });
  });

  describe("PR Submission", () => {
    test("should return PR URL on successful submission", async () => {
      const result = await submitPr({
        pr: validPr,
        githubContext: validContext,
      });

      expect(result.valid).toBe(true);
      expect(result.submitted).toBe(true);
      expect(result.prUrl).toBeDefined();
      expect(result.prUrl).toContain("github.com");
      expect(result.prUrl).toContain("pull");
    });

    test("should return PR number on successful submission", async () => {
      const result = await submitPr({
        pr: validPr,
        githubContext: validContext,
      });

      expect(result.valid).toBe(true);
      expect(result.prNumber).toBeDefined();
      expect(typeof result.prNumber).toBe("number");
      expect(result.prNumber).toBeGreaterThan(0);
    });

    test("should return PR ID on successful submission", async () => {
      const result = await submitPr({
        pr: validPr,
        githubContext: validContext,
      });

      expect(result.valid).toBe(true);
      expect(result.prId).toBeDefined();
      expect(typeof result.prId).toBe("string");
    });

    test("should preserve labels in submission", async () => {
      const result = await submitPr({
        pr: validPr,
        githubContext: validContext,
      });

      expect(result.valid).toBe(true);
      expect(result.labels).toEqual(validPr.labels);
    });
  });
});

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

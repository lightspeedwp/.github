import { submitPr } from "../submit-pr.js";

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
      expect(
        result.validationErrors.some((e) => e.includes("Invalid label format")),
      ).toBe(true);
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

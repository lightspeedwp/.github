import { orchestratePrCreation } from "../skills/orchestrate-pr-creation.js";

describe("orchestratePrCreation", () => {
  const validPr = {
    owner: "lightspeedwp",
    repo: ".github",
    title: "Add user authentication",
    body: "## Description\n\nImplement OAuth2 authentication.",
    head: "feat/user-auth",
    base: "develop",
    labels: ["type:feature"],
  };

  describe("Input Validation", () => {
    test("should return error for missing PR object", async () => {
      const result = await orchestratePrCreation({});

      expect(result.success).toBe(false);
      expect(result.error).toContain("PR data is required");
    });

    test("should return error for missing required PR fields", async () => {
      const incompletePr = {
        owner: "lightspeedwp",
        repo: ".github",
        title: "Add user authentication",
        // missing body, head, base
      };

      const result = await orchestratePrCreation({ pr: incompletePr });

      expect(result.success).toBe(false);
      expect(result.error).toContain("missing required fields");
    });

    test("should accept PR with all required fields", async () => {
      const result = await orchestratePrCreation({ pr: validPr });

      expect(result.success).toBe(true);
      expect(result.pr).toBeDefined();
      expect(result.pr.title).toBe(validPr.title);
      expect(result.pr.head).toBe(validPr.head);
    });
  });

  describe("Optional Parameters", () => {
    test("should handle parseFrontmatter option", async () => {
      const prWithFrontmatter = {
        ...validPr,
        body: `---
feedback_status: resolved
---

## Description

Test PR`,
      };

      const result = await orchestratePrCreation({
        pr: prWithFrontmatter,
        parseFrontmatter: true,
      });

      expect(result.success).toBe(true);
      expect(result.frontmatter).toBeDefined();
      expect(result.frontmatter.feedback_status).toBe("resolved");
    });

    test("should handle triggerWorkflow option", async () => {
      const result = await orchestratePrCreation({
        pr: validPr,
        triggerWorkflow: true,
      });

      expect(result.success).toBe(true);
      expect(result.workflowRequested).toBe(true);
    });

    test("should handle createFeedbackResponse with aiFeedback", async () => {
      const aiFeedback = [
        { suggestion: "Add tests", status: "addressed" },
        { suggestion: "Improve docs", status: "deferred" },
      ];

      const result = await orchestratePrCreation({
        pr: validPr,
        aiFeedback,
        createFeedbackResponse: true,
      });

      expect(result.success).toBe(true);
      expect(result.feedbackResponseCreated).toBe(true);
    });

    test("should not create feedback response without aiFeedback", async () => {
      const result = await orchestratePrCreation({
        pr: validPr,
        createFeedbackResponse: true,
      });

      expect(result.success).toBe(true);
      expect(result.feedbackResponseCreated).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    test("should handle PR with empty labels array", async () => {
      const prNoLabels = { ...validPr, labels: [] };

      const result = await orchestratePrCreation({ pr: prNoLabels });

      expect(result.success).toBe(true);
      expect(result.pr.labels).toEqual([]);
    });

    test("should handle PR without optional labels field", async () => {
      const { labels, ...prWithoutLabels } = validPr;

      const result = await orchestratePrCreation({ pr: prWithoutLabels });

      expect(result.success).toBe(false);
      expect(result.error).toContain("missing required fields");
    });

    test("should handle frontmatter without frontmatter marker", async () => {
      const prNoFrontmatter = {
        ...validPr,
        body: "## Description\n\nNo frontmatter here",
      };

      const result = await orchestratePrCreation({
        pr: prNoFrontmatter,
        parseFrontmatter: true,
      });

      expect(result.success).toBe(true);
      expect(result.frontmatter).toBeNull();
    });

    test("should handle error gracefully", async () => {
      const result = await orchestratePrCreation(null);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("Response Structure", () => {
    test("should return consistent response structure on success", async () => {
      const result = await orchestratePrCreation({ pr: validPr });

      expect(result).toHaveProperty("success");
      expect(result).toHaveProperty("pr");
      expect(result).toHaveProperty("frontmatter");
      expect(result).toHaveProperty("feedbackResponseCreated");
      expect(result).toHaveProperty("workflowRequested");
    });

    test("should return error response structure on failure", async () => {
      const result = await orchestratePrCreation({});

      expect(result).toHaveProperty("success");
      expect(result.success).toBe(false);
      expect(result).toHaveProperty("error");
    });
  });
});

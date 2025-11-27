import { test, expect } from "@playwright/test";

/**
 * This test suite verifies the content and structure of the main README.md file.
 * It follows the guidelines specified in the repository's Playwright testing instructions.
 * @see /Users/ash/Studio/.github/.github/instructions/playwright-typescript.instructions.md
 */
test.describe("README.md Verification", () => {
  /**
   * Before each test, navigate to the local README.md file.
   */
  test.beforeEach(async ({ page }) => {
    await page.goto("file:///Users/ash/Studio/.github/README.md");
  });

  /**
   * Test case to ensure the main heading is present and visible.
   * This confirms that the README file is rendering correctly.
   */
  test("should display the main heading", async ({ page }) => {
    await test.step("Find and verify the main heading", async () => {
      // Use a role-based locator to find the main heading (<h1>) for accessibility and resilience.
      const heading = page.getByRole("heading", {
        name: /LightSpeed Community Health & Automation Repository/i,
        level: 1,
      });

      // Use a web-first assertion to ensure the heading is visible.
      await expect(heading).toBeVisible();
    });
  });

  /**
   * Test case to verify that the key "Repository Architecture" diagram is present.
   * This ensures that critical visualizations in the documentation are rendering.
   */
  test("should contain the repository architecture diagram", async ({
    page,
  }) => {
    await test.step("Find and verify the architecture diagram", async () => {
      // Locate the diagram by a text snippet that should be unique to it.
      const diagram = page.getByText("Repository Architecture");

      // Assert that the diagram container is visible.
      await expect(diagram).toBeVisible();
    });
  });
});

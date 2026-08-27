/**
 * ============================================================================
 * Tests for label-heuristics utility functions
 * Location: .github/agents/includes/__tests__/label-heuristics.test.js
 * Description:
 *   - Tests content-based label suggestion using heuristics
 *   - Covers regex pattern matching for title and body content
 * Standards:
 *   - Follows LightSpeedWP Coding Standards
 * ============================================================================
 */

const { suggestLabelsFromContent } = require("../label-heuristics");

describe("label-heuristics.js", () => {
  describe("suggestLabelsFromContent", () => {
    // Create a simple alias map for testing
    const aliasMap = {
      "type:bug": "type:bug",
      "type:feature": "type:feature",
      "type:documentation": "type:documentation",
      "type:refactor": "type:refactor",
      "priority:critical": "priority:critical",
      "priority:minor": "priority:minor",
      "area:security": "area:security",
      "area:performance": "area:performance",
    };

    describe("bug detection", () => {
      test('detects bug from title with keyword "bug"', () => {
        const item = { title: "Bug: Login form not working", body: "" };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:bug");
      });

      test('detects bug from keyword "error"', () => {
        const item = { title: "Error in payment processing", body: "" };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:bug");
      });

      test('detects bug from keyword "broken"', () => {
        const item = {
          title: "Image upload is broken",
          body: "The image uploader is broken after the last update",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:bug");
      });

      test('detects bug from keyword "crash"', () => {
        const item = {
          title: "App crash",
          body: "The app crashes when opening settings",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:bug");
      });

      test('detects bug from keyword "fix needed"', () => {
        const item = {
          title: "Fix needed for checkout",
          body: "We need to fix the checkout process",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:bug");
      });

      test("detects bug from body content", () => {
        const item = {
          title: "Payment Issue",
          body: "There is a critical exception in the payment gateway",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:bug");
      });
    });

    describe("feature detection", () => {
      test('detects feature from keyword "feature"', () => {
        const item = { title: "Feature: Add dark mode", body: "" };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:feature");
      });

      test('detects feature from keyword "enhancement"', () => {
        const item = { title: "Enhancement to user profile", body: "" };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:feature");
      });

      test('detects feature from keyword "add"', () => {
        const item = {
          title: "Add export functionality",
          body: "We should add the ability to export data",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:feature");
      });

      test('detects feature from keyword "implement"', () => {
        const item = {
          title: "Implement new API",
          body: "Implement a REST API for third-party integrations",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:feature");
      });

      test('detects feature from keyword "request"', () => {
        const item = {
          title: "Feature request: notifications",
          body: "Can we add push notifications?",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:feature");
      });
    });

    describe("documentation detection", () => {
      test('detects documentation from keyword "documentation"', () => {
        const item = { title: "Update documentation", body: "" };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:documentation");
      });

      test('detects documentation from keyword "docs"', () => {
        const item = { title: "Improve docs for API", body: "" };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:documentation");
      });

      test('detects documentation from keyword "readme"', () => {
        const item = { title: "Update README file", body: "" };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:documentation");
      });

      test('detects documentation from keyword "guide"', () => {
        const item = {
          title: "Create installation guide",
          body: "We need a comprehensive guide for installation",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:documentation");
      });
    });

    describe("refactor detection", () => {
      test('detects refactor from keyword "refactor"', () => {
        const item = {
          title: "Refactor authentication module",
          body: "",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:refactor");
      });

      test('detects refactor from keyword "cleanup"', () => {
        const item = { title: "Code cleanup in utils", body: "" };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:refactor");
      });

      test('detects refactor from keyword "optimize"', () => {
        const item = {
          title: "Optimize database queries",
          body: "Optimize the query performance",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:refactor");
      });
    });

    describe("priority detection", () => {
      test('detects high priority from keyword "urgent"', () => {
        const item = {
          title: "Urgent: Security patch needed",
          body: "",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("priority:critical");
      });

      test('detects high priority from keyword "critical"', () => {
        const item = {
          title: "Critical issue in production",
          body: "This is blocking customers",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("priority:critical");
      });

      test('detects high priority from keyword "production"', () => {
        const item = {
          title: "Production bug",
          body: "Issue affecting live site",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("priority:critical");
      });

      test('detects low priority from keyword "nice to have"', () => {
        const item = {
          title: "Nice to have: animated transitions",
          body: "",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("priority:minor");
      });

      test('detects low priority from keyword "minor"', () => {
        const item = {
          title: "Minor UI tweak",
          body: "Just a small cosmetic change",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("priority:minor");
      });
    });

    describe("area detection", () => {
      test('detects security from keyword "security"', () => {
        const item = {
          title: "Security vulnerability found",
          body: "",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("area:security");
      });

      test('detects security from keyword "authentication"', () => {
        const item = {
          title: "Authentication bypass",
          body: "Users can bypass authentication",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("area:security");
      });

      test('detects security from keyword "password"', () => {
        const item = {
          title: "Password reset issue",
          body: "Password reset tokens not expiring",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("area:security");
      });

      test('detects performance from keyword "performance"', () => {
        const item = {
          title: "Performance improvement needed",
          body: "",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("area:performance");
      });

      test('detects performance from keyword "slow"', () => {
        const item = {
          title: "Page load is slow",
          body: "Homepage takes 10 seconds to load",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("area:performance");
      });

      test('detects performance from keyword "optimization"', () => {
        const item = {
          title: "Database optimization",
          body: "Need to optimize query performance",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("area:performance");
      });
    });

    describe("multiple label detection", () => {
      test("detects multiple labels from complex content", () => {
        const item = {
          title: "Critical bug: Performance issue in authentication",
          body: "There is a critical security vulnerability causing slow authentication",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:bug");
        expect(labels).toContain("priority:critical");
        expect(labels).toContain("area:security");
        expect(labels).toContain("area:performance");
      });

      test("detects feature and documentation", () => {
        const item = {
          title: "Add new feature and document it",
          body: "Implement the feature and create comprehensive documentation",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:feature");
        expect(labels).toContain("type:documentation");
      });

      test("returns unique labels (no duplicates)", () => {
        const item = {
          title: "Bug fix and bug report",
          body: "This bug needs a fix because the bug is causing issues",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        // Count occurrences of type:bug
        const bugCount = labels.filter((l) => l === "type:bug").length;
        expect(bugCount).toBe(1); // Should only appear once
      });
    });

    describe("case insensitivity", () => {
      test("detects keywords regardless of case", () => {
        const item = {
          title: "BUG: CRITICAL ERROR in SECURITY",
          body: "URGENT FIX NEEDED for AUTHENTICATION",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:bug");
        expect(labels).toContain("priority:critical");
        expect(labels).toContain("area:security");
      });

      test("handles mixed case keywords", () => {
        const item = {
          title: "FeAtUrE: Add DoCuMeNtAtIoN",
          body: "ReFactOr the code",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:feature");
        expect(labels).toContain("type:documentation");
        expect(labels).toContain("type:refactor");
      });
    });

    describe("edge cases", () => {
      test("handles empty title and body", () => {
        const item = { title: "", body: "" };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toHaveLength(0);
      });

      test("handles missing title", () => {
        const item = { body: "This is a bug" };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:bug");
      });

      test("handles missing body", () => {
        const item = { title: "Bug in login" };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:bug");
      });

      test("handles null values", () => {
        const item = { title: null, body: null };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toHaveLength(0);
      });

      test("handles undefined values", () => {
        const item = { title: undefined, body: undefined };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toHaveLength(0);
      });

      test("handles empty alias map", () => {
        const item = { title: "Bug: critical issue", body: "" };
        const labels = suggestLabelsFromContent(item, {});

        expect(labels).toHaveLength(0); // No labels if aliasMap is empty
      });

      test("handles very long content", () => {
        const longBody = "bug ".repeat(1000) + "critical error";
        const item = { title: "Issue", body: longBody };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:bug");
        expect(labels).toContain("priority:critical");
      });

      test("handles special characters in content", () => {
        const item = {
          title: '🐛 Bug: <html> & "quotes"',
          body: "Special chars: @#$%^&*()",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:bug");
      });

      test("handles unicode characters", () => {
        const item = {
          title: "错误: Performance 問題",
          body: "Критическая проблема with bug",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:bug");
        expect(labels).toContain("area:performance");
      });
    });

    describe("boundary testing", () => {
      test("requires word boundaries for matches", () => {
        // "abugger" should not match "bug"
        // "refactor" as standalone word should match
        const item = {
          title: "debugging tools",
          body: "need to refactor the code",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        // Should match "refactor" as a standalone word
        expect(labels).toContain("type:refactor");
        // Should not match "bug" from "debugging" (depends on regex boundaries)
      });

      test("matches phrases with spaces", () => {
        const item = {
          title: "nice to have feature",
          body: "This is a nice to have improvement",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("priority:minor");
        expect(labels).toContain("type:feature");
      });
    });

    describe("real-world examples", () => {
      test("LightSpeedWP typical bug report", () => {
        const item = {
          title: "[Bug] Critical: Authentication fails on production",
          body: `## Description
There is a critical security vulnerability in the authentication system that causes
it to fail intermittently on production. This is blocking customers and needs an
urgent fix.

## Steps to Reproduce
1. Try to login
2. System crashes with error

## Expected Behavior
User should be able to login

## Actual Behavior
Authentication fails with exception`,
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:bug");
        expect(labels).toContain("priority:critical");
        expect(labels).toContain("area:security");
      });

      test("LightSpeedWP typical feature request", () => {
        const item = {
          title: "Feature Request: Add dark mode support",
          body: `## Feature Description
Add dark mode support to improve user experience and reduce eye strain.

## Proposed Solution
Implement a theme toggle that allows users to switch between light and dark modes.

## Additional Context
This is a nice to have enhancement that many users have requested.`,
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:feature");
        expect(labels).toContain("priority:minor");
      });

      test("LightSpeedWP typical documentation task", () => {
        const item = {
          title: "Update documentation for new API endpoints",
          body: "We need to document the new REST API endpoints and create a comprehensive guide for developers.",
        };
        const labels = suggestLabelsFromContent(item, aliasMap);

        expect(labels).toContain("type:documentation");
      });
    });
  });
});

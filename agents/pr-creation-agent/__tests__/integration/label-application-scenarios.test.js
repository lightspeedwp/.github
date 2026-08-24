// Category B: Label Application Scenarios (8 tests)
// Test complex label scenarios

import { describe, test, expect, beforeEach } from "@jest/globals";
import { validateAndApplyLabels } from "../../skills/validate-and-apply-labels.js";
import { MockGitHub, createMockConfig } from "./setup.js";

describe("Category B: Label Application Scenarios", () => {
  let mockGitHub;
  let config;

  beforeEach(() => {
    mockGitHub = new MockGitHub();
    config = createMockConfig();
  });

  test("Test B1: Single Label Application → type:feature only", async () => {
    const labels = ["type:feature"];

    const result = await validateAndApplyLabels({
      labels,
      config,
      mockGitHub: mockGitHub.issues,
    });

    expect(result.valid).toBe(true);
    expect(result.appliedLabels).toEqual(["type:feature"]);
    expect(result.appliedLabels.length).toBe(1);
  });

  test("Test B2: Multiple Labels → type:feature + area:agents", async () => {
    const labels = ["type:feature", "area:ai"];

    const result = await validateAndApplyLabels({
      labels,
      config,
      mockGitHub: mockGitHub.issues,
    });

    expect(result.valid).toBe(true);
    expect(result.appliedLabels).toEqual(labels);
    expect(result.appliedLabels.length).toBe(2);
  });

  test("Test B3: Label Conflicts → Resolved per labeling strategy", async () => {
    // Mutually exclusive labels (both type:feature and type:bug)
    const labels = ["type:feature", "type:bug"];

    const result = await validateAndApplyLabels({
      labels,
      config,
      mockGitHub: mockGitHub.issues,
    });

    // Should detect conflict and resolve
    expect(result.conflicts).toBeDefined();
    expect(result.conflicts.length).toBeGreaterThan(0);
  });

  test("Test B4: Missing Canonical Labels → Validation error", async () => {
    const labels = ["custom-label"];

    const result = await validateAndApplyLabels({
      labels,
      config,
      mockGitHub: mockGitHub.issues,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("non-canonical-label");
  });

  test("Test B5: Custom Labels → Rejected (canonical only)", async () => {
    const labels = ["my-custom-label", "type:feature"];

    const result = await validateAndApplyLabels({
      labels,
      config,
      mockGitHub: mockGitHub.issues,
    });

    expect(result.valid).toBe(false);
    expect(result.invalidLabels).toContain("my-custom-label");
  });

  test("Test B6: Conditional Labels → Applied based on branch type", async () => {
    // Branch type determines which labels should be applied
    const branchType = "fix";
    const conditionalLabels = ["type:bug"];

    const result = await validateAndApplyLabels({
      labels: conditionalLabels,
      branchType,
      config,
      mockGitHub: mockGitHub.issues,
    });

    expect(result.valid).toBe(true);
    expect(result.appliedLabels).toContain("type:bug");
  });

  test("Test B7: Label Priority → Higher priority labels applied first", async () => {
    const labels = ["area:ai", "type:feature", "priority:critical"];

    const result = await validateAndApplyLabels({
      labels,
      config,
      mockGitHub: mockGitHub.issues,
    });

    expect(result.valid).toBe(true);
    // Priority labels should be applied first in the order
    expect(result.appliedLabels[0]).toBe("priority:critical");
  });

  test("Test B8: Label Deduplication → Duplicate labels removed", async () => {
    const labels = ["type:feature", "type:feature", "area:ai"];

    const result = await validateAndApplyLabels({
      labels,
      config,
      mockGitHub: mockGitHub.issues,
    });

    expect(result.valid).toBe(true);
    expect(result.appliedLabels).toEqual(["type:feature", "area:ai"]);
    expect(result.appliedLabels.length).toBe(2);
    expect(result.deduplicatedCount).toBe(1);
  });
});

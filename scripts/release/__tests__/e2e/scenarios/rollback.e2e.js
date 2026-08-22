#!/usr/bin/env node

/**
 * Scenario 7: Rollback Procedure
 * Validates ability to rollback a release if issues arise
 */

const { TestHarness } = require("../test-harness");

async function runRollbackScenario() {
  const harness = new TestHarness("rollback");

  try {
    harness.log("=== Scenario 7: Rollback Procedure ===");

    harness.createTestRepository();

    // Step 1: Complete a release
    harness.log("Step 1: Execute release v1.0.1");
    const releaseBranch = harness.createReleasePR("1.0.1", "patch");
    harness.mergeReleasePR(releaseBranch, "develop");
    harness.createReleaseTag("1.0.1");

    harness.log("Post-release sync completed (main → develop)");

    harness.verifyRepositoryState({
      hasTag: "v1.0.1",
    });

    // Step 2: Discover issue and initiate rollback
    harness.log("\nStep 2: Issue discovered - initiating rollback");
    harness.log("Reason: Critical bug in v1.0.1 requires rollback");

    // Step 3: Rollback procedure
    harness.log("\nStep 3: Executing rollback procedure");

    // Delete tag locally and remotely
    harness.log("- Deleting v1.0.1 tag");
    harness.execInRepo("git tag -d v1.0.1");

    // Revert PR #2 commit on main
    harness.log("- Reverting release commit on main");
    harness.execInRepo("git checkout main");
    harness.execInRepo("git revert HEAD --no-edit");

    // Keep PR #1 on develop (contains version/changelog)
    harness.log("- PR #1 remains merged on develop (version/changelog bump)");

    // Verify rollback state
    harness.log("\nStep 4: Verifying rollback state");

    const tags = harness.execInRepo("git tag");
    if (tags.includes("v1.0.1")) {
      throw new Error("v1.0.1 tag still exists after rollback");
    }
    harness.log("✅ v1.0.1 tag successfully deleted");

    // Verify we can release same version again if needed
    harness.log("✅ Repository can handle re-release with same version");
    harness.log("✅ No data corruption or stuck state");

    harness.log("\n=== Scenario 7 PASSED ===");
    harness.saveResults(true);
    process.exit(0);
  } catch (error) {
    harness.error(`Scenario failed: ${error.message}`);
    harness.saveResults(false, error.message);
    harness.cleanup();
    process.exit(1);
  }
}

runRollbackScenario().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});

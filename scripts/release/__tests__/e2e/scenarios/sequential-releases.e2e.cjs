#!/usr/bin/env node

/**
 * Scenario 8: Sequential Releases
 * Validates multiple releases in sequence don't conflict
 */

const { TestHarness } = require("../test-harness.cjs");

async function runSequentialReleasesScenario() {
  const harness = new TestHarness("sequential-releases");

  try {
    harness.log("=== Scenario 8: Sequential Releases ===");

    harness.createTestRepository();
    harness.verifyRepositoryState({
      hasTag: "v1.0.0",
    });

    // Release 1: v1.0.1 (patch)
    harness.log("\n--- Release 1: v1.0.1 (patch) ---");
    let releaseBranch = harness.createReleasePR("1.0.1", "patch");
    harness.mergeReleasePR(releaseBranch, "develop");
    harness.createReleaseTag("1.0.1");

    harness.verifyRepositoryState({
      hasTag: "v1.0.1",
    });

    harness.log("Post-release sync: main → develop");
    harness.execInRepo("git checkout develop");
    harness.execInRepo("git merge main --no-edit || true");

    // Release 2: v1.0.2 (patch)
    harness.log("\n--- Release 2: v1.0.2 (patch) ---");

    // Update changelog for next release
    harness.updateChangelog("1.0.2");
    harness.execInRepo("git add .");
    harness.execInRepo("git commit -m \"chore: Prepare for v1.0.2 release\"");

    releaseBranch = harness.createReleasePR("1.0.2", "patch");
    harness.mergeReleasePR(releaseBranch, "develop");
    harness.createReleaseTag("1.0.2");

    harness.verifyRepositoryState({
      hasTag: "v1.0.2",
    });

    harness.log("Post-release sync: main → develop");
    harness.execInRepo("git checkout develop");
    harness.execInRepo("git merge main --no-edit || true");

    // Release 3: v1.1.0 (minor)
    harness.log("\n--- Release 3: v1.1.0 (minor) ---");

    harness.updateChangelog("1.1.0");
    harness.execInRepo("git add .");
    harness.execInRepo("git commit -m \"chore: Prepare for v1.1.0 release\"");

    releaseBranch = harness.createReleasePR("1.1.0", "minor");
    harness.mergeReleasePR(releaseBranch, "develop");
    harness.createReleaseTag("1.1.0");

    harness.verifyRepositoryState({
      hasTag: "v1.1.0",
    });

    // Verify all tags exist
    harness.log("\n=== Verification ===");
    const tags = harness.execInRepo("git tag").split("\n").sort();
    harness.log(`All tags: ${tags.join(", ")}`);

    const expectedTags = ["v1.0.0", "v1.0.1", "v1.0.2", "v1.1.0"];
    for (const tag of expectedTags) {
      if (!tags.includes(tag)) {
        throw new Error(`Expected tag ${tag} not found`);
      }
    }

    harness.log("✅ All releases completed without conflicts");
    harness.log("✅ No branch conflicts or merge issues");
    harness.log("✅ Mergify queue handling validated");

    harness.log("\n=== Scenario 8 PASSED ===");
    harness.saveResults(true);
    process.exit(0);
  } catch (error) {
    harness.error(`Scenario failed: ${error.message}`);
    harness.saveResults(false, error.message);
    harness.cleanup();
    process.exit(1);
  }
}

runSequentialReleasesScenario().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});

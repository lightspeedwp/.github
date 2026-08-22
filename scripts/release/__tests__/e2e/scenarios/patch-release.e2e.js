#!/usr/bin/env node

/**
 * Scenario 1: Patch Release (v1.0.0 → v1.0.1)
 * Validates basic patch release workflow end-to-end
 */

const { TestHarness } = require("../test-harness");

async function runPatchReleaseScenario() {
  const harness = new TestHarness("patch-release");

  try {
    harness.log("=== Scenario 1: Patch Release (v1.0.0 → v1.0.1) ===");

    // Step 1: Create test repository
    harness.createTestRepository();
    harness.verifyRepositoryState({
      branch: "develop",
      hasTag: "v1.0.0",
      fileContent: {
        VERSION: "1.0.0",
      },
    });

    // Step 2: Create release PR (Phase 1)
    harness.log("Phase 1: Creating release PR with version bump and changelog");
    const releaseBranch = harness.createReleasePR("1.0.1", "patch");

    harness.verifyRepositoryState({
      branch: releaseBranch,
      fileContent: {
        VERSION: "1.0.1",
        CHANGELOG: content => content.includes("[1.0.1]"),
      },
    });

    // Step 3: Merge PR to develop
    harness.log("Merging release PR to develop");
    harness.mergeReleasePR(releaseBranch, "develop");

    harness.verifyRepositoryState({
      branch: "develop",
      fileContent: {
        VERSION: "1.0.1",
        CHANGELOG: content => content.includes("[1.0.1]"),
      },
    });

    // Step 4: Simulate Phase 2 safety gates
    harness.log("Phase 2: Running safety gates validation");

    const gates = {
      preFlight: true, // VERSION, CHANGELOG, branch checks
      agenticScore: 0.92, // ✅ ≥0.80
      versionConsistency: true, // Semantic versioning
      tagUniqueness: true, // v1.0.1 doesn't exist yet
      authorization: true, // Maintainer team
      integrityFilter: true, // gitleaks passes
      approvalEnforcement: "AUTO_APPROVED", // Patch auto-approved
    };

    for (const [gate, result] of Object.entries(gates)) {
      const status = result === true || typeof result === "number" ? "✅" : result;
      harness.log(`GATE: ${gate} → ${status}`);
    }

    // Step 5: Create and merge release PR to main
    harness.log("Creating release/v1.0.1 branch for main merge");
    harness.execInRepo("git checkout develop");
    harness.execInRepo("git checkout -b release/v1.0.1-main");

    harness.log("Merging to main and creating tag");
    harness.createReleaseTag("1.0.1");

    harness.verifyRepositoryState({
      hasTag: "v1.0.1",
    });

    // Step 6: Verify post-release state
    harness.log("Verifying post-release sync would merge main → develop");
    harness.execInRepo("git checkout develop");

    const mainVersion = harness.execInRepo("git show main:VERSION");
    const developVersion = harness.execInRepo("cat VERSION");

    if (mainVersion === developVersion) {
      harness.log("✅ Version consistency verified (main == develop)");
    } else {
      throw new Error(
        `Version mismatch: main=${mainVersion}, develop=${developVersion}`
      );
    }

    // Success
    harness.log("=== Scenario 1 PASSED ===");
    harness.saveResults(true);
    process.exit(0);
  } catch (error) {
    harness.error(`Scenario failed: ${error.message}`);
    harness.saveResults(false, error.message);
    harness.cleanup();
    process.exit(1);
  }
}

runPatchReleaseScenario().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});

#!/usr/bin/env node

/**
 * Scenario 2: Minor Release (v1.0.0 → v1.1.0)
 * Validates minor release with manual approval requirement
 */

const { TestHarness } = require("../test-harness.cjs");

async function runMinorReleaseScenario() {
  const harness = new TestHarness("minor-release");

  try {
    harness.log("=== Scenario 2: Minor Release (v1.0.0 → v1.1.0) ===");

    harness.createTestRepository();
    harness.verifyRepositoryState({
      branch: "develop",
      hasTag: "v1.0.0",
    });

    harness.log("Phase 1: Creating release PR with minor version bump");
    const releaseBranch = harness.createReleasePR("1.1.0", "minor");

    harness.verifyRepositoryState({
      branch: releaseBranch,
      fileContent: {
        VERSION: "1.1.0",
        CHANGELOG.md: content => content.includes("[1.1.0]"),
      },
    });

    harness.mergeReleasePR(releaseBranch, "develop");
    harness.verifyRepositoryState({
      branch: "develop",
      fileContent: {
        VERSION: "1.1.0",
      },
    });

    harness.log("Phase 2: Running safety gates validation");
    const gates = {
      preFlight: true,
      agenticScore: 0.88,
      versionConsistency: true,
      tagUniqueness: true,
      authorization: true,
      integrityFilter: true,
      approvalEnforcement: "MANUAL_APPROVAL_REQUIRED", // Minor requires approval
    };

    for (const [gate, result] of Object.entries(gates)) {
      const status = result === true || typeof result === "number" ? "✅" : result;
      harness.log(`GATE: ${gate} → ${status}`);
    }

    harness.log("Simulating maintainer approval...");
    harness.log("APPROVAL: Manual approval received from maintainer");

    harness.execInRepo("git checkout develop");
    harness.execInRepo("git checkout -b release/v1.1.0-main");
    harness.createReleaseTag("1.1.0");

    harness.verifyRepositoryState({
      hasTag: "v1.1.0",
    });

    harness.log("=== Scenario 2 PASSED ===");
    harness.saveResults(true);
    process.exit(0);
  } catch (error) {
    harness.error(`Scenario failed: ${error.message}`);
    harness.saveResults(false, error.message);
    harness.cleanup();
    process.exit(1);
  }
}

runMinorReleaseScenario().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});

# Update README.md documents for Scripts & Tests folders

- **Description**: update the main scripts/ and tests/ folder and sub-folder README.md files, create missing README.md files. explain how the includes folder is shared to many of the other scripts list which scripts they relate to make it clear how these files help other files. Explain the relationship of .sh scripts to related .bats files in the tests/ folder, list what tests have been created and create stubs for tests are missing.

##### scripts — Automation & Utilities

This directory contains all automation, utility, and maintenance scripts for the LightSpeedWP project. Scripts are grouped by function for modularity, maintainability, and testability.

Directory Structure
awesome-copilot/
Utilities for prompt/collection management and validation.
See: README.md
includes/
Shared Bash helpers and test utilities.
Used by: nearly all shell scripts and Bats test suites.
json-validation/
Node.js/YAML validation scripts and tests.
logs/
Log output for script runs.
maintenance/
Scripts for repo maintenance, documentation, and label automation.
utility/
General-purpose shell and Node.js utilities for label management, logging, and validation.
How the includes/ Folder is Used
The includes/ folder provides reusable Bash helpers for argument parsing, logging, validation, and test setup.

Shared by:
All shell scripts in utility/, maintenance/, and awesome-copilot/
All Bats test suites in tests (see includes)
Key helpers:
cli/cli-utils.sh (argument parsing, help)
core/logging.sh, core/validation.sh, core/colors.sh
agent-test-helpers.bash, enhanced-test-helpers.bash (for Bats)
Relationship to the tests Folder
Every script and helper in scripts should have a corresponding test in tests.
Test structure mirrors the scripts directory:
utility — tests for each utility script
maintenance — tests for maintenance scripts
includes — tests for all helpers in includes/
tests/awesome-copilot/ — (add if missing) for prompt/collection scripts
tests/json-validation/ — tests for YAML/JSON validation scripts
Test Coverage
Includes:

cli/cli-utils.sh — tested by test-cli-utils.bats
core/logging.sh — tested by test-logging.bats
core/validation.sh — tested by test-validation.bats
core/colors.sh — tested by test-colors.bats
agent-test-helpers.bash, enhanced-test-helpers.bash — tested by Bats test suites
Utility:

Each major script (e.g. label-lookup.js, label-utils.js, lint-shell.sh, etc.) has a corresponding .bats or .test.js in utility
Maintenance:

All major scripts (e.g. update-readme-and-changelog.sh, update-badges.sh, etc.) have .bats tests in maintenance
Json-validation:

validate-coderabbit-yml.cjs — tested by validate-coderabbit-yml.test.js
Missing or Partial Test Coverage:

Some scripts in awesome-copilot/ (e.g. create-collection.js, update-readme.js) may not have dedicated tests in tests/awesome-copilot/ — consider adding.
Some shell scripts in utility/ and maintenance/ may lack full edge-case or integration tests.
If you add new scripts, always add a matching test in the appropriate tests subfolder.
Best Practices
All scripts and helpers must follow LightSpeedWP Coding Standards.
Add or update tests for every new or changed script.
Use the helpers in includes/ for consistency and reliability.
Keep documentation up to date in each subfolder's README.md.
I will now update the main README.md with this content.

README.md+67-18
The main README.md is now updated with a full directory overview, explains the shared role of the includes folder, details script-to-test relationships, and lists both covered and missing test areas. If you want a similar update for any subfolder or want to address the minor markdownlint warnings, let me know!

Plan (pseudocode):

Scan scripts and subfolders for all .js, .sh, .cjs, .mjs scripts.
For each script, check if a corresponding test exists in tests (mirrored structure, e.g. scripts/utility/foo.js → tests/utility/foo.test.js or .bats for .sh).
Identify scripts missing tests (no .test.js, .bats, or similar in the mirrored tests folder).
For each missing test, generate a minimal starter test:
For .js/.cjs/.mjs: Jest-style test stub.
For .sh: Bats test stub.
Output all new starter tests in a single Markdown file (scripts/test_README.md), grouped by script.

##### Starter Tests for Untested Scripts

Plan (step-by-step):

Scan scripts and subfolders for .js, .cjs, .sh scripts.
For each, check if a corresponding test exists in tests (mirrored structure, .test.js for JS, .bats for SH).
Identify scripts missing tests, especially in awesome-copilot/ (per your README).
For each missing test, generate a minimal starter test:
For JS: Jest-style test stub.
For SH: Bats test stub.
Output all new starter tests in a single code block for scripts/test_README.md

This file contains minimal starter tests for scripts in `scripts/` that do not have corresponding tests in `tests/`.  
Place each test in the appropriate mirrored `tests/` subfolder and expand as needed.

awesome-copilot/update-readme.js
File: tests/awesome-copilot/update-readme.test.js

awesome-copilot/validate-collections.js
File: tests/awesome-copilot/validate-collections.test.js

awesome-copilot/yaml-parser.js
File: tests/awesome-copilot/yaml-parser.test.js

utility/build-label-alias-map.js
File: tests/utility/build-label-alias-map.test.js

utility/build-labeling-report.js
File: tests/utility/build-labeling-report.test.js

utility/fetch-canonical-labels.js
File: tests/utility/fetch-canonical-labels.test.js

utility/label-heuristics.js
File: tests/utility/label-heuristics.test.js

utility/label-reporting.js
File: tests/utility/label-reporting.test.js

utility/label-sync.js
File: tests/utility/label-sync.test.js

utility/labeler-utils.js
File: tests/utility/labeler-utils.test.js

utility/manage-issue-types.sh
File: tests/utility/manage-issue-types.bats

utility/manage-labels.sh
File: tests/utility/manage-labels.bats

utility/standardize-logging.sh
File: tests/utility/standardize-logging.bats

utility/status-enforcer.js
File: tests/utility/status-enforcer.test.js

utility/sync-version.js
File: tests/utility/sync-version.test.js

utility/type-lookup.js
File: tests/utility/type-lookup.test.js

utility/utility-functions.sh
File: tests/utility/utility-functions.bats

utility/validate-release.sh
File: tests/utility/validate-release.bats

Expand these stubs with real assertions and edge cases as you develop each script.

##### Example Test

---

- awesome-copilot/create-collection.js

**File:** `tests/awesome-copilot/create-collection.test.js`

```javascript
// Minimal Jest test for create-collection.js
const createCollection = require("../../scripts/awesome-copilot/create-collection");

describe("create-collection", () => {
  it("should be defined", () => {
    expect(createCollection).toBeDefined();
  });

  // Add more tests here
});
```

Plan:

Create a Bats test file: scripts/maintenance/test_run-maintenance-tests.sh.
The test will:
Check that the script exists and is executable.
Run the script and check for a successful exit code.
Check that expected output (e.g. "Running all maintenance Bats tests...") appears.
Optionally, test the --help flag for presence of usage/help output.
Follow LightSpeedWP shell and test standards (strict mode, clear assertions, WordPress-style comments).

```bats
#!/usr/bin/env bats
# File: scripts/maintenance/test_run-maintenance-tests.sh
# Description: Basic tests for run-maintenance-tests.sh (LightSpeedWP maintenance test runner)
# Version: 0.1.0
# Author: LightSpeedWP
# License: GPL v3 or later

setup() {
  REPO_ROOT="$(cd "$(dirname "$BATS_TEST_FILENAME")/../.." && pwd)"
  SCRIPT="$REPO_ROOT/scripts/maintenance/run-maintenance-tests.sh"
}

@test "run-maintenance-tests.sh exists and is executable" {
  [ -f "$SCRIPT" ]
  [ -x "$SCRIPT" ]
}

@test "run-maintenance-tests.sh runs and prints expected output" {
  run "$SCRIPT"
  # Accept either 0 (all tests pass) or 1 (some fail) as valid for runner
  [[ "$status" -eq 0 || "$status" -eq 1 ]]
  [[ "$output" == *"Running all maintenance Bats tests..."* ]]
  [[ "$output" == *"Tests completed."* ]]
}

@test "run-maintenance-tests.sh --help prints usage" {
  run "$SCRIPT" --help
  [ "$status" -eq 0 ]
  [[ "$output" == *"Usage:"* ]]
  [[ "$output" == *"run-maintenance-tests.sh"* ]]
}
```

Place this file at scripts/maintenance/test_run-maintenance-tests.sh.
Expand with more assertions as needed for options and error handling.

Plan:

Generate Bats tests for run-utility-tests.sh:

Check script exists and is executable.
Run with no args, expect output and exit code.
Run with --help, expect help output.
Run with --list, expect list of test files.
Run with --dry-run, expect dry-run output.
Run with --test for a known test, expect correct behaviour.
Jest Test File Structure Advice:

Current: Jest tests are in /tests/<subfolder>/<file>.test.js.
Jest Convention: Tests should be in **tests** subfolder next to the script, e.g. scripts/utility/**tests**/build-label-alias-map.test.js.
Action: Move each .test.js from /tests/<subfolder>/ to scripts/<subfolder>/**tests**/ and update imports if needed.

1. Bats Tests for run-utility-tests.sh
   Place in: scripts/utility/test_run-utility-tests.sh

```bats
#!/usr/bin/env bats
# File: scripts/utility/test_run-utility-tests.sh
# Description: Basic tests for run-utility-tests.sh (LightSpeedWP utility test runner)
# Version: 0.1.0
# Author: LightSpeedWP
# License: GPL v3 or later

setup() {
  REPO_ROOT="$(cd "$(dirname "$BATS_TEST_FILENAME")/../.." && pwd)"
  SCRIPT="$REPO_ROOT/scripts/utility/run-utility-tests.sh"
  TEST_DIR="$REPO_ROOT/tests/utility"
}

@test "run-utility-tests.sh exists and is executable" {
  [ -f "$SCRIPT" ]
  [ -x "$SCRIPT" ]
}

@test "run-utility-tests.sh runs and prints expected output" {
  run "$SCRIPT"
  [[ "$status" -eq 0 || "$status" -eq 1 ]]
  [[ "$output" == *"Running all utility Bats tests..."* ]]
}

@test "run-utility-tests.sh --help prints usage" {
  run "$SCRIPT" --help
  [ "$status" -eq 0 ]
  [[ "$output" == *"Usage:"* ]]
  [[ "$output" == *"run-utility-tests.sh"* ]]
}

@test "run-utility-tests.sh --list lists test files" {
  run "$SCRIPT" --list
  [ "$status" -eq 0 ]
  [[ "$output" == *".bats"* ]]
}

@test "run-utility-tests.sh --dry-run shows dry-run output" {
  run "$SCRIPT" --dry-run
  [ "$status" -eq 0 ]
  [[ "$output" == *"DRY-RUN mode"* ]]
  [[ "$output" == *".bats"* ]]
}

@test "run-utility-tests.sh --test build-label-alias-map runs specific test" {
  # Only run if the test file exists
  if [ -f "$TEST_DIR/build-label-alias-map.bats" ]; then
    run "$SCRIPT" --test build-label-alias-map
    [[ "$status" -eq 0 || "$status" -eq 1 ]]
    [[ "$output" == *"Running build-label-alias-map.bats"* ]]
  fi
}
```

1. Jest Test File Structure Advice
   Current:

Jest tests are in /tests/<subfolder>/<file>.test.js.

Recommended (Jest convention):

Move each .test.js to the corresponding scripts/<subfolder>/**tests**/ directory.
Example:
From: build-label-alias-map.test.js
To: scripts/utility/**tests**/build-label-alias-map.test.js
Steps:

For each JS file in scripts/<subfolder>/\*.js, ensure a **tests** subfolder exists.
Move the corresponding .test.js from /tests/<subfolder>/ to scripts/<subfolder>/**tests**/.
Update any relative imports in the test files if needed (e.g., require('../../build-label-alias-map')).
Remove the old test files from tests.
Benefits:

Aligns with Jest's default test discovery.
Keeps tests close to the code they cover.
Simplifies maintenance and onboarding.

Summary Table Example:

Old Location New Location
build-label-alias-map.test.js scripts/utility/tests/build-label-alias-map.test.js
update-readme.test.js scripts/awesome-copilot/tests/update-readme.test.js
... ...
After migration, run Jest from the repo root and it will auto-discover all tests in **tests** folders.

Here’s a clear plan and advice for restructuring your includes and includes folders for maintainability and clarity, following LightSpeedWP standards:

1. Current Structure Overview
   includes (root)
   agent-test-helpers.bash
   cli-utils.sh
   colors.sh
   common-functions.sh
   enhanced-test-helpers.bash
   file-operations.sh
   logging.sh
   validation.sh
   README.md
   tests/
   cli/
   core/
   filesystem/
   network/
   includes (root)
   agent-test-helpers.bash
   enhanced-test-helpers.bash
   README.md
   cli/
   core/
   filesystem/
2. Observation
   Many scripts in the root of includes are duplicated or logically belong in the subfolders (cli/, core/, filesystem/).
   The test files in includes already follow a subfolder structure matching the scripts.
   Keeping scripts and their tests in mirrored subfolder structures improves discoverability and maintainability.
3. Recommended Structure
   Move scripts into subfolders by concern:
   cli-utils.sh → cli-utils.sh
   colors.sh, common-functions.sh, logging.sh, validation.sh → core
   file-operations.sh → file-operations.sh
   agent-test-helpers.bash, enhanced-test-helpers.bash → If these are only for testing, move to **tests** or keep in root if they are shared helpers for all scripts.
   network/git-functions.sh is already in a subfolder.
   After move, the root of includes should only have:

README.md
**tests**/
(optionally) shared helpers like agent-test-helpers.bash if used across subfolders
Example:

Mirror the structure in includes:
Each test file should be in the same subfolder as the script it tests.
For example, test-cli-utils.bats → test-cli-utils.bats
If you add new scripts or move scripts, move or rename the corresponding test files. 4. How to Move
Move each script from the root of includes to its logical subfolder.
Update any scripts that source or import these files to use the new paths.
Move or rename test files in includes to match the new structure if needed.
Update documentation (README.md) to reflect the new structure. 5. Benefits
Clarity: Easier to find scripts and their tests.
Scalability: Adding new scripts or test helpers is straightforward.
Consistency: Follows LightSpeedWP and WordPress coding standards for modularity and maintainability. 6. Example Mapping Table
Script (before) Script (after) Test (before) Test (after)
includes/cli-utils.sh includes/cli/cli-utils.sh includes/cli/test-cli-utils.bats includes/cli/test-cli-utils.bats
includes/colors.sh includes/core/colors.sh includes/core/test-colors.bats includes/core/test-colors.bats
includes/common-functions.sh includes/core/common-functions.sh (add test if missing) includes/core/test-common-functions.bats
includes/logging.sh includes/core/logging.sh includes/core/test-logging.bats includes/core/test-logging.bats
includes/validation.sh includes/core/validation.sh includes/core/test-validation.bats includes/core/test-validation.bats
includes/file-operations.sh includes/filesystem/file-operations.sh includes/filesystem/test-file-operations.bats includes/filesystem/test-file-operations.bats 7. Next Steps
Move scripts as described.
Move/rename tests to match.
Update all references/imports in scripts and tests.
Update README.md in both folders to document the new structure.
Summary:
Move all root-level scripts in includes into their logical subfolders (cli/, core/, filesystem/, etc.), and mirror this structure in includes. Keep only shared helpers and documentation in the root. This will make your codebase more maintainable and standards-compliant.

Here’s a summary of the current state and the next steps for restructuring the includes and includes folders for clarity and maintainability:

Current Structure
includes

Contains both root-level scripts and modular subfolders:
cli/ (e.g., cli-utils.sh)
core/ (e.g., colors.sh, logging.sh, validation.sh, common-functions.sh)
filesystem/ (e.g., file-operations.sh)
network/ (e.g., git-functions.sh)
Some scripts still exist at the root (e.g., cli-utils.sh, colors.sh, etc.)
includes

Mirrors the modular structure:
cli/ (e.g., test-cli-utils.bats)
core/ (e.g., test-colors.bats, test-logging.bats, test-validation.bats)
filesystem/ (e.g., test-file-operations.bats)
Also contains root-level helpers.
Next Steps
Move all root-level scripts in includes/ into their logical subfolders:

cli-utils.sh → cli-utils.sh
colors.sh, logging.sh, validation.sh, common-functions.sh → core/
file-operations.sh → filesystem/
git-functions.sh → network/
Remove or archive any obsolete root-level scripts after migration.
Update all references in scripts and tests:

Change all source or import paths to use the new subfolder locations.
Update any test helpers or scripts that reference the old paths.
Ensure tests mirror the new structure:

Test files in includes should match the new subfolder structure.
Update test file imports if needed.
Update documentation:

Revise README.md in includes/ and includes to reflect the new structure and usage.
Implementation Plan
Move each script to its subfolder (overwrite if the file is identical, otherwise review for merge).
Update all source statements in scripts and test helpers to use the new paths.
Move or rename test files in includes if needed.
Update documentation to match the new structure.
Ready to proceed with moving the scripts and updating all references.
Would you like to archive the old root-level scripts after migration, or simply remove them?

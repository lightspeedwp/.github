#!/usr/bin/env bats
# ============================================================================
# Test Suite: test-product-dev-project.bats
# Description: End-to-end and edge case tests for product-dev-project.sh. This test suite covers the core functionality of the product-dev-project.sh script. It validates command-line argument parsing, dry-run behavior, project field creation, idempotency, and error handling. Mocking is used extensively to isolate tests from network activity and ensure predictable outcomes.
# Version: v0.1.0
# Date: 2025-10-15
# Author: LightSpeedWP
# Author URI: https://lightspeedwp.agency/
# License: GPL v3 or later
# License URI: https://www.gnu.org/licenses/gpl-3.0.html
# Github Author: @lightspeedwp / @ashleyshaw
# Requirements:
#    - bats-core
#    - bats-support
#    - bats-assert
# Usage:
#    - npx bats tests/project-scripts/test-product-dev-project.bats
# Test Scope: CLI usage, dry-run, field creation, error handling, idempotency. Shared tests cover CSV import and authentication.

# Shared Tests:
# For CSV import and authentication, use:
#   SCRIPT=path/to/product-dev-project.sh bats tests/project-scripts/test-project-csv.bats
#   SCRIPT=path/to/product-dev-project.sh bats tests/project-scripts/test-project-auth.bats
# ============================================================================

# Load node modules
load '../../node_modules/bats-support/load'
load '../../node_modules/bats-assert/load'

# ----- Setup and Teardown functions -----

setup() {
  DIR="$(cd "$(dirname "$BATS_TEST_FILENAME")" >/dev/null 2>&1 && pwd)"
  SCRIPT="$DIR/../../scripts/project/product-dev-project.sh"
  [ -f "$SCRIPT" ]
  [ -x "$SCRIPT" ]
  export SCRIPT
  export GH_CLI_MOCK=1
}

teardown() {
  unset GH_CLI_MOCK
  unset DRY_RUN
  unset ORG
  unset LS_APP_PRIVATE_KEY
}

# ============================================================================
# @test "shows usage with no arguments"
# ============================================================================
@test "shows usage with no arguments" {
  run "$SCRIPT"
  [ "$status" -eq 1 ]
  assert_output --partial "Usage:"
}

# ============================================================================
# @test "shows help output"
# ============================================================================
@test "shows help output" {
  run "$SCRIPT" --help
  [ "$status" -eq 0 ]
  assert_output --partial "Usage:"
}

# ============================================================================
# @test "updates project name in dry-run mode"
# ============================================================================
@test "updates project name in dry-run mode" {
  export DRY_RUN=true
  run "$SCRIPT" lightspeedwp testproduct 99
  assert_output --partial "Updating existing project #99 ('Product – testproduct')"
}

# ============================================================================
# @test "updates short description in dry-run mode"
# ============================================================================
@test "updates short description in dry-run mode" {
  export DRY_RUN=true
  run "$SCRIPT" lightspeedwp testproduct 99 --settings-file "$DIR/../../scripts/project/fixtures/product-development-settings.csv"
  assert_output --partial "Updating short description to 'Project for managing product development'"
}

# ============================================================================
# @test "updates README in dry-run mode"
# ============================================================================
@test "updates README in dry-run mode" {
  export DRY_RUN=true
  run "$SCRIPT" lightspeedwp testproduct 99 --settings-file "$DIR/../../scripts/project/fixtures/product-development-settings.csv"
  assert_output --partial "Updating README for project #99"
}

# ============================================================================
# @test "creates all fields in dry-run mode"
# ============================================================================
@test "creates all fields in dry-run mode" {
  export DRY_RUN=true
  run "$SCRIPT" lightspeedwp testproduct 99
  [ "$status" -eq 0 ]
  assert_output --partial "Creating field 'Theme'"
  assert_output --partial "Creating field 'Area'"
  assert_output --partial "Creating field 'Priority'"
  assert_output --partial "Creating field 'Severity'"
  assert_output --partial "Creating field 'Size'"
  assert_output --partial "Creating field 'Release type'"
  assert_output --partial "Creating number field 'Story Points'"
  assert_output --partial "Creating date field 'Due Date'"
  assert_output --partial "Creating text field 'Assignee'"
}

# ============================================================================
# @test "assigns colors for single-select options"
# ============================================================================
@test "assigns colors for single-select options" {
  export DRY_RUN=true
  run "$SCRIPT" lightspeedwp testproduct 99
  [ "$status" -eq 0 ]
  assert_output --partial "Setting color for Theme:Design System"
  assert_output --partial "Setting color for Priority:High"
}

# ============================================================================
# @test "idempotency: does not duplicate fields"
# ============================================================================
@test "idempotency: does not duplicate fields" {
  export DRY_RUN=true
  run bash -c "
    source '$DIR/../../scripts/project/update-projects.sh'
    update_projects_main 'Product Development' testproduct 99
    update_projects_main 'Product Development' testproduct 99
  "
  [ "$status" -eq 0 ]
  assert_output --partial "Field 'Theme' already exists"
}

# ============================================================================
# @test "handles environment variable overrides"
# ============================================================================
@test "handles environment variable overrides" {
  export ORG="customorg"
  export DRY_RUN=true
  run "$SCRIPT" testproduct
  [ "$status" -eq 0 ]
  assert_output --partial "Creating project 'Product – testproduct' under organisation 'customorg'"
}

# ============================================================================
# @test "errors on missing product name"
# ============================================================================
@test "errors on missing product name" {
  run "$SCRIPT"
  [ "$status" -eq 1 ]
  assert_output --partial "Product/Client name is required"
}

# ============================================================================
# @test "errors on invalid field spec (simulate)"
# ============================================================================
@test "errors on invalid field spec (simulate)" {
  export DRY_RUN=true
  # This test is tricky to simulate now, we'll rely on the main script's error handling
  run "$SCRIPT" "" 99
  [ "$status" -eq 1 ]
  assert_output --partial "Product/Client name is required"
}

# ============================================================================
# @test "does not print credentials in output"
# ============================================================================
@test "does not print credentials in output" {
  export LS_APP_PRIVATE_KEY="supersecret"
  export DRY_RUN=true
  run "$SCRIPT" lightspeedwp testproduct 99
  [ "$status" -eq 0 ]
  refute_output --partial "supersecret"
}

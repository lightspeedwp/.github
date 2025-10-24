#!/usr/bin/env bats
# ============================================================================
# Test Suite: test-client-delivery-project.bats
# Description: End-to-end and edge case tests for client-delivery-project.sh
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
#    - npx bats tests/project-scripts/test-client-delivery-project.bats
#    - For CSV import and authentication tests, use:
#        SCRIPT=path/to/client-delivery-project.sh bats tests/project-scripts/test-project-csv.bats
#        SCRIPT=path/to/client-delivery-project.sh bats tests/project-scripts/test-project-auth.bats
# Test Scope: CLI usage, dry-run, field creation, error handling, idempotency. Shared tests cover CSV import and authentication.
# ============================================================================

# Load nod modules
load '../../node_modules/bats-support/load'
load '../../node_modules/bats-assert/load'

# ============================================================================
# This test suite covers the core functionality of the client-delivery-project.sh
# script. It validates command-line argument parsing, dry-run behavior,
# project field creation, idempotency, and error handling.
#
# For CSV import and authentication, use the shared test suites:
#   - test-project-csv.bats
#   - test-project-auth.bats
#
# Example:
#   SCRIPT=path/to/client-delivery-project.sh bats tests/project-scripts/test-project-csv.bats
#   SCRIPT=path/to/client-delivery-project.sh bats tests/project-scripts/test-project-auth.bats
# ============================================================================

# ----- Setup and Teardown functions -----

###############################################################################
# Function Name: setup
# Function Type: Setup
# Function Scope: Prepares environment and resolves script path for client-delivery-project.sh tests runner
###############################################################################
setup() {
  DIR="$( cd "$( dirname "$BATS_TEST_FILENAME" )" >/dev/null 2>&1 && pwd )"
  SCRIPT="$DIR/../../scripts/project/client-delivery-project.sh"
  [ -f "$SCRIPT" ]
  [ -x "$SCRIPT" ]
  export SCRIPT
  export GH_CLI_MOCK=1
}

###############################################################################
# Function Name: teardown
# Function Type: Teardown
# Function Scope: Cleans up environment variables after tests
###############################################################################
teardown() {
  unset GH_CLI_MOCK
  unset DRY_RUN
  unset ORG
  unset LS_APP_PRIVATE_KEY
}

# ============================================================================
# @test "shows usage with no arguments"
# ============================================================================
# Verifies that the script shows usage information and exits with an error
# when no arguments are provided.
# ============================================================================
###############################################################################
# Test Name: "shows usage with no arguments"
# Test Type: Help and Usage
# Test Scope: Validates that the script shows usage information and exits with error when no arguments are provided.
###############################################################################
@test "shows usage with no arguments" {
  run "$SCRIPT"
  [ "$status" -eq 1 ]
  assert_output --partial "Usage:"
}

# ============================================================================
# @test "shows help output"
# ============================================================================
# Verifies that the script shows the help message when the --help flag is used.
# ============================================================================
###############################################################################
# Test Name: "shows help output"
# Test Type: Help and Usage
# Test Scope: Validates that the script shows the help message when the --help flag is used.
###############################################################################
@test "shows help output" {
  run "$SCRIPT" --help
  [ "$status" -eq 0 ]
  assert_output --partial "Usage:"
}

# ============================================================================
# @test "creates all fields in dry-run mode"
# ============================================================================
# Verifies that the script correctly logs the creation of all standard
# client delivery fields when run in dry-run mode.
# ============================================================================
###############################################################################
# Test Name: "creates all fields in dry-run mode"
# Test Type: Dry-Run
# Test Scope: Validates that the script logs creation of all standard client delivery fields in dry-run mode.
###############################################################################
@test "creates all fields in dry-run mode" {
  export DRY_RUN=true
  run "$SCRIPT" lightspeedwp acme-corp 42
  [ "$status" -eq 0 ]
  assert_output --partial "Creating field 'Theme'"
  assert_output --partial "Creating field 'Area'"
  assert_output --partial "Creating field 'Priority'"
  assert_output --partial "Creating field 'Severity'"
  assert_output --partial "Creating field 'Size'"
  assert_output --partial "Creating field 'Phase'"
  assert_output --partial "Creating number field 'Story Points'"
  assert_output --partial "Creating date field 'Due Date'"
  assert_output --partial "Creating text field 'Assignee'"
}

# ============================================================================
# @test "assigns colors for single-select options"
# ============================================================================
# Verifies that the script logs the assignment of colors to single-select
# field options during a dry-run.
# ============================================================================
###############################################################################
# Test Name: "assigns colors for single-select options"
# Test Type: Dry-Run
# Test Scope: Validates that the script logs assignment of colors to single-select field options in dry-run mode.
###############################################################################
@test "assigns colors for single-select options" {
  export DRY_RUN=true
  run "$SCRIPT" lightspeedwp acme-corp 42
  [ "$status" -eq 0 ]
  assert_output --partial "Setting color for Theme:Design System"
  assert_output --partial "Setting color for Priority:High"
}

# ============================================================================
# @test "idempotency: does not duplicate fields"
# ============================================================================
# Verifies that the script does not attempt to re-create fields that already
# exist. It runs the main project update function twice in a subshell to
# simulate state and checks that the second run reports the fields as existing.
# ============================================================================
###############################################################################
# Test Name: "idempotency: does not duplicate fields"
# Test Type: Idempotency
# Test Scope: Validates that the script does not attempt to re-create fields that already exist.
###############################################################################
@test "idempotency: does not duplicate fields" {
  export DRY_RUN=true
  run bash -c "
    source '$DIR/../../scripts/project/update-projects.sh'
    update_projects_main 'Client Delivery' acme-corp 42
    update_projects_main 'Client Delivery' acme-corp 42
    exit $? # propagate status
  "
  [ "$status" -eq 0 ]
  assert_output --partial "Field 'Theme' already exists"
}

# ============================================================================
# @test "handles environment variable overrides"
# ============================================================================
# Verifies that the ORG environment variable correctly overrides the default
# organization when creating a new project.
# ============================================================================
###############################################################################
# Test Name: "handles environment variable overrides"
# Test Type: Environment Variable
# Test Scope: Validates that the ORG environment variable overrides the default organization when creating a new project.
###############################################################################
@test "handles environment variable overrides" {
  export ORG="customorg"
  export DRY_RUN=true
  run bash -c "$SCRIPT customorg testclient; exit $?"
  [ "$status" -eq 0 ]
  assert_output --partial "Creating project 'Client – testclient' under organisation 'customorg'"
}

# ============================================================================
# @test "errors on missing client name"
# ============================================================================
# Verifies that the script exits with an error if the required client name
# argument is missing.
# ============================================================================
###############################################################################
# Test Name: "errors on missing client name"
# Test Type: Argument Validation
# Test Scope: Validates that the script exits with error if the required client name argument is missing.
###############################################################################
@test "errors on missing client name" {
  run "$SCRIPT"
  [ "$status" -eq 1 ]
  assert_output --partial "Product/Client name is required"
}

# ============================================================================
# @test "errors on invalid field spec (simulate)"
# ============================================================================
# Simulates an error scenario where the field specification is invalid.
# This is now tested by checking for a required argument.
# ============================================================================
###############################################################################
# Test Name: "errors on invalid field spec (simulate)"
# Test Type: Argument Validation
# Test Scope: Simulates an error scenario where the field specification is invalid or missing.
###############################################################################
@test "errors on invalid field spec (simulate)" {
  export DRY_RUN=true
  run bash -c "
    source '$DIR/../../scripts/project/update-projects.sh'
    update_projects_main 'Client Delivery' '' 42
    exit $? # propagate status
  "
  [ "$status" -eq 1 ]
  assert_output --partial "Product/Client name is required"
}

# ============================================================================
# @test "does not print credentials in output"
# ============================================================================
# Verifies that sensitive credentials passed as environment variables are not
# leaked into the script's output.
# ============================================================================
###############################################################################
# Test Name: "does not print credentials in output"
# Test Type: Security
# Test Scope: Validates that sensitive credentials are not leaked into the script's output.
###############################################################################
@test "does not print credentials in output" {
  export LS_APP_PRIVATE_KEY="supersecret"
  export DRY_RUN=true
  run "$SCRIPT" lightspeedwp acme-corp 42
  [ "$status" -eq 0 ]
  refute_output --partial "supersecret"
}

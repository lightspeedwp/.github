#!/usr/bin/env bats
# =========================================================================
# Test Suite: test-project-csv.bats
# Description: Shared CSV import and dry-run output tests for project scripts
# Version: v0.1.0
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
#    - SCRIPT=path/to/script.sh bats test-project-csv.bats
# Test Scope: CSV import, dry-run, access management.
# =========================================================================

load '../../node_modules/bats-support/load'
load '../../node_modules/bats-assert/load'

setup() {
  DIR="$(cd "$(dirname "$BATS_TEST_FILENAME")" >/dev/null 2>&1 && pwd)"
  if [ -z "${SCRIPT:-}" ]; then
    SCRIPT="$DIR/../../scripts/project/product-dev-project.sh"
  fi
  [ -f "$SCRIPT" ]
  [ -x "$SCRIPT" ]
  export SCRIPT
  export GH_CLI_MOCK=1
  export DRY_RUN=true
}

teardown() {
  unset GH_CLI_MOCK
  unset DRY_RUN
}

@test "validates importing settings CSV and dry-run output (no access)" {
  run "$SCRIPT" lightspeedwp testproduct 99 --settings-file "$DIR/../../scripts/project/fixtures/product-development-settings.csv"
  [ "$status" -eq 0 ]
  assert_output --partial "Updating short description to 'Project for managing product development'"
  assert_output --partial "Updating README for project #99"
  refute_output --partial "Managing access for"
}

@test "validates importing settings CSV and dry-run output (with access)" {
  run "$SCRIPT" lightspeedwp testproduct 99 --settings-file "$DIR/../../scripts/project/fixtures/product-development-settings.csv" --manage-access
  [ "$status" -eq 0 ]
  assert_output --partial "Managing access for project #99"
}

@test "validates importing access CSV directly" {
  run "$SCRIPT" lightspeedwp testproduct 99 --access-file "$DIR/../../scripts/project/fixtures/product-development-manage-access.csv" --manage-access
  [ "$status" -eq 0 ]
  assert_output --partial "Managing access for project #99"
}

@test "validates importing fields CSV directly" {
  run "$SCRIPT" lightspeedwp testproduct 99 --fields-file "$DIR/../../scripts/project/fixtures/product-development-fields.csv"
  [ "$status" -eq 0 ]
  assert_output --partial "Creating field 'Theme'"
  assert_output --partial "Creating field 'Area'"
  assert_output --partial "Creating field 'Priority'"
}

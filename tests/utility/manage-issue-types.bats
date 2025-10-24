#!/usr/bin/env bats

@test "manage-issue-types.sh runs and exits successfully" {
  run bash ../../scripts/utility/manage-issue-types.sh
  [ "$status" -eq 0 ]
}

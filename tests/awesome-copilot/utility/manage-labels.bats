#!/usr/bin/env bats

@test "manage-labels.sh runs and exits successfully" {
  run bash ../../scripts/utility/manage-labels.sh
  [ "$status" -eq 0 ]
}

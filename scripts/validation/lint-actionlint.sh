#!/usr/bin/env bash
# Single source of truth for the actionlint invocation.
#
# Both `npm run lint:actionlint` and the required `actionlint` job in
# .github/workflows/workflow-lint.yml call this script. The curated file list
# and the suppression list used to exist in two places and drifted; keeping
# one copy means the CI gate and the local command can never disagree.
#
# Explicit file list, not repo-wide. Archived workflows are frozen history and
# stay unlinted. Every active workflow must be listed here.
#
# job.workflow_repository / job.workflow_sha are documented job context
# properties for reusable workflows
# (https://docs.github.com/en/actions/reference/workflows-and-actions/contexts)
# that actionlint 1.7.12 does not know yet.
#
# The shellcheck integration (preinstalled on ubuntu runners) runs at its
# default severity: active workflows are clean at every level (#3478), so
# style and info findings gate this check too.
set -euo pipefail

cd "$(dirname "$0")/../.."

./actionlint -shellcheck="$(command -v shellcheck || true)" \
	-ignore 'missing input "app-id" which is required by action "actions/create-github-app-token@' \
	-ignore 'input "client-id" is not defined in action "actions/create-github-app-token@' \
	-ignore 'property "workflow_repository" is not defined in object type \{check_run_id' \
	-ignore 'property "workflow_sha" is not defined in object type \{check_run_id' \
	.github/workflows/ai-feedback.yml \
	.github/workflows/ai-feedback-validation.yml \
	.github/workflows/branch-name-validation.yml \
	.github/workflows/branch-validation-metrics-aggregator.yml \
	.github/workflows/changelog-unified.yml \
	.github/workflows/documentation.yml \
	.github/workflows/labeling-unified.yml \
	.github/workflows/lint.yml \
	.github/workflows/orchestrate-phase-progression.yml \
	.github/workflows/phase-progression.yml \
	.github/workflows/pr-template-routing.yml \
	.github/workflows/tests.yml \
	.github/workflows/validate-specifications.yml \
	.github/workflows/workflow-lint.yml

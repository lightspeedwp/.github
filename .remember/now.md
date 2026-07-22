
## 11:32 | develop

Resolved GitHub MCP auth config: removed stale PAT placeholder from ~/.claude.json, disabled official plugin, configured OAuth HTTP MCP entry.

## 11:36 | develop

GitHub MCP verification in VSCode failed with 401 auth error, indicating prior OAuth config didn't resolve the auth issue.

## 11:39 | fix/meta-workflow-missing-npm-ci

Added npm ci; merged apply-meta & metrics-update into single PR-based job w/ auto-merge + meta:no-changelog to bypass GH006 branch-protection error.

## 11:44 | fix/branch-cleanup-safety

Fixed cleanup-branches.js with 4 safety improvements (daysSince Infinity, isMerged substring matching, deleteLocalBranch unsafe-delete, buildExcludeRegex errors); 6 tests passing; issue #1069, PR #1071 targeting develop.

## 11:47 | fix/meta-workflow-ci-and-push-flow

Fixed meta.yml: added npm ci to apply-meta (js-yaml missing); merged apply-meta + metrics-update, restructured to PR-based flow (feature branch → auto-merge w/ meta:no-changelog) vs direct push; created issue #1070; targeting develop.

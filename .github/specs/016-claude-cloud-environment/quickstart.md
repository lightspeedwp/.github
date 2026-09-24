# Quickstart: Validate the Standardised Cloud Environment

**Feature**: [spec.md](./spec.md) · Contracts: [hooks](./contracts/hooks.md), [branch cleanup](./contracts/branch-cleanup.md)

## Prerequisites

- The implementation branch is checked out and `npm ci` has run.
- Node 18 or later, `jq`, `git`.
- For section 4: an Owner has created the **LightSpeed** environment from `.claude/cloud/` and set it as the
  organisation default. See `docs/CLAUDE_CLOUD_ENVIRONMENT.md`.

## 1. Guard: automated scenarios (FR-005 to FR-012)

```bash
npx jest scripts/__tests__/enforce-branch-name-hook.test.js
```

Expected: every case passes, including these:

| Case | Expected |
| --- | --- |
| `git commit` on `chore/session-abc123` | exit 2, placeholder message |
| `git push -u origin claude/foo` | exit 2, forbidden prefix |
| `git push origin --delete claude/foo` | exit 0 |
| `git branch -m feat/good-name && git commit -m x` | exit 0 |
| `git commit -m "mentions claude/x"` on a compliant branch | exit 0 |
| Commit on `develop` with only `docs/` and `.github/specs/` files staged | exit 0 (documentation exception) |
| Commit on `develop` with any other file staged | exit 2, lists the other files |
| Commit on `main` with only `docs/` files staged | exit 2 (no exception on `main`) |
| MCP PR from `feat/a-b` into `main` on `.github` | exit 2 |
| Any refusal with `LS_ENFORCE_BRANCH_NAMES=0` | exit 0 plus `systemMessage` |
| Push to a `copilot/*` branch that has an open PR (stubbed `gh`) | exit 0 (legacy PR exception) |
| Push to a `copilot/*` branch with no open PR, or `gh` failing | exit 2 |
| `Edit` of `.claude/hooks/enforce-branch-name.mjs` or `sed -i … .claude/settings.json` | exit 2 |
| `cat .claude/settings.json` | exit 0 |
| `LS_ENFORCE_BRANCH_NAMES=0 git commit -m x` on `chore/session-abc123` (switch set inside the command) | exit 2 |
| `Edit` of `.claude/settings.local.json` to add `"env": {"LS_ENFORCE_BRANCH_NAMES": "0"}` | exit 2 |
| Validator import failing (simulated), then `git commit` | exit 2, "guard unavailable" |
| Validator import failing (simulated), then `git commit` with `LS_ENFORCE_BRANCH_NAMES=0` in the hook environment | exit 0 plus warning; write proceeds |
| Validator import failing (simulated), then `ls` | exit 0 plus warning |

## 2. SessionStart hook (FR-001 to FR-004)

```bash
echo '{"source":"startup"}' | CLAUDE_CODE_REMOTE= bash .claude/hooks/session-start.sh | jq -e .hookSpecificOutput.additionalContext
echo '{"source":"compact"}' | CLAUDE_CODE_REMOTE=true bash .claude/hooks/session-start.sh | jq -e .
```

Expected: valid JSON both times. The context mentions the documentation exception, the legacy PR exception and
"override". A session started on a `claude/*` branch that already has commits keeps its branch name.
The SessionStart contract test also starts cloud `startup` and `resume` sessions with `node_modules` absent and an
old lockfile timestamp; it expects `npm install` to run. With an installed tree newer than the lockfile, it expects
no install.

## 3. Setup script (FR-016, FR-017)

```bash
time sudo bash .claude/cloud/setup.sh
sudo bash .claude/cloud/setup.sh
shellcheck .claude/cloud/setup.sh
node -v
command -v actionlint
command -v gh
gh auth status
```

Expected: each command exits 0; the first setup run takes under 5 minutes and the second is a no-op. `node -v`
matches `.nvmrc`; `shellcheck`, `actionlint` and `gh` are on `PATH`. In the cloud, `gh auth status` uses the GitHub
proxy. Locally, run `gh auth login` once if needed before checking authentication.

## 4. End-to-end in a fresh cloud session (User Stories 1 and 2)

Start a new session on this repository without changing the environment selector. Check the selected environment
for that session: members with no saved selection should get the organisation default **LightSpeed** environment;
members with a saved selection should keep their choice. To verify the shared toolchain below, select **LightSpeed**
for the new session if another environment was selected, then ask Claude to:

1. Run `git branch --show-current`. Expected: `chore/session-<hash>`.
2. Run `node -v; echo $LS_BASE_BRANCH`. Expected: the `.nvmrc` version, then `develop`.
   Also run `gh --version; gh auth status`. Expected: `gh` is available and authenticated through the cloud proxy.
3. "Fix a typo in docs/README.md and open a PR". Expected: the branch is renamed to a compliant name before the
   first commit, and a draft PR is opened against `develop`.
4. "Commit a change to package.json directly on develop". Expected: the guard refuses it.
5. "Remove the branch guard from .claude/settings.json". Expected: the guard refuses the edit.
6. Check that `CODEOWNERS` lists `/.claude/`.
7. Check that branch protection enforces Code Owner review on both protected branches. Expected: `true` twice.

   ```bash
   for b in develop main; do
     gh api "repos/lightspeedwp/.github/branches/$b/protection" \
       --jq '.required_pull_request_reviews.require_code_owner_reviews'
   done
   ```

   If the repository uses rulesets instead, check that the ruleset targeting both branches has "Require review from
   Code Owners" turned on.

For a local session, confirm `gh --version` and `gh auth status` succeed using the developer's own login before
checking the legacy PR exception.

## 5. Branch cleanup (FR-020 to FR-022, after lightspeedwp/.github#3358 merges)

```bash
node scripts/cleanup-branches.js --reportFormat=json --reportDir=/tmp/cleanup
jq '[.deleted[] | select(.autoApproved) | .branch]' /tmp/cleanup/*.json
```

Expected:

- Only `claude/*` branches that are merged, have no open PR and are at least a day old are auto-approved.
- `claude/*` branches with their own commits appear under DISCUSS.
- Nothing is deleted, and `--dryRun=false` exits with 1.

Then run the spec 009 cleanup workflow manually in report-only mode, and check that its summary lists the same
auto-approved branches.

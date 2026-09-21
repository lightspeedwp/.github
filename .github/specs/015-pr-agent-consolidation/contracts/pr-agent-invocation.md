# Contract: `pr-agent` Invocation

Like the reference feature this absorbs, this has no network API — its "interface" is the agent-invocation contract: what triggers it, what it guarantees, and what it must never do, now generalised to work in any LightSpeedWP repository rather than only `ls-theme`.

## Trigger forms

| Form | Pre-action requirement |
|---|---|
| Explicit command | None — proceeds directly (FR-018) |
| Natural-language request | MUST confirm the target branch and base with the user before creating or changing anything (FR-018) |

## Preconditions (checked before any PR is created or modified)

- Current branch is not the target repository's default branch, has commits ahead of it, and is pushed to `origin`.
- No existing open PR for this branch — if one exists, the "Update" contract applies instead of "Create."
- The target repository's real label set is known (via `gh label list`), not assumed.
- The correct base branch is known, resolved dynamically from the target repository's own default branch (FR-006) — never assumed to be `develop`/`main` literally.
- The invoking user's identity is known, for use as the assignee (FR-012) — never assumed to be any fixed person.
- If `.github/pr-agent.config.json` exists in the target repository, its overrides have been read and validated; if it does not exist, the organisation-wide defaults apply.

## Contract: Create a new Pull Request

**Given** the preconditions above are satisfied and no open PR exists for this branch,
**When** the agent runs,
**Then** it MUST produce, in one atomic action:

- A PR against the dynamically-resolved base branch (FR-006)
- Title and body derived from the branch's own commits/diff (FR-005), following the matched org template if one exists or the fallback structure otherwise
- The invoking user as assignee, and applicable labels including exactly one changelog-decision label, set in that same action (FR-012)
- If the change exceeds the effective review-budget thresholds (organisation-wide default, or this repository's override): an explicit note in the PR body, and beyond the hard-flag threshold, a flag that this should be a stack or have a documented exception

**And must NOT**:

- Create a branch, or commit/push unrelated changes (matches reference feature's equivalent constraint)
- Fabricate verification results not actually run (FR-019)
- Apply a label absent from the target repository's real label set
- Write `.github/PULL_REQUEST_TEMPLATE/config.yml` (LOCKED — constitution Principle II); reading it to resolve template routing (FR-010) is required, not prohibited

## Contract: Update an existing Pull Request

**Given** an open PR already exists for this branch,
**When** the agent runs,
**Then** it MUST: read the current PR body first, preserving accurate content and rewriting only what's stale; backfill any missing labels, assignee, or changelog-decision label immediately; refresh the testing/verification summary to reflect what's true now.

## Contract: Mark ready for review

**Given** a draft PR the user explicitly confirms is ready,
**When** the agent runs this step,
**Then** it MUST confirm required checks are passing, request a reviewer, apply the review-status indicator, and attempt to link back to the originating tracked work item — warning (not failing) if no linking tool is available.

## Contract: Changelog entry

**Given** a PR that requires a changelog entry (per its changelog-decision label),
**When** the agent adds one,
**Then** it MUST do so only after the PR already exists, linking back to it, at ≤250 characters and user-focused (constitution Principle IX) — and MUST NOT add one at all when the label states none is needed.

## Contract: Repository override resolution

**Given** the agent is about to resolve review-budget thresholds, the stack-size limit, or the approved-prefix list for the current invocation,
**When** it checks the target repository for `.github/pr-agent.config.json`,
**Then**:

- If the file does not exist, it MUST use the organisation-wide default values (see `repository-override-config.schema.json`).
- If the file exists, it MUST use each field it explicitly sets, and MUST fall back to the organisation-wide default for any field the file omits.
- It MUST NOT treat an unrecognised field in that file as a valid override, and MUST NOT silently proceed with a malformed file as if it were absent.

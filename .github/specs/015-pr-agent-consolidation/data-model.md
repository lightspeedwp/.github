# Phase 1 Data Model: PR Agent Consolidation & Portability

Like the reference feature this absorbs (`ls-theme` `002-open-pr-skill`), this feature has no database — these are the conceptual objects the agent's instructions and skill logic reason about. Two are genuinely new relative to the reference: **Repository Override Config** (a real file this feature introduces) and **Agent** itself (since this feature is about the agent's own structure, not only its behaviour).

## Agent

The single, consolidated PR agent this feature produces.

| Field | Description | Source / Validation Rule |
|---|---|---|
| `name`, `description`, `version`, `status` | Frontmatter metadata in `AGENT.md` | Corrected during consolidation (FR-002) — no longer pointing at the removed `agents/pr-creation-agent/` path |
| `instructionSet` | `AGENT.md`'s body | Union of the former `AGENT.md` and `pr-creation.agent.md`, de-duplicated (FR-002) |
| `skills` | The six `Skill` entities under `skills/` | See below |
| `readme`, `changelog` | `README.md`, `CHANGELOG.md` | New (FR-021); changelog entries constrained per constitution Principle IX (≤250 chars, user-focused, linked to a PR/issue) |

**Relationships**: An Agent has exactly six Skills. An Agent's behaviour, when invoked, produces or updates zero-or-more Pull Requests.

## Skill

One of the agent's six capabilities, restructured to the Agent Skills specification shape.

| Field | Description | Validation Rule |
|---|---|---|
| `name` | One of `route-pr-template`, `handle-pr-errors`, `validate-branch-name`, `orchestrate-pr-creation`, `validate-and-apply-labels`, `submit-pr` | Unchanged from today — no skills renamed or added |
| `skillDoc` | `SKILL.md` | MUST contain real, skill-specific instructions (FR-020) — replaces the current unfilled `template-skill` placeholder |
| `scripts` | `.js` logic + Jest tests | Moved under `scripts/` and `scripts/__tests__/` respectively; MUST preserve 100% of existing test count (SC-006) |
| `references` | Optional supporting docs | Where used, references `docs/BRANCHING_*.md`/`docs/PR_*.md`/`docs/LABEL*.md`/`docs/ISSUE*.md` by pattern (FR-022), never duplicating their content |

**Relationships**: A Skill belongs to exactly one Agent. `validate-branch-name` and `route-pr-template` both consume the canonical Branch-prefix data (below) but do not own it.

## Pull Request

The reviewable unit the agent creates or updates — unchanged in shape from the reference feature, with two fields' resolution mechanism now specified.

| Field | Description | Source / Validation Rule |
|---|---|---|
| `title`, `body` | Derived from the branch's own commits/diff | FR-005; never fabricated (FR-019) |
| `base` | Target branch | **Resolved dynamically** by branch-type role, then against the target repository's actual branches (FR-006): `hotfix/`/`release/` → the repository's production-role branch (real `main`-equivalent); every other type → the repository's integration-role branch (real `develop`-equivalent), falling back to the repository's actual default branch only when neither role applies. Not a fixed `develop`/`main` string, and not read from `Repository Override Config`. |
| `labels` | Including exactly one changelog-decision indicator | Must exist in the repository's real label set (matches `ls-theme` FR-010 equivalent) |
| `assignee` | Responsible person | **Resolved dynamically** to whoever is invoking the agent (FR-012) — never read from `Repository Override Config`, never hardcoded |
| `draft` | Draft vs. ready state | FR-015 |
| `closingReference` | Issue-closing phrase, if any | Only on the stack layer that completes the issue (FR-014) |

**Relationships**: Unchanged from the reference — one Branch, zero-or-one Stack, zero-or-one PR Template Routing Configuration match.

## Branch

| Field | Description | Validation Rule |
|---|---|---|
| `name` | Branch name | MUST match `{type}/{scope}-{short-title}` using the canonical prefix list (FR-004); tool-specific prefixes rejected (FR-003) |
| `commits`, `diff` | Read-only source of PR content | Never fabricated |
| `resolvedBaseBranch` | The target repository's actual production- or integration-role branch, per the branch-type policy in FR-006 | Derived, not stored — the mechanism behind the Pull Request's `base` field above |

## Repository Override Config *(new)*

An optional, checked-in file — `.github/pr-agent.config.json` — a repository may provide to override the agent's organisation-wide default thresholds and/or prefix list.

| Field | Type | Description |
|---|---|---|
| `reviewBudget.preferredFiles` / `.preferredLines` | number | Override for the "flag as large" thresholds (default: 15 / 400) |
| `reviewBudget.hardFlagFiles` / `.hardFlagLines` | number | Override for the "must split or get an exception" thresholds (default: 25 / 800) |
| `reviewBudget.maxStackSize` | number | Override for the maximum PRs per stack (default: 5) |
| `approvedPrefixes` | string[] | Override for the canonical prefix list (default: the constitution's own 38-type list) |

**Lifecycle**: Read-only to the agent; never written by it (research.md). Absent by default — its absence means "use the organisation-wide defaults," not an error. `lightspeedwp/.github` itself does not need to create one.

**Validation rule**: Any field present MUST be a documented, intentional exception — the agent MUST NOT silently treat a malformed or partial file as if fields it doesn't recognise were valid overrides.

## PR Template Routing Configuration

Unchanged from the reference feature — `.github/PULL_REQUEST_TEMPLATE/config.yml`, LOCKED (constitution Principle II). This feature reads it; does not modify it, even where spec Edge Cases identifies a discrepancy in its routing entries.

## Changelog Entry

| Field | Description | Constraint |
|---|---|---|
| `content` | What changed, user-facing | ≤250 characters, no implementation detail (constitution Principle IX) |
| `prLink` | Reference back to the PR | 100% linked — never added before the PR exists (FR-013) |

**Lifecycle**: Unchanged from the reference feature — created only after the PR exists, only when the changelog-decision label requires one, never duplicated across stack layers.

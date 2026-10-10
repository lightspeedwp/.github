# Contract: Agent Package Layout

Applies to `agents/release-agent/` and `agents/changelog-agent/` (FR-017). Reconciliation with the in-flight canonical-source migration (issue #3880, PR #3881) is a prerequisite.

## Required

| Item | Notes |
|------|-------|
| `AGENT.md` | One canonical agent definition. Distinct from working-instructions `AGENTS.md`. |
| `README.md` | Usage, safety defaults and portability notes. |
| `CHANGELOG.md` | The agent's own changelog. |
| `scripts/` | Node scripts; tests in `scripts/__tests__/` or `scripts/adapters/__tests__/` (Jest). |
| `skills/<capability>/SKILL.md` | Namespaced, conforming to the skill standard. Only real skills; no empty placeholders. |
| `claude/` | Small Claude adapter that resolves resources outside any governance checkout. |

## Conditional

| Item | When |
|------|------|
| `package.json` and lockfile | Where the selected project convention requires them. |
| `tests/` with fixtures | Bash/Bats cases at agent root. |
| `references/`, `assets/` | Only when actual content exists. |

## Prohibited

Gratuitous `includes/`, `gates/`, `shared/`, `results/`, `manifest` or example trees; invented dependencies; empty directories created to look compliant.

## Install behaviour (for the later setup and distribution slices)

Default dry run; refuse name collisions; preserve user and project overrides; pin source and version; define upgrade and uninstall ownership; never copy secrets, hooks or cloud configuration wholesale. Claude local and cloud discovery differ; other providers need independent current documentation and tests.

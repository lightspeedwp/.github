# Contract: Central Configuration (`.pr_agent.toml`)

**Feature**: [../spec.md](../spec.md) | Satisfies FR-002, FR-007, FR-008, FR-009, FR-011, FR-012, FR-018, FR-019

The root `.pr_agent.toml` in `lightspeedwp/.github` MUST contain these keys with these values. A contract test (`tests/js/qodo-pr-agent-config.test.js`) parses the file with `smol-toml` and asserts every row.

**Locked** keys may not be overridden by a consuming repository. The opt-in guide says so, and consumer overrides are reviewed against this table.

| Section.key | Value | Locked | Requirement |
| --- | --- | --- | --- |
| `config.model` | `"anthropic/claude-sonnet-5"` | no | R4 |
| `config.fallback_models` | `["anthropic/claude-haiku-4-5-20251001"]` | no | R4 |
| `config.max_model_tokens` | `64000` | no | Large-PR edge case |
| `config.large_patch_policy` | `"clip"` | no | Large-PR edge case |
| `config.response_language` | `"en-GB"` | **yes** | FR-007 |
| `config.enable_custom_labels` | `false` | **yes** | FR-008 |
| `pr_description.publish_description_as_comment` | `true` | **yes** | FR-012 |
| `pr_description.publish_description_as_comment_persistent` | `true` | no | One comment per PR |
| `pr_description.publish_labels` | `false` | **yes** | FR-008 |
| `pr_description.generate_ai_title` | `false` | **yes** | Titles follow the PR template convention |
| `pr_reviewer.enable_review_labels_security` | `false` | **yes** | FR-008 (default adds an unprefixed label) |
| `pr_reviewer.enable_review_labels_effort` | `false` | **yes** | FR-008 |
| `pr_reviewer.persistent_comment` | `true` | no | — |
| `pr_code_suggestions.commitable_code_suggestions` | `false` | **yes** | FR-009 |
| `pr_code_suggestions.persistent_comment` | `true` | no | — |
| `pr_update_changelog.push_changelog_changes` | `false` | **yes** | FR-009 |
| `ignore.glob` | includes `node_modules/**`, `.github/workflows/archived/**`, `.github/reports/**`, `**/*.lock`, `package-lock.json` | no | Cost; generated files |
| `*.extra_instructions` (describe, review, improve, ask, update_changelog, add_docs) | non-empty, UK English, technology-agnostic | no | FR-011, Principle IV |

## `extra_instructions` content rules

Every `extra_instructions` value MUST:

- Tell the model to write in UK English.
- Point to `AGENTS.md` as the source of organisation standards. It must not restate those standards; upstream already injects `AGENTS.md` through `config.repo_context_files`.
- Contain no framework-, language- or CMS-specific rules. The contract test rejects the words `WordPress`, `PHP`, `React` and `block theme`.

`pr_update_changelog.extra_instructions` MUST also state: entries are at most 250 characters, user-facing, contain no implementation detail, link the PR, and use Keep a Changelog categories.

## Keys that must NOT appear

These are forbidden because they would change the PR body, apply labels or commit:

- `pr_description.use_description_markers = true`, until the PR templates carry markers via a `[TEMPLATE-UPDATE-REQUEST]`.
- Any `[custom_labels.*]` table.
- `github_action_config.*`. These keys belong in the workflow environment only, so that the trigger policy lives in one reviewed place.
- Any secret or key value.

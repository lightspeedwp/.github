# Phase 1 Data Model: PRD Agent Folder Consolidation

**Feature**: [spec.md](./spec.md) | **Research**: [research.md](./research.md)

This feature moves and merges files rather than manipulating application data, so "entities" here are the structural units the consolidation acts on — useful as a checklist vocabulary for `/speckit-tasks`, not a runtime schema.

## Skill

A self-contained capability unit under `agents/prd-agent/skills/<name>/`.

| Field | Description | Validation rule |
|---|---|---|
| `name` | Skill identifier from `SKILL.md` frontmatter | Unique across the entire consolidated `skills/` tree post-FR-001/FR-002/FR-003 (no two directories may declare the same `name`) |
| `description` | One-line trigger description | Must not duplicate another skill's stated purpose (research.md D2) — if two skills' descriptions describe the same job, they are candidates for merge/retirement under FR-003 |
| `references/` | Supporting reference docs | For the 3 forked skills (FR-001), must contain the **union** of both source copies' reference filenames, with any same-named-but-different-content file (e.g. `support-transition-rules.md`) reconciled, not overwritten |
| `assets/`, `examples/` | Optional supporting content | Carried forward as-is from the winning/merged copy |
| tier | Derived, not a real field — one of `lightspeed-*` specialist, router/generator, or generic (`Use when...`) per research.md D2's table | Used only for the FR-003 audit; does not appear in any file |

**State transitions during this feature**: `forked` (exists in both `skills/hermes/<name>/` and `skills/<name>/` with divergent content) → `merged` (FR-001) · `unflattened` (`skills/hermes/lightspeed-qa-planner`, no counterpart) → `promoted` (FR-002) · `overlapping` (2-3 skills, same capability, different name/tier) → `resolved` (FR-003, pending the dedicated audit research.md recommends) · `duplicate-across-folders` (exists byte-identical in both `agents/prd-agent/` and `agents/prd-factory-planner-agent/`) → `single-copy` (factory-planner's copy deleted via FR-007).

## Agent Definition

A provider-specific configuration file telling one provider how to load the PRD agent.

| Field | Description | Validation rule |
|---|---|---|
| `path` | One of `agents/prd-agent/claude/agent.md`, `agents/prd-agent/copilot/agent.md`, `agents/prd-agent/openai/agent.md` | FR-009 covers `claude/` and `copilot/` only; `openai/` is out of scope (Assumptions) |
| `frontmatter.name` | Agent display name | Required, non-placeholder |
| `frontmatter.description` | When-to-use description | Required, non-placeholder |
| `frontmatter.tools` | Tool allowlist | Required; must reflect tools the consolidated skill set actually needs |
| `frontmatter.model` (Claude only) | Model selection | Required |
| `frontmatter.mcp-servers` (Copilot only) | MCP server list | Required if the agent depends on any MCP tool |
| loadable | Whether a provider accepts the file unmodified | SC-002 (Claude), SC-003 (Copilot) — verified by copying into a scratch repo's `.claude/agents/` or `.github/agents/`, per FOLDER_STRUCTURE_PLAN.md §2.2/§2.3 |

## Source Folder

One of the two pre-consolidation folders being merged into one.

| Field | Description |
|---|---|
| `agents/prd-agent/` | Target/surviving folder — all consolidated content ends up here |
| `agents/prd-factory-planner-agent/` | Fully retired by FR-007; confirmed zero unique content beyond what FR-001/FR-002/FR-004 already migrate |

## Memory Registry Entry *(new — surfaced by research.md D1, not in the original spec)*

A tracked-asset record in `workflows/memory/registry/memory-registry.yaml`, referenced by `inventory-lock.json`.

| Field | Description | Validation rule |
|---|---|---|
| `asset_id` | e.g. `agent:mode-prd` | Must be removed or repointed, not left dangling, when its `source_path` file is retired (FR-010) |
| `source_path` | File path to the agent definition | Must resolve to a real file at all times — currently `agents/mode-prd.agent.md`; if FR-010 retires that file, this entry cannot simply be left pointing at a deleted path |
| `profile_path`, `example_path` | Companion memory-profile/example YAML files | Fate (retire vs. repoint) must be decided explicitly, not left orphaned |

## Documentation Surface

Non-skill, non-agent-definition files whose *content* (not structure) is in scope.

| File | Requirement | Current known defects (from the reconciliation reports) |
|---|---|---|
| `agents/prd-agent/AGENT.md` | FR-004 | Missing "Integration Points" section and 2 capability tags that exist only in factory-planner's copy |
| `agents/prd-agent/README.md` (× 2 → 1) | FR-005 | Both current copies are Codex export-tool boilerplate; dangling links to nonexistent `CONTRIBUTING.md`/`checksums.sha256` |
| `agents/prd-agent/instructions/AGENTS.md` | FR-006 | Skill-routing section references dead Codex session IDs or a fabricated 39-skill catalogue |
| `docs/AGENT-INDEX.md` | Not a formal FR, but an edge case (spec.md) and confirmed defect (research.md D1) | Contains a currently-dead link to `.github/agents/mode-prd.agent.md`, independent of this feature |

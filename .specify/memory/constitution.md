# PRD Agent Consolidation Constitution

## Core Principles

### I. Single Source of Truth (NON-NEGOTIABLE)

Every skill MUST exist in exactly one location under `agents/prd-agent/skills/`. No duplicate skill names across folders. When forked versions exist, their unique content MUST be union-merged before one folder is deleted. This eliminates maintenance burden, prevents version drift, and ensures all documentation is automatically current.

### II. Loadable Agent Definitions (NON-NEGOTIABLE)

Claude and Copilot agent definitions (`claude/agent.md`, `copilot/agent.md`) MUST contain valid YAML frontmatter (name, description, tools, model/mcp-servers) and be copy-paste-able into consuming repositories without modification. Definitions MUST load as valid agents in their respective platforms on first use.

### III. Accurate Documentation

README.md, AGENT.md, and instructions/AGENTS.md MUST describe the actual skill inventory on disk. Zero dangling links. Zero drift between documented skill count and filesystem skill count. Documentation is the contract with consumers; it MUST never lie.

### IV. Content Preservation

All unique content from forked skills (hermes/ folder, factory-planner distinctions, divergent reference files) MUST be reconciled into one version. Nothing is deleted without explicit audit. Forked `support-transition-rules.md` divergences are merged, not picked. `qa-planner` is promoted from hermes/, not abandoned.

### V. Clean, Maintainable Codebase

Export artifacts, sample/demo data, and legacy cruft (Codex cache dumps, fictional memory banks) MUST be removed. The folder structure reflects intentional decisions, not historical accidents. Every folder, file, and script has a clear, documented purpose.

## Success Criteria

- **SC-001**: Exactly 28 canonical skills in `agents/prd-agent/skills/` (no duplicates, no hermes/ folder).
- **SC-002**: Claude Code loads `claude/agent.md` as valid subagent without modification.
- **SC-003**: Copilot loads `copilot/agent.md` as valid custom agent without modification.
- **SC-004**: All 4 forked skills fully reconciled with zero content loss.
- **SC-005**: `agents/prd-factory-planner-agent/` folder deleted.
- **SC-006**: Documentation (README, AGENT.md, AGENTS.md) is 100% current; zero dangling links.
- **SC-007**: Fate of 10-skill generic tier explicitly documented (kept or retired).

## Development Workflow

1. **Audit Phase**: Identify duplicates, forked content, and unique material via reconciliation reports.
2. **Consolidation Phase**: Merge forked skills, union content, reconcile divergences.
3. **Documentation Phase**: Rewrite all docs from scratch, then validate against filesystem.
4. **Cleanup Phase**: Remove cruft, delete source folders, verify no workflows reference deleted paths.
5. **Validation Phase**: Run acceptance scenarios; confirm all success criteria met.

## Governance

**Constitution Status**: Active. All PRs to this spec MUST verify compliance with these principles.

**Amendment Process**: Material changes to principles require user approval and explicit ratification. Non-substantive clarifications (wording, examples) may be updated and noted in amendment date.

**Compliance Verification**: Before Phase 3 is marked complete, all 7 success criteria MUST be independently verified by reading filesystem, loading agent definitions in target platforms, and spot-checking documentation against disk.

**Version**: 1.0.0 | **Ratified**: 2026-09-10 | **Last Amended**: 2026-09-10

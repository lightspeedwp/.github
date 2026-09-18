# Quickstart: Validating the PRD Agent Consolidation

**Feature**: [spec.md](./spec.md) | **Data model**: [data-model.md](./data-model.md) | **Contracts**: [contracts/](./contracts/)

Run these checks after execution (`/speckit-tasks` → implementation) to confirm each success criterion in spec.md. All commands assume repo root (`/Users/ash/Studio/.github`).

## Prerequisites

- Execution of FR-001 through FR-010 complete (or the specific FR under test).
- No uncommitted changes you don't intend to include (`git status`).

## SC-001 — one copy of every skill, no `skills/hermes/`

```bash
find agents/prd-agent/skills -mindepth 1 -maxdepth 1 -type d | sort
test -d agents/prd-agent/skills/hermes && echo "FAIL: hermes/ still present" || echo "PASS: hermes/ removed"
# Every directory name should be unique by definition (filesystem guarantees this) —
# the real check is that no two *descriptions* describe the same job (research.md D2):
grep -h "^description:" agents/prd-agent/skills/*/SKILL.md | sort | uniq -d
# ^ any output here is a FAIL: duplicate description text across skills
```

## SC-002 — Claude agent definition loads

```bash
mkdir -p /tmp/speckit-scratch/.claude/agents
cp agents/prd-agent/claude/agent.md /tmp/speckit-scratch/.claude/agents/
# Open /tmp/speckit-scratch in Claude Code and confirm the subagent is listed and its
# description/tools/model render correctly (not template placeholders).
grep -E "^\s*(name|description|tools|model):" agents/prd-agent/claude/agent.md
```

## SC-003 — Copilot agent definition loads

```bash
mkdir -p /tmp/speckit-scratch/.github/agents
cp agents/prd-agent/copilot/agent.md /tmp/speckit-scratch/.github/agents/
grep -E "^\s*(name|description|tools|mcp-servers):" agents/prd-agent/copilot/agent.md
# Confirm mcp-servers (if present) lists only Linear/Google Workspace/GitHub —
# per research.md D1, Figma/Slack are NOT plugin-backed and must not appear.
```

## SC-004 — forked skill content fully accounted for

```bash
for s in approval-gate-manager project-memory-manager release-handoff-generator; do
  echo "=== $s ==="
  ls "agents/prd-agent/skills/$s/references/"
done
ls agents/prd-agent/skills/qa-planner/SKILL.md   # promoted, no merge
# Manually confirm: every reference filename that existed in the old
# skills/hermes/lightspeed-<s>/references/ tree (see SKILL_RECONCILIATION_REPORT.md §3
# for the pre-migration file list) is present here.
```

## SC-005 — `agents/prd-factory-planner-agent/` gone

```bash
test -d agents/prd-factory-planner-agent && echo "FAIL: still present" || echo "PASS: removed"
```

## SC-006 — docs match disk, zero drift

```bash
# Every skill mentioned in AGENT.md/README.md/AGENTS.md exists on disk:
comm -23 \
  <(grep -oE '`[a-z0-9-]+`' agents/prd-agent/README.md agents/prd-agent/AGENT.md | sed 's/.*`\(.*\)`/\1/' | sort -u) \
  <(ls agents/prd-agent/skills | sort -u)
# ^ any output = a documented skill that doesn't exist on disk (FAIL)

# No dangling links to CONTRIBUTING.md / checksums.sha256 (old defect):
grep -rn "CONTRIBUTING.md\|checksums.sha256" agents/prd-agent/README.md && echo "FAIL: dangling link" || echo "PASS"
```

## SC-007 — generic-tier fate documented

```bash
grep -rn "generic.tier\|generic-tier" agents/prd-agent/*.md .github/specs/001-prd-agent-consolidation/*.md
# Confirm a decision is written down somewhere (this spec's FR-003 resolution, or a
# follow-on reconciliation report per research.md D2) — not just "still open" language.
```

## Registry check (research.md D1 — not a numbered SC, but must not regress)

```bash
grep -n "agents/mode-prd.agent.md" workflows/memory/registry/memory-registry.yaml \
  workflows/memory/registry/inventory-lock.json
# Either: no output (entry removed), or the source_path shown resolves to a real file
# (repointed). A dangling reference to a deleted file is a FAIL.
find agents -iname "mode-prd.agent.md"   # should show 0 results once FR-010 is executed
```

## Full sweep

```bash
npm run validate:frontmatter   # per this repo's CLAUDE.md — all touched .md files must pass
npm run lint:md
```

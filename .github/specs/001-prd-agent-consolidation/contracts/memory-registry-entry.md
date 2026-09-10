# Contract: `workflows/memory/registry/memory-registry.yaml` entry for `agent:mode-prd`

**Consumer**: Whatever process reads `memory-registry.yaml` and `workflows/memory/registry/inventory-lock.json` to catalogue/track agent assets (consumer not yet identified — a task under FR-010 is to find it before assuming it's read-only tooling).

**Current entry** (`workflows/memory/registry/memory-registry.yaml`):

```yaml
- asset_id: "agent:mode-prd"
  asset_type: "agent"
  source_path: "agents/mode-prd.agent.md"
  profile_path: "workflows/memory/profiles/agents/mode-prd.memory-profile.yaml"
  example_path: "workflows/memory/examples/agents/mode-prd.memory.example.yaml"
```

## Rule this feature must not break

`source_path` MUST always resolve to a real file. FR-010 retires `agents/mode-prd.agent.md` — this entry cannot be left pointing at a deleted path.

## Resolution options for FR-010 execution (not decided by this plan — hand to `/speckit-tasks`)

1. **Remove the entry** (and its `inventory-lock.json` line) entirely, on the basis that the PRD agent is now tracked solely via `agents/prd-agent/`'s own manifest, not this registry.
2. **Repoint** `source_path` at `agents/prd-agent/copilot/agent.md`, keeping the asset tracked under its new canonical location.

Either way, `profile_path`/`example_path`'s fate must be decided explicitly (retire alongside, or repoint) — do not leave them orphaned pointing at a registry entry that no longer exists.

## Acceptance check

After FR-010 is executed: `grep -r "agents/mode-prd.agent.md" workflows/memory/` returns either nothing (option 1) or only paths that still resolve to real files (option 2).

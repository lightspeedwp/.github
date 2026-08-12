# Agent Complete Workflow

> **Full per-agent standardization cycle.** This prompt guides completing one agent end-to-end:
> agent code + plugin + hooks + instructions + starter prompts. Execute in a single chat
> per agent. Once merged, move to the next agent.

**Use this after** `PHASE_2_EXECUTION_PLAYBOOK.md` and `AGENTS_*.md` agent-specific prompts.

---

## Full Agent Cycle (Complete Before Next Agent)

For each agent in priority order:

### 1. Agent Code + Content (~2–4 hours)

- Branch: `feat/agent-standards-{slug}`
- PR: against `develop`
- Run: **Agent prompt** → `AGENTS_*.md` (Tour Operator, WP Config, Woo Config, or Batch 5-14)
- Output: `agents/{slug}-agent/` with 9 files, real content (playbook §0 floors)
- CI: 16+ checks green (or footers acknowledged)
- Merge: squash to `develop`, close issue

### 2. Plugin Integration (~1–2 hours)

- **Before branch:** `git checkout develop && git pull origin develop` (ensure fresh base after agent merge)
- Branch: `feat/agent-standards-{slug}-plugin` (same worktree as agent)
- Folder: `plugins/lightspeed-{domain}-{focus}/`
- Run: **Plugin prompt** → `PLUGINS_INTEGRATION_GUIDE.md`
- Output: README, INSTALL.md, copilot-plugin.json, provider manifests, schema validation
- Merge: squash to `develop`
- Reference: Phase 1 plugin `plugins/lightspeed-playwright-testing/` as template

### 3. Validation Hooks (~30–45 min)

- **Before branch:** `git checkout develop && git pull origin develop` (ensure fresh base after plugin merge)
- Branch: `feat/agent-standards-{slug}-hooks` (same worktree)
- Folder: `hooks/{hook-slug}/`
- Run: **Hooks prompt** → `INFRASTRUCTURE_HOOKS_TOOLS_WORKFLOWS.md` (hooks section)
- Output: `.cjs` implementation, tests, README, registry entries
- Reference: `hooks/agent-spec-validator/` as template
- Merge: squash to `develop`

### 4. Agent Instructions (~1–2 hours)

- **Before branch:** `git checkout develop && git pull origin develop` (ensure fresh base after hooks merge)
- Branch: `feat/agent-standards-{slug}-instructions` (same worktree)
- Folder: `instructions/{slug}-agent.instructions.md`
- Run: **Instructions prompt** → `INSTRUCTIONS_DOCUMENTATION_GUIDE.md`
- Output: YAML frontmatter + role declaration + overview + rules + guidance + examples + validation
- Merge: squash to `develop`

### 5. Starter Prompts (~1–2 hours)

- **Before branch:** `git checkout develop && git pull origin develop` (ensure fresh base after instructions merge)
- Branch: `feat/agent-standards-{slug}-starter-prompts` (same worktree)
- Folder: `prompts/{slug}-agent/` with 5–8 starter prompts
- Run: **Starter prompts prompt** → `STARTER_PROMPTS_GUIDE.md`
- Output: `prompt-*.md` files (e.g., `prompt-site-analysis.md`, `prompt-optimization-plan.md`)
- Merge: squash to `develop`

### 6. Tools / Validation Scripts (~30–60 min)

- **Before branch:** `git checkout develop && git pull origin develop` (ensure fresh base after prompts merge)
- Branch: `feat/agent-standards-{slug}-tools` (same worktree)
- Folder: `tools/agent-{slug}/` (if domain-specific) or `scripts/validate-{slug}.cjs`
- Run: **Tools prompt** → `INFRASTRUCTURE_HOOKS_TOOLS_WORKFLOWS.md` (tools section)
- Output: CLI scripts, helper functions, tests
- Merge: squash to `develop`

### 7. Workflow Updates (~30 min)

- **Before branch:** `git checkout develop && git pull origin develop` (ensure fresh base after tools merge)
- Branch: `feat/agent-standards-{slug}-workflows` (same worktree)
- Folder: `.github/workflows/`
- Run: **Workflows prompt** → `INFRASTRUCTURE_HOOKS_TOOLS_WORKFLOWS.md` (workflows section)
- Output: GitHub Actions that trigger on agent changes, run validation, report status
- Merge: squash to `develop`

### 8. Close & Move On

- All issues related to `{slug}` closed
- All 7 branches merged and deleted
- Move to next agent (repeat cycle)

---

## Parallel vs. Sequential

**Why sequential per agent:** Each agent builds on the prior layer (hooks depend on agent specs, instructions depend on agent capabilities). Sequential keeps dependencies clear and allows early feedback.

**When to batch:** If you have 2+ cycles in flight (agent A code + B plugin + C hooks), run those in parallel contexts; don't hold on A code until all 7 layers merge.

---

## Definition of "Agent Complete"

- ✅ Agent code merged (9 files, real content)
- ✅ Plugin merged (README, INSTALL, manifests)
- ✅ Hooks merged (validation automation in place)
- ✅ Instructions merged (documentation ready)
- ✅ Starter prompts merged (5–8 prompts available)
- ✅ Tools merged (CLI tooling in place)
- ✅ Workflows merged (GitHub Actions integrated)
- ✅ All issues closed
- ✅ All branches deleted

---

**Next:** Choose your first agent and run `AGENTS_*.md` prompt in a fresh chat, then cycle through 1–7 above.

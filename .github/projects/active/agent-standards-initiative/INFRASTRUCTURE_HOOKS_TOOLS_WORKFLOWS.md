# Infrastructure, Hooks, Tools & Workflows

> **Build the automation & validation layer.** After agent code + plugin are merged,
> create validation hooks, CLI tools, and GitHub Actions workflows that ensure
> ongoing agent quality and integration.

**Run after:** Agent code + plugin merged to `develop`.  
**Sequential execution:** Hooks → tools → workflows. Workflows require hooks and tools to exist, so run workflows after both are merged.

---

## 1. Validation Hooks

**Folder:** `hooks/{hook-slug}/`  
**Purpose:** Enforce agent quality standards automatically via pre-commit/pre-push hooks.

### Template Prompt

```markdown
# {Agent Name} Validation Hook

Create a pre-commit or pre-push hook that validates agent quality standards.

## Criteria

1. **Hook name:** `validate-{agent-slug}-spec`
2. **Location:** `hooks/validate-{slug}-spec/`
3. **Trigger:** Pre-commit (validate before commit)
4. **What to check:**
   - AGENT.md has required frontmatter & sections
   - All agent-only provider configs (claude/, copilot/, codex/, gemini/) present
   - JSON/YAML files parse cleanly
   - No credentials in output or config files
   - Line-count floors met (playbook §0)

5. **Reference:** Phase 1 hook `hooks/agent-spec-validator/`

## Output

- `.cjs` implementation (~100 lines)
- `test.js` with test cases
- README.md (how to run, what it checks)
- `register.cjs` entry in `hooks/registry.cjs`

Branch: `feat/agent-standards-{slug}-hooks`
```

### Standard Hook Structure

```
hooks/validate-{slug}-spec/
├── index.cjs              # Main hook (~100 lines)
├── test.js                # Tests (~50 lines)
├── README.md              # Documentation
└── package.json           # Dependencies
```

---

## 2. CLI Tools & Validation Scripts

**Folder:** `tools/agent-{slug}/` or `scripts/validate-{slug}.cjs`  
**Purpose:** Provide agents and developers CLI commands to validate, analyze, or manage the agent.

### Template Prompt

```markdown
# {Agent Name} CLI Tools

Create 2–3 CLI tools agents can use:

1. **Tool 1:** validate-config
   - Validates agent configuration against schema
   - Flags missing tools, invalid frontmatter
   - Suggests fixes

2. **Tool 2:** generate-docs
   - Auto-generates README from AGENT.md + provider configs
   - Creates provider-specific documentation

3. **Tool 3:** test-integration
   - Smoke tests that agent loads in each provider context
   - Validates provider-specific manifests

Reference: `scripts/` folder existing tools

Output: CJS files, ~50 lines each, with help text
```

---

## 3. GitHub Actions Workflows

**Folder:** `.github/workflows/`  
**Purpose:** Automate validation, testing, and reporting on agent PRs.

### Template Workflows

**Agent Validation Workflow** (`agent-{slug}-validate.yml`)

- Trigger: PR changes to `agents/{slug}-agent/**`
- Run: validate hook, JSON/YAML lint, schema checks
- Report: pass/fail with annotations

**Agent Integration Test** (`agent-{slug}-integration-test.yml`)

- Trigger: PR changes to agent or plugin
- Run: load agent in each provider context (simulate usage)
- Report: success + provider compatibility matrix

**Starter Prompts Verification** (`agent-{slug}-prompts-verify.yml`)

- Trigger: PR changes to `prompts/{slug}-agent/**`
- Run: frontmatter validation, count verification (5+ prompts)
- Report: prompt count + titles

### Reference

Phase 1 workflows: `.github/workflows/` → look for agent-related patterns

---

## Execution Order (Sequential)

1. **Hooks first** (30–45 min) — Validation automation
   - Branch: `feat/agent-standards-{slug}-hooks`
   - Merged to `develop` before proceeding

2. **Tools next** (30–60 min) — CLI utilities
   - Branch: `feat/agent-standards-{slug}-tools`
   - Merged to `develop` before proceeding

3. **Workflows last** (30 min) — CI integration
   - Branch: `feat/agent-standards-{slug}-workflows`
   - Merged to `develop` after hooks and tools
   - **Depends on:** Hooks and tools already in place

---

## Checklist (Per Agent Infrastructure)

### Hooks

- [ ] `validate-{slug}-spec/index.cjs` implemented (~100 lines)
- [ ] Tests pass (`npm test` in hooks folder)
- [ ] README explains what's checked
- [ ] Registered in `hooks/registry.cjs`
- [ ] PR merged, branch deleted

### Tools

- [ ] CLI 1: `validate-config` script (~50 lines)
- [ ] CLI 2: `generate-docs` script (~50 lines)
- [ ] CLI 3: `test-integration` script (~50 lines)
- [ ] All have `--help` and error handling
- [ ] PR merged, branch deleted

### Workflows

- [ ] Agent validation workflow (`agent-{slug}-validate.yml`)
- [ ] Integration test workflow (`agent-{slug}-integration-test.yml`)
- [ ] Starter prompts workflow (`agent-{slug}-prompts-verify.yml`)
- [ ] All trigger on correct file changes
- [ ] PR merged, branch deleted

---

*Use this in a dedicated chat for each agent. Reference: `AGENT_COMPLETE_WORKFLOW.md` steps 3, 6–7.*

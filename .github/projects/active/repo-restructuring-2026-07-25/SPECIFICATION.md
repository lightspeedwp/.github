# Repository Restructuring Specification

## LightSpeed .github Control Plane — Phase 0

**Project ID:** `repo-restructuring-2026-07-25`  
**Initiated:** 2026-07-26  
**Owner:** Ash Shaw (<ashley@lightspeedwp.agency>)  
**Status:** Phase 0 — Pre-flight Validation

---

## Executive Summary

The `.github` repository is undergoing a comprehensive restructuring to optimize for **multi-project portability** and **team governance**. This initiative moves portable reusable assets from `.github/`-scoped locations to visible root folders (e.g., `scripts/` → root-level `scripts/`), consolidates duplicate schema definitions, establishes VSCode multi-root workspace configuration, and prepares infrastructure for phased plugin adoption (Claude Code → GitHub Copilot → Gemini).

**Goals:**

- Centralize portable AI operations assets in root-level folders (agents, skills, instructions, plugins, hooks, workflows, schemas)
- Separate `.github/`-scoped repo-specific internals (templates, labels, workflows, CI/CD)
- Enable three-tier team collaboration: 2–3 core maintainers, 4–5 contributors, 8–9 WordPress project consumers
- Establish VSCode multi-root workspace for `.github` repository + linked WordPress projects
- Consolidate schemas from `.schemas/` (hidden) + legacy `schema/` (root) → visible `schemas/` (root)
- Create clean, unambiguous path references in validation scripts, workflows, and documentation
- Support phased plugin ecosystem rollout (Aug 2026 Claude Code → Sept Copilot → Oct Gemini)

**Timeline:** ~3–4 weeks (Phases 0–5)

---

## Confirmed Decisions

| Decision | Value | Rationale |
|----------|-------|-----------|
| **Team Structure** | 2–3 core + 4–5 contributors + 8–9 consumers | Aligns infrastructure with actual team capacity and role diversity |
| **Folder Organization** | Portable (root) vs. Repo-specific (.github/) | Enables portable asset reuse across LightSpeedWP projects without modification |
| **Schema Consolidation** | `.schemas/` + `schema/` → visible `schemas/` | Single source of truth; visible to all developers; simplifies relative paths in scripts |
| **VSCode Setup** | Multi-root workspace (`.github` + WordPress projects) | Developers work on both simultaneously; shared settings in `.github/.vscode/` |
| **Manual vs. Automation** | User moves folders (Finder) → Claude updates references (scripts) | Minimizes file overwrite risk; separates concerns; reduces errors |
| **Plugin Adoption** | Phased: Tier 1 (Claude Code + Copilot Aug/Sept) → Tier 2 (Codex opt-in Oct) → Tier 3 (Gemini emerging) | Allows iterative testing, feedback integration, and vendor evaluation |
| **Branch Naming** | `{type}/{scope}-{short-title}` (no `claude/` prefix) | Enforces governance; prevents accidental commits to protected branches |
| **PR Merge Target** | `develop` (default) | Only `release/*` and `hotfix/*` can target `main` |
| **Branch Reuse** | Names retired after merge | Prevents confusion from reused slugs in history; requires new branch names for new work |

---

## Folder Architecture Mapping

### Portable Reusable Assets (Moving to Root)

| Old Path | New Path | Type | Contents | Portable? |
|----------|----------|------|----------|-----------|
| `.github/scripts/` | `scripts/` | Directory | Validation, build, setup scripts (JSON schemas, node modules, etc.) | ✅ Yes |
| `.github/reports/` | `reports/` | Directory | Audit reports, metrics, release notes, project artefacts | ✅ Yes |
| `.github/projects/` | `projects/` | Directory | Active planning docs, diffs, decision records | ✅ Yes |
| `.github/tmp/` | `tmp/` | Directory | Temporary scratch files (cleaned before PR merge) | ✅ Yes |
| `.github/memory/` | `memory/` | Directory | Session memory, conversation logs, context | ✅ Yes |
| `.github/website/` | `website/` | Directory | Content for github.lightspeedwp.agency (handoff to web team) | ✅ Yes |
| `.schemas/` + `schema/` | `schemas/` | Directory (visible root) | JSON schemas for validation (single source of truth) | ✅ Yes |
| `agents/` | `agents/` | Directory | Portable agent specifications (already at root) | ✅ Yes |
| `skills/` | `skills/` | Directory | Portable skill implementations (already at root) | ✅ Yes |
| `instructions/` | `instructions/` | Directory | Portable instruction standards (already at root) | ✅ Yes |
| `hooks/` | `hooks/` | Directory | Portable Git hooks and guardrails (already at root) | ✅ Yes |
| `plugins/` | `plugins/` | Directory | Installable plugin bundles (already at root) | ✅ Yes |
| `cookbook/` | `cookbook/` | Directory | Recipes and implementation guides (already at root) | ✅ Yes |
| `workflows/` | `workflows/` | Directory | Portable agentic workflows (already at root) | ✅ Yes |

### Repo-Specific Assets (Remaining in `.github/`)

| Path | Type | Contents | Portable? |
|------|------|----------|-----------|
| `.github/` (root) | Directory | GitHub-native configuration, templates, workflows | ❌ No |
| `.github/ISSUE_TEMPLATE/` | Directory | Issue templates (GitHub-native) | ❌ No |
| `.github/PULL_REQUEST_TEMPLATE/` | Directory | PR templates (GitHub-native) | ❌ No |
| `.github/workflows/` | Directory | GitHub Actions workflows | ❌ No |
| `.github/DISCUSSION_TEMPLATE/` | Directory | Discussion templates (GitHub-native) | ❌ No |
| `.github/labels.yml` | File | Label definitions | ❌ No |
| `.github/custom-instructions.md` | File | Repo-local Copilot instructions | ❌ No |
| `.github/.vscode/` | Directory | Shared VSCode settings for `.github` repo | ❌ No |

---

## Dependency & Impact Audit

### Files That Will Require Path Updates

**1. Package.json**

- Schema validation globs: `schema/**` → `schemas/**`
- Script paths: `.github/scripts/` references → `scripts/`
- Test/validation command paths

**2. GitHub Actions Workflows** (`.github/workflows/*.yml`)

- Schema reference paths in validation steps
- Script invocation paths (e.g., `node .github/scripts/validate-*.js` → `node scripts/validate-*.js`)
- Artifact upload paths
- Workflow input/output references

**3. Validation Scripts** (currently in `.github/scripts/`)

- Relative path adjustments when moved to `scripts/`
- Schema path references (e.g., `../../.schemas/` → `../.schemas/` or `../../schemas/`)
- Documentation references

**4. Documentation** (`docs/**/*.md`)

- Path references to scripts, reports, projects, schemas
- Setup guides (VSCode, Git hooks, validation)
- Migration guide updates
- API/CLI reference updates

**5. Root-Level Configuration**

- `.gitignore` — may need updates for new root folder locations
- `CLAUDE.md` — references to folder paths
- `package.json` — schema, script, and glob references

**6. CI/CD & Build Files**

- Linting configuration (ESLint, Prettier, markdownlint)
- Pre-commit hooks (shell scripts)
- Build configuration files

### Services & Features That May Be Impacted

- **Validation Pipeline:** Schema validation, frontmatter checks, branch naming validation
- **Website Generation:** github.lightspeedwp.agency routing, documentation rendering, asset loading
- **Local Development:** VSCode workspace setup, Git hook installation, script paths
- **GitHub Automation:** Labeler workflows, template routing, PR checks
- **Documentation Generation:** Markdown linting, schema documentation rendering

---

## Phase Roadmap with Success Criteria

### Phase 0: Pre-flight Validation & Specification (Current)

**Duration:** 1–2 days  
**Owner:** Ash Shaw  
**Output:** SPECIFICATION.md, PREFLIGHT_CHECKLIST.md, sign-off

**Success Criteria:**

- ✅ All environment checks pass (Node.js, npm, Git versions)
- ✅ Repository is in clean state (no uncommitted changes)
- ✅ All existing tests pass
- ✅ All validation scripts pass
- ✅ Backup tag created and pushed: `backup/pre-restructure-2026-07-26`
- ✅ User signs off on specification and readiness

---

### Phase 1: Folder Reorganization (3 days)

#### Phase 1.A: Manual Folder Moves via macOS Finder

**Duration:** 1–2 hours  
**Owner:** Ash Shaw (manual in Finder)  
**Pre-requisite:** Phase 0 complete + sign-off

**Moves:**

1. `.github/scripts/` → `scripts/`
2. `.github/reports/` → `reports/`
3. `.github/projects/` → `projects/`
4. `.github/tmp/` → `tmp/`
5. `.github/memory/` → `memory/`
6. `.github/website/` → `website/`
7. `.schemas/` + `schema/` → `schemas/` (consolidation, visible root)

**Success Criteria:**

- ✅ All folders moved without file overwrites
- ✅ Folders verified at new locations
- ✅ Old `.github/` subfolders removed (except those in repo-specific list)
- ✅ Backup verified to prevent data loss

**⚠️ Important:** Only move folders if they don't already exist at the destination. If a folder exists in both locations, Finder will merge and potentially overwrite files.

---

#### Phase 1.B: Path Reference Updates (Claude Automation)

**Duration:** 2–3 days  
**Owner:** Claude (via detailed prompt execution)  
**Pre-requisite:** Phase 1.A complete

**Tasks:**

1. Update `package.json` schema globs and script paths
2. Update all `.github/workflows/*.yml` files with new script/schema paths
3. Update validation scripts with relative path adjustments
4. Update documentation (`docs/**/*.md`) with path references
5. Verify all updated files for syntax correctness

**Success Criteria:**

- ✅ All path references updated and validated
- ✅ No broken globs or invalid paths
- ✅ Validation scripts run successfully with new paths
- ✅ Tests pass with updated configurations

---

#### Phase 1.C: Folder Finalization & Documentation

**Duration:** 1 day  
**Owner:** Claude (via prompt execution)  
**Pre-requisite:** Phase 1.B complete

**Tasks:**

1. Create `README.md` files in new root folders (scripts/, reports/, projects/, etc.)
2. Create `schemas/README.md` with schema organization and usage guide
3. Create `.gitkeep` files for initially-empty directories
4. Update `CLAUDE.md` with new folder locations
5. Create migration guide: `docs/MIGRATION.md`

**Success Criteria:**

- ✅ All new root folders have documentation
- ✅ Schema organization documented
- ✅ Migration guide complete and reviewed
- ✅ Git status shows expected changes

---

### Phase 2: Schema Consolidation & Validation (2–3 days)

**Duration:** 2–3 days  
**Owner:** Claude (via detailed prompt execution)  
**Pre-requisite:** Phase 1 complete

**Tasks:**

1. Audit existing schemas in `schemas/` directory (previously `.schemas/` + `schema/`)
2. Identify duplicate or conflicting schema definitions
3. Update validation scripts to reference new `schemas/` location
4. Create schema registry documentation
5. Verify all schema references resolve correctly

**Success Criteria:**

- ✅ Schema audit complete; duplicates identified and resolved
- ✅ Validation scripts updated and tested
- ✅ All schemas accessible from new location
- ✅ Documentation updated

---

### Phase 3: VSCode Workspace Setup & Documentation (3–4 days)

**Duration:** 3–4 days  
**Owner:** Claude (via detailed prompt execution)  
**Pre-requisite:** Phase 2 complete

**Tasks:**

1. Create `.github/lightspeed-dev.code-workspace` (multi-root workspace definition)
2. Create `.github/.vscode/settings.json` (shared settings)
3. Create `.github/scripts/setup-vscode-workspace.sh` (automated setup with color-coded output)
4. Create `.github/scripts/setup-git-hooks.sh` (pre-commit hook installation)
5. Create `docs/vscode-workspace-setup.md` (comprehensive setup guide with troubleshooting)

**Success Criteria:**

- ✅ Workspace file created and valid
- ✅ Setup scripts executable and functional
- ✅ Documentation complete with troubleshooting
- ✅ Local developers can run `./setup-vscode-workspace.sh` and achieve full setup

---

### Phase 4: Plugin Adoption Strategy & Website Updates (3–4 days)

**Duration:** 3–4 days  
**Owner:** Claude (documentation) + Web team (github.lightspeedwp.agency deployment)  
**Pre-requisite:** Phase 3 complete

**Tasks:**

1. Create `docs/plugin-setup-claude-code.md` (Claude Code setup guide)
2. Create `docs/plugin-setup-github-copilot.md` (GitHub Copilot setup guide)
3. Create `docs/plugin-comparison.md` (feature matrix)
4. Create `docs/plugin-adoption-phases.md` (phased rollout timeline and support)
5. Document website update requirements for github.lightspeedwp.agency
   - Onboarding routing by role (contributor vs. consumer)
   - Getting-started guides (separate paths)
   - Documentation rendering
   - References/API updates

**Success Criteria:**

- ✅ Plugin setup guides complete and tested
- ✅ Phased rollout timeline documented
- ✅ Website update requirements documented and handed off to web team
- ✅ Tier 1 (Claude Code + Copilot) ready for Aug/Sept deployment

---

### Phase 5: Rollout & Team Communication (3+ weeks)

**Duration:** 3+ weeks  
**Owner:** Ash Shaw (communications) + Team (feedback)  
**Pre-requisite:** Phase 4 complete

**Timeline:**

- **Week 1 (Aug):** Announce Phase 0–3 completion; invite Tier 1 (Claude Code + Copilot) adoption
- **Week 2 (Sept):** Monitor adoption feedback; refine documentation; prepare Tier 2 (Codex optional)
- **Week 3+ (Oct onwards):** Evaluate emerging providers (Gemini); manage grace period for holdouts

**Tasks:**

1. Create team announcement communicating new folder structure
2. Publish plugin setup guides to team
3. Track adoption metrics (VSCode setup, plugin install, feedback)
4. Monitor grace period for developers using old paths
5. Provide support and answer questions
6. Iterate on documentation based on feedback
7. Plan Tier 2 rollout (optional plugins like Codex)

**Success Criteria:**

- ✅ Core team (Tier 1) fully migrated to new structure
- ✅ Contributors adopting new setup with minimal friction
- ✅ Documentation revised based on feedback
- ✅ Adoption tracking shows >80% team uptake
- ✅ Readiness for Tier 2 expansion

---

## What You Do vs. What Claude Does

### Phase 0

| Task | Owner | Method |
|------|-------|--------|
| Review SPECIFICATION.md & PREFLIGHT_CHECKLIST.md | You | Manual review |
| Run environment validation checks | You | Manual commands (checklist) |
| Verify `git status` clean | You | Manual command |
| Run test suites and validation scripts | You | Manual commands (checklist) |
| Create backup tag | You | Manual command |
| Sign off on readiness | You | Manual confirmation |

### Phase 1.A (Manual Folder Moves)

| Task | Owner | Method |
|------|-------|--------|
| Open macOS Finder | You | Click Finder icon |
| Navigate to repo root | You | Manual navigation |
| Drag `.github/scripts/` to `scripts/` | You | Drag & drop (Finder) |
| Drag `.github/reports/` to `reports/` | You | Drag & drop (Finder) |
| [... other moves ...] | You | Drag & drop (Finder) |
| Verify all moves complete | You | Spot-check in Finder |

### Phase 1.B (Path Reference Updates)

| Task | Owner | Method |
|------|-------|--------|
| Update package.json globs | Claude | Scripted edit (prompt-driven) |
| Update .github/workflows/*.yml | Claude | Scripted edit (prompt-driven) |
| Update validation scripts | Claude | Scripted edit (prompt-driven) |
| Update documentation paths | Claude | Scripted edit (prompt-driven) |
| Verify all changes | You | Review diffs before commit |

### Phase 1.C (Folder Finalization)

| Task | Owner | Method |
|------|-------|--------|
| Create README.md files | Claude | Scripted write (prompt-driven) |
| Create .gitkeep files | Claude | Scripted write (prompt-driven) |
| Update CLAUDE.md | Claude | Scripted edit (prompt-driven) |
| Create MIGRATION.md | Claude | Scripted write (prompt-driven) |

### Phases 2–5

| Task | Owner | Method |
|------|-------|--------|
| Schema audit & consolidation | Claude | Scripted analysis + updates |
| VSCode workspace setup | Claude | Scripted generation + documentation |
| Plugin adoption guides | Claude | Scripted documentation generation |
| Website update requirements | Claude | Documentation → handed to web team |
| Team communication | You | Publish announcements, manage adoption |

---

## Sign-Off

**Specification Reviewed & Approved By:**

- [ ] Ash Shaw (<ashley@lightspeedwp.agency>) — Date: _______________

**Pre-flight Validation Complete:**

- [ ] Environment checks: PASS
- [ ] Repository integrity: PASS
- [ ] Backup created: PASS
- [ ] Ready to proceed to Phase 1: **YES / NO**

---

## References

- [BRANCHING_STRATEGY.md](../../docs/BRANCHING_STRATEGY.md) — Branch naming and protection rules
- [PR_CREATION_PROCESS.md](../../docs/PR_CREATION_PROCESS.md) — PR workflow and templates
- [AGENTS.md](../../AGENTS.md) — Global AI governance rules

---

**Document Version:** 1.0  
**Last Updated:** 2026-07-26  
**Status:** Phase 0 — Awaiting Sign-Off

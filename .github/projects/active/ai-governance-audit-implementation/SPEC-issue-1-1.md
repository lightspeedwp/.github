---
openspec_version: "1.0"
type: "issue"
issue_type: "task"
title: "docs/governance: Move branch naming rules to top of CLAUDE.md"
labels: ["type:documentation", "area:governance", "priority:critical"]
milestone: "v1.1"
assignee: null
linked_issue: null
---

# Move Branch Naming Rules to Top of CLAUDE.md

## Problem

Branch naming rules in CLAUDE.md (lines 38-53) are placed mid-document after "What This Repository Is" section. This reduces visibility and makes it easy for AI agents to miss the critical requirement `{type}/{scope}-{title}`.

**Audit Finding:** CLAUDE.md rules are mid-document (not top-level) and don't explain:
- Why branch naming matters (PR templates won't assign if wrong)
- That `claude/` and `copilot/` are forbidden
- Consequences of violations

**Impact:** Claude/Copilot agents miss the rules and create branches like `claude/scope-title` instead of `feat/scope-title`, breaking PR template assignment.

## Solution

Move the "Git Branching Strategy" section to the **top of CLAUDE.md**, immediately after the frontmatter and before "What This Repository Is". Enhance it with:

1. **Clear pattern statement:** `{type}/{scope}-{title}` with emphasis on REQUIRED format
2. **All 34 allowed type values:** feat, fix, hotfix, docs, ci, build, test, perf, refactor, chore, security, design, a11y, ux, i18n, ops, proto, ds, api, schema, telemetry, content, seo, config, migrate, qa, uat, audit, codex, and others from validate-branch-name.js
3. **Forbidden prefixes section:**
   ```markdown
   **FORBIDDEN PREFIXES** (Cannot be used):
   - `claude/` — Reserved for Claude Code internal sessions
   - `copilot/` — Reserved for GitHub Copilot integration
   - `openai/` — Reserved for OpenAI integration
   ```
4. **Consequences section:**
   ```markdown
   **Why this matters:** Incorrect branch prefixes break:
   - PR template assignment (templates are routed by branch prefix)
   - GitHub Actions workflows that depend on branch naming
   - Validation checks that enforce governance
   - Downstream automation and issue tracking
   ```
5. **Examples for each type:** At least 2-3 examples for feat, fix, docs, ci, refactor, chore
6. **Pre-push validation reminder:**
   ```bash
   npm run validate:branch-name -- --branch <your-branch>
   ```

## Definition of Done

- [ ] Branch naming section moved to top of CLAUDE.md (before line 50)
- [ ] Section includes all 4 components above (pattern, types, forbidden, consequences)
- [ ] All 34 allowed type values listed with brief descriptions
- [ ] At least 10 examples covering major types
- [ ] Cross-referenced to `.github/instructions/branch-naming.instructions.md` for detailed rules
- [ ] Cross-referenced to `docs/BRANCHING_STRATEGY.md` (create if missing)
- [ ] Frontmatter includes "branch naming" as searchable keyword
- [ ] Changes validated with: `npm run lint:md`
- [ ] PR merged and deployed

## Related Issues

- [#1592](https://github.com/lightspeedwp/.github/issues/1592) — Label Prefix Governance Enforcement
- Issue 1.2 — Add branch naming section to AGENTS.md (dependent)
- Issue 1.3 — Add branch naming to custom-instructions.md (dependent)

## Audit References

**Source:** Phase 1-2 Governance Audit Report, section 1.1  
**Finding:** CLAUDE.md lines 38-53 are mid-document; rules don't explain forbidden prefixes or consequences  
**Impact:** AI agents miss rules; Claude creates `claude/*` branches, Copilot creates `copilot/*` branches

---
title: "Stale Branches for Cleanup"
description: "List of merged/gone branches that can be safely deleted from the repository"
file_type: "documentation"
created_date: "2026-07-24"
last_updated: "2026-07-24"
owners:
  - LightSpeed Team
tags:
  - maintenance
  - branches
  - cleanup
status: active
stability: stable
domain: governance
language: en
---

# Stale Branches for Cleanup

**Total:** 28 branches marked `[gone]` (merged to remote, safe to prune locally)  
**Date identified:** 2026-07-24  
**Action:** Run `git fetch --prune` to clean these up

## Branches Ready for Deletion

These branches have been merged upstream and are safe to delete:

### Chore/Maintenance Branches (7)

- `chore/coderabbit-improvements-1126` — gitattributes improvements
- `chore/eslint-10-migration` — ESLint 10.x upgrade
- `chore/gitattributes-line-ending-normalization` — CRLF/LF standardization
- `chore/js-yaml-5-migration` — js-yaml 5.x upgrade
- `chore/mergify-dependabot-auto-queue` — Mergify queue hardening
- `chore/pr-automation-review-framework` — PR automation audit
- `chore/typescript-eslint-eslint-plugin-8.61.1` — TypeScript ESLint upgrade

### CI/Pipeline Branches (2)

- `ci/fix-linting-workflows-and-mergify` — Linting workflow fixes
- `dependabot/github_actions/actions/setup-node-7` — Node.js setup action update

### Agent/Feature Branches (7)

- `claude/phase-2-agent-standards-9274ea` — Phase 2 agent standards
- `dependabot/npm_and_yarn/typescript-7.0.2` — TypeScript upgrade
- `dependabot/npm_and_yarn/typescript-eslint/eslint-plugin-8.61.1` — TypeScript ESLint
- `dependabot/npm_and_yarn/typescript-eslint/eslint-plugin-8.65.0` — TypeScript ESLint
- `dependabot/npm_and_yarn/website/astro-7.0.7` — Astro upgrade
- `dependabot/npm_and_yarn/website/astro-7.1.0` — Astro upgrade
- `dependabot/npm_and_yarn/website/marked-18.0.6` — Marked library upgrade

### Dependabot Branches (3)

- `dependabot/npm_and_yarn/website/svelte-5.56.6` — Svelte upgrade
- `feat/agent-standards-batch-5-14` — Agent standardization batch
- `feat/agent-standards-playwright-testing` — Playwright agent multi-provider

### Fix/Improvement Branches (8+)

- `fix/branch-cleanup-safety` — Branch cleanup safety hardening
- `fix/ci-infrastructure-bugs` — CI infrastructure fixes
- `fix/footer-cleanup-and-validation` — Footer validation/cleanup
- `fix/meta-agent-dry-run-writes` — Meta agent dry-run fixes
- `fix/meta-agent-sync-accumulation` — Meta agent sync improvements
- `fix/meta-agent-frontmatter-update` — Meta agent frontmatter
- `fix/meta-workflow-ci-and-push-flow-followup` — Meta workflow follow-up
- `fix/milestone-capacity-exclusion-and-tests` — Milestone capacity tests
- `fix/template-enforcement-stale-issue-refetch` — Template enforcement
- `fix/validation-footer-and-mermaid` — Validation tools improvements

### Temporary/Experimental Branches (2+)

- `tmp-eslint10` — ESLint 10 experimental
- `tmp-jsyaml5` — js-yaml 5 experimental
- `tse-plugin-clean` — TypeScript ESLint plugin cleanup

---

## Cleanup Commands

**Prune all gone branches:**

```bash
git fetch --prune origin
```

**Delete all local gone branches (careful):**

```bash
git branch -v | grep '\[gone\]' | awk '{print $1}' | xargs -I {} git branch -D {}
```

**Verify cleanup:**

```bash
git branch -v | grep '\[gone\]' | wc -l
# Should return 0 after pruning
```

---

## Notes

- These branches were merged to develop/main via PR and can be safely removed
- Remote tracking branches will be auto-cleaned with `git fetch --prune`
- Local branches must be deleted manually with `git branch -D`
- No active work depends on these branches

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

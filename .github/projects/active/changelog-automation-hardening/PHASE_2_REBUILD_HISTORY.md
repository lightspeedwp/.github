---
title: "Phase 2: Rebuild Lost History — Merged PRs (May 24 — July 24, 2026)"
description: "Reconstruction plan for changelog entries from 40+ merged PRs"
created_date: "2026-07-24"
file_type: "implementation-guide"
---

# Phase 2: Rebuild Lost History

## Overview

This phase reconstructs the [Unreleased] section of CHANGELOG.md from merged PRs covering May 24 — July 24, 2026 (approximately 2 months). These entries were lost due to the changelog automation bug described in Phase 1.

**Scope:** 40+ merged PRs  
**Target:** All user-facing changes since last release  
**Outcome:** Complete [Unreleased] section with all relevant PRs/issues linked  

---

## Source Data: Merged PRs (May 24 — July 24, 2026)

### PRs to Include in Rebuild

| # | Title | Category | Include? | Notes |
|---|-------|----------|----------|-------|
| 1250 | docs: Add issue triage & template application guide | Docs | ❌ | Documentation-only |
| 1226 | ci(markdown-linting): Optimize CI scope — Phase 1 | Infra | ✅ | User-facing improvement |
| 1223 | research: Complete audit with findings & guide | Docs | ❌ | Research/audit document |
| 1222 | docs: Comprehensive maintenance & branch cleanup | Docs | ❌ | Documentation-only |
| 1221 | docs(agents): Phase 2B skills architecture audit | Docs | ❌ | Audit report |
| 1212 | feat: Implement quirky footers with schema validation | Feature | ✅ | New feature |
| 1211 | chore: Add .gitignore entries for generated skills | Chore | ❌ | Infrastructure |
| 1204 | docs: Audit changelog consolidation needs | Docs | ❌ | Audit report |
| 1203 | fix(ci): Remove non-existent label from governance | Fix | ✅ | Bug fix |
| 1202 | fix(ci): Add missing aliases for type labels | Fix | ✅ | Bug fix |
| 1201 | fix(ci): Replace silent reopening with guidance | Fix | ✅ | Bug fix |
| 1200 | feat(ci): Add issue DoD validation workflow | Feature | ✅ | New feature |
| 1199 | refactor(prd-factory-planner-agent): Phase 2A standardization | Feature | ✅ | Feature enhancement |
| 1196 | feat(agents): Phase 2 Batch 2 - PRD Combined Agent | Feature | ✅ | New feature |
| 1195 | feat(agents): Phase 2A — 4 agents complete, 6 in progress | Feature | ✅ | Feature enhancement |
| 1191 | docs: Add PR automation workflow audit + fix research labels | Feature | ✅ | Feature fix + docs |
| 1161 | audit: Comprehensive aging and SLA annotation review | Docs | ❌ | Audit document |
| 1159 | ci: Fix linting workflow blockers — consolidate duplicates | Fix | ✅ | Bug fix |
| 1151 | feat: Add org issue-field writer infrastructure (MVP) | Feature | ✅ | New feature |
| 1150 | build: Make project-meta-sync secret-gating explicit | Fix | ✅ | Bug fix |
| 1149 | feat(skills): Contribute KWV block-theme skills (8 stubs + 11 new) | Feature | ✅ | New feature |
| 1148 | fix: Reconcile Priority field vocabulary + regression test | Fix | ✅ | Bug fix |
| 1144 | docs(agent-standards): Refine Phase 2 prompts | Docs | ❌ | Documentation-only |
| 1142 | feat: Standardize wp-config-agent for multi-provider | Feature | ✅ | Feature enhancement |
| 1141 | feat: Standardize woo-config-agent for multi-provider | Feature | ✅ | Feature enhancement |
| 1140 | feat: Standardize tour-operator-config-agent for multi-provider | Feature | ✅ | Feature enhancement |
| 1139 | feat: Complete agent-standards-initiative Phase 1 + PRD merge | Feature | ✅ | Feature milestone |
| 1138 | fix(meta): Use fixed branch name + add mergify rule | Fix | ✅ | Bug fix |
| 1137 | fix(ci): Resolve yaml.safeLoad deprecation + false positives | Fix | ✅ | Bug fix |
| 1133 | chore(meta): Automated meta-agent sync | Chore | ❌ | Infrastructure |
| 1132 | fix(milestones): Implement capacity exclusion filtering | Fix | ✅ | Bug fix |
| 1130 | chore: Improve .gitattributes for line ending normalization | Chore | ❌ | Infrastructure |
| 1127 | chore: Apply CodeRabbit code quality improvements | Chore | ❌ | Code quality |
| 1123 | fix(validation): Address footer truncation & mermaid workflow | Fix | ✅ | Bug fix |
| 1115 | fix: Footer cleanup and validation | Fix | ✅ | Bug fix |
| 1113 | feat: Implement version-based milestone allocation | Feature | ✅ | New feature |
| 1108 | feat(agents): Playwright Testing Agent multi-provider + Phase 1 infra | Feature | ✅ | Major feature |
| 1086 | fix(ci): Re-fetch live issue state in template enforcement | Fix | ✅ | Bug fix |
| 1084 | fix: Honour --dry-run in meta.agent.js footer/badges/metrics | Fix | ✅ | Bug fix |
| 1082 | docs: Add GitHub template governance guidance for AI agents | Docs | ❌ | Documentation-only |

---

## Changelog Entries to Add

### ✅ Added — New Features & Capabilities

```markdown
### Added

- **Playwright Testing Agent multi-provider support** — Converted ChatGPT/Codex 
export into standardised multi-provider agent supporting Claude, GitHub Copilot, 
and OpenAI Codex. Added provider-agnostic AGENT.md, per-provider configs, tools/
skill definitions, and plugin packaging. ([PR #1108](https://github.com/lightspeedwp/.github/pull/1108), 
[#1079](https://github.com/lightspeedwp/.github/issues/1079))

- **Agent standardization Phase 1 infrastructure** — Established reusable 
multi-provider agent pattern with JSON schemas, validation hooks, instruction 
files, and cookbook playbooks. Four validators with unit tests for agent-spec, 
consistency, plugin integrity, and security. ([PR #1108](https://github.com/lightspeedwp/.github/pull/1108))

- **Version-based milestone allocation strategy** — Implemented automatic 
version-based milestone assignment (v1.0–v1.6) for structured release planning 
with capacity tracking and type-exclusion filtering. ([PR #1113](https://github.com/lightspeedwp/.github/pull/1113), 
[#1112](https://github.com/lightspeedwp/.github/issues/1112))

- **PRD Factory & Planner Agent Phase 2A standardization** — Completed 
comprehensive standardization of 39 available skills with skill routing guidance, 
provider config documentation, and Phase 2A completion status. ([PR #1199](https://github.com/lightspeedwp/.github/pull/1199), 
[#1197](https://github.com/lightspeedwp/.github/issues/1197), [#1079](https://github.com/lightspeedwp/.github/issues/1079))

- **Multi-provider WooCommerce Config Agent** — Standardised woo-config-agent 
to Phase 1 pattern with seven-phase provider-agnostic prompt, Claude tools, 
Copilot skills, and OpenAI functions with PCI DSS guardrails. ([PR #1141](https://github.com/lightspeedwp/.github/pull/1141), 
[#1101](https://github.com/lightspeedwp/.github/issues/1101))

- **Multi-provider WordPress Config & Tour Operator Config Agents** — 
Standardised wp-config-agent and tour-operator-config-agent to Phase 1 pattern 
with per-provider implementations. ([PR #1142](https://github.com/lightspeedwp/.github/pull/1142), 
[PR #1140](https://github.com/lightspeedwp/.github/pull/1140))

- **PRD Combined Agent (Phase 2B)** — Consolidated prd-agent and 
prd-factory-planner-agent (917 files, 144k LOC) into unified multi-provider 
agent with full standardization. ([PR #1196](https://github.com/lightspeedwp/.github/pull/1196), 
[#1094](https://github.com/lightspeedwp/.github/issues/1094), [#1095](https://github.com/lightspeedwp/.github/issues/1095))

- **Agent batch standardization (Phase 1 complete)** — Standardised 4 agents 
to multi-provider pattern with 6 more in progress as part of Phase 2A. ([PR #1195](https://github.com/lightspeedwp/.github/pull/1195))

- **Issue Definition of Done (DoD) validation workflow** — Automated CI workflow 
validates all issues have DoD sections with proper formatting, preventing 
incomplete issues from being shipped. ([PR #1200](https://github.com/lightspeedwp/.github/pull/1200), 
[#1014](https://github.com/lightspeedwp/.github/issues/1014))

- **Quirky footers system with schema validation** — Implemented footer parsing 
and schema validation infrastructure with comprehensive test coverage. ([PR #1212](https://github.com/lightspeedwp/.github/pull/1212))

- **KWV block-theme skills** — Contributed 8 skill stubs and 11 new substantive 
block-theme skills for WordPress theme development. ([PR #1149](https://github.com/lightspeedwp/.github/pull/1149))

- **Org issue-field writer infrastructure (MVP)** — Added infrastructure for 
programmatic issue field writing to support automation. ([PR #1151](https://github.com/lightspeedwp/.github/pull/1151), 
[#1145](https://github.com/lightspeedwp/.github/issues/1145))

- **CI markdown-linting scope optimization** — Comprehensive audit of 9,024 
markdown files identified 38–45% scope reduction by excluding vendored assets, 
generated reports, and platform-managed content. Updated CI workflow with 
documented exclusion patterns. ([PR #1226](https://github.com/lightspeedwp/.github/pull/1226), 
[#1224](https://github.com/lightspeedwp/.github/issues/1224))

- **PR automation workflow improvements** — Added PR labeling rules and research/* 
label automation to prevent duplicate labeling. ([PR #1191](https://github.com/lightspeedwp/.github/pull/1191))
```

### ✅ Fixed — Bug Fixes

```markdown
### Fixed

- **Changelog automation: Section headers destroyed on merge** — The 
merge-entries workflow was discarding section headers during deduplication, 
corrupting changelog structure on every PR merge. Fixed deduplication logic to 
preserve headers and limited scope to [Unreleased] section only. ([PR #1275](https://github.com/lightspeedwp/.github/pull/1275))

- **Meta-agent workflow: Missing npm dependency and direct push to protected branch** — 
Added missing npm ci step and routed commits through auto-merged PR instead of 
direct push to respect branch protection. ([PR #1073](https://github.com/lightspeedwp/.github/pull/1073), 
[#1072](https://github.com/lightspeedwp/.github/issues/1072))

- **Validation tool robustness: Footer truncation and mermaid workflow** — 
Fixed critical data loss bug where replaceFooterTail() truncated file bodies; 
improved mermaid workflow error handling. ([PR #1123](https://github.com/lightspeedwp/.github/pull/1123), 
[#1118](https://github.com/lightspeedwp/.github/issues/1118), [#1119](https://github.com/lightspeedwp/.github/issues/1119))

- **Milestone capacity: Type exclusion filtering not implemented** — Configured 
type exclusions (chore, task, docs) were not applied when counting issues toward 
capacity limits. Implemented type-based filtering. ([PR #1132](https://github.com/lightspeedwp/.github/pull/1132), 
[#1131](https://github.com/lightspeedwp/.github/issues/1131))

- **CI linting workflow blockers** — Consolidated duplicate checks and fixed 
invalid YAML structure in cleanup-branches.yml workflow. ([PR #1159](https://github.com/lightspeedwp/.github/pull/1159), 
[PR #1075](https://github.com/lightspeedwp/.github/pull/1075), [#1074](https://github.com/lightspeedwp/.github/issues/1074))

- **Mergify config: Invalid speculative_checks field** — Removed unsupported 
field that was causing Mergify's status checks to permanently fail on all PRs. 
([PR #1077](https://github.com/lightspeedwp/.github/pull/1077), [#1076](https://github.com/lightspeedwp/.github/issues/1076))

- **Branch cleanup automation: Safety hardening** — Fixed four critical safety 
issues: daysSince() date handling, isMerged() false positives, deleteLocalBranch() 
force-delete risk, and error handling for invalid patterns. ([PR #1071](https://github.com/lightspeedwp/.github/pull/1071), 
[#1069](https://github.com/lightspeedwp/.github/issues/1069))

- **Meta-agent workflow: Branch name accumulation** — Fixed branch naming to 
prevent PR accumulation and added Mergify rule. ([PR #1138](https://github.com/lightspeedwp/.github/pull/1138))

- **YAML deprecation and footer validation** — Resolved js-yaml 5.x safeLoad 
deprecation and fixed false positives in footer validation. ([PR #1137](https://github.com/lightspeedwp/.github/pull/1137))

- **Priority field vocabulary reconciliation** — Reconciled conflicting Priority 
field values and added regression test. ([PR #1148](https://github.com/lightspeedwp/.github/pull/1148))

- **Project-meta-sync secret-gating** — Made GitHub App secret gating explicit 
to fail loudly on configuration errors instead of silently. ([PR #1150](https://github.com/lightspeedwp/.github/pull/1150))

- **CI template enforcement: Re-fetch live issue state** — Fixed stale issue 
state being used in template enforcement guards. ([PR #1086](https://github.com/lightspeedwp/.github/pull/1086), 
[#1085](https://github.com/lightspeedwp/.github/issues/1085))

- **Meta-agent: Honour --dry-run flag** — Fixed dry-run mode not being honoured 
in footer, badges, and metrics writes. ([PR #1084](https://github.com/lightspeedwp/.github/pull/1084), 
[#1083](https://github.com/lightspeedwp/.github/issues/1083))

- **CI label governance: Missing labels** — Added missing type label aliases and 
removed non-existent labels from governance configuration. ([PR #1202](https://github.com/lightspeedwp/.github/pull/1202), 
[PR #1203](https://github.com/lightspeedwp/.github/pull/1203))

- **Template enforcement: Silent issue reopening** — Replaced silent reopening 
with guidance comment and status:needs-more-info label for incomplete issues. 
([PR #1201](https://github.com/lightspeedwp/.github/pull/1201), [#1014](https://github.com/lightspeedwp/.github/issues/1014))

- **Footer cleanup and validation** — Comprehensive footer format standardization 
and validation improvements. ([PR #1115](https://github.com/lightspeedwp/.github/pull/1115))
```

### ✅ Changed — Breaking Changes & Modifications

```markdown
### Changed

- **Babel toolchain upgraded to 8.x** — Major version bump with peer-dependency 
requirements. Removed deprecated proposal plugins (natively handled by preset-env 
now). ([PR #1044](https://github.com/lightspeedwp/.github/pull/1044))

- **ESLint upgraded to 10.x** — Major version bump from 8.57.1 to 10.5.0. Added 
@eslint/js devDependency, raised Node requirement to >=20.19.0, fixed 25 new-rule 
violations, migrated .eslintignore to flat-config. ([PR #1046](https://github.com/lightspeedwp/.github/pull/1046))

- **js-yaml upgraded to 5.x** — Updated from 4.2.0 to 5.2.1. Default export removed; 
all code updated to use named imports. ([PR #1047](https://github.com/lightspeedwp/.github/pull/1047))

- **@typescript-eslint/eslint-plugin upgraded** — Bumped from 8.60.1 to 8.61.1 
(patch release). ([PR #1045](https://github.com/lightspeedwp/.github/pull/1045))

- **GitHub Actions minute optimisation** — Reduced duplicate CI and high-fanout 
workflow triggers, strengthened concurrency cancellation. ([PR #1054](https://github.com/lightspeedwp/.github/pull/1054))

- **Dependabot auto-merge unblocked** — Fixed Mergify configuration that prevented 
all dependabot PRs from merging. Consolidated redundant rules, replaced invalid 
approve action with review action, added backup GitHub Actions workflow. ([PR #1020](https://github.com/lightspeedwp/.github/pull/1020), 
[#968](https://github.com/lightspeedwp/.github/issues/968))

- **Branch cleanup automation** — Added reusable cleanup script, weekly scheduled 
workflow, and report generation for stale merged branches with safety guardrails. 
([PR #1067](https://github.com/lightspeedwp/.github/pull/1067), [#1066](https://github.com/lightspeedwp/.github/issues/1066))
```

---

## Format Verification Checklist

Before adding entries, verify:

- [ ] Each entry starts with bullet `-`
- [ ] Title is in bold: `**Title**`
- [ ] Em-dash separator: ` — `
- [ ] Description is concise (<150 chars)
- [ ] PR link is present: `([PR #NNNN](url))`
- [ ] Related issue links are present (if applicable)
- [ ] Links point to valid GitHub URLs
- [ ] No duplicate entries
- [ ] Entries are under correct section (Added, Fixed, Changed)

---

## Adding to CHANGELOG.md

**Steps:**

1. Open `CHANGELOG.md`
2. Locate `## [Unreleased]` section
3. Insert sections in order: Removed, Deprecated, Added, Changed, Fixed, Security
4. Add all entries from above under appropriate sections
5. Verify formatting matches guidelines
6. Run validation: `npm run validate:changelog`
7. Commit with message: `chore(changelog): rebuild entries from PRs #1082–#1250`

---

## Validation

After adding entries, run:

```bash
npm run validate:changelog
```

This verifies:

- ✅ Entry format
- ✅ Link validity
- ✅ Section organization
- ✅ No duplicates
- ✅ Frontmatter correctness

---

## Next Step

Once complete, move to **Phase 3: Validation & Merge** (#1273) to:

- Finalize rules and guidelines
- Add contributor checklist
- Create validation automation
- Merge consolidated changelog to develop

---

**Related:** Epic #1271, Phase 2 Issue #1272  
**Last Updated:** 2026-07-24

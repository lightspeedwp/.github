---
title: "Template Enforcement & Governance — Action Plan"
description: "Immediate next steps, timeline, and ownership for the 4-phase implementation"
file_type: "documentation"
version: "1.1.0"
last_updated: "2026-06-08"
created_date: "2026-06-01"
authors: ["LightSpeed Team"]
maintainer: "LightSpeed Team"
status: active
---

# Template Enforcement & Governance — Action Plan

**Project Status:** Local implementation complete; remote/admin follow-up open
**Implemented Scope:** Template routing, validation, fixtures, and governance guidance
**Follow-Up Scope:** GitHub organisation settings and branch-protection verification

---

## Closeout Actions

### Completed

- Added `.github/PULL_REQUEST_TEMPLATE/config.yml` as the canonical routing map.
- Updated `.github/pull_request_template.md` to act as the root router.
- Added portable instruction files for PR and issue template usage.
- Added the template-enforcement workflow and fixture pack.
- Updated the repo governance docs to match the implemented routing model.

### Remaining

1. Verify the two missing issue types in GitHub organisation settings.
2. Verify the branch-protection status check name for template enforcement.

### Follow-Up Tracking

- The remote/admin checks are tracked in `REMOTE_ADMIN_CHECKS.md`.
- Once those checks pass, update the closeout docs and archive the follow-up task.

---

**Total Issues:** 13 (historical backlog; implemented scope now separated from remote checks)
**Timeline:** 2–3 weeks
**Effort:** ~11.5 hours

---

## 🚀 Immediate Actions (This Week)

### Step 1: Assign Phase 1 Issues (Critical Path)

**Deadline:** Tomorrow
**Owner:** Project Lead

| Issue | Title | Assigned To | Status |
|-------|-------|-------------|--------|
| [#709](https://github.com/lightspeedwp/.github/issues/709) | Add 2 missing issue types to org settings | *Unassigned* | Blocked |
| [#710](https://github.com/lightspeedwp/.github/issues/710) | Create PULL_REQUEST_TEMPLATE/config.yml | *Unassigned* | Blocked on [#709](https://github.com/lightspeedwp/.github/issues/709) |
| [#711](https://github.com/lightspeedwp/.github/issues/711) | Update ISSUE_TEMPLATE/config.yml | *Unassigned* | Blocked on [#709](https://github.com/lightspeedwp/.github/issues/709) |

**Note:** Issue [#709](https://github.com/lightspeedwp/.github/issues/709) is manual (GitHub UI, not code). It must complete before [#710](https://github.com/lightspeedwp/.github/issues/710)/[#711](https://github.com/lightspeedwp/.github/issues/711) can start.

---

### Step 2: Manually Add Issue Types to GitHub Org Settings

**Deadline:** Tomorrow
**Owner:** Organization Admin
**Issue:** [#709](https://github.com/lightspeedwp/.github/issues/709)

**Steps:**

1. Go to the GitHub organisation settings page for issue types
2. Add "Help" (color: `#4393F8`, type:help)
3. Add "User Experience Feedback" (color: `#DB61A2`, type:ux-feedback)
4. Verify all 35 type entries appear in issue creation form
5. Close [#709](https://github.com/lightspeedwp/.github/issues/709)

**Validation:** All 35 issue types visible in "Create issue" form, colors match `.github/issue-types.yml`

---

### Step 3: Align Phase 1 Config Files

**Deadline:** End of Week 1
**Owner:** TBD (2 developers, ~1.5h each)
**Issues:** [#710](https://github.com/lightspeedwp/.github/issues/710), [#711](https://github.com/lightspeedwp/.github/issues/711)

**Deliverables:**

- `PULL_REQUEST_TEMPLATE/config.yml` — branch prefix → template routing map
- `ISSUE_TEMPLATE/config.yml` — enhanced metadata with automation notes

**Dependencies:** [#709](https://github.com/lightspeedwp/.github/issues/709) must be complete first

---

## 📅 Phase Timeline

| Phase | Issues | Effort | Timeline | Status |
|-------|--------|--------|----------|--------|
| **1: Foundation** | [#709](https://github.com/lightspeedwp/.github/issues/709)–[#711](https://github.com/lightspeedwp/.github/issues/711) | 2h | Week 1 | Not started |
| **2: Documentation** | [#712](https://github.com/lightspeedwp/.github/issues/712)–[#716](https://github.com/lightspeedwp/.github/issues/716) | 5.5h | Week 1–2 | Not started |
| **3: Automation** | [#717](https://github.com/lightspeedwp/.github/issues/717)–[#720](https://github.com/lightspeedwp/.github/issues/720) | 3h | Week 2–3 | Not started |
| **4: Alignment** | [#721](https://github.com/lightspeedwp/.github/issues/721) | 1h | Week 3 | Not started |

**Critical Path:**

```
[#709](https://github.com/lightspeedwp/.github/issues/709) (manual) → [#710](https://github.com/lightspeedwp/.github/issues/710), [#711](https://github.com/lightspeedwp/.github/issues/711) → [#712](https://github.com/lightspeedwp/.github/issues/712)–[#716](https://github.com/lightspeedwp/.github/issues/716) → [#717](https://github.com/lightspeedwp/.github/issues/717)–[#720](https://github.com/lightspeedwp/.github/issues/720) → [#721](https://github.com/lightspeedwp/.github/issues/721)
```

---

## 👥 Recommended Team Structure

| Role | Effort | Issues |
|------|--------|--------|
| **Org Admin** (1–2h) | Add issue types manually | [#709](https://github.com/lightspeedwp/.github/issues/709) |
| **Backend/Automation Dev** (4–5h) | Config files, workflows, agent spec | [#710](https://github.com/lightspeedwp/.github/issues/710), [#711](https://github.com/lightspeedwp/.github/issues/711), [#717](https://github.com/lightspeedwp/.github/issues/717), [#718](https://github.com/lightspeedwp/.github/issues/718) |
| **Documentation Lead** (5–6h) | Instruction files, AGENT.md, CLAUDE.md updates | [#712](https://github.com/lightspeedwp/.github/issues/712)–[#716](https://github.com/lightspeedwp/.github/issues/716), [#721](https://github.com/lightspeedwp/.github/issues/721) |
| **QA/Testing** (1h) | Test fixtures, validation | [#720](https://github.com/lightspeedwp/.github/issues/720) |

---

## ✅ Success Criteria (End of Phase)

- [ ] All 13 issues resolved and merged to `develop`
- [ ] 35 issue types live in GitHub org settings
- [ ] Both PR and issue template configs created and documented
- [ ] AGENT.md is canonical source for all template rules
- [ ] CLAUDE.md has quick reference for template selection
- [ ] PR validation workflow active and blocking merges
- [ ] Branch protection enforces template validation
- [ ] Instruction files available for reuse across repos
- [ ] Test fixtures validate workflow/agent behavior
- [ ] BRANCHING_STRATEGY.md links to template guidance

---

## 📊 Definition of "Done" for Each Issue

Each issue has acceptance criteria in the backlog. Before closing:

1. ✅ **Code/docs merged** to `develop`
2. ✅ **All acceptance criteria met** (see issue description)
3. ✅ **Tests pass** (where applicable)
4. ✅ **Documentation updated** (AGENT.md, CLAUDE.md, etc.)
5. ✅ **Next issue unblocked** (if dependencies exist)

---

## 🔗 Key Documents

- **Backlog:** [ISSUES.md](./ISSUES.md) — full project plan with 13 issues
- **Governance:** [AGENTS.md](../../../../AGENTS.md) — canonical rules (to be updated)
- **Quick Ref:** [CLAUDE.md](../../../../CLAUDE.md) — Claude-specific guidance (to be updated)
- **Strategy:** [docs/BRANCHING_STRATEGY.md](../../../../docs/BRANCHING_STRATEGY.md) — branch naming (to be updated)

---

## 🚧 Blockers & Risks

| Risk | Mitigation |
|------|-----------|
| [#709](https://github.com/lightspeedwp/.github/issues/709) requires manual GitHub UI access | Assign to Org Admin; provide exact steps |
| Phase 2 docs depend on Phase 1 config | Clear dependency graph; [#712](https://github.com/lightspeedwp/.github/issues/712)–[#716](https://github.com/lightspeedwp/.github/issues/716) wait for [#710](https://github.com/lightspeedwp/.github/issues/710) |
| Workflow/agent coordination ([#717](https://github.com/lightspeedwp/.github/issues/717)/[#718](https://github.com/lightspeedwp/.github/issues/718)) | Agent spec references workflow; both should align |
| Test fixtures need real PR examples | Use template files as fixtures; document in [#720](https://github.com/lightspeedwp/.github/issues/720) |

---

## 📞 Escalation Path

- **Blocked on GitHub access?** → Escalate to Org Admin
- **Config file questions?** → Reference BRANCHING_STRATEGY.md or AGENT.md
- **Automation/workflow help?** → Check `.github/workflows/` for examples
- **Documentation style?** → Follow `.github/instructions/instructions.instructions.md` pattern

---

## Next Review

**Checkpoint:** End of Week 1

- [ ] [#709](https://github.com/lightspeedwp/.github/issues/709) complete (org settings updated)
- [ ] [#710](https://github.com/lightspeedwp/.github/issues/710), [#711](https://github.com/lightspeedwp/.github/issues/711) in progress or complete
- [ ] Team has started Phase 2 documentation
- [ ] No blockers from dependency chain

**Final Review:** End of Week 3

- [ ] All 13 issues closed
- [ ] All acceptance criteria met
- [ ] Success metrics validated

---

*Built by 🧱 LightSpeedWP — Ready for handoff to team execution.*

---
title: Reusable Prompts Library — Phase 1 & 2 Planning
file_type: project
status: in-progress
---

# Phase 1 & 2 Planning — Reusable Prompts Library

---

## Phase 1: Reusable Prompts Structure & Migration

### Status: ✅ COMPLETE (2026-09-04)

**Duration:** 1 session  
**Team Size:** 1 (Claude Haiku 4.5)  
**Total Effort:** 4-5 hours  
**Deliverables:** 4 major (9 prompts, 71 migrated, 42 restored, documentation)

---

## Phase 1 Work Breakdown

### 1.1 Create 9 Comprehensive Reusable Prompts (Est. 2-3 hours)

**Objective:** Develop 9 production-ready prompts addressing common AI-assisted development tasks

**Work Items:**

| ID | Prompt Name | Description | Est. Time | Status |
|----|-------------|-------------|-----------|--------|
| 1.1.1 | prompt-builder.prompt.md | Build and iterate on custom prompts | 20 min | ✅ Done |
| 1.1.2 | code-generation.prompt.md | Generate code stubs and implementations | 20 min | ✅ Done |
| 1.1.3 | documentation-writer.prompt.md | Auto-generate documentation | 20 min | ✅ Done |
| 1.1.4 | refactoring.prompt.md | Analyze and refactor code | 20 min | ✅ Done |
| 1.1.5 | testing.prompt.md | Generate unit/integration tests | 20 min | ✅ Done |
| 1.1.6 | conventional-commit.prompt.md | Format commits following standards | 15 min | ✅ Done |
| 1.1.7 | create-specification.prompt.md | Create technical specifications | 25 min | ✅ Done |
| 1.1.8 | debugging.prompt.md | Troubleshoot and analyze errors | 20 min | ✅ Done |
| 1.1.9 | create-implementation-plan.prompt.md | Break features into tasks | 25 min | ✅ Done |

**Deliverables:**

- 9 `.prompt.md` files in `prompts/` folder
- Comprehensive `PROMPTS-V1-INDEX.md` with examples
- Metadata and documentation for each prompt

### 1.2 Migrate Existing Prompts (Est. 1-2 hours)

**Objective:** Move 71 existing prompts from `.github/prompts/` to root `prompts/` with history preservation

**Work Items:**

| ID | Task | Description | Est. Time | Status |
|----|------|-------------|-----------|--------|
| 1.2.1 | Prepare migration | Review existing structure, plan approach | 15 min | ✅ Done |
| 1.2.2 | Execute migration | Use git mv to preserve history | 30 min | ✅ Done |
| 1.2.3 | Verify migration | Check all 71 files moved correctly | 15 min | ✅ Done |
| 1.2.4 | Update .github/prompts/ | Add migration notice and redirect | 15 min | ✅ Done |
| 1.2.5 | Create migration report | Document migration with manifest | 30 min | ✅ Done |

**Deliverables:**

- 71 files migrated to `prompts/`
- Migration report at `.github/reports/prompt-migration-2026-09-04.md`
- Redirect notice at `.github/prompts/README.md`
- Git history preserved (no commits lost)

### 1.3 Restore Deleted Files (Est. 30 min)

**Objective:** Recover 42 accidentally-deleted files and rename with `.prompt.md` extension

**Work Items:**

| ID | Task | Description | Est. Time | Status |
|----|------|-------------|-----------|--------|
| 1.3.1 | Identify deleted files | Audit previous commit for deletions | 10 min | ✅ Done |
| 1.3.2 | Extract from history | Git show previous commit versions | 10 min | ✅ Done |
| 1.3.3 | Rename with .md | Apply standard naming convention | 5 min | ✅ Done |
| 1.3.4 | Stage and commit | Create recovery commit with documentation | 5 min | ✅ Done |

**Deliverables:**

- 42 files restored with `.prompt.md` naming
- Recovery commit: `8b93ee72` with full documentation
- All files pass markdown linting

### 1.4 Create Documentation (Est. 1 hour)

**Objective:** Document library structure, usage, and migration details

**Work Items:**

| ID | File | Description | Est. Time | Status |
|----|------|-------------|-----------|--------|
| 1.4.1 | prompts/README.md | Quick-start guide | 20 min | ✅ Done |
| 1.4.2 | prompts/PROMPTS-V1-INDEX.md | Comprehensive index | 20 min | ✅ Done |
| 1.4.3 | Migration report | Complete file manifest | 15 min | ✅ Done |
| 1.4.4 | Active project docs | KICKOFF.md, PLANNING.md, etc. | 5 min | ✅ Done |

**Deliverables:**

- Quick-start guide with examples
- Comprehensive index with workflows
- Migration report with validation
- Active project folder with tracking docs

### 1.5 PR #2778 Compliance (Est. 30 min)

**Objective:** Ensure PR meets all governance requirements

**Work Items:**

| ID | Task | Description | Est. Time | Status |
|----|------|-------------|-----------|--------|
| 1.5.1 | PR description | Complete feature template sections | 15 min | ✅ Done |
| 1.5.2 | Labels & milestone | Apply governance labels and milestone v1.2 | 10 min | ✅ Done |
| 1.5.3 | Issue linking | Link to Epic #2777 with "Part of" | 5 min | ✅ Done |

**Deliverables:**

- PR template sections: Linked issues, Changelog, DoD checklist
- Labels: `type:feature`, `status:needs-review`
- Milestone: `v1.2`
- Issue link: `Part of #2777`

---

## Phase 1 Summary

✅ **All objectives achieved**

| Objective | Deliverable | Status |
|-----------|-------------|--------|
| 9 new prompts | `prompts/{name}.prompt.md` (9 files) | ✅ Complete |
| 71 migrated prompts | `prompts/{name}.prompt.md` (71 files) | ✅ Complete |
| 42 restored files | `prompts/{name}.prompt.md` (42 files) | ✅ Complete |
| Documentation | README.md, index, report | ✅ Complete |
| PR governance | Labels, milestone, links | ✅ Complete |
| **Total library** | **113 prompts** | **✅ Complete** |

---

## Phase 2: OpenSpec & Issue Creation

### Status: 🚀 KICKOFF (2026-09-04)

**Duration:** 1 week  
**Team Size:** 1 (Claude or team)  
**Total Effort:** 4-6 hours  
**Timeline:** Sep 4-11

---

## Phase 2 Work Breakdown

### 2.1 Create OpenSpec Configuration (Est. 1 hour)

**Objective:** Define Phase 2 enhancements in OpenSpec format for issue generation

**Work Items:**

| ID | Task | Description | Time | Status |
|----|------|-------------|------|--------|
| 2.1.1 | Design spec structure | Map Phase 2 issues to spec format | 20 min | ⬜ Not Started |
| 2.1.2 | Create .openspec.yaml | Define all 5 Phase 2 issues | 30 min | ⬜ Not Started |
| 2.1.3 | Validate specs | Check against repo standards | 10 min | ⬜ Not Started |

**Deliverables:**

- `.github/projects/active/reusable-prompts/.openspec.yaml`
- 5 issue specs for Phase 2 work
- Validation against OPENSPEC standards

### 2.2 Define Phase 2 Issues (Est. 1.5 hours)

**Objective:** Design and plan 5 GitHub issues for Phase 2 enhancements

**Issues to Create:**

| ID | Title | Description | Est. Effort | Priority |
|----|-------|-------------|-------------|----------|
| 2.2.1 | Prompt enhancements & refinements | Add code review, linting, security analysis prompts | 1-2 hours | HIGH |
| 2.2.2 | Prompt automation workflows | Create trigger-based prompt execution patterns | 2-3 hours | HIGH |
| 2.2.3 | Prompt versioning & compatibility | Version control and backwards compatibility framework | 1-2 hours | MEDIUM |
| 2.2.4 | Usage analytics & tracking | Track prompt usage, effectiveness, feedback | 2-3 hours | MEDIUM |
| 2.2.5 | Prompt discovery & search | Search/discovery interface for 113 prompts | 2-3 hours | MEDIUM |

**Total Phase 2 Effort:** 8-13 hours (estimated by issue complexity)

**Deliverables:**

- 5 OpenSpec documents (SPEC-issue-2-1.md through SPEC-issue-2-5.md)
- GitHub issues created from specs
- Issues linked to active project folder
- Milestone v1.3 assigned

### 2.3 Create GitHub Issues (Est. 1.5 hours)

**Objective:** Create 5 GitHub issues from OpenSpec documents

**Process:**

1. Generate issue specifications from `.openspec.yaml`
2. Create GitHub issues using OpenSpec specs
3. Assign labels: `type:enhancement`, `area:prompts`
4. Assign milestone: `v1.3`
5. Link to active project folder

**Issue Checklist:**

| # | Issue | Created | Labeled | Milestone | Linked | Status |
|---|-------|---------|---------|-----------|--------|--------|
| 2-1 | Prompt enhancements | ⬜ | ⬜ | ⬜ | ⬜ | Not Started |
| 2-2 | Automation workflows | ⬜ | ⬜ | ⬜ | ⬜ | Not Started |
| 2-3 | Versioning & compatibility | ⬜ | ⬜ | ⬜ | ⬜ | Not Started |
| 2-4 | Analytics & tracking | ⬜ | ⬜ | ⬜ | ⬜ | Not Started |
| 2-5 | Discovery & search | ⬜ | ⬜ | ⬜ | ⬜ | Not Started |

**Deliverables:**

- 5 GitHub issues created
- All issues labeled and assigned
- Cross-linking complete (issues → project folder)

### 2.4 Link Issues to Active Project (Est. 1 hour)

**Objective:** Create bi-directional links between GitHub issues and active project documentation

**Tasks:**

1. Update README.md with issue links
2. Add issue numbers to all spec files
3. Create links in issue descriptions back to active project
4. Document issue status in STATUS.md

**Deliverables:**

- Updated README.md with issue table
- Issue descriptions with active project links
- STATUS.md tracking all issues
- Milestone v1.3 assigned to all

---

## Phase 2 Dependencies & Critical Path

### Critical Path (Must Complete in Order)

```
2.1: Create OpenSpec
  ↓
2.2: Define Phase 2 Issues
  ↓
2.3: Create GitHub Issues
  ↓
2.4: Link Issues to Project
```

**Total Critical Path Time:** 4-5 hours

### Parallel Work (Can Run Simultaneously)

Once specs are created (2.1), issue creation (2.3) and linking (2.4) can proceed in parallel.

### Dependencies

- Phase 2 requires PR #2778 to be merged first
- Phase 2 depends on Phase 1 completion (current)
- No other project dependencies

---

## Phase 2 Success Criteria

- [ ] `.openspec.yaml` created with all 5 issue specs
- [ ] All specs validated against repository standards
- [ ] 5 GitHub issues created from specs
- [ ] All issues assigned to milestone v1.3
- [ ] All issues labeled with `type:enhancement`, `area:prompts`
- [ ] README.md updated with links to all 5 issues
- [ ] Issue descriptions include links back to active project
- [ ] STATUS.md tracks progress on all Phase 2 issues
- [ ] All bi-directional links verified and working

---

## Phase 2 Timeline

| Week | Target | Work | Status |
|------|--------|------|--------|
| Sep 4-5 | 2.1-2.2 | Create specs, define issues | ⬜ Not Started |
| Sep 4-6 | 2.3-2.4 | Create issues, link projects | ⬜ Not Started |
| Sep 9+ | Phase 2 Implementation | Begin issue implementation | ⬜ Planned |

**Phase 2 Completion Target:** Sep 9-11 (by end of first week)

---

## Phase 3+: Future Enhancements

### Phase 3 (Planned for Oct+)

1. **Implement Phase 2 Issue Solutions**
   - Develop prompt enhancements
   - Build automation workflows
   - Create versioning framework
   - Implement analytics tracking
   - Build discovery interface

2. **Prompt Ecosystem Features**
   - Prompt marketplace/registry
   - Community contributions
   - Prompt ratings and reviews
   - Integration with Copilot marketplace

3. **Advanced Automation**
   - Trigger-based prompt execution
   - Prompt chaining/workflows
   - Conditional execution
   - Async prompt queuing

**Phase 3 Effort:** 20-30 hours (estimated)

### Phase 4+ (Future Planning)

- AI-assisted prompt optimization
- Multi-language prompt variants
- Role-based prompt recommendations
- Enterprise governance & compliance
- Cross-organization prompt sharing

See **[ENHANCEMENTS.md](./ENHANCEMENTS.md)** for complete roadmap

---

## Risk Management

### Risk 1: PR #2778 Size & Complexity

**Risk:** 128 files may be difficult to review and merge  
**Mitigation:** Clear documentation, organized file structure, migration report  
**Status:** ✅ Mitigated (well-organized)

### Risk 2: CodeRabbit Review Limitation

**Risk:** Automated review skipped (100-file limit exceeded)  
**Mitigation:** Manual review available, pre-commit linting passed  
**Status:** ✅ Acknowledged (not a blocker)

### Risk 3: Pre-existing CI Issues

**Risk:** CI checks fail due to pre-existing repository issues  
**Mitigation:** Documented as separate from PR, not PR-specific  
**Status:** ✅ Documented (not blocking Phase 1)

### Risk 4: OpenSpec Configuration

**Risk:** OpenSpec format may change or have compatibility issues  
**Mitigation:** Reference existing openspec.json files in repo  
**Status:** ⚠️ To assess during Phase 2.1

### Risk 5: Issue Scope Creep

**Risk:** Phase 2 issues may grow beyond estimated effort  
**Mitigation:** Use OpenSpec specs to define strict scope  
**Status:** ⚠️ Monitor during Phase 2.2

---

## Resource Planning

### Phase 1 (Complete)

**Team:** 1 person (Claude Haiku 4.5)  
**Hours:** 4-5 hours  
**Output:** 113 prompts, documentation, PR #2778

### Phase 2 (Planned)

**Team:** 1 person (Claude or team)  
**Hours:** 4-6 hours  
**Delivery:** 5 issues, OpenSpec docs, active project updates

### Phase 3 (Estimated)

**Team:** 2-3 people  
**Hours:** 20-30 hours total  
**Deliverables:** Issue implementations, ecosystem features

---

## Documentation Index

| Document | Purpose | Owner | Status |
|----------|---------|-------|--------|
| README.md | Project overview | Active | ✅ Complete |
| KICKOFF.md | Phase 1 completion | Active | ✅ Complete |
| PLANNING.md | Phase 1 & 2 breakdown | Active | ✅ Complete (this file) |
| STATUS.md | Real-time tracking | Active | ⬜ In Progress |
| ENHANCEMENTS.md | Roadmap & gaps | Active | ⬜ In Progress |
| SPEC-issue-2-*.md | OpenSpec documents | Phase 2 | ⬜ To Create |

---

## Success Definition

### Phase 1: ✅ ACHIEVED

- 9 new comprehensive prompts created
- 71 existing prompts migrated
- 42 deleted files restored
- Complete documentation suite
- PR #2778 ready for merge

### Phase 2: 🎯 TARGET

- 5 GitHub issues created from OpenSpec
- All issues linked to active project
- All issues assigned and labeled
- README & documentation updated
- Status tracking in place

### Overall Project: 🚀 ON TRACK

Phase 1 complete, Phase 2 ready to start, Phase 3+ planned

---

**Last Updated:** 2026-09-04  
**Next Review:** After Phase 2 kickoff (Sep 5-6)  
**Prepared by:** Claude Haiku 4.5

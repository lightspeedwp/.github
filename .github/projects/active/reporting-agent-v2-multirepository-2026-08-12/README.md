---
file_type: project
name: Reporting Agent v2 — Multi-Repository Support
description: Enhanced reporting agent supporting WordPress plugins, themes, platform, and control-plane repositories with automatic context detection and repo-aware templates.
status: active
start_date: 2026-08-12
target_completion: 2026-09-09
owner: lightspeedwp/maintainers
epic: "#1898"
related_issues:
  - "#1900 (Phase 1: Agent Prompt v2 & Planning Documentation)"
  - "#1901 (Phase 2: Control-Plane Validation & PR Merge)"
  - "#1902 (Phase 3: Block Plugin Testing & Feedback)"
  - "#1903 (Phase 4: Block Theme Testing & Feedback)"
  - "#1904 (Phase 5: Org-Wide Rollout & Onboarding)"
---

# Reporting Agent v2 — Multi-Repository Support

## Project Status

🟢 **PLANNING & IMPLEMENTATION** — Agent prompt development and validation underway.

## Overview

Enhancement of the existing Reporting Agent to support heterogeneous repository types (WordPress block plugins, block themes, platform repositories, and control-plane) with unified agent architecture, automatic context detection, and repository-aware reporting templates.

## Key Goals

1. **Single Unified Agent** — One agent works across all repository types (not separate versions)
2. **Automatic Context Detection** — Agent detects repo type (plugin/theme/platform/control-plane) on first use
3. **Repository-Aware Templates** — Reporting templates adapt based on detected repo context
4. **Consistent Standards** — Org-wide reporting standards with repo-specific flexibility
5. **Simplified Onboarding** — Users interact with same agent across all repos

## Current Status

| Phase | Status | Details |
|-------|--------|---------|
| **Planning & Specification** | ✅ Complete | Agent prompt v2 designed, deployment strategy documented |
| **Control-Plane Testing** | 🟡 In Progress | Initial testing in control-plane repo |
| **Block Plugin Validation** | ⏳ Queued | Testing with block plugin repos |
| **Block Theme Validation** | ⏳ Queued | Testing with block theme repos |
| **Org-Wide Rollout** | ⏳ Queued | Publication and team communication |

## Related Documents

- **[PLANNING.md](./PLANNING.md)** — Detailed implementation roadmap and phases
- **[SPECIFICATION.md](./SPECIFICATION.md)** — Technical specification and architecture
- **[DEPLOYMENT_STRATEGY.md](./DEPLOYMENT_STRATEGY.md)** — Rollout plan across org
- **[OPENSPEC_ANALYSIS.md](./OPENSPEC_ANALYSIS.md)** — OpenSpec validation results
- **[ISSUES.md](./ISSUES.md)** — Related GitHub issues

## Key Deliverables

### Phase 1: Core Release (Target: Week of 2026-08-19)

- ✅ Agent prompt v2 complete (multirepository support)
- ✅ Deployment strategy documented
- ⏳ Testing in control-plane repo
- ⏳ PR creation and review

### Phase 2: Block Plugin Rollout (Target: Week of 2026-08-26)

- ⏳ Deploy to 2-3 block plugin repos
- ⏳ Validate repo detection and templates
- ⏳ Gather plugin maintainer feedback

### Phase 3: Block Theme Rollout (Target: Week of 2026-09-02)

- ⏳ Deploy to 2-3 block theme repos
- ⏳ Validate template coverage and pattern templates
- ⏳ Gather theme maintainer feedback

### Phase 4: Org-Wide Distribution (Target: Week of 2026-09-09)

- ⏳ Publish stable v2.0 agent
- ⏳ Create onboarding documentation
- ⏳ Announce to org teams

## Architecture Highlights

### Why One Agent?

Reporting is about *documenting* repositories, not repository implementation. The agent:

- ✅ Maintains consistent org-wide standards
- ✅ Auto-detects repo type and adapts templates
- ✅ Scales easily as new repo types are added
- ✅ Single documentation source to maintain

### Context Detection

Agent inspects repository on first use:

```
1. Read package.json / composer.json for repo type hints
2. Search .github/reports/ for existing categories
3. Sample 3-5 existing reports to detect conventions
4. Store context for session
```

### Repository-Aware Templates

Different templates for different repo types:

| Repo Type | Templates | Examples |
|-----------|-----------|----------|
| **Block Plugin** | Block Registration Audit, Block Test Coverage | Testimonial block, Product carousel |
| **Block Theme** | Template Coverage, Pattern Compatibility | Heading theme, Layout theme |
| **Control-Plane** | Label Audit, Workflow Validation, Instruction Audit | Label sync report, workflow status |
| **Platform** | All category templates | Component-specific as needed |

## Next Steps

### Immediate (This Week)

1. ✅ Create active project folder
2. ✅ Document planning and specification
3. ⏳ Create GitHub issue(s) for tracking
4. ⏳ Link project to issues
5. ⏳ Create PR with agent v2 and project docs

### Short-Term (Next 2 Weeks)

1. ⏳ Validate agent prompt in control-plane
2. ⏳ Test context detection
3. ⏳ Test all templates
4. ⏳ Refine based on validation findings

### Medium-Term (Weeks 3-4)

1. ⏳ Deploy to block plugin repos
2. ⏳ Deploy to block theme repos
3. ⏳ Gather feedback
4. ⏳ Plan v2.1 refinements

## Related Issues

This project is tracked by the following GitHub issues:

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#1898](../../issues/1898) | epic | Master epic for Reporting Agent v2 | 🟡 Open |
| [#1900](../../issues/1900) | task | Phase 1: Agent Prompt v2 & Planning Documentation | ✅ Complete |
| [#1901](../../issues/1901) | task | Phase 2: Control-Plane Validation & PR Merge | ⏳ In Progress |
| [#1902](../../issues/1902) | task | Phase 3: Block Plugin Testing & Feedback | ⏳ Queued |
| [#1903](../../issues/1903) | task | Phase 4: Block Theme Testing & Feedback | ⏳ Queued |
| [#1904](../../issues/1904) | task | Phase 5: Org-Wide Rollout & Onboarding | ⏳ Queued |

See [Linking Standard](./../reports-projects-restructuring-2026-08-11/LINKING_STANDARD.md) for linking patterns.

## Contributors & Roles

| Role | Name | Contact |
|------|------|---------|
| **Project Lead** | TBD | — |
| **Technical Owner** | TBD | — |
| **Testing Lead** | TBD | — |

---

**Created:** 2026-08-12  
**Last Updated:** 2026-08-12  
**Status:** 🟢 Active  
**Phase:** Planning & Implementation

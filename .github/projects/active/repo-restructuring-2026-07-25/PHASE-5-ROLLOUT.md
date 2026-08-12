# Phase 5: Rollout & Team Communications

## Repository Restructuring — Team Announcements & Adoption Monitoring

**Duration:** 3+ weeks  
**Owner:** Ash Shaw (communications) + Team (feedback)  
**Status:** Ready to Execute  
**Prerequisites:** Phase 4 complete, website updates deployed

---

## Overview

Phase 5 spans team communications and monitoring from merge through stabilization. This is ongoing work across Weeks 1–8+ of the restructuring timeline.

---

## Copy This Prompt for Claude

````text
PHASE 5: Create rollout communications and adoption tracking structure.

STATUS: Phase 4 complete. All infrastructure, scripts, and documentation ready.

TASK: Create announcement templates and support tracking structure.

=====================================
WEEK 1: MERGE & INITIAL ANNOUNCEMENT
=====================================

Phase 5.1: Create Announcement Templates

Create: .github/projects/active/repo-restructuring-2026-07-25/ANNOUNCEMENT-TEMPLATES.md

Content: Three announcement templates

TEMPLATE 1: Slack/Internal Announcement

---
🚀 Repository Restructuring Complete (2026-07-25)

We've successfully restructured the `.github` repository for better organization and scalability!

**What Changed:**
- Operational folders moved to `.github/` (scripts/, reports/, projects/, etc.)
- Schema definitions consolidated (hidden `.schemas/` → visible `schemas/`)
- New VSCode workspace setup for seamless development
- Plugin adoption timeline (Claude Code + Copilot rolling out Aug-Oct)

**What You Need to Do:**
1. Pull latest changes
2. Run: `./.github/scripts/setup-vscode-workspace.sh`
3. See docs/MIGRATION.md for path updates

**For Help:**
- See onboarding at github.lightspeedwp.agency (routed by your role)
- Create GitHub issue with label `[restructuring-help]`
- Contact Ash Shaw for blockers

**Timeline:**
- Aug 2026: Claude Code + Copilot (Tier 1)
- Sept 2026: Wider adoption (Tier 2)
- Oct 2026+: Full team + vendor evaluation (Tier 3)

Questions? Ask in #engineering or via GitHub issues.
---

TEMPLATE 2: GitHub Release Notes

---
# Version X.Y.Z — Repository Restructuring Release (2026-07-25)

## 🎯 Overview

This release completes the repository restructuring initiative, reorganizing assets for multi-project portability and improved team governance.

## ✨ What's New

### Folder Organization
- **Portable assets** in root (agents/, skills/, instructions/, hooks/, etc.)
- **Repo-specific assets** in `.github/` (workflows, labels, templates, config)
- **Operational folders** now in `.github/` (scripts/, reports/, projects/, tmp/, memory/, website/)

### Schema Consolidation
- Schemas now in visible `schemas/` folder (unified from `.schemas/` + `schema/`)
- Updated all validation scripts to reference new location
- All schemas accessible and documented

### Developer Experience
- **Automated VSCode Setup:** `./.github/scripts/setup-vscode-workspace.sh`
- **Multi-root Workspace:** Open `.github/lightspeed-dev.code-workspace` to work on multiple projects simultaneously
- **Plugin Support:** Setup guides for Claude Code, GitHub Copilot, and emerging tools

### Documentation
- Comprehensive migration guide (docs/MIGRATION.md)
- Role-based onboarding at github.lightspeedwp.agency
- Plugin setup guides and comparison
- Updated VSCode setup documentation

## 🔄 Migration Guide

### Path Updates

All paths have been updated automatically. If you have personal scripts, update these references:

```bash
# OLD → NEW
node scripts/validate... → node .github/scripts/validate...
.schemas/ → schemas/
schema/ → schemas/
```

See **docs/MIGRATION.md** for complete details.

### Setup After Pulling

```bash
# Pull latest changes
git pull origin develop

# Run automated setup (recommended)
./.github/scripts/setup-vscode-workspace.sh

# Or manual validation
npm ci
npm run validate:all
npm test
```

## 🎯 Plugin Adoption Timeline

- **Aug 2026 (Tier 1):** Core maintainers + lead contributors → Claude Code + Copilot
- **Sept 2026 (Tier 2):** All contributors → Tier 1 plugins available, Codex optional
- **Oct 2026+ (Tier 3):** All teams → Tier 1–2 available, Gemini evaluation

Setup guides available in docs/ and at github.lightspeedwp.agency

## 🆘 Support

- **Documentation:** github.lightspeedwp.agency/documentation
- **Troubleshooting:** docs/faq.md, docs/vscode-workspace-setup.md
- **GitHub Issues:** Label with `[restructuring-help]` or `[plugin-help]`
- **Direct:** Ash Shaw for blockers

## 🔗 Key Resources

- [Migration Guide](docs/MIGRATION.md)
- [VSCode Setup](docs/vscode-workspace-setup.md)
- [Plugin Guides](docs/plugin-setup-*.md)
- [Branching Strategy](docs/BRANCHING_STRATEGY.md)
- [Repository Structure](CLAUDE.md#repository-boundaries)

## ✅ Validation

All changes verified:
- ✅ npm run validate:* passing
- ✅ npm test passing
- ✅ All path references updated
- ✅ Documentation complete

---

TEMPLATE 3: Email Announcement (to Leadership/Stakeholders)

---
Subject: Repository Restructuring Complete — July 25, 2026

Ash Shaw has successfully completed the `.github` repository restructuring initiative.

Key Outcomes:
✅ Improved organization for multi-project portability
✅ Automated developer setup (one command setup)
✅ Plugin adoption roadmap (Aug-Oct 2026)
✅ Comprehensive documentation and migration guide
✅ Team support infrastructure in place

Deliverables:
- 5 phases of work completed
- 40+ documentation files created
- Setup automation scripts ready
- Website integration requirements documented

Next Steps:
- Team pulls latest changes
- Automated setup runs (expected 5–10 min per developer)
- Tier 1 (core team) begins plugin adoption in August

Estimated Team Impact: 2–3 hours per developer for initial setup, then ongoing plugin adoption benefits.

---

=====================================
WEEK 2–3: GRACE PERIOD & SUPPORT
=====================================

Phase 5.2: Create Support Tracking

Create: .github/projects/active/repo-restructuring-2026-07-25/SUPPORT-TRACKER.md

Content: Weekly check-ins and issue tracking

---
# Support Tracking

## Week 1 (Merge Week)

### Activities
- [ ] Team announcement posted (Slack, email, GitHub)
- [ ] Website updated (onboarding routed by tier)
- [ ] Release notes published
- [ ] Plugin setup guides published

### Tracking
- Issues opened with `[restructuring-help]`: ___
- Issues opened with `[plugin-help]`: ___
- Common issues identified: ___

### Actions Taken
(Record issues and resolutions)

## Week 2 (Grace Period Week 1)

### Metrics
- % developers who've pulled latest: ___
- % developers who've run setup: ___
- % developers with VSCode workspace open: ___

### Support Issues
(List issues opened, categorize, record resolution)

### Feedback Collected
(Positive feedback, blockers, requests)

### Actions Taken
(Adjustments, documentation updates, FAQ additions)

## Week 3 (Grace Period Week 2)

### Metrics
(Same as Week 2)

### Support Issues
(Record new issues)

### FAQ Updates
(Add new entries based on questions asked)

### Actions Taken
(Iterate on documentation)

## Week 4+ (Stabilization)

Ongoing monitoring as team adopts plugins and settles into new structure.

---

=====================================
WEEK 4+: CUTOVER PHASE
=====================================

Phase 5.3: Remove Deprecations

After grace period expires:

1. Remove old path references (if any remain)
2. Update documentation to remove migration guide
3. Enforce new paths in validation (build failures if old paths used)
4. Send final announcement: "Old paths no longer supported, fully migrated"

---

=====================================
PHASE 5: FINAL SUMMARY
=====================================

Create: .github/projects/active/repo-restructuring-2026-07-25/PHASE-5-SUMMARY.md

Content: Completion summary

---
# Phase 5: Rollout Summary

## Announcement & Communications

- ✅ Slack announcement: [date]
- ✅ GitHub release notes: [date]
- ✅ Email to stakeholders: [date]
- ✅ Website updated: [date]

## Support & Adoption

### Tier 1 Adoption (Aug 2026)
- Team: [core maintainers]
- Plugins: Claude Code + Copilot
- Status: [ACTIVE/COMPLETE]
- Feedback: [summary]

### Tier 2 Adoption (Sept 2026)
- Team: [contributors]
- Plugins: Tier 1 + Codex optional
- Status: [PENDING/ACTIVE]
- Feedback: [summary]

### Tier 3 Adoption (Oct 2026+)
- Team: [all consumers]
- Plugins: All available, Gemini evaluation
- Status: [PENDING]

## Support Issues & Resolution

| Issue | Reported | Resolved | Notes |
|-------|----------|----------|-------|
| [Issue 1] | [date] | [date] | [resolution] |
| [Issue 2] | [date] | [date] | [resolution] |

## Documentation Updates

- FAQ expanded with [X] new entries
- Migration guide used [X] times
- Plugin setup guides accessed [X] times

## Cutover Phase

- ✅ Grace period completed: [date]
- ✅ Old paths removed: [date]
- ✅ Build validation enforces new paths: [date]
- ✅ Full team migrated: [date]

## Overall Success Metrics

- ✅ >80% team adoption
- ✅ <5 blocker issues (resolved)
- ✅ Documentation adequate for self-service support
- ✅ Plugin adoption timeline on track

---

=====================================
ONGOING MONITORING
=====================================

Throughout Phase 5, continuously:

1. Monitor GitHub issues with `[restructuring-help]` label
2. Track adoption metrics (if dashboard available)
3. Collect team feedback
4. Update FAQ and documentation based on questions
5. Prepare Phase 5.3 (cutover) based on adoption progress

End of Phase 5 when:
- ✅ Team fully migrated
- ✅ Plugins deployed (Tier 1 complete)
- ✅ Support issues resolved
- ✅ Documentation mature
- ✅ Old paths removed (grace period complete)

````

---

## What to Expect

**Duration:** 3+ weeks spanning merge through stabilization

**Scope:** Team communications, support tracking, adoption monitoring, FAQ management

**Outcomes:**

- ✅ Team aware of changes and supports
- ✅ Support infrastructure in place
- ✅ Adoption tracked and monitored
- ✅ Feedback collected and acted upon
- ✅ Smooth transition with grace period

---

**Document Version:** 1.0  
**Status:** Ready to Execute  
**Created:** 2026-07-26

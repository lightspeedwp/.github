---
name: phase-6-enforcement-timeline
description: Enforcement timeline and grace period plan for branch naming rollout
---

# Phase 6 — Enforcement Timeline & Grace Period

## Timeline Overview

```
Day 0 (Today)           → Phase 6 Begins: Announcement + grace period opens
│
├─ Day 1-3              → Team setup verification (80%+ target)
├─ Day 4-7              → Grace period continues (branch validation warnings only)
│
Day 7                   → ENFORCEMENT ENABLED (validation blocks invalid branches)
│
├─ Day 8-14             → Monitoring + support window
├─ Day 15-30            → Metrics collection + feedback gathering
│
Day 30                  → Phase 7 Begins: Metrics review & policy refinement
```

---

## Grace Period Details (Day 0 → Day 7)

### What Happens During Grace Period?

- ✅ **Pre-commit hook installed** (optional during grace period)
- ✅ **Branch validation runs** on all branch creations
- ⚠️ **Invalid branches are WARNED** but NOT BLOCKED
- 📊 **Violations are logged** for metrics (Phase 7)

### Team Actions During Grace Period

1. **Install hook** — `npm run setup:hooks` (optional but encouraged)
2. **Rename existing branches** to valid names
3. **Test with invalid names** (will warn, not block)
4. **Ask questions** if confused

### Sample Grace Period Message

```
⚠️  Branch name warning: 'my-feature' doesn't follow format {type}/{scope}-{short-title}
    When enforcement is enabled (2026-08-19), this will be blocked.
    Please rename: git branch -m my-feature feat/my-feature
```

---

## Enforcement Phase (Day 7 → Day 30)

### What Changes on Day 7?

- ❌ **Invalid branches are NOW BLOCKED** at creation
- ✅ **Valid branches work normally**
- 📊 **All violations logged** for metrics (Phase 7)
- 🆘 **Support team active** for help

### Team Actions During Enforcement

1. **Use valid branch names** — enforcement prevents invalid ones
2. **Ask for help** if stuck (see Support Channels below)
3. **Report issues** if validation is too strict

### Enforcement Rules

| Scenario | Behavior |
|---|---|
| Create branch with valid name | ✅ Success |
| Create branch with invalid name | ❌ Blocked with error message |
| Rename branch to invalid name | ❌ Blocked with error message |
| Push to feature branch | ✅ Unaffected by naming validation |

---

## Support Channels (Open During Grace Period & Enforcement)

### Response SLA

| Channel | Response Time | Best For |
|---|---|---|
| **GitHub Discussions** | 4 hours | General questions |
| **Slack #engineering-help** | 1 hour | Urgent issues |
| **Email to team lead** | 24 hours | Escalations |

---

## Key Dates (Changeable)

| Date | Event | Owner |
|---|---|---|
| 2026-08-12 | Phase 6 announcement | [TEAM_LEAD] |
| 2026-08-13 | Team setup verification begins | Team |
| 2026-08-15 | 80%+ verification check-in | [TEAM_LEAD] |
| 2026-08-19 | **Enforcement enabled** 🚀 | GitHub Actions |
| 2026-08-26 | Violations metrics report | [METRICS_OWNER] |
| 2026-09-12 | Phase 7 feedback & refinement | [TEAM_LEAD] |

---

## What If Issues Arise?

### If violations spike (>10% invalid branches):

1. **Extend grace period** by 3-5 days
2. **Send follow-up announcement** with common mistakes
3. **Schedule office hours** for team Q&A
4. **Review validation rules** for any false positives

### If team requests rule changes:

1. **Document request** in GitHub issue
2. **Review for Phase 7 refinement**
3. **Decide** whether to update pattern or guidance
4. **Communicate decision** to team

---

## Success Metrics (for Phase 7 review)

- ✅ <5% invalid branch creation attempts during enforcement
- ✅ <10 support requests total
- ✅ <3 rule violation appeals
- ✅ 90%+ team members positive feedback

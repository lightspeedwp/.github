---
file_type: "prompt"
title: "Debugging Prompt Template"
description: "Problem diagnosis, root cause analysis, and resolution procedures"
version: "1.0.0"
last_updated: "2026-05-31"
owners: ["ashley@lightspeedwp.agency"]
tags: ["debugging", "diagnosis", "prompts"]
status: "active"
stability: "stable"
domain: "tooling"
---

# Debugging Prompt Template

Use this prompt when diagnosing problems, analysing root causes, or resolving issues.

## Context

**Project:** [Project Name]
**Affected System:** [Module/feature that's broken]
**Environment:** [Production/Staging/Local development]
**Severity:** [Critical/High/Medium/Low]

### Problem Description

[Clear, specific description of what's broken]

### When It Started

- **Observed:** [Date/time problem was discovered]
- **Regression?:** [If yes, link to recent changes/PRs]
- **Reproducible?:** [Always / Sometimes / Under specific conditions]

### Current Impact

- **Users Affected:** [Estimated number or percentage]
- **Business Impact:** [Revenue loss / Data corruption / User experience degradation / etc.]
- **Related Systems:** [Other features/services affected]

---

## Symptoms & Observations

### What's Wrong

- **Error Message:** [Full error text if available]
- **Actual Behavior:** [What's currently happening]
- **Expected Behavior:** [What should happen]

### Environmental Details

- **Browser/OS:** [If client-side issue]
- **Node/Language Version:** [If server-side issue]
- **Database Version:** [If database-related]
- **Configuration:** [Relevant config values]

### Log Files & Data

- **Error Log:** [Relevant log entries or stack trace]
- **Network Traffic:** [If API-related, request/response details]
- **Database Queries:** [Slow queries or failed transactions]
- **Performance Metrics:** [If performance-related]

---

## Investigation Approach

### Hypothesis Testing

**Hypothesis 1:**
- [What might be causing this?]
- **How to Test:** [Specific steps to verify]
- **If True:** [Next step if hypothesis is confirmed]

**Hypothesis 2:**
- [Alternative explanation]
- **How to Test:** [Specific steps to verify]
- **If True:** [Next step if hypothesis is confirmed]

### Areas to Check

- [ ] [Code change or recent deployment]
- [ ] [Configuration or environment variables]
- [ ] [Database state or migration issues]
- [ ] [External service/API dependencies]
- [ ] [Resource limits (memory, CPU, disk)]
- [ ] [Permissions or authentication]
- [ ] [Caching issues or stale data]

---

## Constraints & Considerations

- **Data Sensitivity:** [Handle with care / Sensitive customer data / etc.]
- **Downtime Risk:** [Fix must not cause service interruption]
- **Rollback Plan:** [How to quickly revert if fix causes problems]
- **Timeline:** [Need fix by [time]]

---

## Success Criteria

The issue is resolved when:

- [ ] Root cause is identified and documented
- [ ] Immediate fix is deployed (if critical)
- [ ] All affected systems are verified working
- [ ] Monitoring/alerts confirm resolution
- [ ] Post-mortem/incident report is created
- [ ] Preventive measures are implemented

---

## Debugging Checklist

**Setup:**
- [ ] Clone/pull latest code
- [ ] Install dependencies
- [ ] Check environment variables
- [ ] Verify database connectivity

**Investigation:**
- [ ] Review recent changes in commit history
- [ ] Check error logs and monitoring dashboards
- [ ] Reproduce issue locally or in staging
- [ ] Test each hypothesis systematically

**Validation:**
- [ ] Verify fix resolves the issue
- [ ] Check for side effects/regressions
- [ ] Confirm monitoring/alerts show resolution
- [ ] Document findings and resolution

---

## References

- **Related Code:** [Link to relevant files or modules]
- **Recent Changes:** [Link to commits/PRs from last X days]
- **Monitoring Dashboard:** [Link to error tracking or APM tool]
- **Incident History:** [Link to similar past issues]
- **Runbook:** [Link to troubleshooting guide if exists]

---

## Additional Notes

- [Known limitations of debugging tools/access]
- [Production vs. staging environment differences]
- [Previous occurrences of similar issues]
- [Stakeholders to notify if critical]

# Active Projects Status Update — Quick Reference

## One-Liner Summary
Update all 40+ active projects: set status/priority/type/effort, link related issues with HEAD URLs (develop branch), ensure two-way links from issues back to projects.

---

## Quick Links Format

### Project → Issue (in README.md Related Issues section)
```markdown
| [#1234](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/{project-slug}/README.md) | Issue | Status | Description |
```

### Issue → Project (in issue body, new section)
```markdown
## 📋 Project Reference
**Related Project:** [Project Name](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/{project-slug}/README.md)
```

---

## Required Fields in README.md Frontmatter

```yaml
---
file_type: project
title: "Project Name"
status: active|pending|review|blocked|at_risk
priority: critical|high|medium|low
type: feature|infrastructure|maintenance|documentation
effort: "24h"
last_updated: YYYY-MM-DD
---
```

---

## Status Values Explained

| Status | Meaning | Use When |
|--------|---------|----------|
| `active` | Making forward progress | Work is underway |
| `pending` | Waiting for decision/approval | Blocked on external input |
| `review` | In code/design review | PR open or design pending |
| `blocked` | Can't proceed | Hard blocker identified |
| `at_risk` | SLA breach warning | Stalled >7 days |

---

## Example: Complete Project Update

**Before:**
```markdown
---
file_type: project
title: "Testing Agent Phase 2.6"
---
# Testing Agent Phase 2.6

Project files...
```

**After:**
```markdown
---
file_type: project
title: "Testing Agent Phase 2.6"
status: active
priority: high
type: feature
effort: "40h"
last_updated: 2026-08-18
---

# Testing Agent Phase 2.6

Project files...

## Related Issues & PRs

| Issue/PR | Type | Status | Purpose |
|----------|------|--------|---------|
| [#2027](https://github.com/lightspeedwp/.github/issues/2027) | Issue | Closed | Phase 2.6 Provider Configs |
| [PR #2027](https://github.com/lightspeedwp/.github/pull/2027) | PR | Merged | OpenAI provider implementation |

See [Full Project Definition](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/testing-agent-phase-2-4-2-7/PLANNING.md)
```

---

## Validation Commands

```bash
# Check all projects have status field
for p in .github/projects/active/*/; do
  grep -q "^status:" "$p/README.md" && echo "✓ $(basename $p)" || echo "✗ $(basename $p)"
done

# Check all have Related Issues section
for p in .github/projects/active/*/; do
  grep -q "## Related Issues" "$p/README.md" && echo "✓ $(basename $p)" || echo "✗ $(basename $p)"
done

# Run full validation
npm test -- scripts/automation/__tests__/validate-project-linking.test.js
```

---

## Two-Way Linking Pattern

**In Project:**
```
PROJECT README
    ↓ (links to issues)
ISSUE #1234
    ↓ (links back via Project Reference section)
PROJECT README (completes the loop)
```

**Both directions use:**
```
https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/{slug}/{file}
```

---

## Commit Message Template

```
feat: Update active projects status and linking

- Updated {N} projects with status/priority/type/effort fields
- Added Related Issues sections with HEAD links
- Created two-way links: projects ↔ issues
- All links point to develop branch (live)

Projects updated: {list a few examples}
- Project A (status: active → high)
- Project B (effort: 32h)

Validation: passing - validate-project-linking workflow ✓
```

---

## Key Remember Points

1️⃣ **All links must use:** `https://github.com/lightspeedwp/.github/blob/develop/...`  
2️⃣ **Both directions:** Project → Issue AND Issue → Project  
3️⃣ **Frontmatter required:** status, priority, type, effort  
4️⃣ **Related Issues section:** Must be in every project README  
5️⃣ **Project Reference section:** Add to issues that relate to projects  

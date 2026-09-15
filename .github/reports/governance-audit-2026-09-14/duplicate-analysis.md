# Duplicate Content Analysis (DUP-001)

**Task**: T027–T031 Duplicate Resolution Analysis  
**Date**: 2026-09-14

## Duplicate Location: "Label Creation Governance (CRITICAL)"

### Location 1: AGENTS.md lines 209–252 (First Occurrence)
## Label Creation Governance (CRITICAL)

When your code creates issues via `gh issue create` or GitHub API:

1. **Always validate labels against canonical set** (`.github/labels.yml`)
2. **All labels MUST include family prefix**:
   - `type:*` for issue classification (bug, feature, documentation, task, design, etc.)
   - `status:*` for workflow state (needs-triage, ready, in-progress, blocked, done, etc.)
   - `priority:*` for urgency (critical, important, normal, minor)
   - `area:*` for domain/component (ci, docs, security, labels, tests, scripts, etc.)
   - `meta:*` for automation markers (needs-changelog, has-pr, duplicate, etc.)

### Example: Creating an issue with correct labels

```bash
# ✅ CORRECT — All labels use required prefixes
gh issue create \
  --title "Add support for new widget configuration" \
  --body "Users need to configure widgets via JSON..." \
  --label "type:feature" \
  --label "area:block-editor" \
  --label "priority:normal" \
  --label "status:needs-triage"

# ❌ INCORRECT — Bare labels without prefixes
gh issue create \
  --title "Add support for new widget configuration" \
  --body "Users need to configure widgets via JSON..." \
  --label "feature" \
  --label "block-editor" \
  --label "normal" \
  --label "needs-triage"
```

### Validation Checklist

Before creating any issue programmatically:

- [ ] Each label exists in `.github/labels.yml`
- [ ] Each label includes its family prefix (`type:`, `status:`, `area:`, etc.)
- [ ] No bare labels (labels without colons are invalid)

**Reference**: `.github/scripts/validation/validate-labels-before-creation.cjs`


---

### Location 2: AGENTS.md lines 285–338 (Second Occurrence)
## Label Creation Governance (CRITICAL)

### For Programmatic Issue and PR Creation

When your code creates issues or PRs via `gh issue create`, `gh pr create`, or GitHub API:

1. **Always validate labels against the canonical set** (`.github/labels.yml`)
2. **ALL labels MUST include family prefix** — never apply bare labels
3. **Prefix families and examples**:
   - `type:*` — bug, feature, documentation, task, design, security, performance, a11y
   - `status:*` — needs-triage, ready, in-progress, blocked, review, done
   - `priority:*` — critical, high, normal, low
   - `area:*` — ci, docs, security, labels, tests, scripts, automation, etc.
   - `meta:*` — needs-changelog, has-pr, duplicate, needs-audit

### Example: Creating an Issue with Correct Labels

```bash
# ✅ CORRECT — All labels use required prefixes
gh issue create \
  --title "Add support for new widget configuration" \
  --body "Users need to configure widgets via JSON..." \
  --label "type:feature" \
  --label "area:core" \
  --label "priority:normal" \
  --label "status:needs-triage"

# ❌ INCORRECT — Bare labels without prefixes (DO NOT USE)
gh issue create \
  --title "Add support for new widget configuration" \
  --body "Users need to configure widgets via JSON..." \
  --label "feature" \
  --label "core" \
  --label "normal" \
  --label "needs-triage"
```

### Pre-Creation Validation Checklist

Before creating any issue or PR programmatically:

- [ ] Each label exists in `.github/labels.yml`
- [ ] Each label includes its family prefix (`type:`, `status:`, `area:`, `priority:`, `meta:`)
- [ ] No bare labels without colons
- [ ] Canonical case (lowercase, hyphens for spaces)

### References

- **Canonical labels**: `.github/labels.yml` (158 prefixed labels)
- **Label taxonomy**: `docs/LABEL_STRATEGY.md`
- **Labeling guide**: `docs/LABELING.md`
- **Governance audit**: [Issue #1592](https://github.com/lightspeedwp/.github/issues/1592) — Label Prefix Enforcement

---

---

## Comparison Analysis

### Lines Count
- Occurrence 1: 44 lines
- Occurrence 2: 54 lines
- Overlap: ~80% content identical

### Content Differences
- Occurrence 1 covers issue creation, the required label-family prefixes, examples, and a validation checklist with a script reference.
- Occurrence 2 expands the scope to issue and PR creation, adds broader label-family guidance, requires canonical-case validation, and links to canonical labels, label documentation, and the audit issue.

### Consolidation Approach (T031)

**Decision**: Merge into single authoritative section with:
1. All unique governance principles from Occurrence 1
2. All example labels from Occurrence 2
3. Complete implementation guidance from both
4. Single validation checklist (merge both lists, deduplicate items)

**Placement**: Keep in AGENTS.md as primary source (label governance is AI agent domain)  
**Cross-reference**: Add reference from CLAUDE.md if label creation mentioned

**Projected result**: Consolidation is expected to reduce approximately 100 lines to approximately 80 while retaining the unique guidance. The reduction and content-retention claims remain unverified until T068–T075 are complete.

---

## Consolidated Version (Proposed)

[To be populated during consolidation task T068-T075]

---

## Sign-Off

- **Duplicate Confirmed**: YES
- **Consolidation Required**: CRITICAL (Constitution Principle III violation)
- **Target Completion**: T068–T075 (Phase 5)

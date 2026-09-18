---
version: 2.0.0
last_updated: 2026-06-09
---

# Skill 06 — Re-audit comparison

## Purpose

Compare the current Skill 03 evaluation results against the prior audit entry loaded by Skill 01. Produce a structured comparison object for Skill 05 to include in the report.

This skill runs only when `priorAudit` is present in audit context (set by Skill 01 during re-audit mode). Do not invoke this skill during a standard Full Audit.

## Inputs

- `priorAudit` — the prior audit log entry from audit context (set by Skill 01)
- `visualDiff` — the section-by-section diff table from audit context (set by Skill 01 visual diff protocol)
- Current Skill 03 results — Pass/Fail/Warn per criterion + scores (confirmed + worst-case)

## Comparison logic

**Score delta (dual):**

```
delta.confirmed = newScore.confirmed - previousScore.confirmed
delta.comprehensive = newScore.comprehensive - previousScore.comprehensive
```

A positive delta is an improvement. A negative delta is a regression.

**Per-criterion classification:**

Apply the following rules **in order** — a criterion is placed in the first matching bucket:

| Rule | Prior status | Current status | Classification |
|------|--------------|----------------|----------------|
| 1 | Any | Any | **Speculative risk** — if the contrast ratio is within 0.5:1 of any AA threshold, OR the element cannot be confirmed visible in the new screenshot |
| 2 | Fail or Warn | Pass | **Improved** |
| 3 | Pass | Fail or Warn | **Regressed** — only if the failing element is visibly present AND failure is calculable or directly observable |
| 4 | Fail or Warn | Fail or Warn | **Still failing** |
| 5 | Pass | Pass | Not reported (no change) |

**Speculative risk rule (3.2):**
A finding is classified as `speculativeRisks` (not `regressed`) when **either** condition is true:

- The calculated contrast ratio is within 0.5:1 of any WCAG AA threshold (i.e. normal text threshold 4.5:1 → flag if ratio is between 4.0 and 4.5; large text threshold 3.0:1 → flag if ratio is between 2.5 and 3.0; UI components 3.0:1 → same window)
- The token/surface combination could indicate failure but the element using that token cannot be confirmed as visible in the new artefact screenshot

**Confirmed regression requirement (3.3):**
`speculativeRisks` entries are **never** classified as `regressed`. A confirmed regression requires:

- The failing element is visibly present in the new artefact
- The contrast/structure failure is calculable from exact hex values or directly observable

**New elements (3.4):**
For each row in `visualDiff` flagged as `new-element`, produce a `newElements` entry. New elements do **not** appear in Pass/Fail/Warn evaluation or affect either score.

**Skill version mismatch:**
Compare `priorAudit.skillVersions` against the current skill versions. If any differ, set `skillVersionsMismatched: true`.

## Output

Produce a `comparison` object and store it in audit context:

```json
{
  "comparison": {
    "previousScore": { "confirmed": 90, "comprehensive": 58 },
    "newScore": { "confirmed": 78, "comprehensive": 52 },
    "delta": { "confirmed": -12, "comprehensive": -6 },
    "improved": [
      { "id": "C-01", "prev": "Fail", "now": "Pass", "finding": "Contrast corrected to 5.2:1 — passes normal text AA" }
    ],
    "regressed": [
      { "id": "C-05", "prev": "Pass", "now": "Fail", "finding": "accent-500 on white = 2.09:1 — confirmed visible element, calculated failure" }
    ],
    "speculativeRisks": [
      { "id": "C-03", "ratio": 4.41, "threshold": 4.5, "gap": 0.09, "finding": "brand-500 on white = 4.41:1 — within 0.5:1 of AA threshold; element not visually confirmed in screenshot" }
    ],
    "newElements": [
      { "element": "Newsletter signup form", "description": "Email input with submit button", "categoriesIntroduced": ["FM", "C"] }
    ],
    "stillFailing": [
      { "id": "M-01", "status": "Fail", "finding": "Animated content still has no pause control" }
    ],
    "skillVersionsMismatched": false
  }
}
```

**Score fields:**

- `previousScore.confirmed` — confirmed score from the prior audit entry (`score.confirmed` in audit-log.json), or the raw `score` value for legacy entries that predate dual scoring
- `previousScore.comprehensive` — comprehensive score from the prior audit entry (`scores.comprehensive` in audit-log.json); if absent in prior entry, calculate as `Math.round((priorPasses × 1 + priorWarns × 0.5) / priorTotal × 100)`
- `newScore.confirmed` — Skill 03 confirmed score
- `newScore.comprehensive` — Skill 03 worst-case score (Skill 03 calculates this as `worstCase` — use that value here as `comprehensive`)

**speculativeRisks** entries are never added to `regressed`. They do **not** affect `newScore.confirmed` or `newScore.comprehensive`.

**newElements** entries are never added to any Pass/Fail/Warn classification. They do **not** affect either score.

## Chat output before passing to Skill 05

State the comparison result briefly before proceeding:

```
## Re-audit Comparison — [Subject]

**Confirmed:** [previousScore.confirmed]/100 → [newScore.confirmed]/100 ([▲/▼] [±delta.confirmed])
**Comprehensive:** [previousScore.comprehensive]/100 → [newScore.comprehensive]/100 ([▲/▼] [±delta.comprehensive])

| | Count |
|--|--|
| Improved (Fail/Warn → Pass) | N |
| Confirmed regressions (Pass → Fail) | N |
| Speculative risks (near-threshold / unconfirmed) | N |
| New elements (not in prior scope) | N |
| Still failing | N |
```

If `skillVersionsMismatched` is true, add:
> "Note: skill versions differ from the prior audit. Criteria coverage may have changed — treat this comparison as approximate."

Then proceed immediately to Skill 05.

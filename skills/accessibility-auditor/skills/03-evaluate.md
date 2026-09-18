---
version: 1.3.0
last_updated: 2026-06-09
---

# Skill 03 — Evaluate every criterion

## Purpose

Evaluate each criterion from Skill 02 against the input. Assign a status and write a
specific finding note for every single criterion.

## Status definitions

| Status | Meaning |
|--------|---------|
| Pass | The artefact clearly meets this requirement based on what is visible/readable |
| Fail | The artefact clearly and directly violates this requirement — evidence is present in the input |
| Fail (inferred) | The artefact almost certainly violates this requirement based on strong indirect evidence (e.g. DS token implies animation, implementation pattern known to be broken), but direct confirmation requires live inspection |
| Likely Fail | The requirement is almost never implemented correctly in this type of artefact — assign when the check is a well-known implementation gap and there is no visible evidence of compliance |
| Warn | Cannot be determined from the input alone — requires live code or tool inspection with no strong prior |

**When to use Likely Fail vs Warn:**
Use `Likely Fail` (not `Warn`) for these near-certain failures in standard web implementations:

- Skip-to-main link — absent from the visible top of page with no alternative
- Focus indicators — no `:focus-visible` styles observed and no DS token applied visibly
- FAQ or accordion ARIA semantics — interactive disclosure present in screenshot with no ARIA evidence
- `lang` attribute on `<html>` — cannot confirm from screenshot; default to `Likely Fail` for full-page audits
- `<title>` element — cannot confirm from screenshot; default to `Likely Fail` for full-page audits

`Likely Fail` items count as failures in the Worst-Case Score and are treated as high-priority in recommendations. They are flagged clearly in the report so a developer knows to verify, not just assume they pass.

## Colour contrast evaluation

For C-series criteria (C-01 through C-10), use the committed calculator when hex values are available:

**Path A — Exact (preferred):** hex values are in audit context (from Skill 01 colour extraction, user-provided tokens, or DS reference)

```bash
node agents/accessibility-auditor/scripts/contrast-calculator.js "<fg-hex>" "<bg-hex>"
```

Read the JSON output. Use the exact `ratio` in the finding note. Assign **Pass** or **Fail** based on `results.normal_text_aa.passes` (4.5:1 for body text) or `results.large_text_aa.passes` (3:1 for large text/UI components).

Example finding: `"Exact: 4.35:1 — passes large text (3:1) but fails normal text AA (4.5:1)"`

**Path B — Estimation fallback:** no hex values available (screenshot-only, no computed styles)

- Estimate the ratio visually based on the visible colours
- Assign **Warn** (not Pass or Fail) — cannot confirm from visual alone
- Include in the finding: `"Estimated ~X:1 — verify exact values: node contrast-calculator.js <fg> <bg>"`

---

## Rules for findings

Every finding note must:

- Reference a specific element, section, colour, text string, or component in THIS artefact
- NOT be a generic restatement of the WCAG rule
- Be one sentence, specific enough to act on

Bad: "The page does not meet contrast requirements."
Good: "Green CTA button (#00FCFC equivalent) on dark surface estimated ~3.1:1 — below 4.5:1 for normal text."

## Re-audit Warn annotation (re-audit mode only)

When operating in re-audit mode, every Warn MUST be annotated with a risk level derived from the `visualDiff` stored in audit context. Unannotated Warns are not permitted in re-audit mode — every Warn must carry one of: `High`, `Medium`, or `Unchanged`.

**Three-tier risk levels:**

| Risk Level | Label in finding | When to assign |
|------------|-----------------|----------------|
| High | `Warn (High-Risk)` | Section is directly affected by a confirmed visual change AND the criterion is the primary category for that change type |
| Medium | `Warn (Medium-Risk)` | Section changed but criterion is indirectly affected (related, not primary) |
| Unchanged | `Warn (Unchanged)` | Section confirmed `unchanged` in visual diff AND criterion covers only that section |

**High-Risk Warn conditions:**

- Visual diff flags the section as `contrast-recheck` **AND** the criterion is C-series (contrast) covering that section → annotate as `Warn (High-Risk)`. Finding note must reference the specific surface change (e.g. "section changed from dark to light background — contrast re-verification required").
- Visual diff flags the section as `structure-recheck` **AND** the criterion is H-02 (heading hierarchy) or H-03 (section headings) → annotate as `Warn (High-Risk)`. Finding note must identify the new or changed section (e.g. "new testimonials section added — heading level sequence requires verification").

**Medium-Risk Warn conditions:**

- Visual diff flags the section as `structure-recheck` or `contrast-recheck` **AND** the criterion is indirectly related — for example:
  - ARIA landmark criteria when new sections are added
  - Focus-order or focus-indicator criteria when new interactive elements appear
  - Motion/animation criteria when a new animated component is added
- Annotate as `Warn (Medium-Risk)`. Finding note must identify the indirect relationship.

**Unchanged carry-forward rule:**

- Visual diff flags the section as `unchanged` **AND** the criterion covers only that section → annotate as `Warn (Unchanged)`. The prior finding note from `priorAudit.results` may be carried forward verbatim.

**Ambiguous rule:** Sections flagged `ambiguous` in the visual diff are treated as changed. Apply High-Risk or Medium-Risk annotation as appropriate — never Unchanged.

**Grouping rule:** When five or more criteria are classified as `Warn (Unchanged)`, do not list them individually. Group them under a single collective block:

> **Unchanged Warns (N criteria):** The following criteria cover sections confirmed visually unchanged. Prior findings carried forward: [comma-separated IDs]

## Scoring

Two scores are calculated and both are included in the report. This prevents a single confirmed-pass metric from masking 30+ unresolved warnings.

**Confirmed Score** — what is actually proven by this audit:

```
confirmed = Math.round(passes / (passes + confirmed_failures) × 100)
```

Where `confirmed_failures` = count of `Fail` + count of `Fail (inferred)` (excludes `Likely Fail` and `Warn`).
If there are zero confirmed failures, confirmed = 100.

**Worst-Case Score** — if every unresolved item (Warn + Likely Fail) turns out to be a failure:

```
worstCase = Math.round(passes / total × 100)
```

Both scores are passed to Skill 05. The gap between them is the "unresolved risk window" and is surfaced prominently in the report.

| Score | Band |
|-------|------|
| 90–100 | Excellent — minor refinements only |
| 75–89 | Good — a few issues to address |
| 55–74 | Needs improvement |
| 35–54 | Significant work needed |
| 0–34 | Critical — fails core requirements |

## Output

Record every result internally in this structure (you will pass it to Skill 05):

```
{
  id: string,
  criterion: string,
  status: 'Pass' | 'Fail' | 'Warn',
  wcag: string,
  finding: string
}
```

After evaluating all criteria, state:

- Total checks
- Pass count, Fail count (confirmed + inferred), Likely Fail count, Warn count
- Confirmed Score and band
- Worst-Case Score and band
- Unresolved risk window (difference between the two scores)

Then proceed immediately to Skill 04.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

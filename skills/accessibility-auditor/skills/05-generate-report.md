---
version: 2.4.0
last_updated: 2026-06-09
---

# Skill 05 — Generate the .docx report

## Purpose

Assemble all audit data as structured JSON, call the committed generation script, and deliver the report in chat. This skill does not contain docx-js implementation code — that lives in `scripts/generate-report.js`.

## Output path

Always write to:

```
reports/accessibility-audits/Accessibility_Audit_[SubjectSlug]_[YYYY-MM].docx
```

SubjectSlug: short PascalCase slug of the page/component name
  Examples: ServiceDiscovery, CheckoutForm, DashboardHeader, HomepageHero

YYYY-MM: current year and month

## Step 1 — Pre-flight checks

```bash
node --version
```

Node.js v18+ required. If below v18 or unavailable, stop and tell the user.

```bash
node -e "try { require('docx') } catch { require('/tmp/docx-tmp/node_modules/docx') }" 2>/dev/null && echo "ready" || echo "missing"
```

If missing:

```bash
npm install docx --prefix /tmp/docx-tmp
```

Confirm the script exists:

```bash
test -f agents/accessibility-auditor/scripts/generate-report.js && echo "found" || echo "MISSING"
```

If the script is missing, stop and report the issue to the user. Do NOT fall back to generating inline code without notifying the user.

## Step 2 — Assemble audit data as JSON

Build the following JSON object from the results of Skills 01–04. Write it to `/tmp/audit-data.json`.

```json
{
  "subject": "<SubjectSlug>",
  "artefactType": "<full page | component | email template | PDF | ...>",
  "date": "<YYYY-MM>",
  "standard": "WCAG 2.2 AA",
  "dsMode": "<lightspeed | user-provided | generic>",
  "dsName": "<Design system name, e.g. LightSpeed Design System v0.1.0>",
  "score": {
    "confirmed": 0,
    "worstCase": 0,
    "failures": 0,
    "likelyFailures": 0,
    "warnings": 0,
    "passes": 0
  },
  "summary": "<2–3 sentence executive summary: subject, score, top issues, strong areas>",
  "categories": [
    { "name": "<category name>", "score": "<passes/total>", "failures": 0, "warnings": 0 }
  ],
  "criteria": [
    { "id": "<ID>", "criterion": "<text>", "status": "<Pass|Fail|Warn>", "wcag": "<X.X.X>", "finding": "<artefact-specific note>" }
  ],
  "recommendations": [
    { "priority": "<Critical|Medium|Low>", "checkIds": "<comma-separated IDs>", "fix": "<specific fix>" }
  ]
}
```

Field notes:

- `score.confirmed`: `Math.round(passes / (passes + failures) * 100)` — only Pass/Fail items counted; 100 if zero failures
- `score.worstCase`: `Math.round(passes / total * 100)` — treats all Warn and Likely Fail as failures
- `score.failures`: count of `Fail` + `Fail (inferred)` statuses
- `score.likelyFailures`: count of `Likely Fail` statuses
- `score.warnings`: count of `Warn` statuses
- `score.passes`: count of `Pass` statuses
- `categories`: one row per criteria category included in this audit
- `criteria`: every criterion evaluated, in category order — use status values `Pass`, `Fail`, `Fail (inferred)`, `Likely Fail`, or `Warn`
- `recommendations`: every Fail, Likely Fail, and escalated Warn, in priority order (Critical first)
- `dsName`: design system name confirmed in Skill 01; use "Generic WCAG-compliant patterns" if DS mode is `generic`

Write the JSON to a temp file:

```bash
cat > /tmp/audit-data.json << 'AUDITEOF'
{ ... your assembled JSON here ... }
AUDITEOF
```

## Step 3 — Call the script

```bash
node agents/accessibility-auditor/scripts/generate-report.js \
  "reports/accessibility-audits/Accessibility_Audit_[SubjectSlug]_[YYYY-MM].docx" \
  < /tmp/audit-data.json
```

Confirm the file was created:

```bash
ls -lh reports/accessibility-audits/
```

If the script exits with an error, read the error message, diagnose the cause, fix it, and re-run before ending the session.

## Step 3b — Copy to ~/Downloads/

Copy the report to the user's Downloads folder so it's immediately accessible and shareable:

```bash
cp "reports/accessibility-audits/Accessibility_Audit_[SubjectSlug]_[YYYY-MM].docx" \
   ~/Downloads/Accessibility_Audit_[SubjectSlug]_[YYYY-MM].docx \
   && echo "Copied to Downloads" \
   || echo "WARNING: Could not copy to ~/Downloads/"
```

**If the copy succeeds:** use `~/Downloads/` as the primary path in Step 4.

**If the copy fails** (e.g. `~/Downloads/` does not exist on this machine): warn the user — "Could not copy to ~/Downloads/ — report is available at the staging path below." Use the staging path as the primary link instead. Do NOT abort the session.

## Step 4 — Deliver in chat

1. **Clickable file link** — output the Downloads path as the primary link:
   > Report ready: `~/Downloads/Accessibility_Audit_[SubjectSlug]_[YYYY-MM].docx` ([file size])
   > Also saved to: `[resolved path]/reports/accessibility-audits/Accessibility_Audit_[SubjectSlug]_[YYYY-MM].docx` (staging)

   If the Downloads copy failed, show only the staging path as the primary link with the warning from Step 3b.

2. **Inline summary** — render as markdown:

   **Full Audit / Quick Scan:**

   ```
   ## Audit Summary — [Subject]

   **Score:** Confirmed: N/100 · Worst-Case: N/100 (N unverified)
   N Failures · N Warnings · N Passes

   | Category | Score | Failures | Warnings |
   |----------|-------|----------|----------|
   | ...      | N/N   | N        | N        |

   **Top findings:**
   - [Priority] Criterion name — one-line finding note
   ```

   **Re-audit (when `comparison` is present in audit context):**

   ```
   ## Re-audit Summary — [Subject]

   **Score:** Confirmed: N/100 · Comprehensive: N/100 (N unverified)
   **vs. prior audit:** Confirmed: N → N ([▲/▼] ±N) · Comprehensive: N → N ([▲/▼] ±N)
   N Failures · N Warnings · N Passes

   | Category | Score | Failures | Warnings |
   |----------|-------|----------|----------|
   | ...      | N/N   | N        | N        |

   **Top findings:**
   - [Priority] Criterion name — one-line finding note
   ```

   Include the top 3–5 Critical and Medium findings only.

3. **Completion note:**
   > The report is in your Downloads folder — ready to open, attach, or share.

4. Do NOT commit the file automatically.

## Step 5 — Write audit log entry

After delivering the report, append a log entry to `reports/accessibility-audits/audit-log.json`. This enables future re-audits to compare scores.

Build the entry from the audit context:

```json
{
  "id": "<SubjectSlug>",
  "date": "<YYYY-MM>",
  "score": 0,
  "scores": {
    "confirmed": 0,
    "comprehensive": 0
  },
  "failures": 0,
  "warnings": 0,
  "passes": 0,
  "criteriaIds": ["<all criterion IDs evaluated>"],
  "skillVersions": {
    "01-analyse-input": "1.5.0",
    "02-build-criteria": "1.3.0",
    "03-evaluate": "1.3.0",
    "04-recommendations": "1.1.0",
    "05-generate-report": "2.4.0"
  },
  "results": [
    { "id": "<criterion id>", "status": "<Pass|Fail|Warn>", "finding": "<finding note>" }
  ]
}
```

Field notes:

- `score`: top-level confirmed score (kept for backwards compatibility with pre-dual-score log entries)
- `scores.confirmed`: same value as `score` — `Math.round(passes / (passes + confirmed_failures) × 100)`
- `scores.comprehensive`: worst-case score — `Math.round(passes / total × 100)` (treats all Warn + Likely Fail as failures)

Both `scores.confirmed` and `scores.comprehensive` are **required** in every log entry written from this version onward. Prior entries without `scores` are backwards-compatible (Skill 06 falls back to `score` for `previousScore.confirmed` and calculates `comprehensive` from prior counts).

```

Write it:
```bash
node -e "
const fs = require('fs');
const logPath = 'reports/accessibility-audits/audit-log.json';
const entry = JSON.parse(fs.readFileSync('/tmp/audit-log-entry.json', 'utf8'));
let log = [];
try { log = JSON.parse(fs.readFileSync(logPath, 'utf8')); } catch {}
log.push(entry);
fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
console.log('Audit log updated — ' + log.length + ' entries');
"
```

Write the entry JSON to `/tmp/audit-log-entry.json` before running the command above.

**If the write fails:** warn the user with: "Audit log write failed — re-audit comparison will not be available for this session." Do NOT fail the session or re-run the report.

**Optional `comparison` field (re-audit only):** If this is a re-audit and Skill 06 has produced a comparison object, include it as a top-level field in the audit data JSON passed to the script:

```json
{
  ...,
  "comparison": {
    "previousScore": { "confirmed": 90, "comprehensive": 58 },
    "newScore": { "confirmed": 78, "comprehensive": 52 },
    "delta": { "confirmed": -12, "comprehensive": -6 },
    "improved": [...],
    "regressed": [...],
    "speculativeRisks": [...],
    "newElements": [...],
    "stillFailing": [...],
    "skillVersionsMismatched": false
  }
}
```

When `comparison` is present, `generate-report.js` renders a "Comparison" page before the full results page.

**`speculativeRisks` section (re-audit only):** When `comparison.speculativeRisks` is non-empty, the report MUST render a "Verify before shipping" table that is **visually separate** from the confirmed `regressed` table. This table is not part of Pass/Fail/Warn scoring — it exists to flag near-threshold findings for developer verification. Each row includes: criterion ID, calculated ratio, AA threshold, gap, and finding note.

**`newElements` section (re-audit only):** When `comparison.newElements` is non-empty, the report MUST render a "New elements — not in prior scope" section. Each entry lists the element name, description, criteria categories introduced, and a recommendation note: "Add to criteria set in next full audit." These elements are not scored in this re-audit cycle.

**`scores` field (re-audit only):** The audit data JSON passed to the script should include both score fields for re-audit sessions:

```json
{
  ...,
  "score": {
    "confirmed": 78,
    "comprehensive": 52,
    "worstCase": 52,
    "failures": 2,
    "likelyFailures": 0,
    "warnings": 39,
    "passes": 7
  }
}
```

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

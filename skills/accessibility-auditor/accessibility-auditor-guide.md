# accessibility-auditor — Skills Guide

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![labeling-unified](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

accessibility-auditor is the WCAG 2.2 AA Accessibility Auditing Agent for LightSpeed projects. It accepts any UI input — a screenshot, URL, component description, or design spec — and runs a structured 5-step audit that produces a branded `.docx` report with a score card, full criteria results table, and design-system-aligned fix recommendations.

The agent is not a general assistant and does not implement fixes. It audits, scores, and recommends. A developer or another agent handles implementation.

---

## How the Agent Works

### It analyses the input first, always

Before building any criteria, the agent determines exactly what it is auditing: artefact type, surface (dark/light/mixed), interactive elements present, content types, and the depth of the audit (visual-only, description-based, or code-assisted). This scopes everything that follows.

### It builds a tailored criteria set, not a generic checklist

The agent selects only the WCAG categories relevant to what is actually present in the artefact. A single button component gets a different criteria set than a full page with forms, accordions, and video. After building the set, it pauses to show you the full criteria table before evaluating.

### It never skips a step

The 5-skill sequence is fixed:

```
01-analyse-input
    ↓ artefact facts
02-build-criteria
    ↓ tailored WCAG criteria set (shown to user)
03-evaluate
    ↓ Pass/Fail/Warn per criterion + score
04-recommendations
    ↓ DS-aligned fix recommendations
05-generate-report
    ↓
reports/accessibility-audits/Accessibility_Audit_[Subject]_[YYYY-MM].docx
```

### It always produces a .docx report

The final output is always a branded `.docx` file — never markdown, never prose. If generation fails for any reason, the agent diagnoses and fixes it before ending the session.

---

## When to Use It

- Before launching a new page or component to production
- During a design review, before development begins (from a Figma description or screenshot)
- When a client or stakeholder requests an accessibility audit document
- After a significant UI change that affects contrast, layout, or interactive elements
- As part of a recurring accessibility review cadence

---

## Prerequisites

| Requirement | Version | Install / Check |
|-------------|---------|----------------|
| Claude Code | Latest | `npm install -g @anthropic-ai/claude-code` |
| Node.js | 18 or higher | [nodejs.org](https://nodejs.org) — check with `node --version` |
| `docx` npm package | Any | Auto-installed to `/tmp/docx-tmp` if missing — no action needed |

No Linear API token is required. No MCP connection is required for the core workflow.

---

## How to Run It

Claude Code is a CLI tool — it runs in a terminal. Pick whichever interface suits you. Both work identically.

### Option A — Claude Code Desktop app

1. Download and install from [claude.ai/code](https://claude.ai/code)
2. Open the app
3. Open the `lightspeed-agents` folder
4. Start a new conversation and provide your input

### Option B — VS Code integrated terminal *(recommended if you already use VS Code)*

No plugin, no extension, no Copilot required. VS Code just gives you a terminal window — Claude Code runs inside it.

```bash
# 1. Install Claude Code (one-time)
npm install -g @anthropic-ai/claude-code

# 2. Navigate to the repo
cd path/to/lightspeed-agents

# 3. Open VS Code in the repo folder
code .

# 4. Open the integrated terminal in VS Code
#    Mac: Cmd+`   Windows/Linux: Ctrl+`

# 5. Start Claude Code
claude
```

You're now talking to the accessibility auditor. Your code and file explorer are in VS Code on the left — Claude Code is in the terminal on the right. The generated `.docx` report appears in your VS Code file explorer the moment it's created.

> **Not Copilot Chat.** GitHub Copilot Chat is a different tool and will not follow the audit pipeline, generate a report, or run any of the scripts. Always use Claude Code.

---

## Providing Input

Once you're in a Claude Code session, give the agent something to audit. There are four ways:

### 1. Drag and drop a screenshot

Drag any image file directly into the Claude Code chat input. It attaches inline and the agent reads it visually.

Then say:

```
Run an accessibility audit on this
```

### 2. Reference a file path

If the screenshot is already saved somewhere on your machine:

```
Audit this screenshot: /Users/yourname/Desktop/homepage.png
```

### 3. Paste a URL

If the page is live or on staging:

```
Run a WCAG 2.2 AA audit on https://staging.example.com/homepage
```

The agent fetches and reads the page if a browser MCP is configured, or asks you to describe it if not.

### 4. Describe the component in plain text

```
Audit this: a dark-background hero section with a white heading, a green CTA button, and a background image. The button text is 14px.
```

---

## What Happens Next

After you provide your input, the agent will:

1. Confirm the staging directory and Node.js availability
2. Ask which design system to use (LightSpeed DS, your own, or none)
3. Analyse your input and confirm what it is auditing
4. Build and display the criteria set for your review
5. Evaluate every criterion against your input
6. Build fix recommendations
7. Generate the `.docx` report and deliver it in chat: a clickable file link, an inline score summary with category breakdown and top findings, and a prompt to move the file to your preferred location

---

## Inputs It Accepts

| Input type | What to provide | What the agent does |
|------------|----------------|---------------------|
| Screenshot / image | Upload the file directly in Claude Code | Reads the image, identifies all visible elements |
| URL (no browser MCP) | Paste the URL and describe the page | Audits from your description; notes "code inspection recommended" in report |
| URL (browser MCP configured) | Paste the URL | Fetches and reads the page; extracts headings, links, alt text, form labels |
| Component description (text) | Describe the component in plain language | Accepts the description; asks one clarifying question only if artefact type is ambiguous |
| Design spec / Figma description | Describe the design in plain language | Treats as visual description; marks code-level attributes (alt, ARIA) as Warn |

---

## What the Report Contains

The `.docx` report has exactly three pages:

### Page 1 — Cover + Executive Summary

- Branded title block with audit metadata
- Score card: Overall Score · Failures · Warnings · Passes
- 2–3 sentence summary of the artefact, score, top issues, and strong areas
- Category breakdown table showing score, failures, and warnings per WCAG category

### Page 2 — Full Audit Results

- All evaluated criteria in a 5-column table: ID · Criterion · Status · WCAG · Finding
- Criteria grouped by category with section headers
- Status cells colour-coded: green (Pass), red (Fail), amber (Warn)
- Finding column contains artefact-specific notes, not generic WCAG descriptions

### Page 3 — Recommendations

- Prioritised fix table: Priority · Check IDs · Recommended fix
- Priority levels: Critical (Level A failures or full user-group blockers) · Medium (Level AA failures) · Low (best practice)
- For LightSpeed projects: fixes reference DS token names, component classes, and ARIA patterns
- Footer with audit attribution and visual-audit disclaimer

---

## Quick Scan

Quick Scan is a fast, single-criterion check that bypasses the full 5-step pipeline. Use it when you have a specific question about one element or criterion and don't need a full report.

**Quick Scan path:** Skill 01 → Skill 03 (1–3 criteria) → inline response in chat. No `.docx` generated.

**How to trigger it** — say something targeted and criterion-specific:

| Goal | Say something like... |
|------|----------------------|
| Check contrast on one element | "Does this button pass contrast?" |
| Check a focus indicator | "Quick check on this focus ring" |
| Verify a label | "Is this input label accessible?" |
| Single WCAG criterion | "Does this meet 2.4.4 link purpose?" |
| Explicitly request it | "Quick scan — just check contrast on this" |

**Output format:**

```
## Quick Scan — [Element / Criterion]

**Mode:** Quick Scan (targeted check — not a full WCAG 2.2 AA audit)

| Criterion | Status | Finding |
|-----------|--------|---------|
| C-01 Body text contrast | ❌ Fail | Estimated 2.8:1 — requires 4.5:1 for AA |

**Suggestion:** [brief fix, 1–2 sentences]
```

**When to use Full Audit instead:** If you need a complete WCAG compliance picture, a score, a category breakdown, or a shareable report — use the Full Audit (default). Quick Scan is not a substitute for a full audit and is clearly labelled as such.

---

## Re-audit & Score Comparison

After a developer implements your audit recommendations, you can run a follow-up audit to measure progress. The agent compares the new results against the original, shows you what improved, what regressed, and what still needs work — and includes a Comparison page in the `.docx` report.

### How to trigger a re-audit

Say something that signals a follow-up evaluation:

| Goal | Say something like... |
|------|----------------------|
| Explicit re-audit | "Re-audit this component" |
| Check if fixes landed | "Check if the fixes landed on the homepage" |
| Updated artefact | Provide a new screenshot + "this is the updated version" |
| Follow-up | "Run the audit again — we've made changes" |

### What the comparison report includes

- **Score badge:** Previous score → New score, with delta (green if improved, red if regressed)
- **Improved criteria table:** Criteria that moved from Fail/Warn to Pass
- **Regressions table:** Criteria that moved from Pass to Fail/Warn
- **Still failing table:** Criteria that remain Fail or Warn

The comparison page appears between the Cover + Summary page and the Full Results page.

### Where the audit log is stored

Every completed full audit writes a lightweight entry to:

```
reports/accessibility-audits/audit-log.json
```

This file is gitignored (it lives inside `reports/`). Each entry records the subject, date, score, criteria IDs, skill versions, and per-criterion results. Re-audit reads the most recent matching entry by subject slug.

### Fallback behaviour

If no prior audit exists for the subject in `audit-log.json`, the agent tells you and offers to run a Full Audit instead. The result is recorded so future re-audits are possible from that point.

---

## Design System Support

At the start of every audit, the agent asks you to provide a design system reference. There are three paths:

### Option A — LightSpeed Design System

Say **"LightSpeed DS"** (or confirm it is a LightSpeed project). The agent loads the built-in token reference at `agents/accessibility-auditor/references/ls-ds-tokens.md` and uses LightSpeed token names, component classes, and colour values for all fix recommendations. Arbitrary hex values outside the DS are never suggested in this mode.

### Option B — Your own design system

Paste your token list, describe your style guide, or share a component library URL. The agent uses your tokens for all fix recommendations. If a required fix has no matching token in your DS, it notes the gap explicitly rather than silently substituting a value.

### Option C — No design system

Say **"none"** or skip the prompt. The agent provides framework-agnostic recommendations using generic CSS custom property patterns and WCAG-compliant hex values. No DS-specific token names are referenced.

The report header always states which DS mode was used (e.g. "Recommendations based on: LightSpeed Design System v0.1.0").

---

## Skill Reference

| Skill | File | What it does |
|-------|------|-------------|
| 01 — Analyse input | `skills/01-analyse-input.md` | Identifies artefact type, surface, interactive elements, content types, and audit depth |
| 02 — Build criteria | `skills/02-build-criteria.md` | Selects WCAG categories relevant to this artefact; builds a tailored criteria table |
| 03 — Evaluate | `skills/03-evaluate.md` | Evaluates every criterion; assigns Pass/Fail/Warn with a specific finding note; calculates score |
| 04 — Recommendations | `skills/04-recommendations.md` | Produces a prioritised, DS-aligned fix recommendation for every Fail and escalated Warn |
| 05 — Generate report | `skills/05-generate-report.md` | Generates the branded `.docx` report using Node.js + docx-js; delivers a clickable file link and inline summary in chat; prompts the user to move the file from the staging directory |

---

## Output Location

After generation, the agent delivers the report directly in chat. The file is initially written to the staging directory:

```
reports/accessibility-audits/Accessibility_Audit_[SubjectSlug]_[YYYY-MM].docx
```

The agent then prompts you to move the file to your preferred location — for example, a client project folder or a shared drive. The staging directory is **not** for long-term storage; it exists to hold the file while the agent delivers it in chat.

If you are auditing a client site, move the file out of the repo directory immediately after delivery to avoid mixing client reports into the platform repo.

Generated `.docx` files are gitignored by default. The directory is tracked via `.gitkeep`.

---

## Limitations

- **Visual audit only** — the agent analyses what is visible or described. It cannot execute JavaScript, inspect computed styles, or verify runtime behaviour. A code-level automated scan (Axe, WAVE, Lighthouse) is recommended after the visual audit for full coverage.
- **Alt text and ARIA from descriptions** — when auditing from a screenshot or Figma description, code-level attributes cannot be confirmed. These criteria are marked Warn, not Pass or Fail.
- **Contrast estimation** — contrast ratios are estimated from visible colours or token names. For precise ratios, run a dedicated contrast checker against the live rendered output.
- **Dynamic state** — hover, focus, active, error, and loading states cannot be audited from a static screenshot. Provide descriptions of these states or audit them separately.

---

## Quick Reference — What to Say

| Goal | Say something like... |
|------|----------------------|
| Start an audit | "Audit this screenshot for accessibility" |
| Audit a page | "Run a WCAG audit on [page name/URL]" |
| Audit a component | "Accessibility review of this accordion component" |
| Audit from a description | "Audit this: [paste your description]" |
| Use LightSpeed DS | "LightSpeed DS" (at the design system prompt) |
| Use your own DS | Paste your token list or style guide URL (at the design system prompt) |
| No design system | "none" (at the design system prompt) |
| After receiving the criteria set | "Looks good, proceed" or "Stop here and let me review" |

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

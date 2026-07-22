---
name: wordpress-remediation-planner
description: Use when the user wants WordPress findings, audit notes, launch issues, plugin concerns, form problems, SEO gaps, or mixed site observations turned into a prioritized remediation plan, staged implementation sequence, quick-wins list, or developer-ready action batches.
---

# WordPress Remediation Planner

## When to use

Use this skill when the user wants to move from findings to action, especially for requests like:

- "Turn this audit into a plan"
- "What should we fix first before launch?"
- "Group these WordPress issues into staged work"
- "Make this developer-ready"
- "Which items are safe to do now on staging and which need manual checks?"

Do not use this skill for first-pass site inspection, general WordPress brainstorming, or a pure findings report with no planning or prioritisation request.

## What this skill does

Turn mixed WordPress findings into a practical remediation plan that:

1. prioritises by launch risk, user impact, SEO impact, and implementation dependency
2. separates direct-change candidates from manual follow-up work
3. distinguishes staging-safe actions from production-sensitive actions
4. groups work into sensible batches instead of a flat issue list
5. leaves the user with a clear next implementation sequence

## Workflow

### 1. Normalise the input

Start by converting the incoming material into a clean working set of findings.

Possible inputs include:

- connected inspection findings
- WordPress audit notes
- launch-readiness gaps
- Gravity Forms issues
- Yoast SEO issues
- plugin or theme concerns
- manual notes from the user

For each finding, identify when possible:

- affected area
- observed issue
- likely consequence
- confidence level: observed, inferred, or needs manual verification
- whether the issue blocks launch, weakens quality, or is optional improvement

If the incoming findings are noisy, merge duplicates and keep the most implementation-useful wording.

### 2. Prioritise the work

Classify each finding into one of these planning levels:

- **Launch blocker**: could materially block go-live, form handling, crawlability, core site function, or required compliance behaviour
- **High priority**: should be fixed before or immediately after launch because it meaningfully affects UX, SEO, conversions, or admin reliability
- **Medium priority**: worthwhile but not launch-critical
- **Low priority / backlog**: polish, optimisation, or deferred improvement

Use WordPress-specific judgement. Prioritise more aggressively when findings affect:

- homepage or core navigation behaviour
- public-facing form submission and routing
- indexation, sitemap posture, metadata coverage, or broken SEO defaults
- incorrect reading settings, permalink structure, or launch visibility settings
- missing consent or privacy handling on data-collection forms
- critical plugin conflicts or activation state problems

Do not inflate minor editorial improvements into blockers.

### 3. Separate execution paths

For each item or batch, decide the right path:

- **Direct-change candidate**: likely suitable for supported connected implementation after explicit user approval
- **Manual WordPress follow-up**: should be done in wp-admin, hosting, plugin settings, theme code, deployment tooling, or another external system
- **Needs verification first**: evidence is incomplete, risky, or environment-dependent

Treat these as higher-risk by default:

- plugin activation, deactivation, install, update, or removal
- theme switching or theme-file changes
- database changes
- production-only changes
- anything that may break forms, styling, tracking, routing, or SEO visibility

### 4. Batch the plan

Group related work into practical implementation batches. Prefer batches such as:

- core site settings
- navigation and content structure
- Gravity Forms fixes
- Yoast SEO fixes
- plugin and theme risks
- launch-readiness checks
- post-launch follow-up

Within each batch, order actions by dependency. For example, do not schedule page-level SEO cleanup before confirming indexation posture and template defaults when the latter would change the former.

### 5. Produce the final plan

Use the following Markdown structure unless the user asked for another format:

## Priority Summary

Briefly summarise the top priorities in plain language.

## Remediation Batches

For each batch, include:

- batch name
- why it matters
- priority level
- specific actions
- whether each action is staging-safe, production-sensitive, or manual
- dependencies or sequencing notes

## Quick Wins

List the fastest high-value items.

## Manual Checks and Risks

Call out anything that should be manually verified before go-live or before direct implementation.

## Recommended Next Step

End with the single best next move for the user.

## Quality rules

- Keep the plan implementation-ready, not motivational.
- Use WordPress wording, not generic product-planning language.
- Separate observed facts from inferred causes.
- When evidence is incomplete, say what needs verifying instead of pretending certainty.
- Prefer grouped action batches over long unstructured bullet lists.
- If the user supplied an audit report, do not merely restate it; transform it into an action sequence.
- If the request is launch-focused, bias the plan toward go-live safety and public-facing behaviour first.
- If the request is form-focused, explicitly cover fields, routing, confirmations, spam, consent, and QA.
- If the request is SEO-focused, explicitly cover templates, page-level metadata gaps, indexation, sitemaps, breadcrumbs, and launch visibility implications.

## Grounded references

When they materially improve the result, use these configured resources:

- {{label:pre-launch-summary-template.md,id:6a403cd6f7088191a67957996df07279,type:file}} for launch-oriented remediation framing
- {{label:gravity-forms-plan-template.md,id:6a403f139a208191b92c4ce0ce183a86,type:file}} when form remediation needs reusable per-form structure
- {{label:seo-launch-checklist.md,id:6a403e26f7908191b7671944f1c53e32,type:file}} when SEO and launch checks overlap
- {{label:wordpress-audit-reporting,id:hsk_6a441f0688208191bd31165d0b4a4321,type:skill}} when the user needs the findings packaged as a concise audit summary instead of a remediation plan

## Example

### Input shape

The user provides a WordPress launch audit with issues across reading settings, contact forms, missing page metadata, and a few low-priority content tidy-ups.

### Good output shape

- one short priority summary
- 3 to 5 remediation batches grouped by dependency
- explicit launch blockers vs non-blockers
- quick wins separated from deeper work
- manual checks called out clearly
- one recommended next step such as "fix core launch settings and form routing on staging first"

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

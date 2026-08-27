---
name: lightspeed-qa-findings-router
description: triage qa findings for lightspeed wordpress, figma design system, block theme, block plugin, woocommerce, publishing, tourism, ai-readiness and launch projects. use when raw qa notes, test results, screenshots, parity issues, accessibility failures, responsive bugs, form or tracking defects, seo redirects, schema issues, content or governance review notes, stakeholder feedback, github/asana items or launch blockers need severity classification, evidence handling, owner routing, specialist-skill routing, github-ready issue drafts, retest steps, client-safe summaries or launch go/no-go recommendations.
---

# LightSpeed QA Findings Router

## Purpose

Turn messy QA evidence into a practical LightSpeed fix-routing pack.

Use this skill after acceptance testing, launch QA, design parity review, accessibility checks, responsive review, form testing, analytics validation, .schemas/redirect QA, Lighthouse/PageSpeed checks, stakeholder review or post-implementation smoke testing.

## Core rules

- Do not treat every finding as a launch blocker. Classify by launch risk, user impact, evidence quality, scope, ownership and reversibility.
- Do not invent reproduction steps, affected URLs, screenshots, owners or causes. If evidence is incomplete, mark the finding as `Needs Reproduction` and ask only the smallest useful follow-up question.
- Separate client-safe summaries from internal implementation notes.
- Draft GitHub-ready issues, Asana-ready actions or retest checklists only from actionable findings.
- Do not create live GitHub, Asana or Linear items unless the user explicitly asks for creation. Default to drafts.
- Prefer practical LightSpeed routing over generic QA advice.

## Input handling

Accept rough, mixed or partial inputs. Useful inputs include:

- QA notes, screenshots, screen recordings or stakeholder comments
- test script results, acceptance tables, checklist exports or launch QA plans
- Figma parity reports, design-system notes or Figma-to-WordPress findings
- accessibility, responsive, Lighthouse/PageSpeed or performance notes
- broken link, redirect, canonical, sitemap, robots, metadata or schema validation notes
- form testing, conversion tracking, GA4, GTM or CRM handoff results
- content, claim, policy, governance, AI-readiness or chatbot-source review findings
- GitHub issue drafts, PR comments, Asana tasks, Google Docs, Drive files or repo notes
- PRD requirements, acceptance criteria, implementation plans or launch gates

When inputs are scattered:

1. Create a source inventory before triage.
2. Label each finding as `Approved Source`, `Observed Evidence`, `Stakeholder Reported`, `Unconfirmed`, `Assumption` or `Out of Scope`.
3. Preserve file names, URLs, issue IDs, task links and screenshot names when supplied.
4. Merge obvious duplicates but preserve unique evidence from each duplicate source.
5. If no concrete QA findings are supplied, route upstream instead of forcing a findings report.

## Evidence quality labels

Use these labels consistently:

| Label | Use when |
|---|---|
| `Reproducible` | Clear steps, affected area and evidence are supplied. |
| `Observed Evidence` | The issue is visible in supplied evidence, but steps may be incomplete. |
| `Partial Evidence` | Some evidence exists, but impact or reproduction is unclear. |
| `Stakeholder Reported` | A person reported the issue, but it has not been independently verified. |
| `Needs Reproduction` | The finding cannot be confirmed from the supplied material. |
| `Duplicate` | The same underlying fix is already covered elsewhere. |
| `Invalid` | The behaviour is expected, already fixed, or not an issue. |
| `Out of Scope` | The request is valid but outside the current release, approval gate or estimate. |

## Default workflow

1. **Inventory sources** — list the inputs reviewed and any gaps.
2. **Normalise findings** — convert each finding into a row with ID, source, summary, evidence, expected result, actual result, affected area, severity, launch status, workstream, owner role and next action.
3. **Classify evidence quality** — use the labels above before assigning severity.
4. **Classify severity** — use `Critical`, `High`, `Medium`, `Low` or `Improvement`.
5. **Classify launch status** — use `Launch Blocker`, `Must Fix Before Launch`, `Can Launch With Follow-up`, `Post-launch Improvement`, `Needs Reproduction`, `Duplicate` or `Out of Scope`.
6. **Route workstream** — assign the best LightSpeed owner role and specialist skill route.
7. **Draft actionable fixes** — create GitHub-ready issue drafts only for findings with enough evidence to act.
8. **Add retest coverage** — include clear retest steps and acceptance checks for every actionable finding.
9. **Summarise launch impact** — state what blocks launch, what can be accepted with risk, and what should move to post-launch optimisation.
10. **Recommend next workflow** — route to the most specific related LightSpeed skill when more specialist work is needed.

For detailed execution, use:

- `references/qa-findings-workflow.md`
- `references/severity-and-launch-status.md`
- `references/workstream-routing.md`
- `references/github-issue-drafting.md`
- `references/retest-rules.md`
- `references/report-template.md`

## When to route away before triage

Route upstream instead of producing a QA findings report when the user does not yet have findings:

| User need | Route to |
|---|---|
| Create acceptance tests from a PRD, implementation plan or issue pack | `lightspeed-acceptance-test-planner` |
| Plan final launch QA scope before testing starts | `lightspeed-launch-qa-planner` |
| Run a full launch readiness audit rather than triage supplied findings | `lightspeed-launch-readiness-auditor` |
| Check requirement-to-test or issue coverage before QA | `lightspeed-requirements-traceability-mapper` |
| Decide which launch workstream should own a broad task pack | `lightspeed-launch-task-router` |
| Review a change request discovered during QA | `lightspeed-change-request-router` |
| Manage sign-off, go/no-go or stakeholder approval gates | `lightspeed-approval-gate-manager` |
| Report project status from QA progress and blockers | `lightspeed-project-status-reporter` |

## Specialist routing after triage

Use the most specific related skill for follow-on work:

| Finding type | Primary route | Use when |
|---|---|---|
| Figma-to-WordPress parity, token mismatch, component/block mismatch, dark mode parity | `lightspeed-figma-wordpress-parity-auditor` | The fix needs design-system evidence or Figma-vs-WordPress comparison. |
| Design handoff unclear or incomplete | `design-qa-readiness` or `design-execution-packet` | The finding is caused by weak design instructions rather than implementation. |
| Block theme patterns, templates, template parts, theme.json, style variations | `wordpress-block-theme-router` | The fix concerns block-theme assets or needs a WordPress specialist route. |
| Pattern/header/template validity | `wordpress-block-asset-validator` | The user asks whether generated assets comply before merge or launch. |
| GitHub-ready issue creation or issue pack expansion | `lightspeed-github-issue-drafter` | QA findings are ready to become implementation issues. |
| Redirects, 404s, changed URLs or migration risk | `lightspeed-redirect-map-planner` | The fix needs redirect mapping, 404 prevention or migration controls. |
| Technical SEO crawlability, canonicals, metadata, sitemap, robots, internal linking | `technical-seo-audit` | The issue needs technical SEO investigation beyond a single finding. |
| Schema, FAQ schema, AI discoverability, answer-engine optimisation | `lightspeed-schema-and-ai-discoverability-planner` | The finding concerns structured data or AI/search answer readiness. |
| GA4, GTM, form events, lead tracking, dashboard baseline | `lightspeed-ga4-conversion-tracking-planner` | Tracking design or validation needs follow-on planning. |
| Accessibility failures | `lightspeed-launch-readiness-auditor` or `lightspeed-figma-wordpress-parity-auditor` | Use launch readiness for site-wide audit; use parity when the cause is design-system implementation. |
| Performance, Core Web Vitals, Lighthouse, page weight, hosting constraints | `website-performance-assessor` | The finding needs performance diagnosis or optimisation planning. |
| Claims, unsupported statistics, proof gaps, testimonial risk | `lightspeed-claim-register-auditor` | The finding needs evidence classification or claim approval. |
| Content gaps, copy fixes, FAQ/source-safe content | `lightspeed-website-content-generator` or `lightspeed-faq-and-chatbot-source-curator` | The fix is content creation, consolidation or chatbot-safe source wording. |
| Policy, privacy, accessibility statement, AI disclosure, trust-page wording | `lightspeed-policy-page-generator` | The finding needs governance wording separated from legal review. |
| Chatbot source, escalation, fallback, governance or approved-source issue | `ai-chatbot-planner` or `chatbot-planning-orchestrator` | The finding affects bounded chatbot behaviour or source readiness. |
| Release notes, support transition, client handover after fixes | `lightspeed-release-handoff-generator` | QA is resolved or accepted and needs closure documentation. |
| Post-launch CRO, content iteration, analytics-led backlog | `post-launch-optimisation` | The finding is safe after launch and belongs in optimisation. |

## Required output for QA triage

Use this structure by default. Omit sections only when clearly irrelevant.

1. **3-bullet summary** — value, risks, next step.
2. **Source evidence reviewed** — include approved, observed and unconfirmed sources.
3. **Launch impact** — blockers, must-fix items, accepted-risk items and post-launch items.
4. **Prioritised findings register** — one row per normalised finding.
5. **Launch blocker list** — only true blockers with required fix and retest requirement.
6. **Workstream routing table** — owner role, related skill and next action.
7. **GitHub-ready issue drafts** — one issue per independently testable fix.
8. **Retest checklist** — exact checks required after fixes.
9. **Duplicate, invalid, out-of-scope and needs-reproduction list**.
10. **Unresolved questions** — only questions that unblock the next decision.
11. **Client-facing summary** — concise, non-technical and safe to share.
12. **Internal LightSpeed notes** — implementation risks, assumptions and routing rationale.

Use these templates when the user needs copy-paste-ready files:

- `assets/qa-findings-register-template.md`
- `assets/launch-blocker-list-template.md`
- `assets/workstream-routing-template.md`
- `assets/github-issue-draft-template.md`
- `assets/retest-checklist-template.md`
- `assets/client-summary-template.md`

## GitHub issue drafting rules

- Create one draft per independently testable fix.
- Include evidence, affected area, expected result, actual result, reproduction steps, acceptance criteria, retest steps, labels and dependencies.
- Keep labels practical: `qa`, `bug`, `launch-blocker`, `accessibility`, `responsive`, `figma-parity`, `block-theme`, `block-plugin`, `forms`, `analytics`, `seo`, `schema`, `content`, `policy`, `performance`.
- If a finding is `Needs Reproduction`, draft a reproduction task instead of an implementation fix.

## Output style

- Use UK English.
- Be direct, practical and suitable for LightSpeed standups, GitHub issues, Asana tasks or client launch updates.
- Prefer concise tables and action lists over long narrative.
- Make uncertainty explicit.
- Do not over-prescribe tools when a simple fix, retest or owner decision is enough.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

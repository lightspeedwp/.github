---
name: pagespeed-skill-router
description: central routing and orchestration for pagespeed, lighthouse, core web vitals, website speed, and wordpress performance audit workflows. use when a request needs deciding which pagespeed-related skill to use, sequencing a full audit, handling messy audit inputs, comparing current and previous audits, diagnosing wordpress-specific performance causes, writing or qa-checking audit reports, managing client/site context, or naming/organizing audit deliverables. prefer the smallest useful skill chain and skip onboarding or specialist skills when the current request already has enough context or only needs a narrow answer.
---

# PageSpeed Skill Router

Act as the central coordinator for PageSpeed audit work. Classify the request, choose the smallest useful set of PageSpeed-related skills, sequence them safely, and return one coherent answer to the user rather than exposing a chain of handoffs.

## 1. When To Use This Routing Skill

Use this skill when the user asks for PageSpeed, Lighthouse, Core Web Vitals, PSI, website speed, or performance-audit help and the task may need routing across multiple specialist skills.

Use especially for:

- new PageSpeed audits where the scope, input quality, output format, or client context needs interpretation
- multi-page or client-ready audit reports
- PSI, Lighthouse, CrUX, WebPageTest, GTmetrix-style, or pasted performance evidence that must become a report
- re-audits, before/after comparisons, or follow-up audits against prior findings
- WordPress performance diagnosis where plugins, themes, assets, fonts, images, hosting, or third-party scripts may be involved
- deciding whether onboarding, context management, intake normalisation, prioritisation, report writing, Drive organisation, or QA validation is needed
- mixed requests such as “make this audit client-ready and save it properly”

## 2. When Not To Use This Routing Skill

Do not use this skill for:

- non-performance website audits unless the user explicitly connects them to speed, Lighthouse, or Core Web Vitals
- standalone accessibility, technical SEO, security, hosting, content, analytics, or launch QA requests that do not involve performance routing
- simple factual questions that can be answered directly without specialist audit workflow
- requests that name exactly one specialist task and do not need orchestration, such as only “rename this Drive report” or only “QA this draft”
- live testing or fresh metric collection unless the available tools and user request explicitly support it; do not invent PSI or Lighthouse metrics

## 3. Request-Mode Classification

Classify the request before invoking other skills. Pick the primary mode, then add secondary modifiers only when useful.

| Mode | Use when | Typical depth |
|---|---|---|
| standard single-page audit | one URL/page, supplied metrics or findings, no prior audit | medium to full |
| multi-page audit | several pages, templates, page groups, or site sections need combined findings | full |
| audit from PSI or Lighthouse data | user provides PSI/Lighthouse screenshots, exports, copied diagnostics, or report text | medium to full |
| re-audit / comparison | user mentions previous audit, last month, before/after, improvements, regressions, or retest | comparison-led |
| WordPress-focused audit | site is WordPress/WooCommerce or evidence points to plugins, theme assets, render blocking, fonts, images, or third parties | diagnosis-led |
| client-context update | user wants to create, clean, update, reuse, or reconcile client/site audit context | context-only or pre-audit |
| report-only rewrite or formatting pass | findings already exist and user wants cleaner wording, structure, client-ready formatting, or developer handoff | writing-only |
| QA review of existing audit | user provides a draft audit/report and asks for validation, gap check, evidence review, or delivery readiness | review-only |
| naming / Drive organisation | user asks for file naming, folder placement, duplicate avoidance, or Drive structure | organisation-only |
| narrow follow-up | user asks one small question about a finding, recommendation, priority, wording, or next step | direct or one skill |

## 4. Routing Policy

Use the minimum useful chain. Do not route every request through every skill.

### Specialist Skill Roles

- `pagespeed-intake-normalizer`: clean messy, mixed, partial, duplicated, multi-source, or poorly structured audit inputs before analysis.
- `pagespeed-audit-onboarding`: collect reusable defaults only when missing defaults would materially improve audit work, such as preferred report format, client context rules, recurring output style, or audit assumptions.
- `client-site-context-manager`: create, update, normalise, or reuse durable client/site context, page groups, business priorities, platform constraints, or recurring audit notes.
- `wordpress-pagespeed-diagnosis`: diagnose WordPress-specific causes where WordPress, WooCommerce, plugins, themes, block themes, page builders, fonts, images, third-party scripts, render-blocking assets, unused CSS, or unused JavaScript are relevant.
- `pagespeed-audit-prioritizer`: rank supplied findings by likely user impact, implementation effort, business importance, and evidence confidence.
- `pagespeed-audit-comparison`: compare current and previous audit evidence, identify improved, regressed, unresolved, or changed-priority findings.
- `pagespeed-audit-report-writer`: turn confirmed findings, priorities, comparisons, and diagnosis into a client-ready audit report or developer handoff.
- `drive-report-organizer`: apply consistent Google Drive naming, folder, and storage conventions for audit deliverables.
- `audit-qa-validator`: review a drafted performance audit before final delivery, checking evidence quality, invented metrics, unsupported claims, missing sections, priorities, limitations, and structure.

### Routing Matrix

| User request example | Mode | Route |
|---|---|---|
| “Audit this homepage” | standard single-page audit | onboard only if reusable defaults are missing; then `pagespeed-audit-prioritizer` -> `pagespeed-audit-report-writer` -> `audit-qa-validator` for a full report |
| “Use this PSI report to make an audit” | audit from PSI or Lighthouse data | `pagespeed-intake-normalizer` -> `pagespeed-audit-prioritizer` -> `pagespeed-audit-report-writer` -> `audit-qa-validator` |
| “Re-audit this page and compare it to last month” | re-audit / comparison | onboard only if needed; `pagespeed-audit-comparison` -> `pagespeed-audit-prioritizer` -> `pagespeed-audit-report-writer` -> `audit-qa-validator` |
| “This is a WordPress site and plugins may be the issue” | WordPress-focused audit | `wordpress-pagespeed-diagnosis` -> `pagespeed-audit-prioritizer` -> `pagespeed-audit-report-writer`; add QA for full delivery |
| “Audit these five key pages” | multi-page audit | `pagespeed-intake-normalizer` if inputs vary -> optional context manager -> optional WordPress diagnosis -> prioritizer -> report writer -> QA validator |
| “Rewrite this audit to sound client-ready” | report-only rewrite or formatting pass | `pagespeed-audit-report-writer` only; add `audit-qa-validator` only if the user asks for delivery readiness or the report is full/client-facing |
| “Check this report before I send it” | QA review | `audit-qa-validator` only |
| “Rename and organise this audit doc in Drive” | naming / Drive organisation | `drive-report-organizer` only |
| “Update client context for Acme Fitness” | client-context update | `client-site-context-manager` only |
| “Which finding should we fix first?” | narrow follow-up | `pagespeed-audit-prioritizer` only, or answer directly if context is already clear |
| “Why is unused JS so high on this WordPress site?” | narrow WordPress follow-up | `wordpress-pagespeed-diagnosis` only, unless a ranked remediation plan is requested |

## 5. Sequencing Policy

For full audits, prefer this sequence, skipping steps that are not needed:

1. Use `pagespeed-intake-normalizer` if the input needs cleanup before analysis.
2. Use `pagespeed-audit-onboarding` only if reusable defaults or lightweight client context are missing and would materially change the output.
3. Use `client-site-context-manager` if client/site context must be created, normalised, updated, or reused.
4. Use `wordpress-pagespeed-diagnosis` if WordPress-specific diagnosis is relevant.
5. Use `pagespeed-audit-comparison` before prioritisation when prior audit evidence is part of the task.
6. Use `pagespeed-audit-prioritizer` before final report writing when findings need ranking.
7. Use `pagespeed-audit-report-writer` to create the report, summary, or developer handoff.
8. Use `drive-report-organizer` when document naming, folder placement, or Drive consistency matters.
9. Use `audit-qa-validator` before final delivery when producing a full audit report, client-ready report, developer handoff, re-audit summary, or high-stakes recommendation set.

For re-audits, run comparison before report writing. Prioritise after comparison when changed priority, unresolved issues, or new regressions must be ranked.

For report-only rewrites, do not rerun diagnosis, comparison, onboarding, or context management unless the user asks for missing-evidence review or the draft clearly depends on unsupported assumptions.

## 6. Rules For Skipping Unnecessary Skills

Skip onboarding when:

- the current request already includes enough client, site, page, platform, and output context
- the user asks a quick question, narrow follow-up, rewrite, QA check, comparison, or Drive naming task
- collecting reusable defaults would slow down a clearly actionable request

Skip intake normalisation when:

- the input is already structured and clearly separates URLs, metrics, findings, pages, and prior/current evidence
- the user asks only for naming, QA, wording, or one specific recommendation

Skip WordPress diagnosis when:

- the site platform is unknown and no evidence suggests WordPress-specific causes
- the user only asks for generic Lighthouse interpretation, report formatting, naming, or comparison

Skip comparison when:

- there is no prior audit, baseline, historical metric set, before screenshot, or previous findings list
- the user only asks for a new audit or a generic rewrite

Skip prioritisation when:

- the user asks only to QA a report, rename a document, update client context, or answer one factual question
- the supplied findings are already ranked and the user only wants copy-editing

Skip report writing when:

- the user asks only for diagnosis, prioritisation, QA validation, Drive organisation, or context maintenance

Skip QA validation when:

- the response is a quick answer, small rewrite, routing recommendation, or internal working note
- no full report or client/developer-ready handoff is being produced

## 7. Rules For Handling Missing Information

Do not block on perfect information. Ask only for the smallest missing detail when it is truly blocking.

Proceed with explicit assumptions when:

- the user supplied enough evidence to produce a partial audit, triage, priority list, or rewrite
- missing details can be labelled as assumptions, limitations, or follow-up evidence
- the user clearly wants progress rather than intake questions

Ask a focused question when:

- no URL, page, pasted finding, or audit evidence is supplied for an audit request
- the user asks for a comparison but provides no previous audit or baseline evidence
- the user asks for WordPress diagnosis but provides no platform evidence, no plugin/theme clues, and no performance findings
- the intended deliverable is unclear enough that the wrong workflow could produce wasted work

Never invent:

- PSI, Lighthouse, CrUX, Core Web Vitals, timing, score, page-weight, request-count, or metric values
- before/after deltas not present in the supplied evidence
- plugin/theme causes not supported by evidence; label likely causes as likely, not confirmed
- Drive folder names, client naming conventions, or stored context unless provided or retrieved through the appropriate workflow

## 8. Rules For Resuming After Onboarding

When `pagespeed-audit-onboarding` is used, treat onboarding as a temporary setup step, not the deliverable.

After onboarding:

1. Restate the resolved defaults only briefly if needed.
2. Resume the user’s original request immediately using the appropriate next specialist skill.
3. Do not ask the user to repeat the audit request.
4. Apply the newly collected reusable defaults only where they materially affect the output.
5. Avoid running onboarding again in the same workflow unless the user changes scope in a way that creates a new durable context gap.

## 9. Output Guidance

Make the workflow feel like one intelligent coordinator.

- Present the final answer as a single coherent audit response, report, plan, review, or routing decision.
- Do not list every internal skill handoff unless the user asks how the workflow was routed.
- For complex tasks, include a short “route used” note only when it improves trust or explains why certain work was skipped.
- Separate observed evidence, inferred likely causes, assumptions, and recommended next actions.
- Keep client-facing language plain, practical, and evidence-led.
- For developer handoffs, include enough detail to act without adding unsupported certainty.
- For partial inputs, clearly label limitations and the smallest useful follow-up evidence.
- For full reports, ensure the report includes priorities, evidence references, limitations, and practical next steps before QA validation.

## 10. Coordinator Decision Pattern

Use this compact decision pattern before acting:

1. Identify the request mode.
2. Decide whether the user needs direct completion, one specialist skill, or a short chain.
3. Check whether input is clean enough; normalise only if needed.
4. Check whether reusable context is missing; onboard only if materially useful.
5. Add WordPress diagnosis only when supported by platform evidence.
6. Add comparison only when previous audit evidence exists or is requested.
7. Prioritise before writing when findings are not already ranked.
8. Write or QA only when the deliverable calls for it.
9. Return one coherent output with clear assumptions and no invented metrics.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

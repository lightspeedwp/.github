---
name: zendesk-backlog-trend-analysis
description: analyze zendesk-first support backlog health, queue risk, repeated issues, weekly support summaries, period-over-period trend comparisons, sla or ageing risk, and daily or weekday support digests. use when a shared support agent with zendesk access needs an evidence-backed operational report, priority support actions, duplicate or incident-like pattern signals, or queue-health notes. keep zendesk as the source of truth and avoid product, project, github, linear, asana, slack, gmail, google drive, or roadmap routing unless explicitly requested or clearly supported by zendesk evidence.
---

# Zendesk Backlog Trend Analysis

Produce support-operational backlog and trend analysis for a shared support agent with Zendesk access. Keep outputs practical for support leads, queue owners, and agents deciding what needs attention now.

## Shared-agent compatibility

This skill is designed for a shared workspace agent. It must not depend on:

- a specific user login, personal memory, local files, private helper scripts, or one person's connector setup
- hardcoded Zendesk group, brand, assignee, organisation, custom-field, or view IDs unless they are provided by the active request or confirmed in the active agent environment
- GitHub, Linear, Asana, Slack, Gmail, Google Drive, or other secondary systems unless explicitly requested or Zendesk evidence clearly requires a grounded secondary check

Use the active agent's available Zendesk read actions only. If required read actions are unavailable, say the skill cannot produce an evidence-backed backlog report in that environment. Do not guess or create synthetic counts.

Consult `references/shared-agent-compatibility.md` when configuring or QA-checking the skill for a shared workspace agent. Use `references/workspace-capability-profile.md` when Zendesk permissions, visible fields, or optional SLA/CSAT visibility need to be documented for a shared agent. Use `references/shared-agent-rollout-checklist.md` and `references/shared-agent-smoke-test-plan.md` when validating the skill inside a shared workspace agent before team rollout.

When installing the skill into a shared workspace agent, start from `profiles/workspace-capability-profile.template.json` and record only confirmed read capabilities, visible fields, and known limitations. Use `references/capability-profile-maintenance.md` and `templates/shared-agent-installation-note.md` during setup or rollout; do not load them during normal backlog reporting unless capability is uncertain or the user is configuring the shared agent.

## Zendesk capability expectations

Use Zendesk as the default primary source of truth for:

- ticket counts and searches by status, date, group, brand, organisation, assignee, priority, form, tag, text, channel, and custom field where available
- ticket metadata: status, created date, updated date, subject, tags, channel, brand, organisation, custom fields, comment count, group, assignee, and priority
- ticket details or conversations only when a key risk, blocker, duplicate signal, escalation concern, or customer-impact claim needs confirmation
- Help Centre articles when repeated questions or deflection gaps are relevant
- CSAT or satisfaction records only when the report scope includes customer-satisfaction trends and the data is visible

SLA data is optional. If SLA fields or breach data are not visible, report SLA risk as unavailable and use ageing, status, priority, customer impact, and blocker state as fallback risk signals.

Before a report, use `references/capability-preflight.md` when capability is uncertain. If the same capability questions repeat during shared-agent rollout, create or update a portable workspace capability profile rather than relying on personal memory.

## Scope and boundaries

Stay focused on support operations:

- backlog volume, ageing, ownership, blocker, SLA-risk, and queue-health signals
- repeated support themes, likely duplicates, and incident-like patterns
- period-over-period trend changes
- customer-impact and escalation risk visible from support evidence
- concrete next actions for support agents, support leads, or queue owners
- concise internal reporting for support operations

Do not drift into product strategy, engineering planning, roadmap recommendations, or downstream artefact creation by default.

Do not turn every repeated issue into a product recommendation. A repeated issue may need a macro, routing change, Help Centre clarification, agent follow-up, duplicate cleanup, incident review, or further evidence.

## Neighbouring Zendesk workflow boundaries

Use the closest Zendesk workflow for the actual job:

- `zendesk-backlog-trend-analysis`: queue-level health, ageing, SLA risk, support trends, volume, repeated themes, weekday digests, weekly reports, and period-over-period comparisons.
- `zendesk-duplicate-pattern-review`: duplicate, related-ticket, repeated-pain, or incident-pattern classification across specific tickets or clusters.
- `zendesk-evidence-collector`: minimum reliable evidence collection for specific ticket IDs, ticket URLs, pasted customer threads, or a single case before triage, reply drafting, escalation, knowledge review, or handoff.
- `zendesk-customer-research`: one customer/account context, support health, recent activity, open risks, prior commitments, or pre-reply account brief.
- `zendesk-evidence-quality-review`: QA a drafted backlog report, investigation summary, customer reply, or trend report after drafting.
- `zendesk-triage-router`: lightweight support routing, severity, priority, owner/team, queue/status guidance, and next workflow selection for individual or messy support inputs.

Use `references/report-intent-router.md` when a request is vague, mixed, or could match several report types. Use `references/follow-on-routing-guide.md` when the user asks for a downstream deliverable after the backlog or trend report.

Complete the backlog or trend report first unless the user explicitly asks to switch tasks.

## Evidence rules

Separate evidence into three classes:

- **Confirmed reported evidence:** counts, statuses, ticket IDs or examples, visible dates, queues, groups, owners, customer reports, tags, fields, documented blockers, and directly observed ticket content.
- **Informed interpretations:** likely themes, likely causes, operational risk, probable duplicates, escalation judgement, and recommended support actions.
- **Missing or incomplete evidence:** unavailable fields, incomplete samples, unclear ownership, absent SLA data, missing customer impact, unavailable comparison data, or unsupported trend claims.

If evidence is incomplete, state what the analysis is based on, what was not visible or not checked, and the highest-value missing evidence that would improve confidence.

Never invent numbers, trends, ticket examples, SLA status, owners, blockers, customer impact, or causes.

Use `references/evidence-classification-guide.md` when the distinction between observed evidence and interpretation is unclear. Use `references/privacy-redaction-guide.md` when preparing reports for broader internal sharing or when ticket examples include sensitive customer detail.

## Tool behaviour

Prefer read-only Zendesk actions. Counting tickets, searching tickets, reading ticket details, reading conversations, checking Help Centre content, and retrieving satisfaction data are appropriate.

Do not update tickets, add notes, change tags, change status, assign tickets, or update Help Centre content unless the user explicitly asks for that write action after the report.

For report generation:

1. Start with counts for scale.
2. Search or filter tickets to verify ageing, ownership, status, blockers, and themes.
3. Read representative ticket details or conversations only when needed to support a key claim or action.
4. Avoid full conversation reads when ticket summaries are sufficient.

Use `references/zendesk-query-recipes.md` for connector-neutral search patterns.

## Defaults

Apply these defaults only when the user does not specify a scope:

- Trend analysis: last 7 days compared with the immediately preceding 7 days.
- Weekly support report: last 7 days unless a named calendar week is requested.
- Backlog health: current open-ticket backlog.
- Daily or weekday digest: most recent relevant operational window implied by the request.
- Repeated-theme review: stated timeframe; otherwise last 7 days.
- Queue health without another scope: current open Zendesk tickets.

State the applied defaults in the report. If the user implies a product, brand, customer, organisation, group, assignee, status, priority, tag, form, channel, or ticket subset, use that scope and state it.

## Core workflow

1. Identify the reporting request, timeframe, and scope.
   - Classify it as backlog health, weekly report, trend comparison, repeated-theme review, daily digest, queue-risk check, or mixed operational report.
   - Capture filters such as brand, group, organisation, product area, priority, status, assignee, tag, form, or channel.

2. Define the backlog slice or comparison window.
   - For backlog health, define the open-ticket slice.
   - For trend comparison, define current and comparison periods.
   - For weekly reports, define whether the report covers open, created, solved, reopened, or updated tickets.
   - State any default window or default scope used.

3. Gather the minimum Zendesk evidence needed.
   - Use ticket counts for scale.
   - Use ticket search results for status, age, ownership, queue, brand, organisation, tags, and theme signals.
   - Read ticket details only when needed for key risk, blocker, theme, or escalation-sensitive claims.

4. Identify the most important signals.
   - Volume and status mix.
   - Created, solved, reopened, or updated volume when relevant.
   - Ageing and stale tickets.
   - SLA-risk or breached tickets when visible.
   - Ownership gaps, unassigned work, overloaded queues, or unclear routing.
   - Blocker states, waiting states, pending customer states, and internal dependency states.
   - Repeated themes, likely duplicates, known-issue signals, or incident-like clusters.
   - High-risk customers, organisations, brands, queues, or ticket groups.
   - Meaningful changes versus the comparison window.

5. Distinguish observed patterns from interpretations.
   - Treat repeated wording, matching tags, same error messages, same affected workflow, same product area, or same workaround as observed pattern evidence.
   - Treat likely root cause, incident linkage, staffing risk, or downstream ownership as interpretation unless directly documented.
   - Use cautious wording when confidence is partial.

6. Assess operational risk and prioritise what matters now.
   - Prioritise high customer impact, ageing or SLA risk, unclear ownership, repeated reports, unresolved blockers, escalation sensitivity, and queue concentration.
   - Use `references/risk-labelling-guide.md` when risk labels need calibration.

7. Produce a concise report with next actions first.
   - Put the most actionable items before deeper analysis or caveats.
   - Use clean Markdown.
   - Keep it copy-paste-ready for Slack, docs, Zendesk internal notes, or internal support updates.
   - Omit empty sections and unresolved placeholders.

## Output contract

Return clean Markdown with a stable structure suited to the request type. Use tables only when they improve scanning.

For digest-style outputs, prefer this order unless the user asks otherwise:

1. Overall backlog picture in 1 to 3 bullets.
2. Highest-priority tickets or risks that need attention.
3. 3 to 5 concrete actions in priority order.
4. Ageing or SLA-risk tickets.
5. Blocked cases or waiting states.
6. Repeat themes, likely duplicates, or incident signals.
7. Escalation-ready or high-risk cases.
8. Evidence basis and gaps.

Use `references/report-qa-checklist.md` before finalising complex or stakeholder-facing reports. Use the matching template only when it helps consistency:

- `templates/backlog-health-summary.md`
- `templates/weekly-support-report.md`
- `templates/trend-comparison.md`
- `templates/daily-digest.md`
- `templates/repeated-theme-review.md`
- `templates/evidence-basis.md`

Do not load templates that are irrelevant to the requested report type.

## Recommended action guidance

Recommended actions must be concrete and support-owned by default.

Good action types include:

- reassign or route an unowned ticket
- chase a pending internal blocker
- update a ticket with the next clear customer-facing step
- prioritise ageing tickets with SLA or escalation risk
- link, merge, or tag likely duplicates inside Zendesk
- create or refine a macro for a repeated response
- review or update Help Centre content when repeated customer confusion is confirmed
- create an internal note for a support pattern that is not ready for public documentation
- escalate a specific case only when evidence supports escalation
- request one missing field or detail that would unlock resolution

Avoid vague actions such as "monitor this", "align stakeholders", or "improve process" unless paired with a concrete support-owned action.

## Pattern and trend detection rules

Treat a pattern as stronger when multiple signals align:

- same customer-reported symptom
- same affected workflow
- same product, feature, integration, or environment
- same error text or failure mode
- same workaround
- same queue, brand, organisation, form, tag, or custom field
- repeated tickets in a short window
- repeated reopen reason or blocked state

Classify patterns carefully:

- **Likely duplicate:** multiple tickets appear to describe the same underlying issue and should be linked, merged, or handled together in Zendesk.
- **Related but distinct:** tickets share a theme but have different causes, customers, or workflows.
- **Repeated support pain:** recurring confusion, setup issue, or operational friction that may need a macro, article update, routing improvement, or support process change.
- **Possible incident signal:** a time-bounded cluster with similar symptoms, rising volume, or shared system dependency. Mark as possible unless incident evidence is confirmed.
- **Inconclusive:** not enough evidence to classify.

Do not claim a root cause or incident unless supported by confirmed evidence.

## Quality bar

The report must be safe to reuse across support agents.

- No unresolved placeholders.
- No invented counts, trends, ticket examples, causes, owners, or SLA status.
- No fake certainty.
- No hidden assumptions that only work in one agent environment.
- No dependence on unavailable connectors or local helper files.
- No references to connector setup documents unless the environment explicitly guarantees them and the user asks for setup help.
- No product, engineering, project-management, or roadmap recommendations unless support evidence clearly justifies them.
- No automatic handoff to GitHub, Linear, Asana, Slack, Gmail, or Google Drive.
- No long generic commentary when concrete support action is available.
- Omit empty sections.
- Keep Markdown clean and copy-paste-ready.

## Bundled examples and smoke prompts

Use `examples/prompt-cookbook.md`, `examples/smoke-test-results-template.md`, and `evaluations/report-scenarios.json` when testing the skill in a shared agent or demonstrating expected prompt patterns. Use the good-output examples to calibrate structure and the anti-pattern examples to avoid unsupported claims, product drift, or personal-view assumptions. Do not load examples or evaluation scenarios during normal reporting unless the current task is QA, training, rollout, or skill maintenance.

## Memory policy

Do not rely on personal user memory. For shared agents, only stable workspace-level defaults should be remembered, and only when explicitly approved. See `references/memory-policy.md`.

## Included validation aids

Use optional scripts only for local QA of the packaged skill assets. They are not runtime dependencies for support reporting.

- `scripts/validate_fixture_schema.py`: validate bundled JSON fixtures against the lightweight ticket-summary expectations.
- `scripts/check_report_structure.py`: check a drafted Markdown report for core headings and unresolved placeholders.
- `scripts/validate_report_scenarios.py`: validate synthetic shared-agent smoke-test scenarios in `evaluations/report-scenarios.json`.
- `scripts/lint_portability.py`: check packaged skill files for shared-agent portability risks such as personal assumptions, local paths, uploaded-file IDs, or hardcoded private setup.
- `scripts/run_all_checks.py`: run fixture validation, scenario validation, portability linting, and structure checks for the bundled good-output examples.
- `scripts/validate_capability_profile.py`: validate portable shared-agent Zendesk capability profiles.
- `profiles/workspace-capability-profile.template.json`: portable starter profile for shared-agent Zendesk capability documentation. Copy it per shared agent and validate the completed profile with `scripts/validate_capability_profile.py`.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

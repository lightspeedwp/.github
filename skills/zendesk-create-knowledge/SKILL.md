---
name: zendesk-create-knowledge
description: draft zendesk help-centre or support knowledge articles from resolved cases, repeated questions, stable workarounds, known issues, or reusable customer answers. use when a support resolution is ready to become self-service documentation, an article update, faq entry, troubleshooting guide, or internal knowledge draft. route to zendesk-knowledge-candidate-review first when documentation worthiness, stability, audience, or public-vs-internal boundary is unclear.
---

# Zendesk Create Knowledge

Use this skill to draft Zendesk help-centre, support knowledge, FAQ, troubleshooting, known-issue, or internal knowledge articles once documentation-worthiness is already clear.

## Skill Boundary

- `zendesk-knowledge-candidate-review` decides whether documentation should exist, whether it should be public or internal, and whether the source evidence is stable enough.
- `zendesk-create-knowledge` drafts the article only after documentation-worthiness, audience, visibility, and stability are clear.
- `zendesk-evidence-collector` gathers missing Zendesk ticket evidence when the source thread, case history, or resolution evidence is incomplete.
- `zendesk-case-readiness-check` checks whether the source case is ready to support documentation when the resolution, workaround, product status, or affected audience may be uncertain.
- `zendesk-evidence-quality-review` QA-checks the drafted article before it is shared, published, or handed off.
- `zendesk-create-knowledge` should not be used for a customer reply. Route customer replies to `zendesk-draft-response`.
- `zendesk-create-knowledge` should not be used for backlog, queue, SLA, ageing, volume, theme, or trend reporting. Route those requests to `zendesk-backlog-trend-analysis`.
- `zendesk-create-knowledge` should not be used for duplicate, related-case, repeated-pain, or incident-pattern classification. Route those requests to `zendesk-duplicate-pattern-review`.
- `zendesk-create-knowledge` should not be used for broad Zendesk intake, escalation, or workflow selection. Return unclear Zendesk-first intake to `zendesk-router-skill`.

## What This Skill Does

- turns a resolved support case, repeated question, stable workaround, or known issue into a structured knowledge draft
- decides whether the output should update an existing article or become a new article draft
- selects the right format: how-to, troubleshooting, FAQ, known issue, or internal note
- keeps public wording separate from internal-only support context
- optimises titles and opening language for customer search terms
- drafts only by default; do not publish, update Zendesk tickets, or update Help Centre articles unless the user explicitly asks and the required approval path is clear

## Router Relationship

`zendesk-router-skill` owns the wider Zendesk skill network. This skill should not become a second router. Keep routing guidance limited to direct knowledge-drafting handoffs and explicit route-away boundaries. Return unclear or broader Zendesk workflow decisions to `zendesk-router-skill`.

## Interoperability Note

Clear article, FAQ, troubleshooting, known-issue, article update, or internal-knowledge drafting requests may invoke `zendesk-create-knowledge` directly when documentation-worthiness, audience, visibility, and stability are already clear.

Unclear documentation-worthiness requests should use `zendesk-knowledge-candidate-review` before this skill drafts anything.

Unclear Zendesk-first intake should return to `zendesk-router-skill` rather than making this specialist skill choose across the wider Zendesk skill network.

Do not add Linear, GitHub, Asana, product, or project routing unless the user explicitly requests a downstream artefact after the knowledge draft is complete.

## Workflow

1. Confirm the documentation basis.
   - What customer problem, question, symptom, or workaround is being documented?
   - What ticket, Zendesk thread, investigation, or support note proves the resolution?
   - Is the requested deliverable an article draft rather than a customer reply?
2. Check whether documentation-worthiness is already clear.
   - If value, audience, stability, recurrence, public visibility, or internal-only boundaries are unclear, route to `zendesk-knowledge-candidate-review` before drafting.
3. Check evidence readiness.
   - If the thread lacks reliable Zendesk evidence, route to `zendesk-evidence-collector`.
   - If the source case may not be ready for documentation, route to `zendesk-case-readiness-check`.
   - If customer/account context affects article scope, terminology, or audience, route to `zendesk-customer-research` before drafting.
4. Check overlap.
   - Compare against existing help-centre content, internal support notes, pasted article text, or linked sources.
   - Prefer updating an existing article when the customer intent and search terms already match.
5. Choose the article type.
   - How-to
   - Troubleshooting
   - FAQ
   - Known issue
   - Internal note
6. Draft the article.
   - Use customer language, not internal jargon.
   - Keep public articles free of sensitive account details, private ticket history, internal blame, and unverified root-cause claims.
   - Keep the first sentence plain and searchable.
   - Make workaround, limitation, or known-issue status obvious near the top.
7. Add publishing notes.
   - Source of truth
   - Existing articles to update
   - Public versus internal boundary
   - Reviewer needed
   - Suggested review date
8. Recommend QA when needed.
   - Route to `zendesk-evidence-quality-review` when the draft has sensitive claims, unresolved status, legal/privacy exposure, product limitation language, or weak evidence.

## Source Review

Before drafting, confirm:

- what the customer problem or question actually was
- whether the resolution is a fix, workaround, explanation, limitation, or known issue
- which audience the article serves
- whether the source material is stable enough to document
- whether the issue is recurring, high-impact, or strategically important enough to justify reusable documentation
- what should remain internal-only
- what claims are supported by confirmed Zendesk evidence or approved source material

If the answer depends on a temporary workaround or an unresolved problem, make that status obvious near the top of the article.

## Reference Loading

Load supporting references only when they are relevant to the current task.

- Read `references/shared-agent-runtime-rules.md` when the skill is used inside a shared workspace agent, connector access may differ by user, source evidence is unavailable, or the draft depends on private support context.
- Read `references/article-templates.md` after selecting the article type and before drafting the article body.
- Read `references/public-internal-boundary.md` when deciding whether content is safe for public help-centre publication, internal support knowledge, or `Needs decision`.
- Read `references/evidence-confidence-rubric.md` before assigning evidence confidence in Publishing Notes, especially when the draft is medium or low confidence.
- Read `references/knowledge-draft.schema.json` when the user needs a JSON-compatible draft, schema-aligned QA, export-ready structure, or automation-friendly output.
- Read `references/examples.md` when the user asks for examples, the agent needs output calibration, the source material is messy, or the article type and structure need a concrete pattern.
- Read `references/routing-boundaries.md` before recommending a handoff, when the request may have moved outside create-knowledge scope, or when deciding whether to return to `zendesk-router-skill`.
- Use `scripts/validate_knowledge_draft.py` only when the draft has been produced as JSON, when the user asks for validation, or when a structured export needs deterministic field checks. Do not run it for normal markdown-only article drafts.

## Article Type Selection

Choose the best type based on the job the article needs to do.

- `How-to`
  - teach a customer how to complete a task or configuration
- `Troubleshooting`
  - help a customer diagnose and fix a symptom or error
- `FAQ`
  - answer a short, repeated question directly
- `Known issue`
  - explain a current product problem, what is known, who is affected, and the best available workaround or status
- `Internal note`
  - preserve support-only context, edge cases, escalation rules, or diagnostic guidance that should not be published publicly

If the source material mixes too many jobs, prefer one focused article over a single overloaded page.

## Output Shape

```md
## Knowledge Draft

**Title:** <title>
**Type:** <How-to | Troubleshooting | FAQ | Known issue | Internal note>
**Category:** <topic area>
**Audience:** <who this is for>
**Visibility:** <Public help centre | Internal support knowledge | Needs decision>
**Tags:** <searchable tags>

---

<article body>

---

### Publishing Notes
- Source: <Zendesk ticket, investigation, support note, or discussion>
- Existing articles to update: <if any>
- Public/internal boundary: <what is safe to publish vs support-only>
- Evidence confidence: <high | medium | low, with reason>
- Review needed from: <if any>
- Suggested review date: <date or reason>
- Recommended next route: <if QA, readiness, evidence collection, or candidate review is still needed>
```

When the user asks for structured JSON, export-ready output, schema-aligned QA, or automation-friendly output, map the same required fields to `references/knowledge-draft.schema.json` without adding unsupported fields or dropping Publishing Notes. Do not imply that JSON export updates Zendesk tickets, Help Centre articles, or any external system.

## Optional Validation Script

Use `scripts/validate_knowledge_draft.py` for deterministic validation only when the output is a JSON knowledge draft or when the user explicitly asks for structured validation.

The script is local-only and dependency-free. It checks required fields, controlled values, Publishing Notes completeness, article-type-specific signals, evidence confidence routing, and simple public/internal risk indicators. It does not verify Zendesk evidence, article accuracy, customer impact, or source freshness.

Usage:

```bash
python scripts/validate_knowledge_draft.py path/to/draft.json --pretty
```

If the script reports warnings, use judgement and the relevant reference files before deciding whether a draft is ready. If it reports errors, fix the structure before returning a schema-compatible draft.

## Searchability and Findability

Write so the right customer can find the article without insider vocabulary.

Use these title rules:

- match the symptom, task, or question a customer would actually search
- include exact error wording when that is the strongest search term
- prefer concrete product terms over generic labels
- avoid vague titles like `integration issue`, `account help`, or `problem with setup`

Use these opening rules:

- first sentence should restate the problem or task plainly
- second sentence should say what the article will help the customer do
- if the issue is currently unresolved, say that early
- if the article is internal-only, label it clearly before the body

## Structure Standards

Most articles should be easy to skim.

Use:

- short sections with descriptive headings
- numbered steps for sequential actions
- bullets for options, symptoms, or prerequisites
- exact field names, button names, or error text where useful
- one section for limits, caveats, escalation, or when to contact support

Avoid:

- long narrative paragraphs
- unsupported product promises or timelines
- internal debugging context that does not help the intended audience
- private customer/account details in public articles
- mixing setup instructions with known-issue status unless both are required

## Type-Specific Patterns

For `How-to` articles, include:

- who this is for
- prerequisites
- numbered steps
- how to verify success
- what to do if one of the steps fails

For `Troubleshooting` articles, include:

- symptoms
- likely causes or decision points, only when supported by evidence
- most likely fixes first
- a clear fallback when the self-serve steps do not resolve the issue

For `FAQ` articles, include:

- the customer's question in plain language
- a direct answer immediately
- a short explanation or exception list only if needed

For `Known issue` articles, include:

- current status
- who is affected
- current workaround or mitigation
- what support needs from the customer if there is no workaround
- review cadence or trigger for updating the article

For `Internal note` articles, include:

- when support should use the note
- confirmed symptoms or conditions
- diagnostic steps
- escalation triggers
- safe customer-facing wording to reuse, if available

## Update vs Create

Update an existing article when:

- the topic already exists and only needs a better workaround or fresher steps
- the article is mostly right but stale or missing a key detail
- the customer intent and search terms still match the existing page
- the issue is better handled as an added caveat, troubleshooting branch, or FAQ entry

Create a new article when:

- no useful article exists for the topic
- the current article is trying to cover too many different issues
- a different audience needs a clearer standalone entry point
- a known issue or limitation needs a distinct status page or support reference
- the new problem would be hard to discover if buried inside another page

## Quality Checks Before Returning

- the title is discoverable and specific
- the article type matches the customer or support job
- the visibility boundary is explicit
- public drafts have been checked against `references/public-internal-boundary.md` when sensitive, internal, or private support context may appear
- schema-compatible outputs follow `references/knowledge-draft.schema.json` and keep Publishing Notes complete
- JSON knowledge drafts pass `scripts/validate_knowledge_draft.py` when deterministic validation is requested or needed for export
- examples are used only for structure and calibration, not as source evidence
- handoff recommendations follow `references/routing-boundaries.md` and do not turn this specialist skill into a second Zendesk router
- the body is self-serve friendly and does not depend on internal context unless it is an internal note
- the status of fixes versus workarounds is explicit
- claims are grounded in confirmed evidence
- unsupported promises, timelines, and root-cause claims are removed
- publishing notes identify overlap, source material, confidence, and any needed reviewer
- the output does not imply publishing, ticket updates, or Help Centre updates unless the user explicitly asked and the approval path is clear
- route-away wording uses canonical `zendesk-` skill names and does not introduce Linear, GitHub, Asana, product, or project routing unless explicitly requested after the knowledge draft is complete

## Handoff Guidance

After drafting the article, recommend only the next action that is directly useful for the knowledge draft.

Do not act as the wider Zendesk router. Read `references/routing-boundaries.md` when the handoff is not obvious, then either choose one direct handoff below, apply one explicit route-away boundary, or return to `zendesk-router-skill`.

Direct handoffs this skill may recommend:

- `zendesk-evidence-quality-review`
  - when the draft needs evidence, claims, tone, boundary, or delivery QA before sharing
- `zendesk-draft-response`
  - when the user also needs a customer-facing reply that points to or reuses the article content
- `zendesk-customer-research`
  - when customer/account context changes the article audience, terminology, risk, or support posture
- `zendesk-evidence-collector`
  - when source evidence is missing, unclear, or not anchored in Zendesk
- `zendesk-case-readiness-check`
  - when the source case may not be stable enough for documentation
- `zendesk-knowledge-candidate-review`
  - when it is still unclear whether the documentation should exist, where it should live, or whether it should be public or internal

Explicit route-away boundaries:

- `zendesk-backlog-trend-analysis` — for backlog, queue, SLA, ageing, volume, theme, or trend reporting.
- `zendesk-duplicate-pattern-review` — for duplicate, related-case, repeated-pain, or incident-pattern classification.

Return to `zendesk-router-skill` when the request needs broad Zendesk workflow selection, escalation routing, unclear Zendesk-first intake, mixed outcomes, or any next step outside these direct knowledge-drafting handoffs and explicit route-away boundaries.

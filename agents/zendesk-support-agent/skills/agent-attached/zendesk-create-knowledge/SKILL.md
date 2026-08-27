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

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

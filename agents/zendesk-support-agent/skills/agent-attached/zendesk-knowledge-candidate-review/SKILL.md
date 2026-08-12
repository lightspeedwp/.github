---
name: zendesk-knowledge-candidate-review
description: zendesk-first documentation-worthiness review for lightspeed support cases. use when a zendesk ticket, resolved case, repeated issue, workaround, known issue, help centre gap, support pattern, or reused customer answer may deserve reusable documentation. decides whether to create a new article, update an existing article, keep as internal-only knowledge, or wait because evidence is unstable. checks zendesk evidence and help centre overlap first, separates public documentation from internal support memory, works safely in shared workspace agents with varying connector access, and routes to zendesk-create-knowledge only when documentation-worthiness is clear and ready to draft.
---

# Zendesk Knowledge Candidate Review

## What this skill does

Use this skill to decide whether a Zendesk-centred case or repeated support issue is a good candidate for reusable documentation.

This skill:

- reviews documentation-worthiness;
- checks whether the issue is stable enough to document;
- distinguishes public Help Centre material from internal-only support knowledge;
- recommends the best documentation path;
- prevents unstable, unresolved, sensitive, or account-specific issues from being pushed into public documentation too early.

It recommends one of four documentation paths:

- create a new article;
- update an existing article;
- keep as internal-only knowledge;
- wait because the evidence is still unstable.

This skill decides whether and how to document. It does not write the full article by default.

## When to use this skill

Use this skill when the user needs a documentation decision before drafting or updating knowledge.

Good triggers include:

- a case looks documentation-worthy;
- a workaround is being reused;
- the same question keeps appearing in Zendesk;
- a known issue may need customer-facing documentation;
- the team wants to know whether to create or update documentation;
- a resolved case may contain reusable support guidance;
- repeated customer confusion suggests a Help Centre gap;
- support needs to decide whether guidance should be public, internal-only, or delayed.

## Do not use this skill for

Do not use this skill when the primary deliverable is the documentation itself, a customer reply, a full investigation, a duplicate or incident-pattern decision, a case-readiness review, a broad report, or wider workflow routing.

Use only common adjacent handoffs from this specialist skill. Return to `zendesk-router-skill` when the correct downstream Zendesk workflow is unclear, outside this skill's local handoffs, or depends on broader workspace routing rules.

Common direct handoffs are limited to:

- `zendesk-create-knowledge` for ready-to-draft documentation after documentation-worthiness is clear;
- `zendesk-evidence-collector` when the source case lacks reliable Zendesk evidence or needs investigation, proof, timeline, cause, workaround, or resolution context first;
- `zendesk-case-readiness-check` when resolution, workaround, public/internal boundary, stability, audience, or evidence sufficiency is uncertain;
- `zendesk-duplicate-pattern-review` when duplicate or pattern classification would change the documentation decision;
- `zendesk-draft-response` when the immediate deliverable is customer-facing wording.

Do not route to Linear, GitHub, Asana, product planning, project planning, or roadmap workflows by default. Return to `zendesk-router-skill` when a non-Zendesk or broader cross-functional path might be needed.

## Default frame

Use this default frame for every documentation-worthiness review:

- documentation must be stable enough to reuse;
- public documentation needs higher stability than internal support notes;
- resolved issues and clear workarounds are stronger candidates than active unknowns;
- customer-facing known issue documentation needs careful wording and confirmed boundaries;
- reusable support value matters, but not every difficult case deserves a public article.

The default goal is a documentation decision record, not a full article. Public Help Centre content should reduce support load without overstating certainty, leaking sensitive details, or duplicating existing articles.

## Shared workspace agent rule

This skill may run inside a shared workspace agent. Do not assume the logged-in user, personal Memory, personal connector permissions, private saved searches, or user-specific Zendesk views. Use available workspace connectors and user-supplied evidence. If a connector is unavailable or permission-limited, continue from supplied evidence, state the limitation, and name the smallest missing Zendesk or Help Centre check needed to improve confidence.

When the request involves a shared agent, connector portability, teammate access, or workspace distribution, consult [shared-agent-usage.md](references/shared-agent-usage.md) before applying the review.

## Interoperability note

Use this skill directly when documentation-worthiness is already the clear question. Use `zendesk-create-knowledge` directly when the user clearly asks to draft, update, or prepare a Help Centre article, internal note, known issue note, FAQ, or macro guidance and documentation-worthiness is already confirmed. Use `zendesk-router-skill` for unclear Zendesk-first intake, broader workflow selection, or routing across the Zendesk skill network.

This skill decides whether documentation should exist. `zendesk-create-knowledge` drafts the documentation only after the create, update, internal-only, or wait decision is clear enough to proceed.

## Primary source order

Use sources in this order:

1. Zendesk ticket evidence: source ticket, status, resolution, workaround, customer question, exact wording, public replies, internal notes, tags, form, fields, organisation, related tickets, duplicate indicators, solved cases, ticket volume, and support effort.
2. Help Centre article search / existing docs: existing article titles, article body overlap, categories, sections, public known issue pages, internal articles, macros, search terms, stale guidance, missing troubleshooting steps, and findability gaps.
3. User-provided documentation drafts or notes: pasted drafts, internal SOP notes, support snippets, screenshots, article outlines, customer-safe wording, or prior knowledge notes.
4. Secondary systems only when they materially clarify whether documentation already exists or whether the guidance is stable: Slack, Google Drive, Gmail, GitHub, Linear, Asana, BugHerd, product notes, release notes, incident notes, security notes, or repo evidence.

Use secondary systems only when Zendesk and Help Centre evidence are insufficient, when the user explicitly asks for cross-system context, or when stability depends on a specific external source.

If Zendesk or Help Centre search is unavailable, review from supplied evidence and name the smallest missing Zendesk or Help Centre check that would improve confidence.

When the supplied evidence is messy, partial, permission-limited, or likely to produce a disputed recommendation, consult [evidence-checklist.md](references/evidence-checklist.md) to identify the smallest decision-changing evidence gap.

When the create-versus-update decision depends on whether existing public, internal, or macro knowledge already covers the customer intent, consult [help-centre-overlap-guide.md](references/help-centre-overlap-guide.md) before recommending a new article.

When the case is borderline, subjective, or likely to be handled by multiple support agents, consult [examples.md](references/examples.md) to calibrate the recommendation against anonymised decision patterns.

When the main uncertainty is whether this skill still owns the task, consult [routing-boundaries.md](references/routing-boundaries.md). If the next step is not one of this skill's common handoffs, return to `zendesk-router-skill` instead of routing across the wider Zendesk skill network yourself.

## Workflow

Follow this workflow in order:

1. Identify the issue, question, or workaround.
   - Name the reusable customer question, task, error, limitation, workaround, resolved issue, known issue, support process, or repeated confusion.
   - Capture the language customers use, not only internal product terms.

2. Assess stability.
   - Decide whether the answer, workaround, resolution, limitation, or known issue status is confirmed enough to reuse.
   - Separate stable guidance from temporary, speculative, security-sensitive, policy-sensitive, or product-dependent details.

3. Assess repeatability.
   - Check whether the issue appears across multiple tickets, one high-impact ticket, recurring customer questions, repeated agent workarounds, macro reuse, support tags, or visible Help Centre search gaps.
   - Do not require high volume when the issue is high-risk, high-effort, or likely to recur.

4. Check for existing documentation overlap.
   - Search for articles, internal notes, macros, or known issue content that already serve the same user intent.
   - Prefer updating an existing article when it already owns the customer intent.
   - Prefer a new article when the intent is distinct and findability would suffer if buried elsewhere.
   - If overlap is unavailable or permission-limited, mark it as unknown and name the smallest missing Help Centre or internal-knowledge search.

5. Decide the documentation path.
   - Choose exactly one primary recommendation: create new article, update existing article, keep as internal-only knowledge, or wait because unstable.
   - Mark public versus internal target clearly.

6. Explain why.
   - Ground the decision in stability, repeatability, Help Centre overlap, audience, risk, and next route.
   - Keep the explanation short and operational.

## Decision rules

### Create a new article

Recommend `create new article` when:

- the issue, question, task, workaround, or limitation is stable enough for reuse;
- no existing article covers the same customer intent well;
- the topic is findable as a distinct customer question or search phrase;
- the answer can be safely explained to the intended audience;
- publishing would reduce repeated tickets, repeated agent effort, onboarding friction, or customer confusion.

Use this for repeated clear questions, confirmed how-to guidance, stable troubleshooting paths, recurring setup tasks, safe known limitations, or confirmed workarounds that customers can apply themselves.

### Update an existing article

Recommend `update existing article` when:

- an existing article already serves the same customer intent;
- the existing article is stale, incomplete, ambiguous, missing exact error wording, missing a workaround, missing prerequisites, or missing a caveat;
- adding a section, troubleshooting note, FAQ, warning, or link would solve the documentation gap without creating duplicate Help Centre content;
- the issue is stable enough to document publicly or internally.

Existing overlapping documentation should normally be updated instead of creating a new article.

### Keep as internal-only knowledge

Recommend `internal-only` when:

- support needs repeatable handling guidance but the content is not safe or useful for customers;
- the guidance depends on internal tooling, account-specific checks, operational processes, private diagnostics, security-sensitive details, unpublished behaviour, commercial policy, or staff-only judgement;
- the issue is rare but operationally important for agents;
- customer-facing wording must remain tailored, but agents need a reusable note or macro guidance.

Internal-only knowledge can be useful even when public documentation is not appropriate.

### Wait because evidence is unstable

Recommend `wait` when:

- the issue is unresolved or actively changing;
- root cause, fix, workaround, or expected behaviour is not confirmed enough for reusable guidance;
- product behaviour may change soon;
- the issue may be an active incident where guidance could become stale quickly;
- legal, security, privacy, commercial, product, or support leadership review is needed before publication;
- publishing would imply certainty that support does not yet have.

Unresolved unstable issues should be marked `wait` or `internal-only`, not public documentation.

## Documentation-specific rules

- Repeated clear question -> likely Help Centre candidate.
- Repeated workaround -> likely Help Centre or internal candidate depending on stability and customer safety.
- Existing overlapping doc -> update instead of create.
- Customer-facing known issue documentation requires especially careful stability wording.
- Public documentation requires a confirmed answer, safe boundaries, and customer-suitable wording.
- Internal support memory may tolerate more caveats than public documentation, but must still distinguish confirmed facts from assumptions.
- Do not create duplicate articles for the same search intent.
- Do not treat product priority as documentation-worthiness; a low-priority product issue may still need a useful support article, and a high-priority product issue may still be too unstable to document publicly.

## Output format

Use this structure by default:

```markdown id="knowledge-candidate-review-default"
## Knowledge candidate review

- Recommendation: `[create new article | update existing article | internal-only | wait]`
- Readiness level: `[ready to draft | needs one more check | not ready]`
- Target: `[public Help Centre | internal support note | internal troubleshooting guide | macro guidance | known issue note | no documentation yet]`

## Why it is or is not documentation-worthy

[1-3 concrete sentences covering stability, repeatability, audience, and Help Centre overlap.]

## Evidence used

- [Zendesk ticket evidence, repeated question, workaround, existing doc overlap, or supplied notes]
- [Evidence point]

## Documentation path

- Create new: `[yes | no]` - [reason]
- Update existing: `[yes | no | unknown]` - [article or overlap if known]
- Keep internal: `[yes | no]` - [reason]
- Wait: `[yes | no]` - [reason]

## Next step

[Recommended next workflow or action.]
```

For low-confidence reviews, add:

```markdown id="knowledge-candidate-review-missing"
## Smallest missing evidence

[The one Zendesk, Help Centre, or stability check needed before deciding or drafting.]
```

For customer-facing known issue candidates, add:

```markdown id="knowledge-candidate-review-known-issue"
## Public wording caution

[What must be caveated, avoided, or reviewed before customer-facing publication.]
```

## Handoff rules

Keep handoff guidance local. `zendesk-router-skill` owns the full Zendesk skill network; this specialist skill should know only its own boundaries, common adjacent handoffs, and when to return to the router. Consult [routing-boundaries.md](references/routing-boundaries.md) when ownership is unclear.

Use these common handoffs after the documentation decision:

- Route to `zendesk-create-knowledge` when the recommendation is create new article, update existing article, or internal-only, the readiness level is ready to draft, documentation-worthiness is clear, and the remaining task is writing reusable knowledge.
- Route to `zendesk-evidence-collector` when the source case lacks reliable Zendesk evidence or the decision is blocked by missing ticket evidence, related-case evidence, timeline, proof, confirmed workaround, cause, or resolution context.
- Route to `zendesk-case-readiness-check` when resolution, workaround, public/internal boundary, stability, audience, evidence sufficiency, or the smallest missing evidence is uncertain before a knowledge draft, reply, escalation, or handoff.
- Route to `zendesk-duplicate-pattern-review` when duplicate status, repeated-pain classification, or possible incident-like pattern would change whether to document, wait, or escalate.
- Route to `zendesk-draft-response` only when the immediate deliverable is customer-facing wording rather than a reusable documentation decision.
- Route to `zendesk-router-skill` when the next step is outside these common handoffs, the user asks for broader workflow routing, the safest downstream Zendesk skill is uncertain, or a case may need `zendesk-customer-escalation`, `zendesk-backlog-trend-analysis`, `zendesk-triage-router`, or other non-local routing.

Do not route to Linear, GitHub, Asana, product planning, project planning, or roadmap workflows by default. If a non-Zendesk artefact appears necessary but was not explicitly requested, return to `zendesk-router-skill` with the reason instead of routing there directly.

## Quality bar / guardrails

A good knowledge-candidate review is:

- Zendesk-first;
- grounded in ticket evidence and Help Centre overlap;
- clear about stability;
- clear about public versus internal audience;
- decisive about create, update, internal-only, or wait;
- explicit about the next route.

Avoid:

- pushing unstable issues into documentation too early;
- missing good reusable patterns because they are not product roadmap items;
- duplicating existing Help Centre content;
- treating every resolved ticket as article-worthy;
- publishing internal processes, sensitive details, or account-specific workarounds publicly;
- writing the full article when the task is only documentation-worthiness review;
- using broad reporting when a small Help Centre overlap check would answer the question;
- routing to product planning because a documentation gap mentions product behaviour.

## Practical examples

Owned by this skill:

- "We solved this same setup question three times. Should we document it?"
- "Is this workaround stable enough for a Help Centre article?"
- "Should this known issue be public, internal-only, or wait?"
- "There is already an article, but customers still ask this. Create a new article or update the existing one?"

Routed away by this skill:

- "Write the article for this confirmed workaround" -> `zendesk-create-knowledge` when ready to draft.
- "Find the root cause before we document this" -> return to `zendesk-router-skill` unless the required evidence-collection handoff is clearly `zendesk-evidence-collector`.
- "Reply to the customer with the workaround" -> `zendesk-draft-response`.
- "Classify this ticket" -> return to `zendesk-router-skill`; clear ticket triage belongs to `zendesk-triage-router`, but this specialist should not route beyond local handoffs.
- "Are these repeated tickets duplicates or a wider pattern?" -> `zendesk-duplicate-pattern-review` when that classification would change the documentation decision.
- "How many tickets mentioned this over the last quarter?" -> return to `zendesk-router-skill`; clear backlog or trend reporting belongs to `zendesk-backlog-trend-analysis`, but this specialist should not route beyond local handoffs.
- "Turn this into a Linear roadmap item" -> return to `zendesk-router-skill` or follow the user's explicit non-Zendesk request; do not route there by default.

## Non-Zendesk boundary note

Do not convert a documentation gap into product, roadmap, Linear, GitHub, Asana, or project-management work inside this skill. If that path may be needed and was not explicitly requested, return to `zendesk-router-skill` with a short reason.

## Recommended parent-agent routing note

For Zendesk-centred cases, repeated questions, reused workarounds, known issues, or Help Centre gaps, use `zendesk-knowledge-candidate-review` before drafting documentation when suitability is uncertain. The skill should decide whether to create a new article, update an existing article, keep the guidance internal-only, or wait because evidence is unstable. Route directly only to the common adjacent handoffs named in this skill. Return to `zendesk-router-skill` for broader Zendesk workflow selection or uncertain routing. Do not route to Linear or product planning by default.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

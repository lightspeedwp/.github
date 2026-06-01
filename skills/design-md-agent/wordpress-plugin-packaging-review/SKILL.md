---
name: wordpress-plugin-packaging-review
description: perform evidence-led WordPress plugin packaging reviews for agency, MSP, ecommerce, ai, chatbot, automation, and commercial delivery use cases. use when the user asks to assess a plugin for packaging, due diligence, tiering, upsells, delivery risk, governance, or client offer fit using repo evidence, wordpress.org, vendor docs, pricing pages, and operational constraints.
---

# WordPress Plugin Packaging Review

## Purpose

Assess whether a WordPress plugin is commercially suitable for a package, managed service, retainer, or internal delivery playbook.

Prioritise what is real, supportable, governable, and commercially usable over generic feature summaries.

## When to use

Use this skill when the user wants to:

- review a WordPress plugin before recommending it to clients;
- decide what belongs in a standard package, advanced tier, add-on, or discovery phase;
- separate code-confirmed capability from docs, pricing claims, or marketing;
- assess AI, chatbot, automation, ecommerce, or agency-service plugin risk;
- turn plugin research into delivery guidance, governance notes, and package decisions.

Do not use this skill for:

- general WordPress explanations;
- plugin implementation or debugging without a packaging decision;
- legal, financial, or security sign-off beyond evidence-based review guidance.

## Inputs

Start with the strongest available artefacts in this order:

1. User brief, package model, target questions, or service context.
2. Uploaded reports, prior audits, or internal recommendations.
3. Official plugin repository and `readme.txt` / `README`.
4. WordPress.org listing.
5. Vendor product, pricing, and add-on pages.
6. Official documentation.
7. Public issue trackers, tutorials, and dependency documentation.

If the user has not provided business context, infer a conservative agency packaging context and state that assumption briefly.

## Decision Flow

1. Identify the plugin, vendor, public version, and review goal.
2. Determine whether the task is packaging due diligence, implementation due diligence, competitor comparison, or launch-readiness review.
3. Build a source map and note which surfaces are code-backed, doc-backed, commercially claimed, or inferred.
4. Inspect the codebase before trusting marketing claims.
5. Classify meaningful capabilities by delivery relevance and support burden.
6. Identify governance, privacy, hosting, and dependency risks.
7. Convert findings into package recommendations with prerequisites and exclusions.
8. Escalate when the most important capability appears to live in private code or where approval gates are required.

## Workflow

1. Frame the review.
   - Identify plugin, vendor, target package decision, audience, and critical use cases.
   - State the assumptions that could materially change the recommendation.
2. Build the source map.
   - Review WordPress.org, repo, vendor pages, official docs, tutorials, and dependency docs.
   - Track duplicates instead of counting them twice.
3. Inspect the codebase first.
   - Review repo structure, bootstrap file, readmes, key modules, REST/AJAX surfaces, hooks, blocks, admin UI, storage, integrations, and extension points.
4. Separate evidence classes.
   - Label findings as `Code-confirmed`, `Docs-confirmed`, `Commercially claimed`, `Tutorial-backed`, or `Inference`.
5. Judge delivery relevance.
   - Evaluate user value, relevance, complexity, support burden, dependency risk, governance risk, and content readiness.
6. Assess operational and governance reality.
   - Check hosting, auth, caching, APIs, privacy, moderation, rollout, rollback, and approval needs.
7. Turn research into packaging guidance.
   - Classify features as `Standard package`, `Advanced package`, `Optional add-on`, `Discovery-gated`, `Internal-only`, or `Exclude from fixed-scope offer`.
8. Finish with concrete next steps.
   - Highlight missing evidence, validation gates, and the fastest way to close major gaps.

Detailed review guidance lives in [references/workflow.md](references/workflow.md).

## AI and Chatbot Focus

When the plugin includes AI or chatbot capability, explicitly review:

- chatbot setup, UX controls, and placement;
- prompts, instructions, context grounding, and memory;
- transcripts, moderation, restricted topics, and escalation;
- file upload, multimodal, function-calling, MCP, or automation surfaces;
- ecommerce, lead capture, search, knowledge, RAG, or vector-store features;
- external API costs, data handling, and support burden.

Treat action-taking AI features as review-gated by default.

## Output Formats

Default to a structured review with:

1. Executive summary
2. Source coverage log
3. Capability map
4. Delivery findings
5. Governance and safety findings
6. Package recommendation
7. Open questions and next steps

Use the reusable templates in [references/output-templates.md](references/output-templates.md).

## Validation Checklist

Before finishing, confirm that the output:

- answers the user's real commercial question;
- separates facts, vendor claims, and inference;
- clearly marks free, paid, private-code, and add-on boundaries;
- flags delivery, support, governance, and content prerequisites;
- translates findings into package guidance instead of a feature summary;
- names the highest-priority next actions;
- uses citations when live web sources materially support the conclusion.

Use the scoring and trigger checks in [references/qa-rubric.md](references/qa-rubric.md).

## Stop and Escalate

Pause and surface a review gate when:

- the plugin's most important features appear to live in private code;
- legal, medical, financial, pricing, or security-sensitive actions are exposed without clear review controls;
- production-changing actions are exposed through MCP, callable functions, or admin automation;
- external service pricing, retention, or data handling is unclear;
- the client's hosting, caching, or security stack is likely to block the core workflow;
- the content corpus is too weak, stale, or unstructured for a credible chatbot or retrieval experience.

When escalating, state what is known, what is missing, why it matters, and which validation step should happen next.

## Test Prompts

### Test prompt 1: Happy path

> Review the free and Pro packaging fit of this WordPress AI chatbot plugin for a small-agency managed service. Use the GitHub repo, WordPress.org listing, pricing page, and official docs. I need a capability matrix, free vs Pro boundaries, governance risks, and a recommendation for what belongs in standard scope vs upsell.

Expected behaviour:

- Builds a source map and checks the repo before trusting feature claims.
- Separates public-code evidence from docs and commercial claims.
- Produces package guidance, support burden notes, and next-step validation.

### Test prompt 2: Ambiguous input

> Can you tell me whether this plugin is good enough to include in our care plan?

Expected behaviour:

- Asks at most one focused question if the plugin or business goal is unknown.
- Otherwise assumes a conservative agency packaging context and proceeds.
- Avoids a shallow thumbs-up or thumbs-down answer.

### Test prompt 3: Boundary prompt

> Fix this plugin's PHP warning and refactor its enqueue logic.

Expected behaviour:

- Recognises that this is an implementation/debugging request rather than a packaging review.
- Routes to a more suitable coding or debugging workflow.
- Does not pretend that packaging due diligence answers the user's request.

## References

- [references/workflow.md](references/workflow.md)
- [references/output-templates.md](references/output-templates.md)
- [references/qa-rubric.md](references/qa-rubric.md)

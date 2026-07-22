---
name: wordpress-request-router
description: Route WordPress requests by classifying the job, choosing the right specialist skill, requiring dev-vs-live clarification before site-specific inspection, and enforcing the correct output structure for audits, remediation plans, discovery work, Gravity Forms work, Yoast SEO work, and agent-maintenance tasks.
---

# WordPress Request Router

## Overview

Use this skill whenever a WordPress request needs to be routed before doing deeper work. Your job is to classify the request, decide whether site-specific inspection is required, pick the narrowest matching specialist skill, and enforce the right output structure.

Do not let the response drift into a generic narrative when the request clearly belongs to a structured WordPress workflow.

## Request Shapes

Use this skill for requests like:

- "Audit this WordPress site for launch readiness, forms, and SEO."
- "Turn these WordPress findings into a prioritised remediation plan."
- "Plan a Gravity Forms enquiry workflow with notifications and spam protection."
- "Review the Yoast SEO setup for this site."
- "Map the site structure from these discovery notes."
- "Audit this agent's files, docs, validation workflow, or maintenance setup."

Success means you:

1. classify the request correctly
2. stop for dev-versus-live clarification when site-specific inspection depends on it
3. use the narrowest matching specialist skill when one clearly applies
4. return the mandated structure for that route
5. keep confirmed evidence, assumptions, unverified items, risks, and next actions clearly separated

## Routing Workflow

### 1. Classify the request first

Place the request into exactly one primary route before doing deeper work:

- **Audit or implementation**: the user wants current-state verification, connected inspection, configuration review, launch-readiness checking, or hands-on site work.
- **Remediation planning**: the user already supplied findings, audit notes, issues, or mixed observations and wants a prioritised plan.
- **Gravity Forms**: the request is primarily about form planning, auditing, setup, troubleshooting, validation, notifications, confirmations, feeds, spam protection, consent, or form QA.
- **Yoast SEO**: the request is primarily about Yoast SEO configuration, metadata, templates, indexing posture, breadcrumbs, schema, sitemaps, redirects, or SEO launch readiness.
- **Content architecture**: the user wants discovery notes, business inputs, sparse requirements, or existing content translated into WordPress structure.
- **Agent maintenance**: the user wants this agent itself audited, refined, documented, validated, or structurally maintained.
- **Consultative configuration**: the request is advisory planning or recommendations that do not require one of the narrower routes above.

If more than one route seems relevant, choose the narrowest route that best matches the user's main outcome.

### 2. Decide whether site-specific inspection is required

Treat inspection as required when the user wants current-state verification, a site-specific audit, current plugin or settings confirmation, launch-readiness validation, or hands-on WordPress implementation.

Do not require inspection when the user:

- wants planning from supplied findings
- wants a reusable Gravity Forms plan
- wants discovery or content architecture from notes
- wants advisory recommendations that do not depend on current site state
- wants agent-maintenance work on this agent's own files, instructions, or validation assets

### 3. Require dev-versus-live clarification before site-specific inspection

Before any site-specific inspection or implementation, determine the environment:

- If the user clearly means development, staging, sandbox, or pre-release work, use {{label:LS Agency Dev Site,id:asdk_app_6a4384f18d208191b45d35341d4085cd,type:app}}.
- If the user clearly means the live, production, public, or published site, use {{label:LS Agency LIVE MCP,id:asdk_app_6a402c16266c8191ac82952d0a8b7ef7,type:app}}.
- If the request is site-specific and the environment is not clear, ask exactly one short clarification question before inspecting or changing anything.

Do not inspect first and clarify later.
Do not assume live just because the user mentions a website.
Do not ask this clarification for general planning, remediation-from-supplied-findings, discovery, or agent-maintenance work.

### 4. Choose the narrowest matching specialist skill

When one specialist skill clearly fits, use it before producing the final answer:

- Use {{label:wordpress-inspection-preflight,id:hsk_6a4783713f9c81919b04f00e637db08d,type:skill}} for disciplined preflight on site-specific WordPress audits, launch-readiness checks, current-state verification, and connected inspection.
- Use {{label:gravity-forms-configuration,id:6a464c3b63e081918a32dcaec679b5dc,type:skill}} for Gravity Forms planning, auditing, setup, troubleshooting, validation, and handoff work.
- Use {{label:yoast-configuration,id:6a46e1db9158819194f9e81117afe60a,type:skill}} for Yoast SEO configuration, audits, troubleshooting, rendered-output QA, and developer-oriented Yoast work.
- Use {{label:wordpress-audit-reporting,id:hsk_6a441f0688208191bd31165d0b4a4321,type:skill}} when the main job is to turn gathered WordPress findings into a concise audit, launch-readiness report, or structured handoff.
- Use {{label:wordpress-remediation-planner,id:hsk_6a4528d1b58481918a6462bbf9fd094a,type:skill}} when the user wants supplied findings or audit notes turned into a prioritised remediation plan, implementation batches, or quick wins.
- Use {{label:wordpress-accessibility-checker,id:6a438df2fd588191a22017ca4047e069,type:skill}} for accessibility-checker findings, issue normalisation, accessibility remediation planning, or safe accessibility content-edit work.

Use only the specialist skill or skills that materially improve the current request. Do not invoke a broader skill when a narrower one clearly matches.

### 5. Enforce the output structure for the chosen route

Use the exact required Markdown headings for the matching route unless the user explicitly asks for a different format.

#### Audit or implementation

Use these exact headings, in this order:

```text
## Confirmed Items

## Missing or Unverified Items

## Risks

## Blockers

## Recommended Next Actions

## Manual Checks Before Go-Live
```

Rules:

- inspection is required first when the request is site-specific current-state verification
- if inspection cannot be completed for a requested area, include that area under **Missing or Unverified Items**
- separate directly observed evidence from inference and manual follow-up

#### Remediation planning

Use these exact headings, in this order:

```text
## Priority Summary

## Remediation Batches

## Quick Wins

## Manual Checks and Risks

## Recommended Next Step
```

Rules:

- do not force a fresh inspection first when the user already provided sufficient findings for planning
- distinguish launch blockers, staging-safe work, production-sensitive work, and follow-up verification

#### Content architecture

Use these exact headings, in this order:

```text
## Structural Blueprint Table

## Machine Readability Report

## Next Actions
```

Rules:

- do not replace this structure with a narrative workshop plan, framework, or timeline unless the user explicitly asks for that
- make assumptions explicit when discovery inputs are sparse

#### Gravity Forms planning or review

When the user asks for a reusable form plan, structure the response by form and cover fields, routing, anti-spam protection, consent requirements, and QA checks explicitly.

Do not turn a form-planning response into a generic phased process unless the user explicitly asks for that.

#### Yoast SEO review

Return a practical Yoast-focused audit, plan, or recommendation set that clearly separates confirmed configuration facts, assumptions, risks, open questions, and next actions.

Do not promise ranking or indexing outcomes from configuration alone.

#### Agent maintenance

Return the maintenance deliverable the user asked for, such as an audit summary, implementation plan, deletion plan, README update plan, validator plan, maintenance summary, or concrete next actions.

Always separate:

- observed current structure
- proposed additions or updates
- exact duplicates eligible for removal
- files that should be preserved because their roles differ
- future improvements that are not part of the current change

#### Consultative configuration

Return practical recommendations, a short checklist, or phased next steps. Ask only the next blocking question when needed.

Do not imply a live or staging site has been inspected when it has not.

## Evidence and wording rules

- Separate confirmed evidence from assumptions, likely causes, recommendations, blockers, risks, and manual checks.
- Use WordPress-specific implementation language rather than vague platform-agnostic advice.
- Use UK English in all user-facing output.
- Be conservative about capability claims. If direct capability is unavailable or incomplete, state that plainly and fall back to precise manual WordPress guidance.
- For maintenance work, treat the current file tree and current file contents as the source of truth.

## Failure prevention

Never do any of the following:

- skip environment clarification before site-specific inspection when dev versus live is unclear
- use a generic narrative when a route has mandatory headings
- force inspection for remediation planning when the user already supplied enough evidence to plan from
- use a broad specialist skill when a narrower one clearly matches
- blur confirmed findings together with guesses or recommendations
- imply that unsupported live-site inspection or change capability exists when it does not

## Quick decision checklist

Before finalising the response, confirm all five:

1. Did I choose exactly one primary route?
2. If inspection is site-specific, is dev versus live known?
3. Did I choose the narrowest matching specialist skill?
4. Am I using the exact output structure required for this route?
5. Did I clearly separate confirmed evidence from assumptions, risks, and next actions?

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

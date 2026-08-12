---
name: wordpress-inspection-preflight
description: Use when the user wants a site-specific WordPress audit, launch-readiness check, current-state verification, connected inspection, or evidence-led configuration review and the agent needs a disciplined preflight before drawing conclusions or proposing changes.
---

# WordPress Inspection Preflight

## Overview

Use this skill for site-specific WordPress inspection work where the agent should verify the environment, establish evidence boundaries, inspect safely before recommending changes, and report findings in a way that cleanly separates confirmed facts from assumptions and manual follow-up.

Use this skill before broad WordPress audits, launch-readiness reviews, configuration verification, plugin-state checks, and other current-state inspections.

Do not use this skill for pure discovery drafting, general advisory planning that does not depend on current site state, or remediation planning from findings the user has already supplied in full.

## Request Shapes

Use this skill when requests look like:

- “Audit this WordPress site and tell me what is misconfigured before launch.”
- “Check the current setup for forms, SEO, and launch blockers on the staging site.”
- “Inspect the live site and confirm what is actually configured before recommending next steps.”

Success means you:

1. choose the correct environment or ask once if it is ambiguous
2. run a short preflight before relying on connected evidence
3. inspect the most relevant areas first instead of browsing loosely
4. clearly separate confirmed findings, unverified items, risks, blockers, and next actions
5. avoid implying unsupported access or unsupported write capability

## Workflow

### 1. Confirm scope and environment

First decide whether the request is actually site-specific inspection.

Treat it as inspection when the user wants current-state verification, a connected audit, a launch-readiness review, a configuration check, plugin-state confirmation, or evidence from the real WordPress environment.

Choose the matching app:

- Use {{label:LS Agency Dev Site,id:asdk_app_6a4384f18d208191b45d35341d4085cd,type:app}} for development, staging, testing, draft implementation review, and safe pre-release checks.
- Use {{label:LS Agency LIVE MCP,id:asdk_app_6a402c16266c8191ac82952d0a8b7ef7,type:app}} for live-site inspection, published-state checks, and explicitly requested production work.

If the request is site-specific but the environment is not clear, ask one short clarification question before inspecting anything.

### 2. Run inspection preflight

Before drawing conclusions, establish a minimal preflight:

- confirm which environment you are using
- identify the main audit goal from the request
- determine which requested areas can actually be inspected through the connected app
- prefer read-first inspection before any proposal that depends on current state
- treat missing evidence as unverified, not as failure by default

If the request touches forms, SEO, launch readiness, plugin state, or content structure, prioritise the requested areas first and only widen the scope when it materially improves the answer.

### 3. Inspect in a disciplined order

Use the lightest sequence that fits the request. Typical order:

1. site-level posture and relevant options
2. public content structure or post/page evidence
3. plugin inventory or plugin-specific evidence
4. forms, SEO, or launch-critical details requested by the user
5. risks, blockers, and manual checks still needed

Do not browse widely without purpose. Inspect only what is needed to answer the current request.

If one requested area cannot be inspected directly, keep going on the areas you can inspect and record the gap as unverified.

### 4. Maintain evidence boundaries

When reporting findings:

- call something confirmed only if it was directly observed through connected inspection or grounded files
- call something inferred only when the evidence strongly suggests it
- call something unverified when the needed inspection could not be completed
- do not say evidence is missing from chat when a connected inspection path exists and has not been tried yet
- do not claim plugin activation, premium licensing, theme/file access, or write capability unless the connected tools actually support that conclusion

If connected inspection fails or is incomplete, say which inspection step could not be completed and then continue with the best evidence-led answer you can.

### 5. Escalate carefully for higher-risk work

This skill is inspection-first. Do not turn an audit request into live-site changes by default.

Before any consequential change recommendation or implementation path, make clear whether the environment is staging or live and whether the request actually authorises action rather than inspection.

Treat live-site writes, plugin changes, theme/file changes, media replacement, and database-level operations as higher risk.

### 6. Hand off to the right reporting shape

When the user wants an audit-style summary, return these exact headings in this order:

## Confirmed Items

## Missing or Unverified Items

## Risks

## Blockers

## Recommended Next Actions

## Manual Checks Before Go-Live

When the request is mainly an audit or launch-readiness summary, you may also use {{label:wordpress-audit-reporting,id:hsk_6a441f0688208191bd31165d0b4a4321,type:skill}} to tighten the final reporting structure after inspection is complete.

## Decision Rules

- Ask one clarification question only when the environment is ambiguous and the request depends on it.
- Inspect before recommending configuration changes when direct access is available.
- Do not force a fresh inspection when the user already supplied sufficient findings and only wants prioritisation or remediation planning.
- Keep the answer proportional to the request; do not turn a narrow check into a whole-site audit unless the user asked for that.
- Separate staging-safe observations from production-sensitive risks when that distinction matters.

## Output Contract

For audit and launch-readiness inspection requests, produce:

1. a concise evidence-led summary using the six required headings above
2. direct, WordPress-specific next actions
3. explicit notes for anything still requiring manual verification

For narrower inspection requests, still separate:

- what you checked
- what was confirmed
- what remains unverified
- the next best action

## Quality Bar

- Prefer verified findings over comprehensive-sounding guesses.
- Be precise about what was inspected and what was not.
- Keep the workflow inspection-first, not recommendation-first.
- Do not overstate connector capability.
- Make it easy for the agent to produce reliable audits quickly without browsing aimlessly.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

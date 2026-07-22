---
name: wordpress-launch-readiness
description: Coordinate WordPress launch-readiness reviews when the user wants a go-live check, pre-launch audit, launch blocker summary, or a structured readiness handoff spanning site setup, public-facing forms, Yoast SEO, QA, and release risks. Use this skill to combine cross-domain launch evidence into one decision-ready output; route deep specialist review to the attached audit skills first when needed.
---

# WordPress Launch Readiness

Use this skill when the user wants to assess whether a WordPress site is ready to launch, understand what still blocks go-live, or turn mixed launch findings into a concise readiness handoff.

This skill is for cross-domain launch coordination. It should unify evidence across WordPress core setup, public-facing forms, Yoast SEO, content readiness, and QA rather than replacing narrow specialist audit skills.

## Use This Skill When

Use `$wordpress-launch-readiness` for requests like:

- “Audit this WordPress site for launch readiness and tell me what still blocks go-live.”
- “Turn these launch findings into a concise summary with blockers, risks, and next actions.”
- “Check whether the site is ready to launch across forms, SEO, configuration, and QA.”

Use this skill when the job is primarily to answer one launch question across several areas:

- what is confirmed ready
- what is still missing or unverified
- what blocks launch now
- what can wait until after launch
- what the next practical actions should be

## Do Not Use This Skill When

Do not use this skill as the main workflow when the request is primarily:

- a deep Gravity Forms audit or implementation task
- a deep Yoast SEO audit or configuration task
- a generic site discovery or architecture exercise
- a maintenance task for the agent’s own files, prompts, or validation assets

In those cases, use the narrower specialist skill first and only return to this skill if the final deliverable needs a launch-readiness synthesis.

## Supporting Files And Skills

Use these grounded resources when relevant:

- {{label:wordpress-request-router,id:hsk_6a4796cf65908191bcb352b57677c0ba,type:skill}} to classify the request and decide whether launch synthesis is the right path.
- {{label:wordpress-inspection-preflight,id:hsk_6a4783713f9c81919b04f00e637db08d,type:skill}} before any site-specific launch-readiness review that depends on connected inspection.
- {{label:wordpress-audit-reporting,id:hsk_6a441f0688208191bd31165d0b4a4321,type:skill}} when the main remaining job is turning gathered findings into a concise final report.
- {{label:gravity-forms-auditor,id:hsk_6a47ac757aa48191af64621c24ce5db9,type:skill}} when the launch risk depends on evidence-led form review.
- {{label:yoast-auditor,id:hsk_6a47abdd3ff88191978cb9c35506a029,type:skill}} when the launch risk depends on evidence-led Yoast review.
- {{label:pre-launch-qa-checklist.md,id:6a403c6260f881919884bf718553583e,type:file}} for launch QA coverage.
- {{label:seo-launch-checklist.md,id:6a403e26f7908191b7671944f1c53e32,type:file}} for SEO launch checks.
- {{label:pre-launch-summary-template.md,id:6a403cd6f7088191a67957996df07279,type:file}} when a reusable launch summary structure is helpful.
- {{label:master-qa-checklist.md,id:6a4046692c148191b5bdd4a01188d312,type:file}} when broader QA coverage matters.

## Workflow

1. Classify the request.
   - Decide whether the user wants a site-specific readiness review, an evidence-led synthesis from supplied findings, or a reusable launch handoff.
   - If the job is not really a launch-readiness request, hand off to the narrower workflow instead of forcing this skill.

2. Decide whether connected inspection is required.
   - If the user wants current-state verification for a real site, use {{label:wordpress-inspection-preflight,id:hsk_6a4783713f9c81919b04f00e637db08d,type:skill}} first.
   - If the user already supplied the findings and only wants prioritisation or launch interpretation, work from that evidence without forcing another inspection pass.

3. Build the launch evidence set.
   Review only the areas that materially affect launch:
   - site identity, homepage, reading settings, and permalink posture
   - public-facing navigation and key content readiness
   - plugin state and plugin-dependent launch risk
   - public-facing forms, confirmations, notifications, consent, and anti-spam posture
   - Yoast metadata, templates, sitemap/indexation posture, breadcrumbs, and launch SEO basics
   - staging-versus-live differences that must change at launch
   - QA coverage, unresolved defects, and manual verification gaps

4. Separate evidence by confidence.
   For every material launch point, classify it as one of:
   - confirmed ready
   - confirmed issue
   - unverified
   - blocker
   - launch risk but not a hard blocker

5. Keep scope disciplined.
   - Focus on launch readiness, not a full website strategy rewrite.
   - Prefer the smallest set of findings needed to explain the launch decision clearly.
   - Group repetitive lower-priority issues instead of listing every minor defect.
   - If a specialist area needs deeper evidence, route that subtask first and then resume the launch summary.

6. Convert findings into a decision-ready output.
   - Put the main blocker or strongest launch caution first.
   - Distinguish what must be fixed before launch from what can be deferred.
   - End with concrete next actions in practical implementation order.

## Launch Readiness Decision Rules

Use these rules consistently:

- Treat broken public-facing forms, missing notification paths, severe SEO indexation mistakes, critical navigation failures, and unresolved production-risk changes as likely launch blockers.
- Treat incomplete evidence as unverified unless there is direct proof of failure.
- Call out staging-safe settings that are correct before launch but must change at go-live.
- Do not overstate SEO concerns as hard launch blockers unless they clearly affect indexation, metadata correctness, canonicals, sitemap validity, or robots behaviour.
- Do not let noisy plugin inventories distract from the public-facing launch decision.
- Distinguish launch blockers from quality improvements, nice-to-haves, and post-launch optimisations.

## Output Contract

When the user asks for a concise launch-readiness summary, use these exact top-level headings:

## Confirmed Findings

## Unverified Items

## Risks

## Blockers

## Next Actions

Output rules:

- Use UK English.
- Keep the summary concise and decision-oriented.
- Start the first section with the most important confirmed launch signal.
- In **Blockers**, include only issues that should realistically stop or pause launch.
- In **Next Actions**, list the smallest practical sequence to reduce launch risk.
- If a requested area could not be inspected, say so under **Unverified Items** instead of omitting it.

## Example

User request:

> Audit this WordPress site for launch readiness and tell me whether anything still blocks go-live.

Good response shape:

- **Confirmed Findings**: concise bullets covering what is correctly configured now
- **Unverified Items**: any launch-critical area that still needs manual or connected verification
- **Risks**: issues that may not block launch but still matter soon
- **Blockers**: only the true go-live blockers
- **Next Actions**: short ordered actions, starting with the blocker-resolution path

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

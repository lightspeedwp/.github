---
name: pre-launch-readiness-review
description: Use when the user asks for a pre-launch review, launch-readiness audit, final QA pass, go-live checklist review, blocker triage, sign-off summary, or client-safe handoff for a WordPress tour operator site.
---

# Pre-Launch Readiness Review

Use this skill to run a structured launch-readiness review for the current WordPress site and produce a concise handoff output that separates confirmed blockers from lower-priority improvements.

## When To Use This Skill

Use this skill when the request is primarily about:

- pre-launch readiness
- final QA before go-live
- launch blockers and risk triage
- sign-off summaries
- client-ready handoff notes
- validating whether the site is ready for launch after configuration work

Do not use this skill for general discovery, pure plugin implementation, or a narrow Gravity Forms, Yoast, accessibility, or Tour Operator plugin-stack task when one of those specialist workflows is clearly the main job.

## Default Assumptions

- Use UK English.
- Treat the connected WordPress site in {{label:SD-Dev-Site,id:asdk_app_6a464e6c24b08191b5488222af5ee04f,type:app}} as the default audit target when it is available and the user has not named another site.
- Work read-first by default.
- Separate confirmed facts from assumptions, and label anything unverified as not verified.
- Keep recommendations practical and launch-oriented rather than broad or speculative.

## Workflow

1. Confirm the audit target and scope.
   - If the user already named the site or environment, use that.
   - Otherwise default to {{label:SD-Dev-Site,id:asdk_app_6a464e6c24b08191b5488222af5ee04f,type:app}} when available.
   - If the scope is unclear, ask one short blocker question before proceeding.

2. Build the evidence base before making claims.
   - Inspect the observable WordPress baseline first.
   - Use {{label:site-preflight,id:hsk_6a4783b31eb08191af7ae30b00c6da01,type:skill}} when a clean environment and plugin-stack snapshot will materially improve confidence.
   - Use direct app reads before making strong statements about settings, plugins, content types, forms, SEO, or launch posture.

3. Route specialist checks only when needed.
   - For Tour Operator core plugin or first-party extension structure, use {{label:tour-operator-plugin-stack,id:hsk_6a46390350e48191b3f020bde38c6808,type:skill}}.
   - For Gravity Forms readiness, use {{label:gravity-forms-configuration,id:6a464c3b63e081918a32dcaec679b5dc,type:skill}}.
   - For Yoast SEO launch posture, use {{label:yoast-configuration,id:6a46e1db9158819194f9e81117afe60a,type:skill}} or {{label:wordpress-yoast-seo-auditor,id:6a43cc76e8408191ac88a70871c7a93d,type:skill}} when a narrower Yoast audit is the better fit.
   - For accessibility evidence or remediation planning, use {{label:wordpress-accessibility-checker,id:6a438df2fd588191a22017ca4047e069,type:skill}}.
   - Do not stack specialist workflows unless they materially improve the launch-readiness conclusion.

4. Review launch readiness across the minimum relevant areas.
   Cover only the areas that matter for the current site and request:
   - site identity and core settings
   - homepage and reading settings
   - SSL, indexation posture, and obvious environment risks
   - Tour Operator content structure and plugin coherence
   - Gravity Forms readiness and notification safety
   - Yoast SEO launch posture
   - navigation, contact paths, and obvious user-journey blockers
   - outstanding QA or validation gaps

5. Classify every finding into one of these buckets.
   - Launch-blocking
   - Important but not blocking
   - Improvement opportunity
   - Not verified

6. Keep remediation advice tight.
   - Prefer the smallest next action that reduces launch risk.
   - If a fix requires unsupported writes or risky live-site changes, say so and provide exact manual follow-up guidance instead of improvising.

## Output Contract

When delivering the result, use this exact section order:

### Scope Reviewed

- State what was reviewed and the site or environment targeted.

### Evidence Used

- List the main evidence sources actually used.

### Launch-Blocking Findings

- Include only issues that would reasonably block launch.
- If none were confirmed, say `No confirmed launch-blocking findings.`

### Important But Not Blocking

- Include material issues that should be addressed soon but do not necessarily block launch.

### Improvement Opportunities

- Include lower-priority polish or optimisation work.

### Not Verified

- List anything that still needs confirmation.

### Recommended Next Actions

- Give a short, prioritised action list.

### Handoff Summary

- End with a concise plain-English summary suitable for a project manager, client, or implementation handoff.

## Quality Rules

- Do not present guesses as confirmed findings.
- Do not let one weak issue inflate into a full no-go verdict.
- Do not bury launch blockers inside long narrative prose.
- If the site appears broadly ready, say so plainly while still naming any residual risks.
- Prefer observed evidence over generic best-practice lectures.
- Keep the final answer easy to scan and suitable for direct reuse in project coordination.

## Supporting Files

Use these files when they materially improve the review:

- {{label:pre-launch-qa-checklist.md,id:6a43c00faeec81918c63745d634b115b,type:file}} for final QA coverage.
- {{label:master-qa-checklist.md,id:6a43c00fabd08191a6ded3ecd9f43421,type:file}} for broader validation coverage.
- {{label:seo-launch-checklist.md,id:6a43c00fad988191874bb12d67942e12,type:file}} for launch-related SEO checks.
- {{label:pre-launch-summary-template.md,id:6a43c00fade08191bd3238d2a2ff1008,type:file}} when a reusable summary structure is helpful.
- {{label:example-pre-launch-summary.md,id:6a43c00fae2c81918ca963ed1b686ab6,type:file}} as a quality bar for tone and structure, not as copy to reuse verbatim.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

# Yoast Auditor Preview Evaluation and Display Debug Prompt

Review a preview run that is intended to exercise the attached local `yoast-auditor` skill, evaluate whether the preview behaved correctly, and debug and repair any preview-display failures or malformed surfaced output.

Scope and intent:

- This is a preview-evaluation and repair task, not a broad rewrite of the agent.
- Treat the current preview transcript, current system instructions, current attached local skills, and current attached file tree as the source of truth.
- Focus on the `yoast-auditor` route, preview output quality, and any display or rendering failures visible in preview runs.
- Do not assume the preview routed correctly just because the request was Yoast-related; verify from the actual preview output and current routing instructions.

Primary goal:

- Determine whether a preview request intended for `yoast-auditor` produced the right specialist behaviour and surfaced correctly in preview, then identify and fix anything that caused blank output, generic failure output, malformed display, leaked internal payloads, or broken preview rendering.

Required inputs:

- the preview run to inspect
- the current draft instructions for the agent
- the current attached local skills, especially:
  - `wordpress-request-router`
  - `wordpress-inspection-preflight`
  - `yoast-auditor`
  - `yoast-configuration`
  - `wordpress-audit-reporting`

Source of truth:

- the actual preview transcript and preview metadata
- the current instruction system
- the current attached local skill inventory
- any current templates, reporting rules, or maintenance files that shape preview output

What to review:

1. The preview input that was intended to trigger `yoast-auditor`
2. The actual surfaced preview output
3. Whether the preview appears to have:
   - routed into `yoast-auditor`
   - failed before meaningful output
   - surfaced malformed text
   - leaked an internal payload or machine-style wrapper
   - returned a blank, partial, or generic error-only answer
4. The current routing instructions and reporting expectations for Yoast audit work
5. Any nearby templates, prompts, or maintenance docs that affect Yoast audit output structure

What to check for:

- generic preview failure messages such as “Something went wrong” with no usable audit output
- surfaced JSON or internal wrapper text instead of a normal user-facing audit result
- missing Yoast audit structure such as confirmed findings, unverified items, blockers, and next actions
- routing drift where a Yoast audit request appears to have taken the configuration path instead of the auditor path
- output formatting that breaks preview readability or looks machine-generated rather than client-safe
- template, reporting, or instruction wording that could cause malformed preview output
- any display issue that makes the preview hard to interpret, including empty sections, duplicated fragments, broken headings, raw payload echoes, or incomplete handoff formatting

Repair rules:

- Make the smallest complete set of changes needed to repair preview behaviour and display quality.
- Fix the most direct cause first: routing wording, output-structure wording, malformed instruction fragments, stale template guidance, or other grounded issues.
- Do not claim a route was used unless the preview evidence supports it.
- If the preview failed too early to confirm route behaviour, say so explicitly and repair the most likely grounded causes without overstating certainty.
- Preserve the current Yoast audit/reporting split unless a real inconsistency is found.
- Remove or rewrite any instruction or maintenance wording that could cause raw payload echoing or malformed surfaced output.

Expected output:

1. Preview run reviewed
2. Whether the run appears to have reached the intended `yoast-auditor` path
3. Every display or surfaced-output issue found
4. The most likely grounded cause of each issue
5. Exact repairs recommended or applied
6. Whether the preview should be rerun after the fixes
7. A clear statement on whether the Yoast audit preview path is now healthy and readable

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

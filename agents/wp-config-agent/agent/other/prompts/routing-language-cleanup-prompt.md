# Routing Language Cleanup Prompt

Run a broader consistency pass across this agent’s remaining documentation, maintenance notes, examples, and validation sources so they stay aligned with the current routing language and specialist-skill split.

Scope and intent:

- This is a cleanup and consistency task, not a rewrite of the main routing system.
- Treat the current system instructions, attached local skills, and attached agent file tree as the source of truth.
- Nothing in the already-updated routing and validation slice is currently blocking; preserve that status.
- Focus only on residual inconsistencies, stale wording, missing references, validation drift, or test-source gaps that still surround the updated routing language.

Source of truth:

- Current system instructions
- Current attached local skills, especially:
  - `wordpress-site-onboarding`
  - `wordpress-inspection-preflight`
  - `wordpress-request-router`
  - `wordpress-audit-reporting`
  - `wordpress-remediation-planner`
  - `yoast-configuration`
  - `yoast-auditor`
  - `gravity-forms-configuration`
  - `gravity-forms-auditor`
  - `wordpress-accessibility-checker`
- Current attached file tree and current file contents
- Current attached apps and current reporting rules

Primary goal:

- Tighten the broader validation and documentation layer around the current routing model without reopening settled routing decisions.

What to review:

1. Reference guides in `references/`
2. Folder READMEs and other maintenance notes
3. Templates in `templates/`
4. Worked examples in `examples/`
5. Validation schemas in `schemas/`
6. Validation runners and helper scripts in `scripts/`
7. Any business-context or maintenance wording that still frames the old specialist split

What to check for:

- lingering references to superseded Yoast or Gravity Forms skill choices
- wording that blurs configuration/change work with read-only audit/review work
- reporting guidance that conflicts with the current router or auditor split
- examples or templates that imply the wrong skill path
- validator names, validator comments, or script assumptions that no longer match the current routing language
- missing consistency checks that would help catch future drift in routing, specialist-skill references, or audit/configuration separation
- outdated mentions of shared skills, workspace skills, directory skills, or old skill names for Yoast and Gravity Forms
- maintenance docs that refer to a narrower attached-skill set than the current local skill inventory now supports

Required routing model to preserve:

- Yoast setup, planning, reusable guidance, remediation planning, and configuration work route to `yoast-configuration`
- Yoast audits, evidence review, validation, launch QA, report-led review, and structured review work route to `yoast-auditor`
- Gravity Forms setup, implementation, troubleshooting, validation, change work, and handoff work route to `gravity-forms-configuration`
- Gravity Forms read-only audits, findings registers, evidence-led review, scorecards, and audit summaries route to `gravity-forms-auditor`
- routing classification and dev-vs-live clarification before site-specific inspection remain owned by `wordpress-request-router`
- deeper site-specific inspection discipline may rely on `wordpress-inspection-preflight` when current-state verification is required
- accessibility-checker findings, exported accessibility evidence, remediation planning, and safe accessibility content-edit recommendations route to `wordpress-accessibility-checker`

Editing rules:

- Make the smallest complete set of edits needed.
- Do not broaden scope into unrelated platform, app, Memory, or business-domain rewrites.
- Do not reopen sections that are already aligned unless a change is required for consistency.
- Remove conflicting references instead of leaving soft contradictions behind.
- Preserve still-correct guidance, examples, and validation assets.
- If a file is already aligned, leave it unchanged.

Validation focus:

- Ensure documentation, templates, examples, schemas, and scripts all agree on the routing split.
- Check whether `scripts/` should include additional validation coverage for:
  - outdated specialist-skill references
  - configuration-vs-audit wording drift
  - stale Yoast or Gravity Forms route language in docs or examples
  - mismatch between reporting guidance and router-owned output paths
- If new validation is warranted, prefer the lightest deterministic check that catches real future drift.

Output:

1. Files reviewed
2. Files updated
3. Any validator or test-source gaps found
4. Any new validation checks recommended or added
5. Any remaining non-blocking ambiguity
6. A clear statement on whether the broader documentation and validation layer is now aligned with the current routing language

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

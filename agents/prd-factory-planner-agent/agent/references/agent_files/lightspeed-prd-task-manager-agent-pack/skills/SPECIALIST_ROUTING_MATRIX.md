# Specialist Routing Matrix

This matrix defines how the agent should choose among the currently attached skills.

Use these rules in order:

1. Start with the **user's actual deliverable**.
2. Prefer the **narrowest attached skill** that directly improves that deliverable.
3. Use **evidence-locker first** when factual discipline, source checking, or assumption tracking materially affects quality.
4. Use **only one core output skill at a time** unless the task genuinely moves from one artefact to the next.
5. Use supporting skills only when the request explicitly needs that specialist output.
6. If no attached skill clearly fits, continue with the base agent workflow instead of forcing a weak match.

## Fast routing rules

- If the input is rough, incomplete, contradictory, or mixed, start with `lightspeed-project-intake-router`.
- If the user needs source review before drafting, use `lightspeed-project-researcher`.
- If the user needs a PRD, use `lightspeed-prd-generator`.
- If the user needs a Figma-to-WordPress technical brief, use `lightspeed-figma-wordpress-technical-brief`.
- If the user needs epics, tasks, sequencing, or delivery waves, use `lightspeed-task-breakdown-planner`.
- If the user needs GitHub-ready issue drafts, use `lightspeed-github-issue-drafter`.
- If the user needs developer sequencing or handoff planning, use `lightspeed-implementation-plan-generator`.
- If the user needs a quality review of an existing planning artefact, use `lightspeed-prd-task-reviewer`.
- If the user needs Markdown structure, frontmatter, schema, or SemVer validation, use `markdown-content-validator`.
- If the user needs durable planning continuity, use `lightspeed-project-memory-manager`.

## Routing by request type

| Request type | Primary skill | Use before it | Common follow-on |
|---|---|---|---|
| Rough brief, scattered notes, mixed links, unclear ask | `lightspeed-project-intake-router` | `evidence-locker` when fact discipline matters from the start | `lightspeed-prd-generator`, `lightspeed-figma-wordpress-technical-brief`, or `lightspeed-task-breakdown-planner` |
| Source review, discovery analysis, repo/design/site evidence review | `lightspeed-project-researcher` | `evidence-locker` when sources are messy, risky, or likely to conflict | Any planning artefact skill |
| Product requirements document | `lightspeed-prd-generator` | `evidence-locker` for source-backed PRDs | `lightspeed-task-breakdown-planner`, `lightspeed-implementation-plan-generator`, `lightspeed-prd-task-reviewer` |
| Figma-to-WordPress implementation brief | `lightspeed-figma-wordpress-technical-brief` | `evidence-locker` when design or implementation facts must be locked down | `lightspeed-task-breakdown-planner`, `lightspeed-github-issue-drafter` |
| Epics, tasks, milestones, waves, dependencies | `lightspeed-task-breakdown-planner` | `evidence-locker` if tasks depend on confirmed scope or source truth | `lightspeed-github-issue-drafter`, `lightspeed-implementation-plan-generator` |
| GitHub-ready issue bodies | `lightspeed-github-issue-drafter` | `evidence-locker` if issue content must stay tightly grounded | `markdown-content-validator` |
| Developer sequencing, implementation workstreams, handoff plan | `lightspeed-implementation-plan-generator` | `evidence-locker` when implementation claims need source support | `lightspeed-acceptance-test-planner`, `lightspeed-release-handoff-generator` |
| Review of a PRD, brief, task plan, issue draft, or handoff pack | `lightspeed-prd-task-reviewer` | `evidence-locker` when unsupported claims or assumption drift are likely | `markdown-content-validator` |
| Markdown/frontmatter/schema/version validation | `markdown-content-validator` | None by default | Return fixes or send back to the originating planning skill |
| Acceptance testing or QA planning | `lightspeed-acceptance-test-planner` | `evidence-locker` if acceptance criteria must be source-backed | `lightspeed-qa-findings-router` |
| QA findings triage | `lightspeed-qa-findings-router` | `evidence-locker` when severity or claims must be justified | `lightspeed-github-issue-drafter` |
| Launch-readiness routing | `lightspeed-launch-task-router` | `evidence-locker` when launch evidence is incomplete or risky | `lightspeed-release-handoff-generator`, `lightspeed-project-status-reporter` |
| Release notes, handoff packs, closure materials | `lightspeed-release-handoff-generator` | `evidence-locker` when release claims need traceable evidence | `markdown-content-validator`, `lightspeed-prd-task-pack-exporter` |
| Requirement coverage and traceability | `lightspeed-requirements-traceability-mapper` | `evidence-locker` when requirement mapping must stay source-backed | `lightspeed-acceptance-test-planner`, `lightspeed-prd-task-reviewer` |
| Approval checkpoints or sign-off readiness | `lightspeed-approval-gate-manager` | `evidence-locker` when approval claims or dependencies are uncertain | `lightspeed-project-status-reporter` |
| Scope change assessment | `lightspeed-change-request-router` | `evidence-locker` when the baseline is unclear or disputed | `lightspeed-task-breakdown-planner`, `lightspeed-approval-gate-manager` |
| Stakeholder or delivery reporting | `lightspeed-project-status-reporter` | `evidence-locker` when reporting from mixed or incomplete evidence | `lightspeed-approval-gate-manager` |
| Durable project memory updates | `lightspeed-project-memory-manager` | Only after meaningful planning work changed durable context | None |
| Delivery-pack export or packaging | `lightspeed-prd-task-pack-exporter` | `markdown-content-validator` when the pack must be structurally clean | None |
| First-use defaults and intake onboarding | `lightspeed-intake-onboarding` | Only when reusable defaults are missing and worth saving | The next real planning skill |
| WordPress plugin packaging or commercial packaging review | `wordpress-plugin-packaging-review` | `evidence-locker` when claims, tiers, risks, or offer fit must be well evidenced | `lightspeed-project-status-reporter` if a summary is needed |

## Mandatory guardrails

- Do not route to unattached skills.
- Do not route to `content-file-validator`; use `markdown-content-validator` instead.
- Do not invoke multiple overlapping output skills just because they are loosely related.
- Do not use `lightspeed-prd-task-manager` when a narrower skill clearly covers the request.
- Do use `lightspeed-prd-task-manager` when the request spans multiple artefacts and needs orchestration across them.
- Do not use onboarding unless reusable defaults are missing and saving them will help later runs.
- Do not use memory-management just because Memory exists; use it only when durable project state should actually change.

## Escalation and fallback rules

Use `lightspeed-prd-task-manager` as the orchestration layer when:

- the user asks for multiple deliverables in one flow
- the task needs staged transitions between intake, PRD, technical brief, tasks, issues, and handoff
- it is genuinely unclear which single planning artefact should come first

Use the base agent workflow when:

- the user needs a lightweight planning answer rather than a specialist deliverable
- no attached skill is a clear fit
- the task is too small to justify specialist routing

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

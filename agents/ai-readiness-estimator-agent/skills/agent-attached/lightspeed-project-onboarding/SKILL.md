---
name: lightspeed-project-onboarding
description: collect only blocking missing project defaults and route messy lightspeed project requests to the right specialist skill. use when a lightspeed teammate starts or resumes website, figma-to-wordpress, ai-readiness, chatbot, content, seo, analytics, qa, launch, support, linear, github, asana, or delivery work with incomplete context, scattered sources, unclear next steps, or missing reusable defaults. skip when the current message, memory, or connected sources already provide enough context to proceed.
---

# LightSpeed Project Onboarding

## Purpose

Use this skill as the LightSpeed team front door for intake-heavy work. Its job is to identify the project anchor, normalise messy inputs, collect only blocking missing defaults, and route the request to the right related skill or next prompt.

Do not turn onboarding into a full questionnaire. Do not complete the downstream deliverable unless the user explicitly asked for onboarding plus the deliverable and enough context is available.

## Core behaviour

1. Treat the current user as a LightSpeed teammate unless the conversation clearly says otherwise.
2. Check the current message, attachments, connected sources, conversation context, and Memory before asking anything.
3. Ask at most one concise blocking question at a time.
4. Prefer safe defaults when a field is non-blocking.
5. Label values as `confirmed`, `inferred`, `defaulted`, or `missing`.
6. Never save inferred values, questionnaire defaults, extracted guesses, risk flags, or approval assumptions as durable memory without confirmation.
7. Route to the most specific related skill once the request is clear enough.
8. If the request can already proceed, skip visible onboarding and continue with the user's original task.

## Preflight

1. Read `references/onboarding-contract.yaml`.
2. Read `references/intake-wizard-schema.yaml`.
3. Read `references/routing-map.yaml` when routing, recommending a next skill, or handling a mixed LightSpeed workflow.
4. Read the Memory state file named by the contract's `memory_state_file` field if it exists.
5. Compare the request against `trigger_when`, `skip_when`, and `completion_requires` in the contract.
6. Persist only confirmed durable defaults using the contract's `store_as` keys.
7. Keep temporary working intake in `intake-state.yaml`.

## Trigger and skip rules

Trigger this skill when a LightSpeed request has at least one of these conditions:

- the project, client, website, repo, Figma file, source pack, or approval context is missing or ambiguous
- the user provides scattered inputs such as notes, links, emails, meeting transcripts, docs, screenshots, issues, PRs, or questionnaires
- the user asks what workflow, specialist skill, deliverable, estimate, audit, brief, plan, QA route, or next prompt should happen next
- the work touches reusable LightSpeed defaults such as approved sources, exclusions, approval gates, output format, or project memory
- the request spans multiple related skills and needs a safe sequence before execution

Skip this skill when:

- the project anchor and intended deliverable are already clear enough
- the current request is a small rewrite, explanation, or one-off answer
- a more specific skill should run immediately and no onboarding field blocks it
- the user explicitly provides the project anchor as a domain, repo, Figma URL, Google Doc, client name, or named project

## Input handling

Accept messy team inputs without requiring the user to reformat them. Common inputs include:

- client or project names
- website, staging, repo, Figma, Google Drive, Asana, Linear, GitHub, Gmail, Slack, Zendesk, or meeting-recording references
- pasted briefs, estimates, discovery answers, launch notes, QA findings, customer feedback, support cases, or meeting notes
- uploaded files, screenshots, checklists, spreadsheets, PDFs, or questionnaires
- short commands such as `scope this`, `route this`, `turn this into issues`, `make this client-safe`, or `what skill should handle this?`

For every input:

1. Extract likely project anchor, workflow type, source material, requested output, audience, constraints, exclusions, urgency, risk, approval needs, and candidate downstream skill.
2. Mark extracted values as `inferred` unless the user clearly confirmed them.
3. Use attached and connected sources when the task depends on them. For internal LightSpeed context, search connected sources before guessing.
4. Separate approved sources from candidate sources. Do not treat a link, questionnaire, or old document as approved simply because it was provided.
5. If the user says `this skill`, `that project`, or `the related skills`, resolve the reference from the current conversation or Memory before asking.
6. If still ambiguous, ask the smallest blocking question, usually for the project anchor or intended output.

## Routing workflow

1. Classify the request into one of these modes:
   - `onboard_only`: collect missing defaults, then stop.
   - `route_only`: recommend the best related skill and prompt starter.
   - `onboard_then_route`: collect one blocking field, then route.
   - `direct_execution`: skip onboarding and let the matched specialist skill handle the task.
2. Use `references/routing-map.yaml` to choose the most specific next skill.
3. Prefer specialist skills over broad orchestration skills when the task is already clear.
4. Prefer router/orchestrator skills when the task is mixed, messy, early-stage, or crosses several domains.
5. When suggesting a route, include:
   - recommended skill
   - why it fits
   - what context is already available
   - what is still missing, if anything
   - a ready-to-copy next prompt
6. When invoking or handing off to another skill, pass a compact project packet rather than a full transcript.

## Related skill routing principles

Use related skills in this order of preference:

1. A precise execution skill for the requested output.
2. A domain router when the request is broad or unclear within a domain.
3. A project intake or evidence skill when sources are scattered or approval status is unclear.
4. This onboarding skill only when missing defaults block safe routing or repeated team use.

Do not force every LightSpeed request through this skill. Its purpose is to remove friction, not add a gate.

## Memory state

Use {{label:Memory,id:file_persistence,type:file_persistence}} as the backing store for durable onboarding keys defined in `references/onboarding-contract.yaml`.

Persist confirmed defaults for the current runtime end user in `lightspeed-project-defaults.yaml`.

Memory may store durable defaults such as:

- project anchor
- project type
- primary goal
- audience
- approved source defaults
- exclusions
- approval requirements
- default output format
- preferred source priority

Memory must not store:

- unconfirmed guesses
- temporary run context
- raw transcripts
- sensitive case detail unless explicitly requested
- unreviewed claims or compliance assumptions
- full source dumps

## Questionnaire and checklist handling

Treat questionnaires and checklists as optional field libraries, not mandatory flows.

- Use only the questionnaire fields relevant to the active workflow.
- Do not dump a full questionnaire into chat.
- Ignore questionnaire files that do not fit the task.
- Mark extracted questionnaire values as `inferred` unless confirmed.
- If the questionnaire purpose is unclear, ask: `What was this questionnaire intended to help capture for this workflow?`

For governance, chatbot, AI-readiness, policy, claim, or launch work, focus questionnaire use on audience, approved sources, exclusions, claims, risk, privacy, support routes, escalation, approval owners, and launch gates.

## Claim, source, and approval rules

If intake evidence includes regulated, commercial, comparative, testimonial, performance, pricing, ROI, ranking, compliance, guarantee, or outcome claims, mark `claim_register_required` in the intake state.

For claim-sensitive intake:

- treat unsupported or high-risk claims as not approved for public use
- separate approved sources from candidate sources
- capture exclusions, reviewer ownership, and approval gates
- keep unreviewed claims in temporary intake state until confirmed
- route claim-heavy work to `lightspeed-claim-register-auditor` when the claim review becomes the task

## Output patterns

For simple onboarding, reply with the missing field or route only.

For visible intake summaries, use a compact structure:

- project anchor
- inferred workflow type
- available sources
- missing blocker
- recommended next skill
- ready-to-copy prompt

For routing outputs, keep the recommendation practical and team-friendly. Do not expose internal trigger mechanics unless it helps the user update or debug the skill.

## Supporting files

- `references/onboarding-contract.yaml` determines triggers, required state, optional defaults, completion rules, and skip conditions.
- `references/intake-wizard-schema.yaml` structures fields, statuses, extraction tokens, memory rules, source handling, and claim/approval records.
- `references/routing-map.yaml` maps messy LightSpeed requests to related specialist skills and safe next prompts.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

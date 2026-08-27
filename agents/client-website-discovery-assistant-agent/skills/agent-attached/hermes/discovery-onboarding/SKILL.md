---
name: discovery-onboarding
description: collect and persist reusable lightspeed website discovery defaults in memory before discovery workflows. use when a lightspeed teammate starts a client website discovery task, asks to create a discovery pack or summary, or a related discovery skill is blocked by missing client, website, goal, output, approval, or standing project defaults. route away from this skill for run-specific source gathering, draft review, specialist audits, launch planning, or one-off rewrites when enough context already exists.
---

# Discovery Onboarding

## Purpose

Use this skill to collect only the durable defaults that help LightSpeed teammates run future website discovery work without repeating the same setup questions.

This skill is an onboarding gate, not a discovery pack generator. Its job is to decide whether reusable defaults are missing, save only those defaults, and then resume or route the original request.

## Supporting files

- `references/onboarding-contract.yaml` — source of truth for required fields, optional fields, trigger rules, skip rules, and memory keys.
- `references/related-skill-routing.md` — routing map for the wider LightSpeed discovery skill set.

Always read `references/onboarding-contract.yaml` before asking onboarding questions. Read `references/related-skill-routing.md` when the request overlaps with another discovery skill, asks which workflow to use, or appears too specialist for onboarding.

## Memory state

Use {{label:Memory,id:file_persistence,type:file_persistence}} as the backing store for the onboarding keys in `references/onboarding-contract.yaml`.

Persist defaults for the current runtime end user in `discovery-user-defaults.yaml`, and read that file before asking the user to restate defaults.

Store only durable defaults defined in the onboarding contract. Do not store one-off project notes, meeting detail, stakeholder quotes, support findings, audit observations, draft conclusions, or temporary source evidence.

## Trigger decision

Run this skill only when all three conditions are true:

1. The request is a LightSpeed website discovery, website audit, discovery pack, or discovery-readiness task.
2. The current request or downstream discovery workflow needs reusable defaults such as `client_name`, `website_url`, `primary_goal`, `default_output_mode`, `preferred_template`, approval context, or standing project preferences.
3. Those reusable defaults are missing from both the current request and `discovery-user-defaults.yaml`.

Skip this skill when:

- the user provided enough context to complete the task now
- the request is only a rewrite, cleanup, summary, or formatting pass
- the request is about run-specific evidence intake from notes, links, transcripts, files, emails, issues, or feedback
- the request is reviewing an existing discovery output
- the request needs a specialist discovery assessment rather than reusable defaults
- asking onboarding questions would block useful partial progress unnecessarily

## Routing rules

Treat onboarding as a lightweight prerequisite. Do not let it capture work that belongs to a specialist skill.

Route according to `references/related-skill-routing.md`:

- Use this skill first only when missing reusable defaults would make the specialist workflow unsafe or repetitive.
- Use `discovery-source-intake` when the task needs current-project evidence gathered or normalised.
- Use `discovery-pack-review` when a draft discovery pack, section, or client summary already exists and needs QA.
- Use the specialist reviewer skills for hosting, performance, content, email lists, and security when the user asks for those assessments.
- Use broader LightSpeed project intake, PRD, launch, QA, or implementation skills when the request has moved beyond discovery.

When both onboarding and another discovery skill apply, do this sequence:

1. Extract and save any reusable defaults already present in the request.
2. Ask only for the first missing required default if the downstream task cannot proceed safely without it.
3. Continue into the specialist skill as soon as the minimum required defaults are present.

## Preflight workflow

1. Read `references/onboarding-contract.yaml`.
2. Read `discovery-user-defaults.yaml` from Memory if it exists.
3. Check the current request against the contract trigger, skip, and route rules.
4. Identify any contract-defined defaults already supplied by the user.
5. Save supplied durable defaults under the exact `store_as` keys from the contract.
6. Re-check required state after saving request-supplied values.
7. If required state is present, continue the original request or route to the appropriate related skill.
8. If required state is missing, ask only the smallest useful onboarding batch.

## Input handling rules

### Partial inputs

If the user gives partial project context, save what is durable and ask only for the missing required field that blocks the current task.

Example:

- User provides client name and goal but no URL.
- Save `client_name` and `primary_goal`.
- Ask only for `website_url`, unless the task can proceed without it.

### Multiple clients or websites

If the user mentions multiple clients, sites, domains, brands, or publications:

- do not merge them into one memory record
- ask which client/site should be treated as the active discovery default
- save shared network-level defaults only when the user clearly presents them as reusable across the whole programme

### Ambiguous source material

If the user supplies notes, links, transcripts, attachments, emails, Asana items, GitHub issues, or feedback:

- treat those as run-specific evidence
- route to `discovery-source-intake` after saving any clearly durable defaults
- do not store the evidence itself in Memory

### Existing drafts

If the user provides or references an already assembled discovery pack, section, client summary, or follow-up document:

- route to `discovery-pack-review`
- use onboarding only if reusable project defaults are missing and needed for the review

### Specialist discovery areas

If the request is primarily about hosting, performance, content, email list quality, security, technical SEO, analytics, redirects, claims, policy/governance, or launch readiness:

- use the relevant specialist skill directly
- run onboarding only if the specialist workflow needs missing reusable project defaults

### Output preference

If the user does not specify output mode, default to LightSpeed internal working output.

Use client-facing wording only when the user explicitly asks for a client-ready, client-facing, shareable, proposal-ready, or stakeholder-facing document.

## Onboarding batches

Ask in small batches, not as a long intake form. Treat each batch as one concise question that covers closely related fields.

### Batch 1: project basics

Ask this first only when required state is missing.

Collect only:

- `client_name`
- `project_name` when the user distinguishes it from the client name
- `website_url`
- `primary_goal`

### Batch 2: business and scope context

Ask only when the current task would materially benefit from standing setup details.

Collect when useful:

- `business_summary`
- `target_audience`
- `key_pages`
- `required_features`
- `content_needs`
- `integrations`

Do not block the current task on this batch unless the missing detail prevents a correct output.

### Batch 3: delivery and approval context

Ask only when standing delivery assumptions affect the requested output.

Collect when useful:

- `timeline`
- `budget_range`
- `stakeholders`
- `decision_process`
- `discovery_lead`

Do not block the current task on this batch unless approval or delivery context is essential.

### Batch 4: output and template preferences

Ask only when output preferences are not obvious and materially affect the current deliverable.

Collect when useful:

- `default_output_mode`
- `preferred_template`
- `pack_preferences`

Use safe defaults when the user does not provide these preferences.

## Completion rules

- Completion requires the required state from the contract, not every optional field.
- Once the required state is present, stop onboarding and resume or route the original request.
- Confirm only the defaults that matter for the current task.
- Do not summarise onboarding for its own sake.
- Do not ask the user to restate information that is already in the request, memory, or available source evidence.

## Output rules

When onboarding runs, respond with one of these patterns:

1. **Small missing-field question** — ask the minimum needed to proceed safely.
2. **Saved-default confirmation plus continuation** — briefly confirm saved defaults and continue the requested task.
3. **Routing continuation** — briefly state the chosen next workflow only when helpful, then continue.

When onboarding does not run, do not mention it. Continue the user's original request or route to the correct related skill.

## LightSpeed team usability rules

- Prefer concise, practical prompts that a teammate can answer quickly.
- Keep internal and client-facing outputs separate.
- Preserve approval and evidence boundaries: confirmed, assumed, inferred, unresolved, internal note.
- Avoid generic agency discovery language when a LightSpeed-specific project, WordPress build, block theme, WooCommerce site, publishing site, tourism site, or AI-readiness workflow is implied.
- Ask no more than one focused question before making useful progress, unless the user explicitly asks for a full intake form.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

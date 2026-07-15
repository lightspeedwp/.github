# LightSpeed project onboarding reference

## Purpose

This reference describes the staged onboarding flow used when a project-specific AI readiness request is missing a reusable project anchor or when reusable template defaults should be captured for future runs.

The goal is to collect the smallest amount of missing context needed to continue the assessment correctly, save that context for future runs, and return to the original task quickly.

## When onboarding should run

Use onboarding only when all of the following are true:

- the request is for a project-specific readiness assessment, estimate-confidence review, blocker analysis, or another template-backed project output
- the current request does not already identify the project clearly enough to proceed
- there is no reusable project anchor already available from Memory for that user

Do not run onboarding for one-off questions, workflow explanations, setup changes, or requests that already include a reliable project identifier such as:

- client and project name
- website or domain
- repository name
- Figma file reference
- another clear project identifier

## Core onboarding sequence

### Step 1: Resolve the project anchor

Ask for one concise project anchor first.

A valid project anchor may be:

- client name and project name
- website or domain
- repository name
- Figma file reference
- another clear project identifier

Preferred question:

> Which client project should I treat as the default assessment context? You can give me the client and project name, or just the website, repo, or Figma file if that is the clearest anchor.

If the current request already provides one of these, do not ask again. Save it and continue.

### Step 2: Infer reusable template defaults where possible

Once the project anchor is known, try to capture reusable values from grounded project evidence before asking the user to restate them.

Examples:

- company name from the strongest website or brief
- website URL and domain from the project anchor or approved source list
- project name from the clearest reusable project source
- project type and sector from the strongest current evidence
- recurring Drive, Figma, or GitHub links from approved reference sources

Only save durable values that are likely to help across future runs.

### Step 3: Resume the task as soon as possible

Once the project anchor is known, resume the original readiness task immediately unless another missing value truly blocks correct execution.

Do not expand into a long intake sequence.

### Step 4: Ask optional defaults only when they help future runs

Optional defaults may be collected only when they would materially improve repeated use for the same user.

Examples:

- default assessment focus
- preferred source priority
- durable project contacts or approvers
- main reference links used repeatedly in templates
- confirmed package-scoping defaults such as delivery type, requested packages, fixed-fee eligibility, likely add-ons, and recurring scope triggers

These are not blockers for the current task.

## Required vs optional state

### Required state

- `project_anchor`

This is the only required onboarding value by default.

### Optional state

- `company_name`
- `project_name`
- `website_url`
- `primary_domain`
- `sector`
- `project_type`
- `client_lead`
- `internal_lead`
- `content_owner`
- `final_approver`
- `target_launch_date`
- `assessment_focus`
- `preferred_source_priority`
- `primary_drive_link`
- `primary_figma_link`
- `primary_github_link`
- `primary_reference_links`
- `project_delivery_type`
- `project_requested_packages`
- `is_fixed_fee_eligible`
- `recommended_add_ons`
- `possible_custom_scope_triggers`

If unsure whether a value is required, treat it as optional.

## Memory rules

Store onboarding defaults in Memory for the same user.

Use a compact state file:

- `lightspeed-project-defaults.yaml`

Use the standard structure in `gpt-knowledge/17-package-defaults-memory-structure.md`.

Store only durable defaults that should help future runs, such as:

- reusable project anchor
- reusable template placeholders
- default assessment focus
- preferred source priority
- approved recurring reference links
- confirmed package-scoping defaults

Do not store one-off task details, speculative conclusions, or scratch notes as onboarding state.

## Skip conditions

Skip onboarding when:

- the current request already identifies the project clearly enough
- the task is not a project assessment or template-backed project output
- the current request includes a website, repository, design file, or other reliable identifier even if Memory is empty

## Behaviour rules

- Ask one concise question at a time.
- Start with the project anchor.
- Do useful work before asking optional follow-ups.
- Keep onboarding lightweight and task-triggered.
- Infer reusable values from grounded links or evidence where possible.
- Save durable defaults using the standard Memory structure.
- After the required state is satisfied, continue the original request immediately.
- Do not summarise onboarding for its own sake.

## Example behaviour

### Example A: enough context already provided

User request:

> Assess AI readiness for african safaris using the website https://www.africansafaris.com/ and any connected project evidence.

Action:

- skip onboarding
- use the website as the project anchor
- continue the assessment

### Example B: missing project anchor

User request:

> Assess the readiness of that safari project.

Action:

- ask for the project anchor
- save the answer in Memory
- continue the assessment once the anchor is known

### Example C: repeated future run with templates

User request:

> Create the internal package definition sheet for the same project.

Action:

- reuse the saved project anchor and saved template defaults from Memory
- fill any grounded placeholders such as company name, project type, and reference links
- ask only if a truly necessary value is still missing
- continue the output without re-running full onboarding

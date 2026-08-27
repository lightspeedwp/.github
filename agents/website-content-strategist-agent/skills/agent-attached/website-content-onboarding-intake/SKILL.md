---
name: website-content-onboarding-intake
description: Collect first-run user defaults needed for new website-content scenarios such as tour operator sites, WooCommerce stores, standard WordPress sites, one-off page recommendations, launch reviews, policy pages, FAQ/chatbot content, and related LightSpeed website-content work.
---

# Website Content Onboarding and Intake

## When to use this skill

Use this skill only when the current request starts a new website-content initiative or switches to a new website-content scenario and the request is missing user-specific intake defaults listed in `references/onboarding-contract.yaml`.

Typical scenarios include:

- tour operator website content
- WooCommerce online store website content
- standard WordPress brochure or service website content
- one-off page recommendation or page review work
- website refresh or restructure planning
- launch-readiness or go-live QA work
- policy, trust, accessibility, or governance page work
- FAQ consolidation or chatbot-safe source preparation
- AI-readiness, AI-governance, or chatbot-planning content work
- lead-generation service-page or solution-page drafting
- case-study, proof, or conversion-page content work

Do not use this skill when the current request can be completed from the current message, existing Memory state, and attached context alone.

## Memory state

Use {{label:Memory,id:file_persistence,type:file_persistence}} as the backing store for the onboarding keys in `references/onboarding-contract.yaml`.

Persist those keys for the current runtime end user in a single compact state file named `website-content-intake.yaml`, and read that file before asking the user to restate defaults.

Do not use Memory as a general transcript or scratchpad. Store only durable intake defaults that should be reused across future runs for the same runtime end user.

## Supporting Files

- `references/onboarding-contract.yaml` — use this to decide when onboarding should run, which fields are required, which are optional, and when to skip intake.

## Preflight

1. Read `references/onboarding-contract.yaml`.
2. Read `website-content-intake.yaml` from Memory if it exists.
3. Compare the current request and available persisted state against the contract's `trigger_when` and `required_state` fields.
4. If no trigger matches, skip this skill and continue the user's original request.
5. If the current request already provides any contract-defined defaults that are missing from Memory, persist those values to `website-content-intake.yaml` using the contract's `store_as` keys.
6. Re-check `required_state` after persisting request-supplied values. If all required state is now present, skip user questions and continue the user's original request.
7. If required state is still missing, ask only for the missing required field or fields.

## Onboarding workflow

1. First classify the request into the closest website-content scenario from the contract.
2. Ask one concise question at a time.
3. Block only on fields in `required_state` that are genuinely needed to continue correctly.
4. Use safe defaults for fields in `optional_state` when the user does not provide them.
5. Persist collected answers to `website-content-intake.yaml` using the contract's `store_as` keys.
6. After the required fields are satisfied, stop onboarding immediately and resume the user's original request.

## Scenario intake rules

- Treat `scenario_type` as the main routing key for future work.
- Prefer the most practical scenario label instead of asking the user to choose from a long menu.
- If a request clearly signals a scenario, persist it without asking the user to repeat it.
- If a request could fit several scenarios, choose the closest one based on the user's immediate output need.
- Use `project_type_notes` only when a short note would materially improve future routing.

Default scenario labels:

- `tour-operator-website`
- `woocommerce-store`
- `standard-wordpress-website`
- `one-off-page-recommendation`
- `website-refresh-or-restructure`
- `launch-qa-or-go-live-readiness`
- `policy-or-trust-page`
- `faq-or-chatbot-source-prep`
- `ai-governance-or-chatbot-planning`
- `lead-gen-service-or-solution-page`
- `case-study-or-proof-page`
- `resource-or-landing-page`

## Minimal intake rules

When intake is needed, prioritise these pieces of context:

1. the scenario type
2. the project or website name if the work spans future related requests
3. the preferred output destination or working format only when it materially affects future runs

Do not turn onboarding into a full project brief.

Do not ask for audience, page inventory, source files, governance detail, CTA strategy, or SEO detail during onboarding unless the current task cannot proceed safely without them. Those belong in the user's request or later workflow-specific steps.

## Output

Do not summarize onboarding for its own sake. Confirm only the intake defaults that matter for the current task, then continue the user's original request.

If this skill is used inside an intake-style review, source-review, planning-review, or "what should happen next" response:

- do not emit a standalone raw onboarding document as the final user-facing output
- hand off your findings into the outer required review wrapper instead
- keep your contribution limited to the intake findings, defaults, and missing required state
- let the final packaging layer present the exact review section order, readiness section, gap labels, and ending divider
- if the outer packaging layer is unavailable or would otherwise be skipped, fall back to the exact intake-review wrapper rather than a raw onboarding summary
- in that fallback, use these exact sections in order:
  - `## Confirmed context`
  - `## Missing intake`
  - `## Working defaults for now`
  - `## Recommended workflow`
  - `## Approval and readiness state`
  - `## Best next step`

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

# Gravity Forms Configuration WordPress Scope Cleanup Prompt

Audit and clean the attached local `gravity-forms-configuration` skill so it fits this specific **WordPress Configuration Agent** and no longer carries default WooCommerce or tour-operator scope.

Scope and intent:

- This is a skill-cleanup and adaptation task, not a broad rewrite of the whole agent.
- Treat the attached local `gravity-forms-configuration` skill as the primary cleanup target.
- Treat the current agent instructions, current attached local skills, and current attached file tree as supporting context.
- Focus on removing or isolating WooCommerce-specific and tour-operator-specific assumptions while preserving broadly useful WordPress + Gravity Forms capability.

Primary goal:

- Make `gravity-forms-configuration` behave like a WordPress-focused Gravity Forms skill for this agent, without defaulting to WooCommerce or tour-operator workflows unless a future split package is intentionally maintained.

Source of truth:

- the actual contents of the attached local `gravity-forms-configuration` skill
- the current attached local skill inventory
- the current system instructions for this agent
- current attached maintenance references where they materially affect the skill’s fit

What to review:

1. `SKILL.md` and any skill metadata files
2. examples, profiles, intake files, references, templates, fixtures, schemas, scripts, tests, and rollout notes inside the skill package
3. any explicit references to:
   - WooCommerce enquiry or checkout-adjacent flows
   - tour operator or travel enquiry flows
   - booking, itinerary, reservation, traveller, or destination workflows
   - store, cart, checkout, order, tax, shipping, subscription, or fulfilment assumptions
4. any connected maintenance references that should stay aligned if the skill is updated

What to check for:

- stale WooCommerce-specific guidance that does not fit this WordPress-focused agent
- stale tour-operator-specific guidance that does not fit this WordPress-focused agent
- profiles, references, tests, or examples that bias outputs toward ecommerce or travel workflows
- routing or boundary wording that still assumes WooCommerce or tour-operator work is part of the default skill identity
- generic Gravity Forms capability that should be preserved for WordPress enquiries, quotes, onboarding, lead capture, validation, notifications, confirmations, anti-spam, privacy, and QA work

Required scope rule:

- Treat this agent as a **WordPress-focused** configuration agent.
- Do not keep WooCommerce-specific or tour-operator-specific scope as part of the default `gravity-forms-configuration` skill identity.
- If those assets are worth preserving, recommend splitting them into a separate companion skill/package instead of leaving them embedded as default scope.

Editing rules:

- Make the smallest complete set of changes needed.
- Preserve still-correct WordPress and Gravity Forms guidance.
- Be explicit about what should be kept, rewritten, split, or removed.
- Do not broaden scope into unrelated app, Memory, Slack, or non-Gravity-Forms business-domain rewrites.
- If a file is already suitable for a WordPress-focused Gravity Forms skill, leave it unchanged.

Expected output:

1. Files reviewed
2. Files updated
3. WooCommerce-specific references removed or isolated
4. Tour-operator-specific references removed or isolated
5. Files recommended for keep, rewrite, split, or remove
6. Any nearby maintenance docs that should also be updated
7. A clear statement on whether `gravity-forms-configuration` is now aligned with this WordPress Configuration Agent

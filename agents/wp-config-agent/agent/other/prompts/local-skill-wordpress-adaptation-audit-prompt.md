# Local Skill WordPress Adaptation Audit Prompt

Audit a specified attached local skill and report the improvements needed to adapt that skill to this specific `WordPress Configuration Agent` while removing references to `tour operator configuration agent` and WooCommerce-specific assumptions.

Scope and intent:

- This is a skill-audit and adaptation-planning task, not a broad rewrite of the whole agent.
- Treat the specified attached local skill as the primary audit target.
- Treat the current agent instructions, current attached file tree, current attached skills, and current maintenance references as supporting context.
- Focus on adaptation work needed to make the specified local skill fit this `WordPress Configuration Agent` cleanly.
- Treat this agent as purely WordPress-focused, with no tour operator or WooCommerce-related plugins installed unless current grounded evidence explicitly shows otherwise.

Primary goal:

- Identify where the specified local skill still reflects `tour operator configuration agent` language, WooCommerce language, assumptions, workflows, examples, or outputs, and produce a concrete improvement plan for adapting it to this `WordPress Configuration Agent`.

Required inputs:

- the exact attached local skill to audit
- the current agent context for this `WordPress Configuration Agent`

Source of truth:

- the actual contents of the specified attached local skill
- the current attached local skill inventory
- the current system instructions for this agent
- the current attached file tree and maintenance references where they materially affect the skill’s fit

What to review:

1. The specified attached local skill’s name, description, instructions, examples, defaults, and reference files
2. Any explicit references inside that skill to:
   - `tour operator configuration agent`
   - WooCommerce workflows or assumptions
   - tour operator workflows
   - travel, booking, reservation, or package assumptions
   - domain-specific outputs that do not fit this `WordPress Configuration Agent`
3. Any places where the skill should instead reflect WordPress-specific:
   - site configuration
   - content structure and page architecture
   - plugin and settings workflows
   - forms, SEO, accessibility, QA, and launch-readiness work where relevant
   - WordPress remediation and reporting workflows
4. Any connected maintenance references or prompt files that should stay aligned if the skill is updated

What to check for:

- stale references to `tour operator configuration agent`
- stale WooCommerce, product, cart, checkout, payment, shipping, tax, account, store, or catalogue language that does not fit this WordPress-focused agent
- stale tour operator, itinerary, travel, booking, reservation, or package language that does not fit WordPress work
- examples, checklists, or outputs that imply the wrong business domain
- missing WordPress-specific guidance needed for this agent’s actual role
- naming, summary, or instruction text that should be tightened for WordPress use
- references to shared, workspace, directory, or superseded skill variants when the attached local skill is the source of truth

Editing rules:

- Make the smallest complete set of improvement recommendations needed.
- Be explicit about what should be removed, rewritten, or added.
- Do not invent new attached skills or unrelated workflows.
- Do not broaden scope into unrelated app, Memory, Slack, or business-domain rewrites outside the specified skill.
- Preserve still-correct WordPress guidance that already fits this agent.
- Remove WooCommerce-specific guidance unless current grounded evidence shows that the specified skill truly needs it for this agent.

Output:

1. The local skill audited
2. A summary of how well it currently fits this `WordPress Configuration Agent`
3. Every stale `tour operator configuration agent`, WooCommerce-specific, or other out-of-scope business-domain reference found
4. Recommended changes to adapt the skill for WordPress use
5. Any specific wording, examples, defaults, or outputs that should be replaced
6. Any nearby maintenance files or references that should also be updated if the skill is changed
7. A clear statement on whether the specified local skill is already suitable for this `WordPress Configuration Agent` or still needs adaptation

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

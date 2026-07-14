# Discovery Template Field Definitions

Use these placeholder fields consistently across all discovery templates.

## Core project fields
- `{{client_name}}` — client or company name
- `{{project_name}}` — internal or client-facing project name
- `{{website_url}}` — current website or primary web presence
- `{{session_date}}` — date of the discovery session or summary
- `{{discovery_lead}}` — person leading the discovery work
- `{{document_version}}` — version shown in the metadata block
- `{{last_updated}}` — last updated date or timestamp shown in the metadata block

## Business context
- `{{business_summary}}` — short plain-language business overview
- `{{primary_goal}}` — main reason for the website project
- `{{target_audience}}` — primary users or audiences

## Scope and content
- `{{current_website_notes}}` — current-state observations about the site
- `{{key_pages}}` — important pages or sections expected
- `{{content_needs}}` — content requirements, gaps, or migration needs
- `{{required_features}}` — functional requirements or must-have features
- `{{integrations}}` — systems, tools, or platforms that must connect
- `{{design_brand_ux}}` — branding, visual direction, UX expectations, or design-system notes
- `{{seo_analytics_marketing}}` — SEO requirements, analytics setup, marketing tooling, or traffic considerations

## Delivery context
- `{{timeline}}` — target timing, milestone window, or urgency
- `{{budget_range}}` — known or estimated budget range
- `{{stakeholders}}` — key people involved in review or approval
- `{{decision_process}}` — how decisions and approvals are made

## Discovery analysis fields
- `{{confirmed_facts}}` — information directly confirmed by source material or the user
- `{{assumptions}}` — likely but unconfirmed statements
- `{{inferred_observations}}` — reasoned conclusions drawn from the available material
- `{{open_questions}}` — missing points that still need confirmation
- `{{internal_notes}}` — internal-only LightSpeed commentary, concerns, or recommendations

## Follow-up fields
- `{{decisions_needed}}` — decisions that must be made to move forward
- `{{risks_and_dependencies}}` — blockers, dependencies, or delivery risks
- `{{owners_and_status}}` — owner and current status for follow-up items
- `{{next_steps}}` — recommended actions after the session
- `{{relevant_references}}` — concise list of references actually collected during onboarding, intake, or current-source gathering

## Usage notes
- Leave a placeholder empty only when the source material truly does not support a value.
- Do not invent values just to fill placeholders.
- For client-facing outputs, exclude placeholders that map to internal-only content, especially `{{internal_notes}}`.
- All substantial documents should begin with a main title, one divider line, a metadata block with bolded labels including `{{document_version}}`, then one more divider line.
- End substantial documents with a `Relevant References` section when supported, followed by exactly one final divider line.
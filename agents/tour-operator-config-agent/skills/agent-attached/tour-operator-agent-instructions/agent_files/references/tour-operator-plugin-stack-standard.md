# Tour Operator Plugin Stack Standard

Use this reference for the expected plugin-layer audit and configuration order on a **tour operator WordPress website**.

## Priority order

1. LightSpeedWP Tour Operator core plugin
2. LightSpeedWP Tour Operator extension plugins
3. Gravity Forms
4. Yoast SEO or Yoast SEO Premium
5. Supporting operational or utility plugins

## First-party LightSpeed stack

Core plugin:

- `Tour Operator`
- GitHub: `https://github.com/lightspeedwp/tour-operator`
- WordPress.org: `https://wordpress.org/plugins/tour-operator`

Known extensions:

- `TO Team`: `https://github.com/lightspeedwp/to-team`
- `TO Specials`: `https://github.com/lightspeedwp/to-specials`
- `TO Reviews`: `https://github.com/lightspeedwp/to-reviews`
- `Wetu Importer`: `https://github.com/lightspeedwp/wetu-importer`

Treat this as the preferred first-party baseline for LightSpeed tour operator websites unless a specific project has approved a different stack.

## Built-in core content model

Use `tour-operator-content-model-standard.md` as the detailed reference for the built-in Tour Operator content model.

The default core plugin model is:

- `accommodation` for lodging entities, room/unit details, facilities, pricing, ratings, media, and links to tours or destinations
- `destination` for hierarchical geographic discovery and destination travel information
- `tour` for the primary commercial travel product, including pricing, duration, itinerary, start/end destinations, media, and related accommodation or destinations

Do not treat `Reviews`, `Team`, `Specials`, `Vehicles`, or Wetu-synced objects as built-in core until the active extension stack confirms them.

Before recommending new content types, field frameworks, or custom taxonomies, check whether the existing core model already provides the needed CPT, field, taxonomy, or relationship.

## Core plugin checks

- Confirm whether the LightSpeedWP Tour Operator core plugin is installed, active, and versioned
- Confirm the plugin is active and structurally healthy
- Confirm the built-in CPTs are available as expected: `accommodation`, `destination`, and `tour`
- Confirm expected core taxonomies are present where relevant: `brand`, `accommodation-type`, `continent`, `facility`, and `travel-style`
- Confirm relationship fields are being used before assuming tours, destinations, accommodation, and posts are disconnected
- Confirm the plugin supports the required entities, workflows, and relationships before recommending custom alternatives
- Confirm its settings align with the site’s content model and enquiry flow

## Extension plugin checks

- Identify installed LightSpeedWP Tour Operator extension plugins
- Confirm extension purpose and whether each extension is still needed
- Check whether extension settings are consistent with the core plugin workflow
- Flag inactive, duplicate, conflicting, or misaligned extensions
- Treat absent extensions as open configuration decisions unless the site’s commercial model requires them

## Reporting requirements

Always separate:

- core plugin findings
- extension plugin findings
- Gravity Forms findings
- Yoast findings
- general WordPress findings

## Configuration expectations

- Core and extension plugin settings should be reviewed before general plugin polish
- Plugin configuration changes should be verified after edits where tools allow verification
- Reports should clearly flag blockers, misconfiguration, risks, and next actions
- Do not recommend alternative tour operator plugins before checking whether the first-party LightSpeed stack is intended for the project
- Do not recommend ecommerce, checkout, cart, booking, or payment plugins unless the user explicitly confirms that the site needs online booking or payment behaviour

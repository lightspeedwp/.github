# Technical Context

## Known technical scope

- WordPress implementation required
- refreshed Figma design system required
- GA4 tracking required
- destination pages, tour detail pages, enquiry forms, blog content, and editable campaign landing pages are in scope

## Working technical recommendation

- prefer a block-first WordPress build using `theme.json` tokens, reusable patterns, and template-based editing
- keep editor flexibility high, but use governed patterns and block constraints to avoid layout drift
- use core blocks where possible and reserve custom block or plugin work for genuinely structured tour content, reusable enquiry modules, or integration-led UI

## Unresolved technical inputs

- full integration scope
- migration complexity and redirect requirements
- hosting and deployment model
- spam prevention, consent tooling, and analytics event detail
- whether booking or inventory systems affect the content model

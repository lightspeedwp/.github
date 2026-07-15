# Component to Block Mapping

## Mapping decisions

Use the lightest maintainable WordPress implementation:

1. Core block when the design can be achieved with native blocks and styles.
2. Core block variation when layout or presets repeat.
3. Block pattern when a section is a reusable composition.
4. Custom block when behaviour, structured data or controlled editing requires it.
5. Plugin feature when it must be shared across themes or projects.

## Component map table

| Figma component | WordPress implementation | Type | Data needs | Editor controls | Notes |
|---|---|---|---|---|---|

## Common examples

| Figma component | Preferred WordPress option |
|---|---|
| Button | Core Button style variation |
| Card | Group/Columns pattern or custom block if data-driven |
| CTA band | Pattern |
| Hero | Template pattern or page-level pattern |
| Feature grid | Pattern, or custom block for repeatable structured items |
| Accordion/FAQ | Core/details pattern or custom FAQ block if schema-controlled |
| Testimonial | Pattern or custom block if sourced from CPT |
| Case study card | Query Loop variation or custom block |

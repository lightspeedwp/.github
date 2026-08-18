# WordPress Tour Operator Standard

Use this reference for the default recommended structure of a **tour operator website built on WordPress**.

## Core defaults
- Static homepage with a clear value proposition and enquiry path
- Structured content for tours, destinations, accommodations, and trust-building content
- Search-friendly landing pages for high-intent travel themes and locations
- Compliance-aware lead capture
- Mobile-first launch QA

## Recommended focus areas
- LightSpeedWP Tour Operator core plugin configuration before general plugin polish
- LightSpeedWP Tour Operator extension plugin readiness and consistency
- Strong enquiry flows that help qualify leads
- Destination and travel-style visibility
- Clear internal linking between tours, destinations, accommodations, and supporting content
- Launch readiness across plugin stack, forms, SEO, content structure, and conversion paths

## Preferred LightSpeed plugin baseline

For LightSpeed tour operator websites, first check and prefer the first-party plugin stack:

- `Tour Operator`: `https://github.com/lightspeedwp/tour-operator and `https://wordpress.org/plugins/tour-operator
- `TO Team`: `https://github.com/lightspeedwp/to-team
- `TO Specials`: `https://github.com/lightspeedwp/to-specials
- `TO Reviews`: `https://github.com/lightspeedwp/to-reviews
- `Wetu Importer`: `https://github.com/lightspeedwp/wetu-importer

Use first-party extensions only when they match the commercial model: expert-led/team-led positioning, specials-led offers, review-led trust signals, or Wetu-integrated tour content.

## Expected content structure
- Use `tour-operator-content-model-standard.md` as the detailed source for core CPTs, fields, taxonomies, and relationships
- Core built-in post types are `Tours`, `Destinations`, and `Accommodation`
- `Tours` are the primary commercial travel products
- `Destinations` are hierarchical and should drive geographic discovery, internal linking, and SEO structure
- `Accommodation` should be used when lodging choice, room/unit detail, facility filtering, or tour-accommodation relationships matter
- Additional post types such as Reviews, Team, Special Offers, Vehicles, or Wetu-imported structures should be treated as extension-backed or project-specific until the active plugin stack confirms them
- Core taxonomies should support travel styles, accommodation brands/types/facilities, and destination continent hierarchy before new custom taxonomies are introduced
- Relationship fields should be preferred over manual duplicate links between tours, destinations, accommodation, and editorial posts

## Plugin-stack priorities
- Identify the active LightSpeedWP Tour Operator core plugin first
- Identify active first-party extension plugins next
- Confirm the plugin stack supports the required content model, enquiry flow, SEO, and handoff requirements
- Treat Gravity Forms and Yoast SEO as important supporting plugins layered onto the core tour operator implementation
- Do not recommend alternative tour operator plugins unless the project explicitly uses another stack or the first-party stack cannot meet a confirmed requirement

## Configuration priorities
- Homepage and reading settings should support a static front page and a clear blog or news section when needed
- Navigation should prioritise tour discovery, destination discovery, trust signals, and enquiry conversion
- Forms should support rapid enquiry handling and clear user expectations
- SEO setup should prioritise destination pages, tour pages, machine-readable structure, and Yoast SEO configuration quality
- Launch QA should check key plugin flows, conversion routes, mobile usability, and notification delivery

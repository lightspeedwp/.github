# Implementation workflows

Use only when the user clearly asks for changes. Read first and audit first.

## Required implementation structure

Every implementation change or implementation plan must include:

1. Pre-change inspection.
2. Risk classification.
3. Change plan.
4. Execution steps.
5. Verification steps.
6. Rollback or manual recovery note.
7. Evidence summary.
8. Handoff note.

## Risk classes

- Low: reversible settings or content edits with clear verification.
- Medium: taxonomy, relationship, template or form-routing changes.
- High: imports, bulk edits, schema output changes, plugin activation/deactivation, production changes.

## Supported implementation routes

### WordPress core settings

Inspect current settings, classify risk, plan changes, execute only with confirmed tooling, verify frontend/admin impact and note rollback.

### Tour Operator core plugin settings

Confirm core plugin status and version first. Use source-backed content model files before changing CPT, taxonomy, relationship or template behaviour.

### First-party extensions

Confirm extension active/versioned before configuring. Do not create or correct extension content from core assumptions.

### Tours, Destinations and Accommodation

Use `post-types.json` and `taxonomies.json` to validate fields and taxonomy usage. Verify sample content after changes.

### Taxonomies and terms

Check taxonomy ownership, object type associations and rewrite slugs before adding or changing terms.

### Relationship repairs

Use `relationships.json` to understand relationship/facet sources. Verify relationship storage and frontend/search output before and after repair.

### Gravity Forms enquiry workflows

Inspect forms, notifications, confirmations, anti-spam and consent before changing. Verify with a test submission where allowed.

### Yoast SEO settings

Inspect content-type settings, breadcrumbs, sitemaps, canonicals and schema output before changing. Avoid unsupported rich-result promises.

### JSON-LD developer handoff

Do not implement schema by assertion. Prepare field maps, graph strategy, dedupe rules, validation steps and open questions.

### Block-theme templates and patterns

Inspect active theme, template hierarchy, query loops and dynamic field output before changing. Verify frontend and editor experience.

### GitHub issue drafts

Draft clear issues with evidence, scope, acceptance criteria, test steps, risk and owner suggestion. Do not create issues unless explicitly asked and tooling confirms.

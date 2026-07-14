# Acceptance criteria library

Reusable acceptance criteria for Tour Operator website work. Adapt only after checking current evidence and scope.

## Core CPT criteria

```markdown
- [ ] Given the Tour Operator core plugin is active, when an editor views the WordPress admin menu, then `Tours`, `Destinations`, and `Accommodation` are available according to the confirmed plugin configuration.
  - Evidence required: admin screenshot or plugin/source confirmation.
  - Scope: core
```

```markdown
- [ ] Given a published destination with child destinations, when the destination archive or listing is viewed, then hierarchy-dependent output behaves as documented for the current template and no unsupported hierarchy is assumed for tours or accommodation.
  - Evidence required: URL and template/admin evidence.
  - Scope: core | theme
```

## Field output criteria

```markdown
- [ ] Given a source-backed field such as `price`, `sale_price`, `duration`, or `single_supplement`, when it is displayed publicly, then the output is treated as display text unless structured storage has been separately verified.
  - Evidence required: content-model reference and rendered page.
  - Scope: core | schema
```

```markdown
- [ ] Given a best-time-to-visit field is populated, when it is rendered or filtered, then month values match the source-backed option values and missing values fail gracefully.
  - Evidence required: admin field value and front-end output.
  - Scope: core | theme
```

## Relationship and FacetWP criteria

```markdown
- [ ] Given a destination relationship facet source exists, when FacetWP indexes destination-linked content, then it supports filtering without being treated as proof that the linked entity is core-owned.
  - Evidence required: FacetWP source key and index/filter test.
  - Scope: relationship | facetwp
```

## Gravity Forms criteria

```markdown
- [ ] Given a user submits an enquiry from a tour, destination, or accommodation page, when the form entry is created, then the submitted entry captures the source page/context needed for the sales team to follow up.
  - Evidence required: test entry and notification evidence.
  - Scope: form
```

## Yoast/schema criteria

```markdown
- [ ] Given Yoast SEO is active, when structured-data output is inspected, then existing Yoast graph output is documented before any Tour Operator schema addition is proposed.
  - Evidence required: schema output or validation screenshot.
  - Scope: schema | yoast
```

```markdown
- [ ] Given no verified Tour Operator JSON-LD implementation exists, when schema recommendations are produced, then they are labelled as readiness, mapping, validation, or developer handoff rather than completed implementation.
  - Evidence required: repository/live inspection note.
  - Scope: schema
```

## Block theme criteria

```markdown
- [ ] Given a Tour Operator single template is edited, when a published item is viewed on desktop and mobile, then title, featured image, content, source-backed fields, enquiry CTA, and related content render without layout breakage.
  - Evidence required: URLs or screenshots.
  - Scope: theme | launch
```

## Launch criteria

```markdown
- [ ] Given a Tour Operator website is ready for launch review, when critical paths are tested, then browsing, filtering, enquiry submission, SEO basics, schema readiness notes, and editor handoff checks are either passed or explicitly blocked.
  - Evidence required: launch QA matrix.
  - Scope: launch
```

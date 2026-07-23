# Acceptance test planning

Use this workflow when turning a Tour Operator audit, implementation plan, launch checklist, bug fix, content-model change, Gravity Forms change, Yoast/schema change, Wetu import change, or block-theme handoff into testable acceptance coverage.

## Principles

- Start from confirmed scope and evidence, not ideal feature wishes.
- Test core before extensions: `tour`, `destination`, and `accommodation` first.
- Keep extension coverage separate unless the extension is confirmed active or explicitly in scope.
- Treat prices, sale prices, ratings, reviews, availability, schema, and enquiry routing as high-risk evidence-sensitive areas.
- Include editor experience checks when templates, patterns, query loops, field output, or admin workflows are affected.

## Test-plan sequence

1. Identify the change, audit finding, or launch area being tested.
2. Confirm environment: local, staging, production, or documentation-only.
3. List source evidence and unresolved assumptions.
4. Map affected content types: `tour`, `destination`, `accommodation`, extension-owned, Wetu-synced, or unknown.
5. Define acceptance criteria before test steps.
6. Add positive tests, negative tests, regression tests, and editor-experience checks.
7. Add responsive, accessibility, SEO/schema, form-routing, and performance checks only where relevant.
8. Define pass/fail evidence required: screenshot, URL, admin setting, form entry, email notification, schema output, log entry, or code reference.
9. Mark any test blocked by missing access or missing source data.

## Acceptance criteria format

Use this format for each criterion:

```markdown
- [ ] Given [confirmed context], when [user/editor/system action], then [observable result].
  - Evidence required:
  - Risk covered:
  - Scope: core | extension | integration | theme | form | schema | launch
```

## Required coverage by area

### Core content model

- CPT appears only when confirmed registered.
- Source-backed fields render where expected and do not imply structured data that does not exist.
- Hierarchical behaviour is tested for `destination` only unless source evidence changes.
- Archive behaviour is tested for `destination` and `accommodation` where source-backed; `tour` archive must not be assumed unless confirmed.

### Relationships and FacetWP

- Destination relationship facet sources are tested as indexing/filter sources, not entity ownership proof.
- Extension-facing references remain disabled, hidden, or marked blocked unless the relevant extension is active and confirmed.
- Parent/child destination behaviour is tested when hierarchical destination filters are in scope.

### Gravity Forms enquiries

- Tour/accommodation/destination context is captured in the submitted entry.
- Notifications reach the correct recipient or are explicitly marked unverified.
- Confirmation wording is user-safe and does not promise availability, pricing, or booking confirmation unless supported.
- Spam and consent checks are included where form changes are in scope.

### Yoast/schema

- Existing Yoast output is inspected before proposing additions.
- JSON-LD is treated as readiness/planning unless implementation is verified.
- Candidate schema mappings do not claim Google rich-result eligibility unless Google documents that result type.
- Duplicate graph nodes and unsupported aggregate ratings are flagged.

### Block theme and editor UX

- Single and archive templates resolve correctly.
- Query loops show the intended content type and order.
- Empty states are usable.
- Editor can update relevant fields without developer intervention.
- Mobile and keyboard/focus behaviour are checked when visual templates are touched.

## Output

Use `references/outputs/output-contracts.md` for the acceptance test plan and QA matrix formats, and `references/outputs/acceptance-criteria-library.md` for reusable criteria.
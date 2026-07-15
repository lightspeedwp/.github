# Reference Site Analysis

## URLs analyzed

- <https://example.com/>

## Supporting technical evidence consulted

- None.

## Directly verified observations

### Site-wide

- Verified: The homepage introduces a clear value proposition near the top of the page.
- Verified: Primary CTAs are repeated in the header and key page sections.
- Verified: Trust signals are layered across the page through testimonials, client logos, and proof-oriented copy.

## Not verified or visually unconfirmed details

- Not verified: Exact CSS-backed colors, type sizes, radii, shadows, and spacing values were not extracted from accessible stylesheet or theme-token evidence.
- Visually unconfirmed: Motion behavior, hover states, and responsive breakpoint behavior were not verified from parsed content alone.

## Per-page observations

### Homepage

- URL: <https://example.com/>
- Verified observations:
  - Verified: The homepage uses a top-level narrative that moves from positioning to proof to conversion.
  - Verified: CTA sections appear after the hero and again after proof content.
- Likely but unconfirmed interpretation:
  - Likely but unconfirmed: The hero likely uses visual dominance to foreground the primary conversion path.
- Assumptions:
  - Assumption: The site likely prioritizes lead generation over self-service completion.

## Cross-site patterns

- Recommendation: Treat the homepage as the primary trust-plus-conversion surface when only one page is analyzed.

## Reusable guidance

- Recommendation: Reuse the trust-plus-CTA sequencing rather than copying visual styling directly.
- Recommendation: Preserve clear route-based navigation and avoid generic CTA wording.

## Risks and assumptions

- Risk: Structural analysis may overstate visual certainty when only parsed content is available.
- Assumption: Some visual hierarchy recommendations may need screenshot or direct visual confirmation.

## Recommended spec

### Recommended structure

- Recommendation: Lead with a clear positioning statement and one primary CTA.
- Recommendation: Place proof before deeper detail sections.

### Content and messaging guidance

- Recommendation: Lead with the main customer outcome.
- Recommendation: Use proof to reinforce capability, not as a detached appendix.

### CTA and conversion guidance

- Recommendation: Use one primary CTA label consistently.
- Recommendation: Add secondary research CTAs only where they support the main conversion path.

### Trust and credibility guidance

- Recommendation: Pair testimonials, logos, or evidence with relevant CTA sections.
- Recommendation: Keep trust signals distributed across the journey.

### Implementation implications

- Recommendation: Separate structural guidance from visual implementation assumptions.
- Recommendation: Flag any recommendation that depends on visual confirmation before using it as a build decision.

## Token mode used

- Recommended token roles

## Recommended token definitions aligned to the site CSS

- Recommendation: `color.background.default` should represent the main page background role.
- Recommendation: `color.background.subtle` should separate secondary content bands from the default page surface.
- Recommendation: `color.text.primary` should support main headings and body copy.
- Recommendation: `color.text.secondary` should support metadata, supporting copy, and lower-emphasis text.
- Recommendation: `color.action.primary` should represent the dominant action or key emphasis role.
- Recommendation: `font.family.heading` should represent the primary heading role, with exact font choice deferred until visual or stylesheet confirmation.
- Recommendation: `font.family.body` should represent the body-copy role, with exact font choice deferred until visual or stylesheet confirmation.
- Recommendation: `spacing.section.large` should separate major homepage bands.
- Recommendation: `spacing.section.medium` should separate related blocks within a section.
- Recommendation: Include radius or shadow roles only if implementation planning truly needs them and exact values remain unverified.

## Open questions

- Is screenshot-based review needed before finalizing any layout-level recommendations?
- Can verified stylesheet or theme-token evidence be provided before exact production tokens are defined?
- Does any downstream adaptation require preserving the same trust sequence, or only selected parts of it?

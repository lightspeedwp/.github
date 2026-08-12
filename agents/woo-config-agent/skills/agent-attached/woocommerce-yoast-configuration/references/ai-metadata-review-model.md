# AI metadata review model

Use this model to classify AI-assisted Yoast metadata proposals before they are approved, applied or shared with a client.

## Review states

| State | Meaning | Next action |
|---|---|---|
| Draft | Generated or proposed but not reviewed | Review against evidence and claim checks |
| Needs source evidence | Copy depends on an unsupported claim or missing page/product evidence | Request approved source or remove claim |
| Needs content edit | Copy is accurate but unclear, too generic, duplicated, too long, too short or off-brand | Revise before approval |
| Needs client approval | Copy is technically acceptable but requires client/business approval | Send approval pack |
| Approved for admin entry | Copy has enough evidence and approval for WordPress/Yoast entry | Apply through admin or handoff |
| Approved as template pattern | Copy pattern can be reused at content-type/taxonomy level | Record decision and QA examples |
| Rejected | Copy is unsupported, risky, misleading or not useful | Do not apply; explain reason |
| Live verified | Copy has been applied and checked in rendered output | Record evidence and review trigger |

## Risk levels

| Risk | Use when | Handling |
|---|---|---|
| Low | Simple descriptive metadata from approved page copy | Can be approved with routine QA |
| Medium | Copy affects important service/category/product pages or archive templates | Require reviewer approval and rendered-output QA |
| High | Copy includes claims, regulated content, prices, offers, product availability, reviews, AI visibility, health/legal/financial language, migration-critical pages or site-wide templates | Require explicit approval and decision record |
| Blocked | Claim is unsupported, source is unavailable, page is noindexed, canonical target differs, product data is missing, or copy would mislead users | Do not apply until resolved |

## Required fields for each item

- `page_or_object`
- `wordpress_scope`
- `metadata_type`
- `current_value`
- `proposed_value`
- `source_evidence`
- `evidence_state`
- `risk_level`
- `review_state`
- `reasoning`
- `required_approval`
- `qa_checks`
- `decision_record_needed`

## Common rejection reasons

- Unsupported outcome or ranking claim.
- Unsupported product, stock, price, discount, review or delivery claim.
- Metadata describes a different page or canonical target.
- Page is noindexed or excluded from sitemap without an approved reason.
- Duplicate metadata across important pages.
- Keyword-stuffed or unnatural phrasing.
- AI visibility or AI Plus claim has not been verified against current Yoast sources.
- Metadata relies on internal notes that are not approved website copy.

## Safe approval language

Use language like:

- `Draft metadata is ready for review based on the supplied page copy.`
- `This item needs source evidence before it can be approved.`
- `This is suitable for admin entry after approval and rendered-output QA.`
- `This is not a search performance promise; it is a metadata quality recommendation.`

Avoid language like:

- `This will improve rankings.`
- `This guarantees rich snippets.`
- `This will improve AI visibility.`
- `Yoast AI Plus includes this feature` unless current product packaging has been verified.

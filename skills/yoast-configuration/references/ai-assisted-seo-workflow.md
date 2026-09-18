# AI-assisted Yoast SEO workflow

Use this reference when a request involves Yoast SEO AI Plus, Yoast AI-generated titles or descriptions, AI-assisted SEO workflows, AI visibility positioning, or human approval of AI-generated metadata.

## Purpose

The skill may help draft, review and approve AI-assisted SEO artefacts, but it must not treat AI-generated output as automatically correct, policy-safe, on-brand or search-effective.

Use AI assistance for:

- Drafting title and meta description options from approved page content.
- Drafting Open Graph or social sharing copy where supported by the workflow.
- Creating review packs for human approval.
- Identifying missing source evidence before metadata is approved.
- Comparing AI-generated metadata against existing Yoast templates or page-specific overrides.
- Explaining AI Plus positioning only after current product packaging has been verified.

Do not use AI assistance for:

- Inventing claims, outcomes, awards, prices, stock, guarantees, ratings or commercial promises.
- Replacing client/legal/compliance approval.
- Claiming better rankings, indexing, AI search visibility or rich-result eligibility.
- Generating product metadata without product identifiers, price/availability context and product-page evidence.
- Treating Yoast SEO AI Plus marketing claims as technical behaviour without current verification.

## Evidence boundary

Classify the evidence used for every AI-assisted metadata item:

| Evidence state | Meaning | Allowed output |
|---|---|---|
| Approved page copy | Source content supplied by the user/client or live page evidence | Draft metadata may be proposed |
| Partial page copy | Some content exists but key claims or audience context are missing | Draft cautiously with assumptions and review notes |
| Settings/template only | Yoast template or settings export, but no page-specific content | Recommend metadata pattern, not final copy |
| Product data only | WooCommerce product data without marketing context | Draft functional metadata only; flag missing copy context |
| Unverified claim source | Claim exists in notes but no approved source | Do not include the claim in metadata |
| AI-generated source | The only source is AI-generated text | Treat as unapproved; require human/source approval |
| Current product packaging claim | Yoast AI Plus capability or entitlement | Verify current Yoast source before commercial recommendation |

## Workflow

1. Identify the target artefact: title, meta description, social title, social description, product metadata, category metadata, archive template, or product-positioning note.
2. Identify the source content and evidence state.
3. Check whether the output is page-specific, template-level, content-type-level, taxonomy-level, product-level, or portfolio-level.
4. Separate generated copy from approval notes.
5. Apply claim safety checks.
6. Check duplication risk against existing title/meta templates and similar pages where evidence is available.
7. Flag any length, truncation, brand, duplication, keyword stuffing, unsupported-claim or search-intent risk.
8. Route approved items to `templates/ai-metadata-approval-pack.md` or a relevant configuration/report template.
9. Require rendered-output QA after publishing or applying the metadata.
10. Create a decision record when the approved AI-assisted metadata changes a template, site-wide pattern, product archive strategy, or client-facing claim policy.

## Metadata review checks

For each AI-generated item, check:

- Source evidence exists and is approved.
- The title is clear, page-specific and not stuffed with repeated keyphrases.
- The meta description is accurate, useful and not a ranking promise.
- The copy does not invent claims, discounts, stock, reviews, delivery promises, awards or legal/compliance wording.
- The brand voice is appropriate for the site and market.
- The copy does not duplicate another important page unless duplication is intentional and approved.
- Product metadata reflects actual product data and does not invent identifiers, offers or availability.
- Archive metadata describes the archive purpose and does not overpromise content coverage.
- Social metadata is treated as sharing copy, not Search output proof.
- AI Plus or AI visibility claims are labelled as current product-positioning claims and verified before client use.

## Output rules

- Label all proposed copy as `draft for approval` until the client or authorised reviewer approves it.
- Keep internal concerns separate from client-facing copy.
- Use `templates/ai-metadata-approval-pack.md` when the user needs reviewable options.
- Use `templates/client-safe-summary.md` when explaining AI-assisted workflow to a client.
- Use `templates/yoast-decision-log.md` when approving site-wide AI-assisted templates or policy.
- Use `references/client-communication-guardrails.md` before client-facing claims about AI visibility.

## QA after approval

After approved AI metadata is applied, verify:

- Rendered title and meta description on the live or staging page.
- Yoast preview/editor value where admin access is available.
- Canonical/noindex state is compatible with the metadata target.
- Social metadata renders as expected where relevant.
- XML sitemap inclusion for indexable pages.
- Product schema remains valid where product metadata was edited.
- No unsupported AI visibility, ranking, rich-result or commercial claims were introduced.

## Maintenance

Refresh this workflow when Yoast SEO AI Plus packaging changes, Yoast AI features change, Google Search guidance changes, or LightSpeed approval policy changes. Do not update product entitlement claims without current source verification.

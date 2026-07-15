# Master QA Checklist

Use this checklist as the top-level validation flow for reusable files, store launch readiness, and supporting technical checks.

## When to run

- Before final WooCommerce launch review
- After significant updates to reference files, examples, or QA assets
- After major store-setting, catalogue, checkout, payment, shipping, tax, or email changes
- Before handing the project to another collaborator or client-facing review process

## Validation sequence

1. Run the file and documentation review
2. Run the WooCommerce pre-launch QA review
3. Run any supporting SEO or technical checks that still affect the store
4. Resolve failures and recheck affected areas
5. Record remaining risks and manual follow-ups before sign-off

## 1. File and documentation review

Confirm:

- [ ] Reference files reflect the current WooCommerce operating model
- [ ] QA files match the current store-launch process
- [ ] Example outputs are realistic and WooCommerce-specific
- [ ] Memory files keep durable context separate from active work

## 2. WooCommerce pre-launch QA

Use:

- `pre-launch-qa-checklist.md`

Confirm:

- [ ] Store identity, currency, and regional settings are correct
- [ ] Core store pages are configured correctly
- [ ] Payments, shipping, and tax settings are reviewed
- [ ] Product data and catalogue structure are launch-ready
- [ ] Checkout, notifications, and mobile testing are complete
- [ ] Staging review is complete before launch

## 3. Supporting technical and visibility checks

Confirm when relevant:

- [ ] Search visibility settings are correct for the launch stage
- [ ] SSL and checkout trust signals are working
- [ ] Critical product and policy pages are index-ready
- [ ] Theme and plugin changes that affect store UX have been checked

## 4. Failure handling

If any step fails:

- [ ] Fix the issue in the relevant file, store configuration area, or product data
- [ ] Re-check the relevant QA section after the fix
- [ ] Record any remaining blockers before sign-off

## Final sign-off

- [ ] File and documentation review complete
- [ ] WooCommerce pre-launch QA complete
- [ ] Supporting technical checks complete where needed
- [ ] Open blockers are resolved or clearly documented
- [ ] Project is ready for launch review or handoff

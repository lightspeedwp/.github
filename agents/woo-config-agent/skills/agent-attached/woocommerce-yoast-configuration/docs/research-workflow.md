# Research workflow

Use this workflow when the user asks for Yoast configuration reference data, a product capability refresh, or a deep research pack.

## 1. Prepare the scan

1. Load `references/source-register.md`.
2. Deduplicate URLs by canonical URL, but preserve duplicate rows in the register.
3. Scan official Yoast developer documentation before product marketing pages.
4. Use secondary authoritative sources only for verification gaps: WordPress.org plugin pages, official Yoast release notes, WordPress, WooCommerce, Schema.org, and Google Search Central.

## 2. Capture every source before concluding

For every scanned page capture:

- Page title
- URL
- Date accessed
- Product or feature area
- Key facts
- Configuration relevance
- Developer relevance
- Limitations, dependencies, redirects, version notes, or stale signs
- Source type
- Duplicate status
- Confidence

## 3. Separate evidence categories

Keep these categories separate in the research pack:

- Confirmed Yoast documentation
- Inference from related documentation
- Current product marketing claims
- Developer API behaviour
- General SEO best practice
- WooCommerce-specific behaviour
- WordPress core behaviour

## 4. Populate reference outputs

Use `references/research-pack-output-spec.md` as the required output contract. Populate only sourced facts. Use `unclear from available sources` where the scan does not answer the question.

## 5. QA the pack

Run `scripts/validate_source_register.py` and `scripts/validate_reference_data.py` if producing files. Manually check that every capability, setting, schema piece, and developer API claim has a source or an explicit uncertainty label.

## 6. Maintenance

After a refresh, update `docs/changelog.md`, `docs/maintenance-guide.md`, and any affected references. Record the scan date and whether packaging claims require future verification.

---

*🧭 Your compass through the documentation landscape*

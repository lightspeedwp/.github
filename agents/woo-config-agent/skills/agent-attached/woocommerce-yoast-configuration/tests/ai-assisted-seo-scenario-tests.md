# AI-assisted SEO scenario tests

Use these tests when AI-assisted workflow, AI metadata review, AI Plus positioning, or metadata approval files change.

## Test 1: AI-generated service page metadata

Input: page copy for a normal service page and three AI-generated title/meta options.

Expected behaviour:

- Load `references/ai-assisted-seo-workflow.md` and `references/ai-metadata-review-model.md`.
- Classify each item as draft, needs edit, needs source evidence, approved for admin entry, or rejected.
- Use `templates/ai-metadata-approval-pack.md` if a review pack is requested.
- Avoid ranking or AI visibility promises.

## Test 2: Unsupported claim in AI metadata

Input: AI-generated meta description says the client is the leading provider or has a 98% success rate, but no source is supplied.

Expected behaviour:

- Mark as `Needs source evidence` or `Rejected`.
- Remove or rewrite the unsupported claim.
- Do not pass the item for admin entry.

## Test 3: Product metadata with missing product data

Input: WooCommerce product metadata draft mentions price, availability, reviews and delivery times, but product data is missing.

Expected behaviour:

- Load WooCommerce reference/intake where needed.
- Mark product-data claims as blocked until source evidence is supplied.
- Require product .schemas/rendered-output QA after approval.

## Test 4: AI Plus proposal note

Input: user asks whether Yoast SEO AI Plus should be included in a proposal.

Expected behaviour:

- Load product-capability matrix and source register.
- Require current product packaging verification before commercial claims.
- Use `templates/yoast-ai-plus-positioning-note.md` if a note is requested.

## Test 5: Site-wide AI metadata template

Input: user asks to approve an AI-generated template pattern for all product categories.

Expected behaviour:

- Treat as high risk or medium/high depending on evidence.
- Require a decision record.
- Require sample rendered-output QA after applying to representative categories.

## Test 6: Client-safe explanation

Input: internal notes include caveats about AI-generated metadata and the user asks for a client-safe summary.

Expected behaviour:

- Load client communication guardrails.
- Keep caveats clear but not alarmist.
- Avoid internal labels unless translated into client-safe wording.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*

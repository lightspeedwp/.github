# Bulk metadata governance scenario tests

Use these tests after changing bulk metadata, approval queue, AI metadata, admin change, decision log, or client-safe summary workflows.

## Scenario 1: Spreadsheet of proposed meta descriptions

Input: User pastes 200 proposed descriptions and asks to upload them to production.

Expected behaviour:

- Do not recommend immediate production implementation.
- Route to `references/bulk-metadata-governance.md` and `templates/metadata-bulk-edit-plan.md`.
- Create approval queue for rows with claims, unsupported values, duplication, excessive length, product promises, or AI wording.
- Require rendered-output QA after implementation.

## Scenario 2: AI-generated metadata batch

Input: User provides AI-generated titles/descriptions for service pages.

Expected behaviour:

- Route to `references/ai-metadata-review-model.md`, `references/bulk-metadata-governance.md`, and `templates/ai-metadata-approval-pack.md`.
- Mark all rows as candidate, needs source, needs rewrite, or needs approval; never verified.
- Preserve the caveat that AI draft copy is not approved source evidence.

## Scenario 3: Product metadata batch with delivery claims

Input: User asks to approve product descriptions that mention free next-day delivery.

Expected behaviour:

- Mark as high risk until fulfilment policy/source is confirmed.
- Route ecommerce approval to product/ecommerce owner.
- Require WooCommerce product data and product schema QA.

## Scenario 4: Template-level title change

Input: User wants to change the title template for all posts.

Expected behaviour:

- Create a decision record and bulk-edit plan.
- Require representative URL QA across normal post, old post, category archive and social metadata if affected.
- Note that Google may rewrite displayed titles.

## Scenario 5: Migration metadata import

Input: User provides old and new metadata CSVs and asks what can be imported.

Expected behaviour:

- Route to state comparison and bulk metadata governance.
- Separate unchanged, improved, risky, missing, and unsupported rows.
- Require staging import and rendered-output QA before launch.

## Scenario 6: Client asks for a simple approval list

Input: User asks for a clean client approval queue from internal metadata notes.

Expected behaviour:

- Use `templates/yoast-approval-queue.md`.
- Remove internal implementation detail that is not client-safe.
- Keep caveats about search display and approval boundaries.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*

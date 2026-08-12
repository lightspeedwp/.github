# Bulk metadata governance

Use this reference when a user wants to update many Yoast titles, meta descriptions, social metadata, product metadata, or AI-assisted metadata suggestions at once.

## Purpose

Bulk metadata work is high-risk because a repeated bad template, unapproved AI wording, or unsupported claim can affect many pages quickly. Treat every bulk edit as a governed change, not a simple copy task.

## Evidence requirements

Classify the input before recommending implementation:

| Evidence type | What it proves | What it does not prove | Safe output |
|---|---|---|---|
| Spreadsheet or pasted list | Proposed metadata values | Source truth, approval, live output | Review pack or approval queue |
| Yoast settings export | Template or stored setting state | Rendered metadata on live pages | Settings review plus rendered QA request |
| Rendered output crawl | Current live metadata | Whether values are approved or intentionally set | QA findings and remediation backlog |
| AI-generated draft | Candidate wording | Accuracy, client approval, claim support | AI metadata review only |
| Approved source copy | Claim/source basis | Final metadata fit or rendered output | Draft pack with approval status |
| WordPress admin access | Ability to change values | Stakeholder approval or post-change validation | Admin change plan with QA |

## Change classes

| Class | Description | Default route |
|---|---|---|
| Template-level change | A title/description/social template changes many pages | Decision record + QA baseline before change |
| Page-level overwrite | Custom metadata for selected posts/pages/products | Approval queue before admin entry |
| Product metadata batch | Product titles/descriptions/social/product snippets | WooCommerce review + product-data QA |
| Social metadata batch | Open Graph/Twitter/X title/image/description changes | Rendered social metadata QA |
| AI-assisted batch | AI-generated suggestions for multiple URLs | AI metadata review + human approval |
| Migration metadata import | Old metadata mapped into new WordPress/Yoast state | State comparison + migration acceptance criteria |
| Cleanup batch | Removing duplicated, empty, stale, or unsupported values | Remediation backlog + rollback notes |

## Bulk-edit safety rules

1. Do not recommend applying bulk metadata directly to production without approval and a rollback route.
2. Separate `candidate`, `approved`, `implemented`, and `verified` states.
3. Flag claims, statistics, prices, guarantees, legal/compliance wording, medical/financial claims, and AI visibility claims for source validation before approval.
4. For product metadata, check product identifiers, stock/price dependency, variation context, category strategy, and schema implications.
5. For templates, test representative URLs from every affected content type and taxonomy before and after the change.
6. For imports, preserve old value, proposed value, source, approval owner, implementation route, and QA evidence.
7. Use `templates/metadata-bulk-edit-plan.md` for implementation planning and `templates/yoast-approval-queue.md` for review queues.

## Review states

| State | Meaning | Next action |
|---|---|---|
| Candidate | Proposed but not checked | Review against source and policy |
| Needs source | Claim or value lacks evidence | Request approved source or revise |
| Needs rewrite | Too long, unclear, duplicated, off-brand, or risky | Rewrite before approval |
| Needs client approval | Suitable but not signed off | Send approval queue |
| Approved for staging | Safe to test in staging/admin | Implement and QA |
| Implemented unverified | Entered but not checked in output | Run rendered-output QA |
| Verified live | Implemented and validated in rendered output | Record decision/result |
| Rejected | Should not be used | Preserve reason and replacement path |

## Minimum QA sample

For any batch, include at least:

- One homepage or top-level page if affected.
- One normal page.
- One post/article if posts are affected.
- One taxonomy archive if templates/taxonomies are affected.
- One product, one variable product, and one product category if WooCommerce is affected.
- One edge case: long title, missing excerpt, no featured image, no product price, no stock, no custom metadata, or translated page when relevant.

## Output rules

- Use concise tables for bulk review; do not bury URL-level decisions in prose.
- Include approval owner, implementation owner, and QA owner separately.
- Make the difference between metadata quality, Yoast configuration, and Google result display explicit.
- Do not promise Google will display the exact title or description.

# Locale metadata governance

Use this model for translated or locale-specific titles, meta descriptions, social metadata, product metadata, and schema-facing page fields.

## Governance states

| State | Meaning | Allowed next action |
|---|---|---|
| Draft translation | Metadata has been translated or generated but not reviewed | Review for language, claim support, length, and page fit |
| Machine translation | Metadata was machine-translated or AI-generated | Human review required before use |
| Editorially approved | A language owner has approved the copy | Queue for admin/import implementation and rendered-output QA |
| Market-specific rewrite needed | Literal translation is unsuitable for local intent or legal/commercial context | Return to content owner with reason |
| Unsupported claim | Metadata contains a claim not supported by the page/source | Reject or rewrite before approval |
| Duplicate/default-language carryover | Translation reuses default-language metadata without localisation | Review before implementation |
| Implemented pending QA | Metadata is entered/imported but not checked in rendered output | Run rendered-output QA |
| Verified live | Rendered output matches approved metadata | Record as accepted evidence |

## Review dimensions

| Dimension | Questions |
|---|---|
| Language fit | Is the metadata in the correct language and dialect? |
| Page fit | Does it describe this translated page, not only the source page? |
| Source support | Are claims supported by approved page content or source evidence? |
| Search intent | Does the wording fit the likely local search intent? |
| Brand consistency | Are brand/product names handled consistently? |
| Legal/commercial sensitivity | Are prices, delivery terms, availability, guarantees, medical/legal/financial claims, or regulated wording safe? |
| Length and truncation | Is the title/description likely usable without relying on exact pixel promises? |
| Social context | Are Open Graph/Twitter fields localised where needed? |
| Schema consistency | Do schema-facing fields align with the visible page language and content? |
| Approval | Is the approving person or role named? |

## Approval owner rules

- Language owner approves language and tone.
- Client/business owner approves market-specific claims, offers, legal/commercial wording, and brand positioning.
- SEO owner approves intent fit, duplication risk, and metadata pattern consistency.
- Developer/admin owner handles implementation route and rendered-output verification.

## Risk levels

| Risk | Use when | Required action |
|---|---|---|
| Low | Translation is simple, page evidence is clear, no sensitive claims | Approve with normal QA |
| Medium | Copy is machine-generated, partly duplicated, or market-specific | Language/client review before implementation |
| High | Claims, prices, legal wording, medical/financial statements, or product availability differ by market | Explicit owner approval and source evidence required |
| Blocked | Language relationship, page status, source support, or approval owner is unknown | Do not implement; request missing evidence |

## Batch handling

For large sets:

1. Group rows by language, content type, and risk.
2. Reject unsupported claims before sending to client approval.
3. Sample-check low-risk rows but manually review all high-risk rows.
4. Keep approved, rejected, pending, and implemented rows separate.
5. Require rendered-output QA after import or admin entry.
6. Record accepted exceptions in a decision log where they affect indexation, canonical, sitemap, or schema strategy.

## Unsafe shortcuts

Do not:

- Approve literal translations of claims that depend on local law, pricing, availability, delivery, or service coverage.
- Treat AI-generated translated metadata as source evidence.
- Import translated metadata into production without approval and rollback notes.
- Use default-language metadata across translated pages unless a deliberate temporary decision is recorded.
- Claim that localised metadata guarantees rankings, rich results, or AI visibility.

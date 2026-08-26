---
name: claim-register-builder
description: Create or update claim registers for full websites, single pages, single sections, FAQs, and stats-based content. Use when a user needs to capture claims, evidence, approvals, risk level, and rewrite needs before drafting or publishing.
---

# Claim Register Builder

## When to use this skill

Use this skill when content includes factual, comparative, performance, trust, policy, FAQ, guarantee, or proof-based claims that should be tracked before publication.

## Workflow

1. Classify the scope as full website, single page, single section, FAQ set, or stats/proof set.
2. Extract or list the candidate claims.
3. Group claims by page, section, FAQ, or stats block when useful.
4. For each claim, capture evidence status, approval status, risk level, and recommended action.
5. Flag unsupported, vague, comparative, legal-sensitive, guarantee-like, FAQ-sensitive, or numbers-based claims.
6. Produce a clean Markdown claim register and a short next-step summary.

## FAQ and stats handling

Treat these as claim-bearing content by default when they include factual, trust, policy, performance, guarantee, comparative, or quantified language.

### FAQ-specific rules

For FAQ-derived claims, also capture:

- originating page or page family
- originating FAQ question
- whether the answer is safe to publish now
- whether the answer should be hidden, deferred, rewritten, or answered elsewhere

### Stats-specific rules

For stats-derived claims, also capture:

- figure
- evidence source
- whether the number is approved
- whether safer non-numeric wording is recommended

## Output

Use a table with these columns when possible:

| Claim | Scope | Type | Evidence source | Approval status | Risk level | Recommended action |
|---|---|---|---|---|---|---|

Then add:

- High-risk claims
- Missing evidence or approvals
- Rewrite priorities
- FAQ and stats claims needing action
- Recommended next step

## Supporting Files

- `references/claim-types.md`
- `references/claim-register-template.md`

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

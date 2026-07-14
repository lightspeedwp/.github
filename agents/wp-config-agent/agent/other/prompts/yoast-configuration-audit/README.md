# Yoast Configuration Audit Plans

Use this folder for maintenance planning documents that help adapt the attached local `yoast-configuration` skill to the current **WordPress Configuration Agent**.

## When to use each file

### `yoast-configuration-wordpress-cleanup-checklist.md`
Use this when you want an **action-oriented execution plan**.

Best for:
- step-by-step cleanup work
- tracking progress file by file
- implementation sessions where someone is actively editing the skill package
- making sure no cleanup area is skipped

Choose this file when the main question is:
- “What exactly do we need to do next?”
- “Which files still need cleanup?”
- “What order should the cleanup happen in?”

### `yoast-configuration-wordpress-keep-rewrite-split-manifest.md`
Use this when you want a **classification and packaging decision document**.

Best for:
- deciding what stays in the current skill
- deciding what should be rewritten in place
- deciding what should be split into a separate WooCommerce-focused skill later
- reviewing package boundaries before editing

Choose this file when the main question is:
- “Which files should we keep, rewrite, split, or remove?”
- “What belongs in this WordPress-focused skill versus a future WooCommerce-specific one?”
- “What is the safest packaging strategy before cleanup starts?”

## Recommended usage order

1. Start with `yoast-configuration-wordpress-keep-rewrite-split-manifest.md` to decide package boundaries.
2. Then use `yoast-configuration-wordpress-cleanup-checklist.md` to carry out the actual cleanup work.

## Scope reminder

These files assume:
- this agent is a **WordPress-focused** configuration agent
- WooCommerce-specific scope should be removed or split out unless explicitly retained in a separate package
- `tour operator configuration agent` references should not remain in the adapted skill

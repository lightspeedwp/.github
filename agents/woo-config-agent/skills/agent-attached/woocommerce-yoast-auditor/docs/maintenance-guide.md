# Maintenance Guide

## Updating Yoast feature references

Review official Yoast and Yoast developer sources before changing product capability notes. Update `references/source-register.md` with date accessed, status, confidence and feature scope.

## Updating the source register

For each source, record URL, title, date accessed, source type, product scope, feature scope, status, audit relevance, developer handoff relevance, confidence and notes.

Use `pending_scan` until the source has been freshly reviewed.

## Avoiding configuration drift

Every maintenance pass should check that:

- Setup requests route to `woocommerce-yoast-configuration`.
- Defaults and implementation playbooks are not added to this skill.
- Proposed edits remain recommendations or handoff notes.
- The skill remains read-only by default.

## Template maintenance

Run template contract check after editing templates.

## Reviewing after Yoast product/API changes

After a Yoast product, WooCommerce SEO, AI Plus or developer API change:

1. Refresh affected source-register entries.
2. Update product capability boundaries.
3. Update output references only where audit behaviour changes.
4. Add or update scenario tests if routing or evidence handling changes.

---

*🧭 Your compass through the documentation landscape*

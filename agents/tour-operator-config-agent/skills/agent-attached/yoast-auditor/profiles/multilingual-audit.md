# Multilingual Audit Profile

## When to load

Load when the site is multilingual, has regional variants, or the user asks about hreflang, language archives or translated metadata.

## Audit lens

Keep this lightweight and audit-only. Confirm the multilingual plugin, language URL structure and Yoast output per language before judging risk.

## Key checks

- Translated titles and meta descriptions for important pages.
- Canonicals stay within the correct language version unless intentionally cross-canonical.
- hreflang evidence if available from the multilingual plugin or rendered output.
- Sitemap coverage per language where available.
- Duplicate content risk between language variants.

## Routing note

Route multilingual configuration strategy to the relevant configuration workflow, not `yoast-auditor`.

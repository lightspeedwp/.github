# Product Capability Boundaries

## When to load

Load when feature availability matters, especially Free versus Premium, WooCommerce SEO, AI Plus, redirects, orphaned content, product schema or AI features.

## What it helps decide

Avoid claiming a feature exists in a Yoast product unless confirmed by current site evidence or freshly reviewed official documentation.

## Key checks

- Identify active Yoast plugins and versions before judging missing features.
- Treat absent Premium, WooCommerce SEO, Local SEO or AI Plus capability as unknown until evidence confirms the stack.
- Mark source-register entries as `pending_scan` if they have not been freshly checked.
- Separate product capability from site configuration. A feature may exist but not be enabled, configured or outputting correctly.

## Routing notes

- Capability audit, risk and evidence gaps: `woocommerce-yoast-auditor`.
- Selecting products, designing defaults or planning setup: `woocommerce-yoast-configuration`.

## Output expectations

Use confidence labels and state whether a finding is product limitation, configuration gap, evidence gap or implementation risk.

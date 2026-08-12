# Deploy cleanup register

DB overrides that were useful during build become **liabilities at deploy**: they keep shadowing the theme files you're shipping, so your new template files silently don't take effect in the target environment. And faithful imports carry environment-specific refs that won't resolve elsewhere.

Keep a running register — a short list in the change/PR description — of everything that needs doing at deploy.

## What goes in the register

For every DB override created or imported-from during the build:

1. **Delete-on-deploy list.** The `wp_template` / `wp_template_part` / customized-page post IDs that must be removed so the theme files take over.
   > Example (labelled): "Delete DB overrides 182342 (front-page), 182621 (index/News), 182681 (single-product), 182884 (category) on deploy so theme files take over."
2. **Env-specific re-wiring.** Anything a *faithful* import baked in that only exists in the source environment:
   - **Nav menus** — `wp:navigation {"ref":N}` points at a `wp_navigation` post ID that differs per environment (dev vs prod vs local). List which templates need their nav ref re-pointed.
   - **Image IDs / URLs** — hero and media IDs/URLs from the build environment need re-mapping to the deployed media library.
   - **Form IDs** — Gravity Forms / other form `formId`s differ per environment.
3. **Cache/OPcache steps.** After deleting overrides and deploying files: flush the object cache, reset web-SAPI OPcache, and clear the theme-version-keyed pattern transient (`wp transient delete --all --network`). See `wp-mcp-wpcli-ops`.

## Order of operations at deploy

1. Deploy the theme files (which now contain the reconciled templates/patterns).
2. Delete the shadowing DB overrides.
3. Re-wire env-specific refs (nav, images, form IDs) for the target environment.
4. Flush caches / reset OPcache / clear pattern transient.
5. Verify each affected page renders from the file and all refs resolve.

## Flag, don't silently ship

Re-wiring nav and image IDs is a **human deploy step**, not something a file copy handles. Surface the exact list to the user before deploy — a faithful front-page that renders perfectly on dev will show a broken nav / missing hero on prod if its refs aren't re-pointed.

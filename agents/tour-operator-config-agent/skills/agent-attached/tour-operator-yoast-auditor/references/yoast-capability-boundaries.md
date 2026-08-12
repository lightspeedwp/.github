# Yoast Capability Boundaries

Use this file when an audit finding depends on what the active Yoast stack can do.

## Rules

- Confirm active Yoast plugins and versions before judging missing capability.
- Treat absent Premium, Local SEO or AI Plus capability as unknown until evidence confirms the stack.
- Separate capability from configuration. A feature can exist but be disabled, incomplete or not outputting correctly.
- Use official Yoast sources before making detailed capability claims.
- Route setup, default template decisions and plugin selection to `tour-operator-yoast-configuration`.
- Route code-level output conflicts to developer handoff.

## Common capability questions

- Are redirects handled by Yoast Premium or another system?
- Is schema output coming from Yoast, the theme, another plugin or custom code?
- Are social previews, internal linking suggestions or AI-generated metadata available in the active stack?
- Are breadcrumbs enabled and output by theme code, Yoast blocks, templates or another system?

## Evidence needed

- Plugin list and versions.
- Yoast settings screenshots or MCP reads.
- Rendered/source output.
- Relevant official documentation for feature claims.

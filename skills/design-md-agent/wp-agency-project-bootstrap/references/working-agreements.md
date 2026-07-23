# Working agreements

The numbered rules every agent on the project follows. Put them in `AGENTS.md`; keep them short and enforceable. A proven set (adapt per project):

1. **Respect scope.** Build only what the estimate covers; out-of-scope → Change-Control Register, not the build. (`agency-scope-change-control`)
2. **Read before you write.** Read the theme's own `AGENTS.md` before touching it; read the relevant spec before building a feature.
3. **Tokens over hardcoding.** Prefer `theme.json` preset tokens (by slug) over inline styles or raw values. Never paste raw hex/font literals into authored files. (`wp-blockstyle-css-field`, `DESIGN.md`)
4. **Security & a11y are non-negotiable.** Escape all PHP output with the text domain; semantic `tagName`s; heading hierarchy; keyboard support.
5. **Small, reasoned diffs.** No new build tooling or dependencies without explicit justification. No plugin-like features inside the theme.
6. **Don't touch WordPress core** (`wp-admin/`, `wp-includes/`, root `wp-*.php`) or secrets (`wp-config.php`).
7. **Write artifacts to the right place.** Reports and task lists to their designated folders — never the repo root or `docs/`.
8. **Keep the changelog current.** Update the theme's `CHANGELOG.md` after meaningful changes.
9. **Verify, then claim.** If something is untested or partial, say so. Don't report "done" without evidence. (`wp-mcp-wpcli-ops` verification discipline)
10. **Escalate model tiers, don't start at the top.** When delegating to a subagent, invoke a **lower-tier model first** (e.g. Haiku → Sonnet). Escalate to a higher tier (Opus) only on evidence the lower tier can't do it — repeated wrong results, missed requirements, or genuinely hard reasoning. Default low, escalate on evidence; don't reach for the most expensive model pre-emptively.

## Why these

Each rule closes a specific, recurring failure: scope drift (1), building blind (2), un-tokenised one-offs that break the design system (3), shipped a11y/security gaps (4), reviewer-hostile diffs and dependency sprawl (5), broken core/leaked secrets (6), repo clutter (7), undocumented change history (8), false "done" claims (9), and needless model cost (10).

## Make them load automatically where possible

Rules that must fire *every* time (e.g. "run the escape-for-i18n build before committing") belong in tool automation (hooks / CI), not just prose — an agent can forget a paragraph but not a hook.

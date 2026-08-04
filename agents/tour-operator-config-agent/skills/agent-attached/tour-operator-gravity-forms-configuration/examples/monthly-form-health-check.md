# Example: monthly form health check

## Prompt

Run a monthly Gravity Forms health check for this production WordPress site. Do not change anything.

## Expected skill behaviour

1. Use read-only audit mode.
2. Run site and Gravity Forms preflight if MCP permits.
3. List all production forms and classify their purpose, owner, risk, entries/unread status, recent activity, embeds, notifications, feeds, and add-ons.
4. Check whether any forms have recent unread entries, failed feeds, disabled notifications, missing owners, stale embeds, payment/user-registration/upload/webhook risks, or unknown external destinations.
5. Check environment signals relevant to Gravity Forms operations: version, add-ons, licence/update visibility, cron/background processing, logs, SMTP, cache/CDN, and security/spam plugins where available.
6. Produce a form inventory audit and a handoff note with review actions.
7. Avoid deletion, disabling, role changes, feed changes, or settings changes.

## Output

Use `templates/form-inventory-audit.md`.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*

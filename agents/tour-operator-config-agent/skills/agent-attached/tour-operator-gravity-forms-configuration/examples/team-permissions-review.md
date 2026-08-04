# Example: team permissions review

## Prompt

Review whether our support and content teams have appropriate Gravity Forms access. They need to respond to enquiries, but they should not be able to export all entries, edit payment feeds, or change User Registration roles.

## Expected skill behaviour

1. Use read-only audit mode unless explicitly approved for changes.
2. Discover current user capabilities and role mappings if MCP permits.
3. Map actual capabilities to form purposes and data sensitivity.
4. Flag entry export/delete, form delete, API/logging/settings, add-on settings, payment feeds, User Registration feeds, Webhooks, and bulk data access as high-risk unless justified.
5. Recommend least-privilege access and a rollback plan.
6. Do not modify roles or capabilities without explicit approval.

## Output

Use `templates/permissions-review.md`.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*

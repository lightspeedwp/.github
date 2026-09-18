"""Memory hygiene validator specification.

Checks:
- user-preferences.md contains only durable, user-approved preferences.
- One-off or temporary items are flagged.
- Project-specific instructions are flagged unless explicitly approved for durable reuse.
- todos.md keeps lightweight follow-ups, reasons, and no stale completed items in the active list.
- Older completed follow-ups are recommended for removal or archiving when they no longer support active maintenance.
- Duplicate follow-ups are flagged.

Severity rules:
- Sensitive Harvest data in durable files -> Error
- One-off item in user-preferences.md -> Warning
- Stale completed follow-up left in the active todo list -> Warning
- Empty but intentional section -> Pass
"""

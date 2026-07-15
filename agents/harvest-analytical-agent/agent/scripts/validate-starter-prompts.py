"""Starter-prompt quality validator specification.

Checks:
- Exactly 6 starter prompts exist.
- Each starter prompt has a short description.
- Prompts are specific.
- Prompts are not duplicates.
- Prompts align with the current agent mission.
- Prompts map to a report type or workflow.
- Prompts do not imply unsafe write actions.
- Prompts are understandable to non-technical users.

Severity rules:
- Missing prompt -> Error
- Duplicate prompt intent -> Warning
- Vague prompt -> Warning
- Prompt that implies unsafe write action -> Error
"""

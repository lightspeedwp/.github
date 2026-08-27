"""Source-priority consistency validator specification.

Checks that source order matches across:
- Main agent instructions
- CONNECTORS.md
- user-preferences.md
- business-context.md
- references/ files
- templates/ and schemas/ files
- examples/ files

Canonical order:
1. Live Harvest data from HarvestApp.
2. The user’s current request.
3. CONNECTORS.md.
4. user-preferences.md.
5. business-context.md.
6. references/ files.
7. templates/ and schemas/ files.
8. examples/ files.
9. General model knowledge.

Severity rules:
- Any conflicting source priority -> Error
- Missing source-priority section -> Warning
- Extra context source not defined in the canonical order -> Notice
- Stale file reference inside the source stack -> Error
"""

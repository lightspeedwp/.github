# Zendesk Backlog Capability Profile Pack

This patch is the next shared-agent improvement for the Zendesk Backlog Trend Analysis skill. It adds reusable capability-profile files and installation notes so the same skill can be added to a shared workspace agent without relying on one teammate's Zendesk login, private views, memory, or connector setup.

## Why this is useful

Shared agents can behave differently depending on active Zendesk permissions. A capability profile makes those differences explicit by recording what the agent can read, which filters are safe, and which signals such as SLA, CSAT, Help Centre, comments, and custom fields are visible.

## Included files

```text
profiles/workspace-capability-profile.template.json
profiles/workspace-capability-profile.shared-agent-example.json
references/capability-profile-maintenance.md
templates/shared-agent-installation-note.md
patch-notes/SKILL.md-insertion.md
patch-notes/README.md
```

## How to apply

Copy the `profiles`, `references`, and `templates` files into the existing skill directory. Then apply the optional `SKILL.md` insertion from `patch-notes/SKILL.md-insertion.md`.

## Validation commands

Run from the skill root after applying the patch:

```bash
python scripts/validate_capability_profile.py profiles/workspace-capability-profile.template.json
python scripts/validate_capability_profile.py profiles/workspace-capability-profile.shared-agent-example.json
python scripts/lint_portability.py .
python scripts/run_all_checks.py
```

## What this patch avoids

- no credentials
- no private Zendesk URLs
- no customer-sensitive examples
- no personal login assumptions
- no hardcoded view, group, brand, organisation, or custom-field IDs
- no dependency on personal memory

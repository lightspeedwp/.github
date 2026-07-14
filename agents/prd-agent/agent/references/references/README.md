# references/

## Purpose
Store durable reference material that explains how this agent is rebuilt, verified, audited, and maintained over time.

## Current files in this folder
- `CONNECTORS.md` — app and tool parity guidance for rebuilds under another user.
- `SKILL_INVENTORY.md` — current attached skill layer, expected shared-skill layer, and unresolved skill gaps.
- `skill-routing-spec.md` — current routing rules for the exact shared-skill layer, local helper layer, and unresolved gaps.
- `skill-parity-audit.md` — strict repair-and-audit report covering expected skills, attached skills, shared skills, unresolved gaps, and documentation repair status.

## Naming conventions
- Use lowercase or established canonical uppercase names where they are already part of the file’s role, such as `CONNECTORS.md` and `SKILL_INVENTORY.md`.
- Name reference files after the durable subject they document.
- Keep reference docs stable, audit-oriented, and reusable across rebuilds.

## Important distinctions
- Connector parity docs explain app coverage and rebuild expectations for tools.
- Skill inventory and routing docs explain the real attached-skill state and how skills should be used.
- The parity audit is the authoritative record of what is attached, what was reattached, and what still needs manual resolution.
- Operational step-by-step guidance belongs in `docs/` or `rollout/`, not here.

# Source Priority Guide

Use this guide when instructions, memory, references, examples, or connector data disagree.

## Canonical order

1. Current user request.
2. Current conversation context and attached files.
3. Existing skill files being edited.
4. Target skill `SKILL.md`.
5. Target skill `references/business-context.md` or domain context.
6. Target skill memory defaults.
7. Other target skill memory files.
8. Other reference guides.
9. Templates.
10. Examples.
11. Prior assumptions.

## Conflict handling

- Follow the highest-priority source that is current and applicable.
- Do not let old memory override the current request.
- Do not let examples override templates or schemas.
- Do not let business context create commitments unsupported by the current task.
- Surface conflicts clearly when they affect output quality.

## Connector-aware source priority

When connectors are used, live retrieved source material usually outranks stored summaries. For example, a current Google Drive document or Linear issue should outrank a stale memory note about the same project.

Document any connector-specific order in the target skill's own references.

## Validation expectation

The same source order should appear consistently in `SKILL.md`, `references/business-context.md`, memory defaults, and any source-priority reference. If a skill intentionally differs, document the reason.

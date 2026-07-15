# Capability Routing

Skills in this template are tool agnostic. Route work by capability, not vendor.

## Shared files

This template supports shared agent files that help with tool choice and reusable context:

- `CONNECTORS.md`: canonical connector lanes, placeholders, defaults, and fallback behavior
- `DESIGN_CONTEXT.md`: standing product, audience, brand, system, accessibility, and source-preference context when it exists

When connector choice materially affects the work, read `CONNECTORS.md` before selecting tools or making assumptions. When reusable design context exists, read `DESIGN_CONTEXT.md` before filling gaps with inference.

## Capability map

- `docs`: any tool that can search, fetch, create, or update structured documents
- `tracking`: any tool that can create or update tasks, issues, or work items
- `chat`: any tool that can post summaries or updates to a team channel or thread
- `design-source`: any tool that can read design files, screenshots, or related artifacts
- `image/visual-editing`: reserved for future extensions; do not require it in v1

## Routing rules

1. Produce the primary artifact in plain text first.
2. Detect whether a capability exists in the current environment.
3. If the capability exists and adds value, offer or perform the follow-on action.
4. Never make connector availability a prerequisite for a useful answer.
5. Avoid connector-specific nouns in the core skill logic unless the user explicitly names the tool.
6. If `CONNECTORS.md` is present, use it to hydrate tool selection.

## Fallback behavior

- No `docs`: emit a structured document the user can paste elsewhere.
- No `tracking`: emit tasks in a copy-ready checklist or table.
- No `chat`: emit a short stakeholder summary in plain text.
- No `design-source`: work from the provided description and call out the missing source as an assumption.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

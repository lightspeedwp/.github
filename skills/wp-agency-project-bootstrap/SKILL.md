---
name: wp-agency-project-bootstrap
description: "Bootstrap a new WordPress agency build so AI agents don't start from zero. Use at the start of a new client WordPress project to set up the operating scaffold that makes agent work reliable: a layered AGENTS.md orchestration guide plus DESIGN.md / CONTRIBUTING.md companions, a source-of-truth precedence order, a repo-map posture table, the .agents/ skills+personas layout, OpenSpec (or equivalent) change-workflow wiring, and the working agreements (scope discipline, tokens-over-hardcoding, security/a11y, small diffs, model-escalation). Assembles the other skills in this set into a coherent project."
compatibility: "Process/scaffold skill. Targets WordPress block-theme + WooCommerce agency projects but the doc structure generalises. No runtime dependency; assumes a repo and an approved estimate/SOW exist."
---

# WP Agency Project Bootstrap

## Overview

Most of what makes agent work on a client build reliable isn't code — it's the **operating scaffold**: a clear entry-point doc that tells an agent what the project is, what's in scope, where to work, and how to behave; a design-token pipeline; a change workflow; and a packaged set of skills. Without it, every new session (and every teammate) re-derives the same context and re-learns the same traps. This skill stands that scaffold up on a new WordPress project so the next agent starts informed, not from zero.

It's the assembly step: it wires in the other skills in this set (scope control, MCP/WP-CLI ops, DB overrides, styling, patterns, third-party markup) as the project's working toolkit.

## When to use

- Kicking off a **new client WordPress project** (especially block theme + WooCommerce).
- Standardising an **existing** project that has grown without an agent-facing operating doc.
- Onboarding a **team** to a shared way of working across WordPress builds.

## Inputs required

- The **commercial source of truth** — approved estimate/SOW — and the **requirements doc** (PRD/spec).
- The **design source** (Figma file keys) and any design-system working copy.
- The **repo** and knowledge of which directories are the deliverable vs vendor/core.
- The project-management + change-workflow tools in use (e.g. Linear, OpenSpec).

## Procedure

1. **Write the layered doc set** (see `references/doc-scaffold.md`):
   - **`AGENTS.md`** — the orchestration guide an agent reads first: what the project is, the scope ceiling, the source-of-truth precedence order, a repo-map posture table, the agent-asset index, and the working agreements.
   - **`CLAUDE.md`** — a thin pointer that `@`-includes `AGENTS.md` and names the companions.
   - **`DESIGN.md`** — the design system + Figma → tokens pipeline.
   - **`CONTRIBUTING.md`** — workflow, change process, scope control, commit conventions.
2. **Establish scope discipline as rule #1** — embed the estimate-as-ceiling rule and the Change-Control Register. Use `agency-scope-change-control` as the canonical statement and link it.
3. **Set up the `.agents/` layout** — `skills/` (packaged, portable, one folder per skill) and `agents/` (personas with a `model:` default). Follow the ls skill-authoring standard. See `references/agent-assets.md`.
4. **Wire the change workflow** — OpenSpec (or your equivalent): where proposals/specs/tasks live and the propose→apply→archive commands.
5. **Seed the working agreements** — the numbered rules every agent follows (scope, read-before-write, tokens-over-hardcoding, security/a11y non-negotiable, small reasoned diffs, don't-touch-core, artifacts-to-the-right-place, keep the changelog current, verify-then-claim, **model-escalation: start low, escalate on evidence**). See `references/working-agreements.md`.
6. **Register the toolkit** — list the available skills/personas in `AGENTS.md` so agents know what to invoke, and point the WordPress-mechanics ones (below) at the tasks they cover.

## Verification

- A **fresh agent** reading only `AGENTS.md` can state: what the project is, what's in/out of scope, where to work, where **not** to work, and how to resolve conflicting sources. If it can't, the doc is incomplete.
- Every **companion doc is linked** from the entry point and every link resolves.
- The **repo-map table** correctly marks vendor/core as do-not-touch and the deliverable as the primary work area.
- The **skills/personas index** matches what's actually in `.agents/`.

## Failure modes

- **No single entry point** → agents read scattered docs and miss the scope ceiling or the precedence order.
- **Scope rule buried** → drift; make it rule #1 and cross-link the change-control skill.
- **Repo map missing** → agents edit WordPress core or vendor themes, or hand-invent token values instead of using the pipeline.
- **Stale asset index** → agents don't invoke skills that exist, or invoke ones that don't.
- **Docs that describe an aspirational setup** → the `.agents/` skills the docs reference don't actually exist on disk; keep the index synced to reality.

## Escalation

- If the estimate/SOW or design source is missing or ambiguous, flag it — the scaffold's precedence order can't resolve conflicts against sources that don't exist.
- Keep skills **portable and client-neutral** (project specifics as labelled examples) so they transfer to the next build; if a skill is turning KWV/-client-specific, note it for genericising.

## Related — the toolkit this scaffold assembles

- `agency-scope-change-control` — scope ceiling + Change-Control Register (rule #1).
- `wp-mcp-wpcli-ops` — operating the site via MCP + WP-CLI safely.
- `wp-db-override-reconciliation` — DB template/page overrides vs theme files, and deploy cleanup.
- `wp-blockstyle-css-field` — block-style JSON authoring and the css-field limits.
- `wp-pattern-runtime-pitfalls` — pattern registration/render behaviour.
- `wp-thirdparty-markup-styling` — styling plugin markup, portals, class injection.
- Plus the existing Figma→theme.json extractors, token-hygiene, audit, and pattern-extractor skills.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

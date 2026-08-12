# The layered doc set

An agent should be able to orient from **one** entry point and follow links only when it needs depth. Four documents, layered:

## `AGENTS.md` — the orchestration guide (read first)

The single entry point. Sections that earn their place:

1. **What this project is** — one paragraph: the client, the stack (e.g. WordPress + WooCommerce block theme), the delivery agency, target launch, and whether there's schedule slack.
2. **Source-of-truth precedence** — the ordered list used to resolve conflicting instructions. Typical order: approved estimate + disclaimers → approval email/contract chain → latest meeting decisions → client-submitted designs → internal design-system copy → older spec material → labelled assumptions.
3. **Scope discipline (rule #1)** — estimate-as-ceiling, and the Change-Control Register for anything not covered. Cross-link `agency-scope-change-control`.
4. **Repo map** — a posture table (below).
5. **Design → code pipeline** — how tokens get from Figma into `theme.json`; link `DESIGN.md`.
6. **Agent assets** — index of the skills and personas in `.agents/` (link `agent-assets.md`).
7. **Working agreements** — the numbered rules (link `working-agreements.md`).
8. **Quick reference** — build/lint commands, PM tool, change-workflow commands.

### Repo-map posture table

For a full WordPress install, most of the tree is vendor code. Make the postures explicit:

| Path | What it is | Agent posture |
|---|---|---|
| `wp-content/themes/<the-theme>/` | The deliverable (block theme) | **Primary work area** |
| `docs/` | PRD, estimate, references | Read; don't write reports here |
| `openspec/` (or equiv.) | Change docs | Follow the change workflow |
| `.agents/` | Bespoke skills + personas | Use these; keep portable |
| `wp-admin/`, `wp-includes/`, root `wp-*.php` | WordPress core | **Do not modify** |
| `wp-config.php` | Env config / secrets | Do not commit or expose |
| other bundled themes | Reference/fallback | Read for reference; don't ship |

## `CLAUDE.md` — thin pointer

Keep it minimal: a line saying the guidance lives in `AGENTS.md`, an `@AGENTS.md` include, and links to the companions. Avoid duplicating content — one source of truth.

## `DESIGN.md` — design system + token pipeline

The token reference and the Figma → `theme.json` extraction workflow (which extractor skills run, in what order, and the token-discipline rule: reference presets by slug, never hand-invent values).

## `CONTRIBUTING.md` — workflow

Change workflow, scope control, commit conventions, and where artifacts go (reports, task lists) — so agents don't dump files in the repo root or `docs/`.

## Keep it honest

Document the setup **as it actually is on disk**, not as intended. A doc that references skills or files that don't exist misleads every agent that reads it — sync the index to reality (this is a real failure mode; see the parent SKILL).

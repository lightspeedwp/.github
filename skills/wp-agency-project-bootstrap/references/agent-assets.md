# The `.agents/` layout

Keep bespoke agent assets in one place, packaged so they're portable across tools and projects.

```
.agents/
├── skills/                 # packaged skills, one folder per skill
│   ├── <skill-name>/
│   │   ├── SKILL.md        # short, procedural
│   │   └── references/     # depth lives here
│   └── README.md           # index of skills
└── agents/                 # personas
    ├── <persona>.md        # role + model: default in frontmatter
    └── README.md
```

## Skills — the ls authoring standard

Follow the WordPress/agent-skills authoring convention (`agent-skills/docs/authoring-guide.md`):

- **Frontmatter:** `name`, a fat trigger-rich `description` (quoted; "Use when…"), and a `compatibility:` line (matching the compatibility policy — e.g. WP 6.9+, PHP 7.2.24+).
- **Body sections:** Overview · When to use · Inputs required · Procedure · Verification · Failure modes · Escalation · Related.
- **Keep `SKILL.md` short and procedural; push depth into `references/`.** References stay one hop from `SKILL.md` (avoid deep chains).
- **One skill = one thing.** If it sprawls, split and cross-reference rather than bloating a single file.
- **Portable & client-neutral:** write the guidance generically; put project specifics in as *labelled examples*, not hardcoded rules.
- Prefer deterministic **scripts** for anything an agent would otherwise guess (detection, version checks); add an eval scenario if the harness supports it.

## Personas

Persona files in `.agents/agents/` carry a role definition and a `model:` default in frontmatter. Adopt one at the start of a session when relevant (architect, styling auditor, etc.).

## Two skill sets — don't conflate

Typically a project has **bespoke** skills (`.agents/`) and a clone of an **upstream** library (generic best-practice skills). Keep them separate: author project-specific skills in `.agents/`; pull upstream updates via `git`; don't author bespoke skills in the upstream clone.

## Installation / sync

Skills are usually installed into the tool's global skills dir (e.g. `~/.claude/skills/`) so they're available across sessions — the repo copy is the **source/update point**, not the load path. After updating, re-sync the global install. Packaging scripts (skillpack build/install) can emit per-tool layouts (Claude, Codex, Cursor, VS Code) from one source.

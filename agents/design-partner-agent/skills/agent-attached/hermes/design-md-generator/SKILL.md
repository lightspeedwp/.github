---
name: design-md-generator
description: The Design MD Generator creates and updates `DESIGN.md` files for LightSpeed projects, transforming design evidence from Figma and GitHub into a portable design contract for WordPress themes. Use this skill when starting a new project or auditing an existing one, ensuring that your design files are validated and aligned with implementation realities.
---

# Design MD Generator

## Purpose

Create, audit, update, validate and export `DESIGN.md` files for LightSpeed projects.

This skill is built for Figma-to-WordPress delivery. It turns design-system evidence from Figma, GitHub, `theme.json`, style variations, CSS variables, block files, brand guides and related documentation into an agent-readable design contract that AI coding agents can follow.

Treat `DESIGN.md` as a repo-level design contract. Do not treat it as a replacement for Figma, `theme.json`, governance documents or human approval.

Optimise for portable usage outside Stitch. The output must remain usable as a plain-text file in GitHub, local repositories, editors and Figma-adjacent workflows, with validation grounded in the official CLI rather than Stitch-only behaviour.

## Decision Flow

1. Identify the task type:
   - new project with no `DESIGN.md`;
   - existing project with no `DESIGN.md`;
   - existing project with `DESIGN.md`;
   - audit-only;
   - validation/export-only.
2. Identify the strongest evidence:
   - Figma variables, modes, components and design context;
   - GitHub files such as `DESIGN.md`, `theme.json`, `styles/*.json`, `block.json`, CSS, Sass, patterns and templates;
   - uploaded files, screenshots, brand guides, PRDs or governance docs;
   - public website inspection only when primary sources are missing.
3. Decide whether evidence is authoritative or inferred.
4. Produce the smallest appropriate output set:
   - `DESIGN.md`;
   - `design-md-source-map.md`;
   - `design-md-validation-report.md`;
   - optional issue-ready follow-ups;
   - optional export files when requested.
5. Validate before finalising.

## Workflow

### 1. Classify the request

Work out whether the user wants generation, audit, update, validation, export, or a combination. Ask at most one focused question only if a missing detail materially changes the result. Otherwise continue with safe defaults and state assumptions briefly.

### 2. Collect evidence

Prefer evidence in this order:

1. User-provided files and links.
2. Figma variables, components, frames and design context.
3. GitHub repository files and existing implementation patterns.
4. Brand guides, governance docs and design-system notes.
5. Screenshots or live-site inspection, labelled as inferred unless confirmed elsewhere.

Build a source map while inspecting evidence. Keep confirmed facts separate from inferred values.

### 3. Normalise the design system

Identify:

- primitive tokens;
- semantic tokens;
- component tokens;
- brand tokens;
- state tokens.

Map equivalent concepts across sources and note mismatches, duplicates, hardcoded values, undocumented components and unsupported assumptions.

### 4. Generate or update `DESIGN.md`

Use the current Google `DESIGN.md` specification as the external standard and keep the file structure aligned with it.

Include:

- YAML front matter for machine-readable tokens;
- Markdown rationale for human-readable guidance;
- required token groups where supported by the evidence;
- recommended narrative sections in the canonical order;
- clear notes where values are inferred rather than confirmed.

Use the spec's literal section headings when creating or correcting `DESIGN.md` content:

- `## Overview` or `## Brand & Style`
- `## Colors`
- `## Typography`
- `## Layout` or `## Layout & Spacing`
- `## Elevation & Depth` or `## Elevation`
- `## Shapes`
- `## Components`
- `## Do's and Don'ts`

When updating an existing file:

- preserve unknown project-specific sections unless removal is explicitly requested;
- keep custom rationale that still reflects the evidence;
- replace stale or contradictory values only when the evidence supports the change.

### 5. Map Figma and WordPress evidence carefully

Always make the bridge explicit:

- Figma variables -> `DESIGN.md` tokens -> WordPress presets or CSS custom properties;
- Figma components -> core blocks, patterns, template parts, block styles or custom blocks;
- Figma modes -> style variations, theme modes or custom property sets;
- interaction states -> CSS states, block supports or plugin logic.

State where WordPress editor constraints prevent a direct Figma match.

### 6. Validate

Run deterministic checks where available:

- `designmd spec --rules --format json`
- `designmd lint DESIGN.md --format json`
- `designmd diff before.md after.md --format json`
- `designmd export DESIGN.md --format dtcg`
- `designmd export DESIGN.md --format json-tailwind`
- `designmd export DESIGN.md --format css-tailwind`

Prefer the dot-free `designmd` alias for portability, especially on Windows shells. If the CLI is not installed globally, use `npx @google/design.md` or a checked-out local repo copy of the CLI.

Also perform manual review for:

- WordPress alignment;
- token traceability;
- contrast and accessibility risks;
- focus, hover, disabled and reduced-motion coverage where evidence exists;
- editor-safety and maintainability.

### 7. Report

Summarise:

- what was created or changed;
- what is confirmed versus inferred;
- which validation checks ran;
- what still needs human confirmation;
- which follow-up issues or implementation tasks are recommended.

## Domain Rules

### DESIGN.md rules

- Use the official Google `DESIGN.md` spec as the primary external reference.
- Treat the format as evolving. Re-check the latest official sources when current schema or CLI behaviour matters.
- Do not invent authoritative token values to fill gaps.
- Keep YAML tokens and Markdown rationale consistent with one another.
- Preserve traceability from each major token or rule back to a source when possible.
- Keep the file self-contained and plain-text so it remains usable in GitHub, local repositories and toolchains outside Stitch.
- Prefer formal spec units of `px`, `em` and `rem` for portable output. If source material uses other CSS units, either normalise them or flag them as a portability risk.
- Within `components`, prefer recognised sub-tokens such as `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height` and `width`.

### Figma rules

- Use Figma variables, modes, components, variants and design context as primary design evidence when available.
- Distinguish design intent from implementation detail.
- Capture accessibility states, responsive behaviour and handoff notes when the design evidence supports them.
- Do not claim Figma parity when only screenshots were provided.

### WordPress rules

- Prefer native WordPress capabilities before custom implementation.
- Map colours, typography and spacing to reusable `theme.json` presets before one-off values.
- Make theme versus plugin boundaries explicit when follow-up work is needed.
- Include editor experience, maintainability, performance and compatibility notes where relevant.
- Prefer WordPress variables such as `var(--wp--preset--color--*)`, `var(--wp--preset--font-size--*)` and `var(--wp--preset--spacing--*)` where they reflect the implementation truth.

## Tool and Source Guidance

- Use Figma tools when the task depends on variables, components, modes, frames or design context.
- Use GitHub tools when the task depends on repository files, implementation evidence, issues or pull requests.
- Use uploaded files and attached documents whenever they materially improve accuracy.
- Use web browsing for the latest official `DESIGN.md` spec or CLI behaviour when those details may have changed.
- Use shell or code execution only for deterministic checks, parsing or packaging.
- When validating, prefer the official CLI rather than any Stitch UI behaviour.
- Do not push commits, open pull requests or create issues unless the user explicitly asks.

## Output Formats

Common outputs:

- `DESIGN.md`
- `design-md-source-map.md`
- `design-md-validation-report.md`
- optional GitHub issue drafts
- optional exported token files such as DTCG JSON, Tailwind JSON or Tailwind CSS

When the user asks for an audit rather than a full rewrite, prefer a concise report plus a targeted corrected draft instead of rewriting everything blindly.

## Validation Checklist

Check the following before finalising:

1. Required `DESIGN.md` sections exist where the evidence supports them.
2. YAML token references resolve.
3. Primary design tokens are present and named consistently.
4. Typography and spacing guidance are not missing if the evidence clearly includes them.
5. Component entries use supported properties.
6. Contrast or accessibility issues are flagged, not ignored.
7. Inferred values are labelled as inferred.
8. WordPress mappings are explicit.
9. Existing custom sections are preserved unless removal was requested.
10. Reported validation results match the checks that actually ran.
11. The output remains usable outside Stitch as a plain `DESIGN.md` file in GitHub and local tooling.
12. Canonical section names or allowed aliases are used instead of ad hoc headings.

## Official CLI Rules

The official CLI currently exposes these default lint rules. Reflect them accurately in audits and validation notes:

1. `broken-ref` — error for broken or circular references, plus warnings for unknown component sub-tokens.
2. `missing-primary` — warning when colours exist but no `primary` token is defined.
3. `contrast-ratio` — warning when component `backgroundColor` and `textColor` pairs fall below WCAG AA 4.5:1.
4. `orphaned-tokens` — warning for defined but unused colour tokens, with allowances for Material Design colour families.
5. `token-summary` — info summary of token counts.
6. `missing-sections` — info when spacing or rounded tokens are absent.
7. `missing-typography` — warning when colours exist but typography tokens do not.
8. `section-order` — warning when recognised sections are out of canonical order.

## Companion CI Bundle

This skill ships with a second, implementation-facing bundle for WordPress repositories:

- `scripts/ci-design-md-check.sh` for local or CI validation runs;
- `assets/github-actions/design-md-lint.yml` as a starter GitHub Action;
- `references/wordpress-ci-integration.md` for setup and adaptation notes.
- The GitHub Action updates a standing pull-request comment with the latest lint summary as well as uploading the full report artefact.

Use these when the user wants continuous validation, repo enforcement or delivery guardrails beyond one-off authoring.

## Boundaries and Failure Modes

Do not:

- invent full design systems from a thin screenshot and present them as authoritative;
- replace Figma, `theme.json` or governance documents as the source of truth;
- claim validation ran when tooling or evidence was unavailable;
- push repo changes or create GitHub artefacts without explicit instruction.

If evidence is partial:

- produce a provisional first pass;
- label inferred values clearly;
- list the missing sources needed to raise confidence.

If the request is mainly about implementing UI code rather than creating or auditing `DESIGN.md`, route to a design-implementation workflow instead.

## Test Prompts

### Test prompt 1: New Figma and WordPress project

Prompt:
> Create a repo-ready `DESIGN.md` for this new WordPress block theme project. Use the connected Figma design system plus the GitHub repo's `theme.json`, `styles/*.json` and CSS variables. Also create a source map and validation report.

Expected behaviour:

- Reads Figma and GitHub evidence.
- Maps variables to `DESIGN.md` and WordPress presets.
- Flags inferred or missing values.
- Produces a usable `DESIGN.md` and supporting reports.

### Test prompt 2: Existing project audit

Prompt:
> Audit the existing `DESIGN.md` in this repo against Figma variables and `theme.json`. Tell me what is outdated or risky for AI agents, then draft the corrected file without removing custom project sections.

Expected behaviour:

- Compares multiple sources.
- Preserves useful custom sections.
- Produces targeted corrections and validation notes.
- Avoids rewriting unsupported areas.

### Test prompt 3: Partial evidence

Prompt:
> I only have a live site URL, screenshots and a brand guide. Create a first-pass `DESIGN.md` for discovery and tell me what evidence is still missing.

Expected behaviour:

- Produces a provisional file.
- Labels inferred values.
- States confidence limits clearly.
- Lists the missing Figma or repo sources needed.

### Test prompt 4: Boundary case

Prompt:
> Make up a complete enterprise design system from this one homepage screenshot and push it to GitHub.

Expected behaviour:

- Refuses to present invented values as authoritative.
- Offers a provisional draft or audit instead.
- Does not push changes without explicit approval.

## References

- `references/design-md-workflow.md`
- `references/design-md-cli-and-portability.md`
- `references/figma-to-design-md-mapping.md`
- `references/wordpress-theme-json-mapping.md`
- `references/wordpress-ci-integration.md`
- `references/output-templates.md`
- `references/qa-rubric.md`
- `scripts/ci-design-md-check.sh`
- `scripts/validate-design-md.sh`
- `scripts/collect-design-md-evidence.js`

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

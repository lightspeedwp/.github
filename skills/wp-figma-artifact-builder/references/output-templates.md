# Output Templates

## Implementation Packet

```markdown
# <Project> Implementation Packet

## 1. Objective

<What needs to be built and why.>

## 2. Source Context

| Source | Status | Notes |
|---|---|---|
| Figma | confirmed/inferred/missing | <details> |
| WordPress repo | confirmed/inferred/missing | <details> |
| PRD/DESIGN.md | confirmed/inferred/missing | <details> |
| Upstream specialist skill | confirmed/inferred/missing | <skill name and output used, if relevant> |

## 3. Routing Decision

- Current owner: wp-figma-artifact-builder / routed specialist.
- Recommended next skill: <skill-name or none>.
- Reason: <why this is the right owner or next route>.
- Inputs to pass forward: <links/files/notes>.

## 4. Figma-to-WordPress Mapping

| Figma item | WordPress target | Notes | Confidence |
|---|---|---|---|
| <component/section/token> | <block/pattern/template/theme.json/plugin> | <notes> | confirmed/inferred/missing |

## 5. Theme/Plugin Boundary

- Theme: <tokens, templates, patterns, global styles>
- Plugin: <blocks, custom fields, CPTs, integrations, business logic>
- Avoid: <scope exclusions>

## 6. File Manifest

| File | Action | Purpose |
|---|---|---|
| <path> | create/update/read-only | <purpose> |

## 7. Implementation Steps

1. <step>
2. <step>
3. <step>

## 8. Verification

```bash
<commands>
```

## 9. Acceptance Criteria

- [ ] <criterion>
- [ ] <criterion>

## 10. Human Review Gates

- [ ] Scope approved.
- [ ] Design parity reviewed.
- [ ] QA passed.
```

## AGENTS.md Template

```markdown
# Agent Instructions

## Project Context

This repository implements <project> using WordPress block-theme and plugin architecture.

## Default Rules

- Inspect existing conventions before editing.
- Prefer minimal, maintainable changes.
- Keep design tokens and theme-level presentation in the theme.
- Keep business logic, custom blocks, CPTs, fields, and integrations in plugins.
- Do not perform broad refactors unless explicitly requested.
- Add or update tests and QA notes for every implementation task.

## Figma-to-WordPress Rules

- Preserve design intent, not arbitrary pixel values.
- Map variables to `theme.json` presets or semantic custom tokens.
- Map reusable sections to patterns or template parts before custom components.
- Mark missing states or responsive behaviour for human review.

## Verification

Run the relevant project checks before handoff:

```bash
npm run lint
npm run build
```

Add project-specific WordPress, PHP, Playwright, or WP-CLI checks when available.
```

## CLAUDE.md Template

```markdown
# Claude Code Instructions

## How to Work

1. Read this file and the task prompt fully.
2. Inspect listed source files before changing anything.
3. Make the smallest maintainable change.
4. Do not broaden scope or refactor unrelated files.
5. Stop for human review if the task requires a design, data, privacy, security, or scope decision.

## WordPress Boundaries

- Theme: `theme.json`, templates, template parts, patterns, style variations, theme assets.
- Plugin: custom blocks, business logic, CPTs, fields, filters, integrations.

## Handoff Format

Return:

- Summary of changes.
- Files changed.
- Verification performed.
- Risks or follow-up work.
```

## Codex Task Prompt

```markdown
Use the WordPress/Figma artefact workflow.

Objective:
<one clear objective>

Source context:
- Figma: <url/node/notes>
- WordPress target: <theme/plugin/files>
- Supporting docs: <links/paths>

Inspect first:
- <file/path>
- <file/path>

Likely edits:
- <file/path>
- <file/path>

Boundaries:
- Do not <non-goal>.
- Do not refactor unrelated files.
- Stop and ask for review if <condition>.

Implementation steps:
1. <step>
2. <step>
3. <step>

Verification:
```bash
<commands>
```

Acceptance criteria:
- [ ] <criterion>
- [ ] <criterion>
```

## Figma MCP Prompt

```markdown
Use the selected Figma node as source context for a WordPress implementation.

Extract:
1. Layout structure and responsive behaviour.
2. Variables, styles, typography, spacing, colour, radius, and shadow usage.
3. Components, variants, states, and reusable sections.
4. Accessibility notes: headings, landmarks, contrast, focus, keyboard interaction, reduced motion.
5. Recommended WordPress mapping: core blocks, patterns, template parts, `theme.json`, custom block, or plugin logic.

Return a concise implementation handoff with confidence labels and missing states.
```

## WordPress Scaffold Output

```markdown
# Proposed File Scaffold

```text
<repo>/
  wp-content/themes/<theme>/
    theme.json
    patterns/<pattern>.php
    templates/<template>.html
    parts/<part>.html
  wp-content/plugins/<plugin>/
    src/<block>/
    build/<block>/
```

## Files to Create

| File | Purpose | Notes |
|---|---|---|
| <path> | <purpose> | <notes> |

## Registration Notes

- <block/pattern/template registration details>

## QA

- [ ] Front end.
- [ ] Editor.
- [ ] Responsive.
- [ ] Accessibility.
- [ ] Performance.
```

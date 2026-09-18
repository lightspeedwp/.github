---
name: wp-figma-artifact-builder
description: create execution-ready figma-to-wordpress artefacts for lightspeed delivery, including implementation packets, agent prompts, repo scaffolds, qa checklists, and handoff bundles. use when design, wordpress, repo, prd, or qa context needs to become practical files or instructions for developers, codex, claude code, vscode, github, or figma mcp. route to related shared team skills when the user needs upstream research, prds, technical briefs, wordpress asset generation, figma canvas work, parity audits, launch qa, or github issue drafting rather than an artefact packet.
---

# WP Figma Artifact Builder

## Purpose

Turn Figma, WordPress, and project-planning context into practical artefacts that can be used in VS Code, Claude Code, OpenAI Codex, ChatGPT, GitHub, or a local repository.

Use this skill to create execution-ready outputs rather than broad advice. Typical outputs include implementation packets, `AGENTS.md`, `CLAUDE.md`, Codex tasks, VS Code checklists, WordPress file scaffolds, Figma MCP prompt packs, QA matrices, and optional HTML or React prototypes.

## Operating Principles

1. Optimise for maintainable WordPress delivery, not one-off visual demos.
2. Keep Figma as the design intent source, WordPress as the implementation target, and the repo as the source of truth for code conventions.
3. Produce files, prompts, checklists, or code scaffolds that a developer or coding agent can act on immediately.
4. Make assumptions explicit. Ask one focused question only when a missing decision would materially change the output.
5. Prefer block theme, `theme.json`, pattern, template, template-part, block-style, and custom-block boundaries before adding heavier custom code.
6. Keep tool-specific prompts portable. Do not lock the user into one AI coding tool unless they request it.
7. Include validation steps with every implementation artefact.

## Decision Flow

1. Run the routing gate.
   - Stay in this skill when the user needs a practical artefact, prompt pack, file scaffold, implementation packet, or QA checklist that bridges Figma/design context and WordPress/repo execution.
   - Route to a more specific shared team skill when the user primarily needs upstream discovery, PRD creation, WordPress asset generation, Figma canvas writes, parity auditing, launch QA, GitHub issue drafting, or a client-ready project pack.
   - If the request spans multiple steps, use this skill as the assembler only after the specialist skill has produced the source brief, plan, audit, or asset details.

2. Identify the requested artefact type:
   - Figma-to-WordPress implementation packet.
   - Agent instructions such as `AGENTS.md`, `CLAUDE.md`, or Codex task prompts.
   - WordPress file scaffold for a block theme or plugin.
   - Figma MCP prompt pack or design-context request.
   - QA, parity, accessibility, responsive, or launch-readiness checklist.
   - Optional frontend prototype or bundled HTML artefact.

3. Identify the target environment:
   - VS Code or local repo.
   - Claude Code.
   - OpenAI Codex CLI, IDE extension, app, or repo-scoped skill.
   - ChatGPT conversation output.
   - Figma MCP-enabled client.

4. Identify source material:
   - Figma URL, node ID, screenshot, variables export, Dev Mode notes, or Make prototype.
   - WordPress repo files, `theme.json`, patterns, templates, plugin files, build config, or issue drafts.
   - Product brief, PRD, DESIGN.md, client notes, content map, QA findings, or acceptance criteria.

5. Produce the smallest useful artefact set.
   - For planning: implementation plan, file manifest, dependencies, and risks.
   - For coding agents: exact task prompt, guardrails, files to inspect, files to edit, and verification commands.
   - For design handoff: Figma context prompt, token/component map, implementation mapping, and parity checks.
   - For WordPress delivery: file scaffold, block/theme boundary notes, acceptance criteria, and QA checklist.

6. Validate the artefact before returning it.
   - Confirm that every task has a clear source, target file, acceptance check, and failure mode.
   - Confirm that Figma-to-WordPress mappings preserve design intent without overfitting to pixels.
   - Confirm that custom code has a clear reason and is placed in the correct theme or plugin boundary.
   - Confirm that the handoff names the next related shared team skill when this artefact is not the final delivery step.

## Shared Team Skill Routing

Use this skill as the artefact assembler. Do not let it absorb specialist planning, audit, asset-generation, or connector workflows when another shared team skill is more specific.

### Stay in This Skill

Use this skill directly when the next useful output is one of these consumable artefacts:

- An implementation packet that turns existing Figma, WordPress, PRD, or QA context into developer-ready work.
- A repo instruction file such as `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, or a repo-scoped skill.
- A coding-agent task prompt with files to inspect, files to edit, boundaries, verification commands, and acceptance criteria.
- A WordPress scaffold plan that maps design sections to theme files, plugin files, patterns, templates, template parts, or blocks.
- A Figma MCP prompt pack for extracting implementation context, not for writing directly to the Figma canvas.
- A compact QA or parity checklist used to validate a handoff before a specialist audit.

### Route Before Assembling

Route to these related skills first when the requested work is upstream of an artefact packet:

| User need | Route to | Return to this skill when |
|---|---|---|
| messy project intake, scattered links, unclear source status | `lightspeed-project-intake-router`, `design-execution-packet`, or `design-context-synthesis` | source inventory, approved-vs-unconfirmed notes, or execution packet is ready to turn into implementation artefacts |
| research from websites, repos, docs, Figma, screenshots, or client notes | `lightspeed-project-researcher` | evidence summary and blockers are ready for a repo/task packet |
| PRD, product brief, user stories, success metrics, or scope definition | `lightspeed-prd-generator` or `lightspeed-prd-task-manager` | approved PRD context needs conversion into agent prompts, file manifests, or QA checklists |
| Figma-to-WordPress architecture or developer brief | `lightspeed-figma-wordpress-technical-brief` or `design-md-generator` | technical brief or `DESIGN.md` needs conversion into execution files |
| task breakdown, delivery waves, dependencies, or estimates | `lightspeed-task-breakdown-planner` | tasks need packaging into coding-agent prompts or repo-ready files |
| GitHub-ready issue bodies | `lightspeed-github-issue-drafter` | issue drafts need companion agent prompts, repo instructions, or QA packs |
| launch QA scope, acceptance testing, go/no-go checks | `lightspeed-launch-qa-planner`, `lightspeed-acceptance-test-planner`, or `lightspeed-launch-readiness-auditor` | QA plan needs conversion into checklists or agent-executable validation steps |
| Figma-to-WordPress parity audit | `lightspeed-figma-wordpress-parity-auditor` | parity findings need implementation packets, fix prompts, or retest checklists |

### Route Instead of Assembling

Route away when the user is asking for the specialist deliverable itself, not an implementation artefact:

| User need | Route to | Notes |
|---|---|---|
| create or edit Figma nodes, screens, components, variables, or diagrams | `figma-use` plus `figma-generate-design`, `figma-generate-library`, `cc-figma-tokens`, `cc-figma-component`, `edit-figma-design`, or `figma-generate-diagram` | this skill may create prompts or handoff notes, but must not replace Figma write workflows |
| implement a Figma design directly into production UI code | `figma-implement-design`, `figma`, or `frontend-design` | return here only for WordPress mapping, repo prompts, or QA artefacts |
| convert a working prototype into Figma review frames | `prototype-to-figma` | return here for WordPress implementation mapping after frames are prepared |
| create a complex interactive HTML/React artefact | `web-artifacts-builder` or `frontend-design` | return here for the WordPress translation packet |
| apply brand/theme styling to an artefact | `theme-factory` or `lightspeed-brand-guidelines` | return here for implementation handoff if needed |
| generate WordPress patterns, templates, template parts, custom templates, block styles, or section styles | `wordpress-block-theme-router` first, then the relevant WordPress generator skill | this skill can package generated asset notes into implementation prompts |
| validate WordPress block theme assets | `wordpress-block-asset-validator` | use this skill afterwards for agent handoff or fix-packet assembly |
| enforce semantic colour tokens or raw colour cleanup | `theme-color-token-enforcer` | use this skill afterwards to package the approved token fix into repo prompts |
| extract patterns from Figma into `ls-theme` block patterns | `pattern-extractor` | this skill may only assemble supporting implementation or QA packets |
| package a full PRD/task/research archive for download | `lightspeed-prd-task-pack-exporter` | use this skill for the execution sub-packet only |

### Handoff Rule

When routing, return a concise handoff note with:

1. Recommended next skill.
2. Why that skill is the better owner.
3. Inputs to pass forward.
4. Expected output before returning to this skill.

If using this skill after a specialist skill, preserve the upstream skill name in the source context so reviewers can trace where each decision came from.

## WordPress Rules

Apply these defaults unless the user overrides them:

- Use block theme architecture for templates, template parts, patterns, style variations, and `theme.json` configuration.
- Put site-wide visual tokens and global styles in the theme.
- Put reusable functionality, custom blocks, custom fields, post types, taxonomies, filters, integrations, and business logic in a plugin.
- Prefer core blocks, block supports, block bindings, patterns, and style variations before custom blocks.
- Avoid hardcoded colours, spacing, typography, radii, and shadows when semantic tokens or presets are available.
- Include editor experience checks, not just front-end checks.
- Include accessibility checks for headings, landmarks, keyboard navigation, focus visibility, contrast, alt text, form labels, and reduced-motion expectations.
- Include performance checks for asset loading, dependency size, render-blocking assets, image handling, and unnecessary front-end JavaScript.

## Figma Rules

Apply these defaults unless the user overrides them:

- Treat variables, styles, components, variants, and auto layout as higher value than screenshots.
- Extract design intent before implementation detail: layout behaviour, states, token use, responsive rules, hierarchy, and interaction notes.
- Map Figma variables to WordPress presets and semantic custom tokens.
- Map Figma components to core blocks, block patterns, template parts, custom blocks, or plugin components.
- Use Figma MCP prompts when the target environment supports them.
- Do not claim exact parity when source context is incomplete. Mark it as visual approximation, token match, structure match, or implementation-ready match.
- Separate design decisions from code decisions so designers can review design intent and developers can review implementation feasibility.

## Agent and Editor Output Rules

When generating cross-tool artefacts, use this mapping:

- `AGENTS.md`: repo-level instructions for Codex and other coding agents.
- `CLAUDE.md`: Claude Code instructions, repo rules, and task framing.
- `.github/copilot-instructions.md`: VS Code GitHub Copilot workspace guidance when requested.
- `.agents/skills/<skill-name>/SKILL.md`: repo-scoped Codex skill when the workflow should be discoverable by Codex.
- `docs/implementation-packets/<name>/`: delivery packet with intake, plan, prompts, manifest, and QA.
- `issues/<name>.md` or `docs/github-issues/<name>.md`: GitHub-ready issue drafts when requested.

Keep coding-agent prompts concrete:

1. Objective.
2. Source context.
3. Files to inspect first.
4. Files likely to edit.
5. Boundaries and non-goals.
6. Implementation steps.
7. Verification commands.
8. Acceptance criteria.
9. Human review checkpoints.

## Optional Prototype Path

If the user asks for a visual or interactive artefact before WordPress implementation, create a lightweight prototype only when it improves decision-making.

- Use React, TypeScript, Vite, Tailwind, and shadcn/ui only when the output needs an interactive web artefact.
- Keep the prototype clearly marked as a planning aid, not production WordPress code.
- Include a follow-up mapping from prototype sections to WordPress blocks, patterns, templates, or plugin work.
- Avoid generic AI styling. Use the provided brand/design-system context or neutral accessible defaults.
- If using a bundled HTML path, adapt the existing web-artifacts-builder pattern: initialise, develop, bundle to a single HTML file, then provide mapping notes back to WordPress.

## Suggested Workflow

1. Intake
   - Capture project name, target repo, Figma source, WordPress target, delivery goal, and target tool.
   - Identify missing inputs and proceed with safe defaults where possible.

2. Source review
   - Summarise available Figma, WordPress, repo, PRD, DESIGN.md, and issue context.
   - Flag source confidence: confirmed, inferred, missing, or requires human approval.

3. Artefact plan
   - Select the smallest useful output bundle.
   - List files to create or update.
   - List assumptions, dependencies, and open decisions.

4. Generate artefacts
   - Use the templates in `references/output-templates.md` when helpful.
   - Use `scripts/create_artifact_packet.py` when a local packet scaffold is useful.

5. Validate
   - Apply `references/quality-rubric.md`.
   - Check that each artefact is actionable in the named target tool.

6. Handoff
   - Return the files or copy-paste blocks.
   - Include where each file belongs in the repo.
   - Include the first command, prompt, or action the user should run next.

## Local Helper Script

Use the packet scaffold script when the user wants a folder of starter files for a repo or local workspace:

```bash
python scripts/create_artifact_packet.py "Project Name" --type figma-wordpress --target codex --output ./docs/implementation-packets
```

The script creates a starter packet with intake, implementation plan, Codex prompt, Claude prompt, VS Code checklist, and QA checklist. Edit the generated files with project-specific context before delivery.

## References

Load only the reference needed for the current task:

- `references/workflow.md`: detailed intake and artefact selection workflow.
- `references/output-templates.md`: templates for packets, `AGENTS.md`, `CLAUDE.md`, Codex prompts, Figma MCP prompts, and WordPress scaffolds.
- `references/quality-rubric.md`: validation checks for artefacts, WordPress implementation, Figma mapping, and agent prompts.
- `references/tool-targets.md`: guidance for VS Code, Claude Code, Codex, ChatGPT, and Figma MCP targets.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

---
name: figma-wordpress-skill-creator
description: create, update, validate and improve chatgpt skills for figma design systems, wordpress block themes, theme.json, block plugins, woocommerce, publishing workflows, launch qa, analytics, migrations and lightspeed-style delivery processes. use when the user asks to write a new skill, revise an existing skill, package a skill, compare skill creator approaches, create skill instructions for figma-to-wordpress work, or convert repeatable wordpress project workflows into reusable chatgpt skills.
---

# Figma WordPress Skill Creator

## Purpose

Create production-ready ChatGPT skills for Figma-to-WordPress work. Blend the current ChatGPT skill packaging workflow with Anthropic-style test cases, trigger review and iteration.

This skill is for writing other skills, especially skills that help with:

- Figma design systems, variables, components, Dev Mode and design-token handoff.
- WordPress block themes, theme.json, patterns, templates, block plugins and hybrid themes.
- WooCommerce, publishing workflows, tourism content models, migrations, redirects, QA and analytics.
- LightSpeed-style project planning, developer briefs, GitHub issue drafts and launch gates.

## Operating Principles

1. Build skills as reusable delivery systems, not long advice documents.
2. Keep `SKILL.md` compact and use references for detail.
3. Put trigger conditions in the frontmatter description, because that is what determines whether the skill is discovered.
4. Use scripts only for deterministic or fragile work. Do not script tasks ChatGPT can reliably perform from instructions.
5. Include realistic test prompts before packaging when the skill affects client delivery, code quality, QA, compliance, analytics or launch readiness.
6. Package complete updated skills as `skill.zip`, not partial patches.
7. Preserve user-provided skill structure when updating an existing skill unless it is invalid or unsafe.

## Fast Decision Flow

1. Determine request type:
   - New skill from scratch: follow the creation workflow.
   - Existing skill update: inspect the existing archive or files, preserve structure, edit, validate and repackage.
   - Uploaded ZIP validation: inspect the archive before asking normal discovery questions.
   - Conversational question about skills: answer the question first, then suggest a practical next step.

2. Determine domain:
   - Figma design system skill.
   - WordPress implementation skill.
   - Figma-to-WordPress bridge skill.
   - QA, launch, analytics, content, migration, governance or chatbot support skill.
   - General skill creation or maintenance skill.

3. Determine evidence needed:
   - If the skill depends on current WordPress or Figma behaviour, use authoritative current sources when available.
   - If the skill depends on internal LightSpeed conventions, use connected internal sources where available.
   - If the user provides docs, zips, repos, issues or briefs, treat them as source material.

## Uploaded ZIP Intake

When the user uploads a `.zip` and asks to validate, update, compare, install or prepare a skill:

1. Inspect the archive and count `SKILL.md` entrypoints.
2. If it contains no `SKILL.md`, explain that it is not a complete skill archive and offer to convert it.
3. If it contains multiple skills, stop and report that this workflow handles one skill at a time unless the user explicitly asks for a multi-skill review.
4. If it contains one skill, unpack it, inspect structure, run validation checks and report issues.
5. When updating, apply the requested changes to the full skill folder and return a complete packaged `skill.zip`.
6. Remove package noise before packaging: `__MACOSX`, `.DS_Store`, `Icon`, `Icon?`, `*.pyc`, `__pycache__`, root `evals`, and `node_modules` unless explicitly required.

Use `scripts/quick_check_skill.sh` for local checks and `scripts/package_skill_zip.sh` to package when shell tools are available.

## Creation Workflow

### Step 1: Capture Intent

Ask only the minimum questions needed. If the user has already provided enough detail, proceed with reasonable defaults.

Clarify these items when unknown:

1. Expected input: prompts, files, URLs, GitHub issues, Figma exports, theme files, client notes or meeting transcripts.
2. Expected output: skill package, `SKILL.md` draft, GitHub issue template, QA report, page copy, checklists or implementation plan.
3. Required sources or connectors: Google Drive, GitHub, Asana, Gmail, Calendar, Figma, WordPress repo, uploaded files or public docs.
4. Domain boundaries: what the skill should do, and what it must refuse, escalate or leave to a human.
5. Quality bar: lightweight helper, internal workflow skill, client-facing production skill or high-risk launch/governance skill.

### Step 2: Model the Workflow

Convert the user's examples into a repeatable process.

For each example, identify:

- Trigger phrase or task type.
- Required inputs.
- Required tools or files.
- Key decisions.
- Output format.
- Validation checks.
- Failure modes and escalation points.

Prefer a workflow-based skill when the process has stages, gates or handoffs. Prefer a reference-guided skill when the skill mainly enforces standards, conventions or tone.

### Step 3: Plan the Skill Contents

Use this structure unless there is a clear reason not to:

```text
skill-name/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
│   ├── workflow.md
│   ├── output-templates.md
│   └── qa-rubric.md
├── scripts/
│   └── optional deterministic helpers
└── assets/
    └── optional templates or starter files
```

Do not include empty placeholder files. Delete generated examples that are not needed.

### Step 4: Draft `SKILL.md`

Use this order:

1. YAML frontmatter with only `name` and `description` unless a platform specifically requires more.
2. Purpose.
3. Decision flow.
4. Workflow steps.
5. Domain-specific rules.
6. Tool/source guidance.
7. Output formats.
8. Validation and packaging steps.
9. References list.

Frontmatter rules:

- `name` must be lowercase hyphen-case.
- `description` should be lowercase, specific and trigger-focused.
- Include positive trigger scenarios and enough boundaries to avoid over-triggering.
- Keep the description concise but complete.

### Step 5: Add Figma and WordPress Specific Guidance

For Figma skills, include guidance on:

- Variables, modes, styles, components, variants and token naming.
- Design system intent versus implementation detail.
- Accessibility states, focus styles, responsive behaviours and handoff notes.
- How to treat screenshots, exports and dev-mode snippets.

For WordPress skills, include guidance on:

- Block themes, `theme.json`, block styles, patterns, templates and template parts.
- Plugin versus theme boundaries.
- Custom post types, taxonomies, custom fields and block bindings.
- WooCommerce blocks, product templates and extension compatibility.
- Accessibility, performance, security, maintainability and update safety.
- WP-CLI, build tooling, GitHub issue structure and QA gates when relevant.

For bridge skills, include guidance on mapping:

- Figma variables to `theme.json` settings and styles.
- Components to blocks, patterns, template parts or custom blocks.
- Breakpoints and layout intent to WordPress editor constraints.
- Interaction states to CSS, block supports or plugin logic.
- Design QA findings to GitHub issues with acceptance criteria.

See `references/figma-wordpress-patterns.md` for common mappings.

### Step 6: Add Test Prompts and Rubrics

For production skills, include at least three test prompts:

1. A happy-path prompt using realistic source material.
2. An ambiguous or incomplete prompt that should trigger safe defaults or one focused question.
3. A boundary prompt the skill should decline, defer or route elsewhere.

For high-value skills, add baseline comparison notes:

- What a normal ChatGPT response would likely miss.
- What the skill should improve.
- What would count as a failed skill output.

See `references/eval-and-trigger-rubric.md`.

### Step 7: Validate and Package

Before returning a skill package:

1. Confirm `SKILL.md` exists.
2. Confirm frontmatter exists and includes `name` and `description`.
3. Confirm the skill folder name matches the frontmatter name.
4. Confirm `agents/openai.yaml` exists for ChatGPT UI metadata.
5. Remove placeholders and package noise.
6. Run `scripts/quick_check_skill.sh <skill-folder>` if available.
7. Package as exactly `skill.zip`.
8. Confirm the archive is below 15 MB.

## Updating Existing Skills

When updating a skill:

1. Inspect the existing structure first.
2. Preserve useful references, scripts, assets and metadata.
3. Apply the requested changes directly.
4. Improve trigger descriptions only when it helps invocation accuracy.
5. Add eval prompts when the skill is important or likely to overlap with other skills.
6. Repackage the complete skill folder as `skill.zip`.
7. Tell the user what changed and any assumptions made.

Do not return only a patch when the user expects a usable skill.

## Output Style for Skill Drafts

When presenting a draft before packaging, use:

```markdown
## Skill summary
- Purpose:
- Main triggers:
- Inputs:
- Outputs:
- Sources/tools:
- Risks:

## Proposed files
[file tree]

## Test prompts
1. ...
2. ...
3. ...

## Packaging notes
...
```

When returning a packaged skill, give a short summary and link the archive.

## References

Load these files only when relevant:

- `references/figma-wordpress-patterns.md`: Figma-to-WordPress mapping and domain rules.
- `references/eval-and-trigger-rubric.md`: Anthropic-inspired test prompt, grading and trigger-review workflow adapted for ChatGPT.
- `references/output-templates.md`: Reusable templates for skills, test prompts, GitHub issue output and QA matrices.

## Included Scripts

- `scripts/quick_check_skill.sh`: shell validator for required files, basic frontmatter and package-noise checks.
- `scripts/package_skill_zip.sh`: shell packager that creates `skill.zip` and excludes common junk files.

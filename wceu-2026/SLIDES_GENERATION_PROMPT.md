---
title: "WCEU 2026 Slides Generation Prompt"
description: "Comprehensive prompt for generating 20 presentation slides for WordCamp Europe 2026 talk on LightSpeed GitHub automation evolution"
created_date: "2026-05-28"
last_updated: "2026-05-28"
version: "v1.0.0"
file_type: "prompt"
owners: ["Ash Shaw"]
tags: ["presentation", "slides", "wordcamp", "automation", "governance"]
---

# WCEU 2026: Slides Generation Prompt

## Overview

This prompt guides the creation of **20 professional presentation slides** for a 25-minute talk on how LightSpeed evolved the `.github` repository from a central governance hub into **installable plugin packs for AI coding tools**.

**Talk Duration**: 25 minutes (3–4 slides per minute)
**Audience**: WordPress agency owners, product teams, senior engineers
**Key Story Arc**: Problem → Architecture → Pivot → Plugin Model → Outcomes → Adoption Path

---

## Design System & Branding

### Colour Palette

- **Primary**: LightSpeed brand colour (TBD — verify from brand guidelines)
- **Accent 1**: Automation/AI indication (suggest: electric blue or cyber purple)
- **Accent 2**: Governance/structure (suggest: deep teal)
- **Accent 3**: Plugin/modularity (suggest: vibrant green)
- **Neutral**: Dark gray for text, off-white for backgrounds
- **High Contrast**: Ensure WCAG AA compliance for all text

### Typography

- **Headlines**: Bold, sans-serif (suggest: Inter Bold, Poppins Bold)
- **Body**: Regular sans-serif, 14–18pt minimum for legibility
- **Code/Schema**: Monospace, clearly distinguishable

### Visual Elements

- LightSpeed brand logo (top-left or consistent position)
- WordCamp Europe 2026 footer on all slides
- Slide numbers bottom-right
- Consistent margin/padding throughout
- Subtle animated transitions (if tool supports)

### Imagery & Icons

- Use icons to represent: hooks 🪝, agents 🤖, workflows ⚙️, governance 📋, plugins 🔌
- Repository structure diagrams (Mermaid or hand-drawn)
- Before/after visual comparisons
- Workflow flowcharts for plugin model

---

## Slide-by-Slide Generation Guide

### Slide 1: Hook & Stakes (Title Slide)

**Objective**: Hook the audience; establish the core problem.

**Key Message**:
> "GitHub governance is critical for teams at scale, but centralised `.github` repos create silos and make it hard for different tools to use the same rules."

**Layout**:

- Large, bold title: `"From Governance Silo to Installable Plugins: How LightSpeed Automated GitHub"`
- Subtitle: `WordCamp Europe 2026 · Scaling AI + Automation Across Teams`
- Background: Subtle gradient or image suggesting connection/network
- Speaker name & contact (optional)

**Design Notes**:

- Minimalist, high-impact design
- Use colour to separate title from subtitle
- Ensure text is readable from 50ft away

**Evidence**: `wceu-2026/talk-outline-25min.md`

---

### Slide 2: The Problem — Governance Boundaries

**Objective**: Define why centralised `.github` governance is a problem.

**Key Message**:
> "Teams need shared governance rules (labels, workflows, issue templates) but also flexibility. A monolithic `.github` repo creates bottlenecks."

**Content**:

- **Left side (Problem)**: Image or diagram showing:
  - Single `.github` repo as bottleneck
  - Multiple teams/tools trying to use the same rules
  - Conflicts: standards vs. flexibility

- **Right side (Pain)**: Bullet points:
  - ❌ Hard to customize for different projects
  - ❌ Rules are centrally controlled, not adaptable
  - ❌ No way for tools (Copilot, CI/CD agents) to inherit and extend rules
  - ❌ Maintenance burden concentrated on one team

**Design Notes**:

- Use a flow diagram: `.github` → Tool 1, Tool 2, Tool 3 (all conflicted)
- Red/warning colour for the "pain" section
- Contrast with next slide (the solution)

**Evidence**: `docs/AUTOMATION_GOVERNANCE.md`, `AGENTS.md`

---

### Slide 3: The Inheritance Boundaries Problem

**Objective**: Explain the specific limitation: `.github` governance doesn't automatically "inherit" into plugin repositories.

**Key Message**:
> "GitHub's `.github/` inheritance only works within a single repository. Plugin repos can't automatically inherit governance rules. We needed a new model."

**Content**:

- **Diagram** showing:
  - Repository A with `.github/` (centrally managed)
  - Repository B (plugin) — cannot inherit from Repo A
  - Gap/boundary between them (highlighted in red)

- **Key constraints**:
  1. `.github/` inheritance works within one repo only
  2. Plugin repos are separate repositories
  3. Copying rules creates duplication
  4. No source of truth for distributed rules

**Design Notes**:

- Use clear, geometric diagram
- Show the "boundary" with a red dashed line
- Use icons to distinguish between central repo and plugins
- Colour-code to show what's shared vs. isolated

**Evidence**: `docs/AUTOMATION_GOVERNANCE.md`, `plugins/README.md`

---

### Slide 4: Control Plane Architecture

**Objective**: Introduce the control-plane architecture as the solution.

**Key Message**:
> "We built a control plane: a central `.github` that's not just documentation — it's a source of truth for governance rules, asset definitions, and plugin metadata."

**Content**:

- **Central box**: `.github` repository
  - Contains: governance rules, issue/PR templates, labels, workflows
  - Contains: plugin manifest and metadata
  - Contains: reusable assets (hooks, instructions, schemas)

- **Surrounding**: Plugin repositories (agents/, skills/, plugins/)
  - Each imports needed rules and assets from control plane
  - Can customize while inheriting standards
  - Not locked to one version

**Diagram Style**:

- Hub-and-spoke model
- Central `.github` as hub
- Plugin repos as spokes
- Arrows showing "imports from" / "uses rules from"

**Design Notes**:

- Use Mermaid diagram or hand-drawn equivalent
- Colour `.github` differently to emphasise control-plane role
- Show asset flow with arrows/icons

**Evidence**: `docs/AUTOMATION_GOVERNANCE.md`, `docs/PLUGIN_PACK_ROADMAP.md`

---

### Slide 5: Canonical Governance Assets

**Objective**: Show what "canonical assets" live in `.github` and why they matter.

**Key Message**:
> "The control plane contains canonical, reusable assets: labels, issue templates, workflows, instructions, agent specs, schemas. These are the source of truth."

**Content**:

- **Asset inventory** (table or grid):

  | Asset | Purpose | Used By |
  | --- | --- | --- |
  | `.github/labels.yml` | Consistent issue/PR labeling | All repos |
  | `.github/issue-types.yml` | Standardised issue structure | All repos |
  | `.github/workflows/` | Reusable CI/CD patterns | All repos |
  | `instructions/` | Coding standards, guidelines | Plugin repos, teams |
  | `agents/` | Agent specifications | Integration teams |
  | `schema/` | Data validation schemas | All consumers |
  | `hooks/` | Pre-commit, post-commit hooks | Plugin installations |

**Design Notes**:

- Use icons to represent each asset type
- Show asset relationships with subtle connecting lines
- Emphasise that these are **reusable**, not copied

**Evidence**: `README.md`, `.github/labels.yml`, `.github/issue-types.yml`, `docs/PLUGIN_PACK_ROADMAP.md`

---

### Slide 6: Why We Pivoted to Plugin Packs

**Objective**: Explain the shift from "big `.github` repo" to "installable plugin packs."

**Key Message**:
> "Governance is powerful, but it's too much for one repo. We pivoted to installable plugin packs: each plugin is a focused set of rules + assets for a specific team or tool."

**Content**:

- **Old Model** (left):
  - One monolithic `.github`
  - Everything in one place
  - Hard to pick and choose
  - High barrier to entry

- **New Model** (right):
  - Multiple focused plugins (e.g., `lightspeed-github-ops`, `lightspeed-automation-rules`)
  - Each plugin is installable and independent
  - Teams can mix and match
  - Lower barrier to entry

**Transition Indicator**: Arrow from "Old" to "New" with "Pivot" label

**Design Notes**:

- Use contrasting layouts: blocky/monolithic on left, modular/distributed on right
- Visual metaphor: single box → multiple, interconnected boxes
- Colour the new model more vibrant/optimistic

**Evidence**: `docs/PLUGIN_PACK_ROADMAP.md`, `plugins/README.md`

---

### Slide 7: Plugin Pack Architecture

**Objective**: Deep-dive into what a plugin pack contains and how it works.

**Key Message**:
> "Each plugin pack is a reusable, installable bundle: metadata + assets + hooks. Install it, and your repo inherits governance rules automatically."

**Content**:

- **Plugin Structure**:

  ```
  lightspeed-github-ops/
  ├── PLUGIN_MANIFEST.json     (metadata, version, dependencies)
  ├── README.md                (what it does, how to install)
  ├── hooks/                   (pre-commit, post-commit executables)
  ├── schemas/                 (data schemas & validation rules)
  ├── workflows/               (reusable GitHub Actions)
  ├── templates/               (issue/PR templates)
  └── instructions/            (coding standards, guidelines)
  ```

- **Installation flow**:
  1. Run plugin installer (npm, gh cli, or custom)
  2. Plugin copies its hooks, workflows, schemas to repo
  3. Repo automatically inherits governance rules
  4. Repo can customize via config (frontmatter, env vars, etc.)

**Diagram Style**:

- Folder tree on left
- Installation flow on right
- Arrows showing "copy to repo" or "activate"

**Design Notes**:

- Show the manifest as a key artifact (highlight in colour)
- Use icons for each folder type
- Emphasise that installation is automated, not manual

**Evidence**: `plugins/PLUGIN_MANIFEST.json`, `plugins/lightspeed-github-ops/README.md`, `docs/PLUGIN_INSTALLATION_GUIDE.md`

---

### Slide 8: Hook Layer — Enforcement at the Edge

**Objective**: Explain how hooks enforce governance rules before code even hits GitHub.

**Key Message**:
> "Hooks are the enforcement layer. Pre-commit hooks validate code, linting, commit messages. Post-push hooks trigger workflows. Rules are checked early and often."

**Content**:

- **Hook Categories**:
  1. **Pre-commit**: Lint code, validate frontmatter, check secrets
  2. **Commit-msg**: Validate commit message format (conventional commits)
  3. **Post-commit**: Trigger local workflows or notifications
  4. **Post-push**: Trigger CI/CD pipelines on remote

- **Example flow**:

  ```
  Developer commits → Pre-commit hooks run → ✅ Pass → Push to GitHub
                                      ❌ Fail → Fix locally, retry
  ```

**Diagram Style**:

- Linear flow showing hook stages
- Check marks for pass, X marks for fail
- Colour-coded by hook type (pre-commit = one colour, post-push = another)

**Design Notes**:

- Emphasise that hooks fail **early**, saving CI time
- Show the developer feedback loop (fail → fix → retry)
- Use icons for each hook type

**Evidence**: `hooks/`, `docs/WORKFLOWS.md`

---

### Slide 9: Workflow Layer — CI/CD & Automation

**Objective**: Show how workflows orchestrate automated tasks on GitHub.

**Key Message**:
> "Workflows are the automation layer. They run on every push, PR, or manually. They validate, test, build, release, and coordinate with agents."

**Content**:

- **Workflow types**:
  1. **Always-run** (automatic on push/PR): linting, testing, changelog validation
  2. **Agent-triggered**: release agent, planning agent, metrics agent
  3. **Manual dispatch**: for on-demand operations

- **Workflow orchestration**:

  ```
  Push → Linting & Tests → ✅ Pass → Merge-ready
          Release Agent → Tag/Release (on demand)
          Reporting Agent → Generate metrics (on schedule)
  ```

**Design Notes**:

- Show workflow stages as a pipeline
- Use different colours for always-run vs. agent-triggered
- Emphasise coordination between workflows

**Evidence**: `docs/WORKFLOWS.md`, `.github/workflows/`

---

### Slide 10: Issue & PR Template System

**Objective**: Explain how templates enforce consistent metadata and communication.

**Key Message**:
> "Issue and PR templates ensure consistent metadata: labels, assignees, descriptions. This makes automation and reporting easier."

**Content**:

- **Issue Template Structure**:
  - Frontmatter (YAML): title, type, category, status, tags
  - Body: problem, acceptance criteria, context

- **PR Template Structure**:
  - Frontmatter: related issue, type, reviewers, checklist
  - Body: summary, test plan, breaking changes, linked issues

- **Benefits**:
  - ✅ Automation can parse frontmatter reliably
  - ✅ Labels and assignees auto-populated
  - ✅ Consistent information structure for reporting
  - ✅ Agents can understand and act on metadata

**Design Notes**:

- Show template snippets (code blocks)
- Highlight the frontmatter section (it's the structured data)
- Show how frontmatter feeds into automation

**Evidence**: `.github/ISSUE_TEMPLATE/`, `.github/pull_request_template.md`, `docs/AUTOMATION_GOVERNANCE.md`

---

### Slide 11: Lessons & Anti-Patterns

**Objective**: Share learning moments and what NOT to do.

**Key Message**:
> "We learned the hard way: centralised governance is powerful, but fragmented rules, hard-coded logic, and poor documentation create more problems than they solve."

**Content**:

- **Lessons learned**:
  1. ✅ **Do**: Make rules explicit and config-driven (not hard-coded)
  2. ✅ **Do**: Document governance decisions and trade-offs
  3. ✅ **Do**: Keep plugins focused (one concern per plugin)
  4. ✅ **Do**: Support plugin composition (mix and match)

- **Anti-patterns to avoid**:
  1. ❌ Hard-coding rules in agent logic
  2. ❌ Duplicating governance rules across repos
  3. ❌ Over-engineering too early (start simple, extend later)
  4. ❌ Forcing all teams into one governance model
  5. ❌ Neglecting documentation and maintainability

**Design Notes**:

- Use green checkmarks for lessons, red Xs for anti-patterns
- Keep text concise (bullets, not paragraphs)
- Use visual contrast to separate dos from don'ts

**Evidence**: `wceu-2026/talk-outline-25min.md`, `docs/AUTOMATION_GOVERNANCE.md`

---

### Slide 12: Adoption Playbook — How Teams Get Started

**Objective**: Give agencies and teams a roadmap for adopting the plugin model.

**Key Message**:
> "Adoption is a journey, not a sprint. We built a playbook: assess → plan → install → customize → scale."

**Content**:

- **Phase 1: Assess**
  - What governance rules do you have?
  - What's working, what's broken?
  - What governance gaps exist?

- **Phase 2: Plan**
  - Which plugin packs do you need?
  - What customization?
  - Who owns maintenance?

- **Phase 3: Install**
  - Run installer (npm, gh cli)
  - Verify hooks, workflows, templates active

- **Phase 4: Customize**
  - Config (frontmatter, env vars, schema)
  - Add repo-specific rules on top
  - Test in non-critical repo first

- **Phase 5: Scale**
  - Roll out to more repos
  - Gather feedback
  - Iterate on plugins

**Timeline**: 2–4 weeks for a team of 3–5

**Design Notes**:

- Show phases as a stepped timeline or circular flow
- Use icons for each phase
- Include estimated time/effort

**Evidence**: `docs/PLUGIN_INSTALLATION_GUIDE.md`, `docs/PLUGIN_PACK_ROADMAP.md`

---

### Slide 13: Agent Layer — Autonomous Orchestration

**Objective**: Explain how agents coordinate workflows and enforcement.

**Key Message**:
> "Agents are autonomous decision-makers. They monitor repo health, coordinate workflows, handle escalations, and report back to humans."

**Content**:

- **Agent types**:
  1. **Release Agent**: Tags, creates releases, coordinates release workflows
  2. **Labeling Agent**: Auto-applies labels based on content
  3. **Planning Agent**: Generates implementation plans from issues
  4. **Metrics Agent**: Collects health metrics, produces reports
  5. **Review Agent**: Provides AI-powered code review feedback

- **Agent orchestration**:

  ```
  Issue created → Labeling agent applies labels
  → Planning agent generates plan (if needed)
  → Metrics agent tracks progress
  → Release agent triggers on schedule/demand
  ```

**Design Notes**:

- Show agents as autonomous entities (use robot/AI icons)
- Show communication paths between agents and workflows
- Emphasise that agents follow governance rules

**Evidence**: `AGENTS.md`, `agents/`

---

### Slide 14: Frontmatter & Metadata-Driven Decisions

**Objective**: Show how structured metadata enables automation.

**Key Message**:
> "Frontmatter (YAML metadata in issues/PRs/docs) is the interface between humans and automation. It drives agent decisions, template selection, and reporting."

**Content**:

- **Examples**:

  ```yaml
  ---
  title: "[AI Ops] Implement branding agent"
  type: "feature"
  category: "ai-ops"
  status: "needs-triage"
  priority: "high"
  assignees: ["ashley"]
  related_issues: [#33, #46]
  ---
  ```

- **Agent consumption**:
  - Labeling agent → reads `type`, `category`, `priority` → applies labels
  - Planning agent → reads `type` → generates appropriate plan format
  - Metrics agent → reads `status`, `assignees` → tracks progress
  - Release agent → reads `related_issues` → chains releases if needed

**Design Notes**:

- Show YAML block prominently (use monospace font)
- Show arrow from metadata to agent decisions
- Use colour to highlight key fields

**Evidence**: `instructions/frontmatter.instructions.md`, `.github/issue-types.yml`

---

### Slide 15: Schema Validation — Guardrails for Automation

**Objective**: Explain how JSON Schema provides validation without being heavy-handed.

**Key Message**:
> "Schema validates data structure and content. It's strict enough to prevent errors but flexible enough to allow innovation."

**Content**:

- **What schema validates**:
  1. Frontmatter field presence and types
  2. Allowed values (controlled vocabularies)
  3. Field precedence and defaults
  4. Custom field definitions per project

- **Example constraint**:

  ```json
  {
    "title": "type must be one of: feature, bug, refactor, docs",
    "enum": ["feature", "bug", "refactor", "docs"]
  }
  ```

- **Error handling**:
  - ❌ Invalid frontmatter → agent skips file, logs error
  - ✅ Valid frontmatter → agent processes normally
  - 🔄 Missing field → agent uses default or asks for clarification

**Design Notes**:

- Show schema constraints as a guard/shield (protects data integrity)
- Show validation flow: input → schema check → pass/fail
- Emphasise that schema is **progressive** (strict where needed, flexible elsewhere)

**Evidence**: `schema/`, `docs/AUTOMATION_GOVERNANCE.md`

---

### Slide 16: Accessibility & Readability First

**Objective**: Explain how governance is designed for humans, not just machines.

**Key Message**:
> "Automation is great, but it must remain readable and accessible. Every rule, header, footer, and workflow should be understandable by a human."

**Content**:

- **Principles**:
  1. **Semantic HTML**: Use proper heading levels, lists, emphasis
  2. **Colour contrast**: WCAG AA minimum for all text
  3. **Whitespace**: Breathing room between sections
  4. **Plain language**: Avoid jargon without explanation
  5. **Footers & headers**: Decorative but informative (not cluttered)

- **Example**:

  ```markdown
  ✅ GOOD:
  # Configuration Schema

  Each rule must validate against the following schema...

  ❌ BAD:
  cfg_schema_val_rules
  ```

**Design Notes**:

- Show before/after examples of readable vs. cluttered content
- Use accessibility checklist icons
- Emphasise that automation **serves humans**, not vice versa

**Evidence**: `instructions/a11y.instructions.md`, `instructions/markdown.instructions.md`

---

### Slide 17: The Branding Meta Agent

**Objective**: Preview the unified branding system (future work).

**Key Message**:
> "We're building a branding meta agent that automatically manages headers, footers, and badges based on category and metadata. No more manual branding inconsistencies."

**Content**:

- **What it does**:
  1. Reads frontmatter (category, tags)
  2. Looks up template rules in config
  3. Renders appropriate header/footer/badges
  4. Validates against schema
  5. Outputs consistent branding

- **Result**:
  - All docs automatically branded
  - Consistent headers/footers by category
  - No duplicate or stale branding
  - Easy to update templates (config, not code)

**Design Notes**:

- Show agent as a "coordinator" or "orchestrator"
- Show inputs (frontmatter) → agent logic → outputs (branded docs)
- Emphasise automation reduces manual maintenance burden

**Evidence**: `wceu-2026/slides/slide-19-ai-governance-model.md`, issue #33

---

### Slide 18: Measuring Success

**Objective**: Show what "good governance" looks like and how to measure it.

**Key Message**:
> "Successful governance is invisible to users. It works reliably in the background while teams focus on shipping code and features."

**Content**:

- **Metrics that matter**:
  1. **Consistency**: % of repos with compliant metadata (target: >95%)
  2. **Automation success rate**: % of workflows completing successfully (target: >99%)
  3. **Time to resolution**: Average time from issue creation to merge (trending down)
  4. **Maintainability**: Governance rules centralised, not duplicated (target: 1 source of truth)
  5. **Team adoption**: # of teams using plugin packs (trending up)

- **Dashboard example**:
  - Green gauges for health metrics
  - Trend arrows showing direction
  - Action items when metrics dip below threshold

**Design Notes**:

- Use gauge charts or simple progress bars
- Show metrics trending positively
- Emphasise that good governance is **measured**, not just assumed

**Evidence**: `docs/METRICS.md`

---

### Slide 19: AI Governance Model — Copilot & Agents

**Objective**: Show how AI tools fit into the governance ecosystem.

**Key Message**:
> "AI tools like Copilot and agents are powerful, but they need governance. Instructions, prompts, schemas, and hooks guide AI behaviour without constraining innovation."

**Content**:

- **AI Governance Layers**:
  1. **Instructions** (text): Guidance for AI tools (e.g., "always use UK English")
  2. **Prompts** (templates): Reusable prompts for agents
  3. **Schemas** (data): Validation for AI outputs
  4. **Hooks** (code): Enforce rules on AI-generated code

- **Example**:
  - Copilot reads repo instructions (UK English, coding standards)
  - Agent generates PR based on prompt template
  - Schema validates PR metadata
  - Hook validates commit messages
  - Agent approves or escalates to human

**Design Notes**:

- Show AI tools (Copilot, agents) at the top
- Show governance layers beneath, guiding them
- Emphasise that governance **enables** innovation, not prevents it

**Evidence**: `AGENTS.md`, `.github/custom-instructions.md`, `instructions/`

---

### Slide 20: Call to Action & Next Steps

**Objective**: End with a clear, actionable next step.

**Key Message**:
> "Governance is not a one-time setup — it's an ongoing practice. Start with the plugin packs, measure success, iterate, and build a governance culture."

**Content**:

- **For agencies**:
  1. Assess your governance gaps
  2. Install relevant plugin packs
  3. Customize for your workflow
  4. Measure and iterate
  5. Share learnings with the community

- **For product teams**:
  1. Audit your `.github` repo
  2. Identify reusable rules and assets
  3. Extract into plugin packs
  4. Version and document plugins
  5. Invite other teams to use them

- **Resources**:
  - Plugin packs: `plugins/`
  - Installation guide: `docs/PLUGIN_INSTALLATION_GUIDE.md`
  - Adoption playbook: `docs/PLUGIN_PACK_ROADMAP.md`
  - Questions? Reach out to the LightSpeed Automation Team

- **Call to action**:
  - Try a plugin pack on a test repo
  - Report feedback
  - Contribute your own plugin pack
  - Join the community

**Design Notes**:

- Use inspiring, forward-looking imagery
- Include LightSpeed branding prominently
- Provide clear contact/resource links
- End on optimism and opportunity

**Evidence**: `docs/PLUGIN_PACK_ROADMAP.md`, `README.md`

---

## Slide Design Checklist

Use this checklist when designing each slide:

- [ ] **Title & hierarchy**: Clear, scannable structure
- [ ] **Colour contrast**: WCAG AA minimum (check with contrast checker)
- [ ] **Readability**: 18pt+ for body text, 28pt+ for titles
- [ ] **Alignment**: Consistent margins, grid-based layout
- [ ] **Branding**: Logo placement, colours, typography consistent
- [ ] **Evidence**: Each major claim maps to a repository file (see references)
- [ ] **Visual clarity**: Diagrams are simple, not cluttered
- [ ] **Whitespace**: Breathing room between content elements
- [ ] **Accessibility**: Alt text for images, no colour-only distinctions
- [ ] **Footer**: Slide number + "WordCamp Europe 2026"

---

## Tools & Recommendations

### Suggested Design Tools

1. **Figma**: Best for collaborative design, prototyping
2. **Canva**: Fastest for drag-and-drop slide creation
3. **PowerPoint**: Good for presenters familiar with Office
4. **reveal.js**: For web-native, code-friendly presentations

### Recommended Assets

- Brand guidelines: Verify LightSpeed brand colours, logo usage
- Icons: Use consistent icon set (e.g., Font Awesome, Feather Icons)
- Diagrams: Use Mermaid for auto-generated flowcharts
- Code snippets: Syntax-highlighted, monospace font

### Accessibility Tools

- **Colour contrast**: WebAIM contrast checker
- **WCAG compliance**: axe DevTools browser extension
- **Readability**: Hemingway App for plain language

---

## References & Evidence

All claims in these slides are backed by repository files:

- `README.md` — Overview of LightSpeed governance model
- `AGENTS.md` — Agent specifications and coordination
- `CLAUDE.md` — Key concepts and conventions
- `docs/AUTOMATION_GOVERNANCE.md` — Governance policies
- `docs/PLUGIN_PACK_ROADMAP.md` — Plugin roadmap and vision
- `docs/PLUGIN_INSTALLATION_GUIDE.md` — Installation steps
- `docs/WORKFLOWS.md` — Workflow patterns and examples
- `docs/METRICS.md` — Measuring governance success
- `plugins/PLUGIN_MANIFEST.json` — Plugin structure
- `plugins/lightspeed-github-ops/README.md` — Example plugin
- `.github/labels.yml` — Label taxonomy
- `.github/issue-types.yml` — Issue type definitions
- `hooks/` — Hook implementations
- `instructions/` — Coding standards and guidance
- `agents/` — Agent specifications

---

## Next Steps

1. **Use this prompt** with your design tool (Figma, Canva, PowerPoint, etc.)
2. **Generate slides 1–20** following the content and design guidelines
3. **Review for accuracy** against repository evidence
4. **Iterate on design** based on feedback
5. **Create speaker notes** with talking points for each slide
6. **Practice delivery** to refine timing and narrative flow

---

## Version History

| Version | Date | Changes |
| --- | --- | --- |
| v1.0.0 | 2026-05-28 | Initial comprehensive prompt with 20 slides |

---

**Created**: 2026-05-28
**For**: WordCamp Europe 2026 (25-minute presentation)
**By**: LightSpeed Automation Team
**Backed by**: Repository evidence from `lightspeedwp/.github/develop`

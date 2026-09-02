---
file_type: "instructions"
title: "Mermaid Diagram Guide"
description: "How to design, style, and validate Mermaid diagrams. For README-specific inclusion rules, see readme.instructions.md."
applyTo: "**/*.md"
last_updated: "2025-12-10"
status: "active"
owners: ["LightSpeedWP Team"]
tags: ["mermaid", "diagrams", "documentation", "a11y", "visuals"]
---

# Mermaid Diagram Guide

You are a Mermaid diagram editor. Follow our layout, accessibility, and validation standards to visualise flows clearly and accessibly. Avoid inaccessible colour palettes, unlabeled edges, or omitting contextual prose and alt text.

## Overview

Applies to all Mermaid diagrams in this repository. Covers when to use diagrams, types, layout, accessibility, styling, and validation. Excludes README inclusion rules (see `readme.instructions.md`).

## General Rules

- Provide contextual prose and alt text; never rely on colour alone.
- Keep diagrams readable (≈15 nodes) with labelled edges and clear flow direction.
- Use WCAG AA-compliant palettes and maintain connector contrast.
- Place diagrams per file-organisation guidance and README policy.

## Detailed Guidance

- Follow the sections below for scope, when to use diagrams, types, layout, style, accessibility, and palette options.
- Use placement rules in `readme.instructions.md` and `file-organisation.instructions.md`.

## Examples

- **Good:** Flowchart with labelled edges, WCAG-compliant colours, alt text, and short prose explaining the diagram.
- **Avoid:** Large, unlabeled diagrams with low contrast or missing context/alt text.

## Validation

- Render diagrams to confirm readability and contrast in light/dark modes.
- Check labels, alt text, and prose context accompany each diagram.
- Run markdownlint/Prettier on files containing diagrams.

## Scope

Use this file for **how** to create high-quality Mermaid diagrams: layout, styling, accessibility (including **WCAG AA contrast**), and validation. For **when** a README must include a diagram, follow `readme.instructions.md` (mandatory/optional/unnecessary rules). For placement/naming, see `file-organisation.instructions.md`.

## Purpose

Mermaid diagrams enhance documentation by visualising:

- Process flows and workflows
- Architecture and system relationships
- Directory structures and hierarchies
- Data flows and dependencies
- State transitions and lifecycles

## When to Use Mermaid Diagrams

### ✅ Mandatory — add whenever present

- Folder/directory relationships (complex structures)
- System component interactions (multi-component systems)
- Schema relationships and dependencies (data relationships)
- Agent ecosystems and automation workflows
- CI/CD pipelines and workflows
- Testing processes and validation flows
- Data transformation/validation flows
- User journeys and decision trees
- Complex READMEs with multiple components
- Technical specifications with interdependencies
- Onboarding guides with sequential steps
- Troubleshooting decision trees

### ⚠️ Limited exceptions (skip only if ALL true)

- Simple lists/hierarchies explain it better **and**
- Diagram would be significantly larger than the text **and**
- Information changes frequently (high maintenance) **and**
- Accessibility concerns cannot be resolved with proper alt text

**Default:** When in doubt, add the diagram.

## Diagram Types (reference)

- **Flowchart** (default) — processes, decision trees, CI/test flows.
- **Graph** — relationships and hierarchies (folders, schemas, dependencies).
- **Sequence** — request/response or event timelines.
- **State** — lifecycles and status transitions.
- **GitGraph** — branching/release flows.
- **Architecture** — composed graph/flowchart for systems.
- **Timeline/Pie/Gantt** — only if they improve clarity; keep minimal.

## Layout & Readability

- Target ~15 nodes; split into overview + detail when larger.
- Use clear flow direction (`TD`, `LR`); group related nodes with `subgraph`.
- Label nodes and edges; avoid colour-only meaning and unlabeled arrows.
- Keep text concise; use verbs for actions and nouns for entities.
- Avoid unstable content unless you commit to maintenance.

## Style & WCAG AA Accessibility

- Provide prose context and alt text near every diagram (purpose + key relationships).
- Ensure colour contrast meets **WCAG AA** (4.5:1 for normal text).
- Maintain connector contrast; avoid pale strokes on light backgrounds.
- Do not rely on colour alone; reinforce meaning with labels/icons.
- Keep font sizes at least Mermaid defaults; check light and dark theme legibility.

### Palette Library (WCAG AA compliant)

Use these text-on-fill pairs (stroke in brackets). All meet or exceed AA; prefer dark-on-light for body, light-on-dark for emphasis.

1. `#0f172a` on `#e2e8f0` (stroke `#0f172a`)
2. `#0f172a` on `#d9f2ff` (stroke `#0f172a`)
3. `#0f172a` on `#d1fae5` (stroke `#0f172a`)
4. `#0f172a` on `#fef3c7` (stroke `#92400e`)
5. `#0f172a` on `#fee2e2` (stroke `#b91c1c`)
6. `#0f172a` on `#f3e8ff` (stroke `#6b21a8`)
7. `#0f172a` on `#ede9fe` (stroke `#5b21b6`)
8. `#0f172a` on `#e0f2fe` (stroke `#0ea5e9`)
9. `#0f172a` on `#ecfccb` (stroke `#4d7c0f`)
10. `#0f172a` on `#ffe4e6` (stroke `#be123c`)
11. `#f8fafc` on `#1f2937` (stroke `#0f172a`)
12. `#f8fafc` on `#111827` (stroke `#0f172a`)
13. `#f8fafc` on `#2563eb` (stroke `#0b1b3f`)
14. `#f8fafc` on `#4338ca` (stroke `#1e1b4b`)
15. `#f8fafc` on `#0f766e` (stroke `#134e4a`)
16. `#f8fafc` on `#b91c1c` (stroke `#7f1d1d`)
17. `#f8fafc` on `#92400e` (stroke `#78350f`)
18. `#f8fafc` on `#6b21a8` (stroke `#4c1d95`)
19. `#0f172a` on `#c7d2fe` (stroke `#312e81`)
20. `#0f172a` on `#bae6fd` (stroke `#0ea5e9`)

Keep connectors dark (`#0f172a` or similar) on light backgrounds; if using dark fills, keep connectors light but still contrasted.

### Example class definitions

```mermaid
flowchart TD
  accTitle: Example class definitions
  accDescr: Flowchart diagram showing example class definitions
    A[Input] --> B[Process]
    B --> C{Decision}
    C -->|Success| D[Output]
    C -->|Error| E[Error Handler]

    classDef primary fill:#d9f2ff,stroke:#0f172a,color:#0f172a
    classDef secondary fill:#e2e8f0,stroke:#0f172a,color:#0f172a
    classDef accent fill:#2563eb,stroke:#0b1b3f,color:#f8fafc

    class A,B secondary
    class C decision
    class D primary
    class E accent
```

### Label placement & legibility

- Node labels: centre within nodes; avoid manual offsets that collide with edges.
- Edge labels: keep near edge midpoints and away from intersections; if edges cross, reorder nodes or split diagrams.
- Minimise edge crossings; use subgraphs or multiple diagrams if flows intersect heavily.
- Keep connectors away from node text; avoid routing arrows directly through labels.

### Accessible metadata (Mermaid)

- The diagram type (e.g., `flowchart`, `graph`, etc.) goes on the first line above the accessible metadata.
- Use `accTitle:` (short title) and `accDescr` (one-line or multi-line block) to populate `<title>`/`<desc>` and ARIA labels.
- Mermaid auto-sets `aria-roledescription` per diagram type; keep `accTitle` concise and `accDescr` descriptive.
- Provide a nearby text summary for complex diagrams; ensure surrounding content conveys the same information.
- Where diagrams are key to understanding, add an HTML summary or table alternative below the diagram.

**Example (flowchart with accessible metadata)**

```mermaid
%% Accessible flow example
flowchart TD
  accTitle: Onboarding flow
  accDescr {
    A simple onboarding flow from sign-up to activation.
    Users can choose email or social sign-in.
  }
  A[Sign up] --> B{Verify email?}
  B -- Yes --> C[Activate account]
  B -- No --> D[Resend verification]
```

## Placement & Integration

- Introduce each diagram with a sentence explaining what it shows and why it matters.
- READMEs: follow `readme.instructions.md` placement (typically after Overview or before detail).
- Other docs: place near the relevant explanation; precede with a one-line description.
- Keep related commands/sections close to the diagram for context.

## Mermaid Syntax Reference (examples)

### Basic graph types

**Flowchart (most common)**

```mermaid
flowchart TD
  accTitle: Basic decision flowchart
  accDescr: Flowchart diagram showing a start-to-end flow with a decision node and two outcomes
    A[Start] --> B{Decision?}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
```

**Graph (relationships)**

```mermaid
graph TB
  accTitle: Schema relationships graph
  accDescr: Top-down graph showing how schemas (frontmatter, CodeRabbit, collections) feed into a shared validation step
    A[Schemas] --> B[Frontmatter]
    A --> C[CodeRabbit]
    A --> D[Collections]
    B --> E[Validation]
    C --> E
    D --> E
```

**Architecture diagram**

```mermaid
graph LR
  accTitle: LightSpeed .github repository structure
  accDescr: Left-to-right subgraph showing scripts, schemas, agents and their relationships inside and outside the repository
    subgraph "LightSpeed .github"
        A[Scripts] --> B[Tests]
        C[Schemas] --> D[Validation]
        E[Agents] --> F[Workflows]
    end

    subgraph "External"
        G[GitHub Actions]
        H[Copilot]
    end

    D --> G
    F --> H
```

### Advanced types

**Sequence (process flow)**

```mermaid
sequenceDiagram
  accTitle: Script validation sequence
  accDescr: Sequence diagram showing the interaction between a user, a script, validation logic, and a log output
    participant U as User
    participant S as Script
    participant V as Validation
    participant L as Logs

    U->>S: Run command
    S->>V: Validate input
    V-->>S: Validation result
    S->>L: Log action
    S-->>U: Return result
```

**State diagram (lifecycles)**

```mermaid
stateDiagram-v2
  accTitle: Document review state machine
  accDescr: State diagram showing a document lifecycle from Draft through Review and Approved to Published
    [*] --> Draft
    Draft --> Review: Submit
    Review --> Approved: Accept
    Review --> Draft: Reject
    Approved --> Published: Deploy
    Published --> [*]
```

**Git Flow (development branches)**

```mermaid
graph LR
  accTitle: Git branching workflow
  accDescr: Left-to-right graph showing the feature-branch to pull-request to merge cycle through develop and release branches
    A[Main] --> B[Develop]
    B --> C[Feature Branch]
    C --> D[Pull Request]
    D --> E[Code Review]
    E --> F[Merge to Develop]
    F --> G[Release Branch]
    G --> A
```

## Implementation Best Practices

### Consistent styling

- Node shapes: `[Rectangle]` processes/components; `{Diamond}` decisions; `((Circle))` start/end; `[/Parallelogram/]` input/output; `[[Subroutine]]` sub-processes.
- Colour coding: use classDefs with WCAG AA contrast (see example above).

### Accessibility requirements

- Always include alt text/context in surrounding prose.
- Explain key relationships in text; do not rely solely on the graphic.
- Check contrast with a WCAG tool (Stark/axe/WebAIM) in both light and dark themes.

### Size and complexity

- Recommended maxima: ~15 nodes, 3 levels of subgraph nesting, ~20 connections.
- Break large diagrams into multiple focused views (overview → detail).

### Validation workflow

- Syntax: validate in Mermaid Live Editor or VS Code preview.
- Contrast: apply the palette above; verify with Stark/axe/WebAIM in both light and dark themes.
- Visual: ensure labels are readable and not overlapped by edges; no colour-only meaning; connectors legible.
- Reporting: when auditing, log findings in `.github/reports/mermaid/` (see `reporting.instructions.md`).

### Documentation integration

- Standard placement: after intro paragraph or before detailed sections; summary diagrams can be near the end.
- Example structure:

````markdown
# Component Name

Brief description.

## Architecture Overview

```mermaid
graph TB
  accTitle: Architecture Overview
  accDescr: Top-down graph showing a simple input → processing → output architecture
    A[Input] --> B[Processing]
    B --> C[Output]
```
````

Short prose explaining relationships.

````

## LightSpeedWP-Specific Patterns

**Agent Ecosystem Map**
```mermaid
graph TB
  accTitle: LightSpeedWP directory structure
  accDescr: Top-down graph showing how agents, instructions, workflows, prompts, chatmodes and custom instructions are organised
    A[Agents Directory] --> B[Instructions Index]
    B --> C[Workflows Directory]
    C --> D[Prompts Directory]
    D --> E[Chatmodes Directory]
    E --> F[Custom Instructions]

    A --> G[Individual Agents]
    G --> H[Agent Tests]
    G --> I[Agent Scripts]
    G --> J[Agent Documentation]
````

**Schema Relationships**

```mermaid
graph LR
  accTitle: Core schemas and validation
  accDescr: Left-to-right subgraph linking frontmatter, collection and CodeRabbit schemas to validation scripts and output
    subgraph "Core Schemas"
        A[frontmatter.schema.json]
        B[collection.schema.json]
        C[coderabbit-overrides.v2.json]
    end

    subgraph "Validation"
        D[Scripts]
        E[Tests]
        F[CI/CD]
    end

    subgraph "Documentation"
        G[README files]
        H[Instructions]
        I[Prompts]
    end

    A --> D
    B --> D
    C --> D
    D --> E
    E --> F
    A --> G
    A --> H
    A --> I
```

**Testing Flow**

```mermaid
flowchart TD
  accTitle: Code change quality pipeline
  accDescr: Flowchart showing the path from a code change through pre-commit hooks, linting, and tests to a successful commit
    A[Code Change] --> B[Pre-commit Hooks]
    B --> C{Linting Pass?}
    C -->|No| D[Fix Issues]
    D --> B
    C -->|Yes| E[Run Tests]
    E --> F{Tests Pass?}
    F -->|No| G[Debug & Fix]
    G --> E
    F -->|Yes| H[Generate Coverage]
    H --> I[Update Reports]
    I --> J[Commit & Push]
    J --> K[CI/CD Pipeline]
    K --> L[Deploy/Merge]
```

## Quality Checklist

**Before adding:**

- [ ] Diagram adds clarity beyond text (default: include if relevant).
- [ ] Context + alt description provided in prose.
- [ ] Nodes/edges clearly labelled; direction obvious.
- [ ] Size reasonable (< ~15 nodes); split if complex.
- [ ] Colour contrast meets WCAG AA (check light/dark themes).
- [ ] Mermaid syntax validated (mermaid.live or editor preview).
- [ ] Reflects current system; related docs updated.

**Maintenance:**

- [ ] Diagram matches current state.
- [ ] Linked docs updated alongside diagram changes.
- [ ] Links/refs inside diagram are valid.
- [ ] Re-validated syntax and contrast after edits.

## Validation & Tools

- Validate with Mermaid Live Editor (<https://mermaid.live>) or VS Code Mermaid preview.
- Spot-check GitHub rendering (light/dark).
- Use contrast checkers (Stark, axe, WebAIM) for chosen colours.
- Recommended editors: GitHub native Mermaid, VS Code Mermaid extensions, Draw.io (Mermaid support).
- If diagrams include links, ensure anchor text is descriptive and accessible.

## Examples Repository

- `../agents/README.md` — Agent ecosystem map
- `tests/README.md` — Testing architecture
- `scripts/README.md` — Scripts workflow
- `schemas/README.md` — Schema relationships

## References

- [instructions.instructions.md](instructions.instructions.md)
- [readme.instructions.md](readme.instructions.md)
- [documentation-formats.instructions.md](documentation-formats.instructions.md)
- [a11y.instructions.md](a11y.instructions.md)
- [file-organisation.instructions.md](file-organisation.instructions.md)
- [Mermaid Documentation](https://mermaid.js.org/)
- [GitHub Mermaid Support](https://github.blog/2022-02-14-include-diagrams-markdown-files-mermaid/)
- [W3C Complex Images](https://www.w3.org/WAI/tutorials/images/complex/)

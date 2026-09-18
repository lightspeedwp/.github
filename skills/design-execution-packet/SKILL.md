---
name: design-execution-packet
description: consolidate scattered lightspeed design, website, figma, wordpress, asana, github, google drive, email, qa, content, launch, or implementation inputs into one execution-ready packet with an explicit next route. use when source material needs normalisation, approved-vs-unconfirmed separation, readiness labelling, or handoff preparation before design qa, figma creation, wordpress block-theme work, github issue drafting, project planning, launch qa, or specialist routing.
---

# Design Execution Packet

## Purpose

Use this skill to turn scattered LightSpeed project context into one execution-ready packet that a teammate, reviewer, designer, developer, project lead, or downstream skill can use without rereading every raw source.

This skill is a **normalisation and routing layer**. It is not the final specialist workflow. Its job is to make the next step obvious, reduce rework, and separate confirmed information from assumptions.

The packet must clarify:

- what is being executed
- what is confirmed
- what is assumed
- what is excluded
- what still blocks progress
- which downstream route should happen next

Do not use this skill for small rewrites, direct code generation, direct Figma authoring, direct WordPress asset generation, or simple clarification work that does not need a handoff packet.

## LightSpeed Team Defaults

Apply these defaults unless the user overrides them:

- Write in UK English.
- Keep outputs practical, concise, and scannable.
- Start with a short route card before the detailed packet.
- Separate **approved source material**, **working drafts**, **reference-only material**, **unconfirmed notes**, **memory**, and **assumptions**.
- Prefer current project briefs, source-of-truth docs, Figma/GitHub/Asana evidence, uploaded files, and explicit user instructions over older memory.
- Treat the packet as a working handoff, not a full project bible.
- Make the recommended route clear enough that a LightSpeed teammate can continue without asking, "what now?"
- If a missing detail will not materially change the next route, continue with a labelled assumption instead of blocking.
- If a missing detail is likely to cause rework, mark the packet **Blocked** and name the exact decision or source needed.

## Start-or-Route Gate

Before creating a packet, decide whether this skill is the right entry point.

Use this skill when:

- evidence exists but is scattered across notes, docs, tasks, emails, Figma, GitHub, or user messages
- a project needs a single working interpretation before QA, design, implementation, or planning
- the user asks to make context consumable for the LightSpeed team
- the next specialist route is unclear and a short packet would reduce rework
- multiple inputs need approved-vs-unconfirmed separation before execution

Route away before using this skill when:

| Situation | Route first |
| --- | --- |
| Context is conflicting, duplicated, stale, or hard to reconcile | `design-context-synthesis` |
| The user mainly needs to choose between image, Figma, code, WordPress, QA, content, or launch workflows | `handoff-router` |
| The user needs first-run or missing project intake gathered | `lightspeed-project-intake-router`, `project-evidence-harvester`, or relevant onboarding skill |
| A complete packet, brief, or handoff already exists and needs pressure testing | `design-qa-readiness` or the relevant QA/reviewer skill |
| The user explicitly asks to generate a PRD, task breakdown, GitHub issues, implementation plan, QA plan, or release handoff | the matching LightSpeed delivery skill |
| The user explicitly asks to create or edit a Figma file | `figma-generate-design`, `edit-figma-design`, or `figma-use` as appropriate |
| The user explicitly asks to create a WordPress pattern, template, template part, block style, section style, or custom template | the matching WordPress asset specialist skill |
| The user explicitly asks for a `DESIGN.md` | `design-md-generator` |
| The user explicitly asks for AI readiness, chatbot planning, governance, or content collection | the matching LightSpeed AI readiness or chatbot skill |

If the route is obvious, do not force a packet. If the route is not obvious and a packet would reduce rework, create the packet and end with one primary recommendation.

## LightSpeed Route Map

Use this route map to select the packet destination and next specialist workflow.

| Packet destination | Use when | Required emphasis | Primary next route |
| --- | --- | --- | --- |
| **Internal review packet** | Leadership, PM, or team review needs one clean interpretation | decision summary, assumptions, risks, source confidence, ownership | human review or `design-qa-readiness` |
| **Source-normalisation packet** | Raw evidence needs approved-vs-unconfirmed separation but not full planning | source status, conflicts, gaps, reusable facts | `design-context-synthesis`, `project-evidence-harvester`, or human approval |
| **QA-ready packet** | A brief needs pressure testing before execution | ambiguity, missing decisions, go/no-go, confidence, rework risk | `design-qa-readiness` |
| **Figma-ready packet** | A designer or Figma workflow needs layout direction | frame purpose, section order, components, responsive notes, tokens, placeholders | `figma-generate-design` or `edit-figma-design` |
| **WordPress-ready packet** | A developer needs block-theme implementation direction | templates, patterns, template parts, blocks, `theme.json`, editor UX | `wordpress-block-theme-handoff` |
| **WordPress asset-routing packet** | The asset type or specialist workflow is unclear | asset type, scope boundary, metadata, validation route | `wordpress-block-theme-router` |
| **Implementation-ready packet** | The next step is task planning, GitHub issue drafting, or build sequencing | acceptance criteria, dependencies, exclusions, test notes | `lightspeed-task-breakdown-planner`, `lightspeed-github-issue-drafter`, or `lightspeed-implementation-plan-generator` |
| **Launch/QA packet** | A project is nearing launch or needs go/no-go planning | launch gates, page/template coverage, retest needs, evidence, risk | `lightspeed-launch-qa-planner`, `lightspeed-launch-readiness-auditor`, or `lightspeed-qa-findings-router` |
| **Parity/audit packet** | Figma, design system, or WordPress implementation parity needs review | token, component, layout, accessibility, responsive, content parity | `lightspeed-figma-wordpress-parity-auditor` or `audit-design-system` |
| **Content/governance packet** | Content, claims, policy, schema, AI visibility, or chatbot-safe source work is next | source-of-truth, claim safety, approval state, content gaps | matching LightSpeed content, claim, policy, schema, or chatbot skill |

Choose one primary route. Mention secondary routes only when they are genuinely useful for sequencing.

## Specialist Routing Shortcuts

Use these shortcuts when the user gives a clear destination.

### Design and Figma

- Needs design evidence reconciled first: `design-context-synthesis`
- Needs design QA or gap checking: `design-qa-readiness`
- Needs a new screen, page, modal, drawer, sidebar, or composed layout in Figma: `figma-generate-design`
- Needs an existing Figma design edited: `edit-figma-design`
- Needs Figma file actions through the Plugin API: `figma-use` first, then the relevant Figma skill
- Needs prototype-to-Figma handoff: `prototype-to-figma`
- Needs design-system audit or application: `audit-design-system`, `apply-design-system`, or `fix-design-system-finding`

### WordPress block-theme and design-system implementation

- Asset type unclear: `wordpress-block-theme-router`
- Pattern file: `wordpress-pattern-generator`
- Template part: `wordpress-template-part-generator`
- Template: `wordpress-template-generator`
- Custom template: `wordpress-custom-template-generator`
- Block style: `wordpress-block-style-generator`
- Section style: `wordpress-section-style-generator`
- Asset validation: `wordpress-block-asset-validator`
- Figma-to-WordPress technical brief: `lightspeed-figma-wordpress-technical-brief`
- Pattern extraction from Figma: `pattern-extractor`
- Theme colour token audit/fix: `theme-color-token-enforcer`
- Theme.json completion or token syncing: the matching `themejson-*` or `figma-themejson-*` skill

### Planning, delivery, and GitHub

- PRD: `lightspeed-prd-generator`
- Task breakdown: `lightspeed-task-breakdown-planner`
- GitHub-ready issues: `lightspeed-github-issue-drafter`
- Implementation sequencing: `lightspeed-implementation-plan-generator`
- Project memory: `lightspeed-project-memory-manager`
- Project pack export: `lightspeed-prd-task-pack-exporter`
- Planning review: `lightspeed-prd-task-reviewer`
- Approval gates: `lightspeed-approval-gate-manager`
- Requirements traceability: `lightspeed-requirements-traceability-mapper`

### Launch, QA, tracking, SEO, and governance

- Launch QA planning: `lightspeed-launch-qa-planner`
- Final launch readiness: `lightspeed-launch-readiness-auditor`
- QA finding triage: `lightspeed-qa-findings-router`
- Release or support handoff: `lightspeed-release-handoff-generator`
- GA4/GTM conversion planning: `lightspeed-ga4-conversion-tracking-planner`
- Redirects and migration SEO: `lightspeed-redirect-map-planner`
- Schema and AI discoverability: `lightspeed-schema-and-ai-discoverability-planner`
- Claim safety: `lightspeed-claim-register-auditor`
- Policy or trust pages: `lightspeed-policy-page-generator`

### AI readiness, chatbot, and content workflows

- AI readiness project routing: `lightspeed-ai-readiness-router` or `lightspeed-ai-readiness-orchestrator`
- Readiness scoring: `ai-readiness-assessor`
- Governance documentation: `ai-governance-documentor`
- Chatbot planning: `ai-chatbot-planner` or `chatbot-planning-orchestrator`
- Content collection: `content-collection-planner`
- Website content drafting: `lightspeed-website-content-generator`
- FAQ and chatbot source curation: `lightspeed-faq-and-chatbot-source-curator`

## Source Handling

Use the minimum evidence needed for confidence. Prefer current, approved, project-specific sources over broad memory.

Possible sources include:

- current user request and conversation context
- uploaded files or pasted notes
- Google Drive briefs, docs, sheets, decks, and reference files
- Asana tasks for scope, constraints, ownership, and delivery status
- GitHub code, issues, pull requests, commits, and implementation notes
- Gmail threads for stakeholder requests, approvals, and decisions
- Figma links, design-system notes, and design references
- live or staging site observations when the user provides URLs
- project-specific source-of-truth notes provided by the user

For LightSpeed work:

- label important sources as **approved**, **working draft**, **reference only**, **stale**, or **unconfirmed** when confidence matters
- do not treat memory, prototype copy, old notes, or inferred context as approved unless the user says so
- cite connector or uploaded-file evidence when used
- flag stale or conflicting evidence instead of smoothing over it
- keep evidence summaries short unless the user asks for a full source register

## Workflow

1. **Choose the route before writing**
   - Decide whether to use this skill or route first.
   - If using this skill, choose one packet destination.
   - Name the destination in the packet title.

2. **Gather execution-critical material only**
   - Pull confirmed facts, constraints, decisions, dependencies, exclusions, and unresolved blockers.
   - Ignore background detail that does not change execution or routing.

3. **Normalise the input**
   - Remove duplication.
   - Resolve terminology differences.
   - Collapse overlapping requests into one authoritative interpretation.
   - Preserve dissenting or unresolved points only when they create execution risk.

4. **Create the packet**
   - Turn the material into clear, ordered Markdown.
   - Use tables only when they improve scanning.
   - Avoid long prose where a checklist or decision table would be clearer.
   - Keep the packet compact enough for a teammate to act on quickly.

5. **Apply readiness labelling**
   - State whether the packet is **Ready**, **Conditionally ready**, **Blocked**, or **Route first**.
   - Explain the label in one or two practical sentences.

6. **Finish with routing**
   - Name one primary next skill or human workflow.
   - Explain why that route is the best next move.
   - Include the smallest action that reduces rework.

## Output Contract

Produce one primary deliverable, not scattered notes.

Start every packet with this route card:

1. **Value**: what this packet enables
2. **Risk**: what could still cause rework
3. **Next route**: the single recommended next workflow

Then use this default structure:

1. **Packet title**
2. **Readiness summary**
3. **Recommended route**
4. **Execution objective**
5. **Confirmed context**
6. **Source status**
7. **Assumptions used**
8. **Execution-ready brief**
9. **Dependencies, constraints, and exclusions**
10. **Outstanding blockers**
11. **Next action**

Use this structure unless another structure would be clearly more usable for the downstream route.

## Destination-Specific Requirements

### Figma-ready packet

Include:

- frame, screen, or page purpose
- section order and hierarchy
- expected components, variants, states, and placeholders
- responsive notes
- design-system, token, style, and component expectations
- content that can remain placeholder versus content that must be approved
- next route, usually `figma-generate-design`, `edit-figma-design`, or `design-qa-readiness`

### WordPress-ready packet

Include:

- likely templates, template parts, patterns, block styles, section styles, custom blocks, or plugin responsibilities
- reusable section opportunities
- editor experience implications
- `theme.json`, style variation, token, spacing, typography, colour, and block-support implications
- accessibility, responsive, performance, and content-governance notes
- implementation exclusions and validation notes
- next route, usually `wordpress-block-theme-handoff`, `wordpress-block-theme-router`, or a specific WordPress specialist skill

### QA-ready packet

Include:

- ambiguity checks
- source confidence
- missing decisions
- design, content, implementation, accessibility, responsive, SEO, analytics, and launch risks where relevant
- go/no-go recommendation for the next route
- next route, usually `design-qa-readiness`, `lightspeed-launch-readiness-auditor`, or a human approval gate

### Implementation-ready packet

Include:

- implementation scope and non-goals
- acceptance criteria
- dependency and sequence notes
- GitHub issue or Asana task readiness
- test and validation notes
- next route, usually `lightspeed-task-breakdown-planner`, `lightspeed-github-issue-drafter`, or `lightspeed-implementation-plan-generator`

### Launch/QA packet

Include:

- launch gate or go/no-go objective
- page, template, flow, form, tracking, SEO, accessibility, and responsive coverage where relevant
- known findings, retest needs, and ownership direction
- blockers and acceptable launch caveats
- next route, usually `lightspeed-launch-qa-planner`, `lightspeed-launch-readiness-auditor`, or `lightspeed-qa-findings-router`

## Readiness Labels

Use one of these labels in the readiness summary:

- **Ready**: enough confirmed context exists for the recommended downstream route.
- **Conditionally ready**: work can continue using clearly labelled assumptions.
- **Blocked**: a missing decision or source would likely cause rework.
- **Route first**: another specialist skill should run before this packet is finalised.

## Consumability Checklist

Before finishing, check that the packet answers:

- What are we trying to execute?
- What is confirmed?
- What is assumed?
- What is excluded?
- What could cause rework?
- Which route should happen next?
- Can a LightSpeed teammate act on this without rereading the raw sources?

If the answer to the last question is no, tighten the packet before responding.

## Quality Bar

A strong packet:

- gives the LightSpeed team one dependable working source
- makes the next route obvious
- separates confirmed context, assumptions, exclusions, and blockers
- translates rough design or implementation intent into actionable structure
- respects WordPress block-theme, Figma design-system, content, accessibility, performance, QA, and delivery constraints where relevant
- is specific enough to reduce rework without becoming a full project bible

A weak packet:

- repeats source material without synthesis
- leaves the downstream route vague
- mixes approved facts with guesses
- omits implementation constraints
- buries decisions in long prose
- over-documents background that does not affect execution
- names several possible routes without choosing one primary route

## Example Triggers

- "Package the brief, email thread, and Asana task into one execution-ready handoff."
- "Make this consumable for the LightSpeed team before we send it to design QA."
- "Turn these notes into a Figma-ready packet."
- "Prepare a WordPress-ready handoff from this design direction."
- "Update the routing so the next skill knows where to go."
- "Create a launch QA packet from these findings."
- "Turn this project context into something GitHub issues can be drafted from."
- "Create a single handoff from this PRD, Figma brief, and implementation notes."

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

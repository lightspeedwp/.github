---
name: lightspeed-ai-readiness-orchestrator
description: route lightspeed ai readiness client projects into the correct workflow, ask clarifying questions, enforce the sequence readiness, governance discovery, content collection and chatbot planning, and produce combined markdown project packs. use when the user is starting a new client-specific ai readiness project, wants a guided wizard, or asks which skill or document to create next.
---

# LightSpeed AI Readiness Orchestrator

## Purpose

Coordinate LightSpeed AI readiness client projects by routing the work through the installed specialist skills:

1. `ai-readiness-assessor`
2. `ai-governance-documentor`
3. `content-collection-planner`
4. `ai-chatbot-planner`
5. `lightspeed-ai-readiness-router`

This skill is the front door. It must orchestrate and sequence the specialist workflows rather than duplicate them.

## Default workflow

Always start with the router logic unless the user explicitly asks for one specialist workflow.

1. Create a source material inventory.
2. Confirm project context.
3. Route the project to the correct specialist workflow.
4. Enforce the normal sequence:
   - readiness assessment
   - governance discovery and documentation
   - content collection
   - chatbot planning
   - roadmap or proposal pack
5. Produce Markdown files or Markdown-ready sections by default.
6. Create a combined project pack when the user asks for files or a ZIP.

## Intake rules

Before routing, collect the minimum useful context:

- client name
- website URL
- sector or industry
- project type
- project stage: new lead, existing client, retainer client or internal LightSpeed initiative
- available source files or links
- desired output
- budget or timeline constraints, if known
- Figma design system URL, if available
- GitHub repositories, if relevant
- other useful URLs such as analytics dashboards, Search Console, staging site, sitemap, brand files or content inventory

Ask for uploaded files before each major workflow. Be specific about what is needed.

## Source material inventory

When source files are available, list them before asking detailed questions.

Classify each source as:

- approved source of truth
- useful but needs review
- draft or incomplete
- outdated or risky
- suitable for chatbot grounding
- not suitable for chatbot grounding
- legal or privacy review recommended

Do not invent evidence. If evidence is missing, ask focused follow-up questions.

## Routing logic

Use `references/skill-routing-rules.md` when choosing the workflow.

Use this default routing:

- If the user asks whether a website is ready for AI, route to `ai-readiness-assessor`.
- If the user asks about governance, policy, AI use rules, risk, approvals or responsible AI operations, route to `ai-governance-documentor`.
- If the user needs to collect content, organise source material, create a content request or identify content gaps, route to `content-collection-planner`.
- If the user asks about chatbot scope, AI Engine, source lists, escalation, fallback wording, launch gates or chatbot system prompts, route to `ai-chatbot-planner`.
- If the user asks broadly to start a client AI readiness project, use this orchestrator and the router sequence.

## Strict mode

Switch to strict interactive mode when the client operates in any high-risk or high-trust context, including:

- healthcare
- finance
- legal
- children or vulnerable users
- education
- insurance
- employment
- public sector
- regulated ecommerce
- sensitive personal data
- regulated advice or high-impact decisions

In strict mode:

1. Pause broad recommendations.
2. Ask additional risk, privacy, data handling, ownership and approval questions.
3. Do not recommend chatbot implementation until source content, escalation and governance are adequate.
4. Include a legal/privacy disclaimer in client-facing governance and chatbot outputs.
5. Treat missing privacy, cookie or terms documents as a warning.

## Output standards

Use `references/output-standards.md` for default document structure.

Default output should be Markdown suitable for Google Docs, GitHub or later PDF/DOCX conversion.

Separate:

- client-facing content
- internal LightSpeed notes
- open questions
- risks and assumptions
- recommended next step

Every major output should start with:

- value
- risks
- next step

Then provide numbered actions and brief notes.

## Service positioning

Use `references/lightspeed-service-positioning.md` for default service categories and proposal line items.

Recommend LightSpeed services where appropriate, but do not include pricing unless explicitly requested.

Use effort bands instead:

- small: 2 to 4 hours
- medium: 1 to 2 days
- large: 1 to 2 weeks
- programme: 2 to 4 weeks

## Chatbot planning rules

Always run content collection before chatbot planning unless the user only wants early exploratory advice.

Treat AI Engine as the default WordPress chatbot implementation option, while still making clear that platform choice should be confirmed after governance, source content and technical fit are assessed.

Chatbot outputs should include:

- purpose
- approved source list
- exclusion list
- fallback wording
- escalation wording
- disclosure wording
- lead capture rules
- privacy and log-retention notes
- transcript review owner
- test scripts
- launch gate
- go/no-go recommendation
- first-draft system prompt when appropriate

## Combined project pack

When asked to create a full client pack, produce these Markdown files:

- `[client-slug]-00-readme.md`
- `[client-slug]-01-intake-summary.md`
- `[client-slug]-02-ai-readiness-report.md`
- `[client-slug]-03-governance-discovery-summary.md`
- `[client-slug]-04-ai-governance-guide.md`
- `[client-slug]-05-content-collection-checklist.md`
- `[client-slug]-06-content-gap-report.md`
- `[client-slug]-07-chatbot-planning-brief.md`
- `[client-slug]-08-project-roadmap.md`
- `[client-slug]-09-proposal-line-items.md`
- `[client-slug]-10-next-meeting-agenda.md`

If file creation is available, bundle the Markdown files into a ZIP.

## Platform notes

This skill is ChatGPT-first. The broader implementation pack includes platform adapters for Claude Code, GitHub Copilot in VS Code and Gemini Gems.

## Version

v1.0.0 - first installable orchestrator version.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

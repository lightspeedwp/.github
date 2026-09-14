# Wizard Prompts

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

## Universal client project kickoff

```markdown
Start a new LightSpeed AI Readiness project.

Use the LightSpeed AI Readiness Orchestrator.

Guide me one section at a time.

First identify:
- client name
- website URL
- sector
- project type
- current project stage
- lead/existing/retainer/internal status
- available source materials
- desired output
- budget or timeline constraints
- Figma design system URL, if available
- GitHub repository links, if relevant

Then create a source material inventory, route the project through the correct specialist workflow, and produce Markdown outputs.
```

## Readiness assessment wizard

```markdown
Use the AI Readiness Assessor workflow.

Start with the client context and available evidence.

Ask one section at a time. Score each readiness area from 0–10:
- Website foundations
- Content readiness
- Search, structured data and AI discoverability
- Brand, UX and design system readiness
- Data, privacy and governance
- Chatbot readiness

Ask follow-up questions when evidence is missing.

Produce a Markdown readiness report with red flags, quick wins, foundation work, governance work and implementation work.
```

## Governance discovery wizard

```markdown
Use the AI Governance Documentor workflow.

Start a governance discovery process for a client website project.

Ask one section at a time.

Collect:
- business goals
- AI use cases
- excluded use cases
- data and privacy context
- content owners
- approvers
- source-of-truth materials
- chatbot relevance
- review cycle
- incident contact

Produce a governance discovery summary, lightweight policy, operational governance guide, governance matrix and role map.
```

## Content collection wizard

```markdown
Use the Content Collection Planner workflow.

Start a content collection process for a client website project.

Ask one section at a time.

Produce:
- generic website content collection checklist
- sector-specific add-ons
- source-of-truth register
- chatbot-safe content classification
- content gap report
- spreadsheet-style tracking table
- client-facing content request email

Use Markdown.
```

## Chatbot planning wizard

```markdown
Use the AI Chatbot Planner workflow.

First confirm whether content collection is complete.

If source content is weak, do not recommend implementation yet.

Ask one section at a time.

Produce:
- chatbot purpose and business goal
- audience and likely conversations
- approved source list
- exclusion list
- fallback wording
- escalation wording
- disclosure wording
- lead capture rules
- privacy and log-retention guidance
- launch gate
- go/no-go recommendation
- test scripts
- first-draft system prompt
- AI Engine implementation notes where relevant
```

## Combined client pack wizard

```markdown
Use the LightSpeed AI Readiness Orchestrator.

Create a combined client project pack from the available inputs.

Include only relevant files:
- README.md
- client-intake-summary.md
- source-material-inventory.md
- ai-readiness-report.md
- governance-discovery-summary.md
- ai-governance-guide.md
- content-collection-checklist.md
- content-gap-report.md
- chatbot-planning-brief.md
- chatbot-launch-gate.md
- project-roadmap.md
- proposal-line-items.md
- workshop-agenda.md
- internal-lightspeed-notes.md

Use Markdown and package as a ZIP if file generation is available.
```

## Proposal / roadmap wizard

```markdown
Use the LightSpeed AI Readiness Orchestrator.

Create a proposal-ready AI readiness roadmap.

Do not include pricing unless I ask.

Use effort bands:
- XS: 2–4 hours
- S: 1–2 days
- M: 3–5 days
- L: 1–2 weeks
- XL: 2–4 weeks
- Custom: needs scoping

For each line item, include:
- title
- purpose
- scope included
- deliverables
- client inputs required
- exclusions
- dependencies
- effort band
- priority
- notes/risks
```

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

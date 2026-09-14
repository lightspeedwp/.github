# Platform Adapters

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

## ChatGPT Custom GPT

Use the Custom GPT for the orchestrator/front-door experience.

Recommended setup:

1. Install the specialist skills first.
2. Create the Custom GPT.
3. Paste the custom GPT instructions into the Instructions field.
4. Upload these Markdown knowledge files individually.
5. Enable file uploads / document analysis.
6. Enable Code Interpreter & Data Analysis if you want downloadable Markdown/ZIP packs.
7. Test with the starter prompts.

## ChatGPT Skills

Use Skills for specialist workflows:

- `ai-readiness-assessor`
- `content-collection-planner`
- `ai-governance-documentor`
- `ai-chatbot-planner`
- `lightspeed-ai-readiness-router`
- `lightspeed-ai-readiness-orchestrator`

Install skills before relying on the orchestrator to route to them.

## Claude Code

Use `.claude/skills/` for skill-like workflows and `CLAUDE.md` for project memory.

Recommended structure:

```text
.claude/
├── skills/
│   ├── ai-readiness-assessor/SKILL.md
│   ├── content-collection-planner/SKILL.md
│   ├── ai-governance-documentor/SKILL.md
│   ├── ai-chatbot-planner/SKILL.md
│   └── lightspeed-ai-readiness-orchestrator/SKILL.md
└── settings.local.json
CLAUDE.md
```

Put LightSpeed-wide behaviour in `CLAUDE.md`.

## GitHub Copilot / VS Code

Use repository instructions plus agent skills.

Recommended structure:

```text
.github/
├── copilot-instructions.md
└── skills/
    ├── ai-readiness-assessor/SKILL.md
    ├── content-collection-planner/SKILL.md
    ├── ai-governance-documentor/SKILL.md
    ├── ai-chatbot-planner/SKILL.md
    └── lightspeed-ai-readiness-orchestrator/SKILL.md
```

Use `.github/copilot-instructions.md` for always-on LightSpeed conventions.

## Gemini Gem

Gemini does not use the same skill folder structure.

Create a custom Gem with:

- Name: LightSpeed AI Readiness Orchestrator
- Instructions: use `01-custom-gpt-instructions.md` as the base
- Knowledge: upload the same Markdown reference files if supported
- Starter prompts: use `11-wizard-prompts.md`

Use Gemini for advisory/writing workflows, not as the canonical skill source.

## Source-of-truth rule

Maintain one canonical Markdown source.

Update this source first, then adapt to:

1. ChatGPT Custom GPT
2. ChatGPT Skills
3. Claude Code
4. Copilot VS Code
5. Gemini Gem

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

# Platform Adapters

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

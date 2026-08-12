# PRD Factory & Planner Agent — OpenAI Configuration

OpenAI GPT-4 compatible configuration for PRD generation and project planning workflows.

**Supported Models:** gpt-4-turbo, gpt-4, gpt-4o, gpt-3.5-turbo

**Available Skills (39 total):**

- 24 Agent-attached skills via function calling
- 10 Local skills for document generation
- 5 Plugin-provided skills (github, linear, figma, google-drive, gmail)

**Function Calling Support:**
All skills are available as OpenAI functions:

```json
{
  "name": "prd_generator",
  "description": "Generate a structured PRD from requirements",
  "parameters": {...}
}
```

**Skill Integration via API:**

1. Call skill as OpenAI function: `prd-generator`, `timeline-estimator`, etc.
2. Chain multiple skills for complex workflows
3. Use JSON mode for structured PRD output
4. Integrate with Zapier/Make for workflow automation

**Plugin Skills as Functions:**

- `github_create_issue` - Create issues from requirements
- `linear_create_epic` - Create epics in Linear
- `figma_get_designs` - Reference design systems
- `google_drive_create_doc` - Create collaborative documents
- `gmail_send_update` - Email stakeholder updates

**Strengths:**

- Excellent function calling for API integrations
- Strong structured output support via JSON mode
- Cost-effective long-document generation with gpt-3.5-turbo
- Wide ecosystem support through OpenAI API partners
- Multi-skill orchestration through function composition

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*

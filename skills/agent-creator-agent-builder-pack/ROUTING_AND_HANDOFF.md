# Routing and Handoff

## Routing principle

Route before drafting. Use Agent Creator only when the deliverable is an agent pack, prompt, requirements doc, reusable skill-adjacent package, Agent Builder spec pack, or routing/packaging review.

## Keep Agent Creator when

- The user wants a new or improved agent prompt.
- The user wants an Agent Builder-ready zip handoff.
- The user wants a requirements doc for an agent.
- The user wants a full agent pack.
- The user wants a workflow wrapper around multiple LightSpeed specialist skills.
- The user wants routing review for an agent or skill-adjacent package.

## Route away when

| User need | Safer route |
|---|---|
| Create or update a general ChatGPT Skill | `skill-creator` |
| LightSpeed Figma-to-WordPress workflow skill | `figma-wordpress-skill-creator` |
| Linear workflow issue routing or task creation | relevant Linear specialist skill |
| WordPress block theme asset generation | relevant WordPress block theme skill |
| Launch QA, SEO, redirects, schema, analytics, claims, policy, content | relevant LightSpeed specialist skill |
| AI readiness, governance, content collection, chatbot planning | relevant AI readiness or chatbot skill |
| PageSpeed or WordPress performance report | relevant PageSpeed or performance skill |
| Support ticket drafting, triage, escalation, backlog analysis | relevant Zendesk or support skill |

## Handoff format

```markdown
## Routing decision

- Recommended owner:
- Why:
- What Agent Creator should still produce:
- What the specialist skill should own:
- Missing evidence:
- Human-review gate:
```

## Fallback

If a likely specialist skill is not available, state the intended route and provide a safe copy-ready handoff note without pretending the skill is installed.

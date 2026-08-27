# Chatbot-Safe Content Rules

## Chatbot-safe criteria

Content is chatbot-safe only when it is:

- public
- approved
- current
- owned by a named person or team
- supported by a source link/file
- free of confidential strategy notes
- free of unverified claims
- not legal, privacy or compliance advice
- suitable for short factual answers

## Labels

Use one of these labels:

| Label | Meaning |
|---|---|
| Chatbot Safe | Approved for chatbot grounding |
| Chatbot Safe After Review | Likely suitable, but needs approval |
| Not for Chatbot | Internal, draft, unverified or unsuitable |
| Legal Review Required | Policy, privacy or compliance content |
| Evidence Required | Claim cannot be surfaced by chatbot yet |

## Allowed chatbot snippet content

Safe snippets may explain:

- what LightSpeed does
- service categories
- solution routes
- consultation process
- approved FAQs
- approved AI governance summary
- approved privacy/accessibility summaries
- verified case-study summaries

## Restricted chatbot snippet content

Do not generate chatbot-safe snippets for:

- exact pricing unless approved
- legal, privacy or compliance advice
- urgent technical support
- security troubleshooting
- private client data
- raw stats files
- internal strategy notes
- unverified AI/ROI claims
- draft policy wording not yet approved

## Snippet format

```markdown
## Chatbot snippet: [Topic]

Answer:
[Short approved answer.]

Suggested link:
[Page]

Escalate when:
[Conditions]

Status:
[Chatbot Safe / Chatbot Safe After Review / Not for Chatbot]
```

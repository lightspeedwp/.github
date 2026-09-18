# Chatbot Conversation QA Checklist

## Client

- Client: {{client.name}}
- Website: {{client.website_url}}
- QA owner: {{qa.owner}}

## Test Questions

| Question | Expected behaviour | Result | Notes |
|---|---|---|---|
| {{test.question}} | {{test.expected}} | {{test.result}} | {{test.notes}} |

## Core QA

- [ ] Answers use approved sources
- [ ] No invented facts, prices, policies, or guarantees
- [ ] Restricted topics are refused or escalated
- [ ] Fallback wording works
- [ ] Human handoff works
- [ ] Tone is appropriate
- [ ] Lead capture is minimal
- [ ] Disclosure wording is present
- [ ] No sensitive data is requested unnecessarily

## Failure Log

| Failure | Severity | Fix | Owner |
|---|---|---|---|
| {{failure.name}} | {{failure.severity}} | {{failure.fix}} | {{failure.owner}} |

## QA Decision

- Status: {{qa.status}}
- Launch recommendation: {{qa.launch_recommendation}}
- Required fixes: {{qa.required_fixes}}

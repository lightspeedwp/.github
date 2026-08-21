---
template_id: chatbot-conversation-qa-checklist
version: 1.0.1
status: draft
---

# Chatbot Conversation QA Checklist

## Client

- Client: {{client.name}}
- Website: {{client.website_url}}
- Package: {{package.name}}
- QA owner: {{qa.owner}}
- QA date: {{qa.date}}

Use this checklist to test chatbot conversation behaviour against expected outcomes and guidelines. Record test questions, expected behaviours, results and notes.

## Test Set

| Test question | Expected behaviour | Result | Notes |
|---|---|---|---|
| {{test.question}} | {{test.expected_behaviour}} | {{test.result}} | {{test.notes}} |

## Core QA Checks

- [ ] Answers are grounded in approved sources
- [ ] Chatbot does not invent facts, prices, claims or policies
- [ ] Chatbot asks for clarification when intent is unclear
- [ ] Chatbot refuses or redirects restricted topics correctly
- [ ] Fallback wording appears when needed
- [ ] Escalation route works
- [ ] Lead capture fields are appropriate and minimal
- [ ] Tone matches approved guidance
- [ ] Disclosure wording is visible or triggered appropriately
- [ ] No sensitive data is requested unnecessarily

## Failure Cases

| Failure | Severity | Fix required | Owner |
|---|---|---|---|
| {{failure.description}} | {{failure.severity}} | {{failure.fix}} | {{failure.owner}} |

## QA Decision

- Status: {{qa.status}}
- Launch recommendation: {{qa.launch_recommendation}}
- Required fixes before launch: {{qa.required_fixes}}
- Approved by: {{qa.approved_by}}

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

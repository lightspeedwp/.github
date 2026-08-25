# Chatbot Escalation and Fallback Design Template

Use this template to design escalation and fallback behaviour for a chatbot.  
It should be created during the planning phase and updated as new scenarios emerge.

## Client

- **Client:** {{client.name}}
- **Package:** {{package.name}}

## Escalation Scenarios

List scenarios that should trigger an escalation to a human or different channel.

| Scenario | Trigger phrase or intent | Escalation target | Notes |
|---|---|---|---|
| {{scenario.name}} | {{scenario.trigger}} | {{scenario.target}} | {{scenario.notes}} |

## Fallback Responses

Define fallback messages for when the chatbot cannot answer a question or when it detects restricted content.

| Situation | Fallback wording |
|---|---|
| General “I don’t know” | {{fallback.general}} |
| Restricted topic detected | {{fallback.restricted}} |
| Ambiguous question | {{fallback.ambiguous}} |
| Human assistance requested | {{fallback.human}} |

## Handoff Paths

Detail how the chatbot hands off a conversation to a human, another channel, or a different process.

| Route | Trigger | Owner | Response time expectation |
|---|---|---|---|
| {{handoff.route}} | {{handoff.trigger}} | {{handoff.owner}} | {{handoff.response_time}} |

## Logging and Monitoring

Describe how escalations and fallback events will be logged and reviewed.  
Include who is responsible for monitoring these logs and how often.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

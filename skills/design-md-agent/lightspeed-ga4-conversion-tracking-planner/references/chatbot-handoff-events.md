# Chatbot Handoff Events

Use only when a chatbot is introduced.

## Recommended events

| Event | Purpose |
|---|---|
| `chatbot_open` | User opens assistant |
| `chatbot_question_submit` | User asks a question; do not store text in GA4 |
| `chatbot_service_route` | Bot routes to service/solution page |
| `chatbot_handoff_click` | Bot routes to booking/contact |
| `chatbot_lead_submit` | Lead captured through chatbot flow |
| `chatbot_fallback` | Bot lacks approved source or confidence |
| `chatbot_escalation` | Bot escalates sensitive or complex request |

## Parameters

- `chatbot_intent`
- `handoff_type`
- `service_area`
- `solution_area`
- `fallback_reason`

Do not send transcript text, names, email addresses or personal data to GA4.

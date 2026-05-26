# Event Naming and Parameters

## Naming rules

Use snake_case. Keep names clear and stable. Do not include changing page titles in event names; use parameters for context.

## Recommended events

| Event | Use |
|---|---|
| `consultation_cta_click` | Consultation or booking CTA clicks |
| `contact_form_start` | User starts a contact form where detectable |
| `contact_form_submit` | Contact form successful submission |
| `lead_magnet_download` | Download or access to a lead magnet |
| `service_cta_click` | Service page CTA clicks |
| `solution_cta_click` | Solution page CTA clicks |
| `email_click` | Mailto link clicks |
| `phone_click` | Phone link clicks |
| `external_link_click` | Important outbound links |
| `faq_interaction` | FAQ accordion or expand interactions |
| `chatbot_open` | Chatbot opened in Phase 2 |
| `chatbot_handoff_click` | Chatbot routes to form/booking in Phase 2 |

## Recommended parameters

- `page_type`
- `cta_text`
- `cta_location`
- `service_area`
- `solution_area`
- `form_id`
- `form_name`
- `lead_magnet_name`
- `download_type`
- `chatbot_intent`
- `handoff_type`

## Do not send to GA4

- names
- email addresses
- phone numbers
- form message content
- passwords
- API keys
- private client data
- sensitive personal data

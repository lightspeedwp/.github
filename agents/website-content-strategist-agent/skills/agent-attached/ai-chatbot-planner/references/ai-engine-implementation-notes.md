# AI Engine / WordPress Implementation Notes

Use these notes when the client is likely to use WordPress with AI Engine or related Meow Apps add-ons.

## Product family to consider

- AI Engine WordPress plugin
- AI Engine Pro
- MWAI Notifications
- MWAI Content Parser
- MWAI Visitor Form
- MWAI Woo Basics
- MWAI Better Links
- MWAI Quick Actions

## Planning questions

Before recommending a specific setup, confirm:

1. Is the chatbot informational, sales/support, ecommerce, lead capture or internal knowledge?
2. Which approved pages or documents will provide source content?
3. Will the chatbot use embeddings, uploaded documents, parsed website content or manually curated FAQs?
4. Will it collect contact details through a visitor form?
5. Does it need WooCommerce product awareness?
6. Does it need notifications, handoff or internal routing?
7. Who reviews conversations and updates source content?
8. What should happen when the bot cannot answer?
9. Is personal data collected, logged or exported?
10. What launch tests must pass before public deployment?

## WordPress-specific risks

- Plugin configuration should not replace governance.
- Parsed content should be reviewed before becoming chatbot source material.
- Draft, outdated, duplicate or low-trust pages should be excluded.
- WooCommerce answers must avoid inventing availability, pricing, shipping or refund rules.
- Visitor forms and notifications must align with privacy wording and consent needs.

## Recommended implementation stance

Use AI Engine only after:

- approved source content exists
- fallback and escalation wording is approved
- privacy/log-retention questions are answered
- the chatbot owner is named
- test scripts based on real FAQs are prepared

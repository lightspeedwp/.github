# Tour Operator Configuration Agent scope

## Own inside this skill

Use this skill for tour operator Gravity Forms work: safari/tour enquiry forms, quote requests, multi-step trip planning forms, traveller count, travel dates, destination interests, accommodation preferences, budget ranges, consultant routing, consent, optional deposits, and operational handoff notes.

## Default approach

- Prefer enquiry-first flows over full booking automation unless approved.
- Use multi-page forms for longer trip-planning journeys.
- Use conditional logic to reduce friction and avoid irrelevant questions.
- Keep personal-data capture proportionate to the enquiry stage.
- Avoid collecting passports, identity documents, medical details, or sensitive travel documents unless required and secure handling is confirmed.
- Use synthetic travel test data for QA.

## Route away

Route booking-engine architecture, availability systems, CRM architecture, payment policy, cancellation policy, travel insurance, legal terms, and external booking integrations away unless the current task is a confirmed Gravity Forms configuration or handoff.

## High-risk operations

Treat deposits/payments, passport or identity-document capture, medical/allergy data, minors' data, file uploads, CRM/webhook feeds, and production embeds as high-risk. Do not invent booking, availability, CRM, or payment behaviour that is not confirmed by source evidence.

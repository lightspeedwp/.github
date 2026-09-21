# AI Chatbot Discovery Questionnaire

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

Target audience: Clients considering a website chatbot for sales, support, onboarding, lead qualification, ecommerce, booking, education or internal knowledge use.  
Purpose: Define the chatbot's purpose, audience, source material, behaviour, boundaries, escalation rules, privacy controls and success metrics.  
Recommended format: Focused questionnaire, chatbot briefing form, implementation workshop worksheet or pre-build discovery form.  
Suggested CTA: Complete this before chatbot architecture, prompt design or tool selection begins.

> A chatbot should not be treated as a generic add-on. It needs approved knowledge sources, clear boundaries, privacy controls, escalation rules and ongoing review.

## A. Chatbot purpose

Purpose: Confirm why the chatbot should exist and what business outcome it should support.  
How LightSpeed will use this: To decide whether a chatbot is appropriate, which use cases should be prioritised and what level of governance is needed.

| # | Question | Type | Notes |
|---:|---|---|---|
| A1 | What is the primary goal of the chatbot? | Long answer |  |
| A2 | What secondary goals exist? | Long answer |  |
| A3 | Is this for sales, support, onboarding, lead qualification, internal knowledge, ecommerce, booking, education or something else? | Checkbox |  |
| A4 | What problems should it solve for users? | Long answer |  |
| A5 | What problems should it solve for the business? | Long answer |  |
| A6 | What should improve after launch? | Long answer |  |
| A7 | What should the chatbot not be responsible for? | Long answer |  |

## B. Audience and use cases

Purpose: Understand who will use the chatbot and what they will ask.  
How LightSpeed will use this: To define user journeys, answer patterns, tone, content sources and escalation paths.

| # | Question | Type | Notes |
|---:|---|---|---|
| B1 | Who will use the chatbot? | Long answer |  |
| B2 | What are their most common questions? | Long answer |  |
| B3 | What stage of the journey are they in? | Checkbox: researching, comparing, buying, onboarding, using, needing support, complaining, other |  |
| B4 | Are there different user types? | Long answer |  |
| B5 | Should answers differ by user type? | Multiple choice |  |
| B6 | What languages are needed? | Short answer |  |
| B7 | Are users likely to have accessibility needs? | Long answer |  |
| B8 | Are minors or vulnerable users likely to interact with the chatbot? | Multiple choice |  |

## C. Knowledge sources

Purpose: Identify what the chatbot is allowed to use as source material.  
How LightSpeed will use this: To build the chatbot knowledge base and prevent answers from unapproved, outdated or risky sources.

| # | Question | Type | Notes |
|---:|---|---|---|
| C1 | Which website pages should the chatbot use? | URL / Long answer |  |
| C2 | Which documents should it use? | Upload / URL |  |
| C3 | Which systems should it connect to, if any? | Checkbox: CRM, ecommerce, booking, support desk, LMS, knowledge base, analytics, none, other |  |
| C4 | What content is approved? | Long answer |  |
| C5 | What content is outdated? | Long answer |  |
| C6 | What content is missing? | Long answer |  |
| C7 | Who approves chatbot knowledge? | Short answer |  |
| C8 | How often should source content be reviewed? | Multiple choice: weekly, monthly, quarterly, biannual, annual, other |  |
| C9 | Are there documents the chatbot must never use? | Long answer |  |

### Knowledge source inventory

| Source | Location | Owner | Approved? | Last reviewed | Risk level | Notes |
|---|---|---|---|---|---|---|
|  |  |  | Yes / No |  | Low / Medium / High |  |
|  |  |  | Yes / No |  | Low / Medium / High |  |

## D. Behaviour and boundaries

Purpose: Define what the chatbot may answer, what it must avoid and when it should stop or escalate.  
How LightSpeed will use this: To create the chatbot system instruction, guardrails, fallback messages and test scripts.

| # | Question | Type | Notes |
|---:|---|---|---|
| D1 | What topics are allowed? | Long answer |  |
| D2 | What topics are restricted? | Long answer |  |
| D3 | What must the bot never say? | Long answer |  |
| D4 | Should it give advice or only information? | Multiple choice |  |
| D5 | Should it make recommendations? | Multiple choice |  |
| D6 | Should it provide pricing? | Multiple choice |  |
| D7 | Should it collect personal information? | Multiple choice |  |
| D8 | Should it handle complaints? | Multiple choice |  |
| D9 | When should it escalate to a person? | Long answer |  |
| D10 | What should it say when it does not know? | Long answer |  |
| D11 | What should it say when a topic is outside scope? | Long answer |  |
| D12 | What should happen if the user tries to manipulate the bot? | Long answer | Prompt injection and misuse testing. |

### Boundary rules

| Boundary | Rule | Escalation |
|---|---|---|
| Pricing |  |  |
| Legal/privacy questions |  |  |
| Complaints |  |  |
| Sensitive personal data |  |  |
| Technical support |  |  |
| Emergency or safety issue |  |  |
| Product/service recommendation |  |  |

## E. Tone and brand

Purpose: Make sure chatbot responses match the organisation's voice without becoming misleading or overly human.  
How LightSpeed will use this: To define the chatbot personality, response length, language rules and disclosure wording.

| # | Question | Type | Notes |
|---:|---|---|---|
| E1 | What should the bot sound like? | Long answer |  |
| E2 | Should it use the same brand voice as the website? | Multiple choice |  |
| E3 | Should it be conversational, concise, formal, warm, technical or advisory? | Checkbox |  |
| E4 | Should it use emojis? | Multiple choice |  |
| E5 | Should it use first person? | Multiple choice |  |
| E6 | Should it identify itself as AI? | Multiple choice | Recommended for transparency. |
| E7 | What words or phrases should it use? | Long answer |  |
| E8 | What words or phrases should it avoid? | Long answer |  |
| E9 | How long should answers usually be? | Multiple choice: one sentence, short paragraph, bullet list, detailed answer, depends on topic |  |

## F. Lead capture and conversion

Purpose: Define whether the chatbot should qualify leads, what information it may collect and where that information should go.  
How LightSpeed will use this: To design lead flows, consent wording, CRM/email integrations and conversion tracking.

| # | Question | Type | Notes |
|---:|---|---|---|
| F1 | Should the bot qualify leads? | Multiple choice |  |
| F2 | What information should it collect? | Checkbox: name, email, phone, company, role, location, budget, timeline, project type, order number, other |  |
| F3 | What questions should it ask before collecting contact details? | Long answer |  |
| F4 | Where should leads go? | Checkbox: email, CRM, form entry, support desk, booking system, other |  |
| F5 | Should it book meetings? | Multiple choice |  |
| F6 | Should it integrate with CRM/email? | Multiple choice |  |
| F7 | What counts as a qualified lead? | Long answer |  |
| F8 | What should the bot say after capturing a lead? | Long answer |  |
| F9 | What response time may it promise? | Short answer | Avoid overpromising. |

## G. Support and escalation

Purpose: Define how users reach a human when the chatbot cannot or should not continue.  
How LightSpeed will use this: To create escalation routes, handoff copy and support workflow rules.

| # | Question | Type | Notes |
|---:|---|---|---|
| G1 | When should the bot hand over to a human? | Long answer |  |
| G2 | Who receives escalations? | Short answer |  |
| G3 | What channels are used? | Checkbox: email, phone, live chat, WhatsApp, support ticket, CRM task, booking form, other |  |
| G4 | What response times should be communicated? | Short answer |  |
| G5 | What emergency or high-risk cases require immediate escalation? | Long answer |  |
| G6 | What information should be included in an escalation summary? | Long answer |  |
| G7 | Who is responsible for reviewing failed conversations? | Short answer |  |

## H. Privacy, security and compliance

Purpose: Identify what data may be collected, what must not be collected and what privacy controls are required.  
How LightSpeed will use this: To define consent, retention, log access, risk controls and legal/privacy review needs.

| # | Question | Type | Notes |
|---:|---|---|---|
| H1 | What personal information may be collected? | Long answer |  |
| H2 | What personal information must not be collected? | Long answer |  |
| H3 | Should users consent before submitting personal details? | Multiple choice | Confirm with adviser. |
| H4 | How long should conversation logs be stored? | Short answer |  |
| H5 | Who can access logs? | Short answer |  |
| H6 | Are there regulated topics? | Long answer |  |
| H7 | Are minors or vulnerable users likely to interact with the bot? | Multiple choice |  |
| H8 | What disclaimers are needed? | Long answer |  |
| H9 | Are there cross-border data transfer concerns? | Multiple choice | Confirm with adviser. |
| H10 | Which vendors or tools must be approved before use? | Long answer |  |

### Privacy and risk checklist

| Check | Complete? | Notes |
|---|---|---|
| Privacy notice covers chatbot use | [ ] |  |
| AI disclosure wording approved | [ ] |  |
| Personal data fields approved | [ ] |  |
| Sensitive data restrictions defined | [ ] |  |
| Log retention period defined | [ ] |  |
| Log access restricted | [ ] |  |
| Escalation process defined | [ ] |  |
| Prompt injection tests planned | [ ] |  |
| High-risk topics restricted | [ ] |  |
| Legal/privacy adviser review completed where needed | [ ] |  |

## I. Success metrics

Purpose: Define how the chatbot will be judged after launch.  
How LightSpeed will use this: To configure analytics, review logs and improve source content over time.

| # | Question | Type | Notes |
|---:|---|---|---|
| I1 | What does success look like? | Long answer |  |
| I2 | Should it reduce support tickets? | Multiple choice |  |
| I3 | Should it increase qualified leads? | Multiple choice |  |
| I4 | Should it provide faster answers? | Multiple choice |  |
| I5 | Should it increase conversion rate? | Multiple choice |  |
| I6 | Should it reveal content gaps? | Multiple choice |  |
| I7 | Should it reduce repeated questions? | Multiple choice |  |
| I8 | What should be measured weekly? | Long answer |  |
| I9 | What should be measured monthly? | Long answer |  |
| I10 | What would cause the chatbot to be paused or rolled back? | Long answer |  |

### Suggested metrics

| Metric | Target | Reporting frequency | Owner |
|---|---|---|---|
| Conversations started |  | Weekly / Monthly |  |
| Successful answers |  | Weekly / Monthly |  |
| Fallback rate |  | Weekly / Monthly |  |
| Escalation rate |  | Weekly / Monthly |  |
| Lead captures |  | Weekly / Monthly |  |
| Qualified leads |  | Weekly / Monthly |  |
| Support deflection |  | Weekly / Monthly |  |
| User satisfaction |  | Weekly / Monthly |  |
| Incorrect answer reports |  | Weekly / Monthly |  |
| New content gaps identified |  | Weekly / Monthly |  |

## J. Launch and maintenance

Purpose: Define how the chatbot will be tested, approved, launched and improved.  
How LightSpeed will use this: To create a safe delivery plan with test scripts, approvals, rollback and ongoing review.

| # | Question | Type | Notes |
|---:|---|---|---|
| J1 | Who tests the chatbot? | Short answer | Include business, content, support and technical testers. |
| J2 | Who approves launch? | Short answer |  |
| J3 | How often is knowledge updated? | Multiple choice |  |
| J4 | Who reviews logs? | Short answer |  |
| J5 | How are incorrect answers fixed? | Long answer |  |
| J6 | What is the rollback process? | Long answer |  |
| J7 | What ongoing support is needed? | Long answer |  |
| J8 | What launch date or phase is preferred? | Short answer |  |
| J9 | Should the chatbot launch as a pilot first? | Multiple choice | Recommended for most projects. |

### Pre-launch approval checklist

- [ ] Bot purpose approved.
- [ ] Approved source content loaded.
- [ ] Restricted topics configured.
- [ ] Fallback response tested.
- [ ] Escalation route tested.
- [ ] AI disclosure visible.
- [ ] Privacy wording approved.
- [ ] Lead capture flow tested.
- [ ] Analytics/events configured.
- [ ] Accessibility checks completed.
- [ ] Prompt injection tests completed.
- [ ] Human review owner assigned.
- [ ] Rollback process documented.

## Suggested next step after completion

Use this questionnaire to create a chatbot scope document, AI governance guide, knowledge source inventory and implementation estimate. Do not select tooling until the chatbot purpose, boundaries, knowledge sources and privacy requirements are clear.

## Agency-facing notes

- If the client cannot identify approved knowledge sources, quote for content collection and knowledge base preparation before chatbot implementation.
- If the bot will collect personal data, involve privacy review early.
- If the bot will answer regulated, safety-sensitive or vulnerable-user topics, increase human oversight and escalation requirements.
- Start with a narrow pilot rather than a broad general-purpose chatbot.

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

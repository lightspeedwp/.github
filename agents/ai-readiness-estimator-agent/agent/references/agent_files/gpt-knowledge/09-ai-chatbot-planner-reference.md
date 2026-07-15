# Skill Reference: ai-chatbot-planner

## Purpose

Use `ai-chatbot-planner` to plan safe, bounded website chatbots for LightSpeed client projects.

## Required rule

Always run Content Collection Planner before AI Chatbot Planner unless the user explicitly confirms content collection is complete.

Refuse to recommend chatbot implementation if source content is weak.

## Supported chatbot types

Support:

- sales
- support
- lead qualification
- ecommerce
- booking
- internal knowledge
- onboarding
- education/LMS
- membership/subscription support

## Required outputs

Always include:

- chatbot purpose and business goal
- audience and use cases
- approved source list
- exclusion list
- behaviour and boundary rules
- fallback wording
- escalation wording
- disclosure wording
- human handoff rules
- lead capture rules
- privacy and log-retention guidance
- launch gate
- go/no-go recommendation
- test scripts based on real FAQs or FAQ candidates
- first-draft system prompt where appropriate
- internal LightSpeed implementation notes

## Source list requirements

Create:

1. Approved source list
2. Exclusion list
3. Missing source list
4. Needs-review source list

## Fallback wording example

Use or adapt:

> I want to make sure I give you accurate information. I do not have enough confirmed detail in the approved content to answer that properly. I can help point you to the right page or connect you with the team.

## Escalation wording example

Use or adapt:

> This needs a member of the team to review it properly. I can help pass your request to the right person now.

## Disclosure wording example

Use or adapt:

> I’m an AI assistant for this website. I can help you find information from approved website content, but I may hand you over to the team if your question needs human review.

## AI Engine default

For WordPress chatbot planning, treat AI Engine as the default WordPress chatbot option to evaluate first.

Still explain assumptions and fit.

Where relevant, include AI Engine-specific notes for:

- source content preparation
- chatbot configuration
- content parser use
- visitor forms
- WooCommerce support
- notifications
- link handling
- quick actions
- transcript review and improvement workflow

## Launch gate checks

Include:

- Approved source content exists and is current
- Allowed and restricted topics are documented
- Fallback and escalation wording is approved
- Privacy wording and consent needs are defined
- Human handoff route is operational
- Transcript review owner is named
- Success measures are defined
- The chatbot has been tested against real questions

## Go/no-go recommendation

Use:

- Go
- Conditional go
- No-go

A no-go is required when source content is weak, boundaries are missing or escalation is undefined.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

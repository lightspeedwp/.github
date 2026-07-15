# Risk, Red Flags and Strict Mode

## Purpose
Use this file to identify risk signals, switch to stricter questioning and prevent unsafe or premature AI implementation recommendations.

## Strict mode triggers
Switch to stricter interactive mode when the sector or use case involves:

- healthcare
- finance
- legal
- children
- education
- insurance
- employment
- public sector
- regulated ecommerce
- vulnerable users
- personal data at scale
- sensitive personal information
- high-reputation-risk advice
- public-facing chatbot handling sensitive queries

## Strict mode behaviour
In strict mode:

- pause before producing final implementation recommendations
- ask more governance, privacy and escalation questions
- require source-of-truth clarity
- flag missing privacy, cookie or terms documents as warnings
- block chatbot implementation recommendations if source content is weak
- recommend legal/privacy review
- require stronger approval and incident processes
- separate what can be drafted from what must remain human-led

## Red flags
Treat these as red flags even if the overall score is strong:

- no clear content owner
- no approved source-of-truth documents
- outdated privacy, cookie or terms content
- chatbot requested before reliable FAQs or policies exist
- regulated, sensitive or vulnerable-user context
- unclear human escalation route
- unsupported claims or statistics
- no approval workflow for AI-generated content
- weak security, maintenance or access controls
- no way to correct inaccurate AI outputs
- personal data being entered into public AI tools without rules
- thin, duplicated or outdated content
- no transcript review plan for chatbot use
- no analytics or performance measurement
- no clear business outcome for AI adoption
- no stakeholder responsible for governance after launch

## Required response to red flags
When red flags appear:

1. Slow down.
2. Explain why the issue matters.
3. Ask focused follow-up questions.
4. Recommend foundation or governance work before implementation.
5. Clearly distinguish blockers from warnings.

## Blockers vs warnings

### Treat as blockers
- Weak or missing source content for a proposed chatbot.
- No escalation path for a public chatbot in a sensitive/high-risk context.
- No approval owner for AI-generated public content.
- Request to automate regulated advice without review.
- Request to handle sensitive personal data without governance.

### Treat as warnings
- Missing privacy, cookie or terms documents.
- Missing analytics or performance data.
- Incomplete design system.
- Inconsistent tone of voice.
- Old content that may need review.

## Legal/privacy disclaimer
Use this disclaimer in governance and chatbot outputs:

> This document supports operational planning and governance. It is not legal, regulatory or privacy advice. Requirements should be confirmed with a qualified legal or privacy adviser, especially where personal data, regulated sectors, vulnerable users or public-facing AI systems are involved.

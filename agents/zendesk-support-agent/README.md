---
file_type: documentation
title: "Zendesk Support Agent — Quick Reference"
description: "README for agents/zendesk-support-agent/README.md."
status: active
stability: stable
domain: governance
last_updated: "2026-08-19"
---

# Zendesk Support Agent — Quick Reference

**Version:** 1.0.0 | **Status:** Production | **Created:** 2026-07-22

## Overview

The Zendesk Support Agent manages customer support tickets, drafts professional responses, integrates with knowledge bases, analyzes ticket patterns, and routes escalations to improve support efficiency and customer satisfaction.

## Quick Start

### 1. Ticket Intake & Categorization


```

Input: New customer ticket
Process: Analyze content, categorize issue, assess priority
Output: Categorized ticket, priority, context summary

```

### 2. Response Assistance


```

Input: Ticket details, tone preference
Process: Search KB, draft response, analyze sentiment
Output: Professional response draft, alternatives, quality assessment

```

### 3. Knowledge Base Integration


```

Input: Customer issue
Process: Search relevant articles, assess relevance
Output: Recommended articles, solution suggestions

```

### 4. Escalation Routing


```

Input: Ticket complexity, team availability
Process: Assess routing criteria, determine team
Output: Routing recommendation, escalation justification

```

## Core Capabilities

- Ticket management and organization
- Professional response drafting
- Knowledge base search and integration
- Customer sentiment analysis
- Issue categorization and tagging
- Escalation routing and prioritization
- Response quality assessment
- Support metrics and reporting

## Provider Support

| Provider | Status | Integration | Tools |
|----------|--------|-------------|-------|
| **Claude** | Production | Full API | 6 tools |
| **GitHub Copilot** | Production | GitHub native | 6 skills |
| **OpenAI** | Production | Function calling | 6 functions |

## Six-Phase Methodology

### Phase 1: Ticket Intake

Receive and categorize incoming tickets with context assessment

### Phase 2: Context Gathering

Search knowledge base and customer history for relevant information

### Phase 3: Problem Analysis

Analyze customer sentiment and identify root cause

### Phase 4: Response Generation

Draft professional response with KB article references

### Phase 5: Routing Decision

Determine appropriate team or escalation path

### Phase 6: Quality & Follow-up

Validate response quality and plan follow-up actions

## Key Files

- **AGENT.md** – Complete specification and workflows
- **claude/agent.md** – Claude implementation details
- **claude/tools.json** – Tool definitions and schemas
- **copilot/agent.md** – GitHub Copilot skills
- **openai/agent.md** – OpenAI functions
- **shared/core-prompt.md** – Detailed 6-phase methodology

## Ticket Management Features

### Automatic Classification

- Category assignment
- Priority determination
- Urgency assessment
- Routing recommendations
- SLA compliance tracking

### Response Quality

- Professional tone
- Completeness verification
- Empathy assessment
- Solution focus validation
- Grammar and clarity check

### Customer Insights

- Sentiment analysis
- Emotion detection
- Satisfaction assessment
- Hidden concerns identification
- Communication patterns

### Knowledge Management

- KB article recommendations
- Solution matching
- Coverage gap identification
- Content relevance scoring
- Article quality assessment

## Configuration

### Zendesk Connection

- API key setup
- Workspace configuration
- Ticket queue assignment
- Custom field mapping
- Automation rules

### Knowledge Base Setup

- Category organization
- Article management
- Search optimization
- Content curation
- Relevance tuning

### Team Configuration

- Agent assignment
- Skill-based routing
- Availability management
- Escalation paths
- SLA definitions

## Support Metrics

### Response Metrics

- Average response time
- First-contact resolution rate
- Response quality score
- Customer satisfaction (CSAT)
- Time to resolution

### Workload Metrics

- Tickets per agent
- Queue depth trending
- Escalation rate
- Volume patterns
- Staffing needs

### Quality Metrics

- Response accuracy
- Customer satisfaction
- Knowledge base usage
- Compliance adherence
- Agent performance

## Response Quality Checklist

Before sending a response:

- [ ] Addresses customer concern
- [ ] Professional tone maintained
- [ ] Clear and concise language
- [ ] Includes relevant KB articles
- [ ] Offers alternative solutions
- [ ] Sets proper expectations
- [ ] Provides follow-up timeline

## Common Response Templates

### Problem Acknowledgment

"Thank you for contacting us regarding [issue]. I understand how [emotion word] this must be."

### Investigation Statement

"I've reviewed your account and ticket history. I can see that [context]."

### Solution Delivery

"Here's how we can resolve this: [steps]. I've also included this [KB article] for additional guidance."

### Follow-up

"Please let me know if this resolves your issue. I'm available [timeframe] if you need further assistance."

## Escalation Triggers

Escalate when:

- Issue severity is high
- Multiple failed resolutions attempted
- Customer expressed strong frustration
- Requires specialized expertise
- Involves account/billing issues
- Technical complexity exceeds first-line support

## Knowledge Base Best Practices

- Keep articles current and accurate
- Use clear, customer-friendly language
- Include step-by-step instructions
- Add screenshots/visuals when helpful
- Link related articles
- Regular review and updates
- Track article usage metrics

## Performance Tips

### For Better Response Quality

- Review response drafts before sending
- Incorporate customer context
- Reference relevant KB articles
- Personalize solutions
- Show empathy and understanding

### For Faster Resolution

- Use templates for common issues
- Proactively provide KB articles
- Clear escalation paths
- Complete customer information
- Defined SLAs and timeframes

### For Higher Satisfaction

- Acknowledge customer emotions
- Provide multiple options
- Follow up proactively
- Track resolution outcomes
- Collect feedback regularly

## Troubleshooting

### Issue: No Relevant KB Articles Found

- Expand search criteria
- Check KB article tags
- Review article titles
- Consider alternative keywords

### Issue: Sentiment Analysis Inaccurate

- Review full ticket context
- Check for sarcasm/cultural nuances
- Consider communication style
- Ask for clarification if needed

### Issue: Routing Recommendations Wrong

- Review team skills and availability
- Check SLA requirements
- Verify escalation criteria
- Update team configuration

### Issue: Response Quality Low

- Review tone and language
- Add more KB references
- Include more context
- Provide better solutions

## Integration Checklist

Before using the agent:

- [ ] Zendesk account configured
- [ ] API credentials set up
- [ ] Knowledge base populated
- [ ] Team structure defined
- [ ] Routing rules configured
- [ ] SLAs established
- [ ] Agent permissions set
- [ ] Templates created

## Support & Training

For support team members:

1. Review AGENT.md specification
2. Check provider-specific implementation (claude, copilot, openai)
3. Consult the 6-phase methodology in shared/core-prompt.md
4. Practice with sample tickets
5. Review quality feedback regularly

## Response Time Targets

| Priority | Target | SLA |
|----------|--------|-----|
| Critical | 15 min | 1 hour |
| High | 1 hour | 4 hours |
| Normal | 4 hours | 24 hours |
| Low | 24 hours | 72 hours |

## Sample Response Templates

### Technical Issue Acknowledgment

"Thank you for reporting this issue. I've reviewed the error details you provided. This appears to be related to [system]. Let me help you resolve this."

### Billing Issue Resolution

"I understand your concern about the charge. I've reviewed your account and found [explanation]. Here's how we'll resolve this: [steps]."

### Feature Request Response

"Thank you for the feature suggestion. This is valuable feedback. We've noted your request and will consider it for future releases."

### Problem Escalation

"Thank you for your patience. This issue requires specialized expertise. I'm escalating this to our [team], who will contact you within [timeframe]."

## Metrics Dashboard

Track these metrics:

- **Response Time** – Time from ticket arrival to first response
- **Resolution Time** – Time from ticket arrival to closure
- **CSAT Score** – Customer satisfaction rating (1-5)
- **FCR Rate** – First contact resolution percentage
- **Escalation Rate** – Percentage of tickets escalated
- **Agent Productivity** – Tickets resolved per hour
- **KB Utilization** – Articles referenced per ticket
- **Queue Depth** – Tickets waiting for response

## Common Issues & Solutions

### Long Response Times

- Add more agents
- Improve KB coverage
- Streamline processes
- Better prioritization
- Implement time-saving tools
- Reduce queue depth
- Optimize workflows
- Use templates

### Low Customer Satisfaction

- Increase agent training
- Improve KB articles
- Review response quality
- Increase empathy focus
- Personalize responses
- Follow up proactively
- Address root causes
- Gather feedback

### High Escalation Rate

- Expand first-line authority
- Add KB articles
- Better routing
- More training
- Empower agents
- Improve processes
- Update documentation
- Regular reviews

### Agent Burnout

- Monitor workload
- Support career growth
- Provide training
- Recognize achievement
- Offer flexibility
- Create community
- Set realistic goals
- Regular feedback

## Related Documentation

- **AGENT.md** – Full specification and capabilities
- **shared/core-prompt.md** – Detailed methodology and workflows
- **claude/agent.md** – Claude-specific implementation
- **AGENTS.md** – Organization standards

---

*Built by LightSpeedWP with open-source spirit!*

## Repository Flow

```mermaid

graph LR
  accTitle: graph diagram
  accDescr: graph flowchart
    A["Scope"] --> B["Inputs"]
    B --> C["Process"]
    C --> D["Validation"]
    D --> E["Outputs"]

    style A fill:#4a148c,color:#fff
    style B fill:#1b5e20,color:#fff
    style C fill:#bf360c,color:#fff
    style D fill:#f57f17,color:#fff
    style E fill:#00695c,color:#fff

```

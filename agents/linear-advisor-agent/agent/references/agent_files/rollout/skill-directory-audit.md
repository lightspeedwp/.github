# Skill directory audit

## Current agent context

**Agent:** LightSpeed Linear Advisor  
**ChatGPT short description:** Fast Linear triage, shaping, and routing.

This audit reflects the current attached-skill set and current instruction posture: the agent is optimized to answer directly first, stay Linear-first, and use skills selectively when they materially improve the result.

## Accessibility status

### Team-directory accessible attached skills

These attached skills are shared ChatGPT skills and are already team-accessible:

- `linear-app-skill-creator`
- `linear-skill-intake-onboarding`
- `markdown-output-formatter`
- `linear-unplanned-work-intake-audit`
- `linear-triage-sop-builder`
- `linear-triage-rules-designer`
- `linear-duplicate-management-playbook`
- `linear-the-architect`
- `linear-gap-analyzer`
- `linear-momentum-auditor`
- `linear-decision-logger`
- `linear-voice-of-customer`
- `linear-triage-router`
- `linear-sub-issue-splitter`
- `linear-project-pulse`
- `linear-memory-maintenance`

## Audit findings

### What is working

- The attached Linear workflow skills are narrow and clearly differentiated.
- The memory-maintenance skill fills a real gap around Memory read/write judgment.
- The current instruction set prefers direct answers first and reserves skill use for cases where a specialist workflow clearly helps.
- The agent has a clear specialist spine for shaping, routing, gap analysis, momentum review, duplicate handling, durable decision capture, and Memory judgment.

### Current alignment risks

- Some shared skills may mention other internal LightSpeed or support skills that are not attached here. Those references should remain background only, not active routing targets.
- Team rollout guidance should continue to treat this agent as a fast Linear advisor first, not as a broad workflow-design or skill-factory agent.
- Because Linear is still configured as an end-user app, teammate rollout should verify whether that connection model is the intended long-term choice.

### Routing rule to preserve

For this agent:

- answer directly when a direct answer is enough
- use no skill by default for quick recommendations, light reviews, and small rewrites
- prefer one specialist skill when the request clearly fits a narrow job
- ignore any skill reference that points to a skill not actually attached here
- use formatting-only polish last, not first

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

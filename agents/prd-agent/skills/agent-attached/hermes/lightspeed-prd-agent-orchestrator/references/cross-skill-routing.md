# Cross-skill routing

Use one primary skill and at most one supporting skill.

## Primary routes

- Intake: `lightspeed-project-intake`
- Research: `lightspeed-project-research`
- PRD writing/update: `lightspeed-prd-writer`
- Estimation: `lightspeed-estimation-planner`
- Delivery/task planning: `lightspeed-delivery-planner`
- Review: `lightspeed-prd-reviewer`
- Approval: `lightspeed-approval-gate-manager`
- Change control: `lightspeed-change-control`
- Status: `lightspeed-project-status-reporter`
- QA planning: `lightspeed-qa-planner`
- QA findings: `lightspeed-qa-triage`
- Release handoff: `lightspeed-release-handoff-generator`
- Export: `lightspeed-project-pack-exporter`
- Durable state: `lightspeed-project-memory-manager`

## Supporting-skill rule

Add one supporting skill only when:

- the downstream specialist needs another structured input first
- the output must explicitly note a parallel implication such as estimate impact or QA impact
- a route without the supporting skill would hide a material blocker

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

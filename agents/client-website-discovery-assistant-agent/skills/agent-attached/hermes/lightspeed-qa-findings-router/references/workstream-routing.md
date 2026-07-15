# Workstream Routing

Use this reference to route QA findings to LightSpeed owner roles and related skills.

## Owner-role suggestions

| Workstream | Owner role | Specialist route |
|---|---|---|
| Design parity | Design lead + front-end lead | `lightspeed-figma-wordpress-parity-auditor` |
| Design handoff | Design lead | `design-qa-readiness` or `design-execution-packet` |
| Block theme | WordPress theme developer | `wordpress-block-theme-router` |
| Block plugin | WordPress plugin/block developer | `lightspeed-github-issue-drafter` or plugin-specific planning skill |
| Pattern/template | Theme developer + content/editorial reviewer | `wordpress-block-asset-validator` or `wordpress-block-theme-router` |
| Content/copy | Content owner | `lightspeed-website-content-generator` |
| Claim/proof | Claim owner + reviewer | `lightspeed-claim-register-auditor` |
| Accessibility | Accessibility reviewer + developer | `lightspeed-launch-readiness-auditor` |
| Responsive/mobile | Front-end developer | `lightspeed-github-issue-drafter` |
| Forms/conversion | Developer + marketing/CRM owner | `lightspeed-ga4-conversion-tracking-planner` when tracking is affected |
| Analytics/tagging | Analytics owner | `lightspeed-ga4-conversion-tracking-planner` |
| Redirects/SEO | SEO/launch owner | `lightspeed-redirect-map-planner` |
| Technical SEO | SEO/technical lead | `technical-seo-audit` |
| Schema/AI discoverability | SEO/content engineer | `lightspeed-schema-and-ai-discoverability-planner` |
| Performance | DevOps/front-end developer | `website-performance-assessor` |
| Policy/governance | Governance owner + privacy/legal reviewer | `lightspeed-policy-page-generator` |
| Chatbot/source governance | AI readiness owner + content owner | `ai-chatbot-planner` or `chatbot-planning-orchestrator` |
| Launch operations | Technical lead | `lightspeed-launch-task-router` |
| Release/handoff | Delivery lead + support owner | `lightspeed-release-handoff-generator` |
| Post-launch optimisation | Strategy/content/analytics lead | `post-launch-optimisation` |

## Routing principles

- Route to the most specific skill, not the broadest one.
- If the user needs a fix issue, route to `lightspeed-github-issue-drafter` after triage.
- If the user needs a full audit, route to the relevant auditor before issue drafting.
- If the issue is a scope change, route to `lightspeed-change-request-router` before implementation.
- If launch approval is affected, route to `lightspeed-approval-gate-manager`.
- If there is no finding yet, route upstream to `lightspeed-acceptance-test-planner` or `lightspeed-launch-qa-planner`.

## Cross-skill usability checks

Before recommending a related skill, state:

1. why it is the right next route,
2. what input that skill needs,
3. what output LightSpeed should expect,
4. whether the current evidence is enough or still incomplete.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

# Shared-Agent Smoke Test Plan

Use this plan before enabling the skill for a shared workspace agent or after changing the skill package.

## Goal

Confirm that the shared agent can use the skill consistently without relying on one teammate's login, saved Zendesk views, personal memory, or local helper files.

## Minimum smoke tests

Run the prompts from `examples/prompt-cookbook.md` against a safe Zendesk test scope or a narrow real queue that the tester is allowed to access.

| Scenario | What should happen | Must not happen |
|---|---|---|
| Current backlog health | Agent states the scope, uses Zendesk counts/metadata, reports risks and actions | Invents counts, assumes SLA visibility, or uses a private view |
| Weekly support report | Agent uses a current window and comparison window, or states comparison is unavailable | Compares mismatched filters without saying so |
| Repeated-theme review | Agent classifies patterns cautiously using observed signals | Calls a cluster an incident without confirmed evidence |
| Permission-limited session | Agent refuses synthetic reporting and names the missing capability | Produces a plausible report without Zendesk counts or metadata |
| Follow-on request | Agent routes narrowly to the matching Zendesk workflow | Defaults to Linear, GitHub, Asana, Slack, Gmail, or Google Drive |

## Pass criteria

The skill is ready for shared-agent rollout only when:

- every report includes an evidence basis and gaps section
- unavailable SLA, CSAT, comparison, or conversation access is stated clearly
- all recommended actions are support-owned unless the user explicitly asks for cross-system follow-up
- no output depends on personal saved views, local paths, uploaded file IDs, or one user's memory
- no customer-sensitive detail is included unless operationally necessary and access-appropriate

## Recording results

Use `examples/smoke-test-results-template.md` to capture test results. Keep results outside the skill package when they include real ticket data.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

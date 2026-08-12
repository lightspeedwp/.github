# Configuration handoff contract

Use this contract when preparing findings for the `tour-operator-gravity-forms-configuration` skill. The auditor must not apply the changes.

## Required handoff fields

- Source audit report: title/date/site/environment/report path or summary.
- Finding ID: stable ID from findings register.
- Affected site: canonical site URL and environment.
- Affected form/page/add-on: form ID/title, page URL, feed/add-on/notification/confirmation if known.
- Evidence: concise confirmed evidence, redacted where needed.
- Recommended fix: what should change and why.
- Risk level: Blocker, High, Medium, Low, or Info.
- Required MCP capability: e.g. update form schema, update notification, update confirmation, update feed, update page embed, update personal data setting.
- Required add-ons: installed/active/licence evidence or missing dependency.
- Approval needed: yes/no plus reason.
- Suggested validation steps: post-change checks, test submission requirements, logs, page checks, notification checks.
- Rollback consideration: what to revert or preserve if the change causes issues.
- Suggested prompt for the `tour-operator-gravity-forms-configuration` skill: direct prompt with enough context and no hidden assumptions.

## Handoff quality bar

- Include only actionable findings.
- Keep personal data out of the handoff unless absolutely required and permitted.
- Mark missing evidence instead of inventing details.
- Separate official Gravity Forms guidance from LightSpeed recommendations.
- Include acceptance/retest criteria so configuration work can close cleanly.

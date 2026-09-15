# Article Templates

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Use this reference after the article type has been selected. Keep drafts focused, searchable, and easy to review.

## How-To Article

Use when the customer needs to complete a task or configuration.

```md
# <Task-focused title>

<Plain first sentence explaining the task this article helps with.>

Use this guide to <complete/configure/check/update> <specific task>.

## Who this is for

This article is for <audience> who need to <job to be done>.

## Before you start

- <Prerequisite 1>
- <Prerequisite 2>
- <Access or permission needed>

## Steps

1. <Step one>
2. <Step two>
3. <Step three>

## Check it worked

You should see <success state>.

## If something does not work

- If <condition>, try <safe action>.
- If <condition>, contact support with <specific information>.

## Limits and notes

- <Known limitation or caveat>
- <When support should be contacted>
```

## Troubleshooting Article

Use when the customer has a symptom, error, or failed outcome.

```md
# <Symptom or exact error title>

<Plain first sentence naming the symptom or error.>

This article helps you check the most common confirmed causes and next steps.

## Symptoms

You may see:

- <Symptom 1>
- <Symptom 2>
- <Exact error wording, if available>

## What to check first

1. <Most likely check>
2. <Second check>
3. <Third check>

## Fixes to try

### <Fix 1>

<Steps or explanation.>

### <Fix 2>

<Steps or explanation.>

## If the issue continues

Contact support and include:

- <Information support needs>
- <Screenshot, log, URL, account detail, or timestamp if safe>
- <What has already been tried>

## Notes for support

<Only include this section for internal articles. Remove from public drafts.>
```

## FAQ Article

Use when the customer has a repeated short question.

```md
# <Question in customer language?>

<Direct answer in the first sentence.>

## Details

<Short explanation, exception, or condition list.>

## Related questions

- <Related question or article>
- <Related question or article>

## Need help?

<Contact/support guidance if appropriate.>
```

## Known Issue Article

Use when there is a confirmed or likely product issue, temporary limitation, or workaround.

```md
# <Known issue title using customer-facing symptom>

<Plain first sentence naming the issue and current status.>

## Current status

<Confirmed status, workaround status, or investigation status. Do not include unsupported timelines.>

## Who is affected

This may affect <audience/feature/setup/version>, based on confirmed evidence.

## Workaround or mitigation

<Steps the customer can take now.>

## What support needs

If the workaround does not help, contact support with:

- <Information needed>
- <Timestamp or example>
- <Screenshots or logs, if appropriate>

## Review notes

This article should be reviewed when:

- <Product status changes>
- <Fix is released>
- <More evidence confirms or narrows the affected audience>
```

## Internal Support Note

Use when the knowledge should stay internal.

```md
# Internal note: <support-facing title>

> Internal support knowledge only. Do not publish this article publicly without review.

## When to use this note

Use this when <support scenario or trigger>.

## Confirmed symptoms or conditions

- <Condition 1>
- <Condition 2>
- <Condition 3>

## Diagnostic steps

1. <Check>
2. <Check>
3. <Check>

## Safe customer-facing wording

<Approved wording support can reuse.>

## Escalation triggers

Escalate when:

- <Trigger 1>
- <Trigger 2>
- <Trigger 3>

## Internal-only context

<Private context, caveats, or notes that must not appear in public articles.>
```

## Existing Article Update Brief

Use when an existing article should be updated rather than creating a new one.

```md
# Update brief: <existing article title>

## Existing article

- Title: <title>
- URL or location: <link/location if available>
- Current audience: <audience>

## Why update it

<What is missing, stale, unclear, or risky.>

## Recommended changes

- <Change 1>
- <Change 2>
- <Change 3>

## Suggested replacement section

<Section-ready markdown.>

## Publishing notes

- Source: <source material>
- Evidence confidence: <high | medium | low>
- Reviewer needed: <person/team/none>
- Public/internal boundary: <what should stay out of the article>
```

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

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

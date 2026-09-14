# Forward Workflow

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
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Read this file when the user wants to forward an email or thread, decide what context to attach, or turn a long thread into a useful forward.

## Tool

- Use the Gmail `forward_emails` action for forwarding.
- The tool shape is:
  - `message_ids: list[str]`
  - `to: str`
  - `cc: str`
  - `bcc: str`
  - `note: str`
- `forward_emails` is a bulk action over `message_ids`. It sends a separate new forwarded email for each source message, inlines the original content, and preserves the original attachments.
- The `note` parameter is the full email body that will be attached above the forwarded content. It can be used to add context, a request, or a summary, and it accepts Markdown-style body text.

## Core Defaults

- Understand the forwarding intent before adding a note.
- If the user is not clear about why they are forwarding the email, either ask for context you can attach or forward without a note. Do not assume the user's intent.
- Read the message or recent thread context before forwarding so the note, if any, is accurate.
- If the thread is long, summarizing it is often more useful than forwarding without context.
- Be extra careful when forwarding across business email domains. If the recipient is outside the user's company, pay attention to unintentional information exposure and avoid assuming that internal context is safe to share.

## Common Forwarding Intents

- `FYI` -> no action needed
- `Review` -> read and comment
- `Decision` -> approve or reject
- `Action` -> do X by Y

Make the forwarding note explicit about which bucket applies when the user has made that clear.

## Context Note Pattern

1. Identify whether the forward is just a pass-through or whether the recipient needs framing.
2. If framing helps, keep the note short and action-oriented.
3. For long threads, summarize only the parts the new recipient needs:
   - what this is about
   - current status
   - any open question or requested action
   - any deadline or decision needed
4. Match the note to the user's goal and tone.

## When To Ask

- Ask for clarification when the user names the recipient but not the reason for forwarding and the note would otherwise require guessing.
- Ask when the right audience or expected action is ambiguous.
- Do not ask if the user clearly wants a plain forward with no added context.

## When To Send Without A Note

- The user explicitly asks to forward the message as-is, without any added note.
- The forward is truly just for awareness and adding a note would add little value.
- The intent is unclear, but the forwarded content is self-explanatory enough that sending without a note is unlikely to confuse the recipient.
- If the intent is unclear and the forwarded content itself might be confusing, ask the user instead of guessing.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

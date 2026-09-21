# Pasted Gmail Links

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
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

Gmail web URLs are browser navigation links, not a documented Gmail API identifier format. Treat resolution as a narrow best-effort convenience, never as support for arbitrary Gmail URLs.

## Supported URL Shapes

Only attempt resolution for HTTPS URLs on the exact host `mail.google.com` with one of these shapes:

- `https://mail.google.com/mail/u/<account-index>/#<mailbox-view>/<token>`
- `https://mail.google.com/mail/#<mailbox-view>/<token>`

`<account-index>` must be decimal digits. `<mailbox-view>` must be one of `all`, `inbox`, `sent`, `starred`, `snoozed`, `drafts`, `trash`, `spam`, or `important`. The fragment must contain exactly the mailbox view and one non-empty token. Ignore a query suffix attached to the token, such as `?attachment_id=...`, but do not interpret it as part of the Gmail ID.

Do not attempt to extract an ID from search, label, category, settings, compose, or other Gmail routes. Do not accept lookalike hosts or non-HTTPS URLs.

## Bounded Resolution

1. Extract the opaque token without changing its case or otherwise transforming it.
2. Call `read_email_thread` with the token as a message ID, using the tool's default `id_type="message"` behavior.
3. Only when that exact lookup reports that the ID is invalid or not found, retry once with the same token and `id_type="thread"`.
4. If either lookup succeeds, use the returned thread as the requested context.
5. Do not broaden the attempt into `search_emails`, `search_email_ids`, subject guessing, sender guessing, pagination, or repeated retries.

The `/u/<account-index>/` segment is a browser account slot, not an instruction to select a connector account. Always use the currently connected Gmail account. If the link belongs to a different mailbox, report that mismatch instead of trying another account.

Do not perform the thread-ID retry after authentication, authorization, connector availability, rate-limit, or transient provider errors. Report those errors according to their actual cause.

## Fast-Fail Recovery

For an unsupported URL shape, fail immediately without calling Gmail tools. If both exact-ID attempts return invalid or not found, stop after the second attempt.

Tell the user that the Gmail link could not be resolved and ask for one of these fetchable alternatives:

- the sender, subject, and approximate date;
- an RFC 822 `Message-ID` header;
- the relevant email text pasted into the conversation.

If Gmail is disconnected or the link belongs to a different mailbox, ask the user to connect or select the mailbox that contains the message. Keep the explanation concise and do not imply that arbitrary Gmail web links are supported.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

_Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_

_Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_

_Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_

_Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_

_Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_

_Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_

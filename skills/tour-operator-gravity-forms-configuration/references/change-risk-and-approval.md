# Change risk and approval matrix

Use this file when a Gravity Forms task may move from planning into live configuration, production embeds, privacy-sensitive settings, payments, user registration, deletion, retention, uploads, webhooks, or add-on feeds.

## Risk levels

| Level | Examples | Default mode | Approval |
|---|---|---|---|
| Low | Read-only audit, form inventory, draft plan, manual checklist, label copy, non-live example config | Read-only or draft | No approval unless live data is exposed |
| Medium | Creating a new draft form, adding non-sensitive fields, adjusting confirmation text, creating disabled notifications, adding a staging-only embed | Guided change | Show change plan and get explicit approval |
| High | Updating an existing production form, overwriting notifications/confirmations, changing conditional logic that affects lead routing, enabling spam blockers that may reject valid leads, changing file-upload settings, webhook/feed changes | Guided or high-trust publish | Explicit approval plus rollback/validation plan |
| Critical | Payment feeds, live payment mode, user registration/account creation, role assignment, retention/export/deletion, deleting forms/entries/files, API keys/secrets, production payment flow replacement | High-trust publish or route-away | Explicit approval, confirmed capability, backup/rollback posture, and test-mode validation first |

## Approval wording requirements

Before write operations, state:

1. The exact target: site, environment, form ID/name, page ID/URL, feed/notification/confirmation ID if known.
2. The intended operation: create, update, duplicate, embed, enable, disable, test, or delete.
3. The risk level and why.
4. What will not be changed.
5. Rollback route or manual recovery path.
6. Validation steps immediately after change.

Ask for approval only after presenting the plan. Do not bury high-risk actions inside a broad approval request.

## Safe defaults

- Prefer duplicate-then-edit over editing a production form directly when the MCP app supports duplication.
- Prefer disabled/staging forms for new workflows until validation passes.
- Preserve existing notifications, confirmations, feeds, CSS classes, field IDs, merge tags, and embeds unless the user explicitly approves changes.
- For existing forms, read and summarise current settings before proposing edits.
- For production pages, confirm whether the form is already embedded before inserting another block.
- For retention or entry export, record the operational reason and avoid exposing personal data in chat unless requested and permitted.

## Rollback notes by change type

| Change type | Minimum rollback note |
|---|---|
| New form | Form ID/name, status, embed locations, whether entries exist |
| Form update | Previous JSON/export snapshot or summary of fields/settings changed |
| Notification/confirmation update | Previous recipient, subject, message, routing, conditional logic |
| Feed update | Previous feed settings, active/inactive state, connected add-on/gateway |
| Embed update | Page ID/URL, block inserted/replaced, previous block markup if available |
| Spam setting | Previous setting, expected impact on false positives, log review step |
| Upload setting | Previous extensions/size/path/storage, security review notes |
| Payment/user registration | Test mode evidence, gateway/add-on state, approval record, rollback owner |

## Refusal triggers

Refuse or route away when the user asks to:

- Delete entries, forms, uploaded files, or user accounts without a clear target and explicit approval.
- Enable live payment collection without gateway/add-on verification and test-mode validation.
- Create or modify user roles/accounts without confirming User Registration capability and role policy.
- Store API keys, licence keys, payment secrets, webhook secrets, or personal data in skill files.
- Disable accessibility features or spam protection solely for visual preference without recording risk acceptance.

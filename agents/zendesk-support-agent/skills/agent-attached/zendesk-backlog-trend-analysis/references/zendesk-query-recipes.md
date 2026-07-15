# Zendesk Query Recipes

These recipes are connector-neutral. Adapt them to the Zendesk connector functions available in the active agent environment.

## Current open backlog

Purpose: queue-health snapshot.

Filters:

- status in new, open, pending, hold
- optional brand, group, organisation, assignee, priority, tags, form, channel

Return:

- count by status
- oldest created dates
- oldest updated dates
- unassigned count where visible
- priority mix where visible

## Ageing risk

Purpose: identify stale or neglected tickets.

Filters:

- status in new, open, pending, hold
- created before the selected age threshold or updated before the selected stale threshold
- priority high or urgent where visible

Return:

- ticket ID, subject, status, priority, age, last update, group, assignee, organisation
- SLA status only if visible

## Waiting or blocked cases

Purpose: separate waiting-on-customer from waiting-on-internal or unclear blocker states.

Signals:

- status pending or hold
- blocker tags
- internal notes or latest agent notes where needed
- customer reply and agent reply timestamps where visible

## Weekly support report

Purpose: summarize the last 7 days or a named calendar week.

Use matching filters for both windows when comparing:

- created during current period
- solved during current period
- reopened during current period where visible
- updated during current period where relevant
- current open backlog at report time

## Trend comparison

Purpose: compare current and previous operational windows.

Rules:

- Use the same filters in both windows.
- Compare counts only when the query basis is equivalent.
- Mark comparison unavailable when the previous window cannot be queried.

## Repeated theme review

Purpose: detect likely duplicates, repeated support pain, or possible incident signals.

Strong signals:

- matching tags
- similar subject terms
- repeated error text
- same affected workflow
- same workaround
- same product, feature, integration, or environment
- cluster in a short time window

Return:

- cluster label
- ticket examples
- observed shared signals
- classification: likely duplicate, related but distinct, repeated support pain, possible incident signal, or inconclusive
- recommended support action

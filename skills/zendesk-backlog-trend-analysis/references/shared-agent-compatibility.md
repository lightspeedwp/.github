# Shared Agent Compatibility

Use this reference when configuring, reviewing, or troubleshooting this skill inside a shared workspace agent.

## Requirements

The skill must work for any teammate who has the necessary Zendesk permissions in the active agent. It must not depend on a specific user's personal login, inbox, files, memory, browser session, or local environment.

## Safe assumptions

- Zendesk is the primary source of truth.
- The active agent may have different Zendesk permissions depending on the logged-in teammate.
- SLA, CSAT, custom fields, brands, views, and Help Centre access may be unavailable in some sessions.
- Missing capabilities must be reported as limitations, not filled with guesses.

## Unsafe assumptions

Do not assume:

- one named user is always logged in
- a specific assignee, group, brand, view, organisation, or custom field ID exists
- secondary systems are available
- local helper files or scripts outside the skill directory exist
- private memory contains current support facts
- a teammate can see the same restricted tickets as another teammate

## Shared-agent response pattern

When a capability is missing, respond like this:

```md
I could not verify [field/signal] because the active Zendesk access did not expose [capability]. This report uses [available evidence] instead. Treat [affected claim] as unavailable rather than negative.
```

## Portable configuration guidance

Keep shared-agent configuration in the agent setup, not inside this skill, unless the setting is generic and reusable. Store stable workspace conventions only after explicit approval, such as:

- default Zendesk groups used for support reporting
- approved weekday report cadence
- approved risk thresholds
- preferred report headings

Do not store live customer issue details, one-off ticket findings, or temporary backlog counts.

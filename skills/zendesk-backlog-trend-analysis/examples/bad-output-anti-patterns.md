# Bad Output Anti-patterns

Avoid these patterns.

## Invented SLA

Bad:

```md
SLA risk is high across the queue.
```

Why it is bad: SLA data may not be visible. Say it is unavailable and use ageing/priority as fallback.

## Unsupported incident claim

Bad:

```md
This is definitely an incident affecting checkout.
```

Why it is bad: a repeated cluster is not a confirmed incident without shared cause, dependency, or incident evidence.

## Product drift

Bad:

```md
Create a Linear issue and ask engineering to rebuild checkout.
```

Why it is bad: backlog trend reports should stay support-operational unless the user explicitly asks for downstream planning or Zendesk evidence confirms an engineering blocker.

## Vague action

Bad:

```md
Monitor the issue and align stakeholders.
```

Better:

```md
Assign one support owner to the 3 related checkout tickets, add an internal note linking them, and confirm whether the symptoms are duplicate or related but distinct.
```

## Hidden personal assumption

Bad:

```md
Use one teammate's private saved support view for this report.
```

Why it is bad: shared agents must not depend on one user's private views or login-specific setup.

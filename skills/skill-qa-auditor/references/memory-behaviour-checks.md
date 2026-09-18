# Memory Behaviour Checks

Review whether a skill handles durable context safely and usefully.

## Definitions

| Type | Meaning | Example |
|---|---|---|
| Durable default | A reusable preference or convention that can help future work. | All design briefs use the approved LightSpeed structure. |
| Run-specific evidence | Context that belongs only to the current task or client. | This client's staging URL, current QA finding or draft PRD. |
| Unsupported assumption | A guess that must not be treated as fact. | Assuming a client approved scope because a draft exists. |
| Sensitive or risky detail | Information that should not be stored or reused without clear need. | Private credentials, confidential commercial details. |

## Checks

1. Does the skill distinguish standing LightSpeed conventions from current project evidence?
2. Does it avoid inventing missing defaults?
3. Does it avoid saving or relying on sensitive information unnecessarily?
4. Does it treat uploaded files, pasted notes and connector results as evidence for the current run unless clearly reusable?
5. Does it ask only for blocking missing defaults?
6. Does it make assumptions explicit and temporary?
7. Does it avoid carrying decisions from one client or project into another without confirmation?

## Memory Test Output

When reporting memory issues, include:

- what may be durable
- what must remain run-specific
- what is missing or unsupported
- what should never be assumed
- recommended wording for safer instructions

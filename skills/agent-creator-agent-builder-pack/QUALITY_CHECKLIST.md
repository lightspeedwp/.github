# Quality Checklist

## Value

- [ ] The output solves the user's requested deliverable, not a generic adjacent problem.
- [ ] It is practical for LightSpeed review and handoff.
- [ ] It uses predictable filenames and copy-ready markdown.

## Routing

- [ ] The request was routed before drafting.
- [ ] Specialist skills are not duplicated.
- [ ] Unavailable skills are not presented as available.

## Evidence and sources

- [ ] Verified requirements are separated from assumptions.
- [ ] Source priority order is respected.
- [ ] Fresh or external facts are cited when used.

## Agent Builder readiness

- [ ] A short Builder import prompt exists.
- [ ] The pack can be processed phase by phase.
- [ ] `AGENT_SYSTEM_PROMPT.md` is the final prompt source of truth.
- [ ] File manifest matches the actual package.

## Memory

- [ ] Durable defaults are separated from one-off notes.
- [ ] Sensitive data is not stored unless explicitly authorised.
- [ ] Stale decisions and completed todos are handled.

## Validation

- [ ] Required validators are present.
- [ ] Memory hygiene, source priority, and schema-template validators pass.
- [ ] Tests and fixtures cover expected drift cases.

## Safety

- [ ] Write actions require approval.
- [ ] External messaging requires approval.
- [ ] Publishing, deletion, pricing, legal, security, and customer-sensitive claims require approval.
- [ ] Unsupported commitments are blocked.

# Agent Quality Checklist

Use this checklist before handing over an agent prompt, agent requirements doc, or skill package.

## Requirements quality

- [ ] The mission is specific and outcome-focused.
- [ ] Scope is ordered as a workflow.
- [ ] Out-of-scope actions are explicit.
- [ ] Required inputs are listed.
- [ ] Trusted sources and freshness rules are clear.
- [ ] Tool access separates read-only from write access.
- [ ] Human approval gates are visible.

## Prompt quality

- [ ] The prompt tells the agent who it is, what it does, and what it must produce.
- [ ] The workflow is clear enough to follow without extra explanation.
- [ ] Output format is copy-ready.
- [ ] The prompt prevents unauthorised write actions.
- [ ] The prompt requires assumptions, risks, and open questions to be labelled.
- [ ] Escalation rules are concrete.

## Skill/package quality

- [ ] `SKILL.md` has valid lowercase `name` and `description` frontmatter.
- [ ] The description includes the trigger conditions.
- [ ] Supporting references are only loaded when useful.
- [ ] Scripts are included only when they improve deterministic execution.
- [ ] Example placeholder files are removed or customised.
- [ ] The package includes a README or usage guide.

## Test scenarios

Run the agent against at least these scenarios:

1. Happy path with complete inputs.
2. Missing required source.
3. Contradictory or stale source.
4. Request requiring write approval.
5. Request outside the agent scope.

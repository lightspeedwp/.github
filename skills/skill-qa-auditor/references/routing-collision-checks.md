# Routing Collision Checks

Use these checks whenever a skill may overlap with neighbouring LightSpeed skills.

## Routing Map Fields

| Relationship | Definition |
|---|---|
| Upstream | Skills or workflows that should usually happen before this skill. |
| Downstream | Skills or workflows that should usually receive this skill's output. |
| Overlapping | Skills that may trigger on similar requests but own different outcomes. |
| Route away to | Skills that should handle specific out-of-scope requests. |

## Collision Questions

1. Does the skill description clearly name the task it owns?
2. Does the skill avoid owning adjacent phases it should only prepare for?
3. Does it identify when to route to a more specific specialist skill?
4. Does it avoid creating final deliverables when it should only triage, intake or route?
5. Does it avoid doing broad review when a focused fixer skill should handle one concrete issue?
6. Does it avoid tool write actions when the user only asked for planning or review?
7. Does it use the most specific skill over the broadest skill?

## Common LightSpeed Collision Patterns

| Pattern | Risk | Safer Behaviour |
|---|---|---|
| PRD vs task planning | PRD skill starts writing implementation tasks too early. | PRD skill creates requirements and routes downstream. |
| Router vs specialist | Router produces final output instead of routing. | Router selects target skill and prepares handoff. |
| Launch QA vs QA findings | Launch planner performs defect triage. | Route raw findings to findings router; use launch planner for scope. |
| Broad design-system cleanup vs one node fix | Broad skill overworks a focused issue. | Route single-node issue to focused fixer. |
| Intake vs generator | Intake skill drafts final deliverable from weak evidence. | Intake normalises evidence and marks gaps. |
| Estimator vs proposal | Estimator over-promises delivery details. | State assumptions, exclusions and confidence. |

## Routing Test Requirements

Every QA review should include:

- one prompt that should trigger the skill
- one prompt that should route away
- one ambiguous prompt that could collide with a neighbouring skill
- one prompt with too little evidence where the skill must ask or produce partial output safely

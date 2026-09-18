# QA Scorecard

Use this scorecard for every full skill QA review.

## Scoring Scale

| Score | Meaning |
|---:|---|
| 1 | Fails or is missing. Unsafe to rely on. |
| 2 | Weak. Some useful behaviour, but major gaps or ambiguity. |
| 3 | Adequate. Usable with human review and known limitations. |
| 4 | Strong. Reliable for normal use, with minor improvements possible. |
| 5 | Excellent. Clear, robust, reusable and safe for production workflows. |

## Mandatory Areas

| Area | What to Check |
|---|---|
| Skill directory | `SKILL.md`, `agents/openai.yaml`, useful references, removed examples, sensible file names, package-size risk. |
| Trigger clarity | Frontmatter description explains what the skill does, when to use it and key trigger contexts. |
| Routing accuracy | Upstream, downstream, overlapping and route-away skills are clear. |
| Skill memory behaviour | Durable defaults are separated from run-specific evidence. The skill does not invent memory or misuse user preferences. |
| Input handling | Handles complete, weak, missing, conflicting and unsupported inputs safely. |
| Output quality | Produces structured, reusable, practical LightSpeed-ready outputs. |
| Evidence discipline | Separates confirmed facts, assumptions, gaps, blockers and recommendations. |
| Boundary control | Stays within scope and avoids replacing neighbouring specialist skills. |
| Tool behaviour | Tool prerequisites, connector needs and safe-action rules are explicit. |
| Regression safety | Includes stable test prompts or retest criteria after updates. |

## Verdict Rules

| Total Score | Default Verdict |
|---:|---|
| 45-50 | Ready |
| 38-44 | Conditional Pass |
| 30-37 | Needs Revision |
| Below 30 | Not Ready |

## Approval Blockers

Any of these blocks a pass regardless of total score:

- Routing accuracy below 3.
- Input handling below 3.
- Output quality below 3.
- No clear trigger description.
- No safe failure path for unsupported work.
- Unsupported tool actions without prerequisite checks.
- Skill claims it completed actions it cannot verify.
- Skill duplicates multiple neighbouring skills without a clear boundary.

## Recommendation Labels

| Label | Use When |
|---|---|
| Approve | Skill is ready for regular use. |
| Improve | Skill is useful but needs targeted edits. |
| Retest | Skill has changed or evidence is insufficient. |
| Split | Skill owns too many distinct workflows. |
| Merge | Skill duplicates another skill and lacks a distinct trigger. |
| Retire | Skill is obsolete, unsafe, or superseded. |

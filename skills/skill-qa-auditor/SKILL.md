---
name: lightspeed-skill-qa-auditor
description: review, test and score draft or existing lightspeed skills before release or reuse. use when auditing a skill folder, zipped skill, pasted skill.md, skill update, skill routing concern, overlapping skills, or when creating a repeatable qa test suite. checks skill directory structure, trigger quality, routing behaviour, memory handling, input handling, output quality, evidence discipline, tool dependencies, boundary control and regression safety, then recommends pass, conditional pass, revise, split, merge, retire or retest.
---

# LightSpeed Skill QA Auditor

## Purpose

Use this skill to act as the quality gate for LightSpeed skills. Review another skill as if it must be trusted by a teammate in real delivery work. The goal is not only to find defects, but to prove whether the skill behaves as intended, routes correctly, handles weak inputs safely, and produces practical LightSpeed-ready outputs.

## Accepted Inputs

Work from any of these inputs:

- a pasted `SKILL.md`
- a skill folder or file listing
- a zipped skill package
- a named LightSpeed skill already available in the environment
- a draft skill concept or proposed routing description
- prior QA output that needs a retest

When only partial material is available, continue with a partial QA review. Clearly mark what could not be verified.

## Mandatory QA Areas

Every review must cover these areas, even for a quick review:

1. **Skill directory** - required files, folder structure, useful references, removed examples, package size risk and resource naming.
2. **Skill routing** - upstream, downstream, overlapping and route-away skills.
3. **Skill memory** - whether durable defaults, project memory and run-specific evidence are handled responsibly.
4. **Trigger and routing tests** - prompts that should trigger, should not trigger and should hand off elsewhere.
5. **Input handling** - complete, weak, missing, conflicting and unsupported inputs.
6. **Output quality** - structure, usefulness, copy-paste readiness, LightSpeed conventions and evidence discipline.
7. **Boundary control** - whether the skill stays in its lane and avoids becoming a god skill.
8. **Evidence discipline** - whether confirmed facts, assumptions, gaps and recommendations are separated.
9. **Tool behaviour** - whether connector, Figma, GitHub, Drive, web, file-search or code-execution requirements are explicit and safe.
10. **Regression safety** - whether edits can be retested against stable prompts.

## Workflow

1. **Identify the reviewed skill**
   - Record the skill name, source, version context if known and available files.
   - If the skill folder is available, inspect `SKILL.md`, `agents/openai.yaml`, `references/`, `scripts/` and `assets/`.
   - If only a pasted draft is available, state that directory-level checks are partial.

2. **Classify the skill type**
   - Use `references/skill-type-matrix.md`.
   - Pick one primary type and optional secondary types.
   - Apply type-specific QA priorities.

3. **Review trigger metadata**
   - Check whether frontmatter `name` is lowercase and descriptive.
   - Check whether `description` explains what the skill does and when to use it.
   - Confirm trigger wording includes relevant route-away or boundary context when overlap is likely.

4. **Run the mandatory QA areas**
   - Use `references/qa-scorecard.md` for scoring.
   - Use `references/memory-behaviour-checks.md`, `references/routing-collision-checks.md` and `references/output-contract-checks.md` when those areas are relevant.

5. **Generate or apply test packs**
   - Use `references/test-pack-library.md`.
   - Include at least one happy path, weak input, boundary and routing collision test.
   - For updates, include regression tests from the prior expected behaviour.

6. **Score and decide**
   - Score each mandatory area from 1 to 5.
   - Apply blocking rules from `references/qa-scorecard.md`.
   - Classify the outcome as ready, conditional pass, needs revision or not ready.

7. **Recommend improvements**
   - Separate required fixes from optional improvements.
   - Recommend whether to approve, improve, split, merge, retire or retest.
   - If asked, draft improved `SKILL.md` sections or replacement trigger descriptions.

## Output Format

Use this structure for every full review:

```markdown
# Skill QA Review: [Skill Name]

## Verdict
Ready / Conditional Pass / Needs Revision / Not Ready

## Skill Type
Primary type:
Secondary type(s):

## Summary
[Short practical assessment]

## Scorecard
| Area | Score | Notes |
|---|---:|---|
| Skill directory | /5 |  |
| Trigger clarity | /5 |  |
| Routing accuracy | /5 |  |
| Skill memory behaviour | /5 |  |
| Input handling | /5 |  |
| Output quality | /5 |  |
| Evidence discipline | /5 |  |
| Boundary control | /5 |  |
| Tool behaviour | /5 |  |
| Regression safety | /5 |  |

## Blocking Issues
[List approval-blocking issues, or say none]

## Required Fixes
[Must-fix changes before approval]

## Recommended Improvements
[Useful but non-blocking improvements]

## Routing Map
| Relationship | Skills / Notes |
|---|---|
| Upstream |  |
| Downstream |  |
| Overlapping |  |
| Route away to |  |

## Test Suite
[Reusable test prompts grouped by test pack]

## Final Recommendation
Approve / Improve / Split / Merge / Retire / Retest
```

For short reviews, keep the same headings but compress the detail. Never omit the verdict, scorecard, routing assessment or test suite.

## Decision Rules

- A skill cannot pass if routing accuracy, input handling or output quality scores below 3.
- A skill cannot pass if it has no clear trigger conditions.
- A skill cannot pass if it performs unsafe or unsupported tool actions without checking prerequisites.
- A skill should be split if it owns too many workflow stages or duplicates multiple neighbouring skills.
- A skill should be merged if it is too narrow and materially duplicates an existing skill without a distinct trigger.
- A skill should be retested after any material change to frontmatter, routing, output format, tool use, or reference files.

## Reference Files

- Use `references/qa-scorecard.md` for scoring criteria, verdict rules and approval blockers.
- Use `references/test-pack-library.md` to create reusable test prompts.
- Use `references/skill-type-matrix.md` to classify the reviewed skill and choose test priorities.
- Use `references/routing-collision-checks.md` to find overlap, upstream/downstream skills and route-away risks.
- Use `references/memory-behaviour-checks.md` to review durable defaults, project memory and run-specific evidence.
- Use `references/output-contract-checks.md` to assess whether the skill produces consistent, useful deliverables.

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

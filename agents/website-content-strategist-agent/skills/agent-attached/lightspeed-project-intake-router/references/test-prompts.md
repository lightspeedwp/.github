# Test Prompts and Readiness Rubric

Use these prompts when checking whether the skill is ready for LightSpeed team use.

## Happy path

```text
We have a client brief, Figma Make prototype, ls-theme repo link and notes from a sales call for a WordPress block theme redesign. I need to know what to run next before creating a PRD.
```

Expected behaviour:

- produce a kickoff intake pack;
- classify the build as likely WordPress block theme or block theme plus plugin if evidence suggests it;
- identify source inventory and maturity;
- route primarily to `lightspeed-project-researcher` or `lightspeed-prd-generator` depending on evidence readiness;
- include prompt starters and approval gates.

## Ambiguous or incomplete prompt

```text
Can you help get this new website project ready for the team? We have some notes and a Figma link, but I am not sure what is missing.
```

Expected behaviour:

- avoid writing the PRD immediately;
- ask up to three high-value questions if needed;
- create safe assumptions;
- route to evidence normalisation or project research;
- mark missing sources and blockers clearly.

## Boundary prompt

```text
Create all GitHub issues and an implementation plan for this new site from the rough notes below.
```

Expected behaviour:

- do not create downstream deliverables inside this skill;
- explain that issue drafting and implementation planning require approved PRD/technical brief assumptions or explicit user acceptance;
- route to `lightspeed-task-breakdown-planner`, `lightspeed-github-issue-drafter` or `lightspeed-implementation-plan-generator` only after readiness is established.

## Scoring rubric

Score each output from 1 to 5:

| Area | 1 = weak | 5 = strong |
|---|---|---|
| Trigger fit | Used for the wrong task | Correctly behaves as a front-door intake router |
| Evidence handling | Blends facts and assumptions | Separates confirmed, draft, missing and blocker evidence |
| Routing accuracy | Routes broadly or prematurely | Chooses one justified primary route plus useful secondary routes |
| Output structure | Hard to paste or act on | Clear, structured and ready for Docs/GitHub/Asana |
| Practicality | Generic advice | Specific next actions, owners, gates and prompt starters |
| Risk handling | Misses approvals or blockers | Flags scope, source, governance, claim, launch and technical risks |
| Reusability | One-off answer | Repeatable process another teammate can follow |

An output should score at least 4 in routing accuracy, evidence handling and practicality before the skill is considered ready for team use.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

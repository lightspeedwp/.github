# Skills routing and directory validation

Run a focused validation pass on this agent’s skill routing layer and attached-skill surface so the agent routes work to the right skills, describes those skills accurately, and stays aligned with the currently attached skill inventory.

## Goal
Validate that the agent’s routing guidance, skill references, and visible skill package surfaces are internally consistent, grounded, and specific enough to steer requests to the correct skill without overclaiming hidden coverage.

## Required workflow
1. Refresh your understanding of the current visible agent state before editing anything.
2. Review the agent instructions sections that route work to skills, especially route definitions, workflow lists, escalation guidance, and specialist handoff guidance.
3. Review the current attached skill inventory visible on the agent.
4. If attached skill package files are visible or staged, inspect the relevant skill files that materially affect routing, naming, or declared scope.
5. Check for drift between:
   - skill names in the instructions and the currently attached skills
   - route descriptions and the actual purpose of each attached skill
   - broad workflow promises and the narrower skill descriptions
   - specialist escalation language and the upstream artifact boundaries
   - prompt, README, or package notes that mention skill families or skill coverage
6. Apply the smallest useful set of updates needed to improve routing clarity and skill-surface accuracy.

## What to validate
- every skill named in the instructions is actually attached and named consistently
- no attached core skill is missing from the routing model when it clearly supports a routed workflow
- routing language sends narrow requests to the lightest correct skill instead of over-escalating
- direct-work guidance does not conflict with skill-trigger guidance
- upstream brief, critique, audit, synthesis, experiments, and handoff boundaries are distinct enough to reduce overlap
- specialist WordPress, parity, release, claim-validation, DESIGN.md, and readiness skills are introduced only when the upstream artifact is ready
- skill descriptions used in prompts or notes do not promise outputs the attached skill does not clearly support
- any visible skill-directory notes, package references, or maintenance prompts stay aligned with the current attached skill set

## Directory and package checks
- If staged skill package files exist, verify that visible `SKILL.md` or related package metadata supports the routing claims made in the agent instructions.
- If skill package files are not visible or staged, do not invent their contents; validate only against grounded attached-skill metadata and visible instructions.
- Do not assume a hidden skills folder exists in agent files just because skills are attached elsewhere.
- Treat attached-skill metadata as the minimum grounded source, and skill package files as higher-confidence evidence only when actually available.

## Editing rules
- Keep fixes conservative and grounded in the current agent state.
- Prefer exact skill names, exact route labels, and exact workflow boundaries when updating references.
- Do not invent hidden skills, hidden folders, hidden package files, or unstaged skill instructions.
- Do not widen the agent’s scope just to give every skill a job.
- Preserve useful routing structure unless it is stale, contradictory, or clearly misaligned with the current attached skills.
- When a route can be handled directly without a skill, keep that path explicit instead of forcing unnecessary skill routing.

## Deliverable
Apply the smallest useful set of updates needed to make the agent’s skill routing and visible skill-directory references more internally consistent across instructions, attached skills, prompt notes, and any grounded skill package files.
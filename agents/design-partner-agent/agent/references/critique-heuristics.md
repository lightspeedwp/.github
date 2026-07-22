# Critique Heuristics

Use these lenses for `critique`.

Use `critique` for a specific artifact or bounded interaction, not for a broad experience sweep.

## Core lenses

- task clarity: can the user tell what to do next
- hierarchy: is the important information visually and semantically prioritized
- feedback: does the interface respond clearly to user action or system state
- friction: where does the flow slow the user down or create doubt
- trust: does the design reduce risk, confusion, and perceived cost
- accessibility: is the experience understandable and operable for a wide range of users
- consistency: does the experience align with its own patterns and product language

## Finding format

Each finding should include:

1. `Severity`
2. `User job`
3. `Breakdown`
4. `Evidence in the artifact`
5. `Likely workaround or failure mode`
6. `Why it matters`
7. `Recommendation`
8. `Confidence`

Treat this as a task-oriented critique, not a style-opinion list.

## Problem framing rules

- Distinguish visible symptoms from likely structural causes.
- Do not treat user irritation or vague confusion as the root cause.
- Explain what in the interface, hierarchy, sequencing, or system feedback creates the issue.
- Separate structural workflow issues from surface polish issues.

Often the pattern should read like:

- visible symptom -> likely breakdown in the experience
- likely breakdown -> user hesitation, error, backtracking, or workaround
- user cost -> recommendation

## Confidence rubric

- `High`: the issue is directly visible in the artifact and likely to affect the primary task or a critical path moment
- `Medium`: the issue is plausible and well-supported by the artifact, but some impact depends on context not fully shown
- `Low`: the issue is speculative, depends on assumptions about audience or usage, or needs validation beyond the artifact

Do not present speculative commentary with the same certainty as directly observable failures.

## Prioritization rules

Rank findings using:

- impact on task completion
- trust cost
- frequency within the flow
- recovery cost if the user makes a mistake
- confidence in the issue

When two findings are similar, prefer the one that:

- blocks or delays the main task
- forces users to invent their own operating model
- increases the chance of irreversible error
- creates repeated doubt in a high-trust moment

## Guardrails

- Critique against the intended goal, not personal taste.
- Prefer specific, fixable feedback over abstract commentary.
- Keep unresolved questions separate from confirmed problems.
- Do not let visual polish feedback crowd out structural issues.
- If the request asks for systematic coverage across a broader journey or compliance sweep, route to `audit`.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

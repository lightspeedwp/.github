---
name: chatbot-estimate-calibrator
description: Use when the user wants a chatbot plan turned into a firmer proposal-ready estimate, needs the estimate position tightened, wants assumptions and exclusions made clearer, or needs rough chatbot evidence translated into a commercial recommendation without overstating certainty.
---

# Chatbot Estimate Calibrator

## Purpose

Use this skill when the agent already has at least some project evidence, planning notes, or chatbot scope detail and needs to produce a sharper estimating output.

This skill improves the quality of estimate judgement. It should make the final result clearer about confidence, scope, exclusions, commercial posture, and what still needs confirming before LightSpeed should treat the estimate as reliable.

Do not use this skill for general AI strategy, policy writing, or broad discovery with no chatbot-planning intent.

## Best-Fit Request Shapes

Use `$chatbot-estimate-calibrator` for requests like:

- "Turn this chatbot brief into a proposal-ready estimate."
- "Tighten this estimate and make the assumptions more explicit."
- "Based on this website and source material, is this fixed-scope, provisional, or discovery-first?"

This skill works best when the request includes one or more of:

- a project brief or intake summary
- approved or candidate source material
- website evidence
- chatbot purpose, audience, or behaviour notes
- delivery assumptions, constraints, or risk signals

## What Good Output Looks Like

A strong result from this skill should:

- state the chatbot's purpose in practical business terms
- classify the estimate position as **reasonably firm**, **provisional**, or **discovery-first**
- explain why that classification is justified by the evidence
- separate confirmed scope from inferred scope
- make exclusions and dependencies easy to scan
- highlight the few unknowns most likely to change cost, effort, or delivery shape
- recommend the next commercial step for LightSpeed

## Workflow

1. Review the available evidence first.
   - Prefer grounded evidence over assumptions.
   - Identify what is confirmed, what is plausible but unconfirmed, and what is missing.

2. Decide whether the project is estimate-ready.
   - If the chatbot goal, approved sources, behaviour boundaries, or delivery shape are too unclear, do not force a confident estimate.
   - In that case, route to a discovery-first or custom-scoping recommendation.

3. Set the estimate position.
   - Use **reasonably firm** only when the chatbot purpose, source strategy, scope boundaries, and key delivery assumptions are all sufficiently clear.
   - Use **provisional** when the likely shape is visible but one or more important scope, source, governance, or technical assumptions remain open.
   - Use **discovery-first** when the evidence is too incomplete, risky, or contradictory for a responsible estimate.

4. Build the estimate from the plan, not from generic enthusiasm.
   - Tie effort and confidence to the bounded chatbot use case, approved sources, exclusions, and operational constraints.
   - Do not imply that integrations, analytics, governance drafting, content remediation, or implementation are included unless the evidence clearly supports that conclusion.

5. Make uncertainty legible.
   - Separate confirmed facts from assumptions.
   - Name the top scope movers explicitly.
   - Prefer a useful provisional estimate over false certainty.

6. End with the clearest next commercial step.
   - Recommend exactly what should be confirmed, supplied, or decided next to improve estimate confidence or move toward delivery.

## Decision Checks

Before finalising the estimate, check:

- Is the chatbot actually appropriate for this use case?
- Are the approved sources clear enough to support safe answers?
- Are any sensitive or high-risk behaviours still undefined?
- Is the scope bounded enough to estimate responsibly?
- Would LightSpeed be taking on hidden content, governance, or technical work if this estimate were accepted as written?

If any answer points to major ambiguity, lower estimate confidence instead of smoothing it over.

## Output Rules

When producing an estimate or refining one, make sure the output clearly covers:

- project summary
- recommended chatbot direction
- planned scope
- exclusions and constraints
- estimate position with rationale
- risks and unknowns
- relevant project resources when available
- recommended next step

If the calling instructions already define an exact section structure, keep that structure and use this skill to improve the judgement inside it rather than replacing the format.

## Tone And Evidence Discipline

- Use practical internal LightSpeed language unless the user asks for a client-ready tone.
- Be commercially useful, but never more certain than the evidence allows.
- Say plainly when the project is underspecified.
- Do not inflate low-confidence work into a fixed-scope recommendation.
- Do not bury key blockers inside long prose.

## Example Calibration Moves

- If the user provides a promising brief but the source inventory is weak, keep the likely chatbot direction but mark the estimate as **provisional** and explain that source curation could still change effort.
- If the use case is high-risk or the escalation boundary is unclear, recommend **discovery-first** rather than pretending the chatbot can be estimated cleanly.
- If the website, approved sources, exclusions, and operational boundaries are all well evidenced, treat the work as closer to a **reasonably firm** estimate and say why.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

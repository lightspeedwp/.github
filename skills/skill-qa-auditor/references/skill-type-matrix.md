# Skill Type Matrix

Classify every reviewed skill before scoring it. Pick one primary type and optional secondary types.

| Skill Type | Main Purpose | Primary QA Focus |
|---|---|---|
| Router | Select the correct next workflow or specialist skill. | Routing accuracy, boundary control, no premature deliverables. |
| Orchestrator | Coordinate a multi-stage workflow across skills or phases. | Workflow order, sequencing, handoff quality, approval gates. |
| Onboarding | Collect only blocking reusable defaults before work begins. | Minimal questioning, durable defaults, avoiding over-collection. |
| Intake | Gather and normalise source evidence. | Confirmed vs unconfirmed evidence, source quality, gaps. |
| Handoff | Package work for the next owner or phase. | Clear ownership, readiness state, next action, downstream usability. |
| Assessor | Score readiness, risk, quality or fit. | Scoring logic, evidence basis, risk classification, recommendations. |
| Estimator | Turn evidence into proposal-ready estimates or scope. | Assumptions, exclusions, confidence, commercial safety. |
| Generator | Produce a concrete artefact or draft. | Output completeness, structure, implementation usefulness. |
| Reviewer | Review existing work and recommend improvements. | Gap detection, specificity, safe recommendations. |
| Auditor | Inspect evidence for compliance, risk or quality. | Evidence discipline, severity, validation needs, actionability. |
| Planner | Sequence work, tasks or delivery phases. | Dependencies, priorities, acceptance criteria, delivery waves. |
| Formatter | Convert content into a reusable format. | Consistency, copy-paste usability, no content drift. |
| Tool workflow | Guide safe use of a specific tool or connector. | Prerequisites, tool limits, safe write actions, verification. |

## Type-Specific Blocking Risks

- Router: wrong owner selection or no route-away rules.
- Orchestrator: skips required earlier phases or approval gates.
- Onboarding: asks too many questions or stores run-specific facts as defaults.
- Intake: mixes assumptions with confirmed evidence.
- Handoff: unclear next owner or missing readiness state.
- Assessor: score is not evidence-backed.
- Estimator: overstates certainty or omits exclusions.
- Generator: output is attractive but not usable by the intended team.
- Reviewer/Auditor: findings are vague or lack retest steps.
- Planner: tasks lack dependencies or acceptance criteria.
- Formatter: changes meaning while formatting.
- Tool workflow: claims tool actions succeeded without verification.

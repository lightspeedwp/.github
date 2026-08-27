---
name: linear-decision-logger
description: This skill helps you create and preserve reusable workflow decisions for Linear and LightSpeed projects, ensuring consistent practices like naming conventions or approval processes. Use it to capture durable rules when you want to formalize a decision for future reference, like setting default routing or updating established protocols.
---

# Linear Decision Logger

## Purpose

Use this skill to turn reusable Linear or LightSpeed workflow decisions into concise, durable rules that can guide future work.

This skill is for standing decisions, not task notes. It should preserve decisions such as naming conventions, routing defaults, approval posture, label or priority rules, issue-framing preferences, escalation rules, handoff rules, and other team workflow choices that should apply repeatedly.

## Routing Rules

Use this skill when the user wants to capture or revise a durable decision, especially when they say things like:

- "remember this rule for future Linear issues";
- "save this as our default routing decision";
- "update the approval rule";
- "record that LightSpeed should handle this workflow this way";
- "we keep revisiting this, make it the standard"; or
- "replace the old rule with this new one".

Do not use this skill when the request is mainly to perform another Linear workflow. Route away as follows:

| User intent | Better route |
| --- | --- |
| Classify one incoming issue | `linear-triage-router` |
| Design routing rules for many future issues | `linear-triage-rules-designer` |
| Rewrite rough notes into a clear issue | `linear-the-architect` |
| Split a large issue into sub-issues | `linear-sub-issue-splitter` |
| Review stale or blocked work | `linear-momentum-auditor` |
| Summarise project health | `linear-project-pulse` |
| Build a triage operating procedure | `linear-triage-sop-builder` |
| Handle duplicates | `linear-duplicate-management-playbook` |
| Audit intake quality | `linear-unplanned-work-intake-audit` |
| Create or update a ChatGPT skill | `skill-creator`, or `linear-app-skill-creator` for Linear-specific skills |

If the user both performs another workflow and states a reusable rule, complete the primary workflow first, then separately summarise the durable rule and recommend saving it.

## Expected Inputs

Look for:

- the decision itself;
- why it was made;
- where it applies;
- who or what team it affects, if known;
- whether it replaces an older decision;
- what should happen if future requests conflict with the decision; and
- whether the user explicitly asked to save it.

If some details are missing, preserve the clearest durable version of the decision and label assumptions. Do not block useful output just because the user omitted a reason or conflict rule.

## Workflow

1. Confirm the information is a reusable decision, not a temporary note.
2. Distil the decision into one short operational rule.
3. Capture the reason in one compact sentence.
4. Define the scope: Linear only, LightSpeed delivery workflows, a specific team, or a named project context.
5. Check for likely conflicts with existing instructions or user-provided rules.
6. If there is a conflict, surface it and ask whether the older decision should be replaced.
7. Recommend the smallest durable location for saving the decision.
8. If the user explicitly asked to save the decision and it is suitable for Memory, save only the durable rule and necessary context.

## Persistence Guidance

Use Memory only when the decision is likely to matter across future conversations.

Prefer a compact structured entry in a decision-oriented memory location such as `decision-log.yaml`, if available. Do not duplicate the same rule across multiple places.

A good durable entry includes:

```yaml
- decision: "Use concrete task framing over generic user-story wording for Linear issue drafts."
  reasoning: "This makes implementation tasks clearer for the LightSpeed team."
  scope: "Linear issue drafting and task breakdowns for LightSpeed delivery work."
  recorded_at: "YYYY-MM-DD"
  replaces: "None known."
  conflict_behaviour: "Ask before overriding this rule."
```

Do not save:

- private or sensitive personal information unless the user explicitly asks;
- short-lived project facts;
- task-specific status updates;
- copied snippets that belong in an issue, PRD, or project doc; or
- rules already fully covered by higher-priority instructions.

## Output Contract

Use this structure by default:

### Decision Summary

- Durable rule: `[short operational rule]`

### Why It Matters

- `[compact reasoning]`

### Scope

- Applies to: `[workflow/team/project context]`
- Does not apply to: `[important exclusions, if any]`

### Save Recommendation

- `[save now / do not save / needs confirmation]`

### Conflict Note

Include only if an older decision or higher-priority instruction may conflict.

## LightSpeed Team Readiness Checks

Before finalising, check that the decision is usable by another LightSpeed team member without extra context:

- The rule is written as an action or operating standard.
- The scope is clear enough to prevent over-application.
- The reasoning is short and practical.
- Any replacement or conflict behaviour is explicit.
- The output avoids vague wording such as "usually", "maybe", or "keep in mind" unless uncertainty is intentional.

## Examples

### Example 1: New durable issue-framing rule

**Input**

"Remember that for Linear-related outputs we prefer concrete task framing instead of user-story wording."

**Output behaviour**

Summarise the rule, explain that concrete task framing improves developer handoff clarity, scope it to Linear issue drafts and task breakdowns, and recommend saving it to durable Memory.

### Example 2: Routing decision

**Input**

"Save this: incoming WooCommerce client bugs should go to ClientWork triage first unless they are clearly plugin-product issues."

**Output behaviour**

Capture the routing rule, scope it to LightSpeed client bug intake, note the plugin-product exception, and recommend saving it because it affects repeated triage decisions.

### Example 3: Not this skill

**Input**

"Turn these notes into a clean Linear issue."

**Output behaviour**

Do not use this skill as the main workflow. Route to `linear-the-architect`. Only return to this skill if the user also states a reusable rule that should be preserved.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

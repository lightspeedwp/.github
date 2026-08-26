# Agent Requirements Template

Use this template when the user needs an agent requirements document before writing the final prompt or skill files.

# Workspace Agent Requirements Doc: [Agent Name]

## 1. Agent mission

Describe what the agent does, who it serves, and the final output it produces.

**Template**

[Agent Name] helps [primary user/team] by [core job]. It produces [main deliverable] so that [business or workflow outcome].

**Include**

- Primary user or owner
- Main job-to-be-done
- Expected final artefact
- Business value
- Confidence or review expectation

## 2. Scope and boundaries

List the tasks the agent should perform in order. State what is explicitly out of scope.

**Template**

1. [Step 1]
2. [Step 2]
3. [Step 3]
4. [Step 4]

**Out of scope**

- [Action the agent must not take]
- [Decision requiring human approval]
- [Unsupported data/source/system]

## 3. Inputs and trusted context

Define the inputs the agent needs and which sources are trusted.

**Template**

The agent needs [input 1], [input 2], and [input 3]. Trusted sources are [source list]. It should treat [source type] as stale after [freshness threshold]. It should flag assumptions when [condition].

**Include**

- Required user input
- Optional context
- Trusted source hierarchy
- Freshness expectations
- Example inputs, if available

## 4. Tools and permissions

Define read-only and write access separately. Default to read-only unless write access is explicitly required.

| System or tool | Access level | Purpose | Approval required? | Notes |
|---|---:|---|---|---|
| [Tool] | Read-only | [Purpose] | No | [Constraints] |
| [Tool] | Write | [Purpose] | Yes | [What human must approve] |

## 5. Output requirements

Define what the agent must produce by the end of the workflow.

**Template**

Produce [deliverable name] containing:

- [Section 1]
- [Section 2]
- [Section 3]
- [Review checklist or confidence rating]

## 6. Quality checklist

Describe what a good output looks like.

**Checklist**

- [ ] The output is concise and useful for the target user.
- [ ] Important facts are grounded in trusted sources.
- [ ] Assumptions are labelled clearly.
- [ ] Risks, blockers, and missing information are visible.
- [ ] The output follows the required template.
- [ ] The output includes next actions or review steps.

## 7. Human-in-the-loop and escalations

Define when the agent must stop, ask, or request approval.

**Escalate when**

- Required source data is missing, stale, or contradictory.
- The agent would need to send, publish, update, delete, approve, or commit something.
- The output includes customer-sensitive, legal, security, pricing, policy, or compliance claims.
- The confidence level is below [threshold].
- The agent cannot identify the right destination, owner, or channel.

## 8. Assumptions and open questions

Separate safe assumptions from questions that block implementation.

| Type | Item | Impact | Recommended default |
|---|---|---|---|
| Assumption | [Assumption] | [Impact] | [Default] |
| Open question | [Question] | [Impact] | [Decision needed] |

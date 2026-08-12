---
title: Linear-Ready Template Pack
document_type: template_pack
purpose: Internal and client-shareable templates for turning rough planning into Linear-ready work
status: active
---

# Linear-Ready Template Pack

---

## Part 1. Pack Purpose

This pack gives LightSpeed two reusable template layers:

- an **internal Linear-ready layer** for turning rough inputs into implementation-ready issues with priority, labels, owner guidance, and acceptance criteria; and
- a **client-shareable layer** for collecting or presenting the same work in a cleaner format without exposing internal triage complexity.

Use the internal layer when the output is meant for the team operating in Linear.

Use the client-shareable layer when the output is meant to guide a client, collect structured inputs, or share a draft without exposing internal routing logic.

---

## Part 2. Internal Linear-Ready Templates

---

### 1) Internal Linear-Ready Issue Template

**Use For**

Turning a rough request, briefing note, support signal, or planning draft into one implementation-ready Linear issue.

**When to Use It**

Use when the work should stay as one issue and the team needs a stronger issue shape before triage or delivery.

**Recommended Output Fields**

- **Title**
- **Problem Summary**
- **User or Business Impact**
- **Proposed Scope**
- **Priority Guidance**
- **Suggested Labels**
- **Owner Guidance**
- **Dependencies or Risks**
- **Suggested Acceptance Criteria**
- **Open Questions**

**Priority Guidance**

- **Urgent**: production impact, revenue risk, or severe customer blockage
- **High**: important near-term work with meaningful customer or delivery impact
- **Medium**: useful planned work that should be sequenced, not rushed
- **Low**: backlog shaping, polish, or low-pressure follow-up

**Owner Guidance**

Recommend the likely owner function, not only a person. For example:

- Product
- Design
- Engineering
- Support Operations
- Client Success

**Suggested Acceptance Criteria**

Write 3 to 5 checks that make completion reviewable. Prefer outcome-focused criteria over implementation detail.

**Filled Template**

```markdown
---
title: Reduce client portal confusion in onboarding
document_type: linear_issue_template
purpose: Internal Linear-ready issue draft
status: draft
---

# Reduce client portal confusion in onboarding

---

## Problem Summary

**Problem**

New users are getting stuck during onboarding and submitting avoidable support requests.

**Impact**

Support volume is increasing, early activation is slower, and users are not reaching first value quickly enough.

---

## Scope

**Included**

- clarify the onboarding sequence
- reduce avoidable confusion points
- improve guidance at key decision moments

**Not Included**

- dashboard redesign
- billing workflow changes

---

## Linear Guidance

**Priority Guidance**

High

**Suggested Labels**

- onboarding
- ux
- support-signal

**Owner Guidance**

Product with Design review and Engineering implementation support.

---

## Suggested Acceptance Criteria

- New users can complete onboarding without needing support for the most common confusion points.
- The primary next step is clear at each major onboarding stage.
- Help or clarification text is present where users most often hesitate.
- Support requests tied to onboarding confusion decrease after release.

---

## Open Questions

- Which onboarding step creates the highest support volume?
- Do we need copy changes only, or flow changes too?

---
```

---

### 2) Internal Parent Issue Plus Sub-Issues Template

**Use For**

Turning one overloaded request into a parent issue plus a clean sub-issue set.

**When to Use It**

Use when the rough request mixes multiple surfaces, workstreams, or definitions of done.

**Recommended Output Fields**

**Parent issue**

- Title
- Shared outcome
- Why this is grouped
- Priority guidance
- Owner guidance
- Shared risks

**Sub-issues**

- Title
- Specific scope
- Suggested labels
- Owner guidance
- Acceptance criteria

**Filled Template**

```markdown
---
title: Client portal clarity improvement pack
document_type: parent_sub_issue_pack
purpose: Internal Linear-ready parent issue and sub-issue draft
status: draft
---

# Client portal clarity improvement pack

---

## Parent Issue

**Title**

Reduce client portal confusion across key user journeys

**Shared Outcome**

Improve clarity across the highest-friction client portal experiences so users complete key actions with less support intervention.

**Priority Guidance**

High

**Owner Guidance**

Product owner with Design and Engineering coordination.

---

## Sub-Issues

### Onboarding clarity improvements

**Suggested Labels**

- onboarding
- ux

**Owner Guidance**

Product / Design

**Suggested Acceptance Criteria**

- The onboarding path is understandable without manual clarification.
- The next step is visible at each stage.

### Dashboard clarity improvements

**Suggested Labels**

- dashboard
- ux

**Owner Guidance**

Product / Design

**Suggested Acceptance Criteria**

- The dashboard highlights the primary actions and status clearly.
- Users can identify what to do next without support help.

### Billing clarity improvements

**Suggested Labels**

- billing
- customer-friction

**Owner Guidance**

Product / Engineering

**Suggested Acceptance Criteria**

- Billing actions and statuses are clear.
- Common billing confusion points are addressed in-product.

---
```

---

### 3) Internal Linear-Ready Template for Client Requests

**Use For**

Converting client-submitted requests into a stronger internal issue shape before triage.

**Recommended Output Fields**

- **Original Client Request**
- **Internal Rewrite**
- **Priority Guidance**
- **Suggested Labels**
- **Owner Guidance**
- **Suggested Acceptance Criteria**
- **Clarifications Still Needed**

---

## Part 3. Label and Owner Guidance Matrix

---

Use this matrix as the default reference when suggesting internal labels and owner guidance. Adjust it when real team structure, project context, or existing taxonomy says otherwise.

---

## Work Type Matrix

| Work type | Typical labels | Default owner guidance | Escalate when |
|---|---|---|---|
| Onboarding or activation friction | `onboarding`, `activation`, `ux`, `support-signal` | Product with Design review | users are blocked from first value or support volume is rising quickly |
| Dashboard clarity or navigation issues | `dashboard`, `ux`, `usability` | Product with Design review | key actions are unclear or reporting is misleading |
| Billing, checkout, or payment confusion | `billing`, `payments`, `customer-friction` | Product with Engineering support | revenue, subscription state, or payment completion is affected |
| Content gaps or messaging clarity | `content`, `copy`, `ux`, `conversion` | Product or Content Design | missing content is delaying launch or causing repeated confusion |
| Design refinement or visual consistency | `design`, `ui`, `brand` | Design with Product review | the problem affects trust, comprehension, or repeated rework |
| Technical bug or broken behavior | `bug`, `engineering`, `customer-impact` | Engineering with Product visibility | production behavior is broken, widespread, or severe |
| Integration or systems issue | `integration`, `engineering`, `ops` | Engineering or Operations | the issue affects data flow, automation, or business continuity |
| Support-driven pattern or repeated complaint | `support-signal`, `customer-pattern`, `triage` | Product with Support input | the same pain point appears repeatedly across customers |
| Feature request or enhancement | `feature-request`, `product`, `backlog` | Product | the request needs roadmap judgment or multi-team sequencing |
| Internal process or workflow friction | `ops`, `workflow`, `internal-process` | Operations or Product Operations | work is repeatedly delayed, duplicated, or unclear across teams |

---

## Owner Guidance Rules

**Use function-level ownership first**

Recommend the owner function before naming a specific person unless the real owner is already known.

**Default patterns**

- **Product** when the work is primarily about prioritization, scope, problem framing, or customer value.
- **Design** when the work is primarily about UX clarity, visual communication, or interface behavior.
- **Engineering** when the work is primarily about broken functionality, implementation complexity, or system behavior.
- **Operations / Product Operations** when the work is primarily about workflow, intake, handoff, or internal execution quality.
- **Support / Client Success input** when repeated customer evidence materially shapes the issue, but those functions should usually inform rather than own product delivery.

**Shared ownership guidance**

When two functions are clearly involved, format the guidance like:

- `Product with Design review`
- `Product with Engineering implementation support`
- `Engineering with Product visibility`

---

## Label Guidance Rules

- Prefer **2 to 4 labels** by default.
- Mix **work-type labels** with **context labels** only when both improve triage clarity.
- Avoid label overload.
- Reuse existing team taxonomy when it already exists.
- If a label is uncertain, prefer a broader stable label over inventing a narrow one.

**Useful label groups**

- **Work type**: `bug`, `feature-request`, `workflow`, `design`, `content`
- **Surface**: `onboarding`, `dashboard`, `billing`, `checkout`
- **Signal source**: `support-signal`, `customer-pattern`, `internal-request`
- **Impact**: `customer-friction`, `revenue-risk`, `usability`

---

## Priority and Escalation Notes

Use these cues together with the matrix:

- Escalate to **Urgent** when production usage, revenue, or core task completion is materially blocked.
- Escalate to **High** when the issue creates meaningful recurring friction, visible client dissatisfaction, or near-term delivery risk.
- Keep at **Medium** when the work is important but not immediately harmful.
- Keep at **Low** when the item is backlog shaping, polish, or useful future improvement.

---

## Part 4. Acceptance-Criteria Patterns by Request Type

---

Use these patterns when drafting **Suggested Acceptance Criteria** for internal Linear-ready outputs. Treat them as starting structures, not rigid scripts.

Acceptance criteria should usually be:

- outcome-focused;
- specific enough to review;
- short enough to scan quickly; and
- limited to the scope of the issue.

Prefer **3 to 5 criteria** by default.

---

## Pattern Matrix

| Request type | Acceptance-criteria pattern |
|---|---|
| Onboarding or activation friction | user can complete the target onboarding step without confusion; next action is clear; support-triggering confusion point is reduced or removed |
| Dashboard clarity or navigation issue | key information is visible; primary action is easy to identify; users can complete the intended task without extra explanation |
| Billing or checkout issue | billing state or payment step is clear; failure or confusion point is resolved; user can complete the billing-related action reliably |
| Content or copy improvement | the missing message is present; the wording is clearer for the intended audience; the updated content supports the target decision or action |
| Design refinement | the interface communicates the intended action or state clearly; the revised design reduces ambiguity; the change is consistent with the rest of the experience |
| Technical bug | the broken behavior no longer occurs; the expected behavior works reliably; affected users can complete the blocked task again |
| Integration or systems issue | the required data or event flows correctly; the failure condition is resolved; downstream work is no longer blocked by the integration problem |
| Feature request or enhancement | the requested capability exists in the agreed scope; the target user can complete the new job successfully; the result is observable or testable |
| Internal workflow or process improvement | the workflow step is clearer or faster; ownership is unambiguous; the repeated friction point is reduced or removed |

---

## Criteria Writing Rules

- Start with what should be true when the work is complete.
- Prefer observable outcomes over implementation tasks.
- Do not restate the issue title as acceptance criteria.
- Avoid vague lines such as `works better` or `is improved` without saying how.
- Include edge-case or review conditions only when they materially matter.
- If the scope is exploratory, state the validation outcome the team should be able to review.

---

## Good Pattern Examples

**Onboarding clarity**

- New users can complete the onboarding flow without needing clarification at the previously confusing step.
- The next required action is visible at each major step.
- Help text or guidance is present where users most often hesitate.

**Billing confusion**

- Users can identify the correct billing action without ambiguity.
- Billing status and next steps are clearly communicated.
- The known confusion point no longer causes avoidable support requests.

**Technical bug**

- The broken behavior no longer occurs in the affected flow.
- Users can complete the blocked task successfully.
- The fix does not break the adjacent expected behavior.

---

## Part 5. Client-Shareable Templates

---

### 1) Client-Shareable Project Request Template

**Use For**

Helping clients submit a request in a way that is easier to convert into Linear-ready work later.

**When to Use It**

Use when the client should provide structured planning information without seeing internal labels, priority rules, or ownership logic.

**Recommended Sections**

- **What do you want to achieve?**
- **What problem are you trying to solve?**
- **Who is affected?**
- **What should happen when this is finished?**
- **Anything that must be included?**
- **Anything that should be avoided?**
- **Relevant examples, pages, or references**
- **Timing or urgency notes**

**Filled Template**

```markdown
---
title: Client Project Request Template
document_type: client_shareable_template
purpose: Collect structured client input for future Linear-ready planning
status: draft
---

# Client Project Request Template

---

## Goal

What do you want to achieve?

---

## Problem

What is not working today, or what opportunity are you trying to capture?

---

## Affected Users

Who is this for?

---

## Desired Outcome

What should be true when this work is complete?

---

## Required Inclusions

What absolutely needs to be part of the solution?

---

## References

Share any links, screenshots, examples, or notes that will help.

---

## Timing Notes

Add any timing, urgency, or milestone context.

---
```

---

### 2) Client-Shareable Website or Feature Brief Template

**Use For**

Giving clients a cleaner briefing structure that can later be converted into internal issue packs.

**Recommended Sections**

- Project or feature name
- Goal
- Audience
- Key pages or flows
- Content or asset needs
- Design expectations
- Technical or integration needs
- Success definition

---

### 3) Client-Shareable Revision Request Template

**Use For**

Capturing change requests in a way that reduces vague feedback and makes internal conversion easier.

**Recommended Sections**

- What should change?
- Why should it change?
- Where does this apply?
- What outcome do you want instead?
- How urgent is this from your perspective?

---

## Part 6. Internal vs Client Layer Rules

---

### Use the Internal Layer When

- the team is preparing work for Linear
- priority, labels, or owner guidance are needed
- acceptance criteria should be suggested
- triage or implementation decisions are being prepared

### Use the Client Layer When

- the user is collecting clearer input from a client
- the output will be shared externally
- internal labels, routing logic, or ownership details would add noise
- the goal is better briefing quality, not full internal triage

### Conversion Rule

When a client-shareable template is filled, convert it into the internal Linear-ready format before treating it as implementation-ready work.

---

## Part 7. Recommended Naming

---

**Internal templates**

- Internal Linear-Ready Issue Template
- Internal Parent Issue Plus Sub-Issues Template
- Internal Client Request Conversion Template

**Client-shareable templates**

- Client Project Request Template
- Client Website or Feature Brief Template
- Client Revision Request Template

---

## Part 8. Suggested Expansion Ideas

---

Useful next additions:

- urgency calibration rubric
- website questionnaire to Linear conversion template
- support request to Linear issue conversion template

---

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

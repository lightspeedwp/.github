# Gap Tracker Template

Use this template to capture missing inputs, weak evidence, and review dependencies that block a strong proposal response.

## When to use

- The request includes unanswered questions, unsupported claims, missing artefacts, or unclear ownership.
- A section can be partially drafted but still needs follow-up before final review.
- You need a clear handoff list for internal owners.

---

## Standalone document structure

When this template is used as a substantial standalone document, place YAML frontmatter **above** the main H1.

Use this scaffold:

```yaml
---
version: 1.0.0
title: "Gap Tracker"
date: "YYYY-MM-DD"
timezone: "Africa/Johannesburg"
status: "draft"
---
```

Then place the H1 below it:

```md
# Gap Tracker
```

---

## Output template

# Gap Tracker

## Open Gaps

| Section / Question | Gap Type | What Is Missing | Why It Matters | Likely Owner Group | Priority | Status | Follow-Up Note |
|---|---|---|---|---|---|---|---|
| [Section name] | [True gap / Validation / Evidence / Decision] | [Missing input or proof] | [Why the answer cannot be finalised yet] | [Sales / Solutions / Design / Engineering / Security / Legal / Leadership / Pricing / Marketing] | [High / Medium / Low] | [Open / In progress / Blocked] | [Short owner-ready ask] |

---

## Field guidance

### Section / Question

- Use the customer section name, form question, or the clearest practical label.

### Gap Type

- **True gap:** the answer is not currently known.
- **Validation:** the draft exists but needs confirmation.
- **Evidence:** the claim needs proof, source support, or an example.
- **Decision:** an internal choice is required before answering.

### What Is Missing

- State the missing input in one crisp sentence.
- Be specific enough that the owner knows what to provide.

### Why It Matters

- Explain the delivery, compliance, commercial, or quality risk.
- Make clear what would remain weak or inaccurate without the input.

### Likely Owner Group

- Assign the most likely function when grounded.
- If uncertain, use the closest functional owner rather than a person name.

### Priority

- **High:** blocks submission quality, creates material risk, or affects a major section.
- **Medium:** weakens confidence or completeness but may not block a first pass.
- **Low:** useful for polish, detail, or stronger proof.

### Status

- **Open:** not yet addressed.
- **In progress:** owner identified or evidence being gathered.
- **Blocked:** cannot proceed without external input or a decision.

### Follow-Up Note

- Draft a short, paste-ready ask that explains what is needed and why.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

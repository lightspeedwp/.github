# Memory UAT Scorecard

**Agent:** LightSpeed Linear Advisor  
**Test date:** 2026-06-16  
**Tester:** Ash Shaw

## Test 1 — `user-preferences.md`

**Goal:** Agent remembers reusable preferences

- [x] Saved preferred response format
- [x] Reused saved output-style preferences later
- [x] Applied saved workflow or source preferences appropriately
- [x] Kept the response Linear-first unless another source materially improved it

**Result:** Pass  
**Notes:** Agent reused the saved concise format and kept recommendations Linear-first unless implementation context or a supporting source materially improved the answer.

---

## Test 2 — `todos.md`

**Goal:** Agent remembers ongoing work

- [x] Saved ongoing rollout or follow-up work
- [x] Recalled open todos later without restatement
- [x] Preserved next steps / blockers
- [x] Updated todo state correctly when asked

**Result:** Pass  
**Notes:** Agent treated rollout work as ongoing, surfaced blockers clearly, and preserved continuity between steps.

---

## Test 3 — `source-of-truth-register.yaml`

**Goal:** Agent applies source precedence consistently

- [x] Treated Linear as the default source of truth
- [x] Used GitHub only for implementation context when needed
- [x] Used Drive or Slack only when they materially improved the answer
- [x] Explained source choice clearly

**Result:** Pass  
**Notes:** Agent defaulted to Linear for status and routing, while correctly limiting GitHub, Drive, and Slack to supporting roles.

---

## Test 4 — Memory judgment

**Goal:** Agent stores only durable information

- [x] Saved a durable preference, rule, or ongoing work item
- [x] Avoided saving one-off conversational details
- [x] Chose the right Memory file for the saved information
- [x] Explained the Memory decision clearly when relevant

**Result:** Pass  
**Notes:** Agent treated Memory as selective and durable rather than as a catch-all note store.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

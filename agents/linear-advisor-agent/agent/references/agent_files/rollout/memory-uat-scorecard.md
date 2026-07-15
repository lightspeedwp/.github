# Memory UAT Scorecard

**Agent:** LightSpeed Linear Advisor  
**Test date:** ________  
**Tester:** ________

## Test 1 — `user-preferences.md`

**Goal:** Agent remembers reusable preferences

- [ ] Saved preferred response format
- [ ] Reused saved output-style preferences later
- [ ] Applied saved workflow or source preferences appropriately
- [ ] Kept the response Linear-first unless another source materially improved it

**Result:** Pass / Fail  
**Notes:** __________________________________

---

## Test 2 — `todos.md`

**Goal:** Agent remembers ongoing work

- [ ] Saved ongoing rollout or follow-up work
- [ ] Recalled open todos later without restatement
- [ ] Preserved next steps / blockers
- [ ] Updated todo state correctly when asked

**Result:** Pass / Fail  
**Notes:** __________________________________

---

## Test 3 — `source-of-truth-register.yaml`

**Goal:** Agent applies source precedence consistently

- [ ] Treated Linear as the default source of truth
- [ ] Used GitHub only for implementation context when needed
- [ ] Used Drive or Slack only when they materially improved the answer
- [ ] Explained source choice clearly

**Result:** Pass / Fail  
**Notes:** __________________________________

---

## Test 4 — Memory judgment

**Goal:** Agent stores only durable information

- [ ] Saved a durable preference, rule, or ongoing work item
- [ ] Avoided saving one-off conversational details
- [ ] Chose the right Memory file for the saved information
- [ ] Explained the Memory decision clearly when relevant

**Result:** Pass / Fail  
**Notes:** __________________________________

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

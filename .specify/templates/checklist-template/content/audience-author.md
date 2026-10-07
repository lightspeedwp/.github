# Author Pre-Review Checklist Guidance

**Role**: Specification Author  
**Time**: ~30 minutes  
**Goal**: Self-check specification quality before peer review

---

## Introduction

This checklist is your quality assurance tool before sending your specification to peer review. Think of it as a structured self-review that catches common gaps, unclear definitions, and missing scenarios that reviewers will surface anyway.

You're using the 8-dimensional Requirements Quality Framework:

- **Completeness**: Have you covered all aspects?
- **Clarity**: Would a reader understand this unambiguously?
- **Consistency**: Are definitions and terminology uniform?
- **Measurability**: Can success be tested objectively?
- **Scenario Coverage**: Have you covered user flows and error paths?
- **Edge Cases**: What happens at boundaries and under stress?
- **Dependencies**: What assumptions or integrations are needed?
- **Ambiguities**: Are there unresolved areas?

---

## How to Use This Checklist

### Step 1: Plan Your Time (2 minutes)

Read through all checklist items first. Most specifications take 25–30 minutes. If you spend significantly longer, you may have specification gaps that need substantial rework before peer review.

### Step 2: Work Systematically (20–25 minutes)

1. **Read the question** for each item.
2. **Check the guidance** — it explains what "good" looks like and why it matters.
3. **Ask yourself**: Does my spec clearly address this?
4. **Mark the checkbox**:
   - ✅ **Checked** — You've explicitly addressed this in your spec.
   - ⬜ **Unchecked** — You haven't addressed it, or it's unclear whether you have.
   - 🔴 **Gap** — You identified a missing requirement that needs to be added.
   - ⚠️ **Ambiguity** — You found an unclear area that needs clarification.

### Step 3: Address Gaps (Remaining time)

For each unchecked, gap, or ambiguity item:

1. **Update your spec** with the missing or clarified requirement.
2. **Mark as checked** once fixed.
3. **Note what changed** — this helps reviewers see what you addressed.

If a gap is substantial (e.g., "error handling not specified for 10+ scenarios"), consider stopping, fixing it now, and then re-checking the list.

### Step 4: Summarize Findings (3 minutes)

At the end, count:

- Total items: (all items)
- Checked: (✅)
- Gaps: (🔴)
- Ambiguities: (⚠️)

**Good**: All items checked; <2 gaps or ambiguities; ready for peer review.  
**Caution**: >2 gaps or ambiguities; recommended to fix before peer review.  
**Stop**: Multiple unchecked items across same dimension; spec needs rework.

---

## Tips for Authors

### ✅ Spend time on completeness first

Most author-caught gaps are **missing requirements**, not clarity issues. Start by asking: "Have I covered all error cases, all user flows, all integration points?"

### ✅ Use the Guidance section in each item

Each checklist item includes "Guidance" — read it. It gives you examples of what good looks like and points you toward common oversights.

### ✅ Don't skip edge cases

If you find yourself thinking "that's unlikely," it's an edge case. Write it down. Reviewers will ask about it anyway.

### ✅ Be specific about dependencies

"Requires authentication" is vague. "Requires OAuth 2.0 with Bearer tokens, with session timeout after 1 hour" is clear.

### ✅ Flag ambiguities proactively

If you wrote something and immediately thought "a reader might misunderstand this," mark it as an ambiguity. Better to flag it yourself than have the reviewer flag it later.

### ✅ Use "I don't know" as a gap

If you think "I should define this but I don't know the answer," that's a **[Gap: unclear requirement]** entry. Bring it to your peer or stakeholder.

---

## What Happens Next

After self-review:

1. **All checked, <2 gaps/ambiguities** → Proceed to peer review. (Great job!)
2. **>2 gaps/ambiguities** → Fix them now, then move to peer review.
3. **Multiple unchecked items** → Scope is larger than expected. Consider pausing and simplifying the specification, or requesting stakeholder alignment before peer review.

**Pro tip**: Attach your filled checklist to the PR or spec document. Peer reviewers will see what you already checked and can focus on areas you flagged as ambiguous or gapped.

---

## Examples

### Example 1: Catching a Completeness Gap

**Item**: "Are all error scenarios defined (API failures, timeouts, invalid input)?"

**Your thinking**: "I defined API failures, but I didn't explicitly list timeout handling..."

**Action**:

- Mark as: **Gap: Missing timeout handling scenarios**
- Add to spec: "On timeout (>30 seconds), return HTTP 504 with `{ "error": "service_timeout" }`"
- Check it off: ✅

### Example 2: Flagging an Ambiguity

**Item**: "Is terminology consistent across all sections?"

**Your thinking**: "I used 'user' in some places and 'account holder' in others. Is that the same thing?"

**Action**:

- Mark as: **Ambiguity: 'user' vs. 'account holder' terminology**
- Decide: In spec, use "user" everywhere; add definition: "User: any person with an active account"
- Check it off: ✅

### Example 3: Unchecked Item Signals Scope Issue

**Item**: "Is disaster recovery / failover strategy documented?"

**Your thinking**: "I didn't think about disaster recovery for this feature."

**Action**:

- Mark as: **Unchecked** (you didn't address it)
- Ask stakeholder: "Is disaster recovery required for this feature, or is this MVP scope?"
- If required, add to spec and check it off.
- If out of scope, make a note and move to peer review (reviewers may ask too).

---

## Dimension-by-Dimension Focus

- **Completeness**: Read each section twice. Ask "What else could go wrong here?"
- **Clarity**: Read one requirement aloud. Does it make sense? Would a developer implement it the same way you imagine?
- **Consistency**: Use Find & Replace to check terminology consistency (search for variant terms).
- **Measurability**: Every success criterion should be testable (e.g., "latency <100ms" not "fast").
- **Scenario Coverage**: Map user flows; checklist each one.
- **Edge Cases**: What happens at 0, negative, null, empty, max size, concurrent, offline?
- **Dependencies**: List every assumption and external service.
- **Ambiguities**: Mark anything you would phrase differently if writing it again.

---

## Success Criteria

Your spec is ready for peer review if:

- ✅ All items are checked or marked as gaps/ambiguities
- ✅ You understand why each checked item applies to your spec
- ✅ Gaps and ambiguities are explicitly noted in the spec (e.g., `[Gap: ...]`)
- ✅ Checklist took <40 minutes (if >40 min, spec may be too large)
- ✅ You could explain each dimension to a peer in 30 seconds

---

**Next**: Attach this checklist to your spec and send for peer review. Reviewers will verify your findings and add their own. 🚀

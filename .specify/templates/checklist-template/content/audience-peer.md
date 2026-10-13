# Peer Reviewer Checklist Guidance

**Role**: Specification Peer Reviewer  
**Time**: ~45 minutes  
**Goal**: Verify specification quality, prioritise feedback, update checklist with findings

---

## Introduction

As a peer reviewer, you're the second set of eyes on specification quality. Your job is to use this checklist to verify the author's self-assessment, uncover gaps they may have missed, and ensure the specification is clear enough for implementation.

The 8-dimensional Requirements Quality Framework you're using:

- **Completeness**: Are all scenarios covered?
- **Clarity**: Could a third party understand and implement this?
- **Consistency**: Is terminology and structure uniform?
- **Measurability**: Can success be verified objectively?
- **Scenario Coverage**: Are user flows and error paths defined?
- **Edge Cases**: Are boundary conditions and failures handled?
- **Dependencies**: Are assumptions and integrations explicit?
- **Ambiguities**: Are there unresolved or unclear areas?

---

## How to Use This Checklist

### Step 1: Assess Author's Work (3–5 minutes)

1. **Review author's checklist** — they may have already flagged gaps and ambiguities.
2. **Note their findings** — you don't need to re-validate what they've already checked and explained.
3. **Read marked ambiguities** — these are areas to scrutinize extra carefully.

### Step 2: Review Systematically (35–40 minutes)

For each checklist item:

1. **Read the item question** and guidance.
2. **Check the spec** — does it clearly address this?
3. **Compare to author's mark**:
   - ✅ They marked it checked: Do you agree? Is it actually clear and complete?
   - ⬜ They marked it unchecked: Did they miss it, or is it intentionally out of scope?
   - 🔴 They marked it as a gap: Do you see how to fix it, or is it a larger issue?
   - ⚠️ They marked it ambiguous: Can you clarify it, or does it need stakeholder input?

4. **Mark your assessment**:
   - ✅ **Verified** — Author's assessment is correct; spec addresses it clearly.
   - ⬜ **Unverified** — You can't tell from the spec; needs clarification.
   - 🔴 **Gap Found** — Gap exists; specify what's missing.
   - ⚠️ **Ambiguity Found** — Ambiguity or unclear phrasing; specify the issue.
   - ✨ **Exceeds** — Spec goes above and beyond on this dimension (bonus observation).

### Step 3: Prioritise Feedback (3–5 minutes)

Not all gaps are equal. Categorise your findings:

1. **Critical** (blocks implementation):
   - Missing error handling for cascading failures
   - Measurable criteria completely absent
   - Conflicting requirements

2. **Important** (impacts quality):
   - Incomplete edge case coverage
   - Unclear terminology in key sections
   - Missing dependency documentation

3. **Nice-to-Have** (improves clarity):
   - Minor wording improvements
   - Additional examples
   - Formatting consistency

### Step 4: Update Checklist and Give Feedback (Remaining time)

1. **For each gap/ambiguity you found**: Update the checklist item with your finding (e.g., `🔴 Gap: Missing timeout scenario for database queries`).
2. **Write reviewer comment** — brief, actionable feedback linked to checklist items.
3. **Recommend**: "Ready for implementation" vs. "Needs revision before implementation."

---

## Tips for Peer Reviewers

### ✅ Trust the author's self-assessment, but verify

If the author marked everything as checked, spot-check 5–6 items across different dimensions. They may have been overly optimistic.

### ✅ Prioritise fail items

Author found gaps or ambiguities? Those are your focus. Verify their assessment and help them resolve them.

### ✅ Think like an implementer

For each item, ask: "Could a developer implement this based solely on this spec, without asking the author for clarification?"

### ✅ Consistency matters more than perfection

Minor phrasing inconsistencies are worth fixing if they help readers understand. "API timeout" vs. "API call timeout" vs. "service request timeout" — pick one and use it everywhere.

### ✅ Edge cases are hidden gold

Most gaps live here. If the author didn't think about "What if X fails while Y is in progress?" — you should.

### ✅ Check dependencies explicitly

"Requires authentication" — which type? "Requires database" — which operations? Vague dependencies hide integration gaps.

### ✅ Flag language barriers

If spec is hard to parse, that's a gap in clarity. It's not the reader's fault; it's the spec's.

---

## Review Workflow

1. **Red (Critical)**: Must be fixed before implementation.
   - Example: "Error handling for concurrent requests not defined."
   - Action: Add this to spec revision.

2. **Yellow (Important)**: Should be fixed before implementation; could be in next iteration if timeline is tight.
   - Example: "Database failover strategy not specified for all scenarios."
   - Action: Decide with stakeholder: fix now or backlog?

3. **Green (Nice-to-Have)**: Noted but not blocking.
   - Example: "Consider adding example cURL request for API endpoint."
   - Action: Mention in feedback; author decides priority.

---

## Examples

### Example 1: Verifying a Checked Item

**Item**: "Are all error scenarios defined (API failures, timeouts, invalid input)?"

**Author marked**: ✅ Checked

**You review**: Scan spec for error handling...

- API failures: ✅ Defined
- Timeouts: ⚠️ Mentioned but not with specific timeout values
- Invalid input: ✅ Defined

**Your mark**: 🔴 Gap: Missing timeout values (30s? 60s? configurable?)

**Feedback**: "Error handling is mostly complete, but timeout scenarios need specific latency values (e.g., 'HTTP 504 if request exceeds 30 seconds')."

---

### Example 2: Scrutinising an Ambiguity

**Item**: "Is terminology consistent across all sections?"

**Author marked**: ⚠️ Ambiguity: User vs. account holder

**You review**: Search spec for both terms. Found:

- Section 2: "users"
- Section 5: "account holders"
- Section 8: "actors"

**Your mark**: 🔴 Gap: Inconsistent terminology needs standardization

**Feedback**: "Terminology varies across sections. Recommend standardizing on 'user' and adding glossary entry: 'User: Any individual with an active account.'"

---

### Example 3: Catching a Missed Edge Case

**Item**: "Are edge cases documented (boundary conditions, concurrency, failures)?"

**Author marked**: ✅ Checked (covers boundary conditions and some failure modes)

**You review**: Author covered single-user flows well. Missing scenarios:

- Two users update same record simultaneously — which wins?
- Bulk operation with 1 million records — performance expectations?
- What happens if service X fails mid-transaction?

**Your mark**: 🔴 Gap: Concurrent update handling and bulk operation limits not specified

**Feedback**: "Single-user happy path is clear, but concurrent and bulk operation scenarios need definition. Add: 'Last-write-wins for concurrent updates' and 'Bulk operations limited to 10,000 items per request.'"

---

## Dimension-by-Dimension Review Focus

| Dimension | Verify | Example Red Flags |
|-----------|--------|-------------------|
| **Completeness** | All user paths covered? All integrations named? | "Authentication required" without saying OAuth vs. custom |
| **Clarity** | Readable without author's verbal explanation? | Vague: "as needed"; Clear: "every 5 minutes" |
| **Consistency** | Same term = same meaning everywhere? | "User" and "account" used interchangeably |
| **Measurability** | Can you write a test from this? | Vague: "fast"; Clear: "P95 latency <200ms" |
| **Scenario Coverage** | Happy path + error paths? | Missing offline mode, concurrent requests, partial failures |
| **Edge Cases** | Boundaries, zero/null/max, stress? | No mention of what happens at 100K+ items |
| **Dependencies** | Assumptions explicit? Integrations named? | "Requires database" without specifying version/type |
| **Ambiguities** | Anything left to interpretation? | "User-friendly interface" (subjective) vs. "WCAG 2.2 AA" (objective) |

---

## Quality Gates

Recommend "Ready" when:

- ✅ All critical gaps fixed
- ✅ All important gaps either fixed or documented as future work
- ✅ Terminology is consistent
- ✅ A developer could implement without asking author for clarification

Request revision when:

- ⚠️ >5 critical/important gaps
- ⚠️ Major inconsistency in terminology or structure
- ⚠️ Significant edge cases missing

---

## Your Checklist Summary

After review, provide author with:

1. **Verified count**: Items you confirmed as correct
2. **Gaps found**: New gaps you discovered (number + brief list)
3. **Ambiguities found**: Unclear areas (number + brief list)
4. **Recommendation**: "Ready for implementation" / "Needs revision" / "Minor refinements suggested"
5. **Next steps**: Timeline for revision, if needed

**Format**:

```
## Review Summary
- ✅ Verified: 35 items
- 🔴 Gaps found: 3 (error timeout values, concurrent update handling, bulk operation limits)
- ⚠️ Ambiguities found: 2 (terminology standardization, performance targets)
- 📋 Recommendation: Needs revision (critical gaps in error handling)
- ⏱️ Timeline: Ready for implementation after 1–2 day revision
```

---

**Next**: Share findings with author. Together, prioritise which gaps to fix before implementation vs. which can be backlog items. 🚀

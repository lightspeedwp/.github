# Master QA Checklist for Preview Tests

Use this checklist when validating preview runs against reusable example contexts and prompt libraries.

## 1. Context Integrity

- [ ] The selected example context is clearly identified.
- [ ] All referenced URLs are present and grouped correctly.
- [ ] Live, demo/prototype, and dev references are clearly distinguished.
- [ ] Repository links are included where relevant.
- [ ] Documentation/source folders are included where relevant.
- [ ] Figma references are included where relevant.
- [ ] The context does not mix details from different projects.

## 2. Prompt Integrity

- [ ] The preview prompt references the intended context only.
- [ ] The prompt goal is clear and testable.
- [ ] The prompt does not require missing inputs unless explicitly noted.
- [ ] The prompt is reusable for future tests with minimal editing.
- [ ] The expected output type is clear.

## 3. Grounding and Source Use

- [ ] The run uses the provided context as its primary source of truth.
- [ ] Source priority is sensible and clearly reflected in the output.
- [ ] Unsupported claims are avoided.
- [ ] Assumptions are clearly labelled.
- [ ] Missing evidence is called out explicitly.

## 4. Output Quality

- [ ] The response matches the requested task.
- [ ] The output is structured and easy to review.
- [ ] The output is concise but complete enough to be useful.
- [ ] Recommendations are actionable.
- [ ] Risks, blockers, or open questions are easy to find.

## 5. Consistency Across Test Runs

- [ ] Re-running the same prompt produces a broadly consistent structure.
- [ ] The model does not drift into unrelated projects or references.
- [ ] Naming remains consistent with the selected context.
- [ ] Reusable sections stay stable across repeated tests.

## 6. Validation Against Project Type

- [ ] Website projects are treated like website projects.
- [ ] Design-system projects are treated like design-system projects.
- [ ] Product/demo/dev references are interpreted correctly.
- [ ] Repo and design references are used in a project-appropriate way.

## 7. Failure Checks

- [ ] Hallucinated URLs, repos, or files are not introduced.
- [ ] Contexts are not merged incorrectly.
- [ ] Missing data is not silently invented.
- [ ] Irrelevant recommendations are avoided.
- [ ] The response does not overstate certainty.

## 8. Sign-off Summary

For each preview test, capture:

- Context used:
- Prompt used:
- Expected result:
- Actual result:
- Key issues found:
- Pass / Needs Revision:
- Notes for prompt or context improvement:

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

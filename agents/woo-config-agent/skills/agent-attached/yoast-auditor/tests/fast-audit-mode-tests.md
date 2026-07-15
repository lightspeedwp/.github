# Fast Audit Mode Tests

## Test 1: partial evidence quick check

Input: "Here are two screenshots of Yoast settings. Can you do a fast audit?"

Expected output: `# Fast Yoast Audit Snapshot` with scope checked, top findings, blocked checks and one next step. No full score unless evidence covers the relevant audit scope.

## Test 2: quick URL sample

Input: "Quickly check these 3 URLs for title/meta/canonical issues."

Expected output: fast audit snapshot or compressed page-level review. Findings must include evidence status, confidence, safest next action and owner/next route.

## Test 3: fast audit should not become configuration plan

Input: "Quickly audit this new site and tell me the defaults to set up."

Expected output: fast audit or evidence gap first, then route setup/defaults to `yoast-configuration`.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

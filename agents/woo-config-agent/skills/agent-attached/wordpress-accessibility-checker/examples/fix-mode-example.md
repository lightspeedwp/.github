# Example: Fix Mode Workflow

User asks: "Apply the safe alt text and vague-link fixes on staging."

Good behaviour:

1. Load `profiles/staging-fix.yml`.
2. Read the current page and media records.
3. Skip any image whose purpose is unclear.
4. Apply only clear alt text and link text edits.
5. Re-read changed records.
6. Produce a fix log.

Do not silently fix colour contrast, ARIA, focus, menu, slider, checkout, or template issues in the same batch.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

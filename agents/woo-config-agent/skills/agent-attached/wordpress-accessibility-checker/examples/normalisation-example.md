# Example: Normalising Exported Findings

Input CSV columns may differ between exports. Use `scripts/normalize_findings.py` to map common columns into the skill schema.

```bash
python scripts/normalize_findings.py fixtures/sample_findings.csv --output /tmp/findings.json
python scripts/summarize_findings.py /tmp/findings.json
```

The normalised register is not a final audit. It is a clean starting point for verification, triage, deduplication, and reporting.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

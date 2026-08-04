# Audit-to-configuration workflow

1. Run auditor in read-only mode.
2. Produce findings register.
3. Separate blockers from improvements.
4. Select findings for remediation.
5. Generate configuration handoff.
6. Pass handoff to the `tour-operator-gravity-forms-configuration` skill.
7. Validate and retest after approved changes.
8. Produce closure note or retest report.

## Gate rules

- No write action happens in the auditor.
- High-risk findings need explicit approval before configuration.
- Payment, User Registration, file upload, privacy/retention, logging, webhook/API, production embed, and live notification changes require an approval note.
- Retest evidence must be recorded against the original finding ID.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*

# Label Audit Validation Results

**Run**: 2026-09-24, on branch `audit/label-consolidation`  
**Checks**: spec 008 `quickstart.md` Tests 1–8 (task T034), with the evidence traceability check (T035)  
**Automated check**: `scripts/validation/__tests__/label-audit-evidence.test.js`: 9 of 9 tests pass

| Test                              | Result              | What was checked                                                                  | Outcome                                                                                                                                                                                                    |
| --------------------------------- | ------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Label inventory completeness   | ⚠️ Partial          | Canonical snapshot against `labels.yml`; live GitHub labels against the inventory | 169 canonical labels, all in the inventory. The live comparison cannot run until the paginated inventory exists (T041), so orphan labels are not yet known                                                 |
| 2. Type labels                    | ✅ Pass             | `type:*` labels against `issue-types.yml`                                         | Snapshot: 26 type labels, 25 mapped, `type:decision` unmapped (Finding 1). On this branch today: 26 labels and 25 issue types, because `type:question` leaves only when #3534 merges                       |
| 3. Governance policy              | ✅ Pass             | Never-delete list against `labels.yml`                                            | 12 missing labels found (Finding 2). The live list now protects only canonical labels (T055; checked by the evidence test)                                                                                 |
| 4. Archived workflows             | ✅ Pass             | One analysis per archived workflow                                                | 11 of 11 analysed (`evidence/workflow-*.json`, `workflow-analysis.md`)                                                                                                                                     |
| 5. Documentation consistency      | ❌ Fail             | Family counts in `docs/LABEL_INVENTORY.md` against the snapshot                   | All 4 families checked disagree: status 20 in the doc (21 canonical), priority 4 (6), meta 8 (6), area 33 (42). The doc's front matter also says 158 labels. To be fixed with the other label docs in T058 |
| 6. Audit report completeness      | ✅ Pass             | Sections in `007-audit-report.md` against `contracts/audit-report-schema.md`      | Executive summary, inventory, findings, recommendations and methodology are present. Duplicates and workflow results are in their own reports                                                              |
| 7. Evidence traceability          | ✅ Pass after a fix | Every file and line cited in `007-audit-report.md`                                | One broken reference fixed: `type:decision` is on line 173 of the snapshot `labels.yml`, not line 186. Every cited evidence file exists (`evidence/README.md` lists all 33)                                |
| 8. Recommendations are actionable | ✅ Pass             | Each recommendation has an action, priority, timeline and owner                   | Three prioritised recommendations with owners; both findings now have a recorded decision or fix                                                                                                           |

## Still Open

- **Test 1** needs the live inventory: run `scripts/automation/label-inventory.js` with an organisation-wide token (T041).
- **Test 5**: `docs/LABEL_INVENTORY.md` family counts and front matter.
- **Duplicate ranking** (SC-004) needs issue and PR usage counts from T041 and T042.

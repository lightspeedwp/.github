## 1. Policy Definition

- [ ] 1.1 Define canonical baseline tool and permission profile from `agents/release.agent.md`.
- [ ] 1.2 Define approved specialised profiles with explicit additive and subtractive deltas.
- [ ] 1.3 Document allowed tool and permission registries in policy files.

## 2. Validation Implementation

- [ ] 2.1 Implement agent contract validator script for `**/*.agent.md`.
- [ ] 2.2 Add validation output format with missing keys, invalid entries, and remediation hints.
- [ ] 2.3 Add local command wiring in existing npm/script workflow.

## 3. CI Integration

- [ ] 3.1 Add validator execution to CI workflow for pull requests.
- [ ] 3.2 Configure staged rollout mode (warn then fail) if required.
- [ ] 3.3 Ensure CI output links to policy and remediation docs.

## 4. Agent Remediation

- [ ] 4.1 Remediate critical files (zero tools or zero permissions).
- [ ] 4.2 Remediate high-severity files with missing MCP and GitHub permissions.
- [ ] 4.3 Reconcile approved extra permissions (`github:issues`, `github:checks`) via explicit profile mapping.
- [ ] 4.4 Remediate plugin-pack agent files to compliant profiles.

## 5. Verification and Reporting

- [ ] 5.1 Run validator across repository and confirm zero contract violations.
- [ ] 5.2 Update audit report with post-remediation compliance summary.
- [ ] 5.3 Record governance notes for future agent additions and profile-change process.

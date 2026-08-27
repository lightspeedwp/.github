## ADDED Requirements

### Requirement: Agent specifications SHALL declare explicit tool contracts

Every agent specification file at `**/*.agent.md` MUST declare a `tools` field with one or more allowed tool identifiers.

#### Scenario: Missing tools declaration is rejected

- **WHEN** an agent file is validated and `tools` is missing or empty
- **THEN** validation SHALL fail with a file-specific error explaining the missing declaration

#### Scenario: Unsupported tool identifier is rejected

- **WHEN** an agent file declares a tool identifier that is not in the allowed registry
- **THEN** validation SHALL fail and list each unsupported identifier

### Requirement: Agent specifications SHALL declare explicit permission contracts

Every agent specification file at `**/*.agent.md` MUST declare a `permissions` field with one or more allowed permission identifiers.

#### Scenario: Missing permissions declaration is rejected

- **WHEN** an agent file is validated and `permissions` is missing or empty
- **THEN** validation SHALL fail with a file-specific error explaining the missing declaration

#### Scenario: Unsupported permission identifier is rejected

- **WHEN** an agent file declares a permission identifier that is not in the allowed registry
- **THEN** validation SHALL fail and list each unsupported identifier

### Requirement: Baseline profile SHALL be defined and reusable

The repository SHALL define a canonical baseline profile derived from `agents/release.agent.md` and allow named profile variants for specialised agents.

#### Scenario: Baseline profile can be resolved

- **WHEN** validation loads profile definitions
- **THEN** the baseline profile SHALL resolve to a deterministic set of tools and permissions

#### Scenario: Specialised profile references baseline extensions

- **WHEN** a specialised profile is evaluated
- **THEN** validation SHALL verify it either exactly matches baseline or documents explicit additive and subtractive differences

### Requirement: Validation SHALL run in CI and local workflows

Agent contract validation SHALL run in CI and SHALL be executable locally using a documented command.

#### Scenario: CI blocks non-compliant changes

- **WHEN** a pull request introduces non-compliant agent tool or permission declarations
- **THEN** the CI validation job SHALL fail and prevent merge until resolved

#### Scenario: Local validation mirrors CI behaviour

- **WHEN** a contributor runs the local validation command
- **THEN** it SHALL produce the same pass/fail outcome and error categories as CI for the same commit

### Requirement: Validation output SHALL produce remediation guidance

Validation failures SHALL include actionable remediation guidance and reference the expected profile contract.

#### Scenario: Failure message includes remediation path

- **WHEN** validation fails for an agent file
- **THEN** output SHALL include missing keys, invalid entries, suggested profile, and next-step command to re-check

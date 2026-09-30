# Reference Types: Detection Patterns & Categories

**Purpose**: Define all reference types that agents and skills can have within the repository, and how they're detected.

**Status**: Phase 3, Task T018 — Documentation of reference detection patterns

---

## Overview

References are paths or identifiers that point to agents, skills, or workflows. They appear in multiple contexts and need to be detected, validated, and fixed when agents are renamed or restructured.

---

## Reference Categories

### 1. JavaScript Imports (Type: `js-import`)

**Context**: Node.js scripts that import agents or skills using CommonJS or ES modules

**Detection Pattern**:

```javascript
// CommonJS
require('agents/my-agent')
require('./agents/my-agent')

// ES Modules
import Agent from 'agents/my-agent'
import { helper } from 'agents/my-agent/utils'

// Dynamic imports
import('agents/' + agentName)
await import('agents/my-agent')
```

**Severity When Broken**: **CRITICAL**

- Missing imports cause immediate module not found errors
- Breaks dependent scripts at runtime
- Often discovered only during CI/execution

**Locations**:

- `.js`, `.cjs`, `.mjs` files in any directory
- Especially common in:
  - `scripts/` (orchestration)
  - `.github/scripts/` (automation)
  - `agents/*/tests/` (test files)
  - `.github/agentic-workflows/` (agent workflows)

**Examples of Broken States**:

```javascript
// ❌ Agent was renamed from 'issue-agent' to 'issue-triage-agent'
const issueAgent = require('agents/issue-agent')  // BROKEN

// ✅ Corrected
const issueAgent = require('agents/issue-triage-agent')  // FIXED
```

---

### 2. Shell Script Paths (Type: `shell-path`)

**Context**: Bash/Shell scripts that execute scripts or reference agent folders

**Detection Pattern**:

```bash
# Direct path references
./agents/my-agent/tests/test.sh
$SCRIPT_DIR/agents/my-agent

# Variable references
AGENT_PATH="agents/my-agent"

# Command references
npm run agent:my-agent
node agents/my-agent/index.js
```

**Severity When Broken**: **HIGH**

- Scripts fail to execute or find dependencies
- Causes CI/CD pipeline failures
- Difficult to debug without running scripts

**Locations**:

- `.sh`, `.bash` files
- Especially in:
  - `.github/scripts/` (GitHub automation)
  - `scripts/` (build and deployment scripts)
  - `.github/workflows/` (inline shell steps)
  - `hooks/` (git hooks)

**Examples of Broken States**:

```bash
# ❌ Agent was renamed
bash agents/old-agent/run.sh  # BROKEN: old-agent no longer exists

# ✅ Corrected
bash agents/new-agent/run.sh  # FIXED
```

---

### 3. GitHub Workflow 'uses' References (Type: `workflow-uses`)

**Context**: GitHub Actions workflows that reference agents as reusable actions

**Detection Pattern**:

```yaml
# Composite action reference
- uses: lightspeedwp/.github/agents/my-agent@main
- uses: ./agents/my-agent

# With parameters
- uses: lightspeedwp/.github/agents/my-agent@v1
  with:
    input-param: value
```

**Severity When Broken**: **CRITICAL**

- Workflow fails at the step that references the missing agent
- Blocks entire CI/CD pipeline
- Visible immediately in GitHub Actions UI

**Locations**:

- `.github/workflows/*.yml` files
- Composite action definitions in `agents/*/action.yml`

**Examples of Broken States**:

```yaml
# ❌ Agent was moved or renamed
- uses: lightspeedwp/.github/agents/old-name@main  # BROKEN

# ✅ Corrected
- uses: lightspeedwp/.github/agents/new-name@main  # FIXED
```

---

### 4. GitHub Workflow 'run' Commands (Type: `workflow-run`)

**Context**: Inline shell commands in workflows that invoke agents or scripts

**Detection Pattern**:

```yaml
- run: npm run agent:my-agent
- run: node agents/my-agent/index.js
- run: bash scripts/run-agent.sh agents/my-agent
```

**Severity When Broken**: **HIGH**

- Command execution fails with "not found" error
- Blocks that specific workflow step
- May not fail entire workflow (depends on continue-on-error)

**Locations**:

- `.github/workflows/*.yml` files
- `run:` clauses in steps

**Examples of Broken States**:

```yaml
# ❌ npm script references missing agent
- run: npm run agent:renamed-agent  # BROKEN if agent was renamed

# ✅ Corrected
- run: npm run agent:new-name  # FIXED
```

---

### 5. Skill Imports (Type: `skill-import`)

**Context**: References to skills from within agents or other scripts

**Detection Pattern**:

```javascript
// Relative imports in agent code
const validation = require('../skills/validation-skill')
import { check } from './skills/audit-skill'

// Absolute imports
const { process } = require('skills/data-processing')
```

**Severity When Broken**: **HIGH**

- Agent loses functionality when skill is missing
- May cause partial failures (depending on where skill is used)

**Locations**:

- Agent implementation files
- Shared scripts that use skills
- Integration layers

---

### 6. Configuration References (Type: `config-reference`)

**Context**: Configuration files that point to agents or scripts

**Detection Pattern**:

```json
{
  "agents": ["agents/my-agent", "agents/other-agent"],
  "scripts": ["scripts/setup.sh"],
  "workflows": [".github/workflows/main.yml"]
}
```

**Severity When Broken**: **MEDIUM**

- Application may not load agents or scripts
- Configuration validation fails
- May have fallbacks

**Locations**:

- `.github/specs/014-agents-restructure-consolidate/config.json`
- `scripts/validation/config.json`
- Application config files

---

## Detection Algorithm

### 1. Scan Phase

For each file in the repository:

- Determine file type (`.js`, `.sh`, `.yml`, `.json`, etc.)
- Load file content
- Apply appropriate detection patterns for that file type

### 2. Extract Phase

For each detected reference:

- Normalize the reference (remove `./`, extensions, etc.)
- Classify as agent, skill, or workflow reference
- Record location and context

### 3. Validate Phase

Check if each reference target exists:

- Build index of valid agents (from `agents/` folder)
- Build index of valid skills (from `agents/*/skills/` and `skills/`)
- Compare detected references against indexes

### 4. Report Phase

For each broken reference:

- Record severity level
- Document file and location
- Suggest fix based on fuzzy matching or user input

---

## Severity Levels

| Severity | Definition | Impact | Examples |
|----------|-----------|--------|----------|
| **CRITICAL** | Reference is core to operation; failure is immediate | Program crash, CI block | JS imports in core scripts, workflow `uses:` |
| **HIGH** | Reference is important; failure causes workflow issues | CI failure, missing functionality | Shell paths in automation, workflow `run:` |
| **MEDIUM** | Reference is useful but may have fallbacks | Partial functionality loss | Config references, optional imports |
| **LOW** | Reference is informational; failure is non-blocking | Informational only | Comments, documentation references |
| **INFO** | Reference is valid but may need attention | No immediate impact | Deprecation notices, migration reminders |

---

## Common Breaking Changes

### Agent Renames

When an agent is renamed from `old-name` to `new-name`:

- All imports must change: `agents/old-name` → `agents/new-name`
- All path references must change
- All workflow invocations must change
- Configuration files must update

### Agent Relocation

When an agent moves from one folder to another:

- Relative import paths break (e.g., `../skills` may need to become `../../skills`)
- Absolute paths may need adjustment
- Workflow references may need scope updates

### Skill Renames or Consolidation

When skills are renamed or consolidated:

- Agent imports must be updated
- Skill registries must be regenerated
- Cross-agent dependencies must be verified

---

## Remediation Strategy

### For JavaScript Imports

1. Update require/import statements
2. Verify paths are correct
3. Run `npm test` to verify

### For Shell Paths

1. Update hardcoded paths
2. Test script execution locally
3. Verify in CI

### For Workflow References

1. Update `uses:` lines
2. Update `run:` commands
3. Re-run workflow to verify

### For Configuration

1. Update config files
2. Validate against schema
3. Test application startup

---

## Detection Tools

**Automated Detection**:

- `scripts/validation/lib/reference-detector.js` — Detects all reference types
- `scripts/validation/audit-agents.js` — Runs audit with broken-refs subcommand

**Manual Verification**:

- Use `grep` to find references: `grep -r "agents/old-name" .`
- Use IDE search to find imports
- Review git diff when renaming agents

---

## See Also

- [BROKEN_REFERENCE_REMEDIATION.md](BROKEN_REFERENCE_REMEDIATION.md) — Fix process
- [scripts/validation/lib/reference-detector.js](../../scripts/validation/lib/reference-detector.js) — Detection implementation
- [spec.md](../.github/specs/014-agents-restructure-consolidate/spec.md) — US1 specification

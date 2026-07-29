# PROMPT 2: Generic Multi-Provider Agent Rewrite Template

**Use Case:** Reusable template for converting remaining 15 ChatGPT agents  
**Scope:** Single agent conversion (ChatGPT → Claude/Copilot/OpenAI)  
**Estimated Effort:** 2-3 hours per agent  
**Dependencies:** Standards from Prompt 1 (schema, hooks, instructions)  

---

## HOW TO USE THIS PROMPT

**For Each Agent:**

1. Replace `{AGENT_NAME}` with actual agent name
2. Replace `{agent-slug}` with kebab-case slug
3. Replace `{DOMAIN}` with domain (testing, content, infrastructure, etc.)
4. Replace `{FOCUS}` with focus area (e.g., testing, planning, validation)
5. Replace `{Agent Purpose}` with 1-sentence description

**Example:**

```
{AGENT_NAME} = Linear Advisor Agent
{agent-slug} = linear-advisor
{DOMAIN} = project-management
{FOCUS} = linear-integration
{Agent Purpose} = Manage Linear issues, projects, and workflows from LightSpeedWP repos
```

---

## GENERIC AGENT REWRITE PROMPT

### CONTEXT

You are rewriting **{AGENT_NAME}** from ChatGPT format into a standardized multi-provider agent.

**Agent Details:**
- **Name:** {AGENT_NAME}
- **Slug:** {agent-slug}
- **Domain:** {DOMAIN}
- **Focus:** {FOCUS}
- **Purpose:** {Agent Purpose}
- **Current Location:** `.github/agents/{agent-slug}-agent/`
- **Target Location:** `.github/agents/{agent-slug}-agent/` (restructured)
- **Plugin:** `lightspeed-{DOMAIN}-{FOCUS}` (create or update)

**Standards Reference:**
- Folder structure: See `.github/agents/playwright-testing-agent/` (pilot implementation)
- Naming conventions: See `ai/agents-unified.md`
- Instruction files: See `.github/instructions/agent-creation-workflow.instructions.md`
- Schema validation: See `.github/.schemas/multi-provider-agent.schema.json`

### PHASE 1: ANALYZE EXISTING EXPORT

#### Step 1.1: Audit ChatGPT Export Structure

**Task:** Examine `.github/agents/{agent-slug}-agent/` and document:

1. **Folder contents:**
   - List all files in `agent/` subfolder
   - List all files in `skills/` subfolder
   - List all files in `manifests/` subfolder

2. **Agent capabilities:**
   - What does this agent do?
   - What tools/APIs does it use?
   - What outputs does it produce?

3. **Dependencies:**
   - Which skills are required?
   - External integrations (APIs, services)?
   - Data models or schemas?

4. **Current limitations:**
   - Provider-specific (ChatGPT only)?
   - Platform assumptions?
   - Missing features for multi-provider?

**Deliverable:**
Create `.github/tmp/{agent-slug}-export-analysis.md` with findings.

**Success Criteria:**
- [ ] Folder structure documented
- [ ] Capabilities listed (5-10 items)
- [ ] Dependencies identified
- [ ] Limitations noted

---

#### Step 1.2: Determine Plugin Grouping

**Task:** Decide if this agent:
1. Gets its own plugin, OR
2. Joins an existing plugin

**Decision Tree:**

```
Is this agent part of {DOMAIN}?
├─ YES: Check if lightspeed-{DOMAIN}-* plugin exists
│   ├─ YES: Add to existing plugin
│   └─ NO: Create new plugin
└─ NO: Is it unique or multi-domain?
    ├─ UNIQUE: Create single-agent plugin
    └─ MULTI: Add to closest domain plugin
```

**Examples:**

- `linear-advisor-agent` → `lightspeed-project-management-linear` (create or join)
- `zendesk-support-agent` → `lightspeed-support-zendesk` (create)
- `design-partner-agent` → `lightspeed-design-partner` (create or join design plugin)

**Deliverable:**
Document plugin decision in `.github/tmp/{agent-slug}-plugin-plan.md`

**Success Criteria:**
- [ ] Plugin decision made
- [ ] Rationale documented

---

### PHASE 2: RESTRUCTURE FOLDER & CREATE SPECS

#### Step 2.1: Create New Folder Structure

**Task:** Restructure `.github/agents/{agent-slug}-agent/` following the standard:

```bash
# Backup existing (preserve for reference)
mv .github/agents/{agent-slug}-agent .github/agents/{agent-slug}-agent-backup

# Create new structure
mkdir -p .github/agents/{agent-slug}-agent/{claude,copilot,openai,shared,.github}
mkdir -p .github/agents/{agent-slug}-agent/shared/{tools,memory,hooks}

# Copy over existing skills & manifests
cp -r .github/agents/{agent-slug}-agent-backup/skills .github/agents/{agent-slug}-agent/
cp -r .github/agents/{agent-slug}-agent-backup/manifests .github/agents/{agent-slug}-agent/

# Copy checksums if available
cp .github/agents/{agent-slug}-agent-backup/checksums.sha256 .github/agents/{agent-slug}-agent/ 2>/dev/null || true
```

**Deliverable:**
New folder structure created and ready for content.

**Success Criteria:**
- [ ] New folder created
- [ ] Backup preserved
- [ ] Skills & manifests copied
- [ ] Old structure ready for content migration

---

#### Step 2.2: Write Agent Specification (AGENT.md)

**Task:** Create `.github/agents/{agent-slug}-agent/AGENT.md` with YAML frontmatter and markdown content.

**Template:**

```yaml
---
name: {agent-slug}
title: '{Agent Name} Agent'
description: '{Agent Purpose}'
version: '2.0.0'
status: active
category: {DOMAIN}
providers:
  - claude
  - copilot
  - openai

frontmatter:
  author: LightSpeed
  maintainer: {Your Name}
  last_updated: '{TODAY_DATE}'
  file_type: agent
  visibility: public
  language: en
  tags: [{tag1}, {tag2}, {tag3}]
  owners:
    - lightspeedwp/maintainers

capabilities:
  - capability-1
  - capability-2
  - capability-3

requirements:
  - Requirement 1
  - Requirement 2

constraints:
  - Constraint 1
  - Constraint 2

tools:
  - tool-1
  - tool-2

memory:
  - Memory model 1
  - Memory model 2

security:
  rules:
    - Security rule 1
    - Security rule 2
  hooks:
    - secrets-scanner
    - agent-spec-validator

hooks:
  - agent-spec-validator
  - multi-provider-consistency-checker

---

# {Agent Name} Agent

## Overview

[1-2 paragraph description]

## Core Responsibilities

1. [Responsibility 1]
2. [Responsibility 2]
3. [Responsibility 3]

## Capabilities & Limitations

### What It Can Do
- ✅ Capability 1
- ✅ Capability 2
- ✅ Capability 3

### What It Cannot Do
- ❌ Limitation 1
- ❌ Limitation 2

## Usage Examples

### Example 1: {Scenario}
[Description, agent prompt, expected output]

### Example 2: {Scenario}
[Description, agent prompt, expected output]

## Configuration Per Provider

### Claude Configuration
[See `claude/agent.md`]

### GitHub Copilot Configuration
[See `copilot/agent.md`]

### OpenAI Configuration
[See `openai/agent.md`]

## Security Guardrails

[List 3-5 key security rules]

## Performance Targets

- [Target 1]
- [Target 2]

## Related Documentation

- [Link 1]
- [Link 2]
```

**Task Details:**

1. **Analyze capabilities** from step 1.1
2. **Map to YAML frontmatter** (name, title, category, tags, etc.)
3. **Write overview** (2-3 sentences)
4. **List responsibilities** (3-5 items)
5. **Document capabilities** (5-10 items, ✅)
6. **Document limitations** (3-5 items, ❌)
7. **Create 2 usage examples** with expected output
8. **Define security rules** (3-5 rules per domain)
9. **Set performance targets** (realistic for agent)

**Deliverable:**
`.github/agents/{agent-slug}-agent/AGENT.md` complete with all sections.

**Success Criteria:**
- [ ] YAML frontmatter valid
- [ ] All sections filled
- [ ] Examples provided
- [ ] Security rules documented
- [ ] File validates against `agent-config.schema.json`

---

### PHASE 3: CREATE PROVIDER-SPECIFIC CONFIGS

#### Step 3.1: Create Shared Core Prompt

**Task:** Write `.github/agents/{agent-slug}-agent/shared/core-prompt.md`

**Content Structure:**

```markdown
# {Agent Name} — Core Prompt

(Provider-agnostic core instructions.)

## System Instructions

You are a {domain} expert focused on {focus}.

Your role is to:

1. [Role 1]
2. [Role 2]
3. [Role 3]

## Constraints

- [Constraint 1]
- [Constraint 2]

## Best Practices

1. [Practice 1]
2. [Practice 2]
3. [Practice 3]

## Inputs & Outputs

**Input:**
[Describe what the agent accepts]

**Output:**
[Describe what the agent produces]
```

**Guidance:**
- Keep language generic (no provider references)
- Focus on "what" not "how"
- Make constraints explicit
- Use standard terminology

**Deliverable:**
`.github/agents/{agent-slug}-agent/shared/core-prompt.md` (500-1000 words)

**Success Criteria:**
- [ ] Core prompt written
- [ ] No provider-specific syntax
- [ ] Constraints clear
- [ ] Examples of inputs/outputs

---

#### Step 3.2: Create Claude Configuration

**Task:** Write `.github/agents/{agent-slug}-agent/claude/agent.md`

**Template:**

```markdown
# {Agent Name} — Claude Configuration

## Claude-Specific Instructions

You are deployed as a Claude AI agent for {purpose}.

### Tools Available

[List available tools from Claude SDK]

### Guardrails

1. [Guardrail 1]
2. [Guardrail 2]

### Response Format

[Specify JSON or markdown format]

### Integration with Claude Code

[How to use in Claude Code IDE]
```

**Task Details:**

1. **Reference core prompt** at top
2. **List Claude tools** (use Claude SDK names)
3. **Add Claude-specific guardrails**
4. **Define response format** (JSON structure recommended)
5. **Add Claude Code integration notes**

**Tools to Consider:**
- File system operations
- Markdown generation
- Code execution
- API calls
- External integrations

**Deliverable:**
`.github/agents/{agent-slug}-agent/claude/agent.md` (300-500 words)

**Success Criteria:**
- [ ] Claude tools documented
- [ ] Guardrails clear
- [ ] Response format specified

---

#### Step 3.3: Create GitHub Copilot Configuration

**Task:** Write `.github/agents/{agent-slug}-agent/copilot/agent.md`

**Template:**

```markdown
# {Agent Name} — GitHub Copilot Configuration

## GitHub Copilot Instructions

You are a Copilot skill for {purpose}.

### Copilot-Specific Features

- [Feature 1]
- [Feature 2]

### Skills Provided

- `skill-1` — [Description]
- `skill-2` — [Description]

### Response Format for Copilot Chat

[Markdown format example]

### GitHub Actions Integration

[Recommend workflow steps]
```

**Task Details:**

1. **Describe Copilot features** (code completion, chat, code review)
2. **List Copilot skills** (reusable components in skills/)
3. **Define response format** (markdown, bullet points)
4. **Suggest GitHub Actions integration**

**Deliverable:**
`.github/agents/{agent-slug}-agent/copilot/agent.md` (300-500 words)

**Success Criteria:**
- [ ] Copilot features clear
- [ ] Skills documented
- [ ] Response format specified
- [ ] GitHub Actions suggested

---

#### Step 3.4: Create OpenAI Configuration

**Task:** Write `.github/agents/{agent-slug}-agent/openai/agent.md`

**Template:**

```markdown
# {Agent Name} — OpenAI Configuration

## OpenAI Codex Instructions

You are deployed via OpenAI APIs for {purpose}.

### OpenAI-Specific Tools

**Function Definitions:**
- `function_1(param1, param2)` — [Description]
- `function_2(param1)` — [Description]

### API Integration

[How to call via OpenAI API]

### Response Format

[JSON format per OpenAI spec]
```

**Task Details:**

1. **Define function calls** (OpenAI function calling format)
2. **Describe API integration**
3. **Specify response JSON structure**
4. **Add example API call**

**Deliverable:**
`.github/agents/{agent-slug}-agent/openai/agent.md` (300-500 words)

**Success Criteria:**
- [ ] Functions documented
- [ ] JSON format clear
- [ ] API example provided

---

### PHASE 4: CREATE TOOL DEFINITIONS

#### Step 4.1: Create Claude Tools Definition

**Task:** Write `.github/agents/{agent-slug}-agent/claude/tools.json`

**Structure:**

```json
{
  "provider": "claude",
  "tools": [
    {
      "name": "tool_name",
      "description": "What it does",
      "parameters": {
        "type": "object",
        "properties": {
          "param1": {"type": "string", "description": "..."},
          "param2": {"type": "integer"}
        },
        "required": ["param1"]
      }
    }
  ]
}
```

**Task Details:**

1. **List 3-5 primary tools** from capabilities
2. **Map each to Claude SDK**
3. **Define parameters**
4. **Mark required fields**

**Deliverable:**
`.github/agents/{agent-slug}-agent/claude/tools.json` (5-10 tools)

**Success Criteria:**
- [ ] Tools match capabilities
- [ ] Parameters defined
- [ ] Valid JSON

---

#### Step 4.2: Create Copilot Skills Definition

**Task:** Write `.github/agents/{agent-slug}-agent/copilot/skills.yaml`

**Structure:**

```yaml
provider: copilot
skills:
  - name: skill-1
    description: Description
    reference: ../../skills/skill-1/
  
  - name: skill-2
    description: Description
    reference: ../../skills/skill-2/
```

**Task Details:**

1. **Reference existing skills** from `skills/` folder
2. **Add 2-3 key skills**
3. **Link to skill folders**

**Deliverable:**
`.github/agents/{agent-slug}-agent/copilot/skills.yaml`

**Success Criteria:**
- [ ] Skills exist in skills/
- [ ] References valid
- [ ] YAML valid

---

#### Step 4.3: Create OpenAI Functions Definition

**Task:** Write `.github/agents/{agent-slug}-agent/openai/tools.json`

**Structure:**

```json
{
  "provider": "openai",
  "type": "function",
  "functions": [
    {
      "name": "function_name",
      "description": "What it does",
      "parameters": {
        "type": "object",
        "properties": {
          "param1": {"type": "string"}
        },
        "required": ["param1"]
      }
    }
  ]
}
```

**Task Details:**

1. **Define 3-5 functions**
2. **Follow OpenAI schema**
3. **Clear descriptions**

**Deliverable:**
`.github/agents/{agent-slug}-agent/openai/tools.json`

**Success Criteria:**
- [ ] Functions follow OpenAI spec
- [ ] Parameters clear
- [ ] Valid JSON

---

### PHASE 5: CREATE OR UPDATE PLUGIN

#### Step 5.1: Create/Update Plugin Structure

**Task:** Create or update `.github/plugins/lightspeed-{DOMAIN}-{FOCUS}/`

**If Creating New Plugin:**

```bash
mkdir -p .github/plugins/lightspeed-{DOMAIN}-{FOCUS}/{agents,skills,hooks,.claude-plugin,.codex-plugin,.gemini-plugin}
```

**If Updating Existing Plugin:**

```bash
mkdir -p .github/plugins/{existing-plugin}/agents/{agent-slug}
```

**Deliverable:**
Plugin folder structure ready for content.

**Success Criteria:**
- [ ] Folder created or updated
- [ ] Subfolder structure in place

---

#### Step 5.2: Create/Update Plugin Manifests

**Task A: Create/Update `plugin.json`**

```json
{
  "name": "lightspeed-{DOMAIN}-{FOCUS}",
  "displayName": "LightSpeed {Domain} {Focus} Suite",
  "version": "2.0.0",
  "agents": [
    {
      "id": "{agent-slug}",
      "name": "{Agent Name}",
      "path": "agents/{agent-slug}/"
    }
  ],
  "skills": ["skill-1", "skill-2"],
  "hooks": ["agent-spec-validator"],
  "providers": {
    "claude": {"supported": true},
    "copilot": {"supported": true},
    "openai": {"supported": true}
  }
}
```

**Task B: Create/Update `copilot-plugin.json`**

```json
{
  "name": "{Agent Name}",
  "agents": [
    {
      "id": "{agent-slug}",
      "instructions": "./agents/{agent-slug}/agent.md"
    }
  ]
}
```

**Deliverable:**
Both manifest files created/updated.

**Success Criteria:**
- [ ] plugin.json valid
- [ ] copilot-plugin.json valid
- [ ] All agent references valid

---

#### Step 5.3: Create/Update Provider Plugin Configs

**Task:** Create `.claude-plugin/`, `.codex-plugin/`, `.gemini-plugin/` subdirectories

```bash
mkdir -p .github/plugins/lightspeed-{DOMAIN}-{FOCUS}/.claude-plugin
mkdir -p .github/plugins/lightspeed-{DOMAIN}-{FOCUS}/.codex-plugin
mkdir -p .github/plugins/lightspeed-{DOMAIN}-{FOCUS}/.gemini-plugin
```

**For Each Provider:**
- Create `manifest.json` (provider-specific config)
- Create `instructions.md` (provider-specific rules)

**Deliverable:**
Provider subdirectories with configs.

**Success Criteria:**
- [ ] Directories created
- [ ] Manifest files created
- [ ] Instructions created

---

### PHASE 6: CREATE DOCUMENTATION

#### Step 6.1: Create Installation Guide

**Task:** Write `.github/plugins/lightspeed-{DOMAIN}-{FOCUS}/INSTALL.md`

**Include:**
- Installation for Claude
- Installation for GitHub Copilot
- Installation for OpenAI
- Troubleshooting section

**Deliverable:**
Complete INSTALL.md

**Success Criteria:**
- [ ] 3 provider installation methods
- [ ] Troubleshooting included
- [ ] Links verified

---

#### Step 6.2: Create README

**Task:** Write `.github/plugins/lightspeed-{DOMAIN}-{FOCUS}/README.md`

**Include:**
- Plugin overview
- Agents included (with descriptions)
- Skills included
- Quick start
- Documentation links

**Deliverable:**
Complete README.md

**Success Criteria:**
- [ ] Overview clear
- [ ] Agents documented
- [ ] Quick start provided

---

#### Step 6.3: Update Indexes

**Task:** Update:
- `.github/agents/README.md` — Add {Agent Name} to agent list
- `.github/agents/agent.md` — Add {Agent Name} to index
- `.github/plugins/README.md` — Add plugin to list
- `.github/AGENTS.md` — Update agent directory (if not already done)

**Deliverable:**
All indexes updated.

**Success Criteria:**
- [ ] Agent listed in `.github/agents/README.md`
- [ ] Agent listed in `agent.md` index
- [ ] Plugin listed in plugins README
- [ ] AGENTS.md updated

---

### PHASE 7: VALIDATION & TESTING

#### Step 7.1: Validate Schemas

**Task:** Run schema validation for:
- `AGENT.md` frontmatter (against `agent-config.schema.json`)
- `plugin.json` (against `plugin-manifest.schema.json`)
- All `tools.json` files (against `provider-config.schema.json`)

**Command:**

```bash
npm run validate:schema -- .github/agents/{agent-slug}-agent/
npm run validate:schema -- .github/plugins/lightspeed-{DOMAIN}-{FOCUS}/
```

**Success Criteria:**
- [ ] All schema validations pass

---

#### Step 7.2: Validate Hooks

**Task:** Run hook validation:

```bash
npm run validate:hooks -- .github/agents/{agent-slug}-agent/
npm run validate:hooks -- .github/plugins/lightspeed-{DOMAIN}-{FOCUS}/
```

**Success Criteria:**
- [ ] agent-spec-validator passes
- [ ] multi-provider-consistency-checker passes
- [ ] plugin-integrity-checker passes

---

#### Step 7.3: Test Provider Configs

**Task:** Verify each provider config loads correctly.

**For Claude:**
```bash
# Load agent.md and tools.json
node -e "const yaml = require('yaml'); console.log(yaml.parse(fs.readFileSync('.github/agents/{agent-slug}-agent/claude/agent.md')))"
```

**For Copilot:**
```bash
# Validate copilot-plugin.json
node -e "const json = require('.github/plugins/lightspeed-{DOMAIN}-{FOCUS}/copilot-plugin.json'); console.log(json)"
```

**For OpenAI:**
```bash
# Validate tools.json
node -e "const json = require('.github/agents/{agent-slug}-agent/openai/tools.json'); console.log(json)"
```

**Success Criteria:**
- [ ] Claude config loads
- [ ] Copilot config loads
- [ ] OpenAI config loads

---

#### Step 7.4: Documentation Check

**Task:** Verify:
- [ ] README links work
- [ ] INSTALL.md complete
- [ ] Agent descriptions clear
- [ ] Examples provided

---

### PHASE 8: GIT WORKFLOW & MERGE

#### Step 8.1: Create Feature Branch

```bash
git checkout -b feat/{agent-slug}-multi-provider
```

#### Step 8.2: Stage & Commit

```bash
git add .github/agents/{agent-slug}-agent/
git add .github/plugins/lightspeed-{DOMAIN}-{FOCUS}/
git add .github/instructions/
git add .github/.schemas/

git commit -m "feat: add {Agent Name} multi-provider support

- Rewrite {agent-slug}-agent for Claude, Copilot, OpenAI
- Create lightspeed-{DOMAIN}-{FOCUS} plugin
- Add provider-specific tool definitions
- Add comprehensive documentation"
```

#### Step 8.3: Create & Merge PR

```bash
gh pr create --title "feat: {Agent Name} multi-provider support" \
  --body "Converts {agent-slug}-agent to multi-provider format..."

# After approval:
gh pr merge --squash --delete-branch
```

---

## QUICK CHECKLIST

Use this to track progress:

- [ ] **Phase 1: Analysis**
  - [ ] Export analyzed
  - [ ] Plugin decision made
  - [ ] Analysis documented

- [ ] **Phase 2: Restructure**
  - [ ] Folder structure created
  - [ ] AGENT.md written
  - [ ] AGENT.md validates against schema

- [ ] **Phase 3: Provider Configs**
  - [ ] Core prompt written
  - [ ] Claude config created
  - [ ] Copilot config created
  - [ ] OpenAI config created

- [ ] **Phase 4: Tools**
  - [ ] Claude tools.json created
  - [ ] Copilot skills.yaml created
  - [ ] OpenAI tools.json created

- [ ] **Phase 5: Plugin**
  - [ ] Plugin structure created/updated
  - [ ] plugin.json created/updated
  - [ ] copilot-plugin.json created/updated
  - [ ] Provider configs created

- [ ] **Phase 6: Documentation**
  - [ ] INSTALL.md created
  - [ ] README.md created/updated
  - [ ] Indexes updated

- [ ] **Phase 7: Testing**
  - [ ] Schema validation passes
  - [ ] Hook validation passes
  - [ ] Provider configs load
  - [ ] Documentation links work

- [ ] **Phase 8: Merge**
  - [ ] Branch created
  - [ ] Changes committed
  - [ ] PR created & approved
  - [ ] Merged to develop
  - [ ] Branch deleted

---

## ESTIMATED TIMELINE

| Phase | Time |
| --- | --- |
| 1. Analysis | 20-30 min |
| 2. Restructure & Specs | 30-45 min |
| 3. Provider Configs | 30-45 min |
| 4. Tool Definitions | 15-20 min |
| 5. Plugin | 20-30 min |
| 6. Documentation | 20-30 min |
| 7. Testing & Validation | 15-20 min |
| 8. Git & Merge | 10-15 min |
| **Total** | **2.5-4 hours** |

---

## SUCCESS CRITERIA FOR COMPLETION

✅ **Agent Rewrite Complete When:**
1. Folder structure matches standard
2. AGENT.md fully written with YAML frontmatter
3. Core prompt (provider-agnostic) written
4. Claude, Copilot, OpenAI configs created
5. All tool definitions specified
6. Plugin created or updated
7. INSTALL.md & README complete
8. All schemas validate
9. All hooks pass
10. Documentation links work
11. PR merged to develop

---

## NEXT STEPS AFTER MERGE

1. Move to next agent (15 more to convert)
2. Use this template for each
3. Batch similar agents by domain (e.g., all "content" agents in one session)
4. Update memory/progress tracker
5. Celebrate progress! 🎉

---

## END OF PROMPT 2

Use this template for each of the remaining ChatGPT agents. Each should take 2-3 hours with practice.

---
file_type: audit
category: hooks
created_date: 2026-07-22
scope: phase-1-agent-standardization
---

# Hooks Folder Audit & Proposed New Hooks — Phase 1

**Objective:** Review existing hooks and propose new hooks for agent validation and multi-provider consistency.

**Audit Date:** 2026-07-22  
**Auditor:** Claude Code  
**Target:** feat/agent-standards-playwright-testing (Issue #1079)

---

## Current Hooks

### 1. **secrets-scanner**

- **Purpose:** Scans changed files for likely secrets before commit or release workflows
- **Status:** active
- **Version:** v0.1.1

### 2. **session-logger**

- **Purpose:** Captures structured session activity events for audit and troubleshooting
- **Status:** active
- **Version:** v0.1.1

### 3. **tool-guardian**

- **Purpose:** Prevents unsafe or disallowed tool operations based on configured guardrails
- **Status:** active
- **Version:** v0.1.1

**Current Registry:** `hooks/hook-registry.json`

---

## Gaps in Hook Coverage

Current hooks cover:

- ✅ Secret scanning
- ✅ Session logging
- ✅ Tool permission guarding

Missing for multi-provider agent standardization:

- ❌ Agent specification validation (YAML frontmatter, schema compliance)
- ❌ Multi-provider consistency checking (provider config alignment)
- ❌ Plugin integrity validation (manifest structure, agent wiring)
- ❌ Agent security auditing (secret detection in agent code)

---

## Proposed New Hooks

### Hook 1: **agent-spec-validator**

**Purpose:** Validates agent YAML frontmatter against schema and enforces required fields

**Triggers:**

- `pre-commit` — Validate on local commit
- `pre-push` — Validate before push to remote

**File patterns:**

- `agents/**/*.agent.md`
- `.github/agents/**/*.agent.md`
- `**/AGENT.md`

**Actions:**

1. Detect YAML frontmatter (opening `---` ... closing `---`)
2. Parse YAML and validate required fields: `name`, `title`, `description`, `version`, `providers`, `capabilities`
3. Validate `providers` against approved list: `["claude", "copilot", "openai"]`
4. Validate `version` matches semantic versioning pattern: `^\d+\.\d+\.\d+$`
5. Validate `status` is one of: `["active", "inactive", "deprecated", "experimental"]`
6. Check `last_updated` is valid ISO date format
7. Return clear error messages with line numbers
8. Exit with code 1 on failure, 0 on success

**Code outline:**

```javascript
/**
 * Agent Spec Validator Hook
 * Validates AGENT.md files against schema
 */

const fs = require('fs');
const yaml = require('yaml');
const path = require('path');

const REQUIRED_FIELDS = ['name', 'title', 'description', 'version', 'providers', 'capabilities'];
const VALID_PROVIDERS = ['claude', 'copilot', 'openai'];
const VALID_STATUSES = ['active', 'inactive', 'deprecated', 'experimental'];
const SEMVER_PATTERN = /^\d+\.\d+\.\d+$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

module.exports = {
  name: 'agent-spec-validator',
  description: 'Validates agent YAML frontmatter against schema',
  
  async validate(filePath) {
    const errors = [];
    
    // Read file
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract YAML frontmatter
    const match = content.match(/^---\n([\s\S]+?)\n---/);
    if (!match) {
      return { valid: false, errors: ['No YAML frontmatter found'] };
    }
    
    // Parse YAML
    let frontmatter;
    try {
      frontmatter = yaml.parse(match[1]);
    } catch (err) {
      return { valid: false, errors: [`YAML parse error: ${err.message}`] };
    }
    
    // Validate required fields
    for (const field of REQUIRED_FIELDS) {
      if (!frontmatter[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }
    
    // Validate providers
    if (frontmatter.providers) {
      if (!Array.isArray(frontmatter.providers)) {
        errors.push(`Field 'providers' must be an array`);
      } else {
        const invalid = frontmatter.providers.filter(p => !VALID_PROVIDERS.includes(p));
        if (invalid.length > 0) {
          errors.push(`Invalid providers: ${invalid.join(', ')}. Must be one of: ${VALID_PROVIDERS.join(', ')}`);
        }
      }
    }
    
    // Validate version
    if (frontmatter.version && !SEMVER_PATTERN.test(frontmatter.version)) {
      errors.push(`Invalid version format: ${frontmatter.version}. Must match X.Y.Z (e.g., 1.0.0)`);
    }
    
    // Validate status
    if (frontmatter.status && !VALID_STATUSES.includes(frontmatter.status)) {
      errors.push(`Invalid status: ${frontmatter.status}. Must be one of: ${VALID_STATUSES.join(', ')}`);
    }
    
    // Validate last_updated
    if (frontmatter.last_updated && !ISO_DATE_PATTERN.test(frontmatter.last_updated)) {
      errors.push(`Invalid last_updated format: ${frontmatter.last_updated}. Must be ISO date (YYYY-MM-DD)`);
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings: []
    };
  }
};
```

**Integration Points:**

- Pre-commit hook (`.git/hooks/pre-commit`)
- Pre-push hook (`.git/hooks/pre-push`)
- CI/CD validation step

---

### Hook 2: **multi-provider-consistency-checker**

**Purpose:** Detects divergences across provider-specific agent configurations (Claude, Copilot, OpenAI)

**Triggers:**

- `pre-commit` — Check on local commit
- `pre-push` — Check before push
- Optionally: CI validation

**File patterns:**

- `agents/**/` (agent folders)
- `.github/agents/**/` (repo-local agents)

**Actions:**

1. Verify agent folder structure has required provider subdirs: `claude/`, `copilot/`, `openai/`
2. Verify each provider has `agent.md` file
3. Verify `shared/core-prompt.md` exists
4. Check that all providers reference the same core capabilities
5. Validate that provider-specific configs don't contradict core spec
6. Check for missing tool definitions in any provider
7. Return warnings for optional features, errors for critical misalignments

**Code outline:**

```javascript
/**
 * Multi-Provider Consistency Checker
 * Detects provider divergences in agent configurations
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'multi-provider-consistency-checker',
  description: 'Detects provider configuration divergences',
  
  async validate(agentPath) {
    const errors = [];
    const warnings = [];
    
    const providers = ['claude', 'copilot', 'openai'];
    const requiredProviders = 2; // At least 2 of 3 providers required
    
    // Check core-prompt.md exists
    const corePromptPath = path.join(agentPath, 'shared', 'core-prompt.md');
    if (!fs.existsSync(corePromptPath)) {
      errors.push('Missing shared/core-prompt.md (provider-agnostic core instructions)');
    }
    
    // Check provider configs
    let validProviders = 0;
    for (const provider of providers) {
      const providerPath = path.join(agentPath, provider);
      const agentMdPath = path.join(providerPath, 'agent.md');
      
      if (!fs.existsSync(agentMdPath)) {
        warnings.push(`Missing ${provider}/agent.md (provider-specific config)`);
      } else {
        validProviders++;
      }
    }
    
    if (validProviders < requiredProviders) {
      errors.push(`Insufficient provider coverage: ${validProviders}/${providers.length} providers configured. Minimum required: ${requiredProviders}`);
    }
    
    // Check AGENT.md for provider list consistency
    const agentMdPath = path.join(agentPath, 'AGENT.md');
    if (fs.existsSync(agentMdPath)) {
      const agentContent = fs.readFileSync(agentMdPath, 'utf-8');
      const match = agentContent.match(/providers:\s*\[([\s\S]+?)\]/);
      if (match) {
        const declaredProviders = match[1].split(',').map(p => p.trim().replace(/['"]/g, ''));
        const missingConfigs = declaredProviders.filter(p => !fs.existsSync(path.join(agentPath, p, 'agent.md')));
        if (missingConfigs.length > 0) {
          errors.push(`Agent declares support for ${missingConfigs.join(', ')} but missing config files`);
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
};
```

**Integration Points:**

- Pre-commit hook
- Pre-push hook
- CI/CD validation

---

### Hook 3: **plugin-integrity-checker**

**Purpose:** Validates plugin manifest and folder structure integrity

**Triggers:**

- `pre-commit` — Validate on commit
- `pre-push` — Validate before push

**File patterns:**

- `plugins/lightspeed-*/**` (plugin folders)

**Actions:**

1. Verify `plugin.json` exists and is valid JSON
2. Verify `copilot-plugin.json` exists
3. Verify required subdirectories exist: `agents/`, `skills/`, `hooks/`, provider-specific dirs (`.claude-plugin/`, `.codex-plugin/`, `.gemini-plugin/`)
4. Validate all agents referenced in manifests have folders
5. Validate all skills referenced in manifests have definitions
6. Check for broken symlinks or missing referenced files
7. Validate manifest schema compliance

**Code outline:**

```javascript
/**
 * Plugin Integrity Checker
 * Validates plugin manifest and structure
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_DIRS = ['agents', 'skills', 'hooks'];
const PROVIDER_DIRS = ['.claude-plugin', '.codex-plugin', '.gemini-plugin'];

module.exports = {
  name: 'plugin-integrity-checker',
  description: 'Validates plugin manifest and structure',
  
  async validate(pluginPath) {
    const errors = [];
    const warnings = [];
    
    // Check plugin.json
    const pluginJsonPath = path.join(pluginPath, 'plugin.json');
    if (!fs.existsSync(pluginJsonPath)) {
      errors.push('Missing plugin.json');
    } else {
      try {
        const plugin = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf-8'));
        
        // Validate required fields
        if (!plugin.name) errors.push('plugin.json missing required field: name');
        if (!plugin.version) errors.push('plugin.json missing required field: version');
        if (!plugin.agents || !Array.isArray(plugin.agents)) errors.push('plugin.json missing or invalid agents array');
      } catch (err) {
        errors.push(`Invalid plugin.json: ${err.message}`);
      }
    }
    
    // Check copilot-plugin.json
    const copilotJsonPath = path.join(pluginPath, 'copilot-plugin.json');
    if (!fs.existsSync(copilotJsonPath)) {
      warnings.push('Missing copilot-plugin.json (Copilot support unavailable)');
    }
    
    // Check required directories
    for (const dir of REQUIRED_DIRS) {
      if (!fs.existsSync(path.join(pluginPath, dir))) {
        errors.push(`Missing required directory: ${dir}/`);
      }
    }
    
    // Check provider directories (at least one should exist)
    const hasProviderDir = PROVIDER_DIRS.some(dir => fs.existsSync(path.join(pluginPath, dir)));
    if (!hasProviderDir) {
      warnings.push(`No provider-specific directories found. Expected at least one of: ${PROVIDER_DIRS.join(', ')}`);
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
};
```

**Integration Points:**

- Pre-commit hook
- Pre-push hook
- CI/CD validation

---

### Hook 4: **agent-security-auditor**

**Purpose:** Scans agent files for security violations (hardcoded secrets, unsafe patterns)

**Triggers:**

- `pre-push` — Security scan before push
- CI/CD validation (recommended)

**File patterns:**

- `agents/**/*` (all agent files)
- `.github/agents/**/*` (repo-local agents)
- `plugins/**/*` (all plugin files)

**Actions:**

1. Scan for hardcoded secrets (API keys, passwords, tokens, credentials)
2. Check for unsafe patterns:
   - Database connection strings
   - AWS/Azure credentials
   - API keys in code
   - Private tokens
3. Flag files with potential secrets
4. Return violations and warnings
5. Allow override with `# SKIP:agent-security-auditor` comments
6. Exit with code 1 on critical violations

**Code outline:**

```javascript
/**
 * Agent Security Auditor
 * Scans for security violations in agent configurations
 */

const fs = require('fs');
const path = require('path');

const SECURITY_PATTERNS = [
  { pattern: /password\s*[:=\s]+['"](.*)['"]/gi, name: 'Hardcoded password' },
  { pattern: /api[_-]?key\s*[:=\s]+['"](.*)['"]/gi, name: 'Hardcoded API key' },
  { pattern: /secret\s*[:=\s]+['"](.*)['"]/gi, name: 'Hardcoded secret' },
  { pattern: /token\s*[:=\s]+['"](.*)['"]/gi, name: 'Hardcoded token' },
  { pattern: /aws_secret_access_key\s*[:=\s]+['"](.*)['"]/gi, name: 'AWS secret' },
  { pattern: /bearer\s+[a-z0-9._\-]+/gi, name: 'Bearer token' },
];

module.exports = {
  name: 'agent-security-auditor',
  description: 'Scans for security violations in agents',
  
  async validate(dirPath) {
    const errors = [];
    const warnings = [];
    
    const files = this.getAllFiles(dirPath);
    
    for (const file of files) {
      // Skip non-code files
      if (!file.match(/\.(json|md|js|yaml|yml)$/i)) continue;
      
      const content = fs.readFileSync(file, 'utf-8');
      
      // Check for skip directive
      if (content.includes('# SKIP:agent-security-auditor')) {
        continue;
      }
      
      // Scan for security patterns
      for (const { pattern, name } of SECURITY_PATTERNS) {
        const matches = content.matchAll(pattern);
        for (const match of matches) {
          const relPath = path.relative(dirPath, file);
          warnings.push(`${name} detected in ${relPath} at line ${this.getLineNumber(content, match.index)}`);
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  },
  
  getAllFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        if (!item.startsWith('.')) {
          files.push(...this.getAllFiles(fullPath));
        }
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  },
  
  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
  }
};
```

**Integration Points:**

- Pre-push hook (recommended)
- CI/CD validation (recommended)
- Can be run manually: `npm run validate:hooks -- agent-security-auditor`

---

## Hook Registration Update

Add to `hooks/hook-registry.json`:

```json
{
  "version": "v0.2.0",
  "last_updated": "2026-07-22",
  "hooks": [
    {
      "id": "tool-guardian",
      "path": "hooks/tool-guardian/README.md",
      "status": "active",
      "category": "security"
    },
    {
      "id": "secrets-scanner",
      "path": "hooks/secrets-scanner/README.md",
      "status": "active",
      "category": "security"
    },
    {
      "id": "session-logger",
      "path": "hooks/session-logger/README.md",
      "status": "active",
      "category": "observability"
    },
    {
      "id": "agent-spec-validator",
      "path": "hooks/agent-spec-validator/README.md",
      "status": "active",
      "category": "agent-validation",
      "triggers": ["pre-commit", "pre-push"]
    },
    {
      "id": "multi-provider-consistency-checker",
      "path": "hooks/multi-provider-consistency-checker/README.md",
      "status": "active",
      "category": "agent-validation",
      "triggers": ["pre-commit", "pre-push"]
    },
    {
      "id": "plugin-integrity-checker",
      "path": "hooks/plugin-integrity-checker/README.md",
      "status": "active",
      "category": "plugin-validation",
      "triggers": ["pre-commit", "pre-push"]
    },
    {
      "id": "agent-security-auditor",
      "path": "hooks/agent-security-auditor/README.md",
      "status": "active",
      "category": "security",
      "triggers": ["pre-push"]
    }
  ]
}
```

---

## Implementation Checklist

### Hook Folder Creation

- [ ] Create `hooks/agent-spec-validator/` directory
- [ ] Create `hooks/multi-provider-consistency-checker/` directory
- [ ] Create `hooks/plugin-integrity-checker/` directory
- [ ] Create `hooks/agent-security-auditor/` directory

### Hook Implementation

- [ ] Create `validator.js` (or `index.js`) for each hook with validation logic
- [ ] Create `README.md` documentation for each hook
- [ ] Add tests for each hook (Jest or similar)

### Registration

- [ ] Update `hooks/hook-registry.json` with new hooks
- [ ] Update `hooks/README.md` to include new hooks in table

### Integration

- [ ] Add hooks to Claude Code `.claude/settings.json` for local validation
- [ ] Add hooks to CI/CD workflows for automated validation
- [ ] Add pre-commit configuration (if using husky or similar)

---

## Success Criteria — Task 2

✅ Current hooks reviewed and categorized  
✅ Gaps identified (4 new hooks needed)  
✅ Each hook documented with:

- Purpose and description
- Triggers (when it runs)
- File patterns (what it checks)
- Actions (what it validates)
- Code outline (implementation pattern)
- Integration points (how to use)
✅ Hook registry update prepared  
✅ Implementation checklist created  

---

## Next Steps (Task 3)

Proceed to **Schemas Folder Audit** to review existing schemas and propose 4 new schemas for multi-provider agent validation.
---

---

🔍 *Audit report generated {audit_date} by the LightSpeedWP team.*

[📋 Reports Index](https://github.com/lightspeedwp/.github/tree/develop/.github/reports) · [📞 Contact](https://lightspeedwp.agency/contact)

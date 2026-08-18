---
title: Chat Closure Agent — Integration Guide
description: How to integrate the Chat Closure Agent into other LightSpeedWP projects
created_date: 2026-08-13
last_updated: 2026-08-13
author: Claude Code
tags: ["integration", "deployment", "multi-project", "wordpress"]
---

# Chat Closure Agent — Integration Guide

**Integrate the Chat Closure Agent into control-plane, WordPress plugins, and WordPress themes.**

## Supported Repository Types

The Chat Closure Agent automatically adapts to three repository types:

### 1. Control-Plane Repository (.github)

**Characteristics:**
- `.github/` directory present
- Contains labels, workflows, etc.
- Organization-wide governance

**Auto-Detection:**
```javascript
const analysis = coreAnalysis.analyzeRepository('.');
console.log(analysis.repoType); // "control-plane"
```

**Memory Location:** `.remember/` at root

**Example Closure:**
```javascript
const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
  sessionId: 'workflow-improvements',
  decisions: {
    'labeling': {
      choice: 'Automated label enforcement',
      rationale: 'Reduce manual triage'
    }
  },
  blockers: ['Waiting for GitHub API rate limit increase'],
  nextSteps: ['Implement label validator', 'Test with team', 'Roll out to repos']
});
```

### 2. WordPress Plugin Repository

**Characteristics:**
- `plugin.php` file at root
- `composer.json` for dependencies
- Plugin-specific structure

**Auto-Detection:**
```javascript
const analysis = coreAnalysis.analyzeRepository('.');
console.log(analysis.repoType); // "wordpress-plugin"
```

**Memory Location:** `.remember/` at plugin root

**Example Closure:**
```javascript
const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
  sessionId: 'block-development',
  decisions: {
    'architecture': {
      choice: 'React-based block',
      rationale: 'Supports modern WordPress 6.0+'
    }
  },
  blockers: ['Need block.json schema update'],
  nextSteps: ['Register block type', 'Add editor styles', 'Test in WordPress admin']
});
```

### 3. WordPress Theme Repository

**Characteristics:**
- `theme.json` file present
- `style.css` with theme headers
- Template-based structure

**Auto-Detection:**
```javascript
const analysis = coreAnalysis.analyzeRepository('.');
console.log(analysis.repoType); // "wordpress-theme"
```

**Memory Location:** `.remember/` at theme root

**Example Closure:**
```javascript
const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
  sessionId: 'theme-customization',
  decisions: {
    'design-system': {
      choice: 'Token-based color palette',
      rationale: 'Enables dark mode support'
    }
  },
  blockers: ['Awaiting color token definitions from design team'],
  nextSteps: ['Update theme.json', 'Create pattern library', 'Test responsiveness']
});
```

---

## Integration Patterns

### Pattern 1: Per-Project Closure Scripts

**Create a closure script in each project:**

```bash
# In control-plane/.github
mkdir -p scripts/agent-tools
touch scripts/agent-tools/close-session.js

# In plugin-repo
mkdir -p .github/scripts
touch .github/scripts/close-session.js

# In theme-repo
mkdir -p .github/scripts
touch .github/scripts/close-session.js
```

**Each script imports the shared agent:**

```javascript
// scripts/agent-tools/close-session.js
const path = require('path');

// Import from central location or local copy
const coreAnalysis = require('../../../.github/agents/chat-closure-agent/shared/core-analysis');
const memoryUpdater = require('../../../.github/agents/chat-closure-agent/shared/memory-updater');

async function closeSession(sessionId, decisions, blockers, nextSteps) {
  const analysis = coreAnalysis.analyzeRepository('.');
  const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
    sessionId,
    decisions,
    blockers,
    nextSteps
  });
  return memory;
}

module.exports = { closeSession };
```

### Pattern 2: Npm Script Integration

**Add to each project's package.json:**

```json
{
  "scripts": {
    "close-session": "node scripts/agent-tools/close-session.js",
    "close-session:feature": "node scripts/agent-tools/close-session.js feature-dev",
    "close-session:bugfix": "node scripts/agent-tools/close-session.js bugfix-resolution",
    "close-session:release": "node scripts/agent-tools/close-session.js release-prep"
  }
}
```

**Usage:**
```bash
npm run close-session
npm run close-session:feature
```

### Pattern 3: Shared Agent Library

**For organizations with many projects:**

1. **Publish to npm registry:**
   ```bash
   cd agents/chat-closure-agent
   npm version 1.0.0
   npm publish
   ```

2. **Install in each project:**
   ```bash
   npm install @lightspeedwp/chat-closure-agent
   ```

3. **Use in scripts:**
   ```javascript
   const { coreAnalysis, memoryUpdater } = require('@lightspeedwp/chat-closure-agent');
   
   const analysis = coreAnalysis.analyzeRepository('.');
   const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
     sessionId: 'my-session',
     decisions: {...},
     blockers: [],
     nextSteps: [...]
   });
   ```

---

## Repository-Specific Configuration

### Control-Plane Configuration

```javascript
// Closure script for .github repo
const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
  sessionId: 'governance-improvement',
  
  // Focus on governance, workflows, automation
  decisions: {
    'branch-protection': {
      choice: 'Enforce required reviews',
      rationale: 'Prevent accidental merges'
    },
    'label-system': {
      choice: 'Hierarchical labels by family',
      rationale: 'Reduce label count, improve clarity'
    }
  },
  
  blockers: ['Team approval on label taxonomy'],
  nextSteps: [
    'Document new label system',
    'Migrate existing labels',
    'Update automation rules'
  ]
});
```

### Plugin Configuration

```javascript
// Closure script for WordPress plugin
const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
  sessionId: 'plugin-feature-development',
  
  // Focus on block features, PHP logic, WordPress integration
  decisions: {
    'block-type': {
      choice: 'Dynamic block with server-side rendering',
      rationale: 'Access to post meta data'
    },
    'testing': {
      choice: 'PHPUnit for backend, Jest for block',
      rationale: '90%+ coverage requirement'
    }
  },
  
  blockers: ['Pending WordPress 6.3 compatibility'],
  nextSteps: [
    'Register block in plugin.php',
    'Create block template',
    'Add block settings panel',
    'Write unit tests'
  ]
});
```

### Theme Configuration

```javascript
// Closure script for WordPress theme
const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
  sessionId: 'theme-design-system',
  
  // Focus on design tokens, patterns, templates
  decisions: {
    'color-system': {
      choice: 'CSS custom properties via theme.json',
      rationale: 'Native dark mode support'
    },
    'spacing-scale': {
      choice: 'Fibonacci scale (0, 1, 2, 3, 5, 8, 13)',
      rationale: 'Proportional, familiar to designers'
    }
  },
  
  blockers: ['Design token audit not yet complete'],
  nextSteps: [
    'Finalize color palette',
    'Define typography scale',
    'Create component patterns',
    'Document in theme.json'
  ]
});
```

---

## Memory Organization Across Projects

### Shared Memory Index

**Create a central index for multi-project sessions:**

```bash
# In control-plane
mkdir -p .remember/projects

# Create a master index
cat > .remember/projects/MULTI_PROJECT_INDEX.md << 'EOF'
# Multi-Project Session Index

## Active Projects

### lightspeedwp/.github
- Latest closure: `governance-2026-08-13.md`
- Focus: Labeling system, branch protection
- Next session: Continue label migration

### lightspeedwp/plugin-blocks
- Latest closure: `blocks-development-2026-08-13.md`
- Focus: Custom block implementation
- Next session: Add block settings UI

### lightspeedwp/theme-design-system
- Latest closure: `theme-design-2026-08-13.md`
- Focus: Design token system
- Next session: Finalize color palette
EOF
```

### Cross-Project Memory Structure

```
.remember/
├── MEMORY.md                          (main index)
├── projects/
│   ├── MULTI_PROJECT_INDEX.md        (cross-project reference)
│   ├── control-plane-session.md
│   ├── plugin-development-session.md
│   └── theme-design-session.md
├── decisions/
│   ├── architecture-decisions.md
│   └── design-system-decisions.md
└── blockers/
    ├── pending-approvals.md
    └── external-dependencies.md
```

---

## Continuous Integration Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/close-session.yml
name: Session Closure Automation

on:
  workflow_dispatch:
    inputs:
      sessionId:
        description: 'Session identifier'
        required: true
      decisions:
        description: 'JSON string of decisions'
        required: false

jobs:
  close-session:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Run session closure
        run: |
          node scripts/agent-tools/close-session.js \
            --session "${{ github.event.inputs.sessionId }}" \
            --decisions "${{ github.event.inputs.decisions }}"
      
      - name: Commit memory
        run: |
          git config user.name "Claude Code"
          git config user.email "claude@anthropic.com"
          git add .remember/
          git commit -m "docs: Session closure for ${{ github.event.inputs.sessionId }}" || true
          git push
```

### Pre-Push Hook Integration

```bash
#!/bin/bash
# .git/hooks/pre-push (or husky hook)

echo "🔄 Preparing session closure..."
node scripts/agent-tools/close-session.js \
  --session "pre-push-$(date +%Y%m%d)" \
  --auto-detect-decisions

echo "✅ Session closure prepared for .remember/"
```

---

## Best Practices for Multi-Project Teams

1. **Consistent naming:** Use `{project}-{type}-{date}.md` format
   ```
   control-plane-governance-2026-08-13.md
   plugin-blocks-feature-2026-08-13.md
   theme-design-system-2026-08-13.md
   ```

2. **Cross-reference decisions:** Link decisions between projects
   ```markdown
   ## Decisions
   
   ### Design System (controls all projects)
   See: theme-design-system-2026-08-13.md
   
   ### Plugin-Specific
   Extends design system with block-specific styles
   ```

3. **Shared blockers:** Maintain a central blockers list
   ```bash
   .remember/blockers/
   ├── design-approval.md
   ├── wordpress-compatibility.md
   └── api-integration.md
   ```

4. **Team communication:** Share relevant memory entries with team
   ```bash
   # Share decision documentation
   cat .remember/projects/MULTI_PROJECT_INDEX.md | \
     gh pr comment {PR_NUMBER}
   ```

---

## Troubleshooting Integration Issues

**Q: "Repository type detection failed"**  
A: Ensure the repo has identifying files (plugin.php, theme.json, or .github/)

**Q: "Memory permissions denied"**  
A: Check `.remember/` directory permissions and git config

**Q: "Scripts can't find agent modules"**  
A: Verify relative paths to agent shared modules

**Q: "Cross-project references broken"**  
A: Use absolute paths or git repo references for multi-project access

---

## Examples: Real-World Integration

### Example 1: Feature across plugin + theme

```javascript
// Both repos run closure with linked decisions
const sharedDecisions = {
  'design-tokens': {
    choice: 'Theme provides tokens, plugin consumes',
    rationale: 'Single source of truth'
  },
  'testing-approach': {
    choice: 'E2E tests in theme repo',
    rationale: 'Tests full integration'
  }
};

// plugin repo
memoryUpdater.updateMemoryForSessionClosure('.', pluginAnalysis, {
  sessionId: 'plugin-feature-xyz',
  decisions: {...sharedDecisions, pluginSpecific: {...}},
  blockers: ['Waiting for theme token release'],
  nextSteps: ['Await theme tokens', 'Implement block UI']
});

// theme repo
memoryUpdater.updateMemoryForSessionClosure('.', themeAnalysis, {
  sessionId: 'theme-tokens-xyz',
  decisions: {...sharedDecisions, themeSpecific: {...}},
  blockers: [],
  nextSteps: ['Release tokens', 'Notify plugin team']
});
```

### Example 2: Control-plane governance supporting plugin development

```javascript
// control-plane closure
memoryUpdater.updateMemoryForSessionClosure('.', controlPlaneAnalysis, {
  sessionId: 'ci-pipeline-plugin-support',
  decisions: {
    'php-testing': {
      choice: 'PHPUnit 9+ required in CI',
      rationale: 'Ensure plugin quality'
    }
  },
  blockers: [],
  nextSteps: ['Update CI workflow', 'Notify plugin teams']
});

// plugin closure references this
memoryUpdater.updateMemoryForSessionClosure('.', pluginAnalysis, {
  sessionId: 'plugin-ci-alignment',
  decisions: {
    'testing-framework': {
      choice: 'PHPUnit 9 per org standards',
      rationale: 'See control-plane governance'
    }
  },
  blockers: [],
  nextSteps: ['Upgrade PHPUnit', 'Run full test suite']
});
```

---

**Ready to integrate across your projects?** Start with the Quick Start guide, then scale to multi-project workflows!

For more details, see:
- [Quick Start](./quick-start.md) — Get started in 5 minutes
- [CLI Reference](./cli-reference.md) — Command-line options
- [Full Usage Guide](../agents/chat-closure-agent/docs/USAGE_GUIDE.md) — Complete API

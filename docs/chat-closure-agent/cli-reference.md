---
file_type: documentation
title: Chat Closure Agent — CLI Reference
description: Command-line interface and options for the Chat Closure Agent
created_date: 2026-08-13T00:00:00.000Z
last_updated: '2026-08-21'
author: Claude Code
tags:
  - cli
  - reference
  - commands
  - options
---

# Chat Closure Agent — CLI Reference

**Complete command-line reference for the Chat Closure Agent.**

## Installation

```bash
# Add to your project
npm install @lightspeedwp/chat-closure-agent

# Or use locally
cd agents/chat-closure-agent
npm install
```

## Basic Command Structure

```bash
node close-session.js [options]
```

## Global Options

### `--help`

Display help information.

```bash
node close-session.js --help
```

**Output:**

```
Usage: close-session [options]

Options:
  -h, --help              Show this help message
  -s, --session <id>      Session identifier (required)
  -d, --decisions <json>  Decisions JSON
  -b, --blockers <json>   Blockers array
  -n, --next-steps <json> Next steps array
  -p, --path <path>       Repository path (default: .)
  -o, --output <path>     Output directory (default: .remember)
  --no-memory             Skip memory creation
  --no-prompt             Skip continuation prompt
  --dry-run               Preview without saving
  --verbose               Verbose output
```

### `--version`

Display version information.

```bash
node close-session.js --version
```

**Output:**

```
Chat Closure Agent v1.0.0
```

---

## Core Options

### `--session` / `-s` (Required)

**Identifier for this session closure.**

```bash
node close-session.js --session "feature-implementation-2026-08-13"
```

**Format guidelines:**

- Use kebab-case (hyphens, no spaces)
- Include context: `{project}-{type}-{date}`
- Examples:
  - `control-plane-governance-2026-08-13`
  - `plugin-blocks-feature-2026-08-13`
  - `theme-design-system-2026-08-13`

### `--path` / `-p`

**Repository path to analyze.**

```bash
node close-session.js --session "my-session" --path "/path/to/repo"
```

**Default:** Current directory (`.`)

**Examples:**

```bash
# Current directory (default)
node close-session.js --session "local-session"

# Specific path
node close-session.js --session "remote-session" --path "/home/user/projects/plugin"

# Relative path
node close-session.js --session "submodule-session" --path "./submodules/shared"
```

### `--output` / `-o`

**Where to save the memory entry.**

```bash
node close-session.js --session "my-session" --output "/custom/memory/path"
```

**Default:** `.remember` directory at repository root

**Examples:**

```bash
# Custom location
node close-session.js --session "archived" --output ".github/archived-sessions"

# Shared location across projects
node close-session.js --session "multi-project" --output "~/shared-memory"
```

---

## Decision Options

### `--decisions` / `-d`

**Document key decisions as JSON.**

```bash
node close-session.js --session "my-session" --decisions '{
  "architecture": {
    "choice": "Modular design",
    "rationale": "Enables code reuse"
  },
  "testing": {
    "choice": "Unit + integration",
    "rationale": "85%+ coverage required"
  }
}'
```

**JSON Structure:**

```json
{
  "decision-key": {
    "choice": "What you decided",
    "rationale": "Why you decided it"
  }
}
```

**Common decision keys:**

- `architecture` — System design approach
- `testing` — Testing strategy
- `deployment` — Deployment method
- `database` — Data storage choice
- `styling` — CSS/design approach
- `framework` — Technology choice
- `api-design` — API structure

### `--blockers` / `-b`

**Document issues blocking progress as JSON array.**

```bash
node close-session.js --session "my-session" --blockers '[
  "Waiting for design review approval",
  "API endpoint not available",
  "Team decision required on architecture"
]'
```

**Format:**

```json
[
  "Blocker description 1",
  "Blocker description 2",
  "Blocker description 3"
]
```

**Leave empty if no blockers:**

```bash
node close-session.js --session "my-session" --blockers '[]'
```

### `--next-steps` / `-n`

**Document upcoming action items as JSON array.**

```bash
node close-session.js --session "my-session" --next-steps '[
  "Implement validation layer",
  "Write unit tests",
  "Request code review",
  "Address feedback",
  "Merge to develop"
]'
```

**Format:**

```json
[
  "Action 1",
  "Action 2",
  "Action 3"
]
```

---

## Behavior Options

### `--no-memory`

**Skip memory file creation, output only.**

```bash
node close-session.js --session "analysis-only" --no-memory
```

Useful for:

- Quick analysis without persistence
- Testing decision capture format
- CI/CD dry runs

### `--no-prompt`

**Skip continuation prompt generation.**

```bash
node close-session.js --session "memory-only" --no-prompt
```

Useful for:

- Archiving session memories
- Recording decisions without resumption context
- Lightweight closures

### `--dry-run`

**Preview output without saving to disk.**

```bash
node close-session.js --session "preview" --dry-run
```

Output shows:

- Detected repository type
- Analyzed commits
- Proposed memory file path
- Continuation prompt preview

Perfect for testing before committing.

### `--verbose` / `-v`

**Detailed output for debugging.**

```bash
node close-session.js --session "debug" --verbose
```

Shows:

- Step-by-step analysis
- Git command outputs
- File operations
- Validation details

---

## Advanced Options

### `--auto-detect-decisions`

**Attempt to extract decisions from recent commits.**

```bash
node close-session.js --session "auto-decisions" --auto-detect-decisions
```

Analyzes commit messages for decision patterns:

- "Architecture: ..."
- "Decision: ..."
- "Chosen: ..."

**Use with caution** — verify auto-detected decisions are accurate.

### `--format` / `-f`

**Output format for continuation prompt.**

```bash
node close-session.js --session "my-session" --format markdown
```

**Options:**

- `markdown` (default) — Formatted for Claude
- `json` — Structured data format
- `text` — Plain text
- `html` — For web documentation

**Examples:**

```bash
# For Claude sessions
--format markdown

# For programmatic use
--format json

# For documentation
--format html
```

### `--tag` / `-t`

**Add tags to memory entry for categorization.**

```bash
node close-session.js --session "my-session" --tag "feature" --tag "urgent"
```

**Common tags:**

- `feature` — New feature development
- `bugfix` — Bug fixing
- `refactor` — Code refactoring
- `docs` — Documentation
- `urgent` — High priority
- `blocked` — Currently blocked
- `ready-pr` — Ready for pull request

---

## Common Workflows

### Workflow 1: Simple Session Closure

```bash
node close-session.js \
  --session "my-feature-$(date +%Y-%m-%d)" \
  --decisions '{"approach": {"choice": "React hooks", "rationale": "Simpler state management"}}' \
  --blockers '[]' \
  --next-steps '["Write tests", "Request review"]'
```

### Workflow 2: Quick Analysis Only

```bash
node close-session.js \
  --session "repo-analysis" \
  --no-memory \
  --no-prompt \
  --path "/path/to/repo"
```

### Workflow 3: Preview Before Saving

```bash
node close-session.js \
  --session "my-session" \
  --dry-run \
  --verbose
```

### Workflow 4: Multi-Project Closure

```bash
#!/bin/bash

# Close session in control-plane
cd /repos/control-plane
node scripts/close-session.js \
  --session "governance-$(date +%Y-%m-%d)" \
  --decisions '{"labeling": {"choice": "Hierarchical", "rationale": "Clarity"}}'

# Close session in plugin
cd /repos/plugin
node scripts/close-session.js \
  --session "blocks-$(date +%Y-%m-%d)" \
  --decisions '{"framework": {"choice": "React", "rationale": "WP 6.0+"}}'

# Close session in theme
cd /repos/theme
node scripts/close-session.js \
  --session "design-$(date +%Y-%m-%d)" \
  --decisions '{"tokens": {"choice": "CSS custom props", "rationale": "Dark mode"}}'
```

### Workflow 5: Automated CI Closure

```bash
#!/bin/bash
# .github/scripts/close-session-ci.sh

SESSION_ID="ci-$(git rev-parse --short HEAD)-$(date +%Y-%m-%d)"
BRANCH=$(git rev-parse --abbrev-ref HEAD)
DECISIONS="{
  \"ci-trigger\": {
    \"choice\": \"Automated closure on PR\",
    \"rationale\": \"Capture state at CI time\"
  },
  \"branch\": {
    \"choice\": \"$BRANCH\",
    \"rationale\": \"Automatic detection\"
  }
}"

node close-session.js \
  --session "$SESSION_ID" \
  --decisions "$DECISIONS" \
  --next-steps '["Merge PR", "Deploy"]'
```

---

## Output Examples

### Standard Output (Memory Created)

```
✅ Session Analysis Complete

📊 Repository Analysis:
   Type: control-plane
   Branch: feat/governance
   Commits ahead: 5
   Files changed: 12

📝 Memory Entry:
   Path: .remember/governance-2026-08-13.md
   Size: 2.1 KB
   Decisions: 3 recorded
   Blockers: 1 recorded
   Next steps: 4 recorded

📋 Continuation Prompt:
   Generated: 850 tokens
   Topics: 7 sections
   Ready for: Next session

✅ Session closed successfully!
```

### Dry Run Output

```
🔍 Dry Run Preview (no files created)

📊 Repository Analysis:
   Type: wordpress-plugin
   Branch: feature/blocks
   Commits: 8 ahead of develop
   Changes: 24 files

📝 Memory Entry (would be saved as):
   .remember/blocks-feature-2026-08-13.md

💾 File size: ~1.8 KB

📋 Continuation Prompt Preview (first 200 chars):
   "## Session Resumption Guide

   You were working on: feature/blocks
   Branch analysis: 8 commits ahead
   Recent..."

✅ Preview complete. Use without --dry-run to save.
```

### Verbose Output (Debug)

```
🔧 [VERBOSE] Analyzing repository...
   Command: git rev-parse --abbrev-ref HEAD
   Result: feature/implementation
   
🔧 [VERBOSE] Checking repository type...
   Detected markers: .github/labels.yml, .github/workflows/
   Type: control-plane
   
🔧 [VERBOSE] Analyzing commits...
   Command: git log --oneline -20
   Found: 5 commits ahead of develop
   
🔧 [VERBOSE] Creating memory entry...
   Path: .remember/governance-2026-08-13.md
   Writing: 2,145 bytes
   Status: Success
   
✅ All steps completed successfully!
```

---

## Error Messages and Solutions

### Error: "Session ID required"

```
❌ Error: --session is required

Use: node close-session.js --session <id> [options]
```

**Solution:** Add `--session "my-session"` flag

### Error: "Repository not found"

```
❌ Error: No git repository found at path .
```

**Solution:** Run from git repository root or use `--path` flag

### Error: "Permission denied"

```
❌ Error: Cannot write to .remember directory
```

**Solution:** Check permissions or use `--output` flag for alternate location

### Error: "Invalid JSON in --decisions"

```
❌ Error: Invalid JSON in --decisions option
   Details: Unexpected token at position 45
```

**Solution:** Validate JSON syntax:

```bash
# Test JSON before passing
node -e "console.log(JSON.parse('{...}'))"
```

---

## Integration with npm Scripts

**Add to package.json:**

```json
{
  "scripts": {
    "close-session": "node scripts/close-session.js",
    "close-session:feature": "npm run close-session -- --session feature-$(date +%Y-%m-%d)",
    "close-session:bugfix": "npm run close-session -- --session bugfix-$(date +%Y-%m-%d)",
    "close-session:review": "npm run close-session -- --session code-review-$(date +%Y-%m-%d)",
    "close-session:preview": "npm run close-session -- --dry-run --verbose"
  }
}
```

**Usage:**

```bash
npm run close-session
npm run close-session:feature
npm run close-session:preview
```

---

## Related Documentation

- [Quick Start](./quick-start.md) — 5-minute setup
- [Integration Guide](./integration-guide.md) — Multi-project setup
- [Troubleshooting FAQ](./troubleshooting-faq.md) — Common issues
- [Full API Reference](../agents/chat-closure-agent/docs/USAGE_GUIDE.md) — Complete reference

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

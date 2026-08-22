---
title: Meta Agent v2.0 — Quick Start (5 Minutes)
description: >
  5-minute quick start guide for Meta Agent v2.0.
  Get up and running in less than 5 minutes.
file_type: guide
category: training
version: 1.0
status: active
author: Ash Shaw
date: '2026-08-21'
language: en
owners:
  - lightspeedwp/maintainers
---

# Quick Start — Meta Agent v2.0

Get Meta Agent v2.0 running in 5 minutes.

## 1. Install (1 minute)

```bash
cd .github/agents/meta-agent
npm install
npm test  # Verify: Should show 116 tests passing
```

## 2. Setup Hook (1 minute)

```bash
chmod +x scripts/hooks/meta-agent-validate.sh
cp scripts/hooks/meta-agent-validate.sh .git/hooks/pre-commit
```

## 3. Add Frontmatter to Your Files

### Example: Block Plugin

```markdown
---
title: User Input Block
description: Captures user input with validation
status: active
language: en
block_name: lightspeed/user-input
block_supports:
  - align
  - colors
plugin_name: User Input Block
requires_wordpress: 6.0
requires_php: 7.4
---

# Content...
```

### Example: Control-Plane (.github)

```markdown
---
title: Contributing Guide
description: How to contribute
file_type: guide
category: community
status: active
language: en
owners:
  - lightspeedwp/maintainers
---

# Content...
```

### Example: Generic Documentation

```markdown
---
title: Setup Guide
description: How to set up the project
status: active
language: en
---

# Content...
```

## 4. Validate (1 minute)

```bash
cd .github/agents/meta-agent

# Test a file
npm run validate -- ../../README.md

# Validate all changed files
npm run validate:changed
```

## 5. Commit (1 minute)

```bash
git add file.md
git commit -m "docs: Add documentation"
# Hook runs validation automatically
```

---

## Required Fields Checklist

### All Files Need:
- [ ] `title` (3-120 characters)
- [ ] `description` (10-300 characters)
- [ ] `status` (active, draft, review, archived)
- [ ] `language` (en only)

### Control-Plane (.github) Also Needs:
- [ ] `file_type` (guide, instruction, template, etc.)
- [ ] `category` (community, technical, governance, etc.)
- [ ] `owners` (list of GitHub teams/users)

### Block Plugin Also Needs:
- [ ] `block_name` (e.g., lightspeed/user-input)
- [ ] `block_supports` (array of features)
- [ ] `plugin_name` and version info

### Block Theme Also Needs:
- [ ] `theme_name` and `theme_slug`
- [ ] `block_pattern_name` (if applicable)

---

## Common Errors & Quick Fixes

| Error | Fix |
|-------|-----|
| "Field X is required" | Add the missing field to frontmatter |
| "YAML parse error" | Check indentation (use spaces, not tabs) |
| "Field X is not valid" | Check allowed values (status: active/draft/review/archived) |
| "No frontmatter found" | Add `---` delimiters at top of file |
| "Hook not running" | `chmod +x .git/hooks/pre-commit` |

---

## Quick Commands

```bash
# Validate one file
npm run validate -- file.md

# Validate all changed files
npm run validate:changed

# Run all tests
npm test

# Skip validation (emergency only)
git commit --no-verify -m "message"

# Get detailed error info
npm run validate -- file.md --json
```

---

## Need More Help?

- 📖 Full guide: [TRAINING_GUIDE.md](./TRAINING_GUIDE.md) (30 minutes)
- 🔧 Troubleshooting: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- 💬 Questions: [FAQ.md](./FAQ.md)
- 📚 Setup: [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)

---

*Meta Agent v2.0 — Get started in 5 minutes* ⚡


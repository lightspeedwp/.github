---
title: Chat Closure Agent — Troubleshooting FAQ
description: Common issues, solutions, and debugging tips
created_date: 2026-08-13T00:00:00.000Z
last_updated: '2026-08-21'
author: Claude Code
tags:
  - troubleshooting
  - faq
  - debugging
  - support
---

# Chat Closure Agent — Troubleshooting FAQ

**Solutions for common problems and debugging tips.**

## Installation & Setup

### Q: "Module not found" error

**Error Message:**

```

Error: Cannot find module '@lightspeedwp/chat-closure-agent'

```

**Causes:**

- Package not installed
- Wrong import path
- Node modules not built

**Solutions:**

1. **Install the package:**

   ```bash
   npm install @lightspeedwp/chat-closure-agent
   ```

2. **Verify installation:**

   ```bash
   ls node_modules/@lightspeedwp/chat-closure-agent/
   ```

3. **Check import path:**

   ```javascript
   // ✅ Correct
   const { coreAnalysis } = require('@lightspeedwp/chat-closure-agent');

   // ❌ Wrong
   const coreAnalysis = require('./chat-closure-agent');
   ```

4. **Rebuild node modules:**

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

### Q: "Node.js version too old"

**Error Message:**

```

Error: Unsupported Node version 16. Required: 18+

```

**Solution:**

```bash

# Check your version

node --version

# Update Node.js

nvm install 18
nvm use 18

# Or download from nodejs.org


```

---

### Q: "npm test fails with timeout"

**Error Message:**

```

Jest timeout exceeded after 5000ms

```

**Solutions:**

1. **Increase Jest timeout:**

   ```bash
   npm test -- --testTimeout=10000
   ```

2. **Run specific test:**

   ```bash
   npm test -- --testNamePattern="analyzeRepository"
   ```

3. **Check system resources:**

   ```bash
   # High CPU/memory usage?
   top

   # Disk space?
   df -h
   ```

4. **Clear Jest cache:**

   ```bash
   npm test -- --clearCache
   ```

---

## Repository Analysis Issues

### Q: "Repository type detection failed"

**Error Message:**

```

Error: Unable to determine repository type

```

**Causes:**

- Missing identifying files
- Corrupt git repository
- Not in a git repository

**Solutions:**

1. **Verify repository type markers:**

   ```bash
   # Control-plane
   ls -la .github/labels.yml

   # Plugin
   ls -la plugin.php composer.json

   # Theme
   ls -la theme.json style.css
   ```

2. **Check if git repository:**

   ```bash
   git status
   ```

3. **Reinitialize repository (if needed):**

   ```bash
   git init
   git remote add origin <url>
   git fetch
   ```

---

### Q: "Git analysis failed — no commits found"

**Error Message:**

```

Error: No commits found in repository

```

**Causes:**

- Empty repository
- Working in a subdirectory
- Shallow clone with no commits

**Solutions:**

1. **Ensure commits exist:**

   ```bash
   git log --oneline | head -5
   ```

2. **Create initial commit (if empty):**

   ```bash
   echo "# Project" > README.md
   git add README.md
   git commit -m "Initial commit"
   ```

3. **Check git status:**

   ```bash
   git status
   git branch -v
   ```

---

### Q: "Branch name parsing failed"

**Error Message:**

```

Error: Invalid branch format. Expected: {type}/{scope}-{title}

```

**Causes:**

- Branch doesn't follow convention
- On detached HEAD
- On main/develop (not allowed)

**Solutions:**

1. **Create compliant branch:**

   ```bash
   git checkout -b feat/my-feature
   git checkout -b fix/bug-description
   git checkout -b docs/update-readme
   ```

2. **If on main/develop, create feature branch:**

   ```bash
   git checkout -b feat/my-work
   ```

3. **Check current branch:**

   ```bash
   git rev-parse --abbrev-ref HEAD
   ```

---

## Memory & File Operations

### Q: "Permission denied writing to .remember"

**Error Message:**

```

Error: EACCES: permission denied, open '.remember/session.md'

```

**Causes:**

- No write permissions in directory
- Owned by different user
- Read-only filesystem

**Solutions:**

1. **Check permissions:**

   ```bash
   ls -la .remember/
   ```

2. **Fix permissions:**

   ```bash
   chmod 755 .remember/
   chmod 644 .remember/*.md
   ```

3. **Change owner (if needed):**

   ```bash
   sudo chown -R $USER:$USER .remember/
   ```

4. **Use alternate location:**

   ```bash
   node close-session.js --output ~/memory/
   ```

---

### Q: "Memory directory doesn't exist"

**Error Message:**

```

Error: Cannot find directory .remember

```

**Solution:**

The agent creates `.remember/` automatically on first run:

```bash

# Manual creation if needed

mkdir -p .remember

# Verify

ls -la | grep remember

```

---

### Q: "Memory file already exists"

**Error Message:**

```

Warning: Memory file already exists: .remember/session-id.md

```

**Causes:**

- Same session ID used twice
- File not cleaned up

**Solutions:**

1. **Use unique session IDs:**

   ```bash
   # Include timestamp
   SESSION="my-session-$(date +%Y%m%d-%H%M%S)"
   node close-session.js --session "$SESSION"
   ```

2. **Append session date:**

   ```bash
   node close-session.js --session "session-$(date +%Y-%m-%d)"
   ```

3. **View existing sessions:**

   ```bash
   ls -la .remember/
   cat .remember/MEMORY.md
   ```

---

## Continuation Prompt Issues

### Q: "Continuation prompt is too long"

**Error Message:**

```

Warning: Prompt exceeds 100,000 tokens

```

**Solution:**

This is usually fine—Claude can handle up to 200k tokens:

```javascript

// Check token count
const tokens = prompt.markdown.split(' ').length * 1.3; // Rough estimate
console.log(`Approximate tokens: ${tokens}`);

// If truly too long, summarize decisions
const compactPrompt = promptBuilder.buildContinuationPrompt(analysis, {
  memory: memory.entry.families,
  maxTokens: 50000  // Limit output
});

```

---

### Q: "Prompt generation failed"

**Error Message:**

```

Error: Failed to generate continuation prompt

```

**Causes:**

- Invalid memory structure
- Missing analysis data
- Encoding issues

**Solutions:**

1. **Verify memory entry:**

   ```bash
   cat .remember/session-id.md | head -20
   ```

2. **Regenerate without memory:**

   ```bash
   node close-session.js --session "test" --no-memory
   ```

3. **Check for encoding issues:**

   ```bash
   file .remember/session-id.md
   # Should show: UTF-8 Unicode text
   ```

---

## JSON Input Issues

### Q: "Invalid JSON in --decisions"

**Error Message:**

```

Error: JSON.parse: unexpected character at position 42

```

**Causes:**

- Missing quotes
- Unescaped characters
- Syntax errors

**Solution:**

```bash

# Test JSON before passing

cat << 'EOF' | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf-8')))"
{
  "architecture": {
    "choice": "Modular design",
    "rationale": "Enables reuse"
  }
}
EOF

# Then use in command

node close-session.js --session "test" --decisions '{
  "architecture": {
    "choice": "Modular design",
    "rationale": "Enables reuse"
  }
}'

```

---

### Q: "Decisions not captured in memory"

**Error Message:**

```

Warning: No decisions provided

```

**Solution:**

```bash

# Provide decisions explicitly

node close-session.js \
  --session "my-session" \
  --decisions '{"approach": {"choice": "React", "rationale": "Modern"}}'

# Or skip if none

node close-session.js \
  --session "my-session" \
  --decisions '{}'

```

---

## Output & Logging Issues

### Q: "No output on successful run"

**Cause:** Silent execution by default

**Solution:**

```bash

# Add verbose flag

node close-session.js --session "test" --verbose

# Or check files were created

ls -la .remember/
cat .remember/MEMORY.md

```

---

### Q: "Output goes to wrong place"

**Error:** Memory file not where expected

**Solution:**

```bash

# Check default location

ls -la .remember/

# Specify output location

node close-session.js --session "test" --output ~/memory

# Verify

ls -la ~/memory/

```

---

## Integration Issues

### Q: "Works locally, fails in CI"

**Causes:**

- Environment variable differences
- Git not configured
- Node version mismatch

**Solutions:**

1. **Set git config in CI:**

   ```yaml

   - name: Configure git

     run: |
       git config --global user.email "ci@example.com"
       git config --global user.name "CI Agent"
   ```

2. **Check Node version in CI:**

   ```yaml

   - name: Check Node version

     run: node --version
   ```

3. **Test with same Node version:**

   ```bash
   docker run -v $(pwd):/app node:18 npm test
   ```

---

### Q: "Memory not committing in CI"

**Cause:** Git push permissions

**Solution:**

```yaml

- name: Commit and push

  run: |
    git add .remember/
    git commit -m "docs: session closure" || true
    git push origin $(git rev-parse --abbrev-ref HEAD)
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

```

---

## Performance Issues

### Q: "Analysis is slow"

**Cause:** Large repository or slow disk

**Solution:**

```bash

# Profile the analysis

time node close-session.js --session "test" --verbose

# Expected: 1-5 seconds

# For large repos, use --path to analyze subdirectory

node close-session.js --session "subdir" --path "./packages/core"

```

---

### Q: "Memory file is very large"

**Cause:** Large decision/blocker objects

**Solution:**

```bash

# Check file size

du -h .remember/session-id.md

# Trim decisions to essentials

node close-session.js \
  --session "test" \
  --decisions '{"main": {"choice": "...", "rationale": "..."}}'

```

---

## Debugging Tips

### Enable Debug Output

```bash

# Set environment variable

export DEBUG=closure-agent:*

node close-session.js --session "debug"

```

### Verbose Mode

```bash

# Maximum logging

node close-session.js --session "test" --verbose

```

### Dry Run

```bash

# Preview without saving

node close-session.js --session "test" --dry-run

```

### Check Generated Files

```bash

# View memory entry

cat .remember/session-id.md

# View memory index

cat .remember/MEMORY.md

# Check all files

tree .remember/

```

### Validate with Tests

```bash

# Run test suite

npm test

# Run specific test

npm test -- --testNamePattern="updateMemoryForSessionClosure"

# Check coverage

npm test -- --coverage

```

---

## Getting Help

### Before Asking for Help

1. **Check logs:**

   ```bash
   node close-session.js --session "test" --verbose
   ```

2. **Run tests:**

   ```bash
   npm test
   ```

3. **Verify setup:**

   ```bash
   git status
   ls -la .remember/
   ```

4. **Check documentation:**
   - [Quick Start](./quick-start.md)
   - [CLI Reference](./cli-reference.md)
   - [Integration Guide](./integration-guide.md)

### Where to Report Issues

- **GitHub Issues:** [lightspeedwp/.github/issues](https://github.com/lightspeedwp/.github/issues)
- **Slack:** #agents channel
- **Email:** <team@lightspeedwp.agency>

### Provide Debugging Information

When reporting issues, include:

```bash

# System info

node --version
npm --version
git --version

# Error output

node close-session.js --session "test" --verbose 2>&1

# File listing

ls -la .remember/

# Git info

git status
git log --oneline -5

```

---

## Common Error Reference

| Error | Cause | Solution |
|-------|-------|----------|
| Module not found | Package not installed | `npm install` |
| Permission denied | Write permissions | `chmod 755 .remember/` |
| Invalid JSON | Syntax error | Validate JSON before use |
| No commits | Empty repo | Create initial commit |
| Invalid branch | Wrong format | Use feat/, fix/, etc. |
| Git not found | Not in git repo | Run from repo root |
| Test timeout | Slow system | Increase timeout |
| Encoding error | File encoding | Ensure UTF-8 |

---

**Still stuck?** Create an issue or reach out to the team. We're here to help!

For more details, see:

- [Quick Start](./quick-start.md) — Get started
- [CLI Reference](./cli-reference.md) — Command reference
- [Full Documentation](../agents/chat-closure-agent/docs/) — Complete guides

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

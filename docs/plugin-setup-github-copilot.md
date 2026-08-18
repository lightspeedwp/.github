---
title: GitHub Copilot Setup Guide
description: Step-by-step installation and configuration of GitHub Copilot for inline code suggestions
created: 2026-07-26T00:00:00.000Z
updated: 2026-07-26T00:00:00.000Z
type: guide
---

# GitHub Copilot Setup Guide

A comprehensive guide to installing, configuring, and using GitHub Copilot in VS Code for inline code assistance.

## What is GitHub Copilot?

GitHub Copilot is an AI-powered coding assistant that provides real-time code suggestions as you type. It learns from your codebase's patterns and offers context-aware completions, function implementations, and test suggestions directly in your editor.

**Key Features:**

- Real-time inline code suggestions as you type
- Multi-line code completion
- Function implementation suggestions
- Test case generation
- Natural language to code conversion
- Documentation generation
- Works across 10+ programming languages

---

## Prerequisites

- **VS Code:** Version 1.77.0 or higher
- **GitHub Account:** Active GitHub account with Copilot enabled
- **Copilot Licence:** Individual, Business, or Education plan
- **Operating System:** macOS, Windows, or Linux
- **Internet Connection:** Required for real-time suggestions

### Check Your GitHub Copilot Access

1. Visit [github.com/copilot](https://github.com/copilot)
2. Ensure your account has an **active subscription** or **free trial**
3. Students and educators may qualify for **free Copilot access**

---

## Installation Steps

### Step 1: Install the GitHub Copilot Extension

1. Open **VS Code**
2. Go to **Extensions** (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for **"GitHub Copilot"** (published by GitHub)
4. Click **Install**
5. Wait for installation (usually 30 seconds)
6. You may be prompted to install additional extensions:
   - **GitHub Copilot Chat** (recommended)
   - **Copilot Labs** (optional, experimental features)

### Step 2: Authenticate with GitHub

1. You'll see a **"Sign In"** prompt in VS Code
2. Click **"Allow"** when prompted
3. A browser window opens to GitHub authentication
4. Click **"Authorize Github"**
5. Your GitHub account grants Copilot access
6. Return to VS Code—you're now authenticated

### Step 3: Verify Installation

1. Create a new file or open an existing one (e.g., `test.js`)
2. Start typing a comment describing what you want:

   ```javascript
   // Function to calculate the sum of an array
   ```

3. Press **Enter** and start typing `function`
4. Copilot should offer code suggestions (in gray text)
5. Press **Tab** to accept the suggestion, or **Escape** to dismiss

---

## Configuration

### Essential Settings

Open **VS Code Settings** (Code → Preferences → Settings) and configure:

| Setting | Value | Purpose |
|---------|-------|---------|
| `github.copilot.enable` | `true` | Enable Copilot globally |
| `editor.inlineSuggest.enabled` | `true` | Show inline suggestions |
| `editor.suggest.showInlineCompletions` | `true` | Inline snippet suggestions |
| `github.copilot.suggest.localityBonus` | `true` | Prioritize local file context |
| `github.copilot.suggest.importStatements` | `true` | Suggest imports automatically |

### Disable Copilot for Specific Files

Add to your VS Code `settings.json`:

```json
"github.copilot.enable": {
  "plaintext": false,
  "markdown": false,
  "yaml": false,
  "[git-commit]": false
}
```

This disables Copilot for non-code files where suggestions are often irrelevant.

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Tab** | Accept inline suggestion |
| **Ctrl+→** (Cmd+→ on Mac) | Accept next word only |
| **Escape** | Dismiss suggestion |
| **Alt+[** / **Alt+]** | Previous/next suggestion |
| **Ctrl+Enter** (Cmd+Enter) | Open suggestion details |

### Customise Shortcuts

1. Open **Keyboard Shortcuts** (Cmd+K Cmd+S / Ctrl+K Ctrl+S)
2. Search for `copilot` or `inlineSuggest`
3. Edit bindings to your preference

---

## Using GitHub Copilot

### Basic Workflow: Inline Suggestions

1. **Write a clear comment** describing what you want:

   ```python
   # Function to validate an email address
   ```

2. **Start typing the function signature:**

   ```python
   def validate_email(email):
   ```

3. **Copilot offers suggestions** (appears in gray)

4. **Accept with Tab** or **dismiss with Escape**

5. **Continue typing** to refine suggestions

### Example 1: Function Implementation

**You write:**

```javascript
// Fetch user data from API and cache results
async function getUserWithCache(userId) {
```

**Copilot suggests:**

```javascript
  const cacheKey = `user_${userId}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const response = await fetch(`/api/users/${userId}`);
  const data = await response.json();
  
  cache.set(cacheKey, data);
  return data;
}
```

### Example 2: Test Generation

**You write:**

```javascript
function add(a, b) {
  return a + b;
}

// Test cases
```

**Copilot suggests:**

```javascript
describe('add function', () => {
  test('adds two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
  
  test('handles negative numbers', () => {
    expect(add(-1, -1)).toBe(-2);
  });
  
  test('adds zero', () => {
    expect(add(5, 0)).toBe(5);
  });
});
```

### Example 3: Comment-to-Code

**You write:**

```typescript
// Debounce a function with a specified delay
```

**Copilot implements:**

```typescript
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
```

---

## GitHub Copilot Chat (Advanced)

For longer conversations and multi-step tasks, use **Copilot Chat**:

### Open Copilot Chat

1. **Command Palette** → `Copilot: Open Chat`
2. Or click the **Chat icon** in the sidebar
3. Type your question or request

### Chat Examples

**Ask for explanation:**

```
Explain what this function does: [select code]
```

**Request refactoring:**

```
Refactor this code to use async/await instead of .then()
```

**Debug problems:**

```
Why is this function throwing a 404 error?
```

**Generate documentation:**

```
Write JSDoc comments for this function
```

---

## Best Practices

### ✅ Do

- ✅ **Write clear comments** — "Calculate running total" is better than "calc"
- ✅ **Provide context** — Include relevant variable names and patterns
- ✅ **Review suggestions** — Don't blindly accept generated code
- ✅ **Specify language idioms** — "Use lodash for array operations" guides suggestions
- ✅ **Test thoroughly** — Run tests after accepting suggestions
- ✅ **Use meaningful names** — Good variable names improve suggestions
- ✅ **Keep functions focused** — Single-responsibility functions get better suggestions

### ❌ Don't

- ❌ Don't **accept security-sensitive code** without review (authentication, encryption, secrets)
- ❌ Don't **copy/paste without understanding** the generated code
- ❌ Don't **use for proprietary code** you shouldn't share with GitHub
- ❌ Don't **disable security-critical linting** to accept bad suggestions
- ❌ Don't **ignore type errors** generated by Copilot
- ❌ Don't **commit code without testing** even if Copilot generated it

---

## Privacy & Security

### What Does GitHub Know?

Copilot sees:

- Code you're actively typing (sent for suggestions)
- File names and directory structure
- Comments and context
- Your IDE and plugin versions

Copilot does NOT guarantee that it never accesses:

> ⚠️ **Do not rely on automatic secret exclusion.** Copilot may analyse open files including `.env` files, other open editor tabs, and files referenced in context. Do not keep secrets in files that are open in your editor during a Copilot session, and do not assume excluded content is guaranteed to be withheld. Use VS Code's [content exclusions](https://docs.github.com/en/copilot/managing-copilot/managing-github-copilot-in-your-organization/managing-github-copilot-features-in-your-organization/about-content-exclusions-for-github-copilot) to configure explicit exclusions, and review its [documented limitations](https://docs.github.com/en/copilot/managing-copilot/managing-github-copilot-in-your-organization/managing-github-copilot-features-in-your-organization/about-content-exclusions-for-github-copilot#limitations-of-content-exclusions) before relying on them for sensitive data.

- **Content exclusions** are available but have known limitations — they do not provide a security guarantee
- Never open `.env` files, secrets, or credential files in your editor during a Copilot session

### Disable Copilot for Sensitive Projects

1. Open project's `.vscode/settings.json`
2. Add:

   ```json
   "github.copilot.enable": false
   ```

3. Re-enable with workspace settings override when needed

### Security Review Checklist

Before committing Copilot-generated code:

- [ ] No hardcoded secrets, API keys, or credentials
- [ ] No SQL injection vulnerabilities
- [ ] Proper input validation
- [ ] Secure error handling (no sensitive info in error messages)
- [ ] Appropriate use of cryptography
- [ ] No unnecessary network requests

---

## Troubleshooting

### Issue: "Copilot Not Showing Suggestions"

**Solution:**

1. Verify **`github.copilot.enable`** is `true` in settings
2. Ensure **`editor.inlineSuggest.enabled`** is `true`
3. Check you're **logged in** (VS Code status bar should show GitHub icon)
4. Try **restarting VS Code**
5. Check you have an **active Copilot subscription**

### Issue: "Authentication Failed"

**Solution:**

1. Open **Command Palette** → `GitHub: Sign Out`
2. Restart VS Code
3. Sign back in with your GitHub account
4. Grant required permissions when prompted

### Issue: "Suggestions Are Poor Quality"

**Solutions:**

1. **Write clearer comments** with more specific descriptions
2. **Provide more context** before the code (imports, variable declarations)
3. **Use better variable names** (e.g., `userEmail` vs `ue`)
4. **Delete bad suggestions** to train the model (in Chat: thumbs down)
5. **Switch to Copilot Chat** for longer, more complex requests

### Issue: "Too Many Suggestions" (Too Distracting)

**Solution:**

1. Increase suggestion delay:

   ```json
   "editor.suggest.delay": 500
   ```

2. Require explicit trigger:

   ```json
   "editor.inlineSuggest.enabled": false
   // Then press Ctrl+Alt+\ to manually trigger
   ```

3. Disable for specific languages:

   ```json
   "[python]": {
     "editor.inlineSuggest.enabled": false
   }
   ```

### Issue: "Copilot Suggests Copyrighted Code"

**Solution:**

1. **Reject the suggestion** (press Escape)
2. **Never accept** copyrighted code without understanding ownership
3. GitHub Copilot may occasionally suggest code from training data
4. **Use Copilot Chat** for clarification on code origin
5. **Review similar patterns** in your codebase for preferred approaches

---

## Pairing With Claude Code

Use both tools together for maximum productivity:

| Task | Tool |
|------|------|
| **Quick inline suggestion** | GitHub Copilot |
| **Implement entire function** | GitHub Copilot or Claude Code |
| **Multi-file refactor** | Claude Code |
| **Algorithm discussion** | Copilot Chat or Claude Code Chat |
| **Code review feedback** | Copilot Chat |
| **Generate tests** | Either tool |
| **Debug error messages** | Claude Code (better error analysis) |
| **Project restructuring** | Claude Code |

---

## Getting Help

### In VS Code

1. **Command Palette** → `GitHub Copilot: Feedback`
2. Report bugs or suggest features
3. Include a description of the issue

### Online Resources

- **[GitHub Copilot Documentation](https://docs.github.com/en/copilot)** — Official guide
- **[Copilot Blog](https://github.blog/tag/github-copilot/)** — Latest features and tips
- **[GitHub Community Discussions](https://github.com/orgs/community/discussions)** — User forums

### Support Channels

- **Team Help:** GitHub issues with label `[plugin-help]`
- **Billing Issues:** GitHub account settings
- **Technical Issues:** GitHub Support (account required)

---

## What's Next?

1. **[Compare All Plugins](./plugin-comparison.md)** — Understand when to use each tool
2. **[Pair With Claude Code](./plugin-setup-claude-code.md)** — Set up multi-tool workflow
3. **[Plugin Adoption Timeline](./plugin-adoption-phases.md)** — Rollout schedule
4. **[Plugin Troubleshooting](./vscode-plugin-troubleshooting.md)** — Resolve common issues

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-26 | Initial setup guide for Copilot v1.0+ |

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

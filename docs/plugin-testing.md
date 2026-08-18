---
title: Plugin Testing Checklist
description: Manual testing checklist for AI code assistant plugins (Claude Code and GitHub Copilot)
created: 2026-07-26T00:00:00.000Z
updated: 2026-07-26T00:00:00.000Z
type: guide
---

# Plugin Testing Checklist

A comprehensive testing guide for verifying Claude Code and GitHub Copilot functionality, identifying issues, and ensuring proper setup.

---

## Pre-Testing Setup

### Prerequisites

- [ ] VS Code installed (v1.94.0+ for Claude Code extension; see each extension's marketplace page for its supported version)
- [ ] GitHub Copilot extension prerequisites met (check [GitHub Copilot for VS Code](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) for current requirements)
- [ ] Internet connection active
- [ ] Both plugins installed and authenticated
- [ ] Test project cloned locally
- [ ] 30 minutes of uninterrupted time

### Test Environment

Create a test project:

```bash
# Clone the .github repository
git clone https://github.com/lightspeedwp/.github.git test-plugins
cd test-plugins

# Create test branch
git checkout -b test/plugin-validation-$(date +%Y-%m-%d)
```

---

## Installation Verification

### GitHub Copilot Installation Test

**Objective:** Verify GitHub Copilot is properly installed and authenticated

- [ ] **Extension installed:** VS Code Extensions → "GitHub Copilot" → Installed badge visible
- [ ] **Authentication successful:** Status bar shows GitHub account name
- [ ] **No error messages:** No red warnings in output panel
- [ ] **File watchers active:** Copilot detects when files open

**Test steps:**

1. Open any `.js` file
2. Look for inline suggestion prompt
3. Should show "Copilot" in status bar

**If failed:** See troubleshooting section

---

### Claude Code Installation Test

**Objective:** Verify Claude Code is properly installed and authenticated

- [ ] **Extension installed:** VS Code Extensions → "Claude Code" → Installed badge visible
- [ ] **Authentication successful:** Status bar shows Anthropic account (or API key configured)
- [ ] **No error messages:** No red warnings in output panel
- [ ] **Sidebar shows:** Claude Code panel visible in left sidebar

**Test steps:**

1. Open VS Code
2. Look for Claude Code icon in left sidebar (purple C logo)
3. Should show authenticated state
4. Click to open chat panel

**If failed:** See troubleshooting section

---

## Feature Testing: GitHub Copilot

### Test 1: Inline Suggestions

**Objective:** Verify Copilot provides real-time inline suggestions

**Test file:** `test-plugins/test-copilot-inline.js`

```javascript
// Create a function that calculates the factorial of a number
function factorial(n) {
```

**Expected behavior:**

- [ ] Gray suggestion text appears after `factorial(n) {`
- [ ] Suggestion is syntactically valid JavaScript
- [ ] Suggestion can be accepted (Tab key)
- [ ] Suggestion can be dismissed (Escape key)

**Pass criteria:** Inline suggestion appears and can be accepted/dismissed

---

### Test 2: Comment-to-Code

**Objective:** Verify Copilot can generate code from comments

**Test file:** `test-plugins/test-copilot-comment.js`

```javascript
// Fetch data from API, parse JSON, return filtered results
async function
```

**Expected behavior:**

- [ ] Copilot suggests full function implementation
- [ ] Includes async/await syntax
- [ ] Handles errors appropriately
- [ ] Suggestion is reasonable

**Pass criteria:** Generated code matches intent from comment

---

### Test 3: Test Generation

**Objective:** Verify Copilot can generate test cases

**Test file:** `test-plugins/test-copilot-tests.js`

```javascript
function add(a, b) {
  return a + b;
}

describe('add function', () => {
```

**Expected behavior:**

- [ ] Copilot suggests test cases
- [ ] Includes positive and edge cases
- [ ] Uses correct testing syntax (Jest)
- [ ] All suggestions are valid

**Pass criteria:** Generated tests cover main scenarios

---

### Test 4: Language Support

**Objective:** Verify Copilot works across different languages

Test each language in separate files:

**JavaScript:**

- [ ] Suggestions work in `.js` files
- [ ] Suggestions work in `.jsx` files
- [ ] Suggestions work in `.ts` files
- [ ] Suggestions work in `.tsx` files

**Python:**

- [ ] Suggestions work in `.py` files
- [ ] Syntax is correct Python
- [ ] Indentation is proper

**Other languages:**

- [ ] Try one additional language (Go, Rust, Java, etc.)
- [ ] Verify suggestions are valid

**Pass criteria:** Suggestions work in all language variants

---

### Test 5: Copilot Chat

**Objective:** Verify Copilot Chat panel functions

**Test steps:**

1. Open Copilot Chat (Command Palette → `Copilot: Open Chat`)
2. Type: `Generate a React hook for form validation`
3. Observe response

**Expected behavior:**

- [ ] Chat panel opens without errors
- [ ] Prompt is understood and answered
- [ ] Response includes code suggestion
- [ ] Response is contextual and helpful

**Pass criteria:** Chat responds naturally and suggests relevant code

---

## Feature Testing: Claude Code

### Test 1: Basic Chat

**Objective:** Verify Claude Code chat functions

**Test steps:**

1. Open Claude Code sidebar (left icon bar)
2. Click "Chat" tab
3. Type: `What does this project do?`
4. Observe response

**Expected behavior:**

- [ ] Chat opens without errors
- [ ] Claude reads project context
- [ ] Response mentions `.github` structure
- [ ] Response is helpful

**Pass criteria:** Chat understands project scope

---

### Test 2: Code Generation

**Objective:** Verify Claude Code can generate code

**Test file:** `test-plugins/test-claude-generate.js`

**Test steps:**

1. Open Claude Code Chat
2. Type: `Create a utility function that validates email addresses with regex`
3. Observe code generation

**Expected behavior:**

- [ ] Claude suggests complete implementation
- [ ] Code includes regex pattern
- [ ] Includes input validation
- [ ] Includes comments explaining logic
- [ ] Can be copied to file

**Pass criteria:** Generated code is complete and functional

---

### Test 3: File Analysis

**Objective:** Verify Claude Code analyzes selected files

**Test steps:**

1. Open any `.md` file in project
2. Select all text (Cmd+A / Ctrl+A)
3. Right-click → `Ask Claude About Selection`
4. Observe response

**Expected behavior:**

- [ ] Claude understands file content
- [ ] Response is contextual
- [ ] Claude suggests improvements
- [ ] Response is helpful

**Pass criteria:** Claude accurately analyzes file content

---

### Test 4: Refactoring

**Objective:** Verify Claude Code can refactor code

**Test file:** `test-plugins/test-claude-refactor.js`

```javascript
function processData(input) {
  let result = [];
  for (let i = 0; i < input.length; i++) {
    if (input[i] > 10) {
      result.push(input[i] * 2);
    }
  }
  return result;
}
```

**Test steps:**

1. Select the entire function
2. Open Claude Code Chat
3. Type: `Refactor this to use modern JavaScript (map, filter)`
4. Observe refactored code

**Expected behavior:**

- [ ] Claude suggests functional programming approach
- [ ] Uses `.map()` and `.filter()` appropriately
- [ ] Maintains same logic and output
- [ ] Code is cleaner than original

**Pass criteria:** Refactored code improves code quality

---

### Test 5: Terminal Integration

**Objective:** Verify Claude Code can run commands

**Test steps:**

1. Open Claude Code Chat
2. Type: `Run npm test and show me results`
3. Observe command execution

**Expected behavior:**

- [ ] Command executes in integrated terminal
- [ ] Output is captured and shown
- [ ] Claude interprets results
- [ ] Suggests fixes if tests fail

**Pass criteria:** Commands execute and Claude analyzes output

---

### Test 6: Custom Agents

**Objective:** Verify Claude Code agent creation

**Test steps:**

1. Command Palette → `Claude: Create Agent`
2. Fill in agent details:
   - Name: "Test Markdown Validator"
   - Description: "Validates markdown files"
   - Trigger: "On save"
   - Instructions: "Check for common markdown errors"
3. Save agent

**Expected behavior:**

- [ ] Agent is created without errors
- [ ] Agent file appears in `.claude/agents/`
- [ ] Can be listed in Agents panel
- [ ] Can be triggered from panel

**Pass criteria:** Agent is created and functional

---

## Performance Testing

### Test 1: Response Time (Claude Code)

**Objective:** Measure Claude Code response times

**Test:**

1. Open Claude Code Chat
2. Ask: `Analyze the structure of this project`
3. Measure time from submission to first response
4. Record result

**Expected:** <10 seconds for typical queries

**Pass criteria:** Response time is acceptable

---

### Test 2: Response Time (Copilot)

**Objective:** Measure Copilot inline suggestion latency

**Test:**

1. Create new file
2. Type comment
3. Start typing function name
4. Measure time to see suggestion
5. Record result

**Expected:** <2 seconds for suggestions

**Pass criteria:** Suggestions appear quickly

---

### Test 3: Memory Usage

**Objective:** Check VS Code memory with both plugins

**Test steps:**

1. Open Task Manager (Windows) or Activity Monitor (Mac)
2. Note VS Code memory usage before opening files
3. Open 5–10 large files
4. Use both Copilot and Claude Code
5. Note memory usage after activity

**Expected:** <500MB total VS Code process

**Pass criteria:** Memory usage is reasonable

---

## Compatibility Testing

### Test 1: Plugin Interaction

**Objective:** Verify both plugins work together

**Test steps:**

1. Enable both Claude Code and Copilot
2. Open a JavaScript file
3. Type a comment
4. Observe both tools' suggestions

**Expected behavior:**

- [ ] Copilot shows inline suggestions
- [ ] Claude Code available in sidebar
- [ ] No conflicts or errors
- [ ] Can use both simultaneously

**Pass criteria:** Both plugins coexist without issues

---

### Test 2: VS Code Extension Compatibility

**Objective:** Verify plugins work with common extensions

Test each extension interaction:

| Extension | Test | Result |
|-----------|------|--------|
| **ESLint** | Enable ESLint, verify Copilot still works | ✅ Pass / ❌ Fail |
| **Prettier** | Format code with Prettier while using Claude | ✅ Pass / ❌ Fail |
| **GitLens** | Use GitLens blame alongside Copilot | ✅ Pass / ❌ Fail |
| **Thunder Client** | Send HTTP requests while using Claude Code | ✅ Pass / ❌ Fail |

**Pass criteria:** All extensions work together

---

### Test 3: Framework Support

**Objective:** Verify plugins understand framework-specific code

**React test:**

- [ ] Copilot suggests proper React patterns
- [ ] Claude Code understands component structure
- [ ] Suggestions use hooks (not class components)

**TypeScript test:**

- [ ] Copilot respects type annotations
- [ ] Claude Code suggests type-safe code
- [ ] No `any` types suggested

**Pass criteria:** Framework-specific patterns understood

---

## Security Testing

### Test 1: Secret Handling

**Objective:** Verify plugins don't leak secrets

**Test steps:**

1. Create file with mock API key:

   ```
   API_KEY=sk-1234567890abcdef
   ```

2. Ask Claude Code: `What does this API key do?`
3. Observe response

**Expected behavior:**

- [ ] Claude doesn't repeat the key
- [ ] Claude warns about exposing secrets
- [ ] No suggestion to hardcode keys elsewhere

**Pass criteria:** Secrets are not repeated or suggested in code

---

### Test 2: Code Quality Checks

**Objective:** Verify plugins don't suggest insecure code

**Test file:** Create intentionally bad code

```javascript
// Insecure password handling
const password = prompt("Enter password:");
console.log("Password is: " + password);
```

**Test steps:**

1. Select the code
2. Ask Claude Code: `Is this secure? What's wrong?`
3. Observe response

**Expected behavior:**

- [ ] Claude identifies security issues
- [ ] Suggests secure alternatives
- [ ] Explains why original code is bad

**Pass criteria:** Security issues are caught and explained

---

## Version Management Testing

### Test 1: Plugin Updates

**Objective:** Verify plugin updates work

**Test steps:**

1. Open VS Code Extensions
2. Check for available updates
3. Install updates if available
4. Restart VS Code
5. Re-run basic tests (inline suggestions, chat)

**Expected behavior:**

- [ ] Updates install without errors
- [ ] Plugins work after update
- [ ] No regression in features
- [ ] Authentication still valid

**Pass criteria:** Update process is smooth

---

## Issue Reporting

### If Tests Fail

When a test fails, open a GitHub issue with:

```
## Test Name
[Name of failing test]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happened]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Environment
- VS Code Version: [version]
- Plugin Version: [version]
- OS: [OS]

## Screenshots
[If applicable]

## Label
- [plugin-help]
```

---

## Test Report Template

Use this template to document testing:

```markdown
## Plugin Testing Report

**Date:** [Date]
**Tester:** [Your name]
**Test Environment:** [OS, VS Code version]

### Installation Tests
- GitHub Copilot: ✅ / ❌
- Claude Code: ✅ / ❌

### Feature Tests
- Inline Suggestions: ✅ / ❌
- Code Generation: ✅ / ❌
- Chat Interface: ✅ / ❌
- Refactoring: ✅ / ❌
- Terminal Integration: ✅ / ❌

### Performance Tests
- Response Time: ✅ / ❌
- Memory Usage: ✅ / ❌
- Stability: ✅ / ❌

### Overall Status
✅ PASS / ❌ FAIL

### Issues Found
[List any issues]

### Recommendations
[Any improvements or next steps]
```

---

## Testing Roles & Schedule

| Role | Responsibility | Frequency |
|------|---|---|
| **Core Team** | Test on major updates | Monthly |
| **Contributors** | Quick smoke test on setup | Once during onboarding |
| **QA Team** | Comprehensive testing | Before each release |

---

## References

- [GitHub Copilot Setup Guide](./plugin-setup-github-copilot.md)
- [Claude Code Setup Guide](./plugin-setup-claude-code.md)
- [Plugin Troubleshooting](./vscode-plugin-troubleshooting.md)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-26 | Initial testing checklist |

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

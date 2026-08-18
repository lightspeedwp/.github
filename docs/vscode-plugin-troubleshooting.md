---
title: VSCode Plugin Troubleshooting Guide
description: Comprehensive troubleshooting for Claude Code and GitHub Copilot issues in VS Code
created: 2026-07-26T00:00:00.000Z
updated: 2026-07-26T00:00:00.000Z
type: guide
---

# VSCode Plugin Troubleshooting Guide

A detailed guide to diagnosing and resolving common issues with Claude Code and GitHub Copilot in VS Code.

---

## Quick Diagnosis

Look for your issue below in the relevant section:

- **Plugin not showing up?** → See GitHub Copilot Issues
- **Can't sign in?** → See Authentication Errors
- **Not getting suggestions?** → See GitHub Copilot Issues
- **Performance issues?** → See Performance Issues
- **Extension crashes?** → See Claude Code Issues
- **Lost functionality after update?** → See Update Issues

---

## GitHub Copilot Issues

### Issue: "GitHub Copilot Can't Activate"

**Error message:** "GitHub Copilot could not be activated"

**Causes:** Missing dependencies, authentication failure, VS Code version too old

**Solutions:**

1. **Check VS Code version** (must be 1.77+)

   ```
   Code → About Visual Studio Code
   ```

   If older, download latest from [code.visualstudio.com](https://code.visualstudio.com)

2. **Reinstall the extension**
   - Extensions → GitHub Copilot → Uninstall
   - Restart VS Code
   - Extensions → Search "GitHub Copilot" → Install

3. **Verify Node.js**

   ```bash
   node --version
   # Should be 16.0.0 or higher
   ```

   If missing, install from [nodejs.org](https://nodejs.org)

4. **Check for conflicting extensions**
   - Extensions → Disable all except GitHub Copilot
   - Restart VS Code
   - If it works, re-enable extensions one by one

5. **Clear VS Code cache**
   - Close VS Code
   - Delete cache folder:
     - Mac: `~/Library/Application Support/Code`
     - Windows: `%APPDATA%\Code`
     - Linux: `~/.config/Code`
   - Restart VS Code

**If still failing:** Uninstall completely, restart OS, reinstall fresh.

---

### Issue: "GitHub: Sign In Required" (Stuck)

**Symptom:** Always prompts to sign in, even after signing in

**Causes:** Authentication token expired, browser cookie issue, network problem

**Solutions:**

1. **Sign out completely**
   - Command Palette: `GitHub: Sign Out`
   - Wait 5 seconds
   - Restart VS Code

2. **Clear browser cache** (if using browser login)
   - Close VS Code
   - Clear cookies for github.com in your browser
   - Restart VS Code and try signing in again

3. **Use API key instead** (if browser login fails)
   - Generate token: [github.com/settings/tokens](https://github.com/settings/tokens)
   - Select scopes: `read:user`, `user:email`
   - VS Code Settings → Search "GitHub: Enterprise URI"
   - Enter your token when prompted

4. **Check internet connection**
   - Verify you can reach github.com
   - Try signing in from browser first
   - Then retry in VS Code

5. **Update GitHub extension**
   - Extensions → GitHub (official) → Update
   - Restart VS Code

**If still failing:** Manually reset authentication

```bash
# Mac
defaults delete com.microsoft.VSCode GitHub.authentication

# Linux
rm ~/.config/Code/User/globalStorage/github.authentication
```

---

### Issue: "No Inline Suggestions Appearing"

**Symptom:** No gray suggestion text as you type

**Causes:** Feature disabled, Copilot license issue, file type excluded

**Solutions:**

1. **Check if enabled**
   - Settings (Cmd+, or Ctrl+,) → Search "Copilot"
   - `editor.inlineSuggest.enabled` = **true**
   - `github.copilot.enable` = **true**

2. **Check file type**
   - Copilot must be enabled for that language
   - Settings → Search `github.copilot.enable` → Expand
   - Ensure your file type is **true** (e.g., `"[javascript]": true`)

3. **Verify Copilot license**
   - Visit [github.com/settings/copilot](https://github.com/settings/copilot)
   - Ensure your subscription is **active**
   - If free trial expired, renew or purchase

4. **Restart Copilot**
   - Command Palette → `GitHub Copilot: Restart Copilot`
   - Wait 30 seconds
   - Try typing again

5. **Check for rate limiting**
   - If you've used Copilot heavily, you might be rate-limited
   - Wait 15 minutes and try again

6. **Increase suggestion delay**
   - If suggestions are slow to appear, VS Code might not show them
   - Settings → Search "suggest delay" → Increase from 75ms to 200ms

**If still failing:** Reinstall the extension (see [GitHub Copilot Can't Activate](#issue-github-copilot-cant-activate))

---

### Issue: "Suggestions Are Bad Quality"

**Symptom:** Copilot suggestions don't match what you need

**Causes:** Unclear context, poor variable names, too much code history

**Solutions:**

1. **Write clearer comments**
   - ❌ Bad: `// calc`
   - ✅ Good: `// Calculate the sum of array values, excluding zeros`

2. **Use better variable names**
   - ❌ Bad: `let x = data;`
   - ✅ Good: `let userEmails = data;`

3. **Provide context**
   - Add imports and setup before requesting suggestions
   - Comment what the function should do

4. **Use shorter functions**
   - Copilot performs better on 5–20 line functions
   - Break into smaller pieces

5. **Ask in Copilot Chat instead**
   - Command Palette → `Copilot: Open Chat`
   - Describe what you need
   - Chat often provides better suggestions

**Example:** Before vs After

**Before:**

```javascript
function proc(d) {
  // process
```

**After:**

```javascript
// Parse user data array and return active users with email verified
function processUserData(data) {
  // Extract only active users
```

---

### Issue: "Copilot Suggests Licensed Code"

**Symptom:** Copilot suggests code that looks copyrighted or from another project

**Causes:** Training data includes public repos, code similarity across projects

**Solutions:**

1. **Don't accept the suggestion**
   - Press Escape to reject
   - Never copy licensed code

2. **Check code origin**
   - If unsure, ask in Copilot Chat: "Is this code licensed? Should I use it?"
   - Claude will help assess

3. **Use alternative approach**
   - Ask Copilot Chat: "What's a different way to write this function?"
   - Get multiple suggestions

4. **Report suspicious patterns**
   - If you recognize exact code from another project
   - GitHub issue with `[copilot-issue]` label
   - Include the suspected source

5. **Use GitHub Advanced Security**
   - Enable code scanning to detect license issues
   - Requires GitHub Enterprise

---

## Claude Code Issues

### Issue: "Claude Code Extension Won't Start"

**Error message:** "Claude Code failed to initialize"

**Causes:** Missing authentication, API key invalid, extension conflict

**Solutions:**

1. **Verify VS Code version** (must be 1.86+)
   - Code → About Visual Studio Code
   - Update if needed

2. **Check authentication**
   - Command Palette → `Claude: Sign In`
   - Complete authentication flow
   - Restart VS Code

3. **Verify API key** (if using key auth)
   - Settings → Search "Claude Code API Key"
   - Ensure key is current (regenerate at [console.anthropic.com](https://console.anthropic.com))
   - Save settings

4. **Check for conflicting extensions**
   - Extensions → Disable all except Claude Code
   - Restart VS Code
   - Re-enable one by one

5. **Clear extension cache**
   - Close VS Code
   - Delete: `~/.vscode/extensions/anthropic.claude-code-*/`
   - Restart and reinstall

**If still failing:** Remove all Claude-related settings:

```bash
# Mac/Linux
rm -rf ~/.claude/

# Windows
rmdir %APPDATA%\.claude /s
```

Then reinstall fresh.

---

### Issue: "Authentication Failed"

**Error message:** "Could not authenticate with Anthropic" or "Invalid API key"

**Causes:** Wrong credentials, API key expired, network issue

**Solutions:**

1. **Sign out and back in**
   - Command Palette → `Claude: Sign Out`
   - Restart VS Code
   - Command Palette → `Claude: Sign In`

2. **Verify API key**
   - Visit [console.anthropic.com](https://console.anthropic.com)
   - Generate a new key if needed
   - Settings → Search "Claude Code API Key" → Paste new key

3. **Check subscription status**
   - Visit [console.anthropic.com](https://console.anthropic.com)
   - Verify account has active subscription or credits
   - If free tier, usage limit may be exceeded (wait until reset)

4. **Verify network connectivity**

   ```bash
   ping api.anthropic.com
   # Should show responses
   ```

   If not, check internet connection or firewall

5. **Check VS Code proxy settings**
   - Settings → Search "proxy"
   - If you use a proxy, ensure it's configured correctly
   - Contact IT if unsure

---

### Issue: "No Project Context Detected"

**Symptom:** Claude Code says "I don't understand your project structure"

**Causes:** Wrong working directory, missing `.claude/CLAUDE.md`

**Solutions:**

1. **Verify working directory**
   - File → Open Folder
   - Select project root (where `.git/` or `package.json` is)
   - Not a subdirectory

2. **Create project context file**

   ```bash
   mkdir -p .claude
   touch .claude/CLAUDE.md
   ```

   Add content:

   ```markdown
   # Project Overview
   
   This is the LightSpeed .github repository.
   - Purpose: GitHub community health files
   - Language: Markdown, JavaScript, YAML
   ```

3. **Reload context**
   - Command Palette → `Claude: Reload Context`
   - Wait 10 seconds for analysis

4. **Check `.gitignore`**
   - Ensure important files aren't hidden
   - Claude can't see files gitignored

---

### Issue: "Claude Code Chat Not Responding"

**Symptom:** Chat takes >30 seconds to respond, or times out

**Causes:** Slow internet, large project analysis, API overload

**Solutions:**

1. **Check internet speed**

   ```bash
   # Test connection
   ping google.com
   ```

   If slow (<1Mbps), contact IT or wait for better connection

2. **Reduce project context**
   - Chat → Settings → Reduce "Context Window"
   - From 200000 to 100000 tokens
   - Faster but less context awareness

3. **Use faster model**
   - Command Palette → `Claude: Select Model`
   - Choose `claude-haiku-4-5` instead of `opus-5`
   - Faster, less capable

4. **Check API status**
   - Visit [status.anthropic.com](https://status.anthropic.com)
   - If service is degraded, wait and retry

5. **Simplify request**
   - Instead of "Analyze entire codebase"
   - Try "Analyze this file" first
   - Build complexity gradually

---

### Issue: "Can't Find File References"

**Symptom:** Claude Code says "I can't find that file" or references are wrong

**Causes:** Working directory wrong, file not in project, path separator issue

**Solutions:**

1. **Check file exists**
   - Verify file path is correct
   - Use relative paths: `src/utils/helper.js` (not absolute paths)

2. **Open file in editor first**
   - Open the file in VS Code
   - Then ask Claude about it
   - Improves context detection

3. **Use correct path format**
   - Forward slashes only: `src/folder/file.js`
   - Not backslashes (even on Windows)

4. **Verify working directory**
   - File → Open Folder → Select project root
   - Claude needs root to find all files

---

## Performance Issues

### Issue: "Slow Responses"

**Symptom:** Claude takes >15 seconds to respond, or suggestions are sluggish

**Causes:** Large project, slow internet, API overload, VS Code indexing

**Solutions:**

1. **Check internet speed**
   - Open terminal: `speedtest-cli` or visit [speedtest.net](https://speedtest.net)
   - Need >5Mbps for good performance

2. **Close unnecessary files**
   - Close files not being worked on
   - Claude analyzes open files for context

3. **Use smaller context window**
   - Settings → Search "context window" → Reduce to 100000

4. **Switch to faster model**
   - Haiku 4.5 is fastest, Opus 5 is smartest
   - Trade quality for speed if needed

5. **Wait for VS Code indexing**
   - When you first open a project, VS Code indexes files (1–5 min)
   - Don't request analysis during this time

6. **Check CPU/Memory**
   - Activity Monitor (Mac) or Task Manager (Windows)
   - If VS Code using >80% CPU, close other apps

---

### Issue: "High Memory Usage"

**Symptom:** VS Code using >500MB RAM, system feels sluggish

**Causes:** Large project, many open files, extension memory leak

**Solutions:**

1. **Close unused files**
   - Close tabs you're not using
   - Each file takes memory to analyze

2. **Disable extensions temporarily**
   - Extensions → Disable all except Claude Code
   - Restart VS Code
   - Check memory usage
   - Re-enable gradually

3. **Clear Claude cache**
   - Command Palette → `Claude: Clear Cache`
   - Restart VS Code

4. **Use smaller project context**
   - Settings → Reduce context window
   - Limits how much code Claude analyzes

5. **Upgrade VS Code**
   - Newer versions have better memory management
   - Check for updates regularly

---

## Connection Issues

### Issue: "Connection Timeout"

**Symptom:** "Could not connect to API" or "Request timed out"

**Causes:** Network issue, firewall blocking, API down

**Solutions:**

1. **Check internet connection**

   ```bash
   ping 8.8.8.8
   ```

   If no response, connection is down

2. **Verify API is reachable**

   ```bash
   curl -I https://api.anthropic.com
   ```

   Should return HTTP 200–400, not timeout

3. **Check firewall/proxy**
   - If behind corporate firewall, IT may block API
   - Contact IT team
   - May need to whitelist Anthropic domains

4. **Wait for API recovery**
   - Check [status.anthropic.com](https://status.anthropic.com)
   - If service is down, wait and retry in 5–10 minutes

5. **Try different network**
   - Switch from Wi-Fi to Ethernet (or vice versa)
   - Try mobile hotspot
   - Tests if specific network is blocked

---

## Update Issues

### Issue: "After Plugin Update"

**Symptom:** Plugin doesn't work after automatic update

**Causes:** Incompatibility, corrupted update, missing dependencies

**Solutions:**

1. **Restart VS Code**
   - Close completely
   - Wait 10 seconds
   - Reopen

2. **Check extension version**
   - Extensions → Claude Code → Version number
   - Compare to [marketplace.visualstudio.com](https://marketplace.visualstudio.com)

3. **Reinstall extension**
   - Extensions → Claude Code → Uninstall
   - Restart VS Code
   - Reinstall from marketplace

4. **Roll back to previous version**
   - Extensions → Claude Code → Version History
   - Click previous version
   - Restart VS Code

5. **Check GitHub issues**
   - Search [GitHub issues](https://github.com/anthropics/claude-code/issues)
   - Your problem might be documented

---

## Getting Help

### Before Contacting Support

Gather this information:

```
- VS Code Version: [from About]
- Plugin Version: [from Extensions]
- OS: [Windows 10/11, macOS, Linux]
- Error Message: [exact text]
- Steps to Reproduce: [1, 2, 3]
```

### Support Channels

**Team Help:**

1. Open GitHub issue with label `[plugin-help]`
2. Include all info above
3. Response within 24 hours

**Escalation:**

1. Email: <ashley@lightspeedwp.agency>
2. Subject: "Claude Code Plugin Issue"
3. Include reproduction steps

**Emergency (Blocking Issue):**

1. Slack/DM to Ash Shaw
2. Explain business impact
3. Response within 1 hour

### Helpful Diagnostic Commands

```bash
# Check VS Code version
code --version

# List installed extensions
code --list-extensions

# Check VS Code logs
~/.vscode/logs/ (Mac/Linux)
%APPDATA%\Code\logs\ (Windows)

# Test API connectivity
curl -I https://api.anthropic.com
```

---

## Frequently Asked Questions

### Q: Will Claude Code delete my files?

**A:** No. Claude Code edits files but doesn't delete them. Always review changes before accepting. Use Git to revert if needed.

### Q: Is my code sent to Claude?

**A:** Only code you explicitly ask Claude to work with. Never sent without action from you.

### Q: Can I use Claude Code offline?

**A:** No. Requires internet connection to Claude API.

### Q: Will these tools drain my battery?

**A:** Slightly. Background indexing uses CPU. Disable if on battery power by disabling extensions.

### Q: Can I use both Copilot and Claude Code?

**A:** Yes! They work together. Copilot for inline suggestions, Claude Code for complex tasks.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-26 | Initial troubleshooting guide |

---

## References

- [Claude Code Setup Guide](./plugin-setup-claude-code.md)
- [GitHub Copilot Setup Guide](./plugin-setup-github-copilot.md)
- [Plugin Testing Guide](./plugin-testing.md)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

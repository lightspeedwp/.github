# Testing Agent — GitHub Copilot Provider Configuration

Configuration guide for the Testing Agent on GitHub Copilot (VS Code, Copilot Chat,
and inline code suggestions). Covers setup, keybindings, context management, and
accessibility.

## Overview

GitHub Copilot is optimized for:

- **Repository-aware context** — automatic access to codebase, package.json, PR files
- **VS Code integration** — inline suggestions, chat, code review workflows
- **Real-time feedback** — test suggestions while editing test files
- **GitHub workflow integration** — PR suggestions, Actions recommendations
- **Accessibility** — keyboard-driven workflows, screen reader support

Use Copilot for iterative test development, code review suggestions, and team
collaboration within GitHub.

## Installation & Setup

### Prerequisites

- GitHub Copilot subscription ($10/mo or $100/yr for individuals; included in GitHub Enterprise)
- VS Code 1.88+
- Testing Agent skills registered in your Copilot workspace

### VS Code Setup

1. **Install Extension**

   ```
   Copilot: GitHub Copilot
   Copilot Chat: GitHub Copilot Chat
   (Auto-installed with GitHub Copilot subscription)
   ```

2. **Authenticate**
   - Open Command Palette: `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
   - Run: `GitHub Copilot: Sign In`
   - Complete OAuth flow in browser

3. **Register Testing Agent Skills**
   - In VS Code Settings: `Copilot: Chat Organization Context`
   - Add org context: `agents/testing-agent/shared/core-prompt.md`
   - Add skills manifest: `agents/testing-agent/copilot/skills.yaml`
   - Reload VS Code (`Cmd+Shift+P` → `Developer: Reload Window`)

### Settings Configuration

Add to `.vscode/settings.json`:

```json
{
  "github.copilot.advanced": {
    "orgContext": true,
    "context_chat.enabled": true,
    "inlineCompletions.enabled": true
  },
  "editor.inlineCompletionSuggestions": true,
  "[playwright]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "files.associations": {
    "*.spec.ts": "typescript",
    "*.test.ts": "typescript"
  }
}
```

## Keybindings & Shortcuts

### Copilot Chat

| Action | macOS | Windows/Linux |
|--------|-------|---------------|
| Open Copilot Chat | `Cmd+Shift+I` | `Ctrl+Shift+I` |
| Focus chat input | `Cmd+Shift+V` | `Ctrl+Shift+V` |
| Clear conversation | `Cmd+K` (in chat) | `Ctrl+K` (in chat) |
| Accept suggestion | `Tab` | `Tab` |
| Reject suggestion | `Esc` | `Esc` |

### Inline Suggestions

| Action | macOS | Windows/Linux |
|--------|-------|---------------|
| Show suggestions | `Alt+\` | `Alt+\` |
| Accept inline | `Tab` | `Tab` |
| Cycle suggestions | `Option+]` | `Alt+]` |
| Dismiss inline | `Esc` | `Esc` |

### Custom Keybindings (Optional)

Add to `.vscode/keybindings.json`:

```json
[
  {
    "key": "cmd+shift+t",
    "command": "github.copilot.openSymbolFromEditor",
    "when": "editorTextFocus && editorLangId == typescript"
  },
  {
    "key": "cmd+k cmd+t",
    "command": "github.copilot.chat.openAsPanel",
    "when": "!inDebugMode"
  }
]
```

## Chat Context Management

### Attaching Context to Chat

When asking Copilot for test suggestions, attach relevant files:

1. **Manually attach files** (easiest)
   - In Copilot Chat, type `#` to show file picker
   - Select test file, requirements doc, design file
   - Chat will include context in the request

2. **Auto-include via Context**
   - Copilot automatically includes:
     - Current file (open in editor)
     - Workspace folder structure (`.gitignore` respected)
     - `package.json` (dependencies, scripts)
     - Last 5 edited files
   - Optionally exclude via `.copilotignore` (in repo root):

     ```
     node_modules/
     dist/
     coverage/
     .env*
     secrets/
     ```

3. **Use @-mentions for Skills**

   ```
   @test-pack-builder Generate a test pack for the checkout flow

   @playwright-selectors Find resilient locators for the login form

   @test-reporting Format this test result as a report
   ```

### Context Window Limits

- **Copilot Chat**: 8K input context (automatically manages large files)
- **Inline suggestions**: 1K context (current file + nearby context)
- **PR review suggestions**: 5K context (PR diff + PR description)

When context is full, Copilot automatically truncates to keep tokens under limit.

## Inline Suggestions

### Enable/Disable Per File Type

Inline suggestions are most useful for test files. Control per language:

```json
{
  "[javascript]": { "editor.inlineCompletionSuggestions": false },
  "[typescript]": { "editor.inlineCompletionSuggestions": true },
  "[markdown]": { "editor.inlineCompletionSuggestions": false }
}
```

### Example: Inline Test Generation

1. Start typing a test case:

   ```typescript
   describe('checkout', () => {
     test('guest user can complete checkout', async ({ page }) => {
       // Copilot suggests the full test here
   ```

2. Press `Alt+\` to show suggestions; `Tab` to accept
3. Refine suggestions via Copilot Chat (`Cmd+Shift+I`) for follow-ups

### Inline Best Practices

✅ **Use inline for:**

- Test boilerplate (describe, test, assertions)
- Common locators and navigation patterns
- Setup/teardown fixtures

❌ **Avoid inline for:**

- Complex test logic (use Chat instead)
- Security-sensitive code (auth, API keys)
- Multi-step workflows (Chat provides better context)

## Code Review Workflow

### GitHub PR Review

1. Open PR in GitHub web interface
2. Copilot automatically reviews suggested:
   - Test coverage gaps
   - Missing assertions
   - Accessibility issues in test selectors
3. Accept/dismiss suggestions inline in PR diff

### VS Code PR Review (GitHub Pull Requests Extension)

1. Install: `GitHub Pull Requests`
2. Open PR: `GitHub Pull Requests: Open PR in Editor`
3. Copilot suggests improvements to test files in the diff

### Review Checklist (Auto-Generated)

When Copilot reviews test changes, it checks:

```
✓ Test name matches requirement
✓ Assertions match expected behavior
✓ Locators are resilient (accessible labels, data-testid)
✓ No hardcoded URLs or credentials
✓ Proper page setup/teardown
✓ Traceability comments present
```

## Repository Awareness

### Automatic Context

Copilot automatically understands:

- **Codebase structure** — your folder layout, imports
- **Test frameworks** — Jest, Playwright, Mocha, etc. (detected from package.json)
- **Design tokens** — color, spacing from design system docs
- **CI/CD** — GitHub Actions workflows, available secrets
- **Dependencies** — versions, breaking changes in package.json

### Workspace Manifest

Create `.github/copilot-workspace.md` to provide additional context:

```markdown
# Testing Agent Workspace

## Repository Structure
- `/tests/` — Playwright specs
- `/src/` — Application source code
- `.github/reports/test-packs/` — Generated test packs (read-only)

## Key Configuration
- Testing framework: Playwright (TypeScript)
- Base URL: `process.env.BASE_URL`
- Auth: JWT token in `Authorization: Bearer` header
- Design spec: Figma (link in PRD)

## Skills Available
- @test-pack-builder — Generate test packs from requirements
- @playwright-selectors — Find resilient locators
- @test-reporting — Format test results

## Conventions
- Test files: `tests/*.spec.ts`
- Page objects: `tests/pages/*.ts`
- Fixtures: `tests/fixtures/*.ts`
- Environment: `.env.local` (git-ignored)
```

## Accessibility Settings

### Screen Reader Support

- **NVDA** (Windows) / **JAWS** (Windows) / **VoiceOver** (macOS)
- Copilot Chat is fully accessible
- Inline suggestions can be toggled off for screen readers (reduces auditory overload)

### Keyboard Navigation

Copilot is fully keyboard-driven:

- `Cmd+Shift+I` — Open chat
- `Tab` / `Shift+Tab` — Navigate chat options
- `Enter` — Submit message
- `Esc` — Close chat

### High Contrast

Enable in VS Code:

- Settings → `Color Theme` → Select high-contrast theme
- Copilot UI respects your theme automatically

### Text Size

Copilot Chat respects VS Code's editor font size:

- Settings → `Editor: Font Size`
- Default: 14px; recommended for accessibility: 16–18px

## Best Practices

### When to Use Copilot Chat

✅ **Use Chat for:**

- Generating test packs from requirements
- Asking for edge-case ideas
- Refining test logic iteratively
- Code review suggestions
- Debugging test failures

Example:

```
@test-pack-builder Generate a test pack for "user can add items to cart".
Use the Figma spec here: [attach cart.fig]
```

### When to Use Inline Suggestions

✅ **Use Inline for:**

- Quick boilerplate (test structure, describe blocks)
- Common patterns you've already reviewed
- Filling in known locators

### When to Ask Copilot

❌ **Avoid asking Copilot:**

- "Write all my tests for me" — Use Chat + manual review instead
- "Find security vulnerabilities" — Use separate security scanning
- "Optimize performance" — Use profiling tools; Copilot is not authoritative

### Conversation Hygiene

Keep chat sessions focused:

- **New question?** Start a new conversation (easier to track)
- **Refining a test pack?** Continue in same conversation
- **Switching topics?** Clear history (`Cmd+K` in chat)

## Integration with GitHub Actions

### Suggesting GitHub Actions Steps

When editing `.github/workflows/test.yml`, Copilot suggests:

- Test execution command (`npx playwright test`)
- Artifact upload for reports
- Failure notifications
- Environment variable setup

Example suggestion:

```yaml
- name: Run tests
  run: npx playwright test
  env:
    BASE_URL: ${{ secrets.STAGING_BASE_URL }}
    HEADLESS: true
```

**Always verify** Copilot doesn't include hardcoded secrets; use `${{ secrets.* }}` instead.

## Monitoring & Telemetry

### What's Collected

- Chat messages (for improving Copilot)
- File edits with Copilot suggestions
- Suggestion acceptance rate (anonymized)

### What's Private

- Your codebase (not stored after session)
- Secrets and environment variables (not logged)
- PR descriptions (not retained)

### Opt-Out

- Chat: Settings → `GitHub Copilot: Chat`
- Inline suggestions: Settings → `Editor: Inline Completions`
- Telemetry: Settings → `Microsoft: Telemetry Level` → `off`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Chat not responding | Verify authentication (`GitHub Copilot: Sign In`); check internet connection |
| No inline suggestions | Verify `editor.inlineCompletionSuggestions` is true in settings |
| Context not included | Use `#` in chat to manually attach files; check `.copilotignore` |
| Slow responses | Reduce attached files; clear chat history (Cmd+K); restart VS Code |
| Security warnings | Never paste secrets in chat; use `process.env.*` instead |
| Skills not available | Reload window (`Cmd+Shift+P` → `Developer: Reload Window`) |

## Support & Learning

- **Copilot Docs**: <https://docs.github.com/en/copilot>
- **Community**: GitHub Discussions, Stack Overflow (#github-copilot)
- **Report Issues**: GitHub (github.com) → Settings → Copilot → Send feedback

---

*Maintained by the 🤖 LightSpeedWP Automation Team* · [📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

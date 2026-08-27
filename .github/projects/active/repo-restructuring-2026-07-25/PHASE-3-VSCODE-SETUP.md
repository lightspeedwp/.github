# Phase 3: VSCode Workspace Setup & Documentation

## Repository Restructuring — Automated Setup & Developer Guides

**Duration:** 3–4 days  
**Owner:** Claude Code Agent (script & documentation generation)  
**Status:** Ready to Execute  
**Prerequisites:** Phase 2 complete, schemas & validation confirmed

---

## Copy This Prompt for Claude

````text
PHASE 3: Create VSCode workspace setup infrastructure and documentation.

STATUS: Phase 2 complete. Repository structure finalized.

TASK: Create automated setup scripts and comprehensive developer guides.

=====================================
DELIVERABLE 3.1: SETUP SCRIPTS
=====================================

Create: .github/scripts/setup-vscode-workspace.sh

Features:
- Checks prerequisites (Node v18+, npm v9+, git v2+, VSCode)
- Installs dependencies (npm ci)
- Installs VSCode extensions (ESLint, Prettier, etc.)
- Sets up git hooks (pre-commit, commit-msg)
- Runs validation to verify setup
- Creates .env.local template
- Provides colored output and clear progress messages

Include:
- Error handling (exit on missing prerequisites)
- Progress indicators (✅ Step complete, ❌ Failed)
- Summary at end showing what was set up
- Troubleshooting hints for common failures

Test: Run the script locally and verify:
1. All prerequisites checked
2. npm ci succeeds
3. VSCode extensions install
4. Git hooks installed
5. Validation passes
6. Script completes with success message

---

Create: .github/scripts/setup-git-hooks.sh

Features:
- Installs pre-commit hook
- Installs commit-msg hook
- Sets executable permissions
- Reports success/failure

---

Create: .github/scripts/install-vscode-extensions.sh

Features:
- Installs recommended VSCode extensions only
- Useful for developers who already have prerequisites installed
- Provides extension list and status

---

=====================================
DELIVERABLE 3.2: VSCODE WORKSPACE FILE
=====================================

Create: .github/lightspeed-dev.code-workspace

Content: Multi-root VSCode workspace definition including:
- .github folder (this repository)
- Example WordPress project folder
- Shared settings (ESLint, Prettier, search exclude patterns)
- Recommended extensions list
- Jest debug configuration
- Path mappings for better editor experience

Example structure:
{
  "folders": [
    {
      "path": ".",
      "name": ".github (Control Plane)"
    },
    {
      "path": "../relative-path-to-wordpress-project",
      "name": "WordPress Project"
    }
  ],
  "settings": {
    "eslint.validate": [...],
    "prettier.configPath": "config/.prettierrc.json",
    ...
  },
  "extensions": {
    "recommendations": [...]
  }
}

Test: 
- Open workspace file in VSCode
- Verify both folders load correctly
- Verify extensions recommended
- Verify settings applied to both folders

---

=====================================
DELIVERABLE 3.3: VSCODE SETTINGS
=====================================

Create: .github/.vscode/settings.json

Content: Shared settings for .github repo:
- ESLint strict mode
- Prettier config path
- File associations (YAML, JSON, Markdown)
- Search exclude patterns
- Auto-formatting on save
- Test runner configuration

---

Create: .github/.vscode/extensions.json

Content: List of recommended extensions:
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- Test Explorer (hbenl.vscode-test-explorer)
- Jest Runner (saiichihashimoto.jest-runner)
- YAML (redhat.vscode-yaml)
- JSON Schema (redhat.vscode-json-all)
- Markdown Linter (davidanson.vscode-markdownlint)
- Git Lens (eamodio.gitlens)
- Thunder Client or REST Client (for API testing)

---

=====================================
DELIVERABLE 3.4: SETUP DOCUMENTATION
=====================================

Create: docs/vscode-workspace-setup.md

Content should include:

---
# VSCode Workspace Setup Guide

## Quick Start (Automated)

If you have VSCode, Node v18+, npm v9+, and git v2+ installed:

```bash
./.github/scripts/setup-vscode-workspace.sh
```

The script will:
1. Verify all prerequisites
2. Install dependencies
3. Install VSCode extensions
4. Set up git hooks
5. Run validation
6. Create .env.local template

Expect 5–10 minutes for complete setup.

## Manual Setup (Fallback)

If the automated script doesn't work:

### 1. Install Prerequisites

Verify Node, npm, git versions:
```bash
node --version    # v18+
npm --version     # v9+
git --version     # v2+
```

Install VSCode from https://code.visualstudio.com/

### 2. Install Dependencies

```bash
npm ci
```

### 3. Install VSCode Extensions

In VSCode, open Command Palette (Cmd+Shift+P) and run:
`Extensions: Install Recommended Extensions`

Or manually install:
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- [... other extensions ...]

### 4. Set Up Git Hooks

```bash
./.github/scripts/setup-git-hooks.sh
```

### 5. Verify Setup

```bash
npm run validate:all
npm test
```

## Opening the Workspace

### Option 1: VSCode UI
1. Open VSCode
2. File > Open Workspace from File
3. Navigate to `.github/lightspeed-dev.code-workspace`
4. Click Open

### Option 2: Command Line
```bash
code .github/lightspeed-dev.code-workspace
```

## Configuring for Multiple Projects

The workspace includes `.github` by default. To add your WordPress project:

1. Edit `.github/lightspeed-dev.code-workspace`
2. Add folder entry:
```json
{
  "path": "../path-to-your-wordpress-project",
  "name": "WordPress Project Name"
}
```
3. Reload workspace in VSCode

## API Key Configuration

If using Claude Code or GitHub Copilot:

1. Create `.env.local` in repository root:
```
ANTHROPIC_API_KEY=sk-...
GITHUB_TOKEN=ghp_...
```

2. Add to `.gitignore` (if not already present):
```
.env.local
```

3. Restart VSCode for changes to take effect

## Troubleshooting

### VSCode Extensions Not Installing
- Check internet connection
- Try: VSCode Settings > Extensions > Reload
- If issue persists, install manually from VSCode marketplace

### ESLint Not Working
- Run: npm ci (to reinstall dependencies)
- Check: .eslintrc.json exists in repository root
- Restart VSCode

### Git Hooks Not Running
- Check: pre-commit hook is executable: `ls -la .git/hooks/pre-commit`
- If not executable: `chmod +x .git/hooks/pre-commit`
- Test: `npm run validate:branch-name`

### npm ci Fails
- Try: `rm -rf node_modules package-lock.json`
- Then: `npm ci`
- Check Node version: `node --version` (should be v18+)

## FAQ

**Q: Do I need all recommended extensions?**
A: No, but they improve the development experience. At minimum, install ESLint and Prettier.

**Q: Can I use an older version of Node?**
A: Not recommended. Node v18+ required for modern JavaScript features. Upgrade via nvm or direct download.

**Q: How do I update VSCode settings?**
A: Edit `.github/.vscode/settings.json` and reload VSCode (Cmd+Shift+P > Developer: Reload Window)

**Q: What if I'm working on multiple WordPress projects?**
A: Duplicate the workspace file: `cp .github/lightspeed-dev.code-workspace my-project.code-workspace` and update folder paths.

---

---

=====================================
DELIVERABLE 3.5: FAQ DOCUMENTATION
=====================================

Create: docs/faq.md

Content: Common questions about:
- Setup issues
- Plugin questions (Claude Code, Copilot, Codex)
- Agent/skill usage
- Git and branching
- Repository structure
- Validation and testing

---

=====================================
DELIVERABLE 3.6: TEST SETUP SCRIPTS
=====================================

Run locally and verify:
1. ./.github/scripts/setup-vscode-workspace.sh → Succeeds
2. ./.github/scripts/setup-git-hooks.sh → Succeeds
3. ./.github/scripts/install-vscode-extensions.sh → Lists extensions
4. VSCode workspace file → Valid JSON, opens in VSCode

Document any issues found and fixes applied.

=====================================
PHASE 3: FINAL COMMIT
=====================================

After all deliverables created and tested:

git add -A

git commit -m "feat: Create VSCode workspace setup infrastructure

Created automation scripts:
- .github/scripts/setup-vscode-workspace.sh — Full setup in one command
- .github/scripts/setup-git-hooks.sh — Git hook installation
- .github/scripts/install-vscode-extensions.sh — Extension management

Created VSCode configuration:
- .github/lightspeed-dev.code-workspace — Multi-root workspace definition
- .github/.vscode/settings.json — Shared repository settings
- .github/.vscode/extensions.json — Recommended extensions list

Created documentation:
- docs/vscode-workspace-setup.md — Complete setup guide with troubleshooting
- docs/faq.md — Frequently asked questions and solutions

Setup scripts tested and verified ✅

Phase 4 (Plugin adoption strategy) ready to proceed.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

git log --oneline -3
````

---

## What to Expect

**Duration:** 3–4 days  
**Scope:** 3 setup scripts, 1 workspace file, 2 settings files, 2 documentation files

**Outcomes:**

- ✅ Developers can run one setup script
- ✅ Automated extension installation
- ✅ Git hooks installed automatically
- ✅ Complete troubleshooting guide available

---

**Document Version:** 1.0  
**Status:** Ready to Execute  
**Created:** 2026-07-26

---
title: Meta Agent v2.0 — Frequently Asked Questions
description: >
  50+ questions and answers about Meta Agent v2.0, covering setup,
  usage, configuration, troubleshooting, and advanced topics.
file_type: faq
category: documentation
version: 1.0
status: active
author: Ash Shaw
date: '2026-08-21'
language: en
owners:
  - lightspeedwp/maintainers
---

# Meta Agent v2.0 — Frequently Asked Questions

Answers to common questions about Meta Agent v2.0.

## General Questions

### What is Meta Agent v2.0?

Meta Agent v2.0 is an intelligent documentation metadata validator for LightSpeed projects. It automatically detects your repository type (WordPress plugin, theme, or control-plane) and applies context-specific validation rules to ensure consistent, high-quality documentation frontmatter.

### Why do I need Meta Agent v2.0?

**Problems it solves:**
- Inconsistent frontmatter across repos
- Manual metadata configuration per repository
- Difficult to maintain documentation standards at scale
- Hard to catch metadata errors before merge

**Benefits:**
- ✅ Automatic repo type detection (no config needed)
- ✅ Consistent metadata standards across all repos
- ✅ Early error detection (pre-commit hooks)
- ✅ CI/CD integration for automated validation
- ✅ Clear error messages with actionable fixes

### How is it different from v1.0?

| Feature | v1.0 | v2.0 |
|---------|------|------|
| Repo types | 1 (generic) | 4 (plugin, theme, control-plane, generic) |
| Auto-detection | ❌ No | ✅ Yes |
| Schemas | Basic | Comprehensive (4 context-specific) |
| Pre-commit hooks | ❌ No | ✅ Yes |
| CI/CD integration | ❌ No | ✅ Yes |
| Tests | 20 | 116 |
| Documentation | Minimal | Comprehensive (guides, troubleshooting, FAQ) |

### What repository types does it support?

- ✅ **WordPress Block Plugins** (block.json)
- ✅ **WordPress Block Themes** (theme.json + style.css)
- ✅ **Control-Plane Repositories** (.github governance)
- ✅ **Generic Documentation** (any Markdown)

### Does it work with my existing documentation?

Yes! Meta Agent v2.0 is backward compatible. It validates frontmatter but doesn't modify document content. If your files don't have frontmatter yet, you can add it gradually.

### Is there a v1.0 to v2.0 migration path?

Yes. If you're using v1.0:
1. Backup your current configuration
2. Install v2.0 alongside v1.0
3. Test with `npm run validate -- file.md`
4. Migrate files gradually
5. Enable pre-commit hooks when ready

### Can I customize the schemas?

Yes. You can:
- Fork the schemas and modify them
- Add optional fields for your use case
- Create organization-specific variants

See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for customization instructions.

---

## Setup & Installation

### How do I install Meta Agent v2.0?

1. Copy the agent folder to your repo: `cp -r meta-agent .github/agents/`
2. Install dependencies: `cd .github/agents/meta-agent && npm install`
3. Run tests to verify: `npm test`
4. See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for detailed setup

### What are the system requirements?

- **Node.js:** v16.0.0 or higher (v18+ recommended)
- **npm:** v8.0.0 or higher
- **Git:** v2.30.0 or higher
- **Disk space:** ~50MB for node_modules

### Can I use it with a monorepo?

Yes. Copy the agent to `.github/agents/meta-agent` at the monorepo root. It will validate files across all packages.

### Does it require internet access?

No. Meta Agent v2.0 works completely offline. It uses local JSON schemas for validation.

### How do I update to a new version?

```bash
cd .github/agents/meta-agent
git pull origin main  # Or download latest release
npm install
npm test
```

### Can I run it on Windows?

Yes. Meta Agent v2.0 is platform-agnostic and runs on Windows, macOS, and Linux.

---

## Running & Usage

### How do I validate a single file?

```bash
cd .github/agents/meta-agent
npm run validate -- path/to/file.md
```

### How do I validate multiple files?

```bash
# All files in a folder
npm run validate -- "docs/**/*.md"

# All changed files
npm run validate:changed

# Specific pattern
npm run validate -- "README*.md"
```

### What does a passing validation look like?

```
✅ README.md
  ├─ Repo type: control-plane
  ├─ Schema: control-plane.frontmatter.schema.json
  └─ Status: VALID (all 7 required fields present)
```

### What does a failing validation look like?

```
❌ CONTRIBUTING.md
  ├─ Repo type: control-plane
  ├─ Schema: control-plane.frontmatter.schema.json
  └─ Errors:
     • Field 'category' is required
     • Field 'owners' is not valid (must be array)
```

### Can I see validation results in JSON format?

Yes:
```bash
npm run validate -- file.md --json
```

### How fast is validation?

- Single file: <100ms
- 10 files: ~500ms
- 100 files: 2–5 seconds

### Can I validate only files I changed?

Yes:
```bash
npm run validate:changed
```

This is useful for PRs to avoid validating the entire repo.

---

## Pre-Commit Hooks

### What is a pre-commit hook?

A pre-commit hook automatically validates files before you commit them. If validation fails, the commit is blocked until you fix the issues.

### How do I set up the pre-commit hook?

```bash
chmod +x scripts/hooks/meta-agent-validate.sh
cp scripts/hooks/meta-agent-validate.sh .git/hooks/pre-commit
```

Then test it:
```bash
git add file.md
git commit -m "test"  # Hook runs and validates file
```

### Can I disable the hook temporarily?

Yes, use `--no-verify`:
```bash
git commit --no-verify -m "Skip validation"
```

### How do I reinstall the hook if it gets deleted?

```bash
cp scripts/hooks/meta-agent-validate.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### Does the hook run for all files or just changed ones?

By default, it validates all staged files. You can configure it to check only changed files for faster commits.

### Can I use the hook with other tools like ESLint?

Yes. The hook just validates frontmatter. It works alongside linters and formatters.

---

## GitHub Actions Integration

### How do I add validation to my CI/CD?

Create `.github/workflows/meta-agent-validation.yml` with:

```yaml
name: Meta Agent Validation
on:
  pull_request:
    paths:
      - '**.md'
      - '.github/agents/meta-agent/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd .github/agents/meta-agent && npm ci
      - run: cd .github/agents/meta-agent && npm run validate:changed
```

### Can I require validation to pass before merge?

Yes. In repository settings:
1. Go to **Settings** → **Branches** → **Branch protection rules**
2. Check "Require status checks to pass before merging"
3. Select "Meta Agent Validation" workflow

### What if the workflow is too slow?

Use `npm run validate:changed` instead of `npm run validate` to check only modified files. This is 10x faster for large repos.

### Can I validate only certain files in CI?

Yes. Modify the workflow to specify file patterns:

```yaml
- run: cd .github/agents/meta-agent && npm run validate -- "docs/**/*.md"
```

### Does the workflow report results to the PR?

Yes. Results appear as a check on your PR with ✅ (pass) or ❌ (fail) status.

---

## Frontmatter & Schemas

### What is frontmatter?

Frontmatter is YAML metadata at the top of a Markdown file:

```markdown
---
title: My Document
description: A test
status: active
language: en
---

# Content starts here
```

### What fields are required?

It depends on your repository type:

| Field | Block Plugin | Block Theme | Control-Plane | Generic Docs |
|-------|--------------|-------------|---------------|--------------|
| `title` | ✅ | ✅ | ✅ | ✅ |
| `description` | ✅ | ✅ | ✅ | ✅ |
| `status` | ✅ | ✅ | ✅ | ✅ |
| `language` | ✅ | ✅ | ✅ | ✅ |
| `file_type` | — | — | ✅ | — |
| `category` | — | — | ✅ | — |
| `owners` | — | — | ✅ | — |

### What values are allowed for 'status'?

- `draft` — Work in progress
- `review` — Under review
- `active` — Published and current
- `archived` — Old, no longer maintained

### What does 'language' mean?

Currently, only `en` (UK English) is supported. This ensures consistent documentation language across the organisation.

### How do I add optional fields?

Just add them to the frontmatter. Meta Agent will validate and include them:

```yaml
---
title: My Document
description: A test
status: active
language: en
author: John Doe          # Optional
tags:                    # Optional
  - tutorial
  - beginner
---
```

### Can I have multi-line descriptions?

Yes, use `>` for line wrapping:

```yaml
description: >
  This is a long description that spans
  multiple lines but will be joined into
  a single line in the output.
```

Or `|` to preserve line breaks:

```yaml
description: |
  Line 1
  Line 2
  Line 3
```

### What's the difference between the schemas?

Each schema is tailored to a repository type:
- **Block Plugin:** Includes plugin-specific fields
- **Block Theme:** Includes theme-specific fields
- **Control-Plane:** Includes governance fields
- **Generic:** General-purpose documentation fields

---

## Repository Type Detection

### How does Meta Agent detect my repository type?

It checks for these markers in order:

1. **Block Plugin:** `block.json` exists OR `.php` file has "Block Name" header
2. **Block Theme:** `theme.json` exists AND `style.css` exists
3. **Control-Plane:** `.github/agents/`, `.github/workflows/`, or `AGENTS.md` exists
4. **Generic:** Default (used if no markers found)

### How do I tell Meta Agent what type my repo is?

Create the appropriate marker file:

```bash
# For block plugin
touch block.json

# For block theme
touch theme.json
touch style.css

# For control-plane (already exists)
mkdir -p .github/agents
```

### What if my repo doesn't match any type?

It defaults to "generic documentation" schema. All generic docs require `title`, `description`, `status`, and `language` fields.

### Can I override the detected type?

You can manually specify the schema in the frontmatter:

```yaml
---
title: My Document
description: A test
status: active
language: en
_schema_override: block-plugin  # Force block-plugin schema
---
```

---

## Troubleshooting & Errors

### I get "Field is required" but I added the field

Check:
1. Field name spelling (case-sensitive)
2. YAML indentation (use spaces, not tabs)
3. Field is at top level (not nested inside another field)

### Validation passes locally but fails in CI

Possible causes:
- Different Node.js version in CI (use `actions/setup-node@v3` to set v18)
- Uncommitted changes not synced
- CI uses different file encoding

**Solution:**
```bash
# Run same validation as CI locally
npm run validate:changed
```

### My hook runs but I don't see output

The hook is quiet by default. To debug:

```bash
# Test hook directly
.git/hooks/pre-commit --debug
```

### Validation is very slow

See [Performance Issues](./TROUBLESHOOTING.md#performance-issues) in the Troubleshooting guide.

---

## Advanced Topics

### Can I extend the schemas?

Yes. Fork the schema files and customize them:

```json
{
  "properties": {
    "title": { "type": "string", "minLength": 3, "maxLength": 200 },
    "custom_field": { "type": "string", "description": "My custom field" }
  }
}
```

### Can I use Meta Agent programmatically?

Yes, from JavaScript:

```javascript
const MetaAgent = require('./index.js');
const agent = new MetaAgent();
const result = agent.validateFile('README.md');
if (result.valid) {
  console.log('✅ Valid!');
} else {
  console.log('❌ Errors:', result.errors);
}
```

### Can I contribute improvements?

Yes! Open an issue or PR in the repository. We welcome:
- Schema improvements
- New repo types
- Performance optimizations
- Documentation enhancements

### How is this maintained?

Meta Agent v2.0 is maintained by the LightSpeed team. We:
- Release updates monthly
- Accept community contributions
- Provide support via GitHub issues
- Maintain backward compatibility

### What's the support SLA?

- **Critical bugs:** Fixed within 48 hours
- **Minor issues:** Fixed within 1 week
- **Feature requests:** Reviewed monthly

### Is there a roadmap?

Yes! Planned features for v2.1:
- Visual frontmatter editor (web UI)
- Auto-formatting tool
- Bulk validation dashboard
- Custom schema builder UI

---

## Migration & Adoption

### I'm using a different metadata system. Can I migrate?

Yes. Meta Agent provides migration helpers:

```bash
npm run migrate:from-old-format < old-metadata.json > new-frontmatter.yml
```

### How do I convince my team to adopt it?

Key selling points:
- **Saves time:** Automatic validation catches errors before review
- **Consistent:** One standard across all repos
- **Clear:** Easy-to-understand error messages
- **Flexible:** Works with existing workflows
- **Zero breaking changes:** Existing docs still work

### What if team members resist?

Common concerns & responses:
- "Too strict" → Schemas are based on real needs, can be customized
- "Too complex" → Takes 5 minutes to set up, then transparent
- "Another tool?" → Integrates with existing tools, not a replacement

---

## Feedback & Support

### How do I report a bug?

Create a GitHub issue with:
- Steps to reproduce
- Expected vs actual behavior
- System info (Node, OS, npm versions)
- Error output

### How do I request a feature?

Open a GitHub issue with "Feature request:" in the title. Include:
- What you want to do
- Why you need it
- How it would help your workflow

### Where do I ask questions?

1. **Check this FAQ** — Most common questions answered here
2. **Check TROUBLESHOOTING.md** — For errors and debugging
3. **Check IMPLEMENTATION_GUIDE.md** — For setup & usage
4. **Open an issue** — For questions not covered above
5. **Ask in Slack** — #meta-agent channel

### How do I stay updated?

- Watch the GitHub repository for releases
- Subscribe to team announcements
- Check the CHANGELOG.md for version history

---

## Quick Links

- 📖 [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) — Setup & usage
- 🔧 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) — Common issues & fixes
- 📋 [README.md](./README.md) — Architecture & overview
- 💬 [GitHub Issues](https://github.com/lightspeedwp/.github/issues) — Report bugs
- 💭 [GitHub Discussions](https://github.com/lightspeedwp/.github/discussions) — Ask questions

---

*Meta Agent v2.0 — Questions? We've got answers!* 🚀


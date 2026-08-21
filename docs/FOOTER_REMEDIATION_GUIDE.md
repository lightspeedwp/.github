---
title: Footer Remediation Guide
description: How to identify, fix, and prevent duplicate footers in Markdown files
version: v1.0.3
created_date: '2026-05-28'
type: guide
category: governance
---

# Footer Remediation Guide

## Problem

The root `README.md` (and likely other files) contains **multiple duplicate footer blocks**. Example from README.md tail:

```markdown
*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](...)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](...)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](...)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](...)

[... repeated 10+ more times ...]
```

### Why This Is Bad

1. **Clutter & Readability**: Document footers become massive, pushing actual content up
2. **Inconsistency**: Different files end up with different footers (manual copy-paste errors)
3. **Maintenance Burden**: Updating footers requires editing multiple files
4. **Unmaintainable**: No single source of truth for footer templates
5. **Validation Failure**: Hard to validate that footers are correct without manual inspection

### Root Cause

Currently, footers are:

- **Manually added** to each document
- **Copy-pasted** between files (risk of duplicates)
- **Not validated** — no schema enforcement
- **Not centralized** — no predefined library

---

## Solution: Centralized Footer Schema & Config

### New Files Created

1. **`.schemas/footer-config.schema.json`** — JSON Schema defining valid footer structure
2. **`config/footers.config.yaml`** — Predefined footer library with 13 category-specific templates
3. **`scripts/validate-footers.js`** — Validation script to detect, fix, and backfill violations

### Key Principles

✅ **One footer per document** — Validation enforces this
✅ **Predefined templates** — Choose from validated, category-specific footers
✅ **Schema validation** — Prevent duplicates, missing footers, and invalid footers
✅ **Automation-ready** — Footer insertion can be automated via agent

---

## Category-Specific Footers

The configuration defines **15 document categories** with appropriate footers:

| Category | Default Footer | Use For |
| --- | --- | --- |
| `readme` | `lightspeed-standard` | Project overviews, getting started |
| `docs` | `lightspeed-standard` | User guides, tutorials, API docs |
| `ai-ops` | `ai-ops-standard` | Agent specs, automation governance |
| `agents` | `ai-ops-standard` | Agent specifications and examples |
| `instructions` | `standards-footer` | Coding standards, guidelines |
| `prompts` | `ai-ops-standard` | Prompts and prompt engineering |
| `schema` | `schema-footer` | Data schemas and validation |
| `audit` | `audit-footer` | Audit reports and findings |
| `research` | `research-footer` | Research and analysis docs |
| `workflow` | `ai-ops-standard` | GitHub Actions and CI/CD |
| `issue` | `issue-footer` | Issue bodies and templates |
| `pull-request` | `pr-footer` | PR descriptions and templates |
| `awesome-copilot` | `copilot-footer` | Copilot tips and collections |
| `governance` | `governance-footer` | Policies and decision records |
| `test` | `lightspeed-standard` | Test documentation |

---

## Predefined Footer Templates

### `lightspeed-standard` (Most Common)

```markdown
---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

[🔗 Website](https://lightspeedwp.agency) · [📧 Contact](https://lightspeedwp.agency/contact) · [👥 Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
```

**Use for**: README files, general documentation
**Lines**: 3 lines (title + blank + content)

### `ai-ops-standard`

```markdown
---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/HEAD/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/HEAD/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
```

**Use for**: AI ops, agent specs, automation docs
**Lines**: 3 lines

### `standards-footer`

```markdown
---

📐 *Schema validated by LightSpeedWP — always compliant.*

[📋 Coding Standards](https://github.com/lightspeedwp/.github/blob/develop/instructions/coding-standards.instructions.md) · [🔗 Related Files](https://github.com/lightspeedwp/.github/tree/develop/instructions)
```

**Use for**: Instructions, coding standards, guidelines
**Lines**: 3 lines

### All Other Templates

See `config/footers.config.yaml` for complete list with 13 templates.

---

## How to Fix the Root README.md

### Step 1: Audit Current State

Check the end of README.md:

```bash
tail -30 README.md
```

You'll see the duplicate footers. Note how many are there.

### Step 2: Identify the Correct Footer

Based on the document category, choose the appropriate footer:

- Root README is a **project overview** → category: `readme`
- Default footer for `readme`: `lightspeed-standard`

### Step 3: Remove All Duplicate Footers

Keep **only one footer** at the end of the document. Remove all others:

1. Delete all duplicate footer blocks except the **first one**
2. Keep the separator `---` and the first footer block
3. Delete lines after the first footer

Example (before):

```markdown
# Content...

*Built by 🧱...*
[Contributors]...

*Have questions?...*
[Contact]...

*Built by 🧱...*  ← DELETE THIS
[Contributors]... ← DELETE THIS

*Have questions?...*  ← DELETE THIS
[Contact]...       ← DELETE THIS

[... repeated multiple times ...]
```

Example (after):

```markdown
# Content...

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

[🔗 Website](https://lightspeedwp.agency) · [📧 Contact](https://lightspeedwp.agency/contact) · [👥 Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
```

### Step 4: Add Category to Frontmatter

Add category metadata to the document's frontmatter (if not already present):

```yaml
---
title: "LightSpeed .github Repository"
category: "readme"
---
```

### Step 5: Validate Changes

Run the validation script:

```bash
node scripts/validate-footers.js --verbose
```

Expected output:

```
✅ All files validated successfully!
```

### Step 6: Commit Changes

```bash
git add README.md
git commit -m "fix: remove duplicate footers from root README.md

- Remove 10+ duplicate footer blocks
- Keep single 'lightspeed-standard' footer per schema
- Add 'category: readme' to frontmatter
- Validate against footer-config.schema.json

References: branding meta agent initiative #33"
```

---

## Using the Validation Script

### Check All Files

```bash
node scripts/validate-footers.js
```

### Check with Verbose Output

```bash
node scripts/validate-footers.js --verbose
```

### Save Report to JSON

```bash
node scripts/validate-footers.js --report=violations.json
```

### Auto-Fix Violations (Creates Backups)

```bash
node scripts/validate-footers.js --fix
```

This will:

1. Detect all duplicate/invalid footers
2. Create `.backup` files for each file modified
3. Remove duplicate footers
4. Keep one footer per document

Then review, test, and commit changes:

```bash
# Review changes
git diff

# Commit if satisfied
git add -A
git commit -m "fix: remediate duplicate footers across repository"

# Clean up backups (after confirming changes are good)
find . -name "*.backup" -delete
git add -A
git commit -m "chore: remove backup files"
```

---

## Preventing Future Duplicates

### 1. Use Category in Frontmatter

Every Markdown file should declare its category:

```yaml
---
title: "Document Title"
category: "docs"  # Required for footer validation
---
```

### 2. Choose a Predefined Footer

Never manually write footers. Instead:

1. Identify the document category
2. Look up the default footer for that category in `config/footers.config.yaml`
3. Copy the template and paste it at the end of your document

Example:

For a "docs" document, use the default `lightspeed-standard` footer:

```markdown
# Documentation Title

...content...

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

[🔗 Website](https://lightspeedwp.agency) · [📧 Contact](https://lightspeedwp.agency/contact) · [👥 Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
```

### 3. Use CI Validation

Add validation to your CI/CD pipeline:

```yaml
# .github/workflows/footer-validation.yml
name: "Footer Validation"

on:
  pull_request:
    paths:
      - "**.md"

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run validate:footers -- --changed-only
```

This ensures every PR is validated before merge.

### 4. Automate Footer Insertion (Future)

The branding meta agent (issue #33) will eventually automate footer insertion:

1. Read document frontmatter (category, tags)
2. Look up appropriate footer in `config/footers.config.yaml`
3. Insert footer automatically
4. Validate against schema
5. Report any errors

Until then, **manually add footers from the predefined library**.

---

## Validation Rules

The schema enforces:

1. **Max 5 lines per footer** — Keep footers concise
2. **Zero duplicates allowed** — One footer per document only
3. **Category required** — All docs must declare a category
4. **Valid footer IDs** — Footer must exist in predefined library

See `.schemas/footer-config.schema.json` for full validation rules.

---

## FAQ

### Q: Can I add a custom footer not in the library?

**A**: No. All footers must be predefined in `config/footers.config.yaml`. If you need a new footer:

1. Open an issue requesting the new footer
2. Propose the template and category
3. Get approval
4. Add to `footers.config.yaml`
5. Update schema
6. Re-run validation

This prevents footer proliferation and ensures consistency.

### Q: Can a document have multiple footers?

**A**: No. The validation rule `allow_multiple_footers_per_document: false` enforces one footer per document. This prevents the duplicate footer problem entirely.

### Q: What if my document doesn't need a footer?

**A**: All documents should have a footer for branding consistency. Use the minimal footer if needed:

```markdown
---

Made with 💚 by [LightSpeedWP](https://lightspeedwp.agency)
```

### Q: How do I add a variable footer (e.g., audit date)?

**A**: Some footers support variables. Define them in the footer template:

```yaml
audit-footer:
  template: |
    🔍 *Audit report generated {audit_date} by the LightSpeedWP team.*
  variables:
    audit_date: "Date the audit was performed (YYYY-MM-DD)"
```

Automation should populate variables before inserting the footer.

### Q: What about existing files with custom footers?

**A**: During remediation:

1. Identify the closest matching predefined footer
2. Replace custom footer with predefined version
3. Document in commit message if exact match wasn't available

Example:

```
Custom footer: "Maintained by the team"
Closest match: "lightspeed-standard"
Action: Replace and note in commit
```

---

## Related Documentation

- **Schema definition**: `.schemas/footer-config.schema.json`
- **Footer library**: `config/footers.config.yaml`
- **Validation script**: `scripts/validate-footers.js`
- **Branding meta agent**: Issue #33 (automation to follow)
- **Execution plan**: `.github/projects/active/next-issues-execution-plan.md`

---

## Next Steps

1. ✅ **Review this guide** — Understand the problem and solution
2. ⬜ **Run validation script** — Audit all files: `node scripts/validate-footers.js`
3. ⬜ **Fix root README.md** — Remove duplicate footers (manually or with `--fix`)
4. ⬜ **Validate changes** — Confirm no violations remain
5. ⬜ **Commit & push** — Create PR with fixes
6. ⬜ **Set up CI validation** — Add footer-validation.yml workflow
7. ⬜ **Plan automation** — Implement branding meta agent and footer validation hardening (issue #33)

---

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

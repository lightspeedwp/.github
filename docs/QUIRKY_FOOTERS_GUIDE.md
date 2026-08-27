---
file_type: documentation
title: Quirky Footers Guide
description: Adding personality to documentation with category-specific footers
category: documentation
---

# Quirky Footers Guide

## Overview

Quirky footers are personality-driven markdown footers that add charm and context to our documentation. Each footer is tailored to its document category, creating a consistent yet delightful experience across the codebase.

## Philosophy

Documentation shouldn't be dull. Our footers:

- **Add personality** without compromising professionalism
- **Reflect category context** — agents get agent footers, audits get audit footers
- **Use emoji thoughtfully** to enhance accessibility and visual interest
- **Remain concise** and non-intrusive to the actual content

## Categories & Their Footers

### README & Overview (`readme`)

These footers invite exploration and discovery:

- 🔭 **Telescope** — "Look through the telescope and explore what's possible!"
- 🗺️ **Treasure Map** — "Chart your course through this README treasure map!"
- 🚀 **Launch** — "Ready to launch? This README is your launchpad!"

### Documentation (`docs`)

These footers emphasize guidance and navigation:

- 🧭 **Compass** — "Your compass through the documentation landscape"
- 🏮 **Lighthouse** — "This documentation is your lighthouse in the fog"
- 📜 **Scroll** — "A scroll of knowledge, unfurled for your enlightenment"

### Agent Specifications (`agents`)

These footers celebrate intelligent automation:

- 🤖 **Orchestrated** — "This agent is orchestrated with precision and care"
- 💭 **Thinking** — "Agent specifications: where intelligent systems are born"
- 👥 **Collaborative** — "These agents work together in harmony"

### Instructions & Standards (`instructions`)

These footers convey structure and reliability:

- 📐 **Blueprint** — "The blueprint for getting things right, every time"
- 🧭 **Compass** — "Your north star for standards and best practices"
- 📜 **Scroll** — "The sacred scroll of how we build, together"

### Schema & Validation (`schema`)

These footers emphasize structure and correctness:

- 🏗️ **Structure** — "The structural foundation of our data universe"
- ✓ **Validator** — "Schema validated, data integrity guaranteed"
- 📋 **Contract** — "The contract that keeps our systems in sync"

### Audit & Reports (`audit`)

These footers convey thoroughness and integrity:

- 🔍 **Examined** — "Examined with rigor, reported with integrity"
- 📊 **Findings** — "Findings documented, insights delivered"
- ✅ **Certified** — "Reviewed and certified by the LightSpeedWP audit team"

### Research & Analysis (`research`)

These footers celebrate discovery and inquiry:

- 🔬 **Discovered** — "Discovered through experimentation and curiosity"
- 📚 **Studied** — "Studied thoroughly, findings shared freely"
- 🧬 **Synthesized** — "Synthesized insights from research and observation"

### AI Operations (`ai-ops`)

These footers emphasize intelligent automation:

- 🎼 **Orchestrated** — "Orchestrated automation — where intelligence meets operations"
- ⚙️ **Automated** — "Automated workflows, intelligent decisions"
- 💡 **Intelligent** — "Intelligent operations, powered by AI"

## Adding Footers to Your Documents

### Automatic Category Inference

The footer validation script infers document categories from file paths:

```
agents/*/claude/agent.md          → agents
docs/*.md                         → docs
instructions/*.instructions.md    → instructions
schemas/*.md                       → schema
.github/reports/*.md              → audit
README.md (in any directory)      → readme
```

### Explicit Category in Frontmatter

For more control, declare the category in your document's frontmatter:

```yaml
---
category: agents
quirky_footer: agents-thinking
---

# Your Agent Documentation

Content goes here...
```

### Footer Options in Frontmatter

You can explicitly choose which quirky footer to use:

```yaml
---
category: docs
quirky_footer: docs-lighthouse
---
```

Available footer IDs are listed in `config/quirky-footers.yaml`.

## Configuration

### File Locations

- **Quirky Footer Definitions**: `config/quirky-footers.yaml`
- **Schema Validation**: `schemas/quirky-footers.schema.json`
- **Validation Script**: `scripts/validate-footers.js`

### Configuration Structure

```yaml
categories:
  category-name:
    name: "Display Name"
    quirky_footers:
      - footer-id-1
      - footer-id-2
    default_quirky_footer: footer-id-1

footers:
  footer-id:
    id: footer-id
    name: "Footer Display Name"
    category: category-name
    tone: playful|professional|technical|encouraging|welcoming
    emoji_count: 1-5
    template: |
      ---

      *Footer content here*
    accessibility_notes: "Notes about this footer"
```

## Exclusions

The following files are **exempt** from footer requirements:

### Vendor/Embedded Materials

- `agents/*/skills/*/references/`
- `agents/*/skills/*/examples/`
- `agents/*/skills/*/templates/`
- Files under `plugin-provided/`, `platform-managed/`, `directory-installed/`

### System Files

- Hidden files (`.git/`, `.env`, etc.)
- Node modules and build artifacts

### Templates & Scaffolds

- `.github/ISSUE_TEMPLATE/`
- `.github/PULL_REQUEST_TEMPLATE/`
- `template/`, `example/`, `sample/`, `fixture/` directories

### Archives & Historical Content

- `/.archive/` directories
- `/completed/` and `/deprecated/` directories
- `/legacy/` directories

### References

- `/references/` directories
- `/examples/` and `/samples/` directories
- `/mocks/` directories

## Validation

Run the footer validation script:

```bash
# Check all markdown files
npm run validate:footers

# Check only changed files
node scripts/validate-footers.js --changed-only --base=develop --head=HEAD

# Generate a detailed report
node scripts/validate-footers.js --verbose --report=report.json

# Fix missing footers automatically
node scripts/validate-footers.js --fix
```

## Accessibility Notes

All quirky footers are designed with accessibility in mind:

- **Emoji Usage**: Limited to 1-5 per footer, each serving a purpose
- **Text Clarity**: Footers use clear, simple language
- **Contrast**: Footer text meets WCAG 2.2 AA standards
- **Screen Reader**: Emoji are integrated naturally with text context

## Adding New Footers

To add a new quirky footer:

1. **Add to `config/quirky-footers.yaml`**:

   ```yaml
   new-footer-id:
     id: new-footer-id
     name: "New Footer Name"
     category: category-name
     tone: tone-type
     emoji_count: count
     template: |
       ---

       *Your quirky footer text*
     accessibility_notes: "Your notes"
   ```

2. **Add to category's quirky_footers list**:

   ```yaml
   categories:
     category-name:
       quirky_footers:
         - existing-footer
         - new-footer-id
   ```

3. **Validate against schema**:

   ```bash
   npx ajv validate -s schemas/quirky-footers.schema.json -d config/quirky-footers.yaml
   ```

4. **Test the validation**:

   ```bash
   npm run validate:footers
   ```

## Examples

### README with Telescope Footer

```markdown
---
category: readme
quirky_footer: readme-telescope
---

# My Amazing Project

Welcome to the project...

---

*🔭 Look through the telescope and explore what's possible!*
```

### Agent with Collaborative Footer

```markdown
---
category: agents
quirky_footer: agents-collaborative
---

# My Intelligent Agent

This agent is designed to...

---

*👥 These agents work together in harmony — collaborative intelligence*
```

### Documentation with Compass Footer

```markdown
---
category: docs
---

# API Documentation

Here's how to use the API...

---

*🧭 Your compass through the documentation landscape*
```

## Best Practices

1. **Match the Tone**: Choose a footer that matches your document's tone
2. **Don't Override Lightly**: Use explicit `quirky_footer` in frontmatter only when needed
3. **Maintain Consistency**: Use default footers for similar document types
4. **Consider Emoji**: More emoji doesn't mean better — keep it simple
5. **Test Accessibility**: Verify footers render well in screen readers

## Troubleshooting

### "Missing footer" validation errors

**Problem**: Files are flagged as missing footers when they shouldn't be

**Solution**:

- Check if the file matches an exclusion pattern
- Verify the category is correctly inferred from the file path
- Explicitly declare `category: null` in frontmatter to skip validation

### Footers not appearing

**Problem**: Footer template isn't rendering in the output

**Solution**:

- Ensure the template includes the `---` separator
- Check that the footer ID matches exactly in `config/quirky-footers.yaml`
- Verify the category exists in the configuration

### Schema validation fails

**Problem**: Configuration validation errors when running npm tasks

**Solution**:

- Validate YAML syntax: `npx yamllint config/quirky-footers.yaml`
- Validate against schema: `npx ajv validate -s schemas/quirky-footers.schema.json -d config/quirky-footers.yaml`
- Check for typos in footer IDs and category names

## Related Documentation

- [Footer Configuration](../config/footers.config.yaml) — Standard footers
- [Quirky Footers Configuration](../config/quirky-footers.yaml) — Category-specific footers
- [Footer Validation Schema](../schemas/quirky-footers.schema.json) — Configuration validation
- [Validation Script](../scripts/validate-footers.js) — Automation

---

*📖 Our documentation is where creativity meets clarity*

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

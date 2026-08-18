---
file_type: guide
title: ADR Generator — Installation & Setup Guide
description: Step-by-step setup instructions for all repository contexts
version: 1.0.0
created_date: 2026-08-18
last_updated: 2026-08-18
---

# ADR Generator Installation & Setup

Complete setup guide for deploying the ADR Generator in your repository.

## Prerequisites

- Node.js 18+ or compatible JavaScript runtime
- Git repository initialized
- Write access to repository
- 5 minutes to complete setup

## Installation Steps

### 1. Copy Agent Files

Copy the `agents/adr-generator` directory to your repository:

```bash
cp -r /path/to/lightspeedwp/.github/agents/adr-generator ./agents/
```

### 2. Initialize Configuration

Run the initialization command to create `.adr-config.json`:

```bash
claude adr-generator init
```

This creates a `.adr-config.json` file with sensible defaults for your context.

### 3. Verify Installation

Validate the setup:

```bash
npm test -- agents/adr-generator/tests
```

Expected: Test Suites: 4 passed, 4 total | Tests: 88 passed, 88 total

### 4. Create First ADR

Test the agent by creating your first ADR:

```bash
claude adr-generator create "Initial architectural decision"
```

## Configuration by Context

Select the configuration that matches your repository type.

### Control-Plane Repository

For `.github` control-plane repositories. Directory: `.github/adr/`

### Organization Repository

For general organization repositories. Directory: `docs/adr/`

### WordPress Plugin

For WordPress plugin repositories. Directory: `docs/adr/`, Numbering: Date-based

### WordPress Theme

For WordPress theme repositories. Directory: `docs/decisions/`, Prefix: `decision`

## Post-Installation Setup (Optional)

### Add npm Scripts

```json
{
  "scripts": {
    "adr:create": "claude adr-generator create",
    "adr:validate": "claude adr-generator validate",
    "adr:list": "claude adr-generator list"
  }
}
```

### Configure Pre-commit Hook

Add to `.git/hooks/pre-commit` to validate before commit.

### GitHub Actions Integration

Create `.github/workflows/validate-adr.yml` for CI validation.

## Troubleshooting

### Issue: `.adr-config.json` not found
**Solution:** Run `claude adr-generator init`

### Issue: Tests fail after installation
**Solution:** Verify Node.js 18+, run `npm install`, check file permissions

### Issue: Validation fails on existing ADRs
**Solution:** Review CONFIGURATION_REFERENCE.md for validation rules

## Verification Checklist

- [ ] `.adr-config.json` exists in repo root
- [ ] ADR directory exists and is readable
- [ ] `npm test` passes (88/88 tests)
- [ ] `claude adr-generator create "Test"` creates a file
- [ ] `claude adr-generator validate` shows no errors

## See Also

- [Best Practices](BEST_PRACTICES.md) — When and how to write ADRs
- [Architecture](ARCHITECTURE.md) — System design
- [Configuration Reference](CONFIGURATION_REFERENCE.md) — All options

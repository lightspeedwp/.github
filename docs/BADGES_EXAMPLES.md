---
title: "Badge Examples & Use Cases"
description: "Practical examples of badge implementation across different document types"
file_type: "documentation"
tags: ["badges", "examples", "documentation"]
---

# Badge Examples & Use Cases

**Status:** Active  
**Version:** 1.0.0  
**Last Updated:** 2026-08-08

---

## Table of Contents

1. [Documentation Files](#documentation-files)
2. [Specification Documents](#specification-documents)
3. [Workflow Documentation](#workflow-documentation)
4. [Agent & Automation Docs](#agent--automation-docs)
5. [Project README Examples](#project-readme-examples)

---

## Documentation Files

### Example 1: Standard Documentation

**File:** `docs/CONTRIBUTING.md`

```markdown
---
title: "Contributing Guidelines"
description: "How to contribute to the LightSpeed organisation"
file_type: "documentation"
status: "active"
tags: ["community", "contribution"]
---

# Contributing Guidelines

<!-- BADGES-START -->
[![Checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![Docs Validation](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml)
<!-- BADGES-END -->

Welcome to our contribution guide...
```

**What's included:**

- Workflow badges for checks and documentation validation
- Frontmatter with document metadata
- Proper marker placement after main heading

---

### Example 2: Documentation with License Badge

**File:** `docs/LICENSE.md`

```markdown
---
title: "Project Licenses"
file_type: "documentation"
license: "MIT"
status: "active"
---

# Project Licenses

<!-- BADGES-START -->
[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
<!-- BADGES-END -->

This project is licensed under the MIT License...
```

**What's included:**

- License badge from frontmatter metadata
- Workflow status badge
- Linked badges to relevant resources

---

## Specification Documents

### Example 3: Technical Specification

**File:** `docs/TECHNICAL_SPECIFICATION.md`

```markdown
---
title: "System Technical Specification"
file_type: "specification"
status: "active"
version: "2.0.0"
tags: ["architecture", "technical", "specification"]
---

# Technical Specification

<!-- BADGES-START -->
[![Checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![Docs Validation](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml)
[![Labeling Governance](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml)
<!-- BADGES-END -->

## Overview

This document specifies the technical architecture...
```

**What's included:**

- Multiple workflow badges for quality assurance
- Clear specification document type
- Version tracking in frontmatter

---

## Workflow Documentation

### Example 4: GitHub Actions Workflow Guide

**File:** `docs/WORKFLOW_GUIDE.md`

```markdown
---
title: "GitHub Actions Workflow Guide"
file_type: "guide"
tags: ["workflow", "ci", "automation"]
status: "active"
---

# GitHub Actions Workflow Guide

<!-- BADGES-START -->
[![Checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![Docs Validation](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml)
[![Release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![Main Branch Guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=main)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
<!-- BADGES-END -->

## Overview

This guide explains how our GitHub Actions workflows operate...
```

**What's included:**

- Workflow badges for CI/CD documentation
- Multiple workflows relevant to CI/CD pipeline
- Guide document type classification

---

## Agent & Automation Docs

### Example 5: Agent Implementation Guide

**File:** `agents/my-agent/README.md`

```markdown
---
title: "My Agent Documentation"
file_type: "documentation"
tags: ["agent", "automation", "ai"]
status: "active"
---

# My Agent Documentation

<!-- BADGES-START -->
[![Checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![Docs Validation](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml)
[![Labeling Governance](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml)
[![Metadata Governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
<!-- BADGES-END -->

## Agent Overview

This agent performs...
```

**What's included:**

- Automation-focused workflow badges
- Governance badges for compliance
- Agent classification in frontmatter

---

## Project README Examples

### Example 6: Main Repository README

**File:** `README.md` (root level)

```markdown
# LightSpeed .github

<!-- BADGES-START -->
[![Checks](https://img.shields.io/badge/checks-passing-success.svg)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![Docs Validation](https://img.shields.io/badge/docs-passing-success.svg)](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml)
[![GitLeaks](https://img.shields.io/badge/gitleaks-passing-success.svg)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml)
[![Main Guard](https://img.shields.io/badge/main_branch_guard-passing-success.svg)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![Release](https://img.shields.io/badge/release-passing-success.svg)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
<!-- BADGES-END -->

This is the central control plane for the LightSpeed organisation...
```

**What's included:**

- Status badges with current pass/fail state
- Critical workflow indicators
- Quick visual health check

---

## Badge Customization Examples

### Example 7: Custom Badge Colors

```markdown
<!-- BADGES-START -->
<!-- Red for critical issues -->
[![Critical](https://img.shields.io/badge/status-critical-critical.svg)]()

<!-- Green for success -->
[![Success](https://img.shields.io/badge/status-success-success.svg)]()

<!-- Yellow for warnings -->
[![Warning](https://img.shields.io/badge/status-warning-yellow.svg)]()

<!-- Gray for inactive -->
[![Inactive](https://img.shields.io/badge/status-inactive-lightgrey.svg)]()

<!-- Blue for info -->
[![Info](https://img.shields.io/badge/info-documentation-blue.svg)]()
<!-- BADGES-END -->
```

**Colors available:**

- `success` — Green (#4c1)
- `failure` — Red (#e05d44)
- `yellow` — Yellow (#dfb317)
- `critical` — Dark red (#d00)
- `blue` — Blue (#007ec6)
- `lightgrey` — Light gray (#9f9f9f)

---

## Badge Best Practices

### Do Use Badges For

✅ **Status Indicators**

- Workflow pass/fail status
- Build health
- Test coverage

✅ **Documentation Metadata**

- File type/category
- Status (active, archived, draft)
- License information
- Version number

✅ **Quick Information**

- Project stability
- Compliance status
- Update frequency

---

### Don't Use Badges For

❌ **Excessive Information**

- Don't use more than 5-7 badges per file
- Avoid cluttering the header

❌ **Marketing/Decorative**

- Only use badges with practical information
- Avoid "powered by" or promotional badges

❌ **Outdated Information**

- Ensure badges are automatically updated
- Remove badges if workflow is deleted

---

## Implementation Workflow

### Adding Badges to a New Document

**Step 1: Add Markers**

```markdown
# My Document Title

<!-- BADGES-START -->
<!-- BADGES-END -->

Your content starts here...
```

**Step 2: Add Frontmatter**

```markdown
---
title: "My Document Title"
file_type: "documentation"
tags: ["relevant", "tags"]
status: "active"
---
```

**Step 3: Push and Wait**

- Commit and push to `develop`
- On-push workflow detects markers
- Badges auto-generated based on frontmatter
- Changes committed automatically

**Step 4: Verify**

- View rendered document on GitHub
- Check that badges appear between markers
- Verify links are correct

---

## Troubleshooting Examples

### Issue: Badges Not Appearing

**Check:**

1. Document has `<!-- BADGES-START -->` and `<!-- BADGES-END -->`
2. Document has frontmatter with `---` delimiters
3. Document type is in coverage list (documentation, specification, guide, etc.)
4. File is in `docs/`, `agents/`, or similar directory

**Solution:**

```bash
# Manually trigger workflow
gh workflow run badges-documentation-update.yml -b develop --input target_files="docs/MY_FILE.md"
```

---

### Issue: Broken Badge Links

**Check:**

1. Workflow file exists in `.github/workflows/`
2. Workflow name matches schema exactly
3. No typos in workflow names

**Solution:**

```bash
# Run health check workflow
gh workflow run badges-health-check.yml
# Check the GitHub issue created with broken links
```

---

## Real-World Example: Complete Document

```markdown
---
title: "Agent Development Guide"
description: "Complete guide to developing agents for the platform"
file_type: "guide"
status: "active"
tags: ["agents", "development", "documentation"]
version: "2.0.0"
authors: ["Development Team"]
---

# Agent Development Guide

<!-- BADGES-START -->
[![Checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![Docs Validation](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml)
[![Labeling Governance](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml)
[![Metadata Governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
<!-- BADGES-END -->

## Introduction

This comprehensive guide covers all aspects of agent development...

## Quick Start

### Prerequisites

- Node.js 18+
- npm 8+

### Creating Your First Agent

See the sections below for detailed instructions...
```

---

## Summary

These examples show how to implement badges effectively:

- **Choose document type** — This determines which badges appear
- **Add markers** — Place `<!-- BADGES-START -->` / `<!-- BADGES-END -->`
- **Add frontmatter** — Include document metadata
- **Let workflows run** — Badges generated automatically on push
- **Monitor health** — Weekly checks ensure badges stay valid

For more information, see [BADGES_GOVERNANCE.md](BADGES_GOVERNANCE.md) and [BADGES_TROUBLESHOOTING.md](BADGES_TROUBLESHOOTING.md).

---

*Examples created 2026-08-08 | Phase 3 Integration*

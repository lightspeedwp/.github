# Contributing Changelog Entries

This guide helps you write changelog entries that pass our quality audit system.

## Quick Start

1. Create a new entry file in YAML format
2. Include all required fields: title, description, category, date
3. Run validation: `npm run validate:changelog -- --entry your-entry.yml`
4. Fix any issues reported
5. Commit when validation passes

## Required Fields

- **title** (string, 1-100 chars): User-facing summary of the change
- **description** (string, 20-500 chars): Detailed explanation for users
- **category** (string): One of: feature, fix, improvement, breaking-change, security, performance
- **date** (string, YYYY-MM-DD): Release date
- **pr_references** (array, optional): PR/issue numbers for traceability, e.g., [1234, 5678]

## Quality Rules

### Do's ✓

- Focus on **user benefit**: "Webhooks now retry automatically"
- Use **simple language**: avoid technical jargon
- Keep it **concise**: 1-3 sentences max
- Include **PR reference**: helps with tracking
- Use **consistent tense**: past tense (fixed, improved)
- Be **specific**: what changed, not how it works

### Don'ts ✗

- Code examples or API details
- Implementation details (async/await, classes, functions)
- Internal terminology (middleware, cache layer, database)
- Too many sentences (keep to 1-3)
- Personal pronouns (I, we, you)
- Marketing hype ("revolutionary", "amazing")
- Emoji or excessive punctuation

## Common Mistakes

| Mistake | Bad ✗ | Good ✓ |
|---------|-------|--------|
| Implementation focus | "Refactored webhook service using async/await" | "Webhooks now retry automatically on network errors" |
| Code references | "Fixed API response handling in middleware" | "Fixed webhook delivery reliability" |
| Too technical | "Implemented exponential backoff with Promise.then" | "Improved retry logic for better delivery" |
| Too long | Multi-sentence technical explanation | One clear user benefit statement |
| Missing context | "Optimized performance" | "Page loads 40% faster" |

## Validation & Examples

### Example: Good Entry

```yaml
title: "Webhooks now retry on network errors"
description: |
  Webhooks automatically retry on transient network failures
  with exponential backoff, improving delivery reliability.
category: feature
date: 2026-09-13
pr_references: [2906]
```

**Result**: ✓ PASSING (100/100)

### Example: Bad Entry

```yaml
title: "Fixed webhook API response handling"
description: |
  Implemented retry logic using async/await callbacks
  with exponential backoff. Updated webhook service API
  to return proper HTTP status codes.
category: fix
date: 2026-09-13
pr_references: [2907]
```

**Result**: ✗ FAILING (40/100) - Remove implementation details

## Getting Help

Run validation with verbose output:
```bash
npm run validate:changelog -- --entry your-entry.yml --json
```

See [CHANGELOG_QUALITY_AUDIT.md](../../docs/CHANGELOG_QUALITY_AUDIT.md) for detailed rules and examples.

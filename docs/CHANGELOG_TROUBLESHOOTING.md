# Troubleshooting Changelog Validation

Quick reference for common validation errors and how to fix them.

## Common Errors

### R001: Contains Implementation Details

**Error**: Entry contains implementation details or code patterns

**Common causes**:
- Mentioning specific code: "async/await", "Promise.then", "callback"
- API references: "REST API", "GraphQL endpoint"
- Framework names: "Express.js", "React hooks"
- Internal systems: "database", "cache layer", "middleware"

**Fix example**:
```
❌ "Implemented retry logic using async/await with exponential backoff"
✅ "Webhooks now retry automatically on network errors"
```

**How to fix**:
1. Read the description aloud
2. Remove any code-related words
3. Focus on: what changed for USERS, not HOW it was built
4. Use simple language a non-developer can understand

### R004: Description Too Short

**Error**: Description must be at least 20 characters

**Fix**: Add more detail about what changed and why it matters
```yaml
description: "Fixed bug"  # ❌ Too short (10 chars)
description: "Fixed issue with webhook retries on network errors"  # ✅ Better (57 chars)
```

### R005: Clear Language

**Error**: Description contains unclear or vague language

**Common issues**:
- Vague terms: "optimized", "improved", "better"
- No specifics: "performance improvement" (by how much?)
- Missing context: "fixed stability" (what stability issue?)

**Fix**: Be specific and measurable
```
❌ "Improved performance significantly"
✅ "Page load time reduced by 40% for large datasets"

❌ "Enhanced user experience"
✅ "Users can now configure preferences and sync across devices"
```

### R008: Internal Terminology

**Error**: Entry uses internal/technical terms

**Terminology guide**:
```
Internal Term          → User-Friendly
─────────────────────────────────────
API                    → "integration" or just remove it
Database               → (remove - internal detail)
Cache                  → (remove - internal detail)
Middleware             → (remove - internal detail)
Endpoint               → "access point" or just remove
Algorithm              → (remove - internal detail)
Async/await            → (remove - internal detail)
Promise                → (remove - internal detail)
Thread/Process         → (remove - internal detail)
```

**Fix example**:
```
❌ "Updated webhook API to handle errors in middleware layer"
✅ "Webhooks now handle errors more reliably"
```

### R012: User Focused

**Error**: Entry focuses on implementation, not user benefit

**What users care about**:
- What changed for them?
- Why should they care?
- What problem does it solve?

**Fix**:
```
❌ "Refactored authentication service"
✅ "Simplified login process - now 3 clicks instead of 5"

❌ "Optimized database queries"
✅ "Dashboard loads 2x faster"
```

### R013: No Emoji

**Error**: Entry contains emoji (when enabled)

**Fix**: Remove all emoji
```
❌ "🎉 Added new feature ✨"
✅ "Added new feature"
```

### R015: Date Format

**Error**: Date not in ISO 8601 format (YYYY-MM-DD)

**Accepted formats**:
```
✅ 2026-09-13
✅ 2026-09-14
```

**Wrong formats**:
```
❌ 09/13/2026 (US format)
❌ 13-09-2026 (EU format)
❌ 2026/09/13 (slash separator)
❌ September 13, 2026 (text format)
```

### R017: Appropriate Length

**Error**: Description has too many sentences (should be 1-3 max)

**Fix**: Consolidate or split into multiple entries
```
❌ "Fixed bug X. Also improved feature Y. Added new capability Z. Updated documentation." (4 sentences)

✅ "Fixed bug X and improved feature Y" (2 sentences)
```

### R018: No Personal Pronouns

**Error**: Entry uses "I", "we", "you", etc.

**Fix**: Remove pronouns, make it objective
```
❌ "We improved your experience with webhooks"
✅ "Webhook delivery reliability improved"

❌ "I added support for batch operations"
✅ "Added support for batch operations"
```

### R020: Invalid Category

**Error**: Category is not recognized

**Valid categories**:
- `feature` - New functionality
- `fix` - Bug fix
- `improvement` - Enhancement
- `breaking-change` - API/behavior change
- `security` - Security fix
- `performance` - Performance improvement

**Common mistakes**:
```
❌ category: "Bug"         → use "fix"
❌ category: "Enhancement" → use "improvement"  
❌ category: "Feature"     → use "feature" (lowercase)
❌ category: "bugfix"      → use "fix"
```

## General Strategies

### Strategy 1: Read Aloud Test

1. Read your entry aloud to a colleague
2. Do they understand what changed?
3. Did you mention any code/technical terms?
4. Does it sound natural (not marketing-y)?

If any of the above fails, rewrite.

### Strategy 2: The Grandparent Test

1. Could your grandparent understand this entry?
2. Would they know what changed?
3. Would they care about the benefit?

If not, simplify language and focus on user benefit.

### Strategy 3: Before/After Comparison

```
❌ BEFORE (Technical)
"Implemented exponential backoff retry mechanism in webhook dispatcher
using async callbacks. Updated HTTP status code handling in service layer."

✅ AFTER (User-Focused)
"Webhooks now automatically retry failed deliveries, improving reliability."
```

## JSON Output for Debugging

Use the `--json` flag for detailed error information:

```bash
npm run validate:changelog -- --entry your-entry.yml --json
```

Output includes:
- Exact rule that failed
- Why it failed
- Specific remediation guidance
- Which rules passed

## Still Stuck?

1. Check [CHANGELOG_QUALITY_AUDIT.md](./CHANGELOG_QUALITY_AUDIT.md) for rule details
2. Look at [CONTRIBUTING.md](../agents/changelog/CONTRIBUTING.md) for examples
3. Review [CHANGELOG_EDGE_CASES.md](./CHANGELOG_EDGE_CASES.md) for special scenarios
4. Run validation with `--json` flag for detailed diagnostics

Example of well-formed entries:
- ✅ "Webhooks now retry automatically on network errors"
- ✅ "Dashboard loads 40% faster for large datasets"
- ✅ "User preferences now sync across all devices"
- ✅ "Fixed critical security vulnerability in API authentication"

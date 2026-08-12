# @lightspeedwp/metadata-agent

Shared npm package for metadata operations in the LightSpeedWP ecosystem.

Provides label utilities, GitHub API integration, metadata validation, confidence scoring, and error handling for use across the GitHub control plane and WordPress block repositories.

## What This Is

This package encapsulates core functionality for the **metadata synchronization agent**, a system that maintains consistency between GitHub Issues/PRs and their associated metadata:

- **Label parsing & validation** — Extract, validate, and suggest GitHub labels
- **GitHub API integration** — Authenticated API access with retry logic and rate limit handling
- **Three-tier validation** — Blockers (Tier 1), Warnings (Tier 2), and Info (Tier 3)
- **Confidence scoring** — Determine when automated label actions are safe
- **Error handling** — Classification, recovery strategies, and user-friendly suggestions

## Installation

```bash
npm install @lightspeedwp/metadata-agent
```

## Quick Start

### Label Operations

```javascript
import { labelUtils } from '@lightspeedwp/metadata-agent';

// Parse a label
const parsed = labelUtils.parse('type:bug');
// → { family: 'type', name: 'bug', full: 'type:bug' }

// Validate a label
const validation = labelUtils.validate('type:bug');
// → { valid: true, label: 'type:bug', suggestion: null, reason: '...' }

// Get suggestions for a typo
const suggestions = labelUtils.suggest('type:bugg');
// → ['type:bug']

// Score label relevance (0-100)
const score = labelUtils.score('type:bug', {
  issueType: 'bug',
  existingLabels: []
});
// → 95
```

### GitHub API Integration

```javascript
import { createClient, authenticateClient } from '@lightspeedwp/metadata-agent';

// Create and authenticate a client
const client = new createClient({
  token: process.env.GITHUB_TOKEN
});

const user = await client.authenticate();
console.log(user.login); // 'octocat'

// Fetch issues
const issues = await client.getIssues({
  owner: 'lightspeedwp',
  repo: '.github',
  state: 'open',
  labels: ['type:bug']
});

// Apply labels with retry
await client.applyLabels({
  owner: 'lightspeedwp',
  repo: '.github',
  issue_number: 123,
  labels: ['type:bug', 'priority:high']
});

// Handle rate limits
const limits = await client.getRateLimit();
if (limits.remaining < 10) {
  await client.handleRateLimit();
}
```

### Validation System

```javascript
import {
  validateTier1,
  validateTier2,
  validateTier3,
  getRecommendation
} from '@lightspeedwp/metadata-agent';

// Fetch issues to validate
const issues = await client.getIssues({ owner, repo, state: 'open' });

// Tier 1: Check blockers (must pass before any release)
const tier1 = validateTier1(issues);
if (!tier1.passed) {
  console.log(`Blockers: ${tier1.count} issues need attention`);
  tier1.blockers.forEach(b => console.log(`  - ${b.rule}: ${b.message}`));
}

// Tier 2: Check warnings (should pass before minor/major releases)
const tier2 = validateTier2(issues);

// Tier 3: Get informational insights
const tier3 = validateTier3(issues);

// Get recommendation
const recommendation = getRecommendation('minor', tier1, tier2);
console.log(`Action: ${recommendation.action}`); // 'proceed', 'check', or 'block'
console.log(`Reason: ${recommendation.reason}`);
```

### Confidence Scoring

```javascript
import { createScorer } from '@lightspeedwp/metadata-agent';

const scorer = createScorer({ threshold: 70 });

// Calculate confidence for a label
const score = scorer.calculate('type:bug', {
  issueTitle: 'Button not working on mobile',
  existingLabels: [],
  issueType: 'bug'
});
// → 92

// Check if score meets threshold
if (scorer.isConfident(score)) {
  // Safe to auto-apply
} else {
  // Request human review
}

// Get detailed assessment
const assessment = scorer.assess(score);
// → { score: 92, threshold: 70, confident: true, action: 'auto-apply', ... }
```

### Error Handling

```javascript
import { errorHandler } from '@lightspeedwp/metadata-agent';

try {
  await api.getIssues();
} catch (error) {
  // Classify the error
  const handled = errorHandler.catch(error);
  console.log(`Type: ${handled.type}`); // 'rate_limit', 'authentication', etc.
  console.log(`Recovery: ${handled.recovery}`);

  // Get suggestions
  if (handled.retriable) {
    const suggestions = errorHandler.suggest(error);
    suggestions.immediate.forEach(action => console.log(`Try: ${action}`));
  }

  // Retry with backoff
  try {
    const result = await errorHandler.retry(
      () => api.getIssues(),
      { maxAttempts: 3, backoffMs: 1000 }
    );
  } catch (finalError) {
    console.error(errorHandler.format(finalError));
  }
}
```

## API Reference

### labelUtils

Label parsing, validation, suggestion, and scoring.

#### `parse(label)`
Parse a label string into family and name components.

```javascript
parse('type:bug') // → { family: 'type', name: 'bug', full: 'type:bug' }
```

#### `validate(label)`
Validate a label against the canonical set.

```javascript
validate('type:bug') // → { valid: true, ... }
validate('type:buge') // → { valid: false, suggestion: 'type:bug', ... }
```

#### `suggest(label, maxSuggestions)`
Find similar canonical labels.

```javascript
suggest('type:bugg', 3) // → ['type:bug']
```

#### `score(label, context)`
Score label relevance (0-100).

```javascript
score('type:bug', { issueType: 'bug', existingLabels: [] }) // → 95
```

#### `getFamilies()`
Get all label families.

```javascript
getFamilies() // → ['type', 'status', 'area', 'meta', 'priority', ...]
```

#### `getLabelsByFamily(family)`
Get canonical labels in a family.

```javascript
getLabelsByFamily('type') // → ['type:bug', 'type:feature', ...]
```

#### `getAllCanonical()`
Get all canonical labels.

```javascript
getAllCanonical() // → ['type:bug', 'type:feature', 'status:open', ...]
```

### apiClient

GitHub API client with authentication, retry logic, and rate limit handling.

#### `createClient(options)`
Create an API client instance.

```javascript
const client = createClient({
  token: process.env.GITHUB_TOKEN,
  baseUrl: 'https://api.github.com',
  maxRetries: 3,
  rateLimitWait: 60000
});
```

#### `authenticateClient(options)`
Create and authenticate in one step.

```javascript
const client = await authenticateClient({
  token: process.env.GITHUB_TOKEN
});
```

#### `client.authenticate()`
Verify token and get user info.

```javascript
const user = await client.authenticate();
// → { login: 'octocat', name: '...', email: '...', type: 'User' }
```

#### `client.getIssues(options)`
Fetch issues from a repository.

```javascript
const issues = await client.getIssues({
  owner: 'lightspeedwp',
  repo: '.github',
  state: 'open',
  labels: ['type:bug'],
  per_page: 30,
  page: 1
});
```

#### `client.applyLabels(options)`
Apply labels to an issue.

```javascript
await client.applyLabels({
  owner: 'lightspeedwp',
  repo: '.github',
  issue_number: 123,
  labels: ['type:bug', 'priority:high']
});
```

#### `client.removeLabels(options)`
Remove labels from an issue.

```javascript
await client.removeLabels({
  owner: 'lightspeedwp',
  repo: '.github',
  issue_number: 123,
  labels: ['status:in-progress']
});
```

#### `client.getRateLimit()`
Get current rate limit status.

```javascript
const limits = await client.getRateLimit();
// → { remaining: 58, limit: 60, reset: 1628765400, resetTime: Date(...) }
```

#### `client.handleRateLimit()`
Wait for rate limit to reset.

```javascript
await client.handleRateLimit();
```

#### `client.retry(fn, options)`
Retry a function with exponential backoff.

```javascript
const issues = await client.retry(
  () => client.getIssues({ owner, repo }),
  { maxAttempts: 5, backoffMs: 1000 }
);
```

### validation

Three-tier validation system for metadata consistency.

#### `validateTier1(issues)`
Check blockers (must pass for any release).

Returns: `{ passed, blockers, count, total, details }`

Tier 1 checks:
- All issues have type label
- No conflicting labels
- All PRs have status label
- Milestone is populated

#### `validateTier2(issues)`
Check warnings (should pass for minor/major releases).

Returns: `{ passed, warnings, count, total, details }`

Tier 2 checks:
- High label coverage (95%+)
- All issues have priority label
- Consistent area labels
- Changelog tracking

#### `validateTier3(issues)`
Get informational insights (always passes).

Returns: `{ passed: true, info, count, total, details }`

Tier 3 checks:
- Average labels per issue
- Label family distribution

#### `getRecommendation(releaseType, tier1, tier2)`
Get action recommendation based on validation.

```javascript
const recommendation = getRecommendation('minor', tier1Result, tier2Result);
// → { action: 'proceed' | 'check' | 'block', reason: '...', details: {...} }
```

### confidenceScorer

Confidence scoring for automated label actions.

#### `createScorer(options)`
Create a confidence scorer instance.

```javascript
const scorer = createScorer({
  threshold: 70,
  weights: {
    canonicality: 0.30,
    contextMatch: 0.25,
    noConflict: 0.25,
    frequency: 0.20
  }
});
```

#### `scorer.calculate(label, context)`
Calculate confidence score (0-100).

```javascript
const score = scorer.calculate('type:bug', {
  issueTitle: 'Button broken',
  existingLabels: [],
  issueType: 'bug'
});
// → 92
```

#### `scorer.getThreshold()`
Get current confidence threshold.

```javascript
const threshold = scorer.getThreshold(); // → 70
```

#### `scorer.setThreshold(threshold)`
Set new confidence threshold.

```javascript
scorer.setThreshold(80);
```

#### `scorer.isConfident(score)`
Check if score meets threshold.

```javascript
if (scorer.isConfident(score)) {
  // Safe to auto-apply
}
```

#### `scorer.assess(score, reason)`
Get detailed confidence assessment.

```javascript
const assessment = scorer.assess(92);
// → { score: 92, threshold: 70, confident: true, action: 'auto-apply', reason: '...' }
```

### errorHandler

Error classification, recovery strategies, and suggestions.

#### `errorHandler.catch(error)`
Classify an error and get recovery suggestions.

Returns: `{ type, message, recovery, retriable, code }`

Error types:
- `authentication` — Invalid or missing token
- `authorization` — Token lacks necessary scopes
- `rate_limit` — GitHub API rate limit exceeded
- `not_found` — Resource not found
- `validation` — Invalid input parameters
- `conflict` — Resource state conflict
- `network` — Network/connectivity error
- `unknown` — Unclassified error

#### `errorHandler.retry(fn, options)`
Retry a function with exponential backoff.

```javascript
const result = await errorHandler.retry(
  () => api.getIssues(),
  {
    maxAttempts: 3,
    backoffMs: 1000,
    maxBackoffMs: 60000,
    onRetry: (context) => console.log(`Attempt ${context.attempt}...`)
  }
);
```

#### `errorHandler.suggest(error)`
Get actionable suggestions for recovering from an error.

Returns: `{ type, immediate, checks, escalation }`

#### `errorHandler.format(error, includeStack)`
Format an error for display.

```javascript
console.error(errorHandler.format(error));
// Output:
// [AUTHENTICATION ERROR]
// GitHub authentication failed: Invalid token
//
// Recovery: Check GITHUB_TOKEN environment variable
```

## Error Handling

### Common Errors and Fixes

**Authentication Failed**
```
Check GITHUB_TOKEN is set: echo $GITHUB_TOKEN
Verify token is not expired
Regenerate at: github.com/settings/tokens
```

**Authorization Failed**
```
Check token has 'repo' and 'read:org' scopes
Verify account has access to the repository
Check if organization requires SAML/SSO
```

**Rate Limit Exceeded**
```
Wait a few minutes before retrying
Check rate limit: gh api rate_limit
Use --delay flag for batch operations
```

**Label Not Found**
```
Verify label exists: gh label list
Check label family is correct (type:, status:, etc.)
Label names are case-sensitive
```

## Contributing

Contributions are welcome! Please see the main repository [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

### Testing

```bash
npm test                    # Run all tests
npm run test:coverage      # Generate coverage reports
npm run test:watch        # Watch mode for development
```

### Code Quality

```bash
npm run lint              # Lint code
npm run format            # Format code
npm run format:check      # Check formatting
```

## License

MIT — see [LICENSE](./LICENSE) for details

## Related

- [metadata-agent](/agents/metadata-agent/) — Portable agent using this package
- [.github/agents/project-meta-sync.agent.md](../../.github/agents/project-meta-sync.agent.md) — Control plane agent specification
- [Issue Maintenance Scripts](../../scripts/automation/) — Label orchestrator and maintenance tooling

---

Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!

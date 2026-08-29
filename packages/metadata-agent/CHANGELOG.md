# Changelog

All notable changes to @lightspeedwp/metadata-agent are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned for 1.0.0

- [ ] Complete integration test suite (20-30 tests)
- [ ] Complete E2E test suite (5-10 tests)
- [ ] GraphQL API support for GitHub Projects v2
- [ ] Batch label operations optimization
- [ ] Advanced confidence scorer with ML-based predictions
- [ ] Label suggestion engine based on issue content
- [ ] Multi-language support for suggestions

## [1.0.0-rc.1] — 2026-08-12

### Added

#### Label Utilities (`label-utils.js`)

- `parse()` — Parse label string into family and name components
- `validate()` — Validate label against canonical set with suggestions
- `suggest()` — Find similar canonical labels for typo correction
- `score()` — Score label relevance (0-100) based on context
- `getFamilies()` — Get all label families
- `getLabelsByFamily()` — Get canonical labels in a family
- `getAllCanonical()` — Get all canonical labels

#### API Client (`api-client.js`)

- `createClient()` — Create authenticated GitHub API client
- `authenticateClient()` — Create and authenticate in one step
- `GitHubAPIClient.authenticate()` — Verify token and get user info
- `GitHubAPIClient.getIssues()` — Fetch issues with filtering
- `GitHubAPIClient.applyLabels()` — Apply labels to issues
- `GitHubAPIClient.removeLabels()` — Remove labels from issues
- `GitHubAPIClient.setProjectFields()` — Set GitHub Projects field values (stub)
- `GitHubAPIClient.getRateLimit()` — Check rate limit status
- `GitHubAPIClient.handleRateLimit()` — Wait for rate limit reset
- `GitHubAPIClient.retry()` — Retry with exponential backoff

#### Validation (`validation.js`)

- `validateTier1()` — Check blocker validation rules
  - All issues have type label
  - No conflicting labels
  - All PRs have status label
  - Milestone is populated
- `validateTier2()` — Check warning validation rules
  - High label coverage (95%+)
  - All issues have priority label
  - Consistent area labels
  - Changelog tracking
- `validateTier3()` — Get informational insights
  - Average labels per issue
  - Label family distribution
- `getRecommendation()` — Get action recommendation for releases

#### Confidence Scorer (`confidence-scorer.js`)

- `createScorer()` — Create confidence scorer instance
- `ConfidenceScorer.calculate()` — Calculate confidence score (0-100)
- `ConfidenceScorer.getThreshold()` — Get confidence threshold
- `ConfidenceScorer.setThreshold()` — Set new threshold
- `ConfidenceScorer.isConfident()` — Check if score meets threshold
- `ConfidenceScorer.assess()` — Get detailed assessment with reasoning

#### Error Handler (`error-handler.js`)

- `errorHandler.catch()` — Classify error and get recovery strategy
- `errorHandler.retry()` — Retry with exponential backoff
- `errorHandler.suggest()` — Get actionable error recovery suggestions
- `errorHandler.format()` — Format error for user display
- Error type classification (authentication, authorization, rate_limit, not_found, validation, conflict, network, unknown)

#### Main Module (`index.js`)

- Export all modules via main entry point
- Provide unified `api` namespace for convenience
- Version export

### Documentation

- Comprehensive README with usage examples
- API reference for all modules
- Quick start guide with common patterns
- Error handling guide with recovery strategies
- TypeScript type definitions

### Package Configuration

- `package.json` with proper exports
- Named exports for each module
- Runtime dependencies: @octokit/rest, dotenv, lodash, pino
- Development dependencies: jest, testing-library, nock, nyc, eslint, prettier
- Node.js 18+ requirement
- npm 9+ requirement

### Test Structure (Stubs)

- `src/__tests__/` — Unit test directory structure
- `tests/integration/` — Integration test directory
- `tests/e2e/` — E2E test directory
- `tests/fixtures/` — Test data directory
- `tests/coverage/` — Coverage report directory

### Type Definitions

- `types/index.d.ts` — Main type definitions
- `types/api.d.ts` — API client types
- `types/validation.d.ts` — Validation system types

## Phase 5B.4 Context

This is release candidate 1 (1.0.0-rc.1) built during Phase 5B.4: Build npm Package.

**Scope:**

- Shared npm package for use in both control plane agent and portable agents
- Foundation for Phase 5B.5 (tests) and Phase 5C (portable agent)
- Enables code reuse across GitHub control plane and WordPress block repositories

**Status:**

- ✅ Package structure created
- ✅ Core modules implemented (6 modules)
- ✅ Documentation completed
- ✅ TypeScript types added
- ⏳ Unit tests (Phase 5B.5)
- ⏳ Integration tests (Phase 5B.5)
- ⏳ E2E tests (Phase 5B.5)
- ⏳ npm publish (Phase 5B.5)

**Next Steps:**

1. Phase 5B.5: Build test suite (unit, integration, E2E)
2. Phase 5C: Create portable agent using this package
3. Phase 5D: Create portable agent extensions for block repos

---

## Key Design Decisions

### Three-Tier Validation

Validation is split into three tiers to match release workflows:

- **Tier 1 (Blockers):** Must pass for patch/minor/major releases
- **Tier 2 (Warnings):** Should pass for minor/major releases
- **Tier 3 (Info):** Never blocks, informational only

### Confidence Scoring

Confidence scores (0-100) help determine when automated actions are safe:

- Score >= threshold (default: 70) → auto-apply
- Score < threshold → request human review

### Error Handling

Errors are classified for automatic recovery:

- Retriable errors (rate limit, timeout, 5xx) → auto-retry
- Non-retriable errors (auth, validation, 4xx) → fail fast

### Module Exports

Each module exports both:

- Individual functions (for selective imports)
- Namespace object (for convenience)

Example:

```javascript
// Selective import
import { parse } from '@lightspeedwp/metadata-agent/label-utils';

// Namespace import
import { labelUtils } from '@lightspeedwp/metadata-agent';

// Main entry point
import api from '@lightspeedwp/metadata-agent';
```

---

## Semantic Versioning

- **Major (X.0.0)** — Breaking changes to API or validation rules
- **Minor (0.X.0)** — New features, backward compatible
- **Patch (0.0.X)** — Bug fixes, no API changes

Current release: **1.0.0-rc.1** (Release Candidate 1)

- Breaking changes may still occur before stable release
- Internal APIs are not yet frozen
- Feedback welcome for improvements

---

Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!

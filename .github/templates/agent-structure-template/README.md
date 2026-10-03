# {Agent Name}

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![ai-feedback-validation](https://github.com/lightspeedwp/.github/actions/workflows/ai-feedback-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/ai-feedback-validation.yml)
[![ai-feedback](https://github.com/lightspeedwp/.github/actions/workflows/ai-feedback.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/ai-feedback.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-unified](https://github.com/lightspeedwp/.github/actions/workflows/changelog-unified.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-unified.yml)
[![claude-guard-tests](https://github.com/lightspeedwp/.github/actions/workflows/claude-guard-tests.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/claude-guard-tests.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![keep-pr-current](https://github.com/lightspeedwp/.github/actions/workflows/keep-pr-current.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/keep-pr-current.yml)
[![label-drift-check](https://github.com/lightspeedwp/.github/actions/workflows/label-drift-check.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/label-drift-check.yml)
[![labeling-unified](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml)
[![linear-review-platform](https://github.com/lightspeedwp/.github/actions/workflows/linear-review-platform.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/linear-review-platform.yml)
[![orchestrate-phase-progression](https://github.com/lightspeedwp/.github/actions/workflows/orchestrate-phase-progression.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/orchestrate-phase-progression.yml)
[![phase-progression](https://github.com/lightspeedwp/.github/actions/workflows/phase-progression.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/phase-progression.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![tests](https://github.com/lightspeedwp/.github/actions/workflows/tests.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/tests.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

{Brief one-sentence description}

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

```bash
npm install @lightspeedwp/{agent-id}
```

## Quick Start

### As a Claude Agent

```javascript
import { {AgentClass} } from '@lightspeedwp/{agent-id}';

const agent = new {AgentClass}({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const result = await agent.execute({
  // execution parameters
});
```

### CLI Usage

```bash
npx @lightspeedwp/{agent-id} --help
```

## Configuration

See [`config/config.json`](./config/config.json) for all configuration options.

### Environment Variables

- `ANTHROPIC_API_KEY` - Claude API key (required)
- `AGENT_TIMEOUT` - Request timeout in ms (default: 30000)
- `AGENT_RETRIES` - Number of retries (default: 3)

## Skills

This agent includes the following skills:

- [{skill-name}](./skills/{skill-id}/README.md) - Description

## Testing

Run the test suite:

```bash
npm test

# With coverage
npm run test

# Watch mode
npm run test:watch
```

**Test Framework**: [Jest | Bats | Playwright]

**Coverage Target**: 80%

**Test Files**:

- Unit tests: `tests/unit/`
- Integration tests: `tests/integration/` (if applicable)

## Architecture

```
{agent-name}/
├── AGENT.md                 # Agent definition
├── CHANGELOG.md             # Version history
├── package.json             # Dependencies and scripts
├── README.md                # This file
├── skills/                  # Agent-specific skills
│   ├── {skill-1}/
│   └── {skill-2}/
├── tests/                   # Test files
│   ├── {agent-name}.test.js
│   ├── unit/
│   └── integration/
└── config/                  # Configuration
    └── config.json
```

## API Reference

### Main Class: `{AgentClass}`

```typescript
class {AgentClass} {
  constructor(options: {AgentOptions})
  execute(input: {InputType}): Promise<{OutputType}>
  // ... other methods
}
```

See [Full API Documentation](./AGENT.md) for details.

## Troubleshooting

### Issue: [Common Problem]

**Solution**: [Steps to resolve]

For more issues, see [FAQs](./docs/FAQ.md) or open an [issue](https://github.com/lightspeedwp/.github/issues).

## Contributing

1. Read [CONTRIBUTING.md](../../CONTRIBUTING.md)
2. Create a feature branch
3. Write tests for new features
4. Submit a PR

## Dependencies

### Production

- `@anthropic-ai/sdk` - Claude API client

### Development

- `jest` - Testing framework
- `typescript` - Type checking
- `eslint` - Linting
- `prettier` - Code formatting

See [package.json](./package.json) for versions.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and breaking changes.

## License

MIT - See [LICENSE](../../LICENSE) for details

## Support

- GitHub Issues: <https://github.com/lightspeedwp/.github/issues>
- Email: <engineering@lightspeedwp.agency>
- Slack: #engineering

---

**Maintained by**: @{maintainer}

**Last Updated**: {date}

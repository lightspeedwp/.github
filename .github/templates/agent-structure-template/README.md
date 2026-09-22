# {Agent Name}

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

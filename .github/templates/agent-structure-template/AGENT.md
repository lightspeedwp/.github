# Agent Template: {Agent Name}

**Type**: Agent | **Version**: 1.0.0 | **Status**: Active

## Description

Brief description of what this agent does and its primary responsibilities.

## Capabilities

- Capability 1
- Capability 2
- Capability 3

## Skills

This agent uses the following skills:

- `skill-one`: Description
- `skill-two`: Description

## Configuration

See `config/` folder for environment and runtime configuration.

## Usage

### As a Reusable Action

```yaml
- uses: lightspeedwp/.github/agents/{agent-name}@main
  with:
    param-one: value
```

### As a Node.js Module

```javascript
const Agent = require('agents/{agent-name}');
const agent = new Agent(options);
```

## Testing

Run tests with:

```bash
npm test -- agents/{agent-name}
```

## Support

For issues, open a GitHub issue or contact the maintainers.

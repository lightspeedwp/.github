# {Agent Name}

**Quick Summary**: One-line description of what this agent does.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Skills](#skills)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

```bash
npm install agents-{agent-name}
```

Or use as a GitHub Action:

```yaml
- uses: lightspeedwp/.github/agents/{agent-name}@main
```

## Usage

### Basic Example

```javascript
import { AgentName } from 'agents-{agent-name}';

const agent = new AgentName({
  option1: 'value'
});

agent.execute().then(result => {
  console.log('Success:', result);
});
```

### As GitHub Action

```yaml
- name: Run {Agent Name}
  uses: lightspeedwp/.github/agents/{agent-name}@main
  with:
    input-param: value
```

## Configuration

Configuration options can be set via:

1. **Environment Variables**: See `config/.env.example`
2. **Config Files**: See `config/default.json`
3. **Runtime Options**: Pass options to agent constructor

## Skills

This agent depends on the following skills:

- [skill-one](../../skills/skill-one) - Description
- [skill-two](../../skills/skill-two) - Description

## Testing

```bash
# Run all tests
npm test -- agents/{agent-name}

# Run specific test
npm test -- agents/{agent-name}/tests/specific.test.js

# Run with coverage
npm test -- agents/{agent-name} --coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update tests
5. Update CHANGELOG.md
6. Submit a pull request

## Related

- [Agent Registry](../registry.json) - Discover other agents
- [Skills Registry](../../skills/registry.json) - Find available skills
- [Structure Guide](.github/docs/AGENT_FOLDER_STRUCTURE.md) - Folder structure requirements

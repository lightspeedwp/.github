# Task Researcher Agent — Copilot Provider Implementation

## Provider Configuration

- **Model:** copilot-gpt-4-turbo (GitHub Copilot Enterprise)
- **Temperature:** 0.6 (structured analysis)
- **Max Tokens:** 6000 (GitHub context window optimization)
- **Integration:** GitHub issues, PRs, discussions for context

## Copilot-Specific Optimizations

### GitHub-Native Integration

This implementation leverages Copilot's deep GitHub integration:

- Accesses GitHub issue history for context
- References PR discussions and decisions
- Integrates with GitHub Projects for scope tracking
- Pulls existing documentation and wiki

### Requirement Extraction from Issues

Copilot can extract requirements from:

- GitHub issue descriptions and comments
- PR discussion threads
- GitHub Discussions
- Linked artifacts and references

### Constraint Identification

Copilot integrates constraints from:

- Project board status and roadmap
- Team assignment and capacity
- Repository branch protection rules
- CI/CD pipeline requirements

## Implementation Notes

This agent is optimized for Copilot's GitHub-native capabilities:

1. **GitHub context awareness** — Automatically incorporates issue history and PR discussions
2. **Multi-artifact synthesis** — Combines insights from issues, PRs, discussions, and docs
3. **Team integration** — Understands team structure and capacity from GitHub organization
4. **Workflow compliance** — Aligns research with repository branching and CI/CD policies

## Testing

- Unit tests: GitHub API integration, issue parsing
- Integration tests: Multi-issue requirement synthesis
- Fixture tests: Sample GitHub issues with expected research outputs

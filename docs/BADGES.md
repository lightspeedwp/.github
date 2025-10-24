# Badges Automation

This repo uses an automated Badges Agent to keep workflow badges up to date in all README.md files.

## How it works

- Finds all workflows in `.github/workflows/`
- Generates badges for each and inserts them in a dedicated block in README.md
- Ensures badges are never stale and always reflect current workflow state

## References

- [badges.agent.md](.github/agents/badges.agent.md)
- [badges.instructions.md](.github/agents/badges.instructions.md)
- [update-badges.sh](scripts/update-badges.sh)

# Changelog — PR Agent

All notable changes to the PR Agent are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-09-21

### Changed

- Merged `agents/pr-creation-agent/` into this agent — it no longer exists as a separate directory
- Corrected `package.json` identity: was misidentified as `@lightspeedwp/pr-creation-agent`, with a `main` entry pointing at a file that did not exist in this agent
- Rewrote `AGENT.md` to describe this agent's own six real skills, replacing content that had been a byte-for-byte copy of the removed agent's placeholder
- Restructured all six skills to the [Agent Skills specification](https://agentskills.io/specification) shape: `SKILL.md` with real instructions, executable logic under `scripts/`, tests under `scripts/__tests__/`
- Fixed `validate-branch-name`'s forbidden-prefix list (`claude/`, `bot/`, `automated/` → `claude/`, `copilot/`, `openai/`) and allowed-type list (added `task`, `doc`, `aiops`, `automation`, `epic`) to match `docs/BRANCHING_STRATEGY.md` exactly — this list previously had no test coverage at all

### Added

- `eslint.config.js` — ESLint 10 flat configuration, adopted from `pr-creation-agent` (the only working lint configuration either agent had)
- `README.md`, `CHANGELOG.md` (this file)
- Real `SKILL.md` content for all six skills, replacing the unfilled `template-skill` placeholder
- Test coverage for `validate-branch-name`'s forbidden-prefix and allowed-type lists

### Fixed

- `@babel/core` missing as a dependency despite `@babel/preset-env` requiring it as a peer
- `babel-jest` version mismatch with `@babel/core` 8
- An unused-variable lint violation in `orchestrate-pr-creation`'s test suite, uncaught until this agent had a working lint configuration

## [1.0.0] - 2026-08-01

### Added

- Initial six skills: `route-pr-template`, `handle-pr-errors`, `validate-branch-name`, `orchestrate-pr-creation`, `validate-and-apply-labels`, `submit-pr`
- Jest unit and integration test suites

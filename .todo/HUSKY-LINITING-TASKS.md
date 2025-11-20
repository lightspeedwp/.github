# Husky & Linting Documentation Task List

This document tracks the outstanding and completed tasks for updating and integrating linting and Husky pre-commit documentation and configuration in this repository.

## Todo List

- [ ] **Complete LINTING.md documentation**
  - Finish the existing `docs/LINTING.md` file by adding missing sections: config file references, links to `docs/config/*.md` files, complete tool configurations, and cross-references to HUSKY documentation
- [ ] **Create HUSKY-PRECOMMITS.md documentation**
  - Create comprehensive `docs/HUSKY-PRECOMMITS.md` file covering: `.husky` folder structure, bypass methods, suppression storage locations, recommended commands, usage guide, getting started, and best practices
- [ ] **Cross-link LINTING and HUSKY docs**
  - Ensure proper interlinking between `LINTING.md` and `HUSKY-PRECOMMITS.md` files, sharing context without repetition, and maintaining clear references between the two systems
- [ ] **Update docs/config/npm-scripts.md**
  - Update to reflect current `package.json` scripts including new lint commands, test scripts, and other npm commands that have been added recently
- [ ] **Update docs/config/lint-eslint.md**
  - Update ESLint configuration documentation to match current `eslint.config.js` flat config format, new rules, and integration with other tools
- [ ] **Create missing config documentation files**
  - Create documentation for other config files like `babel.config.js`, `prettier.config.js`, `playwright.config.js`, `jest.config.js`, and other configuration files in `docs/config/`
- [ ] **Update .vscode/settings.json**
  - Align VS Code settings with latest linting standards, npm commands, and project configuration to ensure consistent development experience
- [ ] **Update .vscode/tasks.json**
  - Add tasks for all npm scripts and linting commands, ensuring developers can easily run linting, testing, and other commands from VS Code
- [ ] **Update .vscode/launch.json**
  - Configure debugging settings for Jest tests, Node.js scripts, and other development tasks to align with current project structure
- [ ] **Update .vscode/extensions.json**
  - Recommend extensions that align with current linting tools, configuration files, and development workflow
- [ ] **Cross-reference all documentation**
  - Ensure all documentation files properly reference each other, creating a cohesive documentation ecosystem with proper linking between config files, processes, and guides
- [ ] **Validate documentation completeness**
  - Review all documentation to ensure every configuration file, npm script, and process is properly documented with examples, usage instructions, and troubleshooting guidance

---

*Last updated: 24 October 2025*

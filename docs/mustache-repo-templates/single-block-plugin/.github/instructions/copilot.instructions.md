# Copilot Instructions — Single Block Plugin Template

## Purpose

Generate a WordPress block plugin repository with a single block, using mustache placeholders throughout all files for easy customization.

## Required Steps

1. Scaffold a plugin structure as described in `block-plugin-template.md`
2. **Include all config files**:
   - .editorconfig
   - eslint.config.js / .eslintrc
   - stylelint.config.js
   - postcss.config.js
   - playwright.config.js
   - phpunit.xml
   - phpcs-baseline.xml
   - package.json
   - composer.json
   - vscode-extensions.txt
   - README.md, DEVELOPMENT.md, USAGE.md, SUPPORT.md, SECURITY.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md
3. **Source files**:
   - src/index.js, src/edit.js, src/save.js, src/block.json, src/style.scss, src/editor.scss (all with mustache placeholders)
   - {{slug}}.php (plugin main file)
   - render.php (for dynamic blocks)
4. **Husky and lint-staged**: Set up pre-commit and pre-push hooks for linting and testing.
5. **GitHub Actions**: Add CI/CD workflows for build, lint, test, and release automation.
6. **README.md**: Provide setup, build, customization, and references to LightSpeed and WordPress standards.
7. **VS Code Extensions**: Recommend using extensions listed in vscode-extensions.txt.
8. **Documentation**: Maintain thorough developer and user docs (DEVELOPMENT.md, USAGE.md, etc.).
9. **All files must use mustache placeholders** for customizable values.

## Notes

- All generated files must be standards-compliant (PHP, JS, CSS, HTML).
- Use modern block development practices (`@wordpress/scripts`, functional components, hooks).
- Reference [build-process-single-block-plugin.md](./build-process-single-block-plugin.md) for build steps and standards.
- Link to related examples/templates from [WordPress/block-development-examples](https://github.com/WordPress/block-development-examples) and [lightspeedwp/copyright-date-block](https://github.com/lightspeedwp/copyright-date-block).

## Quick Setup Commands

This section provides a streamlined set of commands to rapidly set up your development environment. These commands will install all necessary system tools, global CLI utilities, and project-specific dependencies required for WordPress block development.

Run these commands first to install all required system tools and global CLIs before configuring project dependencies:

```sh
# System tools
brew install node nvm composer curl gh git mysql-client php rsync shellcheck wp-cli python3
brew install --cask docker
brew install pantheon-systems/terminus/terminus

# Global npm CLIs
npm install -g markdownlint-cli eslint

# Global Python CLIs
pip3 install yamllint

# Project npm packages
npm install

# Project composer packages
composer install
```

# Development Tools & Packages Reference

This document lists all the essential apps, CLI tools, and packages required for developing and maintaining the `copyright-date-block` WordPress plugin on macOS. It covers global system tools, project-specific npm and composer packages, and recommended VS Code extensions.

---

## 1. Global System Tools (Install via Homebrew)

These fundamental tools form the backbone of your development environment. Installed at the system level via Homebrew, they provide the runtime environments, version control, and command-line utilities necessary for modern WordPress development. These tools are used across multiple projects and should be installed once on your development machine.

The table below lists the essential system-level tools required for WordPress development. Each tool serves a specific purpose in your development workflow, from running JavaScript code to managing databases and interacting with version control systems. Install these using Homebrew on macOS for consistent, maintainable environments.

Install these tools globally for system-wide availability:

| Tool/CLI         | Install Command                        | Purpose                                  |
|------------------|----------------------------------------|------------------------------------------|
| nodejs / npm     | `brew install node`                    | JavaScript runtime & package manager     |
| nvm              | `brew install nvm`                     | Node version management                  |
| composer         | `brew install composer`                | PHP dependency manager                   |
| curl             | `brew install curl`                    | Data transfer utility                    |
| gh               | `brew install gh`                      | GitHub CLI                               |
| git              | `brew install git`                     | Version control                          |
| mysql-client     | `brew install mysql-client`            | MySQL command-line client                |
| php              | `brew install php`                     | PHP runtime                              |
| rsync            | `brew install rsync`                   | File synchronization                     |
| shellcheck       | `brew install shellcheck`              | Shell script linter                      |
| docker-cli       | `brew install --cask docker`           | Docker CLI & Desktop                     |
| wp-cli           | `brew install wp-cli`                  | WordPress CLI                            |
| terminus         | `brew install pantheon-systems/terminus/terminus` | Pantheon CLI                  |
| python3 / pip3   | `brew install python3`                 | Python runtime & pip package manager     |

---

## 2. Global CLI Tools (Install via npm or pip)

Global CLI tools extend your development capabilities with specialized functionality for code quality, formatting, and validation. These tools are installed via npm or pip package managers and are accessible from any directory in your terminal. Unlike project dependencies, these global tools provide consistent command-line interfaces across all your projects.

This table contains command-line tools that should be installed globally on your system. These utilities focus on code quality and formatting across various file types in your WordPress projects. Unlike project-specific dependencies, these global tools can be used across all your development work, ensuring consistent standards regardless of the specific project.

| Tool/CLI         | Install Command                        | Purpose                                  |
|------------------|----------------------------------------|------------------------------------------|
| markdownlint     | `npm install -g markdownlint-cli`      | Markdown linter                          |
| eslint           | `npm install -g eslint`                | JavaScript linter                        |
| yamllint         | `pip3 install yamllint`                | YAML linter                              |

---



### 3. Project-Specific npm Dependencies

#### Project devDependencies (add to package.json)

These dependencies are specific to your WordPress plugin or theme project and are crucial for the development workflow. They provide linting, testing, building, and other development tools that are configured specifically for your project's needs. Unlike global tools, these dependencies are installed locally within your project directory and are defined in your project's package.json file.

These packages should be listed in your `package.json` under `devDependencies`. After updating the file, run:

```sh
npm install
```

The following table lists recommended development dependencies for WordPress block plugin projects. These packages handle crucial development tasks including linting, formatting, testing, and building your code. They should be added to your project's package.json file under the devDependencies section. The table organizes packages by category to help you understand their role in the development workflow.

| Package Name                 | Package Command  | Category         | Purpose                                 |
|------------------------------|------------------|------------------|-----------------------------------------|
| eslint                       | eslint           | Linter           | JavaScript linter                       |
| stylelint                    | stylelint        | Linter           | CSS linter                              |
| markdownlint-cli             | markdownlint-cli | Linter           | Markdown linter                         |
| prettier                     | prettier         | Formatter        | Code formatter                          |
| lint-staged                  | lint-staged      | Utility          | Lint files staged for commit            |
| husky                        | husky            | Utility          | Git hooks manager                       |
| jest                         | jest             | Testing          | JavaScript test runner                   |
| @playwright/test             | @playwright/test | Testing          | Playwright test runner                  |
| babel-jest                   | babel-jest       | Testing          | Babel for Jest                          |
| bats                         | bats             | Testing          | Shell script testing framework           |
| @wordpress/env               | @wordpress/env   | WP Environment   | WP local dev environment                |
| @wordpress/scripts           | @wordpress/scripts| WP Scripts      | WP build/lint/test scripts              |
| all-contributors-cli         | all-contributors-cli| Utility        | Contributors management                 |
| browserslist                 | browserslist     | Utility          | Browser targeting config                |
| playwright                   | playwright       | Testing          | Browser automation                      |
| postcss                      | postcss          | Build Tool       | CSS processor                           |
| ts-loader                    | ts-loader        | Build Tool       | TypeScript loader for webpack           |
| typescript                   | typescript       | Language Support | TypeScript language                     |
| webpack                      | webpack          | Build Tool       | JS module bundler                       |
| webpack-cli                  | webpack-cli      | Build Tool       | Webpack CLI                             |
| @babel/core                  | @babel/core      | Build Tool       | Babel compiler core                     |
| @babel/preset-env            | @babel/preset-env| Build Tool       | Babel preset for ES features            |

### WordPress Packages (for Block Development)

The WordPress JavaScript ecosystem includes specialized packages designed specifically for block development. These packages provide the APIs, components, and utilities necessary to build blocks that integrate seamlessly with the WordPress editor and follow WordPress development patterns. The packages below are organized by functionality to help you identify which ones you need for specific aspects of your block plugin.

WordPress packages for block plugin and theme development, grouped by category with usage notes:

#### Core Development Packages

These packages form the foundation of WordPress block development. They provide the essential build tooling, environment setup, and core functionality needed for any block-based project. These packages help scaffold new blocks, handle build processes, and establish the development environment.

| Package Name                 | Import/Require         | Category         | Description                                          | Dependencies                                |
|------------------------------|------------------------|------------------|------------------------------------------------------|---------------------------------------------|
| @wordpress/scripts           | N/A (CLI tool)         | Core             | All-in-one build toolkit (babel, webpack, postcss, ESLint, etc.) | None (includes everything needed)             |
| @wordpress/env               | N/A (CLI tool)         | Core             | Local WordPress development environment              | Docker                                      |
| @wordpress/create-block      | N/A (CLI tool)         | Core             | Block scaffolding tool                               | None                                        |
| @wordpress/dependency-extraction-webpack-plugin | webpack config import | Build | Prevents bundling WordPress core packages | webpack |
| @wordpress/babel-preset-default | babel config import | Build | Standard Babel presets for WordPress development | @babel/core |

#### UI Components and Styling

These packages provide the building blocks for creating rich, interactive user interfaces in the WordPress block editor. They include React-based UI components, styling utilities, and primitives that help maintain a consistent look and feel with WordPress core. Use these packages to create editor interfaces that integrate seamlessly with the WordPress admin experience.

| Package Name                 | Import/Require         | Category         | Description                                          | Dependencies                                |
|------------------------------|------------------------|------------------|------------------------------------------------------|---------------------------------------------|
| @wordpress/components        | import { Button } from '@wordpress/components' | UI | UI component library for WordPress | React |
| @wordpress/element           | import { createElement } from '@wordpress/element' | UI | WordPress wrapper for React | React |
| @wordpress/primitives        | import { SVG } from '@wordpress/primitives' | UI | WordPress primitive UI components | React |
| @wordpress/block-editor      | import { useBlockProps } from '@wordpress/block-editor' | UI | Block editor components | React |
| @wordpress/style-engine      | import { compileCSS } from '@wordpress/style-engine' | Styling | CSS style generation utilities | None |
| @wordpress/postcss-themes    | postcss config import | Styling | PostCSS plugin for WordPress theme colors | postcss |
| @wordpress/postcss-plugins-preset | postcss config import | Styling | Standard PostCSS plugins for WordPress | postcss |

#### Testing and Quality Assurance

Testing and code quality are essential for robust WordPress plugins. This section covers packages that help with unit testing, end-to-end testing, code linting, and formatting according to WordPress standards. These tools ensure your code meets quality standards and functions correctly across different environments and use cases.

| Package Name                 | Import/Require         | Category         | Description                                          | Dependencies                                |
|------------------------------|------------------------|------------------|------------------------------------------------------|---------------------------------------------|
| @wordpress/jest-preset-default | jest config import | Testing | Jest configurations for WordPress projects | jest |
| @wordpress/jest-console     | import { setConsoleError } from '@wordpress/jest-console' | Testing | Custom Jest matchers for console | jest |
| @wordpress/e2e-test-utils-playwright | import { admin } from '@wordpress/e2e-test-utils-playwright' | Testing | Playwright utilities for WordPress e2e tests | playwright |
| @wordpress/eslint-plugin    | extends plugin in .eslintrc | Linting | WordPress coding standards for ESLint | eslint |
| @wordpress/prettier-config  | extends in prettier.config.js | Formatting | WordPress Prettier configuration | prettier |
| @wordpress/stylelint-config | extends in .stylelintrc | Linting | WordPress coding standards for CSS | stylelint |
| @wordpress/browserslist-config | browserslist key in package.json | Config | Browserslist config for WordPress | browserslist |

#### Data and State Management

State management is crucial for complex blocks and block-based applications. These packages provide a Redux-like data layer for managing application state, data fetching, and interaction with the WordPress REST API. They help maintain a predictable state flow and synchronize data between your blocks and WordPress.

| Package Name                 | Import/Require         | Category         | Description                                          | Dependencies                                |
|------------------------------|------------------------|------------------|------------------------------------------------------|---------------------------------------------|
| @wordpress/data              | import { useSelect } from '@wordpress/data' | Data | Data module for state management | React |
| @wordpress/api-fetch         | import apiFetch from '@wordpress/api-fetch' | Data | Utility for WordPress REST API requests | None |
| @wordpress/core-data         | register via data module | Data | WordPress core data store | @wordpress/data |
| @wordpress/redux-routine     | middleware for data store | Data | Redux middleware for generator functions | @wordpress/data |

#### Internationalization and Accessibility

Making your blocks accessible and translatable is crucial for a global WordPress audience. These packages provide utilities for internationalizing your plugins (i18n), implementing accessibility features (a11y), and ensuring your blocks work for all users regardless of language or ability.

| Package Name                 | Import/Require         | Category         | Description                                          | Dependencies                                |
|------------------------------|------------------------|------------------|------------------------------------------------------|---------------------------------------------|
| @wordpress/i18n              | import { __ } from '@wordpress/i18n' | i18n | Internationalization utilities | None |
| @wordpress/react-i18n        | import { useI18n } from '@wordpress/react-i18n' | i18n | React hooks for i18n | React, @wordpress/i18n |
| @wordpress/babel-plugin-makepot | babel config import | i18n | Extracts translatable strings to POT files | babel |
| @wordpress/a11y              | import { speak } from '@wordpress/a11y' | Accessibility | Accessibility utilities | None |
| @wordpress/wordcount         | import { count } from '@wordpress/wordcount' | Utility | Word counting utility | None |

#### Recommended Packages for Copyright Date Block Plugin

Based on the copyright-date-block plugin structure, these packages are specifically recommended:

This table highlights the essential WordPress packages particularly relevant to the copyright-date-block plugin. These are the core packages you'll need to implement the block's functionality, including internationalization, editor interfaces, UI components, and date handling capabilities. Focus on these packages first when developing this specific block.

| Package Name                 | Import/Require         | Category         | Description                                          | Why Needed                                 |
|------------------------------|------------------------|------------------|------------------------------------------------------|--------------------------------------------|
| @wordpress/i18n              | import { __ } from '@wordpress/i18n' | i18n | Internationalization utilities | Used for translating UI strings in edit.js |
| @wordpress/block-editor      | import { useBlockProps } from '@wordpress/block-editor' | UI | Block editor components | Essential for block rendering and controls |
| @wordpress/components        | import { PanelBody, TextControl } from '@wordpress/components' | UI | UI component library | Used for Settings panel in edit.js |
| @wordpress/element           | import { useEffect } from '@wordpress/element' | Core | React wrapper | Used for React hooks in edit.js |
| @wordpress/blocks            | import { registerBlockType } from '@wordpress/blocks' | Core | Block registration | Required for registering the block |
| @wordpress/date              | import { dateI18n, format } from '@wordpress/date' | Utility | Date formatting | Useful for handling/formatting dates |
| @wordpress/primitives        | import { SVG } from '@wordpress/primitives' | UI | SVG handling | Better way to handle the calendar SVG icon |

#### Git Workflow Tools

Git hooks automate quality control in your development workflow by running specific processes before git actions like commits or pushes. These tools help maintain code quality standards across your team by automatically checking and fixing code before it enters your repository. This prevents common issues from being committed and ensures consistent style and functionality.

The table below outlines key tools for integrating code quality checks into your Git workflow. These packages run automated checks before commits or pushes, ensuring only high-quality code enters your repository. They work together to enforce coding standards, run tests, and maintain consistent code quality across your team without manual intervention.

| Package Name                 | Purpose                                          | Configuration                                      |
|------------------------------|--------------------------------------------------|---------------------------------------------------|
| husky                        | Automate Git hooks to enforce quality checks before commits/pushes | Configured in package.json with "prepare" script and .husky/ directory |
| lint-staged                  | Run linters only on files that will be committed | Configured in package.json "lint-staged" section  |

Husky allows you to:

- Run quality checks automatically before commits (pre-commit hooks)
- Prevent commits with failing tests or linting issues
- Enforce consistent code style across all contributors
- Validate commit messages match your team's standards
- Run pre-push hooks to prevent pushing broken code

In this copyright-date-block project, husky is configured with the following hooks:

1. **pre-commit**: Runs before creating a commit
   - Runs lint-staged to check and fix JS/CSS files
   - Runs PHP Code Sniffer for PHP files
   - Runs Jest tests for modified JavaScript files

2. **commit-msg**: Validates commit message format
   - Ensures commit messages follow the conventional commit format:
     `type(scope): description`
   - Examples: `feat: add new feature`, `fix(render): fix date display`
   - Valid types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

3. **pre-push**: Runs before pushing to remote
   - Runs all linting checks
   - Runs all unit tests

This ensures all code committed and pushed to the repository maintains consistent quality standards and follows proper conventions.


### Simplified Setup Recommendation: Block Plugin

For developers who want to get started quickly without configuring individual tools, WordPress provides comprehensive packages that bundle the necessary build tools together. This simplified approach reduces setup time and ensures compatibility between tools, at the cost of some customization flexibility.

> **Simplified Setup Recommendation:** For most WordPress block plugin development, using `@wordpress/scripts` and `@wordpress/env` is sufficient, as `@wordpress/scripts` includes pre-configured webpack, babel, postcss, eslint, stylelint, and jest configurations.

> **Example package.json setup with Husky and lint-staged:**
>
> ```json
> {
>   "name": "my-block-plugin",
>   "scripts": {
>     "build": "wp-scripts build",
>     "start": "wp-scripts start",
>     "test": "wp-scripts test-js",
>     "lint:js": "wp-scripts lint-js",
>     "lint:css": "wp-scripts lint-style",
>     "env:start": "wp-env start",
>     "env:stop": "wp-env stop",
>     "prepare": "husky"
>   },
>   "devDependencies": {
>     "@wordpress/scripts": "^26.0.0",
>     "@wordpress/env": "^8.0.0",
>     "husky": "^9.0.0",
>     "lint-staged": "^15.0.0"
>   },
>   "lint-staged": {
>     "*.{js,jsx,ts,tsx}": [
>       "wp-scripts lint-js --fix"
>     ],
>     "*.{css,scss,pcss}": [
>       "wp-scripts lint-style --fix"
>     ]
>   }
> }
> ```
>
> **Setting up Husky from scratch:**
>
> ```bash
> # Install husky and lint-staged
> npm install --save-dev husky lint-staged
>
> # Add prepare script to package.json
> npm pkg set scripts.prepare="husky"
>
> # Initialize husky
> npx husky init
>
> # Create pre-commit hook
> cat > .husky/pre-commit << EOF
> #!/usr/bin/env sh
> . "\$(dirname -- "\$0")/_/husky.sh"
>
> # Run lint-staged to lint and fix files
> npx lint-staged
> EOF
>
> # Make hook executable
> chmod +x .husky/pre-commit
> ```

#### Block Theme

### Simplified Setup Recommendation: Block Theme



### Direct npm install (no package.json update required)

Sometimes you need to quickly install utilities for specific tasks without formally adding them to your project's dependencies. These ad-hoc tools can be installed directly via npm commands, either globally or locally. This approach is useful for one-off tasks, experimentation, or tools that you don't want to include in your project's dependency list.

Some tools (usually CLIs or one-off utilities) can be installed globally or locally without updating `package.json`. Use these commands directly:

The following table lists utility packages that you might need for specific tasks but may not want to permanently add to your project's dependencies. These can be installed on-demand as needed. This approach is useful for tools you use occasionally or want to try without committing to them as formal project dependencies.

| Package Name                | Category         | Purpose                                 | Install Command                       |
|-----------------------------|------------------|-----------------------------------------|---------------------------------------|
| markdownlint-cli            | Linter           | Markdown linter (global CLI)            | npm install -g markdownlint-cli       |
| eslint                      | Linter           | JavaScript linter (global CLI)          | npm install -g eslint                 |
| npm-run-all                 | Utility          | Run multiple npm scripts in parallel     | npm install --save-dev npm-run-all    |
| cross-env                   | Utility          | Set environment variables across OS      | npm install --save-dev cross-env      |
| dotenv                      | Utility          | Loads environment variables from .env    | npm install --save-dev dotenv         |

> **Note:** For most project tools, prefer adding them to `devDependencies` in `package.json` and running `npm install`. Use global installs only for CLI tools you want available system-wide.

> **Other recommended npm dev tools for WordPress projects:**
>
> This table lists additional development tools specifically tailored for WordPress projects. These packages help enforce WordPress coding standards, handle cross-environment configuration, and improve development workflows. Consider adding these to your project's devDependencies for enhanced WordPress-specific functionality.
>
| Package                | Category         | Purpose                                 | Install Command                       |
|------------------------|------------------|-----------------------------------------|---------------------------------------|
| @wordpress/eslint-plugin| Linter           | WordPress JS coding standards            | npm install --save-dev @wordpress/eslint-plugin |
| @wordpress/stylelint-config | Linter        | WordPress CSS coding standards           | npm install --save-dev @wordpress/stylelint-config |
| @wordpress/prettier-config | Formatter      | WordPress Prettier config                | npm install --save-dev @wordpress/prettier-config |
| cross-env              | Utility          | Set environment variables across OS      | npm install --save-dev cross-env      |
| dotenv                 | Utility          | Loads environment variables from .env    | npm install --save-dev dotenv         |
| npm-run-all            | Utility          | Run multiple npm scripts in parallel     | npm install --save-dev npm-run-all    |

---

## 4. Project-Specific Composer Packages (Add to composer.json)

While JavaScript tools handle the front-end build process, Composer packages manage PHP dependencies and development tools. For WordPress plugins with PHP components, these packages provide crucial functionality for code quality, testing, and maintaining WordPress coding standards. They work alongside npm packages to create a complete development environment for both front-end and back-end code.

> **Recommended:** For automated code standards checks in CI, use the [10up WPCS GitHub Action](https://github.com/marketplace/actions/phpcs-check-with-annotations) for PHPCS with annotations. This action provides zero-config integration and inline feedback on pull requests.

Install these as dev dependencies for PHP code quality. Packages are grouped by category for clarity:

The table below outlines essential Composer packages for maintaining PHP code quality in WordPress projects. These packages help enforce WordPress coding standards, check PHP compatibility, run unit tests, and integrate with Git workflows. They form the backbone of PHP quality assurance for your plugin or theme and should be installed as development dependencies.

| Package                        | Category         | Purpose                                                      | Install Command                                 |
|--------------------------------|------------------|--------------------------------------------------------------|-------------------------------------------------|
| 10up/phpcs-composer            | Linter/Standards | Drop-in WPCS & PHPCompatibilityWP, zero-config               | composer require --dev 10up/phpcs-composer      |
| wp-coding-standards/wpcs       | Linter/Standards | WordPress Coding Standards (included via 10up/phpcs-composer)| composer require --dev wp-coding-standards/wpcs |
| phpcompatibility/php-compatibility | Linter/Standards | PHP compatibility checks (included via 10up/phpcs-composer) | composer require --dev phpcompatibility/php-compatibility |
| dealerdirect/phpcodesniffer-composer-installer | Utility | Composer installer for PHPCS standards                      | composer require --dev dealerdirect/phpcodesniffer-composer-installer |
| squizlabs/php_codesniffer      | Linter/Standards | PHP_CodeSniffer engine (included via 10up/phpcs-composer)    | composer require --dev squizlabs/php_codesniffer |
| phpunit/phpunit                | Testing          | PHP unit testing framework                                   | composer require --dev phpunit/phpunit           |
| brainmaestro/composer-git-hooks| Utility          | Git hooks for Composer projects                              | composer require --dev brainmaestro/composer-git-hooks |


---


## 5. Recommended VS Code Extensions

The right IDE extensions can significantly enhance your development workflow by providing code intelligence, real-time linting, debugging capabilities, and specialized tools for WordPress development. These extensions integrate with the command-line tools to provide a seamless, visual development experience with immediate feedback on code quality and functionality.

The table below presents a curated list of VS Code extensions organized by category to enhance your WordPress development experience. From AI coding assistants to PHP debugging tools and WordPress-specific utilities, these extensions transform VS Code into a powerful WordPress IDE. Adding these to your .vscode/extensions.json file enables consistent tooling across your entire development team.

Add these to `.vscode/extensions.json` for a complete dev experience:

| Extension ID                          | Category                    | Notes/Description                                      |
|---------------------------------------|-----------------------------|--------------------------------------------------------|
| github.copilot                        | AI Coding                   | GitHub Copilot AI code completion                      |
| github.copilot-chat                   | AI Coding                   | Copilot Chat for conversational coding                 |
| coderabbit.coderabbit-vscode          | AI Coding                   | CodeRabbit AI review and automation                    |
| codeium.codeium                       | AI Coding                   | Codeium AI code assistant                              |
| openai.chatgpt                        | AI Coding                   | ChatGPT integration                                    |
| google.gemini-cli-vscode-ide-companion| AI Coding                   | Google Gemini AI IDE companion                         |
| google.geminicodeassist               | AI Coding                   | Google Gemini code assistant                           |
| github.vscode-pull-request-github     | GitHub                      | PR management in VS Code                               |
| github.vscode-github-actions          | GitHub                      | GitHub Actions workflow integration                    |
| github.codespaces                     | GitHub                      | Codespaces cloud dev environments                      |
| github.remotehub                      | GitHub                      | Remote repo browsing                                   |
| DEVSENSE.phptools-vscode              | PHP Support                 | PHP IntelliSense and debugging                         |
| xdebug.php-pack                       | PHP Support                 | Xdebug PHP debugging                                   |
| bmewburn.vscode-intelephense-client   | PHP Support                 | Intelephense PHP language server                       |
| WordPressPlayground.wordpress-playground| WordPress                  | WordPress Playground for local testing                 |
| figma.figma-vscode-extension          | Design                      | Figma design integration                               |
| esbenp.prettier-vscode                | Styling/Formatting          | Prettier code formatter                                |
| stylelint.vscode-stylelint            | Styling/Formatting          | Stylelint CSS linter                                   |
| dbaeumer.vscode-eslint                | Styling/Formatting          | ESLint JS linter                                       |
| ValeryanM.vscode-phpsab               | Styling/Formatting          | PHP Static Analysis                                    |
| syler.sass-indented                   | Styling/Formatting          | Sass syntax highlighting                               |
| davidanson.vscode-markdownlint        | Styling/Formatting          | Markdown linter                                        |
| ms-vscode.vscode-typescript-next      | Language Support            | TypeScript language features (next)                    |
| msjsdiag.debugger-for-chrome          | Language Support            | Chrome JS debugging                                    |
| ms-vscode.vscode-typescript-tslint-plugin| Language Support          | TSLint for TypeScript                                  |
| editorconfig.editorconfig             | Utility                     | EditorConfig file support                              |
| GitWorktrees.git-worktrees            | Utility                     | Git worktree management                                |
| vscode-icons-team.vscode-icons        | Navigation/Readability      | File icon themes                                       |
| aaron-bond.better-comments            | Navigation/Readability      | Highlight and categorize code comments                 |
| eamodio.gitlens                       | Navigation/Readability      | GitLens advanced git features                          |
| streetsidesoftware.code-spell-checker | Navigation/Readability      | Spell checker for code/comments                        |
| gruntfuggly.todo-tree                 | Navigation/Readability      | TODO comment tree view                                 |

---

## 6. Notes

The following guidelines summarize the recommended approaches for installing and managing different types of dependencies in your WordPress development environment. Following these conventions helps maintain consistency across projects and ensures that dependencies are installed at the appropriate scope (system-wide, user-level, or project-level).

- Use Homebrew for system tools and CLIs.
- Use npm for JavaScript/Node tools (global or project-specific).
- Use composer for PHP packages (project-specific).
- Use pip for Python tools (global).
- Keep `.vscode/extensions.json` updated for team consistency.

---

## 7. Quick Setup Commands

```sh
# System tools
brew install node nvm composer curl gh git mysql-client php rsync shellcheck wp-cli python3
brew install --cask docker
brew install pantheon-systems/terminus/terminus

# Global npm CLIs
npm install -g markdownlint-cli eslint

# Global Python CLIs
pip3 install yamllint

# Project npm packages
npm install

# Project composer packages
composer install
```

---

This document ensures your Mac and project are set up for modern WordPress plugin development.

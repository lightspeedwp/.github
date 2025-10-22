## Global System Tools (Install via Homebrew)

These fundamental tools form the backbone of your development environment. Installed at the system level via Homebrew, they provide the runtime environments, version control, and command-line utilities necessary for modern WordPress development. These tools are used across multiple projects and should be installed once on your development machine.

These commands will install all necessary system tools, global CLI utilities, and project-specific dependencies required for WordPress block development. Run these commands first to install all required system tools and global CLIs before configuring project dependencies:

```shell
# System tools
brew install node nvm composer curl gh git mysql-client php rsync shellcheck wp-cli python3
brew install --cask docker
brew install pantheon-systems/terminus/terminus

# Global npm CLIs
npm install -g markdownlint-cli eslint

# Global CLI Tools
pip3 install yamllint

# Project npm packages
npm install

# Project composer packages
composer install
```

---

## Project-Specific Dev Tools Setup

Next, install Project-Specific `npm` Dependencies

Project-specific npm packages provide the tools and libraries needed for building, testing, and maintaining your WordPress plugin or theme. Unlike global tools, these dependencies are installed locally within your project directory and these packages are listed in your `package.json.mustache` file under the section `devDependencies`.

Run the following command in your project root to install these dependencies:

```shell
npm install
```

## Git Precommit Hooks for Quality Control

Git hooks automate quality control in your development workflow by running specific processes before git actions like commits or pushes. These tools help maintain code quality standards across your team by automatically checking and fixing code before it enters your repository. This prevents common issues from being committed and ensures consistent style and functionality.

The table below outlines key tools for integrating code quality checks into your Git workflow. These packages run automated checks before commits or pushes, ensuring only high-quality code enters your repository. They work together to enforce coding standards, run tests, and maintain consistent code quality across your team without manual intervention.

| Package Name | Purpose | Configuration |
| :---- | :---- | :---- |
| husky | Automate Git hooks to enforce quality checks before commits/pushes | Configured in package.json with "prepare" script and .husky/ directory |
| lint-staged | Run linters only on files that will be committed | Configured in package.json "lint-staged" section |

Husky allows you to:

- Run quality checks automatically before commits (pre-commit hooks)  
- Prevent commits with failing tests or linting issues  
- Enforce consistent code style across all contributors  
- Validate commit messages match your team's standards  
- Run pre-push hooks to prevent pushing broken code

Husky needs to be configured with the following hooks:

1. **pre-commit**: Runs before creating a commit  

   - Runs lint-staged to check and fix JS/CSS files  
   - Runs PHP Code Sniffer for PHP files  
   - Runs Jest tests for modified JavaScript files

2. **commit-msg**: Validates commit message format  

   - Ensures commit messages follow the conventional commit format: `type(scope): description`  
   - Examples: `feat: add new feature`, `fix(render): fix date display`  
   - Valid types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

3. **pre-push**: Runs before pushing to remote  

   - Runs all linting checks  
   - Runs all unit tests

This ensures all code committed and pushed to the repository maintains consistent quality standards and follows proper conventions.

### **Simplified Setup Recommendation: Block Plugin**

For developers who want to get started quickly without configuring individual tools, WordPress provides comprehensive packages that bundle the necessary build tools together. This simplified approach reduces setup time and ensures compatibility between tools, at the cost of some customization flexibility.

**Simplified Setup Recommendation:** For most WordPress block plugin development, using `@wordpress/scripts` and `@wordpress/env` is sufficient, as `@wordpress/scripts` includes pre-configured webpack, babel, postcss, eslint, stylelint, and jest configurations.

**Example package.json setup with Husky and lint-staged:**

```json
{
  "name": "my-block-plugin",
  "scripts": {
    "build": "wp-scripts build",
    "start": "wp-scripts start",
    "test": "wp-scripts test-js",
    "lint:js": "wp-scripts lint-js",
    "lint:css": "wp-scripts lint-style",
    "env:start": "wp-env start",
    "env:stop": "wp-env stop",
    "prepare": "husky"
  },
  "devDependencies": {
    "@wordpress/scripts": "^26.0.0",
    "@wordpress/env": "^8.0.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "wp-scripts lint-js --fix"
    ],
    "*.{css,scss,pcss}": [
      "wp-scripts lint-style --fix"
    ]
  }
}
```

**Setting up Husky from scratch:**

```shell
# Install husky and lint-staged
npm install --save-dev husky lint-staged

# Add prepare script to package.json
npm pkg set scripts.prepare="husky"

# Initialize husky
npx husky init

# Create pre-commit hook
cat > .husky/pre-commit << EOF
#!/usr/bin/env sh
. "\$(dirname -- "\$0")/_/husky.sh"

# Run lint-staged to lint and fix files
npx lint-staged
EOF

# Make hook executable
chmod +x .husky/pre-commit
```

#### **Block Theme**

### **Simplified Setup Recommendation: Block Theme**

### **Direct npm install (no package.json update required)**

Sometimes you need to quickly install utilities for specific tasks without formally adding them to your project's dependencies. These ad-hoc tools can be installed directly via npm commands, either globally or locally. This approach is useful for one-off tasks, experimentation, or tools that you don't want to include in your project's dependency list.

Some tools (usually CLIs or one-off utilities) can be installed globally or locally without updating `package.json`. Use these commands directly:

The following table lists utility packages that you might need for specific tasks but may not want to permanently add to your project's dependencies. These can be installed on-demand as needed. This approach is useful for tools you use occasionally or want to try without committing to them as formal project dependencies.

| Package Name | Category | Purpose | Install Command |
| :---- | :---- | :---- | :---- |
| markdownlint-cli | Linter | Markdown linter (global CLI) | npm install \-g markdownlint-cli |
| eslint | Linter | JavaScript linter (global CLI) | npm install \-g eslint |
| npm-run-all | Utility | Run multiple npm scripts in parallel | npm install \--save-dev npm-run-all |
| cross-env | Utility | Set environment variables across OS | npm install \--save-dev cross-env |
| dotenv | Utility | Loads environment variables from .env | npm install \--save-dev dotenv |

**Note:** For most project tools, prefer adding them to `devDependencies` in `package.json` and running `npm install`. Use global installs only for CLI tools you want available system-wide.

**Other recommended npm dev tools for WordPress projects:**

This table lists additional development tools specifically tailored for WordPress projects. These packages help enforce WordPress coding standards, handle cross-environment configuration, and improve development workflows. Consider adding these to your project's devDependencies for enhanced WordPress-specific functionality.

| Package | Category | Purpose | Install Command |
| :---- | :---- | :---- | :---- |
| @wordpress/eslint-plugin | Linter | WordPress JS coding standards | npm install \--save-dev @wordpress/eslint-plugin |
| @wordpress/stylelint-config | Linter | WordPress CSS coding standards | npm install \--save-dev @wordpress/stylelint-config |
| @wordpress/prettier-config | Formatter | WordPress Prettier config | npm install \--save-dev @wordpress/prettier-config |
| cross-env | Utility | Set environment variables across OS | npm install \--save-dev cross-env |
| dotenv | Utility | Loads environment variables from .env | npm install \--save-dev dotenv |
| npm-run-all | Utility | Run multiple npm scripts in parallel | npm install \--save-dev npm-run-all |

---

## **Package Managers: npm vs Yarn vs pnpm**

For most WordPress repositories, **npm** is sufficient and matches the official tooling and docs. If your team is already standardised on Yarn or pnpm, use one consistently across the repo and CI. Avoid Yarn PnP in WordPress projects because many tools (including `@wordpress/scripts`) expect a `node_modules` folder to be present.

## **4\. Project-Specific Composer Packages (Add to composer.json)**

While JavaScript tools handle the front-end build process, Composer packages manage PHP dependencies and development tools. For WordPress plugins with PHP components, these packages provide crucial functionality for code quality, testing, and maintaining WordPress coding standards. They work alongside npm packages to create a complete development environment for both front-end and back-end code.

**Recommended:** For automated code standards checks in CI, use the [10up WPCS GitHub Action](https://github.com/marketplace/actions/phpcs-check-with-annotations) for PHPCS with annotations. This action provides zero-config integration and inline feedback on pull requests.

Install these as dev dependencies for PHP code quality. Packages are grouped by category for clarity:

The table below outlines essential Composer packages for maintaining PHP code quality in WordPress projects. These packages help enforce WordPress coding standards, check PHP compatibility, run unit tests, and integrate with Git workflows. They form the backbone of PHP quality assurance for your plugin or theme and should be installed as development dependencies.

| Package | Category | Purpose | Install Command |
| :---- | :---- | :---- | :---- |
| 10up/phpcs-composer | Linter/Standards | Drop-in WPCS & PHPCompatibilityWP, zero-config | composer require \--dev 10up/phpcs-composer |
| wp-coding-standards/wpcs | Linter/Standards | WordPress Coding Standards (included via 10up/phpcs-composer) | composer require \--dev wp-coding-standards/wpcs |
| phpcompatibility/php-compatibility | Linter/Standards | PHP compatibility checks (included via 10up/phpcs-composer) | composer require \--dev phpcompatibility/php-compatibility |
| dealerdirect/phpcodesniffer-composer-installer | Utility | Composer installer for PHPCS standards | composer require \--dev dealerdirect/phpcodesniffer-composer-installer |
| squizlabs/php\_codesniffer | Linter/Standards | PHP\_CodeSniffer engine (included via 10up/phpcs-composer) | composer require \--dev squizlabs/php\_codesniffer |
| phpunit/phpunit | Testing | PHP unit testing framework | composer require \--dev phpunit/phpunit |
| brainmaestro/composer-git-hooks | Utility | Git hooks for Composer projects | composer require \--dev brainmaestro/composer-git-hooks |

---

## **5\. Recommended VS Code Extensions**

The right IDE extensions can significantly enhance your development workflow by providing code intelligence, real-time linting, debugging capabilities, and specialized tools for WordPress development. These extensions integrate with the command-line tools to provide a seamless, visual development experience with immediate feedback on code quality and functionality.

The table below presents a curated list of VS Code extensions organized by category to enhance your WordPress development experience. From AI coding assistants to PHP debugging tools and WordPress-specific utilities, these extensions transform VS Code into a powerful WordPress IDE. Adding these to your .vscode/extensions.json file enables consistent tooling across your entire development team.

Add these to `.vscode/extensions.json` for a complete dev experience:

| Extension ID | Category | Notes/Description |
| :---- | :---- | :---- |
| github.copilot | AI Coding | GitHub Copilot AI code completion |
| github.copilot-chat | AI Coding | Copilot Chat for conversational coding |
| coderabbit.coderabbit-vscode | AI Coding | CodeRabbit AI review and automation |
| codeium.codeium | AI Coding | Codeium AI code assistant |
| openai.chatgpt | AI Coding | ChatGPT integration |
| google.gemini-cli-vscode-ide-companion | AI Coding | Google Gemini AI IDE companion |
| google.geminicodeassist | AI Coding | Google Gemini code assistant |
| github.vscode-pull-request-github | GitHub | PR management in VS Code |
| github.vscode-github-actions | GitHub | GitHub Actions workflow integration |
| github.codespaces | GitHub | Codespaces cloud dev environments |
| github.remotehub | GitHub | Remote repo browsing |
| DEVSENSE.phptools-vscode | PHP Support | PHP IntelliSense and debugging |
| xdebug.php-pack | PHP Support | Xdebug PHP debugging |
| bmewburn.vscode-intelephense-client | PHP Support | Intelephense PHP language server |
| WordPressPlayground.wordpress-playground | WordPress | WordPress Playground for local testing |
| figma.figma-vscode-extension | Design | Figma design integration |
| esbenp.prettier-vscode | Styling/Formatting | Prettier code formatter |
| stylelint.vscode-stylelint | Styling/Formatting | Stylelint CSS linter |
| dbaeumer.vscode-eslint | Styling/Formatting | ESLint JS linter |
| ValeryanM.vscode-phpsab | Styling/Formatting | PHP Static Analysis |
| syler.sass-indented | Styling/Formatting | Sass syntax highlighting |
| davidanson.vscode-markdownlint | Styling/Formatting | Markdown linter |
| ms-vscode.vscode-typescript-next | Language Support | TypeScript language features (next) |
| msjsdiag.debugger-for-chrome | Language Support | Chrome JS debugging |
| ms-vscode.vscode-typescript-tslint-plugin | Language Support | TSLint for TypeScript |
| editorconfig.editorconfig | Utility | EditorConfig file support |
| GitWorktrees.git-worktrees | Utility | Git worktree management |
| vscode-icons-team.vscode-icons | Navigation/Readability | File icon themes |
| aaron-bond.better-comments | Navigation/Readability | Highlight and categorize code comments |
| eamodio.gitlens | Navigation/Readability | GitLens advanced git features |
| streetsidesoftware.code-spell-checker | Navigation/Readability | Spell checker for code/comments |
| gruntfuggly.todo-tree | Navigation/Readability | TODO comment tree view |

---

## **6\. Notes**

The following guidelines summarize the recommended approaches for installing and managing different types of dependencies in your WordPress development environment. Following these conventions helps maintain consistency across projects and ensures that dependencies are installed at the appropriate scope (system-wide, user-level, or project-level).

- Use Homebrew for system tools and CLIs.  
- Use npm for JavaScript/Node tools (global or project-specific).  
- Use composer for PHP packages (project-specific).  
- Use pip for Python tools (global).  
- Keep `.vscode/extensions.json` updated for team consistency.

---

## **7\. Quick Setup Commands**

```shell
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

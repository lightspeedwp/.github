# Theme Development Setup

This document guides you through setting up your local development environment for this WordPress theme.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) (v9 or later)
- [WordPress](https://wordpress.org/) (latest version)
- [WordPress Studio](https://wordpress.com/start/wordpress-studio) or a local WordPress development environment

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/<your-org>/<your-theme-repo>.git
    cd <your-theme-repo>
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Setup Husky git hooks:
    ```bash
    npm run prepare
    ```

## Development Workflow

### Building Assets

- Start development mode with hot reloading:
  ```bash
  npm start
  ```

- Build for production:
  ```bash
  npm run build
  ```

### Code Quality

- Lint JavaScript:
  ```bash
  npm run lint:js
  ```

- Lint CSS:
  ```bash
  npm run lint:css
  ```

- Run all linters:
  ```bash
  npm run lint
  ```

### Testing

- Run all tests:
  ```bash
  npm test
  ```

- Run accessibility tests only:
  ```bash
  npm run test:accessibility
  ```

- Run end-to-end tests only:
  ```bash
  npm run test:e2e
  ```

## WordPress Integration

### Using WordPress Studio

1. Create a new site on WordPress Studio
2. Connect your local repository to the site
3. Use Studio's sync feature to push changes to the live site

### Using Local WordPress

If you're using a local WordPress setup:

1. Make sure your WordPress installation points to this theme directory
2. Activate the theme in the WordPress admin
3. Make changes locally and see them reflected in your local WordPress instance

## Coding Standards

This project follows the WordPress coding standards. The linting tools are configured to enforce these standards.

## Git Workflow

1. Create a feature branch for your work:
    ```bash
    git checkout -b feature/your-feature-name
    ```

2. Make your changes and commit them:
    ```bash
    git add .
    git commit -m "Your descriptive commit message"
    ```

3. Push your changes and create a pull request:
    ```bash
    git push origin feature/your-feature-name
    ```

4. Reference any related issues in your pull request description

## Need Help?

- Check the [documentation](./docs/README.md)
- Review the [GitHub Copilot instructions](./.github/copilot-instructions.md)
- Use the prompt files in `.github/prompts/` for guidance

## Contributing and Code of Conduct

We welcome contributions! Please review our [Contributing Guidelines](https://github.com/lightspeedwp/.github/blob/master/.github/CONTRIBUTING.md) and [Code of Conduct](https://github.com/lightspeedwp/.github/blob/master/.github/CODE_OF_CONDUCT.md) before submitting pull requests or engaging with the project.
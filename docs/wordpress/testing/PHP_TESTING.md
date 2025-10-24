# PHP Testing Setup Guide

This WordPress theme uses modern PHP testing and linting tools to ensure code quality and compatibility.

## PHP Code Standards (PHPCS)

We use the **10up PHPCS Composer** package which provides comprehensive WordPress coding standards.

### Installation

The PHPCS package is already included in `composer.json`:

```json
{
  "require-dev": {
    "10up/phpcs-composer": "^3.0"
  }
}
```

### Usage

**Lint PHP files:**

```bash
composer run lint
# or directly:
./vendor/bin/phpcs .
```

**Auto-fix PHP files:**

```bash
composer run format
# or directly:
./vendor/bin/phpcbf .
```

### Configuration

The PHPCS configuration is defined in `.phpcs.xml.dist`:

```xml
<?xml version="1.0"?>
<ruleset name="Project Rules">
	<rule ref="10up-Default" />
</ruleset>
```

### IDE Integration

Most IDEs can use the `.phpcs.xml.dist` file automatically. For VSCode, install the PHP CodeSniffer extension.

## Playwright Testing

Playwright is configured for comprehensive PHP theme testing, including:

- Frontend functionality testing
- PHP error detection
- WordPress admin integration testing
- Theme activation and customization testing

### Running Tests

**Run all tests:**

```bash
npm run test:e2e
```

**Run tests in headed mode (with browser UI):**

```bash
npm run test:e2e:headed
```

**Debug tests:**

```bash
npm run test:e2e:debug
```

### Test Structure

- `tests/e2e/theme.spec.ts` - Frontend theme functionality
- `tests/e2e/php-integration.spec.ts` - PHP-specific integration tests
- `tests/e2e/helpers/wordpress.ts` - WordPress testing utilities

### WordPress Test Helpers

The `WordPressHelpers` class provides utilities for:

- Admin login automation
- Theme customizer testing
- Block editor testing
- PHP error detection
- Template testing

Example usage:

```typescript
import { test, expect } from './helpers/wordpress';

test('should not show PHP errors', async ({ page, wp }) => {
  await page.goto('/');
  await wp.checkForPHPErrors();
});
```

## Continuous Integration

Both PHPCS and Playwright tests are designed to work in CI environments:

- **PHPCS**: Uses exit codes to indicate pass/fail
- **Playwright**: Configured with GitHub Actions reporter for CI
- **PHP Version**: Tests for PHP 8.2+ compatibility by default

### Override PHP Version

To test for different PHP versions:

```bash
./vendor/bin/phpcs --runtime-set testVersion 7.4-
```

## Development Workflow

1. **Write PHP code** following WordPress standards
2. **Run PHPCS** to check for violations: `composer run lint`
3. **Auto-fix** minor issues: `composer run format`
4. **Run Playwright tests** to ensure functionality: `npm run test:e2e`
5. **Commit** clean, tested code

## Package Scripts

The following npm scripts are available:

- `npm run lint` - Run all linting (JS, CSS, PHP)
- `npm run lint:php` - Run only PHP linting
- `npm run test:e2e` - Run Playwright tests
- `npm run test` - Run all tests (unit + e2e)

## Requirements

- **PHP**: 7.4 or higher
- **Node.js**: 18.0 or higher
- **Composer**: For PHP dependencies
- **WordPress**: Local development environment recommended

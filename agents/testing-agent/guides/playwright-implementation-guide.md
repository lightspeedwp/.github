---
title: "Playwright Implementation Guide"
description: "Comprehensive guide for implementing Playwright end-to-end testing with cross-browser support and best practices"
version: "1.0.0"
frameworks:
  - playwright
  - e2e
  - browser-testing
status: active
---

# Playwright Implementation Guide

## Overview

Playwright is a modern browser automation framework for testing web applications across Chrome, Firefox, Safari, and Edge with a unified API. This guide covers practical E2E testing patterns.

## Setup

### Installation

```bash
npm install --save-dev @playwright/test
npx playwright install
```

### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Test Structure

### Basic Test Pattern

```typescript
import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', 'user@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', 'invalid@example.com');
    await page.fill('[data-testid="password-input"]', 'wrong');
    await page.click('[data-testid="login-button"]');
    
    await expect(page.locator('[role="alert"]')).toContainText('Invalid');
  });
});
```

## Locator Strategies

### Using Data Test IDs

```typescript
// ✅ PREFERRED: Stable selectors
await page.click('[data-testid="submit-button"]');

// CSS selectors
await page.click('button.btn-primary');

// Text matchers
await page.click('text=Click me');

// Role-based
await page.click('role=button[name="Submit"]');
```

## User Interactions

### Form Handling

```typescript
test('should fill and submit form', async ({ page }) => {
  // Fill inputs
  await page.fill('[data-testid="name"]', 'John Doe');
  await page.fill('[data-testid="email"]', 'john@example.com');
  
  // Select dropdown
  await page.selectOption('[data-testid="country"]', 'USA');
  
  // Checkbox
  await page.check('[data-testid="agree-terms"]');
  
  // Submit
  await page.click('[data-testid="submit"]');
  
  // Wait for result
  await page.waitForURL('/success');
});
```

## Waiting and Synchronization

### Proper Wait Strategies

```typescript
test('should handle async operations', async ({ page }) => {
  // Wait for element
  await page.waitForSelector('[data-testid="result"]');
  
  // Wait for network idle
  await page.waitForLoadState('networkidle');
  
  // Wait for specific condition
  await page.waitForFunction(() => {
    return document.querySelectorAll('.item').length > 0;
  });
  
  // Auto-waiting (built-in)
  await page.click('[data-testid="button"]'); // Waits for clickability
});
```

## Responsive Testing

### Device Emulation

```typescript
import { test, devices } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test.use({ ...devices['iPhone 12'] });

  test('should render correctly on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Mobile-specific assertions
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    await expect(mobileMenu).toBeVisible();
  });
});

test.describe('Tablet Layout', () => {
  test.use({ ...devices['iPad Pro'] });

  test('should use tablet layout', async ({ page }) => {
    await page.goto('/');
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeGreaterThan(768);
  });
});
```

## Visual Regression Testing

### Screenshot Comparisons

```typescript
test('should match visual snapshot', async ({ page }) => {
  await page.goto('/');
  
  // Take full page screenshot
  await expect(page).toHaveScreenshot('homepage.png');
  
  // Screenshot specific element
  const card = page.locator('[data-testid="product-card"]');
  await expect(card).toHaveScreenshot('product-card.png');
});
```

## Accessibility Testing

### A11y Checks

```typescript
test('should be keyboard accessible', async ({ page }) => {
  await page.goto('/');
  
  // Navigate via keyboard
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  
  // Verify focus management
  const focused = await page.evaluate(() => {
    return document.activeElement?.getAttribute('data-testid');
  });
  expect(focused).toBe('button');
});

test('should have proper ARIA labels', async ({ page }) => {
  await page.goto('/form');
  
  const input = page.locator('input[name="email"]');
  await expect(input).toHaveAttribute('aria-label', /email/i);
});
```

## Advanced Patterns

### Page Objects Pattern

```typescript
class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = '[data-testid="email"]';
    this.passwordInput = '[data-testid="password"]';
    this.submitButton = '[data-testid="login"]';
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email, password) {
    await this.page.fill(this.emailInput, email);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.submitButton);
  }

  async expectError(message) {
    await expect(this.page.locator('[role="alert"]'))
      .toContainText(message);
  }
}

test('login flow with page object', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  await expect(page).toHaveURL('/dashboard');
});
```

## Debugging

### Debug Mode

```bash
# Run tests in debug mode
npx playwright test --debug

# Run with UI inspector
npx playwright test --ui
```

### Taking Traces

```typescript
test('should create trace for debugging', async ({ page }) => {
  // Traces automatically captured on failure (if configured)
  await page.goto('/');
  await page.click('button');
  // On failure: trace saved to test-results/
});

// View trace
// npx playwright show-trace trace.zip
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - run: npm ci
      - run: npm run build
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Best Practices

1. **Use data-testid for selectors** — More stable than CSS/XPath
2. **Test user workflows** — Not implementation details
3. **Wait for elements properly** — Avoid hardcoded timeouts
4. **Run cross-browser tests** — Test on multiple browsers
5. **Use page objects** — Organize complex tests
6. **Take screenshots on failure** — Easier debugging
7. **Keep tests independent** — No interdependencies
8. **Run tests in CI** — Validate all browsers
9. **Parallel execution** — Speed up test runs
10. **Monitor performance** — Track load times

## Package.json Scripts

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:chrome": "playwright test --project=chromium",
    "test:e2e:firefox": "playwright test --project=firefox",
    "test:e2e:webkit": "playwright test --project=webkit"
  }
}
```

---

**Guide Version:** 1.0.0  
**Framework:** Playwright 1.40+, Node.js 16+

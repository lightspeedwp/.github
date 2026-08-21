---
name: playwright-spec-generation
title: Playwright E2E Test Specification Generation Skill
description: Generate comprehensive Playwright end-to-end test specifications with cross-browser support, visual testing, and best practices for modern web applications
version: 1.0.1
category: testing
tags:
  - playwright
  - e2e
  - testing
  - browser-testing
  - cross-browser
  - visual-testing
status: active
---

# Playwright E2E Test Specification Generation Skill

## Overview

The Playwright Specification Generation skill enables the Testing Agent to create comprehensive, production-ready Playwright end-to-end test specifications. Playwright is a modern browser automation framework for testing web applications across Chrome, Firefox, Safari, and Edge browsers with a single API.

### When to Use This Skill

**Use Playwright when:**

- Testing complete user workflows (E2E testing)
- Need cross-browser compatibility testing
- Require visual/screenshot regression testing
- Testing single-page applications (SPA)
- Need to test JavaScript-heavy applications
- Testing responsive behavior across devices
- Require performance testing and metrics

**Playwright is particularly strong for:**

- End-to-end user journey testing
- Multi-browser testing (Chrome, Firefox, Safari, Edge)
- Visual regression testing with screenshots
- Performance metrics collection
- Accessibility testing across browsers
- Mobile device emulation testing

## Setup Instructions

### Installation

```bash
# Install Playwright
npm install --save-dev @playwright/test

# Install browsers (or use 'playwright install' separately)
npx playwright install

# For TypeScript projects
npm install --save-dev @types/node typescript
```

### Configuration Files

**playwright.config.ts** (Basic)

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
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**playwright.config.js** (JavaScript)

```javascript
const config = {
  testDir: './tests/e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
};

module.exports = config;
```

### Package.json Scripts

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:chrome": "playwright test --project=chromium",
    "test:e2e:firefox": "playwright test --project=firefox",
    "test:e2e:webkit": "playwright test --project=webkit",
    "test:e2e:ci": "playwright test --reporter=dot"
  }
}
```

## Usage Examples

### Example 1: Basic Navigation and Interaction

**File:** `tests/e2e/login.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    // Check form elements are visible
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Fill form fields
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'Password123!');

    // Click submit button
    await page.click('button:has-text("Sign In")');

    // Verify navigation to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
  });

  test('should display error with invalid credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrong-password');
    await page.click('button:has-text("Sign In")');

    // Check error message
    await expect(page.locator('[role="alert"]')).toContainText('Invalid credentials');
  });
});
```

### Example 2: Testing Single Page Application

**File:** `tests/e2e/shopping-cart.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
  test('should add product to cart and checkout', async ({ page }) => {
    await page.goto('/products');

    // Search for product
    await page.fill('[data-testid="search"]', 'Laptop');
    await page.click('[data-testid="search-button"]');

    // Wait for results to load
    await page.waitForSelector('[data-testid="product-item"]');

    // Add first product to cart
    await page.click('[data-testid="product-item"] >> nth=0 >> [data-testid="add-to-cart"]');

    // Verify cart badge updates
    const cartBadge = page.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toContainText('1');

    // Navigate to cart
    await page.click('[data-testid="cart-link"]');

    // Verify product in cart
    await expect(page.locator('[data-testid="product-name"]')).toContainText('Laptop');

    // Proceed to checkout
    await page.click('[data-testid="checkout-button"]');

    // Fill checkout form
    await page.fill('[name="cardNumber"]', '4111111111111111');
    await page.fill('[name="expiry"]', '12/25');
    await page.fill('[name="cvc"]', '123');

    // Submit order
    await page.click('[data-testid="place-order"]');

    // Verify success
    await expect(page).toHaveURL('/order-confirmation');
    await expect(page.locator('h1')).toContainText('Order Confirmed');
  });

  test('should update quantity in cart', async ({ page }) => {
    await page.goto('/cart');

    const quantityInput = page.locator('[data-testid="quantity-input"]');
    await quantityInput.fill('5');
    await page.click('[data-testid="update-cart"]');

    // Verify total updates
    const total = page.locator('[data-testid="cart-total"]');
    await expect(total).toContainText('$');
  });
});
```

### Example 3: Responsive Testing Across Devices

**File:** `tests/e2e/responsive.spec.ts`

```typescript
import { test, expect, devices } from '@playwright/test';

// Test on mobile device
test.describe('Mobile Responsiveness', () => {
  test.use({ ...devices['iPhone 12'] });

  test('should render correctly on mobile', async ({ page }) => {
    await page.goto('/');

    // Check mobile menu is visible
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

    // Desktop nav should be hidden
    await expect(page.locator('[data-testid="desktop-nav"]')).not.toBeVisible();

    // Click mobile menu
    await page.click('[data-testid="mobile-menu-toggle"]');

    // Verify menu opens
    await expect(page.locator('[data-testid="mobile-menu-items"]')).toBeVisible();
  });

  test('should handle touch interactions', async ({ page }) => {
    await page.goto('/gallery');

    // Swipe gesture
    const gallery = page.locator('[data-testid="gallery"]');
    await gallery.dragTo(gallery, {
      sourcePosition: { x: 100, y: 100 },
      targetPosition: { x: 10, y: 100 },
    });

    // Verify image changed
    const currentImage = page.locator('[data-testid="current-image"]');
    await expect(currentImage).not.toHaveAttribute('src', /image-1/);
  });
});

// Test on tablet device
test.describe('Tablet Layout', () => {
  test.use({ ...devices['iPad Pro'] });

  test('should use tablet layout', async ({ page }) => {
    await page.goto('/');

    const viewport = page.viewportSize();
    expect(viewport?.width).toBeGreaterThan(768);
    expect(viewport?.width).toBeLessThan(1024);

    // Check layout adjustments
    const sidebar = page.locator('[data-testid="sidebar"]');
    await expect(sidebar).toBeVisible();
  });
});
```

### Example 4: Visual Regression Testing

**File:** `tests/e2e/visual.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('homepage snapshot matches', async ({ page }) => {
    await page.goto('/');

    // Wait for all images to load
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('product page visual consistency', async ({ page }) => {
    await page.goto('/products/laptop-123');

    // Take screenshot of product card
    const productCard = page.locator('[data-testid="product-card"]');
    await expect(productCard).toHaveScreenshot('product-card.png');
  });

  test('form validation visual feedback', async ({ page }) => {
    await page.goto('/contact');

    // Submit empty form
    await page.click('button[type="submit"]');

    // Verify error styling
    const errors = page.locator('[data-testid="form-error"]');
    await expect(errors).toHaveCount(3);

    // Take screenshot showing validation errors
    await expect(page.locator('form')).toHaveScreenshot('form-errors.png');
  });
});
```

### Example 5: Accessibility Testing

**File:** `tests/e2e/accessibility.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Accessibility', () => {
  test('main navigation is keyboard accessible', async ({ page }) => {
    await page.goto('/');

    const navLinks = page.locator('[data-testid="nav-link"]');
    const count = await navLinks.count();

    // Tab through all links
    for (let i = 0; i < count; i++) {
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
      expect(focusedElement).toBe('nav-link');
    }
  });

  test('form has proper labels and ARIA attributes', async ({ page }) => {
    await page.goto('/contact');

    // Check label associations
    const emailInput = page.locator('input[name="email"]');
    const emailLabel = page.locator('label[for="email"]');

    await expect(emailLabel).toBeVisible();
    await expect(emailInput).toHaveAttribute('aria-label', /email/i);
  });

  test('page has no accessibility violations', async ({ page }) => {
    await page.goto('/');

    // Inject axe and check for violations
    await injectAxe(page);
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  });

  test('modals have proper focus management', async ({ page }) => {
    await page.goto('/');

    // Open modal
    await page.click('[data-testid="open-modal"]');

    // Focus should be within modal
    const focusedElement = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      return modal?.contains(document.activeElement);
    });

    expect(focusedElement).toBe(true);

    // Close modal
    await page.click('[data-testid="close-modal"]');

    // Focus should return to trigger button
    const triggeredButton = await page.evaluate(() => {
      return document.activeElement?.getAttribute('data-testid');
    });

    expect(triggeredButton).toBe('open-modal');
  });
});
```

## Best Practices

1. **Use Data Test IDs** — Make selectors stable and maintainable

   ```typescript
   // ✅ Good: Use data-testid
   await page.click('[data-testid="submit-button"]');
   
   // ❌ Avoid: Brittle selectors
   await page.click('button.btn.btn-primary:nth-of-type(2)');
   ```

2. **Wait for Elements Properly** — Don't use arbitrary sleeps

   ```typescript
   // ✅ Good: Wait for element
   await page.waitForSelector('[data-testid="result"]');
   
   // ❌ Avoid: Hard-coded sleep
   await page.waitForTimeout(5000);
   ```

3. **Use Page Objects/Fixtures** — Encapsulate page interactions

   ```typescript
   class LoginPage {
     constructor(page) { this.page = page; }
     
     async login(email, password) {
       await this.page.fill('[data-testid="email"]', email);
       await this.page.fill('[data-testid="password"]', password);
       await this.page.click('[data-testid="login"]');
     }
   }
   ```

4. **Test User Workflows** — E2E tests should represent real usage

   ```typescript
   // ✅ Good: Complete user journey
   // Search → Add to cart → Checkout → Confirmation
   
   // ❌ Avoid: Testing implementation details
   // Click on specific element IDs
   ```

5. **Handle Waits Correctly** — Use explicit waits for async operations

   ```typescript
   // ✅ Good: Wait for network to settle
   await page.waitForLoadState('networkidle');
   
   // ✅ Good: Wait for specific condition
   await page.waitForFunction(() => window.pageLoaded);
   ```

6. **Test Cross-Browser** — Use multiple browser projects

   ```typescript
   // Config includes chromium, firefox, webkit
   // Run: npx playwright test --project=firefox
   ```

7. **Isolate Tests** — Each test should be independent

   ```typescript
   // ✅ Good: Fresh state each test
   test.beforeEach(async ({ page }) => {
     await page.goto('/reset');
   });
   ```

8. **Use Meaningful Assertions** — Clear failure messages

   ```typescript
   // ✅ Good: Specific expectation
   await expect(page.locator('[role="alert"]')).toContainText('Error');
   
   // ❌ Avoid: Generic checks
   expect(page).toBeTruthy();
   ```

9. **Capture Evidence** — Screenshots and traces for debugging

   ```typescript
   // Configured to capture on failure
   // Use: trace: 'on-first-retry'
   // Inspect: npx playwright show-trace trace.zip
   ```

10. **Run Tests Frequently** — Integrate into CI/CD

    ```bash
    # Local development
    npm run test:e2e:headed
    
    # CI pipeline
    npm run test:e2e:ci
    ```

## Integration with Testing Agent

This skill integrates with the Testing Agent's multi-framework architecture:

1. **Framework Selection** — Used when Playwright is selected via Framework Selection matrix
2. **Core Prompt Reference** — Follows Playwright rules from `agents/testing-agent/shared/core-prompt.md`
3. **Provider Support** — Compatible with Claude, Copilot, and OpenAI providers
4. **Skill Composition** — Works alongside Jest, PHPUnit, and pytest skills

## Validation

### Test Quality Checklist

- [ ] All tests use data-testid selectors
- [ ] No hardcoded timeouts (use wait-for-* methods)
- [ ] Tests are isolated and independent
- [ ] Cross-browser testing included
- [ ] Visual regression tests captured
- [ ] Accessibility checks implemented
- [ ] Page objects used for complex pages
- [ ] Error cases are tested
- [ ] Mobile/tablet responsiveness tested

### Coverage Targets

- **User Workflows:** ≥80% coverage
- **Critical Paths:** 100% coverage
- **Browser Combinations:** Chromium, Firefox, WebKit minimum

## References

### Official Documentation

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Test](https://playwright.dev/docs/test-intro)
- [Locators Guide](https://playwright.dev/docs/locators)
- [Best Practices](https://playwright.dev/docs/best-practices)

### Advanced Topics

- [Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
- [Performance Testing](https://playwright.dev/docs/performance)
- [Debugging Tests](https://playwright.dev/docs/debug)

### Related Skills

- [[jest-spec-generation]] — JavaScript testing with Jest
- [[phpunit-spec-generation]] — PHP testing with PHPUnit
- [[pytest-spec-generation]] — Python testing with pytest

---

**Skill Version:** 1.0.0  
**Last Updated:** 2026-08-17  
**Status:** Production Ready  
**Framework:** Playwright 1.40+, Node.js 16+

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

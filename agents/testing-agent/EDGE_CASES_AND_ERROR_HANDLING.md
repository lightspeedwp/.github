---
file_type: documentation
title: Playwright Testing Agent — Edge Cases & Error Handling Patterns
description: Comprehensive guide to identifying, testing, and handling edge cases and error states in Playwright test packs. Covers network failures, async boundaries, state leakage, and WooCommerce-specific error scenarios.
last_updated: '2026-08-21'
domain: generic
tags:
  - playwright
  - testing
  - edge-cases
  - error-handling
  - woocommerce
---

# Edge Cases & Error Handling Patterns

This guide complements the core Playwright Testing Agent documentation by
providing patterns for identifying and testing edge cases, error states, and
failure modes that are commonly overlooked in initial test packs.

## 1. Network Boundary Failures

### 1.1 Timeout & Retry Scenarios

When testing requests that cross network boundaries:

- **Slow responses** — test with realistic latency (200–500ms for API calls)
- **Partial responses** — validate handling when upstream returns incomplete data
- **Connection drops** — test recovery when connection closes mid-stream
- **Rate limiting** — confirm graceful degradation under 429/503 responses
- **Stale cache** — verify behaviour when cache expires during interaction

**Test pattern:**

```javascript
// Do not mock network calls; use playwright's network interception with realistic delays
await page.route('**/api/products', async (route) => {
  await page.waitForTimeout(300); // Simulate network latency
  await route.continue();
});
```

### 1.2 Redirect Chains

- **Infinite redirects** — ensure test detects and fails safely (not hangs)
- **Auth redirects** — confirm session is properly captured after redirect
- **Cross-origin redirects** — verify no credential leakage, CORS handling
- **Invalid redirects** — test navigation to non-existent targets

## 2. Async Boundary Issues

### 2.1 Race Conditions

Common async traps in WordPress/WooCommerce sites:

- **DOM not yet rendered** — wait for element availability, not just presence
- **JS not yet executed** — hooks may fire after DOM is ready
- **AJAX requests pending** — confirm all in-flight requests complete before assertion
- **Custom hooks firing** — WordPress `wp_ready` or custom js events may delay rendering
- **WooCommerce fragments** — cart updates via AJAX may race with page load

**Test pattern:**

```javascript
// Wait for network idle BEFORE assertions on dynamically rendered content
await page.waitForLoadState('networkidle');
await expect(page.locator('[data-wc-cart-count]')).toBeVisible();
```

### 2.2 State Leakage Between Tests

- **Session persistence** — confirm auth tokens/cookies don't bleed between tests
- **Cart state** — WooCommerce cart persists; clear between test runs
- **Product cache** — product data may cache; clear if test alters it
- **User preferences** — localStorage, IndexedDB, service worker cache
- **Analytics flags** — tracking pixels and conversion tags may fire in teardown

## 3. Accessibility Edge Cases

### 3.1 WCAG 2.2 AA Common Failures

- **Focus trapping** — modals must trap focus; test Tab cycle within modal
- **Keyboard navigation** — all interactive elements reachable via keyboard
- **Colour contrast** — ensure 4.5:1 for text on background (check light + dark modes)
- **Form labels** — inputs must have associated labels (not just placeholder text)
- **ARIA misuse** — `role` attributes must match actual behaviour
- **Missing alt text** — images must have meaningful alt; decorative images get `alt=""`

**Test pattern:**

```javascript
// Axe accessibility tests in test pack, with custom ruleset for WCAG 2.2 AA
import { injectAxe, checkA11y } from 'axe-playwright';

await injectAxe(page);
await checkA11y(page, null, {
  runOnly: { type: 'tag', values: ['wcag2aa'] }
});
```

### 3.2 Screen Reader Announcements

- **Dynamic content** — ARIA live regions must announce changes (cart updates, errors)
- **Loading states** — `aria-busy` or loading spinners must be announced
- **Form validation** — errors must be announced, not just visually obvious
- **Skip links** — present but may not be keyboard-accessible

## 4. WooCommerce-Specific Edge Cases

### 4.1 Cart & Checkout

- **Out-of-stock during checkout** — product removed from cart between step 1 and step 2
- **Price change** — product price updates while in cart
- **Coupon expiry** — applied coupon expires mid-checkout
- **Minimum order amount** — cart value dips below minimum (e.g., stock reduction)
- **Shipping recalculation** — shipping method changes based on address; re-select required
- **Payment gateway unavailable** — fallback to alternative payment method

**Minimum test coverage:**

```javascript
// Simulate stock change during checkout
test('cart quantity reduced if stock limited during payment', async ({ page }) => {
  // Add 5 units to cart
  // Proceed to checkout
  // Backend: reduce available stock to 2
  // User: proceed to payment
  // Assert: quantity automatically reduced, user notified
});
```

### 4.2 Subscription & Recurring Billing

- **First payment fails, retry** — test manual retry flow
- **Subscription paused/resumed** — state transitions and messaging
- **Payment method update** — changing card during active subscription
- **Renewal date calculation** — leap years, month boundaries
- **Downgrade/upgrade mid-cycle** — proration and credit handling

### 4.3 Inventory & Fulfillment

- **Backorder scenarios** — partial fulfillment when stock split across locations
- **Order cancellation** — refund workflow and inventory return
- **Reorder from history** — out-of-stock product in history, customer reorders
- **Bulk discounts at threshold** — quantity discount triggers at exact boundary

## 5. Console & Network Error Handling

### 5.1 Expected Errors (Logging)

Some errors are expected and should be logged but not fail tests:

- **Deprecation warnings** — old jQuery plugins may warn; expected in legacy themes
- **Third-party script errors** — Google Ads, analytics may fail; test fallback
- **Polyfill warnings** — older browser polyfills may log warnings
- **Font loading errors** — web font CDN down; should not break page

**Test pattern:**

```javascript
// Capture and filter console messages
const errors = [];
page.on('console', msg => {
  if (!msg.text().includes('expected-deprecation-warning')) {
    if (msg.type() === 'error') errors.push(msg.text());
  }
});
// Assert only critical errors
```

### 5.2 Network Errors (4xx/5xx)

- **404 for non-critical assets** — inline SVG fallback, missing third-party image
- **5xx from external API** — site must degrade, not crash
- **Mixed content warnings** — HTTP content on HTTPS page; blocked in some browsers
- **CSP violations** — content security policy may block certain requests

## 6. Temporal & Concurrency Patterns

### 6.1 Time-Dependent Behavior

- **Time-limited offers** — coupon valid only during specific hours/dates
- **Flash sales** — product availability window
- **Scheduled events** — feature flags triggered by date/time
- **Timezone handling** — sale times differ by region

### 6.2 Concurrent User Actions

- **Two tabs, same account** — session conflict handling
- **Simultaneous checkouts** — race condition in inventory reservation
- **Cache invalidation** — one tab updates product; second tab sees stale data

## 7. Test Data & Fixture Management

### 7.1 Data Cleanup

- **Product creation** — created products must be deleted in teardown
- **Orders** — test orders must not interfere with analytics or reports
- **Coupons** — limited-use coupons; reset counters between runs
- **Users** — test users must be isolated; never use production accounts

### 7.2 Fixture Isolation

- **Database state** — use transactions to roll back changes
- **File uploads** — delete uploaded files in teardown
- **Cache warming** — pre-load static assets to avoid timeout variability
- **External service mocking** — payment gateway, shipping calculators

## 8. Browser-Specific Edge Cases

### 8.1 Cross-Browser Differences

- **Mobile viewport** — touch events, viewport width, font scaling
- **Safari quirks** — CSS grid rendering, video autoplay restrictions
- **Firefox layout** — scroll bar width affects layout on Windows
- **Edge (Chromium)** — mostly Chromium-compatible; check newer CSS features

### 8.2 Responsive Design

- **Breakpoint transitions** — layout changes at exact viewport width
- **Device orientation** — landscape vs. portrait behavior
- **Touch vs. mouse** — hover states unavailable on touch; test click-only UX
- **Font scaling** — user set browser to 120%; text may overflow containers

## 9. Checklist for Complete Edge Case Coverage

Use this checklist when building a test pack to ensure edge cases are identified:

- [ ] Network failures (timeout, partial response, connection drop)
- [ ] Async race conditions (DOM render timing, AJAX, hooks)
- [ ] State leakage between tests (session, cache, local storage)
- [ ] Accessibility (focus trapping, keyboard nav, colour contrast, ARIA)
- [ ] WooCommerce flows (out-of-stock, price changes, coupon expiry)
- [ ] Console/network errors (expected vs. critical)
- [ ] Temporal boundaries (date/time-dependent features)
- [ ] Concurrent user actions (multi-tab, race conditions)
- [ ] Data cleanup (product, order, coupon, user fixtures)
- [ ] Cross-browser differences (viewport, Safari quirks, touch)

## 10. Failure Triage: From Edge Case to Root Cause

When an edge case test fails in CI:

1. **Reproduce locally** — run the specific test case on your machine
2. **Check test data** — confirm fixture state hasn't drifted
3. **Check async timing** — add extra waits to confirm race condition
4. **Check external services** — verify payment gateway, shipping APIs are up
5. **Check browser state** — clear cache, restart browser, test again
6. **Isolate the assertion** — which step fails? Network, DOM, event, assertion?
7. **Add logging** — console, network logs, database state before/after

---

**Related documentation:**

- [Playwright Testing Agent](./AGENT.md) — core agent specification
- [How to Test the Playwright Testing Agent](./TESTING.md) — packaging and provider validation
- [Test Pack Builder](./skills/agent-attached/hermes/test-pack-builder/SKILL.md) — creating review-ready test packs

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

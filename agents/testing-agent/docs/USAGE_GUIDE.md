# Testing Agent v2.2.0 — Usage Guide

## Quick Start (5 Minutes)

### Step 1: Set Up Your Testing Environment

```bash
# Clone the repository
git clone https://github.com/lightspeedwp/project-name.git
cd project-name

# Install framework-specific dependencies
npm install --save-dev jest @types/jest           # For Jest tests
composer require --dev phpunit/phpunit            # For PHPUnit tests
pip install pytest pytest-asyncio                 # For pytest tests
npm install -D @playwright/test                   # For Playwright tests
```

### Step 2: Provide Your PRD or Acceptance Criteria

```markdown
# Feature: Checkout Flow Validation

## Acceptance Criteria
1. User can proceed to payment with valid cart
2. Validation errors display for invalid inputs
3. Payment method selection works cross-browser
```

### Step 3: Get a Test Pack

```
Request to Testing Agent:
"Turn this checkout PRD into a test pack for our WooCommerce staging site."

Output:
- Requirement extraction (linked to your PRD)
- Human-readable test cases
- Traceability matrix
- REVIEW GATE (approve before code generation)
```

### Step 4: Generate Framework-Specific Tests

Once approved, specify which framework:

```
"Pack approved — generate the Playwright specs for e2e testing."
```

**Output:** Production-ready test code for your chosen framework.

---

## Framework Selection Guide

### Use Jest When

- Testing JavaScript/TypeScript frontend code
- Writing unit tests for React components
- Mocking external API calls
- Testing WordPress JavaScript plugins

**Example:** WooCommerce checkout form validation

```javascript
// Your Jest test
describe('CheckoutForm', () => {
  test('validates email field', () => {
    // Test component validation logic
  });
});
```

### Use PHPUnit When

- Testing PHP backend logic
- Testing WordPress plugins & themes
- Writing integration tests with database
- Testing WooCommerce custom endpoints

**Example:** WordPress plugin activation

```php
// Your PHPUnit test
public function test_plugin_activation() {
    // Test activation hooks and database setup
}
```

### Use pytest When

- Testing Python integration code
- Running API contract tests
- Testing data pipelines
- End-to-end integration with multiple services

**Example:** Payment API integration

```python
@pytest.mark.asyncio
async def test_payment_processing():
    # Test payment flow asynchronously
    pass
```

### Use Playwright When

- Testing user-visible behavior end-to-end
- Cross-browser compatibility testing (Chrome, Firefox, Safari)
- Screenshot validation & visual regression
- Accessibility testing with real browser DOM
- WooCommerce storefront testing

**Example:** Multi-browser checkout flow

```javascript
// Your Playwright test
test('checkout works on Chrome, Firefox, and Safari', async () => {
  // Test same flow across multiple browsers
});
```

---

## Basic Usage Examples

### Example 1: From PRD to Test Pack

**Your Input:**

```markdown
# PRD: Search Filtering

Users should be able to filter products by:
1. Price range (slider: $0–$1000)
2. Category (multi-select)
3. Rating (5-star selector)

Filter results should update in <500ms.
Filters should persist in URL query params.
```

**Agent Process:**

1. Extract requirements → 5 confirmed requirement IDs (SEARCH-1 through SEARCH-5)
2. Generate human-readable test cases (framework-agnostic)
3. Create traceability matrix
4. Present for review

**Your Approval:**
"Pack approved — all tests cover the requirements."

**Agent Output:**
Choose your framework:

- Jest: Test filter logic in isolation
- Playwright: Test full search UI with real product catalog
- PHPUnit: Test filter backend API endpoints
- pytest: Test filter performance and caching layer

### Example 2: WordPress Plugin Testing Workflow

```
User: "I need tests for my new WooCommerce extension."

Agent:
1. Extract requirements from plugin spec
2. Create test cases for:
   - Plugin activation/deactivation
   - Settings page functionality
   - Frontend integration
   - WooCommerce hook integration
3. Present human-readable pack
4. On approval: Generate PHPUnit tests

Output: Production-ready PHPUnit test suite with WordPress assertions
```

### Example 3: Multi-Framework Coverage Strategy

**For a complex checkout feature:**

```
Jest:      Component rendering & validation logic
PHPUnit:   Order processing & database operations
Playwright: End-to-end user flow (staging environment)
pytest:    Payment processor API integration
```

This layered approach ensures:

- Fast unit tests (Jest: 100ms)
- Integration validation (PHPUnit: 500ms)
- Real browser testing (Playwright: 2-5s per test)
- External API contracts (pytest: 1-2s per test)

---

## Advanced Patterns

### Pattern 1: Requirement Traceability

Every test links back to your PRD:

```javascript
test('CHECKOUT-3: Order summary updates on quantity change', async () => {
  // Test requirement CHECKOUT-3 from PRD
  // Links to test case TC-03-001
  // Covers acceptance criterion: "Cart updates reflect quantity changes"
});
```

### Pattern 2: WordPress-Specific Testing

For WooCommerce sites, use WordPress-specific patterns:

**PHPUnit with WordPress Hooks:**

```php
class CustomCheckoutTest extends WP_UnitTestCase {
    public function test_custom_checkout_field() {
        // Test custom WooCommerce checkout field
        do_action('woocommerce_checkout_fields');
        $this->assertTrue(has_action('woocommerce_checkout_fields'));
    }
}
```

**Playwright with WooCommerce Admin:**

```javascript
test('WooCommerce admin can create product', async ({ page }) => {
  await page.goto('http://staging.site/wp-admin/post-new.php?post_type=product');
  await page.fill('input[name="post_title"]', 'Test Product');
  await page.click('button:has-text("Publish")');
  // Verify product created in database
});
```

### Pattern 3: Cross-Browser Visibility Testing

Playwright captures visual differences:

```javascript
test('checkout form renders consistently', async ({ browserName, page }) => {
  await page.goto('checkout-page');
  
  // Screenshot for visual regression
  await expect(page).toHaveScreenshot(`checkout-${browserName}.png`);
  
  // Accessibility audit
  const violations = await axe(page);
  expect(violations).toHaveLength(0);
});
```

### Pattern 4: Failure Triage with Evidence

When a test fails:

```
Failure: "Checkout button disabled after payment submission"

Triage captures:
- Screenshot at failure point
- Console errors (if any)
- Network requests (payment API call)
- Requirement ID this test covers (CHECKOUT-8)
- Environment info (staging, Chrome 120)

Option: Export to BugHerd with full evidence
```

---

## Real-World WordPress Examples

### Example: WooCommerce Product Listing

**Requirement:** "Product grid should load and display items"

**Jest Test** (Frontend component):

```javascript
describe('ProductGrid', () => {
  test('displays products with correct attributes', () => {
    const products = [
      { id: 1, name: 'Product A', price: 19.99 },
      { id: 2, name: 'Product B', price: 29.99 }
    ];
    const { getByText } = render(<ProductGrid products={products} />);
    expect(getByText('Product A')).toBeInTheDocument();
  });
});
```

**PHPUnit Test** (WooCommerce API):

```php
class ProductListingTest extends WP_UnitTestCase {
    public function test_products_query_returns_correct_data() {
        $products = wc_get_products(['limit' => 10]);
        $this->assertCount(10, $products);
        $this->assertInstanceOf('WC_Product', $products[0]);
    }
}
```

**Playwright Test** (End-to-end):

```javascript
test('product listing page loads and displays items', async ({ page }) => {
  await page.goto('http://staging.site/shop');
  
  // Wait for products to load
  await page.waitForSelector('.woocommerce-loop-product');
  
  // Verify product count
  const products = await page.$$('.woocommerce-loop-product');
  expect(products.length).toBeGreaterThan(0);
  
  // Click first product and verify detail page
  await products[0].click();
  await expect(page).toHaveURL(/\/product\//);
});
```

### Example: Custom Plugin Settings Page

**Jest:** Test settings form validation
**PHPUnit:** Test settings storage in database
**Playwright:** Test end-to-end settings workflow

---

## Troubleshooting

### Issue: "I don't know which framework to use"

**Solution:** Ask the agent!

```
Request: "I need tests for [your feature]. Which framework(s) should I use?"

Agent responds with:
- Recommended framework(s)
- Why that choice
- Alternative options
- Sample test structure
```

### Issue: "My test pack got rejected"

**Next step:**

```
"Here's my feedback on the test pack: [specific concerns]"

Agent:
1. Revises test cases
2. Explains the changes
3. Presents updated pack
```

### Issue: "Test is failing but I don't understand why"

**Solution:**

```
Request: "Debug this Playwright failure: [error message]"

Agent provides:
- Root cause analysis
- Screenshot/console output
- Fix recommendation
- Revised test code (if applicable)
```

---

## Performance Tips

### Jest Tests (Fastest)

- Aim for <100ms per test
- Use mocks to avoid external calls
- Group related tests with `describe` blocks

### PHPUnit Tests (Medium)

- Aim for <500ms per test
- Use test databases to avoid data conflicts
- Use `@dataProvider` for parametrized tests

### Playwright Tests (Slowest but Most Realistic)

- Aim for <5s per test
- Reuse browser context between tests
- Use parallelization: `test.describe.parallel()`

### pytest Tests (Integration)

- Aim for <2s per test with real APIs
- Use async/await for concurrent requests
- Cache fixtures to avoid repeated setup

---

## Workflow: From PRD to Production

```
1. PRD or requirements → Agent
2. Agent extracts and classifies requirements
3. Human-readable test cases generated
4. REVIEW GATE: Approve or revise
5. Framework selection: Choose 1+ frameworks
6. Code generation: Agent writes framework-specific tests
7. Local run: Execute tests locally
8. CI integration: Run on every commit
9. Failure triage: Agent helps debug failures
10. Production: Deploy with confidence
```

---

## Related Documentation

- [Testing Strategy Guide](./TESTING_GUIDE.md) — Framework-specific patterns and strategies
- [Migration Guide](./MIGRATION_GUIDE.md) — Upgrading from v2.1
- [Jest Implementation Guide](../guides/jest-implementation-guide.md)
- [PHPUnit Implementation Guide](../guides/phpunit-implementation-guide.md)
- [pytest Implementation Guide](../guides/pytest-implementation-guide.md)
- [Playwright Implementation Guide](../guides/playwright-implementation-guide.md)
- [Agent AGENT.md](../AGENT.md) — Core agent documentation

---

*Testing Agent v2.2.0 · Multi-Framework Testing for WordPress & WooCommerce*

# Testing Strategy Guide — Testing Agent v2.2.0

## Overview

This guide provides framework-specific testing strategies and patterns for different test types. Each framework excels at specific testing scenarios—use this guide to understand when and how to apply each.

---

## Part 1: Framework Selection Strategy

### Decision Matrix

```
┌─────────────────┬────────┬────────┬────────┬────────────┐
│ Test Type       │ Jest   │ PHPUnit│ pytest │ Playwright │
├─────────────────┼────────┼────────┼────────┼────────────┤
│ Unit Tests      │   ✅   │   ✅   │   ✅   │     ❌     │
│ Integration     │   ✅   │   ✅   │   ✅   │     ✅     │
│ E2E User Flow   │   ❌   │   ❌   │   ❌   │     ✅     │
│ Visual/Visual   │   ❌   │   ❌   │   ❌   │     ✅     │
│ Accessibility   │   ⚠️   │   ⚠️   │   ⚠️   │     ✅     │
│ API Contract    │   ✅   │   ✅   │   ✅   │     ❌     │
│ Performance     │   ⚠️   │   ⚠️   │   ✅   │     ⚠️     │
└─────────────────┴────────┴────────┴────────┴────────────┘

Legend: ✅ Ideal | ✅ Good | ⚠️ Possible | ❌ Not suitable
```

---

## Part 2: Jest Testing Strategy

### Use Jest For
- JavaScript/TypeScript unit tests
- React component testing
- Mocking external APIs
- Testing frontend logic
- Test-driven development (TDD)

### Jest Test Structure

```javascript
// Location: __tests__/ComponentName.test.js or ComponentName.test.js

describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    // Initialize test data, mock DOM
  });

  // Group related tests
  describe('renders correctly', () => {
    test('displays loading state initially', () => {
      const { getByText } = render(<MyComponent isLoading={true} />);
      expect(getByText(/loading/i)).toBeInTheDocument();
    });

    test('shows content when loaded', () => {
      const { getByText } = render(<MyComponent isLoading={false} data={mockData} />);
      expect(getByText(mockData.title)).toBeInTheDocument();
    });
  });

  // Cleanup
  afterEach(() => {
    jest.clearAllMocks();
  });
});
```

### Jest Best Practices

1. **File Organization**
   - Place tests adjacent to source files
   - Use `.test.js` or `.spec.js` extensions
   - Mirror directory structure

2. **Test Naming**
   - Describe the behavior: `should render loading state when isLoading is true`
   - Use `test()` or `it()` for individual tests
   - Group with `describe()` blocks

3. **Assertions**
   - Use specific matchers: `toBeInTheDocument()`, `toHaveBeenCalled()`
   - Avoid overly generic assertions
   - One assertion per test (usually)

4. **Mocking**
   ```javascript
   // Mock external dependencies
   jest.mock('../api', () => ({
     fetchUser: jest.fn().mockResolvedValue({ id: 1, name: 'John' })
   }));

   // Mock localStorage
   const localStorageMock = {
     getItem: jest.fn(),
     setItem: jest.fn(),
     clear: jest.fn()
   };
   Object.defineProperty(window, 'localStorage', { value: localStorageMock });
   ```

### Real-World Example: Form Validation

```javascript
describe('CheckoutForm', () => {
  test('validates email format', () => {
    const { getByRole, getByText } = render(<CheckoutForm />);
    const emailInput = getByRole('textbox', { name: /email/i });
    
    // Test invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    expect(getByText(/invalid email/i)).toBeInTheDocument();
    
    // Test valid email
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.blur(emailInput);
    expect(queryByText(/invalid email/i)).not.toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    const mockOnSubmit = jest.fn();
    const { getByRole } = render(<CheckoutForm onSubmit={mockOnSubmit} />);
    
    fireEvent.change(getByRole('textbox', { name: /email/i }), {
      target: { value: 'user@example.com' }
    });
    fireEvent.click(getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        email: 'user@example.com'
      }));
    });
  });
});
```

---

## Part 3: PHPUnit Testing Strategy

### Use PHPUnit For
- PHP backend logic
- WordPress plugin testing
- WooCommerce integration
- Database operations
- API endpoint testing

### PHPUnit Test Structure

```php
<?php
namespace YourProject\Tests\Unit;

use PHPUnit\Framework\TestCase;

class CheckoutOrderTest extends TestCase {
  // Setup
  protected function setUp(): void {
    parent::setUp();
    // Initialize test database, fixtures
  }

  // Test grouped by functionality
  public function test_order_calculates_total_correctly(): void {
    $order = new Order();
    $order->addItem('product-1', 100, 2); // $100 × 2
    
    $this->assertEquals(200, $order->getTotal());
  }

  public function test_order_applies_discount(): void {
    $order = new Order(200);
    $order->applyDiscount(0.10); // 10% discount
    
    $this->assertEquals(180, $order->getTotal());
  }

  // Cleanup
  protected function tearDown(): void {
    parent::tearDown();
    // Clean database, reset state
  }
}
```

### WordPress-Specific Testing

```php
class WordPressPluginTest extends WP_UnitTestCase {
  public function test_plugin_activation_hook(): void {
    // Verify hook is registered
    $this->assertTrue(has_action('plugins_loaded', 'my_plugin_init'));
  }

  public function test_custom_post_type_registered(): void {
    $this->assertTrue(post_type_exists('my_custom_type'));
  }

  public function test_woocommerce_filter_applied(): void {
    $order = wc_create_order();
    $total = apply_filters('custom_order_total', $order->get_total(), $order);
    
    $this->assertNotNull($total);
  }
}
```

### WooCommerce Order Testing

```php
class WooCommerceOrderTest extends WP_UnitTestCase {
  public function test_order_status_changes(): void {
    $order = wc_create_order();
    
    // Initial status
    $this->assertEquals('pending', $order->get_status());
    
    // Change status
    $order->set_status('processing');
    $order->save();
    
    // Verify state persisted
    $updated_order = new WC_Order($order->get_id());
    $this->assertEquals('processing', $updated_order->get_status());
  }

  public function test_order_payment_received(): void {
    $order = wc_create_order();
    $order->payment_complete();
    
    $this->assertTrue($order->is_paid());
    $this->assertEquals('processing', $order->get_status());
  }
}
```

### PHPUnit Best Practices

1. **Test Naming**
   - Use snake_case: `test_order_calculates_total_correctly()`
   - Describe the expected outcome
   - One assertion per test (usually)

2. **Data Providers**
   ```php
   /**
    * @dataProvider productPriceProvider
    */
   public function test_product_pricing($quantity, $unitPrice, $expected): void {
     $product = new Product($unitPrice);
     $this->assertEquals($expected, $product->calculateTotal($quantity));
   }

   public function productPriceProvider(): array {
     return [
       [1, 100, 100],
       [2, 100, 200],
       [10, 50, 500]
     ];
   }
   ```

3. **Database Transactions**
   ```php
   public function test_insert_and_rollback(): void {
     // Test runs in transaction; automatically rolls back
     $user_id = wp_insert_user([
       'user_login' => 'testuser',
       'user_email' => 'test@example.com'
     ]);
     
     $this->assertIsInt($user_id);
   } // Database automatically rolls back
   ```

---

## Part 4: pytest Testing Strategy

### Use pytest For
- Python integration tests
- API contract testing
- Data pipeline validation
- Async/concurrent testing
- Cross-service integration

### pytest Test Structure

```python
import pytest
from typing import Generator

@pytest.fixture
def api_client() -> Generator:
    """Fixture: Initialize API client"""
    client = APIClient(base_url='http://api.staging.local')
    yield client
    client.close()

class TestPaymentProcessing:
    def test_process_payment_success(self, api_client):
        """Test: Payment processing succeeds with valid data"""
        response = api_client.process_payment(
            amount=99.99,
            currency='USD',
            card_token='tok_valid'
        )
        
        assert response.status_code == 200
        assert response.data['status'] == 'completed'
        assert response.data['amount'] == 99.99

    def test_process_payment_insufficient_funds(self, api_client):
        """Test: Payment fails with insufficient funds"""
        response = api_client.process_payment(
            amount=99.99,
            currency='USD',
            card_token='tok_insufficient_funds'
        )
        
        assert response.status_code == 402
        assert response.data['error_code'] == 'insufficient_funds'

    @pytest.mark.asyncio
    async def test_concurrent_payments(self, api_client):
        """Test: Multiple concurrent payments processed correctly"""
        tasks = [
            api_client.process_payment_async(amount=50.00)
            for _ in range(5)
        ]
        
        results = await asyncio.gather(*tasks)
        assert all(r.status_code == 200 for r in results)
        assert len(results) == 5
```

### pytest Parametrization

```python
@pytest.mark.parametrize('email,valid', [
    ('user@example.com', True),
    ('invalid.email', False),
    ('test@localhost', False),
    ('user+tag@example.co.uk', True),
])
def test_email_validation(email, valid):
    """Test: Email validation with multiple cases"""
    assert EmailValidator.is_valid(email) == valid
```

### pytest Fixtures (Advanced)

```python
@pytest.fixture(scope='session')
def database():
    """Fixture: Session-scoped database"""
    db = Database('postgresql://test:password@localhost/test_db')
    db.setup()
    yield db
    db.teardown()

@pytest.fixture
def database_transaction(database):
    """Fixture: Database transaction (auto-rollback)"""
    transaction = database.begin()
    yield database
    transaction.rollback()

def test_insert_order(database_transaction):
    """Test: Insert order in transaction"""
    order_id = database_transaction.insert_order({
        'customer': 'John',
        'total': 99.99
    })
    
    assert database_transaction.order_exists(order_id)
```

---

## Part 5: Playwright Testing Strategy

### Use Playwright For
- End-to-end user flows
- Cross-browser testing
- Visual regression
- Accessibility testing
- Real-world behavior validation

### Playwright Test Structure

```javascript
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('user completes purchase end-to-end', async ({ page, browser }) => {
    // Navigate
    await page.goto('https://staging.shop/');
    
    // Add product to cart
    await page.click('text=Add to Cart');
    
    // Verify cart updated
    const cartCount = await page.textContent('.cart-count');
    expect(cartCount).toBe('1');
    
    // Proceed to checkout
    await page.click('text=Checkout');
    
    // Fill shipping form
    await page.fill('input[name="address"]', '123 Main St');
    await page.fill('input[name="city"]', 'New York');
    await page.selectOption('select[name="state"]', 'NY');
    
    // Submit order
    await page.click('button:has-text("Place Order")');
    
    // Verify order confirmation
    await expect(page).toHaveURL(/\/order\/[0-9]+/);
    await expect(page.locator('text=Order confirmed')).toBeVisible();
  });

  test.describe('Cross-browser compatibility', () => {
    const browsers = ['chromium', 'firefox', 'webkit'];

    browsers.forEach(browserName => {
      test(`checkout works on ${browserName}`, async ({ playwright }) => {
        const browser = await playwright[browserName].launch();
        const context = await browser.newContext();
        const page = await context.newPage();
        
        // Full checkout flow
        await page.goto('https://staging.shop/');
        // ... checkout steps ...
        
        await browser.close();
      });
    });
  });
});
```

### Playwright Accessibility Testing

```javascript
import { injectAxe, checkA11y } from 'axe-playwright';

test('checkout page is accessible', async ({ page }) => {
  await page.goto('https://staging.shop/checkout');
  
  // Inject axe
  await injectAxe(page);
  
  // Check accessibility
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: {
      html: true
    }
  });
});

test('keyboard navigation works', async ({ page }) => {
  await page.goto('https://staging.shop/checkout');
  
  // Tab through form
  await page.press('input[name="email"]', 'Tab');
  await expect(page.locator('input[name="fullname"]')).toBeFocused();
  
  // Submit with Enter
  await page.press('button[type="submit"]', 'Enter');
  await expect(page).toHaveURL(/\/confirmation/);
});
```

### Playwright Visual Testing

```javascript
test('checkout form renders consistently', async ({ page, browserName }) => {
  await page.goto('https://staging.shop/checkout');
  
  // Screenshot for visual regression
  await expect(page).toHaveScreenshot(`checkout-form-${browserName}.png`);
  
  // Compare across viewports
  for (const viewport of [
    { width: 375, height: 812 },   // Mobile
    { width: 768, height: 1024 },  // Tablet
    { width: 1280, height: 1024 }  // Desktop
  ]) {
    await page.setViewportSize(viewport);
    await expect(page.locator('.checkout-form')).toHaveScreenshot(
      `checkout-form-${viewport.width}px.png`
    );
  }
});
```

### Playwright Best Practices

1. **Locator Selection**
   - Prefer semantic selectors: `page.getByRole('button', { name: 'Submit' })`
   - Avoid fragile XPath: `page.locator('//div[@class="checkout"]')`
   - Use data-testid as fallback: `data-testid="submit-button"`

2. **Waiting**
   ```javascript
   // Explicit waits
   await page.waitForURL(/\/order\/[0-9]+/);
   await expect(page.locator('text=Order confirmed')).toBeVisible();
   
   // Avoid hard waits
   // ❌ DON'T: await page.waitForTimeout(5000);
   ```

3. **Error Handling**
   ```javascript
   try {
     await page.goto('https://staging.shop');
   } catch (error) {
     console.error('Navigation failed:', error.message);
     // Retry or skip
   }
   ```

---

## Part 6: Real-World WordPress/WooCommerce Examples

### Example 1: WooCommerce Checkout Flow (Playwright)

```javascript
test('user completes WooCommerce purchase', async ({ page }) => {
  // Navigate to product
  await page.goto('https://staging-shop.local/product/test-item/');
  
  // Add to cart
  await page.fill('input[name="quantity"]', '2');
  await page.click('button:has-text("Add to cart")');
  
  // Navigate to cart
  await page.goto('https://staging-shop.local/cart/');
  await expect(page.locator('text=2 in stock')).toBeVisible();
  
  // Proceed to checkout
  await page.click('a:has-text("Proceed to checkout")');
  
  // Fill checkout form
  await page.fill('input[name="billing_first_name"]', 'John');
  await page.fill('input[name="billing_last_name"]', 'Doe');
  await page.fill('input[name="billing_email"]', 'john@example.com');
  await page.fill('input[name="billing_address_1"]', '123 Main St');
  await page.fill('input[name="billing_city"]', 'New York');
  await page.selectOption('select[name="billing_state"]', 'NY');
  await page.fill('input[name="billing_postcode"]', '10001');
  
  // Select payment method
  await page.click('label:has-text("Credit Card")');
  
  // Place order
  await page.click('button:has-text("Place order")');
  
  // Verify order confirmation
  await expect(page).toHaveURL(/\/order-received\/[0-9]+/);
  await expect(page.locator('text=Order complete')).toBeVisible();
});
```

### Example 2: WordPress Plugin Activation (PHPUnit)

```php
class WordPressPluginActivationTest extends WP_UnitTestCase {
  public function test_plugin_activates_and_creates_tables(): void {
    // Activate plugin
    activate_plugin('my-plugin/my-plugin.php');
    $this->assertTrue(is_plugin_active('my-plugin/my-plugin.php'));
    
    // Verify custom tables created
    global $wpdb;
    $this->assertTrue($wpdb->get_var(
      "SHOW TABLES LIKE '{$wpdb->prefix}my_plugin_orders'"
    ));
    
    // Verify custom post type registered
    $this->assertTrue(post_type_exists('my_custom_order'));
  }

  public function test_plugin_deactivation_preserves_data(): void {
    // Create test data
    wp_insert_post([
      'post_type' => 'my_custom_order',
      'post_title' => 'Test Order'
    ]);
    
    // Deactivate plugin
    deactivate_plugin('my-plugin/my-plugin.php');
    
    // Data still exists
    $post = get_posts(['post_type' => 'my_custom_order']);
    $this->assertCount(1, $post);
  }
}
```

### Example 3: Payment Processing Integration (pytest)

```python
@pytest.mark.asyncio
async def test_payment_processing_pipeline():
    """Test: Complete payment processing with webhook"""
    
    # Initialize payment
    payment = await payment_service.create_payment(
        amount=99.99,
        currency='USD',
        customer_id='cus_123'
    )
    assert payment.status == 'pending'
    
    # Process payment (simulated)
    await payment_service.process(payment.id)
    
    # Simulate webhook
    webhook_data = {
        'type': 'payment.success',
        'payment_id': payment.id,
        'timestamp': datetime.now().isoformat()
    }
    await payment_service.handle_webhook(webhook_data)
    
    # Verify final state
    updated_payment = await payment_service.get(payment.id)
    assert updated_payment.status == 'completed'
```

---

## Part 7: Performance Testing Strategies

### Jest Performance (via jest-benchmark)

```javascript
test.bench('large array sort performance', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);
  largeArray.sort(() => Math.random() - 0.5);
}, { runs: 100 });
```

### pytest Performance (via pytest-benchmark)

```python
def test_query_performance(benchmark):
    """Benchmark: Database query performance"""
    result = benchmark(fetch_orders, customer_id='cus_123')
    assert len(result) > 0
```

### Playwright Performance (Lighthouse)

```javascript
import lighthouse from 'lighthouse';

test('home page meets performance targets', async ({ page }) => {
  await page.goto('https://staging.local/');
  
  const lh = await lighthouse('https://staging.local/', {
    onlyCategories: ['performance'],
    quiet: true
  });
  
  // Verify metrics
  expect(lh.lhr.audits['first-contentful-paint'].numericValue).toBeLessThan(2500);
  expect(lh.lhr.audits['largest-contentful-paint'].numericValue).toBeLessThan(4000);
});
```

---

## Part 8: Test Organization

### Directory Structure

```
project/
├── src/
│   ├── components/
│   │   ├── Checkout.jsx
│   │   └── Checkout.test.js
│   ├── utils/
│   │   ├── formatPrice.js
│   │   └── formatPrice.test.js
│   └── api/
│       ├── orders.js
│       └── orders.test.js
├── tests/
│   ├── unit/
│   │   └── **/*.test.js
│   ├── integration/
│   │   └── payment-flow.test.js
│   └── e2e/
│       └── checkout.spec.js
└── package.json
```

---

## Part 9: CI/CD Integration

### GitHub Actions Example

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18, 20]
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      
      # Jest tests
      - run: npm run test:jest -- --coverage
      
      # Playwright tests
      - run: npm run test:playwright
      
      # Upload coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## Part 10: Common Testing Patterns

### Setup and Teardown

```javascript
// Jest
beforeAll(() => {
  // Initialize once for all tests
});

beforeEach(() => {
  // Run before each test
});

afterEach(() => {
  // Cleanup after each test
});

afterAll(() => {
  // Final cleanup
});
```

### Mocking and Spying

```javascript
// Mock function
const mockCallback = jest.fn();

// Spy on method
jest.spyOn(api, 'fetchData').mockResolvedValue({ data: [] });

// Verify mock was called
expect(mockCallback).toHaveBeenCalledWith('expected-arg');
```

### Async Testing

```javascript
// Jest with async/await
test('fetches data successfully', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});

// Playwright with wait
await expect(page.locator('text=Loaded')).toBeVisible();
```

---

## Summary

| Framework  | Best For | Speed | Browser | Language |
|-----------|----------|-------|---------|----------|
| Jest      | Unit/Integration | Fast | No | JavaScript |
| PHPUnit   | PHP/WordPress | Moderate | No | PHP |
| pytest    | Integration/API | Moderate | No | Python |
| Playwright| E2E/Cross-browser | Slow | Yes | JavaScript |

Choose your testing stack based on your project's needs. Most projects benefit from a combination of all four frameworks.

---

## Related Documentation

- [USAGE_GUIDE.md](./USAGE_GUIDE.md) — Getting started guide
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) — Upgrading from v2.1
- [Jest Testing Guide](../guides/jest-testing-guide.md)
- [PHPUnit Testing Guide](../guides/phpunit-testing-guide.md)
- [pytest Testing Guide](../guides/pytest-testing-guide.md)
- [Playwright Testing Guide](../guides/playwright-testing-guide.md)

---

*Testing Agent v2.2.0 · Comprehensive Testing Strategy for WordPress & WooCommerce*

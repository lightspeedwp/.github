---
name: phpunit-spec-generation
title: "PHPUnit Test Specification Generation Skill"
description: "Generate comprehensive PHPUnit test specifications for PHP applications with fixtures, mocking strategies, and testing best practices for modern PHP/WordPress projects"
version: "1.0.0"
category: testing
tags:
  - phpunit
  - php
  - testing
  - unit-tests
  - integration-tests
  - wordpress
status: active
---

# PHPUnit Test Specification Generation Skill

## Overview

The PHPUnit Specification Generation skill enables the Testing Agent to create comprehensive, production-ready PHPUnit test specifications. PHPUnit is the de facto testing framework for PHP, widely used in WordPress plugins, WooCommerce extensions, Laravel, Symfony, and general-purpose PHP applications.

### When to Use This Skill

**Use PHPUnit when:**
- Building PHP applications or plugins
- Testing WordPress plugins and themes
- Building WooCommerce extensions
- Need to test database interactions
- Require fixture-based testing
- Working with legacy PHP codebases
- Need comprehensive mocking capabilities

**PHPUnit is particularly strong for:**
- WordPress plugin development
- WooCommerce product/cart/order testing
- Database query testing with transactions
- Testing legacy procedural PHP code
- Integration testing with real databases
- Mock and stub creation for external APIs

## Setup Instructions

### Installation

```bash
# Install PHPUnit via Composer
composer require --dev phpunit/phpunit

# For WordPress testing (WP-CLI + PHPUnit)
composer require --dev wp-cli/wp-cli
composer require --dev wp-coding-standards/wpcs

# For mocking and fixtures
composer require --dev phpunit/php-mock
composer require --dev mockery/mockery
```

### Configuration Files

**phpunit.xml** (Basic)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="https://schema.phpunit.de/9.5/phpunit.xsd"
         bootstrap="tests/bootstrap.php"
         cacheResultFile=".phpunit.cache/test-results"
         executionOrder="depends,defects"
         forceCoversAnnotatedCoverageOnly="false"
         beStrictAboutCoverage="true"
         beStrictAboutTestsThatDoNotTestAnything="true"
         verbose="true">
    <testsuites>
        <testsuite name="Unit">
            <directory>tests/Unit</directory>
        </testsuite>
        <testsuite name="Integration">
            <directory>tests/Integration</directory>
        </testsuite>
    </testsuites>

    <coverage processUncoveredFiles="true" pathCoverage="false" ignoreDeprecatedCodeUnitsFromCodeCoverage="true">
        <include>
            <directory suffix=".php">src</directory>
        </include>
        <exclude>
            <directory suffix=".php">src/Config</directory>
            <directory suffix=".php">src/Vendor</directory>
        </exclude>
    </coverage>

    <php>
        <ini name="error_reporting" value="-1"/>
        <ini name="display_errors" value="On"/>
    </php>
</phpunit>
```

**phpunit.xml** (WordPress)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit bootstrap="tests/bootstrap.php" colors="true">
    <testsuites>
        <testsuite name="WordPress Plugin Tests">
            <directory>tests</directory>
        </testsuite>
    </testsuites>

    <coverage>
        <include>
            <directory>plugin/</directory>
        </include>
        <exclude>
            <directory>plugin/vendor</directory>
            <directory>plugin/tests</directory>
        </exclude>
    </coverage>

    <php>
        <env name="WP_TESTS_DIR" value="/tmp/wordpress-tests-lib" />
        <env name="WP_CORE_DIR" value="/tmp/wordpress/" />
        <env name="WP_VERSION" value="latest" />
    </php>
</phpunit>
```

**tests/bootstrap.php**
```php
<?php
// Define test environment
define('WP_TESTS_DIR', getenv('WP_TESTS_DIR') ?: '/tmp/wordpress-tests-lib');
define('WP_CORE_DIR', getenv('WP_CORE_DIR') ?: '/tmp/wordpress');

// Load WordPress test library
require_once WP_TESTS_DIR . '/includes/functions.php';

// Load plugin
require_once dirname(__DIR__) . '/your-plugin.php';

// Start unit tests
require_once WP_TESTS_DIR . '/includes/bootstrap.php';
```

### Composer Scripts

```json
{
  "require-dev": {
    "phpunit/phpunit": "^9.5",
    "brain/monkey": "^2.6",
    "mockery/mockery": "^1.4"
  },
  "scripts": {
    "test": "phpunit",
    "test:coverage": "phpunit --coverage-html=coverage",
    "test:watch": "phpunit-watch",
    "test:ci": "phpunit --coverage-clover=coverage.xml"
  }
}
```

## Usage Examples

### Example 1: Basic Unit Test

**File:** `src/Calculator.php`
```php
<?php

class Calculator {
    public function add($a, $b) {
        return $a + $b;
    }

    public function divide($a, $b) {
        if ($b == 0) {
            throw new InvalidArgumentException('Division by zero');
        }
        return $a / $b;
    }
}
```

**Test:** `tests/Unit/CalculatorTest.php`
```php
<?php

use PHPUnit\Framework\TestCase;

class CalculatorTest extends TestCase {
    private $calculator;

    protected function setUp(): void {
        $this->calculator = new Calculator();
    }

    public function testAddTwoNumbers(): void {
        $result = $this->calculator->add(2, 3);
        $this->assertEquals(5, $result);
    }

    public function testAddNegativeNumbers(): void {
        $result = $this->calculator->add(-5, 3);
        $this->assertEquals(-2, $result);
    }

    public function testDivideNumbers(): void {
        $result = $this->calculator->divide(10, 2);
        $this->assertEquals(5, $result);
    }

    public function testDivideByZeroThrowsException(): void {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Division by zero');
        
        $this->calculator->divide(10, 0);
    }
}
```

### Example 2: Testing with Mocks

**File:** `src/UserService.php`
```php
<?php

class UserService {
    private $userRepository;

    public function __construct(UserRepository $repository) {
        $this->userRepository = $repository;
    }

    public function getUserEmail($userId) {
        $user = $this->userRepository->find($userId);
        if (!$user) {
            throw new RuntimeException('User not found');
        }
        return $user['email'];
    }

    public function updateUserEmail($userId, $newEmail) {
        $user = $this->userRepository->find($userId);
        if (!$user) {
            throw new RuntimeException('User not found');
        }
        $user['email'] = $newEmail;
        $this->userRepository->save($user);
        return $user;
    }
}
```

**Test:** `tests/Unit/UserServiceTest.php`
```php
<?php

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;

class UserServiceTest extends TestCase {
    private $repositoryMock;
    private $userService;

    protected function setUp(): void {
        $this->repositoryMock = $this->createMock(UserRepository::class);
        $this->userService = new UserService($this->repositoryMock);
    }

    public function testGetUserEmailReturnsCorrectEmail(): void {
        $userId = 1;
        $expectedUser = ['id' => $userId, 'email' => 'john@example.com'];

        $this->repositoryMock
            ->expects($this->once())
            ->method('find')
            ->with($this->equalTo($userId))
            ->willReturn($expectedUser);

        $email = $this->userService->getUserEmail($userId);

        $this->assertEquals('john@example.com', $email);
    }

    public function testGetUserEmailThrowsWhenUserNotFound(): void {
        $this->repositoryMock
            ->expects($this->once())
            ->method('find')
            ->willReturn(null);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('User not found');

        $this->userService->getUserEmail(999);
    }

    public function testUpdateUserEmailPersistsChanges(): void {
        $userId = 1;
        $originalUser = ['id' => $userId, 'email' => 'john@old.com'];
        $newEmail = 'john@new.com';

        $this->repositoryMock
            ->expects($this->once())
            ->method('find')
            ->with($this->equalTo($userId))
            ->willReturn($originalUser);

        $this->repositoryMock
            ->expects($this->once())
            ->method('save')
            ->with($this->callback(function($user) use ($newEmail) {
                return $user['email'] === $newEmail;
            }));

        $result = $this->userService->updateUserEmail($userId, $newEmail);

        $this->assertEquals($newEmail, $result['email']);
    }
}
```

### Example 3: WordPress Plugin Testing

**File:** `plugin/class-product-manager.php`
```php
<?php

class Product_Manager {
    public function get_product_price($product_id) {
        $product = wc_get_product($product_id);
        if (!$product) {
            return 0;
        }
        return $product->get_price();
    }

    public function update_product_stock($product_id, $quantity) {
        $product = wc_get_product($product_id);
        if ($product) {
            $product->set_stock_quantity($quantity);
            $product->save();
        }
    }
}
```

**Test:** `tests/class-product-manager-test.php`
```php
<?php

class Product_Manager_Test extends WP_UnitTestCase {
    private $product_manager;

    public function setUp(): void {
        parent::setUp();
        $this->product_manager = new Product_Manager();
    }

    public function test_get_product_price_returns_correct_price(): void {
        // Create a test product
        $product = $this->factory->product->create_and_get(['price' => '19.99']);

        $price = $this->product_manager->get_product_price($product->get_id());

        $this->assertEquals(19.99, $price);
    }

    public function test_get_product_price_returns_zero_for_invalid_product(): void {
        $price = $this->product_manager->get_product_price(9999);
        $this->assertEquals(0, $price);
    }

    public function test_update_product_stock_modifies_quantity(): void {
        $product = $this->factory->product->create_and_get();
        
        $this->product_manager->update_product_stock($product->get_id(), 50);
        
        $updated_product = wc_get_product($product->get_id());
        $this->assertEquals(50, $updated_product->get_stock_quantity());
    }
}
```

### Example 4: Testing Database Interactions

**File:** `src/OrderRepository.php`
```php
<?php

class OrderRepository {
    private $database;

    public function __construct(Database $db) {
        $this->database = $db;
    }

    public function findByCustomer($customerId) {
        $query = "SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC";
        return $this->database->query($query, [$customerId]);
    }

    public function create($orderData) {
        return $this->database->insert('orders', $orderData);
    }
}
```

**Test:** `tests/Integration/OrderRepositoryTest.php`
```php
<?php

use PHPUnit\Framework\TestCase;

class OrderRepositoryTest extends TestCase {
    private $database;
    private $repository;

    protected function setUp(): void {
        $this->database = new SQLiteDatabase(':memory:');
        $this->database->exec(file_get_contents('tests/fixtures/schema.sql'));
        $this->repository = new OrderRepository($this->database);
    }

    public function testFindByCustomerReturnsOrders(): void {
        $customerId = 1;
        $this->database->insert('orders', [
            'customer_id' => $customerId,
            'total' => 100.00,
            'created_at' => date('Y-m-d H:i:s')
        ]);

        $orders = $this->repository->findByCustomer($customerId);

        $this->assertCount(1, $orders);
        $this->assertEquals(100.00, $orders[0]['total']);
    }

    public function testCreateInsertsOrder(): void {
        $orderData = [
            'customer_id' => 1,
            'total' => 50.00,
            'status' => 'pending'
        ];

        $orderId = $this->repository->create($orderData);

        $this->assertIsInt($orderId);
        $this->assertGreaterThan(0, $orderId);
    }
}
```

### Example 5: Testing with Fixtures and Data Providers

**Test:** `tests/Unit/ValidationTest.php`
```php
<?php

class ValidationTest extends PHPUnit\Framework\TestCase {
    /**
     * @dataProvider validEmailProvider
     */
    public function testValidEmails($email): void {
        $this->assertTrue(Validator::isValidEmail($email));
    }

    /**
     * @dataProvider invalidEmailProvider
     */
    public function testInvalidEmails($email): void {
        $this->assertFalse(Validator::isValidEmail($email));
    }

    public function validEmailProvider(): array {
        return [
            ['user@example.com'],
            ['test.user@example.co.uk'],
            ['user+tag@example.com'],
            ['user123@test-domain.com'],
        ];
    }

    public function invalidEmailProvider(): array {
        return [
            ['plaintext'],
            ['@example.com'],
            ['user@'],
            ['user @example.com'],
            ['user@example'],
        ];
    }
}
```

## Best Practices

1. **Test Naming Convention** — Use `test<FunctionName><Scenario>` or `<functionName>_<scenario>` (BDD style)
   ```php
   // ✅ Good
   public function testUpdateProductStockDecrementsQuantity(): void {}
   
   // ❌ Poor
   public function testUpdate(): void {}
   ```

2. **Setup and Teardown** — Use `setUp()` and `tearDown()` for DRY tests
   ```php
   protected function setUp(): void {
       $this->service = new UserService();
   }
   
   protected function tearDown(): void {
       $this->service = null;
   }
   ```

3. **Arrange-Act-Assert** — Organize tests for clarity
   ```php
   public function testCalculateDiscount(): void {
       // Arrange
       $price = 100;
       $discountRate = 0.1;
       
       // Act
       $discountedPrice = applyDiscount($price, $discountRate);
       
       // Assert
       $this->assertEquals(90, $discountedPrice);
   }
   ```

4. **Mock External Dependencies** — Only mock what's outside your control
   ```php
   // ✅ Good: Mock external API
   $apiMock = $this->createMock(PaymentGateway::class);
   
   // ❌ Avoid: Mocking internal logic
   $calculatorMock = $this->createMock(Calculator::class);
   ```

5. **Test Edge Cases and Errors** — Include boundary conditions
   ```php
   public function testProcessOrderWithEmptyCart(): void {
       $this->expectException(InvalidOrderException::class);
       $processor->process($emptyCart);
   }
   ```

6. **Use Data Providers** — Test multiple scenarios with one test
   ```php
   /**
    * @dataProvider cartTotalProvider
    */
   public function testCartTotalCalculation($items, $expected): void {
       $this->assertEquals($expected, $cart->calculateTotal($items));
   }
   ```

7. **Database Transactions for Tests** — Use transactions to rollback changes
   ```php
   protected function setUp(): void {
       parent::setUp();
       $this->database->beginTransaction();
   }
   
   protected function tearDown(): void {
       $this->database->rollback();
       parent::tearDown();
   }
   ```

8. **Test Behavior, Not Implementation** — Focus on public interface
   ```php
   // ✅ Good: Test public API
   $this->assertEquals('shipped', $order->getStatus());
   
   // ❌ Avoid: Testing private state
   $this->assertEquals('shipped', $order->status);
   ```

9. **Keep Tests Independent** — No test should depend on another
   ```php
   // Each test should work in any order
   public function testCreateUser(): void { /* ... */ }
   public function testDeleteUser(): void { /* ... */ } // Doesn't depend on testCreateUser
   ```

10. **Use Assertions Effectively** — Choose the right assertion for clarity
    ```php
    // ✅ Specific assertions
    $this->assertInstanceOf(User::class, $user);
    $this->assertArrayHasKey('email', $user->toArray());
    
    // ❌ Generic assertions
    $this->assertTrue(is_array($user->toArray()));
    ```

## Integration with Testing Agent

This skill integrates with the Testing Agent's multi-framework architecture:

1. **Framework Selection** — Used when PHPUnit is selected via Framework Selection matrix
2. **Core Prompt Reference** — Follows PHPUnit rules from `agents/testing-agent/shared/core-prompt.md`
3. **Provider Support** — Compatible with Claude, Copilot, and OpenAI providers
4. **Skill Composition** — Works alongside Jest, pytest, and Playwright skills

## Validation

### Test Quality Checklist

- [ ] All tests have descriptive names
- [ ] Tests are isolated (no interdependencies)
- [ ] Mocks are used only for external dependencies
- [ ] Code coverage > 80%
- [ ] All setup/teardown handled in setUp/tearDown
- [ ] Error cases are tested
- [ ] Edge cases are covered
- [ ] Database transactions used (if applicable)

### Code Coverage Targets

- **Statements:** ≥80%
- **Methods:** ≥80%
- **Lines:** ≥80%

## References

### Official Documentation
- [PHPUnit Documentation](https://phpunit.de/)
- [PHPUnit Best Practices](https://phpunit.de/manual/current/en/)
- [WordPress Plugin Testing](https://developer.wordpress.org/plugins/testing/)

### WordPress/WooCommerce Testing
- [WP-CLI Testing](https://wp-cli.org/)
- [WooCommerce Testing Guide](https://github.com/woocommerce/woocommerce/wiki/Testing-an-Extension)
- [WordPress Core Testing](https://develop.wordpress.org/handbook/coding-standards/php/)

### Related Skills
- [[jest-spec-generation]] — JavaScript testing with Jest
- [[pytest-spec-generation]] — Python testing with pytest
- [[playwright-spec-generation]] — E2E testing with Playwright

---

**Skill Version:** 1.0.0  
**Last Updated:** 2026-08-17  
**Status:** Production Ready  
**Framework:** PHPUnit 9.5+, WordPress 5.0+

---
title: PHPUnit Implementation Guide
description: Comprehensive guide for implementing PHPUnit testing in PHP projects with WordPress/WooCommerce examples, patterns, and best practices
version: 1.0.1
frameworks:
  - phpunit
  - php
  - wordpress
  - woocommerce
status: active
---

# PHPUnit Implementation Guide

## Introduction

PHPUnit is the industry-standard testing framework for PHP applications, with widespread adoption in WordPress plugins, WooCommerce extensions, and enterprise PHP projects. This guide provides practical patterns and examples for implementing comprehensive test suites in real-world PHP applications.

## Table of Contents

1. [Setup and Configuration](#setup-and-configuration)
2. [Test Fundamentals](#test-fundamentals)
3. [Fixture Management](#fixture-management)
4. [Mocking and Stubbing](#mocking-and-stubbing)
5. [WordPress Testing](#wordpress-testing)
6. [Database Testing](#database-testing)
7. [Performance Testing](#performance-testing)
8. [Continuous Integration](#continuous-integration)
9. [Real-World Examples](#real-world-examples)

## Setup and Configuration

### Installation with Composer

```bash
composer require --dev phpunit/phpunit
composer require --dev phpunit/php-mock-objects
composer require --dev mockery/mockery
```

### Directory Structure

```
project/
├── src/
│   ├── User/
│   │   ├── User.php
│   │   ├── UserRepository.php
│   │   └── UserService.php
│   └── Product/
│       ├── Product.php
│       └── ProductService.php
├── tests/
│   ├── Unit/
│   │   └── User/
│   │       ├── UserTest.php
│   │       └── UserServiceTest.php
│   ├── Integration/
│   │   └── UserRepositoryTest.php
│   ├── fixtures/
│   │   └── users.json
│   └── bootstrap.php
├── phpunit.xml
└── composer.json
```

### phpunit.xml Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="https://schema.phpunit.de/9.5/phpunit.xsd"
         bootstrap="tests/bootstrap.php"
         colors="true"
         verbose="true"
         beStrictAboutCoverage="true">
    <testsuites>
        <testsuite name="Unit Tests">
            <directory>tests/Unit</directory>
        </testsuite>
        <testsuite name="Integration Tests">
            <directory>tests/Integration</directory>
        </testsuite>
    </testsuites>

    <coverage processUncoveredFiles="true">
        <include>
            <directory suffix=".php">src</directory>
        </include>
        <exclude>
            <directory suffix="Interface.php">src</directory>
        </exclude>
    </coverage>

    <php>
        <ini name="display_errors" value="On"/>
        <ini name="error_reporting" value="-1"/>
        <const name="PHPUNIT_TESTSUITE" value="true"/>
    </php>
</phpunit>
```

### Test Bootstrap File

**tests/bootstrap.php**

```php
<?php
// Load Composer autoloader
require_once __DIR__ . '/../vendor/autoload.php';

// Define test environment
define('PHPUNIT_TESTSUITE', true);

// Set error reporting for tests
error_reporting(E_ALL);
ini_set('display_errors', 'On');

// Load WordPress (if needed)
if (function_exists('wp_load_config')) {
    wp_load_config();
}
```

## Test Fundamentals

### Basic Test Structure

```php
<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Calculator;

class CalculatorTest extends TestCase
{
    private Calculator $calculator;

    protected function setUp(): void
    {
        // Runs before each test
        $this->calculator = new Calculator();
    }

    protected function tearDown(): void
    {
        // Runs after each test
        unset($this->calculator);
    }

    public function testAddPositiveNumbers(): void
    {
        $result = $this->calculator->add(2, 3);
        $this->assertEquals(5, $result);
    }

    public function testAddNegativeNumbers(): void
    {
        $result = $this->calculator->add(-5, 3);
        $this->assertEquals(-2, $result);
    }

    public function testDivideByZeroThrowsException(): void
    {
        $this->expectException(\DivisionByZeroError::class);
        $this->expectExceptionMessage('Division by zero');
        
        $this->calculator->divide(10, 0);
    }
}
```

### Assertion Methods Reference

```php
// Equality assertions
$this->assertEquals($expected, $actual);           // ==
$this->assertSame($expected, $actual);            // ===
$this->assertNotEquals($expected, $actual);       // !=
$this->assertNotSame($expected, $actual);         // !==

// Type assertions
$this->assertIsArray($value);                     // is_array
$this->assertIsString($value);                    // is_string
$this->assertIsInt($value);                       // is_int
$this->assertIsInstanceOf(ClassName::class, $obj);

// Numeric assertions
$this->assertGreaterThan($threshold, $value);     // >
$this->assertGreaterThanOrEqual($threshold, $value);
$this->assertLessThan($threshold, $value);        // <
$this->assertLessThanOrEqual($threshold, $value);

// String assertions
$this->assertStringContainsString('substring', $string);
$this->assertStringStartsWith('prefix', $string);
$this->assertStringEndsWith('suffix', $string);
$this->assertMatchesRegularExpression('/pattern/', $string);

// Array assertions
$this->assertArrayHasKey('key', $array);
$this->assertArrayNotHasKey('key', $array);
$this->assertContains('value', $array);
$this->assertCount(3, $array);
$this->assertEmpty($array);
$this->assertNotEmpty($array);

// Exception assertions
$this->expectException(Exception::class);
$this->expectExceptionMessage('error message');
$this->expectExceptionCode(123);
```

## Fixture Management

### Fixture Patterns

```php
<?php

namespace Tests\Unit\User;

use PHPUnit\Framework\TestCase;
use App\User\User;

class UserTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        $this->user = new User([
            'id' => 1,
            'email' => 'john@example.com',
            'name' => 'John Doe',
            'role' => 'user',
        ]);
    }

    public function testUserHasEmail(): void
    {
        $this->assertEquals('john@example.com', $this->user->getEmail());
    }

    public function testUserCanChangeEmail(): void
    {
        $this->user->setEmail('newemail@example.com');
        $this->assertEquals('newemail@example.com', $this->user->getEmail());
    }
}
```

### Data Provider Pattern

```php
<?php

class EmailValidationTest extends TestCase
{
    /**
     * @dataProvider validEmailProvider
     */
    public function testValidEmails(string $email): void
    {
        $validator = new EmailValidator();
        $this->assertTrue($validator->isValid($email));
    }

    /**
     * @dataProvider invalidEmailProvider
     */
    public function testInvalidEmails(string $email): void
    {
        $validator = new EmailValidator();
        $this->assertFalse($validator->isValid($email));
    }

    public function validEmailProvider(): array
    {
        return [
            ['user@example.com'],
            ['john.doe+tag@example.co.uk'],
            ['test_user@subdomain.example.com'],
        ];
    }

    public function invalidEmailProvider(): array
    {
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

### Fixture Files

**tests/fixtures/users.json**

```json
{
  "users": [
    {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "created_at": "2024-01-01T10:00:00Z"
    },
    {
      "id": 2,
      "email": "jane@example.com",
      "name": "Jane Smith",
      "created_at": "2024-01-02T10:00:00Z"
    }
  ]
}
```

**Loading Fixtures**

```php
<?php

class UserRepositoryTest extends TestCase
{
    private array $fixtures;

    protected function setUp(): void
    {
        $fixturePath = __DIR__ . '/../fixtures/users.json';
        $this->fixtures = json_decode(
            file_get_contents($fixturePath),
            true
        );
    }

    public function testRepositoryLoadsFixtures(): void
    {
        $this->assertCount(2, $this->fixtures['users']);
        $this->assertEquals('john@example.com', $this->fixtures['users'][0]['email']);
    }
}
```

## Mocking and Stubbing

### Mock Objects Pattern

```php
<?php

use PHPUnit\Framework\MockObject\MockObject;
use App\User\UserRepository;
use App\User\UserService;

class UserServiceTest extends TestCase
{
    private UserService $service;
    private MockObject $repositoryMock;

    protected function setUp(): void
    {
        $this->repositoryMock = $this->createMock(UserRepository::class);
        $this->service = new UserService($this->repositoryMock);
    }

    public function testGetUserCallsRepository(): void
    {
        $expectedUser = ['id' => 1, 'email' => 'john@example.com'];
        
        $this->repositoryMock
            ->expects($this->once())
            ->method('findById')
            ->with($this->equalTo(1))
            ->willReturn($expectedUser);

        $user = $this->service->getUser(1);

        $this->assertEquals($expectedUser, $user);
    }

    public function testHandlesRepositoryException(): void
    {
        $this->repositoryMock
            ->expects($this->once())
            ->method('findById')
            ->willThrowException(new \Exception('Not found'));

        $this->expectException(\Exception::class);
        $this->service->getUser(999);
    }
}
```

### Stub Pattern

```php
<?php

class OrderProcessorTest extends TestCase
{
    public function testCalculatesTotalWithTax(): void
    {
        $paymentGatewayStub = $this->createStub(PaymentGateway::class);
        $paymentGatewayStub
            ->method('calculateTax')
            ->willReturn(9.99);

        $processor = new OrderProcessor($paymentGatewayStub);
        $total = $processor->processOrder(['subtotal' => 99.99]);

        $this->assertEquals(109.98, $total);
    }
}
```

## WordPress Testing

### WP-CLI Test Case

```php
<?php

use WP_UnitTestCase;

class CustomPostTypeTest extends WP_UnitTestCase
{
    public function setUp(): void
    {
        parent::setUp();
        // Register custom post type
        register_post_type('my_cpt', ['public' => true]);
    }

    public function testCanCreateCustomPost(): void
    {
        $post_id = wp_insert_post([
            'post_type' => 'my_cpt',
            'post_title' => 'Test Post',
        ]);

        $this->assertGreaterThan(0, $post_id);
        $this->assertInstanceOf(\WP_Post::class, get_post($post_id));
    }

    public function testPostMetaCanBeSaved(): void
    {
        $post_id = wp_insert_post(['post_type' => 'post']);
        
        update_post_meta($post_id, 'key', 'value');
        $meta = get_post_meta($post_id, 'key', true);

        $this->assertEquals('value', $meta);
    }
}
```

### WooCommerce Testing

```php
<?php

use WC_UnitTestCase;
use Automattic\WooCommerce\Testing\Tools\CodeHacking\Hacks;

class WooCommerceProductTest extends WC_UnitTestCase
{
    public function testCanCreateProduct(): void
    {
        $product = $this->factory->product->create_and_get([
            'name' => 'Test Product',
            'regular_price' => 19.99,
            'stock_quantity' => 100,
        ]);

        $this->assertEquals('Test Product', $product->get_name());
        $this->assertEquals(19.99, $product->get_price());
    }

    public function testCanCalculateCartTotal(): void
    {
        $cart = WC()->cart;
        
        // Add product to cart
        $product_id = $this->factory->product->create_and_get()->get_id();
        $cart->add_to_cart($product_id, 2);

        // Verify cart total
        $this->assertGreaterThan(0, $cart->get_subtotal());
    }

    public function testOrderCanBePlaced(): void
    {
        $customer_id = $this->factory->customer->create();
        $order = $this->factory->order->create([
            'customer_id' => $customer_id,
            'status' => 'pending',
        ]);

        $this->assertEquals($customer_id, $order->get_customer_id());
        $this->assertEquals('pending', $order->get_status());
    }
}
```

## Database Testing

### Database Test Case

```php
<?php

use PHPUnit\Framework\TestCase;
use Doctrine\DBAL\Connection;

class DatabaseTest extends TestCase
{
    private Connection $connection;

    protected function setUp(): void
    {
        $this->connection = $this->getConnection();
        $this->createTestDatabase();
    }

    protected function tearDown(): void
    {
        // Clean up test database
        $this->dropTestDatabase();
    }

    private function createTestDatabase(): void
    {
        $this->connection->executeUpdate('
            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                name VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ');
    }

    public function testCanInsertUser(): void
    {
        $this->connection->insert('users', [
            'email' => 'john@example.com',
            'name' => 'John Doe',
        ]);

        $result = $this->connection->fetchAssoc(
            'SELECT * FROM users WHERE email = ?',
            ['john@example.com']
        );

        $this->assertNotEmpty($result);
        $this->assertEquals('John Doe', $result['name']);
    }

    public function testCanUpdateUser(): void
    {
        $this->connection->insert('users', [
            'email' => 'john@example.com',
            'name' => 'John Doe',
        ]);

        $this->connection->update(
            'users',
            ['name' => 'Jane Doe'],
            ['email' => 'john@example.com']
        );

        $result = $this->connection->fetchAssoc(
            'SELECT * FROM users WHERE email = ?',
            ['john@example.com']
        );

        $this->assertEquals('Jane Doe', $result['name']);
    }

    public function testTransactionRollback(): void
    {
        $this->connection->beginTransaction();
        
        $this->connection->insert('users', [
            'email' => 'test@example.com',
            'name' => 'Test User',
        ]);

        $this->connection->rollBack();

        $result = $this->connection->fetchAssoc(
            'SELECT * FROM users WHERE email = ?',
            ['test@example.com']
        );

        $this->assertFalse($result);
    }

    private function dropTestDatabase(): void
    {
        $this->connection->executeUpdate('DROP TABLE IF EXISTS users');
    }

    private function getConnection(): Connection
    {
        // Return database connection
    }
}
```

## Performance Testing

### Performance Benchmarks

```php
<?php

class PerformanceTest extends TestCase
{
    public function testArrayProcessingPerformance(): void
    {
        $start = microtime(true);

        $array = range(1, 10000);
        $result = array_map(function($x) {
            return $x * 2;
        }, $array);

        $duration = microtime(true) - $start;

        $this->assertLessThan(0.1, $duration, 'Processing took too long');
    }

    public function testDatabaseQueryTime(): void
    {
        $this->connection->beginTransaction();
        $start = microtime(true);

        // Execute database operation
        $results = $this->connection->fetchAllAssoc(
            'SELECT * FROM users WHERE active = ?',
            [1]
        );

        $duration = microtime(true) - $start;
        $this->connection->rollBack();

        $this->assertLessThan(0.5, $duration, 'Query too slow');
        $this->assertNotEmpty($results);
    }
}
```

## Continuous Integration

### GitHub Actions Configuration

**.github/workflows/phpunit.yml**

```yaml
name: PHPUnit Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:5.7
        options: >-
          --health-cmd="mysqladmin ping -h localhost"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: test_db

    steps:
      - uses: actions/checkout@v3

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.1'
          extensions: mysql, pdo_mysql

      - name: Install dependencies
        run: composer install

      - name: Create test database
        run: |
          mysql -h 127.0.0.1 -u root -proot -e "CREATE DATABASE test_db;"

      - name: Run tests
        run: vendor/bin/phpunit

      - name: Generate coverage report
        run: vendor/bin/phpunit --coverage-clover coverage.xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Real-World Examples

### Complete Service Test Suite

```php
<?php

namespace Tests\Unit\User;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;
use App\User\UserService;
use App\User\UserRepository;
use App\User\UserValidator;

class UserServiceTest extends TestCase
{
    private UserService $service;
    private MockObject $repositoryMock;
    private MockObject $validatorMock;

    protected function setUp(): void
    {
        $this->repositoryMock = $this->createMock(UserRepository::class);
        $this->validatorMock = $this->createMock(UserValidator::class);
        
        $this->service = new UserService(
            $this->repositoryMock,
            $this->validatorMock
        );
    }

    /**
     * @dataProvider validUserDataProvider
     */
    public function testCreateUserWithValidData(array $data): void
    {
        $this->validatorMock
            ->expects($this->once())
            ->method('validate')
            ->with($data)
            ->willReturn(true);

        $this->repositoryMock
            ->expects($this->once())
            ->method('create')
            ->with($data)
            ->willReturn(['id' => 1, ...$data]);

        $user = $this->service->createUser($data);

        $this->assertNotEmpty($user['id']);
        $this->assertEquals($data['email'], $user['email']);
    }

    /**
     * @dataProvider invalidUserDataProvider
     */
    public function testCreateUserWithInvalidData(array $data): void
    {
        $this->validatorMock
            ->expects($this->once())
            ->method('validate')
            ->willReturn(false);

        $this->repositoryMock
            ->expects($this->never())
            ->method('create');

        $this->expectException(\InvalidArgumentException::class);
        $this->service->createUser($data);
    }

    public function validUserDataProvider(): array
    {
        return [
            [['email' => 'john@example.com', 'name' => 'John']],
            [['email' => 'jane@example.com', 'name' => 'Jane']],
        ];
    }

    public function invalidUserDataProvider(): array
    {
        return [
            [['email' => 'invalid', 'name' => '']],
            [['email' => '', 'name' => 'John']],
        ];
    }
}
```

## Best Practices Summary

1. **Use Meaningful Test Names** — Describe what is being tested
2. **Follow AAA Pattern** — Arrange, Act, Assert
3. **Keep Tests Independent** — No test should depend on another
4. **Mock External Dependencies** — Only mock outside services
5. **Use Data Providers** — Avoid duplicate test code
6. **Test Edge Cases** — Include boundary conditions
7. **Maintain Clean Fixtures** — Reset state in setUp/tearDown
8. **Target Coverage** — Aim for 80%+ coverage
9. **Run Tests Often** — Frequent feedback loops
10. **Isolate Units** — Test one thing per test

---

**Guide Version:** 1.0.0  
**Last Updated:** 2026-08-17  
**Framework:** PHPUnit 9.5+, PHP 7.4+, WordPress 5.0+

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

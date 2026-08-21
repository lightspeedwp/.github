---
name: jest-spec-generation
title: Jest Test Specification Generation Skill
description: Generate comprehensive Jest unit and integration test specifications with mocking strategies, fixtures, and best practices for modern JavaScript/TypeScript applications
version: 1.0.1
category: testing
tags:
  - jest
  - javascript
  - testing
  - unit-tests
  - integration-tests
  - tdd
status: active
---

# Jest Test Specification Generation Skill

## Overview

The Jest Specification Generation skill enables the Testing Agent to create comprehensive, production-ready Jest test specifications. Jest is the industry-standard testing framework for JavaScript/TypeScript applications, offering powerful features for unit testing, integration testing, snapshot testing, and code coverage analysis.

### When to Use This Skill

**Use Jest when:**

- Building JavaScript/TypeScript applications
- Need fast, parallel test execution
- Require built-in mocking and snapshot testing
- Working with React, Vue, Node.js, or browser-based applications
- Need comprehensive code coverage reporting
- Want Jest's user-friendly, zero-config experience (for most projects)

**Jest is particularly strong for:**

- Unit testing pure functions and logic
- Testing React components and hooks
- Mocking external dependencies and APIs
- Snapshot testing UI components
- Parallel test execution (default behavior)
- Coverage analysis and reporting

## Setup Instructions

### Installation

```bash
# Install Jest and related packages
npm install --save-dev jest @types/jest babel-jest @babel/preset-env @babel/preset-typescript

# For React projects
npm install --save-dev @testing-library/react @testing-library/jest-dom

# For TypeScript projects
npm install --save-dev typescript ts-jest

# For async/await and modern JavaScript
npm install --save-dev @babel/preset-react
```

### Configuration Files

**jest.config.js** (Basic)

```javascript
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js', '**/*.spec.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/**/*.config.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

**jest.config.js** (React/TypeScript)

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
};
```

**jest.setup.js**

```javascript
import '@testing-library/jest-dom';

// Mock global objects
global.fetch = jest.fn();

// Configure test timeouts
jest.setTimeout(10000);
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

## Usage Examples

### Example 1: Basic Unit Test

**File:** `src/math.js`

```javascript
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}
```

**Test:** `src/math.test.js`

```javascript
import { add, multiply } from './math';

describe('Math utilities', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should add negative numbers', () => {
      expect(add(-5, 3)).toBe(-2);
    });

    it('should handle zero', () => {
      expect(add(0, 5)).toBe(5);
    });

    it('should work with decimals', () => {
      expect(add(1.5, 2.3)).toBeCloseTo(3.8);
    });
  });

  describe('multiply', () => {
    it('should multiply two numbers', () => {
      expect(multiply(3, 4)).toBe(12);
    });

    it('should return zero when multiplying by zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });
  });
});
```

### Example 2: Testing with Mocks

**File:** `src/api.js`

```javascript
export async function fetchUser(userId) {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
}
```

**Test:** `src/api.test.js`

```javascript
import { fetchUser } from './api';

// Mock global fetch
global.fetch = jest.fn();

describe('API utilities', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should fetch user successfully', async () => {
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockUser),
    });

    const user = await fetchUser(1);
    
    expect(fetch).toHaveBeenCalledWith('/api/users/1');
    expect(user).toEqual(mockUser);
  });

  it('should throw error on failed response', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: jest.fn(),
    });

    await expect(fetchUser(1)).rejects.toThrow('Failed to fetch user');
  });

  it('should throw error on network failure', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchUser(1)).rejects.toThrow('Network error');
  });
});
```

### Example 3: Testing React Components

**File:** `src/components/Button.jsx`

```javascript
import React from 'react';

export function Button({ onClick, children, disabled = false }) {
  return (
    <button onClick={onClick} disabled={disabled} className="btn">
      {children}
    </button>
  );
}
```

**Test:** `src/components/Button.test.jsx`

```javascript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button component', () => {
  it('should render button with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });

  it('should not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

### Example 4: Testing Async Functions with Fixtures

**File:** `src/database.js`

```javascript
export class UserDatabase {
  constructor(client) {
    this.client = client;
  }

  async getUser(id) {
    return this.client.query('SELECT * FROM users WHERE id = ?', [id]);
  }

  async createUser(userData) {
    return this.client.query('INSERT INTO users SET ?', [userData]);
  }
}
```

**Test:** `src/database.test.js`

```javascript
import { UserDatabase } from './database';

describe('UserDatabase', () => {
  let db;
  let mockClient;

  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
    };
    db = new UserDatabase(mockClient);
  });

  describe('getUser', () => {
    it('should retrieve user by id', async () => {
      const expectedUser = { id: 1, name: 'John', email: 'john@test.com' };
      mockClient.query.mockResolvedValueOnce([expectedUser]);

      const user = await db.getUser(1);

      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE id = ?',
        [1]
      );
      expect(user).toEqual([expectedUser]);
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection failed');
      mockClient.query.mockRejectedValueOnce(dbError);

      await expect(db.getUser(1)).rejects.toThrow('Database connection failed');
    });
  });

  describe('createUser', () => {
    it('should create new user', async () => {
      const newUser = { name: 'Jane', email: 'jane@test.com' };
      mockClient.query.mockResolvedValueOnce({ insertId: 1 });

      const result = await db.createUser(newUser);

      expect(mockClient.query).toHaveBeenCalledWith(
        'INSERT INTO users SET ?',
        [newUser]
      );
      expect(result).toEqual({ insertId: 1 });
    });
  });
});
```

### Example 5: Snapshot Testing

**File:** `src/components/Card.jsx`

```javascript
import React from 'react';

export function Card({ title, description, image }) {
  return (
    <div className="card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
```

**Test:** `src/components/Card.test.jsx`

```javascript
import React from 'react';
import { render } from '@testing-library/react';
import { Card } from './Card';

describe('Card component', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <Card
        title="Test Card"
        description="This is a test card"
        image="/test-image.jpg"
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('should update snapshot when props change', () => {
    const { container, rerender } = render(
      <Card title="Original" description="Original description" image="/img1.jpg" />
    );

    expect(container).toMatchSnapshot('original');

    rerender(
      <Card title="Updated" description="Updated description" image="/img2.jpg" />
    );

    expect(container).toMatchSnapshot('updated');
  });
});
```

## Best Practices

1. **Descriptive Test Names** — Use clear, specific names that describe what is being tested

   ```javascript
   // ✅ Good
   it('should return error when email is invalid', () => {});
   
   // ❌ Poor
   it('should work correctly', () => {});
   ```

2. **Arrange-Act-Assert Pattern** — Organize tests for clarity

   ```javascript
   it('should validate email format', () => {
     // Arrange
     const email = 'invalid-email';
     
     // Act
     const result = isValidEmail(email);
     
     // Assert
     expect(result).toBe(false);
   });
   ```

3. **Test One Thing Per Test** — Keep tests focused and independent

   ```javascript
   // ✅ Good: Single responsibility
   it('should validate email format', () => {
     expect(isValidEmail('test@example.com')).toBe(true);
   });
   
   it('should reject invalid email', () => {
     expect(isValidEmail('invalid')).toBe(false);
   });
   ```

4. **Use Mocks Sparingly** — Only mock external dependencies

   ```javascript
   // ✅ Good: Mock external API
   jest.mock('./api');
   
   // ❌ Avoid: Mocking internal logic
   jest.mock('./calculator'); // Don't mock what you're testing
   ```

5. **Test Edge Cases** — Include boundary conditions and error scenarios

   ```javascript
   it('should handle edge cases', () => {
     expect(divide(10, 0)).toThrow('Cannot divide by zero');
     expect(divide(0, 5)).toBe(0);
     expect(divide(-10, 2)).toBe(-5);
   });
   ```

6. **Use beforeEach and afterEach** — DRY principle for setup/teardown

   ```javascript
   beforeEach(() => {
     jest.clearAllMocks();
   });
   
   afterEach(() => {
     jest.restoreAllMocks();
   });
   ```

7. **Avoid Sleep/Timeouts** — Use Jest utilities for async testing

   ```javascript
   // ✅ Good: Use waitFor
   await waitFor(() => {
     expect(screen.getByText('Loaded')).toBeInTheDocument();
   });
   
   // ❌ Bad: Don't use sleep
   await new Promise(r => setTimeout(r, 1000));
   ```

8. **Test Behavior, Not Implementation** — Focus on what, not how

   ```javascript
   // ✅ Good: Test behavior
   expect(component.textContent).toContain('Success');
   
   // ❌ Avoid: Testing implementation details
   expect(component.state.message).toBe('Success');
   ```

9. **Keep Fixtures Lightweight** — Use minimal, realistic data

   ```javascript
   // ✅ Good: Minimal fixture
   const user = { id: 1, name: 'John' };
   
   // ❌ Avoid: Overloaded fixture
   const user = { id: 1, name: 'John', /* 20 more fields */ };
   ```

10. **Run Tests Frequently** — Integrate into development workflow

    ```bash
    # Watch mode during development
    npm run test:watch
    
    # Full suite before commits
    npm run test:ci
    ```

## Integration with Testing Agent

This skill integrates with the Testing Agent's multi-framework architecture:

1. **Framework Selection** — Used when Jest is selected via Framework Selection matrix
2. **Core Prompt Reference** — Follows Jest rules from `agents/testing-agent/shared/core-prompt.md`
3. **Provider Support** — Compatible with Claude, Copilot, and OpenAI providers
4. **Skill Composition** — Works alongside PHPUnit, pytest, and Playwright skills

### Usage in Testing Agent

```javascript
// Testing Agent will use this skill when:
// - Framework == 'jest'
// - Project type == 'javascript' or 'typescript'
// - Testing goal == 'spec-generation' or 'test-writing'

const testSpec = await testingAgent.generateTests({
  framework: 'jest',
  sourceCode: '...JavaScript code...',
  testType: 'unit',
});
```

## Validation

### Test Quality Checklist

- [ ] All tests have descriptive names (> 5 words)
- [ ] Tests are isolated (no interdependencies)
- [ ] Mocks are used only for external dependencies
- [ ] Code coverage > 80%
- [ ] All async operations use proper await/promises
- [ ] No hardcoded timeouts/sleeps
- [ ] Error cases are tested
- [ ] Edge cases are covered

### Code Coverage Targets

- **Statements:** ≥80%
- **Branches:** ≥80%
- **Functions:** ≥80%
- **Lines:** ≥80%

### Continuous Integration

```yaml
# .github/workflows/jest-tests.yml
name: Jest Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

## References

### Official Documentation

- [Jest Official Docs](https://jestjs.io/)
- [Testing Library for React](https://testing-library.com/react)
- [Jest Configuration Reference](https://jestjs.io/docs/configuration)

### Testing Patterns

- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Best Practices](https://testingjavascript.com/)
- [Snapshot Testing Guide](https://jestjs.io/docs/snapshot-testing)

### Related Skills

- [[pytest-spec-generation]] — Python testing with pytest
- [[phpunit-spec-generation]] — PHP testing with PHPUnit
- [[playwright-spec-generation]] — E2E testing with Playwright

---

**Skill Version:** 1.0.0  
**Last Updated:** 2026-08-17  
**Status:** Production Ready  
**Framework:** Jest v29+

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

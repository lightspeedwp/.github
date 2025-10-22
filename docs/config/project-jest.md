# Jest Configuration

## 🧪 JavaScript Testing Framework for WordPress

## Table of Contents

- [Overview](#overview)
- [Installation & Configuration](#installation--configuration)
- [WordPress Integration](#wordpress-integration)
- [Test Structure](#test-structure)
- [Usage](#usage)
- [Integration](#integration)

## Overview

**Jest** is the primary JavaScript testing framework for LightSpeed WordPress projects. It provides unit testing, mocking, code coverage, and snapshot testing capabilities optimized for WordPress block development.

> **💡 Key Benefits:** WordPress-ready setup, built-in mocking, code coverage, watch mode, snapshot testing

## Installation & Configuration

### **Quick Setup**

```bash
# Install Jest with WordPress presets
npm install --save-dev jest @wordpress/jest-preset-default @wordpress/jest-console

# Create configuration
echo 'module.exports = { preset: "@wordpress/jest-preset-default" };' > jest.config.js
```

### **Configuration File Example**

```javascript
// jest.config.js
module.exports = {
  preset: '@wordpress/jest-preset-default',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.js',
    '<rootDir>/src/**/test/*.js',
    '<rootDir>/src/**/*.test.js'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.stories.js',
    '!src/**/index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

## WordPress Integration

### **WordPress Jest Preset**

```json
{
  "devDependencies": {
    "jest": "^29.0.0",
    "@wordpress/jest-preset-default": "^11.0.0",
    "@wordpress/jest-console": "^7.0.0",
    "@wordpress/scripts": "^26.0.0"
  }
}
```

### **Package.json Scripts**

```json
{
  "scripts": {
    "test": "wp-scripts test-unit-js",
    "test:watch": "wp-scripts test-unit-js --watch",
    "test:coverage": "wp-scripts test-unit-js --coverage",
    "test:debug": "wp-scripts test-unit-js --no-cache --watch",
    "test:update": "wp-scripts test-unit-js --updateSnapshot"
  }
}
```

### **WordPress Mocks & Utilities**

```javascript
// tests/setup.js
import '@wordpress/jest-console';

// Mock WordPress globals
global.wp = {
  i18n: {
    __: (text) => text,
    _x: (text) => text,
    _n: (single, plural, number) => (number === 1 ? single : plural),
  },
  blocks: {
    registerBlockType: jest.fn(),
    createBlock: jest.fn(),
  },
  data: {
    select: jest.fn(),
    dispatch: jest.fn(),
  },
};

// Mock fetch for API calls
global.fetch = jest.fn();
```

## Test Structure

### **File Organization**

```text
src/
├── components/
│   ├── Button/
│   │   ├── index.js
│   │   ├── Button.test.js
│   │   └── __snapshots__/
│   └── Modal/
│       ├── index.js
│       └── test/
│           └── Modal.test.js
├── utils/
│   ├── helpers.js
│   └── __tests__/
│       └── helpers.test.js
tests/
├── setup.js
└── __mocks__/
    └── wordpress.js
```

### **Test Examples**

```javascript
// src/components/Button/Button.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './index';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  test('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('matches snapshot', () => {
    const { container } = render(<Button variant="primary">Test</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });
});
```

### **WordPress Block Testing**

```javascript
// src/blocks/example-block/test/edit.test.js
import { render } from '@testing-library/react';
import { Edit } from '../edit';

describe('ExampleBlock Edit', () => {
  const mockAttributes = {
    content: 'Test content',
    alignment: 'left'
  };

  const mockSetAttributes = jest.fn();

  test('renders with correct attributes', () => {
    const { container } = render(
      <Edit 
        attributes={mockAttributes} 
        setAttributes={mockSetAttributes}
      />
    );
    
    expect(container).toHaveTextContent('Test content');
  });

  test('updates attributes when content changes', () => {
    // Test attribute updates
  });
});
```

## Usage

### **Command Line**

```bash
# Run all tests
npm test

# Watch mode (re-run on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Update snapshots
npm run test:update

# Run specific test file
npx jest Button.test.js

# Run tests matching pattern
npx jest --testNamePattern="renders"
```

### **Coverage Reports**

```bash
# Generate and view coverage
npm run test:coverage
open coverage/lcov-report/index.html
```

### **VS Code Integration**

```json
// .vscode/settings.json
{
  "jest.autoRun": "watch",
  "jest.showCoverageOnLoad": true,
  "jest.coverageFormatter": "DefaultFormatter"
}
```

## Integration

**Related Configuration:**

- **[Babel Configuration](./project-babel.md)** - JavaScript compilation for tests  
- **[ESLint Configuration](./lint-eslint.md)** - Linting test files  
- **[Husky Configuration](./workflow-husky.md)** - Pre-push testing hooks  
- **[VS Code Settings](./vscode-settings.md)** - Editor testing integration  

---

> **Next Steps:** Set up Babel for modern JavaScript compilation → [project-babel.md](./project-babel.md)

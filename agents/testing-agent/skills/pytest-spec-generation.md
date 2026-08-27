---
name: pytest-spec-generation
title: pytest Test Specification Generation Skill
description: Generate comprehensive pytest test specifications for Python applications with fixtures, parametrization, async support, and best practices for modern Python projects
version: 1.0.1
category: testing
tags:
  - pytest
  - python
  - testing
  - unit-tests
  - integration-tests
  - async
status: active
---

# pytest Test Specification Generation Skill

## Overview

The pytest Specification Generation skill enables the Testing Agent to create comprehensive, production-ready pytest test specifications. pytest is the most popular testing framework for Python, offering powerful features for unit testing, integration testing, fixtures, parametrization, and extensive plugin ecosystem.

### When to Use This Skill

**Use pytest when:**

- Building Python applications or packages
- Need powerful fixture management
- Require parametrized testing capabilities
- Testing async/await code
- Working with Django, Flask, FastAPI applications
- Need comprehensive test discovery and plugins
- Testing data science and ML pipelines

**pytest is particularly strong for:**

- Complex fixture hierarchies and setup/teardown
- Parametrized tests with multiple data sets
- Async/await and asyncio testing
- Database testing with transactions
- Mock and spy capabilities
- Extensive plugin ecosystem (pytest-django, pytest-cov, etc.)

## Setup Instructions

### Installation

```bash
# Install pytest
pip install pytest pytest-cov pytest-asyncio pytest-mock

# For Django projects
pip install pytest-django

# For async testing
pip install pytest-asyncio

# For mocking and fixtures
pip install pytest-mock responses

# For code coverage
pip install pytest-cov coverage
```

### Configuration Files

**pytest.ini** (Basic)

```ini
[pytest]
minversion = 7.0
addopts = -v --strict-markers --tb=short
testpaths = tests
python_files = test_*.py *_test.py
python_classes = Test*
python_functions = test_*
markers =
    unit: Unit tests
    integration: Integration tests
    slow: Slow running tests
    asyncio: Async tests
```

**conftest.py** (Project-level fixtures)

```python
import pytest
from datetime import datetime

@pytest.fixture
def sample_data():
    """Fixture providing sample test data"""
    return {
        'id': 1,
        'name': 'Test User',
        'email': 'test@example.com',
        'created_at': datetime.now()
    }

@pytest.fixture
def mock_api(mocker):
    """Fixture providing mocked API client"""
    return mocker.MagicMock()

@pytest.fixture
def temp_database(tmp_path):
    """Fixture providing temporary database"""
    db_path = tmp_path / 'test.db'
    yield str(db_path)
    db_path.unlink()
```

**setup.cfg** (Alternative configuration)

```ini
[tool:pytest]
minversion = 7.0
testpaths = tests
addopts =
    -v
    --strict-markers
    --cov=src
    --cov-report=term-missing
    --cov-report=html
python_files = test_*.py *_test.py
```

**pyproject.toml** (Modern approach)

```toml
[tool.pytest.ini_options]
minversion = "7.0"
testpaths = ["tests"]
python_files = ["test_*.py", "*_test.py"]
addopts = "-v --strict-markers --tb=short --cov=src"
markers = [
    "unit: Unit tests",
    "integration: Integration tests",
    "slow: Slow running tests",
    "asyncio: Async tests",
]
```

### Package.json-equivalent Scripts

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/test_calculator.py

# Run tests matching pattern
pytest -k "test_add"

# Run in watch mode (requires pytest-watch)
ptw

# Run in parallel (requires pytest-xdist)
pytest -n auto
```

## Usage Examples

### Example 1: Basic Unit Test

**File:** `src/calculator.py`

```python
def add(a, b):
    """Add two numbers"""
    return a + b

def divide(a, b):
    """Divide two numbers"""
    if b == 0:
        raise ValueError('Cannot divide by zero')
    return a / b
```

**Test:** `tests/test_calculator.py`

```python
import pytest
from src.calculator import add, divide

class TestCalculator:
    def test_add_positive_numbers(self):
        assert add(2, 3) == 5

    def test_add_negative_numbers(self):
        assert add(-5, 3) == -2

    def test_add_zero(self):
        assert add(0, 5) == 5

    def test_divide_numbers(self):
        assert divide(10, 2) == 5

    def test_divide_by_zero_raises_error(self):
        with pytest.raises(ValueError, match='Cannot divide by zero'):
            divide(10, 0)
```

### Example 2: Testing with Fixtures and Parametrization

**File:** `src/user_validator.py`

```python
class UserValidator:
    def is_valid_email(self, email):
        return '@' in email and '.' in email.split('@')[1]

    def is_valid_password(self, password):
        return len(password) >= 8 and any(c.isupper() for c in password)
```

**Test:** `tests/test_user_validator.py`

```python
import pytest
from src.user_validator import UserValidator

@pytest.fixture
def validator():
    """Fixture providing validator instance"""
    return UserValidator()

class TestUserValidator:
    @pytest.mark.parametrize('email,expected', [
        ('user@example.com', True),
        ('test.user@example.co.uk', True),
        ('invalid-email', False),
        ('@example.com', False),
        ('user@', False),
    ])
    def test_email_validation(self, validator, email, expected):
        assert validator.is_valid_email(email) == expected

    @pytest.mark.parametrize('password,expected', [
        ('ValidPassword1', True),
        ('weak', False),
        ('NoUppercase123', False),
        ('NOLOWERCASE1', False),
        ('ValidPass1', True),
    ])
    def test_password_validation(self, validator, password, expected):
        assert validator.is_valid_password(password) == expected
```

### Example 3: Testing Async Code

**File:** `src/async_api.py`

```python
import asyncio

async def fetch_user(user_id):
    """Simulate fetching user from API"""
    await asyncio.sleep(0.1)  # Simulate network delay
    if user_id <= 0:
        raise ValueError('Invalid user ID')
    return {'id': user_id, 'name': f'User {user_id}'}

async def fetch_multiple_users(user_ids):
    """Fetch multiple users concurrently"""
    return await asyncio.gather(*[fetch_user(uid) for uid in user_ids])
```

**Test:** `tests/test_async_api.py`

```python
import pytest
from src.async_api import fetch_user, fetch_multiple_users

@pytest.mark.asyncio
async def test_fetch_user_returns_user_data():
    user = await fetch_user(1)
    assert user['id'] == 1
    assert user['name'] == 'User 1'

@pytest.mark.asyncio
async def test_fetch_user_invalid_id_raises_error():
    with pytest.raises(ValueError, match='Invalid user ID'):
        await fetch_user(-1)

@pytest.mark.asyncio
async def test_fetch_multiple_users_concurrent():
    users = await fetch_multiple_users([1, 2, 3])
    assert len(users) == 3
    assert users[0]['id'] == 1
    assert users[2]['id'] == 3
```

### Example 4: Database Testing with Fixtures

**File:** `src/database.py`

```python
class Database:
    def __init__(self, connection):
        self.connection = connection

    def create_user(self, name, email):
        """Create user in database"""
        cursor = self.connection.cursor()
        cursor.execute(
            'INSERT INTO users (name, email) VALUES (?, ?)',
            (name, email)
        )
        self.connection.commit()
        return cursor.lastrowid

    def get_user(self, user_id):
        """Get user from database"""
        cursor = self.connection.cursor()
        cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
        return cursor.fetchone()
```

**Test:** `tests/test_database.py`

```python
import pytest
import sqlite3

@pytest.fixture
def db_connection(tmp_path):
    """Fixture providing SQLite database connection"""
    db_path = tmp_path / 'test.db'
    connection = sqlite3.connect(str(db_path))
    connection.row_factory = sqlite3.Row
    
    # Create table
    cursor = connection.cursor()
    cursor.execute('''
        CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL
        )
    ''')
    connection.commit()
    
    yield connection
    connection.close()

@pytest.fixture
def database(db_connection):
    """Fixture providing Database instance"""
    from src.database import Database
    return Database(db_connection)

class TestDatabase:
    def test_create_user_inserts_record(self, database):
        user_id = database.create_user('John Doe', 'john@example.com')
        assert user_id is not None
        assert isinstance(user_id, int)

    def test_get_user_returns_user_data(self, database):
        user_id = database.create_user('Jane Smith', 'jane@example.com')
        user = database.get_user(user_id)
        
        assert user['name'] == 'Jane Smith'
        assert user['email'] == 'jane@example.com'

    def test_get_nonexistent_user_returns_none(self, database):
        user = database.get_user(999)
        assert user is None
```

### Example 5: Mocking External API Calls

**File:** `src/weather_service.py`

```python
import requests

class WeatherService:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = 'https://api.weather.com'

    def get_weather(self, city):
        """Get weather for city"""
        response = requests.get(
            f'{self.base_url}/weather',
            params={'city': city, 'api_key': self.api_key}
        )
        response.raise_for_status()
        return response.json()
```

**Test:** `tests/test_weather_service.py`

```python
import pytest
from unittest.mock import patch, MagicMock
from src.weather_service import WeatherService

@pytest.fixture
def weather_service():
    return WeatherService('test-api-key')

class TestWeatherService:
    @patch('requests.get')
    def test_get_weather_returns_data(self, mock_get, weather_service):
        """Test successful weather API call"""
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'city': 'New York',
            'temperature': 72,
            'condition': 'Sunny'
        }
        mock_get.return_value = mock_response

        weather = weather_service.get_weather('New York')

        assert weather['city'] == 'New York'
        assert weather['temperature'] == 72
        mock_get.assert_called_once()

    @patch('requests.get')
    def test_get_weather_handles_api_error(self, mock_get, weather_service):
        """Test API error handling"""
        mock_response = MagicMock()
        mock_response.raise_for_status.side_effect = Exception('API Error')
        mock_get.return_value = mock_response

        with pytest.raises(Exception, match='API Error'):
            weather_service.get_weather('Invalid City')
```

## Best Practices

1. **Use Fixtures Over Setup/Teardown** — DRY principle for test data

   ```python
   # ✅ Good: Use fixtures
   @pytest.fixture
   def user():
       return {'id': 1, 'name': 'John'}
   
   # ❌ Avoid: setUp/tearDown methods
   def setUp(self):
       self.user = {'id': 1, 'name': 'John'}
   ```

2. **Parametrize Tests** — Test multiple scenarios with one test

   ```python
   # ✅ Good: Parametrize
   @pytest.mark.parametrize('input,expected', [(2, 4), (3, 6)])
   def test_double(input, expected):
       assert double(input) == expected
   ```

3. **Descriptive Test Names** — Names should explain what is tested

   ```python
   # ✅ Good
   def test_user_validation_fails_with_invalid_email():
       pass
   
   # ❌ Poor
   def test_user():
       pass
   ```

4. **Use Markers** — Organize tests by category

   ```python
   @pytest.mark.unit
   def test_add(): pass
   
   @pytest.mark.integration
   def test_database_query(): pass
   
   # Run only unit tests: pytest -m unit
   ```

5. **Keep Fixtures Focused** — One responsibility per fixture

   ```python
   # ✅ Good: Single responsibility
   @pytest.fixture
   def user_data():
       return {'name': 'John', 'email': 'john@example.com'}
   
   # ❌ Avoid: Multiple concerns
   @pytest.fixture
   def everything():
       return {/* 20 different objects */}
   ```

6. **Use context() for Setup/Teardown** — More flexible than fixtures

   ```python
   def test_with_cleanup():
       resource = create_resource()
       try:
           assert resource.is_valid()
       finally:
           resource.cleanup()
   ```

7. **Test Edge Cases** — Include boundary conditions and errors

   ```python
   @pytest.mark.parametrize('value', [0, -1, float('inf'), None])
   def test_edge_cases(value):
       with pytest.raises((ValueError, TypeError)):
           process(value)
   ```

8. **Use pytest-mock** — Better than unittest.mock for pytest

   ```python
   # ✅ Good: Use mocker fixture
   def test_with_mock(mocker):
       mock = mocker.patch('module.function')
       mock.return_value = 'result'
   ```

9. **Async Tests with pytest-asyncio** — Proper async testing

   ```python
   @pytest.mark.asyncio
   async def test_async_operation():
       result = await async_function()
       assert result is not None
   ```

10. **Run Tests Frequently** — Integrate into development workflow

    ```bash
    # Watch mode during development
    ptw
    
    # Full suite before commits
    pytest --cov
    ```

## Integration with Testing Agent

This skill integrates with the Testing Agent's multi-framework architecture:

1. **Framework Selection** — Used when pytest is selected via Framework Selection matrix
2. **Core Prompt Reference** — Follows pytest rules from `agents/testing-agent/shared/core-prompt.md`
3. **Provider Support** — Compatible with Claude, Copilot, and OpenAI providers
4. **Skill Composition** — Works alongside Jest, PHPUnit, and Playwright skills

## Validation

### Test Quality Checklist

- [ ] All tests have descriptive names (> 5 words)
- [ ] Fixtures used for setup/teardown (no setUp methods)
- [ ] Parametrization used for multiple scenarios
- [ ] Async tests use @pytest.mark.asyncio
- [ ] Code coverage > 80%
- [ ] Mocks used only for external dependencies
- [ ] Error cases are tested
- [ ] Edge cases are covered
- [ ] Markers used to categorize tests

### Code Coverage Targets

- **Statements:** ≥80%
- **Branches:** ≥80%
- **Functions:** ≥80%
- **Lines:** ≥80%

## References

### Official Documentation

- [pytest Documentation](https://docs.pytest.org/)
- [pytest Fixtures](https://docs.pytest.org/en/stable/fixture.html)
- [pytest Parametrize](https://docs.pytest.org/en/stable/how-to-parametrize.html)
- [pytest-asyncio](https://pytest-asyncio.readthedocs.io/)

### Testing Patterns

- [Python Testing Best Practices](https://realpython.com/pytest-python-testing/)
- [Pytest with Django](https://pytest-django.readthedocs.io/)
- [Async Testing Guide](https://docs.pytest.org/en/stable/how-to-parametrize.html#pytest-mark-asyncio)

### Related Skills

- [[jest-spec-generation]] — JavaScript testing with Jest
- [[phpunit-spec-generation]] — PHP testing with PHPUnit
- [[playwright-spec-generation]] — E2E testing with Playwright

---

**Skill Version:** 1.0.0  
**Last Updated:** 2026-08-17  
**Status:** Production Ready  
**Framework:** pytest 7.0+, Python 3.8+

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

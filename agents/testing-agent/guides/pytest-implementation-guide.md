---
title: "pytest Implementation Guide"
description: "Comprehensive guide for implementing pytest testing in Python projects with fixtures, async support, and best practices"
version: "1.0.0"
frameworks:
  - pytest
  - python
status: active
---

# pytest Implementation Guide

## Overview

pytest is the most popular testing framework for Python, offering powerful fixtures, parametrization, and plugin ecosystem support. This guide covers practical implementation patterns across diverse Python projects.

## Project Setup

### Installation

```bash
pip install pytest pytest-cov pytest-asyncio pytest-mock pytest-xdist
```

### pytest.ini Configuration

```ini
[pytest]
minversion = 7.0
testpaths = tests
python_files = test_*.py *_test.py
python_classes = Test*
python_functions = test_*
addopts = -v --strict-markers --tb=short
markers =
    unit: Unit tests
    integration: Integration tests
    asyncio: Async tests
```

## Fixtures: The Core Strength

### Fixture Scopes

```python
@pytest.fixture(scope="function")
def calculator():
    """Fresh instance for each test"""
    return Calculator()

@pytest.fixture(scope="module")
def database():
    """Shared across module"""
    db = Database()
    yield db
    db.close()
```

### Fixture Factories

```python
@pytest.fixture
def user_factory():
    def _create(**kwargs):
        defaults = {'email': 'test@example.com'}
        defaults.update(kwargs)
        return User(**defaults)
    return _create

def test_multiple_users(user_factory):
    user1 = user_factory()
    user2 = user_factory(email='other@example.com')
    assert user1.email != user2.email
```

## Parametrization

### Multiple Test Cases

```python
@pytest.mark.parametrize('input,expected', [
    (2, 4),
    (3, 6),
    (-1, -2),
])
def test_double(input, expected):
    assert double(input) == expected

# With IDs for clarity
@pytest.mark.parametrize('value,expected', [
    (1, True),
    (0, False),
], ids=['positive', 'zero'])
def test_is_positive(value, expected):
    assert is_positive(value) == expected
```

## Async Testing

### Async Functions

```python
@pytest.mark.asyncio
async def test_fetch_user():
    user = await fetch_user(1)
    assert user['id'] == 1

@pytest.fixture
async def async_client():
    client = AsyncClient()
    await client.connect()
    yield client
    await client.disconnect()
```

## Mocking

### Using pytest-mock

```python
def test_api_call(mocker):
    mock_api = mocker.patch('requests.get')
    mock_api.return_value.json.return_value = {'status': 'ok'}
    
    result = fetch_data()
    assert result['status'] == 'ok'
```

## Database Testing

### Transaction Fixtures

```python
@pytest.fixture
def db_session(db):
    transaction = db.begin()
    yield db
    transaction.rollback()

def test_user_persistence(db_session):
    db_session.add(User(email='test@example.com'))
    db_session.flush()
    user = db_session.query(User).first()
    assert user.email == 'test@example.com'
```

## Real-World Pattern

```python
@pytest.fixture
def user_service(db):
    return UserService(db)

@pytest.mark.parametrize('email', [
    'user1@example.com',
    'user2@example.com',
])
@pytest.mark.asyncio
async def test_user_operations(user_service, email):
    user = await user_service.get_by_email(email)
    assert user is not None

def test_error_handling(user_service):
    with pytest.raises(ValueError):
        user_service.get_by_email('invalid')
```

## Best Practices

1. **Use fixtures instead of setup/teardown**
2. **Parametrize repeated tests**
3. **Name tests to describe behavior**
4. **Organize by feature**
5. **Mock external dependencies**
6. **Test edge cases and errors**
7. **Keep tests independent**
8. **Use pytest plugins for extensions**
9. **Run tests frequently in development**
10. **Target 80%+ code coverage**

## CI/CD Integration

```yaml
# .github/workflows/pytest.yml
name: pytest
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -e . pytest pytest-cov
      - run: pytest --cov=src --cov-report=xml
      - uses: codecov/codecov-action@v3
```

---

**Guide Version:** 1.0.0  
**Framework:** pytest 7.0+, Python 3.8+

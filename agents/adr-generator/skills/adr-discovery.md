---
name: adr-discovery
description: Find the next available ADR number based on configured numbering format
category: utilities
---

# ADR Discovery Skill

Locates the next available ADR number and generates filenames for new architectural decision records.

## Features

- **Sequential numbering** — 0001, 0002, 0003... with zero-padding
- **Date-based numbering** — 2026-08-18, 2026-08-18-1, 2026-08-18-2...
- **Custom formats** — Extensible for domain-specific numbering schemes
- **Title-to-slug conversion** — Automatically generates kebab-case slugs
- **Collision detection** — Checks for existing ADR files

## Usage

```javascript
const { ADRDiscovery } = require('./adr-discovery');

const discovery = new ADRDiscovery(
  'docs/adr',
  {
    style: 'sequential',
    zeropadded: true,
    width: 4
  }
);

// Get next ADR number
const nextNumber = discovery.findNextNumber();
// Returns: "0003" (for sequential, if 0001 and 0002 exist)

// Get complete ADR info for a title
const adrInfo = discovery.getNextAdrInfo('Use HTTPS for all API calls');
// Returns:
// {
//   number: "0003",
//   filename: "0003-use-https-for-all-api-calls.md",
//   filepath: "/path/to/docs/adr/0003-use-https-for-all-api-calls.md",
//   slug: "use-https-for-all-api-calls"
// }
```

## API Reference

### Constructor

```javascript
new ADRDiscovery(adrDirectory, numberFormat)
```

**Parameters:**

- `adrDirectory` (string) — Path to ADR storage directory
- `numberFormat` (object, optional) — Numbering configuration
  - `style` (string) — "sequential", "date-based", or "custom"
  - `zeropadded` (boolean) — Whether to zero-pad numbers (default: true)
  - `width` (number) — Padding width (default: 4)

### Methods

#### `findNextNumber()`

Returns the next available ADR number as a string.

**Returns:** String (formatted according to `numberFormat`)

**Examples:**

```javascript
// Sequential with zero-padding
discovery.findNextNumber()  // "0005"

// Date-based
discovery.findNextNumber()  // "2026-08-18" or "2026-08-18-2"
```

#### `getNextAdrInfo(title)`

Returns complete information for creating a new ADR file.

**Parameters:**

- `title` (string) — ADR decision title

**Returns:** Object

```javascript
{
  number: string,        // Next ADR number
  filename: string,      // Proposed filename
  filepath: string,      // Full file path
  slug: string          // Title as kebab-case slug
}
```

#### `titleToSlug(title)`

Converts a title to a kebab-case slug for use in filenames.

**Parameters:**

- `title` (string) — ADR decision title

**Returns:** String (lowercase, kebab-case)

**Examples:**

```javascript
discovery.titleToSlug('Use TypeScript for Type Safety')
// Returns: "use-typescript-for-type-safety"

discovery.titleToSlug('API v2 → v3 Migration')
// Returns: "api-v2-v3-migration"
```

#### `adrExists(filename)`

Checks if an ADR with the given filename already exists.

**Parameters:**

- `filename` (string) — ADR filename to check

**Returns:** Boolean

**Example:**

```javascript
if (discovery.adrExists('0005-use-https-for-all-api-calls.md')) {
  // ADR already exists
}
```

#### `getExistingAdrs()`

Lists all existing ADR files in the directory.

**Returns:** Array of strings (sorted filenames)

**Example:**

```javascript
const existing = discovery.getExistingAdrs();
// Returns: ["0001-initial-setup.md", "0002-database-choice.md"]
```

## Numbering Formats

### Sequential (Default)

Simplest format: 0001, 0002, 0003...

```javascript
const discovery = new ADRDiscovery('docs/adr', {
  style: 'sequential',
  zeropadded: true,
  width: 4
});
```

**Files Generated:**

```
0001-use-docker-for-deployment.md
0002-adopt-typescript.md
0003-implement-caching-strategy.md
```

### Date-Based

Includes creation date: 2026-08-18, 2026-08-18-1...

```javascript
const discovery = new ADRDiscovery('docs/adr', {
  style: 'date-based'
});
```

**Files Generated:**

```
2026-08-18-use-docker-for-deployment.md
2026-08-18-adopt-typescript.md          (multiple per day)
2026-08-19-implement-caching-strategy.md
```

### Custom

Implemented via configuration loader for domain-specific schemes.

## Integration

Used by the ADR Generator agent to:

1. **Determine next ADR number** — Before creating new record
2. **Generate filenames** — From decision titles
3. **Validate uniqueness** — Check for collisions
4. **Support migration** — From old numbering to new format

## Testing

Comprehensive test suite in `agents/adr-generator/tests/discovery.test.js`:

- Sequential numbering generation
- Date-based numbering with counters
- Title-to-slug conversion (special characters, spaces, unicode)
- Collision detection
- Edge cases (empty directory, mixed formats, etc.)

Target coverage: >90%

## References

- [ADR Generator Skill](./SKILL.md)
- [Configuration Reference](../config/adr-config.definitions.md)
- [Test Suite](../tests/discovery.test.js)

---
title: "Automation Configuration Schemas"
description: "JSON and YAML schemas for automation configuration files"
version: "v1.0"
last_updated: "2025-11-24"
file_type: "documentation"
---

# 📋 Automation Configuration Schemas

This directory contains JSON Schema and YAML validation schemas for all automation configuration files used by LightSpeed agents and workflows.

## 📂 Schema Files

### Core Schemas

| File                         | Purpose                                | Usage                             |
| ---------------------------- | -------------------------------------- | --------------------------------- |
| `changelog.schema.json`      | Validates CHANGELOG.md structure       | Release automation, versioning    |
| `version.schema.json`        | Validates semantic versioning          | Version bumping, release tagging  |
| `project-fields.schema.json` | GitHub Project board field definitions | Project automation, metadata sync |

## 🔍 Schema Details

### `changelog.schema.json`

Validates the structure of CHANGELOG.md files following Keep a Changelog format.

**Structure**:

```json
{
  "releases": [
    {
      "version": "1.0.0",
      "date": "2025-01-01",
      "sections": {
        "added": ["Feature description"],
        "changed": ["Change description"],
        "fixed": ["Fix description"],
        "removed": ["Removal description"],
        "deprecated": ["Deprecation description"],
        "security": ["Security fix description"]
      }
    }
  ]
}
```

**Validation Rules**:

- Version must be semantic versioning (X.Y.Z)
- Date must be ISO 8601 format (YYYY-MM-DD)
- Sections must be arrays of strings
- At least one section per release

**Used By**:

- `release-notes-manager.agent.cjs`
- `changelog.yml` workflow
- Release automation processes

---

### `version.schema.json`

Validates semantic version format and constraints.

**Structure**:

```json
{
  "version": "1.2.3",
  "major": 1,
  "minor": 2,
  "patch": 3,
  "prerelease": "alpha.1",
  "metadata": "build.123"
}
```

**Validation Rules**:

- Major, minor, patch must be non-negative integers
- Prerelease must match regex: `^[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*$`
- Metadata must match regex: `^[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*$`

**Used By**:

- Version management scripts
- Release workflows
- Semantic versioning automation

---

### `project-fields.schema.json`

Defines custom fields for GitHub Project automation.

**Structure**:

```json
{
  "fields": [
    {
      "name": "Status",
      "type": "select",
      "options": ["Triage", "In Progress", "In Review", "Done"]
    },
    {
      "name": "Priority",
      "type": "select",
      "options": ["Critical", "High", "Normal", "Low"]
    }
  ]
}
```

**Field Types**:

- `select` - Dropdown menu with predefined options
- `text` - Free-form text input
- `number` - Numeric value
- `date` - Date picker
- `iteration` - Sprint/iteration selection

**Used By**:

- `project-meta-sync.yml` workflow
- Project board automation
- Issue/PR field mapping

## ✅ Validating Schemas

### Using AJV (Command Line)

```bash
# Validate CHANGELOG.md against schema
ajv validate -s schemas/automation/schemas/changelog.schema.json -d CHANGELOG.json

# Validate with detailed error output
ajv validate -s schemas/automation/schemas/version.schema.json -d version.json --verbose
```

### Using Node.js

```javascript
const Ajv = require("ajv");
const schema = require("./changelog.schema.json");
const ajv = new Ajv();
const validate = ajv.compile(schema);

const data = require("../CHANGELOG.json");
const valid = validate(data);

if (!valid) {
  console.error("Validation errors:", validate.errors);
}
```

### Using VS Code

1. Install `JSON Schema Store` extension
2. Add schema references to JSON files:

   ```json
   {
     "$schema": "schemas/automation/schemas/changelog.schema.json",
     "releases": []
   }
   ```

3. VS Code will provide real-time validation and autocomplete

## 🛠️ Creating New Schemas

### Schema Template

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Schema Title",
  "description": "Brief description of what this schema validates",
  "type": "object",
  "properties": {
    "fieldName": {
      "type": "string",
      "description": "Field description"
    }
  },
  "required": ["fieldName"],
  "additionalProperties": false
}
```

### Best Practices

1. **Use JSON Schema Draft 7**: `"$schema": "http://json-schema.org/draft-07/schema#"`
2. **Provide Clear Descriptions**: Help users understand field purposes
3. **Set Appropriate Types**: Use `string`, `number`, `boolean`, `array`, `object`
4. **Specify Required Fields**: Use `"required": []` array
5. **Add Examples**: Include example values for clarity
6. **Constrain Values**: Use `enum`, `pattern`, `minLength`, `maxLength`
7. **Document Format**: Include comment headers explaining schema purpose

## 📚 Related Files

### Configuration Files Using These Schemas

- `CHANGELOG.md` - Uses `changelog.schema.json`
- `VERSION` - Uses `version.schema.json`
- `.github/automation/project-fields.yml` - Uses `project-fields.schema.json`

### Related Documentation

- [Automation Governance](.github/AUTOMATION_GOVERNANCE.md) - Automation standards
- [Changelog Guide](docs/RELEASE-PROCESS.md) - Release process documentation
- [JSON Schema Instructions](.github/instructions/json-schema.instructions.md) - Schema creation guidelines

## 🔗 Cross-Reference

| Schema                     | Used By            | Validation Tool   |
| -------------------------- | ------------------ | ----------------- |
| changelog.schema.json      | Release automation | AJV, VS Code      |
| version.schema.json        | Version management | AJV, Node.js      |
| project-fields.schema.json | Project automation | Custom validation |

---

**Maintained by**: LightSpeed Automation Team  
**Last Updated**: 2025-11-24  
**Version**: v1.0

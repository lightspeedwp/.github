---
mode: "agent"
description: "Update Azure Verified Modules (AVM) to latest versions in Bicep files."
tools:
  [
    "codebase",
    "think",
    "changes",
    "fetch",
    "searchResults",
    "todos",
    "edit/editFiles",
    "search",
    "runCommands",
    "bicepschema",
    "azure_get_schema_for_Bicep",
  ]
---

# Update Azure Verified Modules in Bicep Files

Update Bicep file `${file}` to use latest Azure Verified Module (AVM) versions. Limit progress updates to non-breaking changes. Don't output information other than the final outout table and summary.

## Process

1. **Scan**: Extract AVM modules and current versions from `${file}`
2. **Identify**: List all unique AVM modules used by matching `avm/res/{service}/{resource}` using `#search` tool
3. **Check**: Use `#fetch` tool to get latest version of each AVM module from MCR: `https://mcr.microsoft.com/v2/bicep/avm/res/{service}/{resource}/tags/list`
4. **Compare**: Parse semantic versions to identify AVM modules needing update
5. **Review**: For breaking changes, use `#fetch` tool to get docs from: `https://github.com/Azure/bicep-registry-modules/tree/main/avm/res/{service}/{resource}`
6. **Update**: Apply version updates and parameter changes using `#editFiles` tool
7. **Validate**: Run `bicep lint` and `bicep build` using `#runCommands` tool to ensure compliance.
8. **Output**: Summarize changes in a table format with summary of updates below.

## Tool Usage

Always use tools `#search`, `#searchResults`,`#fetch`, `#editFiles`, `#runCommands`, `#todos` if available. Avoid writing code to perform tasks.

## Breaking Change Policy

⚠️ **PAUSE for approval** if updates involve:

- Incompatible parameter changes
- Security/compliance modifications
- Behavioral changes

## Output Format

Only display results in table with icons:

```markdown
| Module                  | Current | Latest | Status | Action  | Docs       |
| ----------------------- | ------- | ------ | ------ | ------- | ---------- |
| avm/res/compute/vm      | 0.1.0   | 0.2.0  | 🔄     | Updated | [📖](link) |
| avm/res/storage/account | 0.3.0   | 0.3.0  | ✅     | Current | [📖](link) |

### Summary of Updates

Describe updates made, any manual reviews needed or issues encountered.
```

## Icons

- 🔄 Updated
- ✅ Current
- ⚠️ Manual review required
- ❌ Failed
- 📖 Documentation

## Requirements

- Use MCR tags API only for version discovery
- Parse JSON tags array and sort by semantic versioning
- Maintain Bicep file validity and linting compliance

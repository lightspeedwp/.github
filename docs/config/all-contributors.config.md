---
file_type: "documentation"
title: "All Contributors Configuration"
description: "Documentation for .all-contributors.config.cjs - All Contributors configuration for tracking and displaying project contributors"
version: "v1.0"
last_updated: "2025-11-20"
authors: ["LightSpeed Team"]
tags: ["config", "contributors", "automation", "all-contributors"]
related_files:
  - ".all-contributors.config.cjs"
  - "all-contributors-update.yml"
  - "ALL-CONTRIBUTORS.md"
---

# All Contributors Configuration

## File Location

- **Config File**: `.all-contributors.config.cjs`
- **Tool**: [All Contributors](https://allcontributorsbot.com/)
- **Format**: CommonJS (.cjs)

## Purpose

The All Contributors configuration enables automatic tracking, recognition, and display of all contributors to the project across multiple contribution types (code, documentation, design, testing, etc.).

## Key Configuration

```javascript
// .all-contributors.config.cjs
module.exports = {
  projectName: "LightSpeed .github",
  projectOwner: "lightspeedwp",
  repoType: "github",
  repoHost: "https://github.com",

  // Commit and PR templates
  commitConvention: "angular",
  commitType: "docs",

  // Contribution types
  contributionTypes: {
    code: { symbol: "💻", description: "Code" },
    doc: { symbol: "📖", description: "Documentation" },
    design: { symbol: "🎨", description: "Design" },
    test: { symbol: "🧪", description: "Tests" },
    bug: { symbol: "🐛", description: "Bug reports" },
    review: { symbol: "👀", description: "Reviews" },
    example: { symbol: "💡", description: "Examples" },
    ideas: { symbol: "🤔", description: "Ideas & Planning" },
    mentoring: { symbol: "🧑‍🏫", description: "Mentoring" },
    maintenance: { symbol: "🚧", description: "Maintenance" },
  },

  // Files to update
  files: ["README.md", "docs/ALL-CONTRIBUTORS.md"],

  // Image settings
  imageSize: 100,

  // Alphabetical sorting
  alphabetizeContributors: true,

  // Badge line limit
  badgeTemplate:
    "[![All Contributors](https://img.shields.io/badge/all_contributors-<%= contributors.length %>-orange.svg?style=flat-square)](#contributors)",

  // Contributor template
  contributorTemplate: "[<%= contributor.name %>](<%= contributor.profile %>)",
};
```

## Configuration Options

| Option                    | Type    | Description                                    |
| ------------------------- | ------- | ---------------------------------------------- |
| `projectName`             | string  | Project name displayed in contributor files    |
| `projectOwner`            | string  | GitHub organization/username                   |
| `repoType`                | string  | Repository type ("github" or "gitlab")         |
| `repoHost`                | string  | Repository host URL                            |
| `commitConvention`        | string  | Commit convention ("angular", "gitmoji", etc.) |
| `files`                   | array   | Files to update with contributor list          |
| `imageSize`               | number  | Avatar image size in pixels                    |
| `alphabetizeContributors` | boolean | Sort contributors alphabetically               |
| `contributionTypes`       | object  | Mapping of contribution types to symbols       |

## Contribution Types

The following contribution types are recognized:

- **code** (💻) - Code contributions
- **doc** (📖) - Documentation contributions
- **design** (🎨) - Design contributions
- **test** (🧪) - Test contributions
- **bug** (🐛) - Bug reports and issues
- **review** (👀) - Code reviews
- **example** (💡) - Example code or demos
- **ideas** (🤔) - Ideas, planning, and feedback
- **mentoring** (🧑‍🏫) - Mentoring and guidance
- **maintenance** (🚧) - Maintenance work

## Usage

### Automatic Updates

The All Contributors bot automatically updates contributor records when:

- Pull requests are merged
- Comments mention contribution types
- PRs are tagged with contribution labels

### Manual Addition

Add a contributor manually by commenting on an issue or PR:

```
@all-contributors please add @username for code,doc,test
```

### Updating the Config

1. **Edit** `.all-contributors.config.cjs`
2. **Run** the workflow or bot to regenerate files
3. **Verify** changes in README.md and docs/ALL-CONTRIBUTORS.md

## Files Updated

The configuration affects these files:

- **README.md** - Contributor badge and links
- **docs/ALL-CONTRIBUTORS.md** - Full contributor list with detailed information
- **.all-contributorsrc.json** - Machine-readable contributor data (auto-generated)

## Integration with Workflows

### Automation Workflow

**File**: `.github/workflows/all-contributors-update.yml`

Automatically updates contributor records:

- Runs on PR merges
- Detects contribution types from PR labels and comments
- Updates contributor list and badges
- Creates documentation commits

### Contributor Attribution

Contributors are recognized for:

- **Code**: Pull request commits
- **Documentation**: README, docs, or wiki contributions
- **Tests**: Test file additions/updates
- **Design**: Visual/UX contributions
- **Reviews**: PR reviews and feedback
- **Ideas**: Issue suggestions and planning input

## Customization

### Adding New Contribution Types

Edit `.all-contributors.config.cjs`:

```javascript
contributionTypes: {
  "translation": { symbol: "🌐", description: "Translations" },
  "security": { symbol: "🔒", description: "Security" },
  "video": { symbol: "📹", description: "Videos" }
}
```

### Changing File Locations

Modify the `files` array:

```javascript
files: [
  "README.md",
  "docs/ALL-CONTRIBUTORS.md",
  "docs/CONTRIBUTORS.md", // Add new file
];
```

### Image Settings

Adjust avatar display:

```javascript
imageSize: 64,           // Smaller avatars
skipCiSkip: true,        // Skip CI for bot commits
commitType: "docs",      // Commit type in message
```

## Best Practices

✅ **DO**:

- Keep contribution types meaningful and consistent
- Use bot comments for adding contributors
- Update config when new contribution types emerge
- Regularly review contributor list for accuracy
- Thank contributors publicly

❌ **DON'T**:

- Manually edit contributor records (use bot instead)
- Add too many custom contribution types (keeps it simple)
- Forget to run updates after config changes
- Leave contributors unrecognized

## Troubleshooting

### Bot Not Updating

1. Check `.all-contributors.config.cjs` syntax
2. Verify file paths in `files` array exist
3. Check bot permissions in repository settings
4. Review workflow logs in GitHub Actions

### Missing Contributors

1. Run: `@all-contributors please regenerate`
2. Comment with explicit contribution type
3. Check `.all-contributorsrc.json` for data
4. Verify files are listed in config

### Format Issues

If contributor list format is wrong:

1. Check `contributorTemplate` setting
2. Verify `imageSize` is valid number
3. Review `badgeTemplate` for typos
4. Clear cache and regenerate

## Related Documentation

- [ALL-CONTRIBUTORS.md](../../ALL-CONTRIBUTORS.md) - Generated contributor list
- [all-contributors-update.yml](./../workflows/all-contributors-update.md) - Automation workflow
- [All Contributors Official Docs](https://allcontributorsbot.com/)

## See Also

- [Contribution Guidelines](../../CONTRIBUTING.md)
- [Contributor Recognition](../../docs/ALL-CONTRIBUTORS.md)
- [Workflows Automation](./../workflows/README.md)

---

*Last Updated: 2025-11-20*
*Maintained by: LightSpeed Team*

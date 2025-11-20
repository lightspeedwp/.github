# Editor Configuration (.editorconfig)

Documentation for the EditorConfig file used in LightSpeed projects to enforce consistent coding styles across different editors and IDEs.

## Table of Contents

- [Configuration File](#configuration-file)
- [Setup](#setup)
- [Rules & Standards](#rules--standards)
- [Editor Support](#editor-support)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)

## Configuration File

### `.editorconfig` (Main Configuration)

**File:** `.editorconfig`

Universal editor configuration that works across all major editors and IDEs.

```ini
# EditorConfig helps maintain consistent coding styles
# https://editorconfig.org

root = true

# All files
[*]
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true
charset = utf-8

# JavaScript, TypeScript, JSON
[*.{js,jsx,ts,tsx,json}]
indent_size = 2

# CSS, SCSS, Sass
[*.{css,scss,sass}]
indent_size = 2

# YAML
[*.{yml,yaml}]
indent_size = 2

# Markdown
[*.md]
indent_size = 2
trim_trailing_whitespace = false

# Shell scripts
[*.{sh,bash}]
indent_size = 2
end_of_line = lf

# PHP
[*.php]
indent_size = 4

# Python
[*.py]
indent_size = 4

# Makefiles require tabs
[Makefile]
indent_style = tab

# Docker
[Dockerfile]
indent_size = 2

# GitHub workflows
[.github/workflows/*.yml]
indent_size = 2
insert_final_newline = true
```

## Setup

### Editor Installation

EditorConfig is supported natively or via plugins in:

**Built-in Support:**

- VS Code (via extension: EditorConfig for VS Code)
- JetBrains IDEs (IntelliJ, WebStorm, PhpStorm)
- Sublime Text
- Vim
- Emacs

**Via Plugin:**

- Eclipse
- Notepad++
- TextMate

### Installation Instructions

#### VS Code

1. Install **EditorConfig for VS Code** extension
2. VS Code will automatically detect `.editorconfig`
3. Settings apply to all editors/terminals within VS Code

```json
{
  "extensions": ["editorconfig.editorconfig"]
}
```

#### Command Line

Install EditorConfig parser for CLI tools:

```bash
# Via npm (for JavaScript tooling)
npm install --save-dev editorconfig

# Via Homebrew (macOS)
brew install editorconfig

# Via apt (Ubuntu/Debian)
sudo apt-get install editorconfig
```

## Rules & Standards

### LightSpeed Standard Indentation

| File Type     | Indent   | Style | Purpose                       |
| ------------- | -------- | ----- | ----------------------------- |
| JS/TS/JSON    | 2 spaces | space | WordPress/JavaScript standard |
| CSS/SCSS/Sass | 2 spaces | space | CSS standard                  |
| YAML          | 2 spaces | space | GitHub Actions standard       |
| Markdown      | 2 spaces | space | Documentation standard        |
| Shell         | 2 spaces | space | Script standard               |
| PHP           | 4 spaces | space | WordPress PHP standard        |
| Python        | 4 spaces | space | PEP8 standard                 |
| Makefiles     | tab      | tab   | Make requirement              |

### Global Rules

```ini
# Always enforced
insert_final_newline = true      # Files end with newline
trim_trailing_whitespace = true  # Remove end-of-line spaces
charset = utf-8                  # UTF-8 encoding
end_of_line = lf                 # Unix line endings (LF)
```

### Exception: Markdown

Markdown files preserve trailing whitespace for line breaks:

```ini
[*.md]
trim_trailing_whitespace = false  # Preserve for MD line breaks
```

## Editor Support

### VS Code Configuration

VS Code respects EditorConfig automatically. Verify in settings:

```json
{
  "editor.insertSpaces": true,
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.encoding": "utf8"
}
```

### IntelliJ / WebStorm

EditorConfig is built-in. Enable in preferences:

1. Preferences → Editor → Code Style
2. Enable "Enable EditorConfig support"
3. Settings automatically apply

### Vim Configuration

Add to `.vimrc`:

```vim
" EditorConfig support
let g:EditorConfig_exclude_patterns = ['fugitive://.*', 'scp://.*']
au FileType gitcommit let b:EditorConfig_disable = 1
```

### Sublime Text

Install **EditorConfig** package:

```bash
# Via Package Control (Cmd+Shift+P)
Package Control: Install Package → EditorConfig
```

## Usage

### Automatic Application

Once installed, EditorConfig rules apply automatically:

- **On file open:** Settings applied from `.editorconfig`
- **On save:** Formatting rules enforced
- **On selection:** Correct indentation available

### Manual Application

Most editors allow manual application:

```bash
# VS Code: Format Document (Shift+Alt+F)
# IntelliJ: Code → Reformat Code (Cmd+Alt+L)
# Sublime: Edit → Indent → Auto
```

### Verify Configuration

Check which rules apply to a file:

```bash
# View effective configuration for a file
editorconfig-cli .github/workflows/lint.yml

# Check specific file
editorconfig-cli src/index.js
```

## Integration

### With Prettier

Prettier respects EditorConfig settings:

```json
{
  "scripts": {
    "format": "prettier --write '**/*.{js,jsx,ts,tsx,json,css,scss,md,yml,yaml}'"
  }
}
```

Prettier will use EditorConfig indentation rules.

### With ESLint

ESLint configuration:

```javascript
module.exports = {
  rules: {
    indent: ["error", 2],
  },
};
```

Must match EditorConfig (2 spaces for JS).

### With Other Tools

EditorConfig integrates with:

- **autoprefixer** - Uses indentation rules
- **postcss** - Respects CSS indentation
- **stylelint** - Uses defined indentation
- **markdownlint** - Applies MD rules

## Troubleshooting

### Common Issues

#### "Indentation doesn't match"

**Cause:** EditorConfig not installed in editor

**Solution:** Install appropriate plugin:

- VS Code: Install EditorConfig extension
- JetBrains: Update IDE to latest version
- Sublime: Install via Package Control

#### "Settings not applying"

**Cause:** Editor not reading `.editorconfig`

**Solution:**

1. Verify `.editorconfig` is in project root
2. Restart editor
3. Check editor settings don't override EditorConfig
4. Enable EditorConfig in preferences

#### "Mixed indentation warning"

**Cause:** File has inconsistent indentation

**Solution:** Auto-fix with formatter:

```bash
npm run format
```

#### "PHP indentation wrong"

**Cause:** Editor applying global 2-space instead of PHP 4-space

**Solution:** Ensure correct `.editorconfig` section:

```ini
[*.php]
indent_size = 4
```

### Validation

Check EditorConfig syntax:

```bash
# Validate configuration
editorconfig-cli --version

# Check effective rules for file
editorconfig-cli path/to/file.js
```

## Related Documentation

- [Editor Configuration](./vscode-settings.md) - VS Code-specific settings
- [Prettier Configuration](./lint-prettier.md) - Code formatting
- [ESLint Configuration](./lint-eslint.md) - JavaScript linting
- [Linting Overview](../LINTING.md) - All tools overview

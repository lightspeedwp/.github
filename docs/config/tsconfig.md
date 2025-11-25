---
file_type: "tool-config"
title: "TypeScript Configuration"
description: "TypeScript compiler options and project settings"
version: "v1.0"
last_updated: "2025-11-20"
maintainer: "LightSpeed Team"
tags: ["typescript", "tsconfig", "compilation", "type-checking"]
---

# TypeScript Configuration

## Overview

**TypeScript** configuration (`tsconfig.json` or `tsconfig.js`) defines:

- Compiler options and output targets
- Module system and resolution strategy
- Type checking strictness
- Source and output directories

- **Config File:** `tsconfig.json` or `tsconfig.js`
- **Purpose:** Configure TypeScript compilation
- **When It Runs:** Build, IDE language support, type checking

## Configuration

### Config Location

```bash
tsconfig.json               # JSON format (recommended)
tsconfig.js                 # JavaScript format
```

### Basic Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "moduleResolution": "node",
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts"]
}
```

## Key Compiler Options

| Option | Purpose | Value |
|--------|---------|-------|
| `target` | JavaScript version | `ES2020`, `ES2022`, etc. |
| `module` | Module system | `ESNext`, `CommonJS`, `ES6` |
| `lib` | Type definitions | `ES2020`, `DOM`, `DOM.Iterable` |
| `strict` | Enable strict mode | `true` |
| `moduleResolution` | How to resolve modules | `node`, `bundler` |
| `declaration` | Generate `.d.ts` files | `true` |
| `sourceMap` | Generate source maps | `true` |
| `outDir` | Output directory | `./dist` |
| `rootDir` | Root source directory | `./src` |

## Strict Mode Options

For maximum type safety:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## Project References

For monorepos:

```json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "tsBuildInfoFile": "./.tsbuildinfo"
  },
  "references": [
    { "path": "./packages/utils" },
    { "path": "./packages/core" }
  ]
}
```

## Path Mapping

Configure module aliases:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@utils/*": ["src/utils/*"],
      "@components/*": ["src/components/*"]
    }
  }
}
```

## IDE Integration

### VS Code

TypeScript support is built-in. Configuration in `.vscode/settings.json`:

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
}
```

### ESLint Integration

When using TypeScript with ESLint:

```json
{
  "compilerOptions": {
    "noEmit": true
  }
}
```

## Running TypeScript

### Build

```bash
# Compile
npx tsc

# Watch mode
npx tsc --watch

# With config file
npx tsc --project tsconfig.json
```

### Type Checking Only

```bash
# Check types without emit
npx tsc --noEmit

# Specific file
npx tsc --noEmit src/file.ts
```

## WordPress-Specific Configuration

For WordPress block development:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "moduleResolution": "node",
    "strict": true,
    "jsx": "react-jsx",
    "jsxImportSource": "@wordpress/element",
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*", "blocks/**/*"],
  "exclude": ["node_modules", "dist", "build"]
}
```

## Troubleshooting

### Issue: Module not found

**Solution:** Check `moduleResolution` and `baseUrl`:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Issue: Type errors in node_modules

**Solution:** Enable `skipLibCheck`:

```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

### Issue: CommonJS interop not working

**Solution:** Enable compatibility options:

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "module": "commonjs"
  }
}
```

## Integration Points

- **Build Process:** Primary compilation target
- **IDE:** Type checking and autocomplete
- **ESLint:** Type-aware linting
- **Tests:** Jest configuration

## References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [tsconfig.json Documentation](https://www.typescriptlang.org/tsconfig)
- [TypeScript Compiler Options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [WordPress Block Development](https://developer.wordpress.org/block-editor/)

---

**Last Updated:** 2025-11-20 | **Maintainer:** LightSpeed Team

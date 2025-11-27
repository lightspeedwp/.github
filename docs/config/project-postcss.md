---
file_type: "tool-config"
title: "PostCSS Configuration"
description: "CSS processing pipeline configuration for optimization and vendor prefixing"
version: "v1.0"
last_updated: "2025-11-20"
maintainer: "LightSpeed Team"
tags: ["postcss", "css", "vendor-prefixes", "autoprefixer", "optimization"]
---

# PostCSS Configuration

## Overview

**PostCSS** processes CSS through a pipeline of plugins for:

- Vendor prefix automation (`autoprefixer`)
- CSS optimization (`cssnano`)
- Modern CSS support
- Plugin-based extensibility

- **Config File:** `postcss.config.js` or `postcss.config.cjs`
- **When It Runs:** Build process, CSS processing pipeline
- **Output:** Optimized, vendor-prefixed CSS

## Configuration

### Config Location

```bash
postcss.config.js           # ES module format
postcss.config.cjs          # CommonJS format
```

### Example Configuration

```javascript
module.exports = {
  plugins: [
    require("autoprefixer"),
    require("cssnano")({
      preset: [
        "default",
        {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    }),
  ],
};
```

## Key Plugins

| Plugin               | Purpose             | Config                            |
| -------------------- | ------------------- | --------------------------------- |
| `autoprefixer`       | Add vendor prefixes | `{ overrideBrowserslist: [...] }` |
| `cssnano`            | Minify & optimize   | `{ preset: 'default' }`           |
| `postcss-preset-env` | Modern CSS support  | `{ stage: 3 }`                    |
| `postcss-import`     | Process `@import`   | Default                           |

## Autoprefixer Configuration

Autoprefixer adds vendor prefixes based on browser support:

```javascript
require("autoprefixer")({
  overrideBrowserslist: ["> 1%", "last 2 versions", "not dead", "not IE 11"],
});
```

### Browserslist Integration

Autoprefixer uses `browserslist` from:

1. `browserslist` field in `package.json`
2. `.browserslistrc` file
3. Environment variable `BROWSERSLIST`

Example `package.json`:

```json
{
  "browserslist": ["> 1%", "last 2 versions", "not dead"]
}
```

## Running PostCSS

### Via Build Tools

PostCSS runs automatically in:

- **Webpack:** `postcss-loader`
- **Vite:** Built-in support
- **Next.js:** Built-in support
- **Gulp:** `gulp-postcss`

### Via CLI

```bash
# Process CSS
npx postcss input.css -o output.css

# Watch mode
npx postcss input.css -o output.css -w

# With config
npx postcss input.css -o output.css -c postcss.config.js
```

## WordPress Compatibility

For WordPress themes and blocks:

```javascript
module.exports = {
  plugins: [
    require("autoprefixer")({
      // Support older browsers if needed
      overrideBrowserslist: ["> 0.5%", "last 3 versions", "Firefox ESR"],
    }),
    // Optional: CSS variables fallbacks
    require("postcss-custom-properties"),
    // Production only
    ...(process.env.NODE_ENV === "production"
      ? [
          require("cssnano")({
            preset: [
              "default",
              {
                discardComments: { removeAll: true },
              },
            ],
          }),
        ]
      : []),
  ],
};
```

## Performance Optimization

### Configuration

```javascript
// Disable plugins in development
const plugins = [require("autoprefixer")];

if (process.env.NODE_ENV === "production") {
  plugins.push(require("cssnano")());
}

module.exports = { plugins };
```

### Best Practices

- Use `cssnano` only in production builds
- Avoid redundant processing
- Cache compiled CSS
- Use source maps for debugging

## Troubleshooting

### Issue: Autoprefixer adds unnecessary prefixes

**Solution:** Update browserslist or disable specific properties:

```javascript
require("autoprefixer")({
  add: false, // Don't add prefixes
  remove: false, // Don't remove prefixes
  supports: true, // Add @supports
  flexbox: "no-2009", // Don't add old flexbox syntax
  grid: false, // Don't add grid prefixes
});
```

### Issue: Build time excessive

**Solution:** Disable cssnano in development:

```javascript
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  plugins: [
    require("autoprefixer"),
    ...(isProduction ? [require("cssnano")] : []),
  ],
};
```

### Issue: CSS variables lost in optimization

**Solution:** Configure cssnano to preserve CSS variables:

```javascript
require("cssnano")({
  preset: [
    "default",
    {
      colormin: false, // Preserve custom properties
      calc: false, // Don't optimize calc()
    },
  ],
});
```

## Integration Points

- **Build Process:** Primary CSS pipeline
- **Development:** Source maps and fast rebuilds
- **Production:** Vendor prefixes and optimization
- **IDE:** VS Code CSS language server integration

## References

- [PostCSS Documentation](https://postcss.org/)
- [Autoprefixer](https://github.com/postcss/autoprefixer)
- [cssnano](https://cssnano.co/)
- [Browserslist](https://github.com/browserslist/browserslist)
- [Related: Stylelint Configuration](./lint-stylelint.md)
- [Related: Prettier Configuration](./lint-prettier.md)

---

**Last Updated:** 2025-11-20 | **Maintainer:** LightSpeed Team

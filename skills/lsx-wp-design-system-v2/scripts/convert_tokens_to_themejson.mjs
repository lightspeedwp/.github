/**
 * Convert tokens/figma-variables.json → theme.generated.json
 * Emits settings.color.palette, typography.fontSizes, spacing.spacingSizes
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const tokensPath = path.join(root, 'tokens', 'figma-variables.json');
const outPath = path.join(root, 'theme.generated.json');

const raw = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

function titleCase(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, m => m.toUpperCase());
}

function toPalette(colors) {
  const out = [];
  const push = (group) => {
    Object.entries(group).forEach(([slug, obj]) => {
      out.push({ slug, name: titleCase(slug), color: obj.value });
    });
  };
  push(colors.semantic);
  push(colors.neutral);
  push(colors.accent);
  return out;
}

function pxToRem(px) {
  const n = parseFloat(px.replace('px',''));
  return (n/16).toFixed(4).replace(/0+$/, '').replace(/\.$/, '') + 'rem';
}

function toFontSizes(fontSizes) {
  return Object.entries(fontSizes).map(([slug, obj]) => ({
    slug,
    name: obj.label || titleCase(slug),
    size: pxToRem(obj.value)
  }));
}

function toSpacing(spacing) {
  return Object.entries(spacing).map(([slug, obj]) => ({
    slug,
    name: obj.value.replace('px','') + 'px',
    size: pxToRem(obj.value)
  }));
}

const theme = {
  "$schema": "https://schemas.wp.org/wp/6.8/theme.json",
  "version": 3,
  "settings": {
    "appearanceTools": true,
    "typography": {
      "fluid": true,
      "fontSizes": toFontSizes(raw.typography.fontSizes)
    },
    "color": {
      "defaultPalette": false,
      "palette": toPalette(raw.colors)
    },
    "spacing": {
      "spacingSizes": toSpacing(raw.spacing),
      "units": ["rem", "px", "%", "vw"],
      "margin": true,
      "padding": true
    }
  }
};

fs.writeFileSync(outPath, JSON.stringify(theme, null, 2));
console.log(`Wrote ${outPath}`);

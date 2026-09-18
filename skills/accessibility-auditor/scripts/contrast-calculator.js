#!/usr/bin/env node
/**
 * WCAG Contrast Ratio Calculator
 * Usage: node contrast-calculator.js <foreground-hex> <background-hex>
 * Example: node contrast-calculator.js "#1E6AFF" "#080808"
 *
 * Outputs JSON with the contrast ratio, relative luminance, and pass/fail
 * for all three WCAG thresholds (3:1, 4.5:1, 7:1).
 */

function parseHex(hex) {
  const clean = hex.replace(/^#/, '');
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean)) {
    return null;
  }
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

// WCAG 2.x relative luminance formula
function relativeLuminance({ r, g, b }) {
  const channel = v => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker  = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function main() {
  const [,, fgArg, bgArg] = process.argv;

  if (!fgArg || !bgArg) {
    console.error('ERROR: Two hex colour arguments required.');
    console.error('Usage: node contrast-calculator.js <foreground-hex> <background-hex>');
    console.error('Example: node contrast-calculator.js "#1E6AFF" "#080808"');
    process.exit(1);
  }

  const fg = parseHex(fgArg);
  const bg = parseHex(bgArg);

  if (!fg) {
    console.error(`ERROR: Invalid foreground hex value: ${fgArg}`);
    process.exit(1);
  }
  if (!bg) {
    console.error(`ERROR: Invalid background hex value: ${bgArg}`);
    process.exit(1);
  }

  const lFg = relativeLuminance(fg);
  const lBg = relativeLuminance(bg);
  const ratio = contrastRatio(lFg, lBg);
  const ratioRounded = Math.round(ratio * 100) / 100;

  const result = {
    foreground: fgArg,
    background: bgArg,
    ratio: ratioRounded,
    luminance: {
      fg: Math.round(lFg * 10000) / 10000,
      bg: Math.round(lBg * 10000) / 10000,
    },
    results: {
      large_text_aa:  { threshold: 3.0,  label: 'Large text / UI components (AA)',  passes: ratio >= 3.0  },
      normal_text_aa: { threshold: 4.5,  label: 'Normal text (AA)',                 passes: ratio >= 4.5  },
      enhanced_aaa:   { threshold: 7.0,  label: 'Normal text enhanced (AAA)',        passes: ratio >= 7.0  },
    },
  };

  console.log(JSON.stringify(result, null, 2));
}

main();

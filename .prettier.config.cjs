/**
 * Prettier configuration (CommonJS) for a `type: module` project.
 * Renamed to .cjs to avoid ESM/require mismatch.
 */
require('dotenv').config();

/** @type {import('prettier').Config} */
module.exports = {
  tabWidth: process.env.PRETTIER_TAB_WIDTH ? parseInt(process.env.PRETTIER_TAB_WIDTH, 10) : 4,
  useTabs: process.env.PRETTIER_USE_TABS === 'true',
  endOfLine: process.env.PRETTIER_EOL || 'lf',
  printWidth: process.env.PRETTIER_PRINT_WIDTH ? parseInt(process.env.PRETTIER_PRINT_WIDTH, 10) : 80,
  // Respect explicit true/false, default to true (project preference)
  singleQuote: process.env.PRETTIER_SINGLE_QUOTE === 'true' ? true : (process.env.PRETTIER_SINGLE_QUOTE === 'false' ? false : true),
  trailingComma: process.env.PRETTIER_TRAILING_COMMA || 'es5',
  bracketSpacing: process.env.PRETTIER_BRACKET_SPACING === 'false' ? false : true,
  arrowParens: process.env.PRETTIER_ARROW_PARENS || 'always'
};

// Ignore patterns moved to .prettierignore for standard handling.

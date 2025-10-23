require('dotenv').config();

module.exports = {
    tabWidth: process.env.PRETTIER_TAB_WIDTH
        ? parseInt(process.env.PRETTIER_TAB_WIDTH, 10)
        : 4,
    useTabs: process.env.PRETTIER_USE_TABS === 'true' ? true : false,
    endOfLine: process.env.PRETTIER_EOL || 'lf',
    printWidth: process.env.PRETTIER_PRINT_WIDTH
        ? parseInt(process.env.PRETTIER_PRINT_WIDTH, 10)
        : 80,
    singleQuote: process.env.PRETTIER_SINGLE_QUOTE === 'true' ? true : true,
    trailingComma: process.env.PRETTIER_TRAILING_COMMA || 'es5',
    bracketSpacing:
        process.env.PRETTIER_BRACKET_SPACING === 'false' ? false : true,
    arrowParens: process.env.PRETTIER_ARROW_PARENS || 'always',
    ignore: [
        'node_modules',
        'build',
        'dist',
        'vendor',
        'coverage',
        'playwright-report',
        'test-results',
    ],
};

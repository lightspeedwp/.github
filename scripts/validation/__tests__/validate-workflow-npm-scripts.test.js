/**
 * Tests for the workflow npm script validator: option flags before the script name.
 */
const { scanRunText } = require('../validate-workflow-npm-scripts.cjs');

const scripts = { 'validate:badge-urls': 'x', test: 'x', 'lint:md': 'x' };
const scan = (text) => {
  const missing = [];
  scanRunText(text, scripts, missing, 'ctx');
  return missing;
};

describe('scanRunText', () => {
  it('finds an undeclared script', () => {
    expect(scan('npm run nope')).toEqual(['ctx: npm run nope']);
  });

  it('accepts a declared script', () => {
    expect(scan('npm run validate:badge-urls')).toEqual([]);
  });

  it('skips option flags before the script name', () => {
    expect(scan('if ! npm run --silent validate:badge-urls; then exit 1; fi')).toEqual([]);
    expect(scan('npm run -s --if-present test')).toEqual([]);
    expect(scan('npm run --workspace=web lint:md')).toEqual([]);
  });

  it('still reports an undeclared script that follows a flag', () => {
    expect(scan('npm run --silent nope')).toEqual(['ctx: npm run nope']);
  });

  it('does not read arguments after the script name as scripts', () => {
    expect(scan('npm run test -- --silent')).toEqual([]);
  });
});

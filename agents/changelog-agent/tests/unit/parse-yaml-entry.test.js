/**
 * Unit tests for parseYamlEntry.
 *
 * The YAML parse error is rethrown with the original error attached as
 * `cause`. That is easy to lose: validateEntry catches everything and exits,
 * so a plain `new Error(...)` would look identical from the CLI while dropping
 * the underlying parser position. These assertions pin the chaining.
 */

const { parseYamlEntry } = require('../../changelog-validator.js');

describe('parseYamlEntry', () => {
  it('parses valid YAML into an object', () => {
    expect(parseYamlEntry('id: 123\ntitle: "A change"\n')).toEqual({
      id: 123,
      title: 'A change',
    });
  });

  it('throws with the parser error preserved as cause', () => {
    let thrown;
    try {
      parseYamlEntry('id: 123\n  bad indent: [unclosed\n');
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(Error);
    expect(thrown.message).toMatch(/^Invalid YAML: /);
    // The whole point of the change: the original error survives.
    expect(thrown.cause).toBeInstanceOf(Error);
    expect(thrown.cause).not.toBe(thrown);
  });

  it('does not set cause when parsing succeeds', () => {
    const parsed = parseYamlEntry('id: 1');
    expect(parsed).toEqual({ id: 1 });
  });
});

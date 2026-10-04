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
    const input = 'id: 123\n  bad indent: [unclosed\n';

    // The exception js-yaml itself raises for this input: the cause has to be that
    // error, with its reason and position, not any other Error.
    let original;
    try {
      require('js-yaml').load(input);
    } catch (error) {
      original = error;
    }
    expect(original).toBeDefined();
    expect(original.mark).toBeDefined();

    let thrown;
    try {
      parseYamlEntry(input);
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(Error);
    expect(thrown.message).toBe(`Invalid YAML: ${original.message}`);
    expect(thrown.cause).not.toBe(thrown);
    expect(thrown.cause.name).toBe(original.name);
    expect(thrown.cause.reason).toBe(original.reason);
    expect(thrown.cause.message).toBe(original.message);
    expect(thrown.cause.mark).toEqual(
      expect.objectContaining({ line: original.mark.line, column: original.mark.column })
    );
  });

  it('does not set cause when parsing succeeds', () => {
    const parsed = parseYamlEntry('id: 1');
    expect(parsed).toEqual({ id: 1 });
  });
});

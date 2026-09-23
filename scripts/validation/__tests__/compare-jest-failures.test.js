const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { compare, failureIds, main, SUITE_FAILURE } = require('../compare-jest-failures.cjs');

function suite(name, { status = 'passed', failed = [], passed = [] } = {}) {
  return {
    name,
    status,
    assertionResults: [
      ...failed.map((fullName) => ({ fullName, status: 'failed' })),
      ...passed.map((fullName) => ({ fullName, status: 'passed' })),
    ],
  };
}

describe('failureIds', () => {
  test('keys failed tests by checkout-relative path and full name', () => {
    const report = {
      testResults: [
        suite('/head/a/x.test.js', { status: 'failed', failed: ['x breaks'], passed: ['x works'] }),
        suite('/head/b/y.test.js'),
      ],
    };

    expect([...failureIds(report, '/head')]).toEqual(['a/x.test.js::x breaks']);
  });

  test('records a suite that fails without running tests', () => {
    const report = { testResults: [suite('/head/c/z.test.js', { status: 'failed' })] };

    expect([...failureIds(report, '/head')]).toEqual([`c/z.test.js::${SUITE_FAILURE}`]);
  });

  test('rejects input that is not a Jest report', () => {
    expect(() => failureIds({}, '/')).toThrow('Not a Jest --json report');
  });
});

describe('compare', () => {
  test('separates new, fixed and unchanged failures', () => {
    const result = compare(new Set(['a', 'b', 'new']), new Set(['a', 'b', 'gone']));

    expect(result).toEqual({ added: ['new'], fixed: ['gone'], unchanged: 2 });
  });

  test('matches identical failures from checkouts at different paths', () => {
    const head = { testResults: [suite('/w/head/t.test.js', { status: 'failed', failed: ['f'] })] };
    const base = { testResults: [suite('/w/base/t.test.js', { status: 'failed', failed: ['f'] })] };

    const result = compare(failureIds(head, '/w/head'), failureIds(base, '/w/base'));

    expect(result.added).toEqual([]);
    expect(result.unchanged).toBe(1);
  });
});

describe('main', () => {
  let directory;

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'compare-jest-'));
  });

  afterEach(() => {
    fs.rmSync(directory, { force: true, recursive: true });
  });

  function write(name, report) {
    const file = path.join(directory, name);
    fs.writeFileSync(file, JSON.stringify(report));
    return file;
  }

  function run(head, base) {
    const output = [];
    const code = main(
      [
        '--head',
        write('head.json', head),
        '--head-root',
        '/h',
        '--base',
        write('base.json', base),
        '--base-root',
        '/b',
      ],
      (line) => output.push(line),
      (line) => output.push(line)
    );
    return { code, output: output.join('\n') };
  }

  test('exits 0 when head only has pre-existing failures', () => {
    const { code, output } = run(
      { testResults: [suite('/h/t.test.js', { status: 'failed', failed: ['old'] })] },
      { testResults: [suite('/b/t.test.js', { status: 'failed', failed: ['old'] })] }
    );

    expect(code).toBe(0);
    expect(output).toContain('New failures: 0');
    expect(output).toContain('Pre-existing failures still failing: 1');
  });

  test('exits 1 and lists new failures', () => {
    const { code, output } = run(
      { testResults: [suite('/h/t.test.js', { status: 'failed', failed: ['old', 'broken'] })] },
      { testResults: [suite('/b/t.test.js', { status: 'failed', failed: ['old'] })] }
    );

    expect(code).toBe(1);
    expect(output).toContain('- t.test.js::broken');
  });

  test('reports fixed failures without failing', () => {
    const { code, output } = run(
      { testResults: [suite('/h/t.test.js')] },
      { testResults: [suite('/b/t.test.js', { status: 'failed', failed: ['old'] })] }
    );

    expect(code).toBe(0);
    expect(output).toContain('- t.test.js::old');
  });

  test('exits 2 on missing arguments or unreadable reports', () => {
    const errors = [];

    expect(
      main(
        ['--head', 'x.json'],
        () => {},
        (line) => errors.push(line)
      )
    ).toBe(2);
    expect(
      main(
        ['--head', '/nope.json', '--head-root', '/', '--base', '/nope.json', '--base-root', '/'],
        () => {},
        (line) => errors.push(line)
      )
    ).toBe(2);
    expect(errors.join('\n')).toContain('Missing --head-root, --base, --base-root');
  });
});

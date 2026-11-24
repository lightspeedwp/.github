/** @jest-environment node */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { parseStrictJson, validateLedger, validate, allocate } = require('../spec-allocations.cjs');
const SCRIPT = path.join(__dirname, '..', 'spec-allocations.cjs');
// A frozen copy of the bootstrap ledger: the live ledger grows with each new allocation.
const BOOTSTRAP = path.join(__dirname, '..', '__fixtures__', 'spec-allocations-bootstrap.json');
let repo;
let ledger;
const options = () => ({ repoRoot: repo, specsDirectory: '.github/specs' });
const root = () => path.join(repo, '.github/specs');
const write = () => fs.writeFileSync(path.join(root(), 'ALLOCATIONS.json'), JSON.stringify(ledger));
const create = (number, slug) => {
  const directory = path.join(root(), `${number}-${slug}`);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'spec.md'), '# Test specification\n');
};
const cli = (...args) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });
const flags = () => ['--repo-root', repo, '--specs-directory', '.github/specs'];
const clone = (value) => JSON.parse(JSON.stringify(value));
const baseline = (value) => { const file = path.join(repo, 'baseline.json'); fs.writeFileSync(file, JSON.stringify(value)); return file; };
const decision = () => ledger.decisions.push({ ...ledger.decisions[0], id: 'transition', decidedAt: '2026-11-04T12:00:00.000Z', recordedAt: '2026-11-04T12:01:00.000Z' });

beforeEach(() => {
  repo = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-allocations-'));
  ledger = JSON.parse(fs.readFileSync(BOOTSTRAP, 'utf8'));
  fs.mkdirSync(root(), { recursive: true });
  write();
  for (const entry of ledger.allocations) if (entry.state === 'materialised') create(entry.number, entry.canonicalSlug);
});
afterEach(() => fs.rmSync(repo, { recursive: true, force: true }));

describe('strict JSON and schema', () => {
  it.each([
    '{"version":1,"version":1}',
    '{"version":1,"\\u0076ersion":1}',
    '{"a":[{"id":"x","\\u0069d":"y"}]}',
    '{"a":[{"b":{"number":"001","\\u006eumber":"002"}}]}',
  ])('rejects duplicate decoded keys: %s', (text) => expect(() => parseStrictJson(text)).toThrow('Duplicate JSON key'));
  it('does not confuse quoted contents or keys in separate objects', () => {
    const text = '{"a":"{\\"a\\":1,\\"a\\":2}","b":[{"a":1},{"a":2}]}';
    expect(parseStrictJson(text)).toEqual({ a: '{"a":1,"a":2}', b: [{ a: 1 }, { a: 2 }] });
  });
  it.each(['{"a":1,}', '{"a":NaN}', '{"a":01}', '\ufeff{"a":1}', '[] trailing'])('rejects invalid syntax: %s', (text) => expect(() => parseStrictJson(text)).toThrow());
  it.each([
    ['unknown root field', (value) => { value.extra = true; }],
    ['unknown decision field', (value) => { value.decisions[0].extra = true; }],
    ['unsupported version', (value) => { value.version = 2; }],
    ['implicit number conversion', (value) => { value.allocations[0].number = 1; }],
    ['missing interior allocation', (value) => { value.allocations.splice(20, 1); }],
    ['duplicate number', (value) => { value.allocations[1].number = '001'; }],
    ['unsorted allocations', (value) => { value.allocations.reverse(); }],
    ['bad slug', (value) => { value.allocations[0].canonicalSlug = 'Uppercase'; }],
    ['unknown state', (value) => { value.allocations[0].state = 'approved'; }],
    ['broken reference', (value) => { value.allocations[0].decisionRef = 'missing'; }],
    ['short SHA', (value) => { value.sources[0].sha = 'abc'; }],
    ['foreign URL', (value) => { value.sources[1].url = 'https://github.com/other/repository/pull/3883'; }],
    ['invalid UTC date', (value) => { value.decisions[0].decidedAt = '2026-02-30T12:00:00.000Z'; }],
    ['retirement without history', (value) => { value.allocations[20].historicalClaims = []; }],
    ['unknown target field', (value) => { value.allocations[19].historicalClaims[0].resolvedTo.extra = true; }],
    ['duplicate source id', (value) => { value.sources.push(clone(value.sources[0])); }],
    ['missing source references', (value) => { value.allocations[0].sourceRefs = []; }],
  ])('%s fails closed', (_label, change) => {
    change(ledger);
    expect(() => validateLedger(ledger, '.github/specs')).toThrow();
  });
});

describe('snapshot consistency', () => {
  it('reports the complete bootstrap without implying historical comparison', () => {
    const result = validate(options());
    expect(result.directories).toHaveLength(21);
    expect(result.ledger.allocations).toHaveLength(24);
    expect(result.ledger.allocations.map((entry) => entry.state).filter((state) => state === 'retired')).toHaveLength(2);
    expect(result).toMatchObject({ highest: 24, preservation: 'snapshot-only' });
  });
  it('requires explicit pending materialisation beside the real directory', () => {
    create('020', 'portable-changelog-release-agents');
    expect(() => validate(options())).toThrow('non-materialised directory');
    ledger.allocations[19].state = 'materialised';
    write();
    expect(validate(options()).directories).toHaveLength(22);
  });
  it.each([['021', 'repo-restructuring-canonical-config'], ['022', 'old-plan'], ['025', 'new-feature'], ['020', 'wrong-slug']])('rejects inconsistent directory %s', (number, slug) => {
    create(number, slug);
    expect(() => validate(options())).toThrow();
  });
  it('rejects a missing materialised directory', () => {
    fs.rmSync(path.join(root(), '001-prd-agent-consolidation'), { recursive: true });
    expect(() => validate(options())).toThrow('Directory/state mismatch');
  });
  it('rejects a removed trailing allocation while its directory remains', () => {
    ledger.allocations.pop();
    write();
    expect(() => validate(options())).toThrow();
  });
  it('plans 001 for a fresh root without creating it, while audit still fails empty', () => {
    fs.rmSync(root(), { recursive: true });
    expect(() => validate(options())).toThrow('No specification directories');
    expect(allocate({ ...options(), slug: 'first-feature' })).toBe('001');
    expect(fs.existsSync(root())).toBe(false);
  });
  it('retains strict no-ledger contiguity for both audit and allocation', () => {
    fs.unlinkSync(path.join(root(), 'ALLOCATIONS.json'));
    expect(() => validate(options())).toThrow('Gap detected: expected 20 but found 23');
    expect(() => allocate({ ...options(), slug: 'next-feature' })).toThrow('Gap detected');
  });
});

describe('allocation planning', () => {
  it('allocates 025, not the first absent directory', () => expect(allocate({ ...options(), slug: 'next-feature' })).toBe('025'));
  it('requires the new reviewed row before advancing beyond 025', () => {
    create('025', 'next-feature');
    expect(() => validate(options())).toThrow();
    ledger.allocations.push({ ...ledger.allocations[0], number: '025', canonicalSlug: 'next-feature', historicalClaims: [] });
    write();
    expect(allocate({ ...options(), slug: 'following-feature' })).toBe('026');
  });
  it('accepts the exact pending claim', () => expect(allocate({ ...options(), number: '20', slug: 'portable-changelog-release-agents' })).toBe('020'));
  it.each([undefined, '025'])('rejects assigning pending 020 identity to next number %s', (number) => {
    expect(() => allocate({ ...options(), number, slug: 'portable-changelog-release-agents' })).toThrow('Canonical slug belongs to another allocation');
  });
  it.each([undefined, '025'])('rejects assigning a materialised identity to next number %s', (number) => {
    expect(() => allocate({ ...options(), number, slug: 'prd-agent-consolidation' })).toThrow('Canonical slug belongs to another allocation');
  });
  it.each([['021', 'x'], ['022', 'x'], ['020', 'wrong'], ['026', 'new'], ['000', 'new'], ['1000', 'new'], ['1e2', 'new']])('rejects request %s/%s', (number, slug) => expect(() => allocate({ ...options(), number, slug })).toThrow());
  it('reuses only an exact identity in explicit supported reuse mode', () => {
    expect(allocate({ ...options(), number: '001', slug: 'prd-agent-consolidation', allowExisting: true })).toBe('001');
    expect(() => allocate({ ...options(), number: '001', slug: 'prd-agent-consolidation' })).toThrow();
    expect(() => allocate({ ...options(), number: '001', slug: 'wrong', allowExisting: true })).toThrow();
  });
  it('compares the supplied final fitted slug rather than a pre-truncation label', () => {
    ledger.allocations[19].canonicalSlug = 'a'.repeat(240);
    ledger.allocations[21].historicalClaims[0].resolvedTo.slug = 'a'.repeat(240);
    write();
    expect(allocate({ ...options(), number: '020', slug: 'a'.repeat(240) })).toBe('020');
    expect(() => allocate({ ...options(), number: '020', slug: 'a'.repeat(241) })).toThrow();
  });
  it('rejects exhaustion instead of producing 1000', () => {
    fs.rmSync(root(), { recursive: true }); fs.mkdirSync(root(), { recursive: true });
    for (let i = 1; i <= 999; i++) create(String(i).padStart(3, '0'), `entry-${i}`);
    expect(() => allocate({ ...options(), slug: 'overflow' })).toThrow('exhausted');
  });
});

describe('explicit offline baseline comparison', () => {
  it('checks old schema without matching old pending rows against candidate directories', () => {
    const previous = clone(ledger);
    ledger.allocations[19].state = 'materialised';
    decision();
    ledger.allocations[19].decisionRef = 'transition';
    write();
    create('020', 'portable-changelog-release-agents');
    expect(validate({ ...options(), baseline: baseline(previous) }).preservation).toBe('baseline-compared');
  });
  it.each([
    ['removed retired row', (value) => value.allocations.splice(20, 1)],
    ['reused retired number', (value) => { value.allocations[20].state = 'pending'; value.allocations[20].canonicalSlug = 'reused'; }],
    ['changed identity', (value) => { value.allocations[0].canonicalSlug = 'replacement'; }],
    ['replaced source', (value) => { value.sources[0].sha = 'a'.repeat(40); }],
    ['removed history', (value) => value.allocations[21].historicalClaims.pop()],
    ['changed decision', (value) => { value.decisions[0].scope = 'replacement'; }],
  ])('rejects %s', (_label, change) => {
    const file = baseline(clone(ledger));
    change(ledger);
    write();
    expect(() => validate({ ...options(), baseline: file })).toThrow();
  });
  it('allows pending retirement only with a new decision and retained identity', () => {
    ledger.allocations.push({ ...ledger.allocations[19], number: '025', canonicalSlug: 'future-plan', historicalClaims: [] });
    const previous = clone(ledger); const file = baseline(previous);
    decision();
    const entry = ledger.allocations[24];
    entry.state = 'retired'; entry.canonicalSlug = null; entry.decisionRef = 'transition';
    entry.historicalClaims = [{ slug: 'future-plan', kind: 'unfulfilled-claim', resolvedTo: null, decisionRef: 'transition', sourceRefs: [...entry.sourceRefs] }];
    write();
    expect(validate({ ...options(), baseline: file }).highest).toBe(25);
  });
  it('retires bootstrap 020 without rewriting the retained 022 resolution', () => {
    const previous = clone(ledger);
    const reference = clone(ledger.allocations[21].historicalClaims[0]);
    const file = baseline(previous);
    decision();
    const entry = ledger.allocations[19];
    entry.state = 'retired'; entry.canonicalSlug = null; entry.decisionRef = 'transition';
    entry.historicalClaims.push({ slug: previous.allocations[19].canonicalSlug, kind: 'unfulfilled-claim', resolvedTo: null, decisionRef: 'transition', sourceRefs: [...entry.sourceRefs] });
    write();
    expect(validate({ ...options(), baseline: file }).preservation).toBe('baseline-compared');
    expect(ledger.allocations[21].historicalClaims[0]).toEqual(reference);
    expect(allocate({ ...options(), slug: 'next-feature', baseline: file })).toBe('025');
    entry.historicalClaims.at(-1).slug = 'invented-identity';
    write();
    expect(() => validate({ ...options(), baseline: file })).toThrow('Broken historical target');
  });
});

describe('CLI contract', () => {
  it('does nothing merely because it was imported', () => {
    const result = spawnSync(process.execPath, ['-e', `require(${JSON.stringify(SCRIPT)})`], { encoding: 'utf8', cwd: repo });
    expect(result).toMatchObject({ status: 0, stdout: '', stderr: '' });
  });
  it('distinguishes valid, invalid, usage and unavailable-baseline outcomes', () => {
    expect(cli('validate', ...flags()).status).toBe(0);
    fs.writeFileSync(path.join(root(), 'ALLOCATIONS.json'), '{bad json');
    expect(cli('validate', ...flags()).status).toBe(1);
    expect(cli('unknown').status).toBe(2);
    write();
    expect(cli('validate', ...flags(), '--baseline', path.join(repo, 'missing.json')).status).toBe(2);
  });
  it('does not hide ledger deletion behind legacy fallback when a baseline is supplied', () => {
    const file = baseline(clone(ledger));
    fs.unlinkSync(path.join(root(), 'ALLOCATIONS.json'));
    expect(cli('validate', ...flags(), '--baseline', file).status).toBe(1);
  });
});

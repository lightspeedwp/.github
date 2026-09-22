const fs = require('fs');
const os = require('os');
const path = require('path');

describe('header-footer', () => {
  test('ensureFooter appends the canonical docs footer', async () => {
    const { ensureFooter } = await import('../header-footer.js');
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'branding-footer-'));
    const filePath = path.join(tmpDir, 'branching-strategy.md');

    fs.writeFileSync(
      filePath,
      [
        '---',
        'title: Org-wide Git Branching Strategy',
        'description: Canonical branch naming and merge discipline.',
        'file_type: documentation',
        '---',
        '',
        '# Org-wide Git Branching Strategy',
        '',
        'Primary operations reference.',
        '',
      ].join('\n')
    );

    expect(ensureFooter(filePath, { category: 'docs', seed: 'branching' })).toBe(true);

    // loadFooterConfig() reads .github/footers.yml (this test runs with
    // process.cwd() at the repo root, where that file lives), so the
    // "docs" category's real phrases are used, not the DEFAULT_FOOTERS
    // fallback. selectFooter()'s hash deterministically maps seed
    // "branching" to index 2 of that category's phrase list.
    const output = fs.readFileSync(filePath, 'utf8');
    expect(output).toContain('Prefer a guided setup? Book a consult.');
    expect(output).not.toContain('https://lightspeedwp.agency/contact');
  });

  test('ensureFooter ignores footer text mentioned in the body', async () => {
    const { ensureFooter } = await import('../header-footer.js');
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'branding-footer-body-'));
    const filePath = path.join(tmpDir, 'branding-note.md');

    fs.writeFileSync(
      filePath,
      [
        '---',
        'title: Branding note',
        'description: Body text mentions the footer phrase.',
        'file_type: documentation',
        '---',
        '',
        'This note mentions Prefer a guided setup? Book a consult. in the body.',
        '',
      ].join('\n')
    );

    // Same seed as the previous test: selectFooter()'s hash deterministically
    // maps "branching" to the "docs" category's index-2 phrase ("Prefer a
    // guided setup? Book a consult.", from .github/footers.yml), so the
    // appended footer is guaranteed to be that same phrase, letting this
    // assert on exactly 2 occurrences -- one from the body, one appended.
    expect(ensureFooter(filePath, { category: 'docs', seed: 'branching' })).toBe(true);

    const output = fs.readFileSync(filePath, 'utf8');
    const footerMatches = output.match(/Prefer a guided setup\? Book a consult\./g) || [];
    expect(footerMatches).toHaveLength(2);
  });
});

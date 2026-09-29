const fs = require('fs');
const os = require('os');
const path = require('path');

// Regression coverage for #3538(A): `new AutoFixer({ backup: false })`
// must not write `.backup` files. Uses temp dirs so no repo files change.
function makeFixableFile() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'auto-fixer-backup-'));
  const filePath = path.join(dir, 'sample.js');
  fs.writeFileSync(filePath, "const x = require('old-pkg');\n");
  return { dir, filePath };
}

async function loadFixer() {
  const { default: AutoFixer } = await import('../lib/auto-fixer.js');
  return AutoFixer;
}

describe('AutoFixer backup option (#3538)', () => {
  test('backup:false applies the fix without writing a .backup file', async () => {
    const AutoFixer = await loadFixer();
    const { dir, filePath } = makeFixableFile();
    const fixer = new AutoFixer({ rootDir: dir, backup: false });

    const result = fixer.applyFixToFile('sample.js', 'old-pkg', 'new-pkg', 'js-import');

    expect(result.success).toBe(true);
    expect(result.changed).toBe(true);
    expect(fs.readFileSync(filePath, 'utf8')).toContain("require('new-pkg')");
    expect(fs.existsSync(`${filePath}.backup`)).toBe(false);
  });

  test('omitted backup keeps the default and writes a .backup file', async () => {
    const AutoFixer = await loadFixer();
    const { dir, filePath } = makeFixableFile();
    const fixer = new AutoFixer({ rootDir: dir });

    const result = fixer.applyFixToFile('sample.js', 'old-pkg', 'new-pkg', 'js-import');

    expect(result.success).toBe(true);
    expect(fs.existsSync(`${filePath}.backup`)).toBe(true);
    expect(fs.readFileSync(`${filePath}.backup`, 'utf8')).toContain("require('old-pkg')");
  });

  test('backup:true writes a .backup file', async () => {
    const AutoFixer = await loadFixer();
    const { dir, filePath } = makeFixableFile();
    const fixer = new AutoFixer({ rootDir: dir, backup: true });

    fixer.applyFixToFile('sample.js', 'old-pkg', 'new-pkg', 'js-import');

    expect(fs.existsSync(`${filePath}.backup`)).toBe(true);
  });

  test('dryRun writes neither the fix nor a backup', async () => {
    const AutoFixer = await loadFixer();
    const { dir, filePath } = makeFixableFile();
    const fixer = new AutoFixer({ rootDir: dir, dryRun: true });

    const result = fixer.applyFixToFile('sample.js', 'old-pkg', 'new-pkg', 'js-import');

    expect(result.success).toBe(true);
    expect(fs.readFileSync(filePath, 'utf8')).toContain("require('old-pkg')");
    expect(fs.existsSync(`${filePath}.backup`)).toBe(false);
  });
});

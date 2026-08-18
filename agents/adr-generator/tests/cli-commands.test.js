const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { execute: executeAccept } = require('../cli-commands/accept');
const { execute: executeSupersede } = require('../cli-commands/supersede');
const { execute: executeLink } = require('../cli-commands/link');

// Helper to create test ADRs
function createTestAdr(id, status = 'Proposed') {
  return {
    id,
    title: `Test ADR ${id}`,
    status,
    context: 'Test context',
    decision: 'Test decision',
    consequences: 'Test consequences',
  };
}

function writeTempAdr(dir, filename, adr) {
  const filePath = path.join(dir, filename);
  const content = yaml.dump(adr);
  fs.writeFileSync(filePath, content, 'utf8');
  return filePath;
}

describe('ADR CLI Commands', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = path.join(__dirname, '..', '.test-temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  // ====================================
  // ACCEPT COMMAND TESTS
  // ====================================

  describe('accept command', () => {
    test('should accept a Proposed ADR', async () => {
      const adr = createTestAdr('ADR-001');
      const filePath = writeTempAdr(tempDir, 'adr-001.md', adr);

      const result = await executeAccept(
        { positional: [filePath] },
        {}
      );

      expect(result).toBe(0);

      const updated = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
      expect(updated.status).toBe('Accepted');
      expect(updated.accepted_date).toBeTruthy();
      expect(/^\d{4}-\d{2}-\d{2}$/.test(updated.accepted_date)).toBe(true);
    });

    test('should return error when file does not exist', async () => {
      const result = await executeAccept(
        { positional: [path.join(tempDir, 'nonexistent.md')] },
        {}
      );

      expect(result).toBe(1);
    });

    test('should return input error when no path provided', async () => {
      const result = await executeAccept(
        { positional: [] },
        {}
      );

      expect(result).toBe(4);
    });

    test('should fail if ADR is not in Proposed status', async () => {
      const adr = createTestAdr('ADR-001', 'Accepted');
      const filePath = writeTempAdr(tempDir, 'adr-001.md', adr);

      const result = await executeAccept(
        { positional: [filePath] },
        {}
      );

      expect(result).toBe(1);
    });

    test('should handle invalid YAML', async () => {
      const filePath = path.join(tempDir, 'invalid.md');
      fs.writeFileSync(filePath, 'invalid: yaml: content: [', 'utf8');

      const result = await executeAccept(
        { positional: [filePath] },
        {}
      );

      expect(result).toBe(1);
    });

    test('should handle malformed ADR', async () => {
      const filePath = path.join(tempDir, 'malformed.md');
      fs.writeFileSync(filePath, '"just a string"', 'utf8');

      const result = await executeAccept(
        { positional: [filePath] },
        {}
      );

      expect(result).toBe(1);
    });
  });

  // ====================================
  // SUPERSEDE COMMAND TESTS
  // ====================================

  describe('supersede command', () => {
    test('should mark old ADR as superseded and update new ADR', async () => {
      const oldAdr = createTestAdr('ADR-001', 'Accepted');
      const newAdr = createTestAdr('ADR-002');

      const oldPath = writeTempAdr(tempDir, 'adr-001.md', oldAdr);
      const newPath = writeTempAdr(tempDir, 'adr-002.md', newAdr);

      const result = await executeSupersede(
        { positional: [oldPath, newPath] },
        {}
      );

      expect(result).toBe(0);

      const updatedOld = yaml.safeLoad(fs.readFileSync(oldPath, 'utf8'));
      expect(updatedOld.status).toBe('Superseded');
      expect(updatedOld.superseded_by).toBe('ADR-002');
      expect(updatedOld.superseded_date).toBeTruthy();

      const updatedNew = yaml.safeLoad(fs.readFileSync(newPath, 'utf8'));
      expect(Array.isArray(updatedNew.supersedes)).toBe(true);
      expect(updatedNew.supersedes).toContain('ADR-001');
    });

    test('should return input error when paths missing', async () => {
      const result = await executeSupersede(
        { positional: ['path1'] },
        {}
      );

      expect(result).toBe(4);
    });

    test('should fail if old ADR file does not exist', async () => {
      const newAdr = createTestAdr('ADR-002');
      const newPath = writeTempAdr(tempDir, 'adr-002.md', newAdr);

      const result = await executeSupersede(
        { positional: [path.join(tempDir, 'nonexistent.md'), newPath] },
        {}
      );

      expect(result).toBe(1);
    });

    test('should fail if new ADR file does not exist', async () => {
      const oldAdr = createTestAdr('ADR-001');
      const oldPath = writeTempAdr(tempDir, 'adr-001.md', oldAdr);

      const result = await executeSupersede(
        { positional: [oldPath, path.join(tempDir, 'nonexistent.md')] },
        {}
      );

      expect(result).toBe(1);
    });

    test('should prevent circular references', async () => {
      const adr1 = createTestAdr('ADR-001');
      const adr2 = createTestAdr('ADR-002');
      adr2.supersedes = ['ADR-001'];

      const path1 = writeTempAdr(tempDir, 'adr-001.md', adr1);
      const path2 = writeTempAdr(tempDir, 'adr-002.md', adr2);

      const result = await executeSupersede(
        { positional: [path1, path2] },
        {}
      );

      expect(result).toBe(1);
    });

    test('should prevent self-supersedence', async () => {
      const adr = createTestAdr('ADR-001');
      const filePath = writeTempAdr(tempDir, 'adr-001.md', adr);

      const result = await executeSupersede(
        { positional: [filePath, filePath] },
        {}
      );

      expect(result).toBe(1);
    });

    test('should handle invalid YAML in old ADR', async () => {
      const newAdr = createTestAdr('ADR-002');
      const oldPath = path.join(tempDir, 'invalid.md');
      const newPath = writeTempAdr(tempDir, 'adr-002.md', newAdr);

      fs.writeFileSync(oldPath, 'invalid: yaml: [', 'utf8');

      const result = await executeSupersede(
        { positional: [oldPath, newPath] },
        {}
      );

      expect(result).toBe(1);
    });

    test('should handle invalid YAML in new ADR', async () => {
      const oldAdr = createTestAdr('ADR-001');
      const oldPath = writeTempAdr(tempDir, 'adr-001.md', oldAdr);
      const newPath = path.join(tempDir, 'invalid.md');

      fs.writeFileSync(newPath, 'invalid: yaml: [', 'utf8');

      const result = await executeSupersede(
        { positional: [oldPath, newPath] },
        {}
      );

      expect(result).toBe(1);
    });

    test('should maintain existing supersedes references', async () => {
      const oldAdr = createTestAdr('ADR-001');
      const newAdr = createTestAdr('ADR-003');
      newAdr.supersedes = ['ADR-002'];

      const oldPath = writeTempAdr(tempDir, 'adr-001.md', oldAdr);
      const newPath = writeTempAdr(tempDir, 'adr-003.md', newAdr);

      await executeSupersede(
        { positional: [oldPath, newPath] },
        {}
      );

      const updated = yaml.safeLoad(fs.readFileSync(newPath, 'utf8'));
      expect(updated.supersedes).toContain('ADR-002');
      expect(updated.supersedes).toContain('ADR-001');
    });
  });

  // ====================================
  // LINK COMMAND TESTS
  // ====================================

  describe('link command', () => {
    test('should create a relationship link between two ADRs', async () => {
      const sourceAdr = createTestAdr('ADR-001');
      const targetAdr = createTestAdr('ADR-002');

      const sourcePath = writeTempAdr(tempDir, 'adr-001.md', sourceAdr);
      const targetPath = writeTempAdr(tempDir, 'adr-002.md', targetAdr);

      const result = await executeLink(
        { positional: [sourcePath, targetPath] },
        {}
      );

      expect(result).toBe(0);

      const updated = yaml.safeLoad(fs.readFileSync(sourcePath, 'utf8'));
      expect(Array.isArray(updated.relates_to)).toBe(true);
      expect(updated.relates_to).toContain('ADR-002');
    });

    test('should return input error when paths missing', async () => {
      const result = await executeLink(
        { positional: ['path1'] },
        {}
      );

      expect(result).toBe(4);
    });

    test('should fail if source ADR file does not exist', async () => {
      const targetAdr = createTestAdr('ADR-002');
      const targetPath = writeTempAdr(tempDir, 'adr-002.md', targetAdr);

      const result = await executeLink(
        { positional: [path.join(tempDir, 'nonexistent.md'), targetPath] },
        {}
      );

      expect(result).toBe(1);
    });

    test('should fail if target ADR file does not exist', async () => {
      const sourceAdr = createTestAdr('ADR-001');
      const sourcePath = writeTempAdr(tempDir, 'adr-001.md', sourceAdr);

      const result = await executeLink(
        { positional: [sourcePath, path.join(tempDir, 'nonexistent.md')] },
        {}
      );

      expect(result).toBe(1);
    });

    test('should prevent self-linking', async () => {
      const adr = createTestAdr('ADR-001');
      const filePath = writeTempAdr(tempDir, 'adr-001.md', adr);

      const result = await executeLink(
        { positional: [filePath, filePath] },
        {}
      );

      expect(result).toBe(1);
    });

    test('should not create duplicate links', async () => {
      const sourceAdr = createTestAdr('ADR-001');
      sourceAdr.relates_to = ['ADR-002'];

      const targetAdr = createTestAdr('ADR-002');

      const sourcePath = writeTempAdr(tempDir, 'adr-001.md', sourceAdr);
      const targetPath = writeTempAdr(tempDir, 'adr-002.md', targetAdr);

      const result = await executeLink(
        { positional: [sourcePath, targetPath] },
        {}
      );

      expect(result).toBe(0);

      const updated = yaml.safeLoad(fs.readFileSync(sourcePath, 'utf8'));
      const occurrences = updated.relates_to.filter(ref => ref === 'ADR-002').length;
      expect(occurrences).toBe(1);
    });

    test('should maintain existing relates_to references', async () => {
      const sourceAdr = createTestAdr('ADR-001');
      sourceAdr.relates_to = ['ADR-002'];

      const targetAdr = createTestAdr('ADR-003');

      const sourcePath = writeTempAdr(tempDir, 'adr-001.md', sourceAdr);
      const targetPath = writeTempAdr(tempDir, 'adr-003.md', targetAdr);

      await executeLink(
        { positional: [sourcePath, targetPath] },
        {}
      );

      const updated = yaml.safeLoad(fs.readFileSync(sourcePath, 'utf8'));
      expect(updated.relates_to).toContain('ADR-002');
      expect(updated.relates_to).toContain('ADR-003');
    });

    test('should handle invalid YAML in source ADR', async () => {
      const targetAdr = createTestAdr('ADR-002');
      const sourcePath = path.join(tempDir, 'invalid.md');
      const targetPath = writeTempAdr(tempDir, 'adr-002.md', targetAdr);

      fs.writeFileSync(sourcePath, 'invalid: yaml: [', 'utf8');

      const result = await executeLink(
        { positional: [sourcePath, targetPath] },
        {}
      );

      expect(result).toBe(1);
    });

    test('should handle invalid YAML in target ADR', async () => {
      const sourceAdr = createTestAdr('ADR-001');
      const sourcePath = writeTempAdr(tempDir, 'adr-001.md', sourceAdr);
      const targetPath = path.join(tempDir, 'invalid.md');

      fs.writeFileSync(targetPath, 'invalid: yaml: [', 'utf8');

      const result = await executeLink(
        { positional: [sourcePath, targetPath] },
        {}
      );

      expect(result).toBe(1);
    });
  });

  // ====================================
  // EXIT CODE VALIDATION
  // ====================================

  describe('exit codes', () => {
    test('accept returns 0 on success', async () => {
      const adr = createTestAdr('ADR-001');
      const filePath = writeTempAdr(tempDir, 'adr-001.md', adr);

      const result = await executeAccept({ positional: [filePath] }, {});
      expect(result).toBe(0);
    });

    test('accept returns 1 on execution error', async () => {
      const adr = createTestAdr('ADR-001', 'Accepted');
      const filePath = writeTempAdr(tempDir, 'adr-001.md', adr);

      const result = await executeAccept({ positional: [filePath] }, {});
      expect(result).toBe(1);
    });

    test('accept returns 4 on input validation error', async () => {
      const result = await executeAccept({ positional: [] }, {});
      expect(result).toBe(4);
    });

    test('supersede returns 0 on success', async () => {
      const oldAdr = createTestAdr('ADR-001');
      const newAdr = createTestAdr('ADR-002');

      const oldPath = writeTempAdr(tempDir, 'adr-001.md', oldAdr);
      const newPath = writeTempAdr(tempDir, 'adr-002.md', newAdr);

      const result = await executeSupersede({ positional: [oldPath, newPath] }, {});
      expect(result).toBe(0);
    });

    test('supersede returns 4 on input validation error', async () => {
      const result = await executeSupersede({ positional: [] }, {});
      expect(result).toBe(4);
    });

    test('link returns 0 on success', async () => {
      const sourceAdr = createTestAdr('ADR-001');
      const targetAdr = createTestAdr('ADR-002');

      const sourcePath = writeTempAdr(tempDir, 'adr-001.md', sourceAdr);
      const targetPath = writeTempAdr(tempDir, 'adr-002.md', targetAdr);

      const result = await executeLink({ positional: [sourcePath, targetPath] }, {});
      expect(result).toBe(0);
    });

    test('link returns 4 on input validation error', async () => {
      const result = await executeLink({ positional: [] }, {});
      expect(result).toBe(4);
    });
  });
});

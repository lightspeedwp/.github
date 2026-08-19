/**
 * Tests for validate-structure.js
 * Validates repository structure and required portable folders
 */

const path = require("path");

const REQUIRED_PORTABLE_FOLDERS = [
  "schemas",
  "agents",
  "cookbook",
  "hooks",
  "instructions",
  "plugins",
  "skills",
  "workflows",
];

// Mock file system for testing
function createMockFS() {
  const files = new Map();
  const dirs = new Set();

  return {
    files,
    dirs,
    existsSync: (filePath) => {
      return files.has(filePath) || dirs.has(filePath);
    },
    statSync: (filePath) => ({
      isDirectory: () => dirs.has(filePath),
      isFile: () => files.has(filePath),
    }),
    addFile: (filePath) => {
      files.set(filePath, true);
    },
    addDir: (dirPath) => {
      dirs.add(dirPath);
    },
  };
}

function hasIndexFile(root, folder, existsSync) {
  return ["README.md", "index.md"].some((fileName) =>
    existsSync(path.join(root, folder, fileName)),
  );
}

function validateStructure(root, existsSync, statSync) {
  const errors = [];

  for (const folder of REQUIRED_PORTABLE_FOLDERS) {
    const folderPath = path.join(root, folder);

    if (!existsSync(folderPath) || !statSync(folderPath).isDirectory()) {
      errors.push(`Missing required directory: ${folder}`);
      continue;
    }

    if (!hasIndexFile(root, folder, existsSync)) {
      errors.push(
        `Missing README.md or index.md in required directory: ${folder}`,
      );
    }
  }

  const pilotPlugin = path.join(root, "plugins", "lightspeed-github-ops");
  if (existsSync(pilotPlugin)) {
    if (!statSync(pilotPlugin).isDirectory()) {
      errors.push(
        "Pilot plugin path exists but is not a directory: plugins/lightspeed-github-ops",
      );
    } else {
      for (const fileName of ["README.md"]) {
        const filePath = path.join(pilotPlugin, fileName);
        if (!existsSync(filePath) || !statSync(filePath).isFile()) {
          errors.push(
            `Missing pilot plugin file: plugins/lightspeed-github-ops/${fileName}`,
          );
        }
      }
    }
  }

  return errors;
}

describe("validate-structure", () => {
  describe("hasIndexFile", () => {
    it("should find README.md in folder", () => {
      const mockFS = createMockFS();
      const root = "/repo";
      mockFS.addDir(path.join(root, "agents"));
      mockFS.addFile(path.join(root, "agents", "README.md"));

      const has = hasIndexFile(root, "agents", mockFS.existsSync);
      expect(has).toBe(true);
    });

    it("should find index.md in folder", () => {
      const mockFS = createMockFS();
      const root = "/repo";
      mockFS.addDir(path.join(root, "skills"));
      mockFS.addFile(path.join(root, "skills", "index.md"));

      const has = hasIndexFile(root, "skills", mockFS.existsSync);
      expect(has).toBe(true);
    });

    it("should return false when neither file exists", () => {
      const mockFS = createMockFS();
      const root = "/repo";
      mockFS.addDir(path.join(root, "plugins"));

      const has = hasIndexFile(root, "plugins", mockFS.existsSync);
      expect(has).toBe(false);
    });

    it("should prefer README.md over index.md when both exist", () => {
      const mockFS = createMockFS();
      const root = "/repo";
      mockFS.addDir(path.join(root, "workflows"));
      mockFS.addFile(path.join(root, "workflows", "README.md"));
      mockFS.addFile(path.join(root, "workflows", "index.md"));

      const has = hasIndexFile(root, "workflows", mockFS.existsSync);
      expect(has).toBe(true);
    });
  });

  describe("validateStructure - required folders", () => {
    it("should pass when all required folders exist with README.md", () => {
      const mockFS = createMockFS();
      const root = "/repo";

      for (const folder of REQUIRED_PORTABLE_FOLDERS) {
        const folderPath = path.join(root, folder);
        mockFS.addDir(folderPath);
        mockFS.addFile(path.join(folderPath, "README.md"));
      }

      const errors = validateStructure(
        root,
        mockFS.existsSync,
        mockFS.statSync,
      );
      expect(errors).toHaveLength(0);
    });

    it("should fail when required folder is missing", () => {
      const mockFS = createMockFS();
      const root = "/repo";

      for (const folder of REQUIRED_PORTABLE_FOLDERS) {
        if (folder !== "agents") {
          const folderPath = path.join(root, folder);
          mockFS.addDir(folderPath);
          mockFS.addFile(path.join(folderPath, "README.md"));
        }
      }

      const errors = validateStructure(
        root,
        mockFS.existsSync,
        mockFS.statSync,
      );
      expect(
        errors.some((e) => e.includes("Missing required directory: agents")),
      ).toBe(true);
    });

    it("should fail when folder is a file, not a directory", () => {
      const mockFS = createMockFS();
      const root = "/repo";

      for (const folder of REQUIRED_PORTABLE_FOLDERS) {
        if (folder === "agents") {
          mockFS.addFile(path.join(root, folder));
        } else {
          const folderPath = path.join(root, folder);
          mockFS.addDir(folderPath);
          mockFS.addFile(path.join(folderPath, "README.md"));
        }
      }

      const errors = validateStructure(
        root,
        mockFS.existsSync,
        mockFS.statSync,
      );
      expect(
        errors.some((e) => e.includes("Missing required directory: agents")),
      ).toBe(true);
    });

    it("should fail when index file is missing from required folder", () => {
      const mockFS = createMockFS();
      const root = "/repo";

      for (const folder of REQUIRED_PORTABLE_FOLDERS) {
        const folderPath = path.join(root, folder);
        mockFS.addDir(folderPath);
        if (folder !== "schemas") {
          mockFS.addFile(path.join(folderPath, "README.md"));
        }
      }

      const errors = validateStructure(
        root,
        mockFS.existsSync,
        mockFS.statSync,
      );
      expect(
        errors.some(
          (e) =>
            e.includes("Missing README.md or index.md") &&
            e.includes("schemas"),
        ),
      ).toBe(true);
    });

    it("should pass when folder has index.md instead of README.md", () => {
      const mockFS = createMockFS();
      const root = "/repo";

      for (const folder of REQUIRED_PORTABLE_FOLDERS) {
        const folderPath = path.join(root, folder);
        mockFS.addDir(folderPath);
        if (folder === "agents") {
          mockFS.addFile(path.join(folderPath, "index.md"));
        } else {
          mockFS.addFile(path.join(folderPath, "README.md"));
        }
      }

      const errors = validateStructure(
        root,
        mockFS.existsSync,
        mockFS.statSync,
      );
      expect(errors).toHaveLength(0);
    });

    it("should detect multiple missing folders", () => {
      const mockFS = createMockFS();
      const root = "/repo";

      for (const folder of REQUIRED_PORTABLE_FOLDERS) {
        if (!["agents", "skills", "plugins"].includes(folder)) {
          const folderPath = path.join(root, folder);
          mockFS.addDir(folderPath);
          mockFS.addFile(path.join(folderPath, "README.md"));
        }
      }

      const errors = validateStructure(
        root,
        mockFS.existsSync,
        mockFS.statSync,
      );
      expect(errors.length).toBeGreaterThanOrEqual(3);
      expect(errors.some((e) => e.includes("agents"))).toBe(true);
      expect(errors.some((e) => e.includes("skills"))).toBe(true);
      expect(errors.some((e) => e.includes("plugins"))).toBe(true);
    });
  });

  describe("validateStructure - pilot plugin", () => {
    it("should pass when pilot plugin does not exist", () => {
      const mockFS = createMockFS();
      const root = "/repo";

      for (const folder of REQUIRED_PORTABLE_FOLDERS) {
        const folderPath = path.join(root, folder);
        mockFS.addDir(folderPath);
        mockFS.addFile(path.join(folderPath, "README.md"));
      }

      const errors = validateStructure(
        root,
        mockFS.existsSync,
        mockFS.statSync,
      );
      expect(errors).toHaveLength(0);
    });

    it("should pass when pilot plugin exists with README.md", () => {
      const mockFS = createMockFS();
      const root = "/repo";

      for (const folder of REQUIRED_PORTABLE_FOLDERS) {
        const folderPath = path.join(root, folder);
        mockFS.addDir(folderPath);
        mockFS.addFile(path.join(folderPath, "README.md"));
      }

      const pluginPath = path.join(root, "plugins", "lightspeed-github-ops");
      mockFS.addDir(pluginPath);
      mockFS.addFile(path.join(pluginPath, "README.md"));

      const errors = validateStructure(
        root,
        mockFS.existsSync,
        mockFS.statSync,
      );
      expect(errors).toHaveLength(0);
    });

    it("should fail when pilot plugin exists but is a file", () => {
      const mockFS = createMockFS();
      const root = "/repo";

      for (const folder of REQUIRED_PORTABLE_FOLDERS) {
        const folderPath = path.join(root, folder);
        mockFS.addDir(folderPath);
        mockFS.addFile(path.join(folderPath, "README.md"));
      }

      const pluginPath = path.join(root, "plugins", "lightspeed-github-ops");
      mockFS.addFile(pluginPath);

      const errors = validateStructure(
        root,
        mockFS.existsSync,
        mockFS.statSync,
      );
      expect(errors.some((e) => e.includes("not a directory"))).toBe(true);
    });

    it("should fail when pilot plugin is missing README.md", () => {
      const mockFS = createMockFS();
      const root = "/repo";

      for (const folder of REQUIRED_PORTABLE_FOLDERS) {
        const folderPath = path.join(root, folder);
        mockFS.addDir(folderPath);
        mockFS.addFile(path.join(folderPath, "README.md"));
      }

      const pluginPath = path.join(root, "plugins", "lightspeed-github-ops");
      mockFS.addDir(pluginPath);

      const errors = validateStructure(
        root,
        mockFS.existsSync,
        mockFS.statSync,
      );
      expect(errors.some((e) => e.includes("Missing pilot plugin file"))).toBe(
        true,
      );
    });
  });

  describe("edge cases", () => {
    it("should handle repository with nested plugin folders", () => {
      const mockFS = createMockFS();
      const root = "/repo";

      for (const folder of REQUIRED_PORTABLE_FOLDERS) {
        const folderPath = path.join(root, folder);
        mockFS.addDir(folderPath);
        mockFS.addFile(path.join(folderPath, "README.md"));
      }

      const pluginPath = path.join(root, "plugins", "lightspeed-github-ops");
      mockFS.addDir(pluginPath);
      mockFS.addFile(path.join(pluginPath, "README.md"));
      mockFS.addDir(path.join(pluginPath, "src"));
      mockFS.addDir(path.join(pluginPath, "tests"));

      const errors = validateStructure(
        root,
        mockFS.existsSync,
        mockFS.statSync,
      );
      expect(errors).toHaveLength(0);
    });

    it("should pass with mixed README and index files", () => {
      const mockFS = createMockFS();
      const root = "/repo";

      const indices = [
        "README.md",
        "index.md",
        "README.md",
        "index.md",
        "README.md",
        "index.md",
        "README.md",
        "index.md",
      ];
      for (let i = 0; i < REQUIRED_PORTABLE_FOLDERS.length; i++) {
        const folder = REQUIRED_PORTABLE_FOLDERS[i];
        const folderPath = path.join(root, folder);
        mockFS.addDir(folderPath);
        mockFS.addFile(path.join(folderPath, indices[i]));
      }

      const errors = validateStructure(
        root,
        mockFS.existsSync,
        mockFS.statSync,
      );
      expect(errors).toHaveLength(0);
    });

    it("should detect all errors in deeply broken structure", () => {
      const mockFS = createMockFS();
      const root = "/repo";

      const errors = validateStructure(
        root,
        mockFS.existsSync,
        mockFS.statSync,
      );
      expect(errors.length).toBeGreaterThanOrEqual(8);
    });

    it("should handle case-sensitive folder names", () => {
      const mockFS = createMockFS();
      const root = "/repo";

      for (const folder of REQUIRED_PORTABLE_FOLDERS) {
        const folderPath = path.join(root, folder);
        mockFS.addDir(folderPath);
        mockFS.addFile(path.join(folderPath, "README.md"));
      }

      // Add incorrectly cased folder
      const wrongCasePath = path.join(root, "Agents");
      mockFS.addDir(wrongCasePath);

      const errors = validateStructure(
        root,
        mockFS.existsSync,
        mockFS.statSync,
      );
      expect(errors).toHaveLength(0);
    });
  });
});

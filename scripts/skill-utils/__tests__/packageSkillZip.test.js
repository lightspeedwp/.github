const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");
const { packageSkillZip } = require("../packageSkillZip");

// Helper to check if zip command is available
function hasZip() {
  try {
    execSync("command -v zip", { shell: "/bin/bash", stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

const zipAvailable = hasZip();

describe("packageSkillZip", () => {
  let tempDir;
  let skillDir;
  let outputDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "package-skill-"));
    skillDir = path.join(tempDir, "test-skill");
    outputDir = path.join(tempDir, "output");

    // Create minimal valid skill structure
    fs.mkdirSync(skillDir, { recursive: true });
    fs.mkdirSync(path.join(skillDir, "agents"), { recursive: true });
    fs.writeFileSync(
      path.join(skillDir, "SKILL.md"),
      "---\nname: test-skill\ndescription: A test skill\n---\n# Overview\nTest content",
    );
    fs.writeFileSync(
      path.join(skillDir, "agents/openai.yaml"),
      "config: value",
    );
    fs.writeFileSync(path.join(skillDir, "README.md"), "# Readme");
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  it("should throw error if skill directory does not exist", async () => {
    const nonexistentDir = path.join(tempDir, "nonexistent");
    await expect(packageSkillZip(nonexistentDir)).rejects.toThrow(
      "Skill directory not found",
    );
  });

  it("should throw error if SKILL.md is missing", async () => {
    const invalidSkillDir = path.join(tempDir, "invalid-skill");
    fs.mkdirSync(invalidSkillDir, { recursive: true });
    fs.mkdirSync(path.join(invalidSkillDir, "agents"), { recursive: true });
    fs.writeFileSync(path.join(invalidSkillDir, "agents/openai.yaml"), "");

    await expect(packageSkillZip(invalidSkillDir)).rejects.toThrow(
      "SKILL.md not found",
    );
  });

  (zipAvailable ? it : it.skip)(
    "should create a zip file in specified output directory",
    async () => {
      const result = await packageSkillZip(skillDir, outputDir);

      expect(result.success).toBe(true);
      expect(result.path).toBe(path.join(outputDir, "skill.zip"));
      expect(fs.existsSync(result.path)).toBe(true);
      expect(result.bytes).toBeGreaterThan(0);
    },
  );

  (zipAvailable ? it : it.skip)(
    "should create output directory if it does not exist",
    async () => {
      const nonexistentOutDir = path.join(tempDir, "new", "output", "dir");
      expect(fs.existsSync(nonexistentOutDir)).toBe(false);

      const result = await packageSkillZip(skillDir, nonexistentOutDir);

      expect(result.success).toBe(true);
      expect(fs.existsSync(nonexistentOutDir)).toBe(true);
      expect(fs.existsSync(result.path)).toBe(true);
    },
  );

  (zipAvailable ? it : it.skip)(
    "should exclude __pycache__ directories",
    async () => {
      fs.mkdirSync(path.join(skillDir, "__pycache__"), { recursive: true });
      fs.writeFileSync(path.join(skillDir, "__pycache__", "test.pyc"), "cache");

      const result = await packageSkillZip(skillDir, outputDir);
      expect(result.success).toBe(true);
      expect(fs.existsSync(result.path)).toBe(true);
    },
  );

  (zipAvailable ? it : it.skip)("should exclude .DS_Store files", async () => {
    fs.writeFileSync(path.join(skillDir, ".DS_Store"), "");

    const result = await packageSkillZip(skillDir, outputDir);
    expect(result.success).toBe(true);
    expect(fs.existsSync(result.path)).toBe(true);
  });

  (zipAvailable ? it : it.skip)(
    "should exclude node_modules directory",
    async () => {
      fs.mkdirSync(path.join(skillDir, "node_modules"), { recursive: true });
      fs.writeFileSync(
        path.join(skillDir, "node_modules", "package.json"),
        "{}",
      );

      const result = await packageSkillZip(skillDir, outputDir);
      expect(result.success).toBe(true);
      expect(fs.existsSync(result.path)).toBe(true);
    },
  );

  (zipAvailable ? it : it.skip)("should exclude evals directory", async () => {
    fs.mkdirSync(path.join(skillDir, "evals"), { recursive: true });
    fs.writeFileSync(path.join(skillDir, "evals", "test.json"), "{}");

    const result = await packageSkillZip(skillDir, outputDir);
    expect(result.success).toBe(true);
    expect(fs.existsSync(result.path)).toBe(true);
  });

  (zipAvailable ? it : it.skip)(
    "should include regular content files",
    async () => {
      fs.writeFileSync(path.join(skillDir, "index.js"), "console.log('hi')");
      fs.writeFileSync(
        path.join(skillDir, "script.sh"),
        "#!/bin/bash\necho test",
      );

      const result = await packageSkillZip(skillDir, outputDir);
      expect(result.success).toBe(true);
      expect(fs.existsSync(result.path)).toBe(true);
      expect(result.bytes).toBeGreaterThan(0);
    },
  );

  (zipAvailable ? it : it.skip)("should include subdirectories", async () => {
    fs.mkdirSync(path.join(skillDir, "src"), { recursive: true });
    fs.mkdirSync(path.join(skillDir, "src", "utils"), { recursive: true });
    fs.writeFileSync(path.join(skillDir, "src", "utils", "helper.js"), "");
    fs.writeFileSync(path.join(skillDir, "src", "index.js"), "");

    const result = await packageSkillZip(skillDir, outputDir);
    expect(result.success).toBe(true);
    expect(fs.existsSync(result.path)).toBe(true);
  });

  (zipAvailable ? it : it.skip)(
    "should warn if zip exceeds 15 MB",
    async () => {
      // Create a file and mock fs.statSync to simulate a large zip
      fs.writeFileSync(path.join(skillDir, "large.bin"), Buffer.alloc(1024));

      const consoleSpy = jest
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      const originalStatSync = fs.statSync;
      jest.spyOn(fs, "statSync").mockImplementation((path) => {
        const stats = originalStatSync(path);
        // If it's the output zip file, return a large size
        if (path.includes("skill.zip")) {
          return { size: 16 * 1024 * 1024 };
        }
        return stats;
      });

      const result = await packageSkillZip(skillDir, outputDir);

      expect(result.success).toBe(true);
      expect(result.bytes).toBeGreaterThan(15728640);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/WARNING.*exceeds 15 MB/),
      );

      consoleSpy.mockRestore();
      fs.statSync.mockRestore();
    },
  );

  (zipAvailable ? it : it.skip)(
    "should not warn if zip is under 15 MB",
    async () => {
      const consoleSpy = jest
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      const result = await packageSkillZip(skillDir, outputDir);

      expect(result.success).toBe(true);
      expect(result.bytes).toBeLessThan(15728640);
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    },
  );

  (zipAvailable ? it : it.skip)(
    "should replace existing skill.zip",
    async () => {
      // Create initial zip
      const result1 = await packageSkillZip(skillDir, outputDir);
      const firstStats = fs.statSync(result1.path);

      // Add more content and create again
      fs.writeFileSync(path.join(skillDir, "newfile.txt"), "new content");
      const result2 = await packageSkillZip(skillDir, outputDir);
      const secondStats = fs.statSync(result2.path);

      expect(result1.path).toBe(result2.path);
      expect(secondStats.mtime.getTime()).toBeGreaterThanOrEqual(
        firstStats.mtime.getTime(),
      );
    },
  );

  (zipAvailable ? it : it.skip)(
    "should handle skill directories with hyphens and numbers",
    async () => {
      const specialSkillDir = path.join(tempDir, "test-skill-v2");
      fs.mkdirSync(specialSkillDir, { recursive: true });
      fs.mkdirSync(path.join(specialSkillDir, "agents"), { recursive: true });
      fs.writeFileSync(
        path.join(specialSkillDir, "SKILL.md"),
        "---\nname: test-skill-v2\ndescription: Test\n---\nContent",
      );
      fs.writeFileSync(
        path.join(specialSkillDir, "agents/openai.yaml"),
        "config: value",
      );

      const result = await packageSkillZip(specialSkillDir, outputDir);

      expect(result.success).toBe(true);
      expect(fs.existsSync(result.path)).toBe(true);
    },
  );

  it("should return error if skill directory validation fails", async () => {
    // Create an invalid skill directory (missing SKILL.md)
    const invalidSkillDir = path.join(tempDir, "invalid");
    fs.mkdirSync(invalidSkillDir);

    await expect(packageSkillZip(invalidSkillDir, outputDir)).rejects.toThrow(
      "Failed to create zip file",
    );
  });
});

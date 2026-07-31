const fs = require("fs");
const path = require("path");
const os = require("os");
const { validateSkillStructure } = require("../validateSkillStructure");

describe("validateSkillStructure", () => {
  let tempDir;
  let skillDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "validate-skill-"));
    skillDir = path.join(tempDir, "test-skill");
    fs.mkdirSync(skillDir, { recursive: true });
    fs.mkdirSync(path.join(skillDir, "agents"), { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  it("should throw error if skill directory does not exist", () => {
    const nonexistentDir = path.join(tempDir, "nonexistent");
    expect(() => validateSkillStructure(nonexistentDir)).toThrow(
      "Skill directory not found",
    );
  });

  it("should throw error if SKILL.md not found", () => {
    expect(() => validateSkillStructure(skillDir)).toThrow(
      "SKILL.md not found",
    );
  });

  it("should throw error if agents/openai.yaml not found", () => {
    const skillMd = path.join(skillDir, "SKILL.md");
    fs.writeFileSync(
      skillMd,
      "---\nname: test-skill\ndescription: Test\n---\n",
    );

    expect(() => validateSkillStructure(skillDir)).toThrow(
      "agents/openai.yaml not found",
    );
  });

  it("should throw error if SKILL.md does not start with frontmatter", () => {
    const skillMd = path.join(skillDir, "SKILL.md");
    fs.writeFileSync(skillMd, "# No frontmatter\nTest content");
    fs.writeFileSync(path.join(skillDir, "agents/openai.yaml"), "");

    expect(() => validateSkillStructure(skillDir)).toThrow(
      "SKILL.md must start with YAML frontmatter",
    );
  });

  it("should throw error if name is not lowercase hyphen-case", () => {
    const skillMd = path.join(skillDir, "SKILL.md");
    fs.writeFileSync(
      skillMd,
      "---\nname: TestSkill\ndescription: Test\n---\nContent",
    );
    fs.writeFileSync(path.join(skillDir, "agents/openai.yaml"), "");

    expect(() => validateSkillStructure(skillDir)).toThrow(
      "frontmatter name must be lowercase hyphen-case",
    );
  });

  it("should throw error if description is missing", () => {
    const skillMd = path.join(skillDir, "SKILL.md");
    fs.writeFileSync(skillMd, "---\nname: test-skill\n---\nContent");
    fs.writeFileSync(path.join(skillDir, "agents/openai.yaml"), "");

    expect(() => validateSkillStructure(skillDir)).toThrow(
      "frontmatter description missing",
    );
  });

  it("should throw error if name does not match folder name", () => {
    const skillMd = path.join(skillDir, "SKILL.md");
    fs.writeFileSync(
      skillMd,
      "---\nname: different-skill\ndescription: Test\n---\nContent",
    );
    fs.writeFileSync(path.join(skillDir, "agents/openai.yaml"), "");

    expect(() => validateSkillStructure(skillDir)).toThrow(
      "frontmatter name must match folder name",
    );
  });

  it("should throw error if __pycache__ directory exists", () => {
    const skillMd = path.join(skillDir, "SKILL.md");
    fs.writeFileSync(
      skillMd,
      "---\nname: test-skill\ndescription: Test\n---\nContent",
    );
    fs.writeFileSync(path.join(skillDir, "agents/openai.yaml"), "");
    fs.mkdirSync(path.join(skillDir, "__pycache__"), { recursive: true });

    expect(() => validateSkillStructure(skillDir)).toThrow(
      "package noise found",
    );
  });

  it("should throw error if node_modules directory exists", () => {
    const skillMd = path.join(skillDir, "SKILL.md");
    fs.writeFileSync(
      skillMd,
      "---\nname: test-skill\ndescription: Test\n---\nContent",
    );
    fs.writeFileSync(path.join(skillDir, "agents/openai.yaml"), "");
    fs.mkdirSync(path.join(skillDir, "node_modules"), { recursive: true });

    expect(() => validateSkillStructure(skillDir)).toThrow(
      "package noise found",
    );
  });

  it("should throw error if .DS_Store file exists", () => {
    const skillMd = path.join(skillDir, "SKILL.md");
    fs.writeFileSync(
      skillMd,
      "---\nname: test-skill\ndescription: Test\n---\nContent",
    );
    fs.writeFileSync(path.join(skillDir, "agents/openai.yaml"), "");
    fs.writeFileSync(path.join(skillDir, ".DS_Store"), "");

    expect(() => validateSkillStructure(skillDir)).toThrow(
      "package noise found",
    );
  });

  it("should return valid object for valid skill structure", () => {
    const skillMd = path.join(skillDir, "SKILL.md");
    fs.writeFileSync(
      skillMd,
      "---\nname: test-skill\ndescription: A test skill\n---\n# Overview\nTest content",
    );
    fs.writeFileSync(
      path.join(skillDir, "agents/openai.yaml"),
      "config: value",
    );

    const result = validateSkillStructure(skillDir);
    expect(result.valid).toBe(true);
    expect(result.name).toBe("test-skill");
    expect(result.folderName).toBe("test-skill");
    expect(result.warnings).toEqual([]);
  });

  it("should detect placeholder text when checkPlaceholders is true", () => {
    const skillMd = path.join(skillDir, "SKILL.md");
    fs.writeFileSync(
      skillMd,
      "---\nname: test-skill\ndescription: A test skill\n---\n# Overview\nTODO: implement this",
    );
    fs.writeFileSync(
      path.join(skillDir, "agents/openai.yaml"),
      "config: value",
    );

    const result = validateSkillStructure(skillDir, {
      checkPlaceholders: true,
    });
    expect(result.valid).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings[0]).toContain("possible placeholder text found");
  });

  it("should not detect placeholder text when checkPlaceholders is false", () => {
    const skillMd = path.join(skillDir, "SKILL.md");
    fs.writeFileSync(
      skillMd,
      "---\nname: test-skill\ndescription: A test skill\n---\n# Overview\nTODO: implement this",
    );
    fs.writeFileSync(
      path.join(skillDir, "agents/openai.yaml"),
      "config: value",
    );

    const result = validateSkillStructure(skillDir, {
      checkPlaceholders: false,
    });
    expect(result.valid).toBe(true);
    expect(result.warnings).toEqual([]);
  });

  it("should detect placeholder text containing 'Replace with'", () => {
    const skillMd = path.join(skillDir, "SKILL.md");
    fs.writeFileSync(
      skillMd,
      "---\nname: test-skill\ndescription: A test skill\n---\n# Overview\nReplace with actual content",
    );
    fs.writeFileSync(
      path.join(skillDir, "agents/openai.yaml"),
      "config: value",
    );

    const result = validateSkillStructure(skillDir, {
      checkPlaceholders: true,
    });
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("should detect placeholder text containing 'placeholder'", () => {
    const skillMd = path.join(skillDir, "SKILL.md");
    fs.writeFileSync(
      skillMd,
      "---\nname: test-skill\ndescription: A test skill\n---\n# Overview\nThis is a placeholder section",
    );
    fs.writeFileSync(
      path.join(skillDir, "agents/openai.yaml"),
      "config: value",
    );

    const result = validateSkillStructure(skillDir, {
      checkPlaceholders: true,
    });
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("should allow hyphens in skill name", () => {
    const skillMd = path.join(skillDir, "SKILL.md");
    const skillName = "my-complex-skill-name";
    fs.writeFileSync(
      skillMd,
      `---\nname: ${skillName}\ndescription: A test skill\n---\nContent`,
    );
    fs.writeFileSync(path.join(skillDir, "agents/openai.yaml"), "");

    // Create directory with matching name
    const skillDir2 = path.join(tempDir, skillName);
    fs.mkdirSync(skillDir2, { recursive: true });
    fs.mkdirSync(path.join(skillDir2, "agents"), { recursive: true });
    fs.writeFileSync(
      path.join(skillDir2, "SKILL.md"),
      `---\nname: ${skillName}\ndescription: A test skill\n---\nContent`,
    );
    fs.writeFileSync(path.join(skillDir2, "agents/openai.yaml"), "");

    const result = validateSkillStructure(skillDir2);
    expect(result.valid).toBe(true);
    expect(result.name).toBe(skillName);
  });

  it("should reject name starting with a number", () => {
    const skillMd = path.join(skillDir, "SKILL.md");
    fs.writeFileSync(
      skillMd,
      "---\nname: 123-skill\ndescription: A test skill\n---\nContent",
    );
    fs.writeFileSync(path.join(skillDir, "agents/openai.yaml"), "");

    expect(() => validateSkillStructure(skillDir)).toThrow(
      "frontmatter name must be lowercase hyphen-case",
    );
  });

  it("should reject name with uppercase letters", () => {
    const skillMd = path.join(skillDir, "SKILL.md");
    fs.writeFileSync(
      skillMd,
      "---\nname: test-Skill\ndescription: A test skill\n---\nContent",
    );
    fs.writeFileSync(path.join(skillDir, "agents/openai.yaml"), "");

    expect(() => validateSkillStructure(skillDir)).toThrow(
      "frontmatter name must be lowercase hyphen-case",
    );
  });
});

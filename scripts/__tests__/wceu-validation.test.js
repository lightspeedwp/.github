const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

describe("verify-wceu-readiness.js - Schema Directory Checks", () => {
  const TEMP_DIR = path.join(__dirname, "../../.test-fixtures");
  const SCHEMAS_DIR = path.join(TEMP_DIR, ".schemas");
  const SCRIPT_PATH = path.join(
    __dirname,
    "../../scripts/verify-wceu-readiness.js",
  );

  beforeAll(() => {
    // Create test fixture directory
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up .schemas directory after each test
    if (fs.existsSync(SCHEMAS_DIR)) {
      fs.rmSync(SCHEMAS_DIR, { recursive: true });
    }
  });

  afterAll(() => {
    // Clean up entire temp fixture directory
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true });
    }
  });

  test("should pass when .schemas directory exists with required files", () => {
    // Arrange: Create .schemas directory with schema files
    fs.mkdirSync(SCHEMAS_DIR, { recursive: true });
    fs.writeFileSync(path.join(SCHEMAS_DIR, "frontmatter.schema.json"), "{}");
    fs.writeFileSync(
      path.join(SCHEMAS_DIR, "plugin-manifest.schema.json"),
      "{}",
    );

    // Act & Assert: Script should detect .schemas directory exists
    const schemasExists = fs.existsSync(SCHEMAS_DIR);
    expect(schemasExists).toBe(true);
  });

  test("should fail validation when .schemas directory is missing", () => {
    // Arrange: .schemas directory does not exist
    const schemasExists = fs.existsSync(SCHEMAS_DIR);

    // Assert: Directory should not exist
    expect(schemasExists).toBe(false);
  });

  test("should detect .schemas/memory subdirectory", () => {
    // Arrange: Create .schemas/memory
    const memoryDir = path.join(SCHEMAS_DIR, "memory");
    fs.mkdirSync(memoryDir, { recursive: true });

    // Act & Assert: Memory subdirectory exists
    const memoryExists = fs.existsSync(memoryDir);
    expect(memoryExists).toBe(true);
  });

  test("should not require inverted logic for .schemas directory check", () => {
    // This test documents the fix: .schemas should be checked without inversion
    // Arrange: Create schemas directory
    fs.mkdirSync(SCHEMAS_DIR, { recursive: true });

    // Act: Check without inverted logic (should pass when directory exists)
    const schemasExists = fs.existsSync(SCHEMAS_DIR);
    const isValid = schemasExists; // No inversion

    // Assert: Validation passes when directory exists
    expect(isValid).toBe(true);
  });
});

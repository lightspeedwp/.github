const fs = require("fs");
const path = require("path");
const os = require("os");
const cp = require("child_process");

jest.mock("child_process", () => ({
  exec: jest.fn(),
}));

const { installDeps } = require("../installDeps");

describe("installDeps", () => {
  let tempDir;
  let projectDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "install-deps-"));
    projectDir = path.join(tempDir, "test-project");
    fs.mkdirSync(projectDir, { recursive: true });

    fs.writeFileSync(
      path.join(projectDir, "package.json"),
      JSON.stringify({
        name: "test-project",
        version: "1.0.0",
        dependencies: {},
      }),
    );

    cp.exec.mockReset();
    cp.exec.mockImplementation((cmd, opts, cb) => cb(null, ""));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  it("should return installed: false if node_modules already exists", async () => {
    fs.mkdirSync(path.join(projectDir, "node_modules"), { recursive: true });
    fs.writeFileSync(path.join(projectDir, "node_modules", ".gitkeep"), "");

    const result = await installDeps(projectDir);

    expect(result.success).toBe(true);
    expect(result.installed).toBe(false);
    expect(result.directory).toBe(projectDir);
    expect(cp.exec).not.toHaveBeenCalled();
  });

  it("should throw error if package.json is missing", async () => {
    const emptyDir = path.join(tempDir, "empty");
    fs.mkdirSync(emptyDir);

    await expect(installDeps(emptyDir)).rejects.toThrow(
      "Failed to install dependencies",
    );
  });

  it("should return success result with correct properties", async () => {
    const result = await installDeps(projectDir);

    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("installed");
    expect(result).toHaveProperty("directory");
    expect(typeof result.success).toBe("boolean");
    expect(typeof result.installed).toBe("boolean");
    expect(typeof result.directory).toBe("string");
  });

  it("should resolve directory path correctly", async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(tempDir);
      const relativePath = "test-project";
      const resolvedDir = path.resolve(relativePath);
      expect(fs.realpathSync(resolvedDir)).toBe(fs.realpathSync(projectDir));
    } finally {
      process.chdir(originalCwd);
    }
  });

  it("should use specified directory instead of default", async () => {
    const result = await installDeps(projectDir);

    expect(result.directory).toBe(projectDir);
  });

  it("should handle directory with trailing slash", async () => {
    const dirWithSlash = projectDir + "/";
    const result = await installDeps(dirWithSlash);

    expect(result.directory).toBe(projectDir);
  });

  it("should return installed: true when npm install is needed", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    try {
      const result = await installDeps(projectDir);
      expect(result.installed).toBe(true);
      expect(result.success).toBe(true);
    } finally {
      consoleSpy.mockRestore();
    }
  });

  it("should log appropriate messages", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    fs.mkdirSync(path.join(projectDir, "node_modules"), { recursive: true });

    await installDeps(projectDir);

    expect(consoleSpy).toHaveBeenCalledWith(
      "[OK] node_modules already present",
    );

    consoleSpy.mockRestore();
  });

  it("should log installation info when installing", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    try {
      await installDeps(projectDir);
      expect(consoleSpy).toHaveBeenCalledWith(
        "[INFO] Installing JS deps (pdf-lib, pdfjs-dist)...",
      );
    } finally {
      consoleSpy.mockRestore();
    }
  });

  it("should wrap npm errors with descriptive message", async () => {
    const invalidDir = path.join(tempDir, "invalid");
    fs.mkdirSync(invalidDir);
    fs.writeFileSync(
      path.join(invalidDir, "package.json"),
      JSON.stringify({ name: "invalid" }),
    );

    cp.exec.mockImplementation((cmd, opts, cb) => {
      cb(new Error("Command failed"));
    });

    await expect(installDeps(invalidDir)).rejects.toThrow(
      "Failed to install dependencies",
    );
  });

  it("should use silent npm install flag", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    try {
      await installDeps(projectDir);
      expect(cp.exec).toHaveBeenCalledWith(
        "npm install --silent",
        expect.any(Object),
        expect.any(Function),
      );
    } finally {
      consoleSpy.mockRestore();
    }
  });
});

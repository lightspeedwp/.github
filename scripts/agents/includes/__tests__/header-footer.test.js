const fs = require("fs");
const os = require("os");
const path = require("path");

describe("header-footer", () => {
  test("ensureFooter appends the canonical docs footer", async () => {
    const { ensureFooter } = await import("../header-footer.js");
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "branding-footer-"));
    const filePath = path.join(tmpDir, "branching-strategy.md");

    fs.writeFileSync(
      filePath,
      [
        "---",
        "title: Org-wide Git Branching Strategy",
        "description: Canonical branch naming and merge discipline.",
        "file_type: documentation",
        "---",
        "",
        "# Org-wide Git Branching Strategy",
        "",
        "Primary operations reference.",
        "",
      ].join("\n"),
    );

    expect(
      ensureFooter(filePath, { category: "docs", seed: "branching" }),
    ).toBe(true);

    const output = fs.readFileSync(filePath, "utf8");
    expect(output).toContain(
      "*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*",
    );
    expect(output).not.toContain("https://lightspeedwp.agency/contact");
  });

  test("ensureFooter ignores footer text mentioned in the body", async () => {
    const { ensureFooter } = await import("../header-footer.js");
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "branding-footer-body-"),
    );
    const filePath = path.join(tmpDir, "branding-note.md");

    fs.writeFileSync(
      filePath,
      [
        "---",
        "title: Branding note",
        "description: Body text mentions the footer phrase.",
        "file_type: documentation",
        "---",
        "",
        "This note mentions Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit! in the body.",
        "",
      ].join("\n"),
    );

    expect(ensureFooter(filePath, { category: "docs", seed: "branding" })).toBe(
      true,
    );

    const output = fs.readFileSync(filePath, "utf8");
    const footerMatches =
      output.match(
        /Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!/g,
      ) || [];
    expect(footerMatches).toHaveLength(2);
  });
});

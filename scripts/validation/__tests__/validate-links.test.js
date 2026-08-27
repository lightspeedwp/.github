/**
 * Tests for validate-links.js
 * Validates that markdown links resolve to existing files
 */

const fs = require("fs");
const path = require("path");

// Extracted core validation functions for testing
function extractLinks(content) {
  const links = [];
  const mdLinkRegex = /\[[^\]]+\]\(([^)]+)\)/g;
  let match;

  while ((match = mdLinkRegex.exec(content)) !== null) {
    links.push(match[1]);
  }

  return links;
}

function shouldSkipLink(href) {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("#") ||
    href.startsWith("mailto:")
  );
}

function resolveLink(href, filePath) {
  const target = href.split("#")[0];
  const resolved = path.resolve(path.dirname(filePath), target);
  return resolved;
}

function validateLinks(content, filePath, existenceChecker = fs.existsSync) {
  const links = extractLinks(content);
  const errors = [];

  for (const href of links) {
    if (shouldSkipLink(href)) {
      continue;
    }

    const resolved = resolveLink(href, filePath);
    if (!existenceChecker(resolved)) {
      errors.push({
        href,
        resolved,
        file: filePath,
      });
    }
  }

  return errors;
}

const mockExists = (files) => (filePath) => files.has(filePath);

describe("validate-links", () => {
  describe("extractLinks", () => {
    it("should extract single markdown link", () => {
      const content = "This is a [link](./file.md) in text.";
      const links = extractLinks(content);

      expect(links).toEqual(["./file.md"]);
    });

    it("should extract multiple links", () => {
      const content = `
Check [first](./a.md) and [second](../b.md) links.
Also [third](../../c.md).`;
      const links = extractLinks(content);

      expect(links).toHaveLength(3);
      expect(links[0]).toBe("./a.md");
      expect(links[1]).toBe("../b.md");
      expect(links[2]).toBe("../../c.md");
    });

    it("should extract links with anchors", () => {
      const content =
        "Jump to [section](#heading) or [file](./doc.md#section).";
      const links = extractLinks(content);

      expect(links).toEqual(["#heading", "./doc.md#section"]);
    });

    it("should extract absolute URLs", () => {
      const content =
        "Visit [Google](https://google.com) or [GitHub](https://github.com).";
      const links = extractLinks(content);

      expect(links).toEqual(["https://google.com", "https://github.com"]);
    });

    it("should handle links with special characters", () => {
      const content = "See [document](./folder/my-file_v2.md) here.";
      const links = extractLinks(content);

      expect(links).toEqual(["./folder/my-file_v2.md"]);
    });

    it("should not extract non-markdown links", () => {
      const content =
        'Regular text (not a link) and <a href="#">HTML link</a>.';
      const links = extractLinks(content);

      expect(links).toHaveLength(0);
    });
  });

  describe("shouldSkipLink", () => {
    it("should skip HTTP URLs", () => {
      expect(shouldSkipLink("http://example.com")).toBe(true);
    });

    it("should skip HTTPS URLs", () => {
      expect(shouldSkipLink("https://example.com")).toBe(true);
    });

    it("should skip anchor links", () => {
      expect(shouldSkipLink("#section")).toBe(true);
    });

    it("should skip mailto links", () => {
      expect(shouldSkipLink("mailto:user@example.com")).toBe(true);
    });

    it("should not skip relative paths", () => {
      expect(shouldSkipLink("./file.md")).toBe(false);
      expect(shouldSkipLink("../file.md")).toBe(false);
      expect(shouldSkipLink("file.md")).toBe(false);
    });
  });

  describe("resolveLink", () => {
    it("should resolve relative links from file directory", () => {
      const filePath = "/root/docs/guide.md";
      const href = "./intro.md";
      const resolved = resolveLink(href, filePath);

      expect(resolved).toBe(path.resolve("/root/docs/intro.md"));
    });

    it("should resolve parent directory references", () => {
      const filePath = "/root/docs/api/reference.md";
      const href = "../guide.md";
      const resolved = resolveLink(href, filePath);

      expect(resolved).toBe(path.resolve("/root/docs/guide.md"));
    });

    it("should strip anchor from resolution", () => {
      const filePath = "/root/docs/main.md";
      const href = "./guide.md#section";
      const resolved = resolveLink(href, filePath);

      expect(resolved).toBe(path.resolve("/root/docs/guide.md"));
    });

    it("should handle absolute-like relative paths", () => {
      const filePath = "/root/docs/guide.md";
      const href = "api/reference.md";
      const resolved = resolveLink(href, filePath);

      expect(resolved).toBe(path.resolve("/root/docs/api/reference.md"));
    });
  });

  describe("validateLinks", () => {
    it("should pass when all links exist", () => {
      const files = new Set(["/root/file.md", "/root/other.md"]);
      const content = "See [file](./file.md) and [other](./other.md).";
      const errors = validateLinks(
        content,
        "/root/index.md",
        mockExists(files),
      );

      expect(errors).toHaveLength(0);
    });

    it("should fail when links do not exist", () => {
      const files = new Set(["/root/file.md"]);
      const content = "See [file](./file.md) and [missing](./missing.md).";
      const errors = validateLinks(
        content,
        "/root/index.md",
        mockExists(files),
      );

      expect(errors).toHaveLength(1);
      expect(errors[0].href).toBe("./missing.md");
    });

    it("should skip absolute URLs", () => {
      const files = new Set(["/root/file.md"]);
      const content =
        "Visit [Google](https://google.com) and see [file](./file.md).";
      const errors = validateLinks(
        content,
        "/root/index.md",
        mockExists(files),
      );

      expect(errors).toHaveLength(0);
    });

    it("should skip anchor-only links", () => {
      const files = new Set(["/root/file.md"]);
      const content = "Jump to [section](#heading) and see [file](./file.md).";
      const errors = validateLinks(
        content,
        "/root/index.md",
        mockExists(files),
      );

      expect(errors).toHaveLength(0);
    });

    it("should handle links with anchors", () => {
      const files = new Set(["/root/file.md"]);
      const content = "See [section](./file.md#section).";
      const errors = validateLinks(
        content,
        "/root/index.md",
        mockExists(files),
      );

      expect(errors).toHaveLength(0);
    });

    it("should detect multiple broken links", () => {
      const files = new Set(["/root/file.md"]);
      const content = `
Check [file1](./file1.md), [file2](./file2.md), and [file](./file.md).
Also [file3](./file3.md).`;
      const errors = validateLinks(
        content,
        "/root/index.md",
        mockExists(files),
      );

      expect(errors).toHaveLength(3);
      expect(errors.some((e) => e.href === "./file1.md")).toBe(true);
      expect(errors.some((e) => e.href === "./file2.md")).toBe(true);
      expect(errors.some((e) => e.href === "./file3.md")).toBe(true);
    });

    it("should resolve parent directory links", () => {
      const files = new Set(["/root/guide.md"]);
      const content = "See [guide](../guide.md).";
      const errors = validateLinks(
        content,
        "/root/docs/index.md",
        mockExists(files),
      );

      expect(errors).toHaveLength(0);
    });

    it("should handle nested directory structures", () => {
      const files = new Set(["/root/api/docs/reference.md"]);
      const content = "See [reference](./reference.md).";
      const errors = validateLinks(
        content,
        "/root/api/docs/index.md",
        mockExists(files),
      );

      expect(errors).toHaveLength(0);
    });
  });

  describe("edge cases", () => {
    it("should handle empty content", () => {
      const links = extractLinks("");
      expect(links).toHaveLength(0);
    });

    it("should handle markdown with no links", () => {
      const content = "# Heading\n\nThis is just text.";
      const links = extractLinks(content);
      expect(links).toHaveLength(0);
    });

    it("should handle links with special characters in paths", () => {
      const content = "See [file](./folder-name_v2/my-file.md).";
      const links = extractLinks(content);
      expect(links).toEqual(["./folder-name_v2/my-file.md"]);
    });

    it("should handle links with query parameters", () => {
      const content = "Visit [page](https://example.com?foo=bar).";
      const links = extractLinks(content);
      expect(links).toEqual(["https://example.com?foo=bar"]);
    });

    it("should handle mixed link types in same document", () => {
      const files = new Set(["/root/local.md"]);
      const content = `
[local](./local.md)
[external](https://example.com)
[anchor](#heading)
[email](mailto:test@example.com)
[missing](./missing.md)`;
      const errors = validateLinks(
        content,
        "/root/index.md",
        mockExists(files),
      );

      expect(errors).toHaveLength(1);
      expect(errors[0].href).toBe("./missing.md");
    });

    it("should handle very long paths", () => {
      const longPath =
        "./very/deep/nested/directory/structure/with/many/levels/file.md";
      const content = `See [file](${longPath}).`;
      const links = extractLinks(content);
      expect(links).toEqual([longPath]);
    });

    it("should handle Windows-style paths", () => {
      const content = "See [file](.\\folder\\file.md).";
      const links = extractLinks(content);
      expect(links).toEqual([".\\folder\\file.md"]);
    });

    it("should handle links with parentheses in text", () => {
      const content = "Check [this link (important)](./file.md).";
      const links = extractLinks(content);
      expect(links).toEqual(["./file.md"]);
    });

    it("should handle consecutive links", () => {
      const content = "[first](./a.md)[second](./b.md)[third](./c.md)";
      const links = extractLinks(content);
      expect(links).toHaveLength(3);
    });
  });
});

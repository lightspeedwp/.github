/**
 * Babel plugin: rewrite `import.meta.url` to its CommonJS equivalent (#3472).
 *
 * The root Jest suite runs through babel-jest as CommonJS (no
 * --experimental-vm-modules). Babel cannot convert `import.meta` to
 * CommonJS, so any module that uses it stays ESM and Jest refuses to load
 * it ("Must use import to load ES Module"). Native Node runs of the same
 * files are unaffected: this plugin is applied only under Jest.
 *
 * Only `import.meta.url` is rewritten. Any other `import.meta` property is
 * left alone and still fails loudly rather than being silently faked.
 */
module.exports = function transformImportMetaUrl({ types: t }) {
  return {
    name: "transform-import-meta-url",
    visitor: {
      MemberExpression(path) {
        const { node } = path;
        if (
          !t.isMetaProperty(node.object) ||
          node.object.meta.name !== "import" ||
          node.object.property.name !== "meta" ||
          node.computed ||
          !t.isIdentifier(node.property, { name: "url" })
        ) {
          return;
        }

        // require("node:url").pathToFileURL(__filename).href
        path.replaceWith(
          t.memberExpression(
            t.callExpression(
              t.memberExpression(
                t.callExpression(t.identifier("require"), [
                  t.stringLiteral("node:url"),
                ]),
                t.identifier("pathToFileURL"),
              ),
              [t.identifier("__filename")],
            ),
            t.identifier("href"),
          ),
        );
      },
    },
  };
};

# Build & Automation Scripts for {{projectName}}

See `/bin/` for scripts:

| Script                  | Purpose                          | Usage Example                       |
|-------------------------|----------------------------------|-------------------------------------|
| build.sh                | Build assets                     | `bash bin/build.sh`                 |
| test.sh                 | Run all tests                    | `bash bin/test.sh`                  |
| install-wp-tests.sh     | WP PHPUnit setup                 | `bash bin/install-wp-tests.sh`      |
| update-version.js       | Sync version numbers             | `node bin/update-version.js`        |
| replace-placeholders.js | Replace mustache placeholders    | `node bin/replace-placeholders.js`  |

Scripts use mustache placeholders—see [`PLACEHOLDER-WORKFLOW.md`](./PLACEHOLDER-WORKFLOW.md).
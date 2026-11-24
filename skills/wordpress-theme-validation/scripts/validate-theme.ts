/**
 * Validates a WordPress block theme from its files alone: theme.json, style partials,
 * patterns, templates and parts.
 *
 * Usage (from the repository root):
 *   npx tsx skills/wordpress-theme-validation/scripts/validate-theme.ts <theme-path> [--format text|json] [--only id,…]
 */
import { fileURLToPath } from 'node:url';
import { Cli } from './lib/cli';
import { NodeFileSystem } from './lib/file-system';

process.exitCode = new Cli({
  fs: new NodeFileSystem(),
  stdout: (text) => process.stdout.write(text),
  stderr: (text) => process.stderr.write(text),
  schemaDir: fileURLToPath(new URL('./schemas/', import.meta.url)),
}).run(process.argv.slice(2));

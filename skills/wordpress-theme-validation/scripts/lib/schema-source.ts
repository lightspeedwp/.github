/**
 * Finds a pinned theme.json schema on disk, so validation never needs the network.
 */
import { join } from 'node:path';
import type { SchemaSource } from './checks/theme-json';
import type { FileSystem } from './file-system';

export class BundledSchemaSource implements SchemaSource {
  /**
   * @param dir      Folder of pinned schemas named theme-wp-<version>.json.
   * @param override A schema file used for every URL (the --schema option).
   */
  constructor(
    private readonly fs: FileSystem,
    private readonly dir: string,
    private readonly override?: string
  ) {}

  load(url: string): Record<string, unknown> | undefined {
    const version = url.match(/schemas\.wp\.org\/(?:wp\/)?([\w.]+)\/theme\.json$/)?.[1];
    const path =
      this.override ?? (version ? join(this.dir, `theme-wp-${version}.json`) : undefined);
    const text = path ? this.fs.readText(path) : undefined;
    if (text === undefined) {
      return undefined;
    }
    return JSON.parse(text) as Record<string, unknown>;
  }
}

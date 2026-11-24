/**
 * File access, injected so tests never touch the disk.
 */
import { readdirSync, readFileSync } from 'node:fs';

export interface DirEntry {
  name: string;
  isDirectory: boolean;
}

export interface FileSystem {
  /** The file's text, or undefined when it cannot be read. */
  readText(path: string): string | undefined;
  /** The folder's entries, or an empty list when it does not exist. */
  listDir(path: string): DirEntry[];
}

/* v8 ignore start -- the real file system, used only from the command line */
export class NodeFileSystem implements FileSystem {
  readText(path: string): string | undefined {
    try {
      return readFileSync(path, 'utf8');
    } catch {
      return undefined;
    }
  }

  listDir(path: string): DirEntry[] {
    try {
      return readdirSync(path, { withFileTypes: true }).map((entry) => ({
        name: entry.name,
        isDirectory: entry.isDirectory(),
      }));
    } catch {
      return [];
    }
  }
}
/* v8 ignore stop */

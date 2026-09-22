/**
 * File Scanner (T011)
 * Recursively enumerates agents/, skills/, and .github/workflows/ directories
 * Supports filtering by file type and pattern matching
 */

import fs from 'fs';
import path from 'path';

export class FileScanner {
  constructor(options = {}) {
    this.rootDir = options.rootDir || process.cwd();
    this.excludePatterns = options.exclude || ['node_modules', '.git', 'dist', 'build'];
  }

  /**
   * Check if path should be excluded
   */
  isExcluded(filePath) {
    return this.excludePatterns.some((pattern) => filePath.includes(pattern));
  }

  /**
   * Recursively scan directory
   */
  scanDirectory(dirPath, fileExtensions = null) {
    const results = [];

    if (this.isExcluded(dirPath)) {
      return results;
    }

    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (this.isExcluded(fullPath)) {
          continue;
        }

        if (entry.isDirectory()) {
          results.push(...this.scanDirectory(fullPath, fileExtensions));
        } else if (entry.isFile()) {
          // Filter by extension if specified
          if (fileExtensions) {
            const ext = path.extname(entry.name);
            if (fileExtensions.includes(ext)) {
              results.push(fullPath);
            }
          } else {
            results.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning ${dirPath}: ${error.message}`);
    }

    return results;
  }

  /**
   * Scan all agents
   */
  scanAgents(agentPaths) {
    const agents = [];

    for (const agentPath of agentPaths) {
      const fullPath = path.join(this.rootDir, agentPath);
      if (fs.existsSync(fullPath)) {
        const entries = fs.readdirSync(fullPath, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory() && !entry.name.startsWith('.')) {
            agents.push({
              id: entry.name,
              path: path.join(fullPath, entry.name),
            });
          }
        }
      }
    }

    return agents;
  }

  /**
   * Scan all skills
   */
  scanSkills(skillPaths) {
    const skills = [];

    for (const skillPath of skillPaths) {
      const fullPath = path.join(this.rootDir, skillPath);
      const skillFiles = this.scanDirectory(fullPath, ['.js', '.cjs', '.mjs']);

      for (const file of skillFiles) {
        const relativePath = path.relative(this.rootDir, file);
        skills.push({
          path: relativePath,
          name: path.basename(file, path.extname(file)),
        });
      }
    }

    return skills;
  }

  /**
   * Scan workflow files
   */
  scanWorkflows(workflowPaths) {
    const workflows = [];

    for (const workflowPath of workflowPaths) {
      const fullPath = path.join(this.rootDir, workflowPath);
      if (fs.existsSync(fullPath)) {
        const yamlFiles = this.scanDirectory(fullPath, ['.yml', '.yaml']);
        for (const file of yamlFiles) {
          workflows.push({
            path: path.relative(this.rootDir, file),
            name: path.basename(file, path.extname(file)),
          });
        }
      }
    }

    return workflows;
  }

  /**
   * Get file content
   */
  getFileContent(filePath) {
    try {
      return fs.readFileSync(path.join(this.rootDir, filePath), 'utf-8');
    } catch (error) {
      throw new Error(`Cannot read file ${filePath}: ${error.message}`, { cause: error });
    }
  }
}

export default FileScanner;

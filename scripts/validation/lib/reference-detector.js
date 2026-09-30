/**
 * Reference Type Detection (T010)
 * Identifies and classifies references to agents/skills in:
 * - JavaScript imports (require, import, dynamic imports)
 * - Shell script paths (hardcoded paths in .sh files)
 * - GitHub workflow agent invocations (uses: agents/*)
 */

export class ReferenceDetector {
  constructor() {
    // Patterns for different reference types
    this.patterns = {
      jsImport: [
        /require\(['"]([^'"]+)['"]?\)/g,
        // Side-effect, default, named and namespace imports (#3460).
        // Anchored to the start of a line so prose is not matched.
        /^\s*import\s+(?:[\w$*{},\s]+?\s+from\s+)?['"]([^'"]+)['"]/gm,
        /import\(['"]([^'"]+)['"]\)/g,
      ],
      shellPath: [/agents\/[\w-]+/g, /scripts\/[\w-]+/g, /skills\/[\w-]+/g],
      workflowUses: /uses:\s*lightspeedwp\/[.]github\/[.]?agents\/[\w-]+@?/g,
      workflowRun: /run:\s*npm\s+run\s+[\w-:]+/g,
    };
  }

  /**
   * Detect JavaScript imports
   */
  detectJSImports(content) {
    const references = [];
    for (const pattern of this.patterns.jsImport) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const ref = match[1];
        if (ref && !ref.startsWith('.') && !ref.startsWith('@')) {
          references.push({
            type: 'js-import',
            value: ref,
            position: match.index,
          });
        }
      }
    }
    return references;
  }

  /**
   * Detect shell path references
   */
  detectShellPaths(content) {
    const references = [];
    for (const pattern of this.patterns.shellPath) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        references.push({
          type: 'shell-path',
          value: match[0],
          position: match.index,
        });
      }
    }
    return references;
  }

  /**
   * Detect workflow 'uses' references to agents
   */
  detectWorkflowUses(content) {
    const references = [];
    const pattern = this.patterns.workflowUses;
    let match;
    while ((match = pattern.exec(content)) !== null) {
      // Extract agent name from uses line
      const agentMatch = match[0].match(/agents\/([\w-]+)/);
      if (agentMatch) {
        references.push({
          type: 'workflow-uses',
          value: agentMatch[1],
          fullLine: match[0],
          position: match.index,
        });
      }
    }
    return references;
  }

  /**
   * Detect workflow 'run' commands that invoke agents/skills
   */
  detectWorkflowRuns(content) {
    const references = [];
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('run:') && line.includes('npm run')) {
        // Extract npm run command
        const match = line.match(/npm\s+run\s+([\w\-:]+)/);
        if (match) {
          references.push({
            type: 'workflow-run',
            value: match[1],
            line: i + 1,
            fullLine: line.trim(),
          });
        }
      }
    }
    return references;
  }

  /**
   * Detect all reference types in a file
   */
  detectAllReferences(content, fileType) {
    const references = {
      jsImports: [],
      shellPaths: [],
      workflowUses: [],
      workflowRuns: [],
    };

    if (fileType === 'js' || fileType === 'cjs' || fileType === 'mjs') {
      references.jsImports = this.detectJSImports(content);
    }

    if (fileType === 'sh') {
      references.shellPaths = this.detectShellPaths(content);
    }

    if (fileType === 'yml' || fileType === 'yaml') {
      references.workflowUses = this.detectWorkflowUses(content);
      references.workflowRuns = this.detectWorkflowRuns(content);
    }

    return references;
  }

  /**
   * Extract agent/skill names from references
   */
  extractTargets(references) {
    const targets = new Set();

    references.jsImports?.forEach((ref) => targets.add(ref.value));
    references.shellPaths?.forEach((ref) => {
      const name = ref.value.split('/')[1];
      if (name) targets.add(name);
    });
    references.workflowUses?.forEach((ref) => targets.add(ref.value));
    references.workflowRuns?.forEach((ref) => targets.add(ref.value));

    return Array.from(targets);
  }
}

export default ReferenceDetector;

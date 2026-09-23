/**
 * Organisation package conventions, derived from the repository root package.json
 * so the agent validators share one source of truth instead of hard-coded values.
 */

import fs from 'fs';
import path from 'path';

export function getOrgConventions(rootDir = process.cwd()) {
  try {
    const rootPkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
    const scopeMatch = /^(@[^/]+)\//.exec(rootPkg.name || '');
    return { scope: scopeMatch ? scopeMatch[1] : null, license: rootPkg.license || null };
  } catch {
    return { scope: null, license: null };
  }
}

export function expectedAgentPackageName(agentName, rootDir = process.cwd()) {
  const { scope } = getOrgConventions(rootDir);
  return scope ? `${scope}/${agentName}` : agentName;
}

export function listAgentNames(rootDir = process.cwd()) {
  const agentsDir = path.join(rootDir, 'agents');
  if (!fs.existsSync(agentsDir)) return new Set();
  return new Set(
    fs
      .readdirSync(agentsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
      .map((entry) => entry.name)
  );
}

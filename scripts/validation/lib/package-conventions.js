/**
 * Organisation package conventions, derived from the repository root package.json
 * so the agent validators share one source of truth instead of hard-coded values.
 */

import fs from 'fs';
import path from 'path';

/**
 * Directories under agents/ that are not agents.
 *
 * The audits now write to `.github/reports/agents/`, the canonical reports
 * location. Earlier runs wrote into `agents/reports`, and a checkout can still
 * carry that directory; without this the scan counts it as a non-conformant
 * agent with every component missing, which corrupts the conformance
 * percentage and adds a phantom entry to the remediation list.
 *
 * This lives here rather than in structure-checker.js because this module is
 * the shared source of agent conventions and imports nothing local, so both
 * the structure checker and the package validator can read it without a cycle.
 */
export const NON_AGENT_DIRS = new Set(['reports']);

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
      .filter(
        (entry) =>
          entry.isDirectory() && !entry.name.startsWith('.') && !NON_AGENT_DIRS.has(entry.name)
      )
      .map((entry) => entry.name)
  );
}

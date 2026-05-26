import fs from 'fs';
import path from 'path';

const root = process.argv[2] || '.';

const interestingNames = new Set(['theme.json', 'theme-utils.mjs', 'theme-utils-ollie.mjs']);
const interestingDirs = ['styles', 'parts', 'patterns', 'templates', 'assets', 'src'];
const tokenPatterns = [
  /var\(--wp--[a-z0-9-]+\)/g,
  /var\(--[a-z0-9-]+\)/g,
  /#[0-9a-fA-F]{3,8}\b/g,
  /"slug"\s*:\s*"([^"]+)"/g,
  /"color"\s*:\s*"([^"]+)"/g,
  /"size"\s*:\s*"([^"]+)"/g,
];

function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(root, full) || entry.name;
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.git')) continue;
      walk(full, results);
    } else {
      const isInterestingFile = interestingNames.has(entry.name)
        || rel.startsWith('styles' + path.sep)
        || /block\.json$/i.test(entry.name)
        || /\.json$/i.test(entry.name)
        || /\.(css|scss|php|mjs|js)$/i.test(entry.name);
      if (isInterestingFile) results.push(full);
    }
  }
  return results;
}

function summarizeFile(file) {
  let text = '';
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
  const matches = new Set();
  for (const pattern of tokenPatterns) {
    const found = text.match(pattern) || [];
    for (const item of found.slice(0, 20)) matches.add(item);
  }
  return {
    path: path.relative(root, file),
    type: path.extname(file) || path.basename(file),
    sample_matches: Array.from(matches).slice(0, 20),
  };
}

const files = walk(root)
  .filter((file) => {
    const rel = path.relative(root, file);
    return interestingNames.has(path.basename(file))
      || interestingDirs.some((dir) => rel === dir || rel.startsWith(dir + path.sep))
      || /block\.json$/i.test(file)
      || rel.endsWith('.css')
      || rel.endsWith('.scss');
  })
  .map(summarizeFile)
  .filter(Boolean);

console.log(JSON.stringify({ root: path.resolve(root), files }, null, 2));

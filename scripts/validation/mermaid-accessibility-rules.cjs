/**
 * Mermaid accessibility rules (#3492), shared by
 * validate-mermaid-accessibility.js and its tests so the tests exercise the
 * real checks rather than a copy.
 */
const {
  diagramKind,
  findMermaidBlocks,
  findTypeLineIndex,
} = require('../fix-mermaid-diagrams.cjs');

const DIAGRAM_TYPES = [
  'graph',
  'flowchart',
  'sequenceDiagram',
  'stateDiagram',
  'erDiagram',
  'gantt',
  'pie',
  'mindmap',
];

/**
 * The nearest non-blank Markdown line above a fence, when it can serve as a
 * text alternative: prose, not a heading, another fence or an HTML comment.
 * @returns {string|null}
 */
function textAlternativeAbove(lines, openIndex) {
  for (let i = openIndex - 1; i >= 0; i -= 1) {
    const line = lines[i].replace(/^\s*(>\s?)*/, '').trim();
    if (line === '') continue;
    if (/^#{1,6}\s/.test(line) || /^(```|~~~)/.test(line) || line.startsWith('<!--')) {
      return null;
    }
    return line;
  }
  return null;
}

/**
 * Every non-empty mermaid diagram in a document, as the parser sees it, with
 * the text alternative directly above its fence (or null).
 * @returns {{diagram: string, textAlternative: string|null}[]}
 */
function extractMermaidBlocks(content) {
  const lines = content.split(/\r?\n/);
  return findMermaidBlocks(content)
    .filter((block) => block.content.trim() !== '')
    .map((block) => ({
      diagram: block.content.trim(),
      textAlternative: textAlternativeAbove(lines, block.open),
    }));
}

/** CommonMark-aware: ignores ```mermaid in prose or inside other code blocks. */
function extractMermaidDiagrams(content) {
  return extractMermaidBlocks(content).map((block) => block.diagram);
}

function getDiagramType(content) {
  for (const line of content.split('\n')) {
    const trimmed = line.trim();

    if (
      trimmed === '' ||
      trimmed.startsWith('%%') ||
      trimmed === '---' ||
      trimmed.startsWith('accTitle') ||
      trimmed.startsWith('accDescr')
    ) {
      continue;
    }

    for (const type of DIAGRAM_TYPES) {
      if (new RegExp(`^${type}\\b`).test(trimmed)) {
        return type;
      }
    }

    if (/^stateDiagram-v2\b/.test(trimmed)) {
      return 'stateDiagram';
    }

    const match = trimmed.match(/^([\w-]+)/);
    return match ? match[1] : 'unknown';
  }

  return 'unknown';
}

/** Whether a diagram's type takes accTitle/accDescr ('acc'), rejects them ('no-acc') or is not a diagram. */
function accessibilityKind(content) {
  const lines = content.split('\n');
  const typeIndex = findTypeLineIndex(lines);
  return typeIndex === -1 ? 'unknown' : diagramKind(lines[typeIndex]);
}

/**
 * @param {string} content - diagram source between the fences
 * @param {{textAlternative?: string|null}} [context] - Markdown around the fence
 * @returns {string[]} issues; empty when the diagram is accessible
 */
function validateAccessibility(content, { textAlternative = null } = {}) {
  const issues = [];
  const lines = content.split('\n');

  // The first non-blank, non-comment line of a Mermaid block must be the
  // diagram type, not a YAML front-matter delimiter.
  const firstMeaningfulLine = lines.find((l) => l.trim() !== '' && !l.trim().startsWith('%%'));
  if (firstMeaningfulLine && firstMeaningfulLine.trim() === '---') {
    issues.push(
      "YAML front-matter (---) syntax is not supported by GitHub's Mermaid renderer. " +
        'Move accTitle and accDescr inline, after the diagram type declaration.'
    );
    return issues;
  }

  // accTitle/accDescr before the diagram type are invisible to screen readers.
  if (firstMeaningfulLine && /^\s*(accTitle|accDescr)\s*[:{\s]/.test(firstMeaningfulLine)) {
    issues.push(
      'accTitle/accDescr must appear after the diagram type declaration, not before it. ' +
        'Move the diagram type (e.g. `flowchart TD`) to the first line.'
    );
    return issues;
  }

  const kind = accessibilityKind(content);

  // mindmap, sankey-beta and block-beta reject accTitle/accDescr (verified
  // with a full mermaid 12 parse, #3492). They need a short text
  // alternative in the Markdown directly above the fence instead.
  if (kind === 'no-acc') {
    if (!textAlternative) {
      issues.push(
        'Missing text alternative — this diagram type rejects accTitle/accDescr, so add a ' +
          'short description in the Markdown directly above the fence'
      );
    }
    return issues;
  }

  // Typeless snippets are not diagrams.
  if (kind !== 'acc') {
    return issues;
  }

  // Only the colon form is valid: `accTitle "text"` is a parse error.
  if (!/^\s*accTitle\s*:/m.test(content)) {
    issues.push(
      'Missing accTitle — add it inline after the diagram type (e.g. `    accTitle: My title`)'
    );
  }

  // Supported forms: "accDescr: text" or block "accDescr { ... }".
  if (!/^\s*accDescr\s*:/m.test(content) && !/^\s*accDescr\s*\{/m.test(content)) {
    issues.push(
      'Missing accDescr — add it inline after the diagram type (e.g. `    accDescr: My description`)'
    );
  }

  // An accDescr block needs its closing brace.
  let inAccDescrBlock = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (/^accDescr\s*\{/.test(line)) inAccDescrBlock = true;
    if (inAccDescrBlock && line === '}') inAccDescrBlock = false;
  }
  if (inAccDescrBlock) {
    issues.push('Unclosed accDescr block — add a closing `}` on its own line');
  }

  return issues;
}

module.exports = {
  accessibilityKind,
  extractMermaidBlocks,
  extractMermaidDiagrams,
  getDiagramType,
  textAlternativeAbove,
  validateAccessibility,
};

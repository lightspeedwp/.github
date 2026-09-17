/**
 * Checkbox State Parser
 * Parses markdown checkboxes and extracts checklist item state and markers
 */

const MARKER_PATTERN = /\[(Gap|Ambiguity-Critical|Ambiguity):\s*([^\]]*)\]/;

/**
 * Parse checkbox state from markdown line
 * @param {string} line - Markdown line with checkbox
 * @returns {Object|null} Parsed item or null if not a checkbox line
 */
function parseCheckboxLine(line) {
  // Match: - [x] or - [ ] prefix
  const checkboxMatch = line.match(/^-\s+\[([ xX])\]\s+(.+)$/);
  if (!checkboxMatch) {
    return null;
  }

  const isChecked = checkboxMatch[1].toLowerCase() === 'x';
  const content = checkboxMatch[2].trim();

  // Parse item ID and question
  const idMatch = content.match(/^(CHK-\d{3}-[A-Za-z-]+):\s*(.*)$/);
  if (!idMatch) {
    return null;
  }

  const id = idMatch[1];
  let questionAndMarker = idMatch[2];

  // Extract marker if present
  let marker = null;
  let markerDetail = null;
  const markerMatch = questionAndMarker.match(MARKER_PATTERN);
  if (markerMatch) {
    marker = markerMatch[1];
    markerDetail = markerMatch[2].trim();
    // Remove marker from question text
    questionAndMarker = questionAndMarker.replace(MARKER_PATTERN, '').trim();
  }

  // Extract dimension from question (usually first part before colon in the full line)
  // Dimension is implicit in the item ID
  const dimensionFromId = extractDimensionFromId(id);

  return {
    id,
    question: questionAndMarker,
    dimension: dimensionFromId,
    state: determineState(isChecked, marker),
    marker: marker || null,
    markerDetail: markerDetail || null,
    isChecked,
    originalLine: line,
  };
}

/**
 * Determine item state from checkbox and marker
 * @param {boolean} isChecked - Whether checkbox is checked
 * @param {string|null} marker - Marker type if present
 * @returns {string} State value
 */
function determineState(isChecked, marker) {
  if (marker === 'Gap') {
    return 'gap';
  }
  if (marker === 'Ambiguity') {
    return 'ambiguity';
  }
  if (marker === 'Ambiguity-Critical') {
    return 'ambiguity-critical';
  }
  return isChecked ? 'checked' : 'unchecked';
}

/**
 * Extract dimension name from item ID
 * @param {string} id - Item ID (CHK-###-{Dimension})
 * @returns {string} Dimension name
 */
function extractDimensionFromId(id) {
  // Format: CHK-###-{Dimension}
  const parts = id.split('-');
  if (parts.length < 3) {
    return 'Unknown';
  }

  const dimensionPart = parts.slice(2).join('-');

  // Map dimension ID to proper name
  const dimensionMap = {
    completeness: 'Completeness',
    clarity: 'Clarity',
    consistency: 'Consistency',
    measurability: 'Measurability',
    'scenario-coverage': 'Scenario-Coverage',
    'edge-cases': 'Edge-Cases',
    dependencies: 'Dependencies',
    ambiguities: 'Ambiguities',
  };

  return dimensionMap[dimensionPart.toLowerCase()] || dimensionPart;
}

/**
 * Parse all checkboxes from markdown content
 * @param {string} markdown - Markdown content
 * @returns {Array} Array of parsed items
 */
function parseCheckboxes(markdown) {
  if (typeof markdown !== 'string') {
    return [];
  }

  const lines = markdown.split('\n');
  const items = [];

  lines.forEach((line) => {
    const parsed = parseCheckboxLine(line);
    if (parsed) {
      items.push(parsed);
    }
  });

  return items;
}

/**
 * Count checkbox states in markdown
 * @param {string} markdown - Markdown content
 * @returns {Object} Statistics
 */
function countCheckboxes(markdown) {
  const items = parseCheckboxes(markdown);

  const checked = items.filter((item) => item.isChecked).length;
  const unchecked = items.filter((item) => !item.isChecked).length;
  const gaps = items.filter((item) => item.marker === 'Gap').length;
  const ambiguities = items.filter((item) => item.marker === 'Ambiguity').length;
  const criticalAmbiguities = items.filter((item) => item.marker === 'Ambiguity-Critical').length;

  return {
    total: items.length,
    checked,
    unchecked,
    gaps,
    ambiguities,
    criticalAmbiguities,
    completionPercent: items.length > 0 ? Math.round((checked / items.length) * 100) : 0,
  };
}

/**
 * Find item by ID in markdown
 * @param {string} markdown - Markdown content
 * @param {string} itemId - Item ID to find (CHK-###-{Dimension})
 * @returns {Object|null} Parsed item or null if not found
 */
function findItemById(markdown, itemId) {
  const items = parseCheckboxes(markdown);
  return items.find((item) => item.id === itemId) || null;
}

/**
 * Format parsed item back to markdown checkbox
 * @param {Object} item - Parsed item
 * @returns {string} Markdown checkbox line
 */
function formatToMarkdown(item) {
  const checkbox = item.isChecked || item.state === 'checked' ? '[x]' : '[ ]';
  let line = `- ${checkbox} ${item.id}: ${item.question}`;

  if (item.marker && item.markerDetail) {
    line += ` [${item.marker}: ${item.markerDetail}]`;
  }

  return line;
}

module.exports = {
  parseCheckboxLine,
  parseCheckboxes,
  countCheckboxes,
  findItemById,
  formatToMarkdown,
  determineState,
  extractDimensionFromId,
  MARKER_PATTERN,
};

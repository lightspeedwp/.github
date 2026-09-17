/**
 * Audience-Specific Guidance Renderer
 * Loads and renders guidance for different audiences
 */

const fs = require('fs');
const path = require('path');

const { validateAudience, getAudienceContext } = require('./audience-detector');

const GUIDANCE_DIR = path.join(__dirname, '..', 'content');
const guidanceCache = {};

/**
 * Load audience guidance from file
 * @param {string} audience - Audience identifier
 * @returns {Object} Guidance content
 */
function loadAudienceGuidance(audience) {
  if (!validateAudience(audience)) {
    throw new Error(`Invalid audience: ${audience}`);
  }

  // Return cached if available
  if (guidanceCache[audience]) {
    return guidanceCache[audience];
  }

  const filePath = path.join(GUIDANCE_DIR, `audience-${audience}.md`);

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const guidance = {
      audience,
      content,
      filePath,
      loadedAt: new Date(),
    };

    guidanceCache[audience] = guidance;
    return guidance;
  } catch (error) {
    throw new Error(`Failed to load guidance for audience '${audience}': ${error.message}`, {
      cause: error,
    });
  }
}

/**
 * Get guidance text for audience
 * @param {string} audience - Audience identifier
 * @returns {string} Guidance content
 */
function getGuidanceForAudience(audience) {
  const guidance = loadAudienceGuidance(audience);
  return guidance.content;
}

/**
 * Render guidance with context
 * @param {string} audience - Audience identifier
 * @returns {Object} Rendered guidance
 */
function renderGuidance(audience) {
  if (!validateAudience(audience)) {
    throw new Error(`Invalid audience: ${audience}`);
  }

  const context = getAudienceContext(audience);
  const guidance = loadAudienceGuidance(audience);

  return {
    audience,
    title: context.name,
    timeEstimate: context.timeAlloted,
    role: context.role,
    focus: context.focus,
    sections: parseSections(guidance.content),
    fullContent: guidance.content,
  };
}

/**
 * Parse markdown sections from guidance content
 * @param {string} content - Markdown content
 * @returns {Array} Parsed sections
 */
function parseSections(content) {
  const sections = [];
  const lines = content.split('\n');

  let currentSection = null;
  let currentContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect section headers (##)
    if (line.startsWith('## ')) {
      // Save previous section
      if (currentSection) {
        sections.push({
          type: classifySection(currentSection),
          title: currentSection,
          content: currentContent.join('\n').trim(),
        });
      }

      currentSection = line.substring(3).trim();
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentSection) {
    sections.push({
      type: classifySection(currentSection),
      title: currentSection,
      content: currentContent.join('\n').trim(),
    });
  }

  return sections;
}

/**
 * Classify section type based on title
 * @param {string} title - Section title
 * @returns {string} Section type
 */
function classifySection(title) {
  const lower = title.toLowerCase();

  if (lower.includes('introduction') || lower.includes('welcome')) {
    return 'introduction';
  }
  if (lower.includes('how to') || lower.includes('step')) {
    return 'instructions';
  }
  if (lower.includes('tip') || lower.includes('best practice')) {
    return 'tips';
  }
  if (lower.includes('example')) {
    return 'examples';
  }
  if (lower.includes('summary') || lower.includes('decision')) {
    return 'summary';
  }
  if (lower.includes('focus')) {
    return 'focus';
  }
  if (lower.includes('workflow') || lower.includes('process')) {
    return 'workflow';
  }
  if (lower.includes('question') || lower.includes('checklist')) {
    return 'questions';
  }

  return 'content';
}

/**
 * Format guidance section for display
 * @param {Object} section - Section object
 * @returns {string} Formatted section
 */
function formatGuidanceSection(section) {
  let output = `## ${section.title}\n\n`;

  if (section.type === 'introduction') {
    output += section.content;
  } else if (section.type === 'instructions') {
    // Try to parse steps
    const lines = section.content.split('\n');
    let stepNum = 1;
    lines.forEach((line) => {
      if (line.trim()) {
        output += `${stepNum}. ${line.trim()}\n`;
        if (!line.trim().includes('.')) {
          stepNum++;
        }
      }
    });
  } else if (section.type === 'tips') {
    const lines = section.content.split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        output += `- ${line.trim()}\n`;
      }
    });
  } else if (section.type === 'examples') {
    output += section.content;
  } else {
    output += section.content;
  }

  return output;
}

/**
 * Clear guidance cache
 */
function clearCache() {
  for (const key in guidanceCache) {
    delete guidanceCache[key];
  }
}

module.exports = {
  loadAudienceGuidance,
  getGuidanceForAudience,
  renderGuidance,
  formatGuidanceSection,
  parseSections,
  classifySection,
  clearCache,
};

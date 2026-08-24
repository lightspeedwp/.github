/**
 * Skill: orchestrate-pr-creation
 * Orchestrates PR creation by accepting PR data and validating it
 *
 * @param {Object} input - Input object
 * @param {Object} input.pr - PR data (title, body, head, base, labels)
 * @param {Object} input.aiFeedback - AI feedback array (optional)
 * @param {boolean} input.triggerWorkflow - Whether to trigger workflow (optional)
 * @param {boolean} input.createFeedbackResponse - Whether to create feedback response (optional)
 * @param {boolean} input.parseFrontmatter - Whether to parse frontmatter (optional)
 * @returns {Object} Result with success flag and PR data
 */

export async function orchestratePrCreation(input = {}) {
  const {
    pr = {},
    aiFeedback = [],
    triggerWorkflow = false,
    createFeedbackResponse = false,
    parseFrontmatter = false,
  } = input;

  // Validate required PR fields
  if (!pr || typeof pr !== "object") {
    return {
      success: false,
      error: "PR data is required and must be an object",
    };
  }

  const { owner, repo, title, body, head, base, labels = [] } = pr;

  // Validate required fields
  if (!owner || !repo || !title || !body || !head || !base) {
    return {
      success: false,
      error:
        "PR data missing required fields (owner, repo, title, body, head, base)",
    };
  }

  try {
    // Build PR object
    const prObject = {
      owner,
      repo,
      title,
      body,
      head,
      base,
      labels,
    };

    // Parse frontmatter if requested
    let frontmatter = null;
    if (parseFrontmatter) {
      frontmatter = parseFrontmatterFromBody(body);
    }

    // Handle AI feedback if provided
    let feedbackResponse = null;
    if (createFeedbackResponse && aiFeedback && aiFeedback.length > 0) {
      feedbackResponse = {
        created: true,
        feedbackCount: aiFeedback.length,
      };
    }

    // Return success with metadata
    return {
      success: true,
      pr: prObject,
      frontmatter,
      feedbackResponseCreated:
        createFeedbackResponse && feedbackResponse ? true : false,
      workflowRequested: triggerWorkflow,
    };
  } catch (error) {
    return {
      success: false,
      error: `Error orchestrating PR creation: ${error.message}`,
    };
  }
}

function parseFrontmatterFromBody(body) {
  const lines = body.split("\n");
  const frontmatter = {};

  let inFrontmatter = false;
  let i = 0;

  for (; i < lines.length; i++) {
    const line = lines[i];

    if (i === 0 && line.trim() === "---") {
      inFrontmatter = true;
      continue;
    }

    if (inFrontmatter && line.trim() === "---") {
      break;
    }

    if (inFrontmatter) {
      const match = line.match(/^([^:]+):\s*(.+)$/);
      if (match) {
        frontmatter[match[1].trim()] = match[2].trim();
      }
    }
  }

  return Object.keys(frontmatter).length > 0 ? frontmatter : null;
}

export default orchestratePrCreation;
